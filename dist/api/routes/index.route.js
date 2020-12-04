"use strict";
const tslib_1 = require("tslib");
const express_1 = require("express");
const qb_routes_1 = tslib_1.__importDefault(require("./qb.routes"));
class BaseRouter {
    constructor() {
        this.router = express_1.Router();
        this.mountRoutes();
    }
    mountRoutes() {
        this.router.use('/qb', qb_routes_1.default);
    }
}
module.exports = new BaseRouter().router;
//# sourceMappingURL=index.route.js.map