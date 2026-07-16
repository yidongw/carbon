"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var SalesInvoicingStatus = function (_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    switch (status) {
        case "Draft":
        case "Return":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Submitted":
            return (<react_1.Status color="blue" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Pending":
        case "Partially Paid":
            return (<react_1.Status color="yellow" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Voided":
            return (<react_1.Status color="red" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Overdue":
            return (<react_1.Status color="orange" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Credit Note Issued":
        case "Paid":
            return (<react_1.Status color="green" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        default:
            return null;
    }
};
exports.default = SalesInvoicingStatus;
