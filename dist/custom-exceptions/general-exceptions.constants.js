"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralHttpExceptions = void 0;
const tslib_1 = require("tslib");
const common_enums_1 = require("src/enums/common-enums");
const response_constants_1 = tslib_1.__importDefault(require("@constants/response.constants"));
const common_constants_1 = require("@constants/common.constants");
exports.GeneralHttpExceptions = {
    EntityNotFoundException: {
        errorCode: 1002,
        message: response_constants_1.default.general.entityNotFound,
        type: common_constants_1.ExceptionsTerminology.entityNotFound,
        statusCode: common_enums_1.HttpStatusCodes.badRequest
    },
    ValidationException: {
        errorCode: 1003,
        message: response_constants_1.default.general.invalidRequestParameters,
        type: common_constants_1.ExceptionsTerminology.validationException,
        statusCode: common_enums_1.HttpStatusCodes.badRequest
    },
    InternalServerException: {
        errorCode: 1004,
        message: response_constants_1.default.general.somethingWrong,
        type: common_constants_1.ExceptionsTerminology.internalServerException,
        statusCode: common_enums_1.HttpStatusCodes.internalServerError
    },
    ServiceUnavailableException: {
        errorCode: 1005,
        message: response_constants_1.default.general.serviceUnavailable,
        type: common_constants_1.ExceptionsTerminology.serviceUnavailableException,
        statusCode: common_enums_1.HttpStatusCodes.notFound
    },
    NotFoundException: {
        errorCode: 1004,
        message: response_constants_1.default.general.notFound,
        type: common_constants_1.ExceptionsTerminology.endPointNotFoundException,
        statusCode: common_enums_1.HttpStatusCodes.notFound
    },
};
//# sourceMappingURL=general-exceptions.constants.js.map