//import { Module } from 'alxnpm-mod-module'
import API from 'alxnpm-mod-api';
import Loader from 'alxnpm-mod-loader';
import Helper from 'alxnpm-mod-helper';
import ModuleSwitcher from 'alxnpm-mod-module-switcher';

let Module = require('alxnpm-mod-module')

import { data } from './data.js';

export default class List extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
        this.api = new API(this.options.apiUrl);
        this.switcher = new ModuleSwitcher();
        this.loader = new Loader();
        this.sortField = "title";
        this._items = [];
    }

    get items() {
        return this._items;
    }
    set items(items) {
        this._items = items;
        if (this.options.cache) {
            Helper.setLocalStorageData(`${this.options.appId}_items`, items);
        }

    }

    render() {

        let _this = this;

        this.header = data.header.replace(/{appName}/g, this.options.appName);

        let user = Helper.getLocalStorageData(`${this.options.appId}_user`);

        if (user) {
            let li = document.createElement("li");
            li.classList.add("user-info");
            this.header.querySelector("ul").appendChild(li);
            li.innerHTML = `Hello <i class="fas fa-user-astronaut"></i> ${user.firstName}`

        }

        this.footer = data.footer;
        // domain = list is treeview
        this.wrapperContent = this.options.appDomain === "list" ? data.templateTreeView : data.templateList;

        document.querySelector("main").classList.remove("board-mode");

        this.footer.querySelector(".logout a").addEventListener("click", function () {
            _this.exit(_this.options.exit);
        }, false);

        this.footer.querySelector(".add-item a").addEventListener("click", function () {
            _this.switcher.hideAll();
            _this.options.itemModule.render({});
            _this.options.itemModule.show();

        }, false);

        this.footer.querySelector(".refresh a").addEventListener("click", function () {
            _this.getItems();
        }, false);

        this.setListSort();
        this.addSortLinks();

        if (this.options.cache) {
            let items = Helper.getLocalStorageData(`${this.options.appId}_items`);
            if (items) {
                this.bind(items);
            }
            else {
                this.getItems();
            }
        }


        if (data.links[this.options.appDomain]) {
            const elem = this.footer.querySelector("ul")
            if (elem) {
                data.links[this.options.appDomain].forEach(function (item) {
                    const ul = document.createElement('ul');
                    ul.innerHTML = item;
                    elem.insertBefore(ul.firstChild, elem.firstChild);
                })

                const sortLinks = this.footer.querySelectorAll("ul [data-sort]")

                if (sortLinks) {
                    this.addSortLinks(sortLinks)
                }

            }
        }

    }

    getItems() {

        this.loader.show();

        this.api.request(this.options.listRoute, "post", this.options.param, false, true, true)
            .then((response) => {
                if (Array.isArray(response)) {
                    if (response.status >= 400) {
                        Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                        return;
                    }
                    // Success
                    // console.log(response);
                    //this.items = response;
                    this.bind(response);
                    this.loader.hide();
                } else {
                    this.loader.hide();
                    Helper.showMessage(this.alertBox, "Something went wrong fetching data. Please try again later.");
                }
            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });
    }

    bind(items) {

        this.items = items;
        let _this = this,
            list = this.sortItems(items),
            container = this.options.listMode === "tree" ? this.htmlElement.querySelector(".treeview")  : this.htmlElement.querySelector("table tbody"),
            openItems =    Helper.getLocalStorageData(`${this.options.appId}_openItems`) || []

        // ---------------- TREEVIEW -----------------------
        if (this.options.listMode === "tree") {
            container.innerHTML = Helper.formatAsTreeForMyLists(list, true, true);

            let parents = this.htmlElement.querySelectorAll(".treeview .parent");

            parents.forEach(function (item) {
                item.addEventListener("click", function (e) {
                    let id = this.getAttribute("data-itemid");
                    this.classList.toggle("open");
                    this.nextSibling.nextSibling.classList.toggle("open");
                    if (this.classList.contains("open")) {
                        if (openItems.indexOf(id) === -1) {
                            openItems.push(id)
                        }
                    }
                    else {
                        let index = openItems.indexOf(id);
                        if (index > -1) {
                            openItems.splice(index, 1);
                        }
                    }
                    Helper.setLocalStorageData(`${_this.options.appId}_openItems`, openItems)
                }, false);
            });

            let links = this.htmlElement.querySelectorAll(".treeview .list-item");

            links.forEach(function (item) {
                item.addEventListener("click", function (e) {
                    let id = this.getAttribute("data-itemid"),
                        item = Helper.findItemById(Helper.flattenArray(items), id);
                    _this.hide();
                    _this.options.itemModule.render(item);
                    _this.options.itemModule.show();
                }, false);
            });

            if (openItems && openItems.length) {
                openItems.forEach(function (item) {
                    let e = _this.htmlElement.querySelector(`.parent[data-itemid="${item}"]`);
                    if (e) {
                        e.classList.add("open");
                        e.nextSibling.nextSibling.classList.add("open");
                    }
                });
            }
        }
        else {
            container.innerHTML = this.formatList(list);
            let links = this.htmlElement.querySelectorAll(".list-item");
            links.forEach(function (item) {
                item.addEventListener("click", function () {
                    let id = this.getAttribute("data-itemid"),
                        item = Helper.findItemById(items, id);
                    _this.hide();
                    _this.options.itemModule.render(item);
                    _this.options.itemModule.show();
                }, false);
            });

            if (this.options.appDomain === "board") {
                let boards = this.htmlElement.querySelectorAll(".board-item");

                boards.forEach(function (item) {
                    item.addEventListener("click", function () {
                        let id = this.getAttribute("data-itemid"),
                            item = Helper.findItemById(items, id);
                        _this.hide();
                        _this.options.boardModule.render(item);
                        _this.options.boardModule.show();
                    }, false);
                });
            }
        }

        if (this.options.appDomain === "note" || this.options.appDomain === "board") {
            this.htmlElement.querySelector(".count-sort").setAttribute("data-sort", "meta");
        }

    }

    formatList(items) {

        const _this = this;
        let html = "";
            

        items.forEach(function (value, index) {

            //if (value.tag && (value.tag.includes("hidden") || value.tag.includes("hide") || value.tag.includes("archive"))) {
            //    return;
            //}

            let icon = value.icon ? `<i class="${value.icon}">` : '',
                image = "",
                status = "",
                priority = "",
                statusPrioritySpan = "",
                todoCount = "",
                children = _this.options.children === "nodes" ? value.nodes : value.metas,
                countLink = `<a href="javascript:void(0)" class="${_this.options.appDomain === 'board' ? 'board' : 'list'}-item list-count" data-itemid="${value.id}"><span class="count">${children ? children.length : "0"}</span></a>`;

            if (_this.options.appDomain === "project") {
                let statusIcon = parseInt(value.status) === 0 ? "square" : (parseInt(value.status) === 1 ? "clock" : "check-square"),
                    priorityIcon = parseInt(value.priority) === 0 ? "info-circle" : (parseInt(value.priority) === 1 ? "smile" : "exclamation-triangle");
                status = `<i class="fal fa-${statusIcon}"></i>`;
                priority = `<i class="fal fa-${priorityIcon}"></i>`;
                statusPrioritySpan = ` <span class="status-priority">${status}${priority}</span>`;
                let count = 0;
                function filterTasks(task) {
                    return parseInt(task.status) === 0 || parseInt(task.status) === 1
                }
                count = value.nodes.filter(filterTasks).length;

                todoCount = `<span class="todo-count ${count ? 'bold' : ''}"><i class="${count ? 'fal fa-square' : 'fal fa-check-square'}"></i>${count}</span>`
            }

            if (value.metas) {
                const binaryImage = Helper.getItemMetaImage(value.metas);
                binaryImage && (image = `<img src="${binaryImage}">`);
            }

            if(!image) {
                image = `<span class='letter' ${value.color ? 'style=background-color:' + value.color : ''}>${value.title.charAt(0).toUpperCase()}</span>`
            }


            html += `<tr>
                    <td style="background-color:${value.color}">${index}</td>
                    <td>${icon}</td>
                    <td>
                    <a class="list-item" data-itemid="${value.id}">
                        <span class="info">
                            <span class="image">${image}</span>
                            <span class="title-meta">
                                <span class="title">${value.title ? (value.title.length > 20 ? Helper.trim(20, value.title) : value.title) : 'Untitled'}</span>
                                <span class="meta-data">
                                <span>${priority}</span>
                                <span class="date-modified">${value.dateModified ? Helper.formatDate(value.dateModified) : Helper.formatDate(value.dateCreated)}</span>
                                ${todoCount}
                                </span>
                            </span>
                        </span>                        
                    </a>
                    </td>
                    <td>${countLink}</td>
                </tr>`;
        });

        return html;
    }

    addSortLinks(links) {

        const _this = this,
            sortlinks = links ? links : this.htmlElement.querySelectorAll("table thead [data-sort]");
        sortlinks.forEach(function (item) {
            item.addEventListener("click", function (e) {
                let clickedItem = this.closest("a").getAttribute("data-sort");
                if (_this.sortField === clickedItem) {
                    sortlinks.forEach(function (elem) {
                        if (elem.getAttribute("data-sort") !== clickedItem) {
                            elem.classList.remove("reverse");
                        }
                    })
                    this.classList.toggle("reverse");
                }
                _this.sortField = clickedItem;
                _this.bind(_this.items);
                let listSort = {
                    sortField: _this.sortField,
                    reverse: this.classList.contains("reverse") ? "reverse" : ""
                }
                Helper.setLocalStorageData(`${_this.options.appId}_listSort`, listSort);
            }, false);
        });
    }

    setListSort() {
        let listSort = Helper.getLocalStorageData(`${this.options.appId}_listSort`);
        if (listSort) {
            this.sortField = listSort.sortField;
            if (listSort.reverse) {
                if (this.htmlElement.querySelector(`[data-sort='${listSort.sortField}']`)) {
                    this.htmlElement.querySelector(`[data-sort='${listSort.sortField}']`).classList.add(listSort.reverse);
                }

                else if (this.footer.querySelector(`[data-sort='${listSort.sortField}']`)) {
                    this.footer.querySelector(`[data-sort='${listSort.sortField}']`).classList.add(listSort.reverse);
                }
            }
        }
    }

    sortItems(list) {

        let items = list.sort(Helper.titleSort);

        switch (this.sortField) {
            case "title": items.sort(Helper.titleSort);
                break;
            case "color": items.sort(Helper.colorSort);
                break;
            case "icon": items.sort(Helper.iconSort);
                break;
            case "node": items.sort(Helper.nodeSort);
                break;
            case "meta": items.sort(Helper.metaSort);
                break;
            case "todo": items.sort(Helper.todoSort);
                break;
            default: items.sort(Helper.titleSort);
        }

        let sortElem = this.htmlElement.querySelector(`[data-sort='${this.sortField}']`) ?
            this.htmlElement.querySelector(`[data-sort='${this.sortField}']`) :
            this.footer.querySelector(`[data-sort='${this.sortField}']`);


        if (sortElem) {
            if (sortElem.classList.contains("reverse")) {
                items.sort().reverse();
            }
        }

        return items;
    };

}