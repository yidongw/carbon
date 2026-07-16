"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Overlay_1 = require("~/components/Overlay");
var productionQuantityDisplay_utils_1 = require("~/modules/production/productionQuantityDisplay.utils");
var EditableCreatedAtCell_1 = require("~/modules/production/ui/EditableCreatedAtCell");
var ProductionQuantityDispositionDrawer_1 = require("~/modules/production/ui/Jobs/ProductionQuantityDispositionDrawer");
var ProductionQuantityReportReporter_1 = require("~/modules/production/ui/Jobs/ProductionQuantityReportReporter");
var ProductionQuantityTableCells_1 = require("~/modules/production/ui/ProductionQuantityTableCells");
var useEditableCreatedAt_1 = require("~/modules/production/ui/useEditableCreatedAt");
var path_1 = require("~/utils/path");
function ProductionQuantityApprovalActions(_a) {
    var _b, _c;
    var requestId = _a.requestId, reportId = _a.reportId, fetcher = _a.fetcher, onApprove = _a.onApprove, onReject = _a.onReject;
    var pendingId = (_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("approvalRequestId");
    var pendingIntent = (_c = fetcher.formData) === null || _c === void 0 ? void 0 : _c.get("intent");
    var isBusy = fetcher.state !== "idle";
    var isThisRow = isBusy && pendingId === requestId;
    return (<react_1.HStack spacing={1} className="justify-end" data-prevent-row-nav onClick={function (event) { return event.stopPropagation(); }} onPointerDown={function (event) { return event.stopPropagation(); }}>
      <react_1.Button type="button" size="sm" variant="primary" leftIcon={<lu_1.LuCircleCheck />} isDisabled={isBusy} isLoading={isThisRow && pendingIntent === "approve"} onClick={function () { return onApprove({ requestId: requestId, reportId: reportId }); }}>
        <macro_1.Trans>Approve</macro_1.Trans>
      </react_1.Button>
      <react_1.Button type="button" size="sm" variant="secondary" leftIcon={<lu_1.LuCircleX />} isDisabled={isBusy} isLoading={isThisRow && pendingIntent === "rejectWithCorrection"} onClick={function () { return onReject({ approvalRequestId: requestId, reportId: reportId }); }}>
        <macro_1.Trans>Reject</macro_1.Trans>
      </react_1.Button>
    </react_1.HStack>);
}
function rowStatus(row) {
    if (row.approvalStatus) {
        if (row.approvalStatus === "Pending")
            return "Pending";
        if (row.approvalStatus === "Approved")
            return "Approved";
        if (row.approvalStatus === "Rejected" ||
            row.approvalStatus === "Cancelled") {
            return "Rejected";
        }
    }
    if (row.invalidatedAt)
        return "Rejected";
    if (row.paymentYear != null)
        return "Approved";
    return "Pending";
}
var PENDING_FILTER = "approvalStatus:eq:Pending";
function DateRangeFilter(_a) {
    var _b, _c;
    var searchParams = _a.searchParams, navigate = _a.navigate, close = _a.close;
    var t = (0, macro_1.useLingui)().t;
    var betweenParam = searchParams
        .getAll("filter")
        .find(function (f) { return f.startsWith("createdAt:between:"); });
    var parts = betweenParam
        ? betweenParam.slice("createdAt:between:".length).split("|")
        : [];
    var _d = (0, react_2.useState)((_b = parts[0]) !== null && _b !== void 0 ? _b : ""), from = _d[0], setFrom = _d[1];
    var _e = (0, react_2.useState)((_c = parts[1]) !== null && _c !== void 0 ? _c : ""), to = _e[0], setTo = _e[1];
    var buildParams = function (addFilter) {
        var next = new URLSearchParams(searchParams);
        var rest = next
            .getAll("filter")
            .filter(function (f) { return !f.startsWith("createdAt:between:"); });
        next.delete("filter");
        for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
            var f = rest_1[_i];
            next.append("filter", f);
        }
        if (addFilter && (from || to))
            next.append("filter", "createdAt:between:".concat(from, "|").concat(to));
        next.delete("offset");
        navigate("?".concat(next.toString()));
        close();
    };
    var apply = function () { return buildParams(true); };
    var clear = function () { return buildParams(false); };
    return (<react_1.VStack spacing={2} className="p-2 min-w-[200px]">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["From"], ["From"])))}</p>
        <input type="date" value={from} onChange={function (e) { return setFrom(e.target.value); }} className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"/>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["To"], ["To"])))}</p>
        <input type="date" value={to} onChange={function (e) { return setTo(e.target.value); }} className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"/>
      </div>
      <react_1.HStack spacing={1}>
        <react_1.Button size="sm" variant="primary" onClick={apply}>
          <macro_1.Trans>Apply</macro_1.Trans>
        </react_1.Button>
        <react_1.Button size="sm" variant="ghost" onClick={clear}>
          <macro_1.Trans>Clear</macro_1.Trans>
        </react_1.Button>
      </react_1.HStack>
    </react_1.VStack>);
}
var ProductionQuantitiesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, status = _a.status, employees = _a.employees, _b = _a.jobs, jobs = _b === void 0 ? [] : _b, _c = _a.items, items = _c === void 0 ? [] : _c, _d = _a.operations, operations = _d === void 0 ? [] : _d, submitAction = _a.submitAction, pendingCount = _a.pendingCount, _e = _a.showCreateAction, showCreateAction = _e === void 0 ? false : _e, title = _a.title, _f = _a.embedded, embedded = _f === void 0 ? false : _f, _g = _a.configurableItemIds, configurableItemIds = _g === void 0 ? [] : _g;
    var t = (0, macro_1.useLingui)().t;
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var configurableItemIdSet = (0, react_2.useMemo)(function () { return new Set(configurableItemIds); }, [configurableItemIds]);
    var _h = (0, useEditableCreatedAt_1.useProductionQuantityReportCreatedAtSave)(), saveCreatedAt = _h.saveCreatedAt, canEdit = _h.canEdit;
    var fetcher = (0, react_router_1.useFetcher)();
    var correctionFetcher = (0, react_router_1.useFetcher)();
    var reportFetcher = (0, react_router_1.useFetcher)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var handledApproveRef = (0, react_2.useRef)(undefined);
    var handledCorrectionRef = (0, react_2.useRef)(undefined);
    var pendingRejectTargetRef = (0, react_2.useRef)(null);
    var _j = (0, react_2.useState)(null), rejectCorrection = _j[0], setRejectCorrection = _j[1];
    var _k = (0, react_2.useState)(null), pendingApprove = _k[0], setPendingApprove = _k[1];
    var closeRejectCorrection = (0, react_2.useCallback)(function () {
        pendingRejectTargetRef.current = null;
        setRejectCorrection(null);
    }, []);
    var openNewQuantity = (0, react_2.useCallback)(function () {
        openOverlay(Overlay_1.overlay.to.newProductionQuantity(), {
            onCreated: function () { return revalidator.revalidate(); }
        });
    }, [openOverlay, revalidator]);
    var openRejectCorrection = (0, react_2.useCallback)(function (target) {
        pendingRejectTargetRef.current = target;
        setRejectCorrection(null);
        void reportFetcher.load(path_1.path.to.productionQuantityReport(target.reportId));
    }, [reportFetcher]);
    var openApprove = (0, react_2.useCallback)(function (target) {
        setPendingApprove(target);
    }, []);
    var confirmApprove = (0, react_2.useCallback)(function () {
        if (!pendingApprove)
            return;
        var formData = new FormData();
        formData.set("intent", "approve");
        formData.set("approvalRequestId", pendingApprove.requestId);
        fetcher.submit(formData, { method: "post", action: submitAction });
        setPendingApprove(null);
    }, [fetcher, pendingApprove, submitAction]);
    var isPendingFilterActive = searchParams
        .getAll("filter")
        .includes(PENDING_FILTER);
    var togglePendingFilter = (0, react_2.useCallback)(function () {
        var next = new URLSearchParams(searchParams);
        var existing = next
            .getAll("filter")
            .filter(function (f) { return f !== PENDING_FILTER; });
        if (!isPendingFilterActive)
            existing.push(PENDING_FILTER);
        next.delete("filter");
        for (var _i = 0, existing_1 = existing; _i < existing_1.length; _i++) {
            var f = existing_1[_i];
            next.append("filter", f);
        }
        next.delete("offset");
        navigate("?".concat(next.toString()));
    }, [isPendingFilterActive, navigate, searchParams]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (reportFetcher.state !== "idle")
            return;
        if ((_a = reportFetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(reportFetcher.data.error);
            pendingRejectTargetRef.current = null;
            return;
        }
        var loadedReport = (_b = reportFetcher.data) === null || _b === void 0 ? void 0 : _b.report;
        var target = pendingRejectTargetRef.current;
        if (!loadedReport || !target || loadedReport.id !== target.reportId) {
            return;
        }
        setRejectCorrection({
            target: target,
            report: loadedReport,
            configurationParameters: (_c = reportFetcher.data) === null || _c === void 0 ? void 0 : _c.configurationParameters,
            itemId: (_e = (_d = reportFetcher.data) === null || _d === void 0 ? void 0 : _d.itemId) !== null && _e !== void 0 ? _e : null
        });
    }, [reportFetcher.state, reportFetcher.data]);
    (0, react_2.useEffect)(function () {
        if (fetcher.state !== "idle" || fetcher.data === undefined)
            return;
        if (handledApproveRef.current === fetcher.data)
            return;
        handledApproveRef.current = fetcher.data;
        if (fetcher.data.error) {
            react_1.toast.error(fetcher.data.error);
            return;
        }
        if (fetcher.data.ok) {
            react_1.toast.success(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Saved"], ["Saved"]))));
            revalidator.revalidate();
        }
    }, [fetcher.data, fetcher.state, revalidator, t]);
    (0, react_2.useEffect)(function () {
        if (correctionFetcher.state !== "idle" ||
            correctionFetcher.data === undefined) {
            return;
        }
        if (handledCorrectionRef.current === correctionFetcher.data)
            return;
        handledCorrectionRef.current = correctionFetcher.data;
        if (correctionFetcher.data.error) {
            react_1.toast.error(correctionFetcher.data.error);
            return;
        }
        if (correctionFetcher.data.ok) {
            react_1.toast.success(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Saved"], ["Saved"]))));
            closeRejectCorrection();
            revalidator.revalidate();
        }
    }, [
        closeRejectCorrection,
        correctionFetcher.data,
        correctionFetcher.state,
        revalidator,
        t
    ]);
    var columns = (0, react_2.useMemo)(function () {
        var cols = [
            {
                id: "type",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function () { return (<react_1.Badge variant="secondary">
              <macro_1.Trans>Production</macro_1.Trans>
            </react_1.Badge>); },
                meta: { icon: <lu_1.LuBriefcase /> }
            },
            {
                accessorKey: "employeeId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Employee"], ["Employee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.employeeId ? (<ProductionQuantityReportReporter_1.ProductionQuantityReportReporter employeeId={row.original.employeeId} createdBy={row.original.createdBy}/>) : ("—");
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    pluralHeader: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Employees"], ["Employees"]))),
                    filter: {
                        type: "static",
                        options: employees.map(function (employee) {
                            var _a;
                            return ({
                                value: employee.id,
                                label: ((_a = employee.name) === null || _a === void 0 ? void 0 : _a.trim()) || employee.id
                            });
                        }),
                        isArray: false
                    }
                }
            },
            {
                accessorKey: "jobId",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Job"], ["Job"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<ProductionQuantityTableCells_1.ProductionQuantityTableJobCell row={row.original}/>);
                },
                meta: {
                    icon: <lu_1.LuBriefcase />,
                    pluralHeader: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
                    filter: jobs.length
                        ? {
                            type: "static",
                            options: jobs.map(function (job) { return ({
                                value: job.id,
                                label: job.label
                            }); }),
                            isArray: false
                        }
                        : undefined
                }
            },
            {
                accessorKey: "itemId",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<ProductionQuantityTableCells_1.ProductionQuantityTableItemCell row={row.original}/>);
                },
                meta: {
                    icon: <ai_1.AiOutlinePartition />,
                    pluralHeader: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Items"], ["Items"]))),
                    filter: items.length
                        ? {
                            type: "static",
                            options: items.map(function (item) { return ({
                                value: item.id,
                                label: item.label
                            }); }),
                            isArray: false
                        }
                        : undefined
                }
            },
            {
                id: "operation",
                accessorKey: "processId",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Operation"], ["Operation"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<div className="text-sm">{(_b = (0, productionQuantityDisplay_utils_1.getProcessName)(row.original)) !== null && _b !== void 0 ? _b : "—"}</div>);
                },
                meta: {
                    icon: <lu_1.LuCog />,
                    pluralHeader: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Operations"], ["Operations"]))),
                    filter: operations.length
                        ? {
                            type: "static",
                            options: operations.map(function (op) { return ({
                                value: op.id,
                                label: op.label
                            }); }),
                            isArray: false
                        }
                        : undefined
                }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Qty"], ["Qty"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<ProductionQuantityTableCells_1.ProductionQuantityTableQuantityCell row={row.original} configurableItemIds={configurableItemIdSet} reportKind="productionQuantity"/>);
                },
                meta: {
                    icon: <lu_1.LuHash />,
                    renderTotal: true
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Reported"], ["Reported"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<EditableCreatedAtCell_1.EditableCreatedAtCell createdAt={row.original.createdAt} row={row.original} onSave={saveCreatedAt} canEdit={canEdit}/>);
                },
                meta: {
                    icon: <lu_1.LuCalendar />,
                    filter: {
                        type: "custom",
                        render: function (_a) {
                            var close = _a.close;
                            return (<DateRangeFilter searchParams={searchParams} navigate={navigate} close={close}/>);
                        },
                        getLabel: function (value) {
                            var _a = value.split("|"), from = _a[0], to = _a[1];
                            return [from, to].filter(Boolean).join(" – ");
                        }
                    }
                }
            },
            {
                id: "approvalStatus",
                accessorKey: "approvalStatus",
                accessorFn: function (row) { return rowStatus(row); },
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var s = rowStatus(row.original);
                    var variant = s === "Approved"
                        ? "green"
                        : s === "Rejected"
                            ? "red"
                            : "secondary";
                    return <react_1.Badge variant={variant}>{s}</react_1.Badge>;
                },
                meta: {
                    icon: <lu_1.LuCircleCheck />,
                    filter: {
                        type: "static",
                        options: [
                            {
                                value: "Pending",
                                label: <react_1.Badge variant="secondary">Pending</react_1.Badge>
                            },
                            {
                                value: "Approved",
                                label: <react_1.Badge variant="green">Approved</react_1.Badge>
                            },
                            {
                                value: "Rejected",
                                label: <react_1.Badge variant="red">Rejected</react_1.Badge>
                            }
                        ],
                        isArray: false
                    }
                }
            }
        ];
        if (status === "pending" || status === "all") {
            cols.push({
                id: "actions",
                header: function () { return <span className="sr-only">{t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Actions"], ["Actions"])))}</span>; },
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var requestId = row.original.approvalRequestId;
                    var reportId = (_b = row.original.reportId) !== null && _b !== void 0 ? _b : row.original.id;
                    var showActions = requestId &&
                        row.original.canApprove &&
                        rowStatus(row.original) === "Pending";
                    if (!showActions)
                        return null;
                    return (<ProductionQuantityApprovalActions requestId={requestId} reportId={reportId} fetcher={fetcher} onApprove={openApprove} onReject={openRejectCorrection}/>);
                },
                meta: {
                    cellClassName: "overflow-visible max-w-none whitespace-normal"
                }
            });
        }
        return cols;
    }, [
        canEdit,
        configurableItemIdSet,
        employees,
        fetcher,
        items,
        jobs,
        navigate,
        openApprove,
        openRejectCorrection,
        operations,
        saveCreatedAt,
        searchParams,
        status,
        t
    ]);
    return (<>
        <components_1.Table data={data} count={count} columns={columns} table="productionPayApproval" primaryAction={!embedded && showCreateAction ? (<react_1.Button type="button" variant="primary" leftIcon={<lu_1.LuPlus />} onClick={openNewQuantity}>
                <macro_1.Trans>Process Completion</macro_1.Trans>
              </react_1.Button>) : undefined} filterActions={!embedded ? (<react_1.Button type="button" variant={isPendingFilterActive ? "primary" : "secondary"} onClick={togglePendingFilter}>
                <macro_1.Trans>Pending</macro_1.Trans>
                {pendingCount != null && pendingCount > 0 && (<span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none min-w-[1.25rem] h-5 px-1 pointer-events-none">
                    {pendingCount}
                  </span>)}
              </react_1.Button>) : undefined} withSearch={!embedded} withPagination title={embedded ? undefined : (title !== null && title !== void 0 ? title : t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Process Completions"], ["Process Completions"]))))}/>
        <react_1.Modal open={pendingApprove != null} onOpenChange={function (open) {
            if (!open)
                setPendingApprove(null);
        }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Confirm Approval</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>
                  Are you sure you want to approve this production completion?
                </macro_1.Trans>
              </p>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={function () { return setPendingApprove(null); }}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button variant="primary" leftIcon={<lu_1.LuCircleCheck />} onClick={confirmApprove}>
                <macro_1.Trans>Approve</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>
        {rejectCorrection ? (<ProductionQuantityDispositionDrawer_1.ProductionQuantityDispositionDrawer report={rejectCorrection.report} configurationParameters={rejectCorrection.configurationParameters} itemId={rejectCorrection.itemId} open onClose={closeRejectCorrection} onSaved={function () {
                closeRejectCorrection();
                revalidator.revalidate();
            }} saveAction={submitAction} saveMethod="POST" title={<macro_1.Trans>Correct quantities</macro_1.Trans>} getSaveBody={function (payload) {
                var formData = new FormData();
                formData.set("intent", "rejectWithCorrection");
                formData.set("approvalRequestId", rejectCorrection.target.approvalRequestId);
                formData.set("lines", JSON.stringify(payload.lines));
                if (payload.notes) {
                    formData.set("notes", payload.notes);
                }
                return formData;
            }} fetcher={correctionFetcher}/>) : null}
      </>);
});
ProductionQuantitiesTable.displayName = "ProductionQuantitiesTable";
exports.default = ProductionQuantitiesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
