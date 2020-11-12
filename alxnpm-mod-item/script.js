import API from 'alxnpm-mod-api';
import Loader from 'alxnpm-mod-loader';
import Helper from 'alxnpm-mod-helper';
import ObjectPicker from 'alxnpm-mod-object-picker';
import ModuleSwitcher from 'alxnpm-mod-module-switcher';
import Chart from 'chart.js'

let Module = require('alxnpm-mod-module')

import { data } from './data.js';

export default class Item extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
        this.api = new API(this.options.apiUrl);
        this.switcher = new ModuleSwitcher();
        this.loader = new Loader();
        this.sortNodesCol = "title";
        this.sortNodesColReverse = false;
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

        if (this.options.nodes === "all" || (this.options.nodes === "single" && parseInt(item.parentId) === 0)) {
            this.setNodeCollapse();
            this.setNodeSort();
            this.footer.querySelector(".add-node a").addEventListener("click", function () {
                _this.hide();
                _this.render({ parentId: item.id });
                _this.show();
            }, false);
        }
        else {
            this.htmlElement.querySelector(".nodes-list").style.display = "none";
            this.footer.querySelector(".add-node").style.display = "none";
        }

        if (this.options.appDomain === "project") {
            if (this.options.nodes === "all" || (this.options.nodes === "single" && parseInt(item.parentId) === 0)) {
                this.htmlElement.querySelector(".page-chart").style.display = "block";
            }
            else {
                this.htmlElement.querySelector(".page-chart").style.display = "none";
            }
        }
        else {
            this.htmlElement.querySelector(".page-chart").style.display = "none";
        }

        const form = this.form;

        this.setNoteCollapse();

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

        this.header.querySelector(".page-title").innerHTML = item.title ? Helper.trim(25, item.title) : 'Untitled';

        this.header.querySelector(".save a").addEventListener("click", function (e) {
            e.preventDefault();
            _this.htmlElement.querySelector("form button[type='submit']").click();
        }, false);

        this.footer.querySelector(".delete-item a").addEventListener("click", function () {
            _this.options.modalModule.header = "Delete";
            _this.options.modalModule.body = `Are you sure you want to delete '${item.title}'?`;

            let itemDeleteAction = function (id) {
                // Delete action
                _this.postDeleteItem(item.id);
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

        /* #endregion */

        /* #region Object Pickers */

        const iconPicker = new ObjectPicker("iconPicker", "icon-object-picker", form.querySelector("#iconPicker"), {
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

        if (this.options.appDomain === "list" && item.tag && item.tag.includes("list-add")) {
            this.htmlElement.querySelector("table thead .control").style.display = "block";
        }
        else {
            this.htmlElement.querySelector("table thead .control").style.display = "none";
        }

        if (this.options.appDomain === "project" && item.nodes && item.nodes.length) {
            this.htmlElement.querySelector(".filter-done").style.display = "block";
            const hideDone = Helper.getPrefItem(this.options.appId, "hideDone")

            if (hideDone) {
                this.htmlElement.querySelector(".filter-done a").classList.add("true")
            }

            this.htmlElement.querySelector(".filter-done a").addEventListener("click", function () {
                const el = this.closest("a");
                el.classList.toggle("true");
                //Helper.setLocalStorageData(`${_this.options.appId}_hideDone`, el.classList.contains("on"));
                Helper.setPrefItem(_this.options.appId, "hideDone", el.classList.contains("true"))
                _this.bindNodes(item, el.classList.contains("true"));
            }, false);
        }
        else {
            this.htmlElement.querySelector(".filter-done").style.display = "none";
        }

        item.icon && (form.icon.value = item.icon);
        item.color && (form.color.value = item.color);
        item.icon && form.querySelector(".picker-trigger-icon").firstChild.setAttribute("class", item.icon);
        item.color && (form.querySelector(".picker-trigger-color").firstChild.style.backgroundColor = item.color);

        /* #endregion */

        /* #region ADD */
        if (isAdd) {
            this.footer.querySelector(".add-note").classList.add("disabled");
            this.footer.querySelector(".add-node").classList.add("disabled");
            this.footer.querySelector(".delete-item").classList.add("disabled");
            this.htmlElement.querySelector(".notes-list").style.display = "none";
            this.htmlElement.querySelector(".nodes-list").style.display = "none";
            this.htmlElement.querySelector('.page-chart').style.display = "none";
        }

        /* #endregion */

        /* #region Update */
        if (!isAdd) {

            this.htmlElement.querySelector(".add-note a").addEventListener("click", function () {
                _this.hide();
                _this.options.noteModule.render({}, item.id);
                _this.options.noteModule.show();
            }, false);

            if (this.options.nodes === "all" || (this.options.nodes === "single" && parseInt(item.parentId) === 0)) {
                // Add add node button
                this.htmlElement.querySelector(".add-node a").addEventListener("click", function () {
                    _this.hide();
                    _this.render({ parentId: item.id });
                    _this.show();
                }, false);

                // Render Nodes
                if (item.nodes) {
                    if (this.options.appDomain === "project") {
                        const hideDone = Helper.getPrefItem(this.options.appId, "hideDone")
                        this.bindNodes(item, hideDone);
                    } else {
                        this.bindNodes(item);
                    }

                }
            }

            // parent chooser
            if ((this.options.nodes === "single" && item.parentId) || this.options.nodes === "all") {
                const div = document.createElement("div");

                div.setAttribute("class", "row parentitem-component");
                div.innerHTML = data.parentChooser
                form.insertBefore(div, form.children[form.childElementCount - 1]);

                const tree = Helper.formatAsTree(this.options.listModule.items, this.options.nodes, "item", item.id),
                    ddElem = form.querySelector(".parent-dd"),
                    parentInput = form.querySelector("#parent"),
                    parentId = form.querySelector("#parentId"),
                    parentItem = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), item.parentId)

                ddElem.innerHTML = tree;
                parentInput.value = parentItem ? parentItem.title : "Root";
                parentId.value = item.parentId

                form.querySelector(".input-group").addEventListener("click", function (e) {
                    e.preventDefault();
                    form.querySelector(".parent-dd").classList.toggle("true")
                }, false)

                const liItems = form.querySelectorAll(".parentid-tree li a")

                if (liItems && liItems.length) {
                    liItems.forEach(function (item) {
                        item.addEventListener("click", function (e) {
                            e.preventDefault();
                            const id = parseInt(this.closest("a").getAttribute("data-id"));
                            parentInput.value = this.innerText
                            parentId.value = id
                        }, false)
                    })
                }


                const parentItems = form.querySelectorAll(".parentid-tree li .parent")

                if (parentItems && parentItems.length) {
                    parentItems.forEach(function (item) {
                        item.addEventListener("click", function (e) {
                            e.preventDefault();
                            const el = e.target;
                            el.classList.toggle("open")
                            el.nextSibling.nextSibling.classList.toggle("open");
                        }, false)
                    })
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
                    let icon = value.binaryData ? `<img class="img-icon" src=${value.binaryData} />` : `<i class="${_this.options.noteIcon} note-icon"></i>`;
                    notesHtml += `<tr data-noteid="${value.id}">
                         <td><a  title='${value.id}' class='note-item' data-noteid="${value.id}">${icon}</a></td>
                         <td><a  title='${value.id}' class='note-item' data-noteid="${value.id}">${value.name ? Helper.trim(35, value.name) : 'Untitled'}</a></td>
                         <td><a  title='${value.id}' class='delete-note' data-noteid="${value.id}"><i class='far fa-trash'></i></a></td>
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

        if (this.options.nodes === "all" || (this.options.nodes === "single" && parseInt(item.parentId) === 0)) {
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

        if ((this.options.nodes === "all" || (this.options.nodes === "single" && parseInt(item.parentId) === 0)) && item.nodes) {

            this.addNodeSortLinks(item);
        }

        let deleteNoteLinks = this.htmlElement.querySelectorAll(".delete-note");

        if (deleteNoteLinks) {

            deleteNoteLinks.forEach(function (_item) {
                _item.addEventListener("click", function () {
                    let id = this.getAttribute("data-noteid"),
                        note = Helper.findItemById(item.metas, id);

                    _this.options.modalModule.header = "Delete";
                    _this.options.modalModule.body = `Are you sure you want to delete '${note.name}'?`;

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

        if (this.options.nodes === "all" || (this.options.nodes === "single" && parseInt(item.parentId) === 0)) {
            this.htmlElement.querySelector(".nodes-list .collapse").addEventListener("click", function (e) {
                const iElem = e.target.closest("a").querySelector("i")
                _this.htmlElement.querySelector(".nodes-list table").classList.toggle("hide");
                iElem.classList.toggle("fa-minus-square");
                iElem.classList.toggle("fa-plus-square");
                Helper.setPrefItem(_this.options.appId, "nodeCollapse",
                    _this.htmlElement.querySelector(".nodes-list table").classList.contains("hide"))
            }, false);
        }

        else {
            _this.htmlElement.querySelector(".nodes-list").style.display = "none";
        }

        this.htmlElement.querySelector(".notes-list .collapse").addEventListener("click", function (e) {
            const iElem = e.target.closest("a").querySelector("i")
                _this.htmlElement.querySelector(".notes-list table").classList.toggle("hide");
                iElem.classList.toggle("fa-minus-square");
                iElem.classList.toggle("fa-plus-square");
                Helper.setPrefItem(_this.options.appId, "noteCollapse",
                    _this.htmlElement.querySelector(".notes-list table").classList.contains("hide"))
        }, false);


        this.htmlElement.querySelector("#icon").addEventListener('search', function () {
            if (!this.value) {
                const iElem = this.closest(".input").querySelector("a")
                iElem.firstChild.setAttribute("class", "fal fa-flag");
            }
        });

        this.htmlElement.querySelector("#color").addEventListener('search', function () {
            if (!this.value) {
                const iElem = this.closest(".input").querySelector("a")
                iElem.firstChild.style.backgroundColor = "#fff";
            }
        });



        /* #endregion */

    }

    bindNodes(item, hideDone) {

        const _this = this;
        let nodes;
        if (this.options.appDomain === "project") {
            nodes = hideDone ? this.sortItems(item.nodes.filter((item) => parseInt(item.status) !== 2)) : this.sortItems(item.nodes)
        } else {
            nodes = item.nodes;
        }
        this.htmlElement.querySelector(".nodes-count").innerHTML = nodes ? nodes.length : "0";
        if (!item.nodes || !item.nodes.length) {
            this.htmlElement.querySelector(".nodes-header .collapse i").style.display = "none";
            this.htmlElement.querySelector('.page-chart').style.display = "none";
        }
        if (item.nodes.length) {
            let nodesHtml = "",
                nodesTbody = this.htmlElement.querySelector(".nodes-list table tbody");
            if (nodes) {
                nodes.forEach(function (value) {
                    if (value.tag === "hidden") {
                        return;
                    }
                    const statusIcon = parseInt(value.status) === 0 ? "square" : (parseInt(value.status) === 1 ? "clock" : "check-square"),
                        priorityIcon = parseInt(value.priority) === 0 ? "info-circle" : (parseInt(value.priority) === 1 ? "smile" : "exclamation-triangle"),
                        iconOrCheckBox = _this.options.appDomain === "list" && item.tag && item.tag.includes("list-checkbox") ? `<input type="checkbox" name="checkbox_${value.id}"/>` : `<i class="${value.icon ? value.icon : _this.options.nodeIcon}"></i>`,
                        colorBox = value.color ? `<span class="colorbox" style="background-color:${value.color}"></span>` : '',
                        notes = value.metas ? (value.metas.length ? `<span style="font-size:10px; color: #666"><i class="fal fa-comment-alt"></i> ${value.metas.length}</span>` : "") : "";

                    nodesHtml += `<tr data-nodeid="${value.id}">
                        <td>${iconOrCheckBox}</td>
                        <td>
                            ${colorBox}
                            <a class='node-item' data-nodeid="${value.id}">${value.title} ${notes}</a>
                        </td>`;
                    if (_this.options.fields.includes("priority")) {
                        nodesHtml += `<td><a class='node-priority-click' data-nodeid="${value.id}" data-nodepriority="${value.priority}"><i class="fal fa-${priorityIcon}"></i></a></td>`;
                    }
                    if (_this.options.fields.includes("status")) {
                        nodesHtml += `<td><a  class='node-status-click' data-nodeid="${value.id}" data-nodestatus="${value.status}"><i class="far fa-${statusIcon}"></i></a></td>`;

                    }
                    if (_this.options.nodeCount) {
                        nodesHtml += `<td>${value.nodes.length}</td>`;
                    }

                    if (_this.options.appDomain === "list" && item.tag && item.tag.includes("list-add")) {
                        nodesHtml += `<td style="text-align:right">${Helper.formatMoney(value.control)}</td>`;
                    }
                    nodesHtml += `<td><a  class='delete-node' data-nodeid="${value.id}"><i class='far fa-trash'></i></a></td>
                            </tr>`;
                });

                if (this.options.appDomain === "list" && item.tag && item.tag.includes("list-add")) {

                    let total = Helper.listAdd(item.nodes);

                    nodesHtml += `<tr class="list-add">
                            <td></td>
                            <td></td>
                            <td>Total</td>
                            <td><strong>$${Helper.formatMoney(total)}</strong></td>
                            <td></td>
                            </tr>`

                }

                nodesTbody.innerHTML = nodesHtml;

                if (this.options.appDomain === "project") {

                    const getCount = (value, field, array) => {
                        const filtered = array.filter((item) => {
                            return parseInt(item[field]) === parseInt(value);
                        });
                        return filtered ? filtered.length : 0
                    },
                        chartData = {
                            type: 'bar',
                            data: {
                                labels: [],
                                datasets: [{
                                    // barPercentage: 1,
                                    // categoryPercentage: 1,
                                    label: 'Project Status',
                                    data: [],
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                maintainAspectRatio: false,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            //max: 100,
                                            min: 0,
                                            //stepSize: 10
                                        }
                                    }]
                                },
                                title: {
                                    display: true,
                                    text: 'Project Status'
                                },
                                legend: {
                                    display: false,

                                }
                            }
                        },
                        fields = ["Todo", "Started", "Done", "Low", "Medium", "High"],
                        items = item.nodes

                    fields.forEach(function (item, index) {
                        const field = index < 3 ? "status" : "priority",
                            value = index < 3 ? index : index - 3,
                            color = index < 3 ? "#0072bc" : "#f7941d",
                            count = getCount(value, field, items)
                        chartData.data.labels.push(item)
                        chartData.data.datasets[0].data.push(count)
                    });

                    const maxTick = Math.max.apply(Math, chartData.data.datasets[0].data);
                    chartData.options.scales.yAxes[0].ticks.stepSize = Math.round(maxTick / 4) || 1

                    const ctx = this.htmlElement.querySelector('#itemChart').getContext('2d'),
                        chartJs = new Chart(ctx, chartData);

                    if (this.htmlElement.querySelector('#itemChart').getAttribute("height") === "0") {
                        this.htmlElement.querySelector('#itemChart').setAttribute("height", "190");
                        this.htmlElement.querySelector('#itemChart').style.height = "150px";
                    }
                }
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
                        _this.options.modalModule.body = `Are you sure you want to delete '${node.title}'?`;
                        let deleteNodeAction = function () {
                            // Delete action
                            _this.postDeleteItem(id);
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
        const sortNodesCol = Helper.getPrefItem(this.options.appId, "sortNodesCol") || 'title',
            sortNodesColReverse = Helper.getPrefItem(this.options.appId, "sortNodesColReverse") || false,
            sortElem = this.htmlElement.querySelector(`.nodes-list table thead tr th a[data-sort='${sortNodesCol}']`);
        this.sortNodesCol = sortNodesCol
        this.sortNodesColReverse = sortNodesColReverse
        sortElem.classList.add("selected");
        if (sortNodesColReverse) {
            sortElem.classList.add("reverse");
        }
    }

    setNodeCollapse() {
        const collapse = Helper.getPrefItem(this.options.appId, "nodeCollapse")
        if (collapse) {
            if (document.querySelector(".item .nodes-list table")) {
                document.querySelector(".item .nodes-list table").classList.add("hide");
            }
            const e = document.querySelector(".item .nodes-list .collapse i")
            if (e) {
                e.classList.remove("fa-minus-square")
                e.classList.add("fa-plus-square")
            }

        }
    }

    setNoteCollapse() {
        const collapse = Helper.getPrefItem(this.options.appId, "noteCollapse")
        if (collapse) {
            if (document.querySelector(".item .notes-list table")) {
                document.querySelector(".item .notes-list table").classList.add("hide");
            }
            const e = document.querySelector(".item .notes-list .collapse i")
            if (e) {
                e.classList.remove("fa-minus-square")
                e.classList.add("fa-plus-square")
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

        this.api.request(`/api/Items/${savedItem.id}`, "put", savedItem, false, true, false)
            .then((response) => {

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

    // _save
    save(item) {
        let form = this.form,
            savedItem = item, url, method,
            isAdd = typeof item.id === 'undefined',
            isResponseJson,
            user = Helper.getPrefItem(this.options.appId, "user"),
            parentMoved,
            oldParentId;

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
            savedItem.nodes = [];
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
            if (form.parentId && (parseInt(savedItem.parentId) !== parseInt(form.parentId.value))) {
                parentMoved = true;
                oldParentId = savedItem.parentId;
                savedItem.parentId = parseInt(form.parentId.value);
            }
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

        // console.log(savedItem);
        // return;

        this.loader.show();

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

                    if (parentMoved) {

                        if (parseInt(oldParentId)) {
                            const oldParent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), oldParentId);
                            oldParent.nodes = Helper.removeById(oldParent.nodes, "id", savedItem.id);
                            const items = Helper.updateTree(this.options.listModule.items, oldParentId, oldParent);
                            this.options.listModule.items = items;
                        }

                        else {
                            const items = Helper.removeById(this.options.listModule.items, "id", savedItem.id);
                            this.options.listModule.items = items;
                        }

                        //Add to new parent
                        if (parseInt(savedItem.parentId)) {
                            const newParent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), savedItem.parentId);
                            newParent.nodes.push(savedItem);
                            const items = Helper.updateTree(this.options.listModule.items, oldParentId, newParent);
                            this.options.listModule.items = items;
                        }

                        else {
                            const items = this.options.listModule.items;
                            items.push(savedItem);
                            this.options.listModule.items = items;
                        }


                    }

                    //Update parent
                    if (item.parentId) {
                        const parent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), item.parentId),
                            childIndex = parent.nodes.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
                        parent.nodes[childIndex] = savedItem;
                        const items = Helper.updateTree(this.options.listModule.items, item.parentId, parent);
                        this.options.listModule.items = items;
                    }

                    else {
                        const index = this.options.listModule.items.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
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


    postDeleteItem(id) {
        const user = Helper.getPrefItem(this.options.appId, "user"),
        data = {
            UserId: user.id,
            Id: id,
            Item: {}
        }
        //console.log(data)
        this.loader.show();
        //request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request(`/api/Items/DeleteItem`, "post", data, false, true, false)
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
        const _this = this,
            sortLinks = this.htmlElement.querySelectorAll(".nodes-list table thead [data-sort]");
        if (sortLinks) {
            sortLinks.forEach(function (item) {
                item.addEventListener("click", function (e) {
                    const clickedItem = this.closest("a").getAttribute("data-sort");
                    if (_this.sortNodesCol === clickedItem) {
                        sortLinks.forEach(function (elem) {
                            if (elem.getAttribute("data-sort") !== clickedItem) {
                                elem.classList.remove("reverse");
                            }
                        })
                        this.classList.toggle("reverse");
                    }
                    sortLinks.forEach(elem => elem.classList.remove("selected"))
                    this.classList.add("selected")
                    _this.sortNodesCol = clickedItem;
                    _this.sortNodesColReverse = this.classList.contains("reverse")
                    _this.bindNodes(data);
                    Helper.setPrefItem(_this.options.appId, "sortNodesCol", _this.sortNodesCol)
                    Helper.setPrefItem(_this.options.appId, "sortNodesColReverse", _this.sortNodesColReverse)
                }, false);
            });
        }

    }

    sortItems(items) {

        switch (this.sortNodesCol) {
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

        if (this.sortListColReverse) {
            items.sort().reverse();
        }

        return items;
    };

}