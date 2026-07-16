"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueWorkflowValidator = exports.issueTypeValidator = exports.nonConformanceReviewerValidator = exports.issueValidator = exports.issueAssociationValidator = exports.gaugeTypeValidator = exports.gaugeCalibrationRecordValidator = exports.calibrationAttempt = exports.gaugeValidator = exports.inspectionSaveAnchorsPayloadValidator = exports.inspectionSaveAnchorUpdateItemValidator = exports.inspectionSaveAnchorCreateItemValidator = exports.inspectionSaveBalloonsPayloadValidator = exports.inspectionSaveBalloonUpdateItemValidator = exports.inspectionSaveBalloonCreateItemValidator = exports.inspectionSaveBalloonsGeometryPayloadValidator = exports.inspectionSaveBalloonGeometryUpdateItemValidator = exports.inspectionSaveBalloonGeometryCreateItemValidator = exports.inspectionSaveFeaturesPayloadValidator = exports.inspectionSaveFeatureUpdateItemValidator = exports.inspectionSaveFeatureCreateItemValidator = exports.balloonDeleteIdsValidator = exports.balloonUpdateItemsValidator = exports.balloonCreateItemsValidator = exports.balloonCreateItemWithOverlayValidator = exports.balloonAnchorCreateItemValidator = exports.balloonDeleteValidator = exports.balloonUpdateItemValidator = exports.balloonCreateFromPayloadItemValidator = exports.balloonFeatureValidator = exports.inspectionDocumentValidator = exports.riskRegisterType = exports.riskStatus = exports.riskSource = exports.qualityDocumentStatus = exports.nonConformanceAssociationType = exports.nonConformancePriority = exports.nonConformanceTaskStatus = exports.nonConformanceStatus = exports.nonConformanceSource = exports.nonConformanceApprovalRequirement = exports.gaugeRole = exports.gaugeCalibrationStatus = exports.gaugeStatus = exports.disposition = exports.standardAqlValues = exports.samplingStandards = exports.samplingPlanTypes = exports.inspectionSeverities = exports.inspectionLevels = void 0;
exports.inboundInspectionDispositionValidator = exports.inboundInspectionSampleValidator = exports.inboundInspectionValidator = exports.itemSamplingPlanValidator = exports.inboundInspectionSampleStatus = exports.inboundInspectionStatus = exports.riskRegisterValidator = exports.QualityKPIs = exports.qualityDocumentApprovalValidator = exports.requiredActionValidator = exports.qualityDocumentStepValidator = exports.qualityDocumentValidator = exports.assignIssueItemEntitiesValidator = exports.splitIssueItemValidator = exports.itemQuantityValidator = void 0;
exports.isIssueLocked = isIssueLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_models_1 = require("../shared/shared.models");
var samplingStandards_1 = require("./samplingStandards");
Object.defineProperty(exports, "inspectionLevels", { enumerable: true, get: function () { return samplingStandards_1.inspectionLevels; } });
Object.defineProperty(exports, "inspectionSeverities", { enumerable: true, get: function () { return samplingStandards_1.inspectionSeverities; } });
Object.defineProperty(exports, "samplingPlanTypes", { enumerable: true, get: function () { return samplingStandards_1.samplingPlanTypes; } });
Object.defineProperty(exports, "samplingStandards", { enumerable: true, get: function () { return samplingStandards_1.samplingStandards; } });
Object.defineProperty(exports, "standardAqlValues", { enumerable: true, get: function () { return samplingStandards_1.standardAqlValues; } });
exports.disposition = [
    // "Conditional Acceptance",
    // "Deviation Accepted",
    // "Hold",
    // "No Action Required",
    "Pending",
    // "Quarantine",
    // "Repair",
    "Return to Supplier",
    "Rework",
    "Scrap",
    "Use As Is"
];
exports.gaugeStatus = ["Active", "Inactive"];
exports.gaugeCalibrationStatus = [
    "Pending",
    "In-Calibration",
    "Out-of-Calibration"
];
exports.gaugeRole = ["Master", "Standard"];
exports.nonConformanceApprovalRequirement = ["MRB"];
exports.nonConformanceSource = ["Internal", "External"];
exports.nonConformanceStatus = [
    "Registered",
    "In Progress",
    "Closed"
];
function isIssueLocked(status) {
    return status === "Closed";
}
exports.nonConformanceTaskStatus = [
    "Pending",
    "In Progress",
    "Completed",
    "Skipped"
];
exports.nonConformancePriority = [
    "Low",
    "Medium",
    "High",
    "Critical"
];
exports.nonConformanceAssociationType = [
    "items",
    "customers",
    "suppliers",
    "jobOperations",
    "purchaseOrderLines",
    "salesOrderLines",
    "shipmentLines",
    "receiptLines",
    "trackedEntities",
    "inboundInspections"
];
exports.qualityDocumentStatus = ["Draft", "Active", "Archived"];
exports.riskSource = [
    "Customer",
    "General",
    "Item",
    "Job",
    "Quote Line",
    "Supplier",
    "Work Center"
];
exports.riskStatus = [
    "Open",
    "In Review",
    "Mitigating",
    "Closed",
    "Accepted"
];
exports.riskRegisterType = ["Risk", "Opportunity"];
exports.inspectionDocumentValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    partId: zod_1.z.string().min(1, { message: "Part is required" }),
    drawingNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    pdfUrl: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    annotations: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    features: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.balloonFeatureValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    inspectionDocumentId: zod_1.z.string().min(1, { message: "Diagram is required" }),
    balloonNumber: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    nominalValue: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    tolerancePlus: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    toleranceMinus: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.balloonCreateFromPayloadItemValidator = zod_1.z.object({
    pageNumber: zod_1.z.number(),
    regionX: zod_1.z.number(),
    regionY: zod_1.z.number(),
    regionWidth: zod_1.z.number(),
    regionHeight: zod_1.z.number(),
    label: zod_1.z.string().min(1),
    xCoordinate: zod_1.z.number(),
    yCoordinate: zod_1.z.number(),
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional()
});
exports.balloonUpdateItemValidator = zod_1.z.object({
    id: zod_1.z.string().min(1),
    pageNumber: zod_1.z.number().optional(),
    regionX: zod_1.z.number().optional(),
    regionY: zod_1.z.number().optional(),
    regionWidth: zod_1.z.number().optional(),
    regionHeight: zod_1.z.number().optional(),
    label: zod_1.z.string().optional(),
    xCoordinate: zod_1.z.number().optional(),
    yCoordinate: zod_1.z.number().optional(),
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional()
});
exports.balloonDeleteValidator = zod_1.z.object({
    ids: zod_1.z.array(zod_1.z.string().min(1))
});
var normalizedCoordinateValidator = zod_1.z.number().min(0).max(1);
var normalizedSizeValidator = zod_1.z.number().gt(0).max(1);
var pageNumberValidator = zod_1.z.number().int().min(1);
exports.balloonAnchorCreateItemValidator = zod_1.z
    .object({
    pageNumber: pageNumberValidator,
    regionX: normalizedCoordinateValidator,
    regionY: normalizedCoordinateValidator,
    regionWidth: normalizedSizeValidator,
    regionHeight: normalizedSizeValidator
})
    .strict();
