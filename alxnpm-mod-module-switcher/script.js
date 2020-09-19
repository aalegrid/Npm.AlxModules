
export default class ModuleSwitcher {
    constructor(options) {
        this._options = options || {};
        this.init();
    }

    get options() {
        return this._options;
    }
    set options(options) {
        this._options = options;
    }

    init(){
        if(!this.options.moduleSelector) {
            this.options.moduleSelector = "[data-behavior='module']";
        }

        if(!this.options.moduleIdSelector) {
            this.options.moduleIdSelector = "data-moduleid";
        }
    }

    hideAll(){
        let modules = document.querySelectorAll(this.options.moduleSelector);
        modules.forEach(function(module){
            module.style.display = "none";
        });
    }

    showAll(){
        let modules = document.querySelectorAll(this.options.moduleSelector);
        modules.forEach(function(module){
            module.style.display = "block";
        });
    }

    hideModule(id){
       document.querySelectorAll(`[${this.options.moduleIdSelector}='${id}']`).style.display = "none";
    }

    showModule(id){
        document.querySelectorAll(`[${this.options.moduleIdSelector}='${id}']`).style.display = "block";
     }



}