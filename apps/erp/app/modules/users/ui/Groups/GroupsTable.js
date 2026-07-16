"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var GroupsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var rows = data.map(function (row) { return ({
        id: row.data.id,
        name: row.data.name,
        isEmployeeTypeGroup: row.data.isEmployeeTypeGroup,
        isCustomerTypeGroup: row.data.isCustomerTypeGroup,
        isSupplierTypeGroup: row.data.isSupplierTypeGroup,
        members: row.data.users
            .map(function (user) { return ({
            name: user.fullName,
            avatar: user.avatarUrl
        }); })
            .concat(row.children.map(function (child) { return ({ name: child.data.name, avatar: null }); }))
    }); });
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Group Name"], ["Group Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.isEmployeeTypeGroup ||
                        row.original.isCustomerTypeGroup ||
                        row.original.isSupplierTypeGroup ? (<span>{row.original.name}</span>) : (<components_1.Hyperlink to={path_1.path.to.group(row.original.id)}>
              {row.original.name}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Members"], ["Members"]))),
                // accessorKey: undefined, // makes the column unsortable
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.AvatarGroup limit={3}>
            <react_1.AvatarGroupList>
              {row.original.members.map(function (member, index) {
                            var _a, _b;
                            return (<components_1.Avatar key={index} name={(_a = member.name) !== null && _a !== void 0 ? _a : undefined} title={(_b = member.name) !== null && _b !== void 0 ? _b : undefined} path={member.avatar}/>);
                        })}
            </react_1.AvatarGroupList>
            <react_1.AvatarOverflowIndicator />
          </react_1.AvatarGroup>);
                },
                meta: {
                    icon: <lu_1.LuUsers />
                }
            }
        ];
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={row.isEmployeeTypeGroup ||
                row.isCustomerTypeGroup ||
                row.isSupplierTypeGroup ||
                !permissions.can("update", "users")} onClick={function () {
                navigate(path_1.path.to.group(row.id));
            }}>
            <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Group</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={row.isEmployeeTypeGroup ||
                row.isCustomerTypeGroup ||
                row.isSupplierTypeGroup ||
                !permissions.can("delete", "users")} onClick={function () {
                navigate(path_1.path.to.deleteGroup(row.id));
            }}>
            <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Group</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, permissions]);
    return (<components_1.Table data={rows} count={count} columns={columns} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Group"], ["Group"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Groups"], ["Groups"])))}/>);
});
GroupsTable.displayName = "GroupsTable";
exports.default = GroupsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
