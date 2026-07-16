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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var WorkCenter_1 = require("~/components/Form/WorkCenter");
var InlineEditor_1 = require("~/components/InlineEditor");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
// Process inline edits go through the shared process bulk-update action.
var PROCESS_UPDATE = {
    action: path_1.path.to.bulkUpdateProcess,
    idKey: "ids"
};
var defaultColumnVisibility = {
    createdAt: false,
    createdBy: false,
    updatedAt: false,
    updatedBy: false
};
var ProcessesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var workCenters = (0, WorkCenter_1.useWorkCenters)({}).options;
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("process");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Process"], ["Process"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return row.original.processType === "Outside" ||
                        ((_b = row.original.workCenters) !== null && _b !== void 0 ? _b : []).length > 0 ? (<components_1.Hyperlink to={row.original.id}>
              <Enumerable_1.Enumerable value={row.original.name} className="cursor-pointer"/>
            </components_1.Hyperlink>) : (<components_1.Hyperlink to={row.original.id}>
              <react_1.HStack spacing={2}>
                <lu_1.LuTriangleAlert />
                <span>{row.original.name}</span>
              </react_1.HStack>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuCog />
                }
            },
            {
                accessorKey: "processType",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Process Type"], ["Process Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "processType",
                    update: PROCESS_UPDATE,
                    value: function (r) { return r.processType; },
                    options: shared_1.processTypes.map(function (type) { return ({
                        value: type,
                        label: type === "Outside" ? (<react_1.Badge>Outside</react_1.Badge>) : (<react_1.Badge variant="secondary">{type}</react_1.Badge>)
                    }); }),
                    renderInline: function (v) {
                        return v === "Outside" ? (<react_1.Badge>Outside</react_1.Badge>) : (<react_1.Badge variant="secondary">{v}</react_1.Badge>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuFactory />
                }
            },
            {
                id: "workCenters",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Work Centers"], ["Work Centers"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<span className="flex gap-2 items-center flex-wrap py-2">
            {((_b = row.original.workCenters) !== null && _b !== void 0 ? _b : []).map(function (wc) {
                            var _a;
                            var workCenter = workCenters.find(function (w) { return w.value === wc; });
                            return (<Enumerable_1.Enumerable key={workCenter === null || workCenter === void 0 ? void 0 : workCenter.label} onClick={function () {
                                    return navigate(path_1.path.to.workCenter(workCenter === null || workCenter === void 0 ? void 0 : workCenter.value));
                                }} className="cursor-pointer" value={(_a = workCenter === null || workCenter === void 0 ? void 0 : workCenter.label) !== null && _a !== void 0 ? _a : null}/>);
                        })}
          </span>);
                },
                meta: {
                    icon: <lu_1.LuBuilding2 />,
                    filter: {
                        type: "static",
                        options: workCenters.map(function (w) { return ({
                            value: w.value,
                            label: <Enumerable_1.Enumerable value={w.label}/>
                        }); }),
                        isArray: true
                    }
                }
            },
            {
                accessorKey: "defaultStandardFactor",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Default Unit"], ["Default Unit"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "defaultStandardFactor",
                    update: PROCESS_UPDATE,
                    value: function (r) { return r.defaultStandardFactor; },
                    options: shared_1.standardFactorType.map(function (type) { return ({
                        value: type,
                        label: type
                    }); }),
                    renderInline: function (v) { return <span>{v}</span>; }
                }),
                meta: {
                    icon: <lu_1.LuRuler />,
                    filter: {
                        type: "static",
                        options: shared_1.standardFactorType.map(function (type) { return ({
                            value: type,
                            label: type
                        }); })
                    }
                }
            },
            {
                id: "suppliers",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Suppliers"], ["Suppliers"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.AvatarGroup limit={5}>
            <react_1.AvatarGroupList>
              {((_b = row.original.suppliers) !== null && _b !== void 0 ? _b : []).map(function (s) { return (<react_1.Avatar key={s.name} name={s.name}/>); })}
            </react_1.AvatarGroupList>
            <react_1.AvatarOverflowIndicator />
          </react_1.AvatarGroup>);
                },
                meta: {
                    icon: <lu_1.LuUsers />
                }
            },
            {
                accessorKey: "completeAllOnScan",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Complete All"], ["Complete All"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "boolean",
                    field: "completeAllOnScan",
                    update: PROCESS_UPDATE,
                    value: function (r) { return r.completeAllOnScan; }
                }),
                meta: {
                    icon: <lu_1.LuQrCode />,
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: "Yes" },
                            { value: "false", label: "No" }
                        ]
                    }
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<div className="flex w-full items-center justify-center">
            <react_1.Checkbox isChecked={(_b = row.original.active) !== null && _b !== void 0 ? _b : true}/>
          </div>);
                },
                meta: {
                    icon: <lu_1.LuCheck />,
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: "Active" },
                            { value: "false", label: "Inactive" }
                        ]
                    },
                    pluralHeader: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Active Statuses"], ["Active Statuses"])))
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
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
            },
            {
                id: "updatedBy",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
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
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [workCenters, people, customColumns, navigate, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.process(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Process</macro_1.Trans>
          </react_1.MenuItem>
          {row.active ? (<react_1.MenuItem disabled={!permissions.can("delete", "resources")} onClick={function () {
                    navigate("".concat(path_1.path.to.processDeactivate(row.id), "?").concat(params.toString()));
                }}>
              <react_1.MenuIcon icon={<lu_1.LuPower />}/>
              <macro_1.Trans>Deactivate Process</macro_1.Trans>
            </react_1.MenuItem>) : (<react_1.MenuItem disabled={!permissions.can("delete", "resources")} onClick={function () {
                    navigate("".concat(path_1.path.to.processActivate(row.id), "?").concat(params.toString()));
                }}>
              <react_1.MenuIcon icon={<lu_1.LuCheck />}/>
              <macro_1.Trans>Activate Process</macro_1.Trans>
            </react_1.MenuItem>)}
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteProcess(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Process</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} defaultColumnVisibility={defaultColumnVisibility} importCSV={[
            {
                table: "process",
                label: "Processes"
            }
        ]} primaryAction={permissions.can("create", "resources") && (<components_1.New label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Process"], ["Process"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Processes"], ["Processes"])))} table="process" withSavedView/>);
});
ProcessesTable.displayName = "ProcessesTable";
exports.default = ProcessesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
