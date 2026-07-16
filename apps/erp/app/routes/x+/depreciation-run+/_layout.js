"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.default = DepreciationRunLayout;
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Depreciation Run" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: "Accounting",
    to: path_1.path.to.depreciationRuns,
    module: "accounting"
};
function DepreciationRunLayout() {
    return <react_router_1.Outlet />;
}
