"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const load_env_1 = tslib_1.__importDefault(require("src/config/load-env"));
const process_variables_validations_1 = require("./schema-validations/schemas/process-variables.validations");
require("reflect-metadata");
const queue_connector_1 = require("@shared/queue-connector");
const common_enums_1 = require("./enums/common-enums");
const _server_1 = tslib_1.__importDefault(require("@server"));
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const appName = require('../package.json').name;
const validationResult = process_variables_validations_1.ProcessEnvKeysSchema.validate(load_env_1.default.parsed);
if (validationResult.error) {
    console.error('Env Config Validation Error-->\n ', validationResult.error.details);
    process.exit(1);
}
queue_connector_1.QueueConnector.getQueueConnection(common_enums_1.ConnectionType.sender).then(() => {
    console.log(appName + ' Queue sender started.');
    logger_1.default.info(appName + ' Queue sender started.');
}).catch((err) => {
    console.log('Error occured while creating queue sender connection.');
    console.log(err);
    process.exit();
});
const port = process.env.PORT;
_server_1.default.listen(port, () => {
    console.log(appName + ' started on port: ' + port);
});
process.on('unhandledRejection', (data) => {
    console.log('error--> ', data);
    process.exit(1);
});
process.on('uncaughtException', (data) => {
    console.log('error--> ', data);
    process.exit(1);
});
//# sourceMappingURL=index.js.map