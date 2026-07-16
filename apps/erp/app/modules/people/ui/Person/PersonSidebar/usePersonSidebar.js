"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePersonSidebar = usePersonSidebar;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function usePersonSidebar(attributeCategories, timeCardEnabled) {
    var t = (0, macro_1.useLingui)().t;
    var baseLinks = __spreadArray([
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Profile"], ["Profile"]))),
            to: "details",
            icon: <lu_1.LuUser />
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Job"], ["Job"]))),
            to: "job",
            icon: <lu_1.LuHardHat />
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Notes"], ["Notes"]))),
            to: "notes",
            icon: <lu_1.LuStickyNote />
        }
    ], (timeCardEnabled
        ? [
            {
                name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Timecards"], ["Timecards"]))),
                to: "timecard",
                icon: <lu_1.LuClock />
            }
        ]
        : []), true);
    var categoryLinks = attributeCategories.map(function (category) {
        var _a;
        return ({
            name: (_a = category.name) !== null && _a !== void 0 ? _a : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Attributes"], ["Attributes"]))),
            to: "attributes/".concat(category.id),
            icon: category.emoji ? (<span className="text-base">{category.emoji}</span>) : (<lu_1.LuList />)
        });
    });
    return __spreadArray(__spreadArray([], baseLinks, true), categoryLinks, true);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
