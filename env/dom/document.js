/**
 * @env-module document
 * @description 浏览器document对象模拟
 * @compatibility Chrome 80+, Firefox 75+, Edge 79+
 */

(function() {
    // 简单的Element实现
    function Element(tagName) {
        this.tagName = tagName.toUpperCase();
        this.nodeName = this.tagName;
        this.nodeType = 1;
        this.nodeValue = null;
        this.childNodes = [];
        this.children = [];
        this.parentNode = null;
        this.parentElement = null;
        this.firstChild = null;
        this.lastChild = null;
        this.previousSibling = null;
        this.nextSibling = null;
        this.attributes = {};
        this.style = {};
        this.classList = {
            _classes: [],
            add: function(...tokens) {
                tokens.forEach(t => {
                    if (!this._classes.includes(t)) this._classes.push(t);
                });
            },
            remove: function(...tokens) {
                tokens.forEach(t => {
                    const idx = this._classes.indexOf(t);
                    if (idx > -1) this._classes.splice(idx, 1);
                });
            },
            contains: function(token) {
                return this._classes.includes(token);
            },
            toggle: function(token, force) {
                if (force !== undefined) {
                    if (force) this.add(token);
                    else this.remove(token);
                    return force;
                }
                if (this.contains(token)) {
                    this.remove(token);
                    return false;
                }
                this.add(token);
                return true;
            },
            item: function(index) {
                return this._classes[index] || null;
            },
            get length() {
                return this._classes.length;
            },
            toString: function() {
                return this._classes.join(' ');
            }
        };
        this.className = '';
        this.id = '';
        this.innerHTML = '';
        this.outerHTML = '';
        this.innerText = '';
        this.textContent = '';
        this.value = '';
        this.src = '';
        this.href = '';
        this.dataset = {};
        this._eventListeners = {};
    }

    Element.prototype = {
        getAttribute: function(name) {
            return this.attributes[name] || null;
        },
        setAttribute: function(name, value) {
            this.attributes[name] = String(value);
            if (name === 'class') this.className = value;
            if (name === 'id') this.id = value;
        },
        removeAttribute: function(name) {
            delete this.attributes[name];
        },
        hasAttribute: function(name) {
            return name in this.attributes;
        },
        getAttributeNames: function() {
            return Object.keys(this.attributes);
        },
        appendChild: function(child) {
            child.parentNode = this;
            child.parentElement = this;
            this.childNodes.push(child);
            if (child.nodeType === 1) this.children.push(child);
            this.lastChild = child;
            if (!this.firstChild) this.firstChild = child;
            return child;
        },
        removeChild: function(child) {
            const idx = this.childNodes.indexOf(child);
            if (idx > -1) {
                this.childNodes.splice(idx, 1);
                const childIdx = this.children.indexOf(child);
                if (childIdx > -1) this.children.splice(childIdx, 1);
            }
            child.parentNode = null;
            child.parentElement = null;
            return child;
        },
        insertBefore: function(newNode, referenceNode) {
            if (!referenceNode) {
                return this.appendChild(newNode);
            }
            const idx = this.childNodes.indexOf(referenceNode);
            if (idx > -1) {
                newNode.parentNode = this;
                newNode.parentElement = this;
                this.childNodes.splice(idx, 0, newNode);
                if (newNode.nodeType === 1) {
                    const childIdx = this.children.indexOf(referenceNode);
                    if (childIdx > -1) this.children.splice(childIdx, 0, newNode);
                }
            }
            return newNode;
        },
        replaceChild: function(newChild, oldChild) {
            const idx = this.childNodes.indexOf(oldChild);
            if (idx > -1) {
                newChild.parentNode = this;
                newChild.parentElement = this;
                this.childNodes[idx] = newChild;
            }
            return oldChild;
        },
        cloneNode: function(deep) {
            const clone = new Element(this.tagName);
            clone.attributes = { ...this.attributes };
            clone.className = this.className;
            clone.id = this.id;
            if (deep) {
                this.childNodes.forEach(child => {
                    if (child.cloneNode) {
                        clone.appendChild(child.cloneNode(true));
                    }
                });
            }
            return clone;
        },
        contains: function(node) {
            if (this === node) return true;
            for (let child of this.childNodes) {
                if (child === node || (child.contains && child.contains(node))) {
                    return true;
                }
            }
            return false;
        },
        querySelector: function(selector) {
            return null;
        },
        querySelectorAll: function(selector) {
            return [];
        },
        getElementsByTagName: function(tagName) {
            return [];
        },
        getElementsByClassName: function(className) {
            return [];
        },
        addEventListener: function(type, listener, options) {
            if (!this._eventListeners[type]) {
                this._eventListeners[type] = [];
            }
            this._eventListeners[type].push({ listener, options });
        },
        removeEventListener: function(type, listener, options) {
            if (this._eventListeners[type]) {
                this._eventListeners[type] = this._eventListeners[type].filter(
                    l => l.listener !== listener
                );
            }
        },
        dispatchEvent: function(event) {
            const listeners = this._eventListeners[event.type] || [];
            listeners.forEach(({ listener }) => {
                if (typeof listener === 'function') {
                    listener.call(this, event);
                } else if (listener.handleEvent) {
                    listener.handleEvent(event);
                }
            });
            return !event.defaultPrevented;
        },
        getBoundingClientRect: function() {
            return {
                top: 0, left: 0, bottom: 0, right: 0,
                width: 0, height: 0, x: 0, y: 0
            };
        },
        getClientRects: function() {
            return [];
        },
        focus: function() {},
        blur: function() {},
        click: function() {},
        scrollIntoView: function(options) {},
        matches: function(selector) {
            return false;
        },
        closest: function(selector) {
            return null;
        },
        remove: function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }
    };

    // Document实现
    const document = {
        nodeType: 9,
        nodeName: '#document',
        documentElement: new Element('html'),
        head: new Element('head'),
        body: new Element('body'),
        
        // 基础属性
        title: '',
        domain: 'example.com',
        URL: 'https://example.com/',
        documentURI: 'https://example.com/',
        baseURI: 'https://example.com/',
        referrer: '',
        cookie: '',
        lastModified: new Date().toUTCString(),
        readyState: 'complete',
        characterSet: 'UTF-8',
        charset: 'UTF-8',
        inputEncoding: 'UTF-8',
        contentType: 'text/html',
        designMode: 'off',
        dir: 'ltr',
        
        // 活动元素
        activeElement: null,
        
        // 样式表
        styleSheets: [],
        
        // 脚本
        scripts: [],
        
        // 可见性
        hidden: false,
        visibilityState: 'visible',
        
        // 全屏
        fullscreenEnabled: true,
        fullscreenElement: null,
        
        // 指针锁定
        pointerLockElement: null,
        
        // 方法
        createElement: function(tagName) {
            return new Element(tagName);
        },
        
        createElementNS: function(namespaceURI, qualifiedName) {
            return new Element(qualifiedName);
        },
        
        createTextNode: function(data) {
            return {
                nodeType: 3,
                nodeName: '#text',
                nodeValue: data,
                textContent: data,
                data: data,
                length: data.length,
                parentNode: null
            };
        },
        
        createComment: function(data) {
            return {
                nodeType: 8,
                nodeName: '#comment',
                nodeValue: data,
                textContent: data,
                data: data,
                length: data.length,
                parentNode: null
            };
        },
        
        createDocumentFragment: function() {
            const fragment = {
                nodeType: 11,
                nodeName: '#document-fragment',
                childNodes: [],
                children: [],
                appendChild: Element.prototype.appendChild,
                removeChild: Element.prototype.removeChild,
                insertBefore: Element.prototype.insertBefore,
                replaceChild: Element.prototype.replaceChild,
                querySelector: Element.prototype.querySelector,
                querySelectorAll: Element.prototype.querySelectorAll
            };
            return fragment;
        },
        
        createEvent: function(type) {
            return {
                type: '',
                target: null,
                currentTarget: null,
                bubbles: false,
                cancelable: false,
                defaultPrevented: false,
                timeStamp: Date.now(),
                initEvent: function(type, bubbles, cancelable) {
                    this.type = type;
                    this.bubbles = bubbles;
                    this.cancelable = cancelable;
                },
                preventDefault: function() {
                    this.defaultPrevented = true;
                },
                stopPropagation: function() {},
                stopImmediatePropagation: function() {}
            };
        },
        
        createRange: function() {
            return {
                startContainer: null,
                startOffset: 0,
                endContainer: null,
                endOffset: 0,
                collapsed: true,
                commonAncestorContainer: null,
                setStart: function(node, offset) {},
                setEnd: function(node, offset) {},
                selectNode: function(node) {},
                selectNodeContents: function(node) {},
                collapse: function(toStart) {},
                cloneContents: function() { return document.createDocumentFragment(); },
                deleteContents: function() {},
                extractContents: function() { return document.createDocumentFragment(); },
                insertNode: function(node) {},
                surroundContents: function(node) {},
                cloneRange: function() { return document.createRange(); },
                toString: function() { return ''; }
            };
        },
        
        getElementById: function(id) {
            return null;
        },
        
        getElementsByName: function(name) {
            return [];
        },
        
        getElementsByTagName: function(tagName) {
            return [];
        },
        
        getElementsByClassName: function(className) {
            return [];
        },
        
        querySelector: function(selector) {
            return null;
        },
        
        querySelectorAll: function(selector) {
            return [];
        },
        
        evaluate: function(expression, contextNode, resolver, type, result) {
            return {
                resultType: 0,
                numberValue: NaN,
                stringValue: '',
                booleanValue: false,
                singleNodeValue: null,
                snapshotLength: 0,
                iterateNext: function() { return null; },
                snapshotItem: function(index) { return null; }
            };
        },
        
        createTreeWalker: function(root, whatToShow, filter, expandEntityReferences) {
            return {
                root: root,
                whatToShow: whatToShow || 0xFFFFFFFF,
                filter: filter,
                currentNode: root,
                parentNode: function() { return null; },
                firstChild: function() { return null; },
                lastChild: function() { return null; },
                previousSibling: function() { return null; },
                nextSibling: function() { return null; },
                previousNode: function() { return null; },
                nextNode: function() { return null; }
            };
        },
        
        createNodeIterator: function(root, whatToShow, filter) {
            return {
                root: root,
                whatToShow: whatToShow || 0xFFFFFFFF,
                filter: filter,
                referenceNode: root,
                pointerBeforeReferenceNode: true,
                nextNode: function() { return null; },
                previousNode: function() { return null; }
            };
        },
        
        importNode: function(node, deep) {
            if (node.cloneNode) {
                return node.cloneNode(deep);
            }
            return node;
        },
        
        adoptNode: function(node) {
            return node;
        },
        
        write: function(...args) {
            console.log('[document.write]', ...args);
        },
        
        writeln: function(...args) {
            console.log('[document.writeln]', ...args);
        },
        
        open: function() {
            return this;
        },
        
        close: function() {},
        
        hasFocus: function() {
            return true;
        },
        
        execCommand: function(commandId, showUI, value) {
            return false;
        },
        
        queryCommandEnabled: function(commandId) {
            return false;
        },
        
        queryCommandState: function(commandId) {
            return false;
        },
        
        queryCommandSupported: function(commandId) {
            return false;
        },
        
        queryCommandValue: function(commandId) {
            return '';
        },
        
        getSelection: function() {
            return window.getSelection ? window.getSelection() : null;
        },
        
        elementFromPoint: function(x, y) {
            return null;
        },
        
        elementsFromPoint: function(x, y) {
            return [];
        },
        
        caretPositionFromPoint: function(x, y) {
            return null;
        },
        
        caretRangeFromPoint: function(x, y) {
            return null;
        },
        
        exitFullscreen: function() {
            return Promise.resolve();
        },
        
        exitPointerLock: function() {},
        
        // 事件相关
        _eventListeners: {},
        
        addEventListener: function(type, listener, options) {
            if (!this._eventListeners[type]) {
                this._eventListeners[type] = [];
            }
            this._eventListeners[type].push({ listener, options });
        },
        
        removeEventListener: function(type, listener, options) {
            if (this._eventListeners[type]) {
                this._eventListeners[type] = this._eventListeners[type].filter(
                    l => l.listener !== listener
                );
            }
        },
        
        dispatchEvent: function(event) {
            const listeners = this._eventListeners[event.type] || [];
            listeners.forEach(({ listener }) => {
                if (typeof listener === 'function') {
                    listener.call(this, event);
                }
            });
            return !event.defaultPrevented;
        }
    };

    // 初始化文档结构
    document.documentElement.appendChild(document.head);
    document.documentElement.appendChild(document.body);
    document.activeElement = document.body;

    // 挂载到window
    window.document = document;
    window.Element = Element;
    window.Document = function Document() {};
})();
