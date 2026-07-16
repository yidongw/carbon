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
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var UnitOfMeasure_1 = require("~/components/Form/UnitOfMeasure");
var hooks_1 = require("~/hooks");
var inventory_models_1 = require("~/modules/inventory/inventory.models");
var items_models_1 = require("~/modules/items/items.models");
var ItemReorderPolicy_1 = require("~/modules/items/ui/Item/ItemReorderPolicy");
var stores_1 = require("~/stores");
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var PurchasingPlanningOrderDrawer_1 = require("./PurchasingPlanningOrderDrawer");
var PlanningTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, locationId = _a.locationId, periods = _a.periods;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        month: "short",
        day: "numeric"
    });
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var locations = (0, Location_1.useLocations)();
    var unitOfMeasures = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var mrpFetcher = (0, react_router_1.useFetcher)();
    var bulkUpdateFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (bulkUpdateFetcher.state !== "idle" || !bulkUpdateFetcher.data) {
            return;
        }
        if (((_a = bulkUpdateFetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false &&
            ((_b = bulkUpdateFetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.error(bulkUpdateFetcher.data.message);
        }
        if (((_c = bulkUpdateFetcher.data) === null || _c === void 0 ? void 0 : _c.success) === true) {
            var purchaseOrders = (_e = (_d = bulkUpdateFetcher.data) === null || _d === void 0 ? void 0 : _d.purchaseOrders) !== null && _e !== void 0 ? _e : [];
            if (purchaseOrders.length === 0) {
                react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Orders submitted"], ["Orders submitted"]))));
            }
            else {
                react_1.toast.success(<div className="flex gap-1">
              <span>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Orders submitted"], ["Orders submitted"])))}</span>
              <span className="flex flex-wrap gap-2 text-xs">
                {purchaseOrders.map(function (po) { return (<react_router_1.Link key={po.id} to={path_1.path.to.purchaseOrder(po.id)} className="underline underline-offset-2 hover:opacity-80">
                    {po.readableId}
                  </react_router_1.Link>); })}
              </span>
            </div>, { duration: 8000 });
            }
        }
    }, [bulkUpdateFetcher.state, bulkUpdateFetcher.data]);
    var _b = (0, react_2.useState)(function () {
        var initial = {};
        data.forEach(function (item) {
            var _a, _b;
            // If there's a preferred supplier, use it
            if (item.preferredSupplierId) {
                initial[item.id] = item.preferredSupplierId;
            }
            // If there's only one supplier, auto-select it regardless of preference
            else if (((_a = item.suppliers) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                initial[item.id] = item.suppliers[0].supplierId;
            }
            // Otherwise, use the first available supplier if any
            else if (((_b = item.suppliers) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                initial[item.id] = item.suppliers[0].supplierId;
            }
        });
        return initial;
    }), suppliersMap = _b[0], setSuppliersMap = _b[1];
    var isDisabled = !permissions.can("create", "production") ||
        bulkUpdateFetcher.state !== "idle" ||
        mrpFetcher.state !== "idle";
    var items = (0, stores_1.useItems)()[0];
    // Store orders in a map keyed by item id - calculate on-demand instead of eagerly
    var _c = (0, react_2.useState)({}), ordersMap = _c[0], setOrdersMap = _c[1];
    // Auto-computed planned orders for every row, used as the fallback when
    // bulk-submitting items the user never opened in the drawer.
    var _d = (0, react_2.useState)(new Map()), ordersByItemId = _d[0], setOrdersByItemId = _d[1];
    // Clear cache when MRP completes
    (0, react_2.useEffect)(function () {
        if (mrpFetcher.state === "idle" && mrpFetcher.data) {
            (0, ItemReorderPolicy_1.clearOrdersCache)();
            setOrdersMap({}); // Reset local state to force recalculation
        }
    }, [mrpFetcher.state, mrpFetcher.data]);
    // Clear local state when data changes (e.g., filters, search)
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        setOrdersMap({});
    }, [data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onBulkUpdate = (0, react_2.useCallback)(function (selectedRows, action) {
        // Filter out rows without suppliers and track them for error reporting
        var rowsWithoutSuppliers = selectedRows.filter(function (row) { return row.id && !suppliersMap[row.id]; });
        var rowsWithSuppliers = selectedRows.filter(function (row) { return row.id && suppliersMap[row.id]; });
        if (rowsWithoutSuppliers.length > 0) {
            react_1.toast.error("Cannot place order - ".concat(rowsWithoutSuppliers.length, " item(s) have no supplier associated"));
        }
        if (rowsWithSuppliers.length === 0) {
            return;
        }
        var payload = {
            locationId: locationId,
            items: rowsWithSuppliers
                .filter(function (row) { return row.id; })
                .map(function (row) {
                var _a;
                // Prefer user-edited orders (from the drawer) when present,
                // otherwise fall back to the auto-computed planned orders so
                // bulk submit works for items the user never opened.
                var sourceOrders = ordersMap[row.id] && ordersMap[row.id].length > 0
                    ? ordersMap[row.id]
                    : ((_a = ordersByItemId.get(row.id)) !== null && _a !== void 0 ? _a : []);
                var ordersWithPeriods = sourceOrders.map(function (order) {
                    var _a, _b;
                    var supplierId = (_a = suppliersMap[row.id]) !== null && _a !== void 0 ? _a : order.supplierId;
                    if (!order.dueDate ||
                        (0, date_1.parseDate)(order.dueDate) < (0, date_1.parseDate)(periods[0].startDate)) {
                        return __assign(__assign({}, order), { supplierId: supplierId, periodId: periods[0].id });
                    }
                    var period = periods.find(function (p) {
                        var dueDate = (0, date_1.parseDate)(order.dueDate);
                        var startDate = (0, date_1.parseDate)(p.startDate);
                        var endDate = (0, date_1.parseDate)(p.endDate);
                        return dueDate >= startDate && dueDate <= endDate;
                    });
                    return __assign(__assign({}, order), { supplierId: supplierId, periodId: (_b = period === null || period === void 0 ? void 0 : period.id) !== null && _b !== void 0 ? _b : periods[periods.length - 1].id });
                });
                return {
                    id: row.id,
                    orders: ordersWithPeriods
                };
            }),
            action: action
        };
        bulkUpdateFetcher.submit(payload, {
            method: "post",
            action: path_1.path.to.bulkUpdatePurchasingPlanning,
            encType: "application/json"
        });
    }, [bulkUpdateFetcher, locationId, ordersMap, ordersByItemId, suppliersMap]);
    var _e = (0, react_2.useState)(null), selectedItem = _e[0], setSelectedItem = _e[1];
    var setOrders = (0, react_2.useCallback)(function (item, orders) {
        if (item.id) {
            setOrdersMap(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[item.id] = orders, _a)));
            });
        }
    }, []);
    var _f = (0, react_2.useTransition)(), isPending = _f[0], startTransition = _f[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        startTransition(function () {
            var ordersByItemId = new Map();
            data.forEach(function (item) {
                ordersByItemId.set(item.id, (0, ItemReorderPolicy_1.getPurchaseOrdersFromPlanning)(item, periods, items, suppliersMap[item.id]));
            });
            setOrdersByItemId(ordersByItemId);
        });
    }, [data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var columns = (0, react_2.useMemo)(function () {
        var periodColumns = periods.map(function (period, index) {
            var isCurrentWeek = index === 0;
            var weekNumber = index + 1;
            var weekKey = "week".concat(weekNumber);
            var startDate = (0, date_1.parseDate)(period.startDate).toDate((0, date_1.getLocalTimeZone)());
            var endDate = (0, date_1.parseDate)(period.endDate).toDate((0, date_1.getLocalTimeZone)());
            return {
                accessorKey: weekKey,
                header: function () { return (<react_1.VStack spacing={0}>
                <div>
                  {isCurrentWeek ? "Present Week" : "Week ".concat(weekNumber)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dateFormatter.format(startDate)} -{" "}
                  {dateFormatter.format(endDate)}
                </div>
              </react_1.VStack>); },
                cell: function (_a) {
                    var row = _a.row;
                    var value = row.getValue(weekKey);
                    if (value === undefined)
                        return "-";
                    return (<span className={value < 0 ? "text-red-500 font-bold" : undefined}>
                  {numberFormatter.format(value)}
                </span>);
                }
            };
        });
        return __spreadArray(__spreadArray([
            {
                accessorKey: "readableIdWithRevision",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Item ID"], ["Item ID"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="py-1 cursor-pointer" onClick={function () {
                            setSelectedItem(row.original);
                        }}>
              <components_1.ItemThumbnail size="sm" thumbnailPath={row.original.thumbnailPath} type={row.original.type}/>

              <react_1.VStack spacing={0} className="font-medium">
                <components_1.CardActionValue>
                  {row.original.readableIdWithRevision}
                </components_1.CardActionValue>
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.name}
                </div>
              </react_1.VStack>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "unitOfMeasureCode",
                header: "",
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = unitOfMeasures.find(function (uom) { return uom.value === row.original.unitOfMeasureCode; })) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : null}/>);
                }
            },
            {
                accessorKey: "preferredSupplierId",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Supplier"], ["Supplier"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var supplierId = suppliersMap[row.original.id];
                    if (!supplierId)
                        return <react_1.Status color="red">No Supplier</react_1.Status>;
                    return <components_1.SupplierAvatar supplierId={supplierId}/>;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: suppliers.map(function (supplier) { return ({
                            label: supplier.name,
                            value: supplier.id
                        }); })
                    },
                    icon: <lu_1.LuContainer />
                }
            },
            {
                accessorKey: "leadTime",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Lead Time"], ["Lead Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var leadTime = row.original.leadTime;
                    var weeks = Math.ceil(leadTime / 7);
                    return (<span>
                {weeks} week{weeks > 1 ? "s" : ""}
              </span>);
                },
                meta: {
                    icon: <lu_1.LuClock />
                }
            },
            {
                accessorKey: "reorderingPolicy",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Reorder Policy"], ["Reorder Policy"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack>
                <react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={row.original.reorderingPolicy}/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    {(0, ItemReorderPolicy_1.getReorderPolicyDescription)(row.original)}
                  </react_1.TooltipContent>
                </react_1.Tooltip>
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: items_models_1.itemReorderingPolicies.map(function (policy) { return ({
                            label: <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={policy}/>,
                            value: policy
                        }); })
                    },
                    icon: <lu_1.LuCircleCheck />
                }
            },
            {
                accessorKey: "quantityOnHand",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["On Hand"], ["On Hand"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return numberFormatter.format(row.original.quantityOnHand);
                },
                meta: {
                    icon: <lu_1.LuPackage />,
                    renderTotal: true
                }
            }
        ], periodColumns, true), [
            {
                accessorKey: "quantityToOrder",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Qty to Order"], ["Qty to Order"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var value = row.original.quantityToOrder;
                    if (value === undefined || value === 0)
                        return "-";
                    return (<span className="font-medium">
                {numberFormatter.format(value)}
              </span>);
                },
                meta: {
                    icon: <lu_1.LuCirclePlay />
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.type && (<react_1.HStack>
                <components_1.MethodItemTypeIcon type={row.original.type}/>
                <span>{row.original.type}</span>
              </react_1.HStack>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: inventory_models_1.itemTypes
                            .filter(function (t) { return ["Part", "Tool"].includes(t); })
                            .map(function (type) { return ({
                            label: (<react_1.HStack spacing={2}>
                      <components_1.MethodItemTypeIcon type={type}/>
                      <span>{type}</span>
                    </react_1.HStack>),
                            value: type
                        }); })
                    },
                    icon: <lu_1.LuBox />
                }
            },
            {
                id: "Order",
                header: "",
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var orders = row.original.id
                        ? ((_b = ordersByItemId.get(row.original.id)) !== null && _b !== void 0 ? _b : [])
                        : [];
                    var orderQuantity = orders.reduce(function (acc, order) { var _a; return acc + (order.quantity - ((_a = order.existingQuantity) !== null && _a !== void 0 ? _a : 0)); }, 0);
                    var isBlocked = row.original.purchasingBlocked;
                    var hasOrders = orders.length > 0 && orderQuantity > 0;
                    return (<div className="flex justify-end">
                <react_1.Button variant="secondary" leftIcon={hasOrders ? undefined : <lu_1.LuCircleCheck />} isDisabled={isDisabled || isBlocked} onClick={function () {
                            setSelectedItem(row.original);
                        }}>
                  {isBlocked ? ("Blocked") : hasOrders ? (<react_1.HStack>
                      <react_1.PulsingDot />
                      <span>Order {orderQuantity}</span>
                    </react_1.HStack>) : ("Order")}
                </react_1.Button>
              </div>);
                }
            }
        ], false);
    }, [
        suppliers,
        dateFormatter,
        numberFormatter,
        unitOfMeasures,
        suppliersMap,
        isDisabled
        // Note: ordersMap is intentionally not in deps to avoid column regeneration
        // getOrdersForItem inside the cell will access the latest ordersMap via closure
    ]);
    var renderActions = (0, react_2.useCallback)(function (selectedRows) {
        return (<react_1.DropdownMenuContent align="end" className="min-w-[200px]">
            <react_1.DropdownMenuLabel>Update</react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />

            <react_1.DropdownMenuItem onSelect={function () { return onBulkUpdate(selectedRows, "order"); }} disabled={bulkUpdateFetcher.state !== "idle"}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuSquareChartGantt />}/>
              <macro_1.Trans>Order Parts</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>);
    }, [bulkUpdateFetcher.state, onBulkUpdate]);
    var defaultColumnVisibility = {
        active: false,
        type: false
    };
    var defaultColumnPinning = {
        left: ["readableIdWithRevision"],
        right: ["Order"]
    };
    return (<react_1.Loading isLoading={isPending}>
        <components_1.Table count={count} columns={columns} data={data} defaultColumnVisibility={defaultColumnVisibility} defaultColumnPinning={defaultColumnPinning} primaryAction={<div className="flex items-center gap-2">
              <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
                window.location.href = getLocationPath(selected);
            }}/>
              <mrpFetcher.Form method="post" action={path_1.path.to.api.mrp(locationId)}>
                <react_1.Tooltip>
                  <react_1.TooltipTrigger>
                    <react_1.Button type="submit" variant="secondary" rightIcon={<lu_1.LuCirclePlay />} isDisabled={mrpFetcher.state !== "idle"} isLoading={mrpFetcher.state !== "idle"}>
                      <macro_1.Trans>Recalculate</macro_1.Trans>
                    </react_1.Button>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    MRP runs automatically every 3 hours, but you can run it
                    manually here.
                  </react_1.TooltipContent>
                </react_1.Tooltip>
              </mrpFetcher.Form>
            </div>} renderActions={renderActions} title={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Planning"], ["Planning"])))} table="planning" withSavedView withSelectableRows/>

        {selectedItem && (<PurchasingPlanningOrderDrawer_1.PurchasingPlanningOrderDrawer locationId={locationId} selectedItem={selectedItem} setSelectedItem={setSelectedItem} selectedSupplier={suppliersMap[selectedItem.id]} orders={selectedItem.id
                ? ordersMap[selectedItem.id] ||
                    (0, ItemReorderPolicy_1.getPurchaseOrdersFromPlanning)(selectedItem, periods, items, suppliersMap[selectedItem.id])
                : []} setOrders={setOrders} periods={periods} isOpen={!!selectedItem} onClose={function () { return setSelectedItem(null); }} onSupplierChange={function (itemId, supplierId) {
                setSuppliersMap(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[itemId] = supplierId, _a)));
                });
            }}/>)}
      </react_1.Loading>);
});
PlanningTable.displayName = "PlanningTable";
exports.default = PlanningTable;
function getLocationPath(locationId) {
    return "".concat(path_1.path.to.purchasingPlanning, "?location=").concat(locationId);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
