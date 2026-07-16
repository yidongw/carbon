"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryAdjustmentSchema = exports.ItemSchema = exports.PurchaseOrderSchema = exports.PurchaseOrderLineSchema = exports.BillSchema = exports.BillLineSchema = exports.SalesInvoiceSchema = exports.SalesInvoiceLineSchema = exports.SalesOrderSchema = exports.SalesOrderLineSchema = exports.EmployeeSchema = exports.ContactSchema = exports.ProviderIntegrationMetadataSchema = exports.SyncConfigSchema = exports.DEFAULT_SYNC_CONFIG = exports.ENTITY_DEFINITIONS = exports.AccountingSyncSchema = exports.SyncDirectionSchema = exports.ProviderCredentialsSchema = exports.ProviderID = void 0;
exports.validateSyncConfig = validateSyncConfig;
var zod_1 = require("zod");
function withNullable(schema) {
    return zod_1.default.preprocess(function (v) { return (v === undefined ? null : v); }, schema.nullish());
}
var ProviderID;
(function (ProviderID) {
    ProviderID["XERO"] = "xero";
    // QUICKBOOKS = "quickbooks"
    // SAGE = "sage",
})(ProviderID || (exports.ProviderID = ProviderID = {}));
/**
 * Schemas for shared provider entities and credentials.
 */
exports.ProviderCredentialsSchema = zod_1.default.discriminatedUnion("type", [
    zod_1.default.object({
        type: zod_1.default.literal("oauth2"),
        accessToken: zod_1.default.string(),
        refreshToken: zod_1.default.string().optional(),
        expiresAt: zod_1.default.string().datetime().optional(),
        scope: zod_1.default.array(zod_1.default.string()).optional(),
        tenantId: zod_1.default.string().optional(),
        tenantName: zod_1.default.string().optional()
    })
]);
/**
 * Direction of data flow.
 */
exports.SyncDirectionSchema = zod_1.default.enum([
    "two-way",
    "push-to-accounting",
    "pull-from-accounting"
]);
exports.AccountingSyncSchema = zod_1.default.object({
    companyId: zod_1.default.string(),
    provider: zod_1.default.nativeEnum(ProviderID),
    syncType: zod_1.default.enum(["webhook", "scheduled", "trigger"]),
    syncDirection: exports.SyncDirectionSchema,
    entities: zod_1.default.array(zod_1.default.custom()),
    metadata: zod_1.default.record(zod_1.default.any()).optional()
});
exports.ENTITY_DEFINITIONS = {
    customer: {
        label: "Customers",
        type: "master",
        supportedDirections: [
            "two-way",
            "push-to-accounting",
            "pull-from-accounting"
        ]
    },
    vendor: {
        label: "Vendors",
        type: "master",
        supportedDirections: [
            "two-way",
            "push-to-accounting",
            "pull-from-accounting"
        ]
    },
    item: {
        label: "Items / Products",
        type: "master",
        supportedDirections: ["two-way", "push-to-accounting"]
    },
    employee: {
        label: "Employees",
        type: "master",
        supportedDirections: ["two-way", "push-to-accounting"]
    },
    purchaseOrder: {
        label: "Purchase Orders",
        type: "transaction",
        dependsOn: ["vendor", "item"],
        supportedDirections: ["push-to-accounting"]
    },
    bill: {
        label: "Bills (Purchase Invoices)",
        type: "transaction",
        dependsOn: ["vendor", "item"],
        supportedDirections: ["two-way", "push-to-accounting"]
    },
    salesOrder: {
        label: "Sales Orders",
        type: "transaction",
        dependsOn: ["customer", "item"],
        supportedDirections: ["push-to-accounting"]
    },
    invoice: {
        label: "Sales Invoices",
        type: "transaction",
        dependsOn: ["customer", "item"],
        supportedDirections: ["two-way", "push-to-accounting"]
    },
    payment: {
        label: "Payments",
        type: "transaction",
        dependsOn: ["invoice", "bill"],
        supportedDirections: ["pull-from-accounting"]
    },
    inventoryAdjustment: {
        label: "Inventory Adjustments",
        type: "transaction",
        dependsOn: ["item"],
        supportedDirections: ["push-to-accounting"]
    }
};
/**
 * Default Safe Configuration
 */
