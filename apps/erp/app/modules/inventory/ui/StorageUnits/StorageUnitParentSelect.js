"use strict";
// Hierarchical parent-storage-unit picker — drill-down + breadcrumb + search.
// Local to the Storage Unit form: the only place a *non-leaf* unit is the
// target (choosing where a unit sits in the tree). Everywhere else picks a
// leaf bin via the shared `<StorageUnit>` combobox.
//
// Backed by the same `useStorageUnitsTree` data hook as `<StorageUnit>`.
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
exports.StorageUnitParentSelect = StorageUnitParentSelect;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Location_1 = require("~/components/Form/Location");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var path_1 = require("~/utils/path");
// ---------------------------------------------------------------------------
// useExcludedDescendantIds — fetches the subtree under `rootId` so the picker
// can exclude self + descendants (cycle prevention). DB also enforces this via
// `storage_unit_enforce_no_cycle`.
// ---------------------------------------------------------------------------
function useExcludedDescendantIds(rootId) {
    var descendantsFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: fetcher identity changes every render
    (0, react_2.useEffect)(function () {
        if (rootId) {
            descendantsFetcher.load(path_1.path.to.api.storageUnitDescendants(rootId));
        }
    }, [rootId]);
    return (0, react_2.useMemo)(function () {
        var _a, _b;
        if (!rootId)
            return new Set();
        var ids = new Set([rootId]);
        for (var _i = 0, _c = (_b = (_a = descendantsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
            var row = _c[_i];
            if (row.id)
                ids.add(row.id);
        }
        return ids;
    }, [rootId, descendantsFetcher.data]);
}
function DrillSelect(_a) {
    var _b, _c;
    var locationId = _a.locationId, value = _a.value, onChange = _a.onChange, isReadOnly = _a.isReadOnly, _d = _a.placeholder, placeholder = _d === void 0 ? "Select" : _d, excludeDescendantsOf = _a.excludeDescendantsOf;
    var t = (0, macro_1.useLingui)().t;
    var allRows = (0, StorageUnit_1.useStorageUnitsTree)(locationId);
    var excludedIds = useExcludedDescendantIds(excludeDescendantsOf);
    var rows = (0, react_2.useMemo)(function () {
        return excludedIds.size === 0
            ? allRows
            : allRows.filter(function (r) { return !excludedIds.has(r.id); });
    }, [allRows, excludedIds]);
    var _e = (0, react_2.useState)(false), open = _e[0], setOpen = _e[1];
    var _f = (0, react_2.useState)([]), stack = _f[0], setStack = _f[1];
    var _g = (0, react_2.useState)(""), search = _g[0], setSearch = _g[1];
    var byId = (0, react_2.useMemo)(function () {
        var m = new Map();
        rows.forEach(function (r) {
            m.set(r.id, r);
        });
        return m;
    }, [rows]);
    var childrenOf = (0, react_2.useMemo)(function () {
        var m = new Map();
        rows.forEach(function (r) {
            var _a;
            var arr = (_a = m.get(r.parentId)) !== null && _a !== void 0 ? _a : [];
            arr.push(r);
            m.set(r.parentId, arr);
        });
        m.forEach(function (arr) {
            arr.sort(function (a, b) { return a.name.localeCompare(b.name); });
        });
        return m;
    }, [rows]);
    var currentParentId = stack.length === 0 ? null : stack[stack.length - 1];
    var currentChildren = (_b = childrenOf.get(currentParentId)) !== null && _b !== void 0 ? _b : [];
    var breadcrumb = stack
        .map(function (id) { return byId.get(id); })
        .filter(function (r) { return Boolean(r); });
    var renderPath = (0, react_2.useCallback)(function (row) {
        var _a;
        return ((_a = row.ancestorPath) !== null && _a !== void 0 ? _a : [])
            .slice(0, -1)
            .map(function (id) { var _a; return (_a = byId.get(id)) === null || _a === void 0 ? void 0 : _a.name; })
            .filter(Boolean)
            .join(" / ");
    }, [byId]);
    var searchResults = (0, react_2.useMemo)(function () {
        var q = search.trim().toLowerCase();
        if (!q)
            return null;
        return rows.filter(function (r) {
            var _a, _b;
            if ((_a = r.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(q))
                return true;
            return ((_b = r.ancestorPath) !== null && _b !== void 0 ? _b : []).some(function (id) { var _a, _b; return (_b = (_a = byId.get(id)) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(q); });
        });
    }, [search, rows, byId]);
    var selectedRow = value ? byId.get(value) : undefined;
    var triggerLabel = (_c = selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.name) !== null && _c !== void 0 ? _c : "";
    // Look up the current location's name for the breadcrumb root.
    var locations = (0, Location_1.useLocations)();
    var locationLabel = (0, react_2.useMemo)(function () {
        var match = locations.find(function (l) { return l.value === locationId; });
        return match ? (typeof match.label === "string" ? match.label : "") : "";
    }, [locations, locationId]);
    // Open with the selected row's parent stack so the user sees the selected
    // unit highlighted in its sibling list on reopen.
    (0, react_2.useEffect)(function () {
        var _a;
        if (!open)
            return;
        if (!value)
            return;
        var row = byId.get(value);
        if (!row)
            return;
        setStack(((_a = row.ancestorPath) !== null && _a !== void 0 ? _a : []).slice(0, -1));
    }, [open, value, byId]);
    var reset = function () {
        setStack([]);
        setSearch("");
    };
    var select = function (id) {
        onChange(id);
        setOpen(false);
        reset();
    };
    if (!locationId)
        return null;
    return (<react_1.Popover open={open} onOpenChange={function (o) {
            setOpen(o);
            if (!o)
                reset();
        }}>
      <react_1.PopoverTrigger asChild>
        <button type="button" disabled={isReadOnly} className={(0, react_1.cn)("flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-left shadow-xs transition-[color,box-shadow]", "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", isReadOnly && "opacity-60 cursor-not-allowed", !triggerLabel && "text-muted-foreground")}>
          <span className="min-w-0 flex-1 truncate">
            {triggerLabel || placeholder}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {value && !isReadOnly ? (<span role="button" tabIndex={-1} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Clear"], ["Clear"])))} onClick={function (e) {
                e.stopPropagation();
                onChange("");
            }} className="flex h-4 w-4 items-center justify-center rounded opacity-60 hover:bg-muted hover:opacity-100">
                <lu_1.LuX className="h-3 w-3"/>
              </span>) : null}
            <lu_1.LuChevronDown className="h-4 w-4 opacity-50"/>
          </span>
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" sideOffset={4} collisionPadding={12} avoidCollisions className="w-auto min-w-[280px] max-w-[min(420px,calc(100vw-24px))] p-0">
        {/* Breadcrumb — root crumb = location, non-clickable (single-location);
            subsequent crumbs are parent units (clickable to navigate up). */}
        <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
          <button type="button" onClick={function () { return setStack([]); }} className={(0, react_1.cn)("flex items-center gap-1 rounded px-1.5 py-0.5 text-xs hover:bg-muted", stack.length === 0
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground")}>
            <lu_1.LuMapPin className="h-3 w-3 opacity-70"/>
            {locationLabel || "Location"}
          </button>
          {breadcrumb.map(function (row, i) { return (<span key={row.id} className="flex items-center gap-0.5">
              <lu_1.LuChevronRight className="h-3 w-3 text-muted-foreground/60"/>
              <button type="button" onClick={function () { return setStack(stack.slice(0, i + 1)); }} className={(0, react_1.cn)("rounded px-1.5 py-0.5 text-xs hover:bg-muted", i === breadcrumb.length - 1
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground")}>
                {row.name}
              </button>
            </span>); })}
        </div>

        {/* Search — flush, borderless. */}
        <react_1.Input autoFocus borderless value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search storage units\u2026"], ["Search storage units\u2026"])))} className="h-9 rounded-none border-b border-border bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"/>

        {/* List */}
        <ul className="max-h-[260px] overflow-y-auto py-1">
          {searchResults ? (searchResults.length === 0 ? (<li className="px-3 py-6 text-center text-xs text-muted-foreground">
                No matches
              </li>) : (searchResults.map(function (row) { return (<li key={row.id}>
                  <button type="button" onClick={function () { return select(row.id); }} className="flex w-full flex-col items-start gap-0.5 px-3 py-1.5 text-left hover:bg-muted">
                    <span className="text-sm">{row.name}</span>
                    {renderPath(row) && (<span className="text-xs text-muted-foreground">
                        {renderPath(row)}
                      </span>)}
                  </button>
                </li>); }))) : currentChildren.length === 0 ? (<li className="px-3 py-6 text-center text-xs text-muted-foreground">
              No storage units
            </li>) : (currentChildren.map(function (row) {
            var _a;
            var hasChildren = ((_a = childrenOf.get(row.id)) !== null && _a !== void 0 ? _a : []).length > 0;
            var isSelected = row.id === value;
            return (<li key={row.id} className="flex items-stretch hover:bg-muted">
                  <button type="button" onClick={function () { return select(row.id); }} className={(0, react_1.cn)("flex-1 truncate px-3 py-1.5 text-left text-sm", isSelected && "font-medium text-foreground")}>
                    {row.name}
                  </button>
                  {hasChildren && (<button type="button" onClick={function () {
                        setStack(__spreadArray(__spreadArray([], stack, true), [row.id], false));
                        setSearch("");
                    }} className="flex w-7 shrink-0 items-center justify-center border-l text-muted-foreground hover:text-foreground" aria-label={"Open ".concat(row.name)}>
                      <lu_1.LuChevronRight className="h-3.5 w-3.5"/>
                    </button>)}
                </li>);
        }))}
        </ul>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function StorageUnitParentSelect(_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, locationId = _a.locationId, isReadOnly = _a.isReadOnly, isOptional = _a.isOptional, excludeDescendantsOf = _a.excludeDescendantsOf;
    var _b = (0, form_1.useField)(name), error = _b.error, getInputProps = _b.getInputProps, fieldIsOptional = _b.isOptional;
    var _c = (0, form_1.useControlField)(name), value = _c[0], setValue = _c[1];
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={isOptional !== null && isOptional !== void 0 ? isOptional : fieldIsOptional}>
          {label}
        </react_1.FormLabel>)}
      <input {...getInputProps({ id: name, type: "hidden" })} name={name} value={value !== null && value !== void 0 ? value : ""}/>
      <DrillSelect locationId={locationId} value={value !== null && value !== void 0 ? value : null} onChange={function (next) { return setValue(next || undefined); }} isReadOnly={isReadOnly} excludeDescendantsOf={excludeDescendantsOf}/>
      {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
    </react_1.FormControl>);
}
var templateObject_1, templateObject_2;
