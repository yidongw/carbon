"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutateAsArray = exports.replace = exports.remove = exports.insertEmpty = exports.insert = exports.move = exports.swap = exports.sparseCopy = exports.getArray = void 0;
var tiny_invariant_1 = require("tiny-invariant");
var utils_1 = require("../../utils");
////
// All of these array helpers are written in a way that mutates the original array.
// This is because we're working with immer.
////
var getArray = function (values, field) {
    var value = (0, utils_1.getPath)(values, field);
    if (value === undefined || value === null) {
        var newValue = [];
        (0, utils_1.setPath)(values, field, newValue);
        return newValue;
    }
    (0, tiny_invariant_1.default)(Array.isArray(value), "FieldArray: defaultValue value for ".concat(field, " must be an array, null, or undefined"));
    return value;
};
exports.getArray = getArray;
var sparseCopy = function (array) { return array.slice(); };
exports.sparseCopy = sparseCopy;
var swap = function (array, indexA, indexB) {
    var itemA = array[indexA];
    var itemB = array[indexB];
    var hasItemA = indexA in array;
    var hasItemB = indexB in array;
    // If we're dealing with a sparse array (i.e. one of the indeces doesn't exist),
    // we should keep it sparse
    if (hasItemA) {
        array[indexB] = itemA;
    }
    else {
        delete array[indexB];
    }
    if (hasItemB) {
        array[indexA] = itemB;
    }
    else {
        delete array[indexA];
    }
};
exports.swap = swap;
// A splice that can handle sparse arrays
function sparseSplice(array, start, deleteCount, item) {
    // Inserting an item into an array won't behave as we need it to if the array isn't
    // at least as long as the start index. We can force the array to be long enough like this.
    if (array.length < start && item) {
        array.length = start;
    }
    // If we just pass item in, it'll be undefined and splice will delete the item.
    if (arguments.length === 4)
        return array.splice(start, deleteCount, item);
    else if (arguments.length === 3)
        return array.splice(start, deleteCount);
    return array.splice(start);
}
var move = function (array, from, to) {
    var item = sparseSplice(array, from, 1)[0];
    sparseSplice(array, to, 0, item);
};
exports.move = move;
var insert = function (array, index, value) {
    sparseSplice(array, index, 0, value);
};
exports.insert = insert;
var insertEmpty = function (array, index) {
    var tail = sparseSplice(array, index);
    tail.forEach(function (item, i) {
        sparseSplice(array, index + i + 1, 0, item);
    });
};
exports.insertEmpty = insertEmpty;
var remove = function (array, index) {
    sparseSplice(array, index, 1);
};
exports.remove = remove;
var replace = function (array, index, value) {
    sparseSplice(array, index, 1, value);
};
exports.replace = replace;
/**
 * The purpose of this helper is to make it easier to update `fieldErrors` and `touchedFields`.
 * We key those objects by full paths to the fields.
 * When we're doing array mutations, that makes it difficult to update those objects.
 */
var mutateAsArray = function (field, obj, mutate) {
    var beforeKeys = new Set();
    var arr = [];
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key.startsWith(field) && key !== field) {
            beforeKeys.add(key);
            (0, utils_1.setPath)(arr, key.substring(field.length), value);
        }
    }
    mutate(arr);
    for (var _c = 0, beforeKeys_1 = beforeKeys; _c < beforeKeys_1.length; _c++) {
        var key = beforeKeys_1[_c];
        delete obj[key];
    }
    var newKeys = getDeepArrayPaths(arr);
    for (var _d = 0, newKeys_1 = newKeys; _d < newKeys_1.length; _d++) {
        var key = newKeys_1[_d];
        var val = (0, utils_1.getPath)(arr, key);
        if (val !== undefined) {
            obj["".concat(field).concat(key)] = val;
        }
    }
};
exports.mutateAsArray = mutateAsArray;
var getDeepArrayPaths = function (obj, basePath) {
    // This only needs to handle arrays and plain objects
    // and we can assume the first call is always an array.
    if (basePath === void 0) { basePath = ""; }
    if (Array.isArray(obj)) {
        return obj.flatMap(function (item, index) {
            return getDeepArrayPaths(item, "".concat(basePath, "[").concat(index, "]"));
        });
    }
    if (typeof obj === "object") {
        return Object.keys(obj).flatMap(function (key) {
            return getDeepArrayPaths(obj[key], "".concat(basePath, ".").concat(key));
        });
    }
    return [basePath];
};
