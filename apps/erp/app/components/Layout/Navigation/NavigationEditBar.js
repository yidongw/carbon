"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationEditBar = NavigationEditBar;
var react_1 = require("@carbon/react");
function NavigationEditBar(_a) {
    var isSaving = _a.isSaving, isDirty = _a.isDirty, onSave = _a.onSave, onCancel = _a.onCancel;
    return (<div className={(0, react_1.cn)("flex gap-1 px-2", "opacity-0 group-data-[state=expanded]:opacity-100", "transition-opacity")}>
      <react_1.Button size="sm" variant="ghost" onClick={onCancel} disabled={isSaving} className="flex-1 h-8 text-xs">
        Cancel
      </react_1.Button>
      <react_1.Button size="sm" variant="primary" onClick={onSave} disabled={!isDirty || isSaving} className="flex-1 h-8 text-xs">
        {isSaving ? "Saving..." : "Save"}
      </react_1.Button>
    </div>);
}
