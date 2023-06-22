import moment from 'moment';
import { Op } from 'sequelize';
import { CONFIG } from '../config';
import { execPython } from '../helpers';
import { DataTable } from '../helpers/interfaces';
import { Demande, Meter } from '../models';
import { AxiosService } from './axios-service';
import { sendIncomingMessage } from './rabbitmq-service';
import { SocketService } from './socket-service';
import fs from 'fs';
import path from 'path';

export class MeterService {

    constructor() { /* TODO document why this constructor is empty */  }

    static searchMeter(data: { column: string, value: string }, directions?: any) {
        let query: any = {
            attributes: ['id', 'Latitude', 'Longitude', 'id_abon', 'mode', 'num_compteur', 'psabon', 'ref_branch'],
            where: {}
        };

        if (!directions) {
            query.where[data.column] = data.value;
        } else {
            query.where[Op.and] = [
                {
                    [data.column]: data.value
                },
                {
                    dr: directions
                }
            ];
        }
        return Meter.findAll(query);
    }

    static listTournees(directions?: any) {
        let query: any = {
            attributes: [
                ['tournee', 'code'],
                ['exp', 'exploitation'],
                'zone'
            ],
            group: 'tournee',
            order: [
                ['tournee', 'ASC']
            ]
        };

        if (directions) {
            query['where'] = { dr: directions };
        }

        return Meter.findAll(query);
    }

    static listZones(directions?: any) {
        let query: any = {
            attributes: [
                ['zone', 'code'],
                ['exp', 'exploitation']
            ],
            group: 'zone',
            order: [
                ['zone', 'ASC']
            ]
        };

        if (directions) {
            query['where'] = { dr: directions };
        }

        return Meter.findAll(query);
    }

    static listDemandes(data: DataTable, key) {
        return new Promise((resolve, reject) => {
            let match: any = {};
            const fields = ['createdAt'];

            if (key) {
                match['userKey'] = key;
            }

            if (data.dataFilter) {
                if (data.dataFilter.search) {
                    const search = '.*' + data.dataFilter.search + '.*';
                    let filedsRegex: any = [];
                    for (const field of fields) {
                        filedsRegex.push({ [field]: { $regex: search, $options: 'i' } });
                    }
                    match['$or'] = filedsRegex;
                }
            }

            Demande.aggregate(
                [
                    { $match: match },
                    { $sort: { [data.sort]: (data.order == 'asc') ? 1 : -1 } },
                ],
                (err, docs: any[]) => {
                    if (err) {
                        reject({ data: " " });
                    } else {
                        const count = docs.length;
                        //skip must be handled
                        const start = data.size * data.page;
                        const end = start + data.size;

                        let value = docs.slice(start, end);
                        value = value.map((x: any) => {
                            return {
                                id: x._id,
                                createdAt: x.createdAt,
                                statut: x.statut,
                                statutLibelle: (x.statut == 1) ? 'Terminé' : 'En cours de traitement'
                            };
                        });

                        resolve({ items: value, total_count: count });
                    }
                }
            );
        });
    }

    static upload({ dataFile, dr, userKey, nom_prenoms }) {
        // return new Promise((resolve, reject) => {
        // const ask = { userKey: request.userKey };

        return new Demande({ userKey, nom_prenoms })
            .save()
            .then(savedDoc => {
                return sendIncomingMessage(
                    'incoming_file_messages',
                    {
                        data: dataFile,
                        dr: dr,
                        userKey: userKey,
                        _id: savedDoc._id
                    }
                )
                // .then(() => {
                //     resolve(true);
                // }).catch(() => {
                //     reject(false);
                // });
            });
        // .catch(e => reject(false))
        // });
    }

    static updateDemade(request: { _id: string, data: string, userKey: string }) {
        return new Promise((resolve, reject) => {
            const update = { data: JSON.parse(request.data), statut: 1 };
            Demande.findByIdAndUpdate(request._id, update, { new: true }, (err, doc) => {
                if (err) {
                    reject({ error: true });
                } else {
                    if (SocketService.checkRoomExists(request.userKey)) {
                        SocketService.emitTo(
                            request.userKey,
                            'notification',
                            {
                                message: `Le fichier à date du ${moment(doc?.createdAt).format('llll')} a été traité`
                            }
                        );
                    }
                    resolve({ error: false });
                }
            });
        });
    }

    static getOneDemande(_id) {
        return new Promise((resolve, reject) => {
            Demande.findOne({ _id }, (err, doc) => {
                if (err) {
                    reject({ data: " " });
                } else {
                    resolve(doc);
                }
            });
        });
    }

    static getAgents(data) {
        return new Promise((resole, reject) => {
            const _axios = new AxiosService();
            _axios.post(`/EF/list/agent/byDr`, data).then((d: any) => {
                if (!d.error) {
                    resole(d.data);
                } else {
                    reject({ message: "Erreur lors du chargement des agents" });
                }
            });
        });
    }

    static addAgentAcess({ id, matricule }) {

        return new Promise((resolve, reject) => {
            Demande.findByIdAndUpdate(id, { agents: matricule }, { new: true }, (err, doc) => {
                if (err) {
                    reject({ message: "Echec lors de l'attribution des données" });
                } else {
                    resolve(doc);
                }
            })
        });
    }

    static getIdForFinding(matricule) {
        return new Promise((resolve, reject) => {
            Demande.find({ agents: matricule }, (err, docs) => {
                if (err) {
                    reject({ message: "Une erreur technique est survenue" });
                } else {
                    if (docs.length == 0) {
                        reject({ message: "Aucune donnée trouvée pour ce matricule" });
                    } else {
                        const data = docs.map((x) => {
                            return {
                                createur: x.nom_prenoms,
                                date_creation: x.createdAt,
                                id: x._id
                            }
                        })
                        resolve(data);
                    }
                }
            })
        });
    }

    static getDataById(id, matricule) {
        return new Promise((resolve, reject) => {
            Demande.findOne({ id, agents: matricule }, (err, doc) => {
                if (err) {
                    reject({ message: "Une erreur technique est survenue" });
                } else {
                    if (!doc) {
                        reject({ message: "Aucune donnée trouvée pour ce id" });
                    } else {

                        resolve(doc.data);
                    }
                }
            })
        })
    }

    static pointsInto(body: { geoJson, key, dr }) {
        return new Promise((resolve, reject) => {
            const geoJson = JSON.stringify(body.geoJson);

            // Create temporary folder
            const pathTemp = path.resolve(__dirname, '..', 'data/temp');
            fs.existsSync(pathTemp) || fs.mkdirSync(pathTemp, { recursive: true });
            // Create temp file
            const fileTemp = path.join(pathTemp, `${body.key}_${Date.now()}.json`);
            fs.writeFileSync(fileTemp, geoJson, { encoding: 'utf-8' });

            const msg = JSON.stringify({
                envFile: CONFIG.PATH_ENV,
                geoJson: fileTemp,
                dr: body.dr
            });

            execPython('points_into.py', [msg]).then((result: any) => {
                const { output } = result.data;
                resolve(JSON.parse(output));
            }).catch((e) => {
                console.log('Error on script', e);
                reject(e)
            }).finally(() => {
                fs.unlink(fileTemp, (err) => {
                    if (err) {
                        console.error(err)
                    }
                });
            });
        });
    }
}