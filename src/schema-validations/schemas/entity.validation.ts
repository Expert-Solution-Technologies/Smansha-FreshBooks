import * as Joi from 'joi';



const SaveEntity = Joi.object().keys({
    key1: Joi.string().required(),
    key2: Joi.string().required(),
    key3: Joi.date().required(),
    key4: Joi.date().required(),
});


export const FakeValidations =
{
    SaveEntity
};