import MessageConstants from '@constants/response.constants';
import { HttpStatusCodes } from 'src/enums/common-enums';
import { IHttpException } from 'src/interfaces-and-types';

// Global error object
export class SmanshaAIException extends Error {
    statusCode: HttpStatusCodes;
    type: string;
    stackTrace?: string;
    serviceCode?: number;
    errorCode: number;
    detailedMessage: string;
    smTraceId?: string;
    level?: string;
    requestObject?: Express.Request;
    constructor(exception: IHttpException, message: string, serviceCode?: any) {
        super(message);
        this.message = exception.message;
        this.detailedMessage = message || MessageConstants.general.somethingWrong;
        this.statusCode = exception.statusCode;
        this.type = exception.type;
        this.stackTrace = this.stack || ' No Stack Trace';
        this.serviceCode = serviceCode ? Number(serviceCode) : Number(process.env.SERVICE_CODE);
        this.errorCode = exception.errorCode;
    }
}




