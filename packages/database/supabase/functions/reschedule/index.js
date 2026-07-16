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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var server_ts_1 = require("https://deno.land/std@0.168.0/http/server.ts");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
// Helper: Get job with operations and dependencies
function getJobWithOperations(trx, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var job, operations, dependencies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("job")
                        .select(["id", "dueDate", "priority", "deadlineType"])
                        .where("id", "=", jobId)
                        .executeTakeFirstOrThrow()];
                case 1:
                    job = _a.sent();
                    return [4 /*yield*/, trx
                            .selectFrom("jobOperation")
                            .selectAll()
                            .where("jobId", "=", jobId)
                            .where("status", "not in", ["Done", "Canceled"])
                            .execute()];
                case 2:
                    operations = _a.sent();
                    return [4 /*yield*/, trx
                            .selectFrom("jobOperationDependency")
                            .selectAll()
                            .where("jobId", "=", jobId)
                            .execute()];
                case 3:
                    dependencies = _a.sent();
                    return [2 /*return*/, { job: job, operations: operations, dependencies: dependencies }];
            }
        });
    });
}
// Helper: Build dependency graph
function buildDependencyGraph(operations, dependencies) {
    var graph = new Map();
    // Initialize all operations
    for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
        var op = operations_1[_i];
        graph.set(op.id, { dependsOn: [], requiredBy: [] });
    }
    // Build edges
    for (var _a = 0, dependencies_1 = dependencies; _a < dependencies_1.length; _a++) {
        var dep = dependencies_1[_a];
        var opNode = graph.get(dep.operationId);
        var depNode = graph.get(dep.dependsOnId);
        if (opNode) {
            opNode.dependsOn.push(dep.dependsOnId);
        }
        if (depNode) {
            depNode.requiredBy.push(dep.operationId);
        }
    }
    return graph;
}
// Helper: Topological sort
function topologicalSort(operations, graph, direction) {
    var _a, _b, _c, _d;
    var inDegree = new Map();
    var queue = [];
    var result = [];
    // Calculate in-degrees
    for (var _i = 0, operations_2 = operations; _i < operations_2.length; _i++) {
        var op = operations_2[_i];
        var deps = direction === "forward"
            ? ((_a = graph.get(op.id)) === null || _a === void 0 ? void 0 : _a.dependsOn) || []
            : ((_b = graph.get(op.id)) === null || _b === void 0 ? void 0 : _b.requiredBy) || [];
        inDegree.set(op.id, deps.length);
        if (deps.length === 0)
            queue.push(op.id);
    }
    var _loop_1 = function () {
        var opId = queue.shift();
        var op = operations.find(function (o) { return o.id === opId; });
        result.push(op);
        var neighbors = direction === "forward"
            ? ((_c = graph.get(opId)) === null || _c === void 0 ? void 0 : _c.requiredBy) || []
            : ((_d = graph.get(opId)) === null || _d === void 0 ? void 0 : _d.dependsOn) || [];
        for (var _e = 0, neighbors_1 = neighbors; _e < neighbors_1.length; _e++) {
            var neighborId = neighbors_1[_e];
            var degree = inDegree.get(neighborId) - 1;
            inDegree.set(neighborId, degree);
            if (degree === 0)
                queue.push(neighborId);
        }
    };
    // Process queue
    while (queue.length > 0) {
        _loop_1();
    }
    return result;
}
// Helper: Calculate operation duration in days
function calculateOperationDuration(op) {
    var quantity = op.operationQuantity || 1;
    // Calculate total hours
    var setupHours = 0;
    var laborHours = 0;
    var machineHours = 0;
    if (op.setupTime) {
        setupHours =
            op.setupUnit === "Hours/Piece"
                ? (op.setupTime * quantity)
                : op.setupTime;
    }
    if (op.laborTime) {
        laborHours =
            op.laborUnit === "Hours/Piece"
                ? (op.laborTime * quantity)
                : op.laborTime;
    }
    if (op.machineTime) {
        machineHours =
            op.machineUnit === "Hours/Piece"
                ? (op.machineTime * quantity)
                : op.machineTime;
    }
    // Total hours (setup + max of labor/machine since they can overlap)
    var totalHours = setupHours + Math.max(laborHours, machineHours);
    // Convert to days (assuming 8-hour workday)
    var days = totalHours / 8;
    // Round up to at least 1 day
    return Math.max(Math.ceil(days), 1);
}
// Helper: Backward schedule operations
function backwardScheduleOperations(operations, graph, jobDueDate) {
    var scheduled = new Map();
    var today = new Date().toISOString().split("T")[0];
    // Default to today if no due date
    var finalDueDate = jobDueDate || today;
    // Topological sort (reverse: final ops first)
    var sorted = topologicalSort(operations, graph, "reverse");
    for (var _i = 0, sorted_1 = sorted; _i < sorted_1.length; _i++) {
        var op = sorted_1[_i];
        var deps = graph.get(op.id);
        if (!deps)
            continue;
        var totalDuration = calculateOperationDuration(op);
        // Calculate due date
        var dueDate = void 0;
        if (deps.requiredBy.length === 0) {
            // Leaf operation: use job due date
            dueDate = finalDueDate;
        }
        else {
            // Has dependents: must finish before earliest dependent starts
            var dependentStartDates = deps.requiredBy
                .map(function (depId) { var _a; return (_a = scheduled.get(depId)) === null || _a === void 0 ? void 0 : _a.startDate; })
                .filter(function (date) { return date !== null && date !== undefined; });
            if (dependentStartDates.length === 0) {
                dueDate = finalDueDate;
            }
            else {
                // Subtract 1 day buffer
                var minDate = new Date(Math.min.apply(Math, dependentStartDates.map(function (d) { return new Date(d).getTime(); })));
                minDate.setDate(minDate.getDate() - 1);
                dueDate = minDate.toISOString().split("T")[0];
            }
        }
        // Calculate start date
        var dueDateObj = new Date(dueDate);
        dueDateObj.setDate(dueDateObj.getDate() - totalDuration);
        var startDate = dueDateObj.toISOString().split("T")[0];
        // Check for conflicts
        var hasConflict = startDate < today;
        var conflictReason = hasConflict
            ? "Operation must start on ".concat(startDate, " but current date is ").concat(today)
            : null;
        scheduled.set(op.id, __assign(__assign({}, op), { startDate: startDate, dueDate: dueDate, hasConflict: hasConflict, conflictReason: conflictReason }));
    }
    return Array.from(scheduled.values());
}
// Helper: Sort operations by priority criteria
function sortOperationsByPriority(operations) {
    var deadlineOrder = {
        ASAP: 0,
        "Hard Deadline": 1,
        "Soft Deadline": 2,
        "No Deadline": 3,
    };
    return operations.sort(function (a, b) {
        // 1. Deadline type
        var aDeadline = a.deadlineType || "No Deadline";
        var bDeadline = b.deadlineType || "No Deadline";
        if (aDeadline !== bDeadline) {
            return deadlineOrder[aDeadline] - deadlineOrder[bDeadline];
        }
        // 2. Due date (earliest first, nulls last)
        if (a.dueDate && b.dueDate) {
            var dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            if (dateCompare !== 0)
                return dateCompare;
        }
        else if (a.dueDate) {
            return -1;
        }
        else if (b.dueDate) {
            return 1;
        }
        // 3. Job priority
        var aPriority = a.jobPriority || 0;
        var bPriority = b.jobPriority || 0;
        return aPriority - bPriority;
    });
}
// Helper: Apply fractional priorities
function applyFractionalPriorities(sorted) {
    return sorted.map(function (op, index) {
        if (index === 0) {
            op.priority = 0;
        }
        else {
            var prevPriority = sorted[index - 1].priority || 0;
            op.priority = prevPriority + 1;
        }
        return op;
    });
}
// Helper: Recalculate priorities by work center
function recalculatePriorities(trx, scheduledOps, workCenterIds) {
    return __awaiter(this, void 0, void 0, function () {
        var prioritizedOps, _i, workCenterIds_1, wcId, allWcOps, mergedOps, sorted, prioritized, _loop_2, _a, prioritized_1, op;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    prioritizedOps = __spreadArray([], scheduledOps, true);
                    _i = 0, workCenterIds_1 = workCenterIds;
                    _b.label = 1;
                case 1:
                    if (!(_i < workCenterIds_1.length)) return [3 /*break*/, 4];
                    wcId = workCenterIds_1[_i];
                    if (!wcId)
                        return [3 /*break*/, 3];
                    return [4 /*yield*/, trx
                            .selectFrom("jobOperation as jo")
                            .innerJoin("job as j", "j.id", "jo.jobId")
                            .select([
                            "jo.id",
                            "jo.dueDate",
                            "jo.priority",
                            "j.deadlineType",
                            "j.priority as jobPriority",
                            "jo.workCenterId",
                        ])
                            .where("jo.workCenterId", "=", wcId)
                            .where("jo.status", "not in", ["Done", "Canceled"])
                            .execute()];
                case 2:
                    allWcOps = _b.sent();
                    mergedOps = allWcOps.map(function (wcOp) {
                        var scheduled = scheduledOps.find(function (s) { return s.id === wcOp.id; });
                        if (scheduled) {
                            return {
                                id: scheduled.id,
                                dueDate: scheduled.dueDate,
                                priority: scheduled.priority,
                                deadlineType: wcOp.deadlineType,
                                jobPriority: wcOp.jobPriority,
                                workCenterId: wcOp.workCenterId,
                            };
                        }
                        return wcOp;
                    });
                    sorted = sortOperationsByPriority(mergedOps);
                    prioritized = applyFractionalPriorities(sorted);
                    _loop_2 = function (op) {
                        var idx = prioritizedOps.findIndex(function (p) { return p.id === op.id; });
                        if (idx >= 0) {
                            prioritizedOps[idx].priority = op.priority;
                        }
                    };
                    // Update prioritized ops
                    for (_a = 0, prioritized_1 = prioritized; _a < prioritized_1.length; _a++) {
                        op = prioritized_1[_a];
                        _loop_2(op);
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, prioritizedOps];
            }
        });
    });
}
// Main handler
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId_1, companyId, userId_1, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, req.json()];
            case 2:
                _a = _b.sent(), jobId_1 = _a.jobId, companyId = _a.companyId, userId_1 = _a.userId;
                console.info("\uD83D\uDD30 Starting reschedule for job ".concat(jobId_1));
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, job, operations, dependencies, graph, scheduledOps, conflicts, workCenterIds, prioritizedOps, _i, prioritizedOps_1, op;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, getJobWithOperations(trx, jobId_1)];
                                case 1:
                                    _a = _b.sent(), job = _a.job, operations = _a.operations, dependencies = _a.dependencies;
                                    console.info("\uD83D\uDCCA Job has ".concat(operations.length, " operations, ").concat(dependencies.length, " dependencies"));
                                    graph = buildDependencyGraph(operations, dependencies);
                                    scheduledOps = backwardScheduleOperations(operations, graph, job.dueDate);
                                    conflicts = scheduledOps.filter(function (op) { return op.hasConflict; });
                                    console.info("\u26A0\uFE0F  Detected ".concat(conflicts.length, " scheduling conflicts"));
                                    workCenterIds = __spreadArray([], new Set(scheduledOps
                                        .map(function (op) { return op.workCenterId; })
                                        .filter(function (id) { return id !== null; })), true);
                                    console.info("\uD83C\uDFED Affected work centers: ".concat(workCenterIds.length));
                                    return [4 /*yield*/, recalculatePriorities(trx, scheduledOps, workCenterIds)];
                                case 2:
                                    prioritizedOps = _b.sent();
                                    _i = 0, prioritizedOps_1 = prioritizedOps;
                                    _b.label = 3;
                                case 3:
                                    if (!(_i < prioritizedOps_1.length)) return [3 /*break*/, 6];
                                    op = prioritizedOps_1[_i];
                                    return [4 /*yield*/, trx
                                            .updateTable("jobOperation")
                                            .set({
                                            startDate: op.startDate,
                                            dueDate: op.dueDate,
                                            priority: op.priority,
                                            hasConflict: op.hasConflict,
                                            conflictReason: op.conflictReason,
                                            updatedAt: new Date().toISOString(),
                                            updatedBy: userId_1,
                                        })
                                            .where("id", "=", op.id)
                                            .execute()];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    _i++;
                                    return [3 /*break*/, 3];
                                case 6:
                                    console.info("\u2705 Updated ".concat(prioritizedOps.length, " operations"));
                                    return [2 /*return*/, {
                                            operationsUpdated: prioritizedOps.length,
                                            conflictsDetected: conflicts.length,
                                            workCentersAffected: workCenterIds.length,
                                        }];
                            }
                        });
                    }); })];
            case 3:
                result = _b.sent();
                return [2 /*return*/, new Response(JSON.stringify(__assign({ success: true }, result)), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 4:
                error_1 = _b.sent();
                console.error("\u274C Reschedule failed: ".concat(error_1 instanceof Error ? error_1.message : String(error_1)));
                return [2 /*return*/, new Response(JSON.stringify({
                        success: false,
                        message: error_1 instanceof Error ? error_1.message : String(error_1),
                    }), {
                        status: 500,
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); });
