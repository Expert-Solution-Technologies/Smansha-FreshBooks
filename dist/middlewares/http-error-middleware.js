"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const http_exception_1 = tslib_1.__importDefault(require("src/custom-exceptions/http.exception"));
const smansha_exception_1 = tslib_1.__importDefault(require("src/custom-exceptions/smansha.exception"));
const common_enums_1 = require("src/enums/common-enums");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const common_functions_1 = require("@shared/common-functions");
const response_constants_1 = tslib_1.__importDefault(require("@constants/response.constants"));
const general_exceptions_constants_1 = require("src/custom-exceptions/general-exceptions.constants");
const commonFunctions = new common_functions_1.CommonFunctions();
const HttpErrorMiddleware = (error, request, response, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (error instanceof http_exception_1.default) {
        HandleException(error, request, response, next);
    }
    else if (error && error.error && error.error.isJoi) {
        const validationError = new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.ValidationException, error.error.message);
        HandleException(validationError, request, response, next);
    }
    else if (error.isAxiosError) {
        console.log(error.message);
        if (error.code === 'ENOTFOUND') {
            const newError = new smansha_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.NotFoundException, response_constants_1.default.general.notFound);
            HandleException(newError, request, response, next);
        }
        else if (error.code === 'ECONNREFUSED') {
            const newError = new smansha_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.ServiceUnavailableException, response_constants_1.default.general.serviceUnavailable + error.config.url);
            HandleException(newError, request, response, next);
        }
        else if (error.response && error.response.status === common_enums_1.HttpStatusCodes.badRequest) {
            const newError = new smansha_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.ValidationException, response_constants_1.default.general.invalidRequestParameters + ' ' + error.response.data.error.message, error.response.data.error.serviceCode);
            HandleException(newError, request, response, next);
        }
        else if (error.response && error.response.status === common_enums_1.HttpStatusCodes.internalServerError) {
            const newError = new smansha_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.InternalServerException, response_constants_1.default.general.internalServerException + ' ' + error.response.data.error.message, error.response.data.error.serviceCode);
            HandleException(newError, request, response, next);
        }
        else {
            console.log('New type of axios error occured please capture this >>>>>>>>>>>>>>');
            process.exit(1);
        }
    }
    else {
        const newError = new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.InternalServerException, error.message);
        HandleException(newError, request, response, next);
    }
});
const HandleException = (error, request, response, next) => {
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
    const errorDetails = {
        message: error.message || response_constants_1.default.general.somethingWrong,
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
    if (errorDetails.statusCode === common_enums_1.HttpStatusCodes.internalServerError) {
        errorDetails.requestObject = requestObject;
        errorDetails.smTraceId = PostExceptionsToSentry(errorDetails);
        logger_1.default.error(errorDetails);
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
const PostExceptionsToSentry = (error) => {
    const id = commonFunctions.getMongoObjectId();
    error.smTraceId = id;
    return id;
};
exports.default = HttpErrorMiddleware;
//# sourceMappingURL=http-error-middleware.js.map