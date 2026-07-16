"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemReorderPolicy = ItemReorderPolicy;
exports.getReorderPolicyDescription = getReorderPolicyDescription;
exports.clearOrdersCache = clearOrdersCache;
exports.getProductionOrdersFromPlanning = getProductionOrdersFromPlanning;
exports.getPurchaseOrdersFromPlanning = getPurchaseOrdersFromPlanning;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var zod_1 = require("zod");
function ItemReorderPolicy(_a) {
    var reorderingPolicy = _a.reorderingPolicy, className = _a.className;
    switch (reorderingPolicy) {
        case "Manual Reorder":
            return (<react_1.Status color="gray" className={className}>
          <macro_1.Trans>Manual</macro_1.Trans>
        </react_1.Status>);
        case "Demand-Based Reorder":
            return (<react_1.Status color="blue" className={className}>
          <macro_1.Trans>Demand-Based</macro_1.Trans>
        </react_1.Status>);
        case "Fixed Reorder Quantity":
            return (<react_1.Status color="green" className={className}>
          <macro_1.Trans>Fixed Reorder</macro_1.Trans>
        </react_1.Status>);
        case "Maximum Quantity":
            return (<react_1.Status color="purple" className={className}>
          <macro_1.Trans>Max Quantity</macro_1.Trans>
        </react_1.Status>);
    }
}
function getReorderPolicyDescription(itemPlanning) {
    var reorderPoint = itemPlanning.reorderPoint;
    switch (itemPlanning.reorderingPolicy) {
        case "Manual Reorder":
            return "Manually reorder the item";
        case "Demand-Based Reorder":
            var demandAccumulationPeriod = itemPlanning.demandAccumulationPeriod;
            return "Order enough to cover the next ".concat(demandAccumulationPeriod, " weeks");
        case "Fixed Reorder Quantity":
            var reorderQuantity = itemPlanning.reorderQuantity;
            return "When stock is below ".concat(reorderPoint, ", order ").concat(reorderQuantity, " units");
        case "Maximum Quantity":
            var maximumInventoryQuantity = itemPlanning.maximumInventoryQuantity;
            return "When stock is below ".concat(reorderPoint, ", order up to ").concat(maximumInventoryQuantity, " units");
    }
}
// Cache for memoizing calculateOrders results
var ordersCache = new Map();
// Generate cache key from itemPlanning and periods
function getCacheKey(itemPlanning, periods) {
    // Include all relevant properties that affect order calculation
    var periodIds = periods.map(function (p) { return p.id; }).join(",");
    var weekValues = Array.from({ length: 48 }, function (_, i) {
        var _a;
        var key = "week".concat(i + 1);
        return (_a = itemPlanning[key]) !== null && _a !== void 0 ? _a : 0;
    }).join(",");
    return "".concat(itemPlanning.id, "_").concat(itemPlanning.reorderingPolicy, "_").concat(itemPlanning.reorderPoint, "_").concat(itemPlanning.reorderQuantity, "_").concat(itemPlanning.maximumInventoryQuantity, "_").concat(itemPlanning.demandAccumulationPeriod, "_").concat(itemPlanning.demandAccumulationSafetyStock, "_").concat(itemPlanning.leadTime, "_").concat(itemPlanning.lotSize, "_").concat(itemPlanning.minimumOrderQuantity, "_").concat(itemPlanning.maximumOrderQuantity, "_").concat(itemPlanning.orderMultiple, "_").concat(periodIds, "_").concat(weekValues);
}
function calculateOrders(_a) {
    var itemPlanning = _a.itemPlanning, periods = _a.periods;
    // Check cache first
    var cacheKey = getCacheKey(itemPlanning, periods);
    var cached = ordersCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    if (itemPlanning.reorderingPolicy === "Manual Reorder") {
        var emptyOrders = [];
        ordersCache.set(cacheKey, emptyOrders);
        return emptyOrders;
    }
    var orders = [];
    var demandAccumulationPeriod = itemPlanning.demandAccumulationPeriod, demandAccumulationSafetyStock = itemPlanning.demandAccumulationSafetyStock, leadTime = itemPlanning.leadTime, lotSize = itemPlanning.lotSize, maximumInventoryQuantity = itemPlanning.maximumInventoryQuantity, maximumOrderQuantity = itemPlanning.maximumOrderQuantity, minimumOrderQuantity = itemPlanning.minimumOrderQuantity, orderMultiple = itemPlanning.orderMultiple, reorderPoint = itemPlanning.reorderPoint, reorderQuantity = itemPlanning.reorderQuantity;
    var todaysDate = (0, date_1.today)((0, date_1.getLocalTimeZone)());
    var orderedQuantity = 0;
    switch (itemPlanning.reorderingPolicy) {
        case "Demand-Based Reorder":
            // Process periods in chunks of demandAccumulationPeriod.
            //
            // End-of-window sizing: only fire an order when the LAST period in
            // the window dips below safety stock, and size it to lift the
            // end-of-window projection back to safety. Mirrors the SQL
            // `calculate_quantity_to_order` DBR branch exactly so this client
            // calculator and the server-side `quantityToOrder` column agree.
            //
            // Trade-off: this hides mid-window dips that recover (e.g. PO lands
            // late in the window). Acceptable here because the server uses the
            // same convention and the planning UI relies on the two being in
            // sync.
            for (var i = 0; i < periods.length; i += demandAccumulationPeriod) {
                var windowEnd = Math.min(i + demandAccumulationPeriod, periods.length);
                // Track first dip (for the order's trigger date) AND walk
                // end-of-window projection (for sizing). The end-of-window value
                // survives because we overwrite on every iteration — same as the
                // SQL function.
                var firstDipIndex = -1;
                var endOfWindowProjection = 0;
                for (var j = i; j < windowEnd; j++) {
                    var periodKey = "week".concat(j + 1);
                    var periodProjection = itemPlanning[periodKey] || 0;
                    var effective = periodProjection + orderedQuantity;
                    if (firstDipIndex === -1 &&
                        effective < demandAccumulationSafetyStock) {
                        firstDipIndex = j;
                    }
                    endOfWindowProjection = effective;
                }
                // Skip the window unless end-of-window is below safety.
                if (endOfWindowProjection >= demandAccumulationSafetyStock)
                    continue;
                // Defensive: if end < safety we should have found a dip, but
                // fall back to window start so we never emit an undated order.
                if (firstDipIndex === -1)
                    firstDipIndex = i;
                var currentPeriod = periods[firstDipIndex];
                {
                    var totalOrderQuantity = Math.max(0, demandAccumulationSafetyStock - endOfWindowProjection);
                    // Apply lot sizing rules
                    if (maximumOrderQuantity > 0) {
                        totalOrderQuantity = Math.min(totalOrderQuantity, maximumOrderQuantity);
                    }
                    totalOrderQuantity = Math.max(totalOrderQuantity, minimumOrderQuantity);
                    if (orderMultiple > 0) {
                        totalOrderQuantity =
                            Math.ceil(totalOrderQuantity / orderMultiple) * orderMultiple;
                    }
                    // If we have a lot size and need to split orders
                    if (lotSize > 0 && totalOrderQuantity > lotSize) {
                        var numberOfBatches = Math.ceil(totalOrderQuantity / lotSize);
                        var daysInPeriod = 7; // Assuming weekly periods
                        for (var batch = 0; batch < numberOfBatches; batch++) {
                            var batchQuantity = Math.min(lotSize, totalOrderQuantity - batch * lotSize);
                            // Spread due dates evenly across the period
                            var dueDateOffset = Math.floor((batch * daysInPeriod) / numberOfBatches);
                            var dueDate = (0, date_1.parseDate)(currentPeriod.startDate).add({
                                days: dueDateOffset
                            });
                            var startDate = dueDate.subtract({ days: leadTime });
                            orders.push({
                                startDate: startDate.toString(),
                                dueDate: dueDate.toString(),
                                quantity: batchQuantity,
                                periodId: currentPeriod.id,
                                isASAP: startDate.compare(todaysDate) < 0,
                                policyName: "Demand-Based Reorder",
                                triggerValues: {
                                    projectedStock: endOfWindowProjection,
                                    safetyStock: demandAccumulationSafetyStock,
                                    lotSize: lotSize,
                                    leadTime: leadTime
                                }
                            });
                        }
                    }
                    else {
                        // Single order for the period
                        var orderQuantity = lotSize > 0
                            ? Math.min(totalOrderQuantity, lotSize)
                            : totalOrderQuantity;
                        var dueDate = (0, date_1.parseDate)(currentPeriod.startDate);
                        var startDate = dueDate.subtract({ days: leadTime });
                        orders.push({
                            startDate: startDate.toString(),
                            dueDate: dueDate.toString(),
                            quantity: orderQuantity,
                            periodId: currentPeriod.id,
                            isASAP: startDate.compare(todaysDate) < 0,
                            policyName: "Demand-Based Reorder",
                            triggerValues: {
                                projectedStock: endOfWindowProjection,
                                safetyStock: demandAccumulationSafetyStock,
                                lotSize: lotSize,
                                leadTime: leadTime
                            }
                        });
                    }
                    orderedQuantity += totalOrderQuantity;
                }
            }
            ordersCache.set(cacheKey, orders);
            return orders;
        case "Fixed Reorder Quantity":
            for (var i = 0; i < periods.length; i++) {
                var period = periods[i];
                var periodKey = "week".concat(i + 1);
                var projectedQuantity = itemPlanning[periodKey] || 0;
                // Check if we need to order based on reorder point
                var remainingQuantityNeeded = reorderPoint - (projectedQuantity + orderedQuantity);
                var day = 0;
                var maxIterations = 100; // Safety counter to prevent infinite loops
                while (remainingQuantityNeeded > 0 && day < 5 && maxIterations-- > 0) {
                    var dueDate = (0, date_1.parseDate)(period.startDate).add({ days: day });
                    var startDate = dueDate.subtract({
                        days: leadTime
                    });
                    // If reorder quantity is 0, order the same quantity as the reorder point
                    var orderQuantity = reorderQuantity > 0 ? reorderQuantity : reorderPoint;
                    orders.push({
                        startDate: startDate.toString(),
                        dueDate: dueDate.toString(),
                        quantity: orderQuantity,
                        periodId: period.id,
                        isASAP: startDate.compare(todaysDate) < 0,
                        policyName: "Fixed Reorder Quantity",
                        triggerValues: {
                            projectedStock: projectedQuantity + orderedQuantity,
                            reorderPoint: reorderPoint,
                            reorderQuantity: reorderQuantity,
                            leadTime: leadTime
                        }
                    });
                    day++;
                    orderedQuantity += orderQuantity;
                    remainingQuantityNeeded =
                        reorderPoint - (projectedQuantity + orderedQuantity);
                }
            }
            ordersCache.set(cacheKey, orders);
            return orders;
        case "Maximum Quantity":
            for (var i = 0; i < periods.length; i++) {
                var period = periods[i];
                var periodKey = "week".concat(i + 1);
                var projectedQuantity = itemPlanning[periodKey] || 0;
                // Check if we need to order based on reorder point
                var remainingQuantityNeeded = reorderPoint - (projectedQuantity + orderedQuantity);
                var day = 0;
                var maxIterations = 100; // Safety counter to prevent infinite loops
                while (remainingQuantityNeeded > 0 && day < 5 && maxIterations-- > 0) {
                    var dueDate = (0, date_1.parseDate)(period.startDate).add({ days: day });
                    var startDate = dueDate.subtract({
                        days: leadTime
                    });
                    // Calculate required quantity up to maximum inventory
                    var requiredQuantity = maximumInventoryQuantity - (projectedQuantity + orderedQuantity);
                    // If reorder quantity is 0, use reorder point as the base order quantity
                    var orderQuantity = reorderQuantity > 0
                        ? Math.max(minimumOrderQuantity, requiredQuantity)
                        : reorderPoint;
                    // Ensure orderQuantity is positive to prevent infinite loop
                    if (orderQuantity <= 0) {
                        break;
                    }
                    // Round to nearest multiple if specified
                    if (orderMultiple && orderMultiple > 1) {
                        orderQuantity =
                            Math.ceil(orderQuantity / orderMultiple) * orderMultiple;
                    }
                    // Only apply lot size if it's greater than 0
                    if (lotSize > 0) {
                        orderQuantity = Math.ceil(orderQuantity / lotSize) * lotSize;
                    }
                    // Apply maximum order quantity only if it's greater than 0
                    if (maximumOrderQuantity > 0) {
                        orderQuantity = Math.min(orderQuantity, maximumOrderQuantity);
                    }
                    orders.push({
                        startDate: startDate.toString(),
                        dueDate: dueDate.toString(),
                        quantity: orderQuantity,
                        periodId: period.id,
                        isASAP: startDate.compare(todaysDate) < 0 &&
                            projectedQuantity + orderedQuantity < 0,
                        policyName: "Maximum Quantity",
                        triggerValues: {
                            projectedStock: projectedQuantity + orderedQuantity,
                            reorderPoint: reorderPoint,
                            leadTime: leadTime,
                            reorderQuantity: reorderQuantity
                        }
                    });
                    day++;
                    orderedQuantity += orderQuantity;
                    remainingQuantityNeeded =
                        reorderPoint - (projectedQuantity + orderedQuantity);
                }
            }
            ordersCache.set(cacheKey, orders);
            return orders;
        default:
            ordersCache.set(cacheKey, orders);
            return orders;
    }
}
// Export function to clear the cache if needed (e.g., after MRP runs)
function clearOrdersCache() {
    ordersCache.clear();
}
function getProductionOrdersFromPlanning(itemPlanning, periods) {
    return calculateOrders({ itemPlanning: itemPlanning, periods: periods });
}
var supplierPartValidator = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    supplierId: zod_1.z.string(),
    supplierUnitOfMeasureCode: zod_1.z.string(),
    conversionFactor: zod_1.z.number(),
    unitPrice: zod_1.z.number()
}));
function getPurchaseOrdersFromPlanning(itemPlanning, periods, items, supplierId) {
    var _a, _b;
    var suppliers = supplierPartValidator.safeParse(itemPlanning.suppliers);
    var supplier = (_a = suppliers.data) === null || _a === void 0 ? void 0 : _a.find(function (supplier) { return supplier.supplierId === supplierId; });
    var item = items.find(function (item) { return item.id === itemPlanning.id; });
    // Get the conversion factor from the selected supplier
    var conversionFactor = (_b = supplier === null || supplier === void 0 ? void 0 : supplier.conversionFactor) !== null && _b !== void 0 ? _b : 1;
    return calculateOrders({ itemPlanning: itemPlanning, periods: periods }).map(function (order) {
        var _a;
        return (__assign(__assign({}, order), { 
            // Convert inventory quantity to purchase quantity by dividing by conversion factor
            quantity: conversionFactor > 0
                ? Math.ceil(order.quantity / conversionFactor)
                : order.quantity, supplierId: (_a = supplier === null || supplier === void 0 ? void 0 : supplier.supplierId) !== null && _a !== void 0 ? _a : itemPlanning.preferredSupplierId, itemReadableId: item === null || item === void 0 ? void 0 : item.readableIdWithRevision, description: item === null || item === void 0 ? void 0 : item.name, unitOfMeasureCode: item === null || item === void 0 ? void 0 : item.unitOfMeasureCode }));
    });
}
