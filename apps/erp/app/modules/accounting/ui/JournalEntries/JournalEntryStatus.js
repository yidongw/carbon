"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var JournalEntryStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Draft":
            return <react_1.Status color="gray">{status}</react_1.Status>;
        case "Posted":
            return <react_1.Status color="green">{status}</react_1.Status>;
        case "Reversed":
            return <react_1.Status color="red">{status}</react_1.Status>;
        default:
            return null;
    }
};
exports.default = JournalEntryStatus;
