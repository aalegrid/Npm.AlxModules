//import { Module } from 'alxnpm-mod-module';
import API from 'alxnpm-mod-api';
import Loader from 'alxnpm-mod-loader';
import Helper from 'alxnpm-mod-helper';

let Module = require('alxnpm-mod-module')

import { data } from './data.js';

export default class Note extends Module {
    constructor(moduleId, className, htmlElement, options) {
        super(moduleId, className, htmlElement, options);
        this.api = new API(this.options.apiUrl);
        this.loader = new Loader();

    }

    render(note, itemId) {

        this.wrapperContent = data.template;
        this.header = data.header;
        this.footer = data.footer;

        let _this = this;

        this.header.querySelector(".back a").addEventListener("click", function () {

            _this.hide();

            let flatArray = Helper.flattenArray(_this.options.listModule.items),
                item = Helper.findItemById(flatArray, itemId);
            _this.options.itemModule.render(item);
            _this.options.itemModule.show();

        }, false);

        this.header.querySelector(".page-title").innerHTML = note.name ? Helper.trim(32, note.name) : "Untitled";

        this.header.querySelector(".save a").addEventListener("click", function (e) {
            e.preventDefault();
            _this.htmlElement.querySelector("form button[type='submit']").click();
        }, false);

        this.footer.querySelector(".delete-note").addEventListener("click", function () {

        }, false);

        this.footer.querySelector(".home a").addEventListener("click", function () {
            _this.hide();
            _this.options.listModule.render(_this.options.listModule.items);
            _this.options.listModule.show();
        }, false);

        let form = this.form;

        if (note.name) {
            form.name.value = note.name;
            this.htmlElement.querySelector(".view .name").innerHTML = note.name;
        }

        if (note.value) {
            form.value.value = note.value;
            this.htmlElement.querySelector(".view .value").innerHTML = note.value;
        }

        if (this.htmlElement.querySelector(".note").classList.contains("view")) {
            this.header.querySelector(".save a").classList.add("disabled")
            this.footer.querySelector(".delete-note a").classList.add("disabled")

        }
        else {
            this.header.querySelector(".save a").classList.remove("disabled")
            this.footer.querySelector(".delete-note a").classList.remove("disabled")
        }


        if (note.binaryData) {
            this.htmlElement.querySelector(".binary-data-view").src = note.binaryData;
            this.htmlElement.querySelector(".binary-data").src = note.binaryData;

            this.htmlElement.querySelector(".clear-binary").style.display = "block";
            this.htmlElement.querySelector(".image-row").style.display = "block";
        }

        else {
            this.htmlElement.querySelector(".binary-data-view").src = "//";
            this.htmlElement.querySelector(".binary-data").src = "//";

            this.htmlElement.querySelector(".binary-data-view").style.display = "none";
            this.htmlElement.querySelector(".clear-binary").style.display = "none";
            this.htmlElement.querySelector(".image-row").style.display = "none";
        }

        // Events

        if (!note.id) {
            this.footer.querySelector(".delete-note a").classList.add("disabled");
            this.htmlElement.querySelector(".note").classList.remove("view");
            this.footer.querySelector(".edit a").classList.add("disabled");
            this.header.querySelector(".save a").classList.remove("disabled");
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.name.value || !form.value.value) {
                Helper.showMessage(_this.alertBox, "Name and value are required");
                return;
            }
            _this.save(note, itemId);
        });


        this.form.querySelector(".attach-file").addEventListener("change", function (e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                form.name.value = file.name;
                form.value.value = "file";
                var reader = new FileReader();
                form.querySelector(".filename").innerHTML = file.name;
                reader.onload = function (e) {
                    var dataUrl = reader.result;
                    _this.htmlElement.querySelector(".binary-data").src = dataUrl;
                    _this.htmlElement.querySelector(".binary-data").style.display = "block";
                    _this.htmlElement.querySelector(".clear-binary").style.display = "block";
                    _this.htmlElement.querySelector(".image-row").style.display = "block";
                }
                reader.readAsDataURL(file);
            }
        });


        this.form.querySelector(".clear-binary").addEventListener("click", function (e) {
            _this.htmlElement.querySelector(".binary-data").src = "//";
            _this.htmlElement.querySelector(".binary-data").style.display = "none";
            form.querySelector(".filename").innerHTML = "";
            this.style.display = "none";
        });

        this.footer.querySelector(".edit a i").addEventListener("click", function (e) {
            _this.htmlElement.querySelector(".note").classList.toggle("view");
            this.classList.toggle("fa-edit");
            this.classList.toggle("fa-file-search");

            if (_this.htmlElement.querySelector(".note").classList.contains("view")) {
                _this.header.querySelector(".save a").classList.add("disabled")
                _this.footer.querySelector(".delete-note a").classList.add("disabled")
            }

            else {
                _this.header.querySelector(".save a").classList.remove("disabled")
                _this.footer.querySelector(".delete-note a").classList.remove("disabled")
            }
        });

        this.footer.querySelector(".delete-note a").addEventListener("click", function () {
            _this.options.modalModule.header = "Delete";
            _this.options.modalModule.body = `Are you sure you want to delete '${note.name}'?`;

            let itemDeleteAction = function (id) {
                // Delete action
                _this.deleteNote(note.id, itemId);
                // End delete action
                _this.options.modalModule.hide();
                _this.options.modalModule.removeConfirmAction(itemDeleteAction);
            }

            _this.options.modalModule.setConfirmAction(itemDeleteAction);
            _this.options.modalModule.show();
        }, false);

        // parent chooser
        const div = document.createElement("div")

        div.setAttribute("class", "row parentitem-component");
        div.innerHTML = data.itemChooser
        form.insertBefore(div, form.children[form.childElementCount - 1]);

        const tree = Helper.formatAsTree(this.options.listModule.items, this.options.nodes, "note", note.itemId),
            ddElem = form.querySelector(".parent-dd"),
            parentInput = form.querySelector("#item"),
            parentId = form.querySelector("#itemId"),
            parentItem = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), note.itemId)

        ddElem.innerHTML = tree;
        parentInput.value = parentItem.title;
        parentId.value = note.itemId
        
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

    deleteNote(id, itemId) {
        this.loader.show();
        //request(url, method, body, isTokenRequest, isBodyStringify, isResponseJson)
        this.api.request(`/api/Metas/${id}`, "delete", {}, false, false, false)
            .then((response) => {
                this.loader.hide();
                if (response.status >= 400) {
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                    return;
                }
                const item = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), itemId)
                item.metas = Helper.removeById(item.metas, "id", id)
                const _items = Helper.updateTree(this.options.listModule.items, item.id, item);
                this.options.listModule.items = _items;
                this.hide()
                this.options.itemModule.render(item);
                this.options.itemModule.show();

            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });

    }

    save(note, itemId) {

        let form = this.form,
            savedNote = note,
            url,
            method,
            isAdd = typeof note.id === 'undefined',
            isResponseJson,
            itemMoved,
            oldItemId

        //ADD - POST
        if (isAdd) {
            url = `/api/Metas`;
            method = "post";
            isResponseJson = true,
                note.itemId = itemId;
        }

        //UPDATE - PUT
        else {
            url = `/api/Metas/${savedNote.id}`;
            method = "put";
            isResponseJson = false;

            if ((parseInt(savedNote.itemId) !== parseInt(form.itemId.value))) {
                itemMoved = true;
                oldItemId = parseInt(itemId); 
                savedNote.itemId = parseInt(form.itemId.value);                 
            }            
        }

        savedNote.name = form.name.value;
        savedNote.value = form.value.value;

        let img = this.htmlElement.querySelector(".note form .binary-data");

        if (img.src === 'http:' || img.src === 'file:///' || img.src.length <= 10) {
            savedNote.binaryData = null
        }
        else {
            savedNote.binaryData = img.src
        }

        this.loader.show();

        this.api.request(url, method, savedNote, false, true, isResponseJson)
            .then((response) => {

                if (response.status >= 400) {
                    Helper.showMessage(this.alertBox, `${response.status}: ${response.statusText}`);
                    return;
                }

                let flatArray = Helper.flattenArray(this.options.listModule.items);
                let item = Helper.findItemById(flatArray, savedNote.itemId);

                this.loader.hide();

                if (isAdd) {
                    Helper.showMessage(this.alertBox, "Note added");
                    // Add new note to note.metas array
                    item.metas.push(response);
                } else {
                    Helper.showMessage(this.alertBox, "Note saved");
                    // Update items

                    if(itemMoved) {
                        // Item is being moved another to new item
                        const oldItem = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), oldItemId);
                        oldItem.metas = Helper.removeById(oldItem.metas, "id", savedNote.id);
                        const items = Helper.updateTree(this.options.listModule.items, oldItemId, oldItem);
                        item.metas.push(savedNote)
                    }

                    let noteIndex = item.metas.findIndex((obj) => parseInt(obj.id) === parseInt(savedNote.id));
                    item.metas[noteIndex] = savedNote;
                }

                if (item.parentId) {
                    const parent = Helper.findItemById(Helper.flattenArray(this.options.listModule.items), item.parentId),
                    childIndex = parent.nodes.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
                    parent.nodes[childIndex] = item;
                    const items = Helper.updateTree(this.options.listModule.items, item.parentId, parent);
                    this.options.listModule.items = items;
                }

                else {
                    const index = this.options.listModule.items.findIndex((obj) => parseInt(obj.id) === parseInt(item.id))
                    this.options.listModule.items[index] = item;
                    this.options.listModule.items = this.options.listModule.items;
                }


            })
            .catch((error) => {
                this.loader.hide();
                Helper.showMessage(this.alertBox, error);
            });
    }

    cameraSuccess(imageData) {
        let _this = this;
        // var image = document.getElementById('myImage');
        // image.src = "data:image/jpeg;base64," + imageData;
        this.form.querySelector(".filename").innerHTML = "CameraImage";
        // const binaryData = `${_this.options.appId}_binarydata`;
        //   Helper.setLocalStorageData(binaryData, dataUrl);
        _this.htmlElement.querySelector(".binary-data").src = imageData;
        _this.htmlElement.querySelector(".clear-binary").style.display = "block";
        _this.htmlElement.querySelector(".image-row").style.display = "block";

    }

    cameraError(message) {
        Helper.showMessage(this.alertBox, `${message}`);
    }

}