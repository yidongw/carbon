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
exports.documentTemplateSchema = exports.CURRENT_TEMPLATE_FORMAT_VERSION = exports.documentTemplateTypeSchema = exports.documentSettingsSchema = exports.DEFAULT_DOCUMENT_SETTINGS = exports.DOCUMENT_FONTS = exports.themeSchema = exports.DEFAULT_THEME = exports.documentSectionSchema = exports.sectionConfigSchema = exports.documentSectionPlacementSchema = exports.blockSchema = exports.DEFAULT_SUMMARY_OPTIONS = exports.DEFAULT_LINE_ITEMS_OPTIONS = exports.headerOptionsSchema = exports.DEFAULT_HEADER_OPTIONS = exports.cropSchema = void 0;
exports.toDocumentTemplate = toDocumentTemplate;
var zod_1 = require("zod");
/**
 * Tiptap document content. We keep validation loose (the editor owns the real
 * shape) and only pin the static TS type — mirrors how `terms` is stored.
 */
var jsonContentSchema = zod_1.z.custom(function (val) { return typeof val === "object" && val !== null; });
/** Fields shared by every block, built-in or extension. */
var baseFields = {
    id: zod_1.z.string(),
    visible: zod_1.z.boolean().default(true)
};
/**
 * Built-in blocks map 1:1 to the hardcoded sections of a document. They are
 * data-bound (the renderer fills them from the document) so they carry no
 * user-authored props — only identity + visibility.
 */
var builtInBlock = function (type) {
    return zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal(type) }));
};
/**
 * A crop rectangle, normalized to the source image (0..1). `aspect` is the
 * pixel aspect ratio of the cropped region (cropPxW / cropPxH) so renderers can
 * size a clip box without knowing the image's intrinsic dimensions. Shared by
 * the document header logo and the tracking-label logo block.
 */
exports.cropSchema = zod_1.z.object({
    x: zod_1.z.number().min(0).max(1),
    y: zod_1.z.number().min(0).max(1),
    width: zod_1.z.number().min(0).max(1),
    height: zod_1.z.number().min(0).max(1),
    aspect: zod_1.z.number().positive()
});
/** Per-block display options for the Header block (logo + which fields show). */
exports.DEFAULT_HEADER_OPTIONS = {
    showLogo: true,
    logoVariant: "mark",
    logoHeight: 50,
    showCompanyDetails: true,
    showDocumentTitle: true,
    showDocumentId: true
};
exports.headerOptionsSchema = zod_1.z.object({
    showLogo: zod_1.z.boolean().default(true),
    /** Which company logo to use: full logo (`mark`) or the square `icon`. */
    logoVariant: zod_1.z.enum(["mark", "icon"]).default("mark"),
    logoHeight: zod_1.z.number().min(16).max(120).default(50),
    /** Optional crop applied before rendering (PDF clip box). */
    logoCrop: exports.cropSchema.optional(),
    showCompanyDetails: zod_1.z.boolean().default(true),
    showDocumentTitle: zod_1.z.boolean().default(true),
    showDocumentId: zod_1.z.boolean().default(true)
});
/** Per-block display options for the Line Items table. */
exports.DEFAULT_LINE_ITEMS_OPTIONS = {
    showThumbnails: true,
    zebra: true,
    textOverflow: "truncate"
};
var lineItemsOptionsSchema = zod_1.z.object({
    showThumbnails: zod_1.z.boolean().default(true),
    zebra: zod_1.z.boolean().default(true),
    /** How the item title/description behave: wrap to new lines or truncate. */
    textOverflow: zod_1.z.enum(["wrap", "truncate"]).default("truncate")
});
/** Per-block options for the Summary totals. */
exports.DEFAULT_SUMMARY_OPTIONS = {
    taxLabel: "Taxes"
};
var summaryOptionsSchema = zod_1.z.object({
    taxLabel: zod_1.z.string().default("Taxes")
});
var headerBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("header"), options: exports.headerOptionsSchema.optional() }));
var partiesBlock = builtInBlock("parties");
var notesBlock = builtInBlock("notes");
/** Data-bound metadata block (e.g. shipment/transfer details). */
var detailsBlock = builtInBlock("details");
var lineItemsBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("lineItems"), options: lineItemsOptionsSchema.optional() }));
var summaryBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("summary"), options: summaryOptionsSchema.optional() }));
/**
 * Terms & Conditions. Built-in (not addable/removable) but carries its own
 * rich-text `content` — per-document, seeded from the company terms setting.
 * Empty content falls back to that setting at render time.
 */
var termsBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("terms"), content: jsonContentSchema.optional() }));
/** Job Traveler built-ins (data-bound; render the existing bespoke content). */
var jobDetailsBlock = builtInBlock("jobDetails");
var operationsBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("operations"), 
    /** Print the full work instructions / procedure steps under each operation. */
    showWorkInstructions: zod_1.z.boolean().default(false) }));
/** Issue built-ins (data-bound; render the existing bespoke content). */
var issueDetailsBlock = builtInBlock("issueDetails");
var associationsBlock = builtInBlock("associations");
var actionTasksBlock = builtInBlock("actionTasks");
var reviewersBlock = builtInBlock("reviewers");
/** Tracking-label fields (data-bound; one per label element). */
var labelHeadingBlock = builtInBlock("labelHeading");
/** A label field whose printed name (the prefix before the value) is editable. */
var labelNamedField = function (type) {
    return zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal(type), label: zod_1.z.string().optional() }));
};
var labelRevisionBlock = labelNamedField("labelRevision");
var labelQuantityBlock = labelNamedField("labelQuantity");
var labelTrackingBlock = labelNamedField("labelTracking");
/** A human-readable identifier line (defaults to the tracked-entity id). */
var labelEntityIdBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("labelEntityId"), value: zod_1.z.string().default("{label.trackedEntityId}") }));
/**
 * A scannable code (QR / PDF417 / Code128 / DataMatrix). `placement` is "right"
 * (small, top-right next to the logo) or "full" (full-width band, e.g. PDF417).
 */
var labelBarcodeBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("labelBarcode"), symbology: zod_1.z
        .enum(["qrcode", "pdf417", "code128", "datamatrix"])
        .default("qrcode"), value: zod_1.z.string().default("{label.trackedEntityId}"), placement: zod_1.z.enum(["right", "full", "center"]).default("right"), height: zod_1.z.number().min(16).max(300).optional() }));
/** The company logo. Color in the PDF by default; `monochrome` for B&W / ZPL. */
var labelLogoBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("labelLogo"), 
    /** Which company logo to use: full logo (`mark`) or the square `icon`. */
    variant: zod_1.z.enum(["mark", "icon"]).default("mark"), monochrome: zod_1.z.boolean().optional(), 
    /** Optional crop applied before rendering (PDF clip box / ZPL pre-crop). */
    crop: exports.cropSchema.optional(), height: zod_1.z.number().min(16).max(160).optional() }));
/** Extension blocks are user-authored and fully removable. */
var richTextBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("richText"), title: zod_1.z.string().optional(), content: jsonContentSchema }));
var keyValueBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("keyValue"), title: zod_1.z.string().optional(), rows: zod_1.z.array(zod_1.z.object({ label: zod_1.z.string(), value: zod_1.z.string() })).default([]) }));
var spacerBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("spacer"), variant: zod_1.z.enum(["space", "divider", "pageBreak"]).default("space"), 
    /** Height in pt, only used by the "space" variant. */
    size: zod_1.z.number().min(0).max(200).optional() }));
/** Reference to a shared documentSection, resolved at render time. */
var sharedBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("shared"), sectionId: zod_1.z.string() }));
/**
 * A single authored line: an optional `label` plus a `value`. With no label it
 * is plain text; with a label it is a single key-value. Maps 1:1 to one ZPL
 * `^FD` line, so it's the label-safe alternative to rich text / key-value lists.
 */
var fieldBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("field"), label: zod_1.z.string().optional(), value: zod_1.z.string().default("") }));
/** Displays a single custom-field value (label + value) from the record. */
var customFieldBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("customField"), 
    /** The custom field's id (key into the record's `customFields` JSON). */
    fieldId: zod_1.z.string(), 
    /** Display label — defaults to the field's name at insert time. */
    label: zod_1.z.string().default("") }));
/** Faint full-page company watermark (uses the company's watermark logo). */
var watermarkBlock = zod_1.z.object(__assign(__assign({}, baseFields), { type: zod_1.z.literal("watermark"), opacity: zod_1.z.number().min(0).max(1).default(0.07), placement: zod_1.z.enum(["center", "top", "bottom"]).default("center"), size: zod_1.z.number().min(10).max(100).default(50) }));
exports.blockSchema = zod_1.z.discriminatedUnion("type", [
    headerBlock,
    watermarkBlock,
    partiesBlock,
    notesBlock,
    detailsBlock,
    lineItemsBlock,
    summaryBlock,
    termsBlock,
    jobDetailsBlock,
    operationsBlock,
    issueDetailsBlock,
    associationsBlock,
    actionTasksBlock,
    reviewersBlock,
    labelHeadingBlock,
    labelRevisionBlock,
    labelQuantityBlock,
    labelTrackingBlock,
    labelEntityIdBlock,
    labelBarcodeBlock,
    labelLogoBlock,
    richTextBlock,
    keyValueBlock,
    spacerBlock,
    sharedBlock,
    fieldBlock,
    customFieldBlock
]);
/** Shared, reusable rich-text section. `placement` scopes where it's used. */
exports.documentSectionPlacementSchema = zod_1.z.enum([
    "body",
    "header",
    "footer"
]);
/**
 * Layout config carried by a header section — logo + which company fields show.
 * Global: the header is one shared section reused across every document.
 */
exports.sectionConfigSchema = exports.headerOptionsSchema.partial();
exports.documentSectionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    placement: exports.documentSectionPlacementSchema.default("body"),
    content: jsonContentSchema,
    config: exports.sectionConfigSchema.optional()
});
var HEX_COLOR = /^#([0-9a-fA-F]{6})$/;
exports.DEFAULT_THEME = {
    /** Strong brand color — fills the line-items header bar. */
    accent: "#1f2937",
    /** Text/icons drawn on top of the accent color. */
    accentForeground: "#ffffff",
    /** Section headings (BILL TO, INVOICE DETAILS, NOTES…). Maps gray-600. */
    heading: "#4b5563",
    /** Body text: addresses, line-item values, the document title. Maps gray-800. */
    text: "#1f2937"
};
exports.themeSchema = zod_1.z.object({
    accent: zod_1.z.string().regex(HEX_COLOR).default(exports.DEFAULT_THEME.accent),
    accentForeground: zod_1.z
        .string()
        .regex(HEX_COLOR)
        .default(exports.DEFAULT_THEME.accentForeground),
    heading: zod_1.z.string().regex(HEX_COLOR).default(exports.DEFAULT_THEME.heading),
    text: zod_1.z.string().regex(HEX_COLOR).default(exports.DEFAULT_THEME.text)
});
/**
 * Document body fonts. "Inter" is registered in Template; the rest are the
 * react-pdf built-in PDF standard fonts (no registration needed).
 */
