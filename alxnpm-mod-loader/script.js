const defaultHtml = '<div class="loading-mask"></div><div class="loading-box"><div class="loading-image"></div></div>';

export class Loader {
    constructor(loaderId = 'loader', loaderHtml = defaultHtml) {
        this._loaderHtml = loaderHtml;
        this._loaderId = loaderId;
    }

    get loaderHtml() {
        return this._loaderHtml;
    }

    set loaderHtml(loaderHtml) {
        this._loaderHtml = loaderHtml;
    }

    get loaderId() {
        return this._loaderId;
    }

    set loaderId(loaderId) {
        this._loaderId = loaderId;
    }

    show() {
        let e = document.getElementById(this.loaderId);
        if(!e) {
            e = document.createElement("div");
            e.setAttribute("id",this.loaderId);
            e.innerHTML = this.loaderHtml;
            document.body.insertBefore(e, document.body.firstChild);         
        }  
    }

    hide() {
        let e = document.getElementById(this.loaderId);
        if(e) {
            e.parentNode.removeChild(e);
        }  
    }

}