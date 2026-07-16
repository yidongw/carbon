"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceCardGroup = ChoiceCardGroup;
var react_1 = require("@carbon/react");
/**
 * A reusable card-style radio group, generic over a string-enum value type.
 *
 * Mirrors shadcn/ui's choice card pattern: the radio indicator stays
 * visible on the right edge of each card, and the card's selected state
 * is driven by a CSS `:has([data-state=checked])` selector on the label.
 * No JavaScript-level "is this selected?" comparison is needed — Radix
 * flips `data-state="checked"` on the `RadioGroupItem` when selection
 * changes, and Tailwind's `has-[]` variant picks that up automatically.
 *
 * Cards are stacked vertically by design — each card is a full-width
 * row so the title and description have room to breathe. If you need a
 * grid, wrap the component in one at the call site.
 *
 * Generic over `V extends string` so callers can pass a tighter union
 * than `string` (e.g. `"all" | "item" | "category"`) and have `onChange`
 * infer the same type. Pure controlled component — callers own the state.
 */
function ChoiceCardGroup(_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, options = _a.options, className = _a.className;
    return (<div className={(0, react_1.cn)("space-y-2 w-full", className)}>
      {label && (<span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>)}
      <react_1.RadioGroup value={value} onValueChange={function (v) { return onChange(v); }} className="flex flex-col gap-2">
        {options.map(function (opt) {
            var inputId = "choice-".concat(opt.value);
            return (<label key={opt.value} htmlFor={inputId} className={(0, react_1.cn)("flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors", "hover:bg-accent/40", "has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5", "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", opt.disabled && "cursor-not-allowed opacity-50")}>
              {opt.icon && (<span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground mt-0.5">
                  {opt.icon}
                </span>)}
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-medium">{opt.title}</span>
                {opt.description && (<span className="text-xs text-muted-foreground leading-snug">
                    {opt.description}
                  </span>)}
              </div>
              <react_1.RadioGroupItem id={inputId} value={opt.value} disabled={opt.disabled} className="mt-1 flex-shrink-0"/>
            </label>);
        })}
      </react_1.RadioGroup>
    </div>);
}
