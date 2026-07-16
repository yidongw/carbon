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
exports.DEADLINE_PRIORITY = void 0;
exports.sortOperationsByPriority = sortOperationsByPriority;
exports.assignSequentialPriorities = assignSequentialPriorities;
exports.calculateFractionalPriority = calculateFractionalPriority;
exports.groupOperationsByWorkCenter = groupOperationsByWorkCenter;
exports.calculatePrioritiesByWorkCenter = calculatePrioritiesByWorkCenter;
exports.toOperationWithJobInfo = toOperationWithJobInfo;
exports.applyPriorities = applyPriorities;
exports.getDeadlinePriority = getDeadlinePriority;
/**
 * Deadline type priority order (lower number = higher priority)
 */
var DEADLINE_PRIORITY = {
    "ASAP": 0,
    "Hard Deadline": 1,
    "Soft Deadline": 2,
    "No Deadline": 3,
};
exports.DEADLINE_PRIORITY = DEADLINE_PRIORITY;
/**
 * Get deadline priority value (for sorting)
 */
function getDeadlinePriority(deadlineType) {
    var _a;
    return (_a = DEADLINE_PRIORITY[deadlineType || "No Deadline"]) !== null && _a !== void 0 ? _a : 3;
}
/**
 * Sort operations by priority criteria:
 * 1. Start Date (earliest first) - Primary
 * 2. Job Priority (lower number = higher priority) - Secondary
 * 3. Deadline Type (ASAP > Hard > Soft > No Deadline) - Tie-breaker
 */
function sortOperationsByPriority(operations) {
    return __spreadArray([], operations, true).sort(function (a, b) {
        var _a, _b;
        // 1. Start date (earliest first, nulls last)
        if (a.startDate && b.startDate) {
            var dateCompare = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            if (dateCompare !== 0)
                return dateCompare;
        }
        else if (a.startDate) {
            return -1;
        }
        else if (b.startDate) {
            return 1;
        }
        // 2. Job priority (lower = higher priority)
        var aPriority = (_a = a.jobPriority) !== null && _a !== void 0 ? _a : 0;
        var bPriority = (_b = b.jobPriority) !== null && _b !== void 0 ? _b : 0;
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }
        // 3. Deadline type (ASAP > Hard > Soft > No Deadline)
        var aDeadline = getDeadlinePriority(a.deadlineType);
        var bDeadline = getDeadlinePriority(b.deadlineType);
        return aDeadline - bDeadline;
    });
}
/**
 * Assign sequential integer priorities to sorted operations
 * Uses simple sequential numbering (1, 2, 3, ...)
 */
function assignSequentialPriorities(sortedOperations) {
    var priorities = new Map();
    sortedOperations.forEach(function (op, index) {
        priorities.set(op.id, index + 1);
    });
    return priorities;
}
/**
 * Calculate fractional priority for inserting between two existing priorities
 * Used when inserting a new operation between existing ones
 */
function calculateFractionalPriority(priorityBefore, priorityAfter) {
    var before = priorityBefore !== null && priorityBefore !== void 0 ? priorityBefore : 0;
    var after = priorityAfter !== null && priorityAfter !== void 0 ? priorityAfter : before + 2;
    return (before + after) / 2;
}
/**
 * Group operations by work center
 */
function groupOperationsByWorkCenter(operations) {
    var groups = new Map();
    for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
        var op = operations_1[_i];
        var wcId = op.workCenterId;
        if (!groups.has(wcId)) {
            groups.set(wcId, []);
        }
        groups.get(wcId).push(op);
    }
    return groups;
}
/**
 * Calculate priorities for all operations grouped by work center
 * Returns a map of operation ID to priority number
 */
function calculatePrioritiesByWorkCenter(operations) {
    var allPriorities = new Map();
    // Group by work center
    var byWorkCenter = groupOperationsByWorkCenter(operations);
    // Calculate priorities for each work center independently
    for (var _i = 0, byWorkCenter_1 = byWorkCenter; _i < byWorkCenter_1.length; _i++) {
        var _a = byWorkCenter_1[_i], _wcId = _a[0], wcOperations = _a[1];
        // Sort operations for this work center
        var sorted = sortOperationsByPriority(wcOperations);
        // Assign sequential priorities
        var priorities = assignSequentialPriorities(sorted);
        // Merge into all priorities
        for (var _b = 0, priorities_1 = priorities; _b < priorities_1.length; _b++) {
            var _c = priorities_1[_b], opId = _c[0], priority = _c[1];
            allPriorities.set(opId, priority);
        }
    }
    return allPriorities;
}
/**
 * Convert scheduled operations to OperationWithJobInfo format
 * for priority calculation
 */
function toOperationWithJobInfo(operation, jobPriority, jobDeadlineType) {
    var _a, _b;
    return {
        id: operation.id,
        dueDate: operation.dueDate,
        startDate: operation.startDate,
        priority: operation.priority,
        deadlineType: (_a = operation.deadlineType) !== null && _a !== void 0 ? _a : jobDeadlineType,
        jobPriority: jobPriority,
        workCenterId: (_b = operation.workCenterId) !== null && _b !== void 0 ? _b : null,
    };
}
/**
 * Apply calculated priorities to scheduled operations
 */
function applyPriorities(operations, priorities) {
    var _a;
    var result = new Map();
    for (var _i = 0, operations_2 = operations; _i < operations_2.length; _i++) {
        var _b = operations_2[_i], opId = _b[0], op = _b[1];
        var priority = (_a = priorities.get(opId)) !== null && _a !== void 0 ? _a : op.priority;
        result.set(opId, __assign(__assign({}, op), { priority: priority }));
    }
    return result;
}
