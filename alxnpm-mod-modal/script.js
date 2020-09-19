//import { Module } from '../alxnpm-mod-module/script.js'
import { data } from './data.js';

let Module = require('alxnpm-mod-module')

export default class Modal extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);


        this._header;
        this._body;
        this._confirmFunction;

        if(options && options.confirmFunction) {
            this._confirmFunction = options.confirmFunction;
        }

 
        // ------------ Options Format -------------
        // options = {
        //     itemModule: Module,
        //     listModule: Module
        // }


    }

    get header(){
        return this._header;
    }

    set header(header) {
        this.htmlElement.querySelector(".header .title").innerHTML = header;
        this._header = header;
    }

    get body(){
        return this._body;
    }

    set body(body) {
        this.htmlElement.querySelector(".body").innerHTML = body;
        this._body = body;
    }

    get confirmFunction(){
        return this._confirmFunction;
    }

    set confirmFunction(confirmFunction) {
        this._confirmFunction = confirmFunction;
    }

    render() {

        
        this.wrapperContent = data.template;

        let _this = this,
        close = this.htmlElement.querySelector(".close"),
        cancel = this.htmlElement.querySelector(".cancel");

        close.addEventListener("click", function(){
            _this.hide();
        }, false);

        cancel.addEventListener("click", function(){
            _this.hide();
        }, false);

 
    }

    setConfirmAction(action){
        let ok = this.htmlElement.querySelector(".ok");
        ok.addEventListener("click", action, false);
    }


    removeConfirmAction(action){
        let ok = this.htmlElement.querySelector(".ok");
        ok.removeEventListener('click', action);
    }


}