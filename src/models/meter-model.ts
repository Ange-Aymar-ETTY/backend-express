import { DataTypes } from "sequelize";
import { MySQLDB } from "../databases";
const sequelize = MySQLDB.getConnexion();

export interface IMeter {
    id?: number;
    ref_branch: string;
    num_compteur: string;
    typtarif: string;
    matricule: string;
    Latitude: string;
    Longitude: string;
    GF: string;
    mode: string;
    lieu: string;
    exp: string;
    nom_client: string;
    prenom_client: string;
    ctr_ajout: string;
    psabon: string;
    id_abon: string;
    type_ctr: string;
    zone: string;
    tournee: string;
}

export const Meter = sequelize.define("postpaid_prepaied",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ref_branch: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        num_compteur: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        typtarif: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        matricule: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Latitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Longitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        GF: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lieu: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        exp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nom_client: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prenom_client: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ctr_ajout: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        psabon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_abon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type_ctr: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        zone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tournee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "postpaid_prepaied",
    }
);