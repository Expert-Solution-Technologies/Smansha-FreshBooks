import axios, { AxiosRequestConfig } from 'axios';

export class HttpService {
    options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        timeout: this.getReqTimeOut()
    };

    /**
     * Return the request timeout
     */
    private getReqTimeOut() {
        return Number.parseFloat(process.env.AXIOS_TIMEOUT || '29000');
    }

    /**
     * this method will help you to execute get request over any server with the help of axios
     * @param url pass the url
     * @param options  pass the options
     */
    async get(url: string, options?: AxiosRequestConfig) {
        if (options) {
            if (!options.timeout) {
                options.timeout = this.getReqTimeOut();
            }
        } else {
            options = this.options;
        }
        return axios.get(url, options);
    }

    /**
     * this method will help you to execute patch request over any server with the help of axios
     * @param url pass the url
     * @param requestBody  pass the requestBody
     * @param options pass the options
     */
    patch(url: string, requestBody: any, options?: AxiosRequestConfig) {
        if (options) {
            if (!options.timeout) {
                options.timeout = this.getReqTimeOut();
            }
        } else {
            options = this.options;
        }
        return axios.patch(url, requestBody, options);

    }

    /**
     * this method will help you to execute post request over any server with the help of axios
     * @param url pass the url
     * @param requestBody pass the requestBody
     * @param options pass the options
     */
    post(url: string, requestBody?: any, options?: AxiosRequestConfig) {
        if (options) {
            if (!options.timeout) {
                options.timeout = this.getReqTimeOut();
            }
        } else {
            options = this.options;
        }
        return axios.post(url, requestBody, options);
    }
}
