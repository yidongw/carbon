"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var MakeMethodVersionStatus = function (_a) {
    var status = _a.status, isActive = _a.isActive;
    switch (status) {
        case "Draft":
            return (<react_1.Status color="gray">
          <macro_1.Trans>Draft</macro_1.Trans>
        </react_1.Status>);
        case "Active":
            return (<react_1.Status color="green">
          <macro_1.Trans>Active</macro_1.Trans>
        </react_1.Status>);
        case "Archived":
            return (<react_1.Status color="orange">
          <macro_1.Trans>Archived</macro_1.Trans>
        </react_1.Status>);
        default:
            return null;
    }
};
exports.default = MakeMethodVersionStatus;
