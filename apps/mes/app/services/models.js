"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceDispatchIssueTrackedEntityValidator = exports.maintenanceDispatchIssueValidator = exports.qualityIssueValidator = exports.qualityIssuePriority = exports.maintenanceDispatchValidator = exports.triggerReworkValidator = exports.scrapQuantityValidator = exports.nonScrapQuantityValidator = exports.baseQuantityValidator = exports.issueTrackedEntityValidator = exports.finishValidator = exports.productionEventValidator = exports.productionEventAction = exports.productionEventType = exports.suggestionValidator = exports.feedbackValidator = exports.issueValidator = exports.stepRecordValidator = exports.convertEntityValidator = exports.oeeImpact = exports.maintenanceSource = exports.maintenanceSeverity = exports.maintenanceDispatchPriority = exports.pickQuantityValidator = exports.pickingListLineStatus = exports.pickingListStatus = exports.jobOperationStatus = exports.jobStatus = exports.deadlineTypes = exports.documentTypes = void 0;
exports.isPickingListLocked = isPickingListLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.documentTypes = [
    "Archive",
    "Document",
    "Presentation",
    "PDF",
    "Spreadsheet",
    "Text",
    "Image",
    "Video",
    "Audio",
    "Other"
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
    "Cancelled"
];
exports.jobOperationStatus = [
    "Todo",
    "Ready",
    "Waiting",
    "In Progress",
    "Paused",
    "Done",
    "Canceled"
];
exports.pickingListStatus = [
    "Draft",
    "In Progress",
    "Completed",
    "Cancelled"
];
exports.pickingListLineStatus = [
    "Pending",
    "Picked",
    "Short",
    "Cancelled"
];
exports.pickQuantityValidator = zod_1.z.object({
    pickingListLineId: zod_1.z.string().min(1),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    markShort: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
// A picking list locks once Completed or Cancelled. Reopening is ERP-only
// (requires the inventory `delete` permission), so MES must never unlock one.
function isPickingListLocked(status) {
    return status === "Completed" || status === "Cancelled";
}
exports.maintenanceDispatchPriority = [
    "Low",
    "Medium",
    "High",
    "Critical"
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
exports.convertEntityValidator = zod_1.z.object({
    trackedEntityId: zod_1.z.string(),
    newRevision: zod_1.z.string(),
    quantity: zod_1.z.coerce.number().positive().default(1)
});
exports.stepRecordValidator = zod_1.z.object({
    index: zod_form_data_1.zfd.numeric(zod_1.z.number()),
    jobOperationStepId: zod_1.z.string(),
    value: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    numericValue: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    booleanValue: zod_form_data_1.zfd
        .text(zod_1.z.enum(["true", "false"]).transform(function (val) { return val === "true"; }))
        .optional(),
    userValue: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.issueValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    jobOperationId: zod_1.z.string().min(1, { message: "Job Operation is required" }),
    materialId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number()),
    adjustmentType: zod_1.z.enum(["Set Quantity", "Positive Adjmt.", "Negative Adjmt."])
});
exports.feedbackValidator = zod_1.z.object({
    feedback: zod_1.z.string().min(1, { message: "" }),
    attachmentPath: zod_1.z.string().optional(),
    location: zod_1.z.string()
});
exports.suggestionValidator = zod_1.z.object({
    suggestion: zod_1.z.string().min(1, { message: "Suggestion is required" }),
    emoji: zod_1.z.string().default("💡"),
    attachmentPath: zod_1.z.string().optional(),
    path: zod_1.z.string(),
    userId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.productionEventType = ["Setup", "Labor", "Machine"];
exports.productionEventAction = ["Start", "End"];
exports.productionEventValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobOperationId: zod_1.z
        .string()
        .min(1, { message: "Job Operation ID is required" }),
    timezone: zod_form_data_1.zfd.text(zod_1.z.string()),
    action: zod_1.z.enum(exports.productionEventAction, {
        errorMap: function (issue, ctx) { return ({
            message: "Action is required"
        }); }
    }),
    type: zod_1.z.enum(exports.productionEventType, {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    trackedEntityId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.finishValidator = zod_1.z.object({
    jobOperationId: zod_1.z.string(),
    setupProductionEventId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    laborProductionEventId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    machineProductionEventId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.issueTrackedEntityValidator = zod_1.z.object({
    materialId: zod_1.z.string().optional(),
    jobOperationId: zod_1.z.string().optional(),
    itemId: zod_1.z.string().optional(),
    parentTrackedEntityId: zod_1.z.string(),
    children: zod_1.z.array(zod_1.z.object({
        trackedEntityId: zod_1.z.string(),
        quantity: zod_1.z.number()
    })),
    // Set when policy is BlockWithOverride and operator typed a reason.
    overrideExpired: zod_1.z.boolean().optional(),
    overrideReason: zod_1.z.string().optional()
});
exports.baseQuantityValidator = exports.finishValidator.extend({
    trackedEntityId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    trackingType: zod_1.z.enum(["Serial", "Batch", ""]).optional(),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().positive()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.nonScrapQuantityValidator = exports.baseQuantityValidator;
exports.scrapQuantityValidator = exports.baseQuantityValidator.extend({
    scrapReasonId: zod_form_data_1.zfd.text(zod_1.z.string()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.triggerReworkValidator = zod_1.z.object({
    jobId: zod_1.z.string().min(1),
    triggeredAtJobOperationId: zod_1.z.string().min(1),
    targetJobOperationId: zod_1.z
        .string()
        .min(1, { message: "Target operation is required" }),
    reason: zod_1.z.string().min(1, { message: "Reason is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().positive({ message: "Quantity must be greater than 0" })),
    trackedEntityIds: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.maintenanceDispatchValidator = zod_1.z.object({
    workCenterId: zod_1.z.string().min(1, { message: "Work Center is required" }),
    priority: zod_1.z.enum(exports.maintenanceDispatchPriority, {
        errorMap: function () { return ({ message: "Priority is required" }); }
    }),
    severity: zod_1.z.enum(exports.maintenanceSeverity, {
        errorMap: function () { return ({ message: "Severity is required" }); }
    }),
    oeeImpact: zod_1.z.enum(exports.oeeImpact, {
        errorMap: function () { return ({ message: "OEE Impact is required" }); }
    }),
    suspectedFailureModeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    actualFailureModeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    content: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    actualStartTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    actualEndTime: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.qualityIssuePriority = [
    "Low",
    "Medium",
    "High",
    "Critical"
];
exports.qualityIssueValidator = zod_1.z.object({
    jobOperationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    nonConformanceTypeId: zod_1.z
        .string()
        .min(1, { message: "Issue type is required" }),
    priority: zod_1.z.enum(exports.qualityIssuePriority, {
        errorMap: function () { return ({ message: "Priority is required" }); }
    }),
    trackedEntityId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.maintenanceDispatchIssueValidator = zod_1.z.object({
    maintenanceDispatchItemId: zod_1.z.string().min(1, {
        message: "Maintenance Dispatch Item is required"
    }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number()),
    adjustmentType: zod_1.z.enum(["Positive Adjmt.", "Negative Adjmt."])
});
exports.maintenanceDispatchIssueTrackedEntityValidator = zod_1.z.object({
    maintenanceDispatchItemId: zod_1.z.string(),
    children: zod_1.z.array(zod_1.z.object({
        trackedEntityId: zod_1.z.string(),
        quantity: zod_1.z.number()
    }))
});
