//import { Module } from 'alxnpm-mod-module';
import API from 'alxnpm-mod-api';
import Loader from 'alxnpm-mod-loader';
import Helper from 'alxnpm-mod-helper';
let Module = require('alxnpm-mod-module')

import { data } from './data.js';

export default class Login extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
        this.api = new API(this.options.apiUrl);
        this.loader = new Loader();
    }

    render() {

        this.header = data.header.replace(/{appName}/g, this.options.appName);
        this.footer = data.footer.replace(/{appName}/g, this.options.appName);
        this.wrapperContent = data.template;

        const _this = this,
            form = this.form;

        this.htmlElement.querySelector(".signin-button").addEventListener("click", function (e) {
            _this.login();
            e.preventDefault();
        }, false);

        this.htmlElement.querySelector(".signup-button").addEventListener("click", function (e) {
            _this.register();
            e.preventDefault();
        }, false);

        this.htmlElement.querySelector(".reset-button").addEventListener("click", function (e) {
            _this.resetPassword();
            e.preventDefault();
        }, false);

        this.htmlElement.querySelector(".signup a[data-button='signup']").addEventListener("click", function (e) {
            _this.signup()
        });

        this.htmlElement.querySelector(".signup a[data-button='reset']").addEventListener("click", function (e) {
            _this.reset()
        });

        this.htmlElement.querySelector(".signin .signin-link").addEventListener("click", function (e) {
            _this.signin()
        });

        this.htmlElement.querySelector(".reset a").addEventListener("click", function (e) {
            _this.signin()
        });


    }

    login() {

        const form = this.form,
            email = form.email.value,
            password = form.password.value

        if (!email || !password) {
            Helper.showMessage(this.alertBox, "Please provide email and password");
            return;
        }

        let body = `grant_type=password&username=${email}&password=${password}`;

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
                                //Helper.setLocalStorageData(`${this.options.appId}_user`, response);
                                Helper.setPrefItem(this.options.appId, "user", response)
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

    register() {
        const _this = this,
            form = this.form,
            elements = [form.email, form.password, form.confirmpassword, form.firstname, form.lastname]

        let isError = false;

        elements.every(function (elem) {
            if (!elem.value) {
                Helper.showMessage(_this.alertBox, `${elem.getAttribute("data-name")} is required`);
                isError = true;
                return false;
            }
            else {
                return true;
            }
        });

        if (isError) {
            return;
        }

        if (!Helper.validateEmail(form.email.value)) {
            Helper.showMessage(this.alertBox, "Please use a valid email");
            return;
        }

        if (form.password.value.length < 6) {
            Helper.showMessage(this.alertBox, "Password should be at least 6 characters");
            return;
        }

        if (form.password.value !== form.confirmpassword.value) {
            Helper.showMessage(this.alertBox, "Password confirmation failed");
            return;
        }

        const body = {
            Username: form.email.value,
            Email: form.email.value,
            Password: form.password.value,
            ConfirmPassword: form.confirmpassword.value,
            FirstName: form.firstname.value,
            LastName: form.lastname.value,
            AppDomain: this.options.appName
        }

        this.loader.show();

        // request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request("/api/Account/Register", "post", body, false, true, true)
            .then((response) => {

                console.log(response);
                //console.log(response.modelState);
                if (response.status >= 400) {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                }

                if (response.error) {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, response.error_description);
                }

                if (response.modelState) {
                    let msg
                    this.loader.hide();
                    if (response.modelState["userModel.Password"]) {
                        msg = response.modelState["userModel.Password"][0]
                    }
                    else {
                        msg = JSON.stringify(response.modelState).replace(/[^\w@. ]/g, '')
                    }
                    Helper.showMessage(this.alertBox, msg);
                }

                // Successful login
                else {
                    //this.login();
                    this.loader.hide();
                    this.signin();
                    form.email.value = ""
                    form.password.value = ""
                    Helper.showMessage(this.alertBox, "A confirmation has been sent to your email address. Please click on the verification link.");
                }

            }).catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });

    }

    resetPassword() {
        const _this = this,
            form = this.form

        if (!form.email.value) {
            Helper.showMessage(this.alertBox, "Please type your email");
            return;
        }

        if (!Helper.validateEmail(form.email.value)) {
            Helper.showMessage(this.alertBox, "Please use a valid email");
            return;
        }

        const body = {
            Username: form.email.value,
            Email: form.email.value,
            Password: form.password.value,
            ConfirmPassword: form.confirmpassword.value,
            FirstName: form.firstname.value,
            LastName: form.lastname.value
        }

        this.loader.show();

        // request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request("/api/Account/ResetPassword", "post", body, false, true, true)
            .then((response) => {

                console.log(response);
                //console.log(response.modelState);
                if (response.status >= 400) {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                }

                if (response.error) {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, response.error_description);
                }

                if (response.modelState) {
                    let msg
                    this.loader.hide();
                    if (response.modelState["userModel.Password"]) {
                        msg = response.modelState["userModel.Password"][0]
                    }
                    else if (response.modelState.error) {
                        msg = response.modelState.error
                    }
                    else {
                        msg = JSON.stringify(response.modelState).replace(/[^\w@. ]/g, '')
                    }
                    Helper.showMessage(this.alertBox, msg);
                }

                // Successful login
                else {
                    //this.login();
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, "A password reset link has been sent to your email address. Please click on the link to reset your password.");
                }

            }).catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });

    }

    reset() {
        this.htmlElement.querySelector(".signup-fields").style.display = "none"
        this.htmlElement.querySelector(".row-password").style.display = "none"
        this.htmlElement.querySelector(".signup").style.display = "none"
        this.htmlElement.querySelector(".signin").style.display = "none"
        this.htmlElement.querySelector(".reset").style.display = "block"
    }

    signup() {
        this.htmlElement.querySelector(".signup-fields").style.display = "block"
        this.htmlElement.querySelector(".row-password").style.display = "block"
        this.htmlElement.querySelector(".signup").style.display = "none"
        this.htmlElement.querySelector(".signin").style.display = "block"
        this.htmlElement.querySelector(".reset").style.display = "none"
    }

    signin() {
        this.htmlElement.querySelector(".signup-fields").style.display = "none"
        this.htmlElement.querySelector(".row-password").style.display = "block"
        this.htmlElement.querySelector(".signup").style.display = "block"
        this.htmlElement.querySelector(".signin").style.display = "none"
        this.htmlElement.querySelector(".reset").style.display = "none"
    }

    logout() {

        this.loader.show();
        this.api.request("/api/Account/Logout", "post", {}, false, false, false)
        .then((response) => {

            if (response.status >= 400) {
                this.loader.hide();
                Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`)
            }

            else if (response.error) {
                this.loader.hide();
                Helper.showMessage(this.alertBox, response.error_description)
            }

            // Success
            else {
                // document.querySelectorAll('[data-behavior="module"]').forEach(function (module) {
                //     module.style.display = "none";
                // });
                this.loader.hide();
                Helper.removeLocalStorageData(`${this.options.appId}_prefs`);
                sessionStorage.removeItem("token");
                this.render();
                this.show();            
            }

        }).catch((error) => {
            this.loader.hide();
            console.log(error);
            Helper.showMessage(this.alertBox, error.message)
        });

    }

    start(startup) {
        startup();
        this.options.startModule.render();
        this.options.startModule.show();
    }
}