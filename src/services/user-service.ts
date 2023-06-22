import { Op } from 'sequelize';
import { createJWToken } from '../helpers/jwtModule';
import { UniqueConstraintError } from 'sequelize';
import { IUser, User } from '../models';
import bcrypt from 'bcrypt';
import { generatePassword, MAIL, sendMail, splitQuery } from '../helpers';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10;

export class UserService {
    constructor() { }

    static list() {
        return User.findAll({
            attributes: {
                exclude: ['password']
            },
            where: {
                directions: {
                    [Op.ne]: 'SUPER'
                }
            }
        });
    }

    static auth(credentials: any) {
        return new Promise((resolve, reject) => {
            User.findOne({
                raw: true,
                where: {
                    email: credentials.login
                }
            }).then((res: any) => {
                let user: IUser = res;
                if (!user) {
                    reject({ message: 'Email incorrect.' });
                } else {
                    if (user.password && bcrypt.compareSync(credentials.password, user.password)) {
                        delete user.password;
                        const token = createJWToken(user);
                        resolve(token);
                    } else {
                        reject({ message: 'Mot de passe incorrect.' });
                    }
                }
            }).catch(() => {
                reject({ message: 'Erreur lors du traitement.' });
            });
        });
    }

    static create(data: any) {
        return new Promise((resolve, reject) => {
            const passGen = generatePassword();
            data.password = bcrypt.hashSync(passGen, saltRounds);
            data.key = uuidv4().split('-').join('');

            User.create(data)
                .then(async (res) => {
                    const user: IUser = res.get();
                    const sended = await sendMail(
                        {
                            to: user.email,
                            subject: MAIL.CREATE_ACCOUNT,
                        },
                        {
                            source: 'create_account.html',
                            parameter: {
                                name: user.nom_prenoms,
                                password: passGen
                            }
                        }
                    );

                    if (sended) {
                        resolve(res);
                    } else {
                        resolve(res);
                    }

                }).catch(error => {
                    if (error instanceof UniqueConstraintError) {
                        reject({ message: `L'Email renseigné existe déja !` });
                    } else {
                        reject({ message: `Erreur lors du traitement.` });
                    }
                });
        });
    }

    static update(fieldsUpdated: any, filters: { id: any; }) {
        return new Promise((resolve, reject) => {
            User
                .update(
                    fieldsUpdated,
                    {
                        where: filters
                    }
                )
                .then(() => User.findByPk(filters.id))
                .then(user => resolve(user))
                .catch(error => {
                    if (error instanceof UniqueConstraintError) {
                        reject({ message: 'Le matricule existe déja !' });
                    } else {
                        reject({ message: `Erreur lors du traitement.` });
                    }
                });
        });
    }

    static delete(id: number) {
        return new Promise((resolve, reject) => {
            User
                .destroy({
                    where: {
                        id
                    }
                })
                .then(result => resolve(result))
                .catch(() => reject({ message: `Erreur lors du traitement.` }));
        });
    }

    static changePassword(data) {
        return new Promise((resolve, reject) => {
            User.findOne({
                raw: true,
                where: { id: data.id }
            }).then((res: any) => {
                if (!res) {
                    reject({ message: `Aucune utilisateur trouvé` });
                } else {
                    if (bcrypt.compareSync(data.ancien_pwd, res.password)) {
                        const hashNew = bcrypt.hashSync(data.nouveau_pwd, saltRounds);
                        User.update(
                            {
                                password: hashNew
                            },
                            {
                                where: {
                                    id: data.id
                                }
                            }
                        )
                            .then(result => resolve(result))
                            .catch(() => reject({ message: 'Erreur lors de la mise à jour du mot de passe.' }))
                    } else {
                        reject({ message: `L'ancien mot de passe saisi est incorrect.` });
                    }
                }
            }).catch(() => reject({ message: 'Erreur lors du traitement.' }));
        });
    }
}