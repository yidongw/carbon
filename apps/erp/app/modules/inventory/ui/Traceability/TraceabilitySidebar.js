"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceabilitySidebar = TraceabilitySidebar;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var string_1 = require("~/utils/string");
var attributeRenderers_1 = require("./attributeRenderers");
var ContainmentList_1 = require("./ContainmentList");
var metadata_1 = require("./metadata");
var StepRecordsList_1 = require("./StepRecordsList");
var TrackedEntityStatus_1 = require("./TrackedEntityStatus");
var utils_1 = require("./utils");
function TraceabilitySidebar(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var entity = _a.entity, activity = _a.activity, payload = _a.payload, onSelect = _a.onSelect, selectedIds = _a.selectedIds, focusedIndex = _a.focusedIndex, onFocusedIndexChange = _a.onFocusedIndexChange;
    var t = (0, macro_1.useLingui)().t;
    var selectedNode = entity !== null && entity !== void 0 ? entity : activity;
    var selectedNodeType = entity ? "entity" : "activity";
    var selectedNodeAttributes = (entity ? ((_b = entity.attributes) !== null && _b !== void 0 ? _b : {}) : ((_c = activity === null || activity === void 0 ? void 0 : activity.attributes) !== null && _c !== void 0 ? _c : {}));
    var headline = entity
        ? (0, utils_1.entityHeadline)(entity)
        : activity
            ? ((_d = activity.type) !== null && _d !== void 0 ? _d : activity.id)
            : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["No selection"], ["No selection"])));
    var sourceDoc = (_e = entity === null || entity === void 0 ? void 0 : entity.sourceDocument) !== null && _e !== void 0 ? _e : activity === null || activity === void 0 ? void 0 : activity.sourceDocument;
    var sourceDocId = (_f = entity === null || entity === void 0 ? void 0 : entity.sourceDocumentId) !== null && _f !== void 0 ? _f : activity === null || activity === void 0 ? void 0 : activity.sourceDocumentId;
    var sourceDocReadableId = (_g = entity === null || entity === void 0 ? void 0 : entity.sourceDocumentReadableId) !== null && _g !== void 0 ? _g : activity === null || activity === void 0 ? void 0 : activity.sourceDocumentReadableId;
    var sourceHref = (0, utils_1.sourceLinkHref)(sourceDoc, sourceDocId);
    var _l = (0, react_2.useMemo)(function () {
        if (!payload) {
            return {
                producedBy: [],
                consumedBy: [],
                inputs: [],
                outputs: []
            };
        }
        var activityById = new Map(payload.activities.map(function (a) { return [a.id, a]; }));
        var entityById = new Map(payload.entities.map(function (e) { return [e.id, e]; }));
        var producedBy = [];
        var consumedBy = [];
        var inputs = [];
        var outputs = [];
        if (entity) {
            for (var _i = 0, _a = payload.outputs; _i < _a.length; _i++) {
                var o = _a[_i];
                if (o.trackedEntityId !== entity.id)
                    continue;
                var a = activityById.get(o.trackedActivityId);
                if (a)
                    producedBy.push({ activity: a, quantity: o.quantity });
            }
            for (var _b = 0, _c = payload.inputs; _b < _c.length; _b++) {
                var i = _c[_b];
                if (i.trackedEntityId !== entity.id)
                    continue;
                var a = activityById.get(i.trackedActivityId);
                if (a)
                    consumedBy.push({ activity: a, quantity: i.quantity });
            }
        }
        else if (activity) {
            for (var _d = 0, _e = payload.inputs; _d < _e.length; _d++) {
                var i = _e[_d];
                if (i.trackedActivityId !== activity.id)
                    continue;
                var e = entityById.get(i.trackedEntityId);
                if (e)
                    inputs.push({ entity: e, quantity: i.quantity });
            }
            for (var _f = 0, _g = payload.outputs; _f < _g.length; _f++) {
                var o = _g[_f];
                if (o.trackedActivityId !== activity.id)
                    continue;
                var e = entityById.get(o.trackedEntityId);
                if (e)
                    outputs.push({ entity: e, quantity: o.quantity });
            }
        }
        return { producedBy: producedBy, consumedBy: consumedBy, inputs: inputs, outputs: outputs };
    }, [payload, entity, activity]), producedBy = _l.producedBy, consumedBy = _l.consumedBy, inputs = _l.inputs, outputs = _l.outputs;
    var stepRecordsFetcher = (0, react_router_1.useFetcher)();
    var lastLoadedActivityIdRef = (0, react_2.useRef)(null);
    var stepRecordsLoad = stepRecordsFetcher.load;
    var activityId = (_h = activity === null || activity === void 0 ? void 0 : activity.id) !== null && _h !== void 0 ? _h : null;
    (0, react_2.useEffect)(function () {
        if (!activityId)
            return;
        if (lastLoadedActivityIdRef.current === activityId)
            return;
        lastLoadedActivityIdRef.current = activityId;
        stepRecordsLoad("/api/traceability/sidebar?activityId=".concat(encodeURIComponent(activityId)));
    }, [activityId, stepRecordsLoad]);
    var stepRecordsForActivity = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        var list = (_b = (_a = stepRecordsFetcher.data) === null || _a === void 0 ? void 0 : _a.stepRecords) !== null && _b !== void 0 ? _b : [];
        if (!activity || list.length === 0)
            return [];
        var opId = (_c = activity.attributes) === null || _c === void 0 ? void 0 : _c["Job Operation"];
        if (!opId)
            return [];
        return list.filter(function (r) { return r.operationId === opId; });
    }, [activity, stepRecordsFetcher.data]);
    var containmentsForEntity = (0, react_2.useMemo)(function () {
        var _a;
        if (!entity || !((_a = payload === null || payload === void 0 ? void 0 : payload.containments) === null || _a === void 0 ? void 0 : _a.length))
            return [];
        return payload.containments.filter(function (c) { return c.trackedEntityId === entity.id; });
    }, [entity, payload === null || payload === void 0 ? void 0 : payload.containments]);
    var hasMultiSelect = selectedIds && selectedIds.length > 1;
    return (<aside className="w-[426px] flex-shrink-0 bg-sidebar h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent border-l border-border text-sm">
      {hasMultiSelect && (<div className="flex items-center justify-between gap-2 bg-muted/40 mx-3 mt-3 rounded-md px-2 py-1">
          <div className="flex items-center gap-2 min-w-0">
            <react_1.Badge variant="secondary" className="uppercase tracking-wide text-[10px]">
              {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " selected"], ["", " selected"])), selectedIds.length)}
            </react_1.Badge>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {(focusedIndex !== null && focusedIndex !== void 0 ? focusedIndex : 0) + 1} / {selectedIds.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <react_1.Button variant="ghost" size="sm" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Previous selected"], ["Previous selected"])))} className="p-1 h-6 w-6" onClick={function () {
                var i = focusedIndex !== null && focusedIndex !== void 0 ? focusedIndex : 0;
                var next = (i - 1 + selectedIds.length) % selectedIds.length;
                onFocusedIndexChange === null || onFocusedIndexChange === void 0 ? void 0 : onFocusedIndexChange(next);
            }}>
              <lu_1.LuChevronLeft className="w-3.5 h-3.5"/>
            </react_1.Button>
            <react_1.Button variant="ghost" size="sm" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Next selected"], ["Next selected"])))} className="p-1 h-6 w-6" onClick={function () {
                var i = focusedIndex !== null && focusedIndex !== void 0 ? focusedIndex : 0;
                var next = (i + 1) % selectedIds.length;
                onFocusedIndexChange === null || onFocusedIndexChange === void 0 ? void 0 : onFocusedIndexChange(next);
            }}>
              <lu_1.LuChevronRight className="w-3.5 h-3.5"/>
            </react_1.Button>
          </div>
        </div>)}

      <header className="px-3 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            {entity ? (<react_1.Badge variant="secondary" className="uppercase tracking-wide text-[10px] shrink-0">
                {t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Entity"], ["Entity"])))}
              </react_1.Badge>) : activity ? (<>
                <react_1.Badge variant="outline" className="uppercase tracking-wide text-[10px] shrink-0">
                  {t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Activity"], ["Activity"])))}
                </react_1.Badge>
                <ActivityTypeChip type={activity.type}/>
              </>) : null}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Copy link"], ["Copy link"])))} size="sm" className="p-1 h-7 w-7" onClick={function () { return (0, string_1.copyToClipboard)(window.location.href); }}>
                  <lu_1.LuLink className="w-3.5 h-3.5"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Copy link"], ["Copy link"])))}</react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Copy ID"], ["Copy ID"])))} size="sm" className="p-1 h-7 w-7" onClick={function () { var _a; return (0, string_1.copyToClipboard)((_a = selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.id) !== null && _a !== void 0 ? _a : ""); }}>
                  <lu_1.LuCopy className="w-3.5 h-3.5"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                {t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Copy ", " ID"], ["Copy ", " ID"])), (0, string_1.capitalize)(selectedNodeType))}
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </div>
        </div>
        <h2 className="text-[15px] font-semibold leading-5 text-foreground truncate">
          {headline}
        </h2>
        <p className="text-[11px] text-muted-foreground/70 font-mono break-all leading-4 mt-0.5">
          {selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.id}
        </p>
      </header>

      <div className="flex flex-col divide-y divide-border/40">
        {(selectedNodeType === "entity" || sourceDoc) && (<Section>
            <dl className="divide-y divide-border/30">
              {selectedNodeType === "entity" && (<>
                  <PropRow label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Status"], ["Status"])))}>
                    <TrackedEntityStatus_1.default status={entity === null || entity === void 0 ? void 0 : entity.status}/>
                  </PropRow>
                  <PropRow label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Quantity"], ["Quantity"])))}>
                    <span className="text-sm font-medium tabular-nums">
                      {entity === null || entity === void 0 ? void 0 : entity.quantity}
                    </span>
                  </PropRow>
                  {(entity === null || entity === void 0 ? void 0 : entity.readableId) && (<PropRow label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Serial / Batch"], ["Serial / Batch"])))}>
                      <span className="text-sm font-mono">
                        {entity.readableId}
                      </span>
                    </PropRow>)}
                </>)}
              {sourceDoc && (<PropRow label={sourceDoc}>
                  <SourceDocValue readableId={sourceDocReadableId} fallbackId={sourceDocId} href={sourceHref}/>
                </PropRow>)}
            </dl>
          </Section>)}

        {producedBy.length > 0 && (<Section title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Produced by"], ["Produced by"])))} count={producedBy.length}>
            <ul className="divide-y divide-border/30">
              {producedBy.map(function (item) { return (<RelatedActivityRow key={item.activity.id} item={item} onSelect={onSelect}/>); })}
            </ul>
          </Section>)}
        {consumedBy.length > 0 && (<Section title={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Consumed by"], ["Consumed by"])))} count={consumedBy.length}>
            <ul className="divide-y divide-border/30">
              {consumedBy.map(function (item) { return (<RelatedActivityRow key={item.activity.id} item={item} onSelect={onSelect}/>); })}
            </ul>
          </Section>)}
        {inputs.length > 0 && (<Section title={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Inputs"], ["Inputs"])))} count={inputs.length}>
            <ul className="divide-y divide-border/30">
              {inputs.map(function (item) { return (<RelatedEntityRow key={item.entity.id} item={item} onSelect={onSelect}/>); })}
            </ul>
          </Section>)}
        {outputs.length > 0 && (<Section title={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Outputs"], ["Outputs"])))} count={outputs.length}>
            <ul className="divide-y divide-border/30">
              {outputs.map(function (item) { return (<RelatedEntityRow key={item.entity.id} item={item} onSelect={onSelect}/>); })}
            </ul>
          </Section>)}

        {containmentsForEntity.length > 0 && (<Section title={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Containments"], ["Containments"])))} count={containmentsForEntity.length}>
            <ContainmentList_1.ContainmentList items={containmentsForEntity}/>
          </Section>)}

        {activity &&
            (stepRecordsFetcher.state === "loading" &&
                stepRecordsFetcher.data === undefined ? (<Section title={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Step records"], ["Step records"])))}>
              <StepRecordsSkeleton />
            </Section>) : stepRecordsForActivity.length > 0 ? (<Section title={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Step records"], ["Step records"])))} count={stepRecordsForActivity.length}>
              <StepRecordsList_1.StepRecordsList records={stepRecordsForActivity} jobId={(_k = (_j = activity === null || activity === void 0 ? void 0 : activity.attributes) === null || _j === void 0 ? void 0 : _j.Job) !== null && _k !== void 0 ? _k : null}/>
            </Section>) : null)}

        {(0, attributeRenderers_1.hasRenderedAttributes)(selectedNodeAttributes) && (<Section title={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Attributes"], ["Attributes"])))}>
            <attributeRenderers_1.AttributeList attrs={selectedNodeAttributes}/>
          </Section>)}
      </div>
    </aside>);
}
function Section(_a) {
    var title = _a.title, count = _a.count, children = _a.children;
    return (<section className="px-3 py-3">
      {title && (<header className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
          <span>{title}</span>
          {typeof count === "number" && (<span className="tabular-nums text-muted-foreground/60">
              {count}
            </span>)}
        </header>)}
      {children}
    </section>);
}
function PropRow(_a) {
    var label = _a.label, children = _a.children;
    return (<div className="grid grid-cols-[8rem_1fr] items-center gap-3 py-1.5 first:pt-0 last:pb-0">
      <dt className="text-xs text-muted-foreground truncate">{label}</dt>
      <dd className="text-right min-w-0 truncate">{children}</dd>
    </div>);
}
function ActivityTypeChip(_a) {
    var type = _a.type;
    var kind = (0, metadata_1.activityKindFor)(type);
    var meta = metadata_1.ACTIVITY_KIND_META[kind];
    var Icon = meta.icon;
    return (<div className="flex items-center gap-1.5 min-w-0">
      <span className="size-3.5 rounded-sm flex items-center justify-center shrink-0" style={{ background: meta.color }}>
        <Icon className="size-2.5 text-white"/>
      </span>
      <span className="text-xs truncate">{type !== null && type !== void 0 ? type : meta.label}</span>
    </div>);
}
function SourceDocValue(_a) {
    var _b;
    var readableId = _a.readableId, fallbackId = _a.fallbackId, href = _a.href;
    var label = (_b = readableId !== null && readableId !== void 0 ? readableId : fallbackId) !== null && _b !== void 0 ? _b : "—";
    if (href) {
        return (<react_router_1.Link to={href} className="inline-flex items-center gap-1 text-sm font-medium hover:underline" onClick={function (e) { return e.stopPropagation(); }}>
        <span className="truncate">{label}</span>
        <lu_1.LuExternalLink className="size-3 text-muted-foreground shrink-0"/>
      </react_router_1.Link>);
    }
    return <span className="text-sm font-medium truncate">{label}</span>;
}
function RelatedActivityRow(_a) {
    var item = _a.item, onSelect = _a.onSelect;
    var kind = (0, metadata_1.activityKindFor)(item.activity.type);
    var meta = metadata_1.ACTIVITY_KIND_META[kind];
    var Icon = meta.icon;
    var label = (0, utils_1.activityHeadline)(item.activity, 8);
    return (<li>
      <button type="button" onClick={function () { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(item.activity.id); }} className={(0, react_1.cn)("group w-full flex items-center justify-between gap-2 px-2 py-1.5 text-left rounded-md", "hover:bg-accent/50 transition-colors")}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="size-3.5 rounded-sm flex items-center justify-center shrink-0" style={{ background: meta.color }}>
            <Icon className="size-2.5 text-white"/>
          </span>
          <span className="text-sm truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs tabular-nums text-muted-foreground">
            {item.quantity}
          </span>
          <lu_1.LuChevronRight className="size-3 text-muted-foreground/60 group-hover:text-foreground transition-colors"/>
        </div>
      </button>
    </li>);
}
function RelatedEntityRow(_a) {
    var item = _a.item, onSelect = _a.onSelect;
    var label = (0, utils_1.entityHeadline)(item.entity, 8);
    return (<li>
      <button type="button" onClick={function () { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(item.entity.id); }} className={(0, react_1.cn)("group w-full flex items-center justify-between gap-2 px-2 py-1.5 text-left rounded-md", "hover:bg-accent/50 transition-colors")}>
        <div className="flex items-center gap-2 min-w-0">
          <TrackedEntityStatus_1.default status={item.entity.status}/>
          <span className="text-sm truncate">{label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs tabular-nums text-muted-foreground">
            {item.quantity}
          </span>
          <lu_1.LuChevronRight className="size-3 text-muted-foreground/60 group-hover:text-foreground transition-colors"/>
        </div>
      </button>
    </li>);
}
function StepRecordsSkeleton() {
    return (<ul className="divide-y divide-border/30">
      {[0, 1, 2].map(function (i) { return (<li key={i} className="px-2 py-1.5 flex items-center gap-2">
          <react_1.Skeleton className="h-6 w-6 rounded-full shrink-0"/>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <react_1.Skeleton className="h-3 w-32"/>
            <react_1.Skeleton className="h-2.5 w-20 opacity-70"/>
          </div>
          <react_1.Skeleton className="h-3 w-10 shrink-0"/>
        </li>); })}
    </ul>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21;
