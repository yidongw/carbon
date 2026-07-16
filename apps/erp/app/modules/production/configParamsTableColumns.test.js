"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var configParamsTableColumns_1 = require("./configParamsTableColumns");
var parameters = [
    {
        key: "size",
        label: "Size",
        dataType: "list",
        listOptions: ["M", "L", "XL"]
    },
    {
        key: "color",
        label: "Color",
        dataType: "list",
        listOptions: ["红色", "蓝色"]
    }
];
(0, vitest_1.describe)("buildConfigTableEditorState", function () {
    var originalConfiguration = {
        configTable: [
            { color: "红色", size: "M", M: 14, L: 0, XL: 0 },
            { color: "蓝色", size: "XL", M: 0, L: 0, XL: 6 }
        ],
        configTablePrimaryKeys: ["M", "L", "XL"]
    };
    (0, vitest_1.it)("shows original reported quantities for Production mode", function () {
        var _a, _b;
        var _c = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: { configTable: [] },
            referenceContext: {
                mode: "original",
                originalConfiguration: originalConfiguration,
                otherLineConfigurations: []
            }
        }), rows = _c.rows, referenceByRowIndex = _c.referenceByRowIndex;
        (0, vitest_1.expect)(rows).toHaveLength(2);
        (0, vitest_1.expect)((_a = referenceByRowIndex[0]) === null || _a === void 0 ? void 0 : _a.M).toBe(14);
        (0, vitest_1.expect)((_b = referenceByRowIndex[1]) === null || _b === void 0 ? void 0 : _b.XL).toBe(6);
    });
    (0, vitest_1.it)("shows remaining quantities for Rework mode", function () {
        var _a;
        var referenceByRowIndex = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: { configTable: [] },
            referenceContext: {
                mode: "remaining",
                originalConfiguration: originalConfiguration,
                otherLineConfigurations: [
                    {
                        configTable: [{ color: "红色", size: "M", M: 10, L: 0, XL: 0 }]
                    }
                ]
            }
        }).referenceByRowIndex;
        (0, vitest_1.expect)((_a = referenceByRowIndex[0]) === null || _a === void 0 ? void 0 : _a.M).toBe(4);
    });
    (0, vitest_1.it)("can show negative remaining when over-allocated", function () {
        var _a;
        var referenceByRowIndex = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: { configTable: [] },
            referenceContext: {
                mode: "remaining",
                originalConfiguration: originalConfiguration,
                otherLineConfigurations: [
                    {
                        configTable: [{ color: "红色", size: "M", M: 16, L: 0, XL: 0 }]
                    }
                ]
            }
        }).referenceByRowIndex;
        (0, vitest_1.expect)((_a = referenceByRowIndex[0]) === null || _a === void 0 ? void 0 : _a.M).toBe(-2);
    });
    (0, vitest_1.it)("seeds current line values into original rows", function () {
        var _a;
        var rows = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: {
                configTable: [{ color: "红色", size: "M", M: 3, L: 0, XL: 0 }]
            },
            referenceContext: {
                mode: "remaining",
                originalConfiguration: originalConfiguration,
                otherLineConfigurations: [
                    {
                        configTable: [{ color: "红色", size: "M", M: 10, L: 0, XL: 0 }]
                    }
                ]
            }
        }).rows;
        (0, vitest_1.expect)((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.M).toBe(3);
    });
});
(0, vitest_1.describe)("buildJobRemainingReferenceContext", function () {
    var jobConfiguration = {
        configTable: [{ color: "红色", size: "M", M: 14, L: 0, XL: 0 }],
        configTablePrimaryKeys: ["M", "L", "XL"]
    };
    (0, vitest_1.it)("computes remaining quantities from job target minus reported", function () {
        var _a;
        var referenceContext = (0, configParamsTableColumns_1.buildJobRemainingReferenceContext)({
            jobConfiguration: jobConfiguration,
            reportedConfigurations: [
                {
                    configTable: [{ color: "红色", size: "M", M: 10, L: 0, XL: 0 }]
                }
            ]
        });
        var referenceByRowIndex = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: { configTable: [] },
            referenceContext: referenceContext
        }).referenceByRowIndex;
        (0, vitest_1.expect)((_a = referenceByRowIndex[0]) === null || _a === void 0 ? void 0 : _a.M).toBe(4);
    });
    (0, vitest_1.it)("uses pickup-based hints for an employee with pickups", function () {
        var _a, _b, _c;
        var referenceContext = (0, configParamsTableColumns_1.buildJobRemainingReferenceContext)({
            jobConfiguration: {
                configTable: [{ color: "红色", size: "M", M: 100, L: 100, XL: 0 }],
                configTablePrimaryKeys: ["M", "L", "XL"]
            },
            reportedConfigurations: [
                {
                    configTable: [{ color: "红色", size: "M", M: 50, L: 0, XL: 0 }]
                }
            ],
            pickupsByEmployee: {
                emp1: [
                    {
                        quantity: 1,
                        configuration: {
                            configTable: [{ color: "红色", size: "M", M: 0, L: 1, XL: 0 }]
                        }
                    }
                ]
            },
            reportedConfigurationsByEmployee: {
                emp1: [
                    {
                        configTable: [{ color: "红色", size: "M", M: 0, L: 0, XL: 0 }]
                    }
                ]
            }
        }, { employeeId: "emp1" });
        var referenceByRowIndex = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: { configTable: [] },
            referenceContext: referenceContext
        }).referenceByRowIndex;
        (0, vitest_1.expect)((_a = referenceByRowIndex[0]) === null || _a === void 0 ? void 0 : _a.M).toBe(0);
        (0, vitest_1.expect)((_b = referenceByRowIndex[0]) === null || _b === void 0 ? void 0 : _b.L).toBe(1);
        (0, vitest_1.expect)((_c = referenceByRowIndex[0]) === null || _c === void 0 ? void 0 : _c.XL).toBe(0);
    });
    (0, vitest_1.it)("reduces pickup hints by the employee's already reported quantity", function () {
        var _a;
        var referenceContext = (0, configParamsTableColumns_1.buildJobRemainingReferenceContext)({
            jobConfiguration: {
                configTable: [{ color: "红色", size: "M", M: 100, L: 100, XL: 0 }],
                configTablePrimaryKeys: ["M", "L", "XL"]
            },
            reportedConfigurations: [],
            pickupsByEmployee: {
                emp1: [
                    {
                        quantity: 2,
                        configuration: {
                            configTable: [{ color: "红色", size: "M", M: 0, L: 2, XL: 0 }]
                        }
                    }
                ]
            },
            reportedConfigurationsByEmployee: {
                emp1: [
                    {
                        configTable: [{ color: "红色", size: "M", M: 0, L: 1, XL: 0 }]
                    }
                ]
            }
        }, { employeeId: "emp1" });
        var referenceByRowIndex = (0, configParamsTableColumns_1.buildConfigTableEditorState)({
            parameters: parameters,
            defaultQuantityLabel: "Quantities",
            currentConfiguration: { configTable: [] },
            referenceContext: referenceContext
        }).referenceByRowIndex;
        (0, vitest_1.expect)((_a = referenceByRowIndex[0]) === null || _a === void 0 ? void 0 : _a.L).toBe(1);
    });
});
(0, vitest_1.describe)("buildProductionConfigTableReferenceContext", function () {
    (0, vitest_1.it)("defers pickup loading to the server when job and operation are known", function () {
        var context = (0, configParamsTableColumns_1.buildProductionConfigTableReferenceContext)({
            source: {
                jobConfiguration: { configTable: [] },
                reportedConfigurations: []
            },
            employeeId: "emp1",
            jobId: "job1",
            jobOperationId: "op1"
        });
        (0, vitest_1.expect)(context).toEqual({
            mode: "remaining",
            originalConfiguration: null,
            otherLineConfigurations: [],
            employeeId: "emp1",
            jobId: "job1",
            jobOperationId: "op1",
            siblingLineConfigurations: []
        });
    });
    (0, vitest_1.it)("defers pickup loading when only job operation is known", function () {
        var context = (0, configParamsTableColumns_1.buildProductionConfigTableReferenceContext)({
            source: {
                jobConfiguration: {
                    configTable: [{ color: "红色", size: "M", M: 100, L: 100, XL: 0 }]
                },
                reportedConfigurations: [],
                pickupsByEmployee: {
                    emp1: [{ quantity: 1, configuration: { configTable: [] } }]
                }
            },
            employeeId: "emp1",
            jobOperationId: "op1"
        });
        (0, vitest_1.expect)(context).toEqual({
            mode: "remaining",
            originalConfiguration: null,
            otherLineConfigurations: [],
            employeeId: "emp1",
            jobId: undefined,
            jobOperationId: "op1",
            siblingLineConfigurations: []
        });
    });
});
(0, vitest_1.describe)("fillValueFromReference", function () {
    (0, vitest_1.it)("clamps negative references to zero", function () {
        (0, vitest_1.expect)((0, configParamsTableColumns_1.fillValueFromReference)(-2)).toBe(0);
        (0, vitest_1.expect)((0, configParamsTableColumns_1.fillValueFromReference)(4)).toBe(4);
    });
});
