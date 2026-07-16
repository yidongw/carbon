"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCard = ItemCard;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var class_variance_authority_1 = require("class-variance-authority");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var AlmostDoneIcon_1 = require("~/assets/icons/AlmostDoneIcon");
var InProgressStatusIcon_1 = require("~/assets/icons/InProgressStatusIcon");
var TodoStatusIcon_1 = require("~/assets/icons/TodoStatusIcon");
var Avatar_1 = require("~/components/Avatar");
var EmployeeAvatar_1 = require("~/components/EmployeeAvatar");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var cardVariants = (0, class_variance_authority_1.cva)("bg-card hover:bg-muted/30 dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]", {
    variants: {
        status: {
            "In Progress": "border-emerald-600/30",
            Ready: "",
            Done: "",
            Paused: "",
            Canceled: "opacity-50 border-red-500",
            Waiting: "opacity-50",
            Todo: "border-border"
        }
    },
    defaultVariants: {
        status: "Todo"
    }
});
function ItemCard(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var item = _a.item, progressByItemId = _a.progressByItemId, showCustomer = _a.showCustomer, showDescription = _a.showDescription, showDueDate = _a.showDueDate, showDuration = _a.showDuration, showProgress = _a.showProgress, showStatus = _a.showStatus, showSalesOrder = _a.showSalesOrder, showThumbnail = _a.showThumbnail;
    var t = (0, macro_1.useLingui)().t;
    var _o = (0, hooks_1.useDateFormatter)(), formatDate = _o.formatDate, formatRelativeTime = _o.formatRelativeTime;
    var routeData = (0, react_1.useRouteData)("/x/operations");
    var customer = showCustomer
        ? routeData === null || routeData === void 0 ? void 0 : routeData.customers.find(function (c) { return c.id === item.customerId; })
        : undefined;
    var isOverdue = item.deadlineType !== "No Deadline" && item.dueDate
        ? new Date(item.dueDate) < new Date()
        : false;
    var progress = (_d = (_c = (_b = progressByItemId === null || progressByItemId === void 0 ? void 0 : progressByItemId[item.id]) === null || _b === void 0 ? void 0 : _b.progress) !== null && _c !== void 0 ? _c : item.progress) !== null && _d !== void 0 ? _d : 0;
    var status = ((_e = progressByItemId === null || progressByItemId === void 0 ? void 0 : progressByItemId[item.id]) === null || _e === void 0 ? void 0 : _e.active)
        ? "In Progress"
        : item.status;
    var employeeIds = ((_f = progressByItemId === null || progressByItemId === void 0 ? void 0 : progressByItemId[item.id]) === null || _f === void 0 ? void 0 : _f.employees)
        ? Array.from(progressByItemId[item.id].employees)
        : undefined;
    return (<react_router_1.Link to={path_1.path.to.operation(item.id)}>
      <react_1.Card className={(0, react_1.cn)("max-w-[330px]", cardVariants({
            status: status
        }))}>
        <react_1.CardHeader className="flex flex-col justify-between relative gap-2">
          <div className="flex w-full max-w-full justify-between items-start gap-2">
            <div className="flex flex-col space-y-0 min-w-0">
              {item.itemReadableId && (<span className="text-xs text-muted-foreground line-clamp-1">
                  {item.itemReadableId}
                </span>)}
              <span className="mr-auto font-semibold line-clamp-2 leading-tight text-foreground">
                {item.itemDescription || item.itemReadableId}
              </span>
            </div>
            <react_1.Heading size="h4" className="text-foreground">
              {item.targetQuantity}
            </react_1.Heading>
          </div>

          {showProgress &&
            Number.isFinite(progress) &&
            Number.isFinite(item === null || item === void 0 ? void 0 : item.duration) &&
            Number(progress) >= 0 &&
            Number(item === null || item === void 0 ? void 0 : item.duration) > 0 && (<react_1.HStack className="mt-2">
                <react_1.BarProgress gradient invertGradient activeClassName={progress > ((_g = item.duration) !== null && _g !== void 0 ? _g : 0)
                ? "bg-red-500"
                : status === "Paused"
                    ? "bg-yellow-500"
                    : "bg-emerald-500"} progress={Math.min(progress && item.duration
                ? (progress / item.duration) * 100
                : 0, 100)}/>
                <lu_1.LuTimer className="text-muted-foreground w-4 h-4"/>
              </react_1.HStack>)}
          {showProgress &&
            Number.isFinite(item.quantity) &&
            Number(item.quantity) > 0 && (<react_1.HStack className="mt-2">
                <react_1.BarProgress segments={[
                {
                    value: (_h = item.quantityCompleted) !== null && _h !== void 0 ? _h : 0,
                    className: "bg-emerald-500"
                },
                {
                    value: (_j = item.quantityReworked) !== null && _j !== void 0 ? _j : 0,
                    className: "bg-yellow-500"
                },
                {
                    value: (_k = item.quantityScrapped) !== null && _k !== void 0 ? _k : 0,
                    className: "bg-red-500"
                }
            ]} max={item.targetQuantity || 1} progress={item.quantityCompleted && item.targetQuantity
                ? (item.quantityCompleted / item.targetQuantity) * 100
                : 0}/>
                <lu_1.LuCircleCheck className="text-muted-foreground w-4 h-4"/>
              </react_1.HStack>)}
        </react_1.CardHeader>

        <react_1.CardContent className="gap-2 text-left whitespace-pre-wrap text-sm">
          {showThumbnail && item.thumbnailPath && (<div className="flex justify-center">
              <img src={(0, path_1.getPrivateUrl)(item.thumbnailPath)} alt={item.title} className="w-full h-auto rounded-lg"/>
            </div>)}
          <react_1.HStack className="justify-start space-x-2">
            <lu_1.LuCirclePlay className="text-muted-foreground"/>
            <span className="text-sm line-clamp-1">{item.title}</span>
            {item.reworkId && <react_1.Badge variant="red">Rework</react_1.Badge>}
          </react_1.HStack>

          {showDescription && item.description && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuClipboardCheck className="text-muted-foreground"/>
              <span className="text-sm line-clamp-1">{item.description}</span>
            </react_1.HStack>)}
          {showStatus && status && (<react_1.HStack className="justify-start space-x-2">
              {getStatusIcon(status)}
              <span className="text-sm">{status}</span>
            </react_1.HStack>)}
          {showDuration && typeof item.duration === "number" && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuTimer className="text-muted-foreground"/>
              <span className="text-sm">
                {(0, utils_1.formatDurationMilliseconds)(item.duration)}
              </span>
            </react_1.HStack>)}
          {showDueDate && item.deadlineType && (<react_1.HStack className="justify-start space-x-2">
              <Icons_1.DeadlineIcon deadlineType={item.deadlineType} overdue={isOverdue}/>
              <react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <span className={(0, react_1.cn)("text-sm", isOverdue ? "text-red-500" : "")}>
                    {["ASAP", "No Deadline"].includes(item.deadlineType)
                ? item.deadlineType
                : item.dueDate
                    ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Due ", ""], ["Due ", ""])), formatRelativeTime((0, utils_1.convertDateStringToIsoString)(item.dueDate))) : "–"}
                  </span>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent side="right">
                  {item.deadlineType}
                </react_1.TooltipContent>
              </react_1.Tooltip>
            </react_1.HStack>)}
          {showDueDate && item.dueDate && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuCalendarDays />
              <span className="text-sm">{formatDate(item.dueDate)}</span>
            </react_1.HStack>)}

          {showSalesOrder &&
            item.salesOrderReadableId &&
            item.salesOrderId &&
            item.salesOrderLineId && (<react_1.HStack className="justify-start space-x-2">
                <ri_1.RiProgress8Line className="text-muted-foreground"/>
                <span className="text-sm">{item.salesOrderReadableId}</span>
              </react_1.HStack>)}

          {Array.isArray(employeeIds) && employeeIds.length > 0 && (<react_1.HStack className="justify-start space-x-2">
              <Avatar_1.default size="xs" name="Active Employee"/>
              <span className="text-sm">
                <macro_1.Trans>{employeeIds.length} Active</macro_1.Trans>
              </span>
            </react_1.HStack>)}

          {showCustomer && item.customerId && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuSquareUser className="text-muted-foreground"/>
              <react_1.HStack className="truncate no-underline hover:no-underline">
                <Avatar_1.default size="xs" name={(_l = customer === null || customer === void 0 ? void 0 : customer.name) !== null && _l !== void 0 ? _l : ""}/>
                <span>{customer === null || customer === void 0 ? void 0 : customer.name}</span>
              </react_1.HStack>
            </react_1.HStack>)}

          {Number(item.quantityScrapped) > 0 && (<react_1.HStack className="justify-start space-x-2 text-red-500">
              <lu_1.LuTrash className="w-4 h-4"/>
              <span className="text-sm">
                <macro_1.Trans>{item.quantityScrapped} Scrapped</macro_1.Trans>
              </span>
            </react_1.HStack>)}
        </react_1.CardContent>
        {(item.assignee || (item.tags && item.tags.length > 0)) && (<react_1.CardFooter className="items-center justify-start space-2 text-xs flex-wrap">
            {item.assignee && (<EmployeeAvatar_1.default size="xs" employeeId={item.assignee}/>)}
            {(_m = item.tags) === null || _m === void 0 ? void 0 : _m.map(function (tag) { return (<react_1.Badge key={tag} variant="secondary" className="border dark:border-none dark:shadow-button-base">
                {tag}
              </react_1.Badge>); })}
          </react_1.CardFooter>)}
      </react_1.Card>
    </react_router_1.Link>);
}
function getStatusIcon(status) {
    var getIcon = function () {
        switch (status) {
            case "Ready":
            case "Todo":
                return <TodoStatusIcon_1.TodoStatusIcon className="text-foreground"/>;
            case "Waiting":
            case "Canceled":
                return <lu_1.LuCircleX className="text-muted-foreground"/>;
            case "Done":
                return <lu_1.LuCircleCheck className="text-blue-600"/>;
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
var templateObject_1;
