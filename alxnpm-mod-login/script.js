import { Module } from 'alxnpm-mod-module';
import { API } from 'alxnpm-mod-api';
import { Loader } from 'alxnpm-mod-loader';
import { Helper } from 'alxnpm-mod-helper';

import { data } from './data.js';

export class Login extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
        this.api = new API(this.options.apiUrl);
        this.loader = new Loader();
    }

    render() {

        this.header = data.header.replace(/{appName}/g, this.options.appName);
        this.footer = data.footer.replace(/{appName}/g, this.options.appName);
        this.wrapperContent = data.template;
        let _this = this,
        form = this.form;

        form.addEventListener("submit", function (e) {
            _this.login(form.email.value, form.password.value);
            e.preventDefault();
        });

  
    }

    login(email, password) {

        let body = `grant_type=password&username=${email}&password=${password}`;

        if (!email || !password) {
            Helper.showMessage(this.alertBox, "Please provide email and password");
            return;
        }

        this.loader.show();

        // request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request("/token", "post", body, true, false, true)
            .then((response) => {
        
                if (response.status >= 400) {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                }

                if (response.error) {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, response.error_description);
                }

                // Successful login
                else {

                    sessionStorage.token = response.access_token;
                    // request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
                    this.api.request("/api/Account/UserInfo", "get", {}, false, false, true)
                        .then((response) => {

                            this.loader.hide();
                            
                            if (response.status >= 400) {
                                Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                                return;
                            }

                            if (response.id) {
                                Helper.setLocalStorageData(`${this.options.appId}_user`, response);
                                this.hide();
                                this.start(this.options.startup);
                            } else {
                                Helper.showMessage(this.alertBox, response.message);
                                return;
                            }
                        })
                        .catch((error) => {
                            this.loader.hide();
                            Helper.showMessage(this.alertBox, error);
                        });

                }

            }).catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });

    }

    logout() {
        
        document.querySelectorAll('[data-behavior="module"]').forEach(function(module){
            module.style.display = "none";
        });

        Helper.removeLocalStorageData(`${this.options.appId}_user`);
        Helper.removeLocalStorageData(`${this.options.appId}_items`);
        Helper.removeLocalStorageData(`${this.options.appId}_openItems`);
        Helper.removeLocalStorageData(`${this.options.appId}_nodeCollapse`);
        Helper.removeLocalStorageData(`${this.options.appId}_nodeSort`);
        Helper.removeLocalStorageData(`${this.options.appId}_noteCollapse`);

        sessionStorage.removeItem("token");

        this.render();
        this.show();

    }

    start(startup) {
       startup();
       this.options.startModule.render();
       this.options.startModule.show();
    }
}