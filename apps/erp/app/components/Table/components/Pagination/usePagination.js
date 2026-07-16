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
exports.usePagination = usePagination;
var auth_1 = require("@carbon/auth");
var react_dom_1 = require("react-dom");
var hooks_1 = require("~/hooks");
function usePagination(count, setRowSelections) {
    var _a = (0, hooks_1.useUrlParams)(), params = _a[0], setParams = _a[1];
    var pageSize = (0, auth_1.parseNumberFromUrlParam)(params, "limit", 100);
    var offset = (0, auth_1.parseNumberFromUrlParam)(params, "offset", 0);
    var pageIndex = Math.floor(offset / pageSize) + 1;
    var pageCount = Math.ceil(count / pageSize);
    var canPreviousPage = pageIndex > 1;
    var canNextPage = pageIndex < Math.ceil(count / pageSize);
    var gotoPage = function (page) {
        (0, react_dom_1.flushSync)(function () {
            setRowSelections({});
            setParams(__assign(__assign({}, Object.fromEntries(params)), { offset: (page - 1) * pageSize, limit: pageSize }));
        });
        window === null || window === void 0 ? void 0 : window.scrollTo({ top: 0, behavior: "smooth" });
    };
    var previousPage = function () {
        gotoPage(pageIndex - 1);
    };
    var nextPage = function () {
        gotoPage(pageIndex + 1);
    };
    var setPageSize = function (pageSize) {
        setParams({
            offset: 0,
            limit: pageSize
        });
    };
    return {
        count: count,
        offset: offset,
        pageIndex: pageIndex,
        pageCount: pageCount,
        pageSize: pageSize,
        canPreviousPage: canPreviousPage,
        canNextPage: canNextPage,
        gotoPage: gotoPage,
        nextPage: nextPage,
        previousPage: previousPage,
        setPageSize: setPageSize
    };
}