exports.balloonCreateItemWithOverlayValidator = zod_1.z
    .object({
    pageNumber: pageNumberValidator,
    regionX: normalizedCoordinateValidator,
    regionY: normalizedCoordinateValidator,
    regionWidth: normalizedSizeValidator,
    regionHeight: normalizedSizeValidator,
    label: zod_1.z.string().min(1),
    xCoordinate: normalizedCoordinateValidator,
    yCoordinate: normalizedCoordinateValidator,
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    type: zod_1.z.enum(shared_models_1.procedureStepType).optional(),
    data: zod_1.z.record(zod_1.z.unknown()).optional()
})
    .strict();
exports.balloonCreateItemsValidator = zod_1.z.array(zod_1.z.union([
    exports.balloonCreateItemWithOverlayValidator,
    exports.balloonAnchorCreateItemValidator
]));
exports.balloonUpdateItemsValidator = zod_1.z.array(exports.balloonUpdateItemValidator.extend({
    pageNumber: pageNumberValidator.optional(),
    regionX: normalizedCoordinateValidator.optional(),
    regionY: normalizedCoordinateValidator.optional(),
    regionWidth: normalizedSizeValidator.optional(),
    regionHeight: normalizedSizeValidator.optional(),
    xCoordinate: normalizedCoordinateValidator.optional(),
    yCoordinate: normalizedCoordinateValidator.optional(),
    data: zod_1.z.record(zod_1.z.unknown()).optional()
}));
exports.balloonDeleteIdsValidator = zod_1.z.array(zod_1.z.string().min(1));
exports.inspectionSaveFeatureCreateItemValidator = zod_1.z
    .object({
    tempId: zod_1.z.string().min(1),
    pageNumber: pageNumberValidator,
    label: zod_1.z.string().min(1),
    description: zod_1.z.string().nullable().optional(),
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    type: zod_1.z.enum(shared_models_1.procedureStepType).optional()
})
    .strict();
exports.inspectionSaveFeatureUpdateItemValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1),
    pageNumber: pageNumberValidator.optional(),
    label: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().nullable().optional(),
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    type: zod_1.z.enum(shared_models_1.procedureStepType).optional()
})
    .strict();
exports.inspectionSaveFeaturesPayloadValidator = zod_1.z
    .object({
    create: zod_1.z.array(exports.inspectionSaveFeatureCreateItemValidator).default([]),
    update: zod_1.z.array(exports.inspectionSaveFeatureUpdateItemValidator).default([]),
    delete: zod_1.z.array(zod_1.z.string().min(1)).default([])
})
    .strict();
exports.inspectionSaveBalloonGeometryCreateItemValidator = zod_1.z
    .object({
    tempInspectionFeatureId: zod_1.z.string().min(1).optional(),
    inspectionFeatureId: zod_1.z.string().min(1).optional(),
    tempBalloonAnchorId: zod_1.z.string().min(1).optional(),
    pageNumber: pageNumberValidator,
    regionX: normalizedCoordinateValidator,
    regionY: normalizedCoordinateValidator,
    regionWidth: normalizedSizeValidator,
    regionHeight: normalizedSizeValidator,
    xCoordinate: normalizedCoordinateValidator,
    yCoordinate: normalizedCoordinateValidator
})
    .strict()
    .refine(function (data) {
    return Boolean(data.tempInspectionFeatureId) ||
        Boolean(data.inspectionFeatureId);
}, { message: "tempInspectionFeatureId or inspectionFeatureId is required" });
exports.inspectionSaveBalloonGeometryUpdateItemValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1),
    pageNumber: pageNumberValidator.optional(),
    regionX: normalizedCoordinateValidator.optional(),
    regionY: normalizedCoordinateValidator.optional(),
    regionWidth: normalizedSizeValidator.optional(),
    regionHeight: normalizedSizeValidator.optional(),
    xCoordinate: normalizedCoordinateValidator.optional(),
    yCoordinate: normalizedCoordinateValidator.optional()
})
    .strict();
exports.inspectionSaveBalloonsGeometryPayloadValidator = zod_1.z
    .object({
    create: zod_1.z
        .array(exports.inspectionSaveBalloonGeometryCreateItemValidator)
        .default([]),
    update: zod_1.z
        .array(exports.inspectionSaveBalloonGeometryUpdateItemValidator)
        .default([]),
    delete: zod_1.z.array(zod_1.z.string().min(1)).default([])
})
    .strict();
/** @deprecated Legacy combined payload; use features + balloons geometry split. */
exports.inspectionSaveBalloonCreateItemValidator = zod_1.z
    .object({
    tempBalloonAnchorId: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1),
    xCoordinate: normalizedCoordinateValidator,
    yCoordinate: normalizedCoordinateValidator,
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    type: zod_1.z.enum(shared_models_1.procedureStepType).optional()
})
    .strict();
