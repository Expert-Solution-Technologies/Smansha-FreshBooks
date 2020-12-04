"use strict";
const tslib_1 = require("tslib");
const express_1 = require("express");
const response_constants_1 = tslib_1.__importDefault(require("@constants/response.constants"));
const qb_service_1 = require("../services/qb.service");
const qb_business_service_1 = require("../services/qb-business.service");
const express_joi_validation_1 = require("express-joi-validation");
const qb_validations_1 = require("src/schema-validations/schemas/qb.validations");
const qbService = new qb_service_1.QbService();
const qbBusinessService = new qb_business_service_1.QbBusinessService();
const validator = express_joi_validation_1.createValidator({ passError: true });
class QbRouter {
    constructor() {
        this.router = express_1.Router();
        this.mountRoutes();
    }
    mountRoutes() {
        this.router.get('/', [validator.query(qb_validations_1.QBValidations.GetQbAuthorizationSchema)], [validator.headers(qb_validations_1.QBValidations.GetQbAuthorizationHeaderSchema)], this.getQbAuthorizationUri);
        this.router.get('/callback', [validator.query(qb_validations_1.QBValidations.CallbackSchema)], this.saveBusinessInfo);
    }
    getQbAuthorizationUri(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const leadId = req.query.leadId;
            const institueId = req.headers.instituteid;
            const authorizationUri = yield qbService.getQbAuthorizationUri(leadId, institueId);
            res.json({ status: true, data: { url: authorizationUri }, message: response_constants_1.default.general.dataFetch });
        });
    }
    saveBusinessInfo(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const userId = '1';
            const callbackURL = req.url;
            const instituteId = JSON.parse(req.query.state).instituteId;
            const realmId = req.query.realmId;
            const leadId = JSON.parse(req.query.state).leadId;
            const saveInfo = yield qbBusinessService.saveBusiness(instituteId, callbackURL, realmId, userId, leadId);
            res.send(saveInfo);
        });
    }
}
module.exports = new QbRouter().router;
//# sourceMappingURL=qb.routes.js.map