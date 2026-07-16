"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINISHED_STATUSES = exports.RUNNING_STATUSES = exports.QUEUED_STATUSES = exports.allGanttTaskStatuses = void 0;
exports.descriptionForGanttTaskStatus = descriptionForGanttTaskStatus;
exports.GanttTaskStatusCombo = GanttTaskStatusCombo;
exports.GanttTaskStatusLabel = GanttTaskStatusLabel;
exports.GanttTaskStatusIcon = GanttTaskStatusIcon;
exports.runStatusClassNameColor = runStatusClassNameColor;
exports.runStatusTitle = runStatusTitle;
var react_1 = require("@carbon/react");
var assert_never_1 = require("assert-never");
var lu_1 = require("react-icons/lu");
exports.allGanttTaskStatuses = [
    "PENDING",
    "EXECUTING",
    "RETRYING_AFTER_FAILURE",
    "WAITING_TO_RESUME",
    "COMPLETED_SUCCESSFULLY",
    "CANCELED",
    "COMPLETED_WITH_ERRORS",
    "CRASHED",
    "INTERRUPTED",
    "SYSTEM_FAILURE"
];
var taskRunStatusDescriptions = {
    PENDING: "Task is waiting to be executed",
    EXECUTING: "Task is currently being executed",
    RETRYING_AFTER_FAILURE: "Task is being reattempted after a failure",
    WAITING_TO_RESUME: "Task has been frozen and is waiting to be resumed",
    COMPLETED_SUCCESSFULLY: "Task has been successfully completed",
    CANCELED: "Task has been canceled",
    COMPLETED_WITH_ERRORS: "Task has failed with errors",
    INTERRUPTED: "Task has failed because it was interrupted",
    SYSTEM_FAILURE: "Task has failed due to a system failure",
    PAUSED: "Task has been paused by the user",
    CRASHED: "Task has crashed and won't be retried"
};
exports.QUEUED_STATUSES = ["PENDING"];
exports.RUNNING_STATUSES = [
    "EXECUTING",
    "RETRYING_AFTER_FAILURE",
    "WAITING_TO_RESUME"
];
exports.FINISHED_STATUSES = [
    "COMPLETED_SUCCESSFULLY",
    "CANCELED",
    "COMPLETED_WITH_ERRORS",
    "INTERRUPTED",
    "SYSTEM_FAILURE",
    "CRASHED"
];
function descriptionForGanttTaskStatus(status) {
    return taskRunStatusDescriptions[status];
}
function GanttTaskStatusCombo(_a) {
    var status = _a.status, className = _a.className, iconClassName = _a.iconClassName;
    return (<span className={(0, react_1.cn)("flex items-center gap-1", className)}>
      <GanttTaskStatusIcon status={status} className={(0, react_1.cn)("h-4 w-4", iconClassName)}/>
      <GanttTaskStatusLabel status={status}/>
    </span>);
}
function GanttTaskStatusLabel(_a) {
    var status = _a.status;
    return (<span className={runStatusClassNameColor(status)}>
      {runStatusTitle(status)}
    </span>);
}
function GanttTaskStatusIcon(_a) {
    var status = _a.status, className = _a.className;
    var getIcon = function () {
        switch (status) {
            case "PENDING":
                return (<lu_1.LuLayers className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "EXECUTING":
                return (<react_1.Spinner className={(0, react_1.cn)(runStatusClassNameColor(status), "w-2 h-2", className)}/>);
            case "WAITING_TO_RESUME":
                return (<lu_1.LuSnowflake className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "RETRYING_AFTER_FAILURE":
                return (<lu_1.LuRefreshCcw className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "PAUSED":
                return (<lu_1.LuCirclePause className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "CANCELED":
                return (<lu_1.LuBan className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "INTERRUPTED":
                return (<lu_1.LuCircleSlash className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "COMPLETED_SUCCESSFULLY":
                return (<lu_1.LuCircleCheck className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "COMPLETED_WITH_ERRORS":
                return (<lu_1.LuCircleX className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "SYSTEM_FAILURE":
                return (<lu_1.LuCircleX className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            case "CRASHED":
                return (<lu_1.LuFlame className={(0, react_1.cn)(runStatusClassNameColor(status), className)}/>);
            default: {
                (0, assert_never_1.default)(status);
            }
        }
    };
    var icon = getIcon();
    var tooltipText = runStatusTitle(status);
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <span className="inline-flex">{icon}</span>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <span>{tooltipText}</span>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
}
function runStatusClassNameColor(status) {
    switch (status) {
        case "PENDING":
            return "text-gray-500";
        case "EXECUTING":
        case "RETRYING_AFTER_FAILURE":
            return "text-pending";
        case "WAITING_TO_RESUME":
            return "text-blue-300";
        case "PAUSED":
            return "text-orange-300";
        case "CANCELED":
            return "text-gray-500";
        case "INTERRUPTED":
            return "text-red-500";
        case "COMPLETED_SUCCESSFULLY":
            return "text-success";
        case "COMPLETED_WITH_ERRORS":
            return "text-red-500";
        case "SYSTEM_FAILURE":
            return "text-red-500";
        case "CRASHED":
            return "text-red-500";
        default: {
            (0, assert_never_1.default)(status);
        }
    }
}
function runStatusTitle(status) {
    switch (status) {
        case "PENDING":
            return "Queued";
        case "EXECUTING":
            return "Executing";
        case "WAITING_TO_RESUME":
            return "Frozen";
        case "RETRYING_AFTER_FAILURE":
            return "Reattempting";
        case "PAUSED":
            return "Paused";
        case "CANCELED":
            return "Canceled";
        case "INTERRUPTED":
            return "Interrupted";
        case "COMPLETED_SUCCESSFULLY":
            return "Completed";
        case "COMPLETED_WITH_ERRORS":
            return "Failed";
        case "SYSTEM_FAILURE":
            return "System failure";
        case "CRASHED":
            return "Crashed";
        default: {
            (0, assert_never_1.default)(status);
        }
    }
}
