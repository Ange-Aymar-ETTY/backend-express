import { Request } from "express";
import { splitQuery } from "../helpers";
import { verifyJWTToken } from "../helpers/jwtModule";
import { IUser } from "../models";

export const auth = async (req: Request, res, next) => {
    const endPointsExcludeAuth = ['/api/auth', '/update-demande', '/list/mobile/demandesId', '/list/mobile/demandeData'];

    if (endPointsExcludeAuth.includes(req.originalUrl))
        return next();

    let token = req.header('Authorization');

    if (token && token.startsWith('Bearer ')) {
        token = token.replace('Bearer ', '');

        await verifyJWTToken(token).then((decoded: any) => {
            const user: IUser = decoded.user;
            req.query = {
                ...req.query,
                key: user.key,
                email: user.email,
                nom_prenoms: user.nom_prenoms,
                directions: splitQuery(user.directions)
            };
            next();
        }).catch(() => {
            res.status(403).send({ error: true, message: 'Token expired' });
        });
    } else {
        return res.status(401).send({ error: true, message: 'Acees denied. No token provided' });
    }
}
