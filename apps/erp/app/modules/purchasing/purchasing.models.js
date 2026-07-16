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
exports.PURCHASE_ORDER_LOCKED_STATUSES = exports.PURCHASING_RFQ_LOCKED_STATUSES = exports.PURCHASING_RFQ_EDITABLE_STATUSES = exports.purchasingRfqFinalizeValidator = exports.purchasingRfqSuppliersValidator = exports.purchasingRfqLineValidator = exports.purchasingRfqValidator = exports.purchasingRfqStatusType = exports.supplierQuoteLineValidator = exports.supplierQuoteValidator = exports.supplierTypeValidator = exports.supplierAccountingValidator = exports.supplierShippingValidator = exports.supplierProcessValidator = exports.supplierPaymentValidator = exports.supplierLocationValidator = exports.supplierContactValidator = exports.supplierApprovalDecisionValidator = exports.supplierTaxValidator = exports.supplierApprovalValidator = exports.supplierValidator = exports.selectedLinesValidator = exports.selectedLineSchema = exports.purchaseOrderApprovalValidator = exports.purchaseOrderFinalizeValidator = exports.purchaseOrderPaymentValidator = exports.purchaseOrderLineValidator = exports.purchaseOrderDeliveryValidator = exports.supplierQuoteFinalizeValidator = exports.purchaseOrderValidator = exports.plannedOrderValidator = exports.externalSupplierQuoteValidator = exports.supplierQuoteStatusType = exports.supplierStatusType = exports.purchaseOrderStatusType = exports.purchaseOrderTypeType = exports.purchaseOrderLineType = exports.KPIs = void 0;
exports.isSupplierQuoteLocked = isSupplierQuoteLocked;
exports.isRfqEditable = isRfqEditable;
exports.isRfqLocked = isRfqLocked;
exports.isPurchaseOrderLocked = isPurchaseOrderLocked;
var date_1 = require("@internationalized/date");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var validators_1 = require("~/types/validators");
var shared_1 = require("../shared");
var taxExemptionReasons = [
    "Resale",
    "Government",
    "Nonprofit",
    "Agriculture",
    "Industrial",
    "Export",
    "Medical",
    "Educational",
    "Religious",
    "Other"
];
exports.KPIs = [
    {
        key: "supplierQuoteCount",
        label: "Supplier Quotes"
    },
    {
        key: "purchaseOrderCount",
        label: "Purchase Orders"
    },
    {
        key: "purchaseInvoiceCount",
        label: "Purchase Invoices"
    },
    {
        key: "purchaseOrderAmount",
        label: "Purchase Order Amount"
    },
    {
        key: "purchaseInvoiceAmount",
        label: "Purchase Invoice Amount"
    }
    // {
    //   key: "turnaroundTime",
    //   label: "Turnaround Time",
    // },
];
exports.purchaseOrderLineType = [
    "Style",
    "Part",
    // "Service",
    "Material",
    "Tool",
    "Consumable",
    "G/L Account",
    // "Fixed Asset",
    "Comment"
];
exports.purchaseOrderTypeType = [
    "Purchase",
    "Outside Processing"
];
exports.purchaseOrderStatusType = [
    "Draft",
    "Planned",
    "Needs Approval",
    "To Review",
    "To Receive",
    "To Receive and Invoice",
    "To Invoice",
    "Completed",
    "Rejected",
    "Closed"
];
exports.supplierStatusType = [
    "Active",
    "Inactive",
    "Pending",
    "Rejected"
];
exports.supplierQuoteStatusType = [
    "Draft",
    "Active",
    "Expired",
    "Declined",
    "Cancelled"
];
function isSupplierQuoteLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
exports.externalSupplierQuoteValidator = zod_1.z.object({
    digitalSupplierQuoteSubmittedBy: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Name is required" })),
    digitalSupplierQuoteSubmittedByEmail: zod_form_data_1.zfd.text(zod_1.z.string().email({ message: "Email is invalid" })),
    note: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.plannedOrderValidator = zod_1.z.object({
    startDate: zod_form_data_1.zfd.text(zod_1.z.string().nullable()),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().nullable()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    periodId: zod_1.z.string().min(1, { message: "Period is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    existingId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    existingLineId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    existingQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    existingReadableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    existingStatus: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemReadableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // ── Reorder-policy attribution (populated by calculateOrders for
    // MRP-suggested orders; absent for user-added "Add Order" rows). ──
    policyName: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    reason: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    triggerValues: zod_1.z
        .object({
        projectedStock: zod_1.z.number().optional(),
        safetyStock: zod_1.z.number().optional(),
        reorderPoint: zod_1.z.number().optional(),
        reorderQuantity: zod_1.z.number().optional(),
        lotSize: zod_1.z.number().optional(),
        leadTime: zod_1.z.number().optional()
    })
        .optional()
});
exports.purchaseOrderValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseOrderId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseOrderType: zod_1.z.enum(exports.purchaseOrderTypeType, {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    status: zod_1.z.enum(exports.purchaseOrderStatusType).optional(),
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    orderDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_1.z.any().optional(),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRateUpdatedAt: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.supplierQuoteFinalizeValidator = zod_1.z
    .object({
    notification: zod_1.z.enum(["Email", "Share"]).optional(),
    supplierContact: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    cc: zod_1.z.array(zod_1.z.string()).optional()
})
    .refine(function (data) { return (data.notification === "Email" ? data.supplierContact : true); }, {
    message: "Supplier contact is required for email",
    path: ["supplierContact"] // path of error
});
exports.purchaseOrderDeliveryValidator = zod_1.z
    .object({
    id: zod_1.z.string(),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // shippingTermId: zfd.text(z.string().optional()),
    trackingNumber: zod_1.z.string(),
    deliveryDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    receiptRequestedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    receiptPromisedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dropShipment: zod_form_data_1.zfd.checkbox(),
    customerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierShippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    incoterm: zod_form_data_1.zfd.text(zod_1.z.enum(shared_1.incoterms).optional()),
    incotermLocation: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.dropShipment) {
        return data.customerId && data.customerLocationId;
    }
    return true;
}, {
    message: "Drop shipment requires customer and location",
    path: ["dropShipment"] // path of error
})
    .refine(function (data) {
    if (data.locationId) {
        return !data.dropShipment;
    }
    return true;
}, {
    message: "Location is not required for drop shipment",
    path: ["locationId"] // path of error
});
exports.purchaseOrderLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseOrderId: zod_1.z.string().min(1, { message: "Order is required" }),
    purchaseOrderLineType: zod_1.z.enum(__spreadArray(__spreadArray([], shared_1.methodItemType, true), ["Service", "Fixture", "G/L Account", "Fixed Asset"], false), {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    costCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    assetId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    inventoryUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobOperationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    jobOperationSupplierQuantityReportId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    promisedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    purchaseUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    requiredDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierPartId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierShippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    supplierTaxAmount: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    supplierUnitPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().optional())
})
    .refine(function (data) {
    return [
        "Style",
        "Part",
        "Service",
        "Material",
        "Tool",
        "Fixture",
        "Consumable"
    ].includes(data.purchaseOrderLineType)
        ? data.itemId
        : true;
}, {
    message: "Part is required",
    path: ["itemId"]
})
    .refine(function (data) {
    return data.purchaseOrderLineType === "G/L Account" ? data.accountId : true;
}, {
    message: "Account is required",
    path: ["accountId"]
})
    .refine(function (data) {
    return data.purchaseOrderLineType === "G/L Account" ? data.description : true;
}, {
    message: "Description is required",
    path: ["description"]
})
    .refine(function (data) {
    var _a;
    return data.purchaseOrderLineType === "Fixed Asset"
        ? ((_a = data.purchaseQuantity) !== null && _a !== void 0 ? _a : 1) === 1
        : true;
}, {
    message: "Fixed Asset quantity must be 1",
    path: ["purchaseQuantity"]
});
exports.purchaseOrderPaymentValidator = zod_1.z.object({
    id: zod_1.z.string(),
    invoiceSupplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceSupplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceSupplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.purchaseOrderFinalizeValidator = zod_1.z
    .object({
    notification: zod_1.z.enum(["Email", "None"]).optional(),
    supplierContact: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    cc: zod_1.z.array(zod_1.z.string()).optional()
})
    .refine(function (data) { return (data.notification === "Email" ? data.supplierContact : true); }, {
    message: "Supplier contact is required for email",
    path: ["supplierContact"] // path of error
});
exports.purchaseOrderApprovalValidator = zod_1.z
    .object({
    approvalRequestId: zod_1.z
        .string()
        .min(1, { message: "Approval request is required" }),
    decision: zod_1.z.enum(["Approved", "Rejected"]),
    notification: zod_1.z.enum(["Email", "None"]).optional(),
    supplierContact: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    cc: zod_1.z.array(zod_1.z.string()).optional()
})
    .refine(function (data) { return (data.notification === "Email" ? data.supplierContact : true); }, {
    message: "Supplier contact is required for email",
    path: ["supplierContact"] // path of error
});
exports.selectedLineSchema = zod_1.z.object({
    leadTime: zod_1.z.number(),
    quantity: zod_1.z.number(),
    shippingCost: zod_1.z.number(),
    supplierShippingCost: zod_1.z.number(),
    supplierUnitPrice: zod_1.z.number(),
    supplierTaxAmount: zod_1.z.number(),
    unitPrice: zod_1.z.number()
});
exports.selectedLinesValidator = zod_1.z.record(zod_1.z.string(), exports.selectedLineSchema);
exports.supplierValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    readableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    supplierStatus: zod_1.z.preprocess(function (val) { return (val === "" ? undefined : val); }, zod_1.z.enum(exports.supplierStatusType).optional().nullable()),
    supplierTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountManagerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchasingContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    website: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    // defaultCc: z.array(z.string().email()).default([])
});
exports.supplierApprovalValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    readableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    supplierStatus: zod_1.z.enum(exports.supplierStatusType, {
        errorMap: function (issue, ctx) { return ({
            message: "Supplier status is required"
        }); }
    }),
    supplierTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountManagerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchasingContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    website: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    // defaultCc: z.array(z.string().email()).default([])
});
exports.supplierTaxValidator = zod_1.z
    .object({
    supplierId: zod_1.z.string().min(1),
    taxId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    vatNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    eori: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    taxExempt: zod_1.z.coerce.boolean().default(false),
    taxExemptionReason: zod_1.z.preprocess(function (val) { return (val === "" ? undefined : val); }, zod_1.z.enum(taxExemptionReasons).optional().nullable()),
    taxExemptionCertificateNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) { return !data.taxExempt || (data.taxExempt && data.taxExemptionReason); }, {
    message: "Exemption reason is required when tax exempt",
    path: ["taxExemptionReason"]
});
exports.supplierApprovalDecisionValidator = zod_1.z.object({
    approvalRequestId: zod_1.z
        .string()
        .min(1, { message: "Approval request is required" }),
    decision: zod_1.z.enum(["Approved", "Rejected"]),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.supplierContactValidator = zod_1.z.object(__assign(__assign({ id: zod_form_data_1.zfd.text(zod_1.z.string().optional()) }, validators_1.contact), { supplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()) }));
exports.supplierLocationValidator = zod_1.z.object(__assign({ id: zod_form_data_1.zfd.text(zod_1.z.string().optional()), name: zod_form_data_1.zfd.text(zod_1.z.string()) }, validators_1.address));
exports.supplierPaymentValidator = zod_1.z.object({
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    invoiceSupplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceSupplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceSupplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.supplierProcessValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    processId: zod_1.z.string().min(1, { message: "Process is required" }),
    minimumCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    leadTime: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
exports.supplierShippingValidator = zod_1.z.object({
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    shippingSupplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingSupplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingSupplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // shippingTermId: zfd.text(z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    incoterm: zod_form_data_1.zfd.text(zod_1.z.enum(shared_1.incoterms).optional()),
    incotermLocation: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.supplierAccountingValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string()),
    supplierTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.supplierTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.supplierQuoteValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierQuoteId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierQuoteType: zod_1.z.enum(exports.purchaseOrderTypeType, {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    supplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(exports.supplierQuoteStatusType).optional(),
    notes: zod_1.z.any().optional(),
    quotedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRateUpdatedAt: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.expirationDate) {
        return data.expirationDate >= (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString();
    }
    return true;
}, {
    message: "Expiration date must be today or after",
    path: ["expirationDate"] // path of error
});
exports.supplierQuoteLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierQuoteId: zod_1.z.string(),
    supplierQuoteLineType: zod_1.z.enum(__spreadArray(__spreadArray([], shared_1.methodItemType, true), ["G/L Account"], false), {
        errorMap: function () { return ({ message: "Type is required" }); }
    }),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    costCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierPartId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    inventoryUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    requiredDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_1.z.array(zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.00001, { message: "Quantity is required" })))
})
    .refine(function (data) {
    return ["Part", "Service", "Material", "Tool", "Fixture", "Consumable"].includes(data.supplierQuoteLineType)
        ? data.itemId
        : true;
}, {
    message: "Part is required",
    path: ["itemId"]
})
    .refine(function (data) {
    return data.supplierQuoteLineType === "G/L Account" ? data.accountId : true;
}, {
    message: "Account is required",
    path: ["accountId"]
})
    .refine(function (data) {
    return [
        "Part",
        "Service",
        "Material",
        "Tool",
        "Fixture",
        "Consumable",
        "G/L Account"
    ].includes(data.supplierQuoteLineType)
        ? data.description
        : true;
}, {
    message: "Description is required",
    path: ["description"]
});
exports.purchasingRfqStatusType = [
    "Draft",
    "Requested",
    "Closed"
];
exports.purchasingRfqValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    rfqId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    rfqDate: zod_1.z.string().min(1, { message: "RFQ Date is required" }),
    expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(exports.purchasingRfqStatusType).optional(),
    supplierIds: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "At least one supplier is required" })
});
exports.purchasingRfqLineValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchasingRfqId: zod_1.z.string().min(1, { message: "RFQ is required" }),
    itemId: zod_1.z.string().min(1, { message: "Part is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_1.z.array(zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.00001, { message: "Quantity is required" }))),
    purchaseUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Unit of measure is required" })),
    inventoryUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Unit of measure is required" })),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    order: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
exports.purchasingRfqSuppliersValidator = zod_1.z.object({
    purchasingRfqId: zod_1.z.string().min(1, { message: "RFQ is required" }),
    supplierIds: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "At least one supplier is required" })
});
exports.purchasingRfqFinalizeValidator = zod_1.z.object({
    suppliers: zod_1.z.array(zod_1.z.object({
        supplierId: zod_1.z.string().min(1),
        rfqSupplierId: zod_1.z.string().min(1),
        contactId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    }))
});
// RFQ Status Helpers
exports.PURCHASING_RFQ_EDITABLE_STATUSES = ["Draft"];
exports.PURCHASING_RFQ_LOCKED_STATUSES = ["Requested", "Closed"];
function isRfqEditable(status) {
    return exports.PURCHASING_RFQ_EDITABLE_STATUSES.includes(status);
}
function isRfqLocked(status) {
    return exports.PURCHASING_RFQ_LOCKED_STATUSES.includes(status);
}
// Purchase Order Locked Status Validation
/**
 * Purchase Order statuses that indicate the PO has been finalized/approved
 * and is now "locked" - meaning only privileged users can make limited edits
 */
exports.PURCHASE_ORDER_LOCKED_STATUSES = [
    "To Receive",
    "To Receive and Invoice",
    "To Invoice",
    "Completed",
    "Closed"
];
/**
 * Check if a PO status is "locked" (finalized/approved)
 */
function isPurchaseOrderLocked(status) {
    return exports.PURCHASE_ORDER_LOCKED_STATUSES.includes(status);
}
