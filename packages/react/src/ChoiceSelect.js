"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceSelect = ChoiceSelect;
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Checkbox_1 = require("./Checkbox");
var Popover_1 = require("./Popover");
var Select_1 = require("./Select");
var cn_1 = require("./utils/cn");
function ChoiceSelect(props) {
    if (props.multiple) {
        return <ChoiceSelectMulti {...props}/>;
    }
    return <ChoiceSelectSingle {...props}/>;
}
function ChoiceSelectSingle(_a) {
    var value = _a.value, onChange = _a.onChange, options = _a.options, placeholder = _a.placeholder, disabled = _a.disabled, className = _a.className, _b = _a.align, align = _b === void 0 ? "start" : _b, ariaLabel = _a["aria-label"];
    var selected = options.find(function (o) { return o.value === value; });
    return (<Select_1.Select value={value} onValueChange={function (v) { return onChange(v); }} disabled={disabled}>
      {/* The trigger renders a div (not a span) so SelectTrigger's
            `[&>span]:line-clamp-1` rule doesn't kick in and turn the inline
            icon+title row into a block. */}
      <Select_1.SelectTrigger className={className} aria-label={ariaLabel}>
        {selected ? (<div className="flex items-center gap-2 min-w-0 flex-1 text-left">
            {selected.icon && (<span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-muted-foreground">
                {selected.icon}
              </span>)}
            <span className="text-sm font-medium truncate">
              {selected.title}
            </span>
          </div>) : (<Select_1.SelectValue placeholder={placeholder}/>)}
      </Select_1.SelectTrigger>
      <Select_1.SelectContent align={align} className="min-w-[var(--radix-select-trigger-width)] w-auto">
        {options.map(function (opt) { return (<Select_1.SelectItem key={opt.value} value={opt.value} disabled={opt.disabled} className="py-2 pr-8">
            <span className={(0, cn_1.cn)("flex gap-3", opt.description ? "items-start" : "items-center")}>
              {opt.icon && (<span className={(0, cn_1.cn)("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground", opt.description && "mt-0.5")}>
                  {opt.icon}
                </span>)}
              <span className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium">{opt.title}</span>
                {opt.description && (<span className="text-xs text-muted-foreground leading-snug">
                    {opt.description}
                  </span>)}
              </span>
            </span>
          </Select_1.SelectItem>); })}
      </Select_1.SelectContent>
    </Select_1.Select>);
}
function ChoiceSelectMulti(_a) {
    var value = _a.value, onChange = _a.onChange, options = _a.options, placeholder = _a.placeholder, disabled = _a.disabled, className = _a.className, _b = _a.align, align = _b === void 0 ? "start" : _b, ariaLabel = _a["aria-label"];
    var _c = (0, react_1.useState)(false), open = _c[0], setOpen = _c[1];
    var selectedSet = new Set(value);
    var selected = options.filter(function (o) { return selectedSet.has(o.value); });
    var toggle = function (v) {
        if (selectedSet.has(v)) {
            onChange(value.filter(function (x) { return x !== v; }));
        }
        else {
            // Preserve canonical ordering from `options`.
            var next = options
                .filter(function (o) { return selectedSet.has(o.value) || o.value === v; })
                .map(function (o) { return o.value; });
            onChange(next);
        }
    };
    return (<Popover_1.Popover open={open} onOpenChange={setOpen}>
      <Popover_1.PopoverTrigger asChild>
        <button type="button" role="combobox" aria-expanded={open} aria-label={ariaLabel} disabled={disabled} className={(0, cn_1.cn)("flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm", "hover:bg-accent/40", "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50", "disabled:cursor-not-allowed disabled:opacity-50", selected.length === 0 && "text-muted-foreground", className)}>
          {selected.length > 0 ? (<div className="flex min-w-0 flex-1 items-center gap-2 text-left">
              {selected[0].icon && (<div className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
                  {selected[0].icon}
                </div>)}
              <div className="truncate text-sm font-medium">
                {selected.length === 1
                ? selected[0].title
                : "".concat(selected[0].title, " +").concat(selected.length - 1)}
              </div>
            </div>) : (<span className="truncate">{placeholder}</span>)}
          <lu_1.LuChevronDown className="h-4 w-4 shrink-0 opacity-50"/>
        </button>
      </Popover_1.PopoverTrigger>
      <Popover_1.PopoverContent align={align} onWheel={function (e) { return e.stopPropagation(); }} onTouchMove={function (e) { return e.stopPropagation(); }} className="min-w-[var(--radix-popover-trigger-width)] w-auto p-1">
        <ul className="flex flex-col">
          {options.map(function (opt) {
            var isSelected = selectedSet.has(opt.value);
            return (<li key={opt.value}>
                <button type="button" role="option" aria-selected={isSelected} disabled={opt.disabled} onClick={function () { return toggle(opt.value); }} className={(0, cn_1.cn)("flex w-full gap-3 rounded-md px-2 py-2 text-left", opt.description ? "items-start" : "items-center", "hover:bg-accent focus-visible:bg-accent focus-visible:outline-none", opt.disabled && "cursor-not-allowed opacity-50")}>
                  {opt.icon && (<span className={(0, cn_1.cn)("flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground", opt.description && "mt-0.5")}>
                      {opt.icon}
                    </span>)}
                  <span className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium">{opt.title}</span>
                    {opt.description && (<span className="text-xs text-muted-foreground leading-snug">
                        {opt.description}
                      </span>)}
                  </span>
                  <Checkbox_1.Checkbox isChecked={isSelected} disabled={opt.disabled} className={(0, cn_1.cn)("shrink-0 pointer-events-none", opt.description && "mt-1")} tabIndex={-1}/>
                  <lu_1.LuCheck className="hidden" aria-hidden/>
                </button>
              </li>);
        })}
        </ul>
      </Popover_1.PopoverContent>
    </Popover_1.Popover>);
}
