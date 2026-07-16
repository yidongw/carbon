"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var purchasing_models_1 = require("./purchasing.models");
(0, vitest_1.describe)("purchaseOrderLineValidator", function () {
    (0, vitest_1.it)("accepts Style purchase order lines", function () {
        var result = purchasing_models_1.purchaseOrderLineValidator.safeParse({
            purchaseOrderId: "po_1",
            purchaseOrderLineType: "Style",
            itemId: "item_1",
            purchaseQuantity: 10
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("requires an item for Style purchase order lines", function () {
        var _a, _b;
        var result = purchasing_models_1.purchaseOrderLineValidator.safeParse({
            purchaseOrderId: "po_1",
            purchaseOrderLineType: "Style",
            purchaseQuantity: 10
        });
        (0, vitest_1.expect)(result.success).toBe(false);
        (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.path).toEqual(["itemId"]);
    });
});
