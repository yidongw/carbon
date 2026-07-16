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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducer = reducer;
var assert_never_1 = require("assert-never");
var utils_1 = require("./utils");
function reducer(state, action) {
    var _a, _b, _c;
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    switch (action.type) {
        case "SELECT_NODE": {
            //if the node was already selected, do nothing. The user needs to use deselectNode to deselect
            var alreadySelected = (_e = (_d = state.nodes[action.payload.id]) === null || _d === void 0 ? void 0 : _d.selected) !== null && _e !== void 0 ? _e : false;
            if (alreadySelected) {
                return state;
            }
            var newNodes = Object.fromEntries(Object.entries(state.nodes).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [
                    key,
                    __assign(__assign({}, value), { selected: false })
                ];
            }));
            newNodes[action.payload.id] = __assign(__assign({}, newNodes[action.payload.id]), { selected: true });
            if (action.payload.scrollToNode) {
                action.payload.scrollToNodeFn(action.payload.id);
            }
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { tree: state.tree, nodes: newNodes, changes: (0, utils_1.generateChanges)(state.nodes, newNodes) }));
        }
        case "DESELECT_NODE": {
            var nodes = __assign(__assign({}, state.nodes), (_a = {}, _a[action.payload.id] = __assign(__assign({}, state.nodes[action.payload.id]), { selected: false }), _a));
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: nodes, changes: (0, utils_1.generateChanges)(state.nodes, nodes) }));
        }
        case "DESELECT_ALL_NODES": {
            var nodes = Object.fromEntries(Object.entries(state.nodes).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [
                    key,
                    __assign(__assign({}, value), { selected: false })
                ];
            }));
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: nodes, changes: (0, utils_1.generateChanges)(state.nodes, nodes) }));
        }
        case "TOGGLE_NODE_SELECTION": {
            var currentlySelected = (_g = (_f = state.nodes[action.payload.id]) === null || _f === void 0 ? void 0 : _f.selected) !== null && _g !== void 0 ? _g : false;
            if (currentlySelected) {
                return reducer(state, {
                    type: "DESELECT_NODE",
                    payload: { id: action.payload.id }
                });
            }
            return reducer(state, {
                type: "SELECT_NODE",
                payload: {
                    id: action.payload.id,
                    scrollToNode: action.payload.scrollToNode,
                    scrollToNodeFn: action.payload.scrollToNodeFn
                }
            });
        }
        case "EXPAND_NODE": {
            var newNodes = __assign(__assign({}, state.nodes), (_b = {}, _b[action.payload.id] = __assign(__assign({}, state.nodes[action.payload.id]), { expanded: true }), _b));
            if (action.payload.scrollToNode) {
                action.payload.scrollToNodeFn(action.payload.id);
            }
            var visibleNodes_1 = (0, utils_1.applyVisibility)(state.tree, newNodes);
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: visibleNodes_1, changes: (0, utils_1.generateChanges)(state.nodes, visibleNodes_1) }));
        }
        case "COLLAPSE_NODE": {
            var visibleNodes_2 = (0, utils_1.applyVisibility)(state.tree, __assign(__assign({}, state.nodes), (_c = {}, _c[action.payload.id] = __assign(__assign({}, state.nodes[action.payload.id]), { expanded: false }), _c)));
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: visibleNodes_2, changes: (0, utils_1.generateChanges)(state.nodes, visibleNodes_2) }));
        }
        case "TOGGLE_EXPAND_NODE": {
            var currentlyExpanded = (_j = (_h = state.nodes[action.payload.id]) === null || _h === void 0 ? void 0 : _h.expanded) !== null && _j !== void 0 ? _j : true;
            if (currentlyExpanded) {
                return reducer(state, {
                    type: "COLLAPSE_NODE",
                    payload: { id: action.payload.id }
                });
            }
            return reducer(state, {
                type: "EXPAND_NODE",
                payload: {
                    id: action.payload.id,
                    scrollToNode: action.payload.scrollToNode,
                    scrollToNodeFn: action.payload.scrollToNodeFn
                }
            });
        }
        case "EXPAND_ALL_BELOW_DEPTH": {
            var nodesToExpand_1 = state.tree.filter(function (n) { return n.level >= action.payload.depth && n.hasChildren; });
            var newNodes = Object.fromEntries(Object.entries(state.nodes).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [
                    key,
                    __assign(__assign({}, value), { expanded: nodesToExpand_1.find(function (n) { return n.id === key; })
                            ? true
                            : value.expanded })
                ];
            }));
            var visibleNodes_3 = (0, utils_1.applyVisibility)(state.tree, newNodes);
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: visibleNodes_3, changes: (0, utils_1.generateChanges)(state.nodes, visibleNodes_3) }));
        }
        case "COLLAPSE_ALL_BELOW_DEPTH": {
            var nodesToCollapse_1 = state.tree.filter(function (n) { return n.level >= action.payload.depth && n.hasChildren; });
            var newNodes = Object.fromEntries(Object.entries(state.nodes).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [
                    key,
                    __assign(__assign({}, value), { expanded: nodesToCollapse_1.find(function (n) { return n.id === key; })
                            ? false
                            : value.expanded })
                ];
            }));
            var visibleNodes_4 = (0, utils_1.applyVisibility)(state.tree, newNodes);
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: visibleNodes_4, changes: (0, utils_1.generateChanges)(state.nodes, visibleNodes_4) }));
        }
        case "EXPAND_LEVEL": {
            var nodesToExpand_2 = state.tree.filter(function (n) { return n.level <= action.payload.level && n.hasChildren; });
            var newNodes = Object.fromEntries(Object.entries(state.nodes).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [
                    key,
                    __assign(__assign({}, value), { expanded: nodesToExpand_2.find(function (n) { return n.id === key; })
                            ? true
                            : value.expanded })
                ];
            }));
            var visibleNodes_5 = (0, utils_1.applyVisibility)(state.tree, newNodes);
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: visibleNodes_5, changes: (0, utils_1.generateChanges)(state.nodes, visibleNodes_5) }));
        }
        case "COLLAPSE_LEVEL": {
            var nodesToCollapse_2 = state.tree.filter(function (n) { return n.level === action.payload.level && n.hasChildren; });
            var newNodes = Object.fromEntries(Object.entries(state.nodes).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [
                    key,
                    __assign(__assign({}, value), { expanded: nodesToCollapse_2.find(function (n) { return n.id === key; })
                            ? false
                            : value.expanded })
                ];
            }));
            var visibleNodes_6 = (0, utils_1.applyVisibility)(state.tree, newNodes);
            return (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { nodes: visibleNodes_6, changes: (0, utils_1.generateChanges)(state.nodes, visibleNodes_6) }));
        }
        case "TOGGLE_EXPAND_LEVEL": {
            //first get the first item at that level in the tree. If it is expanded, collapse all nodes at that level
            //if it is collapsed, expand all nodes at that level
            var nodesAtLevel = state.tree.filter(function (n) { return n.level === action.payload.level && n.hasChildren; });
            var firstNode = nodesAtLevel[0];
            if (!firstNode) {
                return state;
            }
            var currentlyExpanded = (_l = (_k = state.nodes[firstNode.id]) === null || _k === void 0 ? void 0 : _k.expanded) !== null && _l !== void 0 ? _l : true;
            var currentVisible = (_o = (_m = state.nodes[firstNode.id]) === null || _m === void 0 ? void 0 : _m.visible) !== null && _o !== void 0 ? _o : true;
            if (currentlyExpanded && currentVisible) {
                return reducer(state, {
                    type: "COLLAPSE_LEVEL",
                    payload: {
                        level: action.payload.level
                    }
                });
            }
            return reducer(state, {
                type: "EXPAND_LEVEL",
                payload: {
                    level: action.payload.level
                }
            });
        }
        case "SELECT_FIRST_VISIBLE_NODE": {
            var node = (0, utils_1.firstVisibleNode)(state.tree, state.filteredNodes);
            if (node) {
                return reducer(state, {
                    type: "SELECT_NODE",
                    payload: {
                        id: node.id,
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            return state;
        }
        case "SELECT_LAST_VISIBLE_NODE": {
            var node = (0, utils_1.lastVisibleNode)(state.tree, state.filteredNodes);
            if (node) {
                return reducer(state, {
                    type: "SELECT_NODE",
                    payload: {
                        id: node.id,
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            return state;
        }
        case "SELECT_NEXT_VISIBLE_NODE": {
            var selected_1 = (0, utils_1.selectedIdFromState)(state.nodes);
            if (!selected_1) {
                return reducer(state, {
                    type: "SELECT_FIRST_VISIBLE_NODE",
                    payload: {
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            var visible = (0, utils_1.visibleNodes)(state.tree, state.filteredNodes);
            var selectedIndex = visible.findIndex(function (node) { return node.id === selected_1; });
            var nextNode = visible[selectedIndex + 1];
            if (nextNode) {
                return reducer(state, {
                    type: "SELECT_NODE",
                    payload: {
                        id: nextNode.id,
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            return state;
        }
        case "SELECT_PREVIOUS_VISIBLE_NODE": {
            var selected_2 = (0, utils_1.selectedIdFromState)(state.nodes);
            if (!selected_2) {
                return reducer(state, {
                    type: "SELECT_FIRST_VISIBLE_NODE",
                    payload: {
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            var visible = (0, utils_1.visibleNodes)(state.tree, state.filteredNodes);
            var selectedIndex = visible.findIndex(function (node) { return node.id === selected_2; });
            var previousNode = visible[Math.max(0, selectedIndex - 1)];
            if (previousNode) {
                return reducer(state, {
                    type: "SELECT_NODE",
                    payload: {
                        id: previousNode.id,
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            return state;
        }
        case "SELECT_PARENT_NODE": {
            var selected_3 = (0, utils_1.selectedIdFromState)(state.nodes);
            if (!selected_3) {
                return reducer(state, {
                    type: "SELECT_FIRST_VISIBLE_NODE",
                    payload: {
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            var selectedNode_1 = state.tree.find(function (node) { return node.id === selected_3; });
            if (!selectedNode_1) {
                return state;
            }
            var parentNode = state.tree.find(function (node) { return node.id === selectedNode_1.parentId; });
            if (parentNode) {
                return reducer(state, {
                    type: "SELECT_NODE",
                    payload: {
                        id: parentNode.id,
                        scrollToNode: action.payload.scrollToNode,
                        scrollToNodeFn: action.payload.scrollToNodeFn
                    }
                });
            }
            return state;
        }
        case "UPDATE_TREE": {
            //update the tree but try and keep the selected and expanded states
            var selectedId = (0, utils_1.selectedIdFromState)(state.nodes);
            var collapsedIds = (0, utils_1.collapsedIdsFromState)(state.nodes);
            var newState = (0, utils_1.concreteStateFromInput)(__assign(__assign({}, state), { tree: action.payload.tree, selectedId: selectedId, collapsedIds: collapsedIds }));
            return newState;
        }
        case "UPDATE_FILTER": {
            var newState = (0, utils_1.applyFilterToState)(__assign(__assign({}, state), { filter: action.payload.filter }));
            return newState;
        }
        default: {
            (0, assert_never_1.default)(action);
        }
    }
    throw new Error("Unhandled action type: ".concat(action.type));
}
