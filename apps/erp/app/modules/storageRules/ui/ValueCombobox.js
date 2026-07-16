"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValueCombobox;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
/**
 * Single-select autocomplete for a rule condition value. Visually mirrors
 * `FieldCombobox` and `OperatorCombobox` (chevron trigger, popover list).
 *
 * Plain `<ul>` + filtered render — no cmdk wrapper. cmdk's internal value /
 * filter state was the source of an empty-state flash when async-loaded
 * options arrived after mount. Driving rendering directly off local state
 * removes the race entirely.
 */
function ValueCombobox(_a) {
    var _b, _c;
    var value = _a.value, onChange = _a.onChange, options = _a.options, placeholder = _a.placeholder, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_2.useState)(false), open = _d[0], setOpen = _d[1];
    var _e = (0, react_2.useState)(""), search = _e[0], setSearch = _e[1];
    var inputRef = (0, react_2.useRef)(null);
    // Reset search every time the popover opens; auto-focus the input.
    (0, react_2.useEffect)(function () {
        if (!open)
            return;
        setSearch("");
        var id = requestAnimationFrame(function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); });
        return function () { return cancelAnimationFrame(id); };
    }, [open]);
    var selected = (0, react_2.useMemo)(function () { return options.find(function (o) { return o.value === value; }); }, [options, value]);
    var filtered = (0, react_2.useMemo)(function () {
        if (!search)
            return options;
        var q = search.toLowerCase();
        return options.filter(function (o) {
            return o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q);
        });
    }, [options, search]);
    return (<react_1.Popover open={open} onOpenChange={setOpen}>
      <react_1.PopoverTrigger asChild>
        <react_1.CommandTrigger size="md" role="combobox" aria-expanded={open} icon={<lu_1.LuChevronDown className="h-4 w-4 shrink-0 opacity-50"/>} className={(0, react_1.cn)("w-full", !selected && "text-muted-foreground", className)} onClick={function () { return setOpen(true); }}>
          <div className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <div className="truncate">
              {(_c = (_b = selected === null || selected === void 0 ? void 0 : selected.label) !== null && _b !== void 0 ? _b : placeholder) !== null && _c !== void 0 ? _c : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select value"], ["Select value"])))}
            </div>
          </div>
        </react_1.CommandTrigger>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" onWheel={function (e) { return e.stopPropagation(); }} onTouchMove={function (e) { return e.stopPropagation(); }} className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 h-10">
          <lu_1.LuSearch className="size-4 shrink-0 text-muted-foreground"/>
          <input ref={inputRef} type="text" value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search..."], ["Search..."])))} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/>
        </div>
        <div className="max-h-[280px] overflow-y-auto overscroll-contain p-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" onWheel={function (e) { return e.stopPropagation(); }}>
          {filtered.length === 0 ? (<div className="py-6 text-center text-sm text-muted-foreground">
              {options.length === 0 ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["No values available"], ["No values available"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["No matches"], ["No matches"])))}
            </div>) : (<ul className="flex flex-col">
              {filtered.map(function (opt) {
                var isSelected = value === opt.value;
                return (<li key={opt.value}>
                    <button type="button" role="option" aria-selected={isSelected} onClick={function () {
                        onChange(opt.value);
                        setSearch("");
                        setOpen(false);
                    }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none">
                      <span className="flex min-w-0 flex-1 truncate">
                        {opt.label}
                      </span>
                      <lu_1.LuCheck className={(0, react_1.cn)("h-4 w-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")}/>
                    </button>
                  </li>);
            })}
            </ul>)}
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
