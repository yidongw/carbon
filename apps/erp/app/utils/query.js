"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterOperatorLabels = void 0;
exports.parseFilterParam = parseFilterParam;
exports.getGenericQueryFilters = getGenericQueryFilters;
exports.getGenericFilter = getGenericFilter;
exports.setGenericQueryFilters = setGenericQueryFilters;
var auth_1 = require("@carbon/auth");
/** Parses `column:operator:value` where value may contain `:`. */
function parseFilterParam(filter) {
    var firstColon = filter.indexOf(":");
    if (firstColon === -1)
        return undefined;
    var secondColon = filter.indexOf(":", firstColon + 1);
    if (secondColon === -1)
        return undefined;
    var column = filter.slice(0, firstColon);
    var operator = filter.slice(firstColon + 1, secondColon);
    var value = filter.slice(secondColon + 1);
    if (!column || !operator || !value)
        return undefined;
    return { column: column, operator: operator, value: value };
}
function getGenericQueryFilters(params) {
    var limit = (0, auth_1.parseNumberFromUrlParam)(params, "limit", 100);
    var offset = (0, auth_1.parseNumberFromUrlParam)(params, "offset", 0);
    var sortParams = params.getAll("sort");
    var sorts = sortParams.length > 0
        ? sortParams
            .map(function (sort) {
            var _a = sort.split(":"), sortBy = _a[0], sortDirection = _a[1];
            if (!sortBy ||
                !sortDirection ||
                !["asc", "desc"].includes(sortDirection))
                return undefined;
            return { sortBy: sortBy, sortAsc: sortDirection === "asc" };
        })
            .filter(function (sort) { return sort !== undefined; })
        : [];
    var filterParams = params.getAll("filter");
    var filters = filterParams.length > 0
        ? filterParams
            .map(function (filter) { return parseFilterParam(filter); })
            .filter(function (filter) { return filter !== undefined; })
        : [];
    return { limit: limit, offset: offset, sorts: sorts, filters: filters };
}
function getGenericFilter(
// @ts-expect-error TS2707 - TODO: fix type
query, column, operator, value) {
    switch (operator) {
        case "eq":
            return query.eq(column, value);
        case "neq":
            return query.neq(column, value);
        case "gt":
            return query.gt(column, getSafeNumber(value));
        case "gte":
            return query.gte(column, getSafeNumber(value));
        case "lt":
            return query.lt(column, getSafeNumber(value));
        case "lte":
            return query.lte(column, getSafeNumber(value));
        case "contains":
            return query.overlaps(column, value.split(","));
        case "startsWith":
            return query.ilike(column, "".concat(value, "%"));
        case "in":
            return query.in(column, value.split(","));
        default:
            throw (0, auth_1.badRequest)("Invalid filter operator: ".concat(operator));
    }
}
function setGenericQueryFilters(
// @ts-expect-error TS2707 - TODO: fix type
query, args, defaultSorts
// @ts-expect-error TS2707 - TODO: fix type
) {
    var _a;
    (_a = args.filters) === null || _a === void 0 ? void 0 : _a.forEach(function (filter) {
        if (!filter.value)
            return;
        query = getGenericFilter(query, filter.column, filter.operator, filter.value);
    });
    if (args.sorts && args.sorts.length > 0) {
        args.sorts.forEach(function (sort) {
            if (sort.sortBy.includes(".")) {
                var _a = sort.sortBy.split("."), table = _a[0], column = _a[1];
                query = query.order("".concat(table, "(").concat(column, ")"), {
                    ascending: sort.sortAsc
                });
            }
            else {
                query = query.order(sort.sortBy, { ascending: sort.sortAsc });
            }
        });
    }
    else if (defaultSorts && (defaultSorts === null || defaultSorts === void 0 ? void 0 : defaultSorts.length) > 0) {
        defaultSorts.forEach(function (sort) {
            query = query.order(sort.column, {
                ascending: sort.ascending,
                foreignTable: sort.foreignTable
            });
        });
    }
    if (Number.isInteger(args.offset) && Number.isInteger(args.limit)) {
        query = query.range(args.offset, args.offset + args.limit - 1);
    }
    return query;
}
var getSafeNumber = function (value) {
    var number = Number(value);
    return Number.isNaN(number) ? value : number;
};
var filterOperators = {
    eq: "equals",
    neq: "not equals",
    gt: "greater than",
    gte: "greater than or equal to",
    lt: "less than",
    lte: "less than or equal to",
    contains: "contains",
    startsWith: "starts with"
};
exports.filterOperatorLabels = Object.entries(filterOperators).map(function (_a) {
    var key = _a[0], value = _a[1];
    return ({
        operator: key,
        label: value
    });
});
