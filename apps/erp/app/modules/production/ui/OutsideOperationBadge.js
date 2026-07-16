"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutsideOperationBadge = OutsideOperationBadge;
var macro_1 = require("@lingui/react/macro");
/** Outside op pill for BOP cards — plain span so parent truncate cannot collapse it. */
function OutsideOperationBadge() {
    var t = (0, macro_1.useLingui)().t;
    return (<span className="inline-flex shrink-0 items-center rounded-md bg-primary px-2 min-h-5 text-[11px] font-bold uppercase tracking-tight text-primary-foreground shadow-sm whitespace-nowrap">
      {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Outside"], ["Outside"])))}
    </span>);
}
var templateObject_1;
