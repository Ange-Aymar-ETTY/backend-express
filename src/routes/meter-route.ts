import { MeterService, RedisService, ResponseManager } from '../services';
import { routeDecorator } from '../decorators/route-decorator';
import { fnBodyDecrypt } from '../middlewares';
import express from 'express';
import { DataTable } from '../helpers/interfaces';

const route = express.Router();

route.post('/search', [fnBodyDecrypt], (req, res) => {
    const { directions } = req.query;
    ResponseManager.send(MeterService.searchMeter(req.body, directions), res);
});

route.post('/meter/code/list', [fnBodyDecrypt], (req, res) => {
    ResponseManager.send(MeterService.searchMeter(req.body), res);
});

route.get('/dr/list', (req, res) => {
    const { directions } = req.query;
    ResponseManager.send(RedisService.listDrs(directions), res);
});

route.get('/exploitation/list', (req, res) => {
    const { directions } = req.query;
    ResponseManager.send(RedisService.listExploitations(directions), res);
});

route.get('/tournee/list', (req, res) => {
    const { directions } = req.query;
    ResponseManager.send(MeterService.listTournees(directions), res);
});

route.get('/zone/list', (req, res) => {
    const { directions } = req.query;
    ResponseManager.send(MeterService.listZones(directions), res);
});

route.post('/upload', fnBodyDecrypt, (req, res) => {
    const request = {
        dataFile: req.body,
        dr: req.query['directions'],
        userKey: req.query['key'],
        nom_prenoms: req.query['nom_prenoms']
    };

    ResponseManager.send(MeterService.upload(request), res);
});

route.post('/update-demande', (req, res) => {
    const data = req.body;
    ResponseManager.send(MeterService.updateDemade(data), res);
});

route.post('/list/demandes', fnBodyDecrypt, (req, res) => {
    const { key } = req.query;
    const data = req.body as DataTable;

    ResponseManager.send(MeterService.listDemandes(data, key), res);
});

route.get('/demande/data', (req, res) => {
    const { _id } = req.query;
    ResponseManager.send(MeterService.getOneDemande(_id), res);
});

route.get('/list/agents', (req, res) => {
    const { dr, email } = req.query;
    ResponseManager.send(MeterService.getAgents({ dr, matricule: email }), res);
});

route.post('/update/agents', fnBodyDecrypt, (req, res) => {
    const data = req.body;
    ResponseManager.send(MeterService.addAgentAcess(data), res);
});

route.post('/list/mobile/demandesId', (req, res) => {
    const matricule = req.body.matricule;
    ResponseManager.send(MeterService.getIdForFinding(matricule), res);
});

route.post('/list/mobile/demandeData', (req, res) => {
    const id = req.body.id;
    const matricule = req.body.matricule;
    ResponseManager.send(MeterService.getDataById(id, matricule), res);
});

route.post('/points_into', fnBodyDecrypt, (req, res) => {
    const body = {
        geoJson: req.body,
        key: req.query['key'],
        dr: req.query['directions'],
    };

    ResponseManager.send(MeterService.pointsInto(body), res);
})

// route.post('/sendmessage', [fnBodyDecrypt], (req, res) => {
//     ResponseManager.send(MeterService.sendMessage(req.body), res);
// });

export class MeterRoute {
    @routeDecorator(route)
    static router: any;

    constructor() { }
}
