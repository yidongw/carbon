"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var WorkCenter_1 = require("~/components/Form/WorkCenter");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var quality_models_1 = require("~/modules/quality/quality.models");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var RiskRating_1 = require("./RiskRating");
var RiskStatus_1 = require("./RiskStatus");
var RiskType_1 = require("./RiskType");
var defaultColumnVisibility = {
    itemId: false,
    description: false,
    createdAt: true,
    updatedAt: false
};
var RiskRegistersTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var workCenters = (0, WorkCenter_1.useWorkCenters)({});
    var items = (0, stores_1.useItems)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(null), selectedRisk = _b[0], setSelectedRisk = _b[1];
    var onDelete = (0, react_2.useCallback)(function (risk) {
        setSelectedRisk(risk);
        deleteModal.onOpen();
    }, [deleteModal]);
    var onCancel = (0, react_2.useCallback)(function () {
        setSelectedRisk(null);
        deleteModal.onClose();
    }, [deleteModal]);
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "title",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Title"], ["Title"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id} className="font-medium">
            <div className="flex flex-col gap-1">
              <span>{row.original.title}</span>
              {row.original.itemId && (<span className="text-muted-foreground text-xs">
                  {(0, utils_1.getItemReadableId)(items, row.original.itemId)}
                </span>)}
            </div>
          </components_1.Hyperlink>);
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <RiskType_1.default type={row.original.type}/>;
                },
                meta: {
                    icon: <lu_1.LuShapes />,
                    filter: {
                        type: "static",
                        options: quality_models_1.riskRegisterType.map(function (t) { return ({
                            value: t,
                            label: <RiskType_1.default type={t}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "itemId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (0, utils_1.getItemReadableId)(items, row.original.itemId);
                },
                meta: {
                    icon: <lu_1.LuSquareStack />,
                    filter: {
                        type: "static",
                        options: items.map(function (item) { return ({
                            value: item.id,
                            label: item.readableIdWithRevision
                        }); })
                    }
                }
            },
            {
                accessorKey: "source",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Source"], ["Source"]))),
                cell: function (item) { return <Enumerable_1.Enumerable value={item.getValue()}/>; },
                meta: {
                    icon: <lu_1.LuDna />,
                    filter: {
                        type: "static",
                        options: quality_models_1.riskSource.map(function (c) { return ({
                            value: c,
                            label: <Enumerable_1.Enumerable value={c}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <RiskStatus_1.default status={row.original.status}/>;
                },
                meta: {
                    icon: <lu_1.LuStar />,
                    filter: {
                        type: "static",
                        options: quality_models_1.riskStatus.map(function (s) { return ({
                            value: s,
                            label: <RiskStatus_1.default status={s}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Statuses"], ["Statuses"])))
                }
            },
            {
                accessorKey: "severity",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Severity"], ["Severity"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return <RiskRating_1.RiskRating rating={(_b = row.original.severity) !== null && _b !== void 0 ? _b : 1}/>;
                },
                meta: {
                    icon: <lu_1.LuTriangleAlert />,
                    filter: {
                        type: "static",
                        options: [1, 2, 3, 4, 5].map(function (s) { return ({
                            value: s.toString(),
                            label: <RiskRating_1.RiskRating rating={s}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Severities"], ["Severities"])))
                }
            },
            {
                accessorKey: "likelihood",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Likelihood"], ["Likelihood"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return <RiskRating_1.RiskRating rating={(_b = row.original.likelihood) !== null && _b !== void 0 ? _b : 1}/>;
                },
                meta: {
                    icon: <lu_1.LuDice5 />,
                    filter: {
                        type: "static",
                        options: [1, 2, 3, 4, 5].map(function (s) { return ({
                            value: s.toString(),
                            label: <RiskRating_1.RiskRating rating={s}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "workCenterId",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.workCenterName}/>;
                },
                meta: {
                    icon: <lu_1.LuWrench />,
                    filter: {
                        type: "static",
                        options: workCenters.options.map(function (wc) { return ({
                            value: wc.value,
                            label: <Enumerable_1.Enumerable value={wc.label}/>
                        }); })
                    }
                }
            },
            {
                id: "assignee",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.assignee}/>);
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            }
        ];
        return defaultColumns;
    }, [people, items, workCenters.options.map, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
        <react_1.MenuItem onClick={function () {
            navigate("".concat(path_1.path.to.risk(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
        }}>
          <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
          Edit Risk
        </react_1.MenuItem>
        <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () { return onDelete(row); }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          Delete Risk
        </react_1.MenuItem>
      </>); }, [permissions, navigate, params, onDelete]);
    return (<>
      <components_1.Table data={data} defaultColumnVisibility={defaultColumnVisibility} columns={columns} count={count !== null && count !== void 0 ? count : 0} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Risk"], ["Risk"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Risks"], ["Risks"])))} table="riskRegister" withSavedView/>

      {selectedRisk && selectedRisk.id && (<Modals_1.Confirm action={path_1.path.to.deleteRisk(selectedRisk.id)} title={"Delete ".concat(selectedRisk === null || selectedRisk === void 0 ? void 0 : selectedRisk.title, " Risk")} text={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Are you sure you want to delete this risk? This cannot be undone."], ["Are you sure you want to delete this risk? This cannot be undone."])))} confirmText={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Delete"], ["Delete"])))} isOpen={deleteModal.isOpen} onCancel={onCancel} onSubmit={onCancel}/>)}
    </>);
});
RiskRegistersTable.displayName = "RiskRegistersTable";
exports.default = RiskRegistersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
