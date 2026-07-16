"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Filter_1 = require("./Filter");
var useFilters_1 = require("./useFilters");
var ActiveFilters = function (_a) {
    var filters = _a.filters;
    var urlFiltersParams = (0, useFilters_1.useFilters)().urlFiltersParams;
    return (<react_1.HStack spacing={2}>
      {urlFiltersParams.map(function (f) {
            var _a = f.split(":"), key = _a[0], operator = _a[1], value = _a[2];
            var columnFilter = filters.find(function (f) { return f.accessorKey === key; });
            if (!columnFilter)
                return null;
            return (<ActiveFilter key={key} filter={columnFilter} operator={operator} value={value}/>);
        })}
      {urlFiltersParams.length > 0 && (<Filter_1.default filters={filters} trigger="icon"/>)}
    </react_1.HStack>);
};
var ActiveFilter = function (_a) {
    var _b;
    var filter = _a.filter, operator = _a.operator, value = _a.value;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, useFilters_1.useFilters)(), hasFilter = _c.hasFilter, removeKey = _c.removeKey, toggleFilter = _c.toggleFilter;
    var _d = (0, react_2.useState)(false), open = _d[0], setOpen = _d[1];
    var _e = (0, react_2.useState)(""), input = _e[0], setInput = _e[1];
    var _f = (0, react_2.useState)(false), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_2.useState)(filter.filter.type === "static" ? filter.filter.options : []), options = _g[0], setOptions = _g[1];
    (0, react_2.useEffect)(function () {
        if (filter.filter.type === "static") {
            setOptions(filter.filter.options);
        }
    }, [filter.filter]);
    (0, react_2.useEffect)(function () {
        if (!open) {
            setInput("");
        }
    }, [open]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        if (filter.filter.type === "fetcher") {
            setLoading(true);
            fetcher.load(filter.filter.endpoint);
        }
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (filter.filter.type === "fetcher" &&
            fetcher.data !== null &&
            typeof fetcher.data === "object" &&
            "data" in fetcher.data) {
            setOptions(filter.filter.transform
                ? filter.filter.transform(fetcher.data.data)
                : ((_b = (_a = fetcher.data.data) === null || _a === void 0 ? void 0 : _a.map(function (d) { return ({ label: d.name, value: d.id }); })) !== null && _b !== void 0 ? _b : []));
            setLoading(false);
        }
    }, [fetcher.data, filter.filter.type]);
    var makeLabel = function (v) {
        var _a, _b;
        var _c = v.split(","), others = _c.slice(1);
        if (others && others.length > 0) {
            return "".concat(1 + others.length, " ").concat(filter.pluralHeader ? filter.pluralHeader : filter.header + "s");
        }
        else {
            var node = (_b = (_a = options.find(function (o) { return o.value === v; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "";
            return typeof node === "string" ? node : (0, react_1.reactNodeToString)(node);
        }
    };
    return (<react_1.HStack spacing={0}>
      <react_1.Button leftIcon={(_b = filter.icon) !== null && _b !== void 0 ? _b : undefined} className="rounded-r-none before:rounded-r-none" size="sm" variant="secondary">
        {filter.header}
      </react_1.Button>
      <react_1.Button className="rounded-none before:rounded-none border-l-0" size="sm" variant="secondary">
        {operator === "eq"
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["is"], ["is"]))) : operator === "in"
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["is any of"], ["is any of"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["matches"], ["matches"])))}
      </react_1.Button>
      <react_1.Popover open={open} onOpenChange={setOpen}>
        <react_1.PopoverTrigger asChild>
          <react_1.Button className="rounded-none before:rounded-none" role="combobox" variant="secondary" onClick={function () {
            setOpen(true);
        }} size="sm">
            {makeLabel(value)}
          </react_1.Button>
        </react_1.PopoverTrigger>
        <react_1.PopoverContent className="min-w-[200px] w-[var(--radix-popover-trigger-width)] p-0" sticky="always">
          <react_1.Command>
            <react_1.CommandInput value={input} onValueChange={setInput} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
            <react_1.CommandEmpty>
              {loading ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Loading..."], ["Loading..."]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No options found."], ["No options found."])))}
            </react_1.CommandEmpty>
            <react_1.CommandGroup>
              {options.map(function (option) {
            var isChecked = hasFilter(filter.accessorKey, option.value);
            return (<react_1.CommandItem value={(0, react_1.reactNodeToString)(option.label).replace(/"/g, '\\"')} key={option.value} onSelect={function () {
                    toggleFilter(filter.accessorKey, option.value, filter.filter.isArray);
                    setOpen(false);
                }}>
                    <react_1.HStack spacing={2}>
                      <react_1.Checkbox id={option.value} isChecked={isChecked}/>
                      <label htmlFor={option.value}>{option.label}</label>
                    </react_1.HStack>
                  </react_1.CommandItem>);
        })}
            </react_1.CommandGroup>
          </react_1.Command>
        </react_1.PopoverContent>
      </react_1.Popover>
      <react_1.Button aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Remove filter"], ["Remove filter"])))} className="rounded-l-none before:rounded-l-none border-l-0 px-1 w-6" size="sm" variant="secondary" onClick={function () {
            removeKey(filter.accessorKey);
        }}>
        <lu_1.LuX />
      </react_1.Button>
    </react_1.HStack>);
};
exports.default = ActiveFilters;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
