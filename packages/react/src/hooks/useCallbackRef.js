"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCallbackRef;
var react_1 = require("react");
function useCallbackRef(callback, deps) {
    if (deps === void 0) { deps = []; }
    var callbackRef = (0, react_1.useRef)(callback);
    (0, react_1.useEffect)(function () {
        callbackRef.current = callback;
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    return (0, react_1.useCallback)((function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = callbackRef.current) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([callbackRef], args, false));
    }), deps);
}
