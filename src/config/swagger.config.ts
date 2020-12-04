
/**
 * Swagger Configuration
 */
export const SwaggerConfig = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Smai-Balance-sheet-service',
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