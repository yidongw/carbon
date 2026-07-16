"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedObjectToPathObject = void 0;
var nestedObjectToPathObject = function (val, acc, path) {
    if (Array.isArray(val)) {
        // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
        val.forEach(function (v, index) {
            return (0, exports.nestedObjectToPathObject)(v, acc, "".concat(path, "[").concat(index, "]"));
        });
        return acc;
    }
    if (typeof val === "object") {
        Object.entries(val).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var nextPath = path ? "".concat(path, ".").concat(key) : key;
            (0, exports.nestedObjectToPathObject)(value, acc, nextPath);
        });
        return acc;
    }
    if (val !== undefined) {
        acc[path] = val;
    }
    return acc;
};
exports.nestedObjectToPathObject = nestedObjectToPathObject;
