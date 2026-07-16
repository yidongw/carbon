"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraIssueStatusBadge = exports.DimensionEntityTypeIcon = exports.JournalEntrySourceTypeIcon = exports.JiraIcon = exports.LinearIssueStateBadge = exports.LinearIcon = exports.TimeTypeIcon = exports.TrackingTypeIcon = exports.ReplenishmentSystemIcon = exports.ProcedureStepTypeIcon = exports.QuoteLineStatusIcon = exports.IssueTaskStatusIcon = exports.OnshapeStatus = exports.MethodIcon = exports.SourcingTypeIcon = exports.MethodItemTypeIcon = exports.ModuleIcon = void 0;
exports.MethodBadge = MethodBadge;
exports.OperationStatusIcon = OperationStatusIcon;
var linear_1 = require("@carbon/ee/linear");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var ai_1 = require("react-icons/ai");
var fa6_1 = require("react-icons/fa6");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var tb_1 = require("react-icons/tb");
var react_router_1 = require("react-router");
var AlmostDoneIcon_1 = require("~/assets/icons/AlmostDoneIcon");
var InProgressStatusIcon_1 = require("~/assets/icons/InProgressStatusIcon");
var TodoStatusIcon_1 = require("~/assets/icons/TodoStatusIcon");
var ModuleIcon = function (_a) {
    var icon = _a.icon;
    return (<div className="h-6 w-6 rounded-lg border border-primary/30 bg-gradient-to-tr from-primary/20 to-primary/10 flex items-center justify-center text-primary text-sm">
      {icon}
    </div>);
};
exports.ModuleIcon = ModuleIcon;
var MethodItemTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Style":
            return <lu_1.LuShirt className={className}/>;
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
var SourcingTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Specified":
            return <lu_1.LuTarget className={(0, react_1.cn)("text-red-500", className)}/>;
        case "Drop Ship":
            return <lu_1.LuShoppingCart className={(0, react_1.cn)("text-blue-500", className)}/>;
        case "Ship from Inventory":
            return <lu_1.LuTruck className={(0, react_1.cn)("text-cyan-500", className)}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.SourcingTypeIcon = SourcingTypeIcon;
