"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeUnitKeys = exports.DateFormat = exports.ConnectionType = exports.HttpStatusCodes = void 0;
var HttpStatusCodes;
(function (HttpStatusCodes) {
    HttpStatusCodes[HttpStatusCodes["badRequest"] = 400] = "badRequest";
    HttpStatusCodes[HttpStatusCodes["notFound"] = 404] = "notFound";
    HttpStatusCodes[HttpStatusCodes["internalServerError"] = 500] = "internalServerError";
    HttpStatusCodes[HttpStatusCodes["unauthorized"] = 401] = "unauthorized";
    HttpStatusCodes[HttpStatusCodes["ok"] = 200] = "ok";
})(HttpStatusCodes = exports.HttpStatusCodes || (exports.HttpStatusCodes = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["sender"] = "SENDER_QUEUE_CONNECTION";
    ConnectionType["reciever"] = "RECEIVER_QUEUE_CONNECTION";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
var DateFormat;
(function (DateFormat) {
    DateFormat["dateTimeIso"] = "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]";
    DateFormat["dateTime"] = "YYYY-MM-DD HH:mm:ss";
    DateFormat["date"] = "YYYY-MM-DD";
})(DateFormat = exports.DateFormat || (exports.DateFormat = {}));
var TimeUnitKeys;
(function (TimeUnitKeys) {
    TimeUnitKeys["minutes"] = "minutes";
    TimeUnitKeys["days"] = "days";
    TimeUnitKeys["hours"] = "hours";
    TimeUnitKeys["months"] = "months";
})(TimeUnitKeys = exports.TimeUnitKeys || (exports.TimeUnitKeys = {}));
//# sourceMappingURL=common-enums.js.map