"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemReadableId = getItemReadableId;
exports.getItemById = getItemById;
/**
 * Get the readable ID for an item given its ID
 * @param items - Array of items from useItems hook
 * @param itemId - The item ID to look up
 * @returns The readable ID with revision, or undefined if not found
 */
function getItemReadableId(items, itemId) {
    if (!itemId)
        return undefined;
    var item = items.find(function (item) { return item.id === itemId; });
    return item === null || item === void 0 ? void 0 : item.readableIdWithRevision;
}
/**
 * Get an item by its ID
 * @param items - Array of items from useItems hook
 * @param itemId - The item ID to look up
 * @returns The item, or undefined if not found
 */
function getItemById(items, itemId) {
    return items.find(function (item) { return item.id === itemId; });
}