var MethodIcon = function (_a) {
    var type = _a.type, className = _a.className, isKit = _a.isKit;
    switch (type) {
        case "Method":
            return (<ai_1.AiOutlinePartition className={(0, react_1.cn)(className, "text-foreground")}/>);
        case "Purchase to Order":
            return <lu_1.LuShoppingCart className={(0, react_1.cn)("text-blue-500", className)}/>;
        case "Make to Order":
            return (<rx_1.RxCodesandboxLogo className={(0, react_1.cn)("text-emerald-500", className)}/>);
        case "Pull from Inventory":
            return <fa6_1.FaCodePullRequest className={(0, react_1.cn)("text-yellow-500", className)}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.MethodIcon = MethodIcon;
function MethodBadge(_a) {
    var type = _a.type, text = _a.text, to = _a.to, className = _a.className;
    var mode = (0, react_1.useMode)();
    var style = getReplenishmentBadgeColor(type, mode);
    return (<react_router_1.Link to={to} prefetch="intent" className="group flex items-center gap-1">
      <react_1.Badge style={style} className={className}>
        <exports.MethodIcon type={type} className="w-3 h-3 mr-1 "/>
        {text}
      </react_1.Badge>
      <span className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-4 h-4 text-foreground">
        <lu_1.LuExternalLink />
      </span>
    </react_router_1.Link>);
}
function getReplenishmentBadgeColor(type, mode) {
    return type === "Purchase to Order"
        ? (0, utils_1.getColor)("blue", mode)
        : type === "Make to Order"
            ? (0, utils_1.getColor)("green", mode)
            : (0, utils_1.getColor)("orange", mode);
}
var OnshapeStatus = function (_a) {
    var status = _a.status, className = _a.className;
    var getIcon = function () {
        switch (status) {
            case "In progress":
                return <AlmostDoneIcon_1.AlmostDoneIcon className={className}/>;
            case "Released":
                return <lu_1.LuCircleCheck className={(0, react_1.cn)("text-blue-600", className)}/>;
            case "Rejected":
                return <lu_1.LuCircleX className={(0, react_1.cn)("text-red-600", className)}/>;
            case "Pending":
                return <InProgressStatusIcon_1.InProgressStatusIcon className={className}/>;
            default:
                return <react_1.Status color="gray">{status}</react_1.Status>;
        }
    };
    var icon = getIcon();
    // Status component already has tooltip, so return it directly
    if (status !== "In progress" &&
        status !== "Released" &&
        status !== "Rejected" &&
        status !== "Pending") {
        return icon;
    }
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <span className="inline-flex">{icon}</span>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <span>{status}</span>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
};
exports.OnshapeStatus = OnshapeStatus;
function OperationStatusIcon(_a) {
    var status = _a.status, className = _a.className;
    var getIcon = function () {
        switch (status) {
            case "Todo":
                return (<lu_1.LuCircleDashed className={(0, react_1.cn)("text-muted-foreground", className)}/>);
            case "Ready":
                return <TodoStatusIcon_1.TodoStatusIcon className={(0, react_1.cn)("text-blue-600", className)}/>;
            case "Waiting":
            case "Canceled":
                return <lu_1.LuCircleX className={(0, react_1.cn)("text-red-600", className)}/>;
            case "Done":
                return <lu_1.LuCircleCheck className={(0, react_1.cn)("text-green-600", className)}/>;
            case "In Progress":
                return <AlmostDoneIcon_1.AlmostDoneIcon className={className}/>;
            case "Paused":
                return <InProgressStatusIcon_1.InProgressStatusIcon className={className}/>;
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
var IssueTaskStatusIcon = function (_a) {
    var status = _a.status, className = _a.className;
    var getIcon = function () {
        switch (status) {
            case "Pending":
                return <lu_1.LuCircleDashed className={(0, react_1.cn)("text-foreground", className)}/>;
            case "Skipped":
                return <lu_1.LuCircleX className={(0, react_1.cn)("text-muted-foreground", className)}/>;
            case "Completed":
                return <lu_1.LuCircleCheck className={(0, react_1.cn)("text-emerald-600", className)}/>;
            case "In Progress":
                return <AlmostDoneIcon_1.AlmostDoneIcon className={className}/>;
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
};
exports.IssueTaskStatusIcon = IssueTaskStatusIcon;
var QuoteLineStatusIcon = function (_a) {
    var status = _a.status;
    var getIcon = function () {
        switch (status) {
            case "Not Started":
                return <lu_1.LuCircle size={12} className="text-blue-600"/>;
            case "No Quote":
                return <lu_1.LuCircleX size={12} className="text-red-600"/>;
            case "Complete":
                return <lu_1.LuCircleCheck size={12} className="text-emerald-600"/>;
            case "In Progress":
                return <lu_1.LuClock3 size={12} className="text-yellow-600"/>;
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
};
exports.QuoteLineStatusIcon = QuoteLineStatusIcon;
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
            return <lu_1.LuImage className={(0, react_1.cn)("text-indigo-500", className)}/>;
        case "Inspection":
            return <lu_1.LuEye className={(0, react_1.cn)("text-indigo-500", className)}/>;
    }
};
exports.ProcedureStepTypeIcon = ProcedureStepTypeIcon;
var ReplenishmentSystemIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Buy":
            return <lu_1.LuShoppingCart className={(0, react_1.cn)("text-blue-500", className)}/>;
        case "Make":
            return (<rx_1.RxCodesandboxLogo className={(0, react_1.cn)("text-emerald-500", className)}/>);
        case "Buy and Make":
            return <lu_1.LuFlaskConical className={(0, react_1.cn)("text-teal-500", className)}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.ReplenishmentSystemIcon = ReplenishmentSystemIcon;
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
var TimeTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "Setup":
            return <lu_1.LuTimer className={className}/>;
        case "Labor":
            return <lu_1.LuHardHat className={className}/>;
        case "Machine":
            return <lu_1.LuHammer className={className}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.TimeTypeIcon = TimeTypeIcon;
var LinearIcon = function (props) {
    return (<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#717ce2" transform="matrix(1, 0, 0, 1, 0, 0)" className={props.className} {...props}>
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path d="M3.03509 12.9431C3.24245 14.9227 4.10472 16.8468 5.62188 18.364C7.13904 19.8811 9.0631 20.7434 11.0428 20.9508L3.03509 12.9431Z" fill="currentColor"></path>{" "}
        <path d="M3 11.4938L12.4921 20.9858C13.2976 20.9407 14.0981 20.7879 14.8704 20.5273L3.4585 9.11548C3.19793 9.88771 3.0451 10.6883 3 11.4938Z" fill="currentColor"/>{" "}
        <path d="M3.86722 8.10999L15.8758 20.1186C16.4988 19.8201 17.0946 19.4458 17.6493 18.9956L4.99021 6.33659C4.54006 6.89125 4.16573 7.487 3.86722 8.10999Z" fill="currentColor"/>{" "}
        <path d="M5.66301 5.59517C9.18091 2.12137 14.8488 2.135 18.3498 5.63604C21.8508 9.13708 21.8645 14.8049 18.3907 18.3228L5.66301 5.59517Z" fill="currentColor"/>{" "}
      </g>
    </svg>);
};
exports.LinearIcon = LinearIcon;
var LinearIssueStateBadge = function (props) {
    var status = (0, linear_1.mapLinearStatusToCarbonStatus)(props.state.type);
    var className = props.className;
    var icon = (<lu_1.LuCircleDashed className={(0, react_1.cn)("text-foreground", className)}/>);
    switch (status) {
        case "Pending":
            icon = <lu_1.LuCircleDashed className={(0, react_1.cn)("text-foreground", className)}/>;
            break;
        case "Skipped":
            icon = <lu_1.LuCircleX className={(0, react_1.cn)("text-muted-foreground", className)}/>;
            break;
        case "Completed":
            icon = <lu_1.LuCircleCheck className={(0, react_1.cn)("text-emerald-600", className)}/>;
            break;
        case "In Progress":
            icon = <AlmostDoneIcon_1.AlmostDoneIcon className={className}/>;
            break;
    }
    return (<react_1.Badge variant={"secondary"} className="py-1 bg-transparent">
      {icon}
      <span className="ml-1">{props.state.name}</span>
    </react_1.Badge>);
};
exports.LinearIssueStateBadge = LinearIssueStateBadge;
var JiraIcon = function (props) {
    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65" fill="currentColor" className={props.className} {...props}>
      <defs>
        <linearGradient id="jira-gradient-1" x1="98.03%" y1="0.16%" x2="58.89%" y2="40.53%">
          <stop offset="0.18" stopColor="currentColor" stopOpacity="0.4"/>
          <stop offset="1" stopColor="currentColor"/>
        </linearGradient>
        <linearGradient id="jira-gradient-2" x1="100.17%" y1="0.05%" x2="55.99%" y2="44.23%">
          <stop offset="0.18" stopColor="currentColor" stopOpacity="0.4"/>
          <stop offset="1" stopColor="currentColor"/>
        </linearGradient>
      </defs>
      <path d="M62.75 30.02L35.58 2.85 32.5 0 12.77 19.73 1.25 31.25a1.69 1.69 0 0 0 0 2.39L20 52.11l12.5 12.5 19.73-19.73.62-.62 9.9-9.9a1.69 1.69 0 0 0 0-2.34zM32.5 42.15l-9.65-9.65 9.65-9.65 9.65 9.65z" fill="currentColor"/>
      <path d="M32.5 22.85A13.85 13.85 0 0 1 32.4 3L12.65 22.77l9.85 9.85z" fill="url(#jira-gradient-1)"/>
      <path d="M42.17 32.48L32.5 42.15a13.86 13.86 0 0 1 0 19.6l19.77-19.75z" fill="url(#jira-gradient-2)"/>
    </svg>);
};
exports.JiraIcon = JiraIcon;
var JournalEntrySourceTypeIcon = function (_a) {
    var sourceType = _a.sourceType, className = _a.className;
    switch (sourceType) {
        case "Manual":
            return <lu_1.LuBookOpen className={className}/>;
        case "Purchase Receipt":
            return <lu_1.LuHandCoins className={className}/>;
        case "Purchase Invoice":
            return <lu_1.LuCreditCard className={className}/>;
        case "Purchase Return":
            return <lu_1.LuRotateCcw className={className}/>;
        case "Sales Invoice":
            return <lu_1.LuCreditCard className={className}/>;
        case "Sales Shipment":
            return <lu_1.LuTruck className={className}/>;
        case "Sales Return":
            return <lu_1.LuRotateCcw className={className}/>;
        case "Transfer Receipt":
            return <lu_1.LuArrowLeftRight className={className}/>;
        case "Inventory Adjustment":
            return <lu_1.LuPackage className={className}/>;
        case "Production Order":
            return <lu_1.LuCirclePlay className={className}/>;
        case "Job Consumption":
            return <lu_1.LuHammer className={className}/>;
        case "Job Receipt":
            return <lu_1.LuClipboardCheck className={className}/>;
        case "Production Event":
            return <lu_1.LuHardHat className={className}/>;
        case "Job Close":
            return <lu_1.LuCircleCheck className={className}/>;
        case "Asset Depreciation":
            return <lu_1.LuClock className={className}/>;
        case "Asset Disposal":
            return <lu_1.LuBuilding2 className={className}/>;
    }
    return <lu_1.LuSquare className={(0, react_1.cn)("text-muted-foreground", className)}/>;
};
exports.JournalEntrySourceTypeIcon = JournalEntrySourceTypeIcon;
var DimensionEntityTypeIcon = function (_a) {
    var entityType = _a.entityType, className = _a.className;
    switch (entityType) {
        case "Custom":
            return <lu_1.LuTags className={className}/>;
        case "Location":
            return <lu_1.LuMapPin className={className}/>;
        case "ItemPostingGroup":
            return <lu_1.LuGroup className={className}/>;
        case "SupplierType":
            return <lu_1.LuContainer className={className}/>;
        case "CustomerType":
            return <lu_1.LuUsers className={className}/>;
        case "Department":
            return <lu_1.LuBuilding className={className}/>;
        case "Employee":
            return <lu_1.LuUser className={className}/>;
        case "FixedAssetClass":
            return <lu_1.LuLandmark className={className}/>;
        case "CostCenter":
            return <lu_1.LuCircleDollarSign className={className}/>;
        case "WorkCenter":
            return <lu_1.LuWrench className={className}/>;
        case "Process":
            return <lu_1.LuCog className={className}/>;
    }
};
exports.DimensionEntityTypeIcon = DimensionEntityTypeIcon;
var JiraIssueStatusBadge = function (props) {
    var className = props.className;
    var icon = (<lu_1.LuCircleDashed className={(0, react_1.cn)("text-foreground", className)}/>);
    switch (props.status.category) {
        case "new":
            icon = <lu_1.LuCircleDashed className={(0, react_1.cn)("text-foreground", className)}/>;
            break;
        case "indeterminate":
            icon = <AlmostDoneIcon_1.AlmostDoneIcon className={className}/>;
            break;
        case "done":
            icon = <lu_1.LuCircleCheck className={(0, react_1.cn)("text-emerald-600", className)}/>;
            break;
    }
    return (<react_1.Badge variant={"secondary"} className="py-1 bg-transparent">
      {icon}
      <span className="ml-1">{props.status.name}</span>
    </react_1.Badge>);
};
exports.JiraIssueStatusBadge = JiraIssueStatusBadge;
