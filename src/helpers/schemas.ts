import Joi from 'joi';

const schemaAuth = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required()
});

export const Schemas = {
    '/api/auth': schemaAuth,
};