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
exports.ForwardSchedulingStrategy = exports.BackwardSchedulingStrategy = void 0;
exports.getSchedulingStrategy = getSchedulingStrategy;
exports.calculateOperationDates = calculateOperationDates;
exports.addBusinessDays = addBusinessDays;
exports.formatDate = formatDate;
exports.getTodayString = getTodayString;
exports.subtractBusinessDays = subtractBusinessDays;
var duration_calculator_ts_1 = require("./duration-calculator.ts");
/**
 * Subtract business days from a date (skips weekends)
 */
function subtractBusinessDays(date, days) {
    var result = new Date(date);
    var remainingDays = days;
    while (remainingDays > 0) {
        result.setDate(result.getDate() - 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        var dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            remainingDays--;
        }
    }
    return result;
}
/**
 * Add business days to a date (skips weekends)
 */
function addBusinessDays(date, days) {
    var result = new Date(date);
    var remainingDays = days;
    while (remainingDays > 0) {
        result.setDate(result.getDate() + 1);
        // Skip weekends (0 = Sunday, 6 = Saturday)
        var dayOfWeek = result.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            remainingDays--;
        }
    }
    return result;
}
/**
 * Format date to ISO date string (YYYY-MM-DD)
 */
function formatDate(date) {
    return date.toISOString().split("T")[0];
}
/**
 * Get today's date as ISO string
 */
function getTodayString() {
    return formatDate(new Date());
}
/**
 * Backward scheduling strategy - schedules from due date backward
 */
