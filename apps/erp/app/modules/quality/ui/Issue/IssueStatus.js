"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var IssueStatus = function (_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    switch (status) {
        case "Registered":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "In Progress":
            return (<react_1.Status color="blue" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        case "Closed":
            return (<react_1.Status color="green" iconOnly={iconOnly}>
          {status}
        </react_1.Status>);
        default:
            return null;
    }
};
exports.default = IssueStatus;
