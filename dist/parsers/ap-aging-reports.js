"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApAgingDetailParser = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const response_constants_1 = require("@constants/response.constants");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const common_enums_1 = require("src/enums/common-enums");
const parser_enum_1 = require("src/enums/parser-enum");
const common_constants_1 = require("@constants/common.constants");
class ApAgingDetailParser {
    parseApAgingReport(arArgingReport, businessId, headId) {
        try {
            if (arArgingReport) {
                this.data = arArgingReport;
                this.headId = headId;
            }
            else {
                throw new Error(response_constants_1.MessageConstants.qbMessages.noArAgingReportData);
            }
            const colIndexes = this.getColumnIndex();
            const rows = this.data.Rows;
            if (!rows.Row) {
                logger_1.default.info('No Entries for AP');
                return [];
            }
            const rowLength = rows.Row.length;
            const parsedData = [];
            for (let i = 0; i < rowLength; i++) {
                const element = rows.Row[i];
                if (element.Rows && element.Rows.Row) {
                    const rows = element.Rows.Row;
                    const len = rows.length;
                    if (len > 0) {
                        for (let j = 0; j < len; j++) {
                            const item = rows[j];
                            parsedData.push(this.parse(item, colIndexes, businessId));
                        }
                    }
                }
            }
            if (parsedData && parsedData.length > 0) {
            }
            return parsedData;
        }
        catch (error) {
            logger_1.default.error(error.stack || error.message);
            throw new Error(response_constants_1.MessageConstants.qbMessages.errorWhileParsingArAgingReport);
        }
    }
    getColumnIndex() {
        const Columns = this.data.Columns;
        Columns.Column.forEach((element) => {
            if (element.MetaData)
                element.ColType = element.MetaData[0].Value;
        });
        const colIndexes = {
            txDate: lodash_1.default.findIndex(Columns.Column, {
                'ColType': parser_enum_1.ApArAgingParserKeys.txDate
            }),
            txnType: lodash_1.default.findIndex(Columns.Column, {
                'ColType': parser_enum_1.ApArAgingParserKeys.txnType
            }),
            docNum: lodash_1.default.findIndex(Columns.Column, {
                'ColType': parser_enum_1.ApArAgingParserKeys.docNum
            }),
            vendName: lodash_1.default.findIndex(Columns.Column, {
                'ColType': parser_enum_1.ApArAgingParserKeys.vendName
            }),
            dueDate: lodash_1.default.findIndex(Columns.Column, {
                'ColType': parser_enum_1.ApArAgingParserKeys.dueDate
            }),
            subtNegAmount: lodash_1.default.findIndex(Columns.Column, (o) => {
                return (o.ColType === parser_enum_1.ApArAgingParserKeys.subtNegHomeAmount.toString() || o.ColType === parser_enum_1.ApArAgingParserKeys.subtNegAmount.toString());
            }),
            subtNegOpenBal: lodash_1.default.findIndex(Columns.Column, (o) => {
                return (o.ColType === parser_enum_1.ApArAgingParserKeys.subtNegHomeOpenBal.toString() || o.ColType === parser_enum_1.ApArAgingParserKeys.subtNegOpenBal.toString());
            })
        };
        return colIndexes;
    }
    parse(item, colIndexes, businessId) {
        const date = moment_1.default(item.ColData[colIndexes.txDate].value).format(common_enums_1.DateFormat.date);
        let dueDate = item.ColData[colIndexes.dueDate].value;
        if (dueDate === common_constants_1.CommanParserConst.blankZeroDate) {
            logger_1.default.info('AP Entry with invalid date\n' + JSON.stringify(item));
            dueDate = date;
        }
        let newDate = moment_1.default(dueDate).format(common_enums_1.DateFormat.date);
        if (newDate === common_constants_1.CommanParserConst.invalidDate) {
            logger_1.default.info('AP Entry with invalid date\n' + JSON.stringify(item));
            console.log('Invalid Due Date:-' + dueDate);
            newDate = date;
        }
        const data = {
            businessId,
            date,
            transactionId: item.ColData[colIndexes.txnType].id,
            number: item.ColData[colIndexes.docNum].value,
            contactId: item.ColData[colIndexes.vendName].id,
            dueDate: newDate,
            amount: parseFloat(item.ColData[colIndexes.subtNegAmount].value || 0),
            balance: parseFloat(item.ColData[colIndexes.subtNegOpenBal].value || 0),
            headId: this.headId
        };
        return data;
    }
}
exports.ApAgingDetailParser = ApAgingDetailParser;
//# sourceMappingURL=ap-aging-reports.js.map