"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useAccountSubmodules;
var macro_1 = require("@lingui/react/macro");
var cg_1 = require("react-icons/cg");
var path_1 = require("~/utils/path");
function useAccountSubmodules() {
    var t = (0, macro_1.useLingui)().t;
    var accountRoutes = [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Profile"], ["Profile"]))),
            to: path_1.path.to.profile,
            icon: <cg_1.CgProfile />
        }
    ];
    return { links: accountRoutes };
}
var templateObject_1;
