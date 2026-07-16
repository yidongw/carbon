"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var productionQuantityReport_service_1 = require("./productionQuantityReport.service");
(0, vitest_1.describe)("validateProductionQuantityLines", function () {
    (0, vitest_1.it)("accepts lines without configuration", function () {
        var result = (0, productionQuantityReport_service_1.validateProductionQuantityLines)([
            { type: "Production", quantity: 10 }
        ]);
        (0, vitest_1.expect)(result.error).toBeNull();
    });
    (0, vitest_1.it)("rejects when configuration total does not match quantity", function () {
        var result = (0, productionQuantityReport_service_1.validateProductionQuantityLines)([
            {
                type: "Production",
                quantity: 10,
                configuration: {
                    configTable: [{ Quantities: 5 }],
                    configTablePrimaryKeys: ["Quantities"]
                }
            }
        ]);
        (0, vitest_1.expect)(result.error).toBeInstanceOf(Error);
    });
    (0, vitest_1.it)("accepts multiple lines when each line configuration matches its quantity", function () {
        var result = (0, productionQuantityReport_service_1.validateProductionQuantityLines)([
            {
                type: "Production",
                quantity: 13,
                configuration: {
                    configTable: [{ Quantities: 13 }],
                    configTablePrimaryKeys: ["Quantities"]
                }
            },
            {
                type: "Rework",
                quantity: 1
            }
        ]);
        (0, vitest_1.expect)(result.error).toBeNull();
    });
    (0, vitest_1.it)("rejects duplicate line types", function () {
        var result = (0, productionQuantityReport_service_1.validateProductionQuantityLines)([
            { type: "Production", quantity: 5 },
            { type: "Production", quantity: 3 }
        ]);
        (0, vitest_1.expect)(result.error).toBeInstanceOf(Error);
    });
    (0, vitest_1.it)("rejects zero quantity lines", function () {
        var result = (0, productionQuantityReport_service_1.validateProductionQuantityLines)([
            { type: "Production", quantity: 5 },
            { type: "Rework", quantity: 0 }
        ]);
        (0, vitest_1.expect)(result.error).toBeInstanceOf(Error);
    });
    (0, vitest_1.it)("clears scrap reason for non-scrap lines", function () {
        var result = (0, productionQuantityReport_service_1.validateProductionQuantityLines)([
            {
                type: "Production",
                quantity: 5,
                scrapReasonId: "should-clear"
            }
        ]);
        (0, vitest_1.expect)(result.error).toBeNull();
    });
});
