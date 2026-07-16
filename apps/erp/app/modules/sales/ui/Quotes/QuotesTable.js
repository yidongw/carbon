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
var Location_1 = require("~/components/Form/Location");
var InlineEditor_1 = require("~/components/InlineEditor");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
// Quote inline edits go through the shared quote bulk-update action.
var QUOTE_UPDATE = {
    action: path_1.path.to.bulkUpdateQuote,
    idKey: "ids"
};
var QuoteStatus_1 = require("./QuoteStatus");
var QuotesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _b = (0, react_2.useState)(null), selectedQuotation = _b[0], setSelectedQuotation = _b[1];
    var deleteQuotationModal = (0, react_1.useDisclosure)();
    var customers = (0, stores_1.useCustomers)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var locations = (0, Location_1.useLocations)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("quote");
    var columns = (0, react_2.useMemo)(function () {
        var _a;
        var employeeOptions = people.map(function (employee) { return ({
            value: employee.id,
            label: employee.name
        }); });
        var defaultColumns = [
            {
                accessorKey: "quoteId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quote Number"], ["Quote Number"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack>
            <components_1.ItemThumbnail size="md" thumbnailPath={row.original.thumbnailPath} 
                    // @ts-ignore
                    type={row.original.itemType}/>
            <components_1.Hyperlink to={path_1.path.to.quoteDetails(row.original.id)}>
              <div className="flex justify-start items-center gap-0">
                <span>{row.original.quoteId}</span>
                {((_b = row.original.revisionId) !== null && _b !== void 0 ? _b : 0) > 0 && (<span className="text-muted-foreground">
                    -{row.original.revisionId}
                  </span>)}
              </div>
            </components_1.Hyperlink>
          </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                id: "customerId",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Customer"], ["Customer"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "customerId",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.customerId; },
                    options: (_a = customers === null || customers === void 0 ? void 0 : customers.map(function (c) { return ({ value: c.id, label: c.name }); })) !== null && _a !== void 0 ? _a : [],
                    renderInline: function (v) { return <components_1.CustomerAvatar customerId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: customers === null || customers === void 0 ? void 0 : customers.map(function (customer) { return ({
                            value: customer.id,
                            label: customer.name
                        }); })
                    },
                    icon: <lu_1.LuSquareUser />
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    var status = row.original.status;
                    var lines = (_b = row.original.lines) !== null && _b !== void 0 ? _b : 0;
                    var completedLines = (_c = row.original.completedLines) !== null && _c !== void 0 ? _c : 0;
                    return status === "Draft" ? (<react_1.BarProgress gradient progress={lines === 0 ? 0 : (completedLines / lines) * 100}/>) : (<QuoteStatus_1.default status={status}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: sales_models_1.quoteStatusType.map(function (status) { return ({
                            value: status,
                            label: <QuoteStatus_1.default status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "customerReference",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer RFQ"], ["Customer RFQ"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "text",
                    field: "customerReference",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.customerReference; }
                }),
                meta: {
                    icon: <lu_1.LuQrCode />
                }
            },
            {
                accessorKey: "salesPersonId",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Sales Person"], ["Sales Person"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "salesPersonId",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.salesPersonId; },
                    clearable: true,
                    options: employeeOptions,
                    renderInline: function (v) { return <components_1.EmployeeAvatar employeeId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: employeeOptions
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "estimatorId",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Estimator"], ["Estimator"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "estimatorId",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.estimatorId; },
                    clearable: true,
                    options: employeeOptions,
                    renderInline: function (v) { return <components_1.EmployeeAvatar employeeId={v}/>; }
                }),
                meta: {
                    filter: {
                        type: "static",
                        options: employeeOptions
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                id: "assignee",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="quote" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                accessorKey: "dueDate",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "dueDate",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.dueDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "expirationDate",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Expiration Date"], ["Expiration Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "expirationDate",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.expirationDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "locationName",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: QUOTE_UPDATE,
                    value: function (r) { return r.locationId; },
                    options: locations,
                    fallbackLabel: function (r) { return r.locationName; }
                }),
                meta: {
                    filter: {
                        type: "fetcher",
                        endpoint: path_1.path.to.api.locations,
                        transform: function (data) {
                            var _a;
                            return (_a = data === null || data === void 0 ? void 0 : data.map(function (_a) {
                                var name = _a.name;
                                return ({
                                    value: name,
                                    label: <Enumerable_1.Enumerable value={name}/>
                                });
                            })) !== null && _a !== void 0 ? _a : [];
                        }
                    },
                    icon: <lu_1.LuMap />
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
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customers, people, customColumns, t, formatDate]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
        <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.quoteDetails(row.id)); }}>
          <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
          <macro_1.Trans>Edit</macro_1.Trans>
        </react_1.MenuItem>
        <react_1.MenuItem disabled={!permissions.can("delete", "sales")} destructive onClick={function () {
                setSelectedQuotation(row);
                deleteQuotationModal.onOpen();
            }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete</macro_1.Trans>
        </react_1.MenuItem>
      </>); };
    }, [deleteQuotationModal, navigate, permissions]);
    return (<>
      <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["quoteId"]
        }} defaultColumnVisibility={{
            createdAt: false,
            createdBy: false,
            updatedAt: false,
            updatedBy: false
        }} primaryAction={permissions.can("create", "sales") && (<components_1.New label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Quote"], ["Quote"])))} to={path_1.path.to.newQuote}/>)} renderContextMenu={renderContextMenu} table="quote" title={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Quotes"], ["Quotes"])))} withSavedView/>
      {selectedQuotation && selectedQuotation.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteQuote(selectedQuotation.id)} isOpen={deleteQuotationModal.isOpen} name={selectedQuotation.quoteId} text={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), selectedQuotation.quoteId)} onCancel={function () {
                deleteQuotationModal.onClose();
                setSelectedQuotation(null);
            }} onSubmit={function () {
                deleteQuotationModal.onClose();
                setSelectedQuotation(null);
            }}/>)}
    </>);
});
QuotesTable.displayName = "QuotesTable";
exports.default = QuotesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
