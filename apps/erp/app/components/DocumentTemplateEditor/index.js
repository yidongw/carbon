"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTemplateEditor = DocumentTemplateEditor;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var BlockConfig_1 = require("./BlockConfig");
var BlockList_1 = require("./BlockList");
var context_1 = require("./context");
var FontConfig_1 = require("./FontConfig");
var TemplatePreview_1 = require("./TemplatePreview");
var ThemeConfig_1 = require("./ThemeConfig");
var useTemplateConflict_1 = require("./useTemplateConflict");
function DocumentTemplateEditor(_a) {
    var documentType = _a.documentType, actionPath = _a.actionPath, initialBlocks = _a.initialBlocks, initialTheme = _a.initialTheme, initialSettings = _a.initialSettings, initialHeaderSectionId = _a.initialHeaderSectionId, initialFooterSectionId = _a.initialFooterSectionId, sections = _a.sections, customFields = _a.customFields, previewEntities = _a.previewEntities, termsSeed = _a.termsSeed, hasWatermark = _a.hasWatermark, initialLabelSizeId = _a.initialLabelSizeId, canEdit = _a.canEdit;
    return (<context_1.DocumentTemplateProvider documentType={documentType} actionPath={actionPath} initialBlocks={initialBlocks} initialTheme={initialTheme} initialSettings={initialSettings} initialHeaderSectionId={initialHeaderSectionId} initialFooterSectionId={initialFooterSectionId} sections={sections} customFields={customFields} previewEntities={previewEntities} termsSeed={termsSeed} hasWatermark={hasWatermark} initialLabelSizeId={initialLabelSizeId}>
      <div className="flex h-full w-full min-w-0 flex-col bg-background">
        <EditorToolbar title={(0, template_1.getDocumentLabel)(documentType)} canEdit={canEdit}/>
        <ConflictBanner documentType={documentType}/>
        <react_1.ResizablePanelGroup direction="horizontal" autoSaveId="document-template-editor" className="flex-1 overflow-hidden">
          {/* LEFT — blocks + theme */}
          <react_1.ResizablePanel id="rail" order={1} defaultSize={22} minSize={16} maxSize={34}>
            <ControlRail />
          </react_1.ResizablePanel>

          <react_1.ResizableHandle withHandle/>

          {/* CENTER — canvas */}
          <react_1.ResizablePanel id="canvas" order={2} defaultSize={56} minSize={30}>
            <div className="flex h-full min-w-0 flex-col bg-muted/40 p-6">
              <TemplatePreview_1.TemplatePreview previewPath={"".concat(actionPath, "/preview")}/>
            </div>
          </react_1.ResizablePanel>

          <react_1.ResizableHandle withHandle/>

          {/* RIGHT — contextual config, always present */}
          <react_1.ResizablePanel id="config" order={3} defaultSize={22} minSize={16} maxSize={34}>
            <react_1.ScrollArea className="h-full bg-card">
              <div className="flex flex-col gap-1.5 p-3">
                <h2 className={RAIL_HEADING}>Configure</h2>
                <BlockConfig_1.BlockConfig />
              </div>
            </react_1.ScrollArea>
          </react_1.ResizablePanel>
        </react_1.ResizablePanelGroup>
      </div>
    </context_1.DocumentTemplateProvider>);
}
var RAIL_HEADING = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground";
/** Sentinel option for the preview picker — falls back to sample data. */
var SAMPLE_DATA_VALUE = "__sample__";
/** Tiny caption above a toolbar picker. */
var PICKER_LABEL = "text-[10px] font-medium uppercase tracking-wide text-muted-foreground";
/**
 * Left rail: block layers (incl. the Header block + Footer row) and a tab group
 * for document-wide Style (typography) and Colors. The contextual Configure
 * panel lives in its own right rail.
 */
function ControlRail() {
    var _a = (0, react_2.useState)("style"), tab = _a[0], setTab = _a[1];
    var documentType = (0, context_1.useEditorStore)(function (s) { return s.documentType; });
    // Labels render on thermal stock with fixed printer fonts — no style tab.
    var isLabel = documentType === "trackingLabel";
    // Only show Colors when the document actually uses theme colors.
    var showColors = (0, ThemeConfig_1.hasThemeColors)(documentType);
    return (<div className="flex h-full flex-col bg-card">
      {/* Fixed Blocks header with the inline add-block button. */}
      <div className="flex shrink-0 items-center justify-between px-3 pt-3 pb-1">
        <h2 className={RAIL_HEADING}>Blocks</h2>
        <BlockList_1.AddBlockMenu />
      </div>

      {/* Block rows — capped at half the panel, scrolling past that. */}
      <div className="min-h-0 max-h-[50%]">
        <react_1.ScrollArea className="h-full">
          <div className="px-3 pb-1">
            <BlockList_1.BlockList />
          </div>
        </react_1.ScrollArea>
      </div>

      {!isLabel && (<react_1.Tabs value={tab} onValueChange={function (v) { return setTab(v); }} className="flex shrink-0 flex-col border-t">
          <react_1.TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b bg-transparent p-0 px-3 shadow-none">
            <UnderlineTab value="style" icon={<lu_1.LuType />} label="Style"/>
            {showColors && (<UnderlineTab value="colors" icon={<lu_1.LuPalette />} label="Colors"/>)}
          </react_1.TabsList>
          {/* Tab body scrolls within a bounded height so it never starves the
                blocks list above. */}
          <react_1.ScrollArea className="max-h-[45vh]">
            <react_1.TabsContent value="style" className="flex flex-col gap-5 p-3 pt-4">
              <section className="flex flex-col gap-3">
                <h3 className={RAIL_HEADING}>Typography</h3>
                <FontConfig_1.FontConfig />
              </section>
            </react_1.TabsContent>
            {showColors && (<react_1.TabsContent value="colors" className="flex flex-col gap-5 p-3 pt-4">
                <section className="flex flex-col gap-2">
                  <h3 className={RAIL_HEADING}>Theme colors</h3>
                  <ThemeConfig_1.ThemeConfig />
                </section>
              </react_1.TabsContent>)}
          </react_1.ScrollArea>
        </react_1.Tabs>)}
    </div>);
}
/** Clean underline-style tab trigger with a generous hit area. */
function UnderlineTab(_a) {
    var value = _a.value, icon = _a.icon, label = _a.label;
    return (<react_1.TabsTrigger value={value} className="-mb-px gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-2 text-xs text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none">
      <span className="[&>svg]:size-3.5">{icon}</span>
      {label}
    </react_1.TabsTrigger>);
}
/**
 * Realtime warning shown when another user saves this template while it's open.
 * The editor never auto-reloads (that would discard in-progress edits) — the
 * user chooses to refresh to their version or keep editing (overwrite on save).
 */
