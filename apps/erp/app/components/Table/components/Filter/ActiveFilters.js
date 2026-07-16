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
var query_1 = require("~/utils/query");
var Filter_1 = require("./Filter");
var useFilters_1 = require("./useFilters");
function getCurrentValues(value, isArray) {
    if (!value)
        return [];
    return isArray ? value.split(",") : [value];
}
var ActiveFilters = function (_a) {
    var filters = _a.filters;
    var _b = (0, useFilters_1.useFilters)(), urlFiltersParams = _b.urlFiltersParams, hasFilterKey = _b.hasFilterKey;
    var hasMoreToApply = filters.some(function (f) { return !hasFilterKey(f.accessorKey); });
    return (<react_1.HStack spacing={2} className="flex-nowrap">
      {urlFiltersParams.map(function (param) {
            var parsed = (0, query_1.parseFilterParam)(param);
            if (!parsed)
                return null;
            var columnFilter = filters.find(function (f) { return f.accessorKey === parsed.column; });
            if (!columnFilter)
                return null;
            return (<ActiveFilter key={"".concat(parsed.column, ":").concat(param)} filter={columnFilter} operator={parsed.operator} value={parsed.value}/>);
        })}
      {urlFiltersParams.length > 0 && hasMoreToApply && (<Filter_1.default filters={filters} trigger="icon"/>)}
    </react_1.HStack>);
};
var ActiveFilter = function (_a) {
    var _b;
    var filter = _a.filter, operator = _a.operator, value = _a.value;
    var _c = (0, macro_1.useLingui)(), t = _c.t, i18n = _c.i18n;
    var _d = (0, useFilters_1.useFilters)(), hasFilter = _d.hasFilter, removeKey = _d.removeKey, toggleFilter = _d.toggleFilter;
    var _e = (0, react_2.useState)(false), open = _e[0], setOpen = _e[1];
    var _f = (0, react_2.useState)(""), input = _f[0], setInput = _f[1];
    var _g = (0, react_2.useState)(false), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_2.useState)(filter.filter.type === "static" ? filter.filter.options : []), options = _h[0], setOptions = _h[1];
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
        var values = v.split(",");
        if (values.length > 1) {
            var labels = values.map(function (val) {
                var _a, _b;
                var node = (_b = (_a = options.find(function (o) { return o.value === val; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "";
                return typeof node === "string"
                    ? translate(node)
                    : (0, react_1.reactNodeToString)(node);
            });
            if (labels.every(Boolean)) {
                return labels.join(", ");
            }
            return "".concat(values.length, " ").concat(filter.pluralHeader
                ? translate(filter.pluralHeader)
                : "".concat(translate(filter.header), "s"));
        }
        if (filter.filter.type === "custom" && filter.filter.getLabel) {
            var node_1 = filter.filter.getLabel(v);
            if (node_1 == null)
                return v;
            return typeof node_1 === "string"
                ? translate(node_1)
                : (0, react_1.reactNodeToString)(node_1);
        }
        var node = (_b = (_a = options.find(function (o) { return o.value === v; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : "";
        var label = typeof node === "string" ? translate(node) : (0, react_1.reactNodeToString)(node);
        return label || v;
    };
    var translate = function (text) { return i18n._(text); };
    return (<react_1.HStack spacing={0} className="shrink-0">
      <react_1.Button leftIcon={(_b = filter.icon) !== null && _b !== void 0 ? _b : undefined} className="rounded-r-none" size="sm" variant="secondary">
        {translate(filter.header)}
      </react_1.Button>
      <react_1.Button className="rounded-none border-l-0" size="sm" variant="secondary">
        {operator === "eq" ? (<macro_1.Trans>is</macro_1.Trans>) : operator === "in" || operator === "contains" ? (<macro_1.Trans>is any of</macro_1.Trans>) : (<macro_1.Trans>matches</macro_1.Trans>)}
      </react_1.Button>
      <react_1.Popover open={open} onOpenChange={setOpen}>
        <react_1.PopoverTrigger asChild>
          <react_1.Button className="rounded-none max-w-[200px]" role="combobox" variant="secondary" onClick={function () {
            setOpen(true);
        }} size="sm">
            <span className="truncate">{makeLabel(value)}</span>
          </react_1.Button>
        </react_1.PopoverTrigger>
        <react_1.PopoverContent align="start" className={filter.filter.type === "custom"
            ? "w-auto p-0"
            : "min-w-[200px] w-[var(--radix-popover-trigger-width)] p-0"} sticky="always">
          {filter.filter.type === "custom" ? (<div className="w-auto min-w-[280px] p-2">
              {filter.filter.render({
                values: getCurrentValues(value, filter.filter.isArray),
                toggle: function (v) {
                    return toggleFilter(filter.accessorKey, v, filter.filter.type === "custom"
                        ? filter.filter.isArray
                        : false);
                },
                close: function () { return setOpen(false); }
            })}
            </div>) : (<react_1.Command>
              <react_1.CommandInput value={input} onValueChange={setInput} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
              <react_1.CommandEmpty>
                {loading ? (<macro_1.Trans>Loading...</macro_1.Trans>) : (<macro_1.Trans>No options found.</macro_1.Trans>)}
              </react_1.CommandEmpty>
              <react_1.CommandGroup>
                {options.map(function (option) {
                var isChecked = hasFilter(filter.accessorKey, option.value);
                return (<react_1.CommandItem value={(0, react_1.reactNodeToString)(option.label).replace(/"/g, '\\"')} key={option.value} onSelect={function () {
                        toggleFilter(filter.accessorKey, option.value, filter.filter.isArray);
                        setInput("");
                    }}>
                      <react_1.HStack spacing={2}>
                        <react_1.Checkbox isChecked={isChecked} tabIndex={-1}/>
                        <span>
                          {typeof option.label === "string"
                        ? translate(option.label)
                        : option.label}
                        </span>
                      </react_1.HStack>
                    </react_1.CommandItem>);
            })}
              </react_1.CommandGroup>
            </react_1.Command>)}
        </react_1.PopoverContent>
      </react_1.Popover>
      <react_1.Button aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Remove filter"], ["Remove filter"])))} className="rounded-l-none border-l-0 px-1 w-6" size="sm" variant="secondary" onClick={function () { return removeKey(filter.accessorKey); }}>
        <lu_1.LuX />
      </react_1.Button>
    </react_1.HStack>);
};
exports.default = ActiveFilters;
var templateObject_1, templateObject_2;
