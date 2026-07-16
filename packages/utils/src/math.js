"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundAmount = exports.inverseLerp = exports.lerp = exports.twoDecimals = exports.clamp = void 0;
var clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
exports.clamp = clamp;
var twoDecimals = function (n) {
    var log10 = n ? Math.floor(Math.log10(n)) : 0, div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;
    return Math.round(n * div) / div;
};
exports.twoDecimals = twoDecimals;
var lerp = function (min, max, t) {
    return min + (max - min) * (0, exports.clamp)(t, 0, 1);
};
exports.lerp = lerp;
var inverseLerp = function (min, max, value) {
    return (value - min) / (max - min);
};
exports.inverseLerp = inverseLerp;
var roundAmount = function (value) {
    return Math.round(value * 100) / 100;
};
exports.roundAmount = roundAmount;
