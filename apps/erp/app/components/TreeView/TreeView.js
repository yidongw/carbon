"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeView = TreeView;
exports.useTree = useTree;
exports.flattenTree = flattenTree;
exports.createTreeFromFlatItems = createTreeFromFlatItems;
exports.LevelLine = LevelLine;
var react_1 = require("@carbon/react");
var react_virtual_1 = require("@tanstack/react-virtual");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var reducer_1 = require("./reducer");
var utils_1 = require("./utils");
function TreeView(_a) {
    var _b, _c;
    var tree = _a.tree, renderNode = _a.renderNode, nodes = _a.nodes, _d = _a.autoFocus, autoFocus = _d === void 0 ? false : _d, getTreeProps = _a.getTreeProps, getNodeProps = _a.getNodeProps, parentClassName = _a.parentClassName, virtualizer = _a.virtualizer, parentRef = _a.parentRef, scrollRef = _a.scrollRef, onScroll = _a.onScroll;
    (0, react_2.useEffect)(function () {
        var _a;
        if (autoFocus) {
            (_a = parentRef === null || parentRef === void 0 ? void 0 : parentRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [autoFocus, parentRef === null || parentRef === void 0 ? void 0 : parentRef.current]);
    var virtualItems = virtualizer.getVirtualItems();
    var scrollCallback = (0, react_2.useCallback)(function (event) {
        if (!onScroll)
            return;
        var target = event.target;
        onScroll === null || onScroll === void 0 ? void 0 : onScroll(target.scrollTop);
    }, [onScroll]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        //subscribe to scrollRef scroll event
        if (!(scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) || onScroll === undefined)
            return;
        scrollRef.current.addEventListener("scroll", scrollCallback);
        return function () { var _a; return (_a = scrollRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener("scroll", scrollCallback); };
    }, [scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current]);
    return (<framer_motion_1.motion.div ref={function (element) {
            if (parentRef) {
                parentRef.current = element;
            }
            if (scrollRef) {
                scrollRef.current = element;
            }
        }} className={(0, react_1.cn)("flex flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 focus-within:outline-none", parentClassName)} layoutScroll {...getTreeProps()}>
      <div style={{
            height: "".concat(virtualizer.getTotalSize(), "px"),
            width: "100%",
            position: "relative",
            overflowY: "visible"
        }}>
        <div style={{
            position: "absolute",
            overflowY: "visible",
            top: 0,
            left: 0,
            width: "100%",
            transform: "translateY(".concat((_c = (_b = virtualItems.at(0)) === null || _b === void 0 ? void 0 : _b.start) !== null && _c !== void 0 ? _c : 0, "px)")
        }}>
          {virtualItems.map(function (virtualItem) {
            var node = tree.find(function (node) { return node.id === virtualItem.key; });
            if (!node)
                return null;
            var state = nodes[node.id];
            if (!state)
                return null;
            if (!state.visible)
                return null;
            return (<div key={node.id} data-index={virtualItem.index} ref={virtualizer.measureElement} className="overflow-clip" {...getNodeProps(node.id)}>
                {renderNode({
                    node: node,
                    state: state,
                    index: virtualItem.index,
                    virtualizer: virtualizer,
                    virtualItem: virtualItem
                })}
              </div>);
        })}
        </div>
      </div>
    </framer_motion_1.motion.div>);
}
function useTree(_a) {
    var tree = _a.tree, selectedId = _a.selectedId, collapsedIds = _a.collapsedIds, onSelectedIdChanged = _a.onSelectedIdChanged, parentRef = _a.parentRef, estimatedRowHeight = _a.estimatedRowHeight, filter = _a.filter, isEager = _a.isEager;
    var previousNodeCount = (0, react_2.useRef)(tree.length);
    var previousSelectedId = (0, react_2.useRef)(selectedId);
    var _b = (0, react_2.useReducer)(reducer_1.reducer, (0, utils_1.concreteStateFromInput)({ tree: tree, selectedId: selectedId, collapsedIds: collapsedIds, filter: filter })), state = _b[0], dispatch = _b[1];
    //fire onSelectedIdChanged()
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var selectedId = (0, utils_1.selectedIdFromState)(state.nodes);
        if (selectedId !== previousSelectedId.current) {
            previousSelectedId.current = selectedId;
            onSelectedIdChanged === null || onSelectedIdChanged === void 0 ? void 0 : onSelectedIdChanged(selectedId);
        }
    }, [state.changes.selectedId]);
    //update tree when the data changes or the tree length changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (isEager || tree.length !== previousNodeCount.current) {
            dispatch({ type: "UPDATE_TREE", payload: { tree: tree } });
        }
    }, [previousNodeCount.current, tree]);
    //update the filter, if it's changed
    var previousFilter = (0, react_2.useRef)(filter);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        //check if the value (not reference) of the filter is the same
        var previousValue = previousFilter.current
            ? JSON.stringify(previousFilter.current.value)
            : undefined;
        var newValue = filter ? JSON.stringify(filter.value) : undefined;
        previousFilter.current = filter;
        if (previousValue !== newValue) {
            dispatch({ type: "UPDATE_FILTER", payload: { filter: filter } });
        }
    }, [filter === null || filter === void 0 ? void 0 : filter.value]);
    var virtualizer = (0, react_virtual_1.useVirtualizer)({
        count: state.visibleNodeIds.length,
        getItemKey: (0, react_2.useCallback)(function (index) { return state.visibleNodeIds[index]; }, [state.visibleNodeIds]),
        getScrollElement: function () { return parentRef.current; },
        estimateSize: function (index) {
            var _a;
            return estimatedRowHeight({
                node: tree[index],
                state: state.nodes[(_a = tree[index]) === null || _a === void 0 ? void 0 : _a.id],
                index: index
            });
        },
        overscan: 20
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var scrollToNodeFn = (0, react_2.useCallback)(function (id) {
        var itemIndex = state.visibleNodeIds.findIndex(function (n) { return n === id; });
        if (itemIndex !== -1) {
            var range = virtualizer.getVirtualItems();
            var isInView = range.some(function (item) { return item.index === itemIndex; });
            if (!isInView) {
                virtualizer.scrollToIndex(itemIndex, { align: "auto" });
            }
        }
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectNode = (0, react_2.useCallback)(function (id, scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = false; }
        dispatch({
            type: "SELECT_NODE",
            payload: { id: id, scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var deselectNode = (0, react_2.useCallback)(function (id) {
        dispatch({ type: "DESELECT_NODE", payload: { id: id } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var deselectAllNodes = (0, react_2.useCallback)(function () {
        dispatch({ type: "DESELECT_ALL_NODES" });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var toggleNodeSelection = (0, react_2.useCallback)(function (id, scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "TOGGLE_NODE_SELECTION",
            payload: { id: id, scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var expandNode = (0, react_2.useCallback)(function (id, scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "EXPAND_NODE",
            payload: { id: id, scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var collapseNode = (0, react_2.useCallback)(function (id) {
        dispatch({ type: "COLLAPSE_NODE", payload: { id: id } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var toggleExpandNode = (0, react_2.useCallback)(function (id, scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "TOGGLE_EXPAND_NODE",
            payload: { id: id, scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectFirstVisibleNode = (0, react_2.useCallback)(function (scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "SELECT_FIRST_VISIBLE_NODE",
            payload: { scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [tree, state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectLastVisibleNode = (0, react_2.useCallback)(function (scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "SELECT_LAST_VISIBLE_NODE",
            payload: { scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [tree, state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectNextVisibleNode = (0, react_2.useCallback)(function (scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "SELECT_NEXT_VISIBLE_NODE",
            payload: { scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectPreviousVisibleNode = (0, react_2.useCallback)(function (scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "SELECT_PREVIOUS_VISIBLE_NODE",
            payload: { scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectParentNode = (0, react_2.useCallback)(function (scrollToNode) {
        if (scrollToNode === void 0) { scrollToNode = true; }
        dispatch({
            type: "SELECT_PARENT_NODE",
            payload: { scrollToNode: scrollToNode, scrollToNodeFn: scrollToNodeFn }
        });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var expandAllBelowDepth = (0, react_2.useCallback)(function (depth) {
        dispatch({ type: "EXPAND_ALL_BELOW_DEPTH", payload: { depth: depth } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var collapseAllBelowDepth = (0, react_2.useCallback)(function (depth) {
        dispatch({ type: "COLLAPSE_ALL_BELOW_DEPTH", payload: { depth: depth } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var expandLevel = (0, react_2.useCallback)(function (level) {
        dispatch({ type: "EXPAND_LEVEL", payload: { level: level } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var collapseLevel = (0, react_2.useCallback)(function (level) {
        dispatch({ type: "COLLAPSE_LEVEL", payload: { level: level } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var toggleExpandLevel = (0, react_2.useCallback)(function (level) {
        dispatch({ type: "TOGGLE_EXPAND_LEVEL", payload: { level: level } });
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var getTreeProps = (0, react_2.useCallback)(function () {
        return {
            role: "tree",
            "aria-multiselectable": true,
            tabIndex: -1,
            onKeyDown: function (e) {
                if (e.defaultPrevented) {
                    return; // Do nothing if the event was already processed
                }
                switch (e.key) {
                    case "Home": {
                        selectFirstVisibleNode(true);
                        e.preventDefault();
                        break;
                    }
                    case "End": {
                        selectLastVisibleNode(true);
                        e.preventDefault();
                        break;
                    }
                    case "Down":
                    case "ArrowDown": {
                        selectNextVisibleNode(true);
                        e.preventDefault();
                        break;
                    }
                    case "Up":
                    case "ArrowUp": {
                        selectPreviousVisibleNode(true);
                        e.preventDefault();
                        break;
                    }
                    case "Left":
                    case "ArrowLeft": {
                        e.preventDefault();
                        var selected_1 = (0, utils_1.selectedIdFromState)(state.nodes);
                        if (selected_1) {
                            var treeNode = tree.find(function (node) { return node.id === selected_1; });
                            if (e.altKey) {
                                if (treeNode && treeNode.hasChildren) {
                                    collapseLevel(treeNode.level);
                                }
                                break;
                            }
                            var shouldCollapse = treeNode &&
                                treeNode.hasChildren &&
                                state.nodes[selected_1].expanded;
                            if (shouldCollapse) {
                                collapseNode(selected_1);
                            }
                            else {
                                selectParentNode(true);
                            }
                        }
                        break;
                    }
                    case "Right":
                    case "ArrowRight": {
                        e.preventDefault();
                        var selected_2 = (0, utils_1.selectedIdFromState)(state.nodes);
                        if (selected_2) {
                            var treeNode = tree.find(function (node) { return node.id === selected_2; });
                            if (e.altKey) {
                                if (treeNode && treeNode.hasChildren) {
                                    expandLevel(treeNode.level);
                                }
                                break;
                            }
                            expandNode(selected_2, true);
                        }
                        break;
                    }
                    case "Escape": {
                        deselectAllNodes();
                        e.preventDefault();
                        break;
                    }
                }
            }
        };
    }, [state]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var getNodeProps = (0, react_2.useCallback)(function (id) {
        var node = state.nodes[id];
        if (!node)
            return {};
        var treeItemIndex = tree.findIndex(function (node) { return node.id === id; });
        var treeItem = tree[treeItemIndex];
        return {
            "aria-expanded": node.expanded,
            "aria-level": treeItem.level + 1,
            role: "treeitem",
            tabIndex: node.selected ? -1 : undefined
        };
    }, [state]);
    return {
        selected: (0, utils_1.selectedIdFromState)(state.nodes),
        nodes: state.nodes,
        getTreeProps: getTreeProps,
        getNodeProps: getNodeProps,
        selectNode: selectNode,
        deselectNode: deselectNode,
        deselectAllNodes: deselectAllNodes,
        toggleNodeSelection: toggleNodeSelection,
        expandNode: expandNode,
        collapseNode: collapseNode,
        toggleExpandNode: toggleExpandNode,
        expandAllBelowDepth: expandAllBelowDepth,
        collapseAllBelowDepth: collapseAllBelowDepth,
        expandLevel: expandLevel,
        collapseLevel: collapseLevel,
        toggleExpandLevel: toggleExpandLevel,
        selectFirstVisibleNode: selectFirstVisibleNode,
        selectLastVisibleNode: selectLastVisibleNode,
        selectNextVisibleNode: selectNextVisibleNode,
        selectPreviousVisibleNode: selectPreviousVisibleNode,
        selectParentNode: selectParentNode,
        scrollToNode: scrollToNodeFn,
        virtualizer: virtualizer
    };
}
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
function createTreeFromFlatItems(withoutChildren, rootId) {
    // Index items by id
    var indexedItems = withoutChildren.reduce(function (acc, item) {
        acc[item.id] = { id: item.id, data: item.data, children: [] };
        return acc;
    }, {});
    // Add items to parent's children array
    withoutChildren.forEach(function (item) {
        var _a;
        var indexedItem = indexedItems[item.id];
        if (item.parentId !== undefined) {
            var parentItem = indexedItems[item.parentId];
            if (parentItem) {
                // If parent ID doesn't exist, this is also a root item
                (_a = parentItem.children) === null || _a === void 0 ? void 0 : _a.push(indexedItem);
            }
        }
    });
    return indexedItems[rootId];
}
function LevelLine(_a) {
    var _b = _a.isError, isError = _b === void 0 ? false : _b, isSelected = _a.isSelected, className = _a.className;
    return (<div className={(0, react_1.cn)("h-8 w-3 border-r border-border", isError && "border-destructive", isSelected && "border-foreground/60", className)}/>);
}
