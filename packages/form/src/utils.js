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
exports.stringToPathArray = exports.getPath = void 0;
exports.setPath = setPath;
var lodash_get_1 = require("lodash.get");
var getPath = function (object, path) {
    return (0, lodash_get_1.default)(object, path);
};
exports.getPath = getPath;
function setPath(object, path, defaultValue) {
    return _setPathNormalized(object, (0, exports.stringToPathArray)(path), defaultValue);
}
function _setPathNormalized(object, path, value) {
    var _a;
    var leadingSegments = path.slice(0, -1);
    var lastSegment = path[path.length - 1];
    var obj = object;
    for (var i = 0; i < leadingSegments.length; i++) {
        var segment = leadingSegments[i];
        if (obj[segment] === undefined) {
            var nextSegment = (_a = leadingSegments[i + 1]) !== null && _a !== void 0 ? _a : lastSegment;
            obj[segment] = typeof nextSegment === "number" ? [] : {};
        }
        obj = obj[segment];
    }
    obj[lastSegment] = value;
    return object;
}
var stringToPathArray = function (path) {
    if (path.length === 0)
        return [];
    var match = path.match(/^\[(.+?)\](.*)$/) || path.match(/^\.?([^.[\]]+)(.*)$/);
    if (match) {
        var key = match[1], rest = match[2];
        if (key === undefined)
            return [path];
        return __spreadArray([
            /^\d+$/.test(key) ? Number(key) : key
        ], (0, exports.stringToPathArray)((rest !== null && rest !== void 0 ? rest : "")), true);
    }
    return [path];
};
exports.stringToPathArray = stringToPathArray;
