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
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var users_1 = require("~/modules/users");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var defaultColumnVisibility = {
    user_firstName: false,
    user_lastName: false
};
var CustomerAccountsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, customerTypes = _a.customerTypes, unrevokedInviteEmails = _a.unrevokedInviteEmails;
    var t = (0, macro_1.useLingui)().t;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var _b = (0, react_2.useState)([]), selectedUserIds = _b[0], setSelectedUserIds = _b[1];
    var deactivateCustomerModal = (0, react_1.useDisclosure)();
    var resendInviteModal = (0, react_1.useDisclosure)();
    var revokeInviteModal = (0, react_1.useDisclosure)();
    var customers = (0, stores_1.useCustomers)()[0];
    var unrevokedInviteSet = (0, react_2.useMemo)(function () { return new Set(unrevokedInviteEmails); }, [unrevokedInviteEmails]);
    var hasUnrevokedInviteForRow = (0, react_2.useCallback)(function (row) {
        var email = row.user && !Array.isArray(row.user) ? row.user.email : null;
        return !!email && unrevokedInviteSet.has(email);
    }, [unrevokedInviteSet]);
    var canEdit = permissions.can("update", "users");
    var rows = (0, react_2.useMemo)(function () {
        return data.map(function (d) {
            // we should only have one user and customer per customer id
            if (d.user === null ||
                d.customer === null ||
                Array.isArray(d.user) ||
                Array.isArray(d.customer)) {
                throw new Error("Expected user and customer to be objects");
            }
            return d;
        });
    }, [data]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["User"], ["User"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e, _f;
                    var row = _a.row;
                    var name = formatPersonName({
                        firstName: (_b = row.original.user) === null || _b === void 0 ? void 0 : _b.firstName,
                        lastName: (_c = row.original.user) === null || _c === void 0 ? void 0 : _c.lastName,
                        fullName: (_d = row.original.user) === null || _d === void 0 ? void 0 : _d.fullName
                    }) ||
                        ((_e = row.original.user) === null || _e === void 0 ? void 0 : _e.email) ||
                        "Unknown";
                    return (<react_1.HStack>
                <components_1.Avatar size="sm" name={name} path={(_f = row.original.user) === null || _f === void 0 ? void 0 : _f.avatarUrl}/>

                <span>{name}</span>
              </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "user.firstName",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["First Name"], ["First Name"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuUserCheck />
                }
            },
            {
                accessorKey: "user.lastName",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Last Name"], ["Last Name"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuUserCheck />
                }
            },
            {
                accessorKey: "user.email",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Email"], ["Email"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuMail />
                }
            },
            {
                accessorKey: "customer.name",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuSquareUser />,
                    filter: {
                        type: "static",
                        options: customers.map(function (_a) {
                            var name = _a.name;
                            return ({
                                value: name,
                                label: name
                            });
                        })
                    }
                }
            },
            {
                accessorKey: "customer.customerTypeId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Customer Type"], ["Customer Type"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (
                    // @ts-ignore
                    <Enumerable_1.Enumerable value={(_c = (_b = row.original.customer) === null || _b === void 0 ? void 0 : _b.customerType) === null || _c === void 0 ? void 0 : _c.name}/>);
                },
                meta: {
                    icon: <lu_1.LuStar />,
                    filter: {
                        type: "static",
                        options: customerTypes.map(function (type) { return ({
                            value: type.id,
                            label: <Enumerable_1.Enumerable value={type.name}/>
                        }); })
                    }
                }
            },
            {
                accessorKey: "active",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Active"], ["Active"]))),
                cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
                meta: {
                    icon: <lu_1.LuUserCheck />,
                    filter: {
                        type: "static",
                        options: [
                            {
                                value: "true",
                                label: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Active"], ["Active"])))
                            },
                            {
                                value: "false",
                                label: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Inactive"], ["Inactive"])))
                            }
                        ]
                    }
                }
            }
        ];
    }, [customerTypes, customers, t]);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        return (<react_1.DropdownMenuContent>
            <react_1.DropdownMenuItem onClick={function () {
                setSelectedUserIds(selectedRows
                    .filter(function (row) {
                    return row.active === false && !hasUnrevokedInviteForRow(row);
                })
                    .map(function (row) { return row.user.id; }));
                resendInviteModal.onOpen();
            }} disabled={!permissions.can("create", "users") ||
                !selectedRows.some(function (row) {
                    return row.active === false && !hasUnrevokedInviteForRow(row);
                })}>
              <lu_1.LuMailCheck className="mr-2 h-4 w-4"/>
              <span>
                <macro_1.Trans>Send Invite</macro_1.Trans>
              </span>
            </react_1.DropdownMenuItem>
            <react_1.DropdownMenuItem onClick={function () {
                setSelectedUserIds(selectedRows
                    .filter(function (row) { return row.active === true; })
                    .map(function (row) { return row.user.id; }));
                deactivateCustomerModal.onOpen();
            }} disabled={!permissions.can("delete", "users") ||
                selectedRows.every(function (row) { return row.active === false; })}>
              <lu_1.LuBan className="mr-2 h-4 w-4"/>
              <span>
                <macro_1.Trans>Deactivate Users</macro_1.Trans>
              </span>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>);
    }, [
        permissions,
        deactivateCustomerModal,
        resendInviteModal,
        hasUnrevokedInviteForRow
    ]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var hasUnrevokedInvite = hasUnrevokedInviteForRow(row);
        return (<>
            {row.active === true ? (<react_1.MenuItem onClick={function (e) {
                    setSelectedUserIds([row.user.id]);
                    deactivateCustomerModal.onOpen();
                }} className="text-red-500 hover:text-red-500">
                <react_1.MenuIcon icon={<lu_1.LuBan />}/>
                <macro_1.Trans>Deactivate Account</macro_1.Trans>
              </react_1.MenuItem>) : hasUnrevokedInvite ? (permissions.can("delete", "users") && (<react_1.MenuItem onClick={function () {
                    setSelectedUserIds([row.user.id]);
                    revokeInviteModal.onOpen();
                }} destructive>
                  <react_1.MenuIcon icon={<lu_1.LuBan />}/>
                  <macro_1.Trans>Revoke Invite</macro_1.Trans>
                </react_1.MenuItem>)) : (<react_1.MenuItem onClick={function () {
                    setSelectedUserIds([row.user.id]);
                    resendInviteModal.onOpen();
                }}>
                <react_1.MenuIcon icon={<lu_1.LuMailCheck />}/>
                <macro_1.Trans>Send Invite</macro_1.Trans>
              </react_1.MenuItem>)}
          </>);
    }, [
        deactivateCustomerModal,
        hasUnrevokedInviteForRow,
        permissions,
        resendInviteModal,
        revokeInviteModal
    ]);
    return (<>
        <components_1.Table count={count} columns={columns} data={rows} defaultColumnVisibility={defaultColumnVisibility} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer"], ["Customer"])))} to={"new?".concat(params.toString())}/>)} renderActions={renderActions} renderContextMenu={renderContextMenu} title={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Customer Accounts"], ["Customer Accounts"])))} withSelectableRows={canEdit}/>

        {deactivateCustomerModal.isOpen && (<users_1.DeactivateUsersModal userIds={selectedUserIds} isOpen={deactivateCustomerModal.isOpen} redirectTo={path_1.path.to.customerAccounts} onClose={deactivateCustomerModal.onClose}/>)}
        {resendInviteModal.isOpen && (<users_1.ResendInviteModal userIds={selectedUserIds} isOpen={resendInviteModal.isOpen} onClose={resendInviteModal.onClose}/>)}
        {revokeInviteModal.isOpen && (<users_1.RevokeInviteModal userIds={selectedUserIds} isOpen={revokeInviteModal.isOpen} onClose={revokeInviteModal.onClose}/>)}
      </>);
});
CustomerAccountsTable.displayName = "CustomerTable";
exports.default = CustomerAccountsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
