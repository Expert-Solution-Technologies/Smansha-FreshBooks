"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageConstants = void 0;
exports.MessageConstants = {
    general: {
        recordAlreadyExists: 'Record already exists',
        entityNotFound: 'Entity not Found',
        invalidRequestParameters: 'Invalid Request Parameters',
        internalServerException: 'Something happened wrong. Please try again after some time',
        notFound: 'not found',
        dataFetch: 'Data fetched',
        invalidUserId: 'User id is invalid.',
        invalidBusinessId: 'Business id is invalid.',
        fetched: 'Successfully fetched.',
        saved: 'Successfully saved.',
        somethingWrong: 'Something happened wrong. Please try again after some time',
        modelInvalid: 'Request Model is invalid',
        recordNotFound: 'no record found',
        serviceUnavailable: 'Not able to communicate on given url '
    },
    qbMessages: {
        errorWhileGettingBusinessInfo: 'Error while getting business info',
        errorWhileGettingBusinessPreferences: 'Error while getting business preferences',
        errorWhileGettingBusinessToken: 'Error while getting business token',
        errorWhileGettingBusinessEmployees: 'Error while getting business employees',
        errorWhileGettingBusinessCustomers: 'Error while getting business customers',
        errorWhileGettingBusinessVendors: 'Error while getting business customers',
        errorWhileGettingBusinessChartOfAccounts: 'Error while getting business chart of accounts',
        errorWhileGettingBusinessTrailBalance: 'Error while getting business trail balance',
        errorWhileGettingBusinessPayments: 'Error while getting business payments',
        errorWhileGettingBusinessARAgingReport: 'Error while getting business ar aging report',
        errorWhileGettingBusinessJVEnteries: 'Error while getting business jv enteries',
        errorWhileParsingBusinessInfo: 'Error while parsing business info',
        errorWhileParsingBusinessAdd: 'Error while parsing business address',
        errorWhileParsingAccessTokens: 'Error while parsing business access tokens',
        errorWhileParsingTrialBalance: 'Error while parsing business trail balance',
        errorWhileParsingArAgingReport: 'Error while parsing business ar aging report',
        failedToConnectQbBusiness: 'Error while Connecting qb business',
        emptyQbBusinessInfo: 'QB business info is empty',
        noTrialBalanceReportData: 'No trial balance data provided',
        noArAgingReportData: 'No ar aging data provided',
        errorInJVDates: 'Error due to dates in Jv reports',
        errorWhileGettingBusinessJVReports: 'Error while getting business jv reports',
        errorWhileGettingBusinessTransactionReports: 'Error while getting business transaction reports',
        errorInTransactionDates: 'Error due to dates in Jv reports',
        noTransactionReportData: 'No transation report data provided',
        errorWhileParsingTransactionReport: 'Error while parsing transactions data',
        errorWhileGettingBusinessAPAgingReport: 'Error while getting business ap aging report',
    }
};
exports.default = exports.MessageConstants;
//# sourceMappingURL=response.constants.js.map