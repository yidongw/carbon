"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionBarButton = exports.ActionBar = void 0;
exports.default = useActionBar;
var react_1 = require("react");
var Button_1 = require("./Button");
var cn_1 = require("./utils/cn");
var Component = function (_a) {
    var open = _a.open, props = __rest(_a, ["open"]);
    if (!open)
        return null;
    return <ActionBar {...props}/>;
};
exports.ActionBar = Component;
var ActionBar = function (_a) {
    var className = _a.className, children = _a.children, containerRef = _a.containerRef, _b = _a.maxWidth, maxWidth = _b === void 0 ? 900 : _b, _c = _a.offsetBottom, offsetBottom = _c === void 0 ? 50 : _c;
    var ref = useActionBar({
        containerRef: containerRef,
        offsetBottom: offsetBottom
    }).ref;
    return (<div ref={ref} style={{
            maxWidth: maxWidth
        }} className={(0, cn_1.cn)("tw-flex tw-text-white tw-bg-light-900 dark:tw-text-black dark:bg-light-50 tw-w-auto tw-items-center tw-fixed tw-shadow-xl tw-rounded-md tw-p-2 tw-cursor-move tw-z-50", className)}>
      {children}
    </div>);
};
var ActionBarButton = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    return (<Button_1.Button className={(0, cn_1.cn)(className, "tw-bg-transparent hover:tw-bg-white/10")} ref={ref} {...props} data-action-bar-button onMouseDown={function (e) {
            var _a;
            e.stopPropagation();
            (_a = props.onMouseDown) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }}>
        {children}
      </Button_1.Button>);
});
exports.ActionBarButton = ActionBarButton;
ActionBarButton.displayName = "ActionBarButton";
var throttle = function (f) {
    var frameId = null, lastArgs;
    var invoke = function () {
        f(lastArgs);
        frameId = null;
    };
    var result = function (args) {
        lastArgs = args;
        if (!frameId) {
            frameId = requestAnimationFrame(invoke);
        }
    };
    result.cancel = function () { return frameId && cancelAnimationFrame(frameId); };
    return result;
};
var useRefEffect = function (handler) {
    var storedValue = (0, react_1.useRef)();
    var unsubscribe = (0, react_1.useRef)();
    var result = (0, react_1.useCallback)(function (value) {
        storedValue.current = value;
        if (unsubscribe.current) {
            unsubscribe.current();
            unsubscribe.current = undefined;
        }
        if (value) {
            unsubscribe.current = handler(value);
        }
    }, [handler]);
    (0, react_1.useEffect)(function () {
        result(storedValue.current);
    }, [result]);
    return result;
};
// combine several `ref`s into one
// list of refs is supposed to be immutable after first render
var useCombinedRef = function (refs) {
    var initialRefs = (0, react_1.useRef)(refs);
    return (0, react_1.useCallback)(function (value) {
        initialRefs.current.forEach(function (ref) {
            if (typeof ref === "function") {
                ref(value);
            }
            else if (ref !== null) {
                ref.current = value;
            }
        });
    }, []);
};
// create a ref to subscribe to given element's event
var useDomEvent = function (name, handler) {
    return (0, react_1.useCallback)(function (elem) {
        elem.addEventListener(name, handler);
        return function () {
            elem.removeEventListener(name, handler);
        };
    }, [name, handler]);
};
// callback with persistent reference,
// but updated on every render
var usePersistentCallback = function (f) {
    var realF = (0, react_1.useRef)(f);
    (0, react_1.useEffect)(function () {
        realF.current = f;
    }, [f]);
    return (0, react_1.useCallback)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return realF.current.apply(realF, args);
    }, []);
};
// make element draggable
// returns [ref, isDragging, position]
// position doesn't update while dragging
// position is relative to initial position
var useDraggable = function (_a) {
    var offsetBottom = _a.offsetBottom, boundingRect = _a.boundingRect, onDrag = _a.onDrag;
    var screenDimensions = useWindowDimensions();
    var _b = (0, react_1.useState)(false), isDragging = _b[0], setIsDragging = _b[1];
    var _c = (0, react_1.useState)({
        x: Infinity,
        y: Infinity
    }), position = _c[0], setPosition = _c[1];
    var _d = (0, react_1.useState)({
        height: 0,
        width: 0,
        screenHeight: screenDimensions.y,
        screenWidth: screenDimensions.x
    }), dimensions = _d[0], setDimensions = _d[1];
    var ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        if (!ref.current)
            return;
        var elem = ref.current;
        var height = elem.offsetHeight;
        var width = elem.offsetWidth;
        var updatePosition = function () {
            var posX, posY;
            if (boundingRect) {
                posX = boundingRect.x + (boundingRect.width - width) / 2;
                posY = boundingRect.y + boundingRect.height - height;
            }
            else {
                posX = (screenDimensions.x - width) / 2;
                posY = screenDimensions.y - height;
            }
            var newPosition = {
                x: posX,
                y: posY - offsetBottom
            };
            setPosition(newPosition);
            elem.style.left = "".concat(newPosition.x, "px");
            elem.style.top = "".concat(newPosition.y, "px");
        };
        updatePosition();
        setDimensions({
            height: height,
            width: width,
            screenHeight: screenDimensions.y,
            screenWidth: screenDimensions.x
        });
        // Throttle the updatePosition function
        var throttledUpdatePosition = throttle(updatePosition);
        // Update position on window resize
        window.addEventListener("resize", function (event) {
            throttledUpdatePosition(event);
        });
        return function () {
            window.removeEventListener("resize", throttledUpdatePosition);
            throttledUpdatePosition.cancel(); // Cancel any pending calls
        };
    }, [boundingRect, offsetBottom, screenDimensions.x, screenDimensions.y]);
    var subscribeMouseDown = useDomEvent("pointerdown", function (e) {
        var event = e;
        var target = event.target;
        if (!target.hasAttribute("data-action-bar-button")) {
            e.preventDefault();
            setIsDragging(true);
        }
    });
    var ref2 = useRefEffect(subscribeMouseDown);
    var combinedRef = useCombinedRef([ref, ref2]);
    var onDragWithCurriedDimensions = (0, react_1.useCallback)(function (delta) {
        return onDrag({
            width: dimensions.width,
            height: dimensions.height,
            screenHeight: dimensions.screenHeight,
            screenWidth: dimensions.screenWidth
        })(delta);
    }, [
        onDrag,
        dimensions.width,
        dimensions.height,
        dimensions.screenHeight,
        dimensions.screenWidth
    ]);
    var persistentOnDrag = usePersistentCallback(onDragWithCurriedDimensions);
    (0, react_1.useEffect)(function () {
        if (!isDragging) {
            return;
        }
        var delta = position, lastPosition = position;
        var applyTransform = function () {
            if (!ref.current) {
                return;
            }
            var x = lastPosition.x, y = lastPosition.y;
            ref.current.style.left = "".concat(x, "px");
            ref.current.style.top = "".concat(y, "px");
            ref.current.style.pointerEvents = "none"; // Add this line
        };
        var handleMouseMove = throttle(function (e) {
            e.preventDefault();
            var x = delta.x, y = delta.y;
            delta = { x: x + e.movementX, y: y + e.movementY };
            lastPosition = persistentOnDrag(delta);
            applyTransform();
        });
        var handleMouseUp = function (e) {
            handleMouseMove(e);
            setIsDragging(false);
            setPosition(lastPosition);
            if (ref.current) {
                ref.current.style.pointerEvents = "auto"; // don't highlight text as we drag
            }
        };
        var terminate = function () {
            lastPosition = position;
            applyTransform();
            setIsDragging(false);
            if (ref.current) {
                ref.current.style.pointerEvents = "auto"; // don't highlight text as we drag
            }
        };
        var handleKeyDown = function (e) {
            if (e.code === "Escape") {
                e.preventDefault();
                terminate();
            }
        };
        document.addEventListener("pointermove", handleMouseMove);
        document.addEventListener("pointerup", handleMouseUp);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("blur", terminate);
        return function () {
            handleMouseMove.cancel();
            document.removeEventListener("pointermove", handleMouseMove);
            document.removeEventListener("pointerup", handleMouseUp);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("blur", terminate);
        };
    }, [position, isDragging, persistentOnDrag]);
    return [combinedRef, isDragging, position];
};
var useWindowDimensions = function () {
    var _a = (0, react_1.useState)({
        x: window.innerWidth,
        y: window.innerHeight
    }), windowDimensions = _a[0], setWindowDimensions = _a[1];
    var onResize = (0, react_1.useCallback)(function () {
        setWindowDimensions({
            x: window.innerWidth,
            y: window.innerHeight
        });
    }, []);
    (0, react_1.useEffect)(function () {
        window.addEventListener("resize", onResize);
        return function () { return window.removeEventListener("resize", onResize); };
    }, [onResize]);
    return windowDimensions;
};
function useActionBar(_a) {
    var _b = _a.offsetBottom, offsetBottom = _b === void 0 ? 50 : _b, containerRef = _a.containerRef;
    var onDrag = (0, react_1.useCallback)(function (_a) {
        var height = _a.height, width = _a.width, screenHeight = _a.screenHeight, screenWidth = _a.screenWidth;
        return function (_a) {
            var x = _a.x, y = _a.y;
            return {
                x: Math.max(0, Math.min(x, screenWidth - width)),
                y: Math.max(0, Math.min(y, screenHeight - height))
            };
        };
    }, []);
    var boundingRect = (0, react_1.useMemo)(function () { var _a; return (_a = containerRef === null || containerRef === void 0 ? void 0 : containerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect(); }, [containerRef]);
    var _c = useDraggable({
        boundingRect: boundingRect,
        offsetBottom: offsetBottom,
        onDrag: onDrag
    }), ref = _c[0], isDragging = _c[1], position = _c[2];
    return {
        ref: ref,
        isDragging: isDragging,
        position: position
    };
}
