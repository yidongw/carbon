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
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var InlineEditor_1 = require("~/components/InlineEditor");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
// People inline edits fan out (firstName/lastName -> user, location ->
// employeeJob), keyed by user id — same as the employees permissions table,
// so they share the employees bulk-update action.
var PEOPLE_UPDATE = {
    action: path_1.path.to.bulkUpdateEmployee,
    idKey: "ids"
};
var EmployeesTable = (0, react_2.memo)(function (_a) {
    var attributeCategories = _a.attributeCategories, data = _a.data, count = _a.count, departmentByEmployeeId = _a.departmentByEmployeeId;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var locations = (0, Location_1.useLocations)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var renderGenericAttribute = (0, react_2.useCallback)(function (value, dataType, user) {
        if (!value || !dataType)
            return null;
        if (dataType === shared_1.DataType.Boolean) {
            return value === true ? "Yes" : "No";
        }
        if (dataType === shared_1.DataType.Date) {
            return new Date(value).toLocaleDateString(locale);
        }
        if (dataType === shared_1.DataType.Numeric) {
            return Number(value).toLocaleString();
        }
        if (dataType === shared_1.DataType.Text || dataType === shared_1.DataType.List) {
            return value;
        }
        if (dataType === shared_1.DataType.User) {
            if (!user)
                return null;
            var name_1 = formatPersonName({ fullName: user.fullName });
            return (<react_1.HStack>
              <components_1.Avatar size="sm" name={name_1 || undefined} path={user.avatarUrl}/>
              <p>{name_1}</p>
            </react_1.HStack>);
        }
        return "Unknown";
    }, [formatPersonName, locale]);
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Account"], ["Account"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.personDetails(row.original.id)}>
              <components_1.EmployeeAvatar size="sm" employeeId={row.original.id} fallback={{
                            firstName: row.original.firstName,
                            lastName: row.original.lastName,
                            fullName: row.original.name,
                            avatarUrl: row.original.avatarUrl
                        }}/>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "firstName",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["First Name"], ["First Name"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "firstName",
                    update: PEOPLE_UPDATE,
                    value: function (r) { return r.firstName; }
                }),
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "lastName",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Last Name"], ["Last Name"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "lastName",
                    update: PEOPLE_UPDATE,
                    value: function (r) { return r.lastName; }
                }),
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "email",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Email"], ["Email"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuMail />
                }
            },
            {
                id: "department",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Department"], ["Department"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = departmentByEmployeeId[row.original.id]) !== null && _b !== void 0 ? _b : null;
                },
                meta: {
                    icon: <lu_1.LuNetwork />
                }
            },
            {
                id: "locationId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: PEOPLE_UPDATE,
                    value: function (r) { return r.locationId; },
                    clearable: true,
                    options: locations,
                    fallbackLabel: function (r) { return r.locationName; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: locations.map(function (location) { return ({
                            value: location.value,
                            label: <Enumerable_1.Enumerable value={location.label}/>
                        }); })
                    },
                    icon: <lu_1.LuMapPin />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    if (status === "Active")
                        return <react_1.Badge variant="green">{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Active"], ["Active"])))}</react_1.Badge>;
                    if (status === "Invited")
                        return <react_1.Badge variant="yellow">{t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Invited"], ["Invited"])))}</react_1.Badge>;
                    return <react_1.Badge variant="secondary">{t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Inactive"], ["Inactive"])))}</react_1.Badge>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "Active", label: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Active"], ["Active"]))) },
                            { value: "Invited", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Invited"], ["Invited"]))) },
                            { value: "Inactive", label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Inactive"], ["Inactive"]))) }
                        ]
                    },
                    icon: <lu_1.LuUserCheck />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    icon: <lu_1.LuToggleRight />
                }
            }
        ];
        var additionalColumns = [];
        attributeCategories.forEach(function (category) {
            if (category.userAttribute && Array.isArray(category.userAttribute)) {
                category.userAttribute.forEach(function (attribute) {
                    var _a;
                    additionalColumns.push({
                        id: attribute.id,
                        header: (_a = attribute === null || attribute === void 0 ? void 0 : attribute.name) !== null && _a !== void 0 ? _a : "",
                        cell: function (_a) {
                            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var row = _a.row;
                            return renderGenericAttribute((_d = (_c = (_b = row === null || row === void 0 ? void 0 : row.original) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c[attribute === null || attribute === void 0 ? void 0 : attribute.id]) === null || _d === void 0 ? void 0 : _d.value, (_g = (_f = (_e = row === null || row === void 0 ? void 0 : row.original) === null || _e === void 0 ? void 0 : _e.attributes) === null || _f === void 0 ? void 0 : _f[attribute === null || attribute === void 0 ? void 0 : attribute.id]) === null || _g === void 0 ? void 0 : _g.dataType, (_k = (_j = (_h = row === null || row === void 0 ? void 0 : row.original) === null || _h === void 0 ? void 0 : _h.attributes) === null || _j === void 0 ? void 0 : _j[attribute === null || attribute === void 0 ? void 0 : attribute.id]) === null || _k === void 0 ? void 0 : _k.user);
                        }
                    });
                });
            }
        });
        return __spreadArray(__spreadArray([], defaultColumns, true), additionalColumns, true);
    }, [
        attributeCategories,
        departmentByEmployeeId,
        locations,
        renderGenericAttribute,
        t
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return permissions.can("update", "people")
            ? function (row) {
                return (<react_1.MenuItem onClick={function () {
                        return navigate("".concat(path_1.path.to.personDetails(row.id), "?").concat(params.toString()));
                    }}>
                <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
                <macro_1.Trans>Edit Employee</macro_1.Trans>
              </react_1.MenuItem>);
            }
            : undefined;
    }, [navigate, params, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["Select", "Account"]
        }} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Employee"], ["Employee"])))} to={"".concat(path_1.path.to.newEmployee, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Employees"], ["Employees"])))} table="employee" withSavedView/>
      </>);
});
EmployeesTable.displayName = "EmployeesTable";
exports.default = EmployeesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
