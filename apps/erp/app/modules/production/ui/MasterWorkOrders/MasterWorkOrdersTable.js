"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var InlineEditor_1 = require("~/components/InlineEditor");
var Overlay_1 = require("~/components/Overlay");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var Deadline_1 = require("../Jobs/Deadline");
var jobLabels_1 = require("../Jobs/jobLabels");
var JobStatus_1 = require("../Jobs/JobStatus");
var JobStatusMenu_1 = require("../Jobs/JobStatusMenu");
// Master work orders are backed by a job; inline edits target that job via
// `idAccessor: (r) => r.jobId` on the shared job bulk-update action.
var JOB_UPDATE = {
    action: path_1.path.to.bulkUpdateJob,
    idKey: "ids"
};
var MasterWorkOrdersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, itemIdsWithConfigurationParameters = _a.itemIdsWithConfigurationParameters, bundleCountByMasterId = _a.bundleCountByMasterId, processCountByMasterId = _a.processCountByMasterId, cuttingProgressByMasterId = _a.cuttingProgressByMasterId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var revalidate = revalidator.revalidate;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var getDeadlineTypeLabel = (0, jobLabels_1.useDeadlineTypeLabel)();
    var customers = (0, stores_1.useCustomers)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var locations = (0, Location_1.useLocations)();
    // usePermissions() returns a fresh object each render, so depend on a stable
    // boolean instead — keeping it in the columns deps would recompute `columns`
    // every render and thrash the table into a re-render loop.
    var canUpdateProduction = permissions.can("update", "production");
    var configuredItemIds = (0, react_2.useMemo)(function () { return new Set(itemIdsWithConfigurationParameters); }, [itemIdsWithConfigurationParameters]);
    var openNew = (0, react_2.useCallback)(function () {
        openOverlay(Overlay_1.overlay.to.newMasterWorkOrder(), {
            onCreated: function () { return revalidator.revalidate(); }
        });
    }, [openOverlay, revalidator]);
    var openConfigTable = (0, react_2.useCallback)(function (e, jobId) {
        e.stopPropagation();
        openOverlay(Overlay_1.overlay.to.jobConfigTable({ jobId: jobId }), {
            onCreated: revalidate
        });
    }, [openOverlay, revalidate]);
    var openBundles = (0, react_2.useCallback)(function (e, masterWorkOrderId) {
        e.stopPropagation();
        openOverlay(Overlay_1.overlay.to.masterWorkOrderBundles({ masterWorkOrderId: masterWorkOrderId }));
    }, [openOverlay]);
    var openProcesses = (0, react_2.useCallback)(function (e, masterWorkOrderId) {
        e.stopPropagation();
        openOverlay(Overlay_1.overlay.to.masterWorkOrderProcesses({ masterWorkOrderId: masterWorkOrderId }));
    }, [openOverlay]);
    // Report cutting against the master's cutting operation (locked), then open
    // Split Batch prefilled with what was just cut.
    var openReportCutting = (0, react_2.useCallback)(function (e, masterWorkOrderId, progress) {
        e.stopPropagation();
        if (!progress.cuttingOperationId)
            return;
        openOverlay(Overlay_1.overlay.to.newProductionQuantity({
            jobId: progress.jobId,
            jobOperationId: progress.cuttingOperationId,
            lockOperation: true
        }), {
            onCreated: function () {
                revalidate();
                openOverlay(Overlay_1.overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId: masterWorkOrderId }), { onCreated: revalidate });
            }
        });
    }, [openOverlay, revalidate]);
    // Read-only config table of what's left to cut per color/size cell.
    var openRemainingConfig = (0, react_2.useCallback)(function (e, progress) {
        e.stopPropagation();
        if (!progress.itemId)
            return;
        openOverlay(Overlay_1.overlay.to.itemConfigTable({ itemId: progress.itemId }, { configuration: progress.remainingConfiguration }));
    }, [openOverlay]);
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        return [
            {
                accessorKey: "jobReadableId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ID"], ["ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.masterWorkOrder(row.original.id)}>
              {row.original.jobReadableId}
            </components_1.Hyperlink>);
                },
                meta: { icon: <lu_1.LuBookMarked /> }
            },
            {
                accessorKey: "readableIdWithRevision",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Style"], ["Style"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var label = (_b = row.original.readableIdWithRevision) !== null && _b !== void 0 ? _b : row.original.itemName;
                    return (<react_1.HStack>
                <components_1.ItemThumbnail size="md" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.itemType}/>
                <react_1.VStack spacing={0}>
                  {row.original.itemId ? (<components_1.Hyperlink to={path_1.path.to.style(row.original.itemId)}>
                      {label}
                    </components_1.Hyperlink>) : (label)}
                  <div className="w-full truncate text-muted-foreground text-xs">
                    {row.original.itemName}
                  </div>
                </react_1.VStack>
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuShirt /> }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var quantity = (_b = row.original.quantity) !== null && _b !== void 0 ? _b : 0;
                    var showConfig = !!row.original.itemId &&
                        !!row.original.jobId &&
                        configuredItemIds.has(row.original.itemId);
                    if (!showConfig)
                        return quantity;
                    var canConfigure = canUpdateProduction &&
                        !(0, production_models_1.isJobLocked)(row.original.status);
                    return (<react_1.HStack spacing={1}>
                <span className="line-clamp-1 tabular-nums">{quantity}</span>
                <react_1.IconButton type="button" icon={<lu_1.LuTable size="1em" strokeWidth={3}/>} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Configure quantities"], ["Configure quantities"])))} size="sm" variant="secondary" className={(0, react_1.cn)(quantity > 0 && "text-emerald-500 hover:text-emerald-500")} isDisabled={!canConfigure} onClick={function (e) { return openConfigTable(e, row.original.jobId); }}/>
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuHash />, renderTotal: true }
            },
            {
                id: "bundles",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Bundles"], ["Bundles"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var bundleCount = row.original.id
                        ? ((_b = bundleCountByMasterId[row.original.id]) !== null && _b !== void 0 ? _b : 0)
                        : 0;
                    return (<react_1.HStack spacing={1}>
                <span className="tabular-nums">{bundleCount}</span>
                {row.original.id ? (<react_1.IconButton type="button" icon={<lu_1.LuPackageOpen size="1em" strokeWidth={2.5}/>} aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["View bundles"], ["View bundles"])))} size="sm" variant="secondary" isDisabled={bundleCount === 0} onClick={function (e) { return openBundles(e, row.original.id); }}/>) : null}
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuPackageOpen /> }
            },
            {
                id: "processes",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Processes"], ["Processes"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var processCount = row.original.id
                        ? ((_b = processCountByMasterId[row.original.id]) !== null && _b !== void 0 ? _b : 0)
                        : 0;
                    return (<react_1.HStack spacing={1}>
                <span className="tabular-nums">{processCount}</span>
                {row.original.id ? (<react_1.IconButton type="button" icon={<lu_1.LuClipboardList size="1em" strokeWidth={2.5}/>} aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["View processes"], ["View processes"])))} size="sm" variant="secondary" isDisabled={processCount === 0} onClick={function (e) { return openProcesses(e, row.original.id); }}/>) : null}
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuClipboardList /> }
            },
            {
                id: "reported",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Reported"], ["Reported"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var progress = row.original.id
                        ? cuttingProgressByMasterId[row.original.id]
                        : undefined;
                    var canReport = canUpdateProduction &&
                        !(0, production_models_1.isJobLocked)(row.original.status) &&
                        !!(progress === null || progress === void 0 ? void 0 : progress.cuttingOperationId);
                    return (<react_1.HStack spacing={1}>
                <span className="tabular-nums">{(_b = progress === null || progress === void 0 ? void 0 : progress.reported) !== null && _b !== void 0 ? _b : 0}</span>
                {progress ? (<react_1.IconButton type="button" icon={<lu_1.LuScissors size="1em" strokeWidth={2.5}/>} aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Report Cutting"], ["Report Cutting"])))} size="sm" variant="secondary" isDisabled={!canReport} onClick={function (e) {
                                return openReportCutting(e, row.original.id, progress);
                            }}/>) : null}
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuCircleCheckBig /> }
            },
            {
                id: "remaining",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Remaining"], ["Remaining"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var progress = row.original.id
                        ? cuttingProgressByMasterId[row.original.id]
                        : undefined;
                    return (<react_1.HStack spacing={1}>
                <span className="tabular-nums">{(_b = progress === null || progress === void 0 ? void 0 : progress.remaining) !== null && _b !== void 0 ? _b : 0}</span>
                {(progress === null || progress === void 0 ? void 0 : progress.itemId) ? (<react_1.IconButton type="button" icon={<lu_1.LuTable size="1em" strokeWidth={2.5}/>} aria-label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["View remaining"], ["View remaining"])))} size="sm" variant="secondary" onClick={function (e) { return openRemainingConfig(e, progress); }}/>) : null}
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuCircleDashed /> }
            },
            {
                id: "customerId",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "customerId",
                    update: JOB_UPDATE,
                    idAccessor: function (r) { return r.jobId; },
                    value: function (r) { return r.customerId; },
                    options: (_a = customers === null || customers === void 0 ? void 0 : customers.map(function (c) { return ({ value: c.id, label: c.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.CustomerAvatar customerId={v}/>; }
                }),
                meta: {
                    icon: <lu_1.LuSquareUser />,
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ({
                            value: customer.id,
                            label: customer.name
                        }); })
                    },
                    isEmpty: function (row) { return !row.customerId; }
                }
            },
            {
                accessorKey: "salesOrderReadableId",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Sales Order"], ["Sales Order"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.salesOrderId && row.original.salesOrderLineId ? (<components_1.Hyperlink to={path_1.path.to.salesOrderLine(row.original.salesOrderId, row.original.salesOrderLineId)}>
                {row.original.salesOrderReadableId}
              </components_1.Hyperlink>) : null;
                },
                meta: {
                    icon: <lu_1.LuBookMarked />,
                    isEmpty: function (row) {
                        return !row.salesOrderId || !row.salesOrderReadableId;
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<JobStatusMenu_1.default job={__assign(__assign({}, row.original), { id: row.original.jobId, jobId: row.original.jobReadableId })}/>);
                },
                meta: {
                    icon: <lu_1.LuCirclePlay />,
                    filter: {
                        type: "static",
                        options: production_models_1.jobStatus.map(function (status) { return ({
                            label: <JobStatus_1.default status={status}/>,
                            value: status
                        }); })
                    }
                }
            },
            {
                id: "assignee",
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.jobId) !== null && _b !== void 0 ? _b : ""} table="job" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    isEmpty: function (row) { return !row.assignee; }
                }
            },
            {
                accessorKey: "startDate",
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Start Date"], ["Start Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "startDate",
                    update: JOB_UPDATE,
                    idAccessor: function (r) { return r.jobId; },
                    value: function (r) { return r.startDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: { icon: <lu_1.LuCalendar />, isEmpty: function (row) { return !row.startDate; } }
            },
            {
                accessorKey: "dueDate",
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "dueDate",
                    update: JOB_UPDATE,
                    idAccessor: function (r) { return r.jobId; },
                    value: function (r) { return r.dueDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: { icon: <lu_1.LuCalendar />, isEmpty: function (row) { return !row.dueDate; } }
            },
            {
                accessorKey: "deadlineType",
                header: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "deadlineType",
                    update: JOB_UPDATE,
                    idAccessor: function (r) { return r.jobId; },
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
                    icon: <lu_1.LuClock />,
                    filter: {
                        type: "static",
                        options: production_models_1.deadlineTypes.map(function (type) { return ({
                            value: type,
                            label: (<div className="flex gap-1 items-center">
                    {(0, Deadline_1.getDeadlineIcon)(type)}
                    <span>{getDeadlineTypeLabel(type)}</span>
                  </div>)
                        }); })
                    }
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack spacing={1} className="flex-wrap">
              {((_b = row.original.tags) !== null && _b !== void 0 ? _b : []).map(function (tag) { return (<react_1.Badge key={tag} variant="secondary">
                  {tag}
                </react_1.Badge>); })}
            </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuTag />, isEmpty: function (row) { var _a; return !((_a = row.tags) === null || _a === void 0 ? void 0 : _a.length); } }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: JOB_UPDATE,
                    idAccessor: function (r) { return r.jobId; },
                    value: function (r) { return r.locationId; },
                    options: locations.map(function (l) { return ({
                        value: l.value,
                        label: typeof l.label === "string" ? l.label : String(l.label)
                    }); }),
                    renderInline: function (v, opts) {
                        var _a, _b, _c;
                        return (<Enumerable_1.Enumerable value={(_c = (_b = (_a = opts.find(function (o) { return o.value === v; })) === null || _a === void 0 ? void 0 : _a.label) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuMapPin />,
                    filter: {
                        type: "static",
                        options: locations.map(function (l) { return ({
                            value: l.value,
                            label: <Enumerable_1.Enumerable value={l.label}/>
                        }); })
                    },
                    isEmpty: function (row) { return !row.locationId; }
                }
            }
        ];
    }, [
        t,
        formatDate,
        customers,
        people,
        locations,
        getDeadlineTypeLabel,
        configuredItemIds,
        openConfigTable,
        canUpdateProduction,
        bundleCountByMasterId,
        openBundles,
        processCountByMasterId,
        openProcesses,
        cuttingProgressByMasterId,
        openReportCutting,
        openRemainingConfig
    ]);
    return (<components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={{
            left: ["jobReadableId", "readableIdWithRevision"]
        }} getRowHref={function (row) {
            return row.id ? path_1.path.to.masterWorkOrder(row.id) : undefined;
        }} primaryAction={permissions.can("create", "production") && (<react_1.Button type="button" variant="primary" leftIcon={<lu_1.LuCirclePlus />} onClick={openNew}>
              <macro_1.Trans>Master Work Order</macro_1.Trans>
            </react_1.Button>)} title={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Master Work Orders"], ["Master Work Orders"])))} table="masterWorkOrder" withSavedView withSelectableRows/>);
});
MasterWorkOrdersTable.displayName = "MasterWorkOrdersTable";
exports.default = MasterWorkOrdersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
