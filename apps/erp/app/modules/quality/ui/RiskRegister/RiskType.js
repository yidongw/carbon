"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var RiskType = function (_a) {
    var type = _a.type;
    switch (type) {
        case "Risk":
            return <react_1.Status color="red">{type}</react_1.Status>;
        case "Opportunity":
            return <react_1.Status color="green">{type}</react_1.Status>;
        default:
            return null;
    }
};
exports.default = RiskType;
