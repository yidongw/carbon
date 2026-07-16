"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.demandProjectionValidator = exports.maintenanceScheduleItemValidator = exports.maintenanceScheduleValidator = exports.maintenanceDispatchWorkCenterValidator = exports.maintenanceDispatchItemValidator = exports.maintenanceDispatchEventValidator = exports.maintenanceDispatchCommentValidator = exports.maintenanceDispatchValidator = exports.failureModeValidator = exports.scrapReasonValidator = exports.scheduleJobUpdateValidator = exports.scheduleOperationUpdateValidator = exports.productionQuantityCreateFormValidator = exports.productionActorKinds = exports.productionQuantityValidator = exports.productionOrderValidator = exports.productionEventValidator = exports.procedureSyncValidator = exports.procedureParameterValidator = exports.procedureStepValidator = exports.procedureValidator = exports.getJobMethodValidator = exports.jobMaterialValidatorForReleasedJob = exports.jobMaterialValidator = exports.jobOperationValidatorForReleasedJob = exports.jobOperationValidator = exports.baseJobOperationValidator = exports.salesOrderToJobValidator = exports.jobCompleteValidator = exports.leftoverAction = exports.jobValidator = exports.bulkJobValidator = exports.procedureStatus = exports.oeeImpact = exports.maintenanceSource = exports.maintenanceSeverity = exports.maintenanceFrequency = exports.maintenanceDispatchStatus = exports.maintenanceDispatchPriority = exports.jobOperationStatus = exports.JOB_LOCKED_STATUSES = exports.jobStatus = exports.deadlineTypes = exports.KPIs = void 0;
exports.isJobLocked = isJobLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_1 = require("../shared");
var operationType_1 = require("./operationType");
var productionQuantityReport_models_1 = require("./productionQuantityReport.models");
exports.KPIs = [
    {
        key: "utilization",
        label: "Work Center Utilization",
        emptyMessage: "No work center utilization data within range"
    },
    {
        key: "estimatesVsActuals",
        label: "Estimates vs Actuals",
        emptyMessage: "No completed jobs within range"
    },
    {
        key: "completionTime",
        label: "Completion Time",
        emptyMessage: "No completed jobs within range"
    }
];
exports.deadlineTypes = [
    "ASAP",
    "Hard Deadline",
    "Soft Deadline",
    "No Deadline"
];
exports.jobStatus = [
    "Draft",
    "Planned",
    "Ready",
    "In Progress",
    "Paused",
    "Completed",
    "Closed",
    "Cancelled",
    "Overdue", // deprecated
    "Due Today" // deprecated
];
exports.JOB_LOCKED_STATUSES = [
    "Completed",
    "Closed",
    "Cancelled"
];
function isJobLocked(status) {
    return exports.JOB_LOCKED_STATUSES.includes(status);
}
exports.jobOperationStatus = [
    "Todo",
    "Ready",
    "Waiting",
    "In Progress",
    "Paused",
    "Done",
    "Canceled"
];
exports.maintenanceDispatchPriority = [
    "Low",
    "Medium",
    "High",
    "Critical"
];
exports.maintenanceDispatchStatus = [
    "Open",
    "Assigned",
    "In Progress",
    "Completed",
    "Cancelled"
];
exports.maintenanceFrequency = [
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annual"
];
exports.maintenanceSeverity = [
    "Preventive",
    "Operator Performed",
    "Support Required",
    "OEM Required"
];
exports.maintenanceSource = [
    "Scheduled",
    "Reactive",
    "Non-Conformance"
];
exports.oeeImpact = ["Down", "Planned", "Impact", "No Impact"];
exports.procedureStatus = ["Draft", "Active", "Archived"];
var baseJobValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    customerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    deadlineType: zod_1.z.enum(exports.deadlineTypes, {
        errorMap: function () { return ({ message: "Deadline type is required" }); }
    }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    scrapQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    startDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" }),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    configuration: zod_1.z.any().optional()
});
exports.bulkJobValidator = zod_1.z
    .object({
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    jobCount: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    quantityPerJob: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    scrapQuantityPerJob: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" }),
    deadlineType: zod_1.z.enum(exports.deadlineTypes, {
        errorMap: function () { return ({ message: "Deadline type is required" }); }
    }),
    dueDateOfFirstJob: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dueDateOfLastJob: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    customerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    configuration: zod_1.z.any().optional()
})
    .refine(function (data) {
    if (data.dueDateOfFirstJob && data.dueDateOfLastJob) {
        return data.dueDateOfFirstJob <= data.dueDateOfLastJob;
    }
    return true;
}, {
    message: "Due date of first job must be before due date of last job",
    path: ["dueDateOfLastJob"]
})
    .refine(function (data) {
    if (["Hard Deadline", "Soft Deadline"].includes(data.deadlineType)) {
        return !!data.dueDateOfFirstJob;
    }
    return true;
}, {
    message: "Due date of first job is required for hard and soft deadlines",
    path: ["dueDateOfFirstJob"]
})
    .refine(function (data) {
    if (["Hard Deadline", "Soft Deadline"].includes(data.deadlineType)) {
        return !!data.dueDateOfLastJob;
    }
    return true;
}, {
    message: "Due date of last job is required for hard and soft deadlines",
    path: ["dueDateOfLastJob"]
});
exports.jobValidator = baseJobValidator.refine(function (data) {
    if (["Hard Deadline", "Soft Deadline"].includes(data.deadlineType) &&
        !data.dueDate) {
        return false;
    }
    return true;
}, {
    message: "Due date is required",
    path: ["dueDate"]
});
exports.leftoverAction = ["ship", "receive", "split", "discard"];
exports.jobCompleteValidator = zod_1.z.object({
    quantityComplete: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    salesOrderId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesOrderLineId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // Leftover handling fields - for when quantityComplete > job.quantity
    leftoverAction: zod_form_data_1.zfd.text(zod_1.z.enum(exports.leftoverAction).optional()),
    leftoverShipQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    leftoverReceiveQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.salesOrderToJobValidator = baseJobValidator
    .extend({
    quoteId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quoteLineId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesOrderId: zod_form_data_1.zfd.text(zod_1.z.string()),
    salesOrderLineId: zod_form_data_1.zfd.text(zod_1.z.string())
})
    .refine(function (data) {
    if (["Hard Deadline", "Soft Deadline"].includes(data.deadlineType) &&
        !data.dueDate) {
        return false;
    }
    return true;
}, {
    message: "Due date is required",
    path: ["dueDate"]
});
exports.baseJobOperationValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Operation ID is required" }),
    jobMakeMethodId: zod_1.z
        .string()
        .min(1, { message: "Quote Make Method is required" }),
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
    machineRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    overheadRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    laborRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationSupplierProcessId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    operationMinimumCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationUnitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationLeadTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    insideUnitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.jobOperationValidator = exports.baseJobOperationValidator
    .merge(zod_1.z.object({
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
}))
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return Number.isFinite(data.operationMinimumCost);
    }
    return true;
}, {
    message: "Minimum is required",
    path: ["operationMinimumCost"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return Number.isFinite(data.operationUnitCost);
    }
    return true;
}, {
    message: "Unit cost is required",
    path: ["operationUnitCost"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return Number.isFinite(data.operationLeadTime);
    }
    return true;
}, {
    message: "Lead time is required",
    path: ["operationLeadTime"]
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
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.machineRate);
    }
    return true;
}, {
    message: "Machine rate is required",
    path: ["machineRate"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.overheadRate);
    }
    return true;
}, {
    message: "Overhead rate is required",
    path: ["overheadRate"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.laborRate);
    }
    return true;
}, {
    message: "Labor rate is required",
    path: ["laborRate"]
});
exports.jobOperationValidatorForReleasedJob = exports.baseJobOperationValidator
    .merge(zod_1.z.object({
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
}))
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return !!data.workCenterId;
    }
    return true;
}, {
    message: "Work center is required",
    path: ["workCenterId"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return Number.isFinite(data.operationMinimumCost);
    }
    return true;
}, {
    message: "Minimum is required",
    path: ["operationMinimumCost"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return Number.isFinite(data.operationUnitCost);
    }
    return true;
}, {
    message: "Unit cost is required",
    path: ["operationUnitCost"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return Number.isFinite(data.operationLeadTime);
    }
    return true;
}, {
    message: "Lead time is required",
    path: ["operationLeadTime"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresStrictOutsideRoutingFields)(data.operationType)) {
        return !!data.operationSupplierProcessId;
    }
    return true;
}, {
    message: "Supplier is required",
    path: ["operationSupplierProcessId"]
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
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.machineRate);
    }
    return true;
}, {
    message: "Machine rate is required",
    path: ["machineRate"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.overheadRate);
    }
    return true;
}, {
    message: "Overhead rate is required",
    path: ["overheadRate"]
})
    .refine(function (data) {
    if ((0, operationType_1.requiresInsideLaborFields)(data.operationType)) {
        return Number.isFinite(data.laborRate);
    }
    return true;
}, {
    message: "Labor rate is required",
    path: ["laborRate"]
});
var baseMaterialValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Material ID is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    jobMakeMethodId: zod_1.z.string().min(1, { message: "Make method is required" }),
    itemType: zod_1.z.enum(shared_1.methodItemType, {
        errorMap: function (issue, ctx) { return ({
            message: "Item type is required"
        }); }
    }),
    methodType: zod_1.z.enum(shared_1.methodType, {
        errorMap: function (issue, ctx) { return ({
            message: "Method type is required"
        }); }
    }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    kit: zod_form_data_1.zfd.text(zod_1.z.string().optional()).transform(function (value) { return value === "true"; }),
    order: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    requiresBatchTracking: zod_form_data_1.zfd.text(zod_1.z.string().transform(function (val) { return val === "true"; })),
    requiresSerialTracking: zod_form_data_1.zfd.text(zod_1.z.string().transform(function (val) { return val === "true"; })),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of Measure is required" }),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.jobMaterialValidator = baseMaterialValidator
    .extend({
    jobOperationId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.itemType === "Part") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Part ID is required",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.itemType === "Material") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Material ID is required",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.itemType === "Tool") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Tool ID is required",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.itemType === "Consumable") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Consumable ID is required",
    path: ["itemId"]
});
exports.jobMaterialValidatorForReleasedJob = baseMaterialValidator
    .extend({
    jobOperationId: zod_1.z.string().min(1, { message: "Operation is required" })
})
    .refine(function (data) {
    if (data.itemType === "Part") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Part ID is required",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.itemType === "Material") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Material ID is required",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.itemType === "Tool") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Tool ID is required",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.itemType === "Consumable") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Consumable ID is required",
    path: ["itemId"]
});
exports.getJobMethodValidator = zod_1.z.object({
    sourceId: zod_1.z.string().min(1, { message: "Source ID is required" }),
    targetId: zod_1.z.string().min(1, { message: "Please select a source method" }),
    billOfMaterial: zod_form_data_1.zfd.checkbox(),
    billOfProcess: zod_form_data_1.zfd.checkbox(),
    parameters: zod_form_data_1.zfd.checkbox(),
    tools: zod_form_data_1.zfd.checkbox(),
    steps: zod_form_data_1.zfd.checkbox(),
    workInstructions: zod_form_data_1.zfd.checkbox()
});
// export const getJobMaterialMethodValidator = z.object({
//   jobMaterialId: z.string().min(1, { message: "Quote Material is required" }),
//   itemId: z.string().min(1, { message: "Please select a source method" }),
// });
exports.procedureValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    version: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    processId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    content: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    copyFromId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.procedureStepValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    procedureId: zod_1.z.string().min(1, { message: "Procedure is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    type: zod_1.z.enum(shared_1.procedureStepType, {
        errorMap: function () { return ({ message: "Type is required" }); }
    }),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    minValue: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    maxValue: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    listValues: zod_1.z.array(zod_1.z.string()).optional(),
    sortOrder: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
})
    .refine(function (data) {
    if (data.type === "Measurement") {
        return !!data.unitOfMeasureCode;
    }
    return true;
}, {
    message: "Unit of measure is required",
    path: ["unitOfMeasureCode"]
})
    .refine(function (data) {
    if (data.type === "List") {
        return (!!data.listValues &&
            data.listValues.length > 0 &&
            data.listValues.every(function (option) { return option.trim() !== ""; }));
    }
    return true;
}, {
    message: "List options are required",
    path: ["listOptions"]
})
    .refine(function (data) {
    if (data.minValue != null && data.maxValue != null) {
        return data.maxValue >= data.minValue;
    }
    return true;
}, {
    message: "Maximum value must be greater than or equal to minimum value",
    path: ["maxValue"]
});
exports.procedureParameterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    procedureId: zod_1.z.string().min(1, { message: "Procedure is required" }),
    key: zod_1.z.string().min(1, { message: "Key is required" }),
    value: zod_1.z.string().min(1, { message: "Value is required" })
});
exports.procedureSyncValidator = zod_1.z.object({
    operationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    procedureId: zod_1.z.string().min(1, { message: "Procedure is required" })
});
exports.productionEventValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobOperationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    type: zod_1.z.enum(["Labor", "Machine", "Setup"], {
        errorMap: function () { return ({ message: "Event type is required" }); }
    }),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    startTime: zod_1.z.string().min(1, { message: "Start time is required" }),
    endTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
}, {
    message: "Start time must be before end time",
    path: ["endTime"]
});
exports.productionOrderValidator = zod_1.z.object({
    startDate: zod_form_data_1.zfd.text(zod_1.z.string().nullable()),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().nullable()),
    periodId: zod_1.z.string().min(1, { message: "Period is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    existingId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    existingQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    existingReadableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    existingStatus: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    isASAP: zod_1.z.boolean().optional()
});
exports.productionQuantityValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobOperationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    type: zod_1.z.enum(["Rework", "Scrap", "Production"], {
        errorMap: function () { return ({ message: "Quantity type is required" }); }
    }),
    scrapReasonId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    configuration: zod_1.z.any().optional()
});
exports.productionActorKinds = ["employee", "supplier"];
/** Remix form for creating a quantity report with one or more typed lines (`lines` is JSON). */
exports.productionQuantityCreateFormValidator = zod_1.z
    .object({
    jobOperationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    actorKind: zod_1.z.enum(exports.productionActorKinds).default("employee"),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierProcessId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    operationUnitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    operationMinimumCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    snapshotPricingEdited: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lines: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Quantity lines are required" }))
})
    .superRefine(function (data, ctx) {
    if (data.actorKind === "employee" && !data.employeeId) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Employee is required",
            path: ["productionActorSelection"]
        });
    }
    if (data.actorKind === "supplier" && !data.supplierProcessId) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Supplier process is required",
            path: ["productionActorSelection"]
        });
    }
    try {
        var parsed = JSON.parse(data.lines);
        var result = zod_1.z
            .array(productionQuantityReport_models_1.productionQuantityLineJsonValidator)
            .min(1)
            .safeParse(parsed);
        if (!result.success) {
            result.error.issues.forEach(function (issue) {
                ctx.addIssue(__assign(__assign({}, issue), { path: __spreadArray(["lines"], issue.path, true) }));
            });
        }
    }
    catch (_a) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Invalid quantity lines",
            path: ["lines"]
        });
    }
});
exports.scheduleOperationUpdateValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "ID is required" }),
    columnId: zod_1.z.string().min(1, { message: "Column is required" }),
    priority: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.scheduleJobUpdateValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "ID is required" }),
    columnId: zod_1.z.string().min(1, { message: "Column is required" }),
    priority: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.scrapReasonValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.failureModeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.maintenanceDispatchValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(exports.maintenanceDispatchStatus),
    priority: zod_1.z.enum(exports.maintenanceDispatchPriority),
    severity: zod_1.z.enum(exports.maintenanceSeverity).optional(),
    source: zod_1.z.enum(exports.maintenanceSource).optional(),
    oeeImpact: zod_1.z.enum(exports.oeeImpact).optional(),
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    suspectedFailureModeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    plannedStartTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    plannedEndTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    assignee: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    content: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.maintenanceDispatchCommentValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z.string().min(1, { message: "Dispatch is required" }),
    comment: zod_1.z.string().min(1, { message: "Comment is required" })
});
exports.maintenanceDispatchEventValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z
        .string()
        .min(1, { message: "Dispatch is required" }),
    employeeId: zod_1.z.string().min(1, { message: "Employee is required" }),
    workCenterId: zod_1.z.string().min(1, { message: "Work center is required" }),
    startTime: zod_1.z.string().min(1, { message: "Start time is required" }),
    endTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
}, {
    message: "Start time must be before end time",
    path: ["endTime"]
});
exports.maintenanceDispatchItemValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z.string().min(1, { message: "Dispatch is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" }),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.maintenanceDispatchWorkCenterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z.string().min(1, { message: "Dispatch is required" }),
    workCenterId: zod_1.z.string().min(1, { message: "Work center is required" })
});
exports.maintenanceScheduleValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    workCenterId: zod_1.z.string().min(1, { message: "Work center is required" }),
    frequency: zod_1.z.enum(exports.maintenanceFrequency),
    priority: zod_1.z.enum(exports.maintenanceDispatchPriority),
    estimatedDuration: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    active: zod_form_data_1.zfd.checkbox()
});
exports.maintenanceScheduleItemValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceScheduleId: zod_1.z.string().min(1, { message: "Schedule is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" })
});
exports.demandProjectionValidator = zod_1.z.object(__assign({ itemId: zod_1.z.string().min(1, { message: "Item is required" }), locationId: zod_1.z.string().min(1, { message: "Location is required" }), periods: zod_1.z.array(zod_1.z.string()).optional() }, Object.fromEntries(Array.from({ length: 52 }, function (_, i) { return [
    "week".concat(i),
    zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
]; }))));
