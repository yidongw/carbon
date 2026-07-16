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
exports.lastNameFirstSettingsValidator = exports.documentSectionValidator = exports.documentTemplateValidator = exports.timeCardSettingsValidator = exports.accountsReceivableBillingAddressValidator = exports.accountsPayableBillingAddressValidator = exports.quoteLineCategoryMarkupsSettingsValidator = exports.consoleSettingsValidator = exports.webhookValidator = exports.themeValidator = exports.themes = exports.sequenceValidator = exports.subsidiaryValidator = exports.defaultCustomerCcValidator = exports.accountsReceivableEmailValidator = exports.defaultSupplierCcValidator = exports.accountsPayableEmailValidator = exports.supplierQuoteNotificationValidator = exports.maintenanceDispatchNotificationValidator = exports.suggestionNotificationValidator = exports.rfqReadyValidator = exports.productLabelSizeValidator = exports.updateAssignmentValidator = exports.printerRouteValidator = exports.materialUnitsValidator = exports.materialIdsValidator = exports.maintenanceSettingsValidator = exports.updateLeadTimesOnReceiptValidator = exports.shelfLifeSettingsValidator = exports.expiredEntityPolicies = exports.calculatedShelfLifeInputScopes = exports.purchasePriceUpdateTimingValidator = exports.kanbanOutputValidator = exports.jobCompletedValidator = exports.digitalQuoteValidator = exports.customFieldValidator = exports.onboardingCompanyValidator = exports.companyValidator = exports.apiKeyValidator = exports.apiKeyPermissionModules = exports.purchasePriceUpdateTimingTypes = exports.kanbanOutputTypes = exports.modulesType = void 0;
var template_1 = require("@carbon/documents/template");
var utils_1 = require("@carbon/utils");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_1 = require("~/modules/shared");
var zodFields_1 = require("~/utils/zodFields");
exports.modulesType = [
    "Accounting",
    // "Documents",
    "Invoicing",
    "Inventory",
    "Items",
    "Production",
    "Purchasing",
    "Quality",
    "Resources",
    "Sales",
    "Users"
];
exports.kanbanOutputTypes = ["label", "qrcode", "url"];
exports.purchasePriceUpdateTimingTypes = [
    "Purchase Invoice Post",
    "Purchase Order Finalize"
];
/** All permission modules with their available CRUD actions */
exports.apiKeyPermissionModules = {
    accounting: ["view", "create", "update"],
    documents: ["view", "create", "update", "delete"],
    inventory: ["view", "create", "update", "delete"],
    invoicing: ["view", "create", "update", "delete"],
    parts: ["view", "create", "update", "delete"],
    people: ["view", "create", "update", "delete"],
    production: ["view", "create", "update", "delete"],
    purchasing: ["view", "create", "update", "delete"],
    quality: ["view", "create", "update", "delete"],
    resources: ["view", "create", "update", "delete"],
    sales: ["view", "create", "update", "delete"],
    settings: ["view", "create", "update", "delete"],
    users: ["view", "create", "update", "delete"]
};
exports.apiKeyValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    scopes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    expiresAt: zod_form_data_1.zfd.text(zod_1.z
        .string()
        .optional()
        .refine(function (val) { return !val || new Date(val) > new Date(); }, {
        message: "Expiration date must be in the future"
    }))
});
var company = {
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    taxId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    addressLine1: zod_1.z.string().min(1, { message: "Address is required" }),
    addressLine2: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    city: zod_1.z.string().min(1, { message: "City is required" }),
    stateProvince: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    postalCode: zod_1.z.string().min(1, { message: "Postal Code is required" }),
    countryCode: zod_1.z.string().min(1, { message: "Country is required" }),
    baseCurrencyCode: zod_form_data_1.zfd.text(zod_1.z.string()),
    phone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    fax: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    email: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    website: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    vatNumber: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    eori: zod_form_data_1.zfd.text(zod_1.z.string().optional())
};
exports.companyValidator = zod_1.z.object(company);
exports.onboardingCompanyValidator = zod_1.z.object(__assign(__assign({}, company), { 
    // Address is not collected during onboarding; it can be filled in later.
    // The location table requires these columns to be non-null, so default to "".
    addressLine1: zod_1.z.string().default(""), city: zod_1.z.string().default(""), stateProvince: zod_1.z.string().default(""), postalCode: zod_1.z.string().default(""), countryCode: zod_1.z.string().default(""), next: zod_1.z.string().min(1, { message: "Next is required" }) }));
