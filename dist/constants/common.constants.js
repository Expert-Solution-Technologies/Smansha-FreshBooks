"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommanParserConst = exports.ExceptionsTerminology = exports.TeamMemberStatus = exports.RedisKeys = exports.CommonConstant = void 0;
exports.CommonConstant = {
    dateTimeFormat: 'YYYY-MM-DD hh:mm:ss',
    dateFormat: 'YYYY-MM-DD'
};
exports.RedisKeys = {
    businesses: '{0}-usr-businesses'
};
exports.TeamMemberStatus = {
    active: 'Active',
    pending: 'Pending',
    inActive: 'Inactive'
};
exports.ExceptionsTerminology = {
    recordAlreadyExists: 'RecordExists',
    entityNotFound: 'EntityNotFoundError',
    validationException: 'RequestValidationError',
    internalServerException: 'InternalServerError',
    passwordEncryptionException: 'PasswordEncryptionError',
    endPointNotFoundException: 'EndPointNotFoundError',
    serviceUnavailableException: 'EndPointNotFoundError',
};
exports.CommanParserConst = {
    blankZeroDate: '0-00-00',
    invalidDate: 'Invalid date',
    maxLengthDesc: 249
};
//# sourceMappingURL=common.constants.js.map