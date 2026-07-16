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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Location_1 = require("~/components/Form/Location");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var MultiValueCombobox_1 = require("./MultiValueCombobox");
var ValueCombobox_1 = require("./ValueCombobox");
var isMultiOp = function (op) { return op === "in" || op === "notIn"; };
var isPresenceOp = function (op) { return op === "isSet" || op === "isNotSet"; };
function ValueInputImpl(_a) {
    var fieldDef = _a.fieldDef, op = _a.op, value = _a.value, onChange = _a.onChange, options = _a.options;
    var t = (0, macro_1.useLingui)().t;
    // Presence ops — no value control. Render dashed placeholder pill so the
    // grid column stays the same width (matches existing visual treatment).
    // Height matches CommandTrigger size="md" (h-10) so the row stays aligned.
    if (isPresenceOp(op)) {
        return (<div className="flex h-10 items-center rounded-md border border-dashed border-border px-3 text-xs text-muted-foreground">
        {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["No value needed"], ["No value needed"])))}
      </div>);
    }
    // Render the autocomplete combobox whenever the field declares a loader,
    // even if `options` is currently empty. The fetcher hooks populate
    // asynchronously on mount; an empty array still renders a usable Combobox
    // (showing the "no values" empty state) which then re-renders with options
    // when the fetch resolves. Falling through to a text input on empty was the
    // bug — the input got "stuck" until the user re-selected the field.
    var hasOptions = !!(fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.valueOptionsLoader) && !!options;
    var multi = isMultiOp(op);
    // Multi-select with a known options loader — supplies a real string[] array
    // straight to the AST (no comma-split parsing needed).
    if (multi && hasOptions) {
        var arrValue = Array.isArray(value)
            ? value.map(String).filter(Boolean)
            : [];
        return (<MultiValueCombobox_1.default value={arrValue} onChange={function (next) { return onChange(next); }} options={options} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select values"], ["Select values"])))}/>);
    }
    // Single-select autocomplete — used for any scalar op on a field with a
    // loader. Local component for visual parity with FieldCombobox /
    // OperatorCombobox (chevron trigger, same height, full-width).
    if (!multi && hasOptions) {
        var strValue = typeof value === "string" || typeof value === "number"
            ? String(value)
            : "";
        return (<ValueCombobox_1.default value={strValue} onChange={function (next) { return onChange(next); }} options={options} placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Select value"], ["Select value"])))}/>);
    }
    // Storage-unit drill picker — hierarchical Location → drilldown selector
    // for scalar ops. Multi ops fall through to the text path (paste UUIDs).
    if (!multi && (fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.type) === "storageUnit") {
        var strValue = typeof value === "string" && value !== "" ? value : undefined;
        return <StorageUnitValuePicker value={strValue} onChange={onChange}/>;
    }
    // Numeric input — only valid on scalar ops; multi on a numeric field falls
    // through to the comma-separated text path below.
    if (!multi && (fieldDef === null || fieldDef === void 0 ? void 0 : fieldDef.type) === "number") {
        var numValue = typeof value === "number"
            ? value
            : typeof value === "string" && value !== ""
                ? Number(value)
                : Number.NaN;
        return (<react_1.NumberField value={Number.isNaN(numValue) ? undefined : numValue} onChange={function (n) {
                return onChange(typeof n === "number" && !Number.isNaN(n) ? n : undefined);
            }} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Number"], ["Number"])))}>
        <react_1.NumberInputGroup className="relative">
          <react_1.NumberInput placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Number"], ["Number"])))}/>
          <react_1.NumberInputStepper>
            <react_1.NumberIncrementStepper>
              <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
            </react_1.NumberIncrementStepper>
            <react_1.NumberDecrementStepper>
              <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
            </react_1.NumberDecrementStepper>
          </react_1.NumberInputStepper>
        </react_1.NumberInputGroup>
      </react_1.NumberField>);
    }
    // Fallback — string input. Multi-value without a loader stays as
    // comma-separated text so users can still type literal sets (e.g. on custom
    // fields where no option list is known).
    var display = value == null
        ? ""
        : Array.isArray(value)
            ? value.join(", ")
            : String(value);
    return (<react_1.Input size="md" type="text" placeholder={multi ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["comma-separated values"], ["comma-separated values"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Value"], ["Value"])))} value={display} onChange={function (e) {
            var raw = e.target.value;
            if (multi) {
                onChange(raw
                    .split(",")
                    .map(function (s) { return s.trim(); })
                    .filter(Boolean));
            }
            else {
                onChange(raw);
            }
        }}/>);
}
exports.default = (0, react_2.memo)(ValueInputImpl);
function StorageUnitValuePickerImpl(_a) {
    var _b, _c;
    var value = _a.value, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var locations = (0, Location_1.useLocations)();
    var _d = (0, react_2.useState)(null), locationId = _d[0], setLocationId = _d[1];
    var _e = (0, react_2.useState)(false), open = _e[0], setOpen = _e[1];
    var _f = (0, react_2.useState)([]), stack = _f[0], setStack = _f[1];
    var _g = (0, react_2.useState)(""), search = _g[0], setSearch = _g[1];
    // Default to first available location.
    (0, react_2.useEffect)(function () {
        if (locationId)
            return;
        if (!locations.length)
            return;
        setLocationId(locations[0].value);
    }, [locationId, locations]);
    // Auto-route to the location whose tree contains `value`. Hops through
    // locations one at a time; bails as soon as it finds a match.
    var tree = (0, StorageUnit_1.useStorageUnitsTree)(locationId);
    (0, react_2.useEffect)(function () {
        if (!value || !locationId)
            return;
        if (tree.some(function (r) { return r.id === value; }))
            return;
        for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
            var loc = locations_1[_i];
            if (loc.value === locationId)
                continue;
            setLocationId(loc.value);
            return;
        }
    }, [value, locationId, tree, locations]);
    var byId = (0, react_2.useMemo)(function () {
        var m = new Map();
        for (var _i = 0, tree_1 = tree; _i < tree_1.length; _i++) {
            var r = tree_1[_i];
            m.set(r.id, r);
        }
        return m;
    }, [tree]);
    var childrenOf = (0, react_2.useMemo)(function () {
        var _a;
        var m = new Map();
        for (var _i = 0, tree_2 = tree; _i < tree_2.length; _i++) {
            var r = tree_2[_i];
            var arr = (_a = m.get(r.parentId)) !== null && _a !== void 0 ? _a : [];
            arr.push(r);
            m.set(r.parentId, arr);
        }
        for (var _b = 0, _c = m.values(); _b < _c.length; _b++) {
            var arr = _c[_b];
            arr.sort(function (a, b) { return a.name.localeCompare(b.name); });
        }
        return m;
    }, [tree]);
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
        return tree.filter(function (r) {
            var _a, _b;
            if ((_a = r.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(q))
                return true;
            return ((_b = r.ancestorPath) !== null && _b !== void 0 ? _b : []).some(function (id) { var _a, _b; return (_b = (_a = byId.get(id)) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(q); });
        });
    }, [search, tree, byId]);
    var selectedRow = value ? byId.get(value) : undefined;
    var selectedLocation = locations.find(function (l) { return l.value === locationId; });
    var selectedLocationLabel = selectedLocation
        ? typeof selectedLocation.label === "string"
            ? selectedLocation.label
            : ""
        : "";
    var reset = function () {
        setStack([]);
        setSearch("");
    };
    // On open with an existing value: stack to the selected row's parent so
    // user lands viewing the selected unit highlighted in its sibling list.
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
    var select = function (id) {
        onChange(id || undefined);
        setOpen(false);
        reset();
    };
    var _h = (0, react_2.useState)(false), locOpen = _h[0], setLocOpen = _h[1];
    return (<react_1.Popover open={open} onOpenChange={function (o) {
            setOpen(o);
            if (!o)
                reset();
        }}>
      <react_1.PopoverTrigger asChild>
        <button type="button" className={(0, react_1.cn)("group flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm text-left", "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]", !selectedRow && "text-muted-foreground")}>
          <span className="min-w-0 flex-1 truncate">
            {(_c = selectedRow === null || selectedRow === void 0 ? void 0 : selectedRow.name) !== null && _c !== void 0 ? _c : "Select storage unit"}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {value ? (<span role="button" tabIndex={-1} aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Clear"], ["Clear"])))} onClick={function (e) {
                e.stopPropagation();
                onChange(undefined);
            }} className="flex h-4 w-4 items-center justify-center rounded opacity-60 hover:bg-muted hover:opacity-100">
                <lu_1.LuX className="h-3 w-3"/>
              </span>) : null}
            <lu_1.LuChevronDown className="h-4 w-4 opacity-50"/>
          </span>
        </button>
      </react_1.PopoverTrigger>

      <react_1.PopoverContent align="end" sideOffset={4} collisionPadding={12} avoidCollisions className="w-auto min-w-[220px] max-w-[min(420px,calc(100vw-24px))] p-0" onWheel={function (e) { return e.stopPropagation(); }} onTouchMove={function (e) { return e.stopPropagation(); }}>
        {/* Breadcrumb — always visible. Root crumb is the location, clickable
            to switch locations via a nested popover. */}
        <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
          <react_1.Popover open={locOpen} onOpenChange={setLocOpen}>
            <react_1.PopoverTrigger asChild>
              <button type="button" className={(0, react_1.cn)("flex items-center gap-1 rounded px-1.5 py-0.5 text-xs hover:bg-muted", stack.length === 0
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground")}>
                <lu_1.LuMapPin className="h-3 w-3 opacity-70"/>
                {selectedLocationLabel || "Location"}
                <lu_1.LuChevronDown className="h-3 w-3 opacity-60"/>
              </button>
            </react_1.PopoverTrigger>
            <react_1.PopoverContent align="start" sideOffset={4} collisionPadding={12} className="w-auto min-w-[200px] max-w-[320px] p-1">
              <ul className="max-h-[200px] overflow-y-auto">
                {locations.length === 0 && (<li className="px-2 py-1.5 text-xs text-muted-foreground">
                    Loading…
                  </li>)}
                {locations.map(function (l) {
            var isActive = l.value === locationId;
            return (<li key={l.value}>
                      <button type="button" onClick={function () {
                    setLocationId(l.value);
                    setStack([]);
                    setSearch("");
                    setLocOpen(false);
                }} className={(0, react_1.cn)("flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted", isActive && "font-medium text-foreground")}>
                        <span className="truncate">{String(l.label)}</span>
                        {isActive && (<span className="text-xs text-muted-foreground">
                            ✓
                          </span>)}
                      </button>
                    </li>);
        })}
              </ul>
            </react_1.PopoverContent>
          </react_1.Popover>
          {breadcrumb.map(function (row, i) { return (<span key={row.id} className="flex items-center gap-0.5">
              <lu_1.LuChevronRight className="h-3 w-3 text-muted-foreground/60"/>
              <button type="button" onClick={function () { return setStack(stack.slice(0, i + 1)); }} className={(0, react_1.cn)("rounded px-1.5 py-0.5 text-xs hover:bg-muted", i === breadcrumb.length - 1
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground")}>
                {row.name}
              </button>
            </span>); })}
        </div>

        {/* Search — flush, no chrome. */}
        <react_1.Input autoFocus value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Search storage units\u2026"], ["Search storage units\u2026"])))} className="h-9 rounded-none border-none border-b border-border bg-transparent px-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"/>

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
var StorageUnitValuePicker = (0, react_2.memo)(StorageUnitValuePickerImpl);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
