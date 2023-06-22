import { CONFIG } from '../config';
import morgan, { StreamOptions } from "morgan";
import Logger from "../helpers/winston";

const stream: StreamOptions = {
    write: (message) => Logger.http(message),
};

const skip = () => {
    const env = CONFIG.NODE_ENV || "development";
    return env !== "development";
};

// Build the morgan middleware
export const morganMiddleware = morgan(
    ":remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms",
    {
        stream,
        skip
    }
);
