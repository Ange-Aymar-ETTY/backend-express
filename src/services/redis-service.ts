import { RedisDB } from "../databases/redis-client";
import { KEYS_REDIS } from "../helpers";
import { DR, Exploitation, IDR, IExploitation, IRefCoor, RefCoordonnees } from "../models";

export class RedisService {
    constructor() { }

    static coordonnees(dr?: any) {
        return new Promise((resolve) => {
            RedisDB
                .getData(KEYS_REDIS.KEY_AGENCE, () => RefCoordonnees.findAll())
                .then(
                    (agences: Array<IRefCoor>) => {
                        if (dr) {
                            const filtered = agences.filter(o => dr.indexOf(o.libelle_dr) > -1);
                            resolve(filtered);
                        } else {
                            resolve(agences);
                        }
                    }
                );
        });
    }

    static listExploitations(dr?: any) {
        return new Promise((resolve) => {
            RedisDB
                .getData(KEYS_REDIS.KEY_EXPLOITATION, () => Exploitation.findAll())
                .then(
                    (exploitations: Array<IExploitation>) => {
                        if (dr) {
                            const filtered = exploitations.filter(o => dr.includes(o.libelle_dr));
                            resolve(filtered);
                        } else {
                            resolve(exploitations);
                        }
                    }
                )
        })
    }

    static listDrs(dr?) {
        return new Promise((resolve) => {
            RedisDB
                .getData(KEYS_REDIS.KEY_DR, () => DR.findAll())
                .then(
                    (directions: Array<IDR>) => {
                        if (dr) {
                            const filterd = directions.filter(o => dr.includes(o.libelle));
                            resolve(filterd);
                        } else {
                            resolve(directions);
                        }
                    }
                );
        })
    }

}