"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomers = void 0;
var nanostores_1 = require("nanostores");
var hooks_1 = require("~/hooks");
var $customersStore = (0, nanostores_1.atom)([]);
var useCustomers = function () { return (0, hooks_1.useNanoStore)($customersStore, "customers"); };
exports.useCustomers = useCustomers;
