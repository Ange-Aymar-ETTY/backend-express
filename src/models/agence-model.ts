import { INTEGER, STRING } from "sequelize";
import { MySQLDB } from "../databases";
const sequelize = MySQLDB.getConnexion();

export interface IRefCoor {
    id?: number;
    libelle: string;
    latitude: string;
    longitude: string;
    type: string;
    libelle_dr: string;
    code_dr: string;
    libelle_exp: string;
    code_exp: string;
}

export const RefCoordonnees = sequelize.define("coordonnees_cie",
    {
        id: { 
            type: INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        libelle: STRING,
        latitude: STRING,
        longitude: STRING,
        type: STRING,
        libelle_dr: STRING,
        code_dr: STRING,
        libelle_exp: STRING,
        code_exp: STRING,
    },
    {
        timestamps: false,
        tableName: "coordonnees_cie",
    }
);