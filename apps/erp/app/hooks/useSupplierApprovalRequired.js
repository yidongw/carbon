"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupplierApprovalRequired = useSupplierApprovalRequired;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useSupplierApprovalRequired() {
    var _a;
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    return (_a = routeData === null || routeData === void 0 ? void 0 : routeData.supplierApprovalRequired) !== null && _a !== void 0 ? _a : false;
}
