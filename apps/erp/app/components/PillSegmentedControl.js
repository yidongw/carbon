"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PillSegmentedControl = PillSegmentedControl;
var react_1 = require("@carbon/react");
/** Pill-style segmented control matching `DirectionAwareTabs` tab bar styling. */
function PillSegmentedControl(_a) {
    var value = _a.value, onChange = _a.onChange, options = _a.options, className = _a.className, ariaLabel = _a["aria-label"];
    return (<div role="group" aria-label={ariaLabel} className={(0, react_1.cn)("inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1 shadow-inner", className)}>
      {options.map(function (option) { return (<button key={option.value} type="button" aria-pressed={value === option.value} onClick={function () { return onChange(option.value); }} className={(0, react_1.cn)("rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ring-ring", value === option.value
                ? "bg-background text-foreground border border-border shadow-sm"
                : "text-foreground/60 hover:text-foreground/80")}>
          {option.label}
        </button>); })}
    </div>);
}
