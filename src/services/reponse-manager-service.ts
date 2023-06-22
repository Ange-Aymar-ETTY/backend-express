import { CONFIG } from "../config";
import { EncryptionAES } from "../helpers";

export class ResponseManager {
    static async send(promise: Promise<any>, res: any) {
        let response: { status: number, send?: any } = {
            status: 200
        };

        await promise.then(data => {
            response.send = {
                error: false,
                message: "L'opération a été effectué avec succès",
                data
            };
        }).catch(err => {
            if (err.data || err.message) {
                response.send = {
                    error: true,
                    message: err.message,
                    data: err.data || null
                }
            } else {
                response = {
                    status: 500,
                    send: {
                        error: true,
                        message: "Internal serveur error",
                        data: err
                    }
                }
            }
        });

        let data = response.send;

        if (CONFIG.NODE_ENV == 'production') {
            data = EncryptionAES.encrypt(response.send);
        }

        res.status(response.status).send({ data });
    }
}