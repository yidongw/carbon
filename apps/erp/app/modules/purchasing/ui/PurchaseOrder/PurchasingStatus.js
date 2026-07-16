"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var PurchasingStatus = function (_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Planned":
        case "To Review":
        case "Needs Approval":
            return (<react_1.Status color="yellow" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "To Receive":
        case "To Receive and Invoice":
            return (<react_1.Status color="orange" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "To Invoice":
            return (<react_1.Status color="blue" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Completed":
            return (<react_1.Status color="green" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Closed":
        case "Rejected":
            return (<react_1.Status color="red" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        default:
            return null;
    }
};
exports.default = PurchasingStatus;
