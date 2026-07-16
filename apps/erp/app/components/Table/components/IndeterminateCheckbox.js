"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var IndeterminateCheckbox = function (_a) {
    var indeterminate = _a.indeterminate, checked = _a.checked, onChange = _a.onChange, rest = __rest(_a, ["indeterminate", "checked", "onChange"]);
    var handleChange = function (checked) {
        onChange({
            target: { checked: checked }
        });
    };
    return (<react_1.Checkbox isChecked={!!checked || !!indeterminate} isIndeterminate={indeterminate} className="ml-2 left-0 sticky z-[1]" onCheckedChange={handleChange} {...rest}>
      <span className="sr-only">
        <macro_1.Trans>Select Row</macro_1.Trans>
      </span>
    </react_1.Checkbox>);
};
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";
exports.default = IndeterminateCheckbox;
