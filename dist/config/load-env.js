"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const command_line_args_1 = tslib_1.__importDefault(require("command-line-args"));
const options = command_line_args_1.default([
    {
        name: 'env',
        alias: 'e',
        defaultValue: 'development',
        type: String,
    },
]);
const config = dotenv_1.default.config({
    path: `./env/${options.env}.env`,
});
if (config.error) {
    throw config.error;
}
exports.default = config;
//# sourceMappingURL=load-env.js.map