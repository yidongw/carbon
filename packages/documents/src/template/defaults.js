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
exports.DOCUMENT_CATALOG = exports.DEFAULT_SALES_INVOICE_TEMPLATE = exports.DEFAULT_TEMPLATES = exports.ADDABLE_BLOCK_TYPES = exports.BLOCK_META = exports.BUILT_IN_SECTIONS = exports.BUILT_IN_SECTION_IDS = void 0;
exports.isBuiltInSectionId = isBuiltInSectionId;
exports.getBuiltInSection = getBuiltInSection;
exports.withBuiltInSections = withBuiltInSections;
exports.getDefaultTemplate = getDefaultTemplate;
exports.resolveTemplate = resolveTemplate;
exports.templateShowsThumbnails = templateShowsThumbnails;
exports.collectSectionIds = collectSectionIds;
exports.getDocumentLabel = getDocumentLabel;
exports.extensionSupport = extensionSupport;
exports.documentThemeColors = documentThemeColors;
var schema_1 = require("./schema");
/** Empty tiptap doc — renders nothing, so referencing it keeps output identical. */
function emptyDoc() {
    return { type: "doc", content: [] };
}
/**
 * Stable ids for the system-provided header/footer sections. Every company
 * gets these in the library (read-only) and every default template references
 * them, so the page header/footer is customizable out of the box without a
 * per-company DB seed. They start empty — the structural footer (registration
 * line + page numbers, see pdf/components/Footer) renders as it does today;
 * editing one forks it into a real `documentSection` row.
 */
exports.BUILT_IN_SECTION_IDS = {
    header: "system-header",
    footer: "system-footer"
};
exports.BUILT_IN_SECTIONS = [
    {
        id: exports.BUILT_IN_SECTION_IDS.header,
        name: "Default Header",
        placement: "header",
        content: emptyDoc(),
        config: __assign({}, schema_1.DEFAULT_HEADER_OPTIONS),
        builtIn: true
    },
    {
        id: exports.BUILT_IN_SECTION_IDS.footer,
        name: "Default Footer",
        placement: "footer",
        content: emptyDoc(),
        builtIn: true
    }
];
function isBuiltInSectionId(id) {
    return exports.BUILT_IN_SECTIONS.some(function (s) { return s.id === id; });
}
function getBuiltInSection(id) {
    return exports.BUILT_IN_SECTIONS.find(function (s) { return s.id === id; });
}
/**
 * Prepend the system sections to a company's stored rows (DB rows win on id
 * collision, so a forked/customized default replaces the built-in). Use this
 * anywhere the full section list is shown or resolved.
 */