function ConflictBanner(_a) {
    var documentType = _a.documentType;
    var _b = (0, useTemplateConflict_1.useTemplateConflict)(documentType), conflict = _b.conflict, dismiss = _b.dismiss;
    if (!conflict)
        return null;
    return (<div className="flex items-center justify-between gap-3 border-b border-amber-500/40 bg-amber-500/10 px-4 py-2">
      <p className="text-sm text-amber-700 dark:text-amber-400">
        Someone else just saved this template. Refresh to load their version, or
        keep editing to overwrite it when you save.
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <react_1.Button variant="secondary" size="sm" onClick={dismiss}>
          Keep mine
        </react_1.Button>
        <react_1.Button size="sm" onClick={function () { return window.location.reload(); }}>
          Refresh
        </react_1.Button>
      </div>
    </div>);
}
function EditorToolbar(_a) {
    var title = _a.title, canEdit = _a.canEdit;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, context_1.useDocumentTemplate)(), isDirty = _b.isDirty, isSaving = _b.isSaving, reset = _b.reset, save = _b.save, previewEntities = _b.previewEntities, previewId = _b.previewId, setPreviewId = _b.setPreviewId;
    var refreshPreview = (0, context_1.useEditorStore)(function (s) { return s.refreshPreview; });
    return (<div className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <react_router_1.Link to={path_1.path.to.documentTemplates} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Back to documents"], ["Back to documents"])))} className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <lu_1.LuArrowLeft className="size-4"/>
        </react_router_1.Link>
        <div className="flex flex-col">
          <react_1.Heading size="h4">Document Layout</react_1.Heading>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </div>
      {previewEntities.length > 0 && (<div className="flex min-w-0 max-w-[280px] flex-1 flex-col items-center gap-0.5 self-end">
          <span className={PICKER_LABEL}>Preview data</span>
          <react_1.Select value={previewId !== null && previewId !== void 0 ? previewId : SAMPLE_DATA_VALUE} onValueChange={function (value) {
                return setPreviewId(value === SAMPLE_DATA_VALUE ? null : value);
            }}>
            <react_1.SelectTrigger size="sm" className="w-full">
              <react_1.SelectValue placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Sample data"], ["Sample data"])))}/>
            </react_1.SelectTrigger>
            <react_1.SelectContent>
              <react_1.SelectItem value={SAMPLE_DATA_VALUE}>Sample data</react_1.SelectItem>
              {previewEntities.map(function (e) { return (<react_1.SelectItem key={e.id} value={e.id}>
                  {e.label}
                </react_1.SelectItem>); })}
            </react_1.SelectContent>
          </react_1.Select>
        </div>)}
      <div className="flex items-end gap-2">
        <LabelSizePicker />
        {canEdit && (<>
            <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Refresh preview"], ["Refresh preview"])))} variant="secondary" icon={<lu_1.LuRefreshCw />} onClick={refreshPreview}/>
            <react_1.Button variant="secondary" onClick={reset} isDisabled={!isDirty || isSaving}>
              Discard
            </react_1.Button>
            <react_1.Button onClick={save} isLoading={isSaving} isDisabled={!isDirty}>
              Save layout
            </react_1.Button>
          </>)}
      </div>
    </div>);
}
/**
 * Label stock picker (tracking-label only). Preview-only — the layout scales to
 * any size, so this just drives which stock the preview renders against;
 * seeded from the company's configured label size.
 */
function LabelSizePicker() {
    var t = (0, macro_1.useLingui)().t;
    var documentType = (0, context_1.useEditorStore)(function (s) { return s.documentType; });
    var labelSizeId = (0, context_1.useEditorStore)(function (s) { return s.labelSizeId; });
    var setLabelSizeId = (0, context_1.useEditorStore)(function (s) { return s.setLabelSizeId; });
    if (documentType !== "trackingLabel")
        return null;
    return (<div className="flex flex-col items-start gap-0.5">
      <span className={PICKER_LABEL}>Preview size</span>
      <react_1.Select value={labelSizeId} onValueChange={setLabelSizeId}>
        <react_1.SelectTrigger size="sm" className="w-[160px]">
          <react_1.SelectValue placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Label size"], ["Label size"])))}/>
        </react_1.SelectTrigger>
        <react_1.SelectContent>
          {utils_1.labelSizes.map(function (s) { return (<react_1.SelectItem key={s.id} value={s.id}>
              {s.name}
            </react_1.SelectItem>); })}
        </react_1.SelectContent>
      </react_1.Select>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
