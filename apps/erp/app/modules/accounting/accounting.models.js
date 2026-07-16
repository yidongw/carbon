"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedAssetDisposalValidator = exports.fixedAssetUsageLogValidator = exports.depreciationRunValidator = exports.fixedAssetRegisterValidator = exports.fixedAssetValidator = exports.fixedAssetClassValidator = exports.disposalMethods = exports.taxDepreciationMethods = exports.depreciationMethods = exports.fixedAssetStatuses = exports.dimensionValidator = exports.dimensionEntityTypes = exports.journalEntryLineValidator = exports.journalEntryValidator = exports.journalEntryStatuses = exports.journalEntrySourceTypes = exports.intercompanyTransactionValidator = exports.intercompanyTransactionStatuses = exports.costCenterValidator = exports.costLedgerValidator = exports.paymentTermValidator = exports.paymentTermsCalculationMethod = exports.defaultAccountValidator = exports.defaultIncomeAcountValidator = exports.defaultBalanceSheetAccountValidator = exports.currencyValidator = exports.journalLineValidator = exports.fiscalYearSettingsValidator = exports.accountValidator = exports.moveAccountValidator = exports.groupAccountValidator = exports.accountClassTypes = exports.incomeBalanceTypes = exports.journalLineDocumentType = exports.consolidatedRateTypes = exports.accountTypes = exports.macrsPropertyClasses = exports.macrsConventions = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_1 = require("~/modules/shared");
var zodFields_1 = require("~/utils/zodFields");
var inventory_models_1 = require("../inventory/inventory.models");
var accounting_utils_1 = require("./accounting.utils");
Object.defineProperty(exports, "macrsConventions", { enumerable: true, get: function () { return accounting_utils_1.macrsConventions; } });
Object.defineProperty(exports, "macrsPropertyClasses", { enumerable: true, get: function () { return accounting_utils_1.macrsPropertyClasses; } });
exports.accountTypes = [
    "Bank",
    "Cash",
    "Accounts Receivable",
    "Accounts Payable",
    "Inventory",
    "Fixed Asset",
    "Accumulated Depreciation",
    "Other Current Asset",
    "Other Asset",
    "Other Current Liability",
    "Long Term Liability",
    "Equity - No Close",
    "Equity - Close",
    "Retained Earnings",
    "Income",
    "Cost of Goods Sold",
    "Expense",
    "Other Income",
    "Other Expense",
    "Tax",
    "Investments"
];
exports.consolidatedRateTypes = [
    "Average",
    "Current",
    "Historical"
];
var costLedgerTypes = [
    "Direct Cost",
    "Revaluation",
    "Rounding",
    "Indirect Cost",
    "Variance",
    "Total"
];
exports.journalLineDocumentType = [
    "Receipt",
    "Invoice",
    "Credit Memo",
    "Blanket Order",
    "Return Order"
];
exports.incomeBalanceTypes = [
    "Balance Sheet",
    "Income Statement"
];
exports.accountClassTypes = [
    "Asset",
    "Liability",
    "Equity",
    "Revenue",
    "Expense"
];
exports.groupAccountValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    parentId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountType: zod_1.z
        .enum(exports.accountTypes, {
        errorMap: function () { return ({
            message: "Account type is required"
        }); }
    })
        .optional(),
    incomeBalance: zod_1.z.enum(exports.incomeBalanceTypes, {
        errorMap: function () { return ({
            message: "Income balance is required"
        }); }
    }),
    class: zod_1.z.enum(exports.accountClassTypes, {
        errorMap: function () { return ({
            message: "Class is required"
        }); }
    })
})
    .refine(function (data) {
    if (["Asset", "Liability", "Equity"].includes(data.class)) {
        return data.incomeBalance === "Balance Sheet";
    }
    return true;
}, {
    message: "Asset, Liability and Equity are Balance Sheet accounts",
    path: ["class"]
})
    .refine(function (data) {
    if (["Revenue", "Expense"].includes(data.class)) {
        return data.incomeBalance === "Income Statement";
    }
    return true;
}, {
    message: "Revenue and Expense are Income Statement accounts",
    path: ["class"]
});
exports.moveAccountValidator = zod_1.z.object({
    id: zod_1.z.string().min(1),
    parentId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.accountValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    number: zod_1.z.string().min(1, { message: "Number is required" }).nullish(),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    parentId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    isGroup: zod_form_data_1.zfd.checkbox(),
    accountType: zod_1.z
        .enum(exports.accountTypes, {
        errorMap: function () { return ({
            message: "Account type is required"
        }); }
    })
        .optional(),
    incomeBalance: zod_1.z.enum(exports.incomeBalanceTypes, {
        errorMap: function () { return ({
            message: "Income balance is required"
        }); }
    }),
    class: zod_1.z.enum(exports.accountClassTypes, {
        errorMap: function () { return ({
            message: "Class is required"
        }); }
    }),
    consolidatedRate: zod_1.z.enum(exports.consolidatedRateTypes)
})
    .refine(function (data) {
    if (["Asset", "Liability", "Equity"].includes(data.class)) {
        return data.incomeBalance === "Balance Sheet";
    }
    return true;
}, {
    message: "Asset, Liability and Equity are Balance Sheet accounts",
    path: ["class"]
})
    .refine(function (data) {
    if (["Revenue", "Expense"].includes(data.class)) {
        return data.incomeBalance === "Income Statement";
    }
    return true;
}, {
    message: "Revenue and Expense are Income Statement accounts",
    path: ["class"]
})
    .refine(function (data) {
    if (!data.isGroup) {
        return !!data.accountType;
    }
    return true;
}, {
    message: "Account type is required for ledger accounts",
    path: ["accountType"]
});
exports.fiscalYearSettingsValidator = zod_1.z.object({
    startMonth: zod_1.z.enum(shared_1.months, {
        errorMap: function (issue, ctx) { return ({
            message: "Start month is required"
        }); }
    }),
    taxStartMonth: zod_1.z.enum(shared_1.months, {
        errorMap: function (issue, ctx) { return ({
            message: "Tax start month is required"
        }); }
    })
});
exports.journalLineValidator = zod_1.z.object({
    postingDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountId: zod_1.z.string().min(1, { message: "Account is required" }),
    description: zod_1.z.string().optional(),
    amount: zod_1.z.number(),
    documentType: zod_1.z.union([zod_1.z.enum(exports.journalLineDocumentType), zod_1.z.undefined()]),
    documentId: zod_1.z.string().optional(),
    externalDocumentId: zod_1.z.string().optional()
});
exports.currencyValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    code: zod_1.z.string().min(1, { message: "Code is required" }),
    decimalPlaces: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(4)),
    exchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Rate is required" })),
    historicalExchangeRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Rate must be positive" }).optional())
});
exports.defaultBalanceSheetAccountValidator = zod_1.z.object({
    inventoryAccount: zod_1.z.string().min(1, {
        message: "Inventory account is required"
    }),
    goodsReceivedNotInvoicedAccount: zod_1.z.string().min(1, {
        message: "GR/IR clearing account is required"
    }),
    inventoryShippedNotInvoicedAccount: zod_1.z.string().min(1, {
        message: "Inventory shipped not invoiced account is required"
    }),
    workInProgressAccount: zod_1.z.string().min(1, {
        message: "Work in progress account is required"
    }),
    receivablesAccount: zod_1.z.string().min(1, {
        message: "Receivables account is required"
    }),
    bankCashAccount: zod_1.z.string().min(1, {
        message: "Bank cash account is required"
    }),
    bankLocalCurrencyAccount: zod_1.z.string().min(1, {
        message: "Bank local currency account is required"
    }),
    bankForeignCurrencyAccount: zod_1.z.string().min(1, {
        message: "Bank foreign currency account is required"
    }),
    assetAquisitionCostAccount: zod_1.z.string().min(1, {
        message: "Aquisition cost account is required"
    }),
    assetAquisitionCostOnDisposalAccount: zod_1.z.string().min(1, {
        message: "Aquisition cost on disposal account is required"
    }),
    accumulatedDepreciationAccount: zod_1.z.string().min(1, {
        message: "Accumulated depreciation account is required"
    }),
    accumulatedDepreciationOnDisposalAccount: zod_1.z.string().min(1, {
        message: "Accumulated depreciation on disposal account is required"
    }),
    prepaymentAccount: zod_1.z.string().min(1, {
        message: "Prepayment account is required"
    }),
    payablesAccount: zod_1.z.string().min(1, {
        message: "Payables account is required"
    }),
    salesTaxPayableAccount: zod_1.z.string().min(1, {
        message: "Sales tax payable account is required"
    }),
    purchaseTaxPayableAccount: zod_1.z.string().min(1, {
        message: "Purchase tax payable account is required"
    }),
    reverseChargeSalesTaxPayableAccount: zod_1.z.string().min(1, {
        message: "Reverse charge sales tax payable account is required"
    }),
    retainedEarningsAccount: zod_1.z.string().min(1, {
        message: "Retained earnings account is required"
    }),
    currencyTranslationAccount: zod_1.z.string().min(1, {
        message: "Currency translation account is required"
    }),
    deferredTaxLiabilityAccountId: zod_1.z.string().min(1, {
        message: "Deferred tax liability account is required"
    })
});
exports.defaultIncomeAcountValidator = zod_1.z.object({
    salesAccount: zod_1.z.string().min(1, { message: "Sales account is required" }),
    salesDiscountAccount: zod_1.z.string().min(1, {
        message: "Sales discount account is required"
    }),
    costOfGoodsSoldAccount: zod_1.z.string().min(1, {
        message: "Cost of goods sold account is required"
    }),
    purchaseVarianceAccount: zod_1.z.string().min(1, {
        message: "Purchase price variance account is required"
    }),
    inventoryAdjustmentVarianceAccount: zod_1.z.string().min(1, {
        message: "Inventory adjustment variance account is required"
    }),
    materialVarianceAccount: zod_1.z.string().min(1, {
        message: "Material usage variance account is required"
    }),
    laborAndMachineVarianceAccount: zod_1.z.string().min(1, {
        message: "Labor & machine variance account is required"
    }),
    overheadVarianceAccount: zod_1.z.string().min(1, {
        message: "Overhead variance account is required"
    }),
    lotSizeVarianceAccount: zod_1.z.string().min(1, {
        message: "Lot size variance account is required"
    }),
    subcontractingVarianceAccount: zod_1.z.string().min(1, {
        message: "Subcontracting variance account is required"
    }),
    laborAbsorptionAccount: zod_1.z.string().min(1, {
        message: "Labor absorption account is required"
    }),
    indirectCostAccount: zod_1.z.string().min(1, {
        message: "Indirect cost account is required"
    }),
    maintenanceAccount: zod_1.z.string().min(1, {
        message: "Maintenance account is required"
    }),
    assetDepreciationExpenseAccount: zod_1.z.string().min(1, {
        message: "Depreciation expense account is required"
    }),
    assetGainsAndLossesAccount: zod_1.z.string().min(1, {
        message: "Gains and losses account is required"
    }),
    serviceChargeAccount: zod_1.z.string().min(1, {
        message: "Service charge account is required"
    }),
    interestAccount: zod_1.z.string().min(1, {
        message: "Interest account is required"
    }),
    supplierPaymentDiscountAccount: zod_1.z.string().min(1, {
        message: "Supplier payment discount account is required"
    }),
    customerPaymentDiscountAccount: zod_1.z.string().min(1, {
        message: "Customer payment discount account is required"
    }),
    roundingAccount: zod_1.z.string().min(1, {
        message: "Rounding account is required"
    }),
    deferredTaxExpenseAccountId: zod_1.z.string().min(1, {
        message: "Deferred tax expense account is required"
    })
});
exports.defaultAccountValidator = exports.defaultBalanceSheetAccountValidator.merge(exports.defaultIncomeAcountValidator);
exports.paymentTermsCalculationMethod = [
    "Net",
    "End of Month",
    "Day of Month"
];
exports.paymentTermValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    daysDue: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0, { message: "Days due must be greater than or equal to 0" })),
    daysDiscount: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0, { message: "Days discount must be greater than or equal to 0" })),
    discountPercentage: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0, {
        message: "Discount percent must be greater than or equal to 0"
    })
        .max(100, {
        message: "Discount percent must be less than or equal to 100"
    })),
    calculationMethod: zod_1.z.enum(["Net", "End of Month", "Day of Month"], {
        errorMap: function (issue, ctx) { return ({
            message: "Calculation method is required"
        }); }
    })
});
exports.costLedgerValidator = zod_1.z.object({
    postingDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    itemLedgerType: zod_1.z.enum(inventory_models_1.itemLedgerTypes),
    costLedgerType: zod_1.z.enum(costLedgerTypes),
    adjustment: zod_1.z.boolean(),
    documentType: zod_1.z.union([zod_1.z.enum(inventory_models_1.itemLedgerDocumentTypes), zod_1.z.undefined()]),
    documentId: zod_1.z.string().optional(),
    itemId: zod_form_data_1.zfd.text(zod_1.z.string()),
    quantity: zod_1.z.number(),
    cost: zod_1.z.number(),
    costPostedToGL: zod_1.z.number()
});
exports.costCenterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    parentCostCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    ownerId: zod_1.z.string().min(1, { message: "Owner is required" })
});
exports.intercompanyTransactionStatuses = [
    "Unmatched",
    "Matched",
    "Eliminated"
];
exports.intercompanyTransactionValidator = zod_1.z
    .object({
    sourceCompanyId: zod_1.z
        .string()
        .min(1, { message: "Source company is required" }),
    targetCompanyId: zod_1.z
        .string()
        .min(1, { message: "Target company is required" }),
    amount: zod_form_data_1.zfd.numeric(zod_1.z.number().positive({ message: "Amount must be positive" })),
    currencyCode: zod_1.z.string().min(1, { message: "Currency is required" }),
    description: zod_1.z.string().min(1, { message: "Description is required" }),
    debitAccountId: zod_1.z.string().min(1, { message: "Debit account is required" }),
    creditAccountId: zod_1.z
        .string()
        .min(1, { message: "Credit account is required" }),
    postingDate: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    return data.debitAccountId !== data.creditAccountId;
}, {
    message: "Debit and credit account must be different"
})
    .refine(function (data) {
    return data.sourceCompanyId !== data.targetCompanyId;
}, {
    message: "Source and target company must be different"
});
exports.journalEntrySourceTypes = [
    "Manual",
    "Purchase Receipt",
    "Purchase Invoice",
    "Purchase Return",
    "Sales Invoice",
    "Sales Shipment",
    "Sales Return",
    "Transfer Receipt",
    "Inventory Adjustment",
    "Production Order",
    "Job Consumption",
    "Job Receipt",
    "Production Event",
    "Job Close",
    "Asset Depreciation",
    "Asset Disposal"
];
exports.journalEntryStatuses = ["Draft", "Posted", "Reversed"];
exports.journalEntryValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    description: zod_1.z.string().optional(),
    postingDate: zod_1.z.string().min(1, { message: "Posting date is required" })
});
exports.journalEntryLineValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    journalEntryId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    accountId: zod_1.z.string().min(1, { message: "Account is required" }),
    description: zod_1.z.string().optional(),
    debit: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    credit: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
})
    .refine(function (data) { return !(data.debit > 0 && data.credit > 0); }, {
    message: "A line cannot have both debit and credit",
    path: ["credit"]
})
    .refine(function (data) { return data.debit > 0 || data.credit > 0; }, {
    message: "Either debit or credit is required",
    path: ["debit"]
});
exports.dimensionEntityTypes = [
    "CostCenter",
    "Custom",
    "CustomerType",
    "Department",
    "Employee",
    "FixedAssetClass",
    "ItemPostingGroup",
    "Location",
    "Process",
    "SupplierType",
    "WorkCenter"
];
exports.dimensionValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    entityType: zod_1.z.enum(exports.dimensionEntityTypes, {
        errorMap: function () { return ({ message: "Entity type is required" }); }
    }),
    active: zod_form_data_1.zfd.checkbox(),
    required: zod_form_data_1.zfd.checkbox(),
    dimensionValues: zodFields_1.optionalRequiredStringArray
});
// -- Fixed Asset Models --
exports.fixedAssetStatuses = [
    "Draft",
    "Active",
    "Fully Depreciated",
    "Disposed"
];
exports.depreciationMethods = [
    "Straight Line",
    "Declining Balance",
    "Units of Production"
];
exports.taxDepreciationMethods = [
    "Straight Line",
    "Declining Balance",
    "MACRS"
];
exports.disposalMethods = ["Sale", "Scrapping"];
exports.fixedAssetClassValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_1.z.string().optional(),
    depreciationMethod: zod_1.z.enum(exports.depreciationMethods, {
        errorMap: function () { return ({ message: "Depreciation method is required" }); }
    }),
    usefulLifeMonths: zod_form_data_1.zfd.numeric(zod_1.z.number().int().positive({ message: "Useful life must be positive" })),
    residualValuePercent: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0, { message: "Residual value must be >= 0" })
        .max(100, { message: "Residual value must be <= 100" })),
    assetAccountId: zod_1.z.string().min(1, { message: "Asset account is required" }),
    accumulatedDepreciationAccountId: zod_1.z
        .string()
        .min(1, { message: "Accumulated depreciation account is required" }),
    depreciationExpenseAccountId: zod_1.z
        .string()
        .min(1, { message: "Depreciation expense account is required" }),
    writeOffAccountId: zod_1.z
        .string()
        .min(1, { message: "Write-off account is required" }),
    writeDownAccountId: zod_1.z
        .string()
        .min(1, { message: "Write-down account is required" }),
    disposalAccountId: zod_1.z
        .string()
        .min(1, { message: "Disposal account is required" }),
    taxDepreciationMethod: zod_1.z.preprocess(function (val) { return (val === "" ? null : val); }, zod_1.z.enum(exports.taxDepreciationMethods).nullable().optional()),
    taxUsefulLifeMonths: zod_form_data_1.zfd.numeric(zod_1.z.number().int().positive().nullable().optional()),
    taxResidualValuePercent: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(100).nullable().optional()),
    macrsPropertyClass: zod_1.z.enum(accounting_utils_1.macrsPropertyClasses).nullable().optional(),
    macrsConvention: zod_1.z.enum(accounting_utils_1.macrsConventions).nullable().optional(),
    bonusDepreciationPercent: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(100).nullable().optional())
});
exports.fixedAssetValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    fixedAssetClassId: zod_1.z.string().min(1, { message: "Asset class is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_1.z.string().optional(),
    serialNumber: zod_1.z.string().optional(),
    depreciationMethod: zod_1.z.enum(exports.depreciationMethods, {
        errorMap: function () { return ({ message: "Depreciation method is required" }); }
    }),
    usefulLifeMonths: zod_form_data_1.zfd.numeric(zod_1.z.number().int().positive({ message: "Useful life must be positive" })),
    residualValuePercent: zod_form_data_1.zfd.numeric(zod_1.z
        .number()
        .min(0, { message: "Residual value must be >= 0" })
        .max(100, { message: "Residual value must be <= 100" })),
    assetLifetimeUsage: zod_form_data_1.zfd.numeric(zod_1.z.number().positive().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    taxDepreciationMethod: zod_1.z.preprocess(function (val) { return (val === "" ? null : val); }, zod_1.z.enum(exports.taxDepreciationMethods).nullable().optional()),
    taxUsefulLifeMonths: zod_form_data_1.zfd.numeric(zod_1.z.number().int().positive().nullable().optional()),
    taxResidualValuePercent: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(100).nullable().optional()),
    macrsPropertyClass: zod_1.z.preprocess(function (val) { return (val === "" ? null : val); }, zod_1.z.enum(accounting_utils_1.macrsPropertyClasses).nullable().optional()),
    macrsConvention: zod_1.z.preprocess(function (val) { return (val === "" ? null : val); }, zod_1.z.enum(accounting_utils_1.macrsConventions).nullable().optional()),
    bonusDepreciationPercent: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).max(100).nullable().optional())
});
exports.fixedAssetRegisterValidator = zod_1.z.object({
    acquisitionCost: zod_form_data_1.zfd.numeric(zod_1.z.number().positive({ message: "Acquisition cost must be positive" })),
    acquisitionDate: zod_1.z
        .string()
        .min(1, { message: "Acquisition date is required" }),
    accumulatedDepreciation: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Accumulated depreciation must be >= 0" })),
    depreciationStartDate: zod_1.z
        .string()
        .min(1, { message: "Depreciation start date is required" })
});
exports.depreciationRunValidator = zod_1.z.object({
    periodEnd: zod_1.z.string().min(1, { message: "Period end date is required" })
});
exports.fixedAssetUsageLogValidator = zod_1.z.object({
    fixedAssetId: zod_1.z.string().min(1, { message: "Asset is required" }),
    periodStart: zod_1.z.string().min(1, { message: "Period start is required" }),
    periodEnd: zod_1.z.string().min(1, { message: "Period end is required" }),
    unitsProduced: zod_form_data_1.zfd.numeric(zod_1.z.number().positive({ message: "Units must be positive" }))
});
exports.fixedAssetDisposalValidator = zod_1.z.object({
    disposalDate: zod_1.z.string().min(1, { message: "Disposal date is required" })
});
