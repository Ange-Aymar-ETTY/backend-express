import { Polygones } from "../models";

export class PolygoneService {
    constructor() { }

    static listByName(ListName: any) {
        return new Promise((resolve, reject) => {
            Polygones.find({ name: { $in: ListName } }, (err, docs) => {
                if (err) {
                    reject({ error: true, message: 'Une erreur technique.' });
                } else {
                    if (!docs) {
                        reject({ error: true, message: 'Aucun polygone trouvé.' });
                    } else {
                        resolve(docs);
                    }
                }
            })
        });
    }

}