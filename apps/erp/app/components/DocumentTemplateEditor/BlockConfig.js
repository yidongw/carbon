"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.BlockConfig = BlockConfig;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var configHelpers_1 = require("./configHelpers");
var context_1 = require("./context");
var labelConfigs_1 = require("./labelConfigs");
var MergeFieldMenu_1 = require("./MergeFieldMenu");
var NumberRow_1 = require("./NumberRow");
var SectionFormModal_1 = require("./SectionFormModal");
var useHeaderConfig_1 = require("./useHeaderConfig");
/** Append a `{{token}}` snippet to the end of a tiptap doc (inline if possible). */
function appendText(content, text) {
    var doc = content && content.type === "doc"
        ? content
        : { type: "doc", content: [] };
    var nodes = Array.isArray(doc.content) ? __spreadArray([], doc.content, true) : [];
    var last = nodes[nodes.length - 1];
    if (last && last.type === "paragraph") {
        var inline = Array.isArray(last.content) ? __spreadArray([], last.content, true) : [];
        inline.push({ type: "text", text: inline.length ? " ".concat(text) : text });
        nodes[nodes.length - 1] = __assign(__assign({}, last), { content: inline });
    }
    else {
        nodes.push({ type: "paragraph", content: [{ type: "text", text: text }] });
    }
    return __assign(__assign({}, doc), { type: "doc", content: nodes });
}
function BlockConfig() {
    var _a, _b;
    var _c = (0, context_1.useDocumentTemplate)(), blocks = _c.blocks, sections = _c.sections, selectedId = _c.selectedId;
    if (selectedId === useHeaderConfig_1.HEADER_LOGO_ID) {
        return (<div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Logo</h3>
            <TypeBadge category="page"/>
          </div>
          <p className="text-xs text-muted-foreground">
            Shown in the header of every document.
          </p>
        </div>
        <labelConfigs_1.HeaderLogoConfig />
      </div>);
    }
    if (selectedId === context_1.FOOTER_BLOCK_ID) {
        return (<div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Footer</h3>
            <TypeBadge category="page"/>
          </div>
          <p className="text-xs text-muted-foreground">
            Shown at the bottom of every page.
          </p>
        </div>
        <ChromeConfig kind="footer"/>
      </div>);
    }
    var block = blocks.find(function (b) { return b.id === selectedId; });
    if (!block) {
        return (<div className="flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-8 text-center">
        <lu_1.LuSlidersHorizontal className="size-5 text-muted-foreground/60"/>
        <p className="text-sm text-muted-foreground">
          Select a block to configure it
        </p>
      </div>);
    }
    var meta = template_1.BLOCK_META[block.type];
    var sharedName = block.type === "shared"
        ? ((_b = (_a = sections.find(function (s) { return s.id === block.sectionId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null)
        : null;
    // Built-in blocks that now expose real options shouldn't show the generic
    // "reorder / toggle" placeholder.
    var hasOwnConfig = block.type === "watermark" ||
        block.type === "header" ||
        block.type === "lineItems" ||
        block.type === "summary" ||
        block.type === "terms" ||
        block.type === "labelRevision" ||
        block.type === "labelQuantity" ||
        block.type === "labelTracking" ||
        block.type === "labelBarcode" ||
        block.type === "labelLogo" ||
        block.type === "labelEntityId" ||
        block.type === "operations";
    return (<div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium">
            {block.type === "shared"
            ? (sharedName !== null && sharedName !== void 0 ? sharedName : "Shared Section")
            : meta.label}
          </h3>
          <TypeBadge category={categoryOf(block.type)}/>
        </div>
        {meta.isBuiltIn && !hasOwnConfig && (<p className="text-xs text-muted-foreground">
            Reorder or show/hide it from the list.
          </p>)}
      </div>

      {block.type === "header" && <ChromeConfig kind="header"/>}
      {block.type === "watermark" && <WatermarkConfig block={block}/>}
      {block.type === "lineItems" && <LineItemsConfig block={block}/>}
      {block.type === "operations" && <OperationsConfig block={block}/>}
      {block.type === "summary" && <SummaryConfig block={block}/>}
      {block.type === "terms" && <TermsConfig block={block}/>}
      {(block.type === "labelRevision" ||
            block.type === "labelQuantity" ||
            block.type === "labelTracking") && (<labelConfigs_1.LabelFieldNameConfig block={block}/>)}
      {block.type === "richText" && <RichTextConfig block={block}/>}
      {block.type === "keyValue" && <KeyValueConfig block={block}/>}
      {block.type === "spacer" && <SpacerConfig block={block}/>}
      {block.type === "field" && <labelConfigs_1.FieldConfig block={block}/>}
      {block.type === "labelBarcode" && <labelConfigs_1.LabelBarcodeConfig block={block}/>}
      {block.type === "labelLogo" && <labelConfigs_1.LabelLogoConfig block={block}/>}
      {block.type === "labelEntityId" && <labelConfigs_1.LabelEntityIdConfig block={block}/>}
      {block.type === "customField" && <CustomFieldConfig block={block}/>}
      {block.type === "shared" && (<div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            {sharedName
                ? "Linked to a shared section. Edit it in the library to update it everywhere."
                : "This shared section no longer exists. Remove the block or recreate the section."}
          </p>
          <react_router_1.Link to={path_1.path.to.documentSections} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <lu_1.LuExternalLink className="size-3"/>
            Manage shared sections
          </react_router_1.Link>
        </div>)}
    </div>);
}
var CATEGORY_LABEL = {
    page: "Page",
    "built-in": "Built-in",
    custom: "Custom",
    shared: "Shared"
};
function categoryOf(type) {
    if (type === "header")
        return "page";
    if (type === "shared")
        return "shared";
    if (type === "richText" ||
        type === "keyValue" ||
        type === "spacer" ||
        type === "field" ||
        type === "customField") {
        return "custom";
    }
    return "built-in";
}
function TypeBadge(_a) {
    var category = _a.category;
    return <react_1.Badge variant="secondary">{CATEGORY_LABEL[category]}</react_1.Badge>;
}
/**
 * Header & footer are global shared sections — their fields (logo, which
 * company details show) and banner content are edited in a dialog opened right
 * here. The footer also owns its page-number + registration-line settings.
 */
function ChromeConfig(_a) {
    var _b;
    var kind = _a.kind;
    var sections = (0, context_1.useDocumentTemplate)().sections;
    var _c = (0, react_2.useState)(false), open = _c[0], setOpen = _c[1];
    var targetId = kind === "header"
        ? template_1.BUILT_IN_SECTION_IDS.header
        : template_1.BUILT_IN_SECTION_IDS.footer;
    var section = sections.find(function (s) { return s.id === targetId; });
    return (<div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        {kind === "header"
            ? "The header is shared by every document — same logo, fields, and banner everywhere."
            : "The footer is shared by every document."}
      </p>
      <react_1.Button variant="secondary" leftIcon={<lu_1.LuPencil />} onClick={function () { return setOpen(true); }} isDisabled={!section}>
        Edit {kind} section
      </react_1.Button>

      {kind === "footer" && <FooterSettings />}

      <react_router_1.Link to={path_1.path.to.documentSections} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <lu_1.LuExternalLink className="size-3"/>
        Open section library
      </react_router_1.Link>

      {open && section && (<SectionFormModal_1.SectionFormModal action={path_1.path.to.documentSections} onClose={function () { return setOpen(false); }} section={{
                id: section.id,
                name: section.name,
                placement: section.placement,
                content: (_b = section.content) !== null && _b !== void 0 ? _b : { type: "doc", content: [] },
                config: section.config
            }}/>)}
    </div>);
}
/** Footer page-number + registration-line settings. */
function FooterSettings() {
    var _a = (0, context_1.useDocumentTemplate)(), footerSectionId = _a.footerSectionId, settings = _a.settings, setSetting = _a.setSetting;
    var hidden = footerSectionId === null;
    var pageNumbersValue = settings.showPageNumbers
        ? settings.pageNumberFormat
        : "none";
    return (<div className="flex flex-col gap-3 border-t pt-3">
      {hidden && (<p className="text-xs text-muted-foreground">
          Footer is hidden — turn it on with the eye toggle to apply these.
        </p>)}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm">Page numbers</span>
        <react_1.Select disabled={hidden} value={pageNumbersValue} onValueChange={function (v) {
            if (v === "none") {
                setSetting("showPageNumbers", false);
            }
            else {
                setSetting("showPageNumbers", true);
                setSetting("pageNumberFormat", v);
            }
        }}>
          <react_1.SelectTrigger className="h-7 w-32">
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="none">None</react_1.SelectItem>
            <react_1.SelectItem value="pageOfTotal">Page 1 of 3</react_1.SelectItem>
            <react_1.SelectItem value="page">Page 1</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>
      <div className={hidden ? "pointer-events-none opacity-60" : undefined}>
        <configHelpers_1.ToggleRow label="Registration line" checked={settings.showRegistrationLine} onChange={function (v) { return setSetting("showRegistrationLine", v); }}/>
      </div>
    </div>);
}
function CustomFieldConfig(_a) {
    var _b;
    var block = _a.block;
    var _c = (0, context_1.useDocumentTemplate)(), updateBlock = _c.updateBlock, customFields = _c.customFields;
    var field = customFields.find(function (f) { return f.id === block.fieldId; });
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label htmlFor="cf-label">Label</react_1.Label>
        <react_1.Input id="cf-label" value={block.label} placeholder={(_b = field === null || field === void 0 ? void 0 : field.name) !== null && _b !== void 0 ? _b : ""} onChange={function (e) { return updateBlock(block.id, { label: e.target.value }); }}/>
      </div>
      <p className="text-xs text-muted-foreground">
        {field
            ? "Value comes from the \u201C".concat(field.name, "\u201D custom field.")
            : "This custom field no longer exists. Remove the block."}
      </p>
    </div>);
}
function SummaryConfig(_a) {
    var block = _a.block;
    var t = (0, macro_1.useLingui)().t;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var opts = __assign(__assign({}, template_1.DEFAULT_SUMMARY_OPTIONS), block.options);
    return (<div className="flex flex-col gap-1.5">
      <react_1.Label htmlFor="tax-label">Tax label</react_1.Label>
      <react_1.Input id="tax-label" value={opts.taxLabel} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Taxes"], ["Taxes"])))} onChange={function (e) {
            return updateBlock(block.id, {
                options: __assign(__assign({}, opts), { taxLabel: e.target.value })
            });
        }}/>
      <p className="text-xs text-muted-foreground">
        Shown on the tax row, e.g. "VAT 15%".
      </p>
    </div>);
}
function WatermarkConfig(_a) {
    var _b, _c, _d;
    var block = _a.block;
    var _e = (0, context_1.useDocumentTemplate)(), updateBlock = _e.updateBlock, hasWatermark = _e.hasWatermark;
    return (<div className="flex flex-col gap-3">
      <NumberRow_1.NumberRow label="Opacity (%)" minValue={1} maxValue={100} value={Math.round(((_b = block.opacity) !== null && _b !== void 0 ? _b : 0.07) * 100)} onChange={function (v) { return updateBlock(block.id, { opacity: v / 100 }); }}/>
      <NumberRow_1.NumberRow label="Size (% of width)" minValue={10} maxValue={100} value={(_c = block.size) !== null && _c !== void 0 ? _c : 50} onChange={function (v) { return updateBlock(block.id, { size: v }); }}/>
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Placement</react_1.Label>
        <react_1.Select value={(_d = block.placement) !== null && _d !== void 0 ? _d : "center"} onValueChange={function (v) {
            return updateBlock(block.id, {
                placement: v
            });
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="top">Top</react_1.SelectItem>
            <react_1.SelectItem value="center">Center</react_1.SelectItem>
            <react_1.SelectItem value="bottom">Bottom</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>
      <p className="text-xs text-muted-foreground">
        {hasWatermark
            ? "Your watermark logo (set in Logos), faint behind the document."
            : "Upload a watermark logo in Logos to see it."}
      </p>
    </div>);
}
function OperationsConfig(_a) {
    var _b;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    return (<configHelpers_1.ToggleRow label="Show work instructions" checked={(_b = block.showWorkInstructions) !== null && _b !== void 0 ? _b : false} onChange={function (v) { return updateBlock(block.id, { showWorkInstructions: v }); }}/>);
}
function LineItemsConfig(_a) {
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var opts = __assign(__assign({}, template_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options);
    var set = function (key, value) {
        var _a;
        return updateBlock(block.id, { options: __assign(__assign({}, opts), (_a = {}, _a[key] = value, _a)) });
    };
    return (<div className="flex flex-col gap-3">
      <configHelpers_1.ToggleRow label="Show thumbnails" checked={opts.showThumbnails} onChange={function (v) { return set("showThumbnails", v); }}/>
      <configHelpers_1.ToggleRow label="Striped rows" checked={opts.zebra} onChange={function (v) { return set("zebra", v); }}/>
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Item text</react_1.Label>
        <react_1.Select value={opts.textOverflow} onValueChange={function (v) {
            return set("textOverflow", v);
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="wrap">Wrap to new lines</react_1.SelectItem>
            <react_1.SelectItem value="truncate">Truncate to one line</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>
    </div>);
}
function RichTextConfig(_a) {
    var _b;
    var block = _a.block;
    var _c = (0, context_1.useDocumentTemplate)(), updateBlock = _c.updateBlock, documentType = _c.documentType;
    // Bumped on insert to remount the Editor so the appended token shows (Tiptap
    // only reads `initialValue` on mount).
    var _d = (0, react_2.useState)(0), nonce = _d[0], setNonce = _d[1];
    var knownTokens = (0, template_1.getMergeFields)(documentType).map(function (f) { return f.token; });
    var insertField = function (snippet) {
        updateBlock(block.id, { content: appendText(block.content, snippet) });
        setNonce(function (n) { return n + 1; });
    };
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label htmlFor="rt-title">Heading (optional)</react_1.Label>
        <react_1.Input id="rt-title" value={(_b = block.title) !== null && _b !== void 0 ? _b : ""} onChange={function (e) { return updateBlock(block.id, { title: e.target.value }); }}/>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <react_1.Label>Content</react_1.Label>
          <MergeFieldMenu_1.MergeFieldMenu onInsert={insertField} label="Insert field"/>
        </div>
        <Editor_1.Editor key={"".concat(block.id, "-").concat(nonce)} className="min-h-[140px] w-full rounded-md border bg-background p-3" initialValue={block.content} onChange={function (content) { return updateBlock(block.id, { content: content }); }} highlightTokens={knownTokens} disableFileUpload/>
      </div>
    </div>);
}
function hasDocContent(content) {
    return Boolean(content && Array.isArray(content.content) && content.content.length > 0);
}
/**
 * Per-document Terms & Conditions. The block stores its own content; when left
 * empty it falls back to the company terms setting at render. The editor seeds
 * the field with that setting (`termsSeed`) so the current value is the starting
 * point.
 */
function TermsConfig(_a) {
    var _b;
    var block = _a.block;
    var _c = (0, context_1.useDocumentTemplate)(), updateBlock = _c.updateBlock, termsSeed = _c.termsSeed, documentType = _c.documentType;
    var _d = (0, react_2.useState)(0), nonce = _d[0], setNonce = _d[1];
    var knownTokens = (0, template_1.getMergeFields)(documentType).map(function (f) { return f.token; });
    var initialValue = (_b = (hasDocContent(block.content)
        ? block.content
        : termsSeed)) !== null && _b !== void 0 ? _b : {
        type: "doc",
        content: []
    };
    var insertField = function (snippet) {
        updateBlock(block.id, { content: appendText(initialValue, snippet) });
        setNonce(function (n) { return n + 1; });
    };
    return (<div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        The terms &amp; conditions printed on this document.
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <react_1.Label>Content</react_1.Label>
          <MergeFieldMenu_1.MergeFieldMenu onInsert={insertField} label="Insert field"/>
        </div>
        <Editor_1.Editor key={"".concat(block.id, "-").concat(nonce)} className="min-h-[160px] w-full rounded-md border bg-background p-3" initialValue={initialValue} onChange={function (content) { return updateBlock(block.id, { content: content }); }} highlightTokens={knownTokens} disableFileUpload/>
      </div>
    </div>);
}
function KeyValueConfig(_a) {
    var _b, _c;
    var block = _a.block;
    var t = (0, macro_1.useLingui)().t;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var rows = (_b = block.rows) !== null && _b !== void 0 ? _b : [];
    var setRows = function (next) {
        return updateBlock(block.id, { rows: next });
    };
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label htmlFor="kv-title">Heading (optional)</react_1.Label>
        <react_1.Input id="kv-title" value={(_c = block.title) !== null && _c !== void 0 ? _c : ""} onChange={function (e) { return updateBlock(block.id, { title: e.target.value }); }}/>
      </div>

      <div className="flex flex-col gap-2">
        {rows.map(function (row, index) { return (<div key={index} className="flex items-center gap-2">
            <react_1.Input placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Label"], ["Label"])))} value={row.label} onChange={function (e) {
                return setRows(rows.map(function (r, i) {
                    return i === index ? __assign(__assign({}, r), { label: e.target.value }) : r;
                }));
            }}/>
            <react_1.Input placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Value"], ["Value"])))} value={row.value} onChange={function (e) {
                return setRows(rows.map(function (r, i) {
                    return i === index ? __assign(__assign({}, r), { value: e.target.value }) : r;
                }));
            }}/>
            <MergeFieldMenu_1.MergeFieldMenu label="" onInsert={function (snippet) {
                return setRows(rows.map(function (r, i) {
                    return i === index ? __assign(__assign({}, r), { value: r.value + snippet }) : r;
                }));
            }}/>
            <react_1.IconButton size="sm" variant="ghost" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Remove row"], ["Remove row"])))} icon={<lu_1.LuTrash2 />} onClick={function () { return setRows(rows.filter(function (_, i) { return i !== index; })); }}/>
          </div>); })}
        <react_1.Button variant="secondary" leftIcon={<lu_1.LuPlus />} onClick={function () { return setRows(__spreadArray(__spreadArray([], rows, true), [{ label: "", value: "" }], false)); }}>
          Add row
        </react_1.Button>
      </div>
    </div>);
}
function SpacerConfig(_a) {
    var _b;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Style</react_1.Label>
        <react_1.Select value={block.variant} onValueChange={function (variant) {
            return updateBlock(block.id, {
                variant: variant
            });
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="space">Empty space</react_1.SelectItem>
            <react_1.SelectItem value="divider">Divider line</react_1.SelectItem>
            <react_1.SelectItem value="pageBreak">Page break</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>

      {block.variant === "space" && (<NumberRow_1.NumberRow label="Height (pt)" minValue={0} maxValue={200} value={(_b = block.size) !== null && _b !== void 0 ? _b : 16} onChange={function (v) { return updateBlock(block.id, { size: v }); }}/>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
