"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessorKey = getAccessorKey;
exports.updateNestedProperty = updateNestedProperty;
function getAccessorKey(columnDef) {
    return "accessorKey" in columnDef
        ? columnDef === null || columnDef === void 0 ? void 0 : columnDef.accessorKey.toString()
        : undefined;
}
function updateNestedProperty(obj, path, value) {
    if (typeof path == "string")
        return updateNestedProperty(obj, path.split("_"), value);
    else if (path.length == 1 && value !== undefined)
        // @ts-ignore
        return (obj[path[0]] = value);
    else if (path.length == 0)
        return obj;
    // @ts-ignore
    else
        return updateNestedProperty(obj[path[0]], path.slice(1), value);
}
