"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFilters = useFilters;
var hooks_1 = require("~/hooks");
function useFilters() {
    var _a = (0, hooks_1.useUrlParams)(), params = _a[0], setParams = _a[1];
    var urlFiltersParams = params.getAll("filter");
    var hasFilter = function (searchKey, searchValue) {
        return urlFiltersParams.some(function (filter) {
            var _a = filter.split(":"), key = _a[0], operator = _a[1], value = _a[2];
            if (key && operator && value) {
                switch (operator) {
                    case "eq":
                        return key === searchKey && value === searchValue;
                    case "in":
                    case "contains":
                        var values = value.split(",");
                        return key === searchKey && values.some(function (v) { return v === searchValue; });
                    default:
                        return false;
                }
            }
            return false;
        });
    };
    var hasFilterKey = function (searchKey) {
        return urlFiltersParams.some(function (filter) {
            var key = filter.split(":")[0];
            return key === searchKey;
        });
    };
    var getFilterKeyIndex = function (key) {
        return urlFiltersParams.findIndex(function (f) {
            var _a;
            var accessorKey = (_a = f.split(":")) === null || _a === void 0 ? void 0 : _a[0];
            return key === accessorKey;
        });
    };
    var addFilter = function (newKey, newValue, isArray) {
        if (isArray === void 0) { isArray = false; }
        if (hasFilterKey(newKey)) {
            var filterIndex_1 = getFilterKeyIndex(newKey);
            var filter = urlFiltersParams[filterIndex_1];
            var _a = filter.split(":"), key = _a[0], operator = _a[1], value = _a[2];
            var newFilter_1 = "";
            if (["in", "contains"].includes(operator)) {
                newFilter_1 = "".concat(filter, ",").concat(newValue);
            }
            else {
                newFilter_1 = "".concat(key, ":in:").concat(value, ",").concat(newValue);
            }
            setParams({
                filter: urlFiltersParams.map(function (f, index) {
                    return index === filterIndex_1 ? newFilter_1 : f;
                })
            });
        }
        else {
            if (isArray) {
                setParams({
                    filter: urlFiltersParams.concat("".concat(newKey, ":contains:").concat(newValue))
                });
            }
            else {
                setParams({
                    filter: urlFiltersParams.concat("".concat(newKey, ":eq:").concat(newValue))
                });
            }
        }
    };
    var removeFilter = function (oldKey, oldValue, isArray) {
        if (isArray === void 0) { isArray = false; }
        var filterIndex = getFilterKeyIndex(oldKey);
        var filter = urlFiltersParams[filterIndex];
        var _a = filter.split(":"), key = _a[0], operator = _a[1], value = _a[2];
        if (["in", "contains"].includes(operator)) {
            var values_1 = value.split(",").filter(function (v) { return v !== oldValue; });
            if (operator === "in" && values_1.length === 1) {
                setParams({
                    filter: urlFiltersParams.map(function (f, index) {
                        return index === filterIndex ? "".concat(key, ":eq:").concat(values_1[0]) : f;
                    })
                });
            }
            else if (values_1.length === 0) {
                setParams({
                    filter: urlFiltersParams.filter(function (_, index) { return index !== filterIndex; })
                });
            }
            else {
                setParams({
                    filter: urlFiltersParams.map(function (f, index) {
                        return index === filterIndex ? "".concat(key, ":").concat(operator, ":").concat(values_1.join(",")) : f;
                    })
                });
            }
        }
        else {
            setParams({
                filter: urlFiltersParams.filter(function (_, index) { return index !== filterIndex; })
            });
        }
    };
    var removeKey = function (key) {
        setParams({
            filter: urlFiltersParams.filter(function (f) {
                var filterKey = f.split(":")[0];
                return filterKey !== key;
            })
        });
    };
    var toggleFilter = function (key, value, isArray) {
        if (isArray === void 0) { isArray = false; }
        if (hasFilter(key, value)) {
            removeFilter(key, value, isArray);
        }
        else {
            addFilter(key, value, isArray);
        }
    };
    var clearFilters = function () {
        setParams({ filter: undefined });
    };
    var hasFilters = urlFiltersParams.filter(Boolean).length > 0;
    return {
        clearFilters: clearFilters,
        hasFilter: hasFilter,
        hasFilters: hasFilters,
        hasFilterKey: hasFilterKey,
        removeKey: removeKey,
        toggleFilter: toggleFilter,
        urlFiltersParams: urlFiltersParams
    };
}
