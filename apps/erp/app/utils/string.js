"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.getReadableIdWithRevision = exports.interpolateSequenceDate = exports.copyToClipboard = exports.camelCaseToWords = exports.camelToSnake = exports.snakeToCamel = exports.capitalize = void 0;
exports.stripSpecialCharacters = stripSpecialCharacters;
var capitalize = function (words) {
    var first = words[0], otherLetters = words.slice(1);
    return __spreadArray([first.toLocaleUpperCase()], otherLetters, true).join("");
};
exports.capitalize = capitalize;
function stripSpecialCharacters(inputString) {
    // Keep only characters that are valid for S3 keys
    return inputString === null || inputString === void 0 ? void 0 : inputString.replace(/[^a-zA-Z0-9/!_\-.*'() &$@=;:+,?]/g, "");
}
var snakeToCamel = function (str) {
    return str.replace(/([-_][a-z])/g, function (group) {
        return group.toUpperCase().replace("-", "").replace("_", "");
    });
};
exports.snakeToCamel = snakeToCamel;
var camelToSnake = function (str) {
    return str.replace(/([A-Z])/g, function (group) { return "_".concat(group.toLowerCase()); });
};
exports.camelToSnake = camelToSnake;
var camelCaseToWords = function (str) {
    return str.replace(/([A-Z])/g, function (group) { return " ".concat(group); });
};
exports.camelCaseToWords = camelCaseToWords;
/**
 * Copy text content (string or Promise<string>) into Clipboard.
 * Safari doesn't support write text into clipboard async, so if you need to load
 * text content async before coping, please use Promise<string> for the 1st arg.
 */
var copyToClipboard = function (str_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([str_1], args_1, true), void 0, function (str, 
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    callback) {
        var focused, text;
        var _a, _b;
        if (callback === void 0) { callback = function () { }; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    focused = window.document.hasFocus();
                    if (!focused) return [3 /*break*/, 3];
                    if (!(navigator.clipboard &&
                        typeof navigator.clipboard.writeText === "function")) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve(str)];
                case 1:
                    text = _c.sent();
                    Promise.resolve((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.clipboard) === null || _b === void 0 ? void 0 : _b.writeText(text)).then(callback);
                    return [2 /*return*/];
                case 2:
                    Promise.resolve(str)
                        .then(function (text) { var _a, _b; return (_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.clipboard) === null || _b === void 0 ? void 0 : _b.writeText(text); })
                        .then(callback);
                    return [3 /*break*/, 4];
                case 3:
                    console.warn("Unable to copy to clipboard");
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.copyToClipboard = copyToClipboard;
// used to generate sequences
var interpolateSequenceDate = function (value) {
    // replace all instances of %{year} with the current year
    if (!value)
        return "";
    var result = value;
    if (result.includes("%{")) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var seconds = date.getSeconds();
        result = result.replace(/%{yyyy}/g, year.toString());
        result = result.replace(/%{yy}/g, year.toString().slice(-2));
        result = result.replace(/%{mm}/g, month.toString().padStart(2, "0"));
        result = result.replace(/%{dd}/g, day.toString().padStart(2, "0"));
        result = result.replace(/%{hh}/g, hours.toString().padStart(2, "0"));
        result = result.replace(/%{ss}/g, seconds.toString().padStart(2, "0"));
    }
    return result;
};
exports.interpolateSequenceDate = interpolateSequenceDate;
var getReadableIdWithRevision = function (readableId, revision) {
    if (revision && revision !== "0") {
        return "".concat(readableId, ".").concat(revision);
    }
    return readableId;
};
exports.getReadableIdWithRevision = getReadableIdWithRevision;
