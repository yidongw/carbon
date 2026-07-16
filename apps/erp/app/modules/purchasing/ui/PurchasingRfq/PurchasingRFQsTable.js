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
var purchasing_models_1 = require("../../purchasing.models");
var _1 = require(".");
// Purchasing RFQ inline edits go through the shared bulk-update action.
var PURCHASING_RFQ_UPDATE = {
    action: path_1.path.to.bulkUpdatePurchasingRfq,
    idKey: "ids"
};
var PurchasingRFQsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var _b = (0, react_2.useState)(null), selectedPurchasingRFQ = _b[0], setSelectedPurchasingRFQ = _b[1];
    var deletePurchasingRFQModal = (0, react_1.useDisclosure)();
    // const [suppliers] = useSuppliers();
    var people = (0, stores_1.usePeople)()[0];
    var locations = (0, Location_1.useLocations)();
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("purchasingRfq");
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "rfqId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RFQ Number"], ["RFQ Number"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
              <components_1.Hyperlink to={path_1.path.to.purchasingRfqDetails(row.original.id)}>
                {row.original.rfqId}
              </components_1.Hyperlink>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "supplierIds",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Suppliers"], ["Suppliers"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e, _f;
                    var row = _a.row;
                    return (<div className="flex items-center gap-1">
                {(_b = row.original.supplierIds) === null || _b === void 0 ? void 0 : _b.slice(0, 2).map(function (supplierId, index) {
                            var _a, _b, _c, _d;
                            return (<span key={index} className="text-sm">
                      {(_b = (_a = suppliers.find(function (s) { return s.id === supplierId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""}
                      {index <
                                    Math.min((_d = (_c = row.original.supplierIds) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0, 2) -
                                        1 && ","}
                    </span>);
                        })}
                {((_d = (_c = row.original.supplierIds) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 2 && (<span className="text-sm text-muted-foreground">
                    +{((_f = (_e = row.original.supplierIds) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) - 2}
                  </span>)}
              </div>);
                },
                meta: {
                    icon: <lu_1.LuContainer />,
                    filter: {
                        type: "static",
                        options: suppliers.map(function (supplier) { return ({
                            value: supplier.id,
                            label: <Enumerable_1.Enumerable value={supplier.name}/>
                        }); }),
                        isArray: true
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (item) {
                    var status = item.getValue();
                    return <_1.PurchasingRFQStatus status={status}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: purchasing_models_1.purchasingRfqStatusType.map(function (status) { return ({
                            value: status,
                            label: <_1.PurchasingRFQStatus status={status}/>
                        }); })
                    },
                    pluralHeader: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Statuses"], ["Statuses"]))),
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "rfqDate",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["RFQ Date"], ["RFQ Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "rfqDate",
                    update: PURCHASING_RFQ_UPDATE,
                    value: function (r) { return r.rfqDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "expirationDate",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Due Date"], ["Due Date"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "date",
                    field: "expirationDate",
                    update: PURCHASING_RFQ_UPDATE,
                    value: function (r) { return r.expirationDate; },
                    renderInline: function (v) { return formatDate(v); }
                }),
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                id: "assignee",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="purchasingRfq" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
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
                id: "createdBy",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Created By"], ["Created By"]))),
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
                accessorKey: "locationName",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Location"], ["Location"]))),
                cell: (0, InlineEditor_1.editableCell)({
                    kind: "picker",
                    field: "locationId",
                    update: PURCHASING_RFQ_UPDATE,
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
    }, [
        people,
        locations,
        customColumns,
        suppliers.find,
        suppliers.map,
        t,
        formatDate
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) { return (<>
          <react_1.MenuItem onClick={function () { return navigate(path_1.path.to.purchasingRfqDetails(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "purchasing")} onClick={function () {
                setSelectedPurchasingRFQ(row);
                deletePurchasingRFQModal.onOpen();
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete</macro_1.Trans>
          </react_1.MenuItem>
        </>); };
    }, [deletePurchasingRFQModal, navigate, permissions]);
    return (<>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["rfqId"]
        }} defaultColumnVisibility={{
            createdAt: false,
            updatedAt: false,
            updatedBy: false
        }} primaryAction={permissions.can("create", "purchasing") && (<components_1.New label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["RFQ"], ["RFQ"])))} to={path_1.path.to.newPurchasingRFQ}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["RFQs"], ["RFQs"])))} table="purchasingRfq" withSavedView/>
        {selectedPurchasingRFQ && selectedPurchasingRFQ.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deletePurchasingRfq(selectedPurchasingRFQ.id)} isOpen={deletePurchasingRFQModal.isOpen} name={selectedPurchasingRFQ.rfqId} text={"Are you sure you want to delete ".concat(selectedPurchasingRFQ.rfqId, "? This cannot be undone.")} onCancel={function () {
                deletePurchasingRFQModal.onClose();
                setSelectedPurchasingRFQ(null);
            }} onSubmit={function () {
                deletePurchasingRFQModal.onClose();
                setSelectedPurchasingRFQ(null);
            }}/>)}
      </>);
});
PurchasingRFQsTable.displayName = "PurchasingRFQsTable";
exports.default = PurchasingRFQsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
