"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfiguratorDataTypeLabel = useConfiguratorDataTypeLabel;
var macro_1 = require("@lingui/react/macro");
/** Display labels for configuration parameter / batch property data types. */
function useConfiguratorDataTypeLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (type) {
        switch (type) {
            case "text":
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Text"], ["Text"])));
            case "numeric":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Numeric"], ["Numeric"])));
            case "boolean":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Boolean"], ["Boolean"])));
            case "list":
                return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["List"], ["List"])));
            case "material":
                return t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Material"], ["Material"])));
            case "date":
                return t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Date"], ["Date"])));
            default:
                return type;
        }
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
