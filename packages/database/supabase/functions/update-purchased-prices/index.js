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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/std@0.160.0/datetime/mod.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.default.discriminatedUnion("source", [
    npm_zod__3_24_1_1.default.object({
        source: npm_zod__3_24_1_1.default.literal("purchaseOrder"),
        purchaseOrderId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
        updatePrices: npm_zod__3_24_1_1.default.boolean().optional(),
        updateLeadTimes: npm_zod__3_24_1_1.default.boolean().optional(),
    }),
    npm_zod__3_24_1_1.default.object({
        source: npm_zod__3_24_1_1.default.literal("purchaseInvoice"),
        invoiceId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
        updatePrices: npm_zod__3_24_1_1.default.boolean().optional(),
        updateLeadTimes: npm_zod__3_24_1_1.default.boolean().optional(),
    }),
]);
var millisecondsInADay = 1000 * 60 * 60 * 24;
var calculateLeadTimeInDays = function (orderDate, deliveryDate) {
    var orderDateTime = new Date("".concat(orderDate, "T00:00:00Z")).getTime();
    var deliveryDateTime = new Date("".concat(deliveryDate, "T00:00:00Z")).getTime();
    if (isNaN(orderDateTime) || isNaN(deliveryDateTime))
        return 0;
    return Math.max(0, (deliveryDateTime - orderDateTime) / millisecondsInADay);
};
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, parsedPayload, source, companyId, userId, shouldUpdatePrices, shouldUpdateLeadTimes, client, supplierId_1, lines, _a, purchaseOrderId_1, _b, purchaseOrder, purchaseOrderLines, costLedgerInserts, invoiceId, _c, purchaseInvoice, purchaseInvoiceLines, itemIds, dateOneYearAgo, itemCostUpdates_1, itemReplenishmentUpdates_1, supplierPartInserts_1, supplierPartUpdates_1, jobOperationUpdates_1, historicalPartCosts_1, historicalPartLeadTimes_1, supplierPartRows_1, _d, costLedgers, supplierParts, receipts, receiptIds, purchaseOrderIds, _e, receiptLines, purchaseOrders, receiptsById_1, purchaseOrdersById_1, err_1;
    var _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _p.sent();
                parsedPayload = payloadValidator.parse(payload);
                source = parsedPayload.source, companyId = parsedPayload.companyId, userId = parsedPayload.userId;
                shouldUpdatePrices = (_f = parsedPayload.updatePrices) !== null && _f !== void 0 ? _f : true;
                shouldUpdateLeadTimes = (_g = parsedPayload.updateLeadTimes) !== null && _g !== void 0 ? _g : false;
                console.log({
                    function: "update-purchased-prices",
                    source: source,
                    companyId: companyId,
                    shouldUpdatePrices: shouldUpdatePrices,
                    shouldUpdateLeadTimes: shouldUpdateLeadTimes,
                });
                _p.label = 2;
            case 2:
                _p.trys.push([2, 18, , 19]);
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId, userId, { update: "purchasing" })];
            case 3:
                client = _p.sent();
                lines = void 0;
                _a = source;
                switch (_a) {
                    case "purchaseOrder": return [3 /*break*/, 4];
                    case "purchaseInvoice": return [3 /*break*/, 9];
                }
                return [3 /*break*/, 11];
            case 4:
                purchaseOrderId_1 = parsedPayload.purchaseOrderId;
                console.log({
                    function: "update-purchased-prices",
                    source: source,
                    purchaseOrderId: purchaseOrderId_1,
                    companyId: companyId,
                });
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("*")
                            .eq("id", purchaseOrderId_1)
                            .single(),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", purchaseOrderId_1),
                    ])];
            case 5:
                _b = _p.sent(), purchaseOrder = _b[0], purchaseOrderLines = _b[1];
                if (purchaseOrder.error)
                    throw new Error("Failed to fetch purchaseOrder");
                if (purchaseOrderLines.error)
                    throw new Error("Failed to fetch purchase order lines");
                if (!purchaseOrder.data.supplierId)
                    throw new Error("Purchase order has no supplier");
                supplierId_1 = purchaseOrder.data.supplierId;
                lines = purchaseOrderLines.data
                    .map(function (line) {
                    var _a, _b, _c;
                    return ({
                        itemId: line.itemId,
                        jobOperationId: null,
                        unitPrice: (_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0,
                        quantity: ((_b = line.purchaseQuantity) !== null && _b !== void 0 ? _b : 0) * ((_c = line.conversionFactor) !== null && _c !== void 0 ? _c : 1),
                        conversionFactor: line.conversionFactor,
                        purchaseUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                    });
                })
                    .filter(function (line) { return line.quantity > 0; });
                if (!shouldUpdatePrices) return [3 /*break*/, 8];
                // Delete any existing cost ledger entries for this PO (handles re-finalization)
                return [4 /*yield*/, db
                        .deleteFrom("costLedger")
                        .where("documentType", "=", "Purchase Order")
                        .where("documentId", "=", purchaseOrderId_1)
                        .where("companyId", "=", companyId)
                        .execute()];
            case 6:
                // Delete any existing cost ledger entries for this PO (handles re-finalization)
                _p.sent();
                costLedgerInserts = lines
                    .filter(function (line) { return line.itemId && line.unitPrice !== 0; })
                    .map(function (line) { return ({
                    itemLedgerType: "Purchase",
                    costLedgerType: "Direct Cost",
                    adjustment: false,
                    documentType: "Purchase Order",
                    documentId: purchaseOrderId_1,
                    itemId: line.itemId,
                    quantity: line.quantity,
                    cost: line.quantity * line.unitPrice,
                    remainingQuantity: line.quantity,
                    supplierId: supplierId_1,
                    companyId: companyId,
                }); });
                if (!(costLedgerInserts.length > 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, db.insertInto("costLedger").values(costLedgerInserts).execute()];
            case 7:
                _p.sent();
                _p.label = 8;
            case 8: return [3 /*break*/, 11];
            case 9:
                invoiceId = parsedPayload.invoiceId;
                console.log({
                    function: "update-purchased-prices",
                    source: source,
                    invoiceId: invoiceId,
                    companyId: companyId,
                });
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseInvoice")
                            .select("*")
                            .eq("id", invoiceId)
                            .single(),
                        client
                            .from("purchaseInvoiceLine")
                            .select("*")
                            .eq("invoiceId", invoiceId),
                    ])];
            case 10:
                _c = _p.sent(), purchaseInvoice = _c[0], purchaseInvoiceLines = _c[1];
                if (purchaseInvoice.error)
                    throw new Error("Failed to fetch purchaseInvoice");
                if (purchaseInvoiceLines.error)
                    throw new Error("Failed to fetch invoice lines");
                if (!purchaseInvoice.data.supplierId)
                    throw new Error("Purchase invoice has no supplier");
                supplierId_1 = purchaseInvoice.data.supplierId;
                lines = purchaseInvoiceLines.data
                    .map(function (line) {
                    var _a, _b, _c;
                    return ({
                        itemId: line.itemId,
                        jobOperationId: line.jobOperationId,
                        unitPrice: (_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0,
                        quantity: ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0) * ((_c = line.conversionFactor) !== null && _c !== void 0 ? _c : 1),
                        conversionFactor: line.conversionFactor,
                        purchaseUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                    });
                })
                    .filter(function (line) { return line.quantity > 0; });
                return [3 /*break*/, 11];
            case 11:
                itemIds = Array.from(new Set(lines
                    .filter(function (line) { return Boolean(line.itemId); })
                    .map(function (line) { return line.itemId; })));
                dateOneYearAgo = (0, mod_ts_1.format)(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), "yyyy-MM-dd");
                itemCostUpdates_1 = [];
                itemReplenishmentUpdates_1 = [];
                supplierPartInserts_1 = [];
                supplierPartUpdates_1 = [];
                jobOperationUpdates_1 = [];
                historicalPartCosts_1 = {};
                historicalPartLeadTimes_1 = {};
                supplierPartRows_1 = [];
                if (!(shouldUpdatePrices && itemIds.length > 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, Promise.all([
                        client
                            .from("costLedger")
                            .select("*")
                            .in("itemId", itemIds)
                            .eq("companyId", companyId)
                            .gte("postingDate", dateOneYearAgo),
                        client
                            .from("supplierPart")
                            .select("*")
                            .eq("supplierId", supplierId_1)
                            .in("itemId", itemIds)
                            .eq("companyId", companyId),
                    ])];
            case 12:
                _d = _p.sent(), costLedgers = _d[0], supplierParts = _d[1];
                if (costLedgers.error) {
                    throw new Error("Failed to fetch historical cost ledger entries");
                }
                if (supplierParts.error) {
                    throw new Error("Failed to fetch supplier parts");
                }
                supplierPartRows_1 = (_h = supplierParts.data) !== null && _h !== void 0 ? _h : [];
                (_j = costLedgers.data) === null || _j === void 0 ? void 0 : _j.forEach(function (ledger) {
                    if (ledger.itemId) {
                        if (!historicalPartCosts_1[ledger.itemId]) {
                            historicalPartCosts_1[ledger.itemId] = {
                                quantity: 0,
                                cost: 0,
                            };
                        }
                        historicalPartCosts_1[ledger.itemId].quantity += ledger.quantity;
                        historicalPartCosts_1[ledger.itemId].cost += ledger.cost;
                    }
                });
                _p.label = 13;
            case 13:
                if (!(shouldUpdateLeadTimes && itemIds.length > 0)) return [3 /*break*/, 16];
                return [4 /*yield*/, client
                        .from("receipt")
                        .select("id,postingDate,sourceDocumentId")
                        .eq("companyId", companyId)
                        .eq("sourceDocument", "Purchase Order")
                        .not("postingDate", "is", null)
                        .gte("postingDate", dateOneYearAgo)];
            case 14:
                receipts = _p.sent();
                if (receipts.error) {
                    throw new Error("Failed to fetch historical receipts");
                }
                receiptIds = (_l = (_k = receipts.data) === null || _k === void 0 ? void 0 : _k.map(function (receipt) { return receipt.id; })) !== null && _l !== void 0 ? _l : [];
                purchaseOrderIds = Array.from(new Set(((_m = receipts.data) !== null && _m !== void 0 ? _m : [])
                    .map(function (receipt) { return receipt.sourceDocumentId; })
                    .filter(function (id) { return Boolean(id); })));
                if (!(receiptIds.length > 0 && purchaseOrderIds.length > 0)) return [3 /*break*/, 16];
                return [4 /*yield*/, Promise.all([
                        client
                            .from("receiptLine")
                            .select("receiptId,itemId,receivedQuantity,conversionFactor")
                            .in("receiptId", receiptIds)
                            .in("itemId", itemIds)
                            .eq("companyId", companyId),
                        client
                            .from("purchaseOrder")
                            .select("id,orderDate")
                            .in("id", purchaseOrderIds)
                            .eq("companyId", companyId),
                    ])];
            case 15:
                _e = _p.sent(), receiptLines = _e[0], purchaseOrders = _e[1];
                if (receiptLines.error) {
                    throw new Error("Failed to fetch historical receipt lines");
                }
                if (purchaseOrders.error) {
                    throw new Error("Failed to fetch historical purchase orders");
                }
                receiptsById_1 = ((_o = receipts.data) !== null && _o !== void 0 ? _o : []).reduce(function (acc, receipt) {
                    if (receipt.postingDate) {
                        acc[receipt.id] = {
                            postingDate: receipt.postingDate,
                            sourceDocumentId: receipt.sourceDocumentId,
                        };
                    }
                    return acc;
                }, {});
                purchaseOrdersById_1 = purchaseOrders.data.reduce(function (acc, row) {
                    acc[row.id] = { orderDate: row.orderDate };
                    return acc;
                }, {});
                receiptLines.data.forEach(function (line) {
                    var _a, _b;
                    if (!line.itemId)
                        return;
                    var receipt = receiptsById_1[line.receiptId];
                    if (!(receipt === null || receipt === void 0 ? void 0 : receipt.sourceDocumentId))
                        return;
                    var orderDate = (_a = purchaseOrdersById_1[receipt.sourceDocumentId]) === null || _a === void 0 ? void 0 : _a.orderDate;
                    if (!orderDate || !receipt.postingDate)
                        return;
                    var safeConversionFactor = line.conversionFactor && line.conversionFactor > 0
                        ? line.conversionFactor
                        : 1;
                    var quantity = Math.abs(((_b = line.receivedQuantity) !== null && _b !== void 0 ? _b : 0) / safeConversionFactor);
                    if (quantity <= 0)
                        return;
                    var leadTimeInDays = calculateLeadTimeInDays(orderDate, receipt.postingDate);
                    if (!historicalPartLeadTimes_1[line.itemId]) {
                        historicalPartLeadTimes_1[line.itemId] = {
                            quantity: 0,
                            weightedLeadTime: 0,
                        };
                    }
                    historicalPartLeadTimes_1[line.itemId].quantity += quantity;
                    historicalPartLeadTimes_1[line.itemId].weightedLeadTime +=
                        leadTimeInDays * quantity;
                });
                _p.label = 16;
            case 16:
                lines.forEach(function (line) {
                    var _a, _b, _c, _d, _e, _f;
                    if (line.itemId && !line.jobOperationId) {
                        var costHistory = historicalPartCosts_1[line.itemId];
                        var hasLeadTimeHistory = ((_b = (_a = historicalPartLeadTimes_1[line.itemId]) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 0) > 0;
                        if (shouldUpdatePrices && line.unitPrice !== 0 && costHistory) {
                            itemCostUpdates_1.push({
                                itemId: line.itemId,
                                unitCost: costHistory.cost / costHistory.quantity,
                                updatedBy: "system",
                            });
                            var supplierPart = supplierPartRows_1.find(function (sp) { return sp.itemId === line.itemId && sp.supplierId === supplierId_1; });
                            if (supplierPart && supplierPart.id) {
                                supplierPartUpdates_1.push({
                                    id: supplierPart.id,
                                    unitPrice: line.unitPrice,
                                    conversionFactor: (_c = line.conversionFactor) !== null && _c !== void 0 ? _c : 1,
                                    supplierUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                                    updatedBy: "system",
                                });
                            }
                            else {
                                supplierPartInserts_1.push({
                                    itemId: line.itemId,
                                    supplierId: supplierId_1,
                                    unitPrice: line.unitPrice,
                                    conversionFactor: (_d = line.conversionFactor) !== null && _d !== void 0 ? _d : 1,
                                    supplierUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                                    createdBy: "system",
                                    companyId: companyId,
                                });
                            }
                        }
                        if (shouldUpdatePrices || (shouldUpdateLeadTimes && hasLeadTimeHistory)) {
                            var itemReplenishmentUpdate = {
                                itemId: line.itemId,
                                updatedBy: "system",
                            };
                            if (shouldUpdatePrices) {
                                itemReplenishmentUpdate.preferredSupplierId = supplierId_1;
                                itemReplenishmentUpdate.purchasingUnitOfMeasureCode =
                                    line.purchaseUnitOfMeasureCode;
                                itemReplenishmentUpdate.conversionFactor =
                                    (_e = line.conversionFactor) !== null && _e !== void 0 ? _e : 1;
                            }
                            if (shouldUpdateLeadTimes && hasLeadTimeHistory) {
                                itemReplenishmentUpdate.leadTime = Math.round(historicalPartLeadTimes_1[line.itemId].weightedLeadTime /
                                    historicalPartLeadTimes_1[line.itemId].quantity);
                            }
                            itemReplenishmentUpdates_1.push(itemReplenishmentUpdate);
                        }
                    }
                    if (shouldUpdatePrices && line.jobOperationId && line.unitPrice !== 0) {
                        jobOperationUpdates_1.push({
                            id: line.jobOperationId,
                            operationMinimumCost: 0,
                            operationUnitCost: (_f = line.unitPrice) !== null && _f !== void 0 ? _f : 0,
                            updatedBy: "system",
                        });
                    }
                });
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, itemCostUpdates_2, itemCostUpdates_2_1, itemCostUpdate, e_1_1, _b, jobOperationUpdates_2, jobOperationUpdates_2_1, jobOperationUpdate, e_2_1, _c, supplierPartUpdates_2, supplierPartUpdates_2_1, supplierPartUpdate, e_3_1, _d, itemReplenishmentUpdates_2, itemReplenishmentUpdates_2_1, itemReplenishmentUpdate, e_4_1;
                        var _e, e_1, _f, _g, _h, e_2, _j, _k, _l, e_3, _m, _o, _p, e_4, _q, _r;
                        return __generator(this, function (_s) {
                            switch (_s.label) {
                                case 0:
                                    if (!(itemCostUpdates_1.length > 0)) return [3 /*break*/, 13];
                                    _s.label = 1;
                                case 1:
                                    _s.trys.push([1, 7, 8, 13]);
                                    _a = true, itemCostUpdates_2 = __asyncValues(itemCostUpdates_1);
                                    _s.label = 2;
                                case 2: return [4 /*yield*/, itemCostUpdates_2.next()];
                                case 3:
                                    if (!(itemCostUpdates_2_1 = _s.sent(), _e = itemCostUpdates_2_1.done, !_e)) return [3 /*break*/, 6];
                                    _g = itemCostUpdates_2_1.value;
                                    _a = false;
                                    itemCostUpdate = _g;
                                    return [4 /*yield*/, trx
                                            .updateTable("itemCost")
                                            .set(itemCostUpdate)
                                            .where("itemId", "=", itemCostUpdate.itemId)
                                            .where("companyId", "=", companyId)
                                            .execute()];
                                case 4:
                                    _s.sent();
                                    _s.label = 5;
                                case 5:
                                    _a = true;
                                    return [3 /*break*/, 2];
                                case 6: return [3 /*break*/, 13];
                                case 7:
                                    e_1_1 = _s.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 13];
                                case 8:
                                    _s.trys.push([8, , 11, 12]);
                                    if (!(!_a && !_e && (_f = itemCostUpdates_2.return))) return [3 /*break*/, 10];
                                    return [4 /*yield*/, _f.call(itemCostUpdates_2)];
                                case 9:
                                    _s.sent();
                                    _s.label = 10;
                                case 10: return [3 /*break*/, 12];
                                case 11:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 12: return [7 /*endfinally*/];
                                case 13:
                                    if (!(jobOperationUpdates_1.length > 0)) return [3 /*break*/, 26];
                                    _s.label = 14;
                                case 14:
                                    _s.trys.push([14, 20, 21, 26]);
                                    _b = true, jobOperationUpdates_2 = __asyncValues(jobOperationUpdates_1);
                                    _s.label = 15;
                                case 15: return [4 /*yield*/, jobOperationUpdates_2.next()];
                                case 16:
                                    if (!(jobOperationUpdates_2_1 = _s.sent(), _h = jobOperationUpdates_2_1.done, !_h)) return [3 /*break*/, 19];
                                    _k = jobOperationUpdates_2_1.value;
                                    _b = false;
                                    jobOperationUpdate = _k;
                                    return [4 /*yield*/, trx
                                            .updateTable("jobOperation")
                                            .set(jobOperationUpdate)
                                            .where("id", "=", jobOperationUpdate.id)
                                            .where("companyId", "=", companyId)
                                            .execute()];
                                case 17:
                                    _s.sent();
                                    _s.label = 18;
                                case 18:
                                    _b = true;
                                    return [3 /*break*/, 15];
                                case 19: return [3 /*break*/, 26];
                                case 20:
                                    e_2_1 = _s.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 26];
                                case 21:
                                    _s.trys.push([21, , 24, 25]);
                                    if (!(!_b && !_h && (_j = jobOperationUpdates_2.return))) return [3 /*break*/, 23];
                                    return [4 /*yield*/, _j.call(jobOperationUpdates_2)];
                                case 22:
                                    _s.sent();
                                    _s.label = 23;
                                case 23: return [3 /*break*/, 25];
                                case 24:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 25: return [7 /*endfinally*/];
                                case 26:
                                    if (!(supplierPartInserts_1.length > 0)) return [3 /*break*/, 28];
                                    return [4 /*yield*/, trx
                                            .insertInto("supplierPart")
                                            .values(supplierPartInserts_1)
                                            .onConflict(function (oc) {
                                            return oc.columns(["itemId", "supplierId", "companyId"]).doUpdateSet({
                                                unitPrice: function (eb) { return eb.ref("excluded.unitPrice"); },
                                                conversionFactor: function (eb) { return eb.ref("excluded.conversionFactor"); },
                                                supplierUnitOfMeasureCode: function (eb) {
                                                    return eb.ref("excluded.supplierUnitOfMeasureCode");
                                                },
                                                updatedBy: "system",
                                            });
                                        })
                                            .execute()];
                                case 27:
                                    _s.sent();
                                    _s.label = 28;
                                case 28:
                                    if (!(supplierPartUpdates_1.length > 0)) return [3 /*break*/, 41];
                                    _s.label = 29;
                                case 29:
                                    _s.trys.push([29, 35, 36, 41]);
                                    _c = true, supplierPartUpdates_2 = __asyncValues(supplierPartUpdates_1);
                                    _s.label = 30;
                                case 30: return [4 /*yield*/, supplierPartUpdates_2.next()];
                                case 31:
                                    if (!(supplierPartUpdates_2_1 = _s.sent(), _l = supplierPartUpdates_2_1.done, !_l)) return [3 /*break*/, 34];
                                    _o = supplierPartUpdates_2_1.value;
                                    _c = false;
                                    supplierPartUpdate = _o;
                                    return [4 /*yield*/, trx
                                            .updateTable("supplierPart")
                                            .set(supplierPartUpdate)
                                            .where("id", "=", supplierPartUpdate.id)
                                            .execute()];
                                case 32:
                                    _s.sent();
                                    _s.label = 33;
                                case 33:
                                    _c = true;
                                    return [3 /*break*/, 30];
                                case 34: return [3 /*break*/, 41];
                                case 35:
                                    e_3_1 = _s.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 41];
                                case 36:
                                    _s.trys.push([36, , 39, 40]);
                                    if (!(!_c && !_l && (_m = supplierPartUpdates_2.return))) return [3 /*break*/, 38];
                                    return [4 /*yield*/, _m.call(supplierPartUpdates_2)];
                                case 37:
                                    _s.sent();
                                    _s.label = 38;
                                case 38: return [3 /*break*/, 40];
                                case 39:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 40: return [7 /*endfinally*/];
                                case 41:
                                    if (!(itemReplenishmentUpdates_1.length > 0)) return [3 /*break*/, 54];
                                    _s.label = 42;
                                case 42:
                                    _s.trys.push([42, 48, 49, 54]);
                                    _d = true, itemReplenishmentUpdates_2 = __asyncValues(itemReplenishmentUpdates_1);
                                    _s.label = 43;
                                case 43: return [4 /*yield*/, itemReplenishmentUpdates_2.next()];
                                case 44:
                                    if (!(itemReplenishmentUpdates_2_1 = _s.sent(), _p = itemReplenishmentUpdates_2_1.done, !_p)) return [3 /*break*/, 47];
                                    _r = itemReplenishmentUpdates_2_1.value;
                                    _d = false;
                                    itemReplenishmentUpdate = _r;
                                    return [4 /*yield*/, trx
                                            .updateTable("itemReplenishment")
                                            .set(itemReplenishmentUpdate)
                                            .where("itemId", "=", itemReplenishmentUpdate.itemId)
                                            .execute()];
                                case 45:
                                    _s.sent();
                                    _s.label = 46;
                                case 46:
                                    _d = true;
                                    return [3 /*break*/, 43];
                                case 47: return [3 /*break*/, 54];
                                case 48:
                                    e_4_1 = _s.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 54];
                                case 49:
                                    _s.trys.push([49, , 52, 53]);
                                    if (!(!_d && !_p && (_q = itemReplenishmentUpdates_2.return))) return [3 /*break*/, 51];
                                    return [4 /*yield*/, _q.call(itemReplenishmentUpdates_2)];
                                case 50:
                                    _s.sent();
                                    _s.label = 51;
                                case 51: return [3 /*break*/, 53];
                                case 52:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 53: return [7 /*endfinally*/];
                                case 54: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 17:
                _p.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 18:
                err_1 = _p.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 19: return [2 /*return*/];
        }
    });
}); });
