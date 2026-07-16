"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var invoicing_models_1 = require("./invoicing.models");
(0, vitest_1.describe)("purchaseInvoiceLineValidator", function () {
    (0, vitest_1.it)("accepts Style item lines with a location", function () {
        var result = invoicing_models_1.purchaseInvoiceLineValidator.safeParse({
            invoiceId: "pi_1",
            invoiceLineType: "Style",
            itemId: "item_1",
            locationId: "loc_1",
            quantity: 10,
            supplierShippingCost: 0,
            supplierTaxAmount: 0
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("requires a location for Style item lines", function () {
        var _a, _b;
        var result = invoicing_models_1.purchaseInvoiceLineValidator.safeParse({
            invoiceId: "pi_1",
            invoiceLineType: "Style",
            itemId: "item_1",
            quantity: 10,
            supplierShippingCost: 0,
            supplierTaxAmount: 0
        });
        (0, vitest_1.expect)(result.success).toBe(false);
        (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.path).toEqual(["locationId"]);
    });
});
(0, vitest_1.describe)("salesInvoiceLineValidator", function () {
    (0, vitest_1.it)("accepts Style item lines with method and location", function () {
        var result = invoicing_models_1.salesInvoiceLineValidator.safeParse({
            invoiceId: "si_1",
            invoiceLineType: "Style",
            itemId: "item_1",
            methodType: "Pull from Inventory",
            locationId: "loc_1",
            quantity: 10,
            unitOfMeasureCode: "EA",
            addOnCost: 0,
            nonTaxableAddOnCost: 0,
            shippingCost: 0,
            taxPercent: 0
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("requires an item for Style sales lines", function () {
        var _a, _b;
        var result = invoicing_models_1.salesInvoiceLineValidator.safeParse({
            invoiceId: "si_1",
            invoiceLineType: "Style",
            methodType: "Pull from Inventory",
            locationId: "loc_1",
            quantity: 10,
            unitOfMeasureCode: "EA",
            addOnCost: 0,
            nonTaxableAddOnCost: 0,
            shippingCost: 0,
            taxPercent: 0
        });
        (0, vitest_1.expect)(result.success).toBe(false);
        (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.path).toEqual(["itemId"]);
    });
});
