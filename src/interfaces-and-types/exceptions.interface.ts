import { HttpStatusCodes } from 'src/enums/common-enums';

export interface IHttpException {
    message: string;
    type: string;
    statusCode: HttpStatusCodes;
    stackTrace?: any;
    smTraceId?: string;
    level?: string;
    serviceCode?: number;
    errorCode: number;
}

export interface IGeneralHttpExceptions {
    EntityNotFoundException: IHttpException;
    ValidationException: IHttpException;
    InternalServerException: IHttpException;
    NotFoundException: IHttpException;
    ServiceUnavailableException: IHttpException;
}