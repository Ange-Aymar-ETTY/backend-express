import jwt from 'jsonwebtoken'
import { tokenDuration } from '.';
import { CONFIG } from '../config';
import { IUser } from '../models';

export const verifyJWTToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, CONFIG.TOKEN_JWT, (err: any, decodedToken: any) => {
      if (err || !decodedToken) return reject(err);

      resolve(decodedToken)
    });
  });
}

export const createJWToken = (utilisateur: IUser) => {
  return jwt.sign(
    {
      user: utilisateur
    },
    CONFIG.TOKEN_JWT,
    {
      expiresIn: tokenDuration
    }
  );
}