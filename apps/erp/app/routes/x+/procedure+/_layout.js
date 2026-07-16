"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.default = ProcedureRoute;
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Procedure" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Production"], ["Production"]))),
    to: path_1.path.to.productionDashboard,
    module: "production"
};
function ProcedureRoute() {
    return <react_router_1.Outlet />;
}
var templateObject_1;