var BackwardSchedulingStrategy = /** @class */ (function () {
    function BackwardSchedulingStrategy() {
    }
    BackwardSchedulingStrategy.prototype.calculateDates = function (_operations, operationMap, graph, jobDueDate) {
        var _a, _b, _c;
        var scheduled = new Map();
        var today = getTodayString();
        var finalDueDate = jobDueDate || today;
        // Topological sort in reverse order (leaf nodes first)
        var sortedIds = graph.topologicalSort("reverse");
        for (var _i = 0, sortedIds_1 = sortedIds; _i < sortedIds_1.length; _i++) {
            var opId = sortedIds_1[_i];
            var op = operationMap.get(opId);
            if (!op || !op.id)
                continue;
            var durationDays = (0, duration_calculator_ts_1.calculateDurationDays)(op);
            var durationHours = (0, duration_calculator_ts_1.calculateDurationHours)(op);
            // If manually scheduled, preserve the existing dueDate and derive startDate
            if (op.manuallyScheduled && op.dueDate) {
                var dueDateObj_1 = new Date(op.dueDate);
                var startDateObj_1 = subtractBusinessDays(dueDateObj_1, durationDays);
                var startDate_1 = formatDate(startDateObj_1);
                var hasConflict_1 = startDate_1 < today;
                var conflictReason_1 = hasConflict_1
                    ? "Operation must start on ".concat(startDate_1, " but current date is ").concat(today)
                    : null;
                var scheduledOp_1 = __assign(__assign({}, op), { id: op.id, startDate: startDate_1, dueDate: op.dueDate, priority: (_a = op.priority) !== null && _a !== void 0 ? _a : 99, durationHours: durationHours, durationDays: durationDays, hasConflict: hasConflict_1, conflictReason: conflictReason_1 });
                scheduled.set(opId, scheduledOp_1);
                continue;
            }
            // Calculate due date
            var dueDate = void 0;
            var dependents = graph.getDependents(opId);
            if (dependents.length === 0) {
                // Leaf operation: use job due date
                dueDate = finalDueDate;
            }
            else {
                // Has dependents: must finish before earliest dependent starts minus lead time
                var dependentConstraints = dependents
                    .map(function (depId) {
                    var _a;
                    var scheduledOp = scheduled.get(depId);
                    var baseOp = operationMap.get(depId);
                    if (!(scheduledOp === null || scheduledOp === void 0 ? void 0 : scheduledOp.startDate))
                        return null;
                    // Subtract lead time from dependent's start date
                    // Lead time represents how early the subassembly needs to be ready
                    // before the parent operation starts
                    var leadTimeDays = (_a = baseOp === null || baseOp === void 0 ? void 0 : baseOp.operationLeadTime) !== null && _a !== void 0 ? _a : 0;
                    if (leadTimeDays > 0) {
                        var startDate_2 = new Date(scheduledOp.startDate);
                        return subtractBusinessDays(startDate_2, leadTimeDays);
                    }
                    return new Date(scheduledOp.startDate);
                })
                    .filter(function (date) { return date !== null; });
                if (dependentConstraints.length === 0) {
                    dueDate = finalDueDate;
                }
                else {
                    // Use the earliest constraint date (start date minus lead time)
                    var minDate = new Date(Math.min.apply(Math, dependentConstraints.map(function (d) { return d.getTime(); })));
                    dueDate = formatDate(minDate);
                }
            }
            // Handle "With Previous" operations - same dates as predecessor
            if (op.operationOrder === "With Previous") {
                var dependencies = graph.getDependencies(opId);
                if (dependencies.length > 0) {
                    var predecessorId = dependencies[0];
                    var predecessor = scheduled.get(predecessorId);
                    if (predecessor) {
                        var scheduledOp_2 = __assign(__assign({}, op), { id: op.id, startDate: predecessor.startDate, dueDate: predecessor.dueDate, priority: (_b = op.priority) !== null && _b !== void 0 ? _b : 99, durationHours: durationHours, durationDays: durationDays, hasConflict: predecessor.hasConflict, conflictReason: predecessor.conflictReason });
                        scheduled.set(opId, scheduledOp_2);
                        continue;
                    }
                }
            }
            // Calculate start date by subtracting duration from due date
            var dueDateObj = new Date(dueDate);
            var startDateObj = subtractBusinessDays(dueDateObj, durationDays);
            var startDate = formatDate(startDateObj);
            // Check for conflicts (start date in the past)
            var hasConflict = startDate < today;
            var conflictReason = hasConflict
                ? "Operation must start on ".concat(startDate, " but current date is ").concat(today)
                : null;
            var scheduledOp = __assign(__assign({}, op), { id: op.id, startDate: startDate, dueDate: dueDate, priority: (_c = op.priority) !== null && _c !== void 0 ? _c : 99, durationHours: durationHours, durationDays: durationDays, hasConflict: hasConflict, conflictReason: conflictReason });
            scheduled.set(opId, scheduledOp);
        }
        return scheduled;
    };
    return BackwardSchedulingStrategy;
}());
exports.BackwardSchedulingStrategy = BackwardSchedulingStrategy;
/**
 * Forward scheduling strategy - schedules from start date forward
 * (Placeholder for future implementation)
 */
