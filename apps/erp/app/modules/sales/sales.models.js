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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALES_ORDER_LOCKED_STATUSES = exports.selectedLinesValidator = exports.selectedLineSchema = exports.salesRfqLineValidator = exports.salesRfqDragValidator = exports.salesRfqValidator = exports.salesOrderReleaseValidator = exports.salesOrderPaymentValidator = exports.salesOrderLineValidator = exports.salesOrderShipmentValidator = exports.salesOrderValidator = exports.salesConfirmValidator = exports.salesOrderStatusType = exports.salesOrderLineType = exports.quoteShipmentValidator = exports.quotePaymentValidator = exports.quoteFinalizeValidator = exports.quoteOperationValidator = exports.quoteMaterialValidator = exports.quoteLineValidator = exports.quoteLineCategoryMarkupsValidator = exports.costCategoryKeys = exports.quoteLineAdditionalChargesValidator = exports.quoteValidator = exports.quoteStatusType = exports.quoteLineStatusType = exports.pricingRuleValidator = exports.pricingRuleAmountTypes = exports.pricingRuleTypes = exports.priceResolutionInputValidator = exports.duplicatePriceListValidator = exports.priceOverrideValidator = exports.priceOverrideBreaksValidator = exports.priceOverrideBreakValidator = exports.customerPortalValidator = exports.noQuoteReasonValidator = exports.getMethodValidator = exports.externalQuoteValidator = exports.customerTypeValidator = exports.customerStatusValidator = exports.customerShippingValidator = exports.customerPaymentValidator = exports.customerTaxValidator = exports.taxExemptionReasons = exports.customerValidator = exports.customerLocationValidator = exports.customerContactValidator = exports.customerAccountingValidator = exports.salesRFQStatusType = exports.KPIs = void 0;
exports.isSalesOrderLocked = isSalesOrderLocked;
exports.isSalesRfqLocked = isSalesRfqLocked;
exports.isQuoteLocked = isQuoteLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var validators_1 = require("~/types/validators");
var accounting_1 = require("../accounting");
var operationType_1 = require("../production/operationType");
var shared_1 = require("../shared");
exports.KPIs = [
    {
        key: "quoteCount",
        label: "Quotes"
    },
    {
        key: "rfqCount",
        label: "RFQs"
    },
    {
        key: "salesFunnel",
        label: "Sales Funnel"
    },
    {
        key: "salesOrderCount",
        label: "Sales Orders"
    },
    {
        key: "salesOrderRevenue",
        label: "Sales Revenue"
    }
    // {
    //   key: "turnaroundTime",
    //   label: "Turnaround Time",
    // },
];
exports.salesRFQStatusType = [
    "Draft",
    "Ready for Quote",
    "Quoted",
    "Closed"
];
exports.customerAccountingValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string()),
    customerTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.customerContactValidator = zod_1.z.object(__assign(__assign({ id: zod_form_data_1.zfd.text(zod_1.z.string().optional()) }, validators_1.contact), { customerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()) }));
