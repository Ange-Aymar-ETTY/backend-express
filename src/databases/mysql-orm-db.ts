import { CONFIG } from "../config";
import { Sequelize } from "sequelize";
import Logger from "../helpers/winston";

const connexion = new Sequelize(
  CONFIG.DB_DATABASE,
  CONFIG.DB_USERNAME,
  CONFIG.DB_PASSWORD,
  {
    host: CONFIG.DB_HOST,
    port: CONFIG.DB_PORT,
    dialect: CONFIG.DB_DIALECT,
    logging: false, //Disable SQL Query Logging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

connexion.authenticate()
  // .then(() => Logger.info("Connection data established successfully."))
  .catch((err) => Logger.error("Unable to connect to the database:", err));

export class MySQLDB{
  private static database = connexion;

  constructor() { }

  static getConnexion() {
    return this.database;
  }
}
