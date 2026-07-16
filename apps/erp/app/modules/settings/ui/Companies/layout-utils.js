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
exports.getLayoutedElements = getLayoutedElements;
var dagre_1 = require("@dagrejs/dagre");
function getLayoutedElements(nodes, edges, direction) {
    if (direction === void 0) { direction = "TB"; }
    var g = new dagre_1.default.graphlib.Graph().setDefaultEdgeLabel(function () { return ({}); });
    g.setGraph({
        rankdir: direction,
        nodesep: 60,
        ranksep: 100,
        edgesep: 30,
        marginx: 40,
        marginy: 40
    });
    nodes.forEach(function (node) {
        var isElimination = node.data
            .isEliminationEntity;
        g.setNode(node.id, {
            width: isElimination ? 160 : 200,
            height: 60
        });
    });
    edges.forEach(function (edge) {
        g.setEdge(edge.source, edge.target);
    });
    dagre_1.default.layout(g);
    var layoutedNodes = nodes.map(function (node) {
        var nodeWithPosition = g.node(node.id);
        var isElimination = node.data
            .isEliminationEntity;
        var width = isElimination ? 160 : 200;
        return __assign(__assign({}, node), { position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - 30
            } });
    });
    return { nodes: layoutedNodes, edges: edges };
}
