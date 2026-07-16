"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolValidator = exports.supplierPartValidator = exports.serviceValidator = exports.revisionValidator = exports.pickMethodWithShelfLifeValidator = exports.pickMethodValidator = exports.pickMethodSortMethods = exports.partValidator = exports.styleColorValidator = exports.materialTypeValidator = exports.materialSubstanceValidator = exports.materialGradeValidator = exports.materialFormValidator = exports.materialFinishValidator = exports.materialDimensionValidator = exports.itemUnitSalePriceValidator = exports.itemPurchasingValidator = exports.itemPlanningValidator = exports.itemPostingGroupValidator = exports.itemManufacturingValidator = exports.itemCostValidator = exports.methodOperationValidator = exports.methodMaterialValidator = exports.materialValidatorWithGeneratedIds = exports.materialValidator = exports.makeMethodVersionValidator = exports.getMethodValidator = exports.customerPartValidator = exports.consumableValidator = exports.configurationRuleValidator = exports.configurationParameterValidator = exports.templateConfigurationParameterValidator = exports.templateCreateValidator = exports.configurationParameterOrderValidator = exports.configurationParameterGroupOrderValidator = exports.configurationParameterGroupValidator = exports.applyStorageAndShelfLifeRefines = exports.itemValidator = exports.supplierPartPriceSourceTypes = exports.serviceType = exports.partManufacturingPolicies = exports.shelfLifeTriggerTimings = exports.shelfLifeModes = exports.itemReplenishmentSystems = exports.itemReorderingPolicies = exports.itemCostingMethods = exports.ItemTrackingType = exports.itemTrackingTypes = exports.configurationParameterDataTypes = exports.batchPropertyDataTypes = void 0;
exports.unitOfMeasureValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var zodFields_1 = require("~/utils/zodFields");
var operationType_1 = require("../production/operationType");
var shared_1 = require("../shared");
exports.batchPropertyDataTypes = [
    "text",
    "numeric",
    "boolean",
    "list",
    "date"
];
exports.configurationParameterDataTypes = [
    "text",
    "numeric",
    "boolean",
    "list",
    "material"
];
exports.itemTrackingTypes = [
    "Inventory",
    "Non-Inventory",
    "Serial",
    "Batch"
];
exports.ItemTrackingType = {
    Inventory: "Inventory",
    NonInventory: "Non-Inventory",
    Serial: "Serial",
    Batch: "Batch"
};
exports.itemCostingMethods = [
    "Standard",
    "Average",
    "FIFO",
    "LIFO"
];
exports.itemReorderingPolicies = [
    "Manual Reorder",
    "Demand-Based Reorder",
    "Fixed Reorder Quantity",
    "Maximum Quantity"
];
exports.itemReplenishmentSystems = [
    "Buy",
    "Make",
    "Buy and Make"
];
exports.shelfLifeModes = [
    "NotManaged",
    "Fixed Duration",
    "Calculated",
    "Set on Receipt"
];
exports.shelfLifeTriggerTimings = ["Before", "After"];
exports.partManufacturingPolicies = [
    "Make to Stock",
    "Make to Order"
];
exports.serviceType = ["Internal", "External"];
exports.supplierPartPriceSourceTypes = [
    "Quote",
    "Purchase Order",
    "Manual Entry"
];
exports.itemValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Item ID is required" }).max(255),
    readableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z
        .string()
        .min(1, { message: "Short description is required" })
        .max(255),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    replenishmentSystem: zod_1.z.enum(exports.itemReplenishmentSystems, {
        errorMap: function (issue, ctx) { return ({
            message: "Replenishment system is required"
        }); }
    }),
    defaultMethodType: zod_1.z.enum(shared_1.methodType, {
        errorMap: function (issue, ctx) { return ({
            message: "Default method is required"
        }); }
    }),
    itemTrackingType: zod_1.z.enum(exports.itemTrackingTypes, {
        errorMap: function (issue, ctx) { return ({
            message: "Part type is required"
        }); }
    }),
    postingGroupId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of Measure is required" }),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().nonnegative().optional()),
    // Default storage unit (form-only; persisted to pickMethod via
    // upsertItemDefaultPickMethod). Can point at any level of the
    // storageUnit hierarchy since storageUnit nests via parentId. The
    // locationId is derived server-side from storageUnit.locationId -
    // the form itself does not capture a location.
    defaultStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // Shelf life. The UI Select only surfaces "Fixed Duration" / "Calculated";
    // clearing it (X button) submits an empty string, which we preprocess to
    // the sentinel "NotManaged" so the server deletes any existing
    // itemShelfLife row. Truly absent fields (non-form callers like MCP that
    // don't set shelfLifeMode at all) remain undefined, which the upsert
    // helper treats as a no-op.
    shelfLifeMode: zod_1.z.preprocess(function (v) { return (v === "" ? "NotManaged" : v); }, zod_1.z.enum(exports.shelfLifeModes).optional()),
    shelfLifeDays: zod_form_data_1.zfd.numeric(zod_1.z.number().positive().optional()),
    shelfLifeTriggerProcessId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // Whether the clock starts when the trigger process begins ('Before') or
    // completes ('After'). Only meaningful with Fixed Duration + a trigger
    // process; ignored otherwise. Defaults to 'After' to preserve legacy
    // behavior on items that pre-date this column.
    shelfLifeTriggerTiming: zod_1.z.enum(exports.shelfLifeTriggerTimings).optional(),
    // Fixed Duration + Make items only: when true, the produced expiry is
    // capped by the earliest input expiry — the output cannot outlast its
    // raw materials. Falls back to today + days when no input has a date.
    // Mirrors the inventory-settings "Calculate from BOM" copy.
    shelfLifeCalculateFromBom: zod_form_data_1.zfd.checkbox(),
    requiresInspection: zod_form_data_1.zfd.checkbox().optional()
});
// Common storage / shelf-life refines. Shared across all item-type
// validators. Default Storage Unit is optional for every type - users can
// set it later via the pickMethod UI once they know where the item lives.
var applyStorageAndShelfLifeRefines = function (schema) {
    var refined = schema
        .refine(function (data) {
        return data.shelfLifeDays === undefined ||
            data.shelfLifeMode === "Fixed Duration";
    }, {
        message: "Shelf-life days can only be set when shelf-life management is Fixed Duration",
        path: ["shelfLifeDays"]
    })
        .refine(function (data) {
        return data.shelfLifeMode !== "Fixed Duration" ||
            data.shelfLifeDays !== undefined;
    }, {
        message: "Shelf-life days is required when shelf-life management is Fixed Duration",
        path: ["shelfLifeDays"]
    })
        .refine(function (data) {
        return !data.shelfLifeTriggerProcessId ||
            data.shelfLifeMode === "Fixed Duration";
    }, {
        message: "Trigger process can only be set when shelf-life management is Fixed Duration",
        path: ["shelfLifeTriggerProcessId"]
    })
        .refine(function (data) {
        return !data.shelfLifeMode ||
            data.shelfLifeMode === "NotManaged" ||
            data.itemTrackingType === "Serial" ||
            data.itemTrackingType === "Batch";
    }, {
        message: "Shelf-life can only be managed on items tracked by Serial or Batch - there's no per-unit record to set the expiry on otherwise",
        path: ["shelfLifeMode"]
    })
        .refine(function (data) {
        return data.shelfLifeMode !== "Calculated" ||
            data.replenishmentSystem !== "Buy";
    }, {
        message: "Component minimum shelf-life requires a BoM - only Make or Buy and Make items qualify",
        path: ["shelfLifeMode"]
    })
        .refine(function (data) {
        return data.shelfLifeMode !== "Set on Receipt" ||
            data.replenishmentSystem !== "Make";
    }, {
        message: "Set on receipt applies at goods-in - only Buy or Buy and Make items qualify",
        path: ["shelfLifeMode"]
    })
        .refine(function (data) {
        return !data.shelfLifeCalculateFromBom ||
            data.shelfLifeMode === "Fixed Duration";
    }, {
        message: "Calculate from BOM only applies to Fixed Duration shelf life",
        path: ["shelfLifeCalculateFromBom"]
    })
        .refine(function (data) {
        return !data.shelfLifeCalculateFromBom || data.replenishmentSystem !== "Buy";
    }, {
        message: "Calculate from BOM requires a BoM - only Make or Buy and Make items qualify",
        path: ["shelfLifeCalculateFromBom"]
    });
    return refined;
};
exports.applyStorageAndShelfLifeRefines = applyStorageAndShelfLifeRefines;
exports.configurationParameterGroupValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.configurationParameterGroupOrderValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "ID is required" }),
    sortOrder: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
