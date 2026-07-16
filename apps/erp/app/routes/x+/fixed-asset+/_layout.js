"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = exports.meta = void 0;
exports.default = FixedAssetLayout;
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Carbon | Fixed Asset" }];
};
exports.meta = meta;
exports.handle = {
    breadcrumb: "Accounting",
    to: path_1.path.to.fixedAssets,
    module: "accounting"
};
function FixedAssetLayout() {
    return <react_router_1.Outlet />;
}
