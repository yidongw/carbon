"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALES_STATUS_COLOR_MAP = void 0;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
exports.SALES_STATUS_COLOR_MAP = {
    Draft: "gray",
    Cancelled: "red",
    Closed: "red",
    "To Ship and Invoice": "orange",
    "To Ship": "orange",
    "To Invoice": "blue",
    Confirmed: "blue",
    "Needs Approval": "yellow",
    "In Progress": "yellow",
    Invoiced: "gray",
    Completed: "green"
};
var SalesStatus = function (_a) {
    var status = _a.status, jobs = _a.jobs, lines = _a.lines, disableTooltip = _a.disableTooltip, iconOnly = _a.iconOnly;
    if (!status)
        return null;
    var isManufacturing = jobs !== undefined &&
        lines !== undefined &&
        (0, utils_1.hasIncompleteJobs)({ jobs: jobs, lines: lines });
    if (isManufacturing && !(status === "Closed" || status === "Cancelled")) {
        return (<react_1.Status color="yellow" tooltip={status} disableTooltip={disableTooltip} iconOnly={iconOnly}>
        In Progress
      </react_1.Status>);
    }
    var color = exports.SALES_STATUS_COLOR_MAP[status];
    if (!color)
        return null;
    return (<react_1.Status color={color} disableTooltip={disableTooltip} iconOnly={iconOnly}>
      {status}
    </react_1.Status>);
};
exports.default = SalesStatus;
