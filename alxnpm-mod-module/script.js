class Module {
    constructor(moduleId, className, htmlElement, options) {
        this._moduleId = moduleId;
        this._className = className;
        this._htmlElement = htmlElement;
        this._options = options || {};
        this.alertBox;
        this.modules;
        this.form;
        this.header;
        this.init();
    }

    get moduleId() {
        return this._moduleId;
    }
    set moduleId(moduleId) {
        this._moduleId = moduleId;
    }

    get className() {
        return this._className;
    }
    set className(className) {
        this._className = className;
    }

    get htmlElement() {
        return this._htmlElement;
    }
    set htmlElement(htmlElement) {
        this._htmlElement = htmlElement;
    }

    get options() {
        return this._options;
    }
    set options(options) {
        this._options = options;
    }

    get content() {
        return this.htmlElement.innerHTML;
    }
    set content(content) {
        this.htmlElement.innerHTML = content;
    }

    get header() {
        return document.querySelector("header");
    }
    set header(header) {
        document.querySelector("header").innerHTML = header;
    }

    get footer() {
        return document.querySelector("footer");
    }

    set footer(footer) {
        document.querySelector("footer").innerHTML = footer;
    }

    get wrapperContent() {
        return this.htmlElement.querySelector(".module-wrapper").innerHTML;
    }

    set wrapperContent(content) {
        this.htmlElement.querySelector(".module-wrapper").innerHTML = content;
        this.alertBox = this.htmlElement.querySelector(".alert-box p");
        this.form = this.htmlElement.querySelector("form");

        this.startup(this.options.startup);

        console.log(`Module(${this.moduleId}) CONTENT SET`);
        console.log(`Content: ${content.length > 50 ? content.replace(/(\r\n|\n|\s|\r)/gm, "").substring(0, 50) + "..." : content.replace(/(\r\n|\n|\r)/gm, "")}`);
        // console.log(`Alert Box: ${this.alertBox}`);
        // console.log(`Form: ${this.form}`);
        // console.log("------------------------------------------------------------------------------")

        const _this = this;
        if (this.alertBox) {
            var mutationObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    console.log(`Alert from module(${_this.moduleId}): ${mutation.target.innerHTML}`);
                    if (mutation.target.innerHTML === "401: Unauthorized") {
                        console.log(`401: Unauthorized detected from Module(${_this.moduleId}) -- invoking exit()`)
                        console.log(`Module data:`)
                        console.log(_this);
                        _this.exit(_this.options.exit);
                    }
                });
            });

            mutationObserver.observe(this.alertBox, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
                attributeOldValue: true,
                characterDataOldValue: true
            });
        }


    }


    init() {
        if (!this.htmlElement) {
            throw `htmlElement for Module(${this.moduleId}) does not exist.`
        }

        console.log(`Module(${this.moduleId}) INITIALIZED`);
        console.log(this);

        this.htmlElement.setAttribute("data-behavior", "module");
        this.htmlElement.setAttribute("data-moduleid", this.moduleId);
        this.htmlElement.setAttribute("class", this.className);

        let wrapper = document.createElement("div");
        wrapper.classList.add("module-wrapper");

        if (this.options.animation) {
            wrapper.setAttribute("data-animation", this.options.animation);
        }
        else {
            wrapper.setAttribute("data-animation", "slide");
        }
        this.htmlElement.appendChild(wrapper);

    }

    show() {
        this.htmlElement.style.display = "block";
        if (this.options.autoScroll !== false) {
            window.scroll(200, 0);
        }

    }

    hide() {
        this.htmlElement.style.display = "none";
    }

    clear() {
        this.htmlElement.querySelector(".module-wrapper").innerHTML = "";
    }

    exit(action) {
        if (typeof (action) === 'function') {
            action();
        }
    }

    startup(action) {
        if (typeof (action) === 'function') {
            action();
        }
    }

}


module.exports = Module;