"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialBalanceParser = void 0;
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const response_constants_1 = require("@constants/response.constants");
const parser_enum_1 = require("src/enums/parser-enum");
class TrialBalanceParser {
    parseTrialBalance(trialBalanceReport, businessId) {
        try {
            if (trialBalanceReport) {
                this.data = trialBalanceReport;
            }
            else {
                throw new Error(response_constants_1.MessageConstants.qbMessages.noTrialBalanceReportData);
            }
            const rows = this.data.Rows;
            if (!rows.Row) {
                logger_1.default.info('No Entries for Trial Balance');
                return [];
            }
            const colIndexes = this.getColumnIndex();
            const rowLength = rows.Row.length;
            const parsedData = [];
            for (let i = 0; i < rowLength; i++) {
                const element = rows.Row[i];
                if (element.Summary) {
                    continue;
                }
                if (element.ColData) {
                    const data = this.parse(element, colIndexes, businessId);
                    parsedData.push(data);
                }
            }
            return parsedData;
        }
        catch (error) {
            logger_1.default.error(error.stack || error.message);
            throw new Error(response_constants_1.MessageConstants.qbMessages.errorWhileParsingTrialBalance);
        }
    }
    getColumnIndex() {
        const Columns = this.data.Columns;
        const colIndexes = {
            account: _.findIndex(Columns.Column, {
                'ColTitle': '',
                'ColType': parser_enum_1.TrialBalanceKeys.account
            }),
            debit: _.findIndex(Columns.Column, {
                'ColTitle': parser_enum_1.TrialBalanceKeys.debit
            }),
            credit: _.findIndex(Columns.Column, {
                'ColTitle': parser_enum_1.TrialBalanceKeys.credit
            })
        };
        return colIndexes;
    }
    parse(row, colIndexes, businessId) {
        const data = {
            businessId,
            trialBalanceDate: this.data.Header.EndPeriod,
            debit: parseFloat(row.ColData[colIndexes.debit].value || 0),
            credit: parseFloat(row.ColData[colIndexes.credit].value || 0),
            accountId: row.ColData[colIndexes.account].id,
        };
        return data;
    }
}
exports.TrialBalanceParser = TrialBalanceParser;
//# sourceMappingURL=trial-balance.js.map