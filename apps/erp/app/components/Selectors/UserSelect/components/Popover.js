"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var provider_1 = require("../provider");
var Popover = function (_a) {
    var children = _a.children;
    var _b = (0, provider_1.default)(), popoverProps = _b.aria.popoverProps, _c = _b.refs, listBoxRef = _c.listBoxRef, popoverRef = _c.popoverRef, focusableNodes = _c.focusableNodes;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        /* Build a triple linked-list (TreeNode[]) of focusable DOM Elements that are children
        
        type TreeNode {
          id: string;
          expandable: boolean;
          previousId?: string;
          nextId?: string;
          parentId? string;
        }
        
        */
        focusableNodes.current = {};
        /* First get the parents */
        var parents = [];
        if (listBoxRef.current) {
            var node = listBoxRef.current.firstElementChild;
            var lastNode = listBoxRef.current.lastElementChild;
            while (node && node !== lastNode) {
                parents.push(node);
                node = node.nextElementSibling;
            }
            if (node) {
                parents.push(node);
            }
        }
        /* Then make a flat list with the children spliced in */
        var nodes = [];
        parents.forEach(function (parent) {
            nodes.push([parent.id, undefined]);
            var group = parent.getElementsByTagName("ul");
            if (group === null || group === void 0 ? void 0 : group[0]) {
                var child = group[0].firstElementChild;
                var lastChild = group[0].lastElementChild;
                while (child && child !== lastChild) {
                    nodes.push([child.id, parent.id]);
                    child = child.nextElementSibling;
                }
                if (child) {
                    nodes.push([child.id, parent.id]);
                }
            }
        });
        /* Finally, create the triple linked list */
        for (var i = 0; i < nodes.length; i++) {
            var _a = nodes[i], node = _a[0], parent_1 = _a[1];
            var previous = nodes === null || nodes === void 0 ? void 0 : nodes[i - 1];
            var next = nodes === null || nodes === void 0 ? void 0 : nodes[i + 1];
            focusableNodes.current[node] = {
                uid: node,
                expandable: parent_1 === undefined,
                parentId: parent_1,
                previousId: (previous === null || previous === void 0 ? void 0 : previous[0]) || undefined,
                nextId: (next === null || next === void 0 ? void 0 : next[0]) || undefined
            };
        }
    }, [children, focusableNodes, listBoxRef]);
    return (<div {...popoverProps} ref={popoverRef} className="absolute w-full mt-1 px-2 bg-popover text-popover-foreground shadow-sm border border-border rounded-md min-w-[240px] z-50">
      {children}
    </div>);
};
exports.default = Popover;
