"use strict";
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
exports.DependencyGraphImpl = void 0;
exports.buildOperationDependencies = buildOperationDependencies;
exports.dependenciesToRecords = dependenciesToRecords;
/**
 * Creates and manages a dependency graph for job operations
 */
var DependencyGraphImpl = /** @class */ (function () {
    function DependencyGraphImpl(operations, dependencies) {
        if (operations === void 0) { operations = []; }
        if (dependencies === void 0) { dependencies = []; }
        this.nodes = new Map();
        this.initializeFromOperations(operations, dependencies);
    }
    /**
     * Initialize the graph from operations and dependencies
     */
    DependencyGraphImpl.prototype.initializeFromOperations = function (operations, dependencies) {
        // Initialize all operations as nodes
        for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
            var op = operations_1[_i];
            if (op.id) {
                this.nodes.set(op.id, {
                    operationId: op.id,
                    dependsOn: [],
                    requiredBy: [],
                });
            }
        }
        // Build edges from dependencies
        for (var _a = 0, dependencies_1 = dependencies; _a < dependencies_1.length; _a++) {
            var dep = dependencies_1[_a];
            this.addDependency(dep.operationId, dep.dependsOnId);
        }
    };
    /**
     * Get operations that this operation depends on
     */
    DependencyGraphImpl.prototype.getDependencies = function (operationId) {
        var _a;
        return ((_a = this.nodes.get(operationId)) === null || _a === void 0 ? void 0 : _a.dependsOn) || [];
    };
    /**
     * Get operations that depend on this operation
     */
    DependencyGraphImpl.prototype.getDependents = function (operationId) {
        var _a;
        return ((_a = this.nodes.get(operationId)) === null || _a === void 0 ? void 0 : _a.requiredBy) || [];
    };
    /**
     * Add a dependency relationship
     */
    DependencyGraphImpl.prototype.addDependency = function (operationId, dependsOnId) {
        var opNode = this.nodes.get(operationId);
        var depNode = this.nodes.get(dependsOnId);
        if (opNode && !opNode.dependsOn.includes(dependsOnId)) {
            opNode.dependsOn.push(dependsOnId);
        }
        if (depNode && !depNode.requiredBy.includes(operationId)) {
            depNode.requiredBy.push(operationId);
        }
    };
    /**
     * Check if an operation has any dependencies
     */
    DependencyGraphImpl.prototype.hasDependencies = function (operationId) {
        return this.getDependencies(operationId).length > 0;
    };
    /**
     * Check if an operation has any dependents
     */
    DependencyGraphImpl.prototype.hasDependents = function (operationId) {
        return this.getDependents(operationId).length > 0;
    };
    /**
     * Perform topological sort on the operations
     * @param direction "forward" starts with operations that have no dependencies (roots)
     *                  "reverse" starts with operations that have no dependents (leaves)
     */
    DependencyGraphImpl.prototype.topologicalSort = function (direction) {
        var inDegree = new Map();
        var queue = [];
        var result = [];
        // Calculate in-degrees based on direction
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var _b = _a[_i], opId = _b[0], node = _b[1];
            var deps = direction === "forward" ? node.dependsOn : node.requiredBy;
            inDegree.set(opId, deps.length);
            if (deps.length === 0) {
                queue.push(opId);
            }
        }
        // Process queue using BFS
        while (queue.length > 0) {
            var opId = queue.shift();
            result.push(opId);
            var node = this.nodes.get(opId);
            if (!node)
                continue;
            // Get neighbors based on direction
            var neighbors = direction === "forward" ? node.requiredBy : node.dependsOn;
            for (var _c = 0, neighbors_1 = neighbors; _c < neighbors_1.length; _c++) {
                var neighborId = neighbors_1[_c];
                var degree = inDegree.get(neighborId) - 1;
                inDegree.set(neighborId, degree);
                if (degree === 0) {
                    queue.push(neighborId);
                }
            }
        }
        return result;
    };
    /**
     * Get all leaf operations (operations with no dependents)
     */
    DependencyGraphImpl.prototype.getLeafOperations = function () {
        var leaves = [];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var _b = _a[_i], opId = _b[0], node = _b[1];
            if (node.requiredBy.length === 0) {
                leaves.push(opId);
            }
        }
        return leaves;
    };
    /**
     * Get all root operations (operations with no dependencies)
     */
    DependencyGraphImpl.prototype.getRootOperations = function () {
        var roots = [];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var _b = _a[_i], opId = _b[0], node = _b[1];
            if (node.dependsOn.length === 0) {
                roots.push(opId);
            }
        }
        return roots;
    };
    return DependencyGraphImpl;
}());
exports.DependencyGraphImpl = DependencyGraphImpl;
/**
 * Build dependencies for operations based on their order and operationOrder field
 * This handles "With Previous" parallel operations
 */
