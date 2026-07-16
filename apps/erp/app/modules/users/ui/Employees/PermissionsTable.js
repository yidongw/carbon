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
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var useSettings_1 = require("~/hooks/useSettings");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var defaultColumnVisibility = {
    user_firstName: false,
    user_lastName: false
};
var PermissionsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, employeeTypes = _a.employeeTypes, unrevokedInviteEmails = _a.unrevokedInviteEmails;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var settings = (0, useSettings_1.useSettings)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var currentUserId = (0, hooks_1.useUser)().id;
    var employeeTypesById = (0, react_2.useMemo)(function () {
        return employeeTypes.reduce(function (acc, type) {
            acc[type.id] = type;
            return acc;
        }, {});
    }, [employeeTypes]);
    var unrevokedInviteSet = (0, react_2.useMemo)(function () { return new Set(unrevokedInviteEmails); }, [unrevokedInviteEmails]);
    var _b = (0, react_2.useState)([]), selectedUserIds = _b[0], setSelectedUserIds = _b[1];
    var bulkEditDrawer = (0, react_1.useDisclosure)();
    var deactivateEmployeeModal = (0, react_1.useDisclosure)();
    var resendInviteModal = (0, react_1.useDisclosure)();
    var revokeInviteModal = (0, react_1.useDisclosure)();
    var canEdit = permissions.can("update", "users");
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["User"], ["User"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink className={row.original.active === true ? "" : "opacity-70"} to={"".concat(path_1.path.to.employeeAccount(row.original.id), "?").concat(params.toString())}>
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
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuUserCheck />
                }
            },
            {
                accessorKey: "lastName",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Last Name"], ["Last Name"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuUserCheck />
                }
            },
            {
                accessorKey: "email",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Email"], ["Email"]))),
                cell: function (item) {
                    var email = item.getValue();
                    if (email === null || email === void 0 ? void 0 : email.endsWith("@console.internal")) {
                        return (<react_1.Badge variant="secondary">
                  <macro_1.Trans>Console Operator</macro_1.Trans>
                </react_1.Badge>);
                    }
                    return email;
                },
                meta: {
                    icon: <lu_1.LuMail />
                }
            },
            {
                id: "employeeTypeId",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Employee Type"], ["Employee Type"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = employeeTypesById[row.original.employeeTypeId]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : ""}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: employeeTypes.map(function (type) { return ({
                            value: type.id,
                            label: <Enumerable_1.Enumerable value={type.name}/>
                        }); })
                    },
                    icon: <lu_1.LuBriefcase />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    if (status === "Active")
                        return <react_1.Badge variant="green">{t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Active"], ["Active"])))}</react_1.Badge>;
                    if (status === "Invited")
                        return <react_1.Badge variant="yellow">{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Invited"], ["Invited"])))}</react_1.Badge>;
                    return <react_1.Badge variant="secondary">{t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Inactive"], ["Inactive"])))}</react_1.Badge>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "Active", label: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Active"], ["Active"]))) },
                            { value: "Invited", label: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Invited"], ["Invited"]))) },
                            { value: "Inactive", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Inactive"], ["Inactive"]))) }
                        ]
                    },
                    icon: <lu_1.LuUserCheck />
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    icon: <lu_1.LuToggleRight />
                }
            }
        ];
    }, [params]);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        return (<react_1.DropdownMenuContent>
            <react_1.DropdownMenuItem onClick={function () {
                setSelectedUserIds(selectedRows
                    .filter(function (row) { return row.active === true; })
                    .map(function (row) { return row.id; }));
                bulkEditDrawer.onOpen();
            }} disabled={!permissions.can("update", "users") ||
                selectedRows.every(function (row) { return row.active === false; })}>
              <lu_1.LuShield className="mr-2 h-4 w-4"/>
              <span>
                <macro_1.Trans>Edit Permissions</macro_1.Trans>
              </span>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem onClick={function () {
                setSelectedUserIds(selectedRows
                    .filter(function (row) {
                    return row.active === false &&
                        !!row.email &&
                        !unrevokedInviteSet.has(row.email);
                })
                    .map(function (row) { return row.id; }));
                resendInviteModal.onOpen();
            }} disabled={!permissions.can("create", "users") ||
                !selectedRows.some(function (row) {
                    return row.active === false &&
                        !!row.email &&
                        !unrevokedInviteSet.has(row.email);
                })}>
              <lu_1.LuMailCheck className="mr-2 h-4 w-4"/>
              <span>
                <macro_1.Trans>Send Invite</macro_1.Trans>
              </span>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem onClick={function () {
                setSelectedUserIds(selectedRows
                    .filter(function (row) { return row.active === true && row.id !== currentUserId; })
                    .map(function (row) { return row.id; }));
                deactivateEmployeeModal.onOpen();
            }} disabled={!permissions.can("delete", "users") ||
                !selectedRows.some(function (row) { return row.active === true && row.id !== currentUserId; })}>
              <lu_1.LuBan className="mr-2 h-4 w-4"/>
              <span>
                <macro_1.Trans>Deactivate Users</macro_1.Trans>
              </span>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>);
    }, [
        permissions,
        bulkEditDrawer,
        deactivateEmployeeModal,
        resendInviteModal,
        unrevokedInviteSet,
        currentUserId
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var hasUnrevokedInvite = !!row.email && unrevokedInviteSet.has(row.email);
        var isSelf = row.id === currentUserId;
        return (<>
            {row.active === true ? (<>
                <react_1.MenuItem onClick={function () {
                    return navigate("".concat(path_1.path.to.employeeAccount(row.id), "?").concat(params.toString()));
                }}>
                  <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
                  <macro_1.Trans>Edit Permissions</macro_1.Trans>
                </react_1.MenuItem>
                {settings.consoleEnabled && (<react_1.MenuItem onClick={function () {
                        return navigate("".concat(path_1.path.to.operatorResetPin(row.id), "?").concat(params.toString()));
                    }}>
                    <react_1.MenuIcon icon={<lu_1.LuShield />}/>
                    <macro_1.Trans>Set Console PIN</macro_1.Trans>
                  </react_1.MenuItem>)}
                {!isSelf && (<react_1.MenuItem onClick={function (e) {
                        setSelectedUserIds([row.id]);
                        deactivateEmployeeModal.onOpen();
                    }} destructive>
                    <react_1.MenuIcon icon={<lu_1.LuBan />}/>
                    <macro_1.Trans>Deactivate Account</macro_1.Trans>
                  </react_1.MenuItem>)}
              </>) : hasUnrevokedInvite ? (permissions.can("delete", "users") && (<react_1.MenuItem onClick={function () {
                    setSelectedUserIds([row.id]);
                    revokeInviteModal.onOpen();
                }} destructive>
                  <react_1.MenuIcon icon={<lu_1.LuBan />}/>
                  <macro_1.Trans>Revoke Invite</macro_1.Trans>
                </react_1.MenuItem>)) : (<react_1.MenuItem onClick={function () {
                    setSelectedUserIds([row.id]);
                    resendInviteModal.onOpen();
                }}>
                <react_1.MenuIcon icon={<lu_1.LuMailCheck />}/>
                <macro_1.Trans>Send Invite</macro_1.Trans>
              </react_1.MenuItem>)}
          </>);
    }, [
        currentUserId,
        deactivateEmployeeModal,
        navigate,
        params,
        permissions,
        resendInviteModal,
        revokeInviteModal,
        settings.consoleEnabled,
        unrevokedInviteSet
    ]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnVisibility={defaultColumnVisibility} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Account"], ["Account"])))} to={"".concat(path_1.path.to.newEmployee, "?").concat(params.toString())}/>)} renderActions={renderActions} renderContextMenu={renderContextMenu} title={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Permissions"], ["Permissions"])))} withSelectableRows={canEdit}/>
        {bulkEditDrawer.isOpen && (<users_1.BulkEditPermissionsForm userIds={selectedUserIds} isOpen={bulkEditDrawer.isOpen} onClose={bulkEditDrawer.onClose}/>)}
        {deactivateEmployeeModal.isOpen && (<users_1.DeactivateUsersModal userIds={selectedUserIds} isOpen={deactivateEmployeeModal.isOpen} onClose={deactivateEmployeeModal.onClose}/>)}
        {resendInviteModal.isOpen && (<users_1.ResendInviteModal userIds={selectedUserIds} isOpen={resendInviteModal.isOpen} onClose={resendInviteModal.onClose}/>)}
        {revokeInviteModal.isOpen && (<users_1.RevokeInviteModal userIds={selectedUserIds} isOpen={revokeInviteModal.isOpen} onClose={revokeInviteModal.onClose}/>)}
      </>);
});
PermissionsTable.displayName = "PermissionsTable";
exports.default = PermissionsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