exports.configurationParameterOrderValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "ID is required" }),
    sortOrder: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    configurationParameterGroupId: zod_form_data_1.zfd.text(zod_1.z.string().nullable())
});
exports.templateCreateValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.templateConfigurationParameterValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    templateId: zod_1.z.string().min(1, { message: "Template ID is required" }),
    key: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    label: zod_1.z.string().min(1, { message: "Label is required" }),
    dataType: zod_1.z.enum(__spreadArray(__spreadArray([], exports.configurationParameterDataTypes, true), ["date"], false)),
    listOptions: zodFields_1.optionalRequiredStringArray,
    configurationParameterGroupId: zod_1.z.string().optional(),
    materialFormFilterId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.dataType === "list") {
        return !!data.listOptions;
    }
    return true;
}, { message: "List options are required", path: ["listOptions"] })
    .refine(function (data) {
    var _a;
    return !!((_a = data.key) === null || _a === void 0 ? void 0 : _a.match(/^[\p{L}\p{N}]+(_[\p{L}\p{N}]+)*$/u));
}, {
    message: "Key must use letters or numbers, with underscores only between words"
});
exports.configurationParameterValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    key: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    label: zod_1.z.string().min(1, { message: "Label is required" }),
    dataType: zod_1.z.enum(__spreadArray(__spreadArray([], exports.configurationParameterDataTypes, true), ["date"], false)),
    listOptions: zodFields_1.optionalRequiredStringArray,
    configurationParameterGroupId: zod_1.z.string().optional(),
    materialFormFilterId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.dataType === "list") {
        return !!data.listOptions;
    }
    return true;
}, { message: "List options are required", path: ["listOptions"] })
    .refine(function (data) {
    var _a;
    return !!((_a = data.key) === null || _a === void 0 ? void 0 : _a.match(/^[\p{L}\p{N}]+(_[\p{L}\p{N}]+)*$/u));
}, {
    message: "Key must use letters or numbers, with underscores only between words"
});
exports.configurationRuleValidator = zod_1.z.object({
    field: zod_1.z.string().min(1, { message: "Field is required" }),
    code: zod_1.z.string().min(1, { message: "Code is required" })
});
exports.consumableValidator = (0, exports.applyStorageAndShelfLifeRefines)(exports.itemValidator.merge(zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Consumable ID is required" }).max(255),
    thumbnailPath: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of Measure is required" })
})));
exports.customerPartValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    customerPartId: zod_1.z.string(),
    customerPartRevision: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.getMethodValidator = zod_1.z.object({
    targetId: zod_1.z.string().min(1, { message: "Please select a target method" }),
    sourceId: zod_1.z.string().min(1, { message: "Please select a source method" }),
    billOfMaterial: zod_form_data_1.zfd.checkbox(),
    billOfProcess: zod_form_data_1.zfd.checkbox(),
    parameters: zod_form_data_1.zfd.checkbox(),
    tools: zod_form_data_1.zfd.checkbox(),
    steps: zod_form_data_1.zfd.checkbox(),
    workInstructions: zod_form_data_1.zfd.checkbox()
});
exports.makeMethodVersionValidator = zod_1.z.object({
    copyFromId: zod_1.z.string().min(1, { message: "Please select a source method" }),
    activeVersionId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    version: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Please enter a version" }))
});
exports.materialValidator = (0, exports.applyStorageAndShelfLifeRefines)(exports.itemValidator.merge(zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Material ID is required" }).max(255),
    thumbnailPath: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    materialSubstanceId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    materialFormId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    materialTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    finishId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    gradeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dimensionId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sizes: zod_1.z.array(zod_1.z.string()).optional()
})));
exports.materialValidatorWithGeneratedIds = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "" }),
    materialSubstanceId: zod_1.z.string().min(1, { message: "Substance is required" }),
    materialFormId: zod_1.z.string().min(1, { message: "Shape is required" }),
    materialTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    finishId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    gradeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dimensionId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sizes: zod_1.z.array(zod_1.z.string()).optional()
});
exports.methodMaterialValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Material ID is required" }),
    makeMethodId: zod_1.z.string().min(1, { message: "Make method is required" }),
    order: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    itemType: zod_1.z.enum(shared_1.methodItemType, {
        errorMap: function (issue, ctx) { return ({
            message: "Item type is required"
        }); }
    }),
    kit: zod_form_data_1.zfd.text(zod_1.z.string().optional()).transform(function (value) { return value === "true"; }),
    methodType: zod_1.z.enum(shared_1.methodType, {
        errorMap: function (issue, ctx) { return ({
            message: "Method type is required"
        }); }
    }),
    sourcingType: zod_1.z.enum(shared_1.sourcingType, {
        errorMap: function (issue, ctx) { return ({
            message: "Sourcing type is required"
        }); }
    }),
    itemId: zod_1.z.string().optional(),
    methodOperationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // description: z.string().min(1, { message: "Description is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of Measure is required" }),
    storageUnitIds: zod_1.z.string().transform(function (val) {
        try {
            return JSON.parse(val);
        }
        catch (_a) {
            return {};
        }
    })
});
exports.methodOperationValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1, { message: "Operation ID is required" }),
    makeMethodId: zod_1.z.string().min(0, { message: "Make method is required" }),
    order: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    operationOrder: zod_1.z.enum(shared_1.methodOperationOrders, {
        errorMap: function (issue, ctx) { return ({
            message: "Operation order is required"
        }); }
    }),
    operationType: zod_1.z.enum(shared_1.operationTypes, {
        errorMap: function (issue, ctx) { return ({
            message: "Operation type is required"
        }); }
    }),
    processId: zod_1.z.string().min(1, { message: "Process is required" }),
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    procedureId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().min(0, { message: "Description is required" })),
    setupUnit: zod_1.z
        .enum(shared_1.standardFactorType, {
        errorMap: function () { return ({ message: "Setup unit is required" }); }
    })
        .optional(),
    setupTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    laborUnit: zod_1.z
        .enum(shared_1.standardFactorType, {
        errorMap: function () { return ({ message: "Labor unit is required" }); }
    })
        .optional(),
    laborTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    machineUnit: zod_1.z
        .enum(shared_1.standardFactorType, {
        errorMap: function () { return ({ message: "Machine unit is required" }); }
    })
        .optional(),
    machineTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationSupplierProcessId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    operationMinimumCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationUnitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationLeadTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    insideUnitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return !!data.setupUnit;
    }
    return true;
}, {
    message: "Setup unit is required",
    path: ["setupUnit"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return !!data.laborUnit;
    }
    return true;
}, {
    message: "Labor unit is required",
    path: ["laborUnit"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return !!data.laborUnit;
    }
    return true;
}, {
    message: "Machine unit is required",
    path: ["machineUnit"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.setupTime);
    }
    return true;
}, {
    message: "Setup time is required",
    path: ["setupTime"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.laborTime);
    }
    return true;
}, {
    message: "Labor time is required",
    path: ["laborTime"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.machineTime);
    }
    return true;
}, {
    message: "Machine time is required",
    path: ["machineTime"]
});
exports.itemCostValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    itemPostingGroupId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    costingMethod: zod_1.z.enum(exports.itemCostingMethods, {
        errorMap: function () { return ({
            message: "Costing method is required"
        }); }
    }),
    // standardCost: zfd.numeric(z.number().min(0)),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
    // costIsAdjusted: zfd.checkbox(),
});
exports.itemManufacturingValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    // manufacturingBlocked: zfd.checkbox(),
    requiresConfiguration: zod_form_data_1.zfd.checkbox().optional(),
    lotSize: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    scrapPercentage: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    leadTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