exports.customerLocationValidator = zod_1.z.object(__assign({ id: zod_form_data_1.zfd.text(zod_1.z.string().optional()), name: zod_form_data_1.zfd.text(zod_1.z.string()) }, validators_1.address));
exports.customerValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    readableId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    customerStatusId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountManagerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    taxPercent: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(1, { message: "Tax percent must be between 0 and 1" })),
    salesContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    website: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    // defaultCc: z.array(z.string().email()).default([])
});
exports.taxExemptionReasons = [
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
exports.customerTaxValidator = zod_1.z
    .object({
    customerId: zod_1.z.string().min(1),
    taxId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    vatNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    eori: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    taxExempt: zod_1.z.coerce.boolean().default(false),
    taxExemptionReason: zod_1.z.preprocess(function (val) { return (val === "" ? undefined : val); }, zod_1.z.enum(exports.taxExemptionReasons).optional().nullable()),
    taxExemptionCertificateNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) { return !data.taxExempt || (data.taxExempt && data.taxExemptionReason); }, {
    message: "Exemption reason is required when tax exempt",
    path: ["taxExemptionReason"]
});
exports.customerPaymentValidator = zod_1.z.object({
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    invoiceCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.customerShippingValidator = zod_1.z.object({
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    shippingCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingCustomerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingCustomerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // shippingTermId: zfd.text(z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    incoterm: zod_form_data_1.zfd.text(zod_1.z.enum(shared_1.incoterms).optional()),
    incotermLocation: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.customerStatusValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.customerTypeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.externalQuoteValidator = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.literal("accept"),
        digitalQuoteAcceptedBy: zod_1.z.string().min(1, { message: "Name is required" }),
        digitalQuoteAcceptedByEmail: zod_1.z
            .string()
            .email({ message: "Email is invalid" })
    }),
    zod_1.z.object({
        type: zod_1.z.literal("reject"),
        digitalQuoteRejectedBy: zod_1.z.string().min(1, { message: "Name is required" }),
        digitalQuoteRejectedByEmail: zod_1.z
            .string()
            .email({ message: "Email is invalid" })
    })
]);
exports.getMethodValidator = zod_1.z.object({
    type: zod_1.z.enum(["item", "quoteLine", "method", "quoteToQuote"]),
    sourceId: zod_1.z.string().min(1, { message: "Please select a source method" }),
    targetId: zod_1.z.string().min(1, { message: "Please select a target method" }),
    billOfMaterial: zod_form_data_1.zfd.checkbox(),
    billOfProcess: zod_form_data_1.zfd.checkbox(),
    parameters: zod_form_data_1.zfd.checkbox(),
    tools: zod_form_data_1.zfd.checkbox(),
    steps: zod_form_data_1.zfd.checkbox(),
    workInstructions: zod_form_data_1.zfd.checkbox()
});
exports.noQuoteReasonValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.customerPortalValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerId: zod_1.z.string().min(1, { message: "Customer is required" })
});
exports.priceOverrideBreakValidator = zod_1.z.object({
    id: zod_1.z.string().optional(),
    quantity: zod_1.z.number().nonnegative(),
    overridePrice: zod_1.z.number().nonnegative(),
    active: zod_1.z.boolean().default(true)
});
exports.priceOverrideBreaksValidator = zod_1.z
    .array(exports.priceOverrideBreakValidator)
    .min(1, { message: "At least one break is required" })
    .refine(function (b) { return new Set(b.map(function (x) { return x.quantity; })).size === b.length; }, {
    message: "Duplicate quantity across breaks"
});
exports.priceOverrideValidator = zod_1.z
    .object({
    id: zod_1.z.string().optional(),
    itemId: zod_1.z.string().min(1),
    customerId: zod_1.z.string().optional(),
    customerTypeId: zod_1.z.string().optional(),
    active: zod_form_data_1.zfd.checkbox(),
    applyRulesOnTop: zod_form_data_1.zfd.checkbox(),
    validFrom: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    validTo: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (d) { return !(d.customerId && d.customerTypeId); }, {
    message: "Cannot set both Customer and Customer Type",
    path: ["customerId"]
})
    .refine(function (d) { return !d.validFrom || !d.validTo || d.validFrom <= d.validTo; }, {
    message: "Valid From must be on or before Valid To",
    path: ["validTo"]
});
exports.duplicatePriceListValidator = zod_1.z
    .object({
    sourceCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sourceCustomerTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    targetCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    targetCustomerTypeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conflictStrategy: zod_1.z.enum(["skip", "overwrite"]),
    overrideIds: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (d) { return d.targetCustomerId || d.targetCustomerTypeId; }, {
    message: "Please select a target scope",
    path: ["targetCustomerId"]
});
exports.priceResolutionInputValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1),
    quantity: zod_1.z.number().nonnegative(),
    customerId: zod_1.z.string().optional(),
    customerTypeId: zod_1.z.string().optional(),
    itemPostingGroupId: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    existingBasePrice: zod_1.z.number().optional()
});
exports.pricingRuleTypes = ["Discount", "Markup"];
exports.pricingRuleAmountTypes = ["Percentage", "Fixed"];
exports.pricingRuleValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    ruleType: zod_1.z.enum(exports.pricingRuleTypes),
    amountType: zod_1.z.enum(exports.pricingRuleAmountTypes),
    amount: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    minQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    maxQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    customerIds: zod_1.z.array(zod_1.z.string()).optional().default([]),
    customerTypeIds: zod_1.z.array(zod_1.z.string()).optional().default([]),
    itemIds: zod_1.z.array(zod_1.z.string()).optional().nullable().default([]),
    itemPostingGroupId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    validFrom: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    validTo: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    priority: zod_form_data_1.zfd.numeric(zod_1.z.number().int().min(0).optional().default(0)),
    active: zod_form_data_1.zfd.checkbox()
})
    .refine(function (d) { return d.amountType !== "Percentage" || d.amount <= 1; }, {
    message: "Percentage must be between 0% and 100%",
    path: ["amount"]
})
    .refine(function (d) { return !d.validFrom || !d.validTo || d.validFrom <= d.validTo; }, {
    message: "Valid From must be on or before Valid To",
    path: ["validTo"]
});
exports.quoteLineStatusType = [
    "Not Started",
    "In Progress",
    "Complete",
    "No Quote"
];
exports.quoteStatusType = [
    "Draft",
    "Sent",
    "Ordered",
    "Partial",
    "Lost",
    "Cancelled",
    "Expired"
];
exports.quoteValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quoteId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesPersonId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    estimatorId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    customerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerEngineeringContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    status: zod_1.z.enum(exports.quoteStatusType).optional(),
    notes: zod_1.z.any().optional(),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRateUpdatedAt: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    digitalQuoteAcceptedBy: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    digitalQuoteAcceptedByEmail: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.quoteLineAdditionalChargesValidator = zod_1.z.record(zod_1.z.object({
    description: zod_1.z.string(),
    amounts: zod_1.z.record(zod_1.z.number()),
    taxable: zod_1.z.boolean().default(true)
}));
exports.costCategoryKeys = [
    "materialCost",
    "partCost",
    "toolCost",
    "consumableCost",
    "serviceCost",
    "laborCost",
    "machineCost",
    "overheadCost",
    "outsideCost"
];
exports.quoteLineCategoryMarkupsValidator = zod_1.z
    .record(zod_1.z.number().min(0))
    .default({});
