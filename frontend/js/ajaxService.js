'use strict';
export default class AjaxService {
    static ajax(url, options) {
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            let method = options.method || 'GET';
            let body = options.body ? JSON.stringify(options.body) : '';

            xhr.open(method, url, true);

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (method === 'POST') {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            }

            xhr.onload = function() {
                if (this.status === 200 || this.status === 304) {
                    resolve(this.responseText);
                } else {
                    let error = new Error(this.responseText);
                    error.code = this.status;
                    console.error(error);
                    reject(error);
                }
            };

            xhr.onerror = function() {
                let error = new Error("Network Error");
                console.error(error);
                reject(error);
            };

            xhr.send(body);
        });
    }
}