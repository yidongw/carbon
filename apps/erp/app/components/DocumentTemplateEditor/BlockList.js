"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockList = BlockList;
exports.AddBlockMenu = AddBlockMenu;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var context_1 = require("./context");
var useHeaderConfig_1 = require("./useHeaderConfig");
var ADD_OPTIONS = [
    {
        type: "richText",
        icon: <lu_1.LuType className="size-4"/>,
        description: "Formatted text with merge fields"
    },
    {
        type: "keyValue",
        icon: <lu_1.LuTable className="size-4"/>,
        description: "Label / value rows"
    },
    {
        type: "spacer",
        icon: <lu_1.LuSeparatorHorizontal className="size-4"/>,
        description: "Space, divider, or page break"
    }
];
/** A consistent leading icon per block type, so every row reads the same. */
var BLOCK_ICON = {
    header: <lu_1.LuPanelTop className="size-4"/>,
    watermark: <lu_1.LuStamp className="size-4"/>,
    parties: <lu_1.LuUsers className="size-4"/>,
    details: <lu_1.LuInfo className="size-4"/>,
    lineItems: <lu_1.LuTable className="size-4"/>,
    summary: <lu_1.LuReceipt className="size-4"/>,
    terms: <lu_1.LuFileText className="size-4"/>,
    notes: <lu_1.LuStickyNote className="size-4"/>,
    richText: <lu_1.LuType className="size-4"/>,
    keyValue: <lu_1.LuTable className="size-4"/>,
    spacer: <lu_1.LuSeparatorHorizontal className="size-4"/>,
    shared: <lu_1.LuLibrary className="size-4"/>,
    field: <lu_1.LuType className="size-4"/>,
    customField: <lu_1.LuTag className="size-4"/>,
    labelLogo: <lu_1.LuImage className="size-4"/>,
    labelBarcode: <lu_1.LuQrCode className="size-4"/>,
    labelEntityId: <lu_1.LuHash className="size-4"/>
};
function blockIcon(type) {
    var _a;
    return (_a = BLOCK_ICON[type]) !== null && _a !== void 0 ? _a : <lu_1.LuType className="size-4"/>;
}
function BlockList() {
    var _a = (0, context_1.useDocumentTemplate)(), documentType = _a.documentType, blocks = _a.blocks, reorder = _a.reorder;
    // Labels have no page chrome — no footer row.
    var isLabel = documentType === "trackingLabel";
    // Header & footer are page chrome — pinned (not reorderable). Only the body
    // blocks between them are sortable.
    var headerBlock = blocks.find(function (b) { return b.type === "header"; });
    var bodyBlocks = blocks.filter(function (b) { return b.type !== "header"; });
    // The Summary (totals) belongs to the Line Items table, so it's shown nested
    // under it in the tree rather than as a separate sortable row. Only nest when
    // a Line Items block is actually present.
    var hasLineItems = bodyBlocks.some(function (b) { return b.type === "lineItems"; });
    var summaryBlock = hasLineItems
        ? bodyBlocks.find(function (b) { return b.type === "summary"; })
        : undefined;
    var sortableBlocks = summaryBlock
        ? bodyBlocks.filter(function (b) { return b.id !== summaryBlock.id; })
        : bodyBlocks;
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.PointerSensor, { activationConstraint: { distance: 8 } }), (0, core_1.useSensor)(core_1.KeyboardSensor));
    var handleDragEnd = function (event) {
        var active = event.active, over = event.over;
        if (over && active.id !== over.id) {
            reorder(String(active.id), String(over.id));
        }
    };
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {headerBlock && <HeaderRow id={headerBlock.id}/>}
        {headerBlock && <HeaderLogoRow />}
      </div>
      <core_1.DndContext sensors={sensors} collisionDetection={core_1.closestCenter} onDragEnd={handleDragEnd}>
        <sortable_1.SortableContext items={sortableBlocks.map(function (b) { return b.id; })} strategy={sortable_1.verticalListSortingStrategy}>
          <div className="flex flex-col gap-1">
            {sortableBlocks.map(function (block) { return (<react_2.Fragment key={block.id}>
                <BlockRow id={block.id}/>
                {block.type === "lineItems" && summaryBlock && (<NestedBlockRow id={summaryBlock.id}/>)}
              </react_2.Fragment>); })}
            {!isLabel && <FooterRow />}
          </div>
        </sortable_1.SortableContext>
      </core_1.DndContext>
    </div>);
}
/**
 * The "Add block" menu — extracted from the (scrollable) block list so the
 * editor can pin it below the list.
 */
