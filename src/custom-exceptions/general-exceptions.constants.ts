import { HttpStatusCodes } from 'src/enums/common-enums';
import { IGeneralHttpExceptions } from 'src/interfaces-and-types';
import MessageConstants from '@constants/response.constants';
import { ExceptionsTerminology } from '@constants/common.constants';


export const GeneralHttpExceptions: IGeneralHttpExceptions = {
    EntityNotFoundException: {
        errorCode: 1002,
        message: MessageConstants.general.entityNotFound,
        type: ExceptionsTerminology.entityNotFound,
        statusCode: HttpStatusCodes.badRequest
    },
    ValidationException: {
        errorCode: 1003,
        message: MessageConstants.general.invalidRequestParameters,
        type: ExceptionsTerminology.validationException,
        statusCode: HttpStatusCodes.badRequest
    },
    InternalServerException: {
        errorCode: 1004,
        message: MessageConstants.general.somethingWrong,
        type: ExceptionsTerminology.internalServerException,
        statusCode: HttpStatusCodes.internalServerError
    },
    ServiceUnavailableException: {
        errorCode: 1005,
        message: MessageConstants.general.serviceUnavailable,
        type: ExceptionsTerminology.serviceUnavailableException,
        statusCode: HttpStatusCodes.notFound
    },
    NotFoundException: {
        errorCode: 1004,
        message: MessageConstants.general.notFound,
        type: ExceptionsTerminology.endPointNotFoundException,
        statusCode: HttpStatusCodes.notFound
    },
};
