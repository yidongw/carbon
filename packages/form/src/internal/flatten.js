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
exports.objectFromPathEntries = void 0;
var utils_1 = require("../utils");
var MultiValueMap_1 = require("./MultiValueMap");
var objectFromPathEntries = function (entries) {
    var map = new MultiValueMap_1.MultiValueMap();
    // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
    entries.forEach(function (_a) {
        var key = _a[0], value = _a[1];
        return map.add(key, value);
    });
    return __spreadArray([], map.entries(), true).reduce(function (acc, _a) {
        var key = _a[0], value = _a[1];
        return (0, utils_1.setPath)(acc, key, value.length === 1 ? value[0] : value);
    }, {});
};
exports.objectFromPathEntries = objectFromPathEntries;
