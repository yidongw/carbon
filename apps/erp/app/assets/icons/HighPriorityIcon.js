"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighPriorityIcon = HighPriorityIcon;
var macro_1 = require("@lingui/react/macro");
function HighPriorityIcon(_a) {
    var className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    return (<svg aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["High Priority"], ["High Priority"])))} className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" role="img" focusable="false">
      <rect x="1.5" y="8" width="3" height="6" rx="1"></rect>
      <rect x="6.5" y="5" width="3" height="9" rx="1"></rect>
      <rect x="11.5" y="2" width="3" height="12" rx="1"></rect>
    </svg>);
}
var templateObject_1;