/** @deprecated Legacy combined payload. */
exports.inspectionSaveBalloonUpdateItemValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1),
    label: zod_1.z.string().min(1).optional(),
    xCoordinate: normalizedCoordinateValidator.optional(),
    yCoordinate: normalizedCoordinateValidator.optional(),
    nominalValue: zod_1.z.string().nullable().optional(),
    tolerancePlus: zod_1.z.string().nullable().optional(),
    toleranceMinus: zod_1.z.string().nullable().optional(),
    unit: zod_1.z.string().nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    type: zod_1.z.enum(shared_models_1.procedureStepType).optional()
})
    .strict();
/** @deprecated Legacy combined payload. */
exports.inspectionSaveBalloonsPayloadValidator = zod_1.z
    .object({
    create: zod_1.z.array(exports.inspectionSaveBalloonCreateItemValidator).default([]),
    update: zod_1.z.array(exports.inspectionSaveBalloonUpdateItemValidator).default([]),
    delete: zod_1.z.array(zod_1.z.string().min(1)).default([])
})
    .strict();
exports.inspectionSaveAnchorCreateItemValidator = zod_1.z
    .object({
    tempId: zod_1.z.string().min(1),
    pageNumber: pageNumberValidator,
    xCoordinate: normalizedCoordinateValidator,
    yCoordinate: normalizedCoordinateValidator,
    width: normalizedSizeValidator,
    height: normalizedSizeValidator
})
    .strict();
exports.inspectionSaveAnchorUpdateItemValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1),
    pageNumber: pageNumberValidator.optional(),
    xCoordinate: normalizedCoordinateValidator.optional(),
    yCoordinate: normalizedCoordinateValidator.optional(),
    width: normalizedSizeValidator.optional(),
    height: normalizedSizeValidator.optional()
})
    .strict();
exports.inspectionSaveAnchorsPayloadValidator = zod_1.z
    .object({
    create: zod_1.z.array(exports.inspectionSaveAnchorCreateItemValidator).default([]),
    update: zod_1.z.array(exports.inspectionSaveAnchorUpdateItemValidator).default([]),
    delete: zod_1.z.array(zod_1.z.string().min(1)).default([])
})
    .strict();
