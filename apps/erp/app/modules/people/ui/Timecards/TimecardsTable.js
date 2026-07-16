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
var path_1 = require("~/utils/path");
function formatTime(dateStr, locale) {
    return new Date(dateStr).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit"
    });
}
function formatDuration(clockInStr, clockOutStr) {
    var end = clockOutStr ? new Date(clockOutStr).getTime() : Date.now();
    var ms = end - new Date(clockInStr).getTime();
    var hours = Math.floor(ms / 3600000);
    var minutes = Math.floor((ms % 3600000) / 60000);
    return "".concat(hours, "h ").concat(minutes, "m");
}
var TimecardsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var params = (0, hooks_1.useUrlParams)()[0];
    var locations = (0, Location_1.useLocations)();
    var _b = (0, react_2.useState)(0), setTick = _b[1];
    // Re-render every minute to update duration for active timecards
    (0, react_1.useInterval)(function () { return setTick(function (t) { return t + 1; }); }, 60000);
    var columns = (0, react_2.useMemo)(function () { return [
        {
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee"], ["Employee"]))),
            cell: function (_a) {
                var _b, _c, _d;
                var row = _a.row;
                return (<components_1.Hyperlink to={path_1.path.to.personTimecard(row.original.employeeId)}>
            <react_1.HStack className="items-center gap-2">
              <react_1.Avatar className="size-6" src={(_b = row.original.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={"".concat((_c = row.original.firstName) !== null && _c !== void 0 ? _c : "", " ").concat((_d = row.original.lastName) !== null && _d !== void 0 ? _d : "")}/>
              <span className="text-sm">
                {row.original.firstName} {row.original.lastName}
              </span>
            </react_1.HStack>
          </components_1.Hyperlink>);
            },
            meta: {
                icon: <lu_1.LuUser />
            }
        },
        {
            accessorKey: "clockIn",
            header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Date"], ["Date"]))),
            cell: function (_a) {
                var row = _a.row;
                return row.original.clockIn
                    ? formatDate(row.original.clockIn, { dateStyle: "medium" })
                    : "—";
            },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        },
        {
            id: "clockInTime",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Clock In"], ["Clock In"]))),
            cell: function (_a) {
                var row = _a.row;
                return row.original.clockIn ? formatTime(row.original.clockIn, locale) : "—";
            },
            meta: {
                icon: <lu_1.LuClock />
            }
        },
        {
            id: "clockOutTime",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Clock Out"], ["Clock Out"]))),
            cell: function (_a) {
                var row = _a.row;
                return row.original.clockOut
                    ? formatTime(row.original.clockOut, locale)
                    : "—";
            },
            meta: {
                icon: <lu_1.LuClock />
            }
        },
        {
            id: "duration",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Duration"], ["Duration"]))),
            cell: function (_a) {
                var row = _a.row;
                if (!row.original.clockIn)
                    return "—";
                return formatDuration(row.original.clockIn, row.original.clockOut);
            },
            meta: {
                icon: <lu_1.LuClock />
            }
        },
        {
            accessorKey: "status",
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Status"], ["Status"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.Badge variant={row.original.status === "Active" ? "green" : "secondary"}>
            {row.original.status}
          </react_1.Badge>);
            },
            meta: {
                icon: <lu_1.LuRadar />,
                filter: {
                    type: "static",
                    options: [
                        {
                            value: "Active",
                            label: <react_1.Badge variant="green">Active</react_1.Badge>
                        },
                        {
                            value: "Complete",
                            label: <react_1.Badge variant="secondary">Complete</react_1.Badge>
                        }
                    ],
                    isArray: false
                }
            }
        },
        {
            accessorKey: "locationName",
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Location"], ["Location"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (<Enumerable_1.Enumerable value={(_b = row.original.locationName) !== null && _b !== void 0 ? _b : null}/>);
            },
            meta: {
                icon: <lu_1.LuMapPin />,
                filter: {
                    type: "static",
                    options: locations.map(function (location) { return ({
                        value: location.label,
                        label: <Enumerable_1.Enumerable value={location.label}/>
                    }); }),
                    isArray: false
                }
            }
        }
    ]; }, [locations, t, formatDate, locale]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        if (!row.id)
            return null;
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "people")} onClick={function () {
                return navigate("".concat(path_1.path.to.timecard(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Timecard</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "people")} onClick={function () {
                return navigate("".concat(path_1.path.to.deleteTimecard(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Timecard</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} primaryAction={permissions.can("create", "people") && (<components_1.New label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Timecard"], ["Timecard"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} withSearch withPagination withSavedView title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Timecards"], ["Timecards"])))} table="timeCardEntry"/>);
});
TimecardsTable.displayName = "TimecardsTable";
exports.default = TimecardsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
