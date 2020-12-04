"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactParser = void 0;
const tslib_1 = require("tslib");
const qb_contact_type_enums_1 = require("src/enums/qb-contact-type-enums");
const logger_1 = tslib_1.__importDefault(require("@shared/logger"));
class ContactParser {
    static parseContacts(contacts, businessId, contactType) {
        try {
            if (contacts && contacts.length > 0) {
                const parsedContacts = [];
                contacts.forEach((contact) => {
                    parsedContacts.push(ContactParser.parse(contact, businessId, contactType));
                });
                return parsedContacts;
            }
            else {
                logger_1.default.info('NO Contacts or Contact length is Zero');
            }
        }
        catch (error) {
            logger_1.default.error(error.stack || error.message);
            throw new Error('Constant.parserMsg.parseContactErrror');
        }
    }
    static parse(contact, businessId, contactType) {
        let isCustomer = false;
        let isSupplier = false;
        let isEmployee = false;
        if (contactType === qb_contact_type_enums_1.ContactType.customer) {
            isCustomer = true;
        }
        else if (contactType === qb_contact_type_enums_1.ContactType.vendor) {
            isSupplier = true;
        }
        else if (contactType === qb_contact_type_enums_1.ContactType.employee) {
            isEmployee = true;
        }
        else {
            throw new Error('contact Type not defined');
        }
        const parseData = {
            'businessId': businessId,
            'contactName': contact.DisplayName,
            'isCustomer': isCustomer,
            'isSupplier': isSupplier,
            'isEmployee': isEmployee,
            'active': contact.Active,
            'platformContactId': contact.Id
        };
        return parseData;
    }
}
exports.ContactParser = ContactParser;
//# sourceMappingURL=contacts.js.map