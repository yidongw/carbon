"use strict";
/*
License: MIT
Author: Pontus Abrahamssons
Repository: https://github.com/midday-ai/zuno
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkExportSchema = exports.PaginationSchema = exports.ApiRequestSchema = exports.ProviderMetadataSchema = exports.CompanyInfoSchema = exports.PaymentSchema = exports.JournalEntrySchema = exports.ExpenseSchema = exports.TransactionSchema = exports.BillSchema = exports.InvoiceSchema = exports.ItemSchema = exports.VendorSchema = exports.CustomerSchema = exports.AccountSchema = exports.AttachmentSchema = exports.PhoneNumberSchema = exports.AddressSchema = exports.BaseEntitySchema = void 0;
var zod_1 = require("zod");
// Base schemas
exports.BaseEntitySchema = zod_1.z.object({
    id: zod_1.z.string(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    lastSyncedAt: zod_1.z.string().datetime().optional(),
    remoteWasDeleted: zod_1.z.boolean().optional()
});
// Address schema (reusable)
exports.AddressSchema = zod_1.z.object({
    type: zod_1.z.enum(["billing", "shipping", "mailing"]).optional(),
    street: zod_1.z.string().optional(),
    street2: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional()
});
// Phone number schema
exports.PhoneNumberSchema = zod_1.z.object({
    type: zod_1.z.enum(["home", "work", "mobile", "fax"]).optional(),
    number: zod_1.z.string(),
    isPrimary: zod_1.z.boolean().optional()
});
// Enhanced attachment schema with comprehensive file support
exports.AttachmentSchema = exports.BaseEntitySchema.extend({
    filename: zod_1.z.string(),
    originalFilename: zod_1.z.string().optional(),
    mimeType: zod_1.z.string(),
    size: zod_1.z.number(),
    url: zod_1.z.string().url(),
    downloadUrl: zod_1.z.string().url().optional(),
    thumbnailUrl: zod_1.z.string().url().optional(),
    entityType: zod_1.z.enum([
        "invoice",
        "customer",
        "transaction",
        "expense",
        "bill",
        "receipt",
        "journal_entry"
    ]),
    entityId: zod_1.z.string(),
    attachmentType: zod_1.z
        .enum(["receipt", "invoice", "contract", "supporting_document", "other"])
        .optional(),
    description: zod_1.z.string().optional(),
    isPublic: zod_1.z.boolean().default(false),
    uploadedBy: zod_1.z.string().optional(),
    checksum: zod_1.z.string().optional(), // For file integrity
    metadata: zod_1.z.record(zod_1.z.any()).optional() // Provider-specific metadata
});
// Account schema for chart of accounts
exports.AccountSchema = exports.BaseEntitySchema.extend({
    name: zod_1.z.string(),
    code: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    accountType: zod_1.z.enum([
        "asset",
        "liability",
        "equity",
        "income",
        "expense",
        "accounts_receivable",
        "accounts_payable",
        "bank",
        "credit_card",
        "current_asset",
        "fixed_asset",
        "other_asset",
        "current_liability",
        "long_term_liability",
        "cost_of_goods_sold",
        "other_income",
        "other_expense"
    ]),
    accountSubType: zod_1.z.string().optional(),
    parentAccountId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    currentBalance: zod_1.z.number().optional(),
    currency: zod_1.z.string().default("USD"),
    taxCode: zod_1.z.string().optional(),
    bankAccountNumber: zod_1.z.string().optional(),
    routingNumber: zod_1.z.string().optional()
});
// Enhanced customer schema
exports.CustomerSchema = exports.BaseEntitySchema.extend({
    name: zod_1.z.string(),
    displayName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    website: zod_1.z.string().url().optional(),
    phone: exports.PhoneNumberSchema.optional(),
    phoneNumbers: zod_1.z.array(exports.PhoneNumberSchema).optional(),
    addresses: zod_1.z.array(exports.AddressSchema).optional(),
    billingAddress: exports.AddressSchema.optional(),
    shippingAddress: exports.AddressSchema.optional(),
    taxNumber: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    currency: zod_1.z.string().default("USD"),
    paymentTerms: zod_1.z.string().optional(),
    creditLimit: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().default(true),
    isArchived: zod_1.z.boolean().default(false),
    balance: zod_1.z.number().optional(),
    notes: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional()
});
// Vendor/Supplier schema
exports.VendorSchema = exports.BaseEntitySchema.extend({
    name: zod_1.z.string(),
    displayName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    website: zod_1.z.string().url().optional(),
    phone: exports.PhoneNumberSchema.optional(),
    phoneNumbers: zod_1.z.array(exports.PhoneNumberSchema).optional(),
    addresses: zod_1.z.array(exports.AddressSchema).optional(),
    billingAddress: exports.AddressSchema.optional(),
    taxNumber: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    currency: zod_1.z.string().default("USD"),
    paymentTerms: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    isArchived: zod_1.z.boolean().default(false),
    balance: zod_1.z.number().optional(),
    notes: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional()
});
// Item/Product schema
exports.ItemSchema = exports.BaseEntitySchema.extend({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    type: zod_1.z.enum(["inventory", "non_inventory", "service", "bundle"]),
    unitPrice: zod_1.z.number().optional(),
    unitOfMeasure: zod_1.z.string().optional(),
    quantityOnHand: zod_1.z.number().optional(),
    reorderPoint: zod_1.z.number().optional(),
    assetAccountId: zod_1.z.string().optional(),
    incomeAccountId: zod_1.z.string().optional(),
    expenseAccountId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    isTaxable: zod_1.z.boolean().default(true),
    isSold: zod_1.z.boolean().default(true),
    isPurchased: zod_1.z.boolean().default(false),
    taxCode: zod_1.z.string().optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Enhanced invoice schema with attachments
exports.InvoiceSchema = exports.BaseEntitySchema.extend({
    number: zod_1.z.string(),
    customerId: zod_1.z.string(),
    customerName: zod_1.z.string(),
    issueDate: zod_1.z.string().datetime(),
    dueDate: zod_1.z.string().datetime(),
    status: zod_1.z.enum(["draft", "sent", "paid", "overdue", "cancelled", "void"]),
    currency: zod_1.z.string(),
    exchangeRate: zod_1.z.number().optional(),
    subtotal: zod_1.z.number(),
    taxAmount: zod_1.z.number(),
    discountAmount: zod_1.z.number().optional(),
    total: zod_1.z.number(),
    amountPaid: zod_1.z.number().optional(),
    amountDue: zod_1.z.number().optional(),
    paymentTerms: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional(),
    poNumber: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    privateNotes: zod_1.z.string().optional(),
    billingAddress: exports.AddressSchema.optional(),
    shippingAddress: exports.AddressSchema.optional(),
    lineItems: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        itemId: zod_1.z.string().optional(),
        description: zod_1.z.string(),
        quantity: zod_1.z.number(),
        unitPrice: zod_1.z.number(),
        discount: zod_1.z.number().optional(),
        total: zod_1.z.number(),
        taxRate: zod_1.z.number().optional(),
        taxAmount: zod_1.z.number().optional(),
        accountId: zod_1.z.string().optional(),
        trackingCategories: zod_1.z
            .array(zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            value: zod_1.z.string()
        }))
            .optional()
    })),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Bill schema (for vendor bills)
exports.BillSchema = exports.BaseEntitySchema.extend({
    number: zod_1.z.string(),
    vendorId: zod_1.z.string(),
    vendorName: zod_1.z.string(),
    issueDate: zod_1.z.string().datetime(),
    dueDate: zod_1.z.string().datetime(),
    status: zod_1.z.enum(["draft", "open", "paid", "overdue", "cancelled", "void"]),
    currency: zod_1.z.string(),
    exchangeRate: zod_1.z.number().optional(),
    subtotal: zod_1.z.number(),
    taxAmount: zod_1.z.number(),
    discountAmount: zod_1.z.number().optional(),
    total: zod_1.z.number(),
    amountPaid: zod_1.z.number().optional(),
    amountDue: zod_1.z.number().optional(),
    reference: zod_1.z.string().optional(),
    poNumber: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    privateNotes: zod_1.z.string().optional(),
    lineItems: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        itemId: zod_1.z.string().optional(),
        description: zod_1.z.string(),
        quantity: zod_1.z.number(),
        unitPrice: zod_1.z.number(),
        discount: zod_1.z.number().optional(),
        total: zod_1.z.number(),
        taxRate: zod_1.z.number().optional(),
        taxAmount: zod_1.z.number().optional(),
        accountId: zod_1.z.string().optional(),
        trackingCategories: zod_1.z
            .array(zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            value: zod_1.z.string()
        }))
            .optional()
    })),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Enhanced transaction schema with attachments and reconciliation
exports.TransactionSchema = exports.BaseEntitySchema.extend({
    type: zod_1.z.enum([
        "payment",
        "receipt",
        "transfer",
        "adjustment",
        "deposit",
        "withdrawal",
        "charge",
        "refund"
    ]),
    reference: zod_1.z.string().optional(),
    description: zod_1.z.string(),
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    exchangeRate: zod_1.z.number().optional(),
    date: zod_1.z.string().datetime(),
    accountId: zod_1.z.string(),
    accountName: zod_1.z.string(),
    toAccountId: zod_1.z.string().optional(), // For transfers
    toAccountName: zod_1.z.string().optional(),
    customerId: zod_1.z.string().optional(),
    vendorId: zod_1.z.string().optional(),
    contactName: zod_1.z.string().optional(),
    invoiceId: zod_1.z.string().optional(),
    billId: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "cleared", "reconciled", "voided"]),
    reconciliationStatus: zod_1.z
        .enum(["unreconciled", "reconciled", "suggested"])
        .optional(),
    reconciliationDate: zod_1.z.string().datetime().optional(),
    bankTransactionId: zod_1.z.string().optional(),
    checkNumber: zod_1.z.string().optional(),
    memo: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    trackingCategories: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        value: zod_1.z.string()
    }))
        .optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Expense schema
exports.ExpenseSchema = exports.BaseEntitySchema.extend({
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    exchangeRate: zod_1.z.number().optional(),
    date: zod_1.z.string().datetime(),
    description: zod_1.z.string(),
    reference: zod_1.z.string().optional(),
    vendorId: zod_1.z.string().optional(),
    vendorName: zod_1.z.string().optional(),
    employeeId: zod_1.z.string().optional(),
    employeeName: zod_1.z.string().optional(),
    accountId: zod_1.z.string(),
    accountName: zod_1.z.string(),
    category: zod_1.z.string().optional(),
    projectId: zod_1.z.string().optional(),
    projectName: zod_1.z.string().optional(),
    billable: zod_1.z.boolean().default(false),
    reimbursable: zod_1.z.boolean().default(false),
    status: zod_1.z.enum(["draft", "submitted", "approved", "rejected", "paid"]),
    paymentMethod: zod_1.z
        .enum(["cash", "credit_card", "bank_transfer", "check", "other"])
        .optional(),
    receiptRequired: zod_1.z.boolean().default(true),
    notes: zod_1.z.string().optional(),
    taxAmount: zod_1.z.number().optional(),
    taxRate: zod_1.z.number().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    trackingCategories: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        value: zod_1.z.string()
    }))
        .optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Journal Entry schema
exports.JournalEntrySchema = exports.BaseEntitySchema.extend({
    number: zod_1.z.string(),
    date: zod_1.z.string().datetime(),
    description: zod_1.z.string(),
    reference: zod_1.z.string().optional(),
    status: zod_1.z.enum(["draft", "posted", "void"]),
    currency: zod_1.z.string(),
    exchangeRate: zod_1.z.number().optional(),
    lineItems: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        accountId: zod_1.z.string(),
        accountName: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        debitAmount: zod_1.z.number().optional(),
        creditAmount: zod_1.z.number().optional(),
        trackingCategories: zod_1.z
            .array(zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            value: zod_1.z.string()
        }))
            .optional()
    })),
    totalDebit: zod_1.z.number(),
    totalCredit: zod_1.z.number(),
    notes: zod_1.z.string().optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Payment schema
exports.PaymentSchema = exports.BaseEntitySchema.extend({
    amount: zod_1.z.number(),
    currency: zod_1.z.string(),
    exchangeRate: zod_1.z.number().optional(),
    date: zod_1.z.string().datetime(),
    reference: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.enum([
        "cash",
        "check",
        "credit_card",
        "bank_transfer",
        "online",
        "other"
    ]),
    accountId: zod_1.z.string(),
    accountName: zod_1.z.string(),
    customerId: zod_1.z.string().optional(),
    vendorId: zod_1.z.string().optional(),
    contactName: zod_1.z.string().optional(),
    invoiceId: zod_1.z.string().optional(),
    billId: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "cleared", "bounced", "cancelled"]),
    checkNumber: zod_1.z.string().optional(),
    memo: zod_1.z.string().optional(),
    fees: zod_1.z.number().optional(),
    notes: zod_1.z.string().optional(),
    attachments: zod_1.z.array(exports.AttachmentSchema).optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Company info schema
exports.CompanyInfoSchema = exports.BaseEntitySchema.extend({
    name: zod_1.z.string(),
    legalName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: exports.PhoneNumberSchema.optional(),
    website: zod_1.z.string().url().optional(),
    addresses: zod_1.z.array(exports.AddressSchema).optional(),
    taxNumber: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    baseCurrency: zod_1.z.string().default("USD"),
    fiscalYearStart: zod_1.z.string().optional(),
    timeZone: zod_1.z.string().optional(),
    logo: zod_1.z.string().url().optional(),
    industry: zod_1.z.string().optional(),
    employees: zod_1.z.number().optional(),
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Enhanced provider-specific metadata
exports.ProviderMetadataSchema = zod_1.z.object({
    provider: zod_1.z.enum(["xero", "sage", "quickbooks"]),
    externalId: zod_1.z.string(),
    lastSyncAt: zod_1.z.string().datetime().optional(),
    syncHash: zod_1.z.string().optional(),
    version: zod_1.z.string().optional(),
    rawData: zod_1.z.record(zod_1.z.any()).optional(), // Store original provider data
    customFields: zod_1.z.record(zod_1.z.any()).optional()
});
// Enhanced API Request/Response schemas
exports.ApiRequestSchema = zod_1.z.object({
    provider: zod_1.z.enum(["xero", "sage", "quickbooks"]),
    includeAttachments: zod_1.z.boolean().default(false),
    includeCustomFields: zod_1.z.boolean().default(false),
    includeRawData: zod_1.z.boolean().default(false)
});
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(20),
    total: zod_1.z.number().optional(),
    hasNext: zod_1.z.boolean().optional(),
    cursor: zod_1.z.string().optional()
});
// Bulk export request schema
exports.BulkExportSchema = zod_1.z.object({
    provider: zod_1.z.enum(["xero", "sage", "quickbooks"]),
    entityTypes: zod_1.z.array(zod_1.z.enum([
        "customers",
        "vendors",
        "invoices",
        "bills",
        "transactions",
        "expenses",
        "accounts",
        "items",
        "journal_entries",
        "payments"
    ])),
    dateRange: zod_1.z
        .object({
        startDate: zod_1.z.string().datetime(),
        endDate: zod_1.z.string().datetime()
    })
        .optional(),
    includeAttachments: zod_1.z.boolean().default(true),
    includeCustomFields: zod_1.z.boolean().default(false),
    includeRawData: zod_1.z.boolean().default(false),
    format: zod_1.z.enum(["json", "csv", "xlsx"]).default("json"),
    batchSize: zod_1.z.number().min(1).max(1000).default(100)
});
