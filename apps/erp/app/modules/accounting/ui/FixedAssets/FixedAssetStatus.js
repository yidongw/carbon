"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var FixedAssetStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Draft":
            return <react_1.Status color="gray">{status}</react_1.Status>;
        case "Active":
            return <react_1.Status color="green">{status}</react_1.Status>;
        case "Fully Depreciated":
            return <react_1.Status color="yellow">{status}</react_1.Status>;
        case "Disposed":
            return <react_1.Status color="red">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.default = FixedAssetStatus;
