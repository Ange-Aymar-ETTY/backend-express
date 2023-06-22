import { UserService } from '../services/user-service';
import { ResponseManager } from '../services';
import { routeDecorator } from '../decorators/route-decorator';
import { fnBodyDecrypt, SchemaValidator } from '../middlewares';
import { IUser } from '../models';
import express from 'express';

const route = express.Router();
const validateRequest = SchemaValidator(true);

route.get('/user/list', (req, res) => ResponseManager.send(UserService.list(), res));

route.post('/api/auth', [fnBodyDecrypt], (req, res) => ResponseManager.send(UserService.auth(req.body), res));

route.post('/user/create', [fnBodyDecrypt], (req, res) => ResponseManager.send(UserService.create(req.body), res));

route.post('/user/update', [fnBodyDecrypt], (req, res) => {
    const user: IUser = req.body;
    const fieldsUpdated = {
        nom_prenoms: user.nom_prenoms,
        email: user.email,
        directions: user.directions,
    };
    ResponseManager.send(UserService.update(fieldsUpdated, { id: user.id }), res);
});

route.post('/user/delete', [fnBodyDecrypt], (req, res) => {
    ResponseManager.send(UserService.delete(req.body.id), res);
});

route.post('/user/change-password', [fnBodyDecrypt], (req, res) => {
    ResponseManager.send(UserService.changePassword(req.body), res);
});

export class UsersRoute {
    @routeDecorator(route)
    static router: any;

    constructor() { }
}
