import { PolygoneService } from '../services/polygone-service';
import { routeDecorator } from "../decorators/route-decorator";
import { ResponseManager } from "../services";
import { fnBodyDecrypt } from '../middlewares';
import express from 'express';

const route = express.Router();

route.post('/polygone', [fnBodyDecrypt], (req, res) => {
    const { data } = req.body;
    ResponseManager.send(PolygoneService.listByName(data), res);
});


export class PolygoneRoute {
    @routeDecorator(route)
    static router: any;

    constructor() { }
}
