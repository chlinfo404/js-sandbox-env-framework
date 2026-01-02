/**
 * @env-module window
 * @description 浏览器window全局对象模拟
 * @compatibility Chrome 80+, Firefox 75+, Edge 79+
 */

(function() {
    // window基础属性
    window.name = '';
    window.status = '';
    window.closed = false;
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    window.outerWidth = 1920;
    window.outerHeight = 1080;
    window.screenX = 0;
    window.screenY = 0;
    window.screenLeft = 0;
    window.screenTop = 0;
    window.pageXOffset = 0;
    window.pageYOffset = 0;
    window.scrollX = 0;
    window.scrollY = 0;
    window.devicePixelRatio = 1;
    window.isSecureContext = true;
    window.origin = 'https://example.com';

    // frames相关
    window.length = 0;
    window.frames = window;
    window.parent = window;
    window.top = window;
    window.self = window;
    window.opener = null;

    // 方法实现
    window.alert = function(message) {
        console.log('[Alert]', message);
    };

    window.confirm = function(message) {
        console.log('[Confirm]', message);
        return true;
    };

    window.prompt = function(message, defaultValue) {
        console.log('[Prompt]', message);
        return defaultValue || '';
    };

    window.open = function(url, name, features) {
        console.log('[window.open]', url, name);
        return null;
    };

    window.close = function() {
        console.log('[window.close]');
    };

    window.focus = function() {};
    window.blur = function() {};
    window.print = function() {};
    window.stop = function() {};

    // 滚动方法
    window.scroll = function(x, y) {
        window.scrollX = x;
        window.scrollY = y;
        window.pageXOffset = x;
        window.pageYOffset = y;
    };

    window.scrollTo = window.scroll;

    window.scrollBy = function(x, y) {
        window.scroll(window.scrollX + x, window.scrollY + y);
    };

    // requestAnimationFrame
    let rafId = 0;
    window.requestAnimationFrame = function(callback) {
        return ++rafId;
    };

    window.cancelAnimationFrame = function(id) {};

    // requestIdleCallback
    let ricId = 0;
    window.requestIdleCallback = function(callback, options) {
        return ++ricId;
    };

    window.cancelIdleCallback = function(id) {};

    // getComputedStyle
    window.getComputedStyle = function(element, pseudoElement) {
        return {
            getPropertyValue: function(prop) {
                return '';
            },
            length: 0
        };
    };

    // matchMedia
    window.matchMedia = function(query) {
        return {
            matches: false,
            media: query,
            onchange: null,
            addListener: function(listener) {},
            removeListener: function(listener) {},
            addEventListener: function(type, listener) {},
            removeEventListener: function(type, listener) {},
            dispatchEvent: function(event) { return true; }
        };
    };

    // getSelection
    window.getSelection = function() {
        return {
            anchorNode: null,
            anchorOffset: 0,
            focusNode: null,
            focusOffset: 0,
            isCollapsed: true,
            rangeCount: 0,
            type: 'None',
            addRange: function() {},
            collapse: function() {},
            collapseToEnd: function() {},
            collapseToStart: function() {},
            containsNode: function() { return false; },
            deleteFromDocument: function() {},
            empty: function() {},
            extend: function() {},
            getRangeAt: function() { return null; },
            removeAllRanges: function() {},
            removeRange: function() {},
            selectAllChildren: function() {},
            setBaseAndExtent: function() {},
            setPosition: function() {},
            toString: function() { return ''; }
        };
    };

    // postMessage
    window.postMessage = function(message, targetOrigin, transfer) {
        console.log('[postMessage]', message, targetOrigin);
    };

    // fetch (基础实现，详细实现在webapi/fetch.js)
    if (typeof window.fetch === 'undefined') {
        window.fetch = function(url, options) {
            console.log('[fetch]', url);
            return Promise.resolve({
                ok: true,
                status: 200,
                json: function() { return Promise.resolve({}); },
                text: function() { return Promise.resolve(''); }
            });
        };
    }
})();
