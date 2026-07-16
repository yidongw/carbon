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
exports.payloadToFlow = payloadToFlow;
exports.mergePayloads = mergePayloads;
exports.lineagePathEdges = lineagePathEdges;
exports.lineagePathEdgesMulti = lineagePathEdgesMulti;
exports.lineageReachableMulti = lineageReachableMulti;
exports.lineageReachable = lineageReachable;
exports.entityHeadline = entityHeadline;
exports.activityHeadline = activityHeadline;
exports.sourceLinkHref = sourceLinkHref;
exports.annotateEdgeWeights = annotateEdgeWeights;
var constants_1 = require("./constants");
function payloadToFlow(payload, positions) {
    if (positions === void 0) { positions = new Map(); }
    var seenNodeIds = new Set();
    var entityNodes = payload.entities
        .filter(function (e) {
        if (!(e === null || e === void 0 ? void 0 : e.id) || seenNodeIds.has(e.id))
            return false;
        seenNodeIds.add(e.id);
        return true;
    })
        .map(function (entity) {
        var _a;
        return ({
            id: entity.id,
            type: "entity",
            position: (_a = positions.get(entity.id)) !== null && _a !== void 0 ? _a : { x: 0, y: 0 },
            width: constants_1.NODE_SIZE,
            height: constants_1.NODE_SIZE,
            measured: { width: constants_1.NODE_SIZE, height: constants_1.NODE_SIZE },
            data: { kind: "entity", entity: entity, dimmed: false }
        });
    });
    var activityNodes = payload.activities
        .filter(function (a) {
        if (!(a === null || a === void 0 ? void 0 : a.id) || seenNodeIds.has(a.id))
            return false;
        seenNodeIds.add(a.id);
        return true;
    })
        .map(function (activity) {
        var _a;
        return ({
            id: activity.id,
            type: "activity",
            position: (_a = positions.get(activity.id)) !== null && _a !== void 0 ? _a : { x: 0, y: 0 },
            width: constants_1.NODE_SIZE,
            height: constants_1.NODE_SIZE,
            measured: { width: constants_1.NODE_SIZE, height: constants_1.NODE_SIZE },
            data: { kind: "activity", activity: activity, dimmed: false }
        });
    });
    var seenEdgeIds = new Set();
    var edges = [];
    for (var _i = 0, _a = payload.inputs; _i < _a.length; _i++) {
        var input = _a[_i];
        var id = "in:".concat(input.trackedActivityId, ":").concat(input.trackedEntityId);
        if (seenEdgeIds.has(id))
            continue;
        seenEdgeIds.add(id);
        edges.push({
            id: id,
            type: "quantity",
            source: input.trackedEntityId,
            target: input.trackedActivityId,
            data: { kind: "input", quantity: input.quantity, dimmed: false }
        });
    }
    for (var _b = 0, _c = payload.outputs; _b < _c.length; _b++) {
        var output = _c[_b];
        var id = "out:".concat(output.trackedActivityId, ":").concat(output.trackedEntityId);
        if (seenEdgeIds.has(id))
            continue;
        seenEdgeIds.add(id);
        edges.push({
            id: id,
            type: "quantity",
            source: output.trackedActivityId,
            target: output.trackedEntityId,
            data: { kind: "output", quantity: output.quantity, dimmed: false }
        });
    }
    return { nodes: __spreadArray(__spreadArray([], entityNodes, true), activityNodes, true), edges: edges };
}
function mergePayloads(base, incoming) {
    var _a, _b, _c, _d;
    var entityIds = new Set(base.entities.map(function (e) { return e.id; }));
    var activityIds = new Set(base.activities.map(function (a) { return a.id; }));
    var inputKeys = new Set(base.inputs.map(function (i) { return "".concat(i.trackedActivityId, ":").concat(i.trackedEntityId); }));
    var outputKeys = new Set(base.outputs.map(function (o) { return "".concat(o.trackedActivityId, ":").concat(o.trackedEntityId); }));
    var baseSteps = (_a = base.stepRecords) !== null && _a !== void 0 ? _a : [];
    var baseContainments = (_b = base.containments) !== null && _b !== void 0 ? _b : [];
    var incomingSteps = (_c = incoming.stepRecords) !== null && _c !== void 0 ? _c : [];
    var incomingContainments = (_d = incoming.containments) !== null && _d !== void 0 ? _d : [];
    var stepIds = new Set(baseSteps.map(function (s) { return s.id; }));
    var containmentKeys = new Set(baseContainments.map(function (c) { return "".concat(c.id, ":").concat(c.trackedEntityId); }));
    return {
        entities: __spreadArray(__spreadArray([], base.entities, true), incoming.entities.filter(function (e) { return !entityIds.has(e.id); }), true),
        activities: __spreadArray(__spreadArray([], base.activities, true), incoming.activities.filter(function (a) { return !activityIds.has(a.id); }), true),
        inputs: __spreadArray(__spreadArray([], base.inputs, true), incoming.inputs.filter(function (i) { return !inputKeys.has("".concat(i.trackedActivityId, ":").concat(i.trackedEntityId)); }), true),
        outputs: __spreadArray(__spreadArray([], base.outputs, true), incoming.outputs.filter(function (o) { return !outputKeys.has("".concat(o.trackedActivityId, ":").concat(o.trackedEntityId)); }), true),
        stepRecords: incomingSteps.length === 0 && baseSteps.length === 0
            ? undefined
            : __spreadArray(__spreadArray([], baseSteps, true), incomingSteps.filter(function (s) { return !stepIds.has(s.id); }), true),
        containments: incomingContainments.length === 0 && baseContainments.length === 0
            ? undefined
            : __spreadArray(__spreadArray([], baseContainments, true), incomingContainments.filter(function (c) { return !containmentKeys.has("".concat(c.id, ":").concat(c.trackedEntityId)); }), true)
    };
}
function lineagePathEdges(rootId, edges) {
    var _a;
    var outgoing = new Map();
    for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
        var e = edges_1[_i];
        if (!outgoing.has(e.source))
            outgoing.set(e.source, []);
        outgoing.get(e.source).push(e);
    }
    var edgeIds = new Set();
    var nodeIds = new Set([rootId]);
    var stack = [rootId];
    var visited = new Set([rootId]);
    while (stack.length) {
        var cur = stack.pop();
        for (var _b = 0, _c = (_a = outgoing.get(cur)) !== null && _a !== void 0 ? _a : []; _b < _c.length; _b++) {
            var e = _c[_b];
            edgeIds.add(e.id);
            nodeIds.add(e.target);
            if (!visited.has(e.target)) {
                visited.add(e.target);
                stack.push(e.target);
            }
        }
    }
    return { edgeIds: edgeIds, nodeIds: nodeIds };
}
function lineagePathEdgesMulti(rootIds, edges, excludedIds) {
    if (excludedIds === void 0) { excludedIds = new Set(); }
    var filteredEdges = excludedIds.size
        ? edges.filter(function (e) { return !excludedIds.has(e.source) && !excludedIds.has(e.target); })
        : edges;
    var edgeIds = new Set();
    var nodeIds = new Set();
    var rootSet = new Set(rootIds.filter(function (id) { return !excludedIds.has(id); }));
    for (var _i = 0, rootSet_1 = rootSet; _i < rootSet_1.length; _i++) {
        var id = rootSet_1[_i];
        var r = lineagePathEdges(id, filteredEdges);
        for (var _a = 0, _b = r.edgeIds; _a < _b.length; _a++) {
            var e = _b[_a];
            edgeIds.add(e);
        }
        for (var _c = 0, _d = r.nodeIds; _c < _d.length; _c++) {
            var n = _d[_c];
            nodeIds.add(n);
        }
    }
    for (var _e = 0, filteredEdges_1 = filteredEdges; _e < filteredEdges_1.length; _e++) {
        var e = filteredEdges_1[_e];
        if (rootSet.has(e.source) && rootSet.has(e.target)) {
            edgeIds.add(e.id);
            nodeIds.add(e.source);
            nodeIds.add(e.target);
        }
    }
    return { edgeIds: edgeIds, nodeIds: nodeIds };
}
function lineageReachableMulti(rootIds, edges) {
    var result = new Set();
    for (var _i = 0, rootIds_1 = rootIds; _i < rootIds_1.length; _i++) {
        var id = rootIds_1[_i];
        for (var _a = 0, _b = lineageReachable(id, edges); _a < _b.length; _a++) {
            var r = _b[_a];
            result.add(r);
        }
    }
    return result;
}
function lineageReachable(rootId, edges) {
    var _a, _b;
    var incoming = new Map();
    var outgoing = new Map();
    for (var _i = 0, edges_2 = edges; _i < edges_2.length; _i++) {
        var e = edges_2[_i];
        if (!outgoing.has(e.source))
            outgoing.set(e.source, []);
        if (!incoming.has(e.target))
            incoming.set(e.target, []);
        outgoing.get(e.source).push(e.target);
        incoming.get(e.target).push(e.source);
    }
    var result = new Set([rootId]);
    var downStack = [rootId];
    var downVisited = new Set([rootId]);
    while (downStack.length) {
        var cur = downStack.pop();
        for (var _c = 0, _d = (_a = outgoing.get(cur)) !== null && _a !== void 0 ? _a : []; _c < _d.length; _c++) {
            var next = _d[_c];
            if (!downVisited.has(next)) {
                downVisited.add(next);
                result.add(next);
                downStack.push(next);
            }
        }
    }
    var upStack = [rootId];
    var upVisited = new Set([rootId]);
    while (upStack.length) {
        var cur = upStack.pop();
        for (var _e = 0, _f = (_b = incoming.get(cur)) !== null && _b !== void 0 ? _b : []; _e < _f.length; _e++) {
            var prev = _f[_e];
            if (!upVisited.has(prev)) {
                upVisited.add(prev);
                result.add(prev);
                upStack.push(prev);
            }
        }
    }
    return result;
}
function entityHeadline(e, sliceTo) {
    var _a, _b;
    return ((_b = (_a = e.sourceDocumentReadableId) !== null && _a !== void 0 ? _a : e.readableId) !== null && _b !== void 0 ? _b : (sliceTo ? e.id.slice(0, sliceTo) : e.id));
}
function activityHeadline(a, sliceTo) {
    var _a, _b;
    return ((_b = (_a = a.sourceDocumentReadableId) !== null && _a !== void 0 ? _a : a.type) !== null && _b !== void 0 ? _b : (sliceTo ? a.id.slice(0, sliceTo) : a.id));
}
function sourceLinkHref(doc, id) {
    if (!doc || !id)
        return null;
    switch (doc) {
        case "Job":
            return "/x/job/".concat(id);
        case "Receipt":
            return "/x/receipt/".concat(id);
        case "Shipment":
            return "/x/shipment/".concat(id);
        case "Purchase Order":
            return "/x/purchase-order/".concat(id);
        case "Sales Order":
            return "/x/sales-order/".concat(id);
        default:
            return null;
    }
}
function annotateEdgeWeights(edges, rejectIds) {
    var _a, _b, _c;
    var totalsBySource = new Map();
    for (var _i = 0, edges_3 = edges; _i < edges_3.length; _i++) {
        var e = edges_3[_i];
        var q = (_b = (_a = e.data) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 0;
        totalsBySource.set(e.source, ((_c = totalsBySource.get(e.source)) !== null && _c !== void 0 ? _c : 0) + q);
    }
    return edges.map(function (e) {
        var _a, _b, _c;
        var total = (_a = totalsBySource.get(e.source)) !== null && _a !== void 0 ? _a : 0;
        var q = (_c = (_b = e.data) === null || _b === void 0 ? void 0 : _b.quantity) !== null && _c !== void 0 ? _c : 0;
        var weight = total > 0 ? q / total : 0.5;
        return __assign(__assign({}, e), { data: __assign(__assign({}, e.data), { weight: weight, isReject: rejectIds.has(e.target) }) });
    });
}
