"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleRow = ToggleRow;
var react_1 = require("@carbon/react");
/** A label + small switch row, shared across the block config panels. */
function ToggleRow(_a) {
    var label = _a.label, checked = _a.checked, onChange = _a.onChange;
    return (<div className="flex items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <react_1.Switch variant="small" checked={checked} onCheckedChange={function (value) { return onChange(Boolean(value)); }}/>
    </div>);
}
