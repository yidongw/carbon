"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorPicker = ColorPicker;
var react_1 = require("@carbon/react");
var react_colorful_1 = require("react-colorful");
/** Preset swatches shown under the picker, Mantine ColorInput style. */
var SWATCHES = [
    "#1f2937",
    "#111827",
    "#374151",
    "#0f172a",
    "#000000",
    "#ffffff",
    "#1e3a8a",
    "#1d4ed8",
    "#2563eb",
    "#0891b2",
    "#059669",
    "#16a34a",
    "#ca8a04",
    "#ea580c",
    "#dc2626",
    "#db2777",
    "#7c3aed",
    "#475569"
];
function ColorPicker(_a) {
    var value = _a.value, onChange = _a.onChange;
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>
        <button type="button" className="flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <span className="size-5 shrink-0 rounded ring-1 ring-inset ring-black/10" style={{ backgroundColor: value }}/>
          <span className="font-mono text-xs uppercase text-foreground">
            {value}
          </span>
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" className="w-[232px] p-3">
        <div className="flex flex-col gap-3">
          <react_colorful_1.HexColorPicker color={value} onChange={onChange} style={{ width: "100%", height: 150 }}/>

          <div className="flex items-center gap-2">
            <span className="size-5 shrink-0 rounded ring-1 ring-inset ring-black/10" style={{ backgroundColor: value }}/>
            <react_colorful_1.HexColorInput prefixed color={value} onChange={onChange} className="h-8 w-full rounded-md border border-input bg-background px-2 font-mono text-xs uppercase outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"/>
          </div>

          <div className="grid grid-cols-9 gap-1.5">
            {SWATCHES.map(function (swatch) { return (<button key={swatch} type="button" aria-label={swatch} onClick={function () { return onChange(swatch); }} className={(0, react_1.cn)("size-5 rounded ring-1 ring-inset ring-black/10 transition-transform hover:scale-110", value.toLowerCase() === swatch && "ring-2 ring-primary")} style={{ backgroundColor: swatch }}/>); })}
          </div>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
