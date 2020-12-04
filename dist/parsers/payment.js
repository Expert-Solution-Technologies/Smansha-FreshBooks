"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentParser = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const general_exceptions_constants_1 = require("src/custom-exceptions/general-exceptions.constants");
const response_constants_1 = require("@constants/response.constants");
const http_exception_1 = tslib_1.__importDefault(require("src/custom-exceptions/http.exception"));
class PaymentParser {
    parsePayment(payment, businessId) {
        try {
            const resPaymnets = [];
            let parseData;
            if (payment.Line && payment.Line.length > 0) {
                for (const itemPay of payment.Line) {
                    parseData = {};
                    parseData.businessId = businessId;
                    parseData.amount = itemPay.Amount;
                    if (itemPay.LinkedTxn && itemPay.LinkedTxn.length > 0) {
                        parseData.transactionId = itemPay.LinkedTxn[0].TxnId;
                        if (itemPay.LinkedTxn[0].TxnType && String(itemPay.LinkedTxn[0].TxnType).toLowerCase() === 'invoice') {
                            parseData.transactionType = 'Payment';
                        }
                        else {
                            parseData.transactionType = itemPay.LinkedTxn[0].TxnType;
                        }
                    }
                    else {
                        continue;
                    }
                    if (itemPay.LineEx && itemPay.LineEx.any && itemPay.LineEx.any.length > 0) {
                        for (const item of itemPay.LineEx.any) {
                            if (item.value.Name === 'txnReferenceNumber') {
                                parseData.refNumber = item.value.Value;
                                break;
                            }
                        }
                    }
                    else {
                    }
                    parseData.paymentId = payment.Id;
                    parseData.paidDate = payment.TxnDate;
                    if (payment.CustomerRef) {
                        parseData.contactId = payment.CustomerRef.value;
                    }
                    else {
                        continue;
                    }
                    if (payment.DepositToAccountRef) {
                        parseData.bankId = payment.DepositToAccountRef.value;
                    }
                    else {
                    }
                    parseData.active = true;
                    resPaymnets.push(parseData);
                }
            }
            return resPaymnets;
        }
        catch (error) {
            logger_1.default.error(error.stack || error.message);
            throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.MessageConstants.qbMessages.errorWhileGettingBusinessToken);
        }
    }
    parseBillPayment(billPayment, businessId) {
        try {
            const resPaymnets = [];
            let parseData;
            if (billPayment.Line && billPayment.Line.length > 0) {
                for (const item of billPayment.Line) {
                    parseData = {};
                    parseData.businessId = businessId;
                    parseData.amount = item.Amount;
                    if (item.LinkedTxn && item.LinkedTxn.length > 0) {
                        parseData.transactionId = item.LinkedTxn[0].TxnId;
                        if (item.LinkedTxn[0].TxnType && String(item.LinkedTxn[0].TxnType).toLowerCase() === 'bill') {
                            parseData.transactionType = 'BillPayment';
                        }
                        else {
                            parseData.transactionType = item.LinkedTxn[0].TxnType;
                        }
                    }
                    else {
                        continue;
                    }
                    parseData.paymentId = billPayment.Id;
                    parseData.paidDate = billPayment.TxnDate;
                    parseData.refNumber = billPayment.DocNumber;
                    if (billPayment.VendorRef) {
                        parseData.contactId = billPayment.VendorRef.value;
                    }
                    else {
                        continue;
                    }
                    if (billPayment.CheckPayment && billPayment.CheckPayment.BankAccountRef) {
                        parseData.bankId = billPayment.CheckPayment.BankAccountRef.value;
                    }
                    else if (billPayment.CreditCardPayment && billPayment.CreditCardPayment.CCAccountRef) {
                        parseData.bankId = billPayment.CreditCardPayment.CCAccountRef.value;
                    }
                    else {
                    }
                    parseData.active = true;
                    resPaymnets.push(parseData);
                }
            }
            return resPaymnets;
        }
        catch (error) {
            logger_1.default.error(error.stack || error.message);
            throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.MessageConstants.qbMessages.errorWhileGettingBusinessToken);
        }
    }
}
exports.PaymentParser = PaymentParser;
//# sourceMappingURL=payment.js.map