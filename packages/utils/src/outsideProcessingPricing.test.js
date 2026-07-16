"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var outsideProcessingPricing_1 = require("./outsideProcessingPricing");
(0, vitest_1.describe)("toPurchaseOrderItemLineType", function () {
    (0, vitest_1.it)("passes through valid item types", function () {
        (0, vitest_1.expect)((0, outsideProcessingPricing_1.toPurchaseOrderItemLineType)("Material")).toBe("Material");
        (0, vitest_1.expect)((0, outsideProcessingPricing_1.toPurchaseOrderItemLineType)("Style")).toBe("Style");
    });
    (0, vitest_1.it)("falls back to Part for unsupported item types", function () {
        (0, vitest_1.expect)((0, outsideProcessingPricing_1.toPurchaseOrderItemLineType)("Fixture")).toBe("Part");
        (0, vitest_1.expect)((0, outsideProcessingPricing_1.toPurchaseOrderItemLineType)("Service")).toBe("Part");
        (0, vitest_1.expect)((0, outsideProcessingPricing_1.toPurchaseOrderItemLineType)("Finished Good")).toBe("Part");
    });
});
(0, vitest_1.describe)("calculateOutsideProcessingPurchaseOrderLines", function () {
    (0, vitest_1.it)("returns a single unit-cost line when quantity exceeds minimum", function () {
        var lines = (0, outsideProcessingPricing_1.calculateOutsideProcessingPurchaseOrderLines)({
            quantity: 100,
            unitCost: 10,
            minimumCost: 1000
        });
        (0, vitest_1.expect)(lines).toEqual([
            {
                purchaseQuantity: 100,
                supplierUnitPrice: 10,
                isMinimumCostLine: false
            }
        ]);
    });
    (0, vitest_1.it)("adds a minimum cost line when unit total is below minimum", function () {
        var lines = (0, outsideProcessingPricing_1.calculateOutsideProcessingPurchaseOrderLines)({
            quantity: 100,
            unitCost: 1,
            minimumCost: 1000
        });
        (0, vitest_1.expect)(lines).toEqual([
            {
                purchaseQuantity: 100,
                supplierUnitPrice: 1,
                isMinimumCostLine: false
            },
            {
                purchaseQuantity: 1,
                supplierUnitPrice: 900,
                isMinimumCostLine: true,
                description: "Minimum cost"
            }
        ]);
    });
    (0, vitest_1.it)("uses quantity 1 when quantity is zero", function () {
        var _a, _b;
        var lines = (0, outsideProcessingPricing_1.calculateOutsideProcessingPurchaseOrderLines)({
            quantity: 0,
            unitCost: 1,
            minimumCost: 1000
        });
        (0, vitest_1.expect)(lines).toHaveLength(2);
        (0, vitest_1.expect)((_a = lines[0]) === null || _a === void 0 ? void 0 : _a.purchaseQuantity).toBe(1);
        (0, vitest_1.expect)((_b = lines[1]) === null || _b === void 0 ? void 0 : _b.supplierUnitPrice).toBe(999);
    });
});
