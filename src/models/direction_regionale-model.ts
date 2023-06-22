import { DataTypes } from "sequelize";
import { MySQLDB } from "../databases";
const sequelize = MySQLDB.getConnexion();

export interface IDR {
    id?: number;
    code: string;
    libelle: string;
}

export const DR = sequelize.define("direction_regionale",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        timestamps: false,
        tableName: "direction_regionale",
    }
);