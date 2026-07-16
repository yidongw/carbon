"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopePicker = ScopePicker;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ScopeIcon = function (_a) {
    var helper = _a.helper, className = _a.className;
    if (helper === "Type")
        return <lu_1.LuUsers className={className}/>;
    return <lu_1.LuSquareUser className={className}/>;
};
function ScopePicker(_a) {
    var value = _a.value, options = _a.options, onChange = _a.onChange, _b = _a.size, size = _b === void 0 ? "sm" : _b, placeholder = _a.placeholder;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)(false), open = _c[0], setOpen = _c[1];
    var select = function (next) {
        onChange(next);
        setOpen(false);
    };
    var _d = (0, react_2.useMemo)(function () {
        var types = [];
        var customers = [];
        var selected;
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var o = options_1[_i];
            if (o.value === value)
                selected = o;
            if (o.helper === "Type")
                types.push(o);
            else if (o.helper === "Customer")
                customers.push(o);
        }
        return { types: types, customers: customers, selected: selected };
    }, [options, value]), types = _d.types, customers = _d.customers, selected = _d.selected;
    return (<react_1.Popover open={open} onOpenChange={setOpen}>
      <react_1.PopoverTrigger asChild>
        <react_1.CommandTrigger asButton size={size} role="combobox" className={(0, react_1.cn)("min-w-[220px] hover:!scale-100 focus-visible:!scale-100", !value && "text-muted-foreground")}>
          {selected ? (<div className="flex items-center gap-2 truncate">
              <ScopeIcon helper={selected.helper} className="size-3.5 shrink-0 text-muted-foreground"/>
              <span className="truncate">{selected.label}</span>
            </div>) : (<span className="text-muted-foreground">
              {placeholder !== null && placeholder !== void 0 ? placeholder : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select scope"], ["Select scope"])))}
            </span>)}
        </react_1.CommandTrigger>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" className="min-w-[var(--radix-popover-trigger-width)] w-[280px] p-0">
        <react_1.Command>
          <react_1.CommandInput placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search customers and types..."], ["Search customers and types..."])))} className="h-9"/>
          <react_1.CommandList className="max-h-[320px]">
            {types.length > 0 && (<react_1.CommandGroup heading={<GroupHeading icon={lu_1.LuUsers} label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Customer Types"], ["Customer Types"])))}/>}>
                {types.map(function (opt) { return (<ScopeItem key={opt.value} option={opt} selected={opt.value === value} onSelect={select}/>); })}
              </react_1.CommandGroup>)}

            {types.length > 0 && customers.length > 0 && (<react_1.CommandSeparator className="my-1"/>)}

            {customers.length > 0 && (<react_1.CommandGroup heading={<GroupHeading icon={lu_1.LuSquareUser} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customers"], ["Customers"])))}/>}>
                {customers.map(function (opt) { return (<ScopeItem key={opt.value} option={opt} selected={opt.value === value} onSelect={select}/>); })}
              </react_1.CommandGroup>)}
          </react_1.CommandList>
        </react_1.Command>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
function GroupHeading(_a) {
    var Icon = _a.icon, label = _a.label;
    return (<span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3"/>
      {label}
    </span>);
}
function ScopeItem(_a) {
    var option = _a.option, selected = _a.selected, onSelect = _a.onSelect;
    return (<react_1.CommandItem value={"".concat(option.label, " ").concat(option.helper, " ").concat(option.value)} onSelect={function () { return onSelect(option.value); }}>
      <span className="flex-1 truncate">{option.label}</span>
      <lu_1.LuCheck className={(0, react_1.cn)("ml-2 size-4", selected ? "opacity-100" : "opacity-0")}/>
    </react_1.CommandItem>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
