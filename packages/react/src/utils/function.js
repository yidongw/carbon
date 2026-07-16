"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAllHandlers = callAllHandlers;
function callAllHandlers() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function func(event) {
        fns.some(function (fn) {
            fn === null || fn === void 0 ? void 0 : fn(event);
            return event === null || event === void 0 ? void 0 : event.defaultPrevented;
        });
    };
}
