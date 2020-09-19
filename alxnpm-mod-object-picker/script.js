//import { Module } from 'alxnpm-mod-module'

let Module = require('alxnpm-mod-module')

import {data} from './data.js'

export default class ObjectPicker extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
    }

    render(filter) {

        let grid,
            type = this.options.type,
            items,
            html = ""

        //On every render, clear module wrapper content
        this.wrapperContent = ""

        //Then set new wrapper content
        this.wrapperContent = data.template.replace(/{type}/g, type);

        grid = this.htmlElement.querySelector(".grid");

        if (filter) {

            if (type === "icon") {
                items = data.icons.filter(function (val) {
                    return val.title.toLowerCase().includes(filter.toLowerCase()) || val.searchTerms.join(" ").includes(filter.toLowerCase());
                });
            }

            else {
                items = data.colors.filter(function (val) {
                    return val.title.toLowerCase().includes(filter.toLowerCase());
                });
            }

        }

        else {
            type === "icon" ? items = data.icons : items = data.colors;
        }

        items.forEach(function (item) {
            type === "icon" ? html += `<i data-pickervalue='${item.title}' class='${item.title}'></i>` :
                html += `<span data-pickervalue='${item.code}' style='background-color:${item.code}'></span>`;
        });

        grid.innerHTML = html;

        // After setting innerHTML content, add events

        let searchElement = this.htmlElement.querySelector("input[type='search']"),
            pickerItems = this.htmlElement.querySelectorAll("[data-pickervalue]");

        if (filter) {
            searchElement.value = filter;
            searchElement.focus();
        }


        //Remember to save this when using inside forEach, map, addEventLister, etc.
        let _this = this;

        // Handle when user types into the search input item or when search input is cleared
        "keyup search".split(" ").map(name => searchElement.addEventListener(name,
            function (e) {
                _this.render(e.target.value);
            }, false));

        // Assign event when picker item is clicked which is just calling supplied handler
        pickerItems.forEach(function (item) {
            item.addEventListener("click", _this.options.itemClickHandler, false);
        });

        document.body.addEventListener("click", function (event) {
            //console.log(event.srcElement.parentElement);

            if (!event.srcElement.hasAttribute("data-pickervalue")
                && !event.srcElement.hasAttribute("data-pickersearch")
                && !event.srcElement.classList.contains(`picker-trigger-${type}`)
                && !event.srcElement.parentElement.classList.contains(`picker-trigger-${type}`)
            ) {
                _this.hide();
            }
        });

    }

}