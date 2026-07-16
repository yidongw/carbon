"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceListScopeEmpty = PriceListScopeEmpty;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var ScopePicker_1 = require("./ScopePicker");
function PriceListScopeEmpty(_a) {
    var scopeOptions = _a.scopeOptions, value = _a.value, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    return (<components_1.SearchLandingPage icon={lu_1.LuList} heading={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Price Lists"], ["Price Lists"])))} description={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Pick a customer or customer type to view their pricing."], ["Pick a customer or customer type to view their pricing."])))}>
      <div className="flex justify-center [&>[role=combobox]]:!min-w-[400px]">
        <ScopePicker_1.ScopePicker size="md" value={value} options={scopeOptions} onChange={onChange} placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Search customers or types..."], ["Search customers or types..."])))}/>
      </div>
    </components_1.SearchLandingPage>);
}
var templateObject_1, templateObject_2, templateObject_3;
