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
exports.capitalize = void 0;
var capitalize = function (words) {
    var first = words[0], otherLetters = words.slice(1);
    return __spreadArray([first.toLocaleUpperCase()], otherLetters, true).join("");
};
exports.capitalize = capitalize;
