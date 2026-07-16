"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var Overlay_1 = require("~/components/Overlay");
var hooks_1 = require("~/hooks");
var EditableCreatedAtCell_1 = require("~/modules/production/ui/EditableCreatedAtCell");
var ProductionQuantityTableCells_1 = require("~/modules/production/ui/ProductionQuantityTableCells");
var useEditableCreatedAt_1 = require("~/modules/production/ui/useEditableCreatedAt");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var ProductionQuantityReportReporter_1 = require("./ProductionQuantityReportReporter");
var jobLabels_1 = require("./jobLabels");
var productionQuantityLabels_1 = require("./productionQuantityLabels");
var ProductionQuantitiesTable = (0, react_2.memo)(function (_a) {
    var _b, _c, _d, _e, _f;
    var data = _a.data, count = _a.count, operations = _a.operations, scrapReasons = _a.scrapReasons, jobIdProp = _a.jobId;
    var params = (0, react_router_1.useParams)();
    var jobId = jobIdProp !== null && jobIdProp !== void 0 ? jobIdProp : params.jobId;
    var t = (0, macro_1.useLingui)().t;
    var typeLabel = (0, productionQuantityLabels_1.useProductionQuantityTypeLabel)();
    var styleProcessLabel = (0, jobLabels_1.useStyleProcessLabel)();
    // Look up whether an operation is the (style-identified) cutting op, so the
    // list shows a translated "Cutting" label instead of the raw description.
    var isCuttingById = (0, react_2.useMemo)(function () {
        var map = new Map();
        for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
            var op = operations_1[_i];
            map.set(op.id, Boolean(op.isCutting));
        }
        return map;
    }, [operations]);
    var operationLabel = (0, react_2.useCallback)(function (id, description) {
        var _a;
        return styleProcessLabel(description, id ? ((_a = isCuttingById.get(id)) !== null && _a !== void 0 ? _a : false) : false);
    }, [styleProcessLabel, isCuttingById]);
    if (!jobId)
        throw new Error("Job ID is required");
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var revalidator = (0, react_router_1.useRevalidator)();
    var permissions = (0, hooks_1.usePermissions)();
    var canUpdate = permissions.can("update", "production");
    var people = (0, stores_1.usePeople)()[0];
    var _g = (0, useEditableCreatedAt_1.useProductionQuantityLineCreatedAtSave)(), saveCreatedAt = _g.saveCreatedAt, canEdit = _g.canEdit;
    var openEdit = (0, react_2.useCallback)(function (quantityId) {
        if (!canUpdate)
            return;
        openOverlay(Overlay_1.overlay.to.editJobProductionQuantity({ jobId: jobId, quantityId: quantityId }), {
            onSuccess: function () { return revalidator.revalidate(); }
        });
    }, [canUpdate, jobId, openOverlay, revalidator]);
    // When the list is filtered to a single operation, seed the new-completion
    // form with it (e.g. filtering to Assembly pre-selects Assembly).
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var filteredOperationId = (_b = searchParams
        .getAll("filter")
        .find(function (f) { return f.startsWith("jobOperationId:eq:"); })) === null || _b === void 0 ? void 0 : _b.split(":").slice(2).join(":");
    var openNew = (0, react_2.useCallback)(function () {
        // Preset the operation from the active filter, or when there's only one
        // operation (e.g. a master work order's cutting), so the report opens with
        // it selected — otherwise the quantity + config trigger stay disabled
        // until an operation is picked.
        var presetOperationId = filteredOperationId ||
            (operations.length === 1 ? operations[0].id : undefined);
        openOverlay(Overlay_1.overlay.to.newJobProductionQuantity({
            jobId: jobId,
            jobOperationId: presetOperationId
        }), {
            onCreated: function () { return revalidator.revalidate(); }
        });
    }, [jobId, filteredOperationId, operations, openOverlay, revalidator]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "jobOperationId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Operation"], ["Operation"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return canUpdate ? (<button type="button" className="text-left font-medium text-primary hover:underline" onClick={function () { return openEdit(row.original.id); }}>
                {operationLabel(row.original.jobOperationId, (_b = row.original.jobOperation) === null || _b === void 0 ? void 0 : _b.description)}
              </button>) : (<span>
                {operationLabel(row.original.jobOperationId, (_c = row.original.jobOperation) === null || _c === void 0 ? void 0 : _c.description)}
              </span>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: operations.map(function (operation) { return ({
                            value: operation.id,
                            label: (<Enumerable_1.Enumerable value={operationLabel(operation.id, operation.description)}/>)
                        }); })
                    }
                }
            },
            {
                id: "item",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var _b, _c, _d;
                    var row = _a.row;
                    return (_d = (_c = (_b = row.original.jobOperation) === null || _b === void 0 ? void 0 : _b.jobMakeMethod) === null || _c === void 0 ? void 0 : _c.item) === null || _d === void 0 ? void 0 : _d.readableIdWithRevision;
                }
            },
            {
                // Display column keyed by id so the Table filters on "employeeId"
                // (falls back to column.id). Left non-sortable on purpose: the
                // supplier feed has no employeeId column and would 400 on .order().
                id: "employeeId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Employee"], ["Employee"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    if (row.original.actorKind === "supplier") {
                        var supplierId = (_b = row.original.supplierProcess) === null || _b === void 0 ? void 0 : _b.supplierId;
                        return (<react_1.HStack spacing={2} className="min-w-0 items-center">
                  <react_1.Badge variant="outline" className="shrink-0 text-xs font-normal">
                    <macro_1.Trans>Supplier</macro_1.Trans>
                  </react_1.Badge>
                  {supplierId ? (<components_1.SupplierAvatar supplierId={supplierId}/>) : null}
                </react_1.HStack>);
                    }
                    return (<ProductionQuantityReportReporter_1.ProductionQuantityReportReporter employeeId={row.original.employeeId} createdBy={row.original.createdBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: <Enumerable_1.Enumerable value={employee.name}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.Badge variant={row.original.type === "Production"
                            ? "green"
                            : row.original.type === "Rework"
                                ? "orange"
                                : "red"}>
              {typeLabel(row.original.type)}
            </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: productionQuantityLabels_1.PRODUCTION_QUANTITY_TYPES.map(function (type) { return ({
                            value: type,
                            label: (<react_1.Badge variant={type === "Production"
                                    ? "green"
                                    : type === "Rework"
                                        ? "orange"
                                        : "red"}>
                    {typeLabel(type)}
                  </react_1.Badge>)
                        }); })
                    }
                }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<ProductionQuantityTableCells_1.ProductionQuantityTableQuantityCell row={row.original} reportKind="productionQuantity"/>);
                }
            },
            {
                accessorKey: "scrapReasonId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Scrap Reason"], ["Scrap Reason"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var scrapReason = scrapReasons.find(function (reason) { return reason.id === row.original.scrapReasonId; });
                    return <Enumerable_1.Enumerable value={(_b = scrapReason === null || scrapReason === void 0 ? void 0 : scrapReason.name) !== null && _b !== void 0 ? _b : ""}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: scrapReasons === null || scrapReasons === void 0 ? void 0 : scrapReasons.map(function (reason) {
                            var _a;
                            return ({
                                value: reason.id,
                                label: <Enumerable_1.Enumerable value={(_a = reason.name) !== null && _a !== void 0 ? _a : ""}/>
                            });
                        })
                    }
                }
            },
            {
                accessorKey: "notes",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Notes"], ["Notes"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<span className="max-w-[200px] truncate block">
              {row.original.notes}
            </span>);
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Reported"], ["Reported"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<EditableCreatedAtCell_1.EditableCreatedAtCell createdAt={row.original.actorKind === "employee"
                            ? ((_c = (_b = row.original.productionQuantityReport) === null || _b === void 0 ? void 0 : _b.createdAt) !== null && _c !== void 0 ? _c : row.original.createdAt)
                            : row.original.createdAt} row={row.original} onSave={saveCreatedAt} canEdit={canEdit} className="tabular-nums"/>);
                }
            }
        ];
    }, [
        canEdit,
        canUpdate,
        openEdit,
        operationLabel,
        operations,
        people,
        saveCreatedAt,
        scrapReasons,
        t,
        typeLabel
    ]);
    var deleteModal = (0, react_1.useDisclosure)();
    var _h = (0, react_2.useState)(null), selectedEvent = _h[0], setSelectedEvent = _h[1];
    var onDelete = function (data) {
        setSelectedEvent(data);
        deleteModal.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedEvent(null);
        deleteModal.onClose();
    };
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "production")} onClick={function () { return openEdit(row.id); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Process Completion</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "production")} onClick={function () { return onDelete(row); }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Process Completion</macro_1.Trans>
          </react_1.MenuItem>
        </>); }, [openEdit, permissions]);
    return (<>
        <components_1.Table compact count={count} columns={columns} data={data} primaryAction={permissions.can("create", "production") && (<react_1.Button type="button" variant="primary" leftIcon={<lu_1.LuPlus />} onClick={openNew}>
                <macro_1.Trans>Process Completion</macro_1.Trans>
              </react_1.Button>)} renderContextMenu={renderContextMenu} title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Process Completions"], ["Process Completions"])))}/>
        {deleteModal.isOpen && selectedEvent && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteProductionQuantity(selectedEvent.id)} isOpen name={selectedEvent.actorKind === "supplier"
                ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["", " (supplier)"], ["", " (supplier)"])), operationLabel(selectedEvent.jobOperationId, (_c = selectedEvent.jobOperation) === null || _c === void 0 ? void 0 : _c.description) || t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Operation"], ["Operation"])))) : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["", " by ", ""], ["", " by ", ""])), operationLabel(selectedEvent.jobOperationId, (_d = selectedEvent.jobOperation) === null || _d === void 0 ? void 0 : _d.description) || t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Operation"], ["Operation"]))), (_f = (_e = people.find(function (p) { return p.id === selectedEvent.employeeId; })) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Unknown Employee"], ["Unknown Employee"]))))} text={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Are you sure you want to delete this process completion? This action cannot be undone."], ["Are you sure you want to delete this process completion? This action cannot be undone."])))} onCancel={onDeleteCancel} onSubmit={onDeleteCancel}/>)}
      </>);
});
ProductionQuantitiesTable.displayName = "ProductionQuantitiesTable";
exports.default = ProductionQuantitiesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
