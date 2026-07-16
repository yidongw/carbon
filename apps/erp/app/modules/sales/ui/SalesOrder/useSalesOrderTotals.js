"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSalesOrderTotals = void 0;
var nanostores_1 = require("nanostores");
var hooks_1 = require("~/hooks");
var $totals = (0, nanostores_1.atom)({
    total: 0
});
var useSalesOrderTotals = function () { return (0, hooks_1.useNanoStore)($totals); };
exports.useSalesOrderTotals = useSalesOrderTotals;
