import path from "path";
import dotenv from "dotenv";

// Identification de l'environnement
const stage = process.env.NODE_ENV || "development";
// Sélection du fichier d'environnement
const filePath = path.resolve(
    process.cwd(),
    stage == "development" ? ".env" : ".env.production"
);

const result = dotenv.config({ path: filePath });
if (result.error) {
    throw result.error;
}

export const CONFIG = { NODE_ENV: stage, ...result.parsed as any, PATH_ENV: filePath };