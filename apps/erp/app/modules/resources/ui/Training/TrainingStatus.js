"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrainingStatus;
var react_1 = require("@carbon/react");
function TrainingStatus(_a) {
    var status = _a.status, iconOnly = _a.iconOnly;
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray" iconOnly={iconOnly}>
          Draft
        </react_1.Status>);
        case "Active":
            return (<react_1.Status color="green" iconOnly={iconOnly}>
          Active
        </react_1.Status>);
        case "Archived":
            return (<react_1.Status color="red" iconOnly={iconOnly}>
          Archived
        </react_1.Status>);
        default:
            return null;
    }
}
