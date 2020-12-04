"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenParser = void 0;
const tslib_1 = require("tslib");
const common_functions_1 = require("@shared/common-functions");
const http_exception_1 = tslib_1.__importDefault(require("src/custom-exceptions/http.exception"));
const general_exceptions_constants_1 = require("src/custom-exceptions/general-exceptions.constants");
const response_constants_1 = require("@constants/response.constants");
const commonFunctions = new common_functions_1.CommonFunctions();
class AccessTokenParser {
    static parseAccessTokens(accessToken) {
        const parseAccessTokens = {
            'accessToken': accessToken.access_token,
            'refreshToken': accessToken.refresh_token,
            'refreshTokenExpiresAt': commonFunctions.getDateByAddingSeconds(accessToken.x_refresh_token_expires_in),
            'accessTokenExpireTime': commonFunctions.getDateByAddingSeconds(accessToken.expires_in),
            'provider': 1
        };
        if (parseAccessTokens) {
            return parseAccessTokens;
        }
        else {
            throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.MessageConstants.qbMessages.errorWhileParsingAccessTokens);
        }
    }
}
exports.AccessTokenParser = AccessTokenParser;
//# sourceMappingURL=access-tokens.js.map