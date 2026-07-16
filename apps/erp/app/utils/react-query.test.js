"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var react_query_1 = require("./react-query");
(0, vitest_1.describe)("getCompanyId", function () {
    (0, vitest_1.it)("returns null when called during server rendering", function () {
        (0, vitest_1.expect)(function () { return (0, react_query_1.getCompanyId)(); }).not.toThrow();
        (0, vitest_1.expect)((0, react_query_1.getCompanyId)()).toBeNull();
    });
    (0, vitest_1.it)("does not read the client cache during server rendering", function () {
        (0, vitest_1.expect)(function () { return (0, react_query_1.getClientCache)(); }).not.toThrow();
        (0, vitest_1.expect)((0, react_query_1.getClientCache)()).toBeUndefined();
    });
});
