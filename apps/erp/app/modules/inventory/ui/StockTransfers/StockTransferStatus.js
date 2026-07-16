"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var StockTransferStatus = function (_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          <macro_1.Trans>Draft</macro_1.Trans>
        </react_1.Status>);
        case "Released":
            return (<react_1.Status color="orange" iconOnly={iconOnly}>
          <macro_1.Trans>Released</macro_1.Trans>
        </react_1.Status>);
        case "In Progress":
            return (<react_1.Status color="blue" iconOnly={iconOnly}>
          <macro_1.Trans>In Progress</macro_1.Trans>
        </react_1.Status>);
        case "Completed":
            return (<react_1.Status color="green" iconOnly={iconOnly}>
          <macro_1.Trans>Completed</macro_1.Trans>
        </react_1.Status>);
        default:
            return null;
    }
};
exports.default = StockTransferStatus;
