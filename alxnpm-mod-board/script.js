import Helper from 'alxnpm-mod-helper'; 
import { data } from './data.js';

let Module = require('alxnpm-mod-module')

export default class Board extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
    }

    render(item) {

        let _this = this;
        this.wrapperContent = data.template;
        this.header = data.header;
        this.footer = data.footer;

        document.querySelector("main").classList.add("board-mode");

        this.header.querySelector(".back a").addEventListener("click", function () {
            _this.hide();
            _this.options.listModule.render(_this.options.listModule.items);
            _this.options.listModule.show();
        }, false);

        this.header.querySelector(".page-title").innerHTML = item.title ? Helper.trim(32, item.title) : "Board";

        this.footer.querySelector(".logout").addEventListener("click", function () {
            _this.exit(_this.options.exit);
        }, false);

        this.footer.querySelector(".home a").addEventListener("click", function () {
            _this.hide();
            _this.options.listModule.render(_this.options.listModule.items);
            _this.options.listModule.show();
        }, false);


        let notesHtml = "",
                notesBody = this.htmlElement.querySelector(".board-items"),
                notes = item.metas.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

            notes.forEach(function (value) {

                let image = "";

                if (value.binaryData) {
                    image = `<img class="img-responsive" src="${value.binaryData}">`;
                }
                
                notesHtml += `
                    <div class="board-item ${image ? "image" : "note"}">
                        <div class="header">${value.name}</div>
                        <div>
                            ${image ? image : value.value}
                        </div>           
                    </div>
                `;
            });

            notesBody.innerHTML = notesHtml;
    }

}