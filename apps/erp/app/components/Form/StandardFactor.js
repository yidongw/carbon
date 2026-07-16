"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var shared_1 = require("~/modules/shared");
var StandardFactor = function (_a) {
    var label = _a.label, hint = _a.hint, props = __rest(_a, ["label", "hint"]);
    var t = (0, macro_1.useLingui)().t;
    var translateStandardFactorType = function (v) {
        switch (v) {
            case "Hours/Piece":
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Hours/Piece"], ["Hours/Piece"])));
            case "Hours/100 Pieces":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Hours/100 Pieces"], ["Hours/100 Pieces"])));
            case "Hours/1000 Pieces":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Hours/1000 Pieces"], ["Hours/1000 Pieces"])));
            case "Minutes/Piece":
                return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Minutes/Piece"], ["Minutes/Piece"])));
            case "Minutes/100 Pieces":
                return t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Minutes/100 Pieces"], ["Minutes/100 Pieces"])));
            case "Minutes/1000 Pieces":
                return t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Minutes/1000 Pieces"], ["Minutes/1000 Pieces"])));
            case "Pieces/Hour":
                return t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Pieces/Hour"], ["Pieces/Hour"])));
            case "Pieces/Minute":
                return t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Pieces/Minute"], ["Pieces/Minute"])));
            case "Seconds/Piece":
                return t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Seconds/Piece"], ["Seconds/Piece"])));
            case "Total Hours":
                return t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Total Hours"], ["Total Hours"])));
            case "Total Minutes":
                return t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Total Minutes"], ["Total Minutes"])));
            default:
                return v;
        }
    };
    var options = shared_1.standardFactorType
        .filter(function (type) {
        if (hint === "Fixed") {
            return ["Total Hours", "Total Minutes"].includes(type);
        }
        else if (hint === "Per Unit") {
            return !["Total Hours", "Total Minutes"].includes(type);
        }
        else {
            return true;
        }
    })
        .map(function (type) { return ({ value: type, label: translateStandardFactorType(type) }); });
    return (<form_1.SelectControlled {...props} label={label !== null && label !== void 0 ? label : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Default Unit"], ["Default Unit"])))} options={options}/>);
};
exports.default = StandardFactor;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
