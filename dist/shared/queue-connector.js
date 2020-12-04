"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueConnector = void 0;
const tslib_1 = require("tslib");
const amqplib_1 = tslib_1.__importDefault(require("amqplib"));
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const _server_1 = tslib_1.__importDefault(require("@server"));
const common_enums_1 = require("src/enums/common-enums");
class QueueConnector {
    static createConnection() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield amqplib_1.default.connect(this.ConnUrl, this.opt);
            }
            catch (err) {
                logger_1.default.error(err);
                throw err;
            }
        });
    }
    static getQueueConnection(connectionType) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let conn = _server_1.default.get(connectionType);
                if (!conn) {
                    conn = yield this.createConnection();
                    _server_1.default.set(connectionType, conn);
                }
                return conn;
            }
            catch (err) {
                logger_1.default.error(err);
                throw err;
            }
        });
    }
    static recieveMessageFromQueue(queueName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield QueueConnector.getQueueConnection(common_enums_1.ConnectionType.reciever);
                const ch = yield conn.createChannel();
                ch.assertQueue(queueName, {
                    durable: true
                });
                ch.prefetch(1);
                ch.consume(queueName, (msg) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    try {
                        const queueData = JSON.parse(msg.content.toString());
                    }
                    catch (err) {
                        logger_1.default.error(err);
                    }
                    ch.ack(msg);
                }), {
                    noAck: false
                });
            }
            catch (err) {
                logger_1.default.error(err);
                throw err;
            }
        });
    }
    static sendMessageToQueue(queueName, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.senderQueueChannel) {
                    const conn = yield QueueConnector.getQueueConnection(common_enums_1.ConnectionType.sender);
                    this.senderQueueChannel = yield conn.createChannel();
                }
                this.senderQueueChannel.assertQueue(queueName, {
                    durable: true
                });
                this.senderQueueChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
            }
            catch (err) {
                logger_1.default.error(err.message || err.stack);
                throw err;
            }
        });
    }
}
exports.QueueConnector = QueueConnector;
QueueConnector.ConnUrl = process.env.RABBITQUEUE_URL || '';
QueueConnector.opt = {
    credentials: amqplib_1.default.credentials.plain(process.env.RABBITQUEUE_USER_NAME || '', process.env.RABBITQUEUE_USER_PASS || '')
};
//# sourceMappingURL=queue-connector.js.map