exports.itemPostingGroupValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255),
    description: zod_1.z.string().optional()
});
exports.itemPlanningValidator = zod_1.z
    .object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    reorderingPolicy: zod_1.z.enum(exports.itemReorderingPolicies, {
        errorMap: function (issue, ctx) { return ({
            message: "Reordering policy is required"
        }); }
    }),
    demandAccumulationPeriod: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1).optional()),
    demandAccumulationSafetyStock: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    reorderPoint: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()).optional(),
    reorderQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)).optional(),
    maximumInventoryQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)).optional(),
    minimumOrderQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)).optional(),
    maximumOrderQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)).optional(),
    orderMultiple: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)).optional()
    // critical: zfd.checkbox(),
})
    .refine(function (data) {
    if (data.reorderingPolicy === "Maximum Quantity") {
        return (data.maximumInventoryQuantity &&
            data.reorderPoint &&
            data.maximumInventoryQuantity > data.reorderPoint);
    }
    return true;
}, {
    message: "Maximum inventory quantity must be greater than reorder point",
    path: ["maximumInventoryQuantity"]
})
    .refine(function (data) {
    if (data.reorderingPolicy === "Fixed Reorder Quantity") {
        return data.reorderQuantity && data.reorderQuantity > 0;
    }
    return true;
}, {
    message: "Reorder quantity must be greater than 0",
    path: ["reorderQuantity"]
});
exports.itemPurchasingValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    preferredSupplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    leadTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    purchasingUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    // purchasingBlocked: zfd.checkbox(),
});
exports.itemUnitSalePriceValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    unitSalePrice: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
    // currencyCode: z.string().min(1, { message: "Currency is required" }),
    // salesUnitOfMeasureCode: z
    //   .string()
    //   .min(1, { message: "Unit of Measure is required" }),
    // salesBlocked: zfd.checkbox(),
    // priceIncludesTax: zfd.checkbox(),
    // allowInvoiceDiscount: zfd.checkbox(),
});
exports.materialDimensionValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255),
    materialFormId: zod_1.z.string().min(1, { message: "Shape is required" })
});
exports.materialFinishValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    materialSubstanceId: zod_1.z.string().min(1, { message: "Substance is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255)
});
exports.materialFormValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255),
    code: zod_1.z.string().min(1, { message: "Code is required" }).max(10)
});
exports.materialGradeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    materialSubstanceId: zod_1.z.string().min(1, { message: "Substance is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255)
});
exports.materialSubstanceValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255),
    code: zod_1.z.string().min(1, { message: "Code is required" }).max(10)
});
exports.materialTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    materialSubstanceId: zod_1.z.string().min(1, { message: "Substance is required" }),
    materialFormId: zod_1.z.string().min(1, { message: "Shape is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255),
    code: zod_1.z.string().min(1, { message: "Code is required" }).max(10)
});
exports.styleColorValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    colorCode: zod_1.z.string().min(1, { message: "Color code is required" }).max(50),
    colorName: zod_1.z.string().min(1, { message: "Color name is required" }).max(255)
});
exports.partValidator = (0, exports.applyStorageAndShelfLifeRefines)(exports.itemValidator.merge(zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Part ID is required" }).max(255),
    revision: zod_1.z.string().min(1, { message: "Revision is required" }),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    thumbnailPath: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lotSize: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    templateId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})));