function AddBlockMenu() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, context_1.useDocumentTemplate)(), documentType = _a.documentType, addBlock = _a.addBlock, addSharedBlock = _a.addSharedBlock, addCustomFieldBlock = _a.addCustomFieldBlock, addField = _a.addField, sections = _a.sections, customFields = _a.customFields;
    var isTextOnly = (0, template_1.extensionSupport)(documentType) === "text";
    var bodySections = sections.filter(function (s) { return s.placement === "body"; });
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Add block"], ["Add block"])))} variant="ghost" size="sm" icon={<lu_1.LuPlus />}/>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="start" className="w-[--radix-popper-anchor-width] min-w-64">
        {isTextOnly ? (<AddMenuItem icon={<lu_1.LuType className="size-4"/>} title="Text field" description="A label and a value" onClick={function () { return addField(true); }}/>) : (<>
            <AddMenuItem icon={<lu_1.LuType className="size-4"/>} title="Text field" description="A label and a value" onClick={function () { return addField(true); }}/>
            {ADD_OPTIONS.map(function (_a) {
                var type = _a.type, icon = _a.icon, description = _a.description;
                return (<AddMenuItem key={type} icon={icon} title={template_1.BLOCK_META[type].label} description={description} onClick={function () { return addBlock(type); }}/>);
            })}
          </>)}
        {!isTextOnly && (<>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuLabel>Shared sections</react_1.DropdownMenuLabel>
            {bodySections.map(function (section) { return (<react_1.DropdownMenuItem key={section.id} onClick={function () { return addSharedBlock(section.id); }} className="flex items-center gap-2.5">
                <lu_1.LuLibrary className="size-4 text-muted-foreground"/>
                <span className="text-sm">{section.name}</span>
              </react_1.DropdownMenuItem>); })}
            <react_1.DropdownMenuItem asChild className="flex items-center gap-2.5">
              <react_router_1.Link to={path_1.path.to.documentSections}>
                <lu_1.LuPlus className="size-4 text-muted-foreground"/>
                <span className="text-sm">
                  {bodySections.length > 0
                ? "New shared section"
                : "Create a shared section"}
                </span>
              </react_router_1.Link>
            </react_1.DropdownMenuItem>
          </>)}

        <react_1.DropdownMenuSeparator />
        <react_1.DropdownMenuLabel>Custom fields</react_1.DropdownMenuLabel>
        {customFields.map(function (field) { return (<react_1.DropdownMenuItem key={field.id} onClick={function () { return addCustomFieldBlock(field.id, field.name); }} className="flex items-center gap-2.5">
            <lu_1.LuTag className="size-4 text-muted-foreground"/>
            <span className="text-sm">{field.name}</span>
          </react_1.DropdownMenuItem>); })}
        <react_1.DropdownMenuItem asChild className="flex items-center gap-2.5">
          <react_router_1.Link to={path_1.path.to.customFields}>
            <lu_1.LuPlus className="size-4 text-muted-foreground"/>
            <span className="text-sm">
              {customFields.length > 0
            ? "Manage custom fields"
            : "Create a custom field"}
            </span>
          </react_router_1.Link>
        </react_1.DropdownMenuItem>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
}
function AddMenuItem(_a) {
    var icon = _a.icon, title = _a.title, description = _a.description, onClick = _a.onClick;
    return (<react_1.DropdownMenuItem onClick={onClick} className="flex items-start gap-2.5 py-2">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <span className="flex flex-col">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
    </react_1.DropdownMenuItem>);
}
function BlockRow(_a) {
    var _b, _c;
    var id = _a.id;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, context_1.useDocumentTemplate)(), blocks = _d.blocks, sections = _d.sections, selectedId = _d.selectedId, select = _d.select, toggleVisible = _d.toggleVisible, removeBlock = _d.removeBlock;
    var block = blocks.find(function (b) { return b.id === id; });
    var _e = (0, sortable_1.useSortable)({ id: id }), attributes = _e.attributes, listeners = _e.listeners, setNodeRef = _e.setNodeRef, transform = _e.transform, transition = _e.transition, isDragging = _e.isDragging;
    if (!block)
        return null;
    var meta = template_1.BLOCK_META[block.type];
    var isSelected = selectedId === id;
    var shown = block.visible;
    var onToggle = function () { return toggleVisible(id); };
    var label = block.type === "shared"
        ? ((_c = (_b = sections.find(function (s) { return s.id === block.sectionId; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Shared Section (deleted)")
        : block.type === "customField"
            ? block.label || meta.label
            : block.type === "field"
                ? block.label || block.value || meta.label
                : meta.label;
    return (<div ref={setNodeRef} style={{
            transform: utilities_1.CSS.Translate.toString(transform),
            transition: transition !== null && transition !== void 0 ? transition : undefined
        }} onClick={function () { return select(isSelected ? null : id); }} className={(0, react_1.cn)("group flex cursor-pointer items-center gap-1.5 rounded-md border px-1.5 py-2", "transition-colors duration-150", isSelected
            ? "border-primary bg-accent/50"
            : "border-transparent hover:border-border hover:bg-accent/30", isDragging && "opacity-50 shadow-sm", !shown && !isSelected && "opacity-60")}>
      <button type="button" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Drag to reorder"], ["Drag to reorder"])))} onClick={function (e) { return e.stopPropagation(); }} className="relative cursor-grab text-muted-foreground/60 active:cursor-grabbing" {...attributes} {...listeners}>
        {/* Type icon normally; grip on hover to signal draggability. */}
        <span className="group-hover:opacity-0">{blockIcon(block.type)}</span>
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100">
          <lu_1.LuGripVertical className="size-4"/>
        </span>
      </button>

      <span className="flex flex-1 items-center gap-2 truncate text-sm">
        <span className="truncate">{label}</span>
        {block.type === "shared" ? (<span className="rounded bg-muted px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Shared
          </span>) : (!meta.isBuiltIn && (<span className="rounded bg-muted px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Custom
            </span>))}
      </span>

      {meta.removable && (<button type="button" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Remove block"], ["Remove block"])))} onClick={function (e) {
                e.stopPropagation();
                removeBlock(id);
            }} className="rounded p-1 text-muted-foreground opacity-0 transition-[opacity,color] hover:text-destructive group-hover:opacity-100">
          <lu_1.LuTrash2 className="size-4"/>
        </button>)}

      {meta.hideable ? (<button type="button" aria-label={shown ? "Hide block" : "Show block"} aria-pressed={shown} onClick={function (e) {
                e.stopPropagation();
                onToggle();
            }} className={(0, react_1.cn)("rounded p-1 transition-colors", shown
                ? "text-foreground hover:bg-muted"
                : "text-muted-foreground hover:bg-muted")}>
          {shown ? (<lu_1.LuEye className="size-4"/>) : (<lu_1.LuEyeOff className="size-4"/>)}
        </button>) : (<span title="Required — always shown" className="p-1 text-muted-foreground/50">
          <lu_1.LuLock className="size-3.5"/>
        </span>)}
    </div>);
}
/**
 * A non-draggable, indented block row — used for blocks shown nested under a
 * parent (e.g. Summary under Line Items). Same selection / visibility / remove
 * behavior as `BlockRow`, just without the drag handle.
 */
function NestedBlockRow(_a) {
    var _b, _c;
    var id = _a.id;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, context_1.useDocumentTemplate)(), blocks = _d.blocks, sections = _d.sections, selectedId = _d.selectedId, select = _d.select, toggleVisible = _d.toggleVisible, removeBlock = _d.removeBlock;
    var block = blocks.find(function (b) { return b.id === id; });
    if (!block)
        return null;
    var meta = template_1.BLOCK_META[block.type];
    var isSelected = selectedId === id;
    var shown = block.visible;
    var label = block.type === "shared"
        ? ((_c = (_b = sections.find(function (s) { return s.id === block.sectionId; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "Shared Section (deleted)")
        : block.type === "customField"
            ? block.label || meta.label
            : block.type === "field"
                ? block.label || block.value || meta.label
                : meta.label;
    return (<div className="ml-3 border-l border-border/60 pl-2">
      <div onClick={function () { return select(isSelected ? null : id); }} className={(0, react_1.cn)("group flex cursor-pointer items-center gap-1.5 rounded-md border px-1.5 py-2", "transition-colors duration-150", isSelected
            ? "border-primary bg-accent/50"
            : "border-transparent hover:border-border hover:bg-accent/30", !shown && !isSelected && "opacity-60")}>
        <span className="p-1 text-muted-foreground/60">
          {blockIcon(block.type)}
        </span>
        <span className="flex-1 truncate text-sm">{label}</span>
        {meta.removable && (<button type="button" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Remove block"], ["Remove block"])))} onClick={function (e) {
                e.stopPropagation();
                removeBlock(id);
            }} className="rounded p-1 text-muted-foreground opacity-0 transition-[opacity,color] hover:text-destructive group-hover:opacity-100">
            <lu_1.LuTrash2 className="size-4"/>
          </button>)}
        {meta.hideable ? (<button type="button" aria-label={shown ? "Hide block" : "Show block"} aria-pressed={shown} onClick={function (e) {
                e.stopPropagation();
                toggleVisible(id);
            }} className={(0, react_1.cn)("rounded p-1 transition-colors", shown
                ? "text-foreground hover:bg-muted"
                : "text-muted-foreground hover:bg-muted")}>
            {shown ? (<lu_1.LuEye className="size-4"/>) : (<lu_1.LuEyeOff className="size-4"/>)}
          </button>) : (<span title="Required — always shown" className="p-1 text-muted-foreground/50">
            <lu_1.LuLock className="size-3.5"/>
          </span>)}
      </div>
    </div>);
}
/**
 * The page Header — pinned (not reorderable). Eye toggles it on/off; selecting
 * it opens the header config (a link to its global shared section).
 */
function HeaderRow(_a) {
    var id = _a.id;
    var _b = (0, context_1.useDocumentTemplate)(), selectedId = _b.selectedId, select = _b.select, headerSectionId = _b.headerSectionId, setHeaderSection = _b.setHeaderSection;
    var isSelected = selectedId === id;
    var shown = headerSectionId !== null;
    return (<ChromeRow icon={<lu_1.LuPanelTop className="size-4"/>} label="Header" isSelected={isSelected} shown={shown} onSelect={function () { return select(isSelected ? null : id); }} onToggle={function () {
            return setHeaderSection(shown ? null : template_1.BUILT_IN_SECTION_IDS.header);
        }}/>);
}
/**
 * The Logo — a child of the Header, shown indented in the tree so it can be
 * configured inline (variant, crop, height) instead of via the header dialog.
 * Only rendered while the header is shown. Eye toggles `showLogo`.
 */
function HeaderLogoRow() {
    var _a = (0, context_1.useDocumentTemplate)(), selectedId = _a.selectedId, select = _a.select, headerSectionId = _a.headerSectionId;
    var _b = (0, useHeaderConfig_1.useHeaderConfig)(), section = _b.section, config = _b.config, patch = _b.patch;
    // Hide the node when the header is off or its section isn't available.
    if (!section || headerSectionId === null)
        return null;
    var isSelected = selectedId === useHeaderConfig_1.HEADER_LOGO_ID;
    var shown = config.showLogo;
    return (<div className="ml-3 border-l border-border/60 pl-2">
      <div onClick={function () { return select(isSelected ? null : useHeaderConfig_1.HEADER_LOGO_ID); }} className={(0, react_1.cn)("group flex cursor-pointer items-center gap-1.5 rounded-md border px-1.5 py-2", "transition-colors duration-150", isSelected
            ? "border-primary bg-accent/50"
            : "border-transparent hover:border-border hover:bg-accent/30", !shown && !isSelected && "opacity-60")}>
        <span className="p-1 text-muted-foreground/40">
          <lu_1.LuImage className="size-4"/>
        </span>
        <span className="flex-1 truncate text-sm">Logo</span>
        <button type="button" aria-label={shown ? "Hide logo" : "Show logo"} aria-pressed={shown} onClick={function (e) {
            e.stopPropagation();
            patch({ showLogo: !shown });
        }} className={(0, react_1.cn)("rounded p-1 transition-colors", shown
            ? "text-foreground hover:bg-muted"
            : "text-muted-foreground hover:bg-muted")}>
          {shown ? (<lu_1.LuEye className="size-4"/>) : (<lu_1.LuEyeOff className="size-4"/>)}
        </button>
      </div>
    </div>);
}
/**
 * The page Footer — chrome, not a flow block, so it's a static row pinned below
 * the sortable blocks. Eye toggles the footer on/off; selecting it opens the
 * footer config (page numbers, registration line).
 */
function FooterRow() {
    var _a = (0, context_1.useDocumentTemplate)(), footerSectionId = _a.footerSectionId, setFooterSection = _a.setFooterSection, selectedId = _a.selectedId, select = _a.select;
    var isSelected = selectedId === context_1.FOOTER_BLOCK_ID;
    var shown = footerSectionId !== null;
    return (<ChromeRow icon={<lu_1.LuPanelBottom className="size-4"/>} label="Footer" isSelected={isSelected} shown={shown} onSelect={function () { return select(isSelected ? null : context_1.FOOTER_BLOCK_ID); }} onToggle={function () {
            return setFooterSection(shown ? null : template_1.BUILT_IN_SECTION_IDS.footer);
        }}/>);
}
/** Shared presentation for the pinned, non-draggable Header & Footer rows. */
function ChromeRow(_a) {
    var icon = _a.icon, label = _a.label, isSelected = _a.isSelected, shown = _a.shown, onSelect = _a.onSelect, onToggle = _a.onToggle;
    return (<div onClick={onSelect} className={(0, react_1.cn)("group flex cursor-pointer items-center gap-1.5 rounded-md border px-1.5 py-2", "transition-colors duration-150", isSelected
            ? "border-primary bg-accent/50"
            : "border-transparent hover:border-border hover:bg-accent/30", !shown && !isSelected && "opacity-60")}>
      <span className="p-1 text-muted-foreground/40">{icon}</span>
      <span className="flex flex-1 items-center gap-2 truncate text-sm">
        <span className="truncate">{label}</span>
        <span className="rounded bg-muted px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Page
        </span>
      </span>
      <button type="button" aria-label={shown ? "Hide ".concat(label) : "Show ".concat(label)} aria-pressed={shown} onClick={function (e) {
            e.stopPropagation();
            onToggle();
        }} className={(0, react_1.cn)("rounded p-1 transition-colors", shown
            ? "text-foreground hover:bg-muted"
            : "text-muted-foreground hover:bg-muted")}>
        {shown ? <lu_1.LuEye className="size-4"/> : <lu_1.LuEyeOff className="size-4"/>}
      </button>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
