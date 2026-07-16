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
var CustomerType_1 = require("~/components/Form/CustomerType");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
// Customer inline edits go through the shared customer bulk-update action.
var CUSTOMER_UPDATE = {
    action: path_1.path.to.bulkUpdateCustomer,
    idKey: "ids"
};
var CustomersTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count, customerStatuses = _a.customerStatuses, tags = _a.tags;
    var _c = (0, macro_1.useLingui)(), t = _c.t, i18n = _c.i18n;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var people = (0, stores_1.usePeople)()[0];
    var deleteModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(null), selectedCustomer = _d[0], setSelectedCustomer = _d[1];
    var translateStatus = (0, react_2.useCallback)(function (value) { return i18n._(value); }, [i18n]);
    var customerTypes = (0, CustomerType_1.useCustomerTypes)();
    var companySettings = (0, hooks_1.useCompanySettings)();
    var showCustomerReadableId = (_b = companySettings === null || companySettings === void 0 ? void 0 : companySettings.showCustomerReadableId) !== null && _b !== void 0 ? _b : false;
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("customer");
    var columns = (0, react_2.useMemo)(function () {
        var idColumn = {
            accessorKey: "readableId",
            header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ID"], ["ID"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (<span className="font-mono text-xs text-muted-foreground">
            {(_b = row.original.readableId) !== null && _b !== void 0 ? _b : ""}
          </span>);
            },
            meta: {
                icon: <lu_1.LuHash />
            }
        };
        var defaultColumns = __spreadArray(__spreadArray([], (showCustomerReadableId ? [idColumn] : []), true), [
            {
                accessorKey: "name",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="max-w-[320px] truncate">
              <components_1.Hyperlink to={path_1.path.to.customerDetails(row.original.id)}>
                <components_1.CustomerAvatar customerId={row.original.id}/>
              </components_1.Hyperlink>
            </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "customerStatusId",
                    update: CUSTOMER_UPDATE,
                    value: function (r) { return r.customerStatusId; },
                    clearable: true,
                    options: customerStatuses.map(function (status) {
                        var _a;
                        return ({
                            value: status.id,
                            label: <Enumerable_1.Enumerable value={translateStatus((_a = status.name) !== null && _a !== void 0 ? _a : "")}/>
                        });
                    }),
                    renderInline: function (v, _opts, r) {
                        var _a, _b, _c;
                        return (<Enumerable_1.Enumerable value={translateStatus((_c = (_b = (_a = customerStatuses.find(function (s) { return s.id === v; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : r.status) !== null && _c !== void 0 ? _c : "")}/>);
                    }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: customerStatuses === null || customerStatuses === void 0 ? void 0 : customerStatuses.map(function (status) {
                            var _a;
                            return ({
                                value: status.name,
                                label: <Enumerable_1.Enumerable value={translateStatus((_a = status.name) !== null && _a !== void 0 ? _a : "")}/>
                            });
                        })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "customerTypeId",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "customerTypeId",
                    update: CUSTOMER_UPDATE,
                    value: function (r) { return r.customerTypeId; },
                    clearable: true,
                    options: customerTypes !== null && customerTypes !== void 0 ? customerTypes : [],
                    renderInline: function (v) {
                        var _a;
                        return (<>{(_a = customerTypes === null || customerTypes === void 0 ? void 0 : customerTypes.find(function (ct) { return ct.value === v; })) === null || _a === void 0 ? void 0 : _a.label}</>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuShapes />,
                    filter: {
                        type: "static",
                        options: customerTypes === null || customerTypes === void 0 ? void 0 : customerTypes.map(function (type) { return ({
                            value: type.value,
                            label: <Enumerable_1.Enumerable value={type.label}/>
                        }); })
                    }
                }
            },
            {
                id: "accountManagerId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Account Manager"], ["Account Manager"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "accountManagerId",
                    update: CUSTOMER_UPDATE,
                    value: function (r) { return r.accountManagerId; },
                    clearable: true,
                    options: people.map(function (employee) { return ({
                        value: employee.id,
                        label: employee.name
                    }); }),
                    renderInline: function (v) { return <components_1.EmployeeAvatar employeeId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "tags",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="customer" availableTags={tags}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags === null || tags === void 0 ? void 0 : tags.map(function (tag) { return ({
                            value: tag.name,
                            label: <react_1.Badge variant="secondary">{tag.name}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "currencyCode",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Currency"], ["Currency"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuEuro />
                }
            },
            {
                accessorKey: "phone",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Phone"], ["Phone"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "phone",
                    update: CUSTOMER_UPDATE,
                    value: function (r) { return r.phone; }
                }),
                meta: {
                    icon: <lu_1.LuPhone />
                }
            },
            {
                accessorKey: "fax",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Fax"], ["Fax"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "fax",
                    update: CUSTOMER_UPDATE,
                    value: function (r) { return r.fax; }
                }),
                meta: {
                    icon: <lu_1.LuPrinter />
                }
            },
            {
                accessorKey: "website",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Website"], ["Website"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "website",
                    update: CUSTOMER_UPDATE,
                    value: function (r) { return r.website; }
                }),
                meta: {
                    icon: <lu_1.LuGlobe />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ], false);
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        customerStatuses,
        customerTypes,
        people,
        customColumns,
        tags,
        t,
        translateStatus,
        formatDate,
        showCustomerReadableId
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () { return function (row) { return (<>
          <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.customer(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "sales")} onClick={function () {
            setSelectedCustomer(row);
            deleteModal.onOpen();
        }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Customer</macro_1.Trans>
          </react_1.MenuItem>
        </>); }; }, [navigate, deleteModal, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["name"]
        }} defaultColumnVisibility={{
            currencyCode: false,
            phone: false,
            fax: false,
            website: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
        }} importCSV={[
            {
                table: "customer",
                label: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Customers"], ["Customers"])))
            },
            {
                table: "customerContact",
                label: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Contacts"], ["Contacts"])))
            }
        ]} primaryAction={permissions.can("create", "sales") && (<div className="flex items-center gap-2">
                <react_1.Button className="hidden md:inline-flex" variant="secondary" leftIcon={<lu_1.LuShapes />} asChild>
                  <react_router_1.Link to={path_1.path.to.customerTypes}>
                    <macro_1.Trans>Customer Types</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>
                <components_1.New label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Customer"], ["Customer"])))} to={path_1.path.to.newCustomer}/>
              </div>)} renderContextMenu={renderContextMenu} table="customer" title={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Customers"], ["Customers"])))} withSavedView/>
        {selectedCustomer && selectedCustomer.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteCustomer(selectedCustomer.id)} isOpen={deleteModal.isOpen} name={selectedCustomer.name} text={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), selectedCustomer.name)} onCancel={function () {
                deleteModal.onClose();
                setSelectedCustomer(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedCustomer(null);
            }}/>)}
      </>);
});
CustomersTable.displayName = "CustomerTable";
exports.default = CustomersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
