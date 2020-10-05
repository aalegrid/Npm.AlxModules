export default class Helper {
  constructor() {
  }

  static getLocalStorageData(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static setLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static removeLocalStorageData(key) {
    localStorage.removeItem(key);
  }

  static showMessage(element, msg) {
    element.innerHTML = msg;
    element.parentElement.style.display = "block";
    window.scroll(200, 0);
  }

  static findItemById(array, id) {
    return array.find((item) => {
      return parseInt(item.id) === parseInt(id);
    });
  }

  static getUser(appId) {
    return this.getLocalStorageData(`${appId}_user`);
  }

  static findItemById(array, id) {
    return array.find((item) => {
      return parseInt(item.id) === parseInt(id);
    });
  }

  static removeById(array, key, value) {
    return array.filter(function (obj) {
      return parseInt(obj[key]) !== parseInt(value);
    });
  }

  static trim(num, content) {
    return content.length > num ? content.substring(0, num) + "..." : content
  }

  static formatDate(date) {
    const d = new Date(date);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${da}-${mo}-${ye}`;
  }

  static flattenArray(nodes) {
    let flat = [];
    let flatten = array => {
      array.forEach(function (value) {
        flat.push(value);
        value.nodes && flatten(value.nodes);
      });
    };

    flatten(nodes);
    return flat;
  }

  static formatAsTree(array) {

    let html = "<ul>";

    let parseAsTree = data => {

      data.forEach(function (value) {

        if (value.title) {

          let link = `<a href="javascript:void(0)" class="list-item" data-itemid="${value.id}">${value.title}</a>`;

          if (value.nodes.length) {
            html += `<li><span class="parent">${link}</span>`;
          }

          else {
            //html += '<li>' + item + '</li>';
            html += `<li>${link}</li>`;
          }
        }

        if (value.nodes.length) {
          html += '<ul class="nodes">';
          parseAsTree(value.nodes);
          html += '</ul></li>';
        }

      });
    };
    parseAsTree(array);

    html += '</ul>';

    return html;

  }

  static formatAsTreeForMyLists(array, renderColor, renderIcon) {

    let html = "<ul>",
    _this = this;

    let parseAsTree = data => {

      data.forEach(function (value) {

        if(value.tag === "hidden") {
          return;
        }

        if (value.title) {

          let icon = "",
            color = "",
            image = "",
            link = `<a href="javascript:void(0)" class="list-item icon-link" data-itemid="${value.id}"><i class="fal fa-edit"></i></a>`;

          icon = renderIcon ? (value.icon ? `<i class="${value.icon}"></i>` : "") : "";
          color = renderColor ? (value.color ? ` style="background-color:${value.color}"` : "") : "";

          if (value.metas) {
            const binaryImage = _this.getItemMetaImage(value.metas);
            binaryImage && (image = `<img src="${binaryImage}"/>`);
          }

          if (value.nodes.length) {

            html += `<li${color}><span class="parent" data-itemid="${value.id}">${image ? image : icon}<span class="title">${value.title}</span></span>${link}`;
          }

          else {
            //html += '<li>' + item + '</li>';
            html += `<li${color}><a href="javascript:void(0)" class="list-item text-link" data-itemid="${value.id}">${image ? image : icon}<span class="title">${value.title}</span></a>${link}</li>`;
          }
        }

        if (value.nodes.length) {
          html += '<ul class="nodes">';
          parseAsTree(value.nodes.sort(_this.titleSort));
          html += '</ul></li>';
        }

      });
    };
    parseAsTree(array);

    html += '</ul>';

    return html;

  }

  static updateTree(array, id, item) {

    let items = array;

    let parseAsTree = data => {

      data.every(function (value) {

        if (parseInt(value.id) === parseInt(id)) {
          value = item;
          return false;
        }


        if (value.nodes.length) {
          parseAsTree(value.nodes);
        }

      });
    };
    parseAsTree(items);

    return items;

  }

  static clearLocalDataStorage(prefix) {
    Helper.removeLocalStorageData(`${prefix}_user`);
    Helper.removeLocalStorageData(`${prefix}_items`);
    Helper.removeLocalStorageData(`${prefix}_openItems`);
    Helper.removeLocalStorageData(`${prefix}_nodeCollapse`);
    Helper.removeLocalStorageData(`${prefix}_noteCollapse`);
    Helper.removeLocalStorageData(`${prefix}_nodeSort`);
    Helper.removeLocalStorageData(`${prefix}_listSort`);
    sessionStorage.removeItem("token");
  }

  static getItemMetaImage(metas) {
    if (!metas.length) {
      return null;
    }
    let image = null,
      _metas = metas.sort((a, b) => a.name.localeCompare(b.name));
    _metas.every(function (meta) {
      if (meta.binaryData) {
        image = meta.binaryData;
        return false;
      }
      else return true;
    });
    return image;
  }

  static listAdd(nodes) {
    let numOr0 = n => isNaN(n) ? 0 : n,
      total = 0

    for (var i = 0; i < nodes.length; i++) {
      total += nodes[i].control ? parseFloat(nodes[i].control) : 0;  // Iterate over your first array and then grab the second element add the values up
    }

    return total;
  }

  static titleSort(a, b) {
    if (!a.title) {
      // Change this values if you want to put `null` values at the end of the array
      return -1;
    }

    if (!b.title) {
      // Change this values if you want to put `null` values at the end of the array
      return +1;
    }
    return a.title.localeCompare(b.title);
  }

  static colorSort(a, b) {
    if (!a.color) {
      return -1;
    }
    if (!b.color) {
      return +1;
    }
    return a.color.localeCompare(b.color);
  }

  static iconSort(a, b) {
    if (!a.icon) {
      return -1;
    }
    if (!b.icon) {
      return +1;
    }
    return a.icon.localeCompare(b.icon);
  }
  
  static prioritySort(a, b) { return a.priority > b.priority ? 1 : a.priority === b.priority ? 0 : -1 }

  static statusSort(a, b) { return a.status > b.status ? 1 : a.status === b.status ? 0 : -1 }

  static nodeSort(a, b) { return a.nodes.length > b.nodes.length ? 1 : a.nodes.length === b.nodes.length ? 0 : -1 }

  static metaSort(a, b) { return a.metas.length > b.metas.length ? 1 : a.metas.length === b.metas.length ? 0 : -1 }


}