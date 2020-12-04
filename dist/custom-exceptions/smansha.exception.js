"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const response_constants_1 = tslib_1.__importDefault(require("@constants/response.constants"));
const common_enums_1 = require("src/enums/common-enums");
const common_constants_1 = require("@constants/common.constants");
class SmanshaAIException extends Error {
    constructor(exception, message, serviceCode) {
        super(message);
        this.message = exception.message;
        this.detailedMessage = message || response_constants_1.default.general.somethingWrong;
        this.statusCode = exception.statusCode || common_enums_1.HttpStatusCodes.internalServerError;
        this.type = exception.type || common_constants_1.ExceptionsTerminology.internalServerException;
        this.stackTrace = this.stackTrace || ' No Stack Trace';
        this.serviceCode = serviceCode || Number(process.env.SERVICE_CODE);
        this.errorCode = exception.errorCode;
    }
}
exports.default = SmanshaAIException;
//# sourceMappingURL=smansha.exception.js.map