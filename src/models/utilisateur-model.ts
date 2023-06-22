import { DataTypes } from "sequelize";
import { MySQLDB } from "../databases";
const sequelize = MySQLDB.getConnexion();

export interface IUser {
  id?: number;
  key?: string;
  nom_prenoms: string;
  email: string;
  password?: any;
  directions: any;
  first_connexion?: number;
  created_at?: string;
  updated_at?: string;
}

export const User = sequelize.define("users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nom_prenoms: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    directions: {
      type: DataTypes.STRING,
      allowNull: false
    },

    first_connexion: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: "users",
  }
);