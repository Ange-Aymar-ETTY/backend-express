import { createClient } from "redis";
import { CONFIG } from "../config";
import Logger from "../helpers/winston";

const client = createClient({ port: CONFIG.REDIS_PORT });

client.on('error', (e) => Logger.error("Unable to connect to the redis database :", e));
export class RedisDB {
    static findKey(cle: string) {
        return new Promise((resolve, reject) => {
            client.keys(cle, (err: any, result: string[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            });
        });
    }

    static pushData(cle: string, data: any) {
        return new Promise((resolve, reject) => {
            client.set(cle, JSON.stringify(data), (error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static getData(cle: string, getData: () => Promise<any>): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const isFound = await this.findKey(cle);

            if (isFound) {
                client.get(cle, (err: any, data: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(JSON.parse(data))
                    }
                });
            } else {
                getData()
                    .then(res => {
                        this.pushData(cle, res);
                        resolve(res);
                    });
            }
        });
    }

    static updateData(cle: string, getData: () => Promise<any>, actionPromise: () => Promise<any>) {
        return new Promise((resolve) => {
            actionPromise()
                .then(result => {
                    getData()
                        .then(res => {
                            this.pushData(cle, res);
                            resolve(result);
                        });
                });
        });
    }
}