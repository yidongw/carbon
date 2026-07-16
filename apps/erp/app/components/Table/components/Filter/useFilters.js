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
exports.useFilters = useFilters;
var hooks_1 = require("~/hooks");
var query_1 = require("~/utils/query");
function useFilters() {
    var _a = (0, hooks_1.useUrlParams)(), params = _a[0], setParams = _a[1];
    var urlFiltersParams = params.getAll("filter");
    var hasFilter = function (searchKey, searchValue) {
        return urlFiltersParams.some(function (filter) {
            var parsed = (0, query_1.parseFilterParam)(filter);
            if (!parsed)
                return false;
            var key = parsed.column, operator = parsed.operator, value = parsed.value;
            switch (operator) {
                case "eq":
                    return key === searchKey && value === searchValue;
                case "in":
                case "contains": {
                    var values = value.split(",");
                    return key === searchKey && values.some(function (v) { return v === searchValue; });
                }
                default:
                    return false;
            }
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
    var getFilter = function (searchKey) {
        var filter = urlFiltersParams.find(function (param) {
            var parsed = (0, query_1.parseFilterParam)(param);
            return (parsed === null || parsed === void 0 ? void 0 : parsed.column) === searchKey;
        });
        if (!filter) {
            return [];
        }
        var parsed = (0, query_1.parseFilterParam)(filter);
        if (!(parsed === null || parsed === void 0 ? void 0 : parsed.value)) {
            return [];
        }
        if (["in", "contains"].includes(parsed.operator)) {
            return parsed.value.split(",");
        }
        return [parsed.value];
    };
    var addFilter = function (newKey, newValue, isArray) {
        if (isArray === void 0) { isArray = false; }
        if (hasFilterKey(newKey)) {
            var filterIndex_1 = getFilterKeyIndex(newKey);
            var filter = urlFiltersParams[filterIndex_1];
            var parsed = (0, query_1.parseFilterParam)(filter);
            if (!parsed)
                return;
            var key = parsed.column, operator = parsed.operator, value = parsed.value;
            var newFilter_1 = "";
            if (["in", "contains"].includes(operator)) {
                newFilter_1 = "".concat(key, ":").concat(operator, ":").concat(value, ",").concat(newValue);
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
        var parsed = (0, query_1.parseFilterParam)(filter);
        if (!parsed)
            return;
        var key = parsed.column, operator = parsed.operator, value = parsed.value;
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
                var newFilters = urlFiltersParams.filter(function (_, index) { return index !== filterIndex; });
                setParams(__assign({ filter: newFilters.length > 0 ? newFilters : undefined }, (newFilters.length === 0 ? { offset: 0 } : {})));
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
            var newFilters = urlFiltersParams.filter(function (_, index) { return index !== filterIndex; });
            setParams(__assign({ filter: newFilters.length > 0 ? newFilters : undefined }, (newFilters.length === 0 ? { offset: 0 } : {})));
        }
    };
    var removeKey = function (key) {
        var newFilters = urlFiltersParams.filter(function (f) {
            var filterKey = f.split(":")[0];
            return filterKey !== key;
        });
        setParams(__assign({ filter: newFilters.length > 0 ? newFilters : undefined }, (newFilters.length === 0 ? { offset: 0 } : {})));
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
        setParams({
            filter: undefined,
            offset: 0
        });
    };
    var hasFilters = urlFiltersParams.filter(Boolean).length > 0;
    return {
        clearFilters: clearFilters,
        getFilter: getFilter,
        hasFilter: hasFilter,
        hasFilters: hasFilters,
        hasFilterKey: hasFilterKey,
        removeKey: removeKey,
        toggleFilter: toggleFilter,
        urlFiltersParams: urlFiltersParams
    };
}
