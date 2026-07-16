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
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var LocationsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var rows = data.map(function (row) { return (__assign({}, row)); });
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("location");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
            <Enumerable_1.Enumerable value={row.original.name} className="cursor-pointer"/>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                accessorKey: "addressLine1",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Address"], ["Address"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHouse />
                }
            },
            {
                accessorKey: "city",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["City"], ["City"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuBuilding2 />
                }
            },
            {
                accessorKey: "stateProvince",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["State / Province"], ["State / Province"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuMap />
                }
            },
            {
                accessorKey: "countryCode",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Country"], ["Country"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuGlobe />
                }
            },
            // {
            //   accessorKey: "timezone",
            //   header: "Timezone",
            //   cell: (item) => item.getValue(),
            // },
            {
                id: "createdBy",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    icon: <lu_1.LuClock />,
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
    }, [people, customColumns, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.location(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Location</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteLocation(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Location</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={rows} count={count} columns={columns} primaryAction={permissions.can("create", "resources") && (<components_1.New label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Location"], ["Location"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Locations"], ["Locations"])))} table="location" withSavedView/>);
});
LocationsTable.displayName = "LocationsTable";
exports.default = LocationsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
