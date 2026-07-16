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
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var GaugeCalibrationRecordStatus_1 = require("./GaugeCalibrationRecordStatus");
var defaultColumnVisibility = {
    gaugeTypeId: false,
    createdAt: false,
    updatedAt: false,
    updatedBy: false,
    temperature: false,
    humidity: false,
    approvedBy: false
};
var GaugeCalibrationRecordsTable = (0, react_2.memo)(function (_a) {
    var _b, _c, _d;
    var data = _a.data, types = _a.types, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _e = (0, react_2.useState)(null), selectedGaugeCalibrationRecord = _e[0], setSelectedGaugeCalibrationRecord = _e[1];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("gaugeCalibrationRecord");
    var people = (0, stores_1.usePeople)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var isMetric = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.companySettings) === null || _b === void 0 ? void 0 : _b.useMetric) !== null && _c !== void 0 ? _c : false;
    var temperatureFormatter = (0, i18n_1.useNumberFormatter)({
        maximumFractionDigits: 2,
        style: "unit",
        unit: isMetric ? "celsius" : "fahrenheit"
    });
    var humidityFormatter = (0, i18n_1.useNumberFormatter)({
        maximumFractionDigits: 2,
        style: "percent",
        minimumFractionDigits: 0
    });
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "gaugeId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ID"], ["ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.gaugeCalibrationRecord(row.original.id)}>
              <div className="flex flex-col gap-0">
                <span className="text-sm font-medium">
                  {row.original.gaugeReadableId}
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
                accessorKey: "dateCalibrated",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Date Calibrated"], ["Date Calibrated"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "inspectionStatus",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Inspection Status"], ["Inspection Status"]))),
                cell: function (item) { return (<GaugeCalibrationRecordStatus_1.GaugeCalibrationRecordStatus status={item.getValue()}/>); },
                meta: {
                    icon: <lu_1.LuCheck />,
                    filter: {
                        type: "static",
                        options: [
                            {
                                value: "Pass",
                                label: <GaugeCalibrationRecordStatus_1.GaugeCalibrationRecordStatus status="Pass"/>
                            },
                            {
                                value: "Fail",
                                label: <GaugeCalibrationRecordStatus_1.GaugeCalibrationRecordStatus status="Fail"/>
                            }
                        ]
                    }
                }
            },
            {
                accessorKey: "gaugeTypeId",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = types.find(function (type) { return type.id === row.original.gaugeTypeId; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : null}/>);
                },
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
                accessorKey: "requiresAction",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Requires Action"], ["Requires Action"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Yes"], ["Yes"]))) },
                            { value: "false", label: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["No"], ["No"]))) }
                        ]
                    },
                    icon: <lu_1.LuCheck />
                }
            },
            {
                accessorKey: "requiresAdjustment",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Requires Adjustment"], ["Requires Adjustment"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Yes"], ["Yes"]))) },
                            { value: "false", label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["No"], ["No"]))) }
                        ]
                    },
                    icon: <lu_1.LuCheck />
                }
            },
            {
                accessorKey: "requiresRepair",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Requires Repair"], ["Requires Repair"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "true", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Yes"], ["Yes"]))) },
                            { value: "false", label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["No"], ["No"]))) }
                        ]
                    },
                    icon: <lu_1.LuCheck />
                }
            },
            {
                id: "supplierId",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Calibration Supplier"], ["Calibration Supplier"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.SupplierAvatar supplierId={row.original.supplierId}/>);
                },
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
                accessorKey: "temperature",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Temperature"], ["Temperature"]))),
                cell: function (item) {
                    var value = item.getValue();
                    return value !== null && value !== undefined
                        ? temperatureFormatter.format(value)
                        : "—";
                },
                meta: {
                    icon: <lu_1.LuThermometer />
                }
            },
            {
                accessorKey: "humidity",
                header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Humidity"], ["Humidity"]))),
                cell: function (item) {
                    var value = item.getValue();
                    return value !== null && value !== undefined
                        ? humidityFormatter.format(value)
                        : "—";
                },
                meta: {
                    icon: <lu_1.LuDroplets />
                }
            },
            {
                id: "approvedBy",
                header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Approved By"], ["Approved By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.approvedBy}/>);
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
                id: "createdBy",
                header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        customColumns,
        humidityFormatter,
        people,
        suppliers,
        temperatureFormatter,
        types,
        t,
        formatDate
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem disabled={!permissions.can("update", "quality")} onClick={function () {
                navigate("".concat(path_1.path.to.gaugeCalibrationRecord(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              Edit Record
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "quality")} onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedGaugeCalibrationRecord(row);
                });
                deleteDisclosure.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              Delete Record
            </react_1.MenuItem>
          </>);
    }, [navigate, permissions, deleteDisclosure, params]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} defaultColumnVisibility={defaultColumnVisibility} primaryAction={permissions.can("create", "quality") && (<components_1.New label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Record"], ["Record"])))} to={"".concat(path_1.path.to.newGaugeCalibrationRecord, "?").concat(params === null || params === void 0 ? void 0 : params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Calibration Records"], ["Calibration Records"])))} table="gaugeCalibrationRecord" withSavedView/>
        {deleteDisclosure.isOpen && selectedGaugeCalibrationRecord && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteGaugeCalibrationRecord(selectedGaugeCalibrationRecord.id)} isOpen onCancel={function () {
                setSelectedGaugeCalibrationRecord(null);
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                setSelectedGaugeCalibrationRecord(null);
                deleteDisclosure.onClose();
            }} name={"record for ".concat((_d = selectedGaugeCalibrationRecord.gaugeReadableId) !== null && _d !== void 0 ? _d : "gauge")} text={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Are you sure you want to delete this record?"], ["Are you sure you want to delete this record?"])))}/>)}
      </>);
});
GaugeCalibrationRecordsTable.displayName = "GaugeCalibrationRecordsTable";
exports.default = GaugeCalibrationRecordsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24;
