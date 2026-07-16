"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCard = ItemCard;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var macro_1 = require("@lingui/react/macro");
var class_variance_authority_1 = require("class-variance-authority");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var useTags_1 = require("~/hooks/useTags");
var Deadline_1 = require("~/modules/production/ui/Jobs/Deadline");
var JobOperationStatus_1 = require("~/modules/production/ui/Jobs/JobOperationStatus");
var jobLabels_1 = require("~/modules/production/ui/Jobs/jobLabels");
var path_1 = require("~/utils/path");
var KanbanContext_1 = require("../context/KanbanContext");
var cardVariants = (0, class_variance_authority_1.cva)("bg-card hover:bg-muted/30 dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]", {
    variants: {
        highlighted: {
            true: "ring-2 ring-primary opacity-100",
            false: ""
        },
        dragging: {
            over: "ring-2 ring-primary opacity-30",
            overlay: "ring-2 ring-primary hover:bg-muted"
        },
        status: {
            "In Progress": "border-emerald-600/30",
            Ready: "",
            Done: "",
            Paused: "",
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
function ItemCard(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var item = _a.item, isOverlay = _a.isOverlay, progressByItemId = _a.progressByItemId;
    var t = (0, macro_1.useLingui)().t;
    var getJobOperationStatusLabel = (0, jobLabels_1.useJobOperationStatusLabel)();
    var _q = (0, hooks_1.useDateFormatter)(), formatDate = _q.formatDate, formatRelativeTime = _q.formatRelativeTime;
    var _r = (0, KanbanContext_1.useKanban)(), displaySettings = _r.displaySettings, selectedGroup = _r.selectedGroup, setSelectedGroup = _r.setSelectedGroup, tags = _r.tags;
    var _s = (0, sortable_1.useSortable)({
        id: item.id,
        data: {
            type: "item",
            item: item
        },
        attributes: {
            roleDescription: "item"
        }
    }), setNodeRef = _s.setNodeRef, attributes = _s.attributes, listeners = _s.listeners, transform = _s.transform, transition = _s.transition, isDragging = _s.isDragging;
    var isHighlighted = selectedGroup === item.jobReadableId;
    var style = {
        transition: transition,
        transform: utilities_1.CSS.Translate.toString(transform)
    };
    var isOverdue = item.deadlineType !== "No Deadline" && item.dueDate
        ? new Date(item.dueDate) < new Date()
        : false;
    var progress = (_c = (_b = progressByItemId[item.id]) === null || _b === void 0 ? void 0 : _b.progress) !== null && _c !== void 0 ? _c : 0;
    var status = ((_d = progressByItemId[item.id]) === null || _d === void 0 ? void 0 : _d.active)
        ? "In Progress"
        : item.status;
    var employeeIds = ((_e = progressByItemId[item.id]) === null || _e === void 0 ? void 0 : _e.employees)
        ? Array.from(progressByItemId[item.id].employees)
        : undefined;
    return (<react_1.Card ref={setNodeRef} style={style} className={(0, react_1.cn)("max-w-[330px]", cardVariants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            // @ts-expect-error TS2322 - TODO: fix type
            status: status,
            highlighted: isHighlighted
        }))}>
      <react_1.CardHeader className="flex flex-col justify-between relative gap-2">
        <div className="flex w-full max-w-full justify-between items-start gap-0">
          <div className="flex flex-col space-y-0 min-w-0">
            {item.itemReadableId && (<span className="text-xs text-muted-foreground line-clamp-1">
                {item.itemReadableId}
              </span>)}
            <react_router_1.Link to={"".concat(item.link, "?selectedOperation=").concat(item.id)} className="mr-auto font-semibold line-clamp-2 leading-tight">
              {item.itemDescription || item.itemReadableId}
            </react_router_1.Link>
          </div>
          <react_1.HStack spacing={1} className="flex-shrink-0 -mr-2">
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Move item"], ["Move item"])))} icon={<lu_1.LuGripVertical />} variant={"ghost"} {...attributes} {...listeners} className="cursor-grab"/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                {item.link && (<react_1.DropdownMenuItem asChild>
                    <react_router_1.Link to={"".concat(item.link, "?selectedOperation=").concat(item.id)}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                      Edit Operation
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>)}
                <react_1.DropdownMenuItem onClick={function () {
            return setSelectedGroup === null || setSelectedGroup === void 0 ? void 0 : setSelectedGroup(isHighlighted ? null : item.jobReadableId);
        }} destructive={isHighlighted}>
                  <react_1.DropdownMenuIcon icon={isHighlighted ? <lu_1.LuFlashlightOff /> : <lu_1.LuFlashlight />}/>
                  {isHighlighted ? "Remove Highlight" : "Highlight Job"}
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem asChild>
                  <a href={path_1.path.to.external.mesJobOperation(item.id)}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuPlay />}/>
                    Open in MES
                  </a>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>
        </div>

        {displaySettings.showProgress &&
            Number.isFinite(progress) &&
            // @ts-expect-error TS2339 - TODO: fix type
            Number.isFinite(item === null || item === void 0 ? void 0 : item.duration) &&
            Number(progress) >= 0 &&
            // @ts-expect-error TS2339 - TODO: fix type
            Number(item === null || item === void 0 ? void 0 : item.duration) >= 0 && (<react_1.HStack>
              <react_1.BarProgress gradient invertGradient progress={Math.min(
            // @ts-expect-error TS2339 - TODO: fix type
            progress && item.duration
                ? // @ts-expect-error TS2339 - TODO: fix type
                    (progress / item.duration) * 100
                : 0, 100)}/>
              <lu_1.LuTimer className="text-muted-foreground w-4 h-4"/>
            </react_1.HStack>)}
        {displaySettings.showProgress &&
            Number.isFinite((_f = item.targetQuantity) !== null && _f !== void 0 ? _f : item.quantity) &&
            Number((_g = item.targetQuantity) !== null && _g !== void 0 ? _g : item.quantity) > 0 && (<react_1.HStack>
              <react_1.BarProgress segments={[
                {
                    value: (_h = item.quantityCompleted) !== null && _h !== void 0 ? _h : 0,
                    className: "bg-emerald-500"
                },
                {
                    value: (_j = item.quantityReworked) !== null && _j !== void 0 ? _j : 0,
                    className: "bg-yellow-500"
                },
                { value: (_k = item.quantityScrapped) !== null && _k !== void 0 ? _k : 0, className: "bg-red-500" }
            ]} max={((_l = item.targetQuantity) !== null && _l !== void 0 ? _l : item.quantity) || 1} progress={item.quantityCompleted &&
                ((_m = item.targetQuantity) !== null && _m !== void 0 ? _m : item.quantity)
                ? (item.quantityCompleted /
                    // @ts-expect-error TS2532 - TODO: fix type
                    ((_o = item.targetQuantity) !== null && _o !== void 0 ? _o : item.quantity)) *
                    100
                : 0}/>
              <lu_1.LuCircleCheck className="text-muted-foreground w-4 h-4"/>
            </react_1.HStack>)}
      </react_1.CardHeader>
      <react_1.CardContent className="gap-2 text-left whitespace-pre-wrap text-sm">
        {displaySettings.showThumbnail && item.thumbnailPath && (<div className="flex justify-center">
            <img src={(0, path_1.getPrivateUrl)(item.thumbnailPath)} alt={item.itemDescription} className="w-full h-auto rounded-lg"/>
          </div>)}
        <react_1.HStack className="justify-start space-x-2">
          <lu_1.LuCirclePlay className="text-muted-foreground"/>
          <span className="text-sm line-clamp-1">{item.title}</span>
          {item.reworkId && <react_1.Badge variant="red">Rework</react_1.Badge>}
        </react_1.HStack>
        {displaySettings.showDescription && item.description && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuClipboardCheck className="text-muted-foreground"/>
            <span className="text-sm line-clamp-1">{item.description}</span>
          </react_1.HStack>)}
        {displaySettings.showStatus && status && (<react_1.HStack className="justify-start space-x-1.5">
            <JobOperationStatus_1.JobOperationStatus operation={{
                id: item.id,
                // @ts-expect-error TS2322 - TODO: fix type
                status: status !== null && status !== void 0 ? status : "Todo",
                jobId: item.jobId
            }} className="size-4 p-0 hover:bg-transparent"/>
            <span className="text-sm">
              {getJobOperationStatusLabel(status)}
            </span>
          </react_1.HStack>)}
        {/* @ts-expect-error TS2339 */}
        {displaySettings.showDuration && typeof item.duration === "number" && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuTimer className="text-muted-foreground"/>
            <span className="text-sm">
              {/* @ts-expect-error TS2339 */}
              {(0, utils_1.formatDurationMilliseconds)(item.duration)}
            </span>
          </react_1.HStack>)}
        {displaySettings.showDueDate && item.deadlineType && (<react_1.HStack className="justify-start space-x-2">
            {(0, Deadline_1.getDeadlineIcon)(item.deadlineType)}
            <react_1.Tooltip>
              <react_1.TooltipTrigger>
                <span className={(0, react_1.cn)("text-sm", isOverdue ? "text-red-500" : "")}>
                  {["ASAP", "No Deadline"].includes(item.deadlineType)
                ? item.deadlineType
                : item.dueDate
                    ? "Due ".concat(formatRelativeTime((0, utils_1.convertDateStringToIsoString)(item.dueDate)))
                    : "–"}
                </span>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent side="right">{item.deadlineType}</react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>)}
        {displaySettings.showDueDate && item.dueDate && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuCalendarDays />
            <span className="text-sm">{formatDate(item.dueDate)}</span>
          </react_1.HStack>)}

        {displaySettings.showSalesOrder &&
            item.salesOrderReadableId &&
            item.salesOrderId &&
            item.salesOrderLineId && (<react_1.HStack className="justify-start space-x-2">
              <ri_1.RiProgress8Line className="text-muted-foreground"/>
              <react_router_1.Link to={path_1.path.to.salesOrderLine(item.salesOrderId, item.salesOrderLineId)} className="text-sm">
                {item.salesOrderReadableId}
              </react_router_1.Link>
            </react_1.HStack>)}

        {displaySettings.showCustomer && item.customerId && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuSquareUser className="text-muted-foreground"/>
            <components_1.CustomerAvatar customerId={item.customerId}/>
          </react_1.HStack>)}

        {displaySettings.showEmployee &&
            Array.isArray(employeeIds) &&
            employeeIds.length > 0 && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuUsers className="text-muted-foreground"/>
              <components_1.EmployeeAvatarGroup employeeIds={employeeIds}/>
            </react_1.HStack>)}

        {displaySettings.showQuantity && Number(item.quantityScrapped) > 0 && (<react_1.HStack className="justify-start space-x-2 text-red-500">
            <lu_1.LuTrash className="w-4 h-4"/>
            <span className="text-sm">{item.quantityScrapped} Scrapped</span>
          </react_1.HStack>)}
      </react_1.CardContent>
      <react_1.CardFooter className="items-center justify-between text-xs flex-wrap">
        <react_1.HStack>
          <components_1.Assignee table="jobOperation" id={item.id} size="sm" value={(_p = item.assignee) !== null && _p !== void 0 ? _p : undefined}/>
          <JobOperationTags operation={item} availableTags={tags}/>
        </react_1.HStack>
      </react_1.CardFooter>
    </react_1.Card>);
}
function JobOperationTags(_a) {
    var _b;
    var operation = _a.operation, availableTags = _a.availableTags;
    var onUpdateTags = (0, useTags_1.useTags)({ id: operation.id, table: "jobOperation" }).onUpdateTags;
    return (<form_1.ValidatedForm defaultValues={{
            tags: (_b = operation.tags) !== null && _b !== void 0 ? _b : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
      <Form_1.Tags availableTags={availableTags} label="" name="tags" table="operation" inline maxPreview={1} onChange={onUpdateTags}/>
    </form_1.ValidatedForm>);
}
var templateObject_1, templateObject_2;
