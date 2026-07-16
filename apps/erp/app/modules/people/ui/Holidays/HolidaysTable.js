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
var bs_1 = require("react-icons/bs");
var io_1 = require("react-icons/io");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var HolidaysTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, years = _a.years;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var params = (0, hooks_1.useUrlParams)()[0];
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("holiday");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Holiday"], ["Holiday"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>{row.original.name}</components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "year",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Year"], ["Year"]))),
                cell: function (item) { return (<Enumerable_1.Enumerable value={item.getValue().toString()}/>); },
                meta: {
                    icon: <lu_1.LuCalendarRange />,
                    filter: {
                        type: "static",
                        options: years.map(function (year) { return ({
                            label: <Enumerable_1.Enumerable value={year.toString()}/>,
                            value: year.toString()
                        }); })
                    }
                }
            },
            {
                accessorKey: "date",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Date"], ["Date"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendarDays />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, years, t, formatDate]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.holiday(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<bs_1.BsFillPenFill />}/>
            <macro_1.Trans>Edit Holiday</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "people")} destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteHoliday(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<io_1.IoMdTrash />}/>
            <macro_1.Trans>Delete Holiday</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} primaryAction={permissions.can("create", "people") && (<components_1.New label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Holiday"], ["Holiday"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Holidays"], ["Holidays"])))}/>);
});
HolidaysTable.displayName = "HolidaysTable";
exports.default = HolidaysTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
