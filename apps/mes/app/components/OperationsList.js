"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsList = OperationsList;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var class_variance_authority_1 = require("class-variance-authority");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var EmployeeAvatar_1 = require("~/components/EmployeeAvatar");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var Icons_1 = require("./Icons");
var settings = {
    showCustomer: false,
    showDescription: true,
    showDueDate: true,
    showDuration: true,
    showEmployee: true,
    showProgress: false,
    showStatus: true,
    showThumbnail: true
}; // TODO: load dynamically
function OperationsList(_a) {
    var operations = _a.operations;
    return (<>
      {operations.map(function (operation) { return (<OperationCard key={operation.id} operation={operation} {...settings}/>); })}
    </>);
}
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
function OperationCard(_a) {
    var _b, _c, _d;
    var operation = _a.operation, showCustomer = _a.showCustomer, showDescription = _a.showDescription, showDueDate = _a.showDueDate, showDuration = _a.showDuration, showEmployee = _a.showEmployee, showProgress = _a.showProgress, showStatus = _a.showStatus, showThumbnail = _a.showThumbnail;
    var t = (0, macro_1.useLingui)().t;
    var _e = (0, hooks_1.useDateFormatter)(), formatDate = _e.formatDate, formatRelativeTime = _e.formatRelativeTime;
    var isOverdue = operation.jobDeadlineType !== "No Deadline" && operation.jobDueDate
        ? new Date(operation.jobDueDate) < new Date()
        : false;
    return (<react_1.Card className={(0, react_1.cn)("h-full flex flex-col", cardVariants({
            status: operation.operationStatus
        }))}>
      <react_router_1.Link to={path_1.path.to.operation(operation.id)} className="flex flex-col flex-1">
        <react_1.CardHeader className="flex flex-col justify-between relative gap-2">
          <div className="flex w-full max-w-full justify-between items-start gap-2">
            <div className="flex flex-col space-y-0 min-w-0">
              {operation.itemReadableId && (<span className="text-xs text-muted-foreground line-clamp-1">
                  {operation.itemReadableId}
                </span>)}
              <span className="mr-auto font-semibold line-clamp-2 leading-tight">
                {operation.itemDescription || operation.itemReadableId}
              </span>
            </div>
            <react_1.Heading size="h4" className="text-muted-foreground/70">
              {(_c = (_b = operation.targetQuantity) !== null && _b !== void 0 ? _b : operation.operationQuantity) !== null && _c !== void 0 ? _c : 0}
            </react_1.Heading>
          </div>
        </react_1.CardHeader>
        <react_1.CardContent className="gap-2 text-left whitespace-pre-wrap text-sm flex-grow">
          {showThumbnail && operation.thumbnailPath && (<div className="flex justify-center">
              <img src={(0, path_1.getPrivateUrl)(operation.thumbnailPath)} alt={operation.jobReadableId} className="w-full h-auto rounded-lg"/>
            </div>)}
          <react_1.HStack className="justify-start space-x-2">
            <lu_1.LuCirclePlay className="text-muted-foreground"/>
            <span className="text-sm line-clamp-1">
              {operation.jobReadableId}
            </span>
          </react_1.HStack>

          {showDescription && operation.description && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuClipboardCheck className="text-muted-foreground"/>
              <span className="text-sm line-clamp-1">
                {operation.description}
              </span>
            </react_1.HStack>)}
          {showStatus && operation.operationStatus && (<react_1.HStack className="justify-start space-x-2">
              <Icons_1.OperationStatusIcon status={operation.operationStatus}/>
              <span className="text-sm">{operation.operationStatus}</span>
            </react_1.HStack>)}
          {showDuration && typeof operation.duration === "number" && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuTimer className="text-muted-foreground"/>
              <span className="text-sm">
                {(0, utils_1.formatDurationMilliseconds)(operation.duration)}
              </span>
            </react_1.HStack>)}
          {showDueDate && operation.jobDeadlineType && (<>
              <react_1.HStack className="justify-start space-x-2">
                <Icons_1.DeadlineIcon deadlineType={operation.jobDeadlineType} overdue={isOverdue}/>
                <react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <span className={(0, react_1.cn)("text-sm", isOverdue ? "text-red-500" : "")}>
                      {["ASAP", "No Deadline"].includes(operation.jobDeadlineType)
                ? operation.jobDeadlineType
                : operation.jobDueDate
                    ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Due ", ""], ["Due ", ""])), formatRelativeTime((0, utils_1.convertDateStringToIsoString)(operation.jobDueDate))) : "–"}
                    </span>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent side="right">
                    {operation.jobDeadlineType}
                  </react_1.TooltipContent>
                </react_1.Tooltip>
              </react_1.HStack>
              {operation.jobDueDate && (<react_1.HStack className="justify-start space-x-2">
                  <lu_1.LuCalendarDays />
                  <span className="text-sm">
                    {formatDate(operation.jobDueDate)}
                  </span>
                </react_1.HStack>)}
            </>)}
        </react_1.CardContent>
        {(operation.assignee ||
            (operation.tags && operation.tags.length > 0)) && (<react_1.CardFooter className="items-center justify-start text-xs flex-wrap mt-auto">
            {operation.assignee && (<EmployeeAvatar_1.default size="xs" employeeId={operation.assignee}/>)}
            {(_d = operation.tags) === null || _d === void 0 ? void 0 : _d.map(function (tag) { return (<react_1.Badge key={tag} variant="secondary" className="border dark:border-none dark:shadow-button-base">
                {tag}
              </react_1.Badge>); })}
          </react_1.CardFooter>)}
      </react_router_1.Link>
    </react_1.Card>);
}
var templateObject_1;
