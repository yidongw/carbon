"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useOutsideClick;
var react_1 = require("react");
var useCallbackRef_1 = require("./useCallbackRef");
function useOutsideClick(_a) {
    var ref = _a.ref, handler = _a.handler, _b = _a.enabled, enabled = _b === void 0 ? true : _b;
    var savedHandler = (0, useCallbackRef_1.default)(handler);
    var stateRef = (0, react_1.useRef)({
        isPointerDown: false,
        ignoreEmulatedMouseEvents: false
    });
    var state = stateRef.current;
    (0, react_1.useEffect)(function () {
        if (!enabled)
            return;
        var onPointerDown = function (e) {
            if (isValidEvent(e, ref)) {
                state.isPointerDown = true;
            }
        };
        var onMouseUp = function (event) {
            if (state.ignoreEmulatedMouseEvents) {
                state.ignoreEmulatedMouseEvents = false;
                return;
            }
            if (state.isPointerDown && handler && isValidEvent(event, ref)) {
                state.isPointerDown = false;
                savedHandler(event);
            }
        };
        var onTouchEnd = function (event) {
            state.ignoreEmulatedMouseEvents = true;
            if (handler && state.isPointerDown && isValidEvent(event, ref)) {
                state.isPointerDown = false;
                savedHandler(event);
            }
        };
        var doc = getOwnerDocument(ref.current);
        doc.addEventListener("mousedown", onPointerDown, true);
        doc.addEventListener("mouseup", onMouseUp, true);
        doc.addEventListener("touchstart", onPointerDown, true);
        doc.addEventListener("touchend", onTouchEnd, true);
        return function () {
            doc.removeEventListener("mousedown", onPointerDown, true);
            doc.removeEventListener("mouseup", onMouseUp, true);
            doc.removeEventListener("touchstart", onPointerDown, true);
            doc.removeEventListener("touchend", onTouchEnd, true);
        };
    }, [handler, ref, savedHandler, state, enabled]);
}
function isValidEvent(event, ref) {
    var _a;
    var target = event.target;
    if (target) {
        var doc = getOwnerDocument(target);
        if (!doc.contains(target))
            return false;
    }
    return !((_a = ref.current) === null || _a === void 0 ? void 0 : _a.contains(target));
}
function getOwnerDocument(node) {
    var _a;
    return (_a = node === null || node === void 0 ? void 0 : node.ownerDocument) !== null && _a !== void 0 ? _a : document;
}
