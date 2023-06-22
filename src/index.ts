import { createServer } from 'http';
import { CONFIG } from './config';
import { MongoDB } from './databases';
import { setRoutes } from './decorators/route-decorator';
import { Server } from "socket.io";
import { auth, morganMiddleware } from './middlewares';
import { SocketService } from './services';
import express from 'express';
import helmet from 'helmet';
import Logger from './helpers/winston';
import './routes';

import compression from 'compression';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import moment from "moment";
moment.locale('fr');

const app = express();
const server = createServer(app);

// ---------Middlewares------------
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allows calls from all origins
app.use(helmet());
app.use(compression());
app.use(morganMiddleware);
app.use(fileUpload({ createParentPath: true })); // acces to files upload
app.use(express.static(__dirname + '/data'));
app.use(auth); // authentication with token jwt

MongoDB.startConnexion();
setRoutes(app);

// ---------Socket-----------
const io = new Server(3000);
SocketService.bind(io);

app.get('/', (req, res) => res.status(200).send('Welcome to home Page...'));

server.listen(CONFIG.APP_PORT, () => Logger.info(`Server is up and running at ${CONFIG.APP_PORT}`));