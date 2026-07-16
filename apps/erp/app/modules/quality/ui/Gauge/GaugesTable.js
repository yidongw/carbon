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
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var people_1 = require("~/stores/people");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var GaugeStatus_1 = require("./GaugeStatus");
// Gauge inline edits go through the shared gauge bulk-update action.
var GAUGE_UPDATE = {
    action: path_1.path.to.bulkUpdateGauge,
    idKey: "ids"
};
var defaultColumnVisibility = {
    type: false,
    extension: false,
    createdAt: false,
    updatedAt: false,
    updatedBy: false,
    description: false
};
var GaugesTable = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var data = _a.data, types = _a.types, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var activateDisclosure = (0, react_1.useDisclosure)();
    var deactivateDisclosure = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(null), selectedGauge = _d[0], setSelectedGauge = _d[1];
    var people = (0, people_1.usePeople)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("gauge");
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var locations = (0, Location_1.useLocations)();
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var defaultColumns = [
            {
                accessorKey: "gaugeId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ID"], ["ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.gauge(row.original.id)}>
            <div className="flex flex-col gap-0">
              <span className="text-sm font-medium">
                {row.original.gaugeId}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.description}
              </span>
            </div>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                id: "supplierId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Manufacturer"], ["Manufacturer"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "supplierId",
                    update: GAUGE_UPDATE,
                    value: function (r) { return r.supplierId; },
                    clearable: true,
                    options: (_a = suppliers === null || suppliers === void 0 ? void 0 : suppliers.map(function (s) { return ({ value: s.id, label: s.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.SupplierAvatar supplierId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: suppliers === null || suppliers === void 0 ? void 0 : suppliers.map(function (supplier) { return ({
                            value: supplier.id,
                            label: supplier.name
                        }); })
                    },
                    icon: <lu_1.LuContainer />
                }
            },
            {
                accessorKey: "gaugeTypeId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "gaugeTypeId",
                    update: GAUGE_UPDATE,
                    value: function (r) { return r.gaugeTypeId; },
                    options: types.map(function (type) { return ({
                        value: type.id,
                        label: <Enumerable_1.Enumerable value={type.name}/>
                    }); }),
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = types.find(function (type) { return type.id === v; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuShapes />,
                    filter: {
                        type: "static",
                        options: types.map(function (type) { return ({
                            label: <Enumerable_1.Enumerable value={type.name}/>,
                            value: type.id
                        }); })
                    }
                }
            },
            {
                accessorKey: "gaugeCalibrationStatus",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Calibration Status"], ["Calibration Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<GaugeStatus_1.GaugeCalibrationStatus status={row.original.gaugeCalibrationStatus}/>);
                },
                meta: {
                    icon: <lu_1.LuCircleGauge />,
                    filter: {
                        type: "static",
                        options: quality_models_1.gaugeCalibrationStatus.map(function (status) { return ({
                            label: <GaugeStatus_1.GaugeCalibrationStatus status={status}/>,
                            value: status
                        }); })
                    }
                }
            },
            {
                accessorKey: "modelNumber",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Model Number"], ["Model Number"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "modelNumber",
                    update: GAUGE_UPDATE,
                    value: function (r) { return r.modelNumber; }
                }),
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                accessorKey: "serialNumber",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Serial Number"], ["Serial Number"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "serialNumber",
                    update: GAUGE_UPDATE,
                    value: function (r) { return r.serialNumber; }
                }),
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                accessorKey: "gaugeRole",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Role"], ["Role"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "gaugeRole",
                    update: GAUGE_UPDATE,
                    value: function (r) { return r.gaugeRole; },
                    options: quality_models_1.gaugeRole.map(function (role) { return ({
                        value: role,
                        label: <GaugeStatus_1.GaugeRole role={role}/>
                    }); }),
                    renderInline: function (v) { return (<GaugeStatus_1.GaugeRole role={v}/>); }
                }),
                meta: {
                    icon: <lu_1.LuShield />,
                    filter: {
                        type: "static",
                        options: quality_models_1.gaugeRole.map(function (role) { return ({
                            label: <GaugeStatus_1.GaugeRole role={role}/>,
                            value: role
                        }); })
                    }
                }
            },
            {
                accessorKey: "gaugeStatus",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <GaugeStatus_1.GaugeStatus status={row.original.gaugeStatus}/>;
                },
                meta: {
                    icon: <lu_1.LuCircleGauge />,
                    filter: {
                        type: "static",
                        options: quality_models_1.gaugeStatus.map(function (status) { return ({
                            label: status,
                            value: status
                        }); })
                    }
                }
            },
            {
                accessorKey: "nextCalibrationDate",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Next Calibration"], ["Next Calibration"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatDate(row.original.nextCalibrationDate);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "lastCalibrationDate",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Last Calibration"], ["Last Calibration"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatDate(row.original.lastCalibrationDate);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: GAUGE_UPDATE,
                    value: function (r) { return r.locationId; },
                    clearable: true,
                    options: locations,
                    renderInline: function (v) {
                        var _a, _b;
                        return (<Enumerable_1.Enumerable value={(_b = (_a = locations.find(function (l) { return l.value === v; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : null}/>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuMap />,
                    filter: {
                        type: "static",
                        options: locations.map(function (location) { return ({
                            label: location.label,
                            value: location.value
                        }); })
                    }
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                accessorKey: "createdAt",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    icon: <lu_1.LuUsers />,
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
                accessorKey: "updatedAt",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, locations, people, suppliers, types, t, formatDate]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
                navigate("".concat(path_1.path.to.gauge(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Gauge
          </react_1.MenuItem>
          {row.gaugeStatus === "Active" ? (<react_1.MenuItem destructive disabled={!permissions.can("update", "quality")} onClick={function () {
                    (0, react_dom_1.flushSync)(function () {
                        setSelectedGauge(row);
                    });
                    deactivateDisclosure.onOpen();
                }}>
              <react_1.MenuIcon icon={<lu_1.LuCircleX />}/>
              Deactivate Gauge
            </react_1.MenuItem>) : (<react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
                    (0, react_dom_1.flushSync)(function () {
                        setSelectedGauge(row);
                    });
                    activateDisclosure.onOpen();
                }}>
              <react_1.MenuIcon icon={<lu_1.LuCircleCheck />}/>
              Activate Gauge
            </react_1.MenuItem>)}
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedGauge(row);
                });
                deleteDisclosure.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Gauge
          </react_1.MenuItem>
        </>);
    }, [
        permissions,
        navigate,
        params,
        deactivateDisclosure,
        activateDisclosure,
        deleteDisclosure
    ]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count} defaultColumnVisibility={defaultColumnVisibility} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Gauge"], ["Gauge"])))} to={"".concat(path_1.path.to.newGauge, "?").concat(params === null || params === void 0 ? void 0 : params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Gauges"], ["Gauges"])))} table="gauge" withSavedView/>
      {deleteDisclosure.isOpen && selectedGauge && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteGauge(selectedGauge.id)} isOpen onCancel={function () {
                setSelectedGauge(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedGauge(null);
                deleteDisclosure.onClose();
            }} name={(_b = selectedGauge.gaugeId) !== null && _b !== void 0 ? _b : "gauge"} text={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Are you sure you want to delete this gauge?"], ["Are you sure you want to delete this gauge?"])))}/>)}
      {deleteDisclosure.isOpen && selectedGauge && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteGauge(selectedGauge.id)} isOpen onCancel={function () {
                setSelectedGauge(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedGauge(null);
                deleteDisclosure.onClose();
            }} name={(_c = selectedGauge.gaugeId) !== null && _c !== void 0 ? _c : "gauge"} text={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Are you sure you want to delete this gauge?"], ["Are you sure you want to delete this gauge?"])))}/>)}
      {activateDisclosure.isOpen && selectedGauge && (<Modals_1.Confirm action={path_1.path.to.activateGauge(selectedGauge.id)} isOpen onCancel={function () {
                setSelectedGauge(null);
                activateDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedGauge(null);
                activateDisclosure.onClose();
            }} text={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Are you sure you want to activate this gauge?."], ["Are you sure you want to activate this gauge?."])))} title={"Activate ".concat(selectedGauge.gaugeId)} confirmText={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Activate"], ["Activate"])))}/>)}
      {deactivateDisclosure.isOpen && selectedGauge && (<Modals_1.Confirm action={path_1.path.to.gaugeDeactivate(selectedGauge.id)} isOpen onCancel={function () {
                setSelectedGauge(null);
                deactivateDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedGauge(null);
                deactivateDisclosure.onClose();
            }} text={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Are you sure you want to deactivate this gauge?."], ["Are you sure you want to deactivate this gauge?."])))} title={"Deactivate ".concat(selectedGauge.gaugeId)} confirmText={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Deactivate"], ["Deactivate"])))}/>)}
    </>);
});
GaugesTable.displayName = "GaugesTable";
exports.default = GaugesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23;
