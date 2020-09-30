//import { Module } from 'alxnpm-mod-module';
import API from 'alxnpm-mod-api';
import Loader from 'alxnpm-mod-loader';
import Helper from 'alxnpm-mod-helper';
import ObjectPicker from 'alxnpm-mod-object-picker';
import ModuleSwitcher from 'alxnpm-mod-module-switcher';

let Module = require('alxnpm-mod-module')

import { data } from './data.js';


export default class Item extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
        this.api = new API(this.options.apiUrl);
        this.switcher = new ModuleSwitcher();
        this.loader = new Loader();
        this.sortField;
        this.options.fields = options.fields || [];
        this.options.nodeName = options.nodeName || "Node";
        this.options.nodeIcon = options.nodeIcon || "fal fa-file";
        this.options.noteIcon = options.noteIcon || "fal fa-comment-alt";
        this.options.nodeAddIcon = options.nodeAddIcon || "fal fa-file-plus";
        this.options.noteAddIcon = options.noteAddIcon || "fal fa-comment-alt-plus";

    }

    render(node) {

        let item = node || {},
            _this = this,
            isAdd = typeof item.id === 'undefined';

        data.template = data.template.replace(/{nodeName}/g, this.options.nodeName);

        this.wrapperContent = data.template;
        this.header = data.header;
        this.footer = data.footer;

        this.footer.querySelector(".add-node a i").setAttribute("class", this.options.nodeAddIcon);
        this.footer.querySelector(".add-note a i").setAttribute("class", this.options.noteAddIcon);

        if (!this.options.fields.includes("priority")) {
            this.htmlElement.querySelector(".nodes-list table thead .priority").style.display = "none";
        }

        if (!this.options.fields.includes("status")) {
            this.htmlElement.querySelector(".nodes-list table thead .status").style.display = "none";
        }

        if (!this.options.nodeCount) {
            this.htmlElement.querySelector(".nodes-list table thead .nodes").style.display = "none";
        }

        if (this.options.nodes) {
            this.setNodeCollapse();
            this.setNodeSort();
        }
        else {
            this.htmlElement.querySelector(".nodes-list").style.display = "none";
            this.footer.querySelector(".add-node").style.display = "none";
        }

        if (this.options.nodeSingleLevelOnly) {
            if (parseInt(item.parentId) !== 0) {
                this.htmlElement.querySelector(".nodes-list").style.display = "none";
            }
        }

        let form = this.form;

        this.setNoteCollapse();

        /* #region Floating Menu */

        let floatingMenu = document.querySelector(".floating-save-menu");
        if (floatingMenu) {
            floatingMenu.remove();
        }

        let floatingDiv = document.createElement("div");
        floatingDiv.classList.add("floating-save-menu");
        floatingDiv.innerHTML = `<a href="javascript:void(0)"><i class="fal fa-save"></i></a>`;
        document.body.insertBefore(floatingDiv, document.body.childNodes[4]);

        document.querySelector(".floating-save-menu a").addEventListener("click", function (e) {
            e.preventDefault();
            _this.htmlElement.querySelector("form button[type='submit']").click();
        }, false);

        /* #endregion */

        /* #region Set Header/Footer */

        this.header.querySelector(".back a").addEventListener("click", function () {

            if (item.parentId === undefined || item.parentId === 0) {
                _this.hide();
                _this.options.listModule.render();
                _this.options.listModule.bind(_this.options.listModule.items);
                _this.options.listModule.show();
            }

            else {
                _this.hide();
                let parent = Helper.findItemById(Helper.flattenArray(_this.options.listModule.items), item.parentId);
                _this.render(parent);
                _this.show();
            }

        }, false);

        this.header.querySelector(".page-title").innerHTML = item.title ? Helper.trim(32, item.title) : `New Item`;

        this.header.querySelector(".delete-item a").addEventListener("click", function () {
            _this.options.modalModule.header = "Delete";
            _this.options.modalModule.body = `Are you sure you want to delete '${item.title}'?`;

            let itemDeleteAction = function (id) {
                // Delete action
                _this.deleteItem(item.id);
                // End delete action
                _this.options.modalModule.hide();
                _this.options.modalModule.removeConfirmAction(itemDeleteAction);
            }

            _this.options.modalModule.setConfirmAction(itemDeleteAction);
            _this.options.modalModule.show();
        }, false);

        this.footer.querySelector(".home a").addEventListener("click", function () {
            _this.hide();
            _this.options.listModule.render(_this.options.listModule.items);
            _this.options.listModule.show();
        }, false);

        this.footer.querySelector(".add-note a").addEventListener("click", function () {
            _this.hide();
            _this.options.noteModule.render({}, item.id);
            _this.options.noteModule.show();
        }, false);

        if (this.options.nodes) {
            this.footer.querySelector(".add-node a").addEventListener("click", function () {
                _this.hide();
                _this.render({ parentId: item.id });
                _this.show();
            }, false);
        }

        this.footer.querySelector(".logout").addEventListener("click", function () {
            _this.exit(_this.options.exit);
        }, false);

        /* #endregion */

        /* #region Object Pickers */

        let iconPicker = new ObjectPicker("iconPicker", "icon-object-picker", form.querySelector("#iconPicker"), {
            type: "icon",
            itemClickHandler: this.iconOnClick,
            animation: "none",
            autoScroll: false
        }),
            colorPicker = new ObjectPicker("colorPicker", "color-object-picker", form.querySelector("#colorPicker"), {
                type: "color",
                itemClickHandler: this.colorOnClick,
                animation: "none",
                autoScroll: false
            });

        iconPicker.render();
        colorPicker.render();
        iconPicker.hide();
        colorPicker.hide();

        /* #endregion */

        /* #region Set Form */

        item.title && (form.title.value = item.title);
        item.description && (form.description.value = item.description);

        if (this.options.fields.includes("content")) {
            item.content && (form.content.value = item.content);
        }

        else {
            this.htmlElement.querySelector(".row-content").style.display = "none";
        }

        if (this.options.fields.includes("dateDue")) {
            item.dateDue = item.dateDue || new Date().toISOString();
            item.dateDue && (form.dateDue.value = item.dateDue.split('T')[0]);
        }
        else {
            this.htmlElement.querySelector(".row-datedue").style.display = "none";
        }

        if (this.options.fields.includes("priority")) {
            item.priority = item.priority || 0;
            this.htmlElement.querySelector(`.priority-btn-group a[data-value="${item.priority}"]`).classList.add("selected");
        }
        else {
            this.htmlElement.querySelector(".row-priority").style.display = "none";
        }

        if (this.options.fields.includes("status")) {
            item.status = item.status || 0;
            this.htmlElement.querySelector(`.status-btn-group a[data-value="${item.status}"]`).classList.add("selected");
        }
        else {
            this.htmlElement.querySelector(".row-status").style.display = "none";
        }

        if (this.options.fields.includes("control")) {
            item.control && (form.control.value = item.control);
        }

        else {
            this.htmlElement.querySelector(".row-control").style.display = "none";
        }

        if (this.options.fields.includes("tag")) {
            item.tag && (form.tag.value = item.tag);
        }

        else {
            this.htmlElement.querySelector(".row-tag").style.display = "none";
        }

        if (this.options.domain === "list" && item.tag && item.tag.includes("list-add")) {
            this.htmlElement.querySelector("table thead .control").style.display = "block";
        }
        else {
            this.htmlElement.querySelector("table thead .control").style.display = "none";
        }

        item.icon && (form.icon.value = item.icon);
        item.color && (form.color.value = item.color);
        item.icon && form.querySelector(".picker-trigger-icon").firstChild.setAttribute("class", item.icon);
        item.color && (form.querySelector(".picker-trigger-color").firstChild.style.backgroundColor = item.color);

        /* #endregion */

        /* #region ADD */
        if (isAdd) {
            this.footer.querySelector(".add-note").classList.add("disabled");
            if (this.options.nodes) {
                this.footer.querySelector(".add-node").classList.add("disabled");
            }
            this.header.querySelector(".delete-item").classList.add("disabled");
            this.htmlElement.querySelector(".notes-list").style.display = "none";
            this.htmlElement.querySelector(".nodes-list").style.display = "none";
        }

        /* #endregion */

        /* #region Update */
        if (!isAdd) {

            this.htmlElement.querySelector(".add-note a").addEventListener("click", function () {
                _this.hide();
                _this.options.noteModule.render({}, item.id);
                _this.options.noteModule.show();
            }, false);

            if (this.options.nodes) {
                // Add add node button
                this.htmlElement.querySelector(".add-node a").addEventListener("click", function () {
                    _this.hide();
                    _this.render({ parentId: item.id });
                    _this.show();
                }, false);

                // Render Nodes
                if (item.nodes) {
                    this.bindNodes(item);
                }
            }


            // Render Notes

            this.htmlElement.querySelector(".notes-count").innerHTML = item.metas ? item.metas.length : "0";

            if (!item.metas || !item.metas.length) {
                this.htmlElement.querySelector(".notes-header .collapse i").style.display = "none";
            }


            let notes = item.metas.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            if (notes) {
                let notesHtml = "",
                    notesTbody = this.htmlElement.querySelector(".notes-list table tbody");

                notes.forEach(function (value) {
                    let icon = value.binaryData ? `<img class="thumb-preview" src=${value.binaryData} />` : `<i class="${_this.options.noteIcon} note-icon"></i>`;
                    notesHtml += `<tr data-noteid="${value.id}">
                         <td><a href='javascript:void(0)' title='${value.id}' class='note-item' data-noteid="${value.id}">${icon}</a></td>
                         <td><a href='javascript:void(0)' title='${value.id}' class='note-item' data-noteid="${value.id}">${value.name ? Helper.trim(35, value.name) : 'Untitled'}</a></td>
                         <td><a href='javascript:void(0)' title='${value.id}' class='delete-note' data-noteid="${value.id}"><i class='far fa-trash'></i></a></td>
                         </tr>`;
                });

                notesTbody.innerHTML = notesHtml;
            }


        }

        /* #endregion */

        /* #region Listener Events */

        form.querySelector("[data-domain='icon']").addEventListener("click",
            function (e) {
                let picker = form.querySelector("#iconPicker");
                picker.classList.toggle("open");
                if (picker.classList.contains("open")) {
                    iconPicker.show();
                }
                else {
                    iconPicker.hide();
                }

            }, false);

        form.querySelector("[data-domain='color']").addEventListener("click",
            function (e) {
                let picker = form.querySelector("#colorPicker");
                picker.classList.toggle("open");
                if (picker.classList.contains("open")) {
                    colorPicker.show();
                }
                else {
                    colorPicker.hide();
                }

            }, false);

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.title.value) {
                Helper.showMessage(_this.alertBox, "Title is required");
                return;
            }
            _this.save(item);
        });

        if (this.options.nodes) {
            let nodeLinks = this.htmlElement.querySelectorAll(".node-item");

            if (nodeLinks) {
                nodeLinks.forEach(function (_item) {
                    _item.addEventListener("click", function () {
                        let id = this.getAttribute("data-nodeid"),
                            node = Helper.findItemById(item.nodes, id);
                        _this.hide();
                        _this.render(node);
                        _this.show();
                    }, false);
                });
            }

        }

        let noteLinks = this.htmlElement.querySelectorAll(".note-item");

        if (noteLinks) {
            noteLinks.forEach(function (_item) {
                _item.addEventListener("click", function () {
                    let id = this.getAttribute("data-noteid"),
                        note = Helper.findItemById(item.metas, id);
                    _this.hide();
                    _this.options.noteModule.render(note, item.id);
                    _this.options.noteModule.show();
                }, false);
            });
        }

        if (this.options.nodes && item.nodes) {
            this.addNodeSortLinks(item);
        }

        let deleteNoteLinks = this.htmlElement.querySelectorAll(".delete-note");

        if (deleteNoteLinks) {

            deleteNoteLinks.forEach(function (_item) {
                _item.addEventListener("click", function () {
                    let id = this.getAttribute("data-noteid"),
                        note = Helper.findItemById(item.metas, id);

                    _this.options.modalModule.header = "Delete";
                    _this.options.modalModule.body = `Are you sure you want to delete note '${note.name}'?`;

                    let deleteNoteAction = function () {
                        // Delete action
                        _this.deleteNote(id, item);
                        // End delete action
                        _this.options.modalModule.hide();
                        _this.options.modalModule.removeConfirmAction(deleteNoteAction);
                    }

                    _this.options.modalModule.setConfirmAction(deleteNoteAction);
                    _this.options.modalModule.show();

                }, false);
            });
        }


        if (this.options.fields.includes("priority")) {
            let priorityLinks = this.htmlElement.querySelectorAll(".priority-btn-group a");

            if (priorityLinks) {
                priorityLinks.forEach(function (value) {
                    value.addEventListener("click", function () {
                        this.parentElement.querySelectorAll("a").forEach(function (value) {
                            value.classList.remove("selected");
                        });
                        this.classList.add("selected");
                    }, false);
                });
            }

        }

        if (this.options.fields.includes("status")) {
            let statusLinks = this.htmlElement.querySelectorAll(".status-btn-group a");
            if (statusLinks) {
                statusLinks.forEach(function (value) {
                    value.addEventListener("click", function () {
                        this.parentElement.querySelectorAll("a").forEach(function (value) {
                            value.classList.remove("selected");
                        });
                        this.classList.add("selected");
                    }, false);
                });
            }
        }

        if (this.options.nodes) {
            this.htmlElement.querySelector(".nodes-list .collapse i").addEventListener("click", function () {
                _this.htmlElement.querySelector(".nodes-list table").classList.toggle("hide");
                this.classList.toggle("fa-minus-square");
                this.classList.toggle("fa-plus-square");
                Helper.setLocalStorageData(`${_this.options.appId}_nodeCollapse`, this.classList.value);
            }, false);
        }

        else {
            _this.htmlElement.querySelector(".nodes-list").style.display = "none";
        }

        this.htmlElement.querySelector(".notes-list .collapse i").addEventListener("click", function () {
            _this.htmlElement.querySelector(".notes-list table").classList.toggle("hide");
            this.classList.toggle("fa-minus-square");
            this.classList.toggle("fa-plus-square");
            Helper.setLocalStorageData(`${_this.options.appId}_noteCollapse`, this.classList.value);
        }, false);

        /* #endregion */

    }

    bindNodes(item) {

        let _this = this;

        this.htmlElement.querySelector(".nodes-count").innerHTML = item.nodes ? item.nodes.length : "0";

        if (!item.nodes || !item.nodes.length) {
            this.htmlElement.querySelector(".nodes-header .collapse i").style.display = "none";
        }

        if (item.nodes.length) {
            let nodesHtml = "",
                nodesTbody = this.htmlElement.querySelector(".nodes-list table tbody"),
                nodes = this.sortItems(item.nodes);
            if (nodes) {
                nodes.forEach(function (value) {
                    let statusIcon = parseInt(value.status) === 0 ? "square" : (parseInt(value.status) === 1 ? "clock" : "check-square"),
                        priorityIcon = parseInt(value.priority) === 0 ? "info-circle" : (parseInt(value.priority) === 1 ? "smile" : "exclamation-triangle"),
                        iconOrCheckBox = _this.options.domain === "list" && item.tag && item.tag.includes("list-checkbox") ? `<input type="checkbox" name="checkbox_${value.id}"/>` :   `<i class="${_this.options.nodeIcon}"></i>`;
 
                    nodesHtml += `<tr data-nodeid="${value.id}">
                        <td>${iconOrCheckBox}</td>
                        <td><a href='javascript:void(0)' class='node-item' data-nodeid="${value.id}">${value.title}</a></td>`;
                    if (_this.options.fields.includes("priority")) {
                        nodesHtml += `<td><a href='javascript:void(0)' class='node-priority-click' data-nodeid="${value.id}" data-nodepriority="${value.priority}"><i class="fal fa-${priorityIcon}"></i></a></td>`;
                    }
                    if (_this.options.fields.includes("status")) {
                        nodesHtml += `<td><a href='javascript:void(0)' class='node-status-click' data-nodeid="${value.id}" data-nodestatus="${value.status}"><i class="far fa-${statusIcon}"></i></a></td>`;

                    }
                    if (_this.options.nodeCount) {
                        nodesHtml += `<td>${value.nodes.length}</td>`;
                    }

                    if (_this.options.domain === "list" && item.tag && item.tag.includes("list-add")) {
                        nodesHtml += `<td style="text-align:right">${value.control}</td>`;
                    }
                    nodesHtml += `<td><a href='javascript:void(0)' class='delete-node' data-nodeid="${value.id}"><i class='far fa-trash'></i></a></td>
                            </tr>`;
                });

                if (this.options.domain === "list" && item.tag && item.tag.includes("list-add")) {

                    let total = Helper.listAdd(item.nodes);

                    nodesHtml += `<tr class="list-add">
                            <td></td>
                            <td></td>
                            <td>Total</td>
                            <td>${total}</td>
                            <td></td>
                            </tr>`

                }

                nodesTbody.innerHTML = nodesHtml;
            }

            //Priority

            if (this.options.fields.includes("priority")) {
                let priorityClickLinks = this.htmlElement.querySelectorAll(".node-priority-click");
                if (priorityClickLinks) {
                    priorityClickLinks.forEach(function (value) {
                        value.addEventListener("click", function () {
                            let p = parseInt(this.getAttribute("data-nodepriority")),
                                id = parseInt(this.getAttribute("data-nodeid")),
                                flatArray = Helper.flattenArray(_this.options.listModule.items),
                                _item = Helper.findItemById(flatArray, id);
                            p == 2 ? p = 0 : p++;
                            _item.priority = p;
                            _this.saveQuick(_item);
                        }, false);
                    });
                }
            }


            if (this.options.fields.includes("status")) {
                let statusClickLinks = this.htmlElement.querySelectorAll(".node-status-click");
                if (statusClickLinks) {
                    statusClickLinks.forEach(function (value) {
                        value.addEventListener("click", function () {
                            let p = parseInt(this.getAttribute("data-nodestatus")),
                                id = parseInt(this.getAttribute("data-nodeid")),
                                flatArray = Helper.flattenArray(_this.options.listModule.items),
                                _item = Helper.findItemById(flatArray, id);
                            p === 2 ? p = 0 : p++;
                            _item.status = p;

                            _this.saveQuick(_item);
                        }, false);
                    });
                }
            }

            //Delete Nodes
            let deleteNodeLinks = this.htmlElement.querySelectorAll(".delete-node");

            if (deleteNodeLinks) {
                deleteNodeLinks.forEach(function (_item) {
                    _item.addEventListener("click", function () {
                        let id = this.getAttribute("data-nodeid"),
                            node = Helper.findItemById(item.nodes, id);
                        _this.options.modalModule.header = "Delete";
                        _this.options.modalModule.body = `Are you sure you want to delete note '${node.title}'?`;
                        let deleteNodeAction = function () {
                            // Delete action
                            _this.deleteItem(id);
                            // End delete action
                            _this.options.modalModule.hide();
                            _this.options.modalModule.removeConfirmAction(deleteNodeAction);
                        }
                        _this.options.modalModule.setConfirmAction(deleteNodeAction);
                        _this.options.modalModule.show();
                    }, false);
                });
            }

        }

        else {
            this.htmlElement.querySelector(".nodes-list table").style.display = "none";
        }
    }

    setNodeSort() {
        let nodeSort = Helper.getLocalStorageData(`${this.options.appId}_nodeSort`);
        if (nodeSort) {
            this.sortField = nodeSort.sortField;
            if (nodeSort.reverse) {
                this.htmlElement.querySelector(`[data-sort='${nodeSort.sortField}']`).classList.add(nodeSort.reverse);
            }
        }
    }

    setNodeCollapse() {
        let collapse = Helper.getLocalStorageData(`${this.options.appId}_nodeCollapse`);
        if (collapse) {
            this.htmlElement.querySelector(".nodes-list .collapse i").classList = collapse;
            if (collapse === "fal fa-plus-square") {
                this.htmlElement.querySelector(".nodes-list table").classList.toggle("hide");
            }
        }
    }

    setNoteCollapse() {
        let collapse = Helper.getLocalStorageData(`${this.options.appId}_noteCollapse`);
        if (collapse) {
            this.htmlElement.querySelector(".notes-list .collapse i").classList = collapse;
            if (collapse === "fal fa-plus-square") {
                this.htmlElement.querySelector(".notes-list table").classList.toggle("hide");
            }
        }
    }

    saveQuick(item) {
        let savedItem = item,
            user = Helper.getUser(this.options.appId);
        if (user) {
            savedItem.modifiedBy = user.id;
        }
        savedItem.dateModified = new Date();

        this.loader.show();
        //request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request(`/api/Items/${savedItem.id}`, "put", savedItem, false, true, false)
            .then((response) => {
                //console.log(response);
                this.loader.hide();
                if (response.status >= 400) {
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                    return;
                }
                let parent = Helper.findItemById(this.options.listModule.items, item.parentId);
                let childIndex = parent.nodes.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
                parent.nodes[childIndex] = savedItem;
                let parentIndex = this.options.listModule.items.findIndex((obj) => parseInt(obj.id) === parseInt(item.parentId));
                this.options.listModule.items[parentIndex] = parent;
                this.options.listModule.items = this.options.listModule.items;
                this.render(parent);
            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });
    }

    save(item) {
        let form = this.form,
            savedItem = item, url, method,
            isAdd = typeof item.id === 'undefined',
            isResponseJson,
            user = Helper.getUser(this.options.appId);

        //ADD - POST
        if (isAdd) {
            url = `/api/Items`;
            method = "post";
            isResponseJson = true;
            if (user) {
                savedItem.createdBy = user.id;
            }
            savedItem.dateCreated = new Date();
            savedItem.metas = [];
            savedItem.domain = this.options.appDomain;
            if (item.parentId) {
                savedItem.parentId = item.parentId;
            }
            item.nodes = [];
        }

        //UPDATE - PUT
        else {
            url = `/api/Items/${savedItem.id}`;
            method = "put";
            isResponseJson = false;
            if (user) {
                savedItem.modifiedBy = user.id;
            }
            savedItem.dateModified = new Date();
        }

        savedItem.title = form.title.value;
        savedItem.description = form.description.value;
        savedItem.icon = form.icon.value;
        savedItem.color = form.color.value;

        if (this.options.fields.includes("priority")) {
            savedItem.priority = this.htmlElement.querySelector(".priority-btn-group a[class='selected']").getAttribute("data-value");
        }

        if (this.options.fields.includes("status")) {
            savedItem.status = this.htmlElement.querySelector(".status-btn-group a[class='selected']").getAttribute("data-value");
        }

        if (this.options.fields.includes("content")) {
            savedItem.content = form.content.value;
        }

        if (this.options.fields.includes("tag")) {
            savedItem.tag = form.tag.value;
        }

        if (this.options.fields.includes("control")) {
            savedItem.control = form.control.value;
        }

        this.loader.show();
        //request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request(url, method, savedItem, false, true, isResponseJson)
            .then((response) => {

                this.loader.hide();

                if (response.status >= 400) {
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                    return;
                }

                if (isAdd) {
                    this.render(response);
                    Helper.showMessage(this.alertBox, "Item added");
                    let notesContainer = this.htmlElement.querySelector(".notes-list");
                    notesContainer.style.display = "block";
                    // Add new item to items

                    if (item.parentId) {
                        let parent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), item.parentId);
                        parent.nodes.push(response);
                        let _items = Helper.updateTree(this.options.listModule.items, item.parentId, parent);
                        this.options.listModule.items = _items;
                    }
                    else {
                        let _items = this.options.listModule.items;
                        _items.push(response);
                        this.options.listModule.items = _items;
                    }

                } else {
                    Helper.showMessage(this.alertBox, "Item saved");

                    //Update parent
                    if (item.parentId) {
                        let parent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), item.parentId);
                        let childIndex = parent.nodes.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
                        parent.nodes[childIndex] = savedItem;
                        let _items = Helper.updateTree(this.options.listModule.items, item.parentId, parent);
                        this.options.listModule.items = _items;
                    }

                    else {
                        let index = this.options.listModule.items.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
                        this.options.listModule.items[index] = savedItem;
                        this.options.listModule.items = this.options.listModule.items;
                    }

                }

            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });
    }

    deleteItem(id) {
        this.loader.show();
        //request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request(`/api/Items/${id}`, "delete", {}, false, false, false)
            .then((response) => {
                //console.log(response);
                this.loader.hide();
                if (response.status >= 400) {
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                    return;
                }

                let item = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), id);

                if (item.parentId) {
                    let parent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), item.parentId);
                    parent.nodes = Helper.removeById(parent.nodes, "id", id);
                    let _items = Helper.updateTree(this.options.listModule.items, item.parentId, parent);
                    this.options.listModule.items = _items;
                    this.render(parent);
                    this.show();
                }
                else {
                    this.hide();
                    let _items = Helper.removeById(this.options.listModule.items, "id", id);
                    this.options.listModule.items = _items;
                    this.options.listModule.render();
                    this.options.listModule.bind(_items);
                    this.options.listModule.show();
                }

            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });

    }

    deleteNote(id, item) {
        this.loader.show();
        //request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request(`/api/Metas/${id}`, "delete", {}, false, false, false)
            .then((response) => {
                this.loader.hide();
                if (response.status >= 400) {
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                    return;
                }
                this.htmlElement.querySelector(`.notes-list table tbody tr[data-noteid='${id}']`).innerHTML = "";
                let newItem = item;
                newItem.metas = Helper.removeById(newItem.metas, "id", id)
                let _items = Helper.updateTree(this.options.listModule.items, newItem.id, newItem);
                this.options.listModule.items = _items;
                this.htmlElement.querySelector(".notes-count").innerHTML = newItem.metas ? newItem.metas.length : "0";
                if (!newItem.metas || !newItem.metas.length) {
                    this.htmlElement.querySelector(".notes-header .collapse i").style.display = "none";
                }

            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });

    }

    iconOnClick(e) {
        let value = e.srcElement.getAttribute("data-pickervalue"),
            form = e.srcElement.closest("form");
        form.querySelector("input[id='icon']").value = value;
        form.querySelector(".picker-trigger-icon").firstChild.setAttribute("class", value);
    }

    colorOnClick(e) {
        let value = e.srcElement.getAttribute("data-pickervalue"),
            form = e.srcElement.closest("form");
        form.querySelector("input[id='color']").value = value;
        form.querySelector(".picker-trigger-color").firstChild.style.backgroundColor = value;
    }

    addNodeSortLinks(data) {
        let _this = this,
            sortLinks = this.htmlElement.querySelectorAll(".nodes-list table thead [data-sort]");
        if (sortLinks) {
            sortLinks.forEach(function (item) {
                item.addEventListener("click", function (e) {
                    let clickedItem = this.getAttribute("data-sort");
                    if (_this.sortField === clickedItem) {
                        sortLinks.forEach(function (elem) {
                            if (elem.getAttribute("data-sort") !== clickedItem) {
                                elem.classList.remove("reverse");
                            }
                        })
                        this.classList.toggle("reverse");
                    }
                    _this.sortField = clickedItem;
                    _this.bindNodes(data);
                    let nodeSort = {
                        sortField: _this.sortField,
                        reverse: this.classList.contains("reverse") ? "reverse" : ""
                    }
                    Helper.setLocalStorageData(`${_this.options.appId}_nodeSort`, nodeSort);
                }, false);
            });
        }

    }

    sortItems(items) {

        switch (this.sortField) {
            case "title": items.sort(Helper.titleSort);
                break;
            case "status": items.sort(Helper.statusSort);
                break;
            case "priority": items.sort(Helper.prioritySort);
                break;
            case "nodes": items.sort(Helper.nodeSort);
                break;
            default: items.sort(Helper.titleSort);
        }

        let sortElem = this.htmlElement.querySelector(`[data-sort='${this.sortField}']`);

        if (sortElem) {
            if (sortElem.classList.contains("reverse")) {
                items.sort().reverse();
            }
        }

        return items;
    };


}