exports.DEFAULT_SYNC_CONFIG = {
    entities: {
        customer: {
            enabled: true,
            direction: "two-way",
            owner: "accounting"
        },
        vendor: { enabled: true, direction: "two-way", owner: "accounting" },
        item: { enabled: true, direction: "push-to-accounting", owner: "carbon" },
        employee: {
            enabled: false, // https://developer.xero.com/documentation/api/accounting/employees
            direction: "two-way",
            owner: "carbon"
        },
        purchaseOrder: {
            enabled: true,
            direction: "push-to-accounting",
            owner: "carbon"
        },
        bill: { enabled: true, direction: "two-way", owner: "accounting" },
        salesOrder: {
            enabled: false,
            direction: "push-to-accounting",
            owner: "carbon"
        },
        invoice: { enabled: true, direction: "two-way", owner: "accounting" },
        payment: {
            enabled: false,
            direction: "pull-from-accounting",
            owner: "accounting"
        },
        inventoryAdjustment: {
            enabled: false,
            direction: "push-to-accounting",
            owner: "carbon"
        }
    }
};
// ============================================================================
// 4. VALIDATION LOGIC
// ============================================================================
function validateSyncConfig(config) {
    var errors = [];
    // 1. Validate Dependencies (Always Enforced)
    Object.keys(config.entities).forEach(function (entity) {
        var entityConfig = config.entities[entity];
        var definition = exports.ENTITY_DEFINITIONS[entity];
        if (entityConfig.enabled && definition.dependsOn) {
            definition.dependsOn.forEach(function (dependency) {
                if (!config.entities[dependency].enabled) {
                    errors.push("Cannot enable '".concat(definition.label, "': Missing dependency '").concat(exports.ENTITY_DEFINITIONS[dependency].label, "'."));
                }
            });
        }
    });
    // 2. Validate Directions
    Object.keys(config.entities).forEach(function (entity) {
        var entityConfig = config.entities[entity];
        var definition = exports.ENTITY_DEFINITIONS[entity];
        if (entityConfig.enabled &&
            !definition.supportedDirections.includes(entityConfig.direction)) {
            errors.push("Entity '".concat(definition.label, "' does not support direction '").concat(entityConfig.direction, "'. Supported: ").concat(definition.supportedDirections.join(", ")));
        }
    });
    return errors;
}
var createEntityConfigSchema = function () {
    return zod_1.default.object({
        enabled: zod_1.default.boolean().optional().default(true),
        direction: exports.SyncDirectionSchema.optional().default("two-way"),
        owner: zod_1.default.enum(["carbon", "accounting"]).optional().default("accounting"),
        syncFromDate: zod_1.default.string().datetime().optional()
    });
};
exports.SyncConfigSchema = zod_1.default
    .object({
    entities: zod_1.default
        .object({
        customer: createEntityConfigSchema().optional(),
        vendor: createEntityConfigSchema().optional(),
        item: createEntityConfigSchema().optional(),
        employee: createEntityConfigSchema().optional(),
        purchaseOrder: createEntityConfigSchema().optional(),
        bill: createEntityConfigSchema().optional(),
        salesOrder: createEntityConfigSchema().optional(),
        invoice: createEntityConfigSchema().optional(),
        payment: createEntityConfigSchema().optional(),
        inventoryAdjustment: createEntityConfigSchema().optional()
    })
        .optional()
})
    .optional();
