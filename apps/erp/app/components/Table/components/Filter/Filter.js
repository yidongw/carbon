"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var io_1 = require("react-icons/io");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var useFilters_1 = require("./useFilters");
var Filter = (0, react_2.forwardRef)(function (_a, ref) {
    var filters = _a.filters, _b = _a.trigger, trigger = _b === void 0 ? "button" : _b, props = __rest(_a, ["filters", "trigger"]);
    var _c = (0, macro_1.useLingui)(), t = _c.t, i18n = _c.i18n;
    var _d = (0, useFilters_1.useFilters)(), clearFilters = _d.clearFilters, getFilter = _d.getFilter, hasFilter = _d.hasFilter, hasFilters = _d.hasFilters, hasFilterKey = _d.hasFilterKey, toggleFilter = _d.toggleFilter;
    var _e = (0, react_2.useState)(false), open = _e[0], setOpen = _e[1];
    var _f = (0, react_2.useState)(""), input = _f[0], setInput = _f[1];
    var _g = (0, react_2.useState)(false), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_2.useState)(null), activeFilter = _h[0], setActiveFilter = _h[1];
    var _j = (0, react_2.useState)([]), activeOptions = _j[0], setActiveOptions = _j[1];
    // reset the state when the filter
    (0, react_2.useEffect)(function () {
        if (!open) {
            setInput("");
            setActiveOptions([]);
            setActiveFilter(null);
        }
    }, [open]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((activeFilter === null || activeFilter === void 0 ? void 0 : activeFilter.filter.type) === "fetcher" &&
            fetcher.data !== null &&
            typeof fetcher.data === "object" &&
            "data" in fetcher.data) {
            setActiveOptions(activeFilter.filter.transform
                ? activeFilter.filter.transform(fetcher.data.data)
                : ((_b = (_a = fetcher.data.data) === null || _a === void 0 ? void 0 : _a.map(function (d) { return ({
                    label: d.name,
                    value: d.id
                }); })) !== null && _b !== void 0 ? _b : []));
            setLoading(false);
        }
    }, [fetcher.data, activeFilter]);
    var translate = (0, react_2.useCallback)(function (value) { return i18n._(value); }, [i18n]);
    var columnFilters = (0, react_2.useMemo)(function () {
        return filters.map(function (f) { return ({
            value: f.accessorKey,
            label: translate(f.header),
            icon: f.icon
        }); });
    }, [filters, translate]);
    var availableFilters = (0, react_2.useMemo)(function () { return columnFilters.filter(function (column) { return !hasFilterKey(column.value); }); }, [columnFilters, hasFilterKey]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var activate = (0, react_2.useCallback)(function (filter) {
        setInput("");
        setActiveFilter(filter);
        if (filter.filter.type === "static") {
            setActiveOptions(filter.filter.options);
        }
        else if (filter.filter.type === "fetcher") {
            setLoading(true);
            fetcher.load(filter.filter.endpoint);
        }
        else if (filter.filter.type === "custom") {
            setActiveOptions([]);
        }
    }, []);
    var updateActiveOptions = (0, react_2.useCallback)(function (value) {
        var _a, _b;
        var accessorKey = (_b = (_a = value.split(":")) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : "";
        var filter = filters.find(function (f) { return f.accessorKey.toLowerCase() === accessorKey.toLowerCase(); });
        if (!filter)
            throw new Error("Filter not found for accessorKey: ".concat(accessorKey));
        activate(filter);
    }, [filters, activate]);
    // Skip the one-item column picker when only one filter is available.
    (0, react_2.useEffect)(function () {
        if (!open || activeFilter !== null)
            return;
        if (availableFilters.length !== 1)
            return;
        var filter = filters.find(function (f) { return f.accessorKey === availableFilters[0].value; });
        if (filter)
            activate(filter);
    }, [open, activeFilter, availableFilters, filters, activate]);
    return hasFilters && !open && trigger !== "icon" ? (<react_1.HStack>
        <react_1.Button rightIcon={<lu_1.LuX />} ref={ref} variant="secondary" onClick={clearFilters} className={"!border-dashed border-border"} {...props}>
          <macro_1.Trans>Clear Filters</macro_1.Trans>
        </react_1.Button>
      </react_1.HStack>) : (<react_1.Popover open={open} onOpenChange={setOpen}>
        <react_1.PopoverTrigger asChild>
          {trigger === "icon" ? (<react_1.Button aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Remove filter"], ["Remove filter"])))} className="px-1 w-6" variant="secondary" size="sm" onClick={function () {
                setOpen(true);
            }}>
              <io_1.IoMdAdd />
            </react_1.Button>) : (<react_1.Button rightIcon={<lu_1.LuListFilter />} role="combobox" ref={ref} variant="secondary" onClick={function () {
                setOpen(true);
            }} className={"!border-dashed border-border"} {...props}>
              <macro_1.Trans>Filter</macro_1.Trans>
            </react_1.Button>)}
        </react_1.PopoverTrigger>
        <react_1.PopoverContent align="start" className="min-w-[var(--radix-popover-trigger-width)] p-0">
          {(activeFilter === null || activeFilter === void 0 ? void 0 : activeFilter.filter.type) === "custom" ? (<div className="w-auto min-w-[280px] p-2">
              {activeFilter.filter.render({
                values: getFilter(activeFilter.accessorKey),
                toggle: function (value) {
                    return toggleFilter(activeFilter.accessorKey, value, activeFilter.filter.type === "custom"
                        ? activeFilter.filter.isArray
                        : false);
                },
                close: function () { return setOpen(false); }
            })}
            </div>) : (<react_1.Command>
              <react_1.CommandInput value={input} onValueChange={setInput} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
              <react_1.CommandEmpty>
                {loading ? (<macro_1.Trans>Loading...</macro_1.Trans>) : (<macro_1.Trans>No available filters</macro_1.Trans>)}
              </react_1.CommandEmpty>
              {activeFilter === null ? (<react_1.CommandGroup>
                  {availableFilters.map(function (option) { return (<react_1.CommandItem key={option.value} value={"".concat(option.label, ":").concat(option.value).replace(/"/g, '\\"')} onSelect={updateActiveOptions} className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </react_1.CommandItem>); })}
                </react_1.CommandGroup>) : (<div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent">
                  <react_1.CommandGroup>
                    {activeOptions.map(function (option) {
                    var isChecked = hasFilter(activeFilter.accessorKey, option.value);
                    return (<react_1.CommandItem value={(0, react_1.reactNodeToString)(option.label).replace(/"/g, '\\"')} key={option.value} onSelect={function () {
                            toggleFilter(activeFilter.accessorKey, option.value, activeFilter.filter.isArray);
                            setInput("");
                        }}>
                          <react_1.HStack spacing={2}>
                            <react_1.Checkbox isChecked={isChecked} tabIndex={-1}/>
                            <react_1.VStack spacing={0}>
                              <span>{option.label}</span>
                              {option.helperText && (<p className="text-xs text-muted-foreground truncate">
                                  {translate(option.helperText)}
                                </p>)}
                            </react_1.VStack>
                          </react_1.HStack>
                        </react_1.CommandItem>);
                })}
                  </react_1.CommandGroup>
                </div>)}
            </react_1.Command>)}
        </react_1.PopoverContent>
      </react_1.Popover>);
});
Filter.displayName = "Filter";
exports.default = Filter;
var templateObject_1, templateObject_2;
