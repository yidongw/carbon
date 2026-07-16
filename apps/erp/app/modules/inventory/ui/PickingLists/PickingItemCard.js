"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPickingDisplaySettings = void 0;
exports.PickingItemCard = PickingItemCard;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var class_variance_authority_1 = require("class-variance-authority");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var Deadline_1 = require("~/modules/production/ui/Jobs/Deadline");
var JobOperationStatus_1 = require("~/modules/production/ui/Jobs/JobOperationStatus");
var path_1 = require("~/utils/path");
exports.defaultPickingDisplaySettings = {
    showCustomer: true,
    showDescription: true,
    showDueDate: true,
    showDuration: false,
    showProgress: false,
    showQuantity: true,
    showStatus: true,
    showSalesOrder: true,
    showThumbnail: false
};
var cardVariants = (0, class_variance_authority_1.cva)("bg-card hover:bg-muted/30 cursor-pointer transition-[background-color,box-shadow] duration-150 dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]", {
    variants: {
        selected: {
            true: "ring-2 ring-primary",
            false: ""
        },
        status: {
            "In Progress": "border-emerald-600/30",
            Ready: "",
            Done: "",
            Paused: "opacity-70",
            Canceled: "border-red-500/30",
            Cancelled: "border-red-500/30",
            Waiting: "opacity-50",
            Todo: "border-border"
        }
    },
    defaultVariants: {
        status: "Todo"
    }
});
function PickingItemCard(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var item = _a.item, isSelected = _a.isSelected, onToggle = _a.onToggle, displaySettings = _a.displaySettings;
    var _m = (0, hooks_1.useDateFormatter)(), formatDate = _m.formatDate, formatRelativeTime = _m.formatRelativeTime;
    var isOverdue = item.deadlineType && item.deadlineType !== "No Deadline" && item.dueDate
        ? new Date(item.dueDate) < new Date()
        : false;
    var status = (_b = item.operationStatus) !== null && _b !== void 0 ? _b : "Todo";
    return (<react_1.Card onClick={function () { return onToggle(item.jobOperationId); }} className={(0, react_1.cn)("max-w-[330px]", cardVariants({
            // @ts-expect-error status is a string union at runtime
            status: status,
            selected: isSelected
        }))}>
      <react_1.CardHeader className="flex flex-col justify-between relative gap-2">
        <div className="flex w-full max-w-full justify-between items-start gap-2">
          <div className="flex flex-col space-y-0 min-w-0">
            {item.itemReadableId && (<span className="text-xs text-muted-foreground line-clamp-1">
                {item.itemReadableId}
              </span>)}
            <react_router_1.Link to={item.jobMakeMethodId
            ? path_1.path.to.jobMethod(item.jobId, item.jobMakeMethodId)
            : path_1.path.to.job(item.jobId)} onClick={function (e) { return e.stopPropagation(); }} className="mr-auto font-semibold line-clamp-2 leading-tight">
              {item.itemDescription || item.itemReadableId}
            </react_router_1.Link>
          </div>
          <react_1.Checkbox isChecked={isSelected} onCheckedChange={function () { return onToggle(item.jobOperationId); }} onClick={function (e) { return e.stopPropagation(); }} aria-label={"Select ".concat(item.jobReadableId)} className="mt-0.5 flex-shrink-0"/>
        </div>

        {displaySettings.showProgress &&
            Number((_c = item.targetQuantity) !== null && _c !== void 0 ? _c : item.operationQuantity) > 0 && (<react_1.HStack>
              <react_1.BarProgress segments={[
                {
                    value: (_d = item.quantityComplete) !== null && _d !== void 0 ? _d : 0,
                    className: "bg-emerald-500"
                },
                {
                    value: (_e = item.quantityReworked) !== null && _e !== void 0 ? _e : 0,
                    className: "bg-yellow-500"
                },
                {
                    value: (_f = item.quantityScrapped) !== null && _f !== void 0 ? _f : 0,
                    className: "bg-red-500"
                }
            ]} max={((_g = item.targetQuantity) !== null && _g !== void 0 ? _g : item.operationQuantity) || 1} progress={item.quantityComplete &&
                ((_h = item.targetQuantity) !== null && _h !== void 0 ? _h : item.operationQuantity)
                ? (item.quantityComplete /
                    ((_k = (_j = item.targetQuantity) !== null && _j !== void 0 ? _j : item.operationQuantity) !== null && _k !== void 0 ? _k : 1)) *
                    100
                : 0}/>
            </react_1.HStack>)}
      </react_1.CardHeader>
      <react_1.CardContent className="gap-2 text-left whitespace-pre-wrap text-sm">
        {displaySettings.showThumbnail && item.thumbnailPath && (<div className="flex justify-center">
            <img src={(0, path_1.getPrivateUrl)(item.thumbnailPath)} alt={(_l = item.itemDescription) !== null && _l !== void 0 ? _l : ""} className="w-full h-auto rounded-lg"/>
          </div>)}

        <react_1.HStack className="justify-start space-x-2">
          <lu_1.LuCirclePlay className="text-muted-foreground shrink-0"/>
          <span className="text-sm line-clamp-1">{item.jobReadableId}</span>
        </react_1.HStack>

        {/* Parts to pick — the reason this operation is on the picking schedule */}
        <react_1.HStack className="justify-start space-x-2 font-medium">
          <lu_1.LuPackage className="text-muted-foreground shrink-0"/>
          <span className="text-sm tabular-nums">
            {Number(item.partsToPickCount).toLocaleString()}{" "}
            {Number(item.partsToPickCount) === 1 ? "part" : "parts"} ·{" "}
            {Number(item.totalQuantityToPick).toLocaleString()} to pick
          </span>
        </react_1.HStack>

        {displaySettings.showDescription && item.operationDescription && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuClipboardCheck className="text-muted-foreground shrink-0"/>
            <span className="text-sm line-clamp-1">
              {item.operationDescription}
            </span>
          </react_1.HStack>)}

        {displaySettings.showStatus && status && (<react_1.HStack className="justify-start space-x-1.5">
            <JobOperationStatus_1.JobOperationStatus operation={{
                id: item.jobOperationId,
                // @ts-expect-error status is a string union at runtime
                status: status,
                jobId: item.jobId
            }} className="size-4 p-0 hover:bg-transparent"/>
            <span className="text-sm">{status}</span>
          </react_1.HStack>)}

        {displaySettings.showDuration && item.duration > 0 && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuTimer className="text-muted-foreground shrink-0"/>
            <span className="text-sm tabular-nums">
              {(0, utils_1.formatDurationMilliseconds)(item.duration)}
            </span>
          </react_1.HStack>)}

        {displaySettings.showDueDate && item.dueDate && (<react_1.HStack className="justify-start space-x-2">
            {item.deadlineType &&
                (0, Deadline_1.getDeadlineIcon)(item.deadlineType)}
            <react_1.Tooltip>
              <react_1.TooltipTrigger>
                <span className={(0, react_1.cn)("text-sm tabular-nums", isOverdue ? "text-red-500" : "")}>
                  Due{" "}
                  {formatRelativeTime((0, utils_1.convertDateStringToIsoString)(item.dueDate))}
                </span>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent side="right">
                {formatDate(item.dueDate)}
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>)}

        {displaySettings.showSalesOrder &&
            item.salesOrderReadableId &&
            item.salesOrderId &&
            item.salesOrderLineId && (<react_1.HStack className="justify-start space-x-2">
              <ri_1.RiProgress8Line className="text-muted-foreground shrink-0"/>
              <react_router_1.Link to={path_1.path.to.salesOrderLine(item.salesOrderId, item.salesOrderLineId)} onClick={function (e) { return e.stopPropagation(); }} className="text-sm">
                {item.salesOrderReadableId}
              </react_router_1.Link>
            </react_1.HStack>)}

        {displaySettings.showCustomer && item.customerId && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuSquareUser className="text-muted-foreground shrink-0"/>
            <components_1.CustomerAvatar customerId={item.customerId}/>
          </react_1.HStack>)}

        {displaySettings.showQuantity && Number(item.quantityScrapped) > 0 && (<react_1.HStack className="justify-start space-x-2 text-red-500">
            <lu_1.LuTrash className="size-4 shrink-0"/>
            <span className="text-sm tabular-nums">
              {item.quantityScrapped} Scrapped
            </span>
          </react_1.HStack>)}
      </react_1.CardContent>
    </react_1.Card>);
}
