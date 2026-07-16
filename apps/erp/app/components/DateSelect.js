"use strict";
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
exports.DateSelect = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var defaultOptions = [
    { value: "week", label: "7D" },
    { value: "month", label: "30D" },
    { value: "quarter", label: "90D" },
    { value: "year", label: "1Y" }
];
var DateSelect = (0, react_2.forwardRef)(function (_a, ref) {
    var value = _a.value, onValueChange = _a.onValueChange, _b = _a.options, options = _b === void 0 ? defaultOptions : _b, _c = _a.showCustom, showCustom = _c === void 0 ? true : _c, dateRange = _a.dateRange, onDateRangeChange = _a.onDateRangeChange, className = _a.className;
    var allOptions = (0, react_2.useMemo)(function () {
        if (!showCustom)
            return options;
        return __spreadArray(__spreadArray([], options, true), [{ value: "custom", label: "Custom" }], false);
    }, [options, showCustom]);
    return (<div ref={ref} className={(0, react_1.cn)("inline-flex items-center gap-2", className)}>
        {/* Compact dropdown for small screens */}
        <react_1.Select value={value} onValueChange={onValueChange}>
          <react_1.SelectTrigger className="md:hidden w-auto h-8 text-xs">
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            {allOptions.map(function (option) { return (<react_1.SelectItem key={option.value} value={option.value}>
                {option.label}
              </react_1.SelectItem>); })}
          </react_1.SelectContent>
        </react_1.Select>

        {/* Segmented control for md+ screens */}
        <react_1.ToggleGroup type="single" value={value} onValueChange={function (v) {
            if (v)
                onValueChange(v);
        }} className="hidden md:inline-flex gap-0 rounded-full border border-border bg-muted p-0.5 shadow-sm">
          {options.map(function (option) { return (<react_1.ToggleGroupItem key={option.value} value={option.value} className={(0, react_1.cn)("h-7 rounded-full px-3 text-xs font-medium", "bg-transparent text-muted-foreground", "hover:bg-active hover:text-active-foreground hover:data-[state=on]:bg-active", "data-[state=on]:bg-active data-[state=on]:text-active-foreground data-[state=on]:shadow-sm", "transition-all duration-200")}>
              {option.label}
            </react_1.ToggleGroupItem>); })}
          {showCustom && (<react_1.ToggleGroupItem value="custom" className={(0, react_1.cn)("h-7 w-7 rounded-full p-0", "bg-transparent text-muted-foreground", "hover:bg-active hover:text-active-foreground", "data-[state=on]:bg-active data-[state=on]:text-active-foreground data-[state=on]:shadow-sm", "transition-all duration-200")}>
              <lu_1.LuCalendar className="size-3.5"/>
            </react_1.ToggleGroupItem>)}
        </react_1.ToggleGroup>

        {value === "custom" && onDateRangeChange && (<react_1.DateRangePicker value={dateRange} onChange={onDateRangeChange} size="sm"/>)}
      </div>);
});
exports.DateSelect = DateSelect;
DateSelect.displayName = "DateSelect";
