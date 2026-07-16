"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FieldCombobox;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var CONTEXT = {
    item: { label: "Item", icon: <lu_1.LuPackage className="h-3.5 w-3.5"/> },
    storage: { label: "Storage unit", icon: <lu_1.LuBox className="h-3.5 w-3.5"/> },
    workCenter: {
        label: "Work center",
        icon: <lu_1.LuBox className="h-3.5 w-3.5"/>
    },
    operation: {
        label: "Operation",
        icon: <lu_1.LuReceipt className="h-3.5 w-3.5"/>
    },
    transaction: {
        label: "Transaction",
        icon: <lu_1.LuReceipt className="h-3.5 w-3.5"/>
    }
};
var CONTEXT_ORDER = [
    "item",
    "storage",
    "workCenter",
    "operation",
    "transaction"
];
function FieldCombobox(_a) {
    var value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, className = _a.className, targetType = _a.targetType, surfaces = _a.surfaces;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var grouped = (0, react_2.useMemo)(function () {
        var map = new Map();
        for (var _i = 0, CONTEXT_ORDER_1 = CONTEXT_ORDER; _i < CONTEXT_ORDER_1.length; _i++) {
            var ctx_1 = CONTEXT_ORDER_1[_i];
            map.set(ctx_1, []);
        }
        var pool = targetType
            ? (0, utils_1.getFieldsForTargetTypeAndSurfaces)(targetType, surfaces !== null && surfaces !== void 0 ? surfaces : [])
            : utils_1.FIELD_REGISTRY;
        for (var _a = 0, pool_1 = pool; _a < pool_1.length; _a++) {
            var f = pool_1[_a];
            map.get(f.context).push(f);
        }
        return map;
    }, [targetType, surfaces]);
    var selected = (0, react_2.useMemo)(function () { return (0, utils_1.getFieldDef)(value); }, [value]);
    var ctx = selected ? CONTEXT[selected.context] : undefined;
    return (<react_1.Popover open={open} onOpenChange={setOpen}>
      <react_1.PopoverTrigger asChild>
        <react_1.CommandTrigger size="md" role="combobox" aria-expanded={open} icon={<lu_1.LuChevronDown className="h-4 w-4 shrink-0 opacity-50"/>} className={(0, react_1.cn)("min-w-[180px] w-full", !selected && "text-muted-foreground", className)} onClick={function () { return setOpen(true); }}>
          {selected && ctx ? (<div className="flex min-w-0 flex-1 items-center gap-2 text-left">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground" title={ctx.label} role="img" aria-label={ctx.label}>
                {ctx.icon}
              </div>
              <div className="truncate text-foreground">{selected.label}</div>
              {selected.description && (<react_1.TooltipProvider delayDuration={200}>
                  <react_1.Tooltip>
                    <react_1.TooltipTrigger asChild>
                      <span role="button" tabIndex={0} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Field info"], ["Field info"])))} className="ml-0.5 inline-flex shrink-0 cursor-help items-center justify-center rounded text-muted-foreground hover:text-foreground" onPointerDown={function (e) { return e.stopPropagation(); }} onClick={function (e) { return e.stopPropagation(); }} onKeyDown={function (e) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}>
                        <lu_1.LuInfo className="h-3.5 w-3.5"/>
                      </span>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent side="top" align="start" sideOffset={6} className="max-w-[32ch] text-xs leading-snug">
                      {selected.description}
                    </react_1.TooltipContent>
                  </react_1.Tooltip>
                </react_1.TooltipProvider>)}
            </div>) : (<div className="truncate">{placeholder !== null && placeholder !== void 0 ? placeholder : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select field"], ["Select field"])))}</div>)}
        </react_1.CommandTrigger>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" onWheel={function (e) { return e.stopPropagation(); }} onTouchMove={function (e) { return e.stopPropagation(); }} className="w-[var(--radix-popover-trigger-width)] min-w-[320px] p-0">
        <react_1.Command>
          <react_1.CommandInput placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Search fields..."], ["Search fields..."])))} className="h-10"/>
          <react_1.CommandList className="max-h-[320px] overflow-y-auto overscroll-contain" onWheel={function (e) { return e.stopPropagation(); }}>
            <react_1.CommandEmpty>{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["No fields found."], ["No fields found."])))}</react_1.CommandEmpty>
            {(function () {
            var visibleCtx = CONTEXT_ORDER.filter(function (k) { var _a; return ((_a = grouped.get(k)) !== null && _a !== void 0 ? _a : []).length > 0; });
            return visibleCtx.map(function (ctxKey, gi) {
                var _a;
                var fields = (_a = grouped.get(ctxKey)) !== null && _a !== void 0 ? _a : [];
                var meta = CONTEXT[ctxKey];
                return (<div key={ctxKey}>
                    {gi > 0 && <react_1.CommandSeparator />}
                    <react_1.CommandGroup heading={<span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {meta.icon}
                          {meta.label}
                        </span>}>
                      {fields.map(function (f) {
                        var _a;
                        var item = (<react_1.CommandItem key={f.path} value={"".concat(meta.label, " ").concat(f.label, " ").concat(f.path, " ").concat((_a = f.description) !== null && _a !== void 0 ? _a : "")} onSelect={function () {
                                onChange(f.path);
                                setOpen(false);
                            }} className="flex items-center gap-2 px-2 py-2">
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-sm font-medium">
                                {f.label}
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {f.path}
                              </span>
                            </span>
                            <lu_1.LuCheck className={(0, react_1.cn)("h-4 w-4 shrink-0", value === f.path ? "opacity-100" : "opacity-0")}/>
                          </react_1.CommandItem>);
                        if (!f.description)
                            return item;
                        return (<react_1.TooltipProvider key={f.path} delayDuration={300}>
                            <react_1.Tooltip>
                              <react_1.TooltipTrigger asChild>{item}</react_1.TooltipTrigger>
                              <react_1.TooltipContent side="right" align="start" sideOffset={8} className="max-w-[28ch] text-xs leading-snug">
                                {f.description}
                              </react_1.TooltipContent>
                            </react_1.Tooltip>
                          </react_1.TooltipProvider>);
                    })}
                    </react_1.CommandGroup>
                  </div>);
            });
        })()}
          </react_1.CommandList>
        </react_1.Command>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
