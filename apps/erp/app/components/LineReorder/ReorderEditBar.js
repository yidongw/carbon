"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderEditBar = ReorderEditBar;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
function ReorderEditBar(_a) {
    var isSaving = _a.isSaving, isDirty = _a.isDirty, onSave = _a.onSave, onCancel = _a.onCancel;
    return (<div className="flex gap-1 flex-1">
      <react_1.Button size="sm" variant="ghost" onClick={onCancel} isDisabled={isSaving} className="flex-1 h-8 text-xs">
        <macro_1.Trans>Cancel</macro_1.Trans>
      </react_1.Button>
      <react_1.Button size="sm" variant="primary" onClick={onSave} isDisabled={!isDirty || isSaving} className="flex-1 h-8 text-xs">
        {isSaving ? <macro_1.Trans>Saving...</macro_1.Trans> : <macro_1.Trans>Save</macro_1.Trans>}
      </react_1.Button>
    </div>);
}
