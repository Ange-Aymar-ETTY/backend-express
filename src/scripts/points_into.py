import sys
from shapely.geometry import Point, Polygon, shape
from sqlalchemy import create_engine
from haversine import Unit, haversine
from dotenv import load_dotenv
import os
import json
import geopandas as gpd
import pandas as pd

# Polygon
def pointsInPolygon(geodf: gpd.GeoDataFrame, geoJson):
    polygon: Polygon = shape(geoJson["geometry"])
    sindex = geodf.sindex
    possible_matches_index = list(sindex.intersection(polygon.bounds))
    possible_matches = geodf.iloc[possible_matches_index]
    precise_matches = possible_matches[possible_matches.intersects(polygon)]

    return precise_matches


# Circle
def pointsInCircle(geodf: gpd.GeoDataFrame, geoJson):
    center = (geoJson["geometry"]["coordinates"][0], geoJson["geometry"]["coordinates"][1])
    geodf['distance'] = geodf.apply(lambda row: haversine((row['Longitude'], row['Latitude']), center, unit=Unit.METERS), axis=1)
    match = geodf[geodf['distance'] <= int(geoJson["properties"]["radius"])]
    
    return match
        

# python points_into.py "{\"envFile\":\"D:\\\\Projects\\\\Eazy Map Projects\\\\api-backend-georef\\\\.env\",\"geoJson\":\"D:\\\\Projects\\\\Eazy Map Projects\\\\api-backend-georef\\\\src\\\\data\\\\temp\\\\file_text_1670837360582.json\",\"dr\":[\"DRAN\"]}"
if __name__ == "__main__":
    argv = json.loads(sys.argv[1])

    # Get arguments
    dr = argv["dr"]
    f = open(argv["geoJson"], "r")
    geoJson = json.loads(f.read())  

    # Load env file
    load_dotenv(argv["envFile"])
    DB_HOST     = os.getenv("DB_HOST")
    DB_PORT     = os.getenv("DB_PORT")
    DB_DATABASE = os.getenv("DB_DATABASE")
    DB_USERNAME = os.getenv("DB_USERNAME")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    # Get data in db
    engine = create_engine(f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}")
    with engine.connect() as conn:
        sql = '''SELECT id, Latitude, Longitude, id_abon, mode, num_compteur, psabon, ref_branch FROM postpaid_prepaied'''
        
        params = {}
        if dr is not None:
            sql = sql + " WHERE dr in %(dr)s"
            params["dr"] = dr

        df = pd.read_sql(sql, conn, params = params)
        df["Longitude"] = df["Longitude"].astype(float)
        df["Latitude"] = df["Latitude"].astype(float)
        
        # Transform df to GeoDataFrame
        gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df['Longitude'], df['Latitude']))

        pointsList = []
        for item in geoJson:
            if (item["geometry"]['type'] == "Polygon"):
                points = pointsInPolygon(gdf, item)
            
            elif (item["geometry"]['type'] == "Point"):
                points = pointsInCircle(gdf, item)
            
            pointsList.append(pd.DataFrame(points.drop(columns=['geometry', 'distance'])))
        dfFinal = pd.concat(pointsList).drop_duplicates().reset_index(drop=True)
        
        # Result
        print(json.dumps({"output": dfFinal.to_json(orient='records')}))