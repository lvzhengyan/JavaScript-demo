window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
    // 重载
    let elements;
    if (typeof selectorOrArrayOrTemplate === 'string') {
        if (selectorOrArrayOrTemplate[0] === '<') {
            elements = [createElement(selectorOrArrayOrTemplate)];
        } else {
            elements = document.querySelectorAll(selectorOrArrayOrTemplate);
        }
    } else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate;
    }

    function createElement(string) {
        const container = document.createElement("template");
        container.innerHTML = string.trim();
        return container.content.firstChild;
    }

    // 创建一个对象，这个对象的 __proto__ 为括号里面的东西
    const api = Object.create(jQuery.prototype)
    // const api = { __proto__: jQuery.prototype }
    Object.assign(api, {
        elements: elements,
        oldApi: selectorOrArrayOrTemplate.oldApi
    })
    return api;
}

jQuery.fn = jQuery.prototype = {
    jquery: true,
    constructor: jQuery,
    // "addClass": function (className) {
    // }
    // 闭包：函数访问外部变量
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(className);
        }
        // this就是api
        // return api;
        return this;
    },

    find(selectorOrArrayOrTemplate) {
        let array = [];
        for (let i = 0; i < this.elements.length; i++) {
            array = array.concat(Array.from(this.elements[i].querySelectorAll(selectorOrArrayOrTemplate)));
        }
        array.oldApi = this;
        // 构造一个新的 api 对象用于操作，避免和其他操作相互影响
        return jQuery(array);
    },

    back() {
        return this.oldApi;
    },

    each(fn) {
        for (let i = 0; i < this.elements.length; i++) {
            fn.call(null, this.elements[i], i);
        }
        return this;
    },

    parent() {
        const array = [];
        this.each((node) => {
            if (array.indexOf(node.parentNode) === -1) {
                array.push(node.parentNode);
            }
        })
        return jQuery(array);
    },

    children() {
        const array = [];
        this.each((node) => {
            // ... 展开操作符
            array.push(...node.children);
        })
        return jQuery(array);
    },

    get(index) {
        return this.elements[index];
    },

    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => {
                node.appendChild(el);
            })
        } else if (node.jquery === true) {
            this.each(el => {
                node.get(0).appendChild(el);
            })
        }
    },

    print() {
        console.log(this.elements);
    }
}