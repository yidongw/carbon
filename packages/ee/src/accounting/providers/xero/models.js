"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformXeroContact = exports.transformXeroPhones = exports.parseDotnetDate = exports.Xero = void 0;
var zod_1 = require("zod");
var Xero;
(function (Xero) {
    // Shared address schema for contacts and employees
    Xero.AddressSchema = zod_1.z.object({
        AddressType: zod_1.z.enum(["POBOX", "STREET", "DELIVERY"]),
        AddressLine1: zod_1.z.string().optional(),
        AddressLine2: zod_1.z.string().optional(),
        AddressLine3: zod_1.z.string().optional(),
        AddressLine4: zod_1.z.string().optional(),
        City: zod_1.z.string().optional(),
        Region: zod_1.z.string().optional(),
        PostalCode: zod_1.z.string().optional(),
        Country: zod_1.z.string().optional(),
        AttentionTo: zod_1.z.string().optional()
    });
    Xero.PhoneSchema = zod_1.z.object({
        PhoneType: zod_1.z.enum(["DDI", "DEFAULT", "FAX", "MOBILE"]),
        PhoneNumber: zod_1.z.string().optional(),
        PhoneAreaCode: zod_1.z.string().optional(),
        PhoneCountryCode: zod_1.z.string().optional()
    });
    Xero.BalancesSchema = zod_1.z.object({
        AccountsReceivable: zod_1.z.object({
            Outstanding: zod_1.z.number(),
            Overdue: zod_1.z.number()
        }),
        AccountsPayable: zod_1.z.object({
            Outstanding: zod_1.z.number(),
            Overdue: zod_1.z.number()
        })
    });
    Xero.BrandingThemeSchema = zod_1.z.object({
        BrandingThemeID: zod_1.z.string().uuid(),
        Name: zod_1.z.string()
    });
    Xero.BatchPaymentsSchema = zod_1.z.object({
        BankAccountNumber: zod_1.z.string(),
        BankAccountName: zod_1.z.string(),
        Details: zod_1.z.string(),
        Code: zod_1.z.string().optional(),
        Reference: zod_1.z.string().optional()
    });
    Xero.ContactSchema = zod_1.z.object({
        ContactID: zod_1.z.string().uuid(),
        ContactStatus: zod_1.z.literal("ACTIVE"),
        Name: zod_1.z.string(),
        Website: zod_1.z.string().optional(),
        FirstName: zod_1.z.string().optional(),
        LastName: zod_1.z.string().optional(),
        EmailAddress: zod_1.z.string().email().optional(),
        ContactNumber: zod_1.z.string().optional(),
        BankAccountDetails: zod_1.z.string().optional(),
        TaxNumber: zod_1.z.string().optional(),
        AccountsReceivableTaxType: zod_1.z.string().optional(),
        AccountsPayableTaxType: zod_1.z.string().optional(),
        Addresses: zod_1.z.array(Xero.AddressSchema),
        Phones: zod_1.z.array(Xero.PhoneSchema),
        UpdatedDateUTC: zod_1.z.string(), // serialized /Date(...)/
        ContactGroups: zod_1.z.array(zod_1.z.unknown()),
        IsSupplier: zod_1.z.boolean(),
        IsCustomer: zod_1.z.boolean(),
        DefaultCurrency: zod_1.z.string().optional(),
        BrandingTheme: Xero.BrandingThemeSchema.optional(),
        BatchPayments: Xero.BatchPaymentsSchema.optional(),
        Balances: Xero.BalancesSchema.optional(),
        ContactPersons: zod_1.z.array(zod_1.z.unknown()),
        HasAttachments: zod_1.z.boolean(),
        HasValidationErrors: zod_1.z.boolean()
    });
    // Employee schema for Xero Accounting API Employees endpoint
    // Note: This is from the deprecated Accounting API endpoint, not PayrollAU/UK/NZ
    Xero.EmployeeSchema = zod_1.z.object({
        EmployeeID: zod_1.z.string().uuid(),
        Status: zod_1.z.enum(["ACTIVE", "DELETED"]).optional(),
        FirstName: zod_1.z.string(),
        LastName: zod_1.z.string(),
        ExternalLink: zod_1.z
            .object({
            Url: zod_1.z.string().url().optional(),
            Description: zod_1.z.string().optional()
        })
            .optional(),
        UpdatedDateUTC: zod_1.z.string() // serialized /Date(...)/
    });
    // Item schemas for Xero Accounting API Items endpoint
    Xero.PurchaseDetailsSchema = zod_1.z.object({
        UnitPrice: zod_1.z.number().optional(),
        AccountCode: zod_1.z.string().optional(),
        COGSAccountCode: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional()
    });
    Xero.SalesDetailsSchema = zod_1.z.object({
        UnitPrice: zod_1.z.number().optional(),
        AccountCode: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional()
    });
    Xero.ItemSchema = zod_1.z.object({
        ItemID: zod_1.z.string().uuid(),
        Code: zod_1.z.string().max(30),
        Name: zod_1.z.string().max(50).optional(),
        Description: zod_1.z.string().max(4000).optional(),
        PurchaseDescription: zod_1.z.string().optional(),
        PurchaseDetails: Xero.PurchaseDetailsSchema.optional(),
        SalesDetails: Xero.SalesDetailsSchema.optional(),
        IsTrackedAsInventory: zod_1.z.boolean().optional(),
        IsSold: zod_1.z.boolean().optional(),
        IsPurchased: zod_1.z.boolean().optional(),
        QuantityOnHand: zod_1.z.number().optional(),
        TotalCostPool: zod_1.z.number().optional(),
        UpdatedDateUTC: zod_1.z.string()
    });
    // Invoice/Bill schemas for Xero Accounting API
    // Type: ACCPAY = Accounts Payable (Bill/Purchase Invoice)
    // Type: ACCREC = Accounts Receivable (Sales Invoice)
    Xero.InvoiceLineItemSchema = zod_1.z.object({
        LineItemID: zod_1.z.string().uuid().optional(),
        Description: zod_1.z.string().optional(),
        Quantity: zod_1.z.number().optional(),
        UnitAmount: zod_1.z.number().optional(),
        ItemCode: zod_1.z.string().optional(),
        AccountCode: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional(),
        TaxAmount: zod_1.z.number().optional(),
        LineAmount: zod_1.z.number().optional(),
        DiscountRate: zod_1.z.number().optional(),
        Tracking: zod_1.z.array(zod_1.z.unknown()).optional()
    });
    Xero.InvoiceContactSchema = zod_1.z.object({
        ContactID: zod_1.z.string().uuid(),
        Name: zod_1.z.string().optional()
    });
    Xero.InvoiceSchema = zod_1.z.object({
        InvoiceID: zod_1.z.string().uuid(),
        Type: zod_1.z.enum(["ACCPAY", "ACCREC"]), // ACCPAY = Bill, ACCREC = Sales Invoice
        InvoiceNumber: zod_1.z.string().optional(),
        Reference: zod_1.z.string().optional(),
        Contact: Xero.InvoiceContactSchema,
        Date: zod_1.z.string().optional(), // YYYY-MM-DD
        DueDate: zod_1.z.string().optional(),
        Status: zod_1.z.enum([
            "DRAFT",
            "SUBMITTED",
            "AUTHORISED",
            "PAID",
            "VOIDED",
            "DELETED"
        ]),
        LineAmountTypes: zod_1.z.enum(["Exclusive", "Inclusive", "NoTax"]).optional(),
        LineItems: zod_1.z.array(Xero.InvoiceLineItemSchema),
        SubTotal: zod_1.z.number().optional(),
        TotalTax: zod_1.z.number().optional(),
        Total: zod_1.z.number().optional(),
        AmountDue: zod_1.z.number().optional(),
        AmountPaid: zod_1.z.number().optional(),
        CurrencyCode: zod_1.z.string().optional(),
        CurrencyRate: zod_1.z.number().optional(),
        UpdatedDateUTC: zod_1.z.string()
    });
    // Purchase Order schemas for Xero Accounting API
    Xero.PurchaseOrderLineItemSchema = zod_1.z.object({
        LineItemID: zod_1.z.string().uuid().optional(),
        Description: zod_1.z.string().optional(),
        Quantity: zod_1.z.number().optional(),
        UnitAmount: zod_1.z.number().optional(),
        ItemCode: zod_1.z.string().optional(),
        AccountCode: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional(),
        TaxAmount: zod_1.z.number().optional(),
        LineAmount: zod_1.z.number().optional(),
        DiscountRate: zod_1.z.number().optional(),
        Tracking: zod_1.z.array(zod_1.z.unknown()).optional()
    });
    Xero.PurchaseOrderContactSchema = zod_1.z.object({
        ContactID: zod_1.z.string().uuid(),
        Name: zod_1.z.string().optional()
    });
    Xero.PurchaseOrderSchema = zod_1.z.object({
        PurchaseOrderID: zod_1.z.string().uuid(),
        PurchaseOrderNumber: zod_1.z.string().optional(),
        Reference: zod_1.z.string().optional(),
        Contact: Xero.PurchaseOrderContactSchema,
        Date: zod_1.z.string().optional(), // YYYY-MM-DD
        DeliveryDate: zod_1.z.string().optional(),
        DeliveryAddress: zod_1.z.string().optional(),
        AttentionTo: zod_1.z.string().optional(),
        Telephone: zod_1.z.string().optional(),
        DeliveryInstructions: zod_1.z.string().optional(),
        Status: zod_1.z.enum(["DRAFT", "SUBMITTED", "AUTHORISED", "BILLED", "DELETED"]),
        LineAmountTypes: zod_1.z.enum(["Exclusive", "Inclusive", "NoTax"]).optional(),
        LineItems: zod_1.z.array(Xero.PurchaseOrderLineItemSchema),
        SubTotal: zod_1.z.number().optional(),
        TotalTax: zod_1.z.number().optional(),
        Total: zod_1.z.number().optional(),
        CurrencyCode: zod_1.z.string().optional(),
        CurrencyRate: zod_1.z.number().optional(),
        UpdatedDateUTC: zod_1.z.string()
    });
    // Manual Journal schemas for Xero Accounting API ManualJournals endpoint
    Xero.ManualJournalLineSchema = zod_1.z.object({
        LineAmount: zod_1.z.number(),
        AccountCode: zod_1.z.string(),
        Description: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional(),
        TaxAmount: zod_1.z.number().optional(),
        IsBlank: zod_1.z.boolean().optional()
    });
    Xero.ManualJournalSchema = zod_1.z.object({
        ManualJournalID: zod_1.z.string().uuid(),
        Narration: zod_1.z.string(),
        Date: zod_1.z.string().optional(),
        Status: zod_1.z.enum(["DRAFT", "POSTED", "DELETED", "VOIDED", "ARCHIVED"]),
        LineAmountTypes: zod_1.z.string().optional(),
        Url: zod_1.z.string().optional(),
        ShowOnCashBasisReports: zod_1.z.boolean().optional(),
        JournalLines: zod_1.z.array(Xero.ManualJournalLineSchema).optional(),
        UpdatedDateUTC: zod_1.z.string()
    });
    // Quote schemas for Xero Accounting API Quotes endpoint
    // Xero Quotes are the closest equivalent to Sales Orders
    Xero.QuoteLineItemSchema = zod_1.z.object({
        LineItemID: zod_1.z.string().uuid().optional(),
        Description: zod_1.z.string().optional(),
        Quantity: zod_1.z.number().optional(),
        UnitAmount: zod_1.z.number().optional(),
        ItemCode: zod_1.z.string().max(30).optional(),
        AccountCode: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional(),
        TaxAmount: zod_1.z.number().optional(),
        LineAmount: zod_1.z.number().optional(),
        DiscountRate: zod_1.z.number().optional(),
        DiscountAmount: zod_1.z.number().optional()
    });
    Xero.QuoteContactSchema = zod_1.z.object({
        ContactID: zod_1.z.string().uuid()
    });
    Xero.QuoteSchema = zod_1.z.object({
        QuoteID: zod_1.z.string().uuid(),
        QuoteNumber: zod_1.z.string().max(255).optional(),
        Reference: zod_1.z.string().max(4000).optional(),
        Terms: zod_1.z.string().max(4000).optional(),
        Contact: Xero.QuoteContactSchema,
        LineItems: zod_1.z.array(Xero.QuoteLineItemSchema).optional(),
        Date: zod_1.z.string().optional(),
        ExpiryDate: zod_1.z.string().optional(),
        Status: zod_1.z.enum([
            "DRAFT",
            "SENT",
            "DECLINED",
            "ACCEPTED",
            "INVOICED",
            "DELETED"
        ]),
        CurrencyCode: zod_1.z.string().optional(),
        CurrencyRate: zod_1.z.number().optional(),
        SubTotal: zod_1.z.number().optional(),
        TotalTax: zod_1.z.number().optional(),
        Total: zod_1.z.number().optional(),
        TotalDiscount: zod_1.z.number().optional(),
        Title: zod_1.z.string().max(100).optional(),
        Summary: zod_1.z.string().max(3000).optional(),
        LineAmountTypes: zod_1.z.string().optional(),
        UpdatedDateUTC: zod_1.z.string()
    });
    // Organisation schema for Xero Accounting API Organisation endpoint
    Xero.OrganisationSchema = zod_1.z.object({
        OrganisationID: zod_1.z.string().uuid(),
        Name: zod_1.z.string(),
        LegalName: zod_1.z.string().optional(),
        BaseCurrency: zod_1.z.string(),
        CountryCode: zod_1.z.string().optional(),
        IsDemoCompany: zod_1.z.boolean().optional(),
        OrganisationType: zod_1.z.string().optional(),
        OrganisationStatus: zod_1.z.string().optional(),
        TaxNumber: zod_1.z.string().optional(),
        FinancialYearEndDay: zod_1.z.number().optional(),
        FinancialYearEndMonth: zod_1.z.number().optional(),
        DefaultSalesTax: zod_1.z.string().optional(),
        DefaultPurchasesTax: zod_1.z.string().optional(),
        ShortCode: zod_1.z.string().optional(),
        Edition: zod_1.z.string().optional(),
        Class: zod_1.z.string().optional(),
        Timezone: zod_1.z.string().optional(),
        CreatedDateUTC: zod_1.z.string().optional(),
        UpdatedDateUTC: zod_1.z.string().optional()
    });
    // Currency schema for Xero Accounting API Currencies endpoint
    Xero.CurrencySchema = zod_1.z.object({
        Code: zod_1.z.string(),
        Description: zod_1.z.string().optional()
    });
    // Account schema for Xero Accounting API Accounts (Chart of Accounts) endpoint
    Xero.AccountSchema = zod_1.z.object({
        AccountID: zod_1.z.string().uuid(),
        Code: zod_1.z.string().optional(),
        Name: zod_1.z.string(),
        Type: zod_1.z.string(), // e.g., "REVENUE", "EXPENSE", "DIRECTCOSTS", "BANK", etc.
        Status: zod_1.z.enum(["ACTIVE", "ARCHIVED"]).optional(),
        Description: zod_1.z.string().optional(),
        TaxType: zod_1.z.string().optional(),
        Class: zod_1.z.string().optional(), // "REVENUE", "EXPENSE", "ASSET", "LIABILITY", "EQUITY"
        EnablePaymentsToAccount: zod_1.z.boolean().optional(),
        ShowInExpenseClaims: zod_1.z.boolean().optional(),
        BankAccountNumber: zod_1.z.string().optional(),
        BankAccountType: zod_1.z.string().optional(),
        CurrencyCode: zod_1.z.string().optional(),
        ReportingCode: zod_1.z.string().optional(),
        ReportingCodeName: zod_1.z.string().optional(),
        UpdatedDateUTC: zod_1.z.string().optional()
    });
})(Xero || (exports.Xero = Xero = {}));
var parseDotnetDate = function (date) {
    if (typeof date === "string") {
        var value = date.replace(/\/Date\((\d+)([-+]\d+)?\)\//, "$1");
        return new Date(parseInt(value));
    }
    return date;
};
exports.parseDotnetDate = parseDotnetDate;
var transformXeroPhones = function (contact) {
    var _a;
    var phones = (_a = contact.Phones) !== null && _a !== void 0 ? _a : [];
    var homePhone = phones.find(function (p) { return p.PhoneType === "DDI" && p.PhoneNumber; });
    var workPhone = phones.find(function (p) { return p.PhoneType === "DEFAULT" && p.PhoneNumber; });
    var mobilePhone = phones.find(function (p) { return p.PhoneType === "MOBILE" && p.PhoneNumber; });
    var fax = phones.find(function (p) { return p.PhoneType === "FAX" && p.PhoneNumber; });
    return {
        workPhone: workPhone === null || workPhone === void 0 ? void 0 : workPhone.PhoneNumber,
        mobilePhone: mobilePhone === null || mobilePhone === void 0 ? void 0 : mobilePhone.PhoneNumber,
        homePhone: homePhone === null || homePhone === void 0 ? void 0 : homePhone.PhoneNumber,
        fax: fax === null || fax === void 0 ? void 0 : fax.PhoneNumber
    };
};
exports.transformXeroPhones = transformXeroPhones;
var transformXeroContact = function (contact, companyId) {
    var _a, _b;
    var firstName = contact.FirstName || "";
    var lastName = contact.LastName || "";
    var addresses = (_a = contact.Addresses) !== null && _a !== void 0 ? _a : [];
    var _c = (0, exports.transformXeroPhones)(contact), workPhone = _c.workPhone, mobilePhone = _c.mobilePhone, homePhone = _c.homePhone;
    return {
        id: contact.ContactID,
        name: contact.Name,
        firstName: firstName,
        lastName: lastName,
        companyId: companyId,
        website: contact.Website,
        currencyCode: (_b = contact.DefaultCurrency) !== null && _b !== void 0 ? _b : "USD",
        taxId: contact.TaxNumber,
        email: contact.EmailAddress,
        isCustomer: contact.IsCustomer,
        isVendor: contact.IsSupplier,
        addresses: addresses.map(function (a) { return ({
            label: a.AttentionTo,
            line1: a.AddressLine1,
            line2: a.AddressLine2,
            city: a.City,
            region: a.Region,
            country: a.Country,
            postalCode: a.PostalCode
        }); }),
        workPhone: workPhone,
        mobilePhone: mobilePhone,
        homePhone: homePhone,
        updatedAt: (0, exports.parseDotnetDate)(contact.UpdatedDateUTC).toISOString(),
        raw: contact
    };
};
exports.transformXeroContact = transformXeroContact;
