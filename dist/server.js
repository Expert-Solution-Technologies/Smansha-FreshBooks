"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
require("reflect-metadata");
const express_1 = tslib_1.__importDefault(require("express"));
require("express-async-errors");
const swagger_jsdoc_1 = tslib_1.__importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./config/swagger.config");
const index_route_1 = tslib_1.__importDefault(require("src/api/routes/index.route"));
const http_error_middleware_1 = tslib_1.__importDefault(require("./middlewares/http-error-middleware"));
class App {
    constructor() {
        this.express = express_1.default();
        this.setUpConfiguration();
    }
    setUpConfiguration() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use(cookie_parser_1.default());
        if (process.env.NODE_ENV === 'development') {
        }
        this.express.use('/', index_route_1.default);
        this.express.use(http_error_middleware_1.default);
        const swaggerDocs = swagger_jsdoc_1.default(swagger_config_1.SwaggerConfig);
        this.express.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
    }
}
exports.default = new App().express;
//# sourceMappingURL=server.js.map