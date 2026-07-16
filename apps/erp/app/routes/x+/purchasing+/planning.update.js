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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var purchasing_1 = require("~/modules/purchasing");
var itemsValidator = zod_1.z
    .object({
    id: zod_1.z.string(),
    orders: zod_1.z.array(purchasing_1.plannedOrderValidator)
})
    .array();
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, _d, items, action, locationId, _e, parsedItems, errorMessages, itemsToOrder, supplierIds, itemIds, periodIds, allSupplyForecasts, existingLineUpdates, ordersBySupplierPeriod, errors, _i, itemsToOrder_1, item, itemHasUsableOrder, _f, _g, order, key, _h, suppliers, supplierParts, periods, company, suppliersById, baseCurrencyCode, processedItems, _j, existingLineUpdates_1, order, updateLine, poCache, _loop_1, _k, ordersBySupplierPeriod_1, _l, key, ordersInGroup, uniqueSupplyForecasts, insertForecasts, errorMsg, message, purchaseOrders, error_1;
        var _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10;
        var request = _b.request;
        return __generator(this, function (_11) {
            switch (_11.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "purchasing",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _11.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    return [4 /*yield*/, request.json()];
                case 2:
                    _d = _11.sent(), items = _d.items, action = _d.action, locationId = _d.locationId;
                    if (typeof locationId !== "string") {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Location ID is required and must be a valid string"
                            }, { status: 500 })];
                    }
                    if (typeof action !== "string") {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Action parameter is required and must be a valid string"
                            }, { status: 500 })];
                    }
                    _e = action;
                    switch (_e) {
                        case "order": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 17];
                case 3:
                    parsedItems = itemsValidator.safeParse(items);
                    if (!parsedItems.success) {
                        errorMessages = parsedItems.error.errors.map(function (error) {
                            var path = error.path;
                            var field = path[path.length - 1];
                            // Create more readable error messages based on the field and context
                            if (field === "orders" && path.length === 2) {
                                return "No orders provided for item";
                            }
                            if (field === "supplierId" || field === "suppliers") {
                                return "No suppliers provided";
                            }
                            if (field === "quantity") {
                                return "Invalid quantity specified";
                            }
                            if (field === "unitPrice") {
                                return "Invalid unit price specified";
                            }
                            if (field === "periodId") {
                                return "No period specified";
                            }
                            if (field === "deliveryDate") {
                                return "Invalid delivery date";
                            }
                            // Fallback to original message for unhandled cases
                            return error.message;
                        });
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Validation failed: ".concat(errorMessages.join(", ")),
                                errors: errorMessages
                            }, { status: 500 })];
                    }
                    itemsToOrder = parsedItems.data;
                    if (itemsToOrder.length === 0) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "No items were provided to create purchase orders"
                            }, { status: 500 })];
                    }
                    _11.label = 4;
                case 4:
                    _11.trys.push([4, 16, , 17]);
                    supplierIds = new Set();
                    itemIds = new Set();
                    periodIds = new Set();
                    allSupplyForecasts = [];
                    existingLineUpdates = [];
                    ordersBySupplierPeriod = new Map();
                    errors = [];
                    for (_i = 0, itemsToOrder_1 = itemsToOrder; _i < itemsToOrder_1.length; _i++) {
                        item = itemsToOrder_1[_i];
                        itemIds.add(item.id);
                        itemHasUsableOrder = false;
                        for (_f = 0, _g = item.orders; _f < _g.length; _f++) {
                            order = _g[_f];
                            if (order.supplierId)
                                supplierIds.add(order.supplierId);
                            if (order.periodId)
                                periodIds.add(order.periodId);
                            if (order.existingLineId) {
                                existingLineUpdates.push({ itemId: item.id, order: order });
                                itemHasUsableOrder = true;
                            }
                            else if (order.supplierId && order.periodId) {
                                key = "".concat(order.supplierId, "::").concat(order.periodId);
                                if (!ordersBySupplierPeriod.has(key)) {
                                    ordersBySupplierPeriod.set(key, []);
                                }
                                ordersBySupplierPeriod.get(key).push({
                                    itemId: item.id,
                                    order: order
                                });
                                itemHasUsableOrder = true;
                            }
                        }
                        if (!itemHasUsableOrder) {
                            errors.push("Item ".concat(item.id, " skipped: no order had both a supplier and a period (check that the item has a preferred supplier)"));
                        }
                    }
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("supplier")
                                .select("id, name, taxPercent, currencyCode")
                                .in("id", Array.from(supplierIds)),
                            client
                                .from("supplierPart")
                                .select("*")
                                .in("itemId", Array.from(itemIds)),
                            client.from("period").select("*").in("id", Array.from(periodIds)),
                            client
                                .from("company")
                                .select("id, baseCurrencyCode")
                                .eq("id", companyId)
                                .single()
                        ])];
                case 5:
                    _h = _11.sent(), suppliers = _h[0], supplierParts = _h[1], periods = _h[2], company = _h[3];
                    if (suppliers.error) {
                        console.error("Failed to fetch suppliers:", suppliers.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to retrieve supplier information from database"
                            }, { status: 500 })];
                    }
                    if (supplierParts.error) {
                        console.error("Failed to fetch supplier parts:", supplierParts.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to retrieve supplier part information from database"
                            }, { status: 500 })];
                    }
                    if (periods.error) {
                        console.error("Failed to fetch periods:", periods.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to retrieve period information from database"
                            }, { status: 500 })];
                    }
                    if (company.error) {
                        console.error("Failed to fetch company:", company.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to retrieve company information from database"
                            }, { status: 500 })];
                    }
                    suppliersById = new Map((_o = (_m = suppliers.data) === null || _m === void 0 ? void 0 : _m.map(function (supplier) { return [supplier.id, supplier]; })) !== null && _o !== void 0 ? _o : []);
                    baseCurrencyCode = (_q = (_p = company.data) === null || _p === void 0 ? void 0 : _p.baseCurrencyCode) !== null && _q !== void 0 ? _q : "USD";
                    processedItems = 0;
                    _j = 0, existingLineUpdates_1 = existingLineUpdates;
                    _11.label = 6;
                case 6:
                    if (!(_j < existingLineUpdates_1.length)) return [3 /*break*/, 9];
                    order = existingLineUpdates_1[_j].order;
                    return [4 /*yield*/, client
                            .from("purchaseOrderLine")
                            .update({
                            purchaseQuantity: order.quantity,
                            requiredDate: (_r = order.dueDate) !== null && _r !== void 0 ? _r : null,
                            updatedBy: userId
                        })
                            .eq("id", order.existingLineId)];
                case 7:
                    updateLine = _11.sent();
                    if (updateLine.error) {
                        errors.push("Failed to update existing PO line ".concat(order.existingLineId, ": ").concat(updateLine.error.message));
                    }
                    _11.label = 8;
                case 8:
                    _j++;
                    return [3 /*break*/, 6];
                case 9:
                    poCache = new Map();
                    _loop_1 = function (key, ordersInGroup) {
                        var _12, supplierId, periodId, supplier, purchaseOrderId, purchaseOrderReadableId, period, matchingLines, createPO, _loop_2, _13, ordersInGroup_1, _14, itemId, order;
                        return __generator(this, function (_15) {
                            switch (_15.label) {
                                case 0:
                                    _12 = key.split("::"), supplierId = _12[0], periodId = _12[1];
                                    supplier = suppliersById.get(supplierId);
                                    if (!supplier) {
                                        errors.push("Supplier ".concat(supplierId, " not found"));
                                        return [2 /*return*/, "continue"];
                                    }
                                    purchaseOrderId = (_s = poCache.get(key)) === null || _s === void 0 ? void 0 : _s.id;
                                    purchaseOrderReadableId = (_t = poCache.get(key)) === null || _t === void 0 ? void 0 : _t.readableId;
                                    if (!!purchaseOrderId) return [3 /*break*/, 2];
                                    period = (_u = periods.data) === null || _u === void 0 ? void 0 : _u.find(function (p) { return p.id === periodId; });
                                    if (!period) return [3 /*break*/, 2];
                                    return [4 /*yield*/, client
                                            .from("purchaseOrderLine")
                                            .select("purchaseOrderId, purchaseOrder!inner(readableId:purchaseOrderId, supplierId, status)")
                                            .gte("requiredDate", period.startDate)
                                            .lte("requiredDate", period.endDate)
                                            .eq("purchaseOrder.supplierId", supplierId)
                                            .in("purchaseOrder.status", ["Draft", "Planned"])
                                            .limit(1)];
                                case 1:
                                    matchingLines = (_15.sent()).data;
                                    if (matchingLines === null || matchingLines === void 0 ? void 0 : matchingLines[0]) {
                                        purchaseOrderId = matchingLines[0].purchaseOrderId;
                                        purchaseOrderReadableId =
                                            (_w = (_v = matchingLines[0].purchaseOrder) === null || _v === void 0 ? void 0 : _v.readableId) !== null && _w !== void 0 ? _w : undefined;
                                    }
                                    _15.label = 2;
                                case 2:
                                    if (!!purchaseOrderId) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, purchasing_1.insertPurchaseOrder)(client, {
                                            status: "Planned",
                                            supplierId: supplierId,
                                            purchaseOrderType: "Purchase",
                                            currencyCode: (_x = supplier.currencyCode) !== null && _x !== void 0 ? _x : baseCurrencyCode,
                                            companyId: companyId,
                                            companyGroupId: companyGroupId,
                                            createdBy: userId
                                        })];
                                case 3:
                                    createPO = _15.sent();
                                    if (createPO.error || !createPO.data) {
                                        errors.push("Failed to create PO for supplier ".concat(supplierId, ": ").concat((_z = (_y = createPO.error) === null || _y === void 0 ? void 0 : _y.message) !== null && _z !== void 0 ? _z : "no data returned"));
                                        return [2 /*return*/, "continue"];
                                    }
                                    purchaseOrderId = createPO.data.id;
                                    purchaseOrderReadableId = createPO.data.purchaseOrderId;
                                    _15.label = 4;
                                case 4:
                                    poCache.set(key, {
                                        id: purchaseOrderId,
                                        readableId: purchaseOrderReadableId !== null && purchaseOrderReadableId !== void 0 ? purchaseOrderReadableId : purchaseOrderId
                                    });
                                    _loop_2 = function (itemId, order) {
                                        var supplierPart, purchasing, minimumOrderQuantity, adjustedQuantity, existingLines, existing, updateLine, createLine, conversionFactor;
                                        return __generator(this, function (_16) {
                                            switch (_16.label) {
                                                case 0:
                                                    supplierPart = (_0 = supplierParts === null || supplierParts === void 0 ? void 0 : supplierParts.data) === null || _0 === void 0 ? void 0 : _0.find(function (sp) { return sp.itemId === itemId && sp.supplierId === supplierId; });
                                                    return [4 /*yield*/, client
                                                            .from("itemReplenishment")
                                                            .select("purchasingBlocked")
                                                            .eq("itemId", itemId)
                                                            .single()];
                                                case 1:
                                                    purchasing = _16.sent();
                                                    if (purchasing.error) {
                                                        errors.push("Failed to retrieve purchasing data for item ".concat(itemId, ": ").concat(purchasing.error.message));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    if ((_1 = purchasing.data) === null || _1 === void 0 ? void 0 : _1.purchasingBlocked) {
                                                        errors.push("Purchasing is blocked for item ".concat(itemId));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    minimumOrderQuantity = (_2 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.minimumOrderQuantity) !== null && _2 !== void 0 ? _2 : 0;
                                                    adjustedQuantity = order.quantity;
                                                    if (minimumOrderQuantity > 0 &&
                                                        adjustedQuantity < minimumOrderQuantity) {
                                                        adjustedQuantity = minimumOrderQuantity;
                                                    }
                                                    return [4 /*yield*/, client
                                                            .from("purchaseOrderLine")
                                                            .select("id, purchaseQuantity")
                                                            .eq("purchaseOrderId", purchaseOrderId)
                                                            .eq("itemId", itemId)
                                                            .limit(1)];
                                                case 2:
                                                    existingLines = (_16.sent()).data;
                                                    if (!(existingLines === null || existingLines === void 0 ? void 0 : existingLines[0])) return [3 /*break*/, 4];
                                                    existing = existingLines[0];
                                                    return [4 /*yield*/, client
                                                            .from("purchaseOrderLine")
                                                            .update({
                                                            purchaseQuantity: ((_3 = existing.purchaseQuantity) !== null && _3 !== void 0 ? _3 : 0) + adjustedQuantity,
                                                            updatedBy: userId
                                                        })
                                                            .eq("id", existing.id)];
                                                case 3:
                                                    updateLine = _16.sent();
                                                    if (updateLine.error) {
                                                        errors.push("Failed to update PO line for item ".concat(itemId, ": ").concat(updateLine.error.message));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    return [3 /*break*/, 6];
                                                case 4: return [4 /*yield*/, (0, purchasing_1.upsertPurchaseOrderLine)(client, {
                                                        purchaseOrderId: purchaseOrderId,
                                                        itemId: itemId,
                                                        description: order.description,
                                                        purchaseOrderLineType: "Part",
                                                        purchaseQuantity: adjustedQuantity,
                                                        purchaseUnitOfMeasureCode: (_4 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.supplierUnitOfMeasureCode) !== null && _4 !== void 0 ? _4 : order.unitOfMeasureCode,
                                                        inventoryUnitOfMeasureCode: order.unitOfMeasureCode,
                                                        conversionFactor: (_5 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.conversionFactor) !== null && _5 !== void 0 ? _5 : 1,
                                                        supplierUnitPrice: (_6 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.unitPrice) !== null && _6 !== void 0 ? _6 : 0,
                                                        supplierTaxAmount: (((_7 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.unitPrice) !== null && _7 !== void 0 ? _7 : 0) *
                                                            ((_8 = supplier.taxPercent) !== null && _8 !== void 0 ? _8 : 0)) /
                                                            100,
                                                        supplierShippingCost: 0,
                                                        requiredDate: (_9 = order.dueDate) !== null && _9 !== void 0 ? _9 : undefined,
                                                        locationId: locationId,
                                                        companyId: companyId,
                                                        createdBy: userId
                                                    })];
                                                case 5:
                                                    createLine = _16.sent();
                                                    if (createLine.error) {
                                                        errors.push("Failed to create PO line for item ".concat(itemId, ": ").concat(createLine.error.message));
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    _16.label = 6;
                                                case 6:
                                                    processedItems++;
                                                    conversionFactor = (_10 = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.conversionFactor) !== null && _10 !== void 0 ? _10 : 1;
                                                    allSupplyForecasts.push({
                                                        itemId: itemId,
                                                        locationId: locationId,
                                                        sourceType: "Purchase Order",
                                                        forecastQuantity: order.quantity * conversionFactor,
                                                        periodId: periodId,
                                                        companyId: companyId,
                                                        createdBy: userId,
                                                        updatedBy: userId
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _13 = 0, ordersInGroup_1 = ordersInGroup;
                                    _15.label = 5;
                                case 5:
                                    if (!(_13 < ordersInGroup_1.length)) return [3 /*break*/, 8];
                                    _14 = ordersInGroup_1[_13], itemId = _14.itemId, order = _14.order;
                                    return [5 /*yield**/, _loop_2(itemId, order)];
                                case 6:
                                    _15.sent();
                                    _15.label = 7;
                                case 7:
                                    _13++;
                                    return [3 /*break*/, 5];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _k = 0, ordersBySupplierPeriod_1 = ordersBySupplierPeriod;
                    _11.label = 10;
                case 10:
                    if (!(_k < ordersBySupplierPeriod_1.length)) return [3 /*break*/, 13];
                    _l = ordersBySupplierPeriod_1[_k], key = _l[0], ordersInGroup = _l[1];
                    return [5 /*yield**/, _loop_1(key, ordersInGroup)];
                case 11:
                    _11.sent();
                    _11.label = 12;
                case 12:
                    _k++;
                    return [3 /*break*/, 10];
                case 13:
                    if (!(allSupplyForecasts.length > 0)) return [3 /*break*/, 15];
                    uniqueSupplyForecasts = deduplicateForecasts(allSupplyForecasts);
                    return [4 /*yield*/, client
                            .from("supplyForecast")
                            .upsert(uniqueSupplyForecasts, {
                            onConflict: "itemId,locationId,periodId",
                            ignoreDuplicates: false
                        })];
                case 14:
                    insertForecasts = _11.sent();
                    if (insertForecasts.error) {
                        errorMsg = "Failed to insert supply forecasts: ".concat(insertForecasts.error.message);
                        console.error(errorMsg);
                        errors.push(errorMsg);
                    }
                    _11.label = 15;
                case 15:
                    if (errors.length > 0 && processedItems === 0) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to process any items. Errors: ".concat(errors
                                    .slice(0, 3)
                                    .join("; ")).concat(errors.length > 3 ? " and ".concat(errors.length - 3, " more...") : ""),
                                errors: errors
                            }, { status: 500 })];
                    }
                    message = processedItems === itemsToOrder.length
                        ? "Successfully processed all ".concat(processedItems, " items")
                        : "Processed ".concat(processedItems, " of ").concat(itemsToOrder.length, " items. ").concat(errors.length, " errors occurred: ").concat(errors.slice(0, 2).join("; ")).concat(errors.length > 2 ? "..." : "");
                    purchaseOrders = Array.from(new Map(Array.from(poCache.values()).map(function (po) { return [po.id, po]; })).values());
                    return [2 /*return*/, {
                            success: processedItems > 0,
                            message: message,
                            processedItems: processedItems,
                            totalItems: itemsToOrder.length,
                            purchaseOrders: purchaseOrders,
                            errors: errors.length > 0 ? errors : undefined
                        }];
                case 16:
                    error_1 = _11.sent();
                    console.error("Unexpected error processing purchase orders:", error_1);
                    return [2 /*return*/, (0, react_router_1.data)({
                            success: false,
                            message: "Unexpected error occurred while processing purchase orders: ".concat(error_1 instanceof Error ? error_1.message : "Unknown error")
                        }, { status: 500 })];
                case 17: return [2 /*return*/, (0, react_router_1.data)({
                        success: false,
                        message: "Unknown action '".concat(action, "'. Expected action: 'order'")
                    }, { status: 500 })];
            }
        });
    });
}
function deduplicateForecasts(forecasts) {
    var map = new Map();
    for (var _i = 0, forecasts_1 = forecasts; _i < forecasts_1.length; _i++) {
        var forecast = forecasts_1[_i];
        var key = "".concat(forecast.itemId, "-").concat(forecast.locationId, "-").concat(forecast.periodId);
        var existing = map.get(key);
        if (existing) {
            existing.forecastQuantity += forecast.forecastQuantity;
        }
        else {
            map.set(key, __assign({}, forecast));
        }
    }
    return Array.from(map.values());
}
