import { RedisService, ResponseManager } from '../services';
import { routeDecorator } from '../decorators/route-decorator';
import express from 'express';

const route = express.Router();

route.get('/coordonnes', (req, res) => {
    const { directions } = req.query;
    ResponseManager.send(RedisService.coordonnees(directions), res);
});

export class AgenceRoute {
    @routeDecorator(route)
    static router: any;

    constructor() { }
}
