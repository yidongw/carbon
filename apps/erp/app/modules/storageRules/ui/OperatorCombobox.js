"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPERATOR_META = void 0;
exports.default = OperatorCombobox;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
exports.OPERATOR_META = {
    eq: {
        title: "equals",
        description: "Exact match",
        icon: <lu_1.LuEqual className="h-3.5 w-3.5"/>,
        symbol: "="
    },
    neq: {
        title: "not equals",
        description: "Anything but this value",
        icon: <lu_1.LuCircleSlash className="h-3.5 w-3.5"/>,
        symbol: "≠"
    },
    in: {
        title: "is one of",
        description: "Match any value in list",
        icon: <lu_1.LuList className="h-3.5 w-3.5"/>,
        symbol: "∈"
    },
    notIn: {
        title: "is none of",
        description: "Match no value in list",
        icon: <lu_1.LuListX className="h-3.5 w-3.5"/>,
        symbol: "∉"
    },
    isSet: {
        title: "is set",
        description: "Field has any value",
        icon: <lu_1.LuSquareDot className="h-3.5 w-3.5"/>,
        symbol: "∃"
    },
    isNotSet: {
        title: "is not set",
        description: "Field is empty",
        icon: <lu_1.LuSquareSlash className="h-3.5 w-3.5"/>,
        symbol: "∄"
    },
    gt: {
        title: "greater than",
        description: "Numeric >",
        icon: <lu_1.LuArrowUp className="h-3.5 w-3.5"/>,
        symbol: ">"
    },
    lt: {
        title: "less than",
        description: "Numeric <",
        icon: <lu_1.LuArrowDown className="h-3.5 w-3.5"/>,
        symbol: "<"
    }
};
function OperatorCombobox(_a) {
    var value = _a.value, onChange = _a.onChange, available = _a.available, disabled = _a.disabled, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var meta = exports.OPERATOR_META[value];
    return (<react_1.Popover open={open} onOpenChange={setOpen}>
      <react_1.PopoverTrigger asChild>
        <react_1.CommandTrigger size="md" role="combobox" aria-expanded={open} disabled={disabled} icon={<lu_1.LuChevronDown className="h-4 w-4 shrink-0 opacity-50"/>} className={(0, react_1.cn)("w-full", className)} onClick={function () { return !disabled && setOpen(true); }}>
          <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground font-mono text-xs">
              {meta.symbol}
            </div>
            <div className="truncate">{meta.title}</div>
          </div>
        </react_1.CommandTrigger>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" onWheel={function (e) { return e.stopPropagation(); }} onTouchMove={function (e) { return e.stopPropagation(); }} className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0">
        <react_1.Command>
          <react_1.CommandInput placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search operators..."], ["Search operators..."])))} className="h-10"/>
          <react_1.CommandList className="max-h-[280px] overflow-y-auto overscroll-contain" onWheel={function (e) { return e.stopPropagation(); }}>
            <react_1.CommandEmpty>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No operators."], ["No operators."])))}</react_1.CommandEmpty>
            <react_1.CommandGroup>
              {available.map(function (op) {
            var m = exports.OPERATOR_META[op];
            return (<react_1.CommandItem key={op} value={"".concat(m.title, " ").concat(m.description)} onSelect={function () {
                    onChange(op);
                    setOpen(false);
                }} className="flex items-center gap-3 px-2 py-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-sm text-muted-foreground">
                      {m.symbol}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">
                        {m.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {m.description}
                      </span>
                    </span>
                    <lu_1.LuCheck className={(0, react_1.cn)("h-4 w-4 shrink-0", value === op ? "opacity-100" : "opacity-0")}/>
                  </react_1.CommandItem>);
        })}
            </react_1.CommandGroup>
          </react_1.CommandList>
        </react_1.Command>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1, templateObject_2;
