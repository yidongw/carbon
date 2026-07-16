"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.default = IssueWorkflowRoute;
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Issue Workflows" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quality"], ["Quality"]))),
    to: path_1.path.to.qualityDashboard,
    module: "quality"
};
function IssueWorkflowRoute() {
    return <react_router_1.Outlet />;
}
var templateObject_1;
