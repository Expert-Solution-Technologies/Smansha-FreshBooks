"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QBValidations = void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const GetQbAuthorizationSchema = joi_1.default.object({
    leadId: joi_1.default.string().required(),
});
const GetQbAuthorizationHeaderSchema = joi_1.default.object({
    instituteid: joi_1.default.string().required(),
});
const CallbackSchema = joi_1.default.object({
    code: joi_1.default.string().empty(''),
    state: joi_1.default.string().required(),
    realmId: joi_1.default.string().required(),
});
exports.QBValidations = {
    GetQbAuthorizationSchema,
    GetQbAuthorizationHeaderSchema,
    CallbackSchema
};
//# sourceMappingURL=qb.validations.js.map