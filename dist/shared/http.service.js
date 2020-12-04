"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class HttpService {
    constructor() {
        this.options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: this.getReqTimeOut()
        };
    }
    getReqTimeOut() {
        return Number.parseFloat(process.env.AXIOS_TIMEOUT || '29000');
    }
    get(url, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (options) {
                if (!options.timeout) {
                    options.timeout = this.getReqTimeOut();
                }
            }
            else {
                options = this.options;
            }
            return axios_1.default.get(url, options);
        });
    }
    patch(url, requestBody, options) {
        if (options) {
            if (!options.timeout) {
                options.timeout = this.getReqTimeOut();
            }
        }
        else {
            options = this.options;
        }
        return axios_1.default.patch(url, requestBody, options);
    }
    post(url, requestBody, options) {
        if (options) {
            if (!options.timeout) {
                options.timeout = this.getReqTimeOut();
            }
        }
        else {
            options = this.options;
        }
        return axios_1.default.post(url, requestBody, options);
    }
}
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map