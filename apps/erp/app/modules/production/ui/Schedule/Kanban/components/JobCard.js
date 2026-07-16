"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobCard = JobCard;
var react_1 = require("@carbon/react");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var class_variance_authority_1 = require("class-variance-authority");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var Deadline_1 = require("~/modules/production/ui/Jobs/Deadline");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var JobStatus_1 = require("../../../Jobs/JobStatus");
var KanbanContext_1 = require("../context/KanbanContext");
var DATE_COLUMN_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
function getDateOnly(value) {
    var _a;
    return (_a = value === null || value === void 0 ? void 0 : value.split("T")[0]) !== null && _a !== void 0 ? _a : null;
}
function getOptimisticColumnId(dueDate, columnIds) {
    if (columnIds.includes(dueDate)) {
        return dueDate;
    }
    if (columnIds.includes("next-week")) {
        return "next-week";
    }
    if (columnIds.includes("next-month")) {
        var selectedDate = (0, date_1.parseDate)(dueDate);
        var dateColumns = columnIds
            .filter(function (id) { return DATE_COLUMN_PATTERN.test(id); })
            .sort();
        for (var _i = 0, dateColumns_1 = dateColumns; _i < dateColumns_1.length; _i++) {
            var columnId = dateColumns_1[_i];
            var weekStart = (0, date_1.parseDate)(columnId);
            var weekEnd = weekStart.add({ days: 6 });
            if (selectedDate.compare(weekStart) >= 0 &&
                selectedDate.compare(weekEnd) <= 0) {
                return columnId;
            }
        }
        return "next-month";
    }
    return dueDate;
}
function getEmptyDueDateColumnId(columnIds, fallbackColumnId) {
    if (columnIds.includes("next-week")) {
        return "next-week";
    }
    if (columnIds.includes("next-month")) {
        return "next-month";
    }
    return fallbackColumnId;
}
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
            Draft: "border-border",
            Planned: "border-yellow-500/30",
            Ready: "border-blue-500/30",
            "In Progress": "border-emerald-600/30",
            Paused: "border-orange-500/30",
            Completed: "border-green-500/30",
            Closed: "border-border",
            Cancelled: "border-red-500/30",
            Overdue: "border-red-500/50",
            "Due Today": "border-orange-500/50"
        }
    },
    defaultVariants: {
        status: "Planned"
    }
});
function JobCard(_a) {
    var _b, _c, _d, _e, _f, _g;
    var item = _a.item, isOverlay = _a.isOverlay, progressByItemId = _a.progressByItemId;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var submit = (0, react_router_1.useSubmit)();
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _h = (0, KanbanContext_1.useKanban)(), displaySettings = _h.displaySettings, selectedGroup = _h.selectedGroup, setSelectedGroup = _h.setSelectedGroup, tags = _h.tags, columnIds = _h.columnIds;
    var _j = (0, sortable_1.useSortable)({
        id: item.id,
        data: {
            type: "item",
            item: item
        },
        attributes: {
            roleDescription: "item"
        }
    }), setNodeRef = _j.setNodeRef, attributes = _j.attributes, listeners = _j.listeners, transform = _j.transform, transition = _j.transition, isDragging = _j.isDragging;
    var isHighlighted = selectedGroup === item.jobReadableId;
    var style = {
        transition: transition,
        transform: utilities_1.CSS.Translate.toString(transform)
    };
    var status = ((_b = progressByItemId[item.id]) === null || _b === void 0 ? void 0 : _b.active)
        ? "In Progress"
        : item.status;
    var employeeIds = ((_c = progressByItemId[item.id]) === null || _c === void 0 ? void 0 : _c.employees)
        ? Array.from(progressByItemId[item.id].employees)
        : undefined;
    var customers = (0, stores_1.useCustomers)()[0];
    var customer = customers.find(function (s) { return s.id === item.customerId; });
    var dueDate = getDateOnly(item.dueDate);
    var isDueDateValid = Boolean(dueDate && DATE_COLUMN_PATTERN.test(dueDate));
    var dueDateValue = isDueDateValid && dueDate ? dueDate : null;
    var scheduleColumnIds = columnIds !== null && columnIds !== void 0 ? columnIds : [];
    function submitDueDate(nextDueDate) {
        var columnId = nextDueDate
            ? nextDueDate
            : getEmptyDueDateColumnId(scheduleColumnIds, item.columnId);
        var optimisticColumnId = nextDueDate
            ? getOptimisticColumnId(nextDueDate, scheduleColumnIds)
            : columnId;
        submit({
            id: item.id,
            columnId: columnId,
            optimisticColumnId: optimisticColumnId,
            priority: item.priority
        }, {
            method: "post",
            action: path_1.path.to.scheduleDatesUpdate,
            navigate: false,
            fetcherKey: "job:".concat(item.id)
        });
    }
    var isOverdue = (item.dueDate &&
        status !== "Completed" &&
        new Date(item.dueDate) < new Date()) ||
        (item.dueDate &&
            item.completedDate &&
            status === "Completed" &&
            item.completedDate.split("T")[0] > item.dueDate);
    return (<react_1.Card ref={setNodeRef} style={style} className={(0, react_1.cn)("max-w-[330px]", item.hasConflict && "border-red-500 border-2", cardVariants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            status: status,
            highlighted: isHighlighted
        }))}>
      <react_1.CardHeader className="flex flex-col justify-between relative gap-2">
        <div className="flex w-full max-w-full justify-between items-start gap-0">
          <div className="flex flex-col gap-0.5 space-y-0 min-w-0">
            {item.itemReadableId && (<span className="text-xs text-muted-foreground line-clamp-1">
                {(item === null || item === void 0 ? void 0 : item.description) || item.itemReadableId}
              </span>)}
            <react_1.HStack spacing={1} className="items-center">
              <react_router_1.Link to={(_d = item.link) !== null && _d !== void 0 ? _d : path_1.path.to.jobMethod(item.jobId, item.jobMakeMethodId)} className="mr-auto font-semibold line-clamp-2 leading-tight">
                {item.jobReadableId}
              </react_router_1.Link>
              {item.hasConflict && (<react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <lu_1.LuTriangleAlert className="h-4 w-4 text-red-500 flex-shrink-0"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    Scheduling conflict: operations cannot meet due date
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
            </react_1.HStack>
            {customer && displaySettings.showCustomer && (<span className="text-xs text-muted-foreground line-clamp-1">
                {customer.name}
              </span>)}
          </div>
          <react_1.HStack spacing={1} className="flex-shrink-0 -mr-2">
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Move item"], ["Move item"])))} icon={<lu_1.LuGripVertical />} variant={"ghost"} {...attributes} {...listeners} className="cursor-grab"/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                {item.link && (<react_1.DropdownMenuItem asChild>
                    <react_router_1.Link to={item.link}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                      Edit Job
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>)}
                <react_1.DropdownMenuItem onClick={function () {
            return setSelectedGroup === null || setSelectedGroup === void 0 ? void 0 : setSelectedGroup(isHighlighted ? null : item.jobReadableId);
        }} destructive={isHighlighted}>
                  <react_1.DropdownMenuIcon icon={isHighlighted ? <lu_1.LuFlashlightOff /> : <lu_1.LuFlashlight />}/>
                  {isHighlighted ? "Remove Highlight" : "Highlight Job"}
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.HStack>
        </div>

        {displaySettings.showProgress &&
            Number.isFinite(item.progress) &&
            Number(item.progress) >= 0 && (<react_1.HStack>
              <react_1.BarProgress activeClassName={status === "Completed" ? "bg-emerald-500" : "bg-blue-500"} progress={Math.min(((_e = item.progress) !== null && _e !== void 0 ? _e : 0) * 100, 100)}/>
              <lu_1.LuClock className="text-muted-foreground w-4 h-4"/>
            </react_1.HStack>)}
      </react_1.CardHeader>
      <react_1.CardContent className="gap-2 text-left whitespace-pre-wrap text-sm">
        {displaySettings.showThumbnail && item.thumbnailPath && (<div className="flex justify-center">
            <img src={(0, path_1.getPrivateUrl)(item.thumbnailPath)} alt={item.itemDescription} className="w-full h-auto rounded-lg"/>
          </div>)}
        {displaySettings.showStatus && status && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuStar className="text-muted-foreground"/>
            <JobStatus_1.default status={status} className="flex-shrink-0"/>
            {isOverdue && (<JobStatus_1.default status="Overdue" className="flex-shrink-0"/>)}
          </react_1.HStack>)}
        <react_1.HStack className="justify-start space-x-2">
          <ai_1.AiOutlinePartition className="text-muted-foreground"/>
          <span className="text-sm line-clamp-1">{item.itemReadableId}</span>
        </react_1.HStack>

        {displaySettings.showDueDate && item.deadlineType && (<react_1.HStack className="justify-start space-x-2">
            {(0, Deadline_1.getDeadlineIcon)(item.deadlineType)}
            <react_1.Tooltip>
              <react_1.TooltipTrigger>
                <span className="text-sm">{item.deadlineType}</span>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent side="right">{item.deadlineType}</react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>)}
        {displaySettings.showDueDate && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuCalendarDays />
            <react_1.DatePicker value={dueDateValue ? (0, date_1.parseDate)(dueDateValue) : null} isPreviewInline inline={dueDateValue ? (<span className="text-sm">{formatDate(dueDateValue)}</span>) : (<span className="text-sm text-muted-foreground">
                    {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Set due date"], ["Set due date"])))}
                  </span>)} onChange={function (value) {
                var _a;
                submitDueDate((_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : null);
            }}/>
          </react_1.HStack>)}
        {displaySettings.showDueDate && item.completedDate && (<react_1.HStack className="justify-start space-x-2">
            <lu_1.LuCircleCheck className="text-emerald-500"/>
            <span className="text-sm">
              Completed {formatDate(item.completedDate)}
            </span>
          </react_1.HStack>)}

        {displaySettings.showQuantity &&
            Number.isFinite(item.quantity) &&
            Number(item.quantity) > 0 && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuCircleCheck className="text-muted-foreground"/>
              <span className="text-sm">
                {(_f = item.quantityCompleted) !== null && _f !== void 0 ? _f : 0}/{item.quantity} completed
              </span>
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

        {displaySettings.showEmployee &&
            Array.isArray(employeeIds) &&
            employeeIds.length > 0 && (<react_1.HStack className="justify-start space-x-2">
              <lu_1.LuUsers className="text-muted-foreground"/>
              <components_1.EmployeeAvatarGroup employeeIds={employeeIds}/>
            </react_1.HStack>)}
      </react_1.CardContent>
      <react_1.CardFooter className="items-center justify-between text-xs flex-wrap">
        <react_1.HStack className="justify-start gap-2 w-full">
          <components_1.Assignee table="job" id={item.jobId} size="sm" value={(_g = item.assignee) !== null && _g !== void 0 ? _g : undefined}/>
        </react_1.HStack>
      </react_1.CardFooter>
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3;
