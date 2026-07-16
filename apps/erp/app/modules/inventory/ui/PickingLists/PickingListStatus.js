"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var PickingListStatus = function (_a) {
    var status = _a.status;
    switch (status) {
        case "Draft":
            return (<react_1.Badge variant="secondary">
          <macro_1.Trans>Draft</macro_1.Trans>
        </react_1.Badge>);
        case "In Progress":
            return (<react_1.Badge variant="blue">
          <macro_1.Trans>In Progress</macro_1.Trans>
        </react_1.Badge>);
        case "Completed":
            return (<react_1.Badge variant="green">
          <macro_1.Trans>Completed</macro_1.Trans>
        </react_1.Badge>);
        case "Cancelled":
            return (<react_1.Badge variant="destructive">
          <macro_1.Trans>Cancelled</macro_1.Trans>
        </react_1.Badge>);
        default:
            return <react_1.Badge variant="secondary">{status}</react_1.Badge>;
    }
};
exports.default = PickingListStatus;
