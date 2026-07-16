"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBomIds = exports.calculateTotalQuantity = void 0;
exports.resolveOperationRates = resolveOperationRates;
exports.normalizeTime = normalizeTime;
exports.calculateMadePartCosts = calculateMadePartCosts;
function resolveOperationRates(workCenterId, processId, laborRate, machineRate, overheadRate, workCenters) {
    var _a, _b, _c;
    // If a work center is explicitly set and has rates, use them
    if (workCenterId) {
        var wc = workCenters.find(function (w) { return w.id === workCenterId && w.active; });
        if (wc) {
            return {
                laborRate: (_a = wc.laborRate) !== null && _a !== void 0 ? _a : 0,
                machineRate: (_b = wc.machineRate) !== null && _b !== void 0 ? _b : 0,
                overheadRate: (_c = wc.overheadRate) !== null && _c !== void 0 ? _c : 0
            };
        }
        // Fall back to the joined rates from the operation
        return {
            laborRate: laborRate !== null && laborRate !== void 0 ? laborRate : 0,
            machineRate: machineRate !== null && machineRate !== void 0 ? machineRate : 0,
            overheadRate: overheadRate !== null && overheadRate !== void 0 ? overheadRate : 0
        };
    }
    // No work center selected — average rates from active work centers for this process
    var related = workCenters.filter(function (wc) { var _a; return wc.active && ((_a = wc.processes) !== null && _a !== void 0 ? _a : []).some(function (p) { return p === processId; }); });
    if (related.length > 0) {
        return {
            laborRate: related.reduce(function (sum, wc) { var _a; return sum + ((_a = wc.laborRate) !== null && _a !== void 0 ? _a : 0); }, 0) /
                related.length,
            machineRate: related.reduce(function (sum, wc) { var _a; return sum + ((_a = wc.machineRate) !== null && _a !== void 0 ? _a : 0); }, 0) /
                related.length,
            overheadRate: related.reduce(function (sum, wc) { var _a; return sum + ((_a = wc.overheadRate) !== null && _a !== void 0 ? _a : 0); }, 0) /
                related.length
        };
    }
    return { laborRate: 0, machineRate: 0, overheadRate: 0 };
}
function normalizeTime(time, unit) {
    var fixedHours = 0;
    var hoursPerUnit = 0;
    switch (unit) {
        case "Total Hours":
            fixedHours = time;
            break;
        case "Total Minutes":
            fixedHours = time / 60;
            break;
        case "Hours/Piece":
            hoursPerUnit = time;
            break;
        case "Hours/100 Pieces":
            hoursPerUnit = time / 100;
            break;
        case "Hours/1000 Pieces":
            hoursPerUnit = time / 1000;
            break;
        case "Minutes/Piece":
            hoursPerUnit = time / 60;
            break;
        case "Minutes/100 Pieces":
            hoursPerUnit = time / 100 / 60;
            break;
        case "Minutes/1000 Pieces":
            hoursPerUnit = time / 1000 / 60;
            break;
        case "Pieces/Hour":
            hoursPerUnit = 1 / time;
            break;
        case "Pieces/Minute":
            hoursPerUnit = 1 / (time / 60);
            break;
        case "Seconds/Piece":
            hoursPerUnit = time / 3600;
            break;
    }
    return { fixedHours: fixedHours, hoursPerUnit: hoursPerUnit };
}
function calculateOperationUnitCost(op, batchSize) {
    var _a, _b, _c, _d, _e;
    if (op.operationType === "Outside") {
        return Math.max(op.operationMinimumCost, op.operationUnitCost);
    }
    var batch = batchSize > 1 ? batchSize : 1;
    var cost = 0;
    if (op.setupTime) {
        var _f = normalizeTime(op.setupTime, op.setupUnit), fixedHours = _f.fixedHours, hoursPerUnit = _f.hoursPerUnit;
        var hoursPerPart = fixedHours / batch + hoursPerUnit;
        cost += hoursPerPart * ((_a = op.laborRate) !== null && _a !== void 0 ? _a : 0);
        cost += hoursPerPart * ((_b = op.overheadRate) !== null && _b !== void 0 ? _b : 0);
    }
    var laborHoursPerPart = 0;
    var machineHoursPerPart = 0;
    if (op.laborTime) {
        var _g = normalizeTime(op.laborTime, op.laborUnit), fixedHours = _g.fixedHours, hoursPerUnit = _g.hoursPerUnit;
        laborHoursPerPart = fixedHours / batch + hoursPerUnit;
        cost += laborHoursPerPart * ((_c = op.laborRate) !== null && _c !== void 0 ? _c : 0);
    }
    if (op.machineTime) {
        var _h = normalizeTime(op.machineTime, op.machineUnit), fixedHours = _h.fixedHours, hoursPerUnit = _h.hoursPerUnit;
        machineHoursPerPart = fixedHours / batch + hoursPerUnit;
        cost += machineHoursPerPart * ((_d = op.machineRate) !== null && _d !== void 0 ? _d : 0);
    }
    cost +=
        Math.max(laborHoursPerPart, machineHoursPerPart) * ((_e = op.overheadRate) !== null && _e !== void 0 ? _e : 0);
    return cost;
}
function calculateMadePartCosts(nodes, operationsByKey, getOperationKey, lotSizesByItemId) {
    var _a, _b, _c, _d, _e, _f;
    var costMap = new Map();
    var nodeMap = new Map(nodes.map(function (n) { return [n.id, n]; }));
    // Iterate in reverse (bottom-up since flattenTree is depth-first)
    for (var i = nodes.length - 1; i >= 0; i--) {
        var node = nodes[i];
        if (node.data.methodType !== "Make to Order" && !node.hasChildren) {
            costMap.set(node.id, (_a = node.data.unitCost) !== null && _a !== void 0 ? _a : 0);
            continue;
        }
        // Sum children material costs
        var materialCost = 0;
        for (var _i = 0, _g = node.children; _i < _g.length; _i++) {
            var childId = _g[_i];
            var child = nodeMap.get(childId);
            if (!child)
                continue;
            var childUnitCost = (_c = (_b = costMap.get(childId)) !== null && _b !== void 0 ? _b : child.data.unitCost) !== null && _c !== void 0 ? _c : 0;
            materialCost += childUnitCost * ((_d = child.data.quantity) !== null && _d !== void 0 ? _d : 0);
        }
        // Sum operation costs, amortizing fixed costs over the batch size
        var batchSize = (_e = lotSizesByItemId === null || lotSizesByItemId === void 0 ? void 0 : lotSizesByItemId.get(node.data.itemId)) !== null && _e !== void 0 ? _e : 1;
        var operationCost = 0;
        var key = getOperationKey(node);
        var ops = (_f = operationsByKey[key]) !== null && _f !== void 0 ? _f : [];
        for (var _h = 0, ops_1 = ops; _h < ops_1.length; _h++) {
            var op = ops_1[_h];
            operationCost += calculateOperationUnitCost(op, batchSize);
        }
        costMap.set(node.id, materialCost + operationCost);
    }
    return costMap;
}
var calculateTotalQuantity = function (node, nodes) {
    // Create lookup map for faster parent finding
    var nodeMap = new Map(nodes.map(function (n) { return [n.id, n]; }));
    var quantity = node.data.quantity || 1;
    var currentNode = node;
    while (currentNode.parentId) {
        var parent_1 = nodeMap.get(currentNode.parentId);
        if (!parent_1)
            break;
        quantity *= parent_1.data.quantity || 1;
        currentNode = parent_1;
    }
    return quantity;
};
exports.calculateTotalQuantity = calculateTotalQuantity;
var generateBomIds = function (nodes) {
    var ids = new Array(nodes.length);
    var levelCounters = new Map();
    nodes.forEach(function (node, index) {
        var level = node.level;
        // Reset deeper level counters when moving to shallower level
        if (index > 0 && level <= nodes[index - 1].level) {
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
};
exports.generateBomIds = generateBomIds;
