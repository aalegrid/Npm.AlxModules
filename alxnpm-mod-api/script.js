export default class API {
    constructor(baseUrl) {
        this._baseUrl = baseUrl;
    }

    get baseUrl() {
        return this._baseUrl;
    }

    set baseUrl(baseUrl) {
        this._baseUrl = baseUrl;
    }

    async request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson) {

        const token = window.sessionStorage.token;

        let headers, options;

        if (isTokenRequest) {
            headers = {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            };
        } else {
            headers = {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Bearer " + token
            };
        }

        // Default options are marked with *
        options = {
            method: method, // *GET, POST, PUT, DELETE, etc.
            //mode: 'no-cors', // no-cors, *cors, same-origin
            //cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            // headers: {
            //     'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"
            //     //'Content-Type': 'application/json'
            // },
            headers: headers,
            //redirect: 'follow', // manual, *follow, error
            //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

            // When getting token, string data must be raw e.g. "grant_type=password&username=${email}&password=${password}"
        };

        // Add body only if method is not get or delete
        if (method.toLowerCase() !== "get" && method.toLowerCase() !== "delete") {
            options.body = isBodyStringify ? JSON.stringify(body) : body;
        }

        const response = await fetch(`${this.baseUrl}${url}`, options);
        
        // parses JSON response into native JavaScript objects
        return isResponseJson ? response.json() : response;

    }



}