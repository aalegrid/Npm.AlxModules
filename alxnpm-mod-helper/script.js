export class Helper {
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
    }

    static findItemById(array, id) {
        return array.find((item) => {
          return parseInt(item.id) === parseInt(id);
        });
    }

    static getUser(appId){
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
      return content.length > num ? content.substring(0,num) + "..." : content
    }

    static formatDate(date) {
      const d = new Date(date);
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
      return `${da}-${mo}-${ye}`;
    }

    static flattenArray(items) {
      let flat = [];
      let flatten = array => {
        array.forEach(function(value) {
          flat.push(value);
          value.nodes && flatten(value.nodes);
        });
      };
  
      flatten(items);
      return flat;
    }

    

}