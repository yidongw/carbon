"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
function TrackedEntityStatus(_a) {
    var status = _a.status;
    switch (status) {
        case "Available":
            return (<react_1.Status color="green">
          <macro_1.Trans>Available</macro_1.Trans>
        </react_1.Status>);
        case "Reserved":
            return (<react_1.Status color="gray">
          <macro_1.Trans>Reserved</macro_1.Trans>
        </react_1.Status>);
        case "On Hold":
            return (<react_1.Status color="orange">
          <macro_1.Trans>On Hold</macro_1.Trans>
        </react_1.Status>);
        case "Rejected":
            return (<react_1.Status color="red">
          <macro_1.Trans>Rejected</macro_1.Trans>
        </react_1.Status>);
        case "Consumed":
            return (<react_1.Status color="blue">
          <macro_1.Trans>Consumed</macro_1.Trans>
        </react_1.Status>);
        default:
            return null;
    }
}
exports.default = TrackedEntityStatus;
