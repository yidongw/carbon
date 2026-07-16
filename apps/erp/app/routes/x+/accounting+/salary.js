"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.default = SalaryLayout;
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Salary"], ["Salary"]))),
    to: path_1.path.to.accountingSalary,
    module: "accounting"
};
function SalaryLayout() {
    return <react_router_1.Outlet />;
}
var templateObject_1;
