"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.handle = void 0;
exports.default = TraceabilityRoute;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var constants_1 = require("~/modules/inventory/ui/Traceability/constants");
var metadata_1 = require("~/modules/inventory/ui/Traceability/metadata");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Traceability"], ["Traceability"]))),
    to: path_1.path.to.traceability,
    module: "inventory"
};
var RECENT_SEARCHES_PREFIX = "traceability-searches";
function recentSearchesKey(companyId) {
    return "".concat(RECENT_SEARCHES_PREFIX, ":").concat(companyId);
}
function TraceabilityRoute() {
    var _a, _b;
    var t = (0, macro_2.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var fetcher = (0, react_router_1.useFetcher)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var storageKey = recentSearchesKey(company.id);
    var _c = (0, react_2.useState)(""), query = _c[0], setQuery = _c[1];
    var _d = (0, react_2.useState)([]), recentSearches = _d[0], setRecentSearches = _d[1];
    var debounceRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        var cancelled = false;
        var stored = localStorage.getItem(storageKey);
        if (!stored) {
            setRecentSearches([]);
            return;
        }
        var parsed = [];
        try {
            var raw = JSON.parse(stored);
            if (Array.isArray(raw))
                parsed = raw;
        }
        catch (_a) {
            localStorage.removeItem(storageKey);
            return;
        }
        if (parsed.length === 0 || !carbon) {
            setRecentSearches(parsed);
            return;
        }
        // Show cached entries immediately, then refresh from server and drop stale.
        setRecentSearches(parsed);
        var ids = parsed.map(function (p) { return p.id; });
        carbon
            .from("trackedEntity")
            .select("id, quantity, status, sourceDocument, sourceDocumentId, sourceDocumentReadableId, readableId, attributes, createdAt")
            .eq("companyId", company.id)
            .in("id", ids)
            .then(function (_a) {
            var data = _a.data;
            if (cancelled)
                return;
            var rows = (data !== null && data !== void 0 ? data : []);
            var byId = new Map(rows.map(function (r) { return [r.id, r]; }));
            var next = parsed
                .map(function (p) { return byId.get(p.id); })
                .filter(function (e) { return e !== undefined; });
            setRecentSearches(next);
            if (next.length === 0)
                localStorage.removeItem(storageKey);
            else
                localStorage.setItem(storageKey, JSON.stringify(next));
        });
        return function () {
            cancelled = true;
        };
    }, [storageKey, carbon, company.id]);
    (0, react_2.useEffect)(function () {
        if (debounceRef.current)
            window.clearTimeout(debounceRef.current);
        var trimmed = query.trim();
        if (trimmed.length < 2)
            return;
        debounceRef.current = window.setTimeout(function () {
            var params = new URLSearchParams({ q: trimmed, kind: "entity" });
            fetcher.load("".concat(constants_1.TRACE_API.search, "?").concat(params.toString()));
        }, 350);
        return function () {
            if (debounceRef.current)
                window.clearTimeout(debounceRef.current);
        };
    }, [query, fetcher.load]);
    var isLoading = fetcher.state !== "idle";
    var trimmed = query.trim();
    var showSearchResults = trimmed.length >= 2;
    var entities = showSearchResults ? ((_b = (_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.entities) !== null && _b !== void 0 ? _b : []) : [];
    var recordRecent = function (entity) {
        var next = __spreadArray([
            entity
        ], recentSearches.filter(function (e) { return e.id !== entity.id; }), true).slice(0, 5);
        setRecentSearches(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
    };
    var openEntity = function (entity) {
        var params = new URLSearchParams();
        recordRecent(entity);
        params.set("trackedEntityId", entity.id);
        navigate("".concat(path_1.path.to.traceabilityGraph, "?").concat(params.toString()));
    };
    return (<components_1.SearchLandingPage icon={lu_1.LuNetwork} heading={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Traceability"], ["Traceability"])))} description={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Scan a label or search by item ID or tracking ID."], ["Scan a label or search by item ID or tracking ID."])))}>
      <react_1.Command shouldFilter={false} className="rounded-md border border-border bg-background overflow-hidden">
        <div className="relative">
          <react_1.CommandInput placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Scan or search..."], ["Scan or search..."])))} value={query} onValueChange={setQuery} className="h-12 text-base pr-12" autoFocus/>
          <lu_1.LuQrCode className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none"/>
        </div>
        <react_1.CommandList className="h-(--cmdk-list-height) max-h-[400px] min-h-0 border-t border-border transition-[height] duration-200 ease-out [&[hidden]]:hidden">
          {showSearchResults ? (<>
              {entities.length > 0 ? (<react_1.CommandGroup heading={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Entities"], ["Entities"])))} className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5">
                  {entities.map(function (entity) { return (<EntityRowItem key={entity.id} entity={entity} onSelect={function () { return openEntity(entity); }}/>); })}
                </react_1.CommandGroup>) : (<react_1.CommandEmpty className="text-center text-sm text-muted-foreground py-3">
                  {isLoading ? <SearchSkeleton /> : <macro_2.Trans>No matches</macro_2.Trans>}
                </react_1.CommandEmpty>)}
            </>) : recentSearches.length > 0 ? (<react_1.CommandGroup heading={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Recent"], ["Recent"])))} className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5">
              {recentSearches.map(function (entity) { return (<EntityRowItem key={entity.id} entity={entity} onSelect={function () { return openEntity(entity); }}/>); })}
            </react_1.CommandGroup>) : null}
        </react_1.CommandList>
      </react_1.Command>
    </components_1.SearchLandingPage>);
}
function EntityRowItem(_a) {
    var _b, _c, _d, _e, _f;
    var entity = _a.entity, onSelect = _a.onSelect;
    var meta = (0, metadata_1.entityStatusMeta)(entity.status);
    var Icon = meta.icon;
    var headline = headlineFor(entity);
    var trackingHint = (_c = (_b = entity.sourceDocumentReadableId) !== null && _b !== void 0 ? _b : entity.sourceDocument) !== null && _c !== void 0 ? _c : entity.id.slice(0, 12);
    var trackingIdHint = (_d = entity.readableId) !== null && _d !== void 0 ? _d : entity.id;
    return (<react_1.CommandItem value={"".concat(headline, " ").concat(entity.id, " ").concat((_e = entity.sourceDocumentReadableId) !== null && _e !== void 0 ? _e : "", " ").concat((_f = entity.readableId) !== null && _f !== void 0 ? _f : "")} onSelect={onSelect} className="!py-2.5 !px-3 gap-3 cursor-pointer rounded-lg">
      <span className="size-9 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-foreground/10 shadow-sm" style={{ background: meta.color }}>
        <Icon className="size-4 text-white drop-shadow-sm"/>
      </span>
      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
        <span className="block text-sm font-medium truncate leading-5">
          {headline}
        </span>
        <p className="text-[11px] text-muted-foreground truncate leading-4">
          {trackingHint}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground leading-4 min-w-0">
          <span className="block min-w-0 truncate">
            {"Tracking ".concat(trackingIdHint)}
          </span>
        </div>
      </div>
      <react_1.HStack spacing={2} className="items-center shrink-0">
        {entity.status && (<react_1.Badge variant="secondary" className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5">
            {entity.status}
          </react_1.Badge>)}
        <span className="text-xs tabular-nums font-medium text-foreground w-10 text-right">
          {entity.quantity}
        </span>
      </react_1.HStack>
    </react_1.CommandItem>);
}
function headlineFor(entity) {
    var _a, _b;
    return ((_b = (_a = entity.sourceDocumentReadableId) !== null && _a !== void 0 ? _a : entity.readableId) !== null && _b !== void 0 ? _b : entity.id.slice(0, 12));
}
function SearchSkeleton() {
    return (<div role="status" aria-live="polite" aria-busy="true" className="py-2">
      <span className="sr-only">Searching</span>
      <div className="px-3 pt-1 pb-1.5">
        <div className="h-2.5 w-16 rounded-full bg-foreground/10 animate-pulse"/>
      </div>
      {[0, 1, 2, 3].map(function (i) {
            var _a;
            return (<div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg [animation-delay:var(--d)]" style={_a = {}, _a["--d"] = "".concat(i * 90, "ms"), _a}>
          <div className="size-9 rounded-lg shrink-0 bg-foreground/10 animate-pulse"/>
          <div className="flex flex-col flex-1 min-w-0 gap-1.5">
            <div className="h-3 rounded-full bg-foreground/10 animate-pulse" style={{ width: "".concat(60 + ((i * 13) % 30), "%") }}/>
            <div className="h-2.5 rounded-full bg-foreground/[0.07] animate-pulse" style={{ width: "".concat(30 + ((i * 17) % 25), "%") }}/>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-4 w-14 rounded-md bg-foreground/10 animate-pulse"/>
            <div className="h-3 w-6 rounded-full bg-foreground/10 animate-pulse"/>
          </div>
        </div>);
        })}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
