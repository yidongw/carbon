"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.concreteStateFromInput = concreteStateFromInput;
exports.concreteStateFromPartialState = concreteStateFromPartialState;
exports.applyVisibility = applyVisibility;
exports.selectedIdFromState = selectedIdFromState;
exports.applyFilterToState = applyFilterToState;
exports.visibleNodes = visibleNodes;
exports.firstVisibleNode = firstVisibleNode;
exports.lastVisibleNode = lastVisibleNode;
exports.collapsedIdsFromState = collapsedIdsFromState;
exports.generateChanges = generateChanges;
var defaultSelected = false;
var defaultExpanded = true;
function concreteStateFromInput(_a) {
    var tree = _a.tree, filter = _a.filter, selectedId = _a.selectedId, collapsedIds = _a.collapsedIds;
    var state = {};
    collapsedIds === null || collapsedIds === void 0 ? void 0 : collapsedIds.forEach(function (id) {
        var hasTreeItem = tree.some(function (item) { return item.id === id; });
        if (hasTreeItem) {
            state[id] = { expanded: false };
        }
    });
    if (selectedId) {
        var selectedNode = tree.find(function (node) { return node.id === selectedId; });
        if (selectedNode) {
            state[selectedId] = { selected: true };
            //make sure all parents are expanded
            var parentId_1 = selectedNode.parentId;
            while (parentId_1) {
                state[parentId_1] = { expanded: true };
                var parent_1 = tree.find(function (node) { return node.id === parentId_1; });
                parentId_1 = parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.parentId;
            }
        }
    }
    var nodes = concreteStateFromPartialState(tree, state);
    return {
        tree: tree,
        nodes: nodes,
        changes: { selectedId: selectedId },
        filter: filter,
        filteredNodes: nodes,
        visibleNodeIds: visibleNodes(tree, nodes).map(function (node) { return node.id; })
    };
}
function concreteStateFromPartialState(tree, state) {
    var concreteState = tree.reduce(function (acc, node) {
        var _a, _b, _c, _d, _e, _f;
        acc[node.id] = {
            selected: (_b = (_a = acc[node.id]) === null || _a === void 0 ? void 0 : _a.selected) !== null && _b !== void 0 ? _b : defaultSelected,
            expanded: (_d = (_c = acc[node.id]) === null || _c === void 0 ? void 0 : _c.expanded) !== null && _d !== void 0 ? _d : defaultExpanded,
            visible: (_f = (_e = acc[node.id]) === null || _e === void 0 ? void 0 : _e.visible) !== null && _f !== void 0 ? _f : true
        };
        return acc;
    }, state);
    return applyVisibility(tree, concreteState);
}
function applyVisibility(tree, state) {
    var newState = tree.reduce(function (acc, node) {
        var _a;
        //groups are open by default
        var nodeState = (_a = state[node.id]) !== null && _a !== void 0 ? _a : {
            selected: defaultSelected,
            expanded: node.hasChildren ? defaultExpanded : !defaultExpanded
        };
        var parent = node.parentId
            ? acc[node.parentId]
            : { selected: defaultSelected, expanded: defaultExpanded, visible: true };
        var visible = parent.expanded && parent.visible === true ? true : false;
        acc[node.id] = __assign(__assign({}, nodeState), { visible: visible });
        return acc;
    }, {});
    return newState;
}
function selectedIdFromState(state) {
    var selected = Object.entries(state).find(function (_a) {
        var id = _a[0], node = _a[1];
        return node.selected;
    });
    return selected === null || selected === void 0 ? void 0 : selected[0];
}
// biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
function applyFilterToState(_a) {
    var _b;
    var tree = _a.tree, nodes = _a.nodes, filter = _a.filter, visibleNodeIds = _a.visibleNodeIds, changes = _a.changes;
    if (!filter || !filter.value) {
        return {
            tree: tree,
            nodes: nodes,
            filteredNodes: nodes,
            changes: changes,
            filter: filter,
            visibleNodeIds: visibleNodes(tree, nodes).map(function (node) { return node.id; })
        };
    }
    //we need to do two passes, first collect all the nodes that are results
    var newFilteredOut = new Set();
    for (var _i = 0, tree_1 = tree; _i < tree_1.length; _i++) {
        var node = tree_1[_i];
        if (!filter.fn(filter.value, node)) {
            newFilteredOut.add(node.id);
        }
    }
    //nothing is filtered out
    if (newFilteredOut.size === 0) {
        return {
            tree: tree,
            nodes: nodes,
            filteredNodes: nodes,
            changes: changes,
            filter: filter,
            visibleNodeIds: visibleNodes(tree, nodes).map(function (node) { return node.id; })
        };
    }
    //copy of nodes
    var filteredNodes = __assign({}, nodes);
    var selected = selectedIdFromState(filteredNodes);
    var visible = new Set();
    var expanded = new Set();
    var _loop_1 = function (node) {
        var shouldDisplay = !newFilteredOut.has(node.id);
        //if the node is visible, make all the parents visible and expanded
        if (shouldDisplay) {
            //should be visible
            visible.add(node.id);
            //if it has children it should be expanded
            if (node.hasChildren) {
                expanded.add(node.id);
            }
            //parents need to be both visible and expanded
            var parentId_2 = node.parentId;
            while (parentId_2) {
                visible.add(parentId_2);
                expanded.add(parentId_2);
                parentId_2 = (_b = tree.find(function (node) { return node.id === parentId_2; })) === null || _b === void 0 ? void 0 : _b.parentId;
            }
            //children should be  visible and if they have children expanded
            if (node.hasChildren) {
                var children = tree.filter(function (child) { return child.parentId === node.id; });
                for (var _h = 0, children_1 = children; _h < children_1.length; _h++) {
                    var child = children_1[_h];
                    visible.add(child.id);
                    if (child.hasChildren) {
                        expanded.add(child.id);
                    }
                }
            }
        }
    };
    //figure out the state of each node
    for (var _c = 0, tree_2 = tree; _c < tree_2.length; _c++) {
        var node = tree_2[_c];
        _loop_1(node);
    }
    var allItems = new Set(tree.map(function (node) { return node.id; }));
    var hidden = difference(allItems, visible);
    var collapsed = difference(visible, expanded);
    //now set the visibility and expanded state
    for (var _d = 0, hidden_1 = hidden; _d < hidden_1.length; _d++) {
        var id = hidden_1[_d];
        filteredNodes[id] = __assign(__assign({}, filteredNodes[id]), { visible: false });
    }
    for (var _e = 0, visible_1 = visible; _e < visible_1.length; _e++) {
        var id = visible_1[_e];
        filteredNodes[id] = __assign(__assign({}, filteredNodes[id]), { visible: true });
    }
    for (var _f = 0, collapsed_1 = collapsed; _f < collapsed_1.length; _f++) {
        var id = collapsed_1[_f];
        filteredNodes[id] = __assign(__assign({}, filteredNodes[id]), { expanded: false });
    }
    for (var _g = 0, expanded_1 = expanded; _g < expanded_1.length; _g++) {
        var id = expanded_1[_g];
        filteredNodes[id] = __assign(__assign({}, filteredNodes[id]), { expanded: true });
    }
    if (selected) {
        if (visible.has(selected)) {
            filteredNodes[selected] = __assign(__assign({}, filteredNodes[selected]), { selected: true });
        }
        else {
            filteredNodes[selected] = __assign(__assign({}, filteredNodes[selected]), { selected: false });
        }
    }
    return {
        tree: tree,
        nodes: nodes,
        filteredNodes: filteredNodes,
        changes: changes,
        filter: filter,
        visibleNodeIds: visibleNodes(tree, filteredNodes).map(function (node) { return node.id; })
    };
}
function visibleNodes(tree, nodes) {
    return tree.filter(function (node) { return nodes[node.id].visible === true; });
}
function firstVisibleNode(tree, nodes) {
    return tree.find(function (node) { return nodes[node.id].visible === true; });
}
function lastVisibleNode(tree, nodes) {
    return tree
        .slice()
        .reverse()
        .find(function (node) { return nodes[node.id].visible === true; });
}
// biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
function areSetsEqual(a, b) {
    return a.size === b.size && __spreadArray([], a, true).every(function (value) { return b.has(value); });
}
function difference(a, b) {
    return new Set(__spreadArray([], a, true).filter(function (x) { return !b.has(x); }));
}
function collapsedIdsFromState(state) {
    return Object.entries(state)
        .filter(function (_a) {
        var _ = _a[0], s = _a[1];
        return s.expanded === false;
    })
        .map(function (_a) {
        var id = _a[0];
        return id;
    });
}
function generateChanges(a, b) {
    //if selected === defaultSelected, remove it
    //if expanded === defaultExpanded, remove it
    //if both are default, remove the node
    var selectedIdA = selectedIdFromState(a);
    var selectedIdB = selectedIdFromState(b);
    var collapsedIdsA = new Set(collapsedIdsFromState(a));
    var collapsedIdsB = new Set(collapsedIdsFromState(b));
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var collapsedChanges = __spreadArray([], difference(collapsedIdsA, collapsedIdsB), true);
    return {
        selectedId: selectedIdA !== selectedIdB ? selectedIdB : undefined
    };
}
