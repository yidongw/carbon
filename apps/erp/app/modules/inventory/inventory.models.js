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
exports.pickQuantityValidator = exports.generatePickingListValidator = exports.pickingListLineTrackedEntityValidator = exports.pickingListLineValidator = exports.pickingListValidator = exports.pickingListLineStatusType = exports.pickingListStatusType = exports.stockTransferLineScanValidator = exports.stockTransferLineValidator = exports.stockTransferValidator = exports.stockTransferStatusType = exports.warehouseTransferLineValidator = exports.warehouseTransferValidator = exports.warehouseTransferStatusType = exports.splitValidator = exports.shippingMethodValidator = exports.shipmentValidator = exports.shippingCarrierType = exports.shipmentSourceDocumentType = exports.shipmentStatusType = exports.storageTypeValidator = exports.storageUnitValidator = exports.receiptValidator = exports.kanbanValidator = exports.itemLedgerValidator = exports.inventoryAdjustmentValidator = exports.trackedEntityExpiryValidator = exports.batchPropertyOrderValidator = exports.batchPropertyValidator = exports.receiptStatusType = exports.receiptSourceDocumentType = exports.replenishmentSystemTypes = exports.trackedEntityStatus = exports.itemLedgerDocumentTypes = exports.itemLedgerTypes = exports.itemTypes = exports.demandSourceTypes = exports.demandPeriodTypes = void 0;
exports.isWarehouseTransferLocked = isWarehouseTransferLocked;
exports.reconcileReceiptLineSerials = reconcileReceiptLineSerials;
exports.isStockTransferLocked = isStockTransferLocked;
exports.isPickingListLocked = isPickingListLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var zodFields_1 = require("~/utils/zodFields");
var items_models_1 = require("../items/items.models");
exports.demandPeriodTypes = ["Week", "Day", "Month"];
exports.demandSourceTypes = ["Sales Order", "Job Material"];
exports.itemTypes = [
    "Part",
    "Material",
    "Tool",
    "Consumable"
    // "Service",
];
exports.itemLedgerTypes = [
    "Purchase",
    "Sale",
    "Positive Adjmt.",
    "Negative Adjmt.",
    "Transfer",
    "Consumption",
    "Output",
    "Assembly Consumption",
    "Assembly Output"
];
exports.itemLedgerDocumentTypes = [
    "Sales Shipment",
    "Sales Invoice",
    "Sales Return Receipt",
    "Sales Credit Memo",
    "Purchase Receipt",
    "Purchase Invoice",
    "Purchase Return Shipment",
    "Purchase Credit Memo",
    "Transfer Shipment",
    "Transfer Receipt",
    "Service Shipment",
    "Service Invoice",
    "Service Credit Memo",
    "Posted Assembly",
    "Inventory Receipt",
    "Inventory Shipment",
    "Direct Transfer"
];
exports.trackedEntityStatus = [
    "Available",
    "Consumed",
    "On Hold",
    "Reserved",
    "Rejected"
];
exports.replenishmentSystemTypes = [
    "Buy",
    "Make",
    "Buy and Make"
];
exports.receiptSourceDocumentType = [
    // "Sales Order",
    // "Sales Invoice",
    // "Sales Return Order",
    "Purchase Order",
    "Purchase Invoice",
    // "Purchase Return Order",
    "Inbound Transfer"
    // "Outbound Transfer",
    // "Manufacturing Consumption",
    // "Manufacturing Output",
];
exports.receiptStatusType = [
    "Draft",
    "Pending",
    "Posted",
    "Voided"
];
exports.batchPropertyValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    label: zod_1.z.string().min(1, { message: "Label is required" }),
    dataType: zod_1.z.enum(items_models_1.batchPropertyDataTypes),
    listOptions: zodFields_1.optionalRequiredStringArray,
    configurationParameterGroupId: zod_1.z.string().optional()
})
    .refine(function (data) {
    if (data.dataType === "list") {
        return !!data.listOptions;
    }
    return true;
}, { message: "List options are required", path: ["listOptions"] });
exports.batchPropertyOrderValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "ID is required" }),
    sortOrder: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
