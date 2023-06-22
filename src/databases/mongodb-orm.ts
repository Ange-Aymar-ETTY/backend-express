import mongoose from "mongoose";
import Logger from "../helpers/winston";

let db: any;

export class MongoDB {

  static startConnexion() {
    mongoose.connect("URL MONGO");
    db = mongoose.connection;

    db.on("error", () => {
      console.error.bind(console, "connection error: ");
    });

    // db.once("open", () => {
    //   Logger.info("Connection db polygone has been established successfully");
    // });

    process.on("SIGINT", () => {
      if (db) {
        db.close();
      }
      process.exit();
    });

    process.on("exit", () => {
      if (db) {
        process.exit();
      }
    });
  }
}