exports.DOCUMENT_FONTS = [
    // Inter is registered in Template; Helvetica/Times/Courier are PDF built-ins.
    { value: "Inter", label: "Inter", kind: "Sans" },
    { value: "Helvetica", label: "Helvetica", kind: "Sans" },
    { value: "Times-Roman", label: "Times", kind: "Serif" },
    { value: "Courier", label: "Courier", kind: "Mono" },
    // Google fonts — registered on demand at render (see pdf/fonts.ts).
    { value: "Roboto", label: "Roboto", kind: "Sans" },
    { value: "Open Sans", label: "Open Sans", kind: "Sans" },
    { value: "Lato", label: "Lato", kind: "Sans" },
    { value: "Montserrat", label: "Montserrat", kind: "Sans" },
    { value: "Merriweather", label: "Merriweather", kind: "Serif" },
    { value: "Playfair Display", label: "Playfair Display", kind: "Serif" },
    { value: "Lora", label: "Lora", kind: "Serif" }
];
/** Document-level settings (font + footer page numbers + registration line). */
exports.DEFAULT_DOCUMENT_SETTINGS = {
    fontFamily: "Inter",
    showPageNumbers: true,
    pageNumberFormat: "pageOfTotal",
    showRegistrationLine: true
};
exports.documentSettingsSchema = zod_1.z.object({
    fontFamily: zod_1.z
        .enum([
        "Inter",
        "Helvetica",
        "Times-Roman",
        "Courier",
        "Roboto",
        "Open Sans",
        "Lato",
        "Montserrat",
        "Merriweather",
        "Playfair Display",
        "Lora"
    ])
        .default("Inter"),
    showPageNumbers: zod_1.z.boolean().default(true),
    /** "pageOfTotal" → "Page 1 of 3"; "page" → "Page 1". */
    pageNumberFormat: zod_1.z.enum(["pageOfTotal", "page"]).default("pageOfTotal"),
    showRegistrationLine: zod_1.z.boolean().default(true)
});
/** Document types that support a customizable template. Widen as docs ship. */
exports.documentTemplateTypeSchema = zod_1.z.enum([
    "salesInvoice",
    "salesOrder",
    "purchaseOrder",
    "quote",
    "packingSlip",
    "stockTransfer",
    "jobTraveler",
    "issue",
    "trackingLabel"
]);
/**
 * Schema version of the stored template JSON. Bump when the block/theme shape
 * changes in a non-additive way; `resolveTemplate` migrates older versions
 * forward on read. (Idea borrowed from Bindery's `formatVersion`.)
 */
exports.CURRENT_TEMPLATE_FORMAT_VERSION = 1;
exports.documentTemplateSchema = zod_1.z.object({
    formatVersion: zod_1.z.number().int().default(exports.CURRENT_TEMPLATE_FORMAT_VERSION),
    documentType: exports.documentTemplateTypeSchema,
    blocks: zod_1.z.array(exports.blockSchema),
    theme: exports.themeSchema.default(exports.DEFAULT_THEME),
    settings: exports.documentSettingsSchema.default(exports.DEFAULT_DOCUMENT_SETTINGS),
    /** Shared sections used as the repeating page header/footer (or none). */
    headerSectionId: zod_1.z.string().nullable().default(null),
    footerSectionId: zod_1.z.string().nullable().default(null)
});
/**
 * Map a stored `documentTemplate` row to a `DocumentTemplate` (or null). The one
 * place the JSON columns are cast — callers (services + PDF/ZPL routes) use this
 * instead of re-deriving the shape. The result still passes through
 * `resolveTemplate` at render, which applies defaults/validation.
 */
function toDocumentTemplate(row, documentType) {
    var _a, _b, _c;
    if (!row)
        return null;
    var r = row;
    return {
        formatVersion: (_a = r.formatVersion) !== null && _a !== void 0 ? _a : exports.CURRENT_TEMPLATE_FORMAT_VERSION,
        documentType: documentType,
        blocks: r.blocks,
        theme: r.theme,
        settings: r.settings,
        headerSectionId: (_b = r.headerSectionId) !== null && _b !== void 0 ? _b : null,
        footerSectionId: (_c = r.footerSectionId) !== null && _c !== void 0 ? _c : null
    };
}
