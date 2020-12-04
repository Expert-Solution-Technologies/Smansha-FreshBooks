import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export interface IGetPaginateSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        pageNo: string;
        pageSize: string;
    };
}

export interface IGetUserByIdSchema extends ValidatedRequestSchema {
    [ContainerTypes.Params]: {
        userId: string;
    };
}
