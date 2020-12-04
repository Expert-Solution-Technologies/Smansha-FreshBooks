import { NextFunction, Request, Response } from 'express';
import logger from '@shared/logger';
import { CommonFunctions } from '@shared/common-functions';
import MessageConstants from '@constants/response.constants';
import { ExpressJoiError } from 'express-joi-validation';

import { HttpStatusCodes } from 'src/enums/common-enums';
import { GeneralHttpExceptions } from 'src/custom-exceptions/general-exceptions.constants';
import { SmanshaAIException } from 'src/custom-exceptions';
const commonFunctions = new CommonFunctions();

/**
 * will handle the Global Http Errors
 * @param error error of error class Type
 * @param request request of Express Request Type
 * @param response response of Express Response Type
 * @param next next function of Express response Type
 */
const HttpErrorMiddleware = async (error: SmanshaAIException | Error | ExpressJoiError | any, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof SmanshaAIException) {
        HandleException(error, request, response, next);
    }
    else if (error && error.error && error.error.isJoi) {
        // const validationError = new ValidationException(error.error.message);
        const validationError = new SmanshaAIException(GeneralHttpExceptions.ValidationException, error.error.message);
        HandleException(validationError, request, response, next);
    }

    else if (error.isAxiosError) {
        console.log(error.message)
        if (error.code === 'ENOTFOUND') {
            const newError = new SmanshaAIException(GeneralHttpExceptions.NotFoundException, MessageConstants.general.notFound);
            HandleException(newError, request, response, next);
        }
        else if (error.code === 'ECONNREFUSED') {
            const newError = new SmanshaAIException(GeneralHttpExceptions.ServiceUnavailableException, MessageConstants.general.serviceUnavailable + error.config.url);
            HandleException(newError, request, response, next);
        }
        else if (error.response && error.response.status === HttpStatusCodes.badRequest) {
            const newError = new SmanshaAIException(GeneralHttpExceptions.ValidationException, MessageConstants.general.invalidRequestParameters + ' ' + error.response.data.error.message, error.response.data.error.serviceCode);
            HandleException(newError, request, response, next);
        }
        else if (error.response && error.response.status === HttpStatusCodes.internalServerError) {
            const newError = new SmanshaAIException(GeneralHttpExceptions.InternalServerException, MessageConstants.general.internalServerException + ' ' + error.response.data.error.message, error.response.data.error.serviceCode);
            HandleException(newError, request, response, next);
        }
        else {
            console.log('New type of axios error occured please capture this >>>>>>>>>>>>>>');
            process.exit(1);
        }

        // handle other case for axios error
    }
    else {
        const newError = new SmanshaAIException(GeneralHttpExceptions.InternalServerException, error.message);
        HandleException(newError, request, response, next);
    }
};

/**
 * will handle the Global Http Errors and send to client and store to db
 * @param error error of error class Type
 * @param request request of Express Request Type
 * @param response response of Express Response Type
 * @param next next function of Express response Type
 */
const HandleException = (error: SmanshaAIException, request: Request, response: Response, next: NextFunction) => {
    const requestObject = {
        headers: request.headers,
        url: request.url,
        originalUrl: request.originalUrl,
        params: request.params,
        queryParams: request.query,
        body: request.body,
        ip: request.ip,
        method: request.method
    };

    const errorDetails: SmanshaAIException =
    {
        message: error.message || MessageConstants.general.somethingWrong,
        type: error.type,
        stackTrace: error.stackTrace,
        name: error.name,
        smTraceId: error.smTraceId,
        detailedMessage: error.detailedMessage,
        level: 'error',
        errorCode: error.errorCode,
        serviceCode: error.serviceCode,
        statusCode: error.statusCode
    };
    if (errorDetails.statusCode === HttpStatusCodes.internalServerError) {
        errorDetails.requestObject = requestObject;
        errorDetails.smTraceId = PostExceptionsToSentry(errorDetails);
        logger.error(errorDetails);
        const errorResponse = {
            status: false,
            message: errorDetails.message,
            error: {
                type: errorDetails.type,
                smTraceId: errorDetails.smTraceId,
                message: errorDetails.detailedMessage,
                errorCode: errorDetails.errorCode,
                serviceCode: errorDetails.serviceCode
            }
        };

        response.status(errorDetails.statusCode).json(errorResponse);
    }
    else {
        const errorResponse = {
            status: false,
            message: errorDetails.message,
            error: {
                type: errorDetails.type,
                message: errorDetails.detailedMessage,
                errorCode: errorDetails.errorCode,
                serviceCode: errorDetails.serviceCode
            }
        };

        response.status(errorDetails.statusCode).json(errorResponse);
    }
};

/**
 * this method will pass the error to error logging service
 * @param error pass the error
 */
const PostExceptionsToSentry = (error: SmanshaAIException) => {
    const id = commonFunctions.getMongoObjectId();
    error.smTraceId = id;
    // to do write post logs logic here
    // use the generated id to store the log into mongo
    // this.sendErrorToSentry(error)
    return id;
};

export default HttpErrorMiddleware;