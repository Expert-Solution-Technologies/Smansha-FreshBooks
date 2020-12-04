"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const response_constants_1 = tslib_1.__importDefault(require("@constants/response.constants"));
class HttpException extends Error {
    constructor(exception, message) {
        super(message);
        this.message = exception.message;
        this.detailedMessage = message || response_constants_1.default.general.somethingWrong;
        this.statusCode = exception.statusCode;
        this.type = exception.type;
        this.stackTrace = this.stack || ' No Stack Trace';
        this.serviceCode = Number(process.env.SERVICE_CODE);
        this.errorCode = exception.errorCode;
    }
}
exports.default = HttpException;
//# sourceMappingURL=http.exception.js.map