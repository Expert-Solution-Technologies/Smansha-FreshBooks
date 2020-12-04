"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfig = void 0;
exports.SwaggerConfig = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Smai-qb-service',
            description: 'API documentation',
            contact: {
                name: 'Smansha-AI'
            },
            version: '1.0.0'
        },
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        },
    },
    apis: ['src/api/routes/*.ts'],
};
//# sourceMappingURL=swagger.config.js.map