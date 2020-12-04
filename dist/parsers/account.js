"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartOfAccountParser = void 0;
const tslib_1 = require("tslib");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
const data = tslib_1.__importStar(require("../shared/data/chartofAccounts.json"));
const subAccountTypes = tslib_1.__importStar(require("@shared/data/sub-account-types.json"));
const _ = tslib_1.__importStar(require("lodash"));
const parser_enum_1 = require("src/enums/parser-enum");
class ChartOfAccountParser {
    constructor() {
        this.subAccountTypesValues = subAccountTypes.default;
    }
    parseChartofAccounts(accounts, businessId) {
        const length = accounts.length || 0;
        if (accounts && length > 0) {
            const parsedAccounts = [];
            for (let i = 0; i < length; i++) {
                const account = accounts[i];
                parsedAccounts.push(this.parseCOA(account, businessId));
            }
            return parsedAccounts;
        }
        else {
            logger_1.default.info('No Chart of Accounts');
        }
    }
    parseCOA(account, businessId) {
        const parseData = {
            'businessId': businessId,
            'platformAccountId': account.Id,
            'name': account.FullyQualifiedName,
            'accountSubType': this.getAccountType(account.AccountType, account.AccountSubType),
            'parentAccountName': account.AccountType,
            'classification': account.Classification,
            'active': account.Active,
            'parentAccountId': this.getParentOrCategoryAccountId(account.AccountType)
        };
        return parseData;
    }
    getAccountType(accountType, accountSubType) {
        if (accountType === parser_enum_1.ChartOfAccountKeys.income || accountType === parser_enum_1.ChartOfAccountKeys.expense) {
            return this.findSubAccountType(accountType === parser_enum_1.ChartOfAccountKeys.income, accountSubType);
        }
        else {
            return this.getParentOrCategoryAccountId(accountType);
        }
    }
    findSubAccountType(isIncome, item) {
        let searchIn = isIncome ? data.Income : data.Expense;
        let length = Object.keys(searchIn).length;
        let isFound = false;
        for (let i = 0; i < length; i++) {
            let array = Object.values(searchIn)[i];
            let key = Object.keys(searchIn)[i];
            if (array) {
                let containValue = array.includes(item);
                if (containValue) {
                    let id = this.getParentOrCategoryAccountId(key);
                    return id;
                }
                else {
                    isFound = false;
                }
            }
        }
        if (!isFound) {
            if (isIncome) {
                let id = this.getParentOrCategoryAccountId(parser_enum_1.ChartOfAccountKeys.otherIncome);
                return id;
            }
            else {
                let id = this.getParentOrCategoryAccountId(parser_enum_1.ChartOfAccountKeys.otherExpense);
                return id;
            }
        }
    }
    getParentOrCategoryAccountId(key) {
        if (key) {
            const subacc = _.find(this.subAccountTypesValues, { name: key.toLocaleLowerCase() });
            if (subacc)
                return Number(subacc.value);
            else
                throw new Error('accountTypeNotFound');
        }
        else {
            logger_1.default.info('getParentOrCategoryAccountId: key is undefined');
            throw new Error('accountTypeNotFoundElse');
        }
    }
}
exports.ChartOfAccountParser = ChartOfAccountParser;
//# sourceMappingURL=account.js.map