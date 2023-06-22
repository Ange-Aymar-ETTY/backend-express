import { CONFIG } from '../config';
import { format, addColors, createLogger, transports } from 'winston';

const { combine, printf, timestamp, colorize } = format;

const message = printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`);

// Define your severity levels. 
// With them, You can create log files, 
// see or hide levels based on the running ENV.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// This method set the current severity based on 
// the current NODE_ENV: show all the log levels 
// if the server was run in development mode; otherwise, 
// if it was run in production, show only warn and error messages.
const level = () => {
    const env = CONFIG.NODE_ENV || 'development'
    return (env === 'development') ? 'debug' : 'debug'
};

// Define different colors for each level. 
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Tell winston that you want to link the colors 
// defined above to the severity levels.
addColors(colors);

// Define which transports the logger must use to print out messages. 
// In this example, we are using three different transports 
const Transports = [
    // new transports.File({ filename: './logs/error.log', level: 'error' }),
    // new transports.File({ filename: './logs/all.log' }),
    new transports.Console()
];

// Create the logger instance that has to be exported 
// and used to log messages.
const Logger = createLogger({
    level: level(),
    levels: levels,
    format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }), message, colorize({ all: true })),
    transports: Transports,
});

export default Logger;