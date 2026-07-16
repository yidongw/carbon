"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingTypeIcon = exports.ProcedureStepTypeIcon = exports.MethodItemTypeIcon = exports.MethodIcon = exports.FileIcon = void 0;
exports.DeadlineIcon = DeadlineIcon;
exports.OperationStatusIcon = OperationStatusIcon;
var react_1 = require("@carbon/react");
var ai_1 = require("react-icons/ai");
var bs_1 = require("react-icons/bs");
var fa6_1 = require("react-icons/fa6");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var tb_1 = require("react-icons/tb");
var AlmostDoneIcon_1 = require("~/assets/icons/AlmostDoneIcon");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var InProgressStatusIcon_1 = require("~/assets/icons/InProgressStatusIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var TodoStatusIcon_1 = require("~/assets/icons/TodoStatusIcon");
var documentIconBaseClase = "w-6 h-6 flex-shrink-0";
function DeadlineIcon(_a) {
    var deadlineType = _a.deadlineType, overdue = _a.overdue;
    switch (deadlineType) {
        case "ASAP":
            return <bs_1.BsExclamationSquareFill className="text-red-500"/>;
        case "Hard Deadline":
            return <HighPriorityIcon_1.HighPriorityIcon className={(0, react_1.cn)(overdue ? "text-red-500" : "")}/>;
        case "Soft Deadline":
            return (<MediumPriorityIcon_1.MediumPriorityIcon className={(0, react_1.cn)(overdue ? "text-red-500" : "")}/>);
        case "No Deadline":
            return <LowPriorityIcon_1.LowPriorityIcon />;
        default:
            return null;
    }
}
var FileIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Document":
            return (<bs_1.BsFileWordFill className={(0, react_1.cn)(documentIconBaseClase, "text-blue-500", className)}/>);
        case "Spreadsheet":
            return (<bs_1.BsFileExcelFill className={(0, react_1.cn)(documentIconBaseClase, "text-emerald-700", className)}/>);
        case "Presentation":
            return (<bs_1.BsFilePptFill className={(0, react_1.cn)(documentIconBaseClase, "text-orange-400", className)}/>);
        case "PDF":
            return (<bs_1.BsFilePdfFill className={(0, react_1.cn)(documentIconBaseClase, "text-red-600", className)}/>);
        case "Archive":
            return <bs_1.BsFileZipFill className={(0, react_1.cn)(documentIconBaseClase, className)}/>;
        case "Text":
            return (<bs_1.BsFileTextFill className={(0, react_1.cn)(documentIconBaseClase, className)}/>);
        case "Image":
            return (<bs_1.BsFileImageFill className={(0, react_1.cn)(documentIconBaseClase, "text-yellow-400", className)}/>);
        case "Video":
            return (<bs_1.BsFileEarmarkPlayFill className={(0, react_1.cn)(documentIconBaseClase, "text-purple-500", className)}/>);
        case "Audio":
            return (<bs_1.BsFileEarmarkPlayFill className={(0, react_1.cn)(documentIconBaseClase, "text-cyan-400", className)}/>);
        case "Other":
        default:
            return (<bs_1.BsFileEarmarkFill className={(0, react_1.cn)(documentIconBaseClase, className)}/>);
    }
};
exports.FileIcon = FileIcon;
var MethodIcon = function (_a) {
    var type = _a.type, className = _a.className, isKit = _a.isKit;
    switch (type) {
        case "Method":
            return (<ai_1.AiOutlinePartition className={(0, react_1.cn)(className, "text-foreground")}/>);
        case "Purchase to Order":
            return <lu_1.LuShoppingCart className={(0, react_1.cn)("text-blue-500", className)}/>;
        case "Make to Order":
            return isKit ? (<lu_1.LuHexagon className={(0, react_1.cn)("text-emerald-500", className)}/>) : (<rx_1.RxCodesandboxLogo className={(0, react_1.cn)("text-emerald-500", className)}/>);
        case "Pull from Inventory":
            return <fa6_1.FaCodePullRequest className={(0, react_1.cn)("text-yellow-500", className)}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.MethodIcon = MethodIcon;
var MethodItemTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Part":
            return <ai_1.AiOutlinePartition className={className}/>;
        case "Material":
            return <lu_1.LuAtom className={className}/>;
        case "Tool":
            return <lu_1.LuHammer className={className}/>;
        case "Consumable":
            return <lu_1.LuPizza className={className}/>;
        case "Service":
            return <lu_1.LuHeadphones className={className}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.MethodItemTypeIcon = MethodItemTypeIcon;
function OperationStatusIcon(_a) {
    var status = _a.status;
    var getIcon = function () {
        switch (status) {
            case "Todo":
                return <TodoStatusIcon_1.TodoStatusIcon className="text-foreground"/>;
            case "Ready":
                return <TodoStatusIcon_1.TodoStatusIcon className="text-blue-600"/>;
            case "Waiting":
            case "Canceled":
                return <lu_1.LuCircleX className="text-red-600"/>;
            case "Done":
                return <lu_1.LuCircleCheck className="text-green-600"/>;
            case "In Progress":
                return <AlmostDoneIcon_1.AlmostDoneIcon />;
            case "Paused":
                return <InProgressStatusIcon_1.InProgressStatusIcon />;
            default:
                return null;
        }
    };
    var icon = getIcon();
    if (!icon)
        return null;
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <span className="inline-flex">{icon}</span>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <span>{status}</span>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
}
var ProcedureStepTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Task":
            return <lu_1.LuClipboardCheck className={(0, react_1.cn)("text-amber-500", className)}/>;
        case "Value":
            return <lu_1.LuQrCode className={(0, react_1.cn)("text-foreground", className)}/>;
        case "Measurement":
            return <lu_1.LuFlaskConical className={(0, react_1.cn)("text-emerald-500", className)}/>;
        case "Checkbox":
            return <lu_1.LuToggleLeft className={(0, react_1.cn)("text-purple-600", className)}/>;
        case "Timestamp":
            return <lu_1.LuClock className={(0, react_1.cn)("text-blue-500", className)}/>;
        case "Person":
            return <lu_1.LuUser className={(0, react_1.cn)("text-yellow-600", className)}/>;
        case "List":
            return <lu_1.LuList className={(0, react_1.cn)("text-orange-600", className)}/>;
        case "File":
            return <lu_1.LuImage className={(0, react_1.cn)("text-purple-500", className)}/>;
        case "Inspection":
            return <lu_1.LuEye className={(0, react_1.cn)("text-indigo-500", className)}/>;
    }
};
exports.ProcedureStepTypeIcon = ProcedureStepTypeIcon;
var TrackingTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Serial":
            return <lu_1.LuBarcode className={(0, react_1.cn)("text-foreground", className)}/>;
        case "Batch":
            return <lu_1.LuGroup className={(0, react_1.cn)("text-emerald-500", className)}/>;
        case "Inventory":
            return <lu_1.LuBox className={(0, react_1.cn)("text-blue-500", className)}/>;
        case "Non-Inventory":
            return <tb_1.TbTargetOff className={(0, react_1.cn)("text-red-500", className)}/>;
        default:
            return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
    }
};
exports.TrackingTypeIcon = TrackingTypeIcon;
