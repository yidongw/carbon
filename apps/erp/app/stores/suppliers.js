"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSuppliers = void 0;
var nanostores_1 = require("nanostores");
var hooks_1 = require("~/hooks");
var $suppliersStore = (0, nanostores_1.atom)([]);
var useSuppliers = function () { return (0, hooks_1.useNanoStore)($suppliersStore, "suppliers"); };
exports.useSuppliers = useSuppliers;
