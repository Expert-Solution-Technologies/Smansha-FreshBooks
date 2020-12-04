

// Must be the first import
import config from 'src/config/load-env';
import { ProcessEnvKeysSchema } from './schema-validations/schemas/process-variables.validations';
import 'reflect-metadata';
import app from '@server';
import { Database } from './database/database';
const appName = require('../package.json').name;

const validationResult = ProcessEnvKeysSchema.validate(config.parsed);
if (validationResult.error) {
    console.error('Env Config Validation Error-->\n ', validationResult.error.details);
    process.exit(1);
}

const port = process.env.PORT;
Database.getDBInstance().then(() => {
    /** starting an application on specific port */
    app.listen(port, () => {
        console.log(appName + ' started on port: ' + port);
    });
}).catch(err => {
    console.log('Database Connection Error!');
    process.exit(1);
});


process.on('unhandledRejection', (data: any) => {
    console.log('error--> ', data);
    process.exit(1);
});

process.on('uncaughtException', (data: any) => {
    console.log('error--> ', data);
    process.exit(1);
});

