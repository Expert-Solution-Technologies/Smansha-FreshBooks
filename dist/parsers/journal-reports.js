"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalReportsParser = void 0;
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const util_1 = require("util");
const common_constants_1 = require("@constants/common.constants");
const common_enums_1 = require("src/enums/common-enums");
const parser_enum_1 = require("src/enums/parser-enum");
const common_functions_1 = require("@shared/common-functions");
const commonFunctions = new common_functions_1.CommonFunctions();
class JournalReportsParser {
    constructor() {
        this.mappings = [];
        this.logs = [];
        this.coa = [];
        this.skipped = 0;
        this.failed = 0;
        this.journalEntries = [];
    }
    parseJournalReports(journalReports, businessId, coa, entityarr, journalEntries) {
        this.skipped = this.failed = 0;
        this.mappings = [];
        if (coa && coa.length > 0) {
            this.coa = coa;
        }
        if (journalEntries && journalEntries.length > 0) {
            this.journalEntries = journalEntries;
        }
        if (journalReports && journalReports.Header && journalReports.Columns && journalReports.Rows && journalReports.Rows.Row) {
            journalReports.Columns.Column.forEach((column) => {
                if (column.MetaData) {
                    const item = _.find(column.MetaData, { Name: 'ColKey' });
                    column.ColType = item.Value || '';
                }
            });
            const indexs = this.getIndexOfColumns(journalReports.Columns.Column);
            const parsedJournalReports = [];
            if (entityarr && entityarr.length > 0) {
                let txnIndex = 1;
                journalReports.Columns.Column.forEach((obj, i) => {
                    if (obj.MetaData.length && obj.MetaData[0].Value === parser_enum_1.JournalReportTxnReportKeys.txnType) {
                        txnIndex = i;
                    }
                });
                const filterArr = [];
                const result = journalReports.Rows.Row.filter((obj) => {
                    if (obj.Summary) {
                        return true;
                    }
                    if (obj.ColData && _.isArray(obj.ColData)) {
                        return obj.ColData.some((item, index) => {
                            return index === txnIndex && item.id && entityarr.indexOf(item.id.toString()) !== -1;
                        });
                    }
                    else {
                        return false;
                    }
                });
                filterArr.push(result);
                journalReports.Rows.Row = [];
                filterArr.map((element) => {
                    element.map((nestedlement) => {
                        journalReports.Rows.Row.push(nestedlement);
                    });
                });
            }
            journalReports.Rows.Row.forEach((row) => {
                const parsedData = this.parse(indexs, row, businessId);
                if (parsedData) {
                    if (parsedData.journalDate === common_constants_1.CommanParserConst.blankZeroDate) {
                        const filterRecord = _.find(this.mappings, { transactionId: parsedData.transactionId });
                        if (filterRecord) {
                            parsedData.journalDate = filterRecord.journalDate;
                            parsedData.transactionType = filterRecord.transactionType;
                            parsedData.contactId = filterRecord.contactId;
                            if (!util_1.isNullOrUndefined(filterRecord.isReconciled)) {
                                parsedData.isReconciled = filterRecord.isReconciled;
                            }
                            if (filterRecord.number) {
                                parsedData.number = filterRecord.number;
                            }
                        }
                        else {
                            const filterObject = _.filter(journalReports.Rows.Row, { ColData: [{ id: String(parsedData.transactionId) }] });
                            if (filterObject) {
                                filterObject.filter((item) => {
                                    if (parsedData != null && item.ColData[0].value !== common_constants_1.CommanParserConst.blankZeroDate) {
                                        parsedData.journalDate = item.ColData[0].value;
                                        if (item.ColData[1].value) {
                                            parsedData.transactionType = item.ColData[1].value;
                                        }
                                        if (item.ColData[3].id) {
                                            parsedData.contactId = item.ColData[3].id;
                                        }
                                        if (!util_1.isNullOrUndefined(item.isReconciled)) {
                                            parsedData.isReconciled = item.isReconciled;
                                        }
                                    }
                                    else {
                                    }
                                });
                            }
                        }
                    }
                    parsedJournalReports.push(parsedData);
                }
            });
            if (parsedJournalReports.length > 0 && this.journalEntries.length > 0) {
                this.mapJournalEntryContactId(this.journalEntries, parsedJournalReports);
            }
            this.logs.push('Total Skipped JV Records:- ' + this.skipped);
            this.logs.push('Total Failed JV Records:- ' + this.failed);
            this.logs.push('Total Parsed JV Records:- ' + parsedJournalReports.length);
            this.logs.push('\n-------------------------------------------\n');
            return parsedJournalReports;
        }
        else {
            logger_1.default.info('busResMsg.noJouralReportsData');
            return [];
        }
    }
    parse(columnIndexes, row, businessId) {
        if (row.Summary) {
            this.skipped++;
            return null;
        }
        const date = row.ColData[columnIndexes.txDate].value;
        const isCleared = row.ColData[columnIndexes.isCleared].value;
        const data = {
            'journalDate': (date !== common_constants_1.CommanParserConst.blankZeroDate && date !== '') ? moment_1.default(row.ColData[columnIndexes.txDate].value).format(common_enums_1.DateFormat.dateTime) : row.ColData[columnIndexes.txDate].value,
            'transactionId': row.ColData[columnIndexes.txnType].id,
            'transactionType': row.ColData[columnIndexes.txnType].value,
            'contactId': row.ColData[columnIndexes.name].id === '' ? '0' : row.ColData[columnIndexes.name].id,
            'isReconciled': (isCleared === 'R' || isCleared === 'C') ? true : false,
            'number': row.ColData[columnIndexes.docNum].value,
        };
        const filterRecord = _.filter(this.mappings, { transactionId: data.transactionId });
        if ((data.journalDate !== common_constants_1.CommanParserConst.blankZeroDate && data.journalDate !== '') && filterRecord.length === 0) {
            this.mappings.push(data);
        }
        const creditAmount = row.ColData[columnIndexes.creditAmt].value === '' ? 0 : parseFloat(row.ColData[columnIndexes.creditAmt].value);
        const debitAmount = row.ColData[columnIndexes.debtAmt].value === '' ? 0 : parseFloat(row.ColData[columnIndexes.debtAmt].value);
        const accountName = row.ColData[columnIndexes.accountName].value;
        const accountId = row.ColData[columnIndexes.accountName].id;
        if ((creditAmount == NaN) && (debitAmount == NaN)) {
            this.skipped++;
            return null;
        }
        if ((creditAmount === 0) && (debitAmount === 0)) {
            this.skipped++;
            return null;
        }
        const calculateAmount = this.calculateAmount(creditAmount, debitAmount, accountName, accountId);
        if (calculateAmount == null) {
            this.logs.push(JSON.stringify(row));
            return null;
        }
        let desc = row.ColData[columnIndexes.memo].value;
        desc = desc.replace('\\', '');
        if (desc !== undefined) {
            desc = commonFunctions.textTruncate(desc, common_constants_1.CommanParserConst.maxLengthDesc, '...');
        }
        const parseData = {
            'businessId': businessId,
            'journalDate': row.ColData[columnIndexes.txDate].value !== common_constants_1.CommanParserConst.blankZeroDate ? moment_1.default(row.ColData[columnIndexes.txDate].value).format(common_enums_1.DateFormat.dateTime) : row.ColData[columnIndexes.txDate].value,
            'transactionId': row.ColData[columnIndexes.txnType].id,
            'transactionType': row.ColData[columnIndexes.txnType].value,
            'number': row.ColData[columnIndexes.docNum].value,
            'contactId': row.ColData[columnIndexes.name].id === '' ? '0' : row.ColData[columnIndexes.name].id,
            'description': desc,
            'accountId': row.ColData[columnIndexes.accountName].id,
            'amount': calculateAmount,
            'isReconciled': (isCleared === 'R' || isCleared === 'C') ? true : false
        };
        return parseData;
    }
    getIndexOfColumns(Columns) {
        const indexs = {
            txDate: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.txDate }),
            txnType: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.txnType }),
            docNum: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.docNum }),
            name: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.name }),
            memo: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.memo }),
            debtAmt: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.debtAmt }),
            creditAmt: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.creditAmt }),
            accountName: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.accountName }),
            isCleared: _.findIndex(Columns, { ColType: parser_enum_1.JournalReportTxnReportKeys.isCleared })
        };
        return indexs;
    }
    calculateAmount(creditAmount, DebitAmount, accountName, accountId) {
        const cAmount = creditAmount || 0;
        const dAmount = DebitAmount || 0;
        const type1 = [parser_enum_1.JournalReportTxnReportKeys.asset, parser_enum_1.JournalReportTxnReportKeys.expense];
        const type2 = [parser_enum_1.JournalReportTxnReportKeys.liability, parser_enum_1.JournalReportTxnReportKeys.equity, parser_enum_1.JournalReportTxnReportKeys.revenue];
        const parentType = this.getParentType(accountName, accountId);
        if (parentType === undefined)
            return null;
        if (type2.includes(parentType)) {
            const amount = Number(cAmount) - Number(dAmount);
            return amount;
        }
        else if (type1.includes(parentType)) {
            const amount = Number(dAmount) - Number(cAmount);
            return amount;
        }
        else {
            return null;
        }
    }
    getParentType(accountName, accountId) {
        const result = _.find(this.coa, { name: accountName });
        if (result) {
            const parentType = result.classification;
            return parentType;
        }
        else {
            let result = _.find(this.coa, { platformAccountId: accountId });
            if (result) {
                const parentType = result.classification;
                return parentType;
            }
            else {
                this.failed++;
                this.logs.push('Failed:- Coa Not Found :-' + accountName);
                return null;
            }
        }
    }
    mapJournalEntryContactId(journalEntries, jvRecords) {
        const filteredJvRecords = _.filter(jvRecords, { transactionType: 'Journal Entry' });
        journalEntries.map((jeElement) => {
            if (jeElement.Line && jeElement.Line.length > 0) {
                const foundJvObjects = _.filter(filteredJvRecords, { transactionId: jeElement.Id });
                if (foundJvObjects.length > 0) {
                    jeElement.Line.map((lineItem) => {
                        if (lineItem.JournalEntryLineDetail && lineItem.JournalEntryLineDetail.Entity && (lineItem.JournalEntryLineDetail.Entity.Type === 'Customer' || lineItem.JournalEntryLineDetail.Entity.Type === 'Vendor' || lineItem.JournalEntryLineDetail.Entity.Type === 'Employee')) {
                            foundJvObjects.map((obj) => {
                                if (Math.abs(obj.amount) === lineItem.Amount && obj.accountId === lineItem.JournalEntryLineDetail.AccountRef.value) {
                                    obj.contactId = lineItem.JournalEntryLineDetail.Entity.EntityRef.value;
                                }
                            });
                        }
                    });
                }
            }
        });
        return jvRecords;
    }
}
exports.JournalReportsParser = JournalReportsParser;
//# sourceMappingURL=journal-reports.js.map