// Manual override of a tracked entity's expirationDate. Reason is required
// because the override is recorded on the entity's attributes JSONB so the
// trace popover can surface it later.
exports.trackedEntityExpiryValidator = zod_1.z.object({
    trackedEntityId: zod_1.z.string().min(1),
    // ISO date (YYYY-MM-DD). Empty clears the column entirely.
    expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    reason: zod_1.z
        .string()
        .min(3, { message: "Reason must be at least 3 characters" })
        .max(500)
});
exports.inventoryAdjustmentValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    originalStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    adjustmentType: zod_1.z.enum(__spreadArray(__spreadArray([], exports.itemLedgerTypes, true), ["Set Quantity"], false)),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number()),
    trackedEntityId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    readableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    comment: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.itemLedgerValidator = zod_1.z.object({
    postingDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    entryType: zod_1.z.enum(exports.itemLedgerTypes),
    documentType: zod_1.z.union([zod_1.z.enum(exports.itemLedgerDocumentTypes), zod_1.z.undefined()]),
    documentId: zod_1.z.string().optional(),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    locationId: zod_1.z.string().optional(),
    storageUnitId: zod_1.z.string().optional(),
    quantity: zod_1.z.number()
});
exports.kanbanValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    replenishmentSystem: zod_1.z.enum(exports.replenishmentSystemTypes).default("Buy"),
    autoRelease: zod_form_data_1.zfd.checkbox(),
    autoStartJob: zod_form_data_1.zfd.checkbox(),
    completedBarcodeOverride: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().int().min(1, { message: "Quantity must be at least 1" })),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(1))
})
    .refine(function (data) { return (data.replenishmentSystem === "Buy" ? !!data.supplierId : true); }, {
    message: "Supplier is required",
    path: ["supplierId"]
});
exports.receiptValidator = zod_1.z.object({
    id: zod_1.z.string().min(1),
    receiptId: zod_1.z.string().min(1, { message: "Receipt ID is required" }),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sourceDocument: zod_1.z.enum(exports.receiptSourceDocumentType).optional(),
    sourceDocumentId: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Source Document ID is required" })),
    externalDocumentId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sourceDocumentReadableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.storageUnitValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location ID is required" }),
    warehouseId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    parentId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    storageTypeIds: zod_form_data_1.zfd.repeatableOfType(zod_1.z.string()).default([])
});
exports.storageTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.shipmentStatusType = [
    "Draft",
    "Pending",
    "Posted",
    "Voided"
];
exports.shipmentSourceDocumentType = [
    "Sales Order",
    // "Sales Invoice",
    // "Sales Return Order",
    "Purchase Order",
    // "Purchase Invoice",
    // "Purchase Return Order",
    // "Inbound Transfer",
    "Outbound Transfer"
];
exports.shippingCarrierType = [
    "UPS",
    "FedEx",
    "USPS",
    "DHL",
    "Other"
];
exports.shipmentValidator = zod_1.z.object({
    id: zod_1.z.string().min(1),
    shipmentId: zod_1.z.string().min(1, { message: "Receipt ID is required" }),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sourceDocument: zod_1.z.enum(exports.shipmentSourceDocumentType).optional(),
    sourceDocumentId: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Source Document ID is required" })),
    trackingNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sourceDocumentReadableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.shippingMethodValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    carrier: zod_1.z.enum(["UPS", "FedEx", "USPS", "DHL", "Other"], {
        errorMap: function () { return ({
            message: "Carrier is required"
        }); }
    }),
    carrierAccountId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    trackingUrl: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.splitValidator = zod_1.z.object({
    documentId: zod_1.z.string().min(1, { message: "Document ID is required" }),
    documentLineId: zod_1.z
        .string()
        .min(1, { message: "Document Line ID is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location ID is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number())
});
exports.warehouseTransferStatusType = [
    "Draft",
    "To Ship and Receive",
    "To Ship",
    "To Receive",
    "Completed",
    "Cancelled"
];
function isWarehouseTransferLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
/**
 * Posting a serial-tracked receipt line consumes exactly one serial per index
 * in [0, receivedQuantity). Reducing the received quantity (orphaned indices
 * >= received) or editing a serial value (a duplicate at the same index) leaves
 * stale tracked entities behind. This is the single source of truth for both
 * sides of that invariant, so the post-time validation and the pre-post cleanup
 * can never disagree on which serials count:
 *   - `missingIndexes`  — required indices with no serial yet (post validation)
 *   - `surplusEntityIds` — orphan/duplicate entities to delete before posting,
 *     keeping the earliest-created entity for each in-range index.
 */
function reconcileReceiptLineSerials(entities, receivedQuantity) {
    var received = Math.max(0, receivedQuantity);
    var serializedIndexes = new Set(entities.filter(function (e) { return e.hasSerial; }).map(function (e) { return e.index; }));
    var missingIndexes = Array.from({ length: received }, function (_, index) { return index; }).filter(function (index) { return !serializedIndexes.has(index); });
    var keptIndexes = new Set();
    var surplusEntityIds = [];
    var ordered = __spreadArray([], entities, true).sort(function (a, b) { var _a, _b; return ((_a = a.createdAt) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.createdAt) !== null && _b !== void 0 ? _b : ""); });
    for (var _i = 0, ordered_1 = ordered; _i < ordered_1.length; _i++) {
        var entity = ordered_1[_i];
        var index = entity.index;
        var inRange = typeof index === "number" && index >= 0 && index < received;
        if (inRange && !keptIndexes.has(index)) {
            keptIndexes.add(index);
        }
        else {
            surplusEntityIds.push(entity.id);
        }
    }
    return { missingIndexes: missingIndexes, surplusEntityIds: surplusEntityIds };
}
exports.warehouseTransferValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    transferId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    fromLocationId: zod_1.z.string().min(1, { message: "From Location is required" }),
    toLocationId: zod_1.z.string().min(1, { message: "To Location is required" }),
    status: zod_1.z.enum(exports.warehouseTransferStatusType).optional(),
    transferDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    expectedReceiptDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    reference: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) { return data.fromLocationId !== data.toLocationId; }, {
    message: "From and To locations must be different",
    path: ["toLocationId"]
});
exports.warehouseTransferLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    transferId: zod_1.z.string().min(1, { message: "Transfer ID is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001, { message: "Quantity must be greater than 0" })),
    fromLocationId: zod_1.z.string().min(1, { message: "From Location is required" }),
    fromStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    toLocationId: zod_1.z.string().min(1, { message: "To Location is required" }),
    toStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) { return data.fromLocationId !== data.toLocationId; }, {
    message: "From and To locations must be different",
    path: ["toLocationId"]
});
exports.stockTransferStatusType = [
    "Draft",
    "Released",
    "In Progress",
    "Completed"
];
function isStockTransferLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
exports.stockTransferValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    lines: zod_1.z.string().transform(function (val, ctx) {
        try {
            var parsed = JSON.parse(val);
            return zod_1.z
                .array(zod_1.z.object({
                itemId: zod_1.z.string().min(1, { message: "Item is required" }),
                fromStorageUnitId: zod_1.z.string().nullish(),
                toStorageUnitId: zod_1.z.string().nullish(),
                quantity: zod_1.z.number().min(0).optional(),
                requiresSerialTracking: zod_1.z.boolean().optional(),
                requiresBatchTracking: zod_1.z.boolean().optional()
            }))
                .min(1, { message: "At least one line is required" })
                .parse(parsed);
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (e) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Invalid JSON format for lines"
            });
            return zod_1.z.NEVER;
        }
    })
});
exports.stockTransferLineValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    stockTransferId: zod_1.z.string().min(1, { message: "Pick list is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    fromStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    toStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0, { message: "Quantity must be greater than or equal to 0" })),
    pickedQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    requiresBatchTracking: zod_form_data_1.zfd.text(zod_1.z.string().transform(function (val) { return val === "true"; })),
    requiresSerialTracking: zod_form_data_1.zfd.text(zod_1.z.string().transform(function (val) { return val === "true"; }))
});
exports.stockTransferLineScanValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    stockTransferId: zod_1.z.string().min(1, { message: "Stock transfer is required" }),
    trackedEntityId: zod_1.z
        .string()
        .min(1, { message: "Tracked entity ID is required" })
});
exports.pickingListStatusType = [
    "Draft",
    "In Progress",
    "Completed",
    "Cancelled"
];
exports.pickingListLineStatusType = [
    "Pending",
    "Picked",
    "Short",
    "Cancelled"
];
// A picking list locks once it is Completed or Cancelled: no further picks or
// unpicks are allowed until it is reopened (which requires the inventory
// `delete` permission, ERP-only).
function isPickingListLocked(status) {
    return status === "Completed" || status === "Cancelled";
}
exports.pickingListValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    pickingListId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    assignee: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.pickingListLineValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    pickingListId: zod_1.z.string().min(1),
    jobId: zod_1.z.string().min(1),
    jobMaterialId: zod_1.z.string().min(1),
    jobOperationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_1.z.string().min(1),
    quantityToPick: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001)),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.pickingListLineTrackedEntityValidator = zod_1.z.object({
    pickingListLineId: zod_1.z.string().min(1),
    trackedEntityId: zod_1.z.string().min(1),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001))
});
exports.generatePickingListValidator = zod_1.z.object({
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    jobOperationIds: zod_1.z.array(zod_1.z.string().min(1)).min(1, {
        message: "Select at least one operation"
    }),
    assignee: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.pickQuantityValidator = zod_1.z.object({
    pickingListLineId: zod_1.z.string().min(1),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    markShort: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
