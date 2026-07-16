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
exports.partitionQuantityListFilters = partitionQuantityListFilters;
exports.mergeProductionQuantityListItems = mergeProductionQuantityListItems;
exports.mergeQuantityReports = mergeQuantityReports;
exports.mergePickups = mergePickups;
/** Actor column filters by employeeId; supplier lines have no employeeId. */
function partitionQuantityListFilters(filters, actor) {
    var list = filters !== null && filters !== void 0 ? filters : [];
    if (actor === "supplier") {
        return list.filter(function (filter) { return filter.column !== "employeeId"; });
    }
    return list;
}
function compareValues(a, b) {
    if (a == null && b == null)
        return 0;
    if (a == null)
        return 1; // nulls last
    if (b == null)
        return -1;
    if (typeof a === "number" && typeof b === "number")
        return a - b;
    return String(a).localeCompare(String(b));
}
/**
 * Multi-column client-side sort. Used after merging employee + supplier
 * results so the user's column sort is honored across both sources.
 */
function applySorts(items, sorts) {
    if (!sorts || sorts.length === 0) {
        return __spreadArray([], items, true).sort(function (a, b) {
            return new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime();
        });
    }
    return __spreadArray([], items, true).sort(function (a, b) {
        for (var _i = 0, sorts_1 = sorts; _i < sorts_1.length; _i++) {
            var _a = sorts_1[_i], sortBy = _a.sortBy, sortAsc = _a.sortAsc;
            var cmp = compareValues(a[sortBy], b[sortBy]);
            if (cmp !== 0)
                return sortAsc ? cmp : -cmp;
        }
        return 0;
    });
}
function mergeProductionQuantityListItems(employee, supplier, sorts) {
    var items = __spreadArray(__spreadArray([], employee.map(function (row) { return (__assign(__assign({}, row), { actorKind: "employee" })); }), true), supplier.map(function (row) { return (__assign(__assign({}, row), { actorKind: "supplier" })); }), true);
    return applySorts(items, sorts);
}
function mergeQuantityReports(employee, supplier) {
    var items = __spreadArray(__spreadArray([], employee.map(function (report) { return ({
        actorKind: "employee",
        id: report.id,
        createdAt: report.createdAt,
        report: report
    }); }), true), supplier.map(function (report) { return ({
        actorKind: "supplier",
        id: report.id,
        createdAt: report.createdAt,
        report: report
    }); }), true);
    return items.sort(function (a, b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); });
}
function mergePickups(employee, supplier) {
    var items = __spreadArray(__spreadArray([], employee.map(function (pickup) { return ({
        kind: "employee",
        id: pickup.id,
        createdAt: pickup.createdAt,
        pickup: pickup
    }); }), true), supplier.map(function (pickup) { return ({
        kind: "supplier",
        id: pickup.id,
        createdAt: pickup.createdAt,
        pickup: pickup
    }); }), true);
    return items.sort(function (a, b) { return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); });
}
