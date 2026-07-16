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
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var stock_transfer_1 = require("~/stores/stock-transfer");
var path_1 = require("~/utils/path");
var JobMaterialsTable = (0, react_2.memo)(function (_a) {
    var _b, _c;
    var data = _a.data, count = _a.count, nearExpiryWarningDays = _a.nearExpiryWarningDays, jobIdProp = _a.jobId, jobStatus = _a.jobStatus, disableNavigation = _a.disableNavigation;
    var params = (0, react_router_1.useParams)();
    var jobId = jobIdProp !== null && jobIdProp !== void 0 ? jobIdProp : params.jobId;
    var t = (0, macro_1.useLingui)().t;
    if (!jobId)
        throw new Error("Job ID is required");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var isRequired = ["Planned", "Ready", "In Progress", "Paused"].includes((_c = jobStatus !== null && jobStatus !== void 0 ? jobStatus : (_b = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : "");
    var fetcher = (0, react_router_1.useFetcher)();
    var formatter = (0, i18n_1.useNumberFormatter)();
    var items = (0, stores_1.useItems)()[0];
    var _d = (0, hooks_1.useUrlParams)(), setSearchParams = _d[1];
    var sessionItemsCount = (0, stock_transfer_1.useStockTransferSessionItemsCount)();
    var _e = (0, stock_transfer_1.useStockTransferSession)(), session = _e[0], setStockTransferSession = _e[1];
    (0, react_1.useMount)(function () {
        // Pre-populate stock transfer session with all parts that need transferred or ordered
        var itemsToAdd = [];
        data.forEach(function (material) {
            var _a;
            if (material.itemTrackingType === "Non-Inventory" ||
                material.methodType === "Make to Order" ||
                !material.id) {
                return;
            }
            var quantityRequiredByStorageUnit = isRequired
                ? material.quantityFromProductionOrderInStorageUnit
                : material.quantityFromProductionOrderInStorageUnit +
                    material.estimatedQuantity;
            // Check if transfer is needed
            var quantityOnHandInStorageUnit = material.quantityOnHandInStorageUnit;
            var quantityInTransitToStorageUnit = material.quantityInTransitToStorageUnit;
            var hasStorageUnitQuantityFlag = quantityOnHandInStorageUnit + quantityInTransitToStorageUnit <
                quantityRequiredByStorageUnit;
            if (hasStorageUnitQuantityFlag) {
                itemsToAdd.push({
                    id: material.id, // Job material ID
                    itemId: material.jobMaterialItemId, // Actual item ID
                    itemReadableId: material.itemReadableId,
                    description: material.description,
                    action: "transfer",
                    quantity: quantityRequiredByStorageUnit - quantityOnHandInStorageUnit,
                    requiresSerialTracking: material.itemTrackingType === "Serial",
                    requiresBatchTracking: material.itemTrackingType === "Batch",
                    storageUnitId: material.storageUnitId
                });
            }
            // Check if order is needed
            var quantityOnHand = material.quantityOnHandInStorageUnit +
                material.quantityOnHandNotInStorageUnit;
            var incoming = material.quantityOnPurchaseOrder + material.quantityOnProductionOrder;
            var required = material.quantityFromProductionOrderInStorageUnit +
                material.quantityFromProductionOrderNotInStorageUnit +
                material.quantityOnSalesOrder;
            var hasTotalQuantityFlag = quantityOnHand + incoming - required < 0;
            if (hasTotalQuantityFlag) {
                itemsToAdd.push({
                    id: material.id, // Job material ID
                    itemId: material.jobMaterialItemId, // Actual item ID
                    itemReadableId: material.itemReadableId,
                    description: material.description,
                    action: "order",
                    quantity: ((_a = material.estimatedQuantity) !== null && _a !== void 0 ? _a : 0) -
                        (quantityOnHand + incoming - required),
                    requiresSerialTracking: material.itemTrackingType === "Serial",
                    requiresBatchTracking: material.itemTrackingType === "Batch",
                    storageUnitId: material.storageUnitId
                });
            }
        });
        if (itemsToAdd.length > 0) {
            setStockTransferSession({ items: itemsToAdd });
        }
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "readableIdWithRevision",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="py-1">
              <components_1.ItemThumbnail size="md" 
                    // @ts-ignore
                    type={row.original.itemType}/>

              <react_1.VStack spacing={0}>
                <react_1.HStack spacing={2}>
                  {disableNavigation ? (<span className="max-w-[260px] truncate">
                      {row.original.itemReadableId}
                    </span>) : (<components_1.Hyperlink to={path_1.path.to.jobMakeMethod(jobId, row.original.jobMakeMethodId)} onClick={function () {
                                var _a;
                                setSearchParams({ materialId: (_a = row.original.id) !== null && _a !== void 0 ? _a : null });
                            }} className="max-w-[260px] truncate">
                      {row.original.itemReadableId}
                    </components_1.Hyperlink>)}
                  {nearExpiryWarningDays !== null &&
                            nearExpiryWarningDays !== undefined &&
                            row.original.hasExpiredBatch && (<react_1.Badge variant="red" className="gap-1 text-xs shrink-0">
                        <lu_1.LuCalendarX className="size-3"/>
                        <macro_1.Trans>Expired batch</macro_1.Trans>
                      </react_1.Badge>)}
                </react_1.HStack>
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.description}
                </div>
              </react_1.VStack>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />,
                    filter: {
                        type: "static",
                        options: items.map(function (item) { return ({
                            value: item.readableIdWithRevision,
                            label: item.readableIdWithRevision
                        }); })
                    }
                }
            },
            {
                accessorKey: "estimatedQuantity",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Required"], ["Required"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.estimatedQuantity);
                },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                id: "method",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Method"], ["Method"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack>
              <react_1.Badge variant="secondary">
                <components_1.MethodIcon type={row.original.methodType} className="size-3 mr-1"/>
                {(_b = row.original.storageUnitName) !== null && _b !== void 0 ? _b : (row.original.methodType === "Make to Order"
                            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["WIP"], ["WIP"]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Default Storage Unit"], ["Default Storage Unit"]))))}
              </react_1.Badge>
            </react_1.HStack>);
                }
            },
            {
                id: "quantityOnHandInStorageUnit",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["On Storage Unit"], ["On Storage Unit"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var isInventoried = row.original.itemTrackingType !== "Non-Inventory";
                    if (!isInventoried)
                        return (<react_1.Badge variant="secondary">
                  <components_1.TrackingTypeIcon type="Non-Inventory" className="mr-2"/>
                  <span>Non-Inventory</span>
                </react_1.Badge>);
                    var quantityRequiredByStorageUnit = isRequired
                        ? row.original.quantityFromProductionOrderInStorageUnit
                        : row.original.quantityFromProductionOrderInStorageUnit +
                            row.original.estimatedQuantity;
                    if (row.original.methodType === "Make to Order") {
                        return null;
                    }
                    var quantityOnHandInStorageUnit = row.original.quantityOnHandInStorageUnit;
                    var quantityInTransitToStorageUnit = row.original.quantityInTransitToStorageUnit;
                    var hasStorageUnitQuantityFlag = quantityOnHandInStorageUnit + quantityInTransitToStorageUnit <
                        quantityRequiredByStorageUnit;
                    return (<react_1.HStack>
                {hasStorageUnitQuantityFlag ? (<>
                    <span className="text-red-500">
                      {formatter.format(quantityOnHandInStorageUnit)}
                    </span>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger asChild>
                        <span>
                          <lu_1.LuFlag className="text-red-500"/>
                        </span>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="font-medium">
                            Storage unit demand exceeds supply
                          </div>
                          <div>
                            On hand at unit:{" "}
                            {formatter.format(quantityOnHandInStorageUnit)}
                          </div>
                          <div>
                            In transit to unit:{" "}
                            {formatter.format(quantityInTransitToStorageUnit)}
                          </div>
                          <div>
                            Required at unit:{" "}
                            {formatter.format(quantityRequiredByStorageUnit)}
                          </div>
                          <div className="font-medium">
                            Net:{" "}
                            {formatter.format(quantityOnHandInStorageUnit +
                                quantityInTransitToStorageUnit -
                                quantityRequiredByStorageUnit)}
                          </div>
                        </div>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                  </>) : (<span>{formatter.format(quantityOnHandInStorageUnit)}</span>)}
              </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                id: "quantityOnHand",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["On Hand"], ["On Hand"]))),
                cell: function (_a) {
                    var row = _a.row;
                    if (row.original.itemTrackingType === "Non-Inventory" ||
                        row.original.methodType === "Make to Order") {
                        return null;
                    }
                    var quantityOnHand = row.original.quantityOnHandInStorageUnit +
                        row.original.quantityOnHandNotInStorageUnit;
                    var incoming = row.original.quantityOnPurchaseOrder +
                        row.original.quantityOnProductionOrder;
                    var required = row.original.quantityFromProductionOrderInStorageUnit +
                        row.original.quantityFromProductionOrderNotInStorageUnit +
                        row.original.quantityOnSalesOrder;
                    var hasTotalQuantityFlag = quantityOnHand + incoming - required < 0;
                    return (<react_1.HStack>
                {hasTotalQuantityFlag ? (<>
                    <span className="text-red-500">
                      {formatter.format(quantityOnHand)}
                    </span>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger asChild>
                        <span>
                          <lu_1.LuFlag className="text-red-500"/>
                        </span>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="font-medium">
                            Future demand exceeds supply
                          </div>
                          <div>On hand: {formatter.format(quantityOnHand)}</div>
                          <div>Incoming: {formatter.format(incoming)}</div>
                          <div>Required: {formatter.format(required)}</div>
                          <div className="font-medium">
                            Net:{" "}
                            {formatter.format(quantityOnHand + incoming - required)}
                          </div>
                        </div>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                  </>) : (<span>{formatter.format(quantityOnHand)}</span>)}
              </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                id: "required",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Required"], ["Required"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityFromProductionOrderInStorageUnit +
                        row.original.quantityFromProductionOrderNotInStorageUnit +
                        row.original.quantityOnSalesOrder);
                },
                meta: {
                    icon: <lu_1.LuArrowDown className="text-red-600"/>
                }
            },
            {
                id: "incoming",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Incoming"], ["Incoming"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityOnPurchaseOrder +
                        row.original.quantityOnProductionOrder);
                },
                meta: {
                    icon: <lu_1.LuArrowUp className="text-emerald-600"/>
                }
            },
            {
                id: "transfer",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Transfer"], ["Transfer"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return formatter.format(row.original.quantityInTransitToStorageUnit);
                },
                meta: {
                    icon: <lu_1.LuArrowLeftRight className="text-blue-600"/>
                }
            }
        ];
    }, [
        items,
        jobId,
        setSearchParams,
        isRequired,
        formatter,
        sessionItemsCount,
        disableNavigation
    ]);
    var renderContextMenu = (0, react_2.useMemo)(function () {
        return function (row) {
            // Skip non-inventory items and make items
            if (row.itemTrackingType === "Non-Inventory" ||
                row.methodType === "Make to Order" ||
                !row.id) {
                return null;
            }
            var quantityRequiredByStorageUnit = isRequired
                ? row.quantityFromProductionOrderInStorageUnit
                : row.quantityFromProductionOrderInStorageUnit +
                    row.estimatedQuantity;
            var quantityOnHandInStorageUnit = row.quantityOnHandInStorageUnit;
            var quantityOnHand = row.quantityOnHandInStorageUnit + row.quantityOnHandNotInStorageUnit;
            var incoming = row.quantityOnPurchaseOrder + row.quantityOnProductionOrder;
            var required = row.quantityFromProductionOrderInStorageUnit +
                row.quantityFromProductionOrderNotInStorageUnit +
                row.quantityOnSalesOrder;
            // Check if items are already in session
            var isInSessionForTransfer = session.items.some(function (item) { return item.id === row.id && item.action === "transfer"; });
            var isInSessionForOrder = session.items.some(function (item) { return item.id === row.id && item.action === "order"; });
            return (<>
            <react_1.MenuItem destructive={isInSessionForTransfer} onClick={function () {
                    if (isInSessionForTransfer) {
                        (0, stock_transfer_1.removeFromStockTransferSession)(row.id, "transfer");
                    }
                    else {
                        (0, stock_transfer_1.addToStockTransferSession)({
                            id: row.id, // Job material ID
                            itemId: row.jobMaterialItemId, // Actual item ID
                            itemReadableId: row.itemReadableId,
                            description: row.description,
                            action: "transfer",
                            quantity: quantityRequiredByStorageUnit -
                                quantityOnHandInStorageUnit,
                            requiresSerialTracking: row.itemTrackingType === "Serial",
                            requiresBatchTracking: row.itemTrackingType === "Batch",
                            storageUnitId: row.storageUnitId
                        });
                    }
                }}>
              <react_1.MenuIcon icon={<lu_1.LuTruck />}/>
              {isInSessionForTransfer ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Remove Transfer"], ["Remove Transfer"]))) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Transfer"], ["Transfer"])))}
            </react_1.MenuItem>
            <react_1.MenuItem destructive={isInSessionForOrder} onClick={function () {
                    var _a;
                    if (isInSessionForOrder) {
                        (0, stock_transfer_1.removeFromStockTransferSession)(row.id, "order");
                    }
                    else {
                        (0, stock_transfer_1.addToStockTransferSession)({
                            id: row.id, // Job material ID
                            itemId: row.jobMaterialItemId, // Actual item ID
                            itemReadableId: row.itemReadableId,
                            description: row.description,
                            action: "order",
                            quantity: ((_a = row.estimatedQuantity) !== null && _a !== void 0 ? _a : 0) -
                                (quantityOnHand + incoming - required),
                            requiresSerialTracking: row.itemTrackingType === "Serial",
                            requiresBatchTracking: row.itemTrackingType === "Batch",
                            storageUnitId: row.storageUnitId
                        });
                    }
                }}>
              <react_1.MenuIcon icon={<lu_1.LuShoppingCart />}/>
              {isInSessionForOrder ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Remove Order"], ["Remove Order"]))) : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Order"], ["Order"])))}
            </react_1.MenuItem>
          </>);
        };
    }, [isRequired, session.items, t]);
    var permissions = (0, hooks_1.usePermissions)();
    return (<>
        <components_1.Table compact count={count} columns={columns} data={data} primaryAction={data.length > 0 && permissions.can("update", "production") ? (<fetcher.Form action={path_1.path.to.jobRecalculate(jobId)} method="post">
                <react_1.Button leftIcon={<lu_1.LuRefreshCcwDot />} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit" variant="secondary">
                  <macro_1.Trans>Recalculate</macro_1.Trans>
                </react_1.Button>
              </fetcher.Form>) : undefined} renderContextMenu={renderContextMenu} title={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Materials"], ["Materials"])))}/>
        <StockTransferSessionWidget jobId={jobId}/>
      </>);
});
JobMaterialsTable.displayName = "JobMaterialsTable";
exports.default = JobMaterialsTable;
var StockTransferSessionWidget = function (_a) {
    var _b;
    var jobId = _a.jobId;
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, stock_transfer_1.useStockTransferSession)(), session = _c[0], setStockTransferSession = _c[1];
    var sessionItemsCount = (0, stock_transfer_1.useStockTransferSessionItemsCount)();
    var orderItems = (0, stock_transfer_1.useOrderItems)();
    var transferItems = (0, stock_transfer_1.useTransferItems)();
    var _d = (0, react_2.useState)(false), isExpanded = _d[0], setIsExpanded = _d[1];
    var _e = (0, react_2.useState)(false), isMinimized = _e[0], setIsMinimized = _e[1];
    var allItems = __spreadArray(__spreadArray([], orderItems, true), transferItems, true);
    var onRemoveItem = function (itemId, action) {
        var updatedItems = session.items.filter(function (sessionItem) {
            return !(sessionItem.id === itemId && sessionItem.action === action);
        });
        setStockTransferSession({ items: updatedItems });
    };
    var onClearAll = function () {
        setStockTransferSession({ items: [] });
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClearAll();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    if (sessionItemsCount === 0) {
        return null;
    }
    if (isMinimized) {
        return (<div className="fixed bottom-6 right-6 z-50">
        <button onClick={function () { return setIsMinimized(false); }} className="relative flex items-center justify-center w-16 h-16 bg-card border-2 border-border rounded-full shadow-2xl hover:scale-105 transition-transform duration-200">
          <lu_1.LuShoppingCart className="w-6 h-6 text-foreground"/>
          {allItems.length > 0 && (<react_1.Badge className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center p-0 border-2 border-background">
              {allItems.length}
            </react_1.Badge>)}
        </button>
      </div>);
    }
    return (<div className="fixed bottom-6 right-6 z-[9999]">
      <div className={"bg-card border-2 border-border rounded-2xl shadow-2xl transition-all duration-300 ease-in-out ".concat(isExpanded ? "w-96 h-[32rem]" : "w-80 h-auto")}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <lu_1.LuCheckCheck className="w-5 h-5 text-primary-foreground"/>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-base">
                <macro_1.Trans>Action Items</macro_1.Trans>
              </h3>
              <p className="text-xs text-muted-foreground">
                {allItems.length} {allItems.length === 1 ? t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["item"], ["item"]))) : t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["items"], ["items"])))}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <react_1.IconButton variant="ghost" size="sm" aria-label={isExpanded ? t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Minimize"], ["Minimize"]))) : t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Expand"], ["Expand"])))} icon={isExpanded ? (<lu_1.LuMinus className="size-4"/>) : (<lu_1.LuMaximize2 className="size-4"/>)} onClick={function () { return setIsExpanded(!isExpanded); }}/>
            <react_1.IconButton variant="ghost" size="sm" aria-label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Close"], ["Close"])))} icon={<lu_1.LuX className="size-4"/>} onClick={function () { return setIsMinimized(true); }}/>
          </div>
        </div>

        {/* Content */}
        {isExpanded ? (<div className="flex flex-col h-[calc(32rem-5rem)]">
            <react_1.ScrollArea className="flex-1 p-4">
              {allItems.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <lu_1.LuShoppingCart className="w-8 h-8 text-muted-foreground"/>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <macro_1.Trans>No parts added yet</macro_1.Trans>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <macro_1.Trans>Start adding parts to your stock transfer</macro_1.Trans>
                  </p>
                </div>) : (<div className="space-y-3">
                  {orderItems.length > 0 && (<div className="mb-4">
                      <react_1.HStack className="mb-2">
                        <lu_1.LuShoppingCart className="h-3 w-3"/>
                        <span className="text-sm font-medium">
                          <macro_1.Trans>Orders</macro_1.Trans>{" "}
                          <react_1.Count count={orderItems.length}/>
                        </span>
                      </react_1.HStack>
                      <div className="space-y-2">
                        {orderItems.map(function (item) { return (<div key={"".concat(item.id, "-order")} className="group bg-secondary/50 border border-border rounded-lg p-3 hover:bg-secondary transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-mono text-xs font-semibold">
                                    {item.itemReadableId}
                                  </span>
                                  <react_1.Badge variant="outline">
                                    <macro_1.Trans>Order</macro_1.Trans>
                                  </react_1.Badge>
                                </div>
                                <p className="text-sm text-card-foreground font-medium truncate">
                                  {item.description}
                                </p>
                              </div>
                              <react_1.IconButton variant="secondary" aria-label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Remove item"], ["Remove item"])))} icon={<lu_1.LuTrash2 />} size="sm" onClick={function () { return onRemoveItem(item.id, "order"); }}/>
                            </div>
                          </div>); })}
                      </div>
                    </div>)}

                  {transferItems.length > 0 && (<div>
                      <react_1.HStack className="mb-2">
                        <lu_1.LuTruck className="h-3 w-3"/>
                        <span className="text-sm font-medium">
                          <macro_1.Trans>Transfers</macro_1.Trans>{" "}
                          <react_1.Count count={transferItems.length}/>
                        </span>
                      </react_1.HStack>
                      <div className="space-y-2">
                        {transferItems.map(function (item) { return (<div key={"".concat(item.id, "-transfer")} className="group bg-secondary/50 border border-border rounded-lg p-3 hover:bg-secondary transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-mono text-xs font-semibold">
                                    {item.itemReadableId}
                                  </span>
                                  <react_1.Badge variant="outline">
                                    <macro_1.Trans>Transfer</macro_1.Trans>
                                  </react_1.Badge>
                                </div>
                                <p className="text-sm text-card-foreground font-medium truncate">
                                  {item.description}
                                </p>
                              </div>
                              <react_1.IconButton variant="secondary" aria-label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Remove item"], ["Remove item"])))} icon={<lu_1.LuTrash2 />} size="sm" onClick={function () {
                            return onRemoveItem(item.id, "transfer");
                        }}/>
                            </div>
                          </div>); })}
                      </div>
                    </div>)}
                </div>)}
            </react_1.ScrollArea>

            {/* Footer */}
            {allItems.length > 0 && (<div className="p-4 border-t-2 border-border space-y-2 w-full">
                <fetcher.Form method="post" action={path_1.path.to.newJobMaterialsSession(jobId)}>
                  <input type="hidden" name="jobId" value={jobId}/>
                  <input type="hidden" name="items" value={JSON.stringify(allItems)}/>
                  <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} size="lg" className="w-full" type="submit">
                    <macro_1.Trans>Create</macro_1.Trans>
                  </react_1.Button>
                </fetcher.Form>
                <react_1.Button variant="ghost" className="w-full" onClick={onClearAll}>
                  <macro_1.Trans>Clear All</macro_1.Trans>
                </react_1.Button>
              </div>)}
          </div>) : (<div className="p-4 space-y-4">
            {allItems.length === 0 ? (<p className="text-sm text-muted-foreground text-center py-2">
                <macro_1.Trans>No parts added yet</macro_1.Trans>
              </p>) : (<div className="space-y-2">
                {allItems.slice(0, 3).map(function (item) { return (<div key={"".concat(item.id, "-").concat(item.action)} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs">
                      {item.itemReadableId}
                    </span>
                    <react_1.Badge variant="outline">{item.action}</react_1.Badge>
                  </div>); })}
                {allItems.length > 3 && (<p className="text-xs text-muted-foreground text-center pt-1">
                    <macro_1.Trans>+{allItems.length - 3} more</macro_1.Trans>
                  </p>)}
              </div>)}
            {allItems.length > 0 && (<fetcher.Form method="post" action={path_1.path.to.newJobMaterialsSession(jobId)}>
                <input type="hidden" name="jobId" value={jobId}/>
                <input type="hidden" name="items" value={JSON.stringify(allItems)}/>
                <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} size="lg" className="w-full" type="submit">
                  Create
                </react_1.Button>
              </fetcher.Form>)}
          </div>)}
      </div>
    </div>);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
