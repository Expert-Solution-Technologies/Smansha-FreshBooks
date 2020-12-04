"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QbService = void 0;
const tslib_1 = require("tslib");
const rest_urls_constants_1 = require("@constants/rest-urls.constants");
const common_functions_1 = require("@shared/common-functions");
const http_service_1 = require("@shared/http.service");
const http_exception_1 = tslib_1.__importDefault(require("src/custom-exceptions/http.exception"));
const general_exceptions_constants_1 = require("src/custom-exceptions/general-exceptions.constants");
const response_constants_1 = tslib_1.__importDefault(require("@constants/response.constants"));
const OAuthClient = require('intuit-oauth');
const http = new http_service_1.HttpService();
const commonFunctions = new common_functions_1.CommonFunctions();
class QbService {
    getQbAuthorizationUri(leadId, instituteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            const authUri = oauthClient.authorizeUri({
                scope: [OAuthClient.scopes.Accounting,
                    OAuthClient.scopes.OpenId],
                state: JSON.stringify({ leadId, instituteId })
            });
            return authUri;
        });
    }
    getQbCallback(instituteId, callbackURL) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            const authResponse = yield oauthClient.createToken(callbackURL);
            return authResponse.json;
        });
    }
    getBusinessInfo(instituteId, accessToken, realmId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const urlString = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessInfo, [realmId]);
            const response = yield this.makeApiCall(oauthClient, urlString);
            if (response && response.json) {
                return response.json.QueryResponse.CompanyInfo[0];
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessInfo);
            }
        });
    }
    getBusinessPreferences(instituteId, accessToken, realmId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessPreference, [realmId]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.Preferences[0];
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessPreferences);
            }
        });
    }
    getBusinessEmployees(instituteId, accessToken, realmId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessEmployees, [realmId]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.Employee;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessEmployees);
            }
        });
    }
    getBusinessCustomers(instituteId, accessToken, realmId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessCustomers, [realmId]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.Customer;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessEmployees);
            }
        });
    }
    getBusinessVendors(instituteId, accessToken, realmId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessVendors, [realmId]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.Vendor;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessVendors);
            }
        });
    }
    getBusinessChartOfAccounts(instituteId, accessToken, realmId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessChartOfAccount, [realmId]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.Account;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessChartOfAccounts);
            }
        });
    }
    getAllPayments(instituteId, relmId, token, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: token });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.payment, [relmId, startDate, endDate]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.Payment;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessPayments);
            }
        });
    }
    getAllBillPayments(instituteId, relmId, token, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: token });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.billPayment, [relmId, startDate, endDate]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json.QueryResponse.BillPayment;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessPayments);
            }
        });
    }
    getTrialBalance(instituteId, accessToken, realmId, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessTrialBalance, [realmId, startDate, endDate]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessTrailBalance);
            }
        });
    }
    getArAgingDetail(instituteId, accessToken, realmId, reportDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessARAgingReport, [realmId, reportDate]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessARAgingReport);
            }
        });
    }
    getApAgingDetail(instituteId, accessToken, realmId, reportDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessAPAgingReport, [realmId, reportDate]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json) {
                return response.json;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessAPAgingReport);
            }
        });
    }
    getJournalEntryData(instituteId, accessToken, realmId, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            yield oauthClient.setToken({ access_token: accessToken });
            const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessJVEntry, [realmId, startDate, endDate]);
            const response = yield this.makeApiCall(oauthClient, url);
            if (response && response.json && response.json.QueryResponse) {
                return response.json.QueryResponse.JournalEntry;
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessJVEnteries);
            }
        });
    }
    getJournalReports(instituteId, accessToken, realmId, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            const datesRange = commonFunctions.getDateGroupsBetweenTwoDays(startDate, endDate, 60);
            if (datesRange && datesRange.length > 0) {
                const promises = [];
                const length = datesRange.length;
                for (let i = 0; i < length; i++) {
                    const element = datesRange[i];
                    yield oauthClient.setToken({ access_token: accessToken });
                    const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessJVReports, [realmId, element.start, element.end]);
                    promises.push(this.makeApiCall(oauthClient, url));
                }
                const response = yield Promise.all(promises);
                const resLength = response.length;
                let temp = [];
                const rows = [];
                for (let i = 0; i < resLength; i++) {
                    const element = response[i].json;
                    if (i === 0) {
                        temp = element;
                        if (element.Rows && element.Rows.Row) {
                            rows.push(...element.Rows.Row);
                        }
                    }
                    else {
                        if (element.Rows && element.Rows.Row) {
                            rows.push(...element.Rows.Row);
                        }
                    }
                }
                if (temp) {
                    temp.Rows.Row = rows;
                    return temp;
                }
                else {
                    throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessJVReports);
                }
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorInJVDates);
            }
        });
    }
    getTransactionsReports(instituteId, accessToken, realmId, startDate, endDate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const oauthClient = yield this.getOauthClient(instituteId);
            const datesRange = commonFunctions.getDateGroupsBetweenTwoDays(startDate, endDate, 60);
            if (datesRange && datesRange.length > 0) {
                const promises = [];
                const length = datesRange.length;
                for (let i = 0; i < length; i++) {
                    const element = datesRange[i];
                    yield oauthClient.setToken({ access_token: accessToken });
                    const url = commonFunctions.stringFormatingInURL(rest_urls_constants_1.QbUrlsConstants.businessTransactionReports, [realmId, element.start, element.end]);
                    promises.push(this.makeApiCall(oauthClient, url));
                }
                const response = yield Promise.all(promises);
                const resLength = response.length;
                let temp = [];
                const rows = [];
                for (let i = 0; i < resLength; i++) {
                    const element = response[i].json;
                    if (i === 0) {
                        temp = element;
                        if (element.Rows && element.Rows.Row) {
                            rows.push(...element.Rows.Row);
                        }
                    }
                    else {
                        if (element.Rows && element.Rows.Row) {
                            rows.push(...element.Rows.Row);
                        }
                    }
                }
                if (temp) {
                    temp.Rows.Row = rows;
                    return temp;
                }
                else {
                    throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorWhileGettingBusinessTransactionReports);
                }
            }
            else {
                throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.default.qbMessages.errorInTransactionDates);
            }
        });
    }
    makeApiCall(oauthClient, urlString) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return oauthClient.makeApiCall({
                url: urlString,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });
    }
    getOauthClient(instituteId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const institutes = (yield http.get(rest_urls_constants_1.AuthUrlsConstans.getInstitute, { headers: { instituteid: instituteId } })).data.data.appsData;
            const institute = institutes.find((x) => { return x.type === 'qb'; });
            const oauthClient = new OAuthClient({
                clientId: institute.appId,
                clientSecret: institute.appSecret,
                environment: process.env.QB_ENVIRONMENT,
                redirectUri: institute.appRedirectUrl
            });
            return oauthClient;
        });
    }
}
exports.QbService = QbService;
//# sourceMappingURL=qb.service.js.map