// Tracked-entity pick order surfaced on the item's per-location Inventory
// card. 'Default' = the picker's smart order (expiring soonest, then oldest).
// Mirrors "pickMethodSortMethod" Postgres enum.
exports.pickMethodSortMethods = [
    "Default",
    "FEFO",
    "FIFO",
    "LIFO"
];
exports.pickMethodValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    defaultStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sortMethod: zod_1.z.enum(exports.pickMethodSortMethods).optional()
});
// pickMethod form + shelf-life policy in one submit. Shelf-life itself is
// item-level (stored on itemShelfLife keyed by itemId), not per-location,
// but we surface the controls on the per-location "Inventory" card so
// users editing the item's stocking defaults can also manage its shelf-
// life policy without navigating elsewhere. The server-side action is
// responsible for routing each subset of fields to its own upsert helper.
//
// Note: this validator does NOT reference itemTrackingType (pickMethod
// doesn't carry it). The UI gates visibility of the shelf-life fields on
// tracking type via a prop, and the itemValidator chain already enforces
// the Serial-or-Batch prerequisite at item creation. If a caller somehow
// posts shelfLifeMode on an item without Serial/Batch tracking, the
// itemShelfLife table's CHECK constraints still stand - but it's easier
// UX to not render the fields at all in that case.
exports.pickMethodWithShelfLifeValidator = exports.pickMethodValidator
    .merge(zod_1.z.object({
    shelfLifeMode: zod_1.z.preprocess(function (v) { return (v === "" ? "NotManaged" : v); }, zod_1.z.enum(exports.shelfLifeModes).optional()),
    shelfLifeDays: zod_form_data_1.zfd.numeric(zod_1.z.number().positive().optional()),
    shelfLifeTriggerProcessId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shelfLifeTriggerTiming: zod_1.z.enum(exports.shelfLifeTriggerTimings).optional(),
    shelfLifeCalculateFromBom: zod_form_data_1.zfd.checkbox()
}))
    .refine(function (data) {
    return data.shelfLifeDays === undefined ||
        data.shelfLifeMode === "Fixed Duration";
}, {
    message: "Shelf-life days can only be set when shelf-life management is Fixed Duration",
    path: ["shelfLifeDays"]
})
    .refine(function (data) {
    return data.shelfLifeMode !== "Fixed Duration" ||
        data.shelfLifeDays !== undefined;
}, {
    message: "Shelf-life days is required when shelf-life management is Fixed Duration",
    path: ["shelfLifeDays"]
})
    .refine(function (data) {
    return !data.shelfLifeTriggerProcessId ||
        data.shelfLifeMode === "Fixed Duration";
}, {
    message: "Trigger process can only be set when shelf-life management is Fixed Duration",
    path: ["shelfLifeTriggerProcessId"]
})
    .refine(function (data) {
    return !data.shelfLifeCalculateFromBom ||
        data.shelfLifeMode === "Fixed Duration";
}, {
    message: "Calculate from BOM only applies to Fixed Duration shelf life",
    path: ["shelfLifeCalculateFromBom"]
});
exports.revisionValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    type: zod_1.z.enum(["Part", "Material", "Tool", "Consumable", "Service"]),
    copyFromId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    revision: zod_1.z.string().min(1, { message: "Revision is required" })
})
    .refine(function (data) {
    return data.id || data.copyFromId;
}, { message: "Revision or copy from is required" });
exports.serviceValidator = (0, exports.applyStorageAndShelfLifeRefines)(exports.itemValidator.merge(zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Service ID is required" }).max(255),
    serviceType: zod_1.z.enum(exports.serviceType, {
        errorMap: function (issue, ctx) { return ({
            message: "Service type is required"
        }); }
    })
})));
exports.supplierPartValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    supplierId: zod_1.z.string().min(1, { message: "Supplier ID is required" }),
    supplierPartId: zod_1.z.string().optional(),
    supplierUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    minimumOrderQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    orderMultiple: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)).optional(),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    unitPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.toolValidator = (0, exports.applyStorageAndShelfLifeRefines)(exports.itemValidator.merge(zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Tool ID is required" }).max(255),
    revision: zod_1.z.string().min(1, { message: "Revision is required" }),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    thumbnailPath: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of Measure is required" }),
    lotSize: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
})));
exports.unitOfMeasureValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    code: zod_1.z.string().min(1, { message: "Code is required" }).max(10),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(50)
});