var ForwardSchedulingStrategy = /** @class */ (function () {
    function ForwardSchedulingStrategy() {
    }
    ForwardSchedulingStrategy.prototype.calculateDates = function (_operations, operationMap, graph, jobStartDate) {
        var _a, _b, _c, _d;
        var scheduled = new Map();
        var today = getTodayString();
        var startDate = jobStartDate || today;
        // Topological sort in forward order (root nodes first)
        var sortedIds = graph.topologicalSort("forward");
        for (var _i = 0, sortedIds_2 = sortedIds; _i < sortedIds_2.length; _i++) {
            var opId = sortedIds_2[_i];
            var op = operationMap.get(opId);
            if (!op || !op.id)
                continue;
            var durationDays = (0, duration_calculator_ts_1.calculateDurationDays)(op);
            var durationHours = (0, duration_calculator_ts_1.calculateDurationHours)(op);
            // If manually scheduled, preserve the existing dueDate and derive startDate
            if (op.manuallyScheduled && op.dueDate) {
                var dueDateObj_2 = new Date(op.dueDate);
                var startDateObj_2 = subtractBusinessDays(dueDateObj_2, durationDays);
                var opStartDate_1 = formatDate(startDateObj_2);
                var scheduledOp_3 = __assign(__assign({}, op), { id: op.id, startDate: opStartDate_1, dueDate: op.dueDate, priority: (_a = op.priority) !== null && _a !== void 0 ? _a : 1, durationHours: durationHours, durationDays: durationDays, hasConflict: false, conflictReason: null });
                scheduled.set(opId, scheduledOp_3);
                continue;
            }
            // Calculate start date
            var opStartDate = void 0;
            var dependencies = graph.getDependencies(opId);
            if (dependencies.length === 0) {
                // Root operation: use job start date
                opStartDate = startDate;
            }
            else {
                // Has dependencies: must start after latest dependency ends plus lead time
                var dependencyDueDates = dependencies
                    .map(function (depId) { var _a; return (_a = scheduled.get(depId)) === null || _a === void 0 ? void 0 : _a.dueDate; })
                    .filter(function (date) { return date !== null && date !== undefined; });
                if (dependencyDueDates.length === 0) {
                    opStartDate = startDate;
                }
                else {
                    // Use the latest dependency due date
                    var maxDate = new Date(Math.max.apply(Math, dependencyDueDates.map(function (d) { return new Date(d).getTime(); })));
                    // Add lead time of current operation (time needed after dependencies complete)
                    var leadTimeDays = (_b = op.operationLeadTime) !== null && _b !== void 0 ? _b : 0;
                    if (leadTimeDays > 0) {
                        opStartDate = formatDate(addBusinessDays(maxDate, leadTimeDays));
                    }
                    else {
                        opStartDate = formatDate(maxDate);
                    }
                }
            }
            // Handle "With Previous" operations - same dates as predecessor
            if (op.operationOrder === "With Previous" && dependencies.length > 0) {
                var predecessorId = dependencies[0];
                var predecessor = scheduled.get(predecessorId);
                if (predecessor) {
                    var scheduledOp_4 = __assign(__assign({}, op), { id: op.id, startDate: predecessor.startDate, dueDate: predecessor.dueDate, priority: (_c = op.priority) !== null && _c !== void 0 ? _c : 99, durationHours: durationHours, durationDays: durationDays, hasConflict: false, conflictReason: null });
                    scheduled.set(opId, scheduledOp_4);
                    continue;
                }
            }
            // Calculate due date by adding duration to start date
            var startDateObj = new Date(opStartDate);
            var dueDateObj = addBusinessDays(startDateObj, durationDays);
            var dueDate = formatDate(dueDateObj);
            var scheduledOp = __assign(__assign({}, op), { id: op.id, startDate: opStartDate, dueDate: dueDate, priority: (_d = op.priority) !== null && _d !== void 0 ? _d : 1, durationHours: durationHours, durationDays: durationDays, hasConflict: false, conflictReason: null });
            scheduled.set(opId, scheduledOp);
        }
        return scheduled;
    };
    return ForwardSchedulingStrategy;
}());
exports.ForwardSchedulingStrategy = ForwardSchedulingStrategy;
/**
 * Factory function to get the appropriate scheduling strategy
 */
function getSchedulingStrategy(direction) {
    switch (direction) {
        case "forward":
            return new ForwardSchedulingStrategy();
        case "backward":
        default:
            return new BackwardSchedulingStrategy();
    }
}
/**
 * Main date calculation function
 */
function calculateOperationDates(operations, graph, anchorDate, direction) {
    if (direction === void 0) { direction = "backward"; }
    // Build operation map for quick lookup
    var operationMap = new Map();
    for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
        var op = operations_1[_i];
        if (op.id) {
            operationMap.set(op.id, op);
        }
    }
    var strategy = getSchedulingStrategy(direction);
    return strategy.calculateDates(operations, operationMap, graph, anchorDate);
}
