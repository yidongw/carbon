"use strict";
/**
 * Tree and BOM (Bill of Materials) utility types and functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenTree = flattenTree;
exports.generateBomIds = generateBomIds;
/**
 * Flattens a tree structure into an array of FlatTreeItems.
 * Preserves parent-child relationships and calculates the level (depth) of each node.
 */
function flattenTree(tree) {
    var flatTree = [];
    function flattenNode(node, parentId, level) {
        var _a, _b, _c;
        var children = (_b = (_a = node.children) === null || _a === void 0 ? void 0 : _a.map(function (child) { return child.id; })) !== null && _b !== void 0 ? _b : [];
        flatTree.push({
            id: node.id,
            parentId: parentId,
            children: children,
            hasChildren: children.length > 0,
            level: level,
            data: node.data
        });
        (_c = node.children) === null || _c === void 0 ? void 0 : _c.forEach(function (child) {
            flattenNode(child, node.id, level + 1);
        });
    }
    flattenNode(tree, undefined, 0);
    return flatTree;
}
/**
 * Generates hierarchical BOM IDs for a flattened tree.
 * Root node gets "1", children get "1.1", "1.2", etc.
 * Grandchildren get "1.1.1", "1.1.2", etc.
 *
 * @param nodes - A flattened tree with level information
 * @returns An array of BOM IDs in the same order as the input nodes
 */
function generateBomIds(nodes) {
    var ids = new Array(nodes.length);
    var levelCounters = new Map();
    nodes.forEach(function (node, index) {
        var level = node.level;
        // Reset deeper level counters when moving to shallower level
        var prevNode = nodes[index - 1];
        if (index > 0 && prevNode && level <= prevNode.level) {
            for (var _i = 0, levelCounters_1 = levelCounters; _i < levelCounters_1.length; _i++) {
                var key = levelCounters_1[_i][0];
                if (key > level)
                    levelCounters.delete(key);
            }
        }
        // Update counter for current level
        levelCounters.set(level, (levelCounters.get(level) || 0) + 1);
        // Build ID string from all level counters
        ids[index] = Array.from({ length: level + 1 }, function (_, i) { return levelCounters.get(i) || 1; }).join(".");
    });
    return ids;
}
