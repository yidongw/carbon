"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var useSupplierSidebar_1 = require("./useSupplierSidebar");
var SupplierSidebar = function () {
    var _a, _b;
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("SupplierSidebar requires an supplierId and could not find supplierId in params");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplier(supplierId));
    var links = (0, useSupplierSidebar_1.useSupplierSidebar)({
        contacts: (_a = routeData === null || routeData === void 0 ? void 0 : routeData.contacts.length) !== null && _a !== void 0 ? _a : 0,
        locations: (_b = routeData === null || routeData === void 0 ? void 0 : routeData.locations.length) !== null && _b !== void 0 ? _b : 0
    });
    return <Layout_1.DetailSidebar links={links}/>;
};
exports.default = SupplierSidebar;
