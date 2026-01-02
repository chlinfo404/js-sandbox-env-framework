/**
 * @env-module event
 * @description 浏览器Event相关对象模拟
 * @compatibility Chrome 80+, Firefox 75+, Edge 79+
 */

(function() {
    // Event基类
    function Event(type, eventInitDict) {
        this.type = type;
        this.bubbles = eventInitDict?.bubbles || false;
        this.cancelable = eventInitDict?.cancelable || false;
        this.composed = eventInitDict?.composed || false;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0;
        this.defaultPrevented = false;
        this.isTrusted = false;
        this.timeStamp = Date.now();
        this._propagationStopped = false;
        this._immediatePropagationStopped = false;
    }

    Event.prototype = {
        preventDefault: function() {
            if (this.cancelable) {
                this.defaultPrevented = true;
            }
        },
        stopPropagation: function() {
            this._propagationStopped = true;
        },
        stopImmediatePropagation: function() {
            this._immediatePropagationStopped = true;
            this._propagationStopped = true;
        },
        composedPath: function() {
            return [];
        },
        initEvent: function(type, bubbles, cancelable) {
            this.type = type;
            this.bubbles = bubbles;
            this.cancelable = cancelable;
        }
    };

    Event.NONE = 0;
    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET = 2;
    Event.BUBBLING_PHASE = 3;

    // CustomEvent
    function CustomEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.detail = eventInitDict?.detail || null;
    }
    CustomEvent.prototype = Object.create(Event.prototype);
    CustomEvent.prototype.constructor = CustomEvent;
    CustomEvent.prototype.initCustomEvent = function(type, bubbles, cancelable, detail) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.detail = detail;
    };

    // MouseEvent
    function MouseEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.screenX = eventInitDict?.screenX || 0;
        this.screenY = eventInitDict?.screenY || 0;
        this.clientX = eventInitDict?.clientX || 0;
        this.clientY = eventInitDict?.clientY || 0;
        this.pageX = eventInitDict?.pageX || 0;
        this.pageY = eventInitDict?.pageY || 0;
        this.offsetX = eventInitDict?.offsetX || 0;
        this.offsetY = eventInitDict?.offsetY || 0;
        this.movementX = eventInitDict?.movementX || 0;
        this.movementY = eventInitDict?.movementY || 0;
        this.ctrlKey = eventInitDict?.ctrlKey || false;
        this.shiftKey = eventInitDict?.shiftKey || false;
        this.altKey = eventInitDict?.altKey || false;
        this.metaKey = eventInitDict?.metaKey || false;
        this.button = eventInitDict?.button || 0;
        this.buttons = eventInitDict?.buttons || 0;
        this.relatedTarget = eventInitDict?.relatedTarget || null;
    }
    MouseEvent.prototype = Object.create(Event.prototype);
    MouseEvent.prototype.constructor = MouseEvent;
    MouseEvent.prototype.getModifierState = function(key) {
        return false;
    };

    // KeyboardEvent
    function KeyboardEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.key = eventInitDict?.key || '';
        this.code = eventInitDict?.code || '';
        this.location = eventInitDict?.location || 0;
        this.ctrlKey = eventInitDict?.ctrlKey || false;
        this.shiftKey = eventInitDict?.shiftKey || false;
        this.altKey = eventInitDict?.altKey || false;
        this.metaKey = eventInitDict?.metaKey || false;
        this.repeat = eventInitDict?.repeat || false;
        this.isComposing = eventInitDict?.isComposing || false;
        this.charCode = eventInitDict?.charCode || 0;
        this.keyCode = eventInitDict?.keyCode || 0;
        this.which = eventInitDict?.which || 0;
    }
    KeyboardEvent.prototype = Object.create(Event.prototype);
    KeyboardEvent.prototype.constructor = KeyboardEvent;
    KeyboardEvent.prototype.getModifierState = function(key) {
        return false;
    };

    // TouchEvent
    function TouchEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.touches = eventInitDict?.touches || [];
        this.targetTouches = eventInitDict?.targetTouches || [];
        this.changedTouches = eventInitDict?.changedTouches || [];
        this.ctrlKey = eventInitDict?.ctrlKey || false;
        this.shiftKey = eventInitDict?.shiftKey || false;
        this.altKey = eventInitDict?.altKey || false;
        this.metaKey = eventInitDict?.metaKey || false;
    }
    TouchEvent.prototype = Object.create(Event.prototype);
    TouchEvent.prototype.constructor = TouchEvent;

    // Touch
    function Touch(touchInitDict) {
        this.identifier = touchInitDict?.identifier || 0;
        this.target = touchInitDict?.target || null;
        this.screenX = touchInitDict?.screenX || 0;
        this.screenY = touchInitDict?.screenY || 0;
        this.clientX = touchInitDict?.clientX || 0;
        this.clientY = touchInitDict?.clientY || 0;
        this.pageX = touchInitDict?.pageX || 0;
        this.pageY = touchInitDict?.pageY || 0;
        this.radiusX = touchInitDict?.radiusX || 0;
        this.radiusY = touchInitDict?.radiusY || 0;
        this.rotationAngle = touchInitDict?.rotationAngle || 0;
        this.force = touchInitDict?.force || 0;
    }

    // FocusEvent
    function FocusEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.relatedTarget = eventInitDict?.relatedTarget || null;
    }
    FocusEvent.prototype = Object.create(Event.prototype);
    FocusEvent.prototype.constructor = FocusEvent;

    // InputEvent
    function InputEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.data = eventInitDict?.data || null;
        this.dataTransfer = eventInitDict?.dataTransfer || null;
        this.inputType = eventInitDict?.inputType || '';
        this.isComposing = eventInitDict?.isComposing || false;
    }
    InputEvent.prototype = Object.create(Event.prototype);
    InputEvent.prototype.constructor = InputEvent;
    InputEvent.prototype.getTargetRanges = function() {
        return [];
    };

    // WheelEvent
    function WheelEvent(type, eventInitDict) {
        MouseEvent.call(this, type, eventInitDict);
        this.deltaX = eventInitDict?.deltaX || 0;
        this.deltaY = eventInitDict?.deltaY || 0;
        this.deltaZ = eventInitDict?.deltaZ || 0;
        this.deltaMode = eventInitDict?.deltaMode || 0;
    }
    WheelEvent.prototype = Object.create(MouseEvent.prototype);
    WheelEvent.prototype.constructor = WheelEvent;
    WheelEvent.DOM_DELTA_PIXEL = 0;
    WheelEvent.DOM_DELTA_LINE = 1;
    WheelEvent.DOM_DELTA_PAGE = 2;

    // DragEvent
    function DragEvent(type, eventInitDict) {
        MouseEvent.call(this, type, eventInitDict);
        this.dataTransfer = eventInitDict?.dataTransfer || null;
    }
    DragEvent.prototype = Object.create(MouseEvent.prototype);
    DragEvent.prototype.constructor = DragEvent;

    // PointerEvent
    function PointerEvent(type, eventInitDict) {
        MouseEvent.call(this, type, eventInitDict);
        this.pointerId = eventInitDict?.pointerId || 0;
        this.width = eventInitDict?.width || 1;
        this.height = eventInitDict?.height || 1;
        this.pressure = eventInitDict?.pressure || 0;
        this.tangentialPressure = eventInitDict?.tangentialPressure || 0;
        this.tiltX = eventInitDict?.tiltX || 0;
        this.tiltY = eventInitDict?.tiltY || 0;
        this.twist = eventInitDict?.twist || 0;
        this.pointerType = eventInitDict?.pointerType || '';
        this.isPrimary = eventInitDict?.isPrimary || false;
    }
    PointerEvent.prototype = Object.create(MouseEvent.prototype);
    PointerEvent.prototype.constructor = PointerEvent;
    PointerEvent.prototype.getCoalescedEvents = function() {
        return [];
    };
    PointerEvent.prototype.getPredictedEvents = function() {
        return [];
    };

    // MessageEvent
    function MessageEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.data = eventInitDict?.data || null;
        this.origin = eventInitDict?.origin || '';
        this.lastEventId = eventInitDict?.lastEventId || '';
        this.source = eventInitDict?.source || null;
        this.ports = eventInitDict?.ports || [];
    }
    MessageEvent.prototype = Object.create(Event.prototype);
    MessageEvent.prototype.constructor = MessageEvent;
    MessageEvent.prototype.initMessageEvent = function(type, bubbles, cancelable, data, origin, lastEventId, source, ports) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.data = data;
        this.origin = origin;
        this.lastEventId = lastEventId;
        this.source = source;
        this.ports = ports || [];
    };

    // ErrorEvent
    function ErrorEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.message = eventInitDict?.message || '';
        this.filename = eventInitDict?.filename || '';
        this.lineno = eventInitDict?.lineno || 0;
        this.colno = eventInitDict?.colno || 0;
        this.error = eventInitDict?.error || null;
    }
    ErrorEvent.prototype = Object.create(Event.prototype);
    ErrorEvent.prototype.constructor = ErrorEvent;

    // HashChangeEvent
    function HashChangeEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.oldURL = eventInitDict?.oldURL || '';
        this.newURL = eventInitDict?.newURL || '';
    }
    HashChangeEvent.prototype = Object.create(Event.prototype);
    HashChangeEvent.prototype.constructor = HashChangeEvent;

    // PopStateEvent
    function PopStateEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.state = eventInitDict?.state || null;
    }
    PopStateEvent.prototype = Object.create(Event.prototype);
    PopStateEvent.prototype.constructor = PopStateEvent;

    // PageTransitionEvent
    function PageTransitionEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.persisted = eventInitDict?.persisted || false;
    }
    PageTransitionEvent.prototype = Object.create(Event.prototype);
    PageTransitionEvent.prototype.constructor = PageTransitionEvent;

    // ProgressEvent
    function ProgressEvent(type, eventInitDict) {
        Event.call(this, type, eventInitDict);
        this.lengthComputable = eventInitDict?.lengthComputable || false;
        this.loaded = eventInitDict?.loaded || 0;
        this.total = eventInitDict?.total || 0;
    }
    ProgressEvent.prototype = Object.create(Event.prototype);
    ProgressEvent.prototype.constructor = ProgressEvent;

    // EventTarget
    function EventTarget() {
        this._listeners = {};
    }
    EventTarget.prototype = {
        addEventListener: function(type, callback, options) {
            if (!this._listeners[type]) {
                this._listeners[type] = [];
            }
            this._listeners[type].push({ callback, options });
        },
        removeEventListener: function(type, callback, options) {
            if (!this._listeners[type]) return;
            this._listeners[type] = this._listeners[type].filter(
                listener => listener.callback !== callback
            );
        },
        dispatchEvent: function(event) {
            if (!this._listeners[event.type]) return true;
            
            event.target = this;
            event.currentTarget = this;
            
            for (const { callback } of this._listeners[event.type]) {
                if (event._immediatePropagationStopped) break;
                if (typeof callback === 'function') {
                    callback.call(this, event);
                } else if (callback && callback.handleEvent) {
                    callback.handleEvent(event);
                }
            }
            
            return !event.defaultPrevented;
        }
    };

    // 挂载到window
    window.Event = Event;
    window.CustomEvent = CustomEvent;
    window.MouseEvent = MouseEvent;
    window.KeyboardEvent = KeyboardEvent;
    window.TouchEvent = TouchEvent;
    window.Touch = Touch;
    window.FocusEvent = FocusEvent;
    window.InputEvent = InputEvent;
    window.WheelEvent = WheelEvent;
    window.DragEvent = DragEvent;
    window.PointerEvent = PointerEvent;
    window.MessageEvent = MessageEvent;
    window.ErrorEvent = ErrorEvent;
    window.HashChangeEvent = HashChangeEvent;
    window.PopStateEvent = PopStateEvent;
    window.PageTransitionEvent = PageTransitionEvent;
    window.ProgressEvent = ProgressEvent;
    window.EventTarget = EventTarget;
})();
