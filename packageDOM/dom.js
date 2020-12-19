window.dom = {
    // 创建节点
    create(string) {
        // 用 template 可以包含全部标签，但是 div 不行，div里面不能有 table
        let container = document.createElement("template");
        container.innerHTML = string.trim();
        return container.content.firstChild;
    },

    // 在节点后新增节点
    after(node1, node2) {
        node1.parentNode.insertBefore(node2, node1.nextSibling);
    },

    // 在节点前新增节点
    before(node1, node2) {
        node1.parentNode.insertBefore(node2, node1);
    },

    // 新增节点子节点
    append(parent, node) {
        parent.appendChild(node);
    },

    // 给节点添加一个父节点
    wrap(node, parent) {
        dom.before(node, parent);
        dom.append(parent, node);
    },

    // 删除一个节点
    remove(node) {
        node.parentNode.removeChild(node);
        return node;
    },

    // 删除一个节点的所有子节点
    empty(node) {
        // node.innerHTML = '';
        const childNodes = node.childNodes;
        const array = [];
        let x = node.firstChild;
        while (x) {
            array.push(dom.remove(node.firstChild));
            x = node.firstChild;
        }
        return array;
    },

    // 读写属性
    attr(node, name, value) {
        if (arguments.length === 3) {
            node.setAttribute(name, value)
        } else if (arguments.length === 2) {
            return node.getAttribute(name);
        }
    },

    // 读写文本内容
    text(node, string) {
        if ('innerText' in node) {
            node.innerText = string;
        } else {
            node.textContent = string;
        }
    },

    // 读写 HTML 内容
    html(node, string) {
        node.innerHTML(string);
    },

    // 用于读写style
    style(node, name, value) {
        if (arguments.length === 3) {
            node.style[name] = value;
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                return node.style[name];
            } else if (name instanceof Object) {
                const object = name;
                for (let key in object) {
                    node.style[key] = object[key];
                }
            }
        }
    },

    // class 相关
    class: {
        // 添加 class
        add(node, className) {
            node.classList.add(className);
        },

        // 删除 class
        remove(node, className) {
            node.classList.remove(className);
        },

        // 判断是否有这个 class
        has(node, className) {
            return node.classList.contains(className);
        }
    },

    // 添加事件监听
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn);
    },

    // 删除事件监听
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn);
    },

    // 获取标签
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector);
    },

    // 获取父元素
    parent(node) {
        return node.parentNode;
    },

    // 获取子元素
    children(node) {
        return node.children;
    },

    // 获取兄弟姐妹元素
    sibling(node) {
        return Array.from(node.parentNode.children).filter(n => n !== node);
    },

    // 获取兄弟元素（弟弟）
    next(node) {
        let x = node.nextSibling;
        while (x && x.nodeType === 3) {
            x = x.nextSibling;
        }
        return x;
    },

    // 获取兄弟元素（哥哥）
    previous(node) {
        let x = node.previousSibling;
        while (x && x.nodeType === 3) {
            x = x.previousSibling;
        }
        return x;
    },

    // 用于遍历所有节点并执行操作
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i]);
        }
    },

    // 获取在兄弟姐妹节点中的排名
    index(node) {
        const list = dom.children(node.parentNode);
        let i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break;
            }
        }
        return i;
    }
};