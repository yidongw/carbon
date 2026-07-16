"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var IntercompanyTransactionStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Unmatched":
            return <react_1.Status color="orange">{status}</react_1.Status>;
        case "Matched":
            return <react_1.Status color="green">{status}</react_1.Status>;
        case "Eliminated":
            return <react_1.Status color="gray">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.default = IntercompanyTransactionStatus;
