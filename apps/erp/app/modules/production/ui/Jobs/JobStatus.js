"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_STATUS_COLOR_MAP = void 0;
exports.useJobStatusDisplayText = useJobStatusDisplayText;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var jobLabels_1 = require("./jobLabels");
exports.JOB_STATUS_COLOR_MAP = {
    Draft: "gray",
    Planned: "yellow",
    Ready: "blue",
    "In Progress": "orange",
    Paused: "orange",
    "Due Today": "orange",
    Completed: "green",
    Closed: "gray",
    Overdue: "red",
    Cancelled: "red"
};
// Display text mirrors the badge label, mapping "Ready" -> "Released" while
// keeping every status translated. Shared so filter options can render the same
// text the chip extracts via reactNodeToString.
function useJobStatusDisplayText() {
    var t = (0, macro_1.useLingui)().t;
    var getJobStatusLabel = (0, jobLabels_1.useJobStatusLabel)();
    // Stable identity so table column builders that depend on it don't rebuild
    // (and remount cells) every render.
    return (0, react_2.useCallback)(function (status) {
        return status === "Ready" ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Released"], ["Released"]))) : getJobStatusLabel(status);
    }, [t, getJobStatusLabel]);
}
function JobStatus(_a) {
    var status = _a.status, className = _a.className, iconOnly = _a.iconOnly;
    var getJobStatusLabel = (0, jobLabels_1.useJobStatusLabel)();
    var getDisplayText = useJobStatusDisplayText();
    if (!status)
        return null;
    var color = exports.JOB_STATUS_COLOR_MAP[status];
    if (!color)
        return null;
    var displayText = getDisplayText(status);
    var tooltip = status === "Ready" ? getJobStatusLabel("Ready") : undefined;
    return (<react_1.Status color={color} className={className} tooltip={tooltip} iconOnly={iconOnly}>
      {displayText}
    </react_1.Status>);
}
exports.default = JobStatus;
var templateObject_1;
