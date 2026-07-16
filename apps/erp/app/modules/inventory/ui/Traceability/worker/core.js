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
exports.computeDagreLayout = computeDagreLayout;
exports.computeFullLayout = computeFullLayout;
exports.computeSelectionPath = computeSelectionPath;
var dagre_1 = require("@dagrejs/dagre");
var utils_1 = require("../utils");
var NODE_WIDTH = 44;
var NODE_HEIGHT = 44;
var SPACING_TABLE = {
    1: { nodesep: 60, ranksep: 100, edgesep: 30 },
    2: { nodesep: 100, ranksep: 160, edgesep: 50 },
    3: { nodesep: 160, ranksep: 240, edgesep: 80 },
    4: { nodesep: 240, ranksep: 340, edgesep: 130 },
    5: { nodesep: 360, ranksep: 480, edgesep: 200 }
};
function detectBackEdges(nodes, edges) {
    var adj = new Map();
    for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        var arr = adj.get(e.source);
        if (arr === undefined) {
            arr = [];
            adj.set(e.source, arr);
        }
        arr.push(e.target);
    }
    var visited = new Set();
    var pathIdx = new Map();
    var path = [];
    var back = new Set();
    function dfs(id) {
        var onStackAt = pathIdx.get(id);
        if (onStackAt !== undefined) {
            for (var i = onStackAt; i < path.length - 1; i++) {
                back.add("".concat(path[i], "->").concat(path[i + 1]));
            }
            back.add("".concat(path[path.length - 1], "->").concat(id));
            return;
        }
        if (visited.has(id))
            return;
        visited.add(id);
        pathIdx.set(id, path.length);
        path.push(id);
        var neighbors = adj.get(id);
        if (neighbors !== undefined) {
            for (var i = 0; i < neighbors.length; i++)
                dfs(neighbors[i]);
        }
        path.pop();
        pathIdx.delete(id);
    }
    for (var i = 0; i < nodes.length; i++) {
        var id = nodes[i].id;
        if (!visited.has(id))
            dfs(id);
    }
    var backEdgeIds = new Set();
    for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if (back.has("".concat(e.source, "->").concat(e.target)))
            backEdgeIds.add(e.id);
    }
    return backEdgeIds;
}
function computeDagreLayout(nodes, edges, direction, spacingLevel) {
    if (spacingLevel === void 0) { spacingLevel = 2; }
    if (nodes.length === 0) {
        return { positioned: nodes, backEdges: new Set(), edgePoints: new Map() };
    }
    var backEdges = detectBackEdges(nodes, edges);
    var g = new dagre_1.default.graphlib.Graph({ multigraph: true });
    var clamped = Math.min(Math.max(1, Math.round(spacingLevel)), 5);
    var sp = SPACING_TABLE[clamped];
    g.setGraph({
        rankdir: direction,
        nodesep: sp.nodesep,
        ranksep: sp.ranksep,
        edgesep: sp.edgesep,
        marginx: 40,
        marginy: 40,
        ranker: clamped >= 4 ? "network-simplex" : "tight-tree",
        acyclicer: "greedy"
    });
    g.setDefaultEdgeLabel(function () { return ({}); });
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var n = nodes_1[_i];
        g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    }
    for (var _a = 0, edges_1 = edges; _a < edges_1.length; _a++) {
        var e = edges_1[_a];
        if (backEdges.has(e.id))
            continue;
        g.setEdge(e.source, e.target, {}, e.id);
    }
    dagre_1.default.layout(g);
    var positioned = nodes.map(function (n) {
        var p = g.node(n.id);
        if (!p)
            return n;
        return __assign(__assign({}, n), { position: { x: p.x - NODE_WIDTH / 2, y: p.y - NODE_HEIGHT / 2 } });
    });
    var edgePoints = new Map();
    for (var _b = 0, edges_2 = edges; _b < edges_2.length; _b++) {
        var e = edges_2[_b];
        if (backEdges.has(e.id))
            continue;
        var dagreEdge = g.edge({ v: e.source, w: e.target, name: e.id });
        if ((dagreEdge === null || dagreEdge === void 0 ? void 0 : dagreEdge.points) && dagreEdge.points.length >= 2) {
            edgePoints.set(e.id, dagreEdge.points);
        }
    }
    return { positioned: positioned, backEdges: backEdges, edgePoints: edgePoints };
}
function computeFullLayout(input) {
    var flow = (0, utils_1.payloadToFlow)(input.payload);
    var weightedEdges = (0, utils_1.annotateEdgeWeights)(flow.edges, new Set(input.rejectIds));
    var _a = computeDagreLayout(flow.nodes, weightedEdges, input.direction, input.spacing), positioned = _a.positioned, backEdges = _a.backEdges, edgePoints = _a.edgePoints;
    var finalEdges = [];
    for (var i = 0; i < weightedEdges.length; i++) {
        var e = weightedEdges[i];
        finalEdges.push(__assign(__assign({}, e), { data: __assign(__assign({}, e.data), { isBackEdge: backEdges.has(e.id), points: edgePoints.get(e.id) }) }));
    }
    return { nodes: positioned, edges: finalEdges };
}
function computeSelectionPath(edges, rootIds, excludedIds, additionalRootIds) {
    var _a;
    if (excludedIds === void 0) { excludedIds = []; }
    if (additionalRootIds === void 0) { additionalRootIds = []; }
    if (rootIds.length === 0 && additionalRootIds.length === 0)
        return null;
    var excludedSet = new Set(excludedIds);
    // Build outgoing adjacency once in a single pass over edges.
    // Skip back-edges and edges touching excluded nodes inline so we never
    // allocate an intermediate `acyclic` array.
    var outgoing = new Map();
    for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if ((_a = e.data) === null || _a === void 0 ? void 0 : _a.isBackEdge)
            continue;
        if (excludedSet.has(e.source) || excludedSet.has(e.target))
            continue;
        var arr = outgoing.get(e.source);
        if (arr === undefined) {
            arr = [];
            outgoing.set(e.source, arr);
        }
        arr.push(e);
    }
    // Collect roots (primary + additional), dropping excluded.
    var allRoots = [];
    for (var i = 0; i < rootIds.length; i++) {
        if (!excludedSet.has(rootIds[i]))
            allRoots.push(rootIds[i]);
    }
    for (var i = 0; i < additionalRootIds.length; i++) {
        var id = additionalRootIds[i];
        if (!excludedSet.has(id))
            allRoots.push(id);
    }
    if (allRoots.length === 0)
        return null;
    // Forward DFS from every root, sharing the adjacency map and visited
    // sets across roots (a node visited from one root never revisits).
    var edgeIds = new Set();
    var nodeIds = new Set();
    var stack = [];
    for (var i = 0; i < allRoots.length; i++) {
        var root = allRoots[i];
        if (nodeIds.has(root))
            continue;
        nodeIds.add(root);
        stack.push(root);
        while (stack.length > 0) {
            var cur = stack.pop();
            var neighbors = outgoing.get(cur);
            if (neighbors === undefined)
                continue;
            for (var j = 0; j < neighbors.length; j++) {
                var e = neighbors[j];
                edgeIds.add(e.id);
                if (!nodeIds.has(e.target)) {
                    nodeIds.add(e.target);
                    stack.push(e.target);
                }
            }
        }
    }
    return {
        pathNodeIds: Array.from(nodeIds),
        pathEdgeIds: Array.from(edgeIds)
    };
}
