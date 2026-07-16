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
exports.salesInvoiceLineValidator = exports.salesInvoiceShipmentValidator = exports.salesInvoicePostValidator = exports.salesInvoiceValidator = exports.purchaseInvoiceLineValidator = exports.purchaseInvoiceDeliveryValidator = exports.purchaseInvoiceValidator = exports.salesInvoiceStatusType = exports.salesInvoiceLineType = exports.purchaseInvoiceStatusType = exports.purchaseInvoiceLineType = void 0;
exports.isPurchaseInvoiceLocked = isPurchaseInvoiceLocked;
exports.isSalesInvoiceLocked = isSalesInvoiceLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_1 = require("../shared");
exports.purchaseInvoiceLineType = [
    "Style",
    "Part",
    // "Service",
    "Material",
    "Tool",
    "Consumable",
    // "Fixed Asset",
    "G/L Account",
    "Comment"
];
exports.purchaseInvoiceStatusType = [
    "Draft",
    // "Return",
    "Pending",
    "Partially Paid",
    "Open",
    "Debit Note Issued",
    "Paid",
    "Voided",
    "Overdue"
];
/**
 * Purchase Invoice is locked (non-editable) when status is anything other than Draft.
 * Once posted/confirmed, no edits are allowed regardless of permission level.
 * The only way to make changes is to reopen it to Draft first.
 */
function isPurchaseInvoiceLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
exports.salesInvoiceLineType = [
    "Style",
    "Part",
    // "Service",
    "Material",
    "Tool",
    "Consumable",
    "Fixed Asset",
    // "G/L Account",
    "Comment"
];
exports.salesInvoiceStatusType = [
    "Draft",
    // "Return",
    "Pending",
    "Partially Paid",
    "Submitted",
    "Credit Note Issued",
    "Paid",
    "Voided",
    "Overdue"
];
/**
 * Sales Invoice is locked (non-editable) when status is anything other than Draft.
 * Once posted/confirmed, no edits are allowed regardless of permission level.
 */
function isSalesInvoiceLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
exports.purchaseInvoiceValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    supplierReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    invoiceSupplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceSupplierContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceSupplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateIssued: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateDue: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierShippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRateUpdatedAt: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.purchaseInvoiceDeliveryValidator = zod_1.z.object({
    id: zod_1.z.string(),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierShippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    incoterm: zod_form_data_1.zfd.text(zod_1.z.enum(shared_1.incoterms).optional()),
    incotermLocation: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customFields: zod_1.z.any().optional()
});
exports.purchaseInvoiceLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceId: zod_1.z.string().min(1, { message: "Invoice is required" }),
    invoiceLineType: zod_1.z.enum(__spreadArray(__spreadArray([], shared_1.methodItemType, true), ["Service", "Fixture", "G/L Account", "Fixed Asset"], false), {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    purchaseOrderId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseOrderLineId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    costCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    assetId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    purchaseUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    inventoryUnitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conversionFactor: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    supplierUnitPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    supplierShippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    supplierTaxAmount: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    requiredDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional())
})
    .refine(function (data) {
    return ["Style", "Part", "Service", "Material", "Tool", "Consumable"].includes(data.invoiceLineType)
        ? data.itemId
        : true;
}, {
    message: "Item is required",
    path: ["itemId"] // path of error
})
    .refine(function (data) {
    return ["Style", "Part", "Material", "Tool", "Consumable"].includes(data.invoiceLineType)
        ? data.locationId
        : true;
}, {
    message: "Location is required",
    path: ["locationId"]
})
    .refine(function (data) { return (data.invoiceLineType === "G/L Account" ? data.accountId : true); }, {
    message: "Account is required",
    path: ["accountId"]
})
    .refine(function (data) {
    return data.invoiceLineType === "G/L Account" ? data.description : true;
}, {
    message: "Description is required",
    path: ["description"]
})
    .refine(function (data) {
    var _a;
    return data.invoiceLineType === "Fixed Asset"
        ? ((_a = data.quantity) !== null && _a !== void 0 ? _a : 1) === 1
        : true;
}, {
    message: "Fixed Asset quantity must be 1",
    path: ["quantity"]
});
exports.salesInvoiceValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    customerReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    invoiceCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateIssued: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateDue: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierShippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRateUpdatedAt: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.salesInvoicePostValidator = zod_1.z
    .object({
    notification: zod_1.z.enum(["Email", "None"]).optional(),
    customerContact: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    cc: zod_1.z.array(zod_1.z.string()).optional()
})
    .refine(function (data) { return (data.notification === "Email" ? data.customerContact : true); }, {
    message: "Customer contact is required for email",
    path: ["customerContact"] // path of error
});
exports.salesInvoiceShipmentValidator = zod_1.z.object({
    id: zod_1.z.string(),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    incoterm: zod_form_data_1.zfd.text(zod_1.z.enum(shared_1.incoterms).optional()),
    incotermLocation: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customFields: zod_1.z.any().optional()
});
exports.salesInvoiceLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceId: zod_1.z.string().min(1, { message: "Invoice is required" }),
    invoiceLineType: zod_1.z.enum(__spreadArray(__spreadArray([], shared_1.methodItemType, true), ["Service", "Fixture", "Fixed Asset"], false), {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    methodType: zod_1.z
        .enum(shared_1.methodType, {
        errorMap: function (issue, ctx) { return ({
            message: "Method is required"
        }); }
    })
        .optional(),
    purchaseOrderId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    purchaseOrderLineId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    assetId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    addOnCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    nonTaxableAddOnCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().default("EA")),
    unitPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    shippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    taxPercent: zod_form_data_1.zfd.numeric(zod_1.z.number().optional().default(0)),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional())
})
    .refine(function (data) {
    return ["Style", "Part", "Service", "Material", "Tool", "Consumable"].includes(data.invoiceLineType)
        ? data.itemId
        : true;
}, {
    message: "Item is required",
    path: ["itemId"]
})
    .refine(function (data) {
    return ["Style", "Part", "Material", "Tool", "Consumable"].includes(data.invoiceLineType)
        ? data.locationId
        : true;
}, {
    message: "Location is required",
    path: ["locationId"]
})
    .refine(function (data) {
    if (data.invoiceLineType === "Fixed Asset")
        return true;
    return !!data.methodType;
}, {
    message: "Method is required",
    path: ["methodType"]
})
    .refine(function (data) {
    var _a;
    return data.invoiceLineType === "Fixed Asset"
        ? ((_a = data.quantity) !== null && _a !== void 0 ? _a : 1) === 1
        : true;
}, {
    message: "Fixed Asset quantity must be 1",
    path: ["quantity"]
});
