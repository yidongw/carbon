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
var SupplierType_1 = require("~/components/Form/SupplierType");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var purchasing_1 = require("~/modules/purchasing");
var SupplierStatusIndicator_1 = require("~/modules/purchasing/ui/Supplier/SupplierStatusIndicator");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
// Supplier inline edits go through the shared supplier bulk-update action.
var SUPPLIER_UPDATE = {
    action: path_1.path.to.bulkUpdateSupplier,
    idKey: "ids"
};
var SuppliersTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count, tags = _a.tags;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var people = (0, stores_1.usePeople)()[0];
    var deleteModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(null), selectedSupplier = _c[0], setSelectedSupplier = _c[1];
    var supplierTypes = (0, SupplierType_1.useSupplierTypes)();
    var companySettings = (0, hooks_1.useCompanySettings)();
    var showSupplierReadableId = (_b = companySettings === null || companySettings === void 0 ? void 0 : companySettings.showSupplierReadableId) !== null && _b !== void 0 ? _b : false;
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("supplier");
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
        var defaultColumns = __spreadArray(__spreadArray([], (showSupplierReadableId ? [idColumn] : []), true), [
            {
                accessorKey: "name",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="max-w-[320px] truncate">
            <components_1.Hyperlink to={path_1.path.to.supplierDetails(row.original.id)}>
              <components_1.SupplierAvatar supplierId={row.original.id}/>
            </components_1.Hyperlink>
          </div>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier Status"], ["Supplier Status"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "enum",
                    field: "supplierStatus",
                    update: SUPPLIER_UPDATE,
                    value: function (r) { return r.status; },
                    options: purchasing_1.supplierStatusType.map(function (status) { return ({
                        value: status,
                        label: <SupplierStatusIndicator_1.SupplierStatusIndicator status={status}/>
                    }); }),
                    renderInline: function (v) { return (<SupplierStatusIndicator_1.SupplierStatusIndicator status={v}/>); }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: purchasing_1.supplierStatusType.map(function (status) { return ({
                            value: status,
                            label: <SupplierStatusIndicator_1.SupplierStatusIndicator status={status}/>
                        }); })
                    },
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "supplierTypeId",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "supplierTypeId",
                    update: SUPPLIER_UPDATE,
                    value: function (r) { return r.supplierTypeId; },
                    clearable: true,
                    options: supplierTypes !== null && supplierTypes !== void 0 ? supplierTypes : [],
                    renderInline: function (v) {
                        var _a;
                        return (<>{(_a = supplierTypes === null || supplierTypes === void 0 ? void 0 : supplierTypes.find(function (st) { return st.value === v; })) === null || _a === void 0 ? void 0 : _a.label}</>);
                    }
                }),
                meta: {
                    icon: <lu_1.LuShapes />,
                    filter: {
                        type: "static",
                        options: supplierTypes === null || supplierTypes === void 0 ? void 0 : supplierTypes.map(function (type) { return ({
                            value: type.value,
                            label: <Enumerable_1.Enumerable value={type.label}/>
                        }); })
                    }
                }
            },
            {
                id: "accountManagerId",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Account Manager"], ["Account Manager"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "accountManagerId",
                    update: SUPPLIER_UPDATE,
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
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="supplier" availableTags={tags}/>);
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
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Currency"], ["Currency"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuEuro />
                }
            },
            {
                accessorKey: "phone",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Phone"], ["Phone"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "phone",
                    update: SUPPLIER_UPDATE,
                    value: function (r) { return r.phone; }
                }),
                meta: {
                    icon: <lu_1.LuPhone />
                }
            },
            {
                accessorKey: "fax",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Fax"], ["Fax"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "fax",
                    update: SUPPLIER_UPDATE,
                    value: function (r) { return r.fax; }
                }),
                meta: {
                    icon: <lu_1.LuPrinter />
                }
            },
            {
                accessorKey: "website",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Website"], ["Website"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "website",
                    update: SUPPLIER_UPDATE,
                    value: function (r) { return r.website; }
                }),
                meta: {
                    icon: <lu_1.LuGlobe />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ], false);
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [
        supplierTypes,
        people,
        tags,
        customColumns,
        t,
        formatDate,
        showSupplierReadableId
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () { return function (row) { return (<>
        <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.supplier(row.id)); }}>
          <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
          <macro_1.Trans>Edit Supplier</macro_1.Trans>
        </react_1.MenuItem>
        <react_1.MenuItem destructive disabled={!permissions.can("delete", "purchasing")} onClick={function () {
            setSelectedSupplier(row);
            deleteModal.onOpen();
        }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete Supplier</macro_1.Trans>
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
                table: "supplier",
                label: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Suppliers"], ["Suppliers"])))
            },
            {
                table: "supplierContact",
                label: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Contacts"], ["Contacts"])))
            }
        ]} primaryAction={permissions.can("create", "purchasing") && (<div className="flex items-center gap-2">
              <react_1.Button variant="secondary" leftIcon={<lu_1.LuShapes />} asChild>
                <react_router_1.Link to={path_1.path.to.supplierTypes}>
                  <macro_1.Trans>Supplier Types</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
              <components_1.New label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Supplier"], ["Supplier"])))} to={path_1.path.to.newSupplier}/>
            </div>)} renderContextMenu={renderContextMenu} title={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Suppliers"], ["Suppliers"])))} table="supplier" withSavedView/>
      {selectedSupplier && selectedSupplier.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSupplier(selectedSupplier.id)} isOpen={deleteModal.isOpen} name={selectedSupplier.name} text={"Are you sure you want to delete ".concat(selectedSupplier.name, "? This cannot be undone.")} onCancel={function () {
                deleteModal.onClose();
                setSelectedSupplier(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedSupplier(null);
            }}/>)}
    </>);
});
SuppliersTable.displayName = "SupplierTable";
exports.default = SuppliersTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