exports.customFieldValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    table: zod_1.z.string().min(1, { message: "Table is required" }),
    dataTypeId: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1, { message: "Data type is required" })),
    listOptions: zodFields_1.optionalRequiredStringArray,
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    required: zod_form_data_1.zfd.checkbox()
})
    .refine(function (input) {
    // allows bar to be optional only when foo is 'foo'
    if (input.dataTypeId === shared_1.DataType.List &&
        (input.listOptions === undefined ||
            input.listOptions.length === 0 ||
            input.listOptions.some(function (option) { return option.length === 0; })))
        return false;
    return true;
});
exports.digitalQuoteValidator = zod_1.z.object({
    digitalQuoteEnabled: zod_form_data_1.zfd.checkbox(),
    digitalQuoteNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional(),
    digitalQuoteIncludesPurchaseOrders: zod_form_data_1.zfd.checkbox()
});
exports.jobCompletedValidator = zod_1.z.object({
    inventoryJobCompletedNotificationGroup: zod_1.z.array(zod_1.z.string()).optional(),
    salesJobCompletedNotificationGroup: zod_1.z.array(zod_1.z.string()).optional()
});
exports.kanbanOutputValidator = zod_1.z.object({
    kanbanOutput: zod_1.z.enum(exports.kanbanOutputTypes)
});
exports.purchasePriceUpdateTimingValidator = zod_1.z.object({
    purchasePriceUpdateTiming: zod_1.z.enum(exports.purchasePriceUpdateTimingTypes)
});
exports.calculatedShelfLifeInputScopes = [
    "AllInputs",
    "ManagedInputsOnly"
];
exports.expiredEntityPolicies = [
    "Warn",
    "Block",
    "BlockWithOverride"
];
// Every shelf-life knob lives inside the companySettings.inventoryShelfLife
// JSONB blob. The validator below reads/writes that single object so the
// settings form can submit one cohesive structure.
exports.shelfLifeSettingsValidator = zod_1.z.object({
    // Empty input -> undefined -> persisted as null in JSONB, which disables
    // expiry badges company-wide. Any value 0..365 drives the amber
    // "expiring soon" badge plus the red "expired" badge.
    nearExpiryWarningDays: zod_form_data_1.zfd.numeric(zod_1.z.number().int().min(0).max(365).optional()),
    // Seed value for the "Shelf-life (days)" input when a new item is first
    // configured for Fixed Duration. Defaults to 7.
    defaultShelfLifeDays: zod_form_data_1.zfd.numeric(zod_1.z.number().int().min(1).max(3650).default(7)),
    // Calculated-mode MIN expiry scope. 'AllInputs' = MIN over every input
    // carrying an expiry (food/perishable default). 'ManagedInputsOnly' =
    // only inputs whose own item has a Fixed Duration / Calculated policy
    // (excludes supplier-set Set-on-Receipt expiries).
    calculatedInputScope: zod_1.z
        .enum(exports.calculatedShelfLifeInputScopes)
        .default("AllInputs"),
    // What happens when an operator tries to consume an expired tracked
    // entity. 'Warn' lets it through with a banner; 'Block' rejects;
    // 'BlockWithOverride' rejects unless the caller has inventory:update
    // and supplies an override reason that gets audit-logged.
    expiredEntityPolicy: zod_1.z.enum(exports.expiredEntityPolicies).default("Block")
});
exports.updateLeadTimesOnReceiptValidator = zod_1.z.object({
    updateLeadTimesOnReceipt: zod_form_data_1.zfd.checkbox()
});
exports.maintenanceSettingsValidator = zod_1.z.object({
    maintenanceGenerateInAdvance: zod_form_data_1.zfd.checkbox(),
    maintenanceAdvanceDays: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1).max(90).default(7))
});
exports.materialIdsValidator = zod_1.z.object({
    materialGeneratedIds: zod_form_data_1.zfd.checkbox()
});
exports.materialUnitsValidator = zod_1.z.object({
    useMetric: zod_form_data_1.zfd.checkbox()
});
var printing_1 = require("@carbon/printing");
Object.defineProperty(exports, "printerRouteValidator", { enumerable: true, get: function () { return printing_1.printerRouteValidator; } });
Object.defineProperty(exports, "updateAssignmentValidator", { enumerable: true, get: function () { return printing_1.updateAssignmentValidator; } });
exports.productLabelSizeValidator = zod_1.z.object({
    productLabelSize: zod_1.z.enum(utils_1.labelSizes.map(function (size) { return size.id; }), {
        message: "Product label size is required"
    })
});
exports.rfqReadyValidator = zod_1.z.object({
    rfqReadyNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional()
});
exports.suggestionNotificationValidator = zod_1.z.object({
    suggestionNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional()
});
exports.maintenanceDispatchNotificationValidator = zod_1.z.object({
    maintenanceDispatchNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional(),
    qualityDispatchNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional(),
    operationsDispatchNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional(),
    otherDispatchNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional()
});
exports.supplierQuoteNotificationValidator = zod_1.z.object({
    supplierQuoteNotificationGroup: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .optional()
});
exports.accountsPayableEmailValidator = zod_1.z.object({
    accountsPayableEmail: zod_form_data_1.zfd.text(zod_1.z.string().email().optional())
});
exports.defaultSupplierCcValidator = zod_1.z.object({
    defaultSupplierCc: zod_1.z.array(zod_1.z.string().email()).optional()
});
exports.accountsReceivableEmailValidator = zod_1.z.object({
    accountsReceivableEmail: zod_form_data_1.zfd.text(zod_1.z.string().email().optional())
});
exports.defaultCustomerCcValidator = zod_1.z.object({
    defaultCustomerCc: zod_1.z.array(zod_1.z.string().email()).optional()
});
exports.subsidiaryValidator = zod_1.z.object(__assign(__assign({}, company), { id: zod_form_data_1.zfd.text(zod_1.z.string().optional()), parentCompanyId: zod_form_data_1.zfd.text(zod_1.z.string().optional()) }));
exports.sequenceValidator = zod_1.z.object({
    table: zod_1.z.string().min(1, { message: "Table is required" }),
    prefix: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    suffix: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    next: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    step: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    size: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1).max(20))
});
exports.themes = [
    "zinc",
    "neutral",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "violet"
];
exports.themeValidator = zod_1.z.object({
    next: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    theme: zod_1.z.enum(exports.themes, {
        errorMap: function (issue, ctx) { return ({ message: "Theme is required" }); }
    })
});
exports.webhookValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    table: zod_1.z.string().min(1, { message: "Table is required" }),
    url: zod_1.z.string().url({ message: "Must be a valid URL" }),
    onInsert: zod_form_data_1.zfd.checkbox(),
    onUpdate: zod_form_data_1.zfd.checkbox(),
    onDelete: zod_form_data_1.zfd.checkbox(),
    active: zod_form_data_1.zfd.checkbox()
})
    .refine(function (input) {
    if (input.onInsert || input.onUpdate || input.onDelete)
        return true;
    return false;
}, {
    message: "At least one action is required",
    path: ["onDelete"]
});
exports.consoleSettingsValidator = zod_1.z.object({
    consoleEnabled: zod_form_data_1.zfd.checkbox()
});
exports.quoteLineCategoryMarkupsSettingsValidator = zod_1.z.object({
    materialCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    partCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    toolCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    consumableCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    laborCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    machineCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    overheadCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0)),
    outsideCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).default(0))
});
var billingAddress = {
    name: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    addressLine1: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    addressLine2: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    city: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    state: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    postalCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    countryCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    phone: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    fax: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    email: zod_form_data_1.zfd.text(zod_1.z.string().email().optional())
};
exports.accountsPayableBillingAddressValidator = zod_1.z.object(billingAddress);
exports.accountsReceivableBillingAddressValidator = zod_1.z.object(billingAddress);
exports.timeCardSettingsValidator = zod_1.z.object({
    timeCardEnabled: zod_form_data_1.zfd.checkbox()
});
// The editor submits the block list as a JSON string in a hidden field; we
// parse it and validate every block against the shared schema.
var jsonField = function (schema, message) {
    return zod_form_data_1.zfd.text(zod_1.z.string().transform(function (value, ctx) {
        try {
            return schema.parse(JSON.parse(value));
        }
        catch (_a) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: message });
            return zod_1.z.NEVER;
        }
    }));
};
exports.documentTemplateValidator = zod_form_data_1.zfd.formData({
    documentType: zod_form_data_1.zfd.text(template_1.documentTemplateTypeSchema),
    blocks: jsonField(zod_1.z.array(template_1.blockSchema), "Invalid document template blocks"),
    theme: jsonField(template_1.themeSchema, "Invalid document theme"),
    settings: jsonField(template_1.documentSettingsSchema, "Invalid document settings"),
    headerSectionId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    footerSectionId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // Header layout config (logo) is edited inline and saved with the template;
    // the action upserts it onto the referenced header section.
    headerConfig: jsonField(template_1.sectionConfigSchema, "Invalid header config").optional()
});
exports.documentSectionValidator = zod_form_data_1.zfd.formData({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_form_data_1.zfd.text(zod_1.z.string().min(1)),
    placement: zod_form_data_1.zfd.text(template_1.documentSectionPlacementSchema),
    content: jsonField(zod_1.z.any(), "Invalid section content"),
    config: jsonField(template_1.sectionConfigSchema, "Invalid section config").optional()
});
exports.lastNameFirstSettingsValidator = zod_1.z.object({
    lastNameFirst: zod_form_data_1.zfd.checkbox()
});