exports.ProviderIntegrationMetadataSchema = zod_1.default.object({
    syncConfig: exports.SyncConfigSchema.optional(),
    credentials: exports.ProviderCredentialsSchema.optional(),
    // Integration-specific settings (e.g., default account codes for Xero)
    // These are stored at the top level of metadata and passed through to the provider
    defaultSalesAccountCode: zod_1.default.string().optional(),
    defaultPurchaseAccountCode: zod_1.default.string().optional()
});
// /********************************************************\
// *               Accounting Entity Schemas                *
// \********************************************************/
exports.ContactSchema = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    companyId: zod_1.default.string(),
    email: zod_1.default.string().optional(),
    website: withNullable(zod_1.default.string().url()),
    taxId: withNullable(zod_1.default.string()),
    currencyCode: zod_1.default.string().default("USD"),
    balance: zod_1.default.number().nullish(),
    creditLimit: zod_1.default.number().nullish(),
    paymentTerms: zod_1.default.string().nullish(),
    updatedAt: zod_1.default.string().datetime(),
    workPhone: withNullable(zod_1.default.string()),
    mobilePhone: withNullable(zod_1.default.string()),
    fax: withNullable(zod_1.default.string()),
    homePhone: withNullable(zod_1.default.string()),
    isVendor: zod_1.default.boolean(),
    isCustomer: zod_1.default.boolean(),
    addresses: zod_1.default.array(zod_1.default.object({
        label: zod_1.default.string().nullish(),
        type: zod_1.default.string().nullish(),
        line1: zod_1.default.string().nullish(),
        line2: zod_1.default.string().nullish(),
        city: zod_1.default.string().nullish(),
        country: zod_1.default.string().nullish(),
        region: zod_1.default.string().nullish(),
        postalCode: zod_1.default.string().nullish()
    })),
    raw: zod_1.default.record(zod_1.default.any())
});
exports.EmployeeSchema = zod_1.default.object({
    id: zod_1.default.string(),
    companyId: zod_1.default.string(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    fullName: withNullable(zod_1.default.string()),
    email: withNullable(zod_1.default.string().email()),
    active: zod_1.default.boolean().default(true),
    // Job-related fields from employeeJob
    title: withNullable(zod_1.default.string()),
    departmentId: withNullable(zod_1.default.string()),
    locationId: withNullable(zod_1.default.string()),
    managerId: withNullable(zod_1.default.string()),
    startDate: withNullable(zod_1.default.string()),
    // External link (used by Xero)
    externalLink: zod_1.default
        .object({
        url: withNullable(zod_1.default.string().url()),
        description: withNullable(zod_1.default.string())
    })
        .optional(),
    updatedAt: zod_1.default.string().datetime(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
// ============================================================================
// SALES ORDER (push-only to accounting as Xero Quotes)
// ============================================================================
exports.SalesOrderLineSchema = zod_1.default.object({
    id: zod_1.default.string(),
    salesOrderLineType: zod_1.default.string(),
    itemId: withNullable(zod_1.default.string()),
    itemCode: withNullable(zod_1.default.string()), // item.readableIdWithRevision
    description: withNullable(zod_1.default.string()),
    quantity: zod_1.default.number(),
    unitPrice: zod_1.default.number(),
    setupPrice: zod_1.default.number(),
    accountNumber: withNullable(zod_1.default.string()),
    lineAmount: zod_1.default.number()
});
exports.SalesOrderSchema = zod_1.default.object({
    id: zod_1.default.string(),
    salesOrderId: zod_1.default.string(), // Human-readable SO number
    companyId: zod_1.default.string(),
    customerId: zod_1.default.string(),
    customerExternalId: withNullable(zod_1.default.string()), // Xero ContactID for the customer
    status: zod_1.default.enum([
        "Draft",
        "Needs Approval",
        "Confirmed",
        "In Progress",
        "To Ship and Invoice",
        "To Ship",
        "To Invoice",
        "Completed",
        "Invoiced",
        "Cancelled",
        "Closed"
    ]),
    orderDate: withNullable(zod_1.default.string()),
    currencyCode: zod_1.default.string(),
    exchangeRate: zod_1.default.number(),
    customerReference: withNullable(zod_1.default.string()),
    lines: zod_1.default.array(exports.SalesOrderLineSchema),
    updatedAt: zod_1.default.string().datetime(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
// Sales Invoice schemas
exports.SalesInvoiceLineSchema = zod_1.default.object({
    id: zod_1.default.string(),
    invoiceLineType: zod_1.default.string(),
    itemId: withNullable(zod_1.default.string()),
    itemCode: withNullable(zod_1.default.string()), // readableIdWithRevision
    description: withNullable(zod_1.default.string()),
    quantity: zod_1.default.number(),
    unitPrice: zod_1.default.number(),
    taxPercent: zod_1.default.number(),
    lineAmount: zod_1.default.number()
});
exports.SalesInvoiceSchema = zod_1.default.object({
    id: zod_1.default.string(),
    invoiceId: zod_1.default.string(), // readable ID like "INV-0001"
    companyId: zod_1.default.string(),
    customerId: zod_1.default.string(),
    customerExternalId: withNullable(zod_1.default.string()), // Xero ContactID for the customer
    status: zod_1.default.enum([
        "Draft",
        "Pending",
        "Submitted",
        "Partially Paid",
        "Paid",
        "Overdue",
        "Voided",
        "Credit Note Issued",
        "Return"
    ]),
    currencyCode: zod_1.default.string(),
    exchangeRate: zod_1.default.number(),
    dateIssued: withNullable(zod_1.default.string()),
    dateDue: withNullable(zod_1.default.string()),
    datePaid: withNullable(zod_1.default.string()),
    customerReference: withNullable(zod_1.default.string()),
    subtotal: zod_1.default.number(),
    totalTax: zod_1.default.number(),
    totalDiscount: zod_1.default.number(),
    totalAmount: zod_1.default.number(),
    balance: zod_1.default.number(),
    lines: zod_1.default.array(exports.SalesInvoiceLineSchema),
    updatedAt: zod_1.default.string().datetime(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
// Bill (Purchase Invoice) schemas
exports.BillLineSchema = zod_1.default.object({
    id: zod_1.default.string(),
    description: withNullable(zod_1.default.string()),
    quantity: zod_1.default.number(),
    unitPrice: zod_1.default.number(),
    itemId: withNullable(zod_1.default.string()),
    itemCode: withNullable(zod_1.default.string()),
    accountNumber: withNullable(zod_1.default.string()),
    taxPercent: withNullable(zod_1.default.number()),
    taxAmount: withNullable(zod_1.default.number()),
    totalAmount: zod_1.default.number(),
    purchaseOrderLineId: withNullable(zod_1.default.string())
});
exports.BillSchema = zod_1.default.object({
    id: zod_1.default.string(),
    companyId: zod_1.default.string(),
    invoiceId: zod_1.default.string(), // Human-readable invoice number
    supplierId: withNullable(zod_1.default.string()),
    supplierExternalId: withNullable(zod_1.default.string()), // Xero ContactID for the supplier
    status: zod_1.default.enum([
        "Draft",
        "Pending",
        "Open",
        "Return",
        "Debit Note Issued",
        "Paid",
        "Partially Paid",
        "Overdue",
        "Voided"
    ]),
    dateIssued: withNullable(zod_1.default.string()),
    dateDue: withNullable(zod_1.default.string()),
    datePaid: withNullable(zod_1.default.string()),
    currencyCode: zod_1.default.string(),
    exchangeRate: zod_1.default.number(),
    subtotal: zod_1.default.number(),
    totalTax: zod_1.default.number(),
    totalDiscount: zod_1.default.number(),
    totalAmount: zod_1.default.number(),
    balance: zod_1.default.number(),
    supplierReference: withNullable(zod_1.default.string()),
    lines: zod_1.default.array(exports.BillLineSchema),
    updatedAt: zod_1.default.string().datetime(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
// Purchase Order schemas
exports.PurchaseOrderLineSchema = zod_1.default.object({
    id: zod_1.default.string(),
    description: withNullable(zod_1.default.string()),
    quantity: zod_1.default.number(),
    unitPrice: zod_1.default.number(),
    itemId: withNullable(zod_1.default.string()),
    itemCode: withNullable(zod_1.default.string()),
    accountNumber: withNullable(zod_1.default.string()),
    taxPercent: withNullable(zod_1.default.number()),
    taxAmount: withNullable(zod_1.default.number()),
    totalAmount: zod_1.default.number(),
    quantityReceived: withNullable(zod_1.default.number()),
    quantityInvoiced: withNullable(zod_1.default.number())
});
exports.PurchaseOrderSchema = zod_1.default.object({
    id: zod_1.default.string(),
    companyId: zod_1.default.string(),
    purchaseOrderId: zod_1.default.string(), // Human-readable PO number
    supplierId: zod_1.default.string(),
    supplierExternalId: withNullable(zod_1.default.string()), // Xero ContactID for the supplier
    status: zod_1.default.enum([
        "Draft",
        "Needs Approval",
        "To Review",
        "Rejected",
        "To Receive",
        "To Receive and Invoice",
        "To Invoice",
        "Completed",
        "Closed",
        "Planned"
    ]),
    orderDate: withNullable(zod_1.default.string()),
    deliveryDate: withNullable(zod_1.default.string()),
    deliveryAddress: withNullable(zod_1.default.string()),
    deliveryInstructions: withNullable(zod_1.default.string()),
    currencyCode: withNullable(zod_1.default.string()),
    exchangeRate: withNullable(zod_1.default.number()),
    subtotal: zod_1.default.number(),
    totalTax: zod_1.default.number(),
    totalAmount: zod_1.default.number(),
    supplierReference: withNullable(zod_1.default.string()),
    lines: zod_1.default.array(exports.PurchaseOrderLineSchema),
    updatedAt: zod_1.default.string().datetime(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
// ============================================================================
// ITEM (Carbon item synced to accounting system)
// ============================================================================
exports.ItemSchema = zod_1.default.object({
    id: zod_1.default.string(),
    code: zod_1.default.string(),
    name: zod_1.default.string(),
    description: withNullable(zod_1.default.string()),
    companyId: zod_1.default.string(),
    type: zod_1.default.enum(["Part", "Material", "Tool", "Consumable", "Fixture"]),
    unitOfMeasureCode: withNullable(zod_1.default.string()),
    unitCost: zod_1.default.number(),
    unitSalePrice: zod_1.default.number(),
    isPurchased: zod_1.default.boolean(),
    isSold: zod_1.default.boolean(),
    isTrackedAsInventory: zod_1.default.boolean(),
    updatedAt: zod_1.default.string(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
// ============================================================================
// INVENTORY ADJUSTMENT (itemLedger-based, push-only to accounting)
// ============================================================================
exports.InventoryAdjustmentSchema = zod_1.default.object({
    id: zod_1.default.string(),
    entryNumber: zod_1.default.number(),
    postingDate: zod_1.default.string(),
    entryType: zod_1.default.enum(["Positive Adjmt.", "Negative Adjmt."]),
    itemId: zod_1.default.string(),
    locationId: withNullable(zod_1.default.string()),
    quantity: zod_1.default.number(), // positive for positive adj, negative for negative adj
    companyId: zod_1.default.string(),
    unitCost: zod_1.default.number(), // from itemCost table
    inventoryAccount: zod_1.default.string(), // GL account code from accountDefault
    adjustmentVarianceAccount: zod_1.default.string(), // GL account code from accountDefault
    updatedAt: zod_1.default.string().datetime(),
    raw: zod_1.default.record(zod_1.default.any()).optional()
});