exports.quoteLineValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quoteId: zod_1.z.string(),
    itemId: zod_1.z.string().min(1, { message: "Part is required" }),
    status: zod_1.z.enum(exports.quoteLineStatusType, {
        errorMap: function () { return ({ message: "Status is required" }); }
    }),
    estimatorId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    methodType: zod_1.z.enum(shared_1.methodType, {
        errorMap: function () { return ({ message: "Method is required" }); }
    }),
    customerPartId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerPartRevision: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Unit of measure is required" })),
    quantity: zod_1.z.array(zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.00001, { message: "Quantity is required" }))),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    noQuoteReason: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    taxPercent: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(1, { message: "Tax percent must be between 0 and 1" })),
    configuration: zod_1.z.any().optional()
});
exports.quoteMaterialValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1, { message: "Material ID is required" }),
    quoteMakeMethodId: zod_1.z
        .string()
        .min(1, { message: "Make method is required" }),
    order: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
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
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    quoteOperationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of Measure is required" })
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
exports.quoteOperationValidator = zod_1.z
    .object({
    id: zod_1.z.string().min(1, { message: "Operation ID is required" }),
    quoteMakeMethodId: zod_1.z
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
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
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
exports.quoteFinalizeValidator = zod_1.z
    .object({
    notification: zod_1.z.enum(["Email", "None"]).optional(),
    customerContact: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    cc: zod_1.z.array(zod_1.z.string()).optional()
})
    .refine(function (data) { return (data.notification === "Email" ? data.customerContact : true); }, {
    message: "Supplier contact is required for email",
    path: ["customerContact"] // path of error
});
exports.quotePaymentValidator = zod_1.z.object({
    id: zod_1.z.string(),
    invoiceCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.quoteShipmentValidator = zod_1.z.object({
    id: zod_1.z.string(),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingMethodId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    receiptRequestedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    incoterm: zod_form_data_1.zfd.text(zod_1.z.enum(shared_1.incoterms).optional()),
    incotermLocation: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.salesOrderLineType = [
    "Part",
    // "Service",
    "Material",
    "Tool",
    "Consumable",
    "Comment",
    "Fixed Asset"
];
exports.salesOrderStatusType = [
    "Draft",
    "In Progress",
    "Needs Approval",
    // "Confirmed",
    "To Ship and Invoice",
    "To Ship",
    "To Invoice",
    "Completed",
    // "Invoiced",
    "Cancelled",
    "Closed"
];
exports.salesConfirmValidator = zod_1.z
    .object({
    notification: zod_1.z.enum(["Email", "None"]).optional(),
    customerContact: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    cc: zod_1.z.array(zod_1.z.string()).optional()
})
    .refine(function (data) { return (data.notification === "Email" ? data.customerContact : true); }, {
    message: "Customer contact is required for email",
    path: ["customerContact"] // path of error
});
exports.salesOrderValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesOrderId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    orderDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    requestedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    promisedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(exports.salesOrderStatusType).optional(),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    customerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerEngineeringContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quoteId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    currencyCode: zod_form_data_1.zfd.text(zod_1.z.string()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRateUpdatedAt: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesPersonId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.salesOrderShipmentValidator = zod_1.z
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
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    supplierLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
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
    message: "Drop shipment requires supplier and location",
    path: ["dropShipment"] // path of error
});
exports.salesOrderLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesOrderId: zod_1.z.string().min(1, { message: "Order is required" }),
    salesOrderLineType: zod_1.z.enum(exports.salesOrderLineType, {
        errorMap: function (issue, ctx) { return ({
            message: "Type is required"
        }); }
    }),
    accountId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shippingCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    addOnCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    nonTaxableAddOnCost: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    assetId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(0, { message: "Location is required" }),
    methodType: zod_1.z
        .enum(shared_1.methodType, {
        errorMap: function () { return ({ message: "Method is required" }); }
    })
        .optional(),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    promisedDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    saleQuantity: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    serviceId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    setupPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    taxPercent: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0)
        .max(1, { message: "Tax percent must be between 0 and 1" })),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    unitPrice: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().optional())
})
    .refine(function (data) { return (data.salesOrderLineType === "Part" ? data.itemId : true); }, {
    message: "Part is required",
    path: ["itemId"] // path of error
})
    .refine(function (data) { return (data.salesOrderLineType === "Comment" ? data.description : true); }, {
    message: "Comment is required",
    path: ["description"] // path of error
})
    .refine(function (data) {
    if (data.salesOrderLineType !== "Comment" &&
        data.salesOrderLineType !== "Fixed Asset") {
        return !!data.itemId;
    }
    return true;
}, {
    message: "Item is required for this line type",
    path: ["itemId"]
})
    .refine(function (data) {
    if (data.salesOrderLineType !== "Comment" &&
        data.salesOrderLineType !== "Fixed Asset" &&
        !data.methodType) {
        return false;
    }
    return true;
}, {
    message: "Method type is required",
    path: ["methodType"]
})
    .refine(function (data) {
    var _a;
    return data.salesOrderLineType === "Fixed Asset"
        ? ((_a = data.saleQuantity) !== null && _a !== void 0 ? _a : 1) === 1
        : true;
}, {
    message: "Fixed Asset quantity must be 1",
    path: ["saleQuantity"]
});
exports.salesOrderPaymentValidator = zod_1.z.object({
    id: zod_1.z.string(),
    invoiceCustomerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    invoiceCustomerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentTermId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    paymentComplete: zod_form_data_1.zfd.checkbox(),
    currencyCode: zod_1.z.enum(accounting_1.currencyCodes).optional()
});
exports.salesOrderReleaseValidator = zod_1.z
    .object({
    notification: zod_1.z.enum(["Email", "None"]).optional(),
    customerContact: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) { return (data.notification === "Email" ? data.customerContact : true); }, {
    message: "Customer contact is required for email",
    path: ["customerContact"] // path of error
});
exports.salesRfqValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    rfqId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerLocationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerEngineeringContactId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    customerId: zod_1.z.string().min(1, { message: "Customer is required" }),
    customerReference: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    expirationDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    externalNotes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    internalNotes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    rfqDate: zod_1.z.string().min(1, { message: "Order Date is required" }),
    status: zod_1.z.enum(exports.salesRFQStatusType).optional(),
    salesPersonId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.salesRfqDragValidator = zod_1.z.object({
    id: zod_1.z.string(),
    customerPartId: zod_1.z.string(),
    is3DModel: zod_1.z.boolean().optional(),
    size: zod_1.z.number().optional(),
    lineId: zod_1.z.string().optional(),
    path: zod_1.z.string(),
    salesRfqId: zod_1.z.string()
});
exports.salesRfqLineValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    salesRfqId: zod_1.z.string().min(1, { message: "RFQ is required" }),
    customerPartId: zod_1.z.string().min(1, { message: "Part Number is required" }),
    customerPartRevision: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_1.z.array(zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.00001, { message: "Quantity is required" }))),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" }),
    order: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.selectedLineSchema = zod_1.z.object({
    addOn: zod_1.z.number().optional(),
    convertedAddOn: zod_1.z.number().optional(),
    taxableAddOn: zod_1.z.number().optional(),
    convertedTaxableAddOn: zod_1.z.number().optional(),
    convertedNetUnitPrice: zod_1.z.number(),
    convertedShippingCost: zod_1.z.number(),
    leadTime: zod_1.z.number(),
    netUnitPrice: zod_1.z.number(),
    quantity: zod_1.z.number(),
    shippingCost: zod_1.z.number()
});
exports.selectedLinesValidator = zod_1.z.record(zod_1.z.string(), exports.selectedLineSchema);
// Sales Order Locked Status
exports.SALES_ORDER_LOCKED_STATUSES = [
    "To Ship and Invoice",
    "To Ship",
    "To Invoice",
    "Completed",
    "Cancelled",
    "Closed"
];
function isSalesOrderLocked(status) {
    return exports.SALES_ORDER_LOCKED_STATUSES.includes(status);
}
// Sales RFQ Locked Status
function isSalesRfqLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
// Quote Locked Status
function isQuoteLocked(status) {
    return status !== null && status !== undefined && status !== "Draft";
}
