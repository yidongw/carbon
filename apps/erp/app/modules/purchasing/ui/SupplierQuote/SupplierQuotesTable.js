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
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
// Supplier quote inline edits go through the shared bulk-update action.
var SUPPLIER_QUOTE_UPDATE = {
    action: path_1.path.to.bulkUpdateSupplierQuote,
    idKey: "ids"
};
var SupplierQuoteStatus_1 = require("./SupplierQuoteStatus");
var SupplierQuotesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _b = (0, react_2.useState)(null), selectedSupplierQuote = _b[0], setSelectedSupplierQuote = _b[1];
    var deleteSupplierQuoteModal = (0, react_1.useDisclosure)();
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var people = (0, stores_1.usePeople)()[0];
    // const optimisticFavorite = useOptimisticFavorite();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("quote");
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var employeeOptions = people.map(function (employee) { return ({
            value: employee.id,
            label: employee.name
        }); });
        var defaultColumns = [
            {
                accessorKey: "supplierQuoteId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quote Number"], ["Quote Number"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
              <components_1.ItemThumbnail size="sm" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.itemType}/>
              <components_1.Hyperlink to={path_1.path.to.supplierQuoteDetails(row.original.id)}>
                {row.original.supplierQuoteId}
              </components_1.Hyperlink>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                id: "supplierId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "supplierId",
                    update: SUPPLIER_QUOTE_UPDATE,
                    value: function (r) { return r.supplierId; },
                    options: (_a = suppliers === null || suppliers === void 0 ? void 0 : suppliers.map(function (s) { return ({ value: s.id, label: s.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.SupplierAvatar supplierId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: suppliers === null || suppliers === void 0 ? void 0 : suppliers.map(function (supplier) { return ({
                            value: supplier.id,
                            label: supplier.name
                        }); })
                    },
                    icon: <lu_1.LuSquareUser />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<SupplierQuoteStatus_1.default status={row.original.status}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: purchasing_models_1.supplierQuoteStatusType.map(function (status) { return ({
                            value: status,
                            label: <SupplierQuoteStatus_1.default status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "supplierReference",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Supplier Reference"], ["Supplier Reference"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "supplierReference",
                    update: SUPPLIER_QUOTE_UPDATE,
                    value: function (r) { return r.supplierReference; }
                }),
                meta: {
                    icon: <lu_1.LuQrCode />
                }
            },
            {
                id: "assignee",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="supplierQuote" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: employeeOptions
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "quotedDate",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quoted Date"], ["Quoted Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "quotedDate",
                    update: SUPPLIER_QUOTE_UPDATE,
                    value: function (r) { return r.quotedDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "expirationDate",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Expiration Date"], ["Expiration Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "expirationDate",
                    update: SUPPLIER_QUOTE_UPDATE,
                    value: function (r) { return r.expirationDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "updatedBy",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
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
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [suppliers, people, customColumns, t, formatDate]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
          <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.supplierQuoteDetails(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "purchasing")} onClick={function () {
                setSelectedSupplierQuote(row);
                deleteSupplierQuoteModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete</macro_1.Trans>
          </react_1.MenuItem>
        </>); };
    }, [deleteSupplierQuoteModal, navigate, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["supplierQuoteId"]
        }} defaultColumnVisibility={{
            createdAt: false,
            createdBy: false,
            updatedAt: false,
            updatedBy: false
        }} primaryAction={permissions.can("create", "purchasing") && (<components_1.New label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Supplier Quote"], ["Supplier Quote"])))} to={path_1.path.to.newSupplierQuote}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Supplier Quotes"], ["Supplier Quotes"])))} table="supplierQuote" withSavedView/>
        {selectedSupplierQuote && selectedSupplierQuote.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSupplierQuote(selectedSupplierQuote.id)} isOpen={deleteSupplierQuoteModal.isOpen} name={selectedSupplierQuote.supplierQuoteId} text={"Are you sure you want to delete ".concat(selectedSupplierQuote.supplierQuoteId, "? This cannot be undone.")} onCancel={function () {
                deleteSupplierQuoteModal.onClose();
                setSelectedSupplierQuote(null);
            }} onSubmit={function () {
                deleteSupplierQuoteModal.onClose();
                setSelectedSupplierQuote(null);
            }}/>)}
      </>);
});
SupplierQuotesTable.displayName = "SupplierQuotesTable";
exports.default = SupplierQuotesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
