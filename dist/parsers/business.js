"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessParser = void 0;
const tslib_1 = require("tslib");
const http_exception_1 = tslib_1.__importDefault(require("src/custom-exceptions/http.exception"));
const general_exceptions_constants_1 = require("src/custom-exceptions/general-exceptions.constants");
const response_constants_1 = require("@constants/response.constants");
class BusinessParser {
    static parseBusiness(businessInfo, realmId) {
        const parseBusinessInfo = {
            'businessName': businessInfo.CompanyName,
            'legalName': businessInfo.LegalName,
            'country': businessInfo.Country,
            'email': businessInfo.Email.Address,
            'fiscalYearStartMonth': businessInfo.FiscalYearStartMonth,
            'businessStartDate': businessInfo.CompanyStartDate,
            'homeCurrency': '',
            'businessPlateformId': realmId,
            'timezone': undefined,
            'phone': businessInfo.CompanyAddr.PrimaryPhone ? businessInfo.CompanyAddr.PrimaryPhone.FreeFormNumber : undefined,
            'provider': 1
        };
        if (parseBusinessInfo) {
            return parseBusinessInfo;
        }
        else {
            throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.MessageConstants.qbMessages.errorWhileGettingBusinessToken);
        }
    }
    static parseBusinessAddress(businessInfo) {
        let parseBusinessAdd = null;
        if (businessInfo.CompanyAddr) {
            parseBusinessAdd = {
                'city': businessInfo.CompanyAddr.City ? businessInfo.CompanyAddr.City : '',
                'line1': businessInfo.CompanyAddr.Line1 ? businessInfo.CompanyAddr.Line1 : '',
                'postalCode': businessInfo.CompanyAddr.PostalCode ? businessInfo.CompanyAddr.PostalCode : '',
                'country': businessInfo.Country ? businessInfo.Country : '',
                'addressType': 1,
                'state': undefined,
            };
        }
        if (parseBusinessAdd) {
            return parseBusinessAdd;
        }
        else {
            throw new http_exception_1.default(general_exceptions_constants_1.GeneralHttpExceptions.EntityNotFoundException, response_constants_1.MessageConstants.qbMessages.errorWhileParsingBusinessAdd);
        }
    }
}
exports.BusinessParser = BusinessParser;
//# sourceMappingURL=business.js.map