"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUrlsConstans = exports.QbUrlsConstants = exports.RestUrlsConstants = void 0;
const QB_MINOR_VERSION = 55;
exports.RestUrlsConstants = {
    onBoardingUrl: process.env.SMAI_ONBOARDING_API_URL + '/',
};
exports.QbUrlsConstants = {
    callback: process.env.QB_API_URL + '/api/qb/callback?state={0}&code={1}',
    businessInfo: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from CompanyInfo&minorversion=55',
    businessPreference: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from Preferences&minorversion=55',
    businessEmployees: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from Employee STARTPOSITION 1 MAXRESULTS 1000&minorversion=55',
    businessCustomers: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from Customer STARTPOSITION 1 MAXRESULTS 1000&minorversion=' + QB_MINOR_VERSION,
    businessVendors: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from vendor STARTPOSITION 1 MAXRESULTS 1000&minorversion=' + QB_MINOR_VERSION,
    businessChartOfAccount: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from Account STARTPOSITION 1 MAXRESULTS 1000&minorversion=' + QB_MINOR_VERSION,
    businessTrialBalance: process.env.QB_API_URL + '/v3/company/{0}/reports/TrialBalance?start_date={1}&end_date={2}&minorversion' + QB_MINOR_VERSION,
    payment: process.env.QB_API_URL + "/v3/company/{0}/query?query=select * from Payment Where TxnDate>='{1}' AND TxnDate<='{2}' Order By Metadata.LastUpdatedTime STARTPOSITION 1 MAXRESULTS 1000&minorversion=" + QB_MINOR_VERSION,
    billPayment: process.env.QB_API_URL + "/v3/company/{0}/query?query=select * from billpayment Where TxnDate>='{1}' AND TxnDate<='{2}' Order By Metadata.LastUpdatedTime STARTPOSITION 1 MAXRESULTS 1000&minorversion=" + QB_MINOR_VERSION,
    businessARAgingReport: process.env.QB_API_URL + '/v3/company/{0}/reports/AgedReceivableDetail?report_date={1}&minorversion' + QB_MINOR_VERSION,
    businessJVEntry: process.env.QB_API_URL + '/v3/company/{0}/query?query=select * from JournalEntry Where Metadata.LastUpdatedTime>' + '\'' + '{1}' + '\'' + 'and Metadata.LastUpdatedTime< ' + '\'' + '{2}' + '\'' + 'Order By Metadata.LastUpdatedTime&minorversion=' + QB_MINOR_VERSION,
    businessJVReports: process.env.QB_API_URL + '/v3/company/{0}/reports/JournalReport?start_date={1}&end_date={2}&minorversion=' + QB_MINOR_VERSION + '&columns=acct_num_with_extn,is_cleared,tx_date,debt_amt,doc_num,account_name,credit_amt,create_by,memo,txn_type,name',
    businessTransactionReports: process.env.QB_API_URL + '/v3/company/{0}/reports/TransactionList?start_date={1}&end_date={2}&source_account_type=CreditCard,AccountsPayable,AccountsReceivable,Bank&columns=account_name,due_date,doc_num,is_no_post,name,other_account,tx_date,txn_type,subt_nat_home_amount,nat_home_open_bal,nat_open_bal,subt_nat_amount,memo&minorversion=' + QB_MINOR_VERSION,
    businessAPAgingReport: process.env.QB_API_URL + '/v3/company/{0}/reports/AgedPayableDetail?report_date={1}&minorversion' + QB_MINOR_VERSION,
};
exports.AuthUrlsConstans = {
    getInstitute: process.env.SMAI_AUTH_API_URL + '/institute/app-cred'
};
//# sourceMappingURL=rest-urls.constants.js.map