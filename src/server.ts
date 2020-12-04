import cookieParser from 'cookie-parser';
import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { SwaggerConfig } from './config/swagger.config';
import BaseRouter from 'src/api/routes/index.route';
import HttpErrorMiddleware from './middlewares/http-error-middleware';


class App {
    public express: any;

    constructor() {
        this.express = express();
        this.setUpConfiguration();
    }

    private setUpConfiguration(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(cookieParser());

        // Show routes called in console during development
        if (process.env.NODE_ENV === 'development') {
            // this.express.use(morgan('dev'));
        }

        // Add APIs
        this.express.use('/', BaseRouter);
        // error middleware
        this.express.use(HttpErrorMiddleware);

        // swagger middleware
        const swaggerDocs = swaggerJSDoc(SwaggerConfig);
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }
}

export default new App().express;