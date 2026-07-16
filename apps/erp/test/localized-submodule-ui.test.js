"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var root = (0, node_path_1.join)(process.cwd(), "app");
var files = [
    "modules/sales/ui/Customers/CustomersTable.tsx",
    "modules/sales/ui/Quotes/QuotesTable.tsx",
    "modules/sales/ui/SalesRFQ/SalesRFQsTable.tsx",
    "modules/sales/ui/SalesOrder/SalesOrdersTable.tsx",
    "modules/sales/ui/Customer/CustomerHeader.tsx",
    "modules/sales/ui/Quotes/QuoteHeader.tsx",
    "modules/sales/ui/SalesRFQ/SalesRFQHeader.tsx",
    "modules/sales/ui/SalesOrder/SalesOrderHeader.tsx",
    "modules/sales/ui/SalesOrder/SalesOrderSummary.tsx",
    "modules/invoicing/ui/SalesInvoice/SalesInvoicesTable.tsx",
    "modules/invoicing/ui/PurchaseInvoice/PurchaseInvoicesTable.tsx",
    "modules/invoicing/ui/PurchaseInvoice/PurchaseInvoiceHeader.tsx"
];
var forbiddenPatterns = [
    {
        pattern: /header:\s*"[^"]+"/g,
        description: "raw string table header"
    },
    {
        pattern: /pluralHeader:\s*"[^"]+"/g,
        description: "raw string plural header"
    },
    {
        pattern: /title="[^"]+"/g,
        description: "raw string title prop"
    },
    {
        pattern: /<New\s+label="[^"]+"/g,
        description: "raw string New label"
    },
    {
        pattern: />\s*Edit\s*</g,
        description: "raw Edit menu label"
    },
    {
        pattern: />\s*Delete\s*</g,
        description: "raw Delete menu label"
    },
    {
        pattern: /text=\{`Are you sure you want to delete[\s\S]*?This cannot be undone\.`\}/g,
        description: "raw delete confirmation text"
    },
    {
        pattern: /aria-label="(?:Toggle Explorer|More options|Toggle Properties)"/g,
        description: "raw header aria label"
    },
    {
        pattern: /<CardAttributeLabel>[^<{]+<\/CardAttributeLabel>/g,
        description: "raw card attribute label"
    },
    {
        pattern: />\s*(?:Delete Customer|Delete RFQ|Delete Quote|Delete Sales Order|Delete Purchase Invoice|Share|Preview|Finalize|Won|Lost|Cancel|Reopen|Ready for Quote|Quote|No Quote|Post|Payment|Purchase Order|Purchase Orders|Receipt|Receipts|Confirm|New Shipment|New Invoice|Shipments|Ship|Invoices|Invoice|Create Jobs|Edit Shipping|Add Shipping)\s*</g,
        description: "raw header action label"
    }
];
(0, vitest_1.describe)("localized sales and invoicing submodule UI", function () {
    (0, vitest_1.test)("avoids raw UI strings in localized table and header screens", function () {
        var offenders = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var relativePath = files_1[_i];
            var source = (0, node_fs_1.readFileSync)((0, node_path_1.join)(root, relativePath), "utf8");
            var sanitizedSource = source.replace(/\/\*[\s\S]*?\*\//g, "");
            for (var _a = 0, forbiddenPatterns_1 = forbiddenPatterns; _a < forbiddenPatterns_1.length; _a++) {
                var _b = forbiddenPatterns_1[_a], pattern = _b.pattern, description = _b.description;
                if (pattern.test(sanitizedSource)) {
                    offenders.push("".concat(relativePath, ": ").concat(description));
                }
            }
        }
        (0, vitest_1.expect)(offenders).toEqual([]);
    });
});
