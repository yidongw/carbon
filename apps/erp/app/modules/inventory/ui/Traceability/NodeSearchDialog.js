"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSearchDialog = NodeSearchDialog;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("@xyflow/react");
var react_3 = require("react");
var react_router_1 = require("react-router");
var constants_1 = require("./constants");
var metadata_1 = require("./metadata");
var utils_1 = require("./utils");
function NodeSearchDialog(_a) {
    var _b, _c, _d, _e;
    var open = _a.open, onOpenChange = _a.onOpenChange, payload = _a.payload, onSelect = _a.onSelect;
    var t = (0, macro_1.useLingui)().t;
    var _f = (0, react_2.useReactFlow)(), getNode = _f.getNode, setCenter = _f.setCenter;
    var navigate = (0, react_router_1.useNavigate)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _g = (0, react_3.useState)(""), query = _g[0], setQuery = _g[1];
    var debounceRef = (0, react_3.useRef)(null);
    (0, react_3.useEffect)(function () {
        if (!open)
            return;
        if (debounceRef.current)
            window.clearTimeout(debounceRef.current);
        var trimmed = query.trim();
        if (trimmed.length < 2)
            return;
        debounceRef.current = window.setTimeout(function () {
            var params = new URLSearchParams({ q: trimmed, kind: "all" });
            fetcher.load("".concat(constants_1.TRACE_API.search, "?").concat(params.toString()));
        }, 200);
        return function () {
            if (debounceRef.current)
                window.clearTimeout(debounceRef.current);
        };
    }, [query, open, fetcher.load]);
    (0, react_3.useEffect)(function () {
        if (!open)
            setQuery("");
    }, [open]);
    var localIds = (0, react_3.useMemo)(function () {
        var e = new Set(payload.entities.map(function (x) { return x.id; }));
        var a = new Set(payload.activities.map(function (x) { return x.id; }));
        return { e: e, a: a };
    }, [payload]);
    var showLocal = query.trim().length < 2;
    var entities = showLocal
        ? payload.entities
        : ((_c = (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.entities) !== null && _c !== void 0 ? _c : []);
    var activities = showLocal
        ? payload.activities
        : ((_e = (_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.activities) !== null && _e !== void 0 ? _e : []);
    function focusOrNavigate(kind, id) {
        var _a, _b, _c, _d, _e, _f;
        onOpenChange(false);
        var inGraph = kind === "entity" ? localIds.e.has(id) : localIds.a.has(id);
        if (inGraph) {
            var node = getNode(id);
            if (node) {
                var w = (_c = (_b = (_a = node.measured) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : node.width) !== null && _c !== void 0 ? _c : 44;
                var h = (_f = (_e = (_d = node.measured) === null || _d === void 0 ? void 0 : _d.height) !== null && _e !== void 0 ? _e : node.height) !== null && _f !== void 0 ? _f : 44;
                setCenter(node.position.x + w / 2, node.position.y + h / 2, {
                    zoom: 1.1,
                    duration: 250
                });
            }
            onSelect === null || onSelect === void 0 ? void 0 : onSelect(id);
            return;
        }
        var params = new URLSearchParams();
        var param = kind === "entity" ? "trackedEntityId" : "trackedActivityId";
        params.set(param, id);
        navigate("/x/traceability/graph?".concat(params.toString()));
    }
    var isLoading = fetcher.state !== "idle";
    return (<react_1.CommandDialog open={open} onOpenChange={onOpenChange}>
      <react_1.CommandInput placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search entities, activities, status, source doc, tracking ID..."], ["Search entities, activities, status, source doc, tracking ID..."])))} value={query} onValueChange={setQuery}/>
      <react_1.CommandList className="max-h-[420px]">
        {!showLocal &&
            isLoading &&
            entities.length === 0 &&
            activities.length === 0 ? (<div className="py-6 text-center text-sm text-muted-foreground">
            {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Searching..."], ["Searching..."])))}
          </div>) : (<react_1.CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["No matches"], ["No matches"])))}
          </react_1.CommandEmpty>)}

        {entities.length > 0 && (<react_1.CommandGroup heading={showLocal
                ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Entities in graph (", ")"], ["Entities in graph (", ")"])), entities.length) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Entities (", ")"], ["Entities (", ")"])), entities.length)}>
            {entities.map(function (entity) {
                var _a, _b, _c, _d, _e;
                var label = (0, utils_1.entityHeadline)(entity, 12);
                var meta = (0, metadata_1.entityStatusMeta)(entity.status);
                var Icon = meta.icon;
                var inGraph = localIds.e.has(entity.id);
                return (<react_1.CommandItem key={entity.id} value={"".concat(label, " ").concat(entity.id, " ").concat((_a = entity.sourceDocument) !== null && _a !== void 0 ? _a : "", " ").concat((_b = entity.sourceDocumentReadableId) !== null && _b !== void 0 ? _b : "", " ").concat((_c = entity.readableId) !== null && _c !== void 0 ? _c : "", " ").concat((_d = entity.status) !== null && _d !== void 0 ? _d : "")} onSelect={function () { return focusOrNavigate("entity", entity.id); }} className="!py-2 !px-2 gap-3">
                  <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: meta.color }}>
                    <Icon className="w-4 h-4 text-white"/>
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {label}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {(_e = entity.sourceDocument) !== null && _e !== void 0 ? _e : "—"}
                    </span>
                  </div>
                  <react_1.HStack spacing={2} className="items-center shrink-0">
                    <StatusPill status={entity.status}/>
                    <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
                      {entity.quantity}
                    </span>
                    {!inGraph && <OpenBadge />}
                  </react_1.HStack>
                </react_1.CommandItem>);
            })}
          </react_1.CommandGroup>)}

        {activities.length > 0 && (<react_1.CommandGroup heading={showLocal
                ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Activities in graph (", ")"], ["Activities in graph (", ")"])), activities.length) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Activities (", ")"], ["Activities (", ")"])), activities.length)}>
            {activities.map(function (activity) {
                var _a, _b, _c, _d, _e;
                var meta = metadata_1.ACTIVITY_KIND_META[(0, metadata_1.activityKindFor)(activity.type)];
                var Icon = meta.icon;
                var label = (_a = activity.type) !== null && _a !== void 0 ? _a : meta.label;
                var inGraph = localIds.a.has(activity.id);
                return (<react_1.CommandItem key={activity.id} value={"".concat(label, " ").concat(activity.id, " ").concat((_b = activity.sourceDocument) !== null && _b !== void 0 ? _b : "", " ").concat((_c = activity.sourceDocumentReadableId) !== null && _c !== void 0 ? _c : "")} onSelect={function () { return focusOrNavigate("activity", activity.id); }} className="!py-2 !px-2 gap-3">
                  <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: meta.color }}>
                    <Icon className="w-4 h-4 text-white"/>
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {label}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {(_e = (_d = activity.sourceDocumentReadableId) !== null && _d !== void 0 ? _d : activity.sourceDocument) !== null && _e !== void 0 ? _e : "—"}
                    </span>
                  </div>
                  {!inGraph && <OpenBadge />}
                </react_1.CommandItem>);
            })}
          </react_1.CommandGroup>)}
      </react_1.CommandList>
    </react_1.CommandDialog>);
}
function StatusPill(_a) {
    var status = _a.status;
    if (!status)
        return null;
    var color = (0, metadata_1.entityStatusMeta)(status).color;
    return (<span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-foreground bg-muted/60 rounded px-1.5 py-0.5 leading-none">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }}/>
      {status}
    </span>);
}
function OpenBadge() {
    var t = (0, macro_1.useLingui)().t;
    return (<span className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground border border-border rounded px-1 py-0.5 leading-none">
      {t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Open"], ["Open"])))}
    </span>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
