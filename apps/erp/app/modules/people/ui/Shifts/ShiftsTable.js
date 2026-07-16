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
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var ShiftsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, locations = _a.locations;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
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
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("shift");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shift"], ["Shift"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>{row.original.name}</components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuCalendarRange />
                }
            },
            {
                accessorKey: "startTime",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Start Time"], ["Start Time"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "endTime",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["End Time"], ["End Time"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "locationName",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (item) { return <Enumerable_1.Enumerable value={item.getValue()}/>; },
                meta: {
                    icon: <lu_1.LuMapPin />,
                    filter: {
                        type: "static",
                        options: locations.map(function (location) { return ({
                            value: location.name,
                            label: <Enumerable_1.Enumerable value={location.name}/>
                        }); })
                    }
                }
            },
            {
                id: "days",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Days"], ["Days"]))),
                // @ts-ignore
                cell: function (_a) {
                    var row = _a.row;
                    return renderDays(row.original);
                },
                meta: {
                    icon: <lu_1.LuCalendarDays />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [locations, renderDays, customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.shift(row.id), "?").concat(params.toString(), "}"));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Shift</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "people")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteShift(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Shift</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} primaryAction={permissions.can("create", "people") && (<components_1.New label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Shift"], ["Shift"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Shifts"], ["Shifts"])))}/>);
});
ShiftsTable.displayName = "ShiftsTable";
exports.default = ShiftsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
