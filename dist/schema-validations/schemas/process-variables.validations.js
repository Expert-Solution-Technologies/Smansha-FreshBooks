"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessEnvKeysSchema = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.ProcessEnvKeysSchema = joi_1.default.object().keys({
    NODE_ENV: joi_1.default.string().required(),
    PORT: joi_1.default.string().required(),
    HOST: joi_1.default.string().required(),
    RABBITQUEUE_URL: joi_1.default.string().required(),
    RABBITQUEUE_USER_NAME: joi_1.default.string().required(),
    RABBITQUEUE_USER_PASS: joi_1.default.string().required(),
    RABBITQUEUE_SENDER: joi_1.default.string().required(),
    RABBITQUEUE_RECEIVER: joi_1.default.string().required(),
    AXIOS_TIMEOUT: joi_1.default.string().required(),
    SERVICE_CODE: joi_1.default.string().required(),
    QB_CLIENT_ID: joi_1.default.string().required(),
    QB_CLIENT_SECRET: joi_1.default.string().required(),
    QB_ENVIRONMENT: joi_1.default.string().required(),
    QB_REDIRECT_URI: joi_1.default.string().required(),
    QB_API_URL: joi_1.default.string().required(),
    SMAI_ONBOARDING_API_URL: joi_1.default.string().required(),
    SMAI_AUTH_API_URL: joi_1.default.string().required(),
});
//# sourceMappingURL=process-variables.validations.js.map