function withBuiltInSections(rows) {
    var builtInIds = new Set(exports.BUILT_IN_SECTIONS.map(function (s) { return s.id; }));
    var overridden = new Set(rows.map(function (r) { return r.id; }));
    // A built-in section the user has customized exists as a DB row — keep its
    // `builtIn` flag so it still reads as System (editable, not deletable).
    var flaggedRows = rows.map(function (r) {
        return builtInIds.has(r.id) ? __assign(__assign({}, r), { builtIn: true }) : r;
    });
    return __spreadArray(__spreadArray([], exports.BUILT_IN_SECTIONS.filter(function (s) { return !overridden.has(s.id); }), true), flaggedRows, true);
}
exports.BLOCK_META = {
    header: {
        label: "Header",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    watermark: {
        label: "Watermark",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    parties: {
        label: "Addresses & Details",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    notes: {
        label: "Notes",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    details: {
        label: "Details",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    lineItems: {
        label: "Line Items",
        isBuiltIn: true,
        removable: false,
        hideable: false,
        addable: false
    },
    summary: {
        label: "Summary",
        isBuiltIn: true,
        removable: false,
        hideable: false,
        addable: false
    },
    terms: {
        label: "Terms & Conditions",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    jobDetails: {
        label: "Job Details",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    operations: {
        label: "Operations",
        isBuiltIn: true,
        removable: false,
        hideable: false,
        addable: false
    },
    issueDetails: {
        label: "Issue Details",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    associations: {
        label: "Associations",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    actionTasks: {
        label: "Action Tasks",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    reviewers: {
        label: "Reviewers",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelHeading: {
        label: "Item ID",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelRevision: {
        label: "Revision",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelQuantity: {
        label: "Quantity",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelTracking: {
        label: "Serial / Batch",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelEntityId: {
        label: "Identifier",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelBarcode: {
        // The scannable code (QR / barcode) — built-in, configurable symbology.
        label: "Code",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    labelLogo: {
        // Built-in like the Code block — toggle it on/off, not add/remove.
        label: "Logo",
        isBuiltIn: true,
        removable: false,
        hideable: true,
        addable: false
    },
    richText: {
        label: "Rich Text",
        isBuiltIn: false,
        removable: true,
        hideable: true,
        addable: true
    },
    keyValue: {
        label: "Key-Value List",
        isBuiltIn: false,
        removable: true,
        hideable: true,
        addable: true
    },
    spacer: {
        label: "Spacer / Divider",
        isBuiltIn: false,
        removable: true,
        hideable: true,
        addable: true
    },
    shared: {
        // Added via the "Shared section" submenu (lists real sections), not the
        // generic add menu — so addable is false.
        label: "Shared Section",
        isBuiltIn: false,
        removable: true,
        hideable: true,
        addable: false
    },
    customField: {
        // Added via the "Custom field" submenu (lists the record's fields).
        label: "Custom Field",
        isBuiltIn: false,
        removable: true,
        hideable: true,
        addable: false
    },
    field: {
        // Added via the label add menu ("Text" / "Key-value"), not the generic one.
        label: "Field",
        isBuiltIn: false,
        removable: true,
        hideable: true,
        addable: false
    }
};
/** Block types a user may append, in menu order. */
exports.ADDABLE_BLOCK_TYPES = Object.keys(exports.BLOCK_META).filter(function (type) { return exports.BLOCK_META[type].addable; });
/**
 * Standard layout for a transactional document (quote, order, invoice, PO).
 * Mirrors the hardcoded section order in the existing PDFs so output is
 * identical until a user customizes. Built-in blocks use stable ids (not
 * nanoid) so defaults are deterministic.
 */
function transactionalBlocks() {
    return [
        {
            id: "watermark",
            type: "watermark",
            visible: true,
            opacity: 0.07,
            placement: "center",
            size: 50
        },
        { id: "header", type: "header", visible: true },
        { id: "parties", type: "parties", visible: true },
        { id: "notes", type: "notes", visible: true },
        { id: "lineItems", type: "lineItems", visible: true },
        { id: "summary", type: "summary", visible: true },
        { id: "terms", type: "terms", visible: true }
    ];
}
/** Standard layout for a fulfillment document (packing slip): no summary. */
function fulfillmentBlocks() {
    return [
        { id: "header", type: "header", visible: true },
        { id: "parties", type: "parties", visible: true },
        { id: "details", type: "details", visible: true },
        { id: "lineItems", type: "lineItems", visible: true },
        { id: "notes", type: "notes", visible: true },
        { id: "terms", type: "terms", visible: true }
    ];
}
/** Internal warehouse doc (stock transfer): header + details + line items. */
function transferBlocks() {
    return [
        { id: "header", type: "header", visible: true },
        { id: "details", type: "details", visible: true },
        { id: "lineItems", type: "lineItems", visible: true }
    ];
}
/** Manufacturing routing doc (job traveler): header + job box + ops + notes. */
function jobTravelerBlocks() {
    return [
        { id: "header", type: "header", visible: true },
        { id: "jobDetails", type: "jobDetails", visible: true },
        {
            id: "operations",
            type: "operations",
            visible: true,
            showWorkInstructions: false
        },
        { id: "notes", type: "notes", visible: true }
    ];
}
/**
 * Tracking label: per-field elements stacked vertically inside each label tile.
 * No header/footer chrome belongs to the label body itself.
 */
function labelBlocks() {
    return [
        { id: "labelHeading", type: "labelHeading", visible: true },
        { id: "labelRevision", type: "labelRevision", visible: true },
        { id: "labelQuantity", type: "labelQuantity", visible: true },
        { id: "labelTracking", type: "labelTracking", visible: true },
        {
            id: "labelLogo",
            type: "labelLogo",
            visible: false,
            variant: "mark"
        },
        {
            id: "labelCode",
            type: "labelBarcode",
            visible: true,
            symbology: "qrcode",
            value: "{label.trackedEntityId}",
            placement: "right"
        },
        {
            id: "labelEntityId",
            type: "labelEntityId",
            visible: true,
            value: "{label.trackedEntityId}"
        }
    ];
}
/** Quality doc (issue): header + details + associations + notes + tasks + MRB. */
function issueBlocks() {
    return [
        { id: "header", type: "header", visible: true },
        { id: "issueDetails", type: "issueDetails", visible: true },
        { id: "associations", type: "associations", visible: true },
        { id: "notes", type: "notes", visible: true },
        { id: "actionTasks", type: "actionTasks", visible: true },
        { id: "reviewers", type: "reviewers", visible: true }
    ];
}
/**
 * Default template per supported document type. Adding a document = wire its
 * PDF to consume a template, then add its default here + to the schema enum.
 */
exports.DEFAULT_TEMPLATES = {
    salesInvoice: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "salesInvoice",
        blocks: transactionalBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    salesOrder: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "salesOrder",
        blocks: transactionalBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    purchaseOrder: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "purchaseOrder",
        blocks: transactionalBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    quote: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "quote",
        blocks: transactionalBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    packingSlip: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "packingSlip",
        blocks: fulfillmentBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    stockTransfer: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "stockTransfer",
        blocks: transferBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    jobTraveler: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "jobTraveler",
        blocks: jobTravelerBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    issue: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "issue",
        blocks: issueBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        headerSectionId: exports.BUILT_IN_SECTION_IDS.header,
        footerSectionId: exports.BUILT_IN_SECTION_IDS.footer
    },
    trackingLabel: {
        formatVersion: schema_1.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: "trackingLabel",
        blocks: labelBlocks(),
        theme: __assign({}, schema_1.DEFAULT_THEME),
        settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS),
        // Labels have no page chrome: the page is the label itself, so there is
        // no header or footer (the renderer ignores them and the editor hides
        // the rows).
        headerSectionId: null,
        footerSectionId: null
    }
};
/** @deprecated prefer getDefaultTemplate("salesInvoice"). Kept for callers. */
exports.DEFAULT_SALES_INVOICE_TEMPLATE = exports.DEFAULT_TEMPLATES.salesInvoice;
function getDefaultTemplate(documentType) {
    return exports.DEFAULT_TEMPLATES[documentType];
}
/**
 * Migrate a stored template's block list to the current format version. Today
 * v1 is the only version, so this is a pass-through — but it's the single seam
 * where future shape changes get upgraded on read.
 */
function migrateBlocks(blocks, _from) {
    return blocks;
}
/**
 * Resolve a stored template row to a renderable template, falling back to the
 * type's default when nothing is stored. Built-in blocks that are missing from
 * a stored template are appended (hidden) so a section added in a later release
 * never silently disappears from existing customer templates.
 */
function resolveTemplate(documentType, stored) {
    var _a, _b, _c;
    var fallback = getDefaultTemplate(documentType);
    if (!stored) {
        return __assign(__assign({}, fallback), { theme: __assign({}, schema_1.DEFAULT_THEME), settings: __assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS) });
    }
    var theme = __assign(__assign({}, schema_1.DEFAULT_THEME), ((_a = stored.theme) !== null && _a !== void 0 ? _a : {}));
    var settings = __assign(__assign({}, schema_1.DEFAULT_DOCUMENT_SETTINGS), ((_b = stored.settings) !== null && _b !== void 0 ? _b : {}));
    // A stored row carries explicit header/footer ids (null = "none" chosen by
    // the user). Only fall back to the default's ids when the field is absent.
    var headerSectionId = stored.headerSectionId !== undefined
        ? stored.headerSectionId
        : fallback.headerSectionId;
    var footerSectionId = stored.footerSectionId !== undefined
        ? stored.footerSectionId
        : fallback.footerSectionId;
    var formatVersion = schema_1.CURRENT_TEMPLATE_FORMAT_VERSION;
    var storedBlocks = stored.blocks
        ? migrateBlocks(stored.blocks, (_c = stored.formatVersion) !== null && _c !== void 0 ? _c : 1)
        : stored.blocks;
    if (!storedBlocks || storedBlocks.length === 0) {
        return __assign(__assign({}, fallback), { formatVersion: formatVersion, theme: theme, settings: settings, headerSectionId: headerSectionId, footerSectionId: footerSectionId });
    }
    var present = new Set(storedBlocks.map(function (b) { return b.type; }));
    var missingBuiltIns = fallback.blocks
        .filter(function (b) { return exports.BLOCK_META[b.type].isBuiltIn && !present.has(b.type); })
        .map(function (b) { return (__assign(__assign({}, b), { visible: false })); });
    return {
        formatVersion: formatVersion,
        documentType: documentType,
        blocks: __spreadArray(__spreadArray([], storedBlocks, true), missingBuiltIns, true),
        theme: theme,
        settings: settings,
        headerSectionId: headerSectionId,
        footerSectionId: footerSectionId
    };
}
/**
 * Whether a document's Line Items block renders thumbnails — the per-template
 * replacement for the old company-level `includeThumbnailsOn*Pdfs` flags. Used
 * by the file routes to decide whether to fetch the (expensive) image data.
 */
function templateShowsThumbnails(template, documentType) {
    var resolved = resolveTemplate(documentType, template);
    var block = resolved.blocks.find(function (b) { return b.type === "lineItems" && b.visible; });
    if (!block || block.type !== "lineItems")
        return false;
    return __assign(__assign({}, schema_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options).showThumbnails;
}
/** Collect every section id a template references (body blocks + header/footer). */
function collectSectionIds(template) {
    var ids = new Set();
    for (var _i = 0, _a = template.blocks; _i < _a.length; _i++) {
        var block = _a[_i];
        if (block.type === "shared" && block.sectionId)
            ids.add(block.sectionId);
    }
    if (template.headerSectionId)
        ids.add(template.headerSectionId);
    if (template.footerSectionId)
        ids.add(template.footerSectionId);
    return __spreadArray([], ids, true);
}
exports.DOCUMENT_CATALOG = [
    {
        type: "quote",
        label: "Quote",
        group: "Sales",
        supported: true,
        themeColors: "full"
    },
    {
        type: "salesOrder",
        label: "Sales Order",
        group: "Sales",
        supported: true,
        themeColors: "full"
    },
    {
        type: "salesInvoice",
        label: "Sales Invoice",
        group: "Sales",
        supported: true,
        themeColors: "full"
    },
    {
        type: "purchaseOrder",
        label: "Purchase Order",
        group: "Purchasing",
        supported: true,
        themeColors: "full"
    },
    {
        type: "packingSlip",
        label: "Packing Slip",
        group: "Inventory",
        supported: true,
        themeColors: "full"
    },
    {
        type: "stockTransfer",
        label: "Stock Transfer",
        group: "Inventory",
        supported: true,
        themeColors: "full"
    },
    {
        type: "jobTraveler",
        label: "Job Traveler",
        group: "Production",
        supported: true
    },
    {
        type: "issue",
        label: "Issue",
        group: "Quality",
        supported: true,
        themeColors: "text"
    },
    {
        type: "trackingLabel",
        label: "Tracking Label",
        group: "Labels",
        supported: true,
        extensions: "text"
    }
];
function getDocumentLabel(documentType) {
    var _a, _b;
    return ((_b = (_a = exports.DOCUMENT_CATALOG.find(function (entry) { return entry.type === documentType; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : documentType);
}
/** Which extension blocks a document supports (defaults to "all"). */
function extensionSupport(documentType) {
    var _a, _b;
    return ((_b = (_a = exports.DOCUMENT_CATALOG.find(function (entry) { return entry.type === documentType; })) === null || _a === void 0 ? void 0 : _a.extensions) !== null && _b !== void 0 ? _b : "all");
}
/**
 * The theme color keys that apply to a document, in display order — driven by
 * the catalog's `themeColors` policy. "full" docs get the accent bar; "text"
 * docs only headings + body; the rest (labels, fixed-palette internal docs) get
 * none. Drives which swatches the editor shows so users only see colors that
 * take effect.
 */
function documentThemeColors(documentType) {
    var _a;
    var mode = (_a = exports.DOCUMENT_CATALOG.find(function (entry) { return entry.type === documentType; })) === null || _a === void 0 ? void 0 : _a.themeColors;
    if (!mode)
        return [];
    var keys = [];
    if (mode === "full")
        keys.push("accent", "accentForeground");
    keys.push("heading", "text");
    return keys;
}
