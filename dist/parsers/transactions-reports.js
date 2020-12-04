"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionParser = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const common_enums_1 = require("src/enums/common-enums");
const parser_enum_1 = require("src/enums/parser-enum");
const common_functions_1 = require("@shared/common-functions");
const response_constants_1 = require("@constants/response.constants");
const common_constants_1 = require("@constants/common.constants");
const commonFunctions = new common_functions_1.CommonFunctions();
class TransactionParser {
    parseTransactionsReport(transactionsReport, businessId, accounts, entityarr) {
        try {
            if (transactionsReport) {
                this.data = transactionsReport;
                this.coa = accounts;
            }
            else {
                throw new Error(response_constants_1.MessageConstants.qbMessages.noTransactionReportData);
            }
            const colIndexes = this.getColumnIndex();
            const rows = this.data.Rows;
            if (!rows.Row) {
                logger_1.default.info('No Entries for Transactions');
                return [];
            }
            if (entityarr) {
                let txnIndex = 1;
                transactionsReport.Columns.Column.forEach((obj, i) => {
                    if (obj.MetaData.length && obj.MetaData[0].Value === parser_enum_1.JournalReportTxnReportKeys.txnType) {
                        txnIndex = i;
                    }
                });
                const filterArr = [];
                const result = rows.Row.filter((obj) => {
                    if (obj.Summary) {
                        return true;
                    }
                    return obj.ColData.some((item, index) => {
                        return index === txnIndex && item.id && entityarr.indexOf(item.id.toString()) !== -1;
                    });
                });
                filterArr.push(result);
                rows.Row = [];
                filterArr.map((element) => {
                    element.map((nestedlement) => {
                        rows.Row.push(nestedlement);
                    });
                });
            }
            const rowLength = rows.Row.length;
            const parsedData = [];
            for (let i = 0; i < rowLength; i++) {
                const item = rows.Row[i];
                const parsedTrxn = this.parse(item, colIndexes, businessId);
                if (parsedTrxn)
                    parsedData.push(parsedTrxn);
            }
            const filterBankTransactions = lodash_1.default.filter(parsedData, (item) => {
                return item.parentAccountName === parser_enum_1.JournalReportTxnReportKeys.bank || item.parentAccountName === parser_enum_1.JournalReportTxnReportKeys.creditCard;
            });
            const sortedData = lodash_1.default.sortBy(filterBankTransactions, (item) => item.date);
            const group = lodash_1.default.chain(sortedData)
                .groupBy('contactId')
                .map((value, key) => ({ contactId: key, records: lodash_1.default.sortBy(value, (o) => o.date) }))
                .value();
            const filterArApTransactions = lodash_1.default.filter(parsedData, (item) => {
                return item.parentAccountName === parser_enum_1.JournalReportTxnReportKeys.accountsRecievable || item.parentAccountName === parser_enum_1.JournalReportTxnReportKeys.accountsPayable;
            });
            const length1 = filterArApTransactions.length;
            for (let i = 0; i < length1; i++) {
                const element = filterArApTransactions[i];
                const latestTrxn = lodash_1.default.find(group, { contactId: element.contactId });
                if (latestTrxn) {
                    if (latestTrxn.records.length > 0) {
                        element.lastBankAccountID = latestTrxn.records[latestTrxn.records.length - 1].accountId;
                        element.paidDate = latestTrxn.records[latestTrxn.records.length - 1].transactionDate;
                    }
                }
            }
            const length = parsedData.length;
            for (let index = 0; index < length; index++) {
                const element = parsedData[index];
                delete element.accountName;
                delete element.parentAccountName;
            }
            return filterArApTransactions;
        }
        catch (error) {
            logger_1.default.error(error.stack || error.message);
            throw new Error(response_constants_1.MessageConstants.qbMessages.errorWhileParsingTransactionReport);
        }
    }
    getColumnIndex() {
        const Columns = this.data.Columns;
        Columns.Column.forEach((element) => {
            if (element.MetaData)
                element.ColType = element.MetaData[0].Value;
        });
        const colIndexes = {
            txDate: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.txDate }),
            txnType: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.txnType }),
            docNum: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.docNum }),
            name: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.name }),
            accountName: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.accountName }),
            otherAccount: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.otherAccount }),
            subtNatAmount: lodash_1.default.findIndex(Columns.Column, (o) => {
                return (o.ColType === parser_enum_1.JournalReportTxnReportKeys.subtNatHomeAmount || o.ColType === parser_enum_1.JournalReportTxnReportKeys.subtNatAmount);
            }),
            dueDate: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.dueDate }),
            natOpenBal: lodash_1.default.findIndex(Columns.Column, (o) => {
                return (o.ColType === parser_enum_1.JournalReportTxnReportKeys.natHomeOpenBal || o.ColType === parser_enum_1.JournalReportTxnReportKeys.natOpenBal);
            }),
            memo: lodash_1.default.findIndex(Columns.Column, { 'ColType': parser_enum_1.JournalReportTxnReportKeys.memo }),
        };
        return colIndexes;
    }
    parse(item, colIndexes, businessId) {
        const amount = parseFloat(item.ColData[colIndexes.subtNatAmount].value || 0);
        const openBalance = parseFloat(item.ColData[colIndexes.natOpenBal].value || 0);
        const parentAccountName = this.getParentType(item.ColData[colIndexes.accountName].value, item.ColData[colIndexes.accountName].id);
        let desc = item.ColData[colIndexes.memo].value || undefined;
        if (desc != undefined) {
            desc = desc.replace('\\', '');
            desc = commonFunctions.textTruncate(desc, common_constants_1.CommanParserConst.maxLengthDesc, '...');
        }
        const data = {
            businessId,
            transactionDate: moment_1.default(item.ColData[colIndexes.txDate].value).format(common_enums_1.DateFormat.date),
            transactionId: item.ColData[colIndexes.txnType].id,
            transactionType: item.ColData[colIndexes.txnType].value,
            accountName: item.ColData[colIndexes.accountName].value,
            contactId: item.ColData[colIndexes.name].id,
            accountId: item.ColData[colIndexes.accountName].id,
            paidAmount: amount - openBalance,
            amount,
            number: item.ColData[colIndexes.docNum].value,
            dueDate: item.ColData[colIndexes.dueDate].value != common_constants_1.CommanParserConst.blankZeroDate ? moment_1.default(item.ColData[colIndexes.dueDate].value).format(common_enums_1.DateFormat.date) : null,
            lastBankAccountID: '',
            parentAccountName,
            headId: parentAccountName === parser_enum_1.JournalReportTxnReportKeys.accountsPayable ? 4 : 1,
            description: desc,
            paidDate: '1970-01-01'
        };
        return data;
    }
    getParentType(accountName, accountId) {
        const result = lodash_1.default.find(this.coa, { name: accountName });
        if (result) {
            const parentType = result.parentAccountName;
            return parentType;
        }
        else {
            let result = lodash_1.default.find(this.coa, { platformAccountId: accountId });
            if (result) {
                const parentType = result.parentAccountName;
                return parentType;
            }
            else {
                return null;
            }
        }
    }
}
exports.TransactionParser = TransactionParser;
//# sourceMappingURL=transactions-reports.js.map