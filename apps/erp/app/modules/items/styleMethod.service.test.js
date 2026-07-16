"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var styleMethod_service_1 = require("./styleMethod.service");
(0, vitest_1.describe)("isStyleCuttingOperation", function () {
    (0, vitest_1.it)("accepts cutting operations tagged by the style scaffold", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleCuttingOperation)({
            tags: [styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG, styleMethod_service_1.STYLE_SYSTEM_OPERATION_TAG],
            customFields: null
        })).toBe(true);
    });
    (0, vitest_1.it)("accepts legacy operations marked in custom fields", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleCuttingOperation)({
            tags: null,
            customFields: {
                styleStage: "cutting"
            }
        })).toBe(true);
    });
    (0, vitest_1.it)("rejects ordinary downstream operations", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleCuttingOperation)({
            tags: ["sewing"],
            customFields: {
                styleStage: "downstream"
            }
        })).toBe(false);
    });
});
(0, vitest_1.describe)("buildStyleCuttingMethodOperation", function () {
    (0, vitest_1.it)("builds a seeded cutting operation with style tags and metadata", function () {
        var operation = (0, styleMethod_service_1.buildStyleCuttingMethodOperation)({
            makeMethodId: "mm-1",
            processId: "proc-1",
            companyId: "co-1",
            createdBy: "user-1",
            order: 0
        });
        (0, vitest_1.expect)(operation).toEqual(vitest_1.expect.objectContaining({
            makeMethodId: "mm-1",
            processId: "proc-1",
            description: "Cutting",
            operationType: "Inside",
            order: 0,
            tags: vitest_1.expect.arrayContaining([
                styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG,
                styleMethod_service_1.STYLE_SYSTEM_OPERATION_TAG
            ]),
            customFields: vitest_1.expect.objectContaining({
                styleStage: "cutting",
                styleSystemOwned: true
            })
        }));
    });
});
(0, vitest_1.describe)("isStyleCuttingOperationFirst", function () {
    (0, vitest_1.it)("accepts methods where cutting is already the earliest operation", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleCuttingOperationFirst)([
            {
                id: "op-cut",
                order: 5,
                tags: [styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG],
                customFields: null
            },
            {
                id: "op-sew",
                order: 10,
                tags: ["sewing"],
                customFields: null
            }
        ])).toBe(true);
    });
    (0, vitest_1.it)("rejects methods where a downstream operation moves ahead of cutting", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleCuttingOperationFirst)([
            {
                id: "op-cut",
                order: 10,
                tags: [styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG],
                customFields: null
            },
            {
                id: "op-sew",
                order: 5,
                tags: ["sewing"],
                customFields: null
            }
        ])).toBe(false);
    });
});
(0, vitest_1.describe)("isStyleSystemOwnedOperation", function () {
    (0, vitest_1.it)("identifies protected scaffold operations", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleSystemOwnedOperation)({
            tags: [styleMethod_service_1.STYLE_SYSTEM_OPERATION_TAG],
            customFields: null
        })).toBe(true);
    });
    (0, vitest_1.it)("rejects editable downstream operations", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.isStyleSystemOwnedOperation)({
            tags: ["sewing"],
            customFields: {
                styleSystemOwned: false
            }
        })).toBe(false);
    });
});
(0, vitest_1.describe)("getBundleJobCuttingOperationIdsToDelete", function () {
    (0, vitest_1.it)("removes tagged cutting operations before downstream work starts", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.getBundleJobCuttingOperationIdsToDelete)({
            operations: [
                {
                    id: "op-cut",
                    processId: "proc-cut",
                    order: 0,
                    tags: [styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG],
                    customFields: null
                },
                {
                    id: "op-sew",
                    processId: "proc-sew",
                    order: 1,
                    tags: [],
                    customFields: null
                }
            ]
        })).toEqual(["op-cut"]);
    });
    (0, vitest_1.it)("falls back to the parent cutting process when the copied job lost tags", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.getBundleJobCuttingOperationIdsToDelete)({
            cuttingProcessId: "proc-cut",
            operations: [
                {
                    id: "op-cut",
                    processId: "proc-cut",
                    order: 5,
                    tags: [],
                    customFields: null
                },
                {
                    id: "op-sew",
                    processId: "proc-sew",
                    order: 10,
                    tags: [],
                    customFields: null
                }
            ]
        })).toEqual(["op-cut"]);
    });
    (0, vitest_1.it)("falls back to the first copied operation when no other boundary marker exists", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.getBundleJobCuttingOperationIdsToDelete)({
            operations: [
                {
                    id: "op-first",
                    processId: "proc-1",
                    order: 1,
                    tags: [],
                    customFields: null
                },
                {
                    id: "op-second",
                    processId: "proc-2",
                    order: 2,
                    tags: [],
                    customFields: null
                }
            ]
        })).toEqual(["op-first"]);
    });
});
(0, vitest_1.describe)("getParentJobNonCuttingOperationIdsToDelete", function () {
    (0, vitest_1.it)("removes every non-cutting operation when a tagged cutting step exists", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.getParentJobNonCuttingOperationIdsToDelete)({
            operations: [
                {
                    id: "op-cut",
                    order: 0,
                    tags: [styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG],
                    customFields: null
                },
                {
                    id: "op-sew",
                    order: 1,
                    tags: [],
                    customFields: null
                },
                {
                    id: "op-pack",
                    order: 2,
                    tags: [],
                    customFields: null
                }
            ]
        })).toEqual(["op-sew", "op-pack"]);
    });
    (0, vitest_1.it)("keeps the first operation when no cutting marker exists", function () {
        (0, vitest_1.expect)((0, styleMethod_service_1.getParentJobNonCuttingOperationIdsToDelete)({
            operations: [
                {
                    id: "op-first",
                    order: 0,
                    tags: [],
                    customFields: null
                },
                {
                    id: "op-second",
                    order: 1,
                    tags: [],
                    customFields: null
                },
                {
                    id: "op-third",
                    order: 2,
                    tags: [],
                    customFields: null
                }
            ]
        })).toEqual(["op-second", "op-third"]);
    });
});
(0, vitest_1.describe)("style process tags", function () {
    (0, vitest_1.it)("keeps a distinct process-level tag for the seeded cutting process", function () {
        (0, vitest_1.expect)(styleMethod_service_1.STYLE_CUTTING_PROCESS_TAG).toBe("style:cutting-process");
    });
});
