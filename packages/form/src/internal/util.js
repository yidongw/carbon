"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeepEqualsMemo = exports.mergeRefs = exports.omit = void 0;
var react_1 = require("react");
var R = require("remeda");
var omit = function (obj) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var result = __assign({}, obj);
    for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
        var key = keys_1[_a];
        delete result[key];
    }
    return result;
};
exports.omit = omit;
var mergeRefs = function (refs) {
    return function (value) {
        refs.filter(Boolean).forEach(function (ref) {
            if (typeof ref === "function") {
                ref(value);
            }
            else if (ref != null) {
                ref.current = value;
            }
        });
    };
};
exports.mergeRefs = mergeRefs;
var useDeepEqualsMemo = function (item) {
    var ref = (0, react_1.useRef)(item);
    var areEqual = ref.current === item || R.equals(ref.current, item);
    (0, react_1.useEffect)(function () {
        if (!areEqual) {
            ref.current = item;
        }
    });
    return areEqual ? ref.current : item;
};
exports.useDeepEqualsMemo = useDeepEqualsMemo;
