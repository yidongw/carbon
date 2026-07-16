"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var Overlay_1 = require("~/components/Overlay");
var cardCell_1 = require("~/components/Table/components/cardCell");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var Deadline_1 = require("./Deadline");
var JobStatus_1 = require("./JobStatus");
var JobStatusMenu_1 = require("./JobStatusMenu");
var jobLabels_1 = require("./jobLabels");
// Job inline edits go through the shared job bulk-update action.
var JOB_UPDATE = {
    action: path_1.path.to.bulkUpdateJob,
    idKey: "ids"
};
var defaultColumnVisibility = {
    description: false,
    createdAt: false,
    createdBy: false,
    updatedAt: false,
    updatedBy: false,
    orderQuantity: false,
    inventoryQuantity: false,
    productionQuantity: false,
    scrapQuantity: false,
    quantityComplete: false,
    quantityShipped: false,
    quantityReceivedToInventory: false
};
function formatReportedQuantity(n) {
    if (Number.isInteger(n))
        return String(n);
    return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}
var JobsTableSupplementalContext = (0, react_2.createContext)({
    currentProcessByJobId: {},
    trackedEntities: {},
    itemIdsWithConfigurationParameters: new Set()
});
function useJobsTableSupplemental() {
    return (0, react_2.useContext)(JobsTableSupplementalContext);
}
var JobIdCell = (0, react_2.memo)(function JobIdCell(_a) {
    var job = _a.job;
    var isCardCell = (0, cardCell_1.useIsCardCell)();
    return (<react_1.HStack>
      <components_1.ItemThumbnail size="md" thumbnailPath={job.thumbnailPath} 
    // @ts-ignore
    type={job.itemType}/>
      {isCardCell ? (<components_1.CardActionValue className="font-medium">{job.jobId}</components_1.CardActionValue>) : (<components_1.Hyperlink to={path_1.path.to.job(job.id)}>{job.jobId}</components_1.Hyperlink>)}
    </react_1.HStack>);
});
var RoutingProgressCell = (0, react_2.memo)(function RoutingProgressCell(_a) {
    var _b, _c, _d, _e;
    var job = _a.job, onOpenBillOfProcess = _a.onOpenBillOfProcess;
    var t = (0, macro_1.useLingui)().t;
    var isCardCell = (0, cardCell_1.useIsCardCell)();
    var completedOps = (_b = job.completedOperationCount) !== null && _b !== void 0 ? _b : 0;
    var totalOps = (_c = job.operationCount) !== null && _c !== void 0 ? _c : 0;
    var qtyThrough = (_d = job.quantityFullyComplete) !== null && _d !== void 0 ? _d : 0;
    var qtyTotal = (_e = job.quantity) !== null && _e !== void 0 ? _e : 0;
    var opsPct = totalOps > 0 ? (completedOps / totalOps) * 100 : 0;
    var qtyPct = qtyTotal > 0 ? (qtyThrough / qtyTotal) * 100 : 0;
    var opsLabel = "".concat(completedOps, "/").concat(totalOps);
    var qtyLabel = "".concat(qtyThrough, "/").concat(qtyTotal);
    var openBopPreview = function (e) {
        e.stopPropagation();
        if (job.id) {
            onOpenBillOfProcess(job.id);
        }
    };
    return (<react_1.HStack spacing={1} className="w-full md:w-[10.5rem] md:min-w-[10.5rem]">
      <react_1.Tooltip>
        <react_1.TooltipTrigger asChild>
          <div className="min-w-0 flex-1 cursor-help">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <lu_1.LuWorkflow className="h-3 w-3 flex-shrink-0 text-muted-foreground"/>
                <react_1.BarProgress className="flex-1 min-w-0" barHeight={6} gradient progress={opsPct} value={opsLabel}/>
              </div>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <lu_1.LuHash className="h-3 w-3 flex-shrink-0 text-muted-foreground"/>
                <react_1.BarProgress className="flex-1 min-w-0" barHeight={6} gradient progress={qtyPct} value={qtyLabel}/>
              </div>
            </div>
          </div>
        </react_1.TooltipTrigger>
        <react_1.TooltipContent side="left" className="max-w-xs text-xs">
          <div className="space-y-2 text-left">
            <p>
              {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Processes (", "/", "): operations marked Done."], ["Processes (", "/", "): operations marked Done."])), completedOps, totalOps)}
            </p>
            <p className="text-muted-foreground">
              {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quantity (", "/", "): completed quantity across all operations."], ["Quantity (", "/", "): completed quantity across all operations."])), qtyThrough, qtyTotal)}
            </p>
          </div>
        </react_1.TooltipContent>
      </react_1.Tooltip>
      <span className="shrink-0">
        <react_1.Tooltip>
          <react_1.TooltipTrigger asChild>
            <react_1.IconButton type="button" size="sm" variant="ghost" className="shrink-0" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["View bill of process"], ["View bill of process"])))} icon={<lu_1.LuMaximize2 />} isDisabled={!job.id} onClick={openBopPreview}/>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent side="left">
            <macro_1.Trans>View bill of process</macro_1.Trans>
          </react_1.TooltipContent>
        </react_1.Tooltip>
      </span>
      {isCardCell && job.id && (<button type="button" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["View bill of process"], ["View bill of process"])))} data-card-action className="absolute inset-0 z-[1] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={openBopPreview}/>)}
    </react_1.HStack>);
});
var CurrentProcessCell = (0, react_2.memo)(function CurrentProcessCell(_a) {
    var _b;
    var jobId = _a.jobId;
    var t = (0, macro_1.useLingui)().t;
    var currentProcessByJobId = useJobsTableSupplemental().currentProcessByJobId;
    var cp = currentProcessByJobId[jobId];
    if (!cp) {
        return <span className="text-muted-foreground tabular-nums">—</span>;
    }
    return (<div className="min-w-0 max-w-[14rem] flex flex-wrap items-baseline gap-x-1.5 md:flex-col md:items-start md:gap-x-0">
      <span className="truncate md:line-clamp-2 md:whitespace-normal text-sm leading-snug">
        {((_b = cp.description) === null || _b === void 0 ? void 0 : _b.trim()) || t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Untitled operation"], ["Untitled operation"])))}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
        <span className={(0, react_1.cn)("font-medium", cp.reportedTotal > 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-foreground")}>
          {formatReportedQuantity(cp.reportedTotal)}
        </span>{" "}
        {t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["reported"], ["reported"])))}
      </span>
    </div>);
});
var TrackingCell = (0, react_2.memo)(function TrackingCell(_a) {
    var job = _a.job;
    var trackedEntities = useJobsTableSupplemental().trackedEntities;
    if (!job.jobMakeMethodId || !trackedEntities[job.jobMakeMethodId]) {
        return null;
    }
    return (<react_1.Badge variant="secondary" className="items-center gap-1">
      <lu_1.LuQrCode />
      {trackedEntities[job.jobMakeMethodId]}
    </react_1.Badge>);
});
var JobQuantityCell = (0, react_2.memo)(function JobQuantityCell(_a) {
    var _b, _c, _d;
    var job = _a.job, onOpenConfigTable = _a.onOpenConfigTable;
    var t = (0, macro_1.useLingui)().t;
    var itemIdsWithConfigurationParameters = useJobsTableSupplemental().itemIdsWithConfigurationParameters;
    var permissions = (0, hooks_1.usePermissions)();
    var isCardCell = (0, cardCell_1.useIsCardCell)();
    var quantity = (_b = job.quantity) !== null && _b !== void 0 ? _b : 0;
    var quantityComplete = (_c = job.quantityComplete) !== null && _c !== void 0 ? _c : 0;
    var showConfiguredQuantityUi = !!job.itemId && itemIdsWithConfigurationParameters.has(job.itemId);
    if (showConfiguredQuantityUi) {
        var canConfigure = permissions.can("update", "production") && !(0, production_models_1.isJobLocked)(job.status);
        return (<react_1.HStack spacing={1} className="relative">
        <span className="line-clamp-1 tabular-nums">{quantity}</span>
        <react_1.IconButton type="button" icon={<lu_1.LuTable size="1em" strokeWidth={3}/>} aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Configure quantities"], ["Configure quantities"])))} size="sm" variant="secondary" className={(0, react_1.cn)(quantity > 0 && "text-emerald-500 hover:text-emerald-500")} isDisabled={!canConfigure} onClick={function (e) { return onOpenConfigTable(e, job); }}/>
        {isCardCell && canConfigure && (<button type="button" aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Configure quantities"], ["Configure quantities"])))} data-card-action className="absolute inset-0 z-[1] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={function (e) { return onOpenConfigTable(e, job); }}/>)}
      </react_1.HStack>);
    }
    if (["In Progress", "Released", "Paused"].includes((_d = job.status) !== null && _d !== void 0 ? _d : "")) {
        return (<react_1.BarProgress progress={(quantityComplete / quantity) * 100} value={"".concat(quantityComplete, "/").concat(quantity)}/>);
    }
    return quantity;
});
var JobsTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count, tags = _a.tags, currentProcessByJobId = _a.currentProcessByJobId, trackedEntities = _a.trackedEntities, itemIdsWithConfigurationParametersList = _a.itemIdsWithConfigurationParameters;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var getDeadlineTypeLabel = (0, jobLabels_1.useDeadlineTypeLabel)();
    var getJobStatusDisplayText = (0, JobStatus_1.useJobStatusDisplayText)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var params = (0, hooks_1.useUrlParams)()[0];
    var parts = (0, stores_1.useParts)();
    var tools = (0, stores_1.useTools)();
    var items = (0, react_2.useMemo)(function () { return __spreadArray(__spreadArray([], parts, true), tools, true); }, [parts, tools]);
    var people = (0, stores_1.usePeople)()[0];
    var customers = (0, stores_1.useCustomers)()[0];
    var locations = (0, Location_1.useLocations)();
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedJob = _c[0], setSelectedJob = _c[1];
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidate = (0, react_router_1.useRevalidator)().revalidate;
    var supplementalData = (0, react_2.useMemo)(function () { return ({
        currentProcessByJobId: currentProcessByJobId,
        trackedEntities: trackedEntities,
        itemIdsWithConfigurationParameters: new Set(itemIdsWithConfigurationParametersList)
    }); }, [
        currentProcessByJobId,
        trackedEntities,
        itemIdsWithConfigurationParametersList
    ]);
    var supplementalRef = (0, react_2.useRef)(supplementalData);
    supplementalRef.current = supplementalData;
    var openBillOfProcessPreview = (0, react_2.useCallback)(function (jobId) {
        openOverlay(Overlay_1.overlay.to.jobBillOfProcessPreview({ jobId: jobId }));
    }, [openOverlay]);
    var openConfigTable = (0, react_2.useCallback)(function (e, job) {
        e.stopPropagation();
        if (!job.id)
            return;
        openOverlay(Overlay_1.overlay.to.jobConfigTable({ jobId: job.id }), {
            onCreated: revalidate
        });
    }, [openOverlay, revalidate]);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    var onDelete = function (data) {
        setSelectedJob(data);
        deleteModal.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedJob(null);
        deleteModal.onClose();
    };
    var todaysDate = (0, react_2.useMemo)(function () { return (0, date_1.today)((0, date_1.getLocalTimeZone)()); }, []);
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("job");
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var defaultColumns = [
            {
                accessorKey: "jobId",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Job ID"], ["Job ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <JobIdCell job={row.original}/>;
                },
                meta: {
                    icon: <lu_1.LuBookMarked />,
                    cardRowNav: true,
                    cardRowNavLabel: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["View job"], ["View job"])))
                }
            },
            {
                accessorKey: "itemReadableIdWithRevision",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.VStack spacing={0}>
                {row.original.itemReadableIdWithRevision}
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.name}
                </div>
              </react_1.VStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: items === null || items === void 0 ? void 0 : items.map(function (item) { return ({
                            value: item.readableIdWithRevision,
                            label: item.readableIdWithRevision
                        }); })
                    },
                    icon: <ai_1.AiOutlinePartition />
                }
            },
            {
                id: "routingProgress",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Progress"], ["Progress"]))),
                size: 176,
                minSize: 176,
                cell: function (_a) {
                    var row = _a.row;
                    return (<RoutingProgressCell job={row.original} onOpenBillOfProcess={openBillOfProcessPreview}/>);
                },
                meta: {
                    icon: <lu_1.LuListChecks />,
                    cellClassName: "overflow-visible max-w-none whitespace-normal"
                }
            },
            {
                id: "currentProcess",
                size: 240,
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Current process"], ["Current process"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.id ? (<CurrentProcessCell jobId={row.original.id}/>) : null;
                },
                meta: {
                    icon: <lu_1.LuWorkflow />,
                    isEmpty: function (row) {
                        if (!row.id)
                            return true;
                        return !supplementalRef.current.currentProcessByJobId[row.id];
                    }
                }
            },
            {
                id: "trackedEntityId",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Tracking"], ["Tracking"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <TrackingCell job={row.original}/>;
                },
                meta: {
                    icon: <lu_1.LuQrCode />,
                    isEmpty: function (row) {
                        return !row.jobMakeMethodId ||
                            !supplementalRef.current.trackedEntities[row.jobMakeMethodId];
                    }
                }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<JobQuantityCell job={row.original} onOpenConfigTable={openConfigTable}/>);
                },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                id: "customerId",
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "customerId",
                    update: JOB_UPDATE,
                    value: function (r) { return r.customerId; },
                    options: (_a = customers === null || customers === void 0 ? void 0 : customers.map(function (c) { return ({ value: c.id, label: c.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.CustomerAvatar customerId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ({
                            value: customer.id,
                            label: customer.name
                        }); })
                    },
                    icon: <lu_1.LuSquareUser />,
                    isEmpty: function (row) { return !row.customerId; }
                }
            },
            {
                accessorKey: "salesOrderReadableId",
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return row.original.salesOrderId && row.original.salesOrderLineId ? (<components_1.Hyperlink to={path_1.path.to.salesOrderLine(row.original.salesOrderId, row.original.salesOrderLineId)}>
                {(_b = row.original) === null || _b === void 0 ? void 0 : _b.salesOrderReadableId}
              </components_1.Hyperlink>) : null;
                },
                meta: {
                    icon: <lu_1.LuBookMarked />,
                    filter: {
                        type: "fetcher",
                        endpoint: path_1.path.to.api.salesOrders,
                        transform: function (data) {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                                var salesOrderId = _a.salesOrderId;
                                return ({
                                    value: salesOrderId,
                                    label: salesOrderId
                                });
                            })) !== null && _a !== void 0 ? _a : [];
                        }
                    },
                    isEmpty: function (row) { return !row.salesOrderId || !row.salesOrderReadableId; }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var status = row.original.status;
                    var dueDate = row.original.dueDate;
                    return (<react_1.HStack spacing={1}>
                <JobStatusMenu_1.default job={row.original}/>
                {[
                            "Draft",
                            "Planned",
                            "In Progress",
                            "Ready",
                            "Paused"
                        ].includes(status !== null && status !== void 0 ? status : "") && (<>
                    {dueDate && (0, date_1.isSameDay)((0, date_1.parseDate)(dueDate), todaysDate) && (<JobStatus_1.default status="Due Today"/>)}
                    {dueDate && (0, date_1.parseDate)(dueDate) < todaysDate && (<JobStatus_1.default status="Overdue"/>)}
                  </>)}
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: production_models_1.jobStatus.map(function (status) { return ({
                            value: status,
                            // Render the translated text as children so the badge shows in
                            // the dropdown AND reactNodeToString extracts the translated
                            // label for the active-filter chip.
                            label: (<react_1.Status color={JobStatus_1.JOB_STATUS_COLOR_MAP[status]}>
                    {getJobStatusDisplayText(status)}
                  </react_1.Status>)
                        }); })
                    },
                    pluralHeader: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuUsers />
                }
            },
            {
                id: "assignee",
                header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="job" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />,
                    isEmpty: function (row) { return !row.assignee; }
                }
            },
            {
                accessorKey: "startDate",
                header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Start Date"], ["Start Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "startDate",
                    update: JOB_UPDATE,
                    value: function (r) { return r.startDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />,
                    isEmpty: function (row) { return !row.startDate; }
                }
            },
            {
                accessorKey: "dueDate",
                header: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "dueDate",
                    update: JOB_UPDATE,
                    value: function (r) { return r.dueDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />,
                    isEmpty: function (row) { return !row.dueDate; }
                }
            },
            {
                accessorKey: "deadlineType",
                header: t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "deadlineType",
                    update: JOB_UPDATE,
                    value: function (r) { return r.deadlineType; },
                    options: production_models_1.deadlineTypes.map(function (value) { return ({
                        value: value,
                        label: getDeadlineTypeLabel(value)
                    }); }),
                    renderInline: function (v) { return (<div className="flex items-center gap-1">
                {(0, Deadline_1.getDeadlineIcon)(v)}
                <span>
                  {getDeadlineTypeLabel(v)}
                </span>
              </div>); }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: production_models_1.deadlineTypes.map(function (type) { return ({
                            value: type,
                            label: (<div className="flex gap-1 items-center">
                    {(0, Deadline_1.getDeadlineIcon)(type)}
                    <span>{getDeadlineTypeLabel(type)}</span>
                  </div>)
                        }); })
                    },
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="job" availableTags={tags}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags === null || tags === void 0 ? void 0 : tags.map(function (tag) { return ({
                            value: tag.name,
                            label: <react_1.Badge variant="secondary">{tag.name}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />,
                    isEmpty: function (row) { var _a; return !((_a = row.tags) === null || _a === void 0 ? void 0 : _a.length); }
                }
            },
            {
                accessorKey: "orderQuantity",
                header: t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Order Qty"], ["Order Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "inventoryQuantity",
                header: t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Inventory Qty"], ["Inventory Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "productionQuantity",
                header: t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Production Qty"], ["Production Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "scrapQuantity",
                header: t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Scrap Qty"], ["Scrap Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "quantityComplete",
                header: t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Completed Qty"], ["Completed Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "quantityShipped",
                header: t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Shipped Qty"], ["Shipped Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "quantityReceivedToInventory",
                header: t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Received Qty"], ["Received Qty"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: JOB_UPDATE,
                    value: function (r) { return r.locationId; },
                    options: locations,
                    fallbackLabel: function (r) { return r.locationName; }
                }),
                meta: {
                    icon: <lu_1.LuMapPin />,
                    filter: {
                        type: "static",
                        options: locations.map(function (l) { return ({
                            value: l.value,
                            label: <Enumerable_1.Enumerable value={l.label}/>
                        }); })
                    }
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        customColumns,
        customers,
        formatDate,
        items,
        locations,
        openBillOfProcessPreview,
        openConfigTable,
        people,
        tags,
        getDeadlineTypeLabel,
        getJobStatusDisplayText,
        t,
        todaysDate
    ]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onBulkUpdate = (0, react_2.useCallback)(function (selectedRows, field, value) {
        var formData = new FormData();
        selectedRows.forEach(function (row) {
            if (row.id)
                formData.append("ids", row.id);
        });
        formData.append("field", field);
        if (value)
            formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateJob
        });
    }, []);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        return (<react_1.DropdownMenuContent align="end" className="min-w-[200px]">
            <react_1.DropdownMenuLabel>
              <macro_1.Trans>Update</macro_1.Trans>
            </react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuGroup>
              <react_1.DropdownMenuItem disabled={!permissions.can("delete", "production") ||
                selectedRows.some(function (row) {
                    var _a;
                    return ![
                        "Draft",
                        "Planned",
                        "Due Today",
                        "Overdue",
                        "Draft"
                    ].includes((_a = row.status) !== null && _a !== void 0 ? _a : "");
                })} destructive onClick={function () { return onBulkUpdate(selectedRows, "delete"); }}>
                <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
                <macro_1.Trans>Delete Jobs</macro_1.Trans>
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuGroup>
          </react_1.DropdownMenuContent>);
    }, [onBulkUpdate, permissions]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem onClick={function () {
            navigate(path_1.path.to.job(row.id));
        }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Job</macro_1.Trans>
          </react_1.MenuItem>
          {permissions.can("create", "production") && row.id ? (<react_1.MenuItem onClick={function () {
                openOverlay(Overlay_1.overlay.to.newJobProductionQuantity({ jobId: row.id }));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuHash />}/>
              <macro_1.Trans>Process Completion</macro_1.Trans>
            </react_1.MenuItem>) : null}
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "production")} onClick={function () { return onDelete(row); }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Job</macro_1.Trans>
          </react_1.MenuItem>
        </>); }, [navigate, openOverlay, params, permissions]);
    return (<>
        <JobsTableSupplementalContext.Provider value={supplementalData}>
          <components_1.Table data={data} defaultColumnVisibility={defaultColumnVisibility} defaultFeaturedColumns={["currentProcess", "routingProgress"]} defaultColumnPinning={{
            left: ["jobId", "itemReadableIdWithRevision"]
        }} columns={columns} count={count !== null && count !== void 0 ? count : 0} primaryAction={permissions.can("update", "resources") && (<components_1.New label={t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Job"], ["Job"])))} to={path_1.path.to.newJob}/>)} renderActions={renderActions} renderContextMenu={renderContextMenu} getRowHref={function (row) { return (row.id ? path_1.path.to.job(row.id) : undefined); }} title={t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Jobs"], ["Jobs"])))} table="job" withSavedView withSelectableRows/>
        </JobsTableSupplementalContext.Provider>

        {selectedJob && selectedJob.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteJob(selectedJob.id)} name={(_b = selectedJob === null || selectedJob === void 0 ? void 0 : selectedJob.jobId) !== null && _b !== void 0 ? _b : ""} text={"Are you sure you want to delete the job: ".concat(selectedJob === null || selectedJob === void 0 ? void 0 : selectedJob.jobId, "?")} isOpen={deleteModal.isOpen} onCancel={onDeleteCancel} onSubmit={onDeleteCancel}/>)}
      </>);
});
JobsTable.displayName = "JobsTable";
exports.default = JobsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38;
