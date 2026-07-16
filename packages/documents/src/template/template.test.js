"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var defaults_1 = require("./defaults");
var schema_1 = require("./schema");
(0, vitest_1.describe)("documentThemeColors", function () {
    (0, vitest_1.it)("gives table documents the full color set", function () {
        (0, vitest_1.expect)((0, defaults_1.documentThemeColors)("salesInvoice")).toEqual([
            "accent",
            "accentForeground",
            "heading",
            "text"
        ]);
    });
    (0, vitest_1.it)("gives the issue document headings + body only (no accent bar)", function () {
        (0, vitest_1.expect)((0, defaults_1.documentThemeColors)("issue")).toEqual(["heading", "text"]);
    });
    (0, vitest_1.it)("gives labels and the job traveler no theme colors", function () {
        (0, vitest_1.expect)((0, defaults_1.documentThemeColors)("trackingLabel")).toEqual([]);
        (0, vitest_1.expect)((0, defaults_1.documentThemeColors)("jobTraveler")).toEqual([]);
    });
});
(0, vitest_1.describe)("resolveTemplate", function () {
    (0, vitest_1.it)("falls back to the default template when nothing is stored", function () {
        (0, vitest_1.expect)((0, defaults_1.resolveTemplate)("salesInvoice", undefined)).toEqual(defaults_1.DEFAULT_SALES_INVOICE_TEMPLATE);
        (0, vitest_1.expect)((0, defaults_1.resolveTemplate)("salesInvoice", { blocks: [] })).toEqual(defaults_1.DEFAULT_SALES_INVOICE_TEMPLATE);
    });
    (0, vitest_1.it)("preserves stored block order and visibility", function () {
        var _a, _b;
        var stored = [
            { id: "summary", type: "summary", visible: true },
            { id: "lineItems", type: "lineItems", visible: true },
            { id: "header", type: "header", visible: false },
            { id: "parties", type: "parties", visible: true },
            { id: "notes", type: "notes", visible: true },
            { id: "terms", type: "terms", visible: true }
        ];
        var blocks = (0, defaults_1.resolveTemplate)("salesInvoice", { blocks: stored }).blocks;
        (0, vitest_1.expect)(blocks.map(function (b) { return b.type; })).toEqual([
            "summary",
            "lineItems",
            "header",
            "parties",
            "notes",
            "terms",
            // watermark is a built-in not in the stored set, appended hidden
            "watermark"
        ]);
        (0, vitest_1.expect)((_a = blocks.find(function (b) { return b.type === "header"; })) === null || _a === void 0 ? void 0 : _a.visible).toBe(false);
        (0, vitest_1.expect)((_b = blocks.find(function (b) { return b.type === "watermark"; })) === null || _b === void 0 ? void 0 : _b.visible).toBe(false);
    });
    (0, vitest_1.it)("appends missing built-in blocks as hidden", function () {
        var stored = [
            { id: "lineItems", type: "lineItems", visible: true },
            { id: "summary", type: "summary", visible: true }
        ];
        var blocks = (0, defaults_1.resolveTemplate)("salesInvoice", { blocks: stored }).blocks;
        var header = blocks.find(function (b) { return b.type === "header"; });
        (0, vitest_1.expect)(header).toBeDefined();
        (0, vitest_1.expect)(header === null || header === void 0 ? void 0 : header.visible).toBe(false);
        // stored blocks stay first, appended built-ins follow
        (0, vitest_1.expect)(blocks.slice(0, 2).map(function (b) { return b.type; })).toEqual([
            "lineItems",
            "summary"
        ]);
    });
});
(0, vitest_1.describe)("block metadata invariants", function () {
    (0, vitest_1.it)("keeps line items and summary non-hideable and non-removable", function () {
        for (var _i = 0, _a = ["lineItems", "summary"]; _i < _a.length; _i++) {
            var type = _a[_i];
            (0, vitest_1.expect)(defaults_1.BLOCK_META[type].hideable).toBe(false);
            (0, vitest_1.expect)(defaults_1.BLOCK_META[type].removable).toBe(false);
        }
    });
    (0, vitest_1.it)("only exposes extension blocks in the add menu", function () {
        (0, vitest_1.expect)(defaults_1.ADDABLE_BLOCK_TYPES).toEqual(["richText", "keyValue", "spacer"]);
        for (var _i = 0, ADDABLE_BLOCK_TYPES_1 = defaults_1.ADDABLE_BLOCK_TYPES; _i < ADDABLE_BLOCK_TYPES_1.length; _i++) {
            var type = ADDABLE_BLOCK_TYPES_1[_i];
            (0, vitest_1.expect)(defaults_1.BLOCK_META[type].isBuiltIn).toBe(false);
            (0, vitest_1.expect)(defaults_1.BLOCK_META[type].removable).toBe(true);
        }
    });
});
(0, vitest_1.describe)("document settings", function () {
    (0, vitest_1.it)("includes default settings on the default template", function () {
        (0, vitest_1.expect)(defaults_1.DEFAULT_SALES_INVOICE_TEMPLATE.settings).toEqual({
            fontFamily: "Inter",
            showPageNumbers: true,
            pageNumberFormat: "pageOfTotal",
            showRegistrationLine: true
        });
    });
    (0, vitest_1.it)("merges a partial stored settings over defaults", function () {
        var settings = (0, defaults_1.resolveTemplate)("salesInvoice", {
            blocks: [{ id: "summary", type: "summary", visible: true }],
            settings: { showPageNumbers: false }
        }).settings;
        (0, vitest_1.expect)(settings).toEqual({
            fontFamily: "Inter",
            showPageNumbers: false,
            pageNumberFormat: "pageOfTotal",
            showRegistrationLine: true
        });
    });
});
(0, vitest_1.describe)("schema validation", function () {
    (0, vitest_1.it)("parses extension blocks and applies defaults", function () {
        var spacer = schema_1.blockSchema.parse({ id: "s1", type: "spacer" });
        (0, vitest_1.expect)(spacer).toMatchObject({ visible: true, variant: "space" });
        var keyValue = schema_1.blockSchema.parse({ id: "k1", type: "keyValue" });
        (0, vitest_1.expect)(keyValue).toMatchObject({ visible: true, rows: [] });
    });
    (0, vitest_1.it)("parses built-in blocks with and without options", function () {
        var bare = schema_1.blockSchema.parse({ id: "header", type: "header" });
        (0, vitest_1.expect)(bare).toMatchObject({ type: "header", visible: true });
        var withOptions = schema_1.blockSchema.parse({
            id: "header",
            type: "header",
            options: { showLogo: false, logoHeight: 40 }
        });
        (0, vitest_1.expect)(withOptions).toMatchObject({
            type: "header",
            options: { showLogo: false, logoHeight: 40 }
        });
        var lineItems = schema_1.blockSchema.parse({
            id: "lineItems",
            type: "lineItems",
            options: { zebra: false }
        });
        (0, vitest_1.expect)(lineItems).toMatchObject({ options: { zebra: false } });
    });
    (0, vitest_1.it)("rejects unknown block types", function () {
        (0, vitest_1.expect)(function () { return schema_1.blockSchema.parse({ id: "x", type: "bogus" }); }).toThrow();
    });
    (0, vitest_1.it)("validates a full template document", function () {
        var parsed = schema_1.documentTemplateSchema.parse(defaults_1.DEFAULT_SALES_INVOICE_TEMPLATE);
        (0, vitest_1.expect)(parsed.blocks).toHaveLength(7);
    });
});