exports.gaugeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    gaugeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    modelNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    serialNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateAcquired: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    gaugeTypeId: zod_1.z.string().min(1, { message: "Type is required" }),
    // gaugeCalibrationStatus: z.enum(gaugeCalibrationStatus),
    // gaugeStatus: z.enum(gaugeStatus),
    gaugeRole: zod_1.z.enum(exports.gaugeRole),
    lastCalibrationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    nextCalibrationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    calibrationIntervalInMonths: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1, {
        message: "Calibration interval is required"
    }))
});
exports.calibrationAttempt = zod_1.z.object({
    reference: zod_form_data_1.zfd.numeric(zod_1.z.number()),
    actual: zod_form_data_1.zfd.numeric(zod_1.z.number())
});
exports.gaugeCalibrationRecordValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "ID is required" }),
    gaugeId: zod_1.z.string().min(1, { message: "Gauge is required" }),
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateCalibrated: zod_1.z.string().min(1, { message: "Date is required" }),
    requiresAction: zod_form_data_1.zfd.checkbox(),
    requiresAdjustment: zod_form_data_1.zfd.checkbox(),
    requiresRepair: zod_form_data_1.zfd.checkbox(),
    temperature: zod_form_data_1.zfd.numeric(zod_1.z.number().min(-200).max(500).optional()),
    humidity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(1).optional()),
    approvedBy: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    measurementStandard: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    calibrationAttempts: zod_form_data_1.zfd.repeatableOfType(exports.calibrationAttempt),
    notes: zod_1.z
        .string()
        .optional()
        .transform(function (val) {
        try {
            return val ? JSON.parse(val) : {};
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            return {};
        }
    })
});
exports.gaugeTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.issueAssociationValidator = zod_1.z
    .object({
    type: zod_1.z.enum(exports.nonConformanceAssociationType),
    id: zod_1.z.string(),
    lineId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
})
    .refine(function (data) {
    // For types other than items, customer, supplier, trackedEntity, or
    // inboundInspection, lineId is required
    if (![
        "items",
        "customers",
        "suppliers",
        "trackedEntities",
        "inboundInspections"
    ].includes(data.type) &&
        !data.lineId) {
        return false;
    }
    return true;
}, {
    message: "Line ID is required"
});
exports.issueValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    nonConformanceId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    priority: zod_1.z.enum(exports.nonConformancePriority),
    source: zod_1.z.enum(exports.nonConformanceSource),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    requiredActionIds: zod_1.z.array(zod_1.z.string()).optional(),
    approvalRequirements: zod_1.z
        .array(zod_1.z.enum(exports.nonConformanceApprovalRequirement))
        .optional(),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    nonConformanceWorkflowId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    nonConformanceTypeId: zod_1.z.string().min(1, { message: "Type is required" }),
    openDate: zod_1.z.string().min(1, { message: "Open date is required" }),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    closeDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    items: zod_1.z.array(zod_1.z.string()).optional(),
    jobOperationId: zod_1.z.string().optional(),
    customerId: zod_1.z.string().optional(),
    salesOrderLineId: zod_1.z.string().optional(),
    operationSupplierProcessId: zod_1.z.string().optional()
});
exports.nonConformanceReviewerValidator = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "Title is required" })
});
exports.issueTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.issueWorkflowValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    content: zod_1.z
        .string()
        .min(1, { message: "Content is required" })
        .transform(function (val) {
        try {
            return JSON.parse(val);
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            return {};
        }
    }),
    priority: zod_1.z.enum(exports.nonConformancePriority),
    source: zod_1.z.enum(exports.nonConformanceSource),
    requiredActionIds: zod_1.z
        .string()
        .optional()
        .transform(function (val) {
        if (!val)
            return [];
        try {
            return JSON.parse(val);
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            return [];
        }
    }),
    approvalRequirements: zod_1.z
        .array(zod_1.z.enum(exports.nonConformanceApprovalRequirement))
        .optional()
});
exports.itemQuantityValidator = zod_1.z.object({
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
var entityAssignmentItem = zod_1.z.object({
    trackedEntityId: zod_1.z.string().min(1, { message: "Tracked entity is required" }),
    quantity: zod_1.z
        .number({ invalid_type_error: "Quantity is required" })
        .positive({ message: "Quantity must be greater than zero" })
});
var entityAssignmentsFromForm = zod_1.z
    .string()
    .optional()
    .transform(function (val) {
    if (!val)
        return undefined;
    try {
        var parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : undefined;
        // biome-ignore lint/correctness/noUnusedVariables: required by try/catch
    }
    catch (e) {
        return undefined;
    }
})
    .pipe(zod_1.z.array(entityAssignmentItem).optional());
exports.splitIssueItemValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1, { message: "Id is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    splitQuantity: zod_form_data_1.zfd.numeric(zod_1.z
        .number({ invalid_type_error: "Split quantity is required" })
        .positive({ message: "Split quantity must be greater than zero" })
        .optional()),
    entityAssignments: entityAssignmentsFromForm
})
    .refine(function (data) {
    return (data.entityAssignments && data.entityAssignments.length > 0) ||
        (typeof data.splitQuantity === "number" && data.splitQuantity > 0);
}, {
    message: "Either splitQuantity or entityAssignments is required",
    path: ["splitQuantity"]
});
exports.assignIssueItemEntitiesValidator = zod_1.z.object({
    nonConformanceItemId: zod_1.z.string().min(1, { message: "Id is required" }),
    targetItemId: zod_1.z.string().min(1, { message: "Target row is required" }),
    entityAssignments: entityAssignmentsFromForm.pipe(zod_1.z
        .array(entityAssignmentItem)
        .min(1, { message: "Select at least one tracked entity" }))
});
exports.qualityDocumentValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    version: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    content: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    copyFromId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.qualityDocumentStepValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    qualityDocumentId: zod_1.z
        .string()
        .min(1, { message: "Quality document is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    type: zod_1.z.enum(shared_models_1.procedureStepType, {
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
exports.requiredActionValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    active: zod_form_data_1.zfd.checkbox()
});
exports.qualityDocumentApprovalValidator = zod_1.z.object({
    approvalRequestId: zod_1.z
        .string()
        .min(1, { message: "Approval request is required" }),
    decision: zod_1.z.enum(["Approved", "Rejected"]),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.QualityKPIs = [
    { key: "weeklyTracking", label: "Issue Trend" },
    { key: "statusDistribution", label: "Status Distribution" },
    { key: "paretoByType", label: "Pareto by Type" },
    { key: "ncrsByType", label: "NCRs by Type" },
    { key: "sourceAnalysis", label: "Source Analysis" },
    { key: "supplierQuality", label: "Supplier Quality" },
    { key: "weeksOpen", label: "Weeks Open" }
];
exports.riskRegisterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    assignee: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    likelihood: zod_1.z.string().min(1, { message: "Likelihood is required" }),
    notes: zod_1.z
        .string()
        .optional()
        .transform(function (val) {
        try {
            return val ? JSON.parse(val) : {};
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            return {};
        }
    }),
    severity: zod_1.z.string().min(1, { message: "Severity is required" }),
    source: zod_1.z.enum(exports.riskSource),
    sourceId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(exports.riskStatus),
    title: zod_1.z.string().min(1, { message: "Title is required" }),
    type: zod_1.z.enum(exports.riskRegisterType)
});
exports.inboundInspectionStatus = [
    "Pending",
    "In Progress",
    "Passed",
    "Failed",
    "Partial"
];
exports.inboundInspectionSampleStatus = [
    "Pending",
    "Passed",
    "Failed"
];
exports.itemSamplingPlanValidator = zod_1.z
    .object({
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    type: zod_1.z.enum(samplingStandards_1.samplingPlanTypes),
    sampleSize: zod_form_data_1.zfd.numeric(zod_1.z.number().int().positive().optional()),
    percentage: zod_form_data_1.zfd.numeric(zod_1.z.number().positive().max(100).optional()),
    aql: zod_form_data_1.zfd.numeric(zod_1.z.number().positive().optional()),
    inspectionLevel: zod_1.z.enum(samplingStandards_1.inspectionLevels).default("II"),
    severity: zod_1.z.enum(samplingStandards_1.inspectionSeverities).default("Normal")
})
    .superRefine(function (value, ctx) {
    if (value.type === "First" && !value.sampleSize) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["sampleSize"],
            message: "Sample size is required for 'First N' plans"
        });
    }
    if (value.type === "Percentage" && !value.percentage) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["percentage"],
            message: "Percentage is required for percentage plans"
        });
    }
    if (value.type === "AQL" && !value.aql) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["aql"],
            message: "AQL is required for AQL plans"
        });
    }
});
exports.inboundInspectionValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Id is required" }),
    status: zod_1.z.enum(["Passed", "Failed"], {
        errorMap: function () { return ({ message: "Status is required" }); }
    }),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.inboundInspectionSampleValidator = zod_1.z.object({
    inspectionId: zod_1.z.string().min(1, { message: "Inspection is required" }),
    // Optional: serial parts scan a discrete tracked entity; batch / inventory /
    // non-inventory parts record pass/fail without one.
    trackedEntityId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(["Passed", "Failed"], {
        errorMap: function () { return ({ message: "Status is required" }); }
    }),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.inboundInspectionDispositionValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Id is required" }),
    decision: zod_1.z.enum(["Accept", "Reject", "Partial"], {
        errorMap: function () { return ({ message: "Decision is required" }); }
    }),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
