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
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Overlay_1 = require("~/components/Overlay");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var JobStatus_1 = require("../Jobs/JobStatus");
var JobStatusMenu_1 = require("../Jobs/JobStatusMenu");
var BundleWorkOrdersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, masterJobId = _a.masterJobId, masterWorkOrderId = _a.masterWorkOrderId, cuttingOperationId = _a.cuttingOperationId, _b = _a.withHeader, withHeader = _b === void 0 ? true : _b;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var people = (0, stores_1.usePeople)()[0];
    var styles = (0, stores_1.useStyles)();
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        dateStyle: "medium",
        timeStyle: "short"
    });
    var rows = (0, react_2.useMemo)(function () { return data; }, [data]);
    var openReportCutting = (0, react_2.useCallback)(function () {
        if (!masterJobId || !cuttingOperationId)
            return;
        openOverlay(Overlay_1.overlay.to.newProductionQuantity({
            jobId: masterJobId,
            jobOperationId: cuttingOperationId,
            lockOperation: true
        }), {
            onCreated: function () {
                revalidator.revalidate();
                // After reporting cutting, open Split Batch to organize the bundles.
                if (masterWorkOrderId) {
                    openOverlay(Overlay_1.overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId: masterWorkOrderId }), { onCreated: function () { return revalidator.revalidate(); } });
                }
            }
        });
    }, [
        openOverlay,
        revalidator,
        masterJobId,
        cuttingOperationId,
        masterWorkOrderId
    ]);
    var openProcesses = (0, react_2.useCallback)(function (e, bundleWorkOrderId) {
        e.stopPropagation();
        openOverlay(Overlay_1.overlay.to.bundleWorkOrderProcesses({ bundleWorkOrderId: bundleWorkOrderId }));
    }, [openOverlay]);
    var openSplitBatch = (0, react_2.useCallback)(function () {
        if (!masterWorkOrderId)
            return;
        openOverlay(Overlay_1.overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId: masterWorkOrderId }), {
            onCreated: function () { return revalidator.revalidate(); }
        });
    }, [openOverlay, revalidator, masterWorkOrderId]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "jobReadableId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Bundle"], ["Bundle"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.bundleWorkOrder(row.original.id)}>
              {row.original.jobReadableId}
            </components_1.Hyperlink>);
                },
                meta: { icon: <lu_1.LuPackageOpen /> }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.quantity;
                },
                meta: { icon: <lu_1.LuHash /> }
            },
            {
                id: "processes",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Processes"], ["Processes"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var processCount = (_b = row.original.processCount) !== null && _b !== void 0 ? _b : 0;
                    return (<react_1.HStack spacing={1}>
                <span className="tabular-nums">{processCount}</span>
                {row.original.id ? (<react_1.IconButton type="button" icon={<lu_1.LuClipboardList size="1em" strokeWidth={2.5}/>} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["View processes"], ["View processes"])))} size="sm" variant="secondary" isDisabled={processCount === 0} onClick={function (e) { return openProcesses(e, row.original.id); }}/>) : null}
              </react_1.HStack>);
                },
                meta: { icon: <lu_1.LuClipboardList /> }
            },
            {
                id: "assignee",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.jobId) !== null && _b !== void 0 ? _b : ""} table="job" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                accessorKey: "assignedAt",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Assigned At"], ["Assigned At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.assignedAt
                        ? dateFormatter.format(new Date(row.original.assignedAt))
                        : "—";
                },
                meta: { icon: <lu_1.LuClock /> }
            },
            {
                accessorKey: "status",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Status"], ["Status"]))),
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
                accessorKey: "readableIdWithRevision",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Style"], ["Style"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = row.original.readableIdWithRevision) !== null && _b !== void 0 ? _b : row.original.itemName;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: styles.map(function (style) { return ({
                            value: style.readableIdWithRevision,
                            label: style.readableIdWithRevision
                        }); })
                    },
                    icon: <lu_1.LuShirt />
                }
            },
            {
                accessorKey: "colorCode",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Color"], ["Color"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.colorName || row.original.colorCode || "—";
                },
                meta: { icon: <lu_1.LuPalette /> }
            },
            {
                accessorKey: "sizeCode",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Size"], ["Size"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = row.original.sizeCode) !== null && _b !== void 0 ? _b : "—";
                },
                meta: { icon: <lu_1.LuRuler /> }
            }
        ];
    }, [t, people, styles, dateFormatter, openProcesses]);
    return (<components_1.Table data={data} columns={columns} count={count} defaultColumnPinning={{ left: ["jobReadableId"] }} getRowHref={function (row) {
            return row.id ? path_1.path.to.bundleWorkOrder(row.id) : undefined;
        }} primaryAction={cuttingOperationId &&
            permissions.can("update", "production") ? (<react_1.HStack spacing={2}>
              <react_1.Button leftIcon={<lu_1.LuScissors />} variant="secondary" onClick={openReportCutting}>
                {t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Report Cutting"], ["Report Cutting"])))}
              </react_1.Button>
              {masterWorkOrderId ? (<react_1.Button leftIcon={<lu_1.LuSplit />} variant="secondary" onClick={openSplitBatch}>
                  {t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Split Batch"], ["Split Batch"])))}
                </react_1.Button>) : null}
            </react_1.HStack>) : undefined} title={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Bundle Work Orders"], ["Bundle Work Orders"])))} table="bundleWorkOrder" withHeader={withHeader} withSavedView withSelectableRows/>);
});
BundleWorkOrdersTable.displayName = "BundleWorkOrdersTable";
exports.default = BundleWorkOrdersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
