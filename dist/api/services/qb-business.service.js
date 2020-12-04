"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QbBusinessService = void 0;
const tslib_1 = require("tslib");
const http_service_1 = require("@shared/http.service");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const qb_service_1 = require("./qb.service");
const business_1 = require("src/parsers/business");
const access_tokens_1 = require("src/parsers/access-tokens");
const contacts_1 = require("src/parsers/contacts");
const account_1 = require("src/parsers/account");
const trial_balance_1 = require("src/parsers/trial-balance");
const ar_aging_reports_1 = require("src/parsers/ar-aging-reports");
const journal_reports_1 = require("src/parsers/journal-reports");
const response_constants_1 = require("@constants/response.constants");
const qb_contact_type_enums_1 = require("src/enums/qb-contact-type-enums");
const operation_type_enum_1 = require("src/enums/operation-type-enum");
const entity_type_enum_1 = require("src/enums/entity-type-enum");
const queue_connector_1 = require("@shared/queue-connector");
const common_functions_1 = require("@shared/common-functions");
const common_enums_1 = require("src/enums/common-enums");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const util_1 = require("util");
const moment_1 = tslib_1.__importDefault(require("moment"));
const reload_enum_1 = require("src/enums/reload-enum");
const payment_1 = require("src/parsers/payment");
const transactions_reports_1 = require("src/parsers/transactions-reports");
const parser_enum_1 = require("src/enums/parser-enum");
const ap_aging_reports_1 = require("src/parsers/ap-aging-reports");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const qbService = new qb_service_1.QbService();
const chartOfAccountParser = new account_1.ChartOfAccountParser();
const trialBalanceParser = new trial_balance_1.TrialBalanceParser();
const arAgingDetailParser = new ar_aging_reports_1.ArAgingDetailParser();
const commonFunctions = new common_functions_1.CommonFunctions();
const paymentParser = new payment_1.PaymentParser();
const journalReportsParser = new journal_reports_1.JournalReportsParser();
const transactionParser = new transactions_reports_1.TransactionParser();
const apAgingDetailParser = new ap_aging_reports_1.ApAgingDetailParser();
class QbBusinessService {
    constructor() {
        this.httpService = new http_service_1.HttpService();
    }
    saveBusiness(instituteId, callbackString, realmId, userId, leadId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const accessTokens = yield qbService.getQbCallback(instituteId, callbackString);
            const businessInfo = yield qbService.getBusinessInfo(instituteId, accessTokens.access_token, realmId);
            const preferences = yield qbService.getBusinessPreferences(instituteId, accessTokens.access_token, realmId);
            if (businessInfo) {
                const parsedBusiness = business_1.BusinessParser.parseBusiness(businessInfo, realmId);
                const businessAddress = business_1.BusinessParser.parseBusinessAddress(businessInfo);
                const parsedAccessToken = access_tokens_1.AccessTokenParser.parseAccessTokens(accessTokens);
                parsedBusiness.homeCurrency = preferences.CurrencyPrefs.HomeCurrency.value;
                if (parsedBusiness.email === undefined) {
                    parsedBusiness.email = '';
                }
                parsedBusiness.leadId = leadId;
                const requestBody = {
                    'business': parsedBusiness,
                    'token': parsedAccessToken,
                    'address': businessAddress
                };
                console.log(JSON.stringify(requestBody));
                const response = yield this.httpService.post(process.env.SMAI_ONBOARDING_API_URL + 'business/', requestBody);
                if (response.data.status) {
                    const business = response.data.data;
                    const timezone = 'America/Los_Angeles';
                    const businessId = response.data.data.id;
                    this.saveCompanyData(instituteId, realmId, accessTokens.access_token, businessId, timezone, business.fiscalYearStartMonth);
                    return response.data;
                }
                else {
                    return response_constants_1.MessageConstants.qbMessages.failedToConnectQbBusiness;
                }
            }
            else {
                return response_constants_1.MessageConstants.qbMessages.emptyQbBusinessInfo;
            }
        });
    }
    saveCompanyData(instituteId, realmId, accessToken, businessId, timezone, fiscalYearStartMonth) {
        this.saveContacts(instituteId, accessToken, realmId, businessId);
        this.saveChartOfAccounts(instituteId, accessToken, realmId, businessId, timezone);
        this.saveTrialBalanceReport(instituteId, accessToken, realmId, businessId, timezone, fiscalYearStartMonth);
        this.saveArApAgingReports(instituteId, accessToken, realmId, businessId, timezone);
        this.savePayments(instituteId, accessToken, realmId, businessId, timezone);
    }
    saveContacts(instituteId, accessToken, realmId, businessId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const customers = yield this.saveCustomers(instituteId, accessToken, realmId, businessId);
            const employees = yield this.saveEmployees(instituteId, accessToken, realmId, businessId);
            const vendors = yield this.saveVendors(instituteId, accessToken, realmId, businessId);
            const parsedContacts = customers.concat(employees, vendors);
            this.prepareAndSendQueueData(entity_type_enum_1.EntityType.contact, operation_type_enum_1.OperationType.CREATE, businessId, parsedContacts);
            logger_1.default.info('Contacts: businessId: ' + businessId + ' total: ' + parsedContacts.length);
        });
    }
    saveArApAgingReports(instituteId, accessToken, realmId, businessId, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const arReports = yield this.saveArAgingDetailsReport(instituteId, accessToken, realmId, businessId, timezone);
            const apReports = yield this.saveApAgingDetailsReport(instituteId, accessToken, realmId, businessId, timezone);
            const parsedArAaReports = arReports.concat(apReports);
            this.prepareAndSendQueueData(entity_type_enum_1.EntityType.arAging, operation_type_enum_1.OperationType.CREATE, businessId, parsedArAaReports);
            logger_1.default.info('ArAp: businessId: ' + businessId + ' total: ' + parsedArAaReports.length);
        });
    }
    saveEmployees(instituteId, accessToken, realmId, businessId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const allEmployees = yield qbService.getBusinessEmployees(instituteId, accessToken, realmId);
            if (allEmployees && allEmployees.length > 0) {
                const parsedEmployees = contacts_1.ContactParser.parseContacts(allEmployees, businessId, qb_contact_type_enums_1.ContactType.employee);
                logger_1.default.info('employee Fetched: businessId: ' + businessId + ' total: ' + parsedEmployees.length);
                return parsedEmployees;
            }
            else {
                logger_1.default.info('No employee Fetched: businessId: ' + businessId);
            }
        });
    }
    saveCustomers(instituteId, accessToken, realmId, businessId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const allCustomers = yield qbService.getBusinessCustomers(instituteId, accessToken, realmId);
            if (allCustomers && allCustomers.length > 0) {
                const parsedCustomers = contacts_1.ContactParser.parseContacts(allCustomers, businessId, qb_contact_type_enums_1.ContactType.customer);
                logger_1.default.info('customers Fetched: businessId: ' + businessId + ' total: ' + parsedCustomers.length);
                return parsedCustomers;
            }
            else {
                logger_1.default.info('No customers Fetched: businessId: ' + businessId);
            }
        });
    }
    saveVendors(instituteId, accessToken, realmId, businessId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const allVendors = yield qbService.getBusinessVendors(instituteId, accessToken, realmId);
            if (allVendors && allVendors.length > 0) {
                const parsedVendors = contacts_1.ContactParser.parseContacts(allVendors, businessId, qb_contact_type_enums_1.ContactType.vendor);
                logger_1.default.info('Vendors fetched: businessId: ' + businessId + ' total: ' + parsedVendors.length);
                return parsedVendors;
            }
            else {
                logger_1.default.info('No vendors fetched: businessId: ' + businessId);
            }
        });
    }
    saveChartOfAccounts(instituteId, accessToken, realmId, businessId, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const allChartOfAccounts = yield qbService.getBusinessChartOfAccounts(instituteId, accessToken, realmId);
            if (allChartOfAccounts && allChartOfAccounts.length > 0) {
                const parsedChartOfAccounts = chartOfAccountParser.parseChartofAccounts(allChartOfAccounts, businessId);
                this.prepareAndSendQueueData(entity_type_enum_1.EntityType.account, operation_type_enum_1.OperationType.CREATE, businessId, parsedChartOfAccounts);
                logger_1.default.info('Chart of accounts fetched: businessId: ' + businessId + ' total: ' + parsedChartOfAccounts.length);
                this.saveLatestJournalReport(instituteId, accessToken, realmId, businessId, parsedChartOfAccounts, timezone);
                this.saveTransactionReport(instituteId, accessToken, realmId, businessId, parsedChartOfAccounts, timezone);
            }
            else {
                logger_1.default.info('No chart of accounts fetched: businessId: ' + businessId);
            }
        });
    }
    savePayments(instituteId, accessToken, realmId, businessId, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const allPayments = [];
                const startDate = moment_1.default(commonFunctions.addMonths(-24, timezone, true)).format(common_enums_1.DateFormat.date);
                const endDate = moment_timezone_1.default(moment_timezone_1.default.now()).add(180, common_enums_1.TimeUnitKeys.days).tz(timezone).format(common_enums_1.DateFormat.date);
                const paymentThrd = qbService.getAllPayments(instituteId, realmId, accessToken, startDate, endDate);
                const billPaymentThrd = qbService.getAllBillPayments(instituteId, realmId, accessToken, startDate, endDate);
                const allProcesses = yield Promise.all([paymentThrd, billPaymentThrd]);
                if (allProcesses[0] && allProcesses[0].length > 0) {
                    let parsePayment;
                    for (const pymnt of allProcesses[0]) {
                        if (!pymnt.status || pymnt.status !== reload_enum_1.ReloadServiceKeys.deleted) {
                            parsePayment = paymentParser.parsePayment(pymnt, businessId);
                            if (parsePayment.length > 0) {
                                allPayments.push(...parsePayment);
                            }
                        }
                    }
                }
                if (allProcesses[1] && allProcesses[1].length > 0) {
                    let parseBillPayment;
                    for (const bilPymnt of allProcesses[1]) {
                        if (!bilPymnt.status || bilPymnt.status !== reload_enum_1.ReloadServiceKeys.deleted) {
                            parseBillPayment = paymentParser.parseBillPayment(bilPymnt, businessId);
                            if (parseBillPayment.length > 0) {
                                allPayments.push(...parseBillPayment);
                            }
                        }
                    }
                }
                if (allPayments && allPayments.length > 0) {
                    this.prepareAndSendQueueData(entity_type_enum_1.EntityType.payments, operation_type_enum_1.OperationType.CREATE, businessId, allPayments);
                    logger_1.default.info('Payments Fetched: businessId: ' + businessId + ' total: ' + allPayments.length);
                }
                else {
                    logger_1.default.info('No payments Fetched: businessId: ' + businessId);
                }
            }
            catch (error) {
                logger_1.default.error('Fetching Payments Failed:-' + error);
            }
        });
    }
    saveTrialBalanceReport(instituteId, accessToken, realmId, businessId, timezone, fiscalYearStartMonth) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lastYearDate = commonFunctions.addMonths(-12, timezone, true).substring(0, 10);
            const previousMonth = commonFunctions.addMonths(0, timezone, true).substring(0, 10);
            const currentDate = moment_timezone_1.default(moment_timezone_1.default.now()).tz(timezone).format(common_enums_1.DateFormat.date);
            const promises = [];
            promises.push(qbService.getTrialBalance(instituteId, accessToken, realmId, lastYearDate, lastYearDate));
            promises.push(qbService.getTrialBalance(instituteId, accessToken, realmId, previousMonth, previousMonth));
            promises.push(qbService.getTrialBalance(instituteId, accessToken, realmId, currentDate, currentDate));
            const results = yield Promise.all(promises);
            const tb1 = results[0];
            const tb2 = results[1];
            const tb3 = results[2];
            let parsedTrialBalancereport = [];
            if (util_1.isArray(tb1.Rows.Row)) {
                parsedTrialBalancereport = parsedTrialBalancereport.concat(trialBalanceParser.parseTrialBalance(tb1, businessId));
            }
            if (util_1.isArray(tb2.Rows.Row)) {
                parsedTrialBalancereport = parsedTrialBalancereport.concat(trialBalanceParser.parseTrialBalance(tb2, businessId));
            }
            if (util_1.isArray(tb3.Rows.Row)) {
                parsedTrialBalancereport = parsedTrialBalancereport.concat(trialBalanceParser.parseTrialBalance(tb3, businessId));
            }
            logger_1.default.info('Trial Balance Fetched: businessId: ' + businessId + ' total: ' + parsedTrialBalancereport.length);
            if (parsedTrialBalancereport.length > 0) {
                this.prepareAndSendQueueData(entity_type_enum_1.EntityType.trialBalance, operation_type_enum_1.OperationType.CREATE, businessId, parsedTrialBalancereport);
            }
            this.savePrvYrTrialBalanceReport(instituteId, accessToken, realmId, businessId, timezone, fiscalYearStartMonth);
        });
    }
    savePrvYrTrialBalanceReport(instituteId, accessToken, realmId, businessId, timezone, fiscalYearStartMonth) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const currentDate = moment_timezone_1.default(moment_timezone_1.default.now()).tz(timezone).format(common_enums_1.DateFormat.date);
            const crntDate = new Date(currentDate);
            const fisclYrDt = new Date(Date.parse(fiscalYearStartMonth + ' 1, ' + crntDate.getUTCFullYear()));
            if (fisclYrDt > crntDate) {
                fisclYrDt.setFullYear(fisclYrDt.getUTCFullYear() - 1);
            }
            const rcntFisclYrDt = commonFunctions.addMonths(0, timezone, true, fisclYrDt).substring(0, 10);
            const lstFisclYrDt = commonFunctions.addMonths(-12, timezone, true, fisclYrDt).substring(0, 10);
            const dates = {
                fiscalYearStartMonth, currentDate,
                rcntFisclYrDt, lstFisclYrDt
            };
            const promises = [];
            promises.push(qbService.getTrialBalance(instituteId, accessToken, realmId, rcntFisclYrDt, rcntFisclYrDt));
            promises.push(qbService.getTrialBalance(instituteId, accessToken, realmId, lstFisclYrDt, lstFisclYrDt));
            const results = yield Promise.all(promises);
            const tb1 = results[0];
            const tb2 = results[1];
            let parsedTrialBalancereport = [];
            if (util_1.isArray(tb1.Rows.Row)) {
                parsedTrialBalancereport = parsedTrialBalancereport.concat(trialBalanceParser.parseTrialBalance(tb1, businessId));
            }
            if (util_1.isArray(tb2.Rows.Row)) {
                parsedTrialBalancereport = parsedTrialBalancereport.concat(trialBalanceParser.parseTrialBalance(tb2, businessId));
            }
            logger_1.default.info('Previous Year Trial Balance Fetched: businessId' + businessId + ' total: ' + parsedTrialBalancereport.length);
            if (parsedTrialBalancereport.length > 0) {
                this.prepareAndSendQueueData(entity_type_enum_1.EntityType.trialBalance, operation_type_enum_1.OperationType.CREATE, businessId, parsedTrialBalancereport);
            }
        });
    }
    saveArAgingDetailsReport(instituteId, accessToken, realmId, businessId, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reportDate = moment_timezone_1.default(moment_timezone_1.default.now()).tz(timezone).format(common_enums_1.DateFormat.date);
            const arAgingDetails = yield qbService.getArAgingDetail(instituteId, accessToken, realmId, reportDate);
            if (arAgingDetails) {
                const parsedArAgingDetails = arAgingDetailParser.parseArAgingReport(arAgingDetails, businessId, parser_enum_1.ApArAgingHeadId.headIdAr);
                logger_1.default.info('ARAging Fetched: businessId ' + businessId + ' total: ' + parsedArAgingDetails.length);
                return parsedArAgingDetails;
            }
        });
    }
    saveApAgingDetailsReport(instituteId, accessToken, realmId, businessId, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const reportDate = moment_timezone_1.default(moment_timezone_1.default.now()).tz(timezone).format(common_enums_1.DateFormat.date);
            const apAgingDetails = yield qbService.getApAgingDetail(instituteId, accessToken, realmId, reportDate);
            if (apAgingDetails) {
                const parsedApAgingDetails = apAgingDetailParser.parseApAgingReport(apAgingDetails, businessId, parser_enum_1.ApArAgingHeadId.headIdAp);
                logger_1.default.info('APAging Fetched: businessId ' + businessId + ' total: ' + parsedApAgingDetails.length);
                return parsedApAgingDetails;
            }
        });
    }
    saveLatestJournalReport(instituteId, accessToken, realmId, businessId, accounts, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let journalEntries = [];
            const startDate = moment_1.default(commonFunctions.addMonths(-24, timezone, true)).format(common_enums_1.DateFormat.date);
            const endDate = moment_timezone_1.default(moment_timezone_1.default.now()).add(180, common_enums_1.TimeUnitKeys.days).tz(timezone).format(common_enums_1.DateFormat.date);
            if (!accounts) {
                logger_1.default.error('No charts of Accounts Found');
                return;
            }
            const startJeDate = moment_1.default(new Date(startDate), common_enums_1.DateFormat.dateTimeIso).subtract(1, 'day').format(common_enums_1.DateFormat.dateTimeIso);
            const endJeDate = moment_1.default(new Date(endDate), common_enums_1.DateFormat.dateTimeIso).add(1, 'day').format(common_enums_1.DateFormat.dateTimeIso);
            journalEntries = yield qbService.getJournalEntryData(instituteId, accessToken, realmId, startJeDate, endJeDate);
            const journalInfo = yield qbService.getJournalReports(instituteId, accessToken, realmId, startDate, endDate);
            if (journalInfo) {
                const parsedJV = journalReportsParser.parseJournalReports(journalInfo, businessId, accounts, [], journalEntries);
                this.prepareAndSendQueueData(entity_type_enum_1.EntityType.jv, operation_type_enum_1.OperationType.CREATE, businessId, parsedJV);
                logger_1.default.info('JV Fetched: businessId: ' + businessId + ' total: ' + parsedJV.length);
            }
        });
    }
    saveTransactionReport(instituteId, accessToken, realmId, businessId, accounts, timezone) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const startDate = moment_1.default(commonFunctions.addMonths(-24, timezone, true)).format(common_enums_1.DateFormat.date);
            const endDate = moment_timezone_1.default(moment_timezone_1.default.now()).add(180, common_enums_1.TimeUnitKeys.days).tz(timezone).format(common_enums_1.DateFormat.date);
            const transactionInfo = yield qbService.getTransactionsReports(instituteId, accessToken, realmId, startDate, endDate);
            if (transactionInfo) {
                const parsedTrxns = transactionParser.parseTransactionsReport(transactionInfo, businessId, accounts);
                this.prepareAndSendQueueData(entity_type_enum_1.EntityType.transactions, operation_type_enum_1.OperationType.CREATE, businessId, parsedTrxns);
                logger_1.default.info('Transactions fetched: businessId: ' + businessId + ' total: ' + parsedTrxns.length);
            }
        });
    }
    prepareAndSendQueueData(entityType, operationType, businessId, data) {
        const queueData = {
            metadata: {
                entity: entityType,
                operation: operationType,
                timestamp: new Date().toISOString(),
                source: process.env.RABBITQUEUE_SENDER,
                destination: process.env.RABBITQUEUE_RECEIVER,
                businessId
            },
            data
        };
        if (entityType === entity_type_enum_1.EntityType.jv) {
            try {
                fs_extra_1.default.writeFile('jv-' + businessId + '.json', JSON.stringify(queueData));
            }
            catch (error) {
                logger_1.default.error(error);
            }
        }
        queue_connector_1.QueueConnector.sendMessageToQueue(process.env.RABBITQUEUE_RECEIVER, queueData);
    }
}
exports.QbBusinessService = QbBusinessService;
//# sourceMappingURL=qb-business.service.js.map