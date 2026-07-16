"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var ShipmentStatus = function (_a) {
    var status = _a.status, invoiced = _a.invoiced, voided = _a.voided;
    if (invoiced && status !== "Voided") {
        return (<react_1.Status color="blue">
        <macro_1.Trans>Invoiced</macro_1.Trans>
      </react_1.Status>);
    }
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray">
          <macro_1.Trans>Draft</macro_1.Trans>
        </react_1.Status>);
        case "Pending":
            return (<react_1.Status color="orange">
          <macro_1.Trans>Pending</macro_1.Trans>
        </react_1.Status>);
        case "Posted":
            return (<react_1.Status color="green">
          <macro_1.Trans>Posted</macro_1.Trans>
        </react_1.Status>);
        case "Voided":
            return (<react_1.Status color="red">
          <macro_1.Trans>Voided</macro_1.Trans>
        </react_1.Status>);
        default:
            return null;
    }
};
exports.default = ShipmentStatus;
