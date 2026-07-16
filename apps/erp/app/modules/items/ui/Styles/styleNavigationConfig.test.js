"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var styleNavigationConfig_1 = require("./styleNavigationConfig");
(0, vitest_1.describe)("getStyleNavigationKeys", function () {
    (0, vitest_1.it)("mirrors the shared part tabs for inventory-managed styles", function () {
        (0, vitest_1.expect)((0, styleNavigationConfig_1.getStyleNavigationKeys)({
            itemTrackingType: "Serial"
        })).toEqual(["details", "accounting", "planning", "inventory", "sales"]);
    });
    (0, vitest_1.it)("hides planning and inventory for non-inventory styles", function () {
        (0, vitest_1.expect)((0, styleNavigationConfig_1.getStyleNavigationKeys)({
            itemTrackingType: "Non-Inventory"
        })).toEqual(["details", "accounting", "sales"]);
    });
});
