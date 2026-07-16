"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanttIcon = GanttIcon;
var react_1 = require("@carbon/react");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var AttemptIcon_1 = require("~/assets/icons/AttemptIcon");
var TaskIcon_1 = require("~/assets/icons/TaskIcon");
function GanttIcon(_a) {
    var name = _a.name, className = _a.className;
    if (!name)
        return <lu_1.LuSquare className={(0, react_1.cn)(className, "text-muted-foreground")}/>;
    switch (name) {
        case "job":
            return <lu_1.LuCalendarClock className={(0, react_1.cn)(className, "text-primary")}/>;
        case "assembly":
            return (<ai_1.AiOutlinePartition className={(0, react_1.cn)(className, "text-indigo-500")}/>);
        case "operation":
            return <lu_1.LuClock className={(0, react_1.cn)(className, "text-blue-500")}/>;
        case "timecard":
            return <TaskIcon_1.TaskIcon className={(0, react_1.cn)(className, "text-yellow-500")}/>;
        case "inspection":
            return <lu_1.LuFlaskConical className={(0, react_1.cn)(className, "text-teal-500")}/>;
        case "attempt":
            return <AttemptIcon_1.AttemptIcon className={(0, react_1.cn)(className, "text-muted-foreground")}/>;
        case "wait":
            return <lu_1.LuClock className={(0, react_1.cn)(className, "text-yellow-500")}/>;
        //log levels
        case "debug":
        case "log":
        case "info":
            return <lu_1.LuInfo className={(0, react_1.cn)(className, "text-muted-foreground")}/>;
        case "warn":
            return <lu_1.LuInfo className={(0, react_1.cn)(className, "text-amber-400")}/>;
        case "error":
            return <lu_1.LuInfo className={(0, react_1.cn)(className, "text-rose-500")}/>;
        case "fatal":
            return <lu_1.LuHand className={(0, react_1.cn)(className, "text-rose-800")}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)(className, "text-muted-foreground")}/>;
}
