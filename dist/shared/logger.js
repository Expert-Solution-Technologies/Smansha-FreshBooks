"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const common_enums_1 = require("src/enums/common-enums");
const { File, Console } = winston_1.transports;
const { combine, timestamp, label, printf } = winston_1.format;
const logger = winston_1.createLogger();
const env = process.env !== undefined ? process.env.NODE_ENV : 'developement';
if (env === 'development') {
    const fileFormat = winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json());
    const errTransport = new File({
        filename: './logs/error.log',
        format: fileFormat,
        level: 'error',
    });
    const infoTransport = new File({
        filename: './logs/combined.log',
        format: fileFormat,
    });
    const myFormat = printf(info => {
        try {
            if (info.statusCode === common_enums_1.HttpStatusCodes.internalServerError) {
                return (info.level + ' | Time:- '
                    + info.timestamp + ' | Error Type:- '
                    + info.type + ' | SmTraceId:-'
                    + info.smTraceId + '\n Message:- '
                    + info.message.split('\n')[0])
                    + '\n Stack:- ' + info.stack ? info.stack.split(',').join('\n') : '';
            }
            else if (info.level === 'error') {
                return (info.level + ' | Time:- '
                    + info.timestamp + ' | Error Type:- '
                    + info.type + '\n Message:- '
                    + info.message.split('\n')[0])
                    + '\n Stack:- ' + info.stack ? info.stack.split(',').join('\n') : '';
            }
            else {
                return (info.level + ' | Time:- '
                    + info.timestamp + ' | Message:- '
                    + (info.message ? info.message.split('\n')[0] : ''));
            }
        }
        catch (error) {
            return (info.timestamp + ' | ' +
                info.message ? info.message.split('\n')[0] : 'No Message');
        }
    });
    const consoleTrans = new Console({ format: combine(timestamp(), winston_1.format.colorize(), myFormat), });
    logger.add(consoleTrans);
    logger.add(errTransport);
    logger.add(infoTransport);
}
else {
    const errorStackFormat = winston_1.format((info) => {
        if (info.stack) {
            console.log(info.stack);
            return false;
        }
        return info;
    });
    const consoleTransport = new Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple(), errorStackFormat()),
    });
    logger.add(consoleTransport);
}
exports.default = logger;
//# sourceMappingURL=logger.js.map