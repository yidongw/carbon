"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var hooks_1 = require("~/hooks");
var productionLabels_1 = require("~/modules/production/productionLabels");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var MaintenancePriority_1 = require("../Maintenance/MaintenancePriority");
var MaintenanceSchedulesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, locations = _a.locations, locationId = _a.locationId;
    var t = (0, macro_1.useLingui)().t;
    var getMaintenanceFrequencyLabel = (0, productionLabels_1.useMaintenanceFrequencyLabel)();
    var locale = (0, i18n_1.useLocale)().locale;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var allLocations = (0, Location_1.useLocations)();
    var renderDays = (0, react_2.useCallback)(function (row) {
        var days = [
            row.monday && "M",
            row.tuesday && "Tu",
            row.wednesday && "W",
            row.thursday && "Th",
            row.friday && "F",
            row.saturday && "Sa",
            row.sunday && "Su"
        ].filter(Boolean);
        return days.map(function (day) { return (<react_1.Badge key={day} variant="outline" className="mr-0.5">
          {day}
        </react_1.Badge>); });
    }, []);
    var allDaysSelected = (0, react_2.useCallback)(function (row) {
        return (row.monday &&
            row.tuesday &&
            row.wednesday &&
            row.thursday &&
            row.friday &&
            row.saturday &&
            row.sunday);
    }, []);
    var locationOptions = (0, react_2.useMemo)(function () {
        return locations.map(function (location) { return ({
            value: location.id,
            label: location.name
        }); });
    }, [locations]);
    var getLocationPath = function (locId) {
        return "".concat(path_1.path.to.maintenanceSchedules, "?location=").concat(locId);
    };
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Schedule Name"], ["Schedule Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
              <Enumerable_1.Enumerable value={row.original.name}/>
            </components_1.Hyperlink>);
                }
            },
            {
                accessorKey: "workCenter",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Work Center"], ["Work Center"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.workCenterName}/>;
                },
                meta: {
                    icon: <lu_1.LuBuilding />
                }
            },
            {
                accessorKey: "locationId",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.locationName}/>;
                },
                meta: {
                    icon: <lu_1.LuMapPin />,
                    filter: {
                        type: "static",
                        options: allLocations.map(function (location) { return ({
                            value: location.value,
                            label: <Enumerable_1.Enumerable value={location.label}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "frequency",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Frequency"], ["Frequency"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var frequency = row.original.frequency;
                    var showDays = frequency === "Daily" && !allDaysSelected(row.original);
                    return (<react_1.HStack>
                {showDays ? (renderDays(row.original)) : (<react_1.Badge variant="outline">
                    {frequency ? getMaintenanceFrequencyLabel(frequency) : null}
                  </react_1.Badge>)}
              </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuActivity />,
                    filter: {
                        type: "static",
                        options: resources_models_1.maintenanceFrequency.map(function (freq) { return ({
                            value: freq,
                            label: getMaintenanceFrequencyLabel(freq)
                        }); })
                    },
                    pluralHeader: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Frequencies"], ["Frequencies"])))
                }
            },
            {
                accessorKey: "priority",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Priority"], ["Priority"]))),
                cell: function (item) {
                    var priority = item.getValue();
                    return <MaintenancePriority_1.default priority={priority}/>;
                },
                meta: {
                    filter: {
                        icon: <lu_1.LuChartNoAxesColumnIncreasing />,
                        type: "static",
                        options: resources_models_1.maintenanceDispatchPriority.map(function (priority) { return ({
                            value: priority,
                            label: <MaintenancePriority_1.default priority={priority}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Priorities"], ["Priorities"])))
                }
            },
            {
                accessorKey: "estimatedDuration",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Est. Duration"], ["Est. Duration"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.estimatedDuration
                        ? "".concat(row.original.estimatedDuration, " min")
                        : "-";
                },
                meta: {
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.active ? (<react_1.Status color="green">Active</react_1.Status>) : (<react_1.Status color="gray">Inactive</react_1.Status>);
                },
                meta: {
                    icon: <lu_1.LuToggleRight />
                }
            },
            {
                accessorKey: "nextDueAt",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Next Due"], ["Next Due"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.nextDueAt
                        ? new Date(row.original.nextDueAt).toLocaleDateString(locale)
                        : "-";
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
    }, [
        allDaysSelected,
        allLocations,
        getMaintenanceFrequencyLabel,
        renderDays,
        t,
        locale
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.maintenanceSchedule(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              <macro_1.Trans>Edit Schedule</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "production")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteMaintenanceSchedule(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Schedule</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={<div className="flex items-center gap-2">
            {locationId && (<react_1.Combobox asButton size="sm" value={locationId} options={locationOptions} onChange={function (selected) {
                    // hard refresh because initialValues update has no effect otherwise
                    window.location.href = getLocationPath(selected);
                }}/>)}
            {permissions.can("create", "production") && (<components_1.New label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Scheduled Maintenance"], ["Scheduled Maintenance"])))} to={"".concat(path_1.path.to.newMaintenanceSchedule, "?").concat(params.toString())}/>)}
          </div>} renderContextMenu={renderContextMenu} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Scheduled Maintenances"], ["Scheduled Maintenances"])))}/>);
});
MaintenanceSchedulesTable.displayName = "MaintenanceSchedulesTable";
exports.default = MaintenanceSchedulesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
