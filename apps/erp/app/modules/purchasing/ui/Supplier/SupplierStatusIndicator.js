"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierStatusIndicator = void 0;
var react_1 = require("@carbon/react");
var colorMap = {
    Active: "green",
    Inactive: "gray",
    Pending: "orange",
    Rejected: "red"
};
var SupplierStatusIndicator = function (_a) {
    var status = _a.status;
    if (!status)
        return null;
    return <react_1.Status color={colorMap[status]}>{status}</react_1.Status>;
};
exports.SupplierStatusIndicator = SupplierStatusIndicator;