function buildOperationDependencies(operations) {
    var dependencies = new Map();
    // Initialize all operations
    for (var _i = 0, operations_2 = operations; _i < operations_2.length; _i++) {
        var op = operations_2[_i];
        if (op.id) {
            dependencies.set(op.id, new Set());
        }
    }
    // Sort operations by order
    var sorted = __spreadArray([], operations, true).sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
    // Calculate adjusted order for "With Previous" operations
    var adjustedOrders = new Map();
    for (var i = 0; i < sorted.length; i++) {
        var op = sorted[i];
        if (!op.id)
            continue;
        if (op.operationOrder === "With Previous" && i > 0) {
            // Find the first operation before this that is NOT "With Previous"
            var adjustedOrder = i;
            for (var j = i - 1; j >= 0; j--) {
                if (sorted[j].operationOrder !== "With Previous") {
                    adjustedOrder = j + 1;
                    break;
                }
                if (j === 0) {
                    adjustedOrder = 1;
                }
            }
            adjustedOrders.set(op.id, adjustedOrder);
        }
        else {
            adjustedOrders.set(op.id, i + 1);
        }
    }
    // Group operations by adjusted order
    var operationsByOrder = new Map();
    for (var _a = 0, adjustedOrders_1 = adjustedOrders; _a < adjustedOrders_1.length; _a++) {
        var _b = adjustedOrders_1[_a], opId = _b[0], order = _b[1];
        if (!operationsByOrder.has(order)) {
            operationsByOrder.set(order, []);
        }
        operationsByOrder.get(order).push(opId);
    }
    // Create dependencies between sequential groups
    var orderKeys = __spreadArray([], operationsByOrder.keys(), true).sort(function (a, b) { return a - b; });
    for (var i = 1; i < orderKeys.length; i++) {
        var currentOrderOps = operationsByOrder.get(orderKeys[i]);
        var previousOrderOps = operationsByOrder.get(orderKeys[i - 1]);
        // Each operation in current group depends on all operations in previous group
        for (var _c = 0, currentOrderOps_1 = currentOrderOps; _c < currentOrderOps_1.length; _c++) {
            var opId = currentOrderOps_1[_c];
            var deps = dependencies.get(opId);
            if (deps) {
                for (var _d = 0, previousOrderOps_1 = previousOrderOps; _d < previousOrderOps_1.length; _d++) {
                    var prevOpId = previousOrderOps_1[_d];
                    deps.add(prevOpId);
                }
            }
        }
    }
    return dependencies;
}
/**
 * Convert dependency map to array of JobOperationDependency records
 */
function dependenciesToRecords(dependencies, jobId, companyId) {
    var records = [];
    for (var _i = 0, dependencies_2 = dependencies; _i < dependencies_2.length; _i++) {
        var _a = dependencies_2[_i], operationId = _a[0], deps = _a[1];
        for (var _b = 0, deps_1 = deps; _b < deps_1.length; _b++) {
            var dependsOnId = deps_1[_b];
            records.push({
                jobId: jobId,
                operationId: operationId,
                dependsOnId: dependsOnId,
                companyId: companyId,
            });
        }
    }
    return records;
}
