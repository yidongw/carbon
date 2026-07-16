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
exports.useSort = useSort;
var hooks_1 = require("~/hooks");
function useSort() {
    var _a = (0, hooks_1.useUrlParams)(), params = _a[0], setParams = _a[1];
    var sorts = params.getAll("sort");
    var isSorted = function (columnId) {
        if (sorts.includes("".concat(columnId, ":asc")))
            return 1;
        if (sorts.includes("".concat(columnId, ":desc")))
            return -1;
        return null;
    };
    var reorderSorts = function (newOrder) {
        setParams({ sort: newOrder });
    };
    var removeSortBy = function (sort) {
        setParams({ sort: sorts.filter(function (s) { return s !== sort; }) });
    };
    var toggleSortByAscending = function (columnId) {
        var existingSort = __spreadArray([], sorts, true);
        var sortAsc = "".concat(columnId, ":asc");
        var sortDesc = "".concat(columnId, ":desc");
        if (!existingSort.includes(sortAsc)) {
            setParams({
                sort: __spreadArray([sortAsc], existingSort.filter(function (s) { return s !== sortDesc; }), true)
            });
        }
        else {
            setParams({
                sort: existingSort.filter(function (s) { return s !== sortAsc; })
            });
        }
    };
    var toggleSortByDescending = function (columnId) {
        var existingSort = __spreadArray([], sorts, true);
        var sortAsc = "".concat(columnId, ":asc");
        var sortDesc = "".concat(columnId, ":desc");
        if (!existingSort.includes(sortDesc)) {
            setParams({
                sort: __spreadArray([sortDesc], existingSort.filter(function (s) { return s !== sortAsc; }), true)
            });
        }
        else {
            setParams({
                sort: existingSort.filter(function (s) { return s !== sortDesc; })
            });
        }
    };
    var toggleSortBy = function (columnId) {
        var existingSort = __spreadArray([], sorts, true);
        var sortAsc = "".concat(columnId, ":asc");
        var sortDesc = "".concat(columnId, ":desc");
        if (existingSort.includes(sortAsc)) {
            setParams({
                sort: existingSort.filter(function (s) { return s !== sortAsc; }).concat(sortDesc)
            });
        }
        else if (existingSort.includes(sortDesc)) {
            setParams({ sort: existingSort.filter(function (s) { return s !== sortDesc; }) });
        }
        else {
            setParams({ sort: existingSort.concat(sortAsc) });
        }
    };
    var toggleSortByDirection = function (columnId) {
        var existingSort = __spreadArray([], sorts, true);
        var sortAsc = "".concat(columnId, ":asc");
        var sortDesc = "".concat(columnId, ":desc");
        if (existingSort.includes(sortAsc)) {
            setParams({
                sort: existingSort.map(function (s) { return (s === sortAsc ? sortDesc : s); })
            });
        }
        else if (existingSort.includes(sortDesc)) {
            setParams({
                sort: existingSort.map(function (s) { return (s === sortDesc ? sortAsc : s); })
            });
        }
    };
    return {
        sorts: sorts,
        isSorted: isSorted,
        reorderSorts: reorderSorts,
        removeSortBy: removeSortBy,
        toggleSortBy: toggleSortBy,
        toggleSortByAscending: toggleSortByAscending,
        toggleSortByDirection: toggleSortByDirection,
        toggleSortByDescending: toggleSortByDescending
    };
}
