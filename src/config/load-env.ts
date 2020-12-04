
import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import { ProcessEnvKeysSchema } from 'src/schema-validations/schemas/process-variables.validations';

// Setup command line options
const options = commandLineArgs([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'development',
        type: String,
    },
]);

// Set the env file
const config = dotenv.config({
    path: `./env/${options.env}.env`,
});

if (config.error) {
    throw config.error;
}

export default config;