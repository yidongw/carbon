"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemReadableId = getItemReadableId;
exports.getItemById = getItemById;
exports.getMaterialDescription = getMaterialDescription;
exports.getMaterialId = getMaterialId;
/**
 * Get the readable ID for an item given its ID
 * @param items - Array of items from useItems hook
 * @param itemId - The item ID to look up
 * @returns The readable ID with revision, or undefined if not found
 */
function getItemReadableId(items, itemId) {
    if (!itemId)
        return undefined;
    // Indexed loop — `.find` allocates a closure per call. Hot path: list
    // rendering looks up readable ids per row.
    var len = items.length;
    for (var i = 0; i < len; i++) {
        var item = items[i];
        if (item.id === itemId)
            return item.readableIdWithRevision;
    }
    return undefined;
}
/**
 * Get an item by its ID
 * @param items - Array of items from useItems hook
 * @param itemId - The item ID to look up
 * @returns The item, or undefined if not found
 */
function getItemById(items, itemId) {
    var len = items.length;
    for (var i = 0; i < len; i++) {
        var item = items[i];
        if (item.id === itemId)
            return item;
    }
    return undefined;
}
// Build a separator-joined string from a fixed-arity record without
// allocating an intermediate `[…].filter().join()` array — saves two array
// allocations and a closure per call. Falsy parts (undefined, "") are
// dropped to match the prior `.filter((p) => !!p)` behaviour.
function joinTruthy(parts, sep) {
    var out = "";
    var len = parts.length;
    for (var i = 0; i < len; i++) {
        var part = parts[i];
        if (!part)
            continue;
        out = out.length === 0 ? part : out + sep + part;
    }
    return out;
}
function getMaterialDescription(material) {
    return joinTruthy([
        material.grade,
        material.substance,
        material.materialType,
        material.shape,
        material.dimensions,
        material.finish
    ], " ");
}
function getMaterialId(material) {
    return joinTruthy([
        material.grade,
        material.substanceCode,
        material.materialTypeCode,
        material.shapeCode,
        material.dimensions,
        material.finish
    ], "-");
}
