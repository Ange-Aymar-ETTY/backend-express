import { Request } from "express";
import { CONFIG } from "../config";
import { EncryptionAES } from "../helpers";

export const fnBodyDecrypt = (req: Request, res, next) => {
    const { data } = req.body;

    if (data != undefined) {
        try {
            if (CONFIG.NODE_ENV == 'production') {
                const decrypt: { data: any } = EncryptionAES.decrypt(data);
                req.body = decrypt.data;
            } else {
                req.body = data;
            }
            next();
        } catch (error) {
            res.status(401).send({ error: true, message: 'error while decrypting data' });
        }
    } else {
        res.status(401).send({ error: true, message: 'Error. Not data send !' });
    }
}

export * from './auth';

export * from './morgan';

export * from './SchemaValidator';