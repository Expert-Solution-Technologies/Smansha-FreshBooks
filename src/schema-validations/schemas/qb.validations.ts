import Joi from 'joi';

const GetQbAuthorizationSchema = Joi.object({
    leadId: Joi.string().required(),
});

const GetQbAuthorizationHeaderSchema = Joi.object({
    instituteid: Joi.string().required(),
});

const CallbackSchema = Joi.object({
    code: Joi.string().empty(''),
    state: Joi.string().required(),
    realmId: Joi.string().required(),
});

export const QBValidations = {
    GetQbAuthorizationSchema,
    GetQbAuthorizationHeaderSchema,
    CallbackSchema
};
