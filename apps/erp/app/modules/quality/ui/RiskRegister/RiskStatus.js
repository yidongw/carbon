"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var RiskStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Accepted":
            return <react_1.Status color="green">{status}</react_1.Status>;
        case "In Review":
            return <react_1.Status color="blue">{status}</react_1.Status>;
        case "Mitigating":
            return <react_1.Status color="orange">{status}</react_1.Status>;
        case "Closed":
            return <react_1.Status color="red">{status}</react_1.Status>;
        case "Open":
            return <react_1.Status color="gray">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.default = RiskStatus;
