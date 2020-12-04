import Joi from 'joi';

export const ProcessEnvKeysSchema = Joi.object().keys({
    NODE_ENV: Joi.string().required(),
    PORT: Joi.string().required(),
    HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    AXIOS_TIMEOUT: Joi.string().required(),
    SERVICE_CODE: Joi.string().required(),
});