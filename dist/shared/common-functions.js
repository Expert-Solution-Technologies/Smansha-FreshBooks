"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonFunctions = void 0;
const tslib_1 = require("tslib");
const ObjectID = require('mongodb').ObjectID;
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const common_enums_1 = require("src/enums/common-enums");
const moment_1 = tslib_1.__importDefault(require("moment"));
class CommonFunctions {
    constructor() {
        this.getValueByKey = (NameValue, arg1) => {
            let match = NameValue.find((item) => {
                return item.Name === arg1;
            });
            if (match)
                return match.Value;
            else
                return "";
        };
        this.getDateByAddingSeconds = (seconds) => {
            let date = new Date();
            date.setSeconds(date.getSeconds() + seconds);
            return date.toISOString();
        };
        this.addMonths = (month, timezone, resetDate, crntDate) => {
            let tzDate = moment_timezone_1.default(moment_timezone_1.default.now()).tz(timezone).format(common_enums_1.DateFormat.date);
            let currentDate = new Date(tzDate);
            if (crntDate) {
                currentDate = crntDate;
            }
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            currentDate.setMonth(currentDate.getMonth() + month);
            if (resetDate) {
                currentDate.setDate(1);
                currentDate.setHours(-1);
            }
            return currentDate.toISOString();
        };
        this.getDateGroupsBetweenTwoDays = (startDate, endDate, days) => {
            let date1 = moment_1.default(startDate, common_enums_1.DateFormat.date);
            const date2 = moment_1.default(endDate, common_enums_1.DateFormat.date);
            const dateGroups = [];
            while (true) {
                if (date2.diff(date1, 'days') > days) {
                    const temp = date1.format(common_enums_1.DateFormat.date);
                    const eDate = date1.add(days, 'day');
                    dateGroups.push({ end: date1.format(common_enums_1.DateFormat.date), start: temp });
                    date1 = moment_1.default(eDate).add(1, 'day');
                }
                else {
                    dateGroups.push({ start: date1.format(common_enums_1.DateFormat.date), end: date2.format(common_enums_1.DateFormat.date) });
                    break;
                }
            }
            return dateGroups;
        };
    }
    stringFormatingInURL(str, arg) {
        let i = 0;
        for (; i < arg.length; i++) {
            str = str.replace('{' + i + '}', arg[i]);
        }
        return str;
    }
    getMongoObjectId() {
        const objectId = new ObjectID();
        return objectId;
    }
    textTruncate(str, length, ending) {
        if (str.length >= length) {
            return str.substring(0, length - ending.length) + ending;
        }
        else {
            return str;
        }
    }
}
exports.CommonFunctions = CommonFunctions;
//# sourceMappingURL=common-functions.js.map