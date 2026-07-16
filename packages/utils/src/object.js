"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.pick = exports.groupBy = void 0;
/**
 * Group an array by a key derived from each item. Indexed loop and a
 * `result[key] === undefined` check keep the hot path off `.reduce`'s
 * closure allocation and avoid the implicit `in` lookup of `!result[key]`
 * (which also misbehaves on items that happen to map to the falsy keys
 * `""` / `0`).
 */
var groupBy = function (array, getKey) {
    var result = {};
    var len = array.length;
    for (var i = 0; i < len; i++) {
        var item = array[i];
        var key = getKey(item);
        var bucket = result[key];
        if (bucket === undefined) {
            result[key] = [item];
        }
        else {
            bucket.push(item);
        }
    }
    return result;
};
exports.groupBy = groupBy;
var pick = function (obj, keys) {
    var result = {};
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var key = keys[i];
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
};
exports.pick = pick;
var get = function (obj, key, defaultValue) {
    var value = obj[key];
    return value === undefined ? defaultValue : value;
};
exports.get = get;
