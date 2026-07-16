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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/std@0.205.0/datetime/mod.ts");
var mod_ts_2 = require("https://deno.land/x/nanoid@v3.0.0/mod.ts");
var mod_ts_3 = require("https://deno.land/x/zod@v3.21.4/mod.ts");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var utils_ts_1 = require("../lib/utils.ts");
var get_accounting_period_ts_1 = require("../shared/get-accounting-period.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var get_posting_group_ts_1 = require("../shared/get-posting-group.ts");
var sampling_engine_ts_1 = require("../shared/sampling-engine.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = mod_ts_3.z.object({
    type: mod_ts_3.z.enum(["post", "void"]).default("post"),
    receiptId: mod_ts_3.z.string(),
    userId: mod_ts_3.z.string(),
    companyId: mod_ts_3.z.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, _a, type, receiptId_1, userId_1, companyId_1, client, _b, companyRecord, accountingSettings, companyGroupId, accountingEnabled_1, _c, receipt_1, receiptLines_1, receiptLineTracking, dimensions, dimensionMap_1, _i, _d, dim, itemIds, _e, items_1, itemCosts, companySettings, itemSamplingPlans, samplingStandard, samplingPlansByItemId, _f, originalItemLedger, originalJournalLines, purchaseOrderLinesVoid, reversingItemLedger_1, reversingJournalLines_1, receiptLinesByPurchaseOrderLineId_1, purchaseOrderLineUpdatesVoid_1, faPoLinesForVoid, _loop_1, _g, faPoLinesForVoid_1, faPoLine, projectedPurchaseOrderLines, areAllLinesInvoicedProjected, areAllLinesReceivedProjected, purchaseOrderStatusVoid_1, trackedEntityUpdatesVoid_1, accountingPeriodId_1, _h, _j, purchaseOrder_1, purchaseOrderLines, purchaseOrderDelivery, shippingCost, totalLinesCost, supplier, itemLedgerInserts_1, journalLineInserts_1, journalLineDimensionsMeta_1, isOutsideProcessing, processIdByJobOperationId, jobOpIds, jobOps, _k, _l, op, receiptLinesByPurchaseOrderLineId_2, inboundInspectionInserts_1, _loop_2, _m, _o, receiptLine, trackedEntityUpdates_1, jobOperationUpdates_1, purchaseOrderLineUpdates_1, accountDefaults, _p, invoiceFirstQtyByPoLine, accrualUnitCostByPoLine, _q, _r, pol, invoicedInInventoryUnit, receivedInInventoryUnit, invoiceFirstQty, accrualDocRefs, accrualJournalLines, accrualCostByPoLine, _s, _t, jl, _u, poLineId, _v, _w, _x, poLineId, info, _loop_3, _y, _z, _0, e_1_1, receiptFaLines, receivedFaPoLineIds_1, faSerialNumbers, faPurchaseOrderLines, _1, faPurchaseOrderLines_1, faPoLine, quantity, unitPrice, cost, assetRecord, journalLineRef, i, updateData, serialNumber, faLineLocationId, accountingPeriodId_2, _2, _3, warehouseTransfer_1, warehouseTransferLines, transferItemIds, itemCosts_1, itemLedgerInserts_2, journalLineInserts_2, journalLineDimensionsMeta_2, warehouseTransferLineUpdates_1, accountDefaults, _4, _loop_4, _5, _6, _7, e_2_1, allLinesFullyReceived, allLinesFullyShipped, newStatus_1, accountingPeriodId_3, _8, err_1, client;
    var _9, e_1, _10, _11, _12, e_2, _13, _14;
    var _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124, _125, _126;
    return __generator(this, function (_127) {
        switch (_127.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _127.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _127.label = 2;
            case 2:
                _127.trys.push([2, 71, , 75]);
                _a = payloadValidator.parse(payload), type = _a.type, receiptId_1 = _a.receiptId, userId_1 = _a.userId, companyId_1 = _a.companyId;
                console.log({
                    function: "post-receipt",
                    type: type,
                    receiptId: receiptId_1,
                    userId: userId_1,
                    companyId: companyId_1,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "inventory" })];
            case 3:
                client = _127.sent();
                return [4 /*yield*/, Promise.all([
                        client
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", companyId_1)
                            .single(),
                        client
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_1)
                            .single(),
                    ])];
            case 4:
                _b = _127.sent(), companyRecord = _b[0], accountingSettings = _b[1];
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                companyGroupId = companyRecord.data.companyGroupId;
                accountingEnabled_1 = (_16 = (_15 = accountingSettings.data) === null || _15 === void 0 ? void 0 : _15.accountingEnabled) !== null && _16 !== void 0 ? _16 : false;
                return [4 /*yield*/, Promise.all([
                        client.from("receipt").select("*").eq("id", receiptId_1).single(),
                        client.from("receiptLine").select("*").eq("receiptId", receiptId_1),
                        client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes->> Receipt", receiptId_1),
                        client
                            .from("dimension")
                            .select("id, entityType")
                            .eq("companyGroupId", companyGroupId)
                            .eq("active", true)
                            .in("entityType", ["SupplierType", "ItemPostingGroup", "Location", "Process", "FixedAssetClass"]),
                    ])];
            case 5:
                _c = _127.sent(), receipt_1 = _c[0], receiptLines_1 = _c[1], receiptLineTracking = _c[2], dimensions = _c[3];
                if (receipt_1.error)
                    throw new Error("Failed to fetch receipt");
                if (receiptLines_1.error)
                    throw new Error("Failed to fetch receipt lines");
                if (dimensions.error) {
                    console.error("Failed to fetch dimensions", dimensions.error);
                }
                dimensionMap_1 = new Map();
                for (_i = 0, _d = (_17 = dimensions.data) !== null && _17 !== void 0 ? _17 : []; _i < _d.length; _i++) {
                    dim = _d[_i];
                    if (dim.entityType)
                        dimensionMap_1.set(dim.entityType, dim.id);
                }
                itemIds = receiptLines_1.data.reduce(function (acc, receiptLine) {
                    if (receiptLine.itemId && !acc.includes(receiptLine.itemId)) {
                        acc.push(receiptLine.itemId);
                    }
                    return acc;
                }, []);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("item")
                            .select("id, itemTrackingType, requiresInspection")
                            .in("id", itemIds)
                            .eq("companyId", companyId_1),
                        client
                            .from("itemCost")
                            .select("itemId, itemPostingGroupId")
                            .in("itemId", itemIds),
                        client
                            .from("companySettings")
                            .select("samplingStandard")
                            .eq("id", companyId_1)
                            .single(),
                        client
                            .from("itemSamplingPlan")
                            .select("itemId, type, sampleSize, percentage, aql, inspectionLevel, severity")
                            .in("itemId", itemIds)
                            .eq("companyId", companyId_1),
                    ])];
            case 6:
                _e = _127.sent(), items_1 = _e[0], itemCosts = _e[1], companySettings = _e[2], itemSamplingPlans = _e[3];
                if (items_1.error) {
                    throw new Error("Failed to fetch items");
                }
                if (itemCosts.error) {
                    throw new Error("Failed to fetch item costs");
                }
                samplingStandard = (_19 = (_18 = companySettings.data) === null || _18 === void 0 ? void 0 : _18.samplingStandard) !== null && _19 !== void 0 ? _19 : "ANSI_Z1_4";
                samplingPlansByItemId = new Map(((_20 = itemSamplingPlans.data) !== null && _20 !== void 0 ? _20 : []).map(function (p) { return [p.itemId, p]; }));
                if (!(type === "void")) return [3 /*break*/, 14];
                if (((_21 = receipt_1.data) === null || _21 === void 0 ? void 0 : _21.status) !== "Posted") {
                    throw new Error("Can only void posted receipts");
                }
                if (receipt_1.data.invoiced) {
                    throw new Error("Cannot void a receipt created by a purchase invoice. Void the invoice instead.");
                }
                if (receipt_1.data.sourceDocument !== "Purchase Order") {
                    throw new Error("Void is only supported for receipts with source document \"Purchase Order\"");
                }
                if (!receipt_1.data.sourceDocumentId) {
                    throw new Error("Receipt has no sourceDocumentId");
                }
                return [4 /*yield*/, Promise.all([
                        client
                            .from("itemLedger")
                            .select("*")
                            .eq("documentId", receiptId_1)
                            .eq("documentType", "Purchase Receipt")
                            .eq("companyId", companyId_1),
                        client
                            .from("journalLine")
                            .select("*")
                            .eq("documentId", receiptId_1)
                            .eq("documentType", "Receipt")
                            .eq("companyId", companyId_1),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", receipt_1.data.sourceDocumentId),
                    ])];
            case 7:
                _f = _127.sent(), originalItemLedger = _f[0], originalJournalLines = _f[1], purchaseOrderLinesVoid = _f[2];
                if (originalItemLedger.error)
                    throw new Error("Failed to fetch item ledger entries");
                if (originalJournalLines.error)
                    throw new Error("Failed to fetch journal lines");
                if (purchaseOrderLinesVoid.error)
                    throw new Error("Failed to fetch purchase order lines");
                reversingItemLedger_1 = originalItemLedger.data.map(function (entry) { return ({
                    postingDate: today,
                    itemId: entry.itemId,
                    quantity: -entry.quantity,
                    locationId: entry.locationId,
                    storageUnitId: entry.storageUnitId,
                    trackedEntityId: entry.trackedEntityId,
                    entryType: entry.entryType === "Positive Adjmt."
                        ? "Negative Adjmt."
                        : entry.entryType === "Negative Adjmt."
                            ? "Positive Adjmt."
                            : entry.entryType,
                    documentType: entry.documentType,
                    documentId: entry.documentId,
                    externalDocumentId: entry.externalDocumentId,
                    createdBy: userId_1,
                    companyId: companyId_1,
                }); });
                reversingJournalLines_1 = accountingEnabled_1
                    ? originalJournalLines.data.map(function (entry) { return ({
                        accountId: entry.accountId,
                        accrual: entry.accrual,
                        description: "VOID: ".concat(entry.description),
                        amount: -entry.amount,
                        quantity: -entry.quantity,
                        documentType: entry.documentType,
                        documentId: entry.documentId,
                        externalDocumentId: entry.externalDocumentId,
                        documentLineReference: entry.documentLineReference,
                        journalLineReference: entry.journalLineReference,
                        companyId: companyId_1,
                    }); })
                    : [];
                receiptLinesByPurchaseOrderLineId_1 = receiptLines_1.data.reduce(function (acc, receiptLine) {
                    var _a;
                    if (receiptLine.lineId) {
                        acc[receiptLine.lineId] = __spreadArray(__spreadArray([], ((_a = acc[receiptLine.lineId]) !== null && _a !== void 0 ? _a : []), true), [
                            receiptLine,
                        ], false);
                    }
                    return acc;
                }, {});
                purchaseOrderLineUpdatesVoid_1 = purchaseOrderLinesVoid.data.reduce(function (acc, purchaseOrderLine) {
                    var _a, _b;
                    var receiptLinesForPoLine = receiptLinesByPurchaseOrderLineId_1[purchaseOrderLine.id];
                    if (receiptLinesForPoLine &&
                        receiptLinesForPoLine.length > 0 &&
                        purchaseOrderLine.purchaseQuantity &&
                        purchaseOrderLine.purchaseQuantity > 0) {
                        var receivedQuantityInPurchaseUnit = receiptLinesForPoLine.reduce(function (sum, receiptLine) {
                            var safe = isNaN(receiptLine.receivedQuantity) ||
                                receiptLine.receivedQuantity == null
                                ? 0
                                : receiptLine.receivedQuantity;
                            return sum + safe;
                        }, 0) / ((_a = receiptLinesForPoLine[0].conversionFactor) !== null && _a !== void 0 ? _a : 1);
                        var newQuantityReceived = Math.max(0, ((_b = purchaseOrderLine.quantityReceived) !== null && _b !== void 0 ? _b : 0) -
                            receivedQuantityInPurchaseUnit);
                        var receivedComplete = newQuantityReceived >= purchaseOrderLine.purchaseQuantity;
                        acc[purchaseOrderLine.id] = {
                            quantityReceived: newQuantityReceived,
                            receivedComplete: receivedComplete,
                        };
                    }
                    return acc;
                }, {});
                faPoLinesForVoid = purchaseOrderLinesVoid.data.filter(function (pol) {
                    return pol.purchaseOrderLineType === "Fixed Asset" &&
                        pol.assetId &&
                        pol.receivedComplete;
                });
                _loop_1 = function (faPoLine) {
                    var hasReceiptEntries, receiptCost, assetRecord, newAcquisitionCost, faUpdate;
                    return __generator(this, function (_128) {
                        switch (_128.label) {
                            case 0:
                                hasReceiptEntries = originalJournalLines.data.some(function (jl) {
                                    return jl.documentLineReference ===
                                        utils_ts_1.journalReference.to.receipt(faPoLine.id);
                                });
                                if (!hasReceiptEntries) return [3 /*break*/, 3];
                                purchaseOrderLineUpdatesVoid_1[faPoLine.id] = {
                                    quantityReceived: 0,
                                    receivedComplete: false,
                                };
                                receiptCost = originalJournalLines.data
                                    .filter(function (jl) {
                                    var _a;
                                    return jl.documentLineReference ===
                                        utils_ts_1.journalReference.to.receipt(faPoLine.id) &&
                                        ((_a = jl.amount) !== null && _a !== void 0 ? _a : 0) > 0;
                                })
                                    .reduce(function (sum, jl) { var _a; return sum + Math.abs((_a = jl.amount) !== null && _a !== void 0 ? _a : 0); }, 0);
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .select("id, acquisitionCost, status")
                                        .eq("id", faPoLine.assetId)
                                        .single()];
                            case 1:
                                assetRecord = _128.sent();
                                if (!(!assetRecord.error && assetRecord.data)) return [3 /*break*/, 3];
                                newAcquisitionCost = Math.max(0, Number(assetRecord.data.acquisitionCost) - receiptCost);
                                faUpdate = {
                                    acquisitionCost: newAcquisitionCost,
                                    updatedBy: userId_1,
                                };
                                if (newAcquisitionCost === 0 &&
                                    assetRecord.data.status === "Active") {
                                    faUpdate.status = "Draft";
                                    faUpdate.acquisitionDate = null;
                                    faUpdate.depreciationStartDate = null;
                                }
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .update(faUpdate)
                                        .eq("id", faPoLine.assetId)];
                            case 2:
                                _128.sent();
                                _128.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _g = 0, faPoLinesForVoid_1 = faPoLinesForVoid;
                _127.label = 8;
            case 8:
                if (!(_g < faPoLinesForVoid_1.length)) return [3 /*break*/, 11];
                faPoLine = faPoLinesForVoid_1[_g];
                return [5 /*yield**/, _loop_1(faPoLine)];
            case 9:
                _127.sent();
                _127.label = 10;
            case 10:
                _g++;
                return [3 /*break*/, 8];
            case 11:
                projectedPurchaseOrderLines = purchaseOrderLinesVoid.data.map(function (line) {
                    var update = purchaseOrderLineUpdatesVoid_1[line.id];
                    if (update && update.quantityReceived !== undefined) {
                        return __assign(__assign({}, line), { quantityReceived: update.quantityReceived });
                    }
                    return line;
                });
                areAllLinesInvoicedProjected = projectedPurchaseOrderLines.every(function (line) {
                    var _a, _b;
                    if (line.purchaseOrderLineType === "Comment")
                        return true;
                    var target = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
                    if (target <= 0)
                        return true;
                    return ((_b = line.quantityInvoiced) !== null && _b !== void 0 ? _b : 0) >= target;
                });
                areAllLinesReceivedProjected = projectedPurchaseOrderLines.every(function (line) {
                    var _a, _b;
                    if (line.purchaseOrderLineType === "Comment" ||
                        line.purchaseOrderLineType === "G/L Account")
                        return true;
                    var target = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
                    if (target <= 0)
                        return true;
                    return ((_b = line.quantityReceived) !== null && _b !== void 0 ? _b : 0) >= target;
                });
                purchaseOrderStatusVoid_1 = "To Receive and Invoice";
                if (areAllLinesInvoicedProjected && areAllLinesReceivedProjected) {
                    purchaseOrderStatusVoid_1 = "Completed";
                }
                else if (areAllLinesInvoicedProjected) {
                    purchaseOrderStatusVoid_1 = "To Receive";
                }
                else if (areAllLinesReceivedProjected) {
                    purchaseOrderStatusVoid_1 = "To Invoice";
                }
                trackedEntityUpdatesVoid_1 = (_23 = (_22 = receiptLineTracking.data) === null || _22 === void 0 ? void 0 : _22.reduce(function (acc, trackedEntity) {
                    acc[trackedEntity.id] = {
                        status: "Available",
                        quantity: trackedEntity.quantity,
                    };
                    return acc;
                }, {})) !== null && _23 !== void 0 ? _23 : {};
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 12:
                accountingPeriodId_1 = _127.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, purchaseOrderLineId, update, e_3_1, voidJournalEntryId, journal, journalId_1, voidActivity, voidActivityId, _d, _e, _f, id, update, e_4_1;
                        var _g, e_3, _h, _j, _k, e_4, _l, _m;
                        var _o;
                        return __generator(this, function (_p) {
                            switch (_p.label) {
                                case 0:
                                    _p.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(purchaseOrderLineUpdatesVoid_1));
                                    _p.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _p.sent(), _g = _c.done, !_g)) return [3 /*break*/, 5];
                                    _j = _c.value;
                                    _a = false;
                                    purchaseOrderLineId = _j[0], update = _j[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrderLine")
                                            .set(update)
                                            .where("id", "=", purchaseOrderLineId)
                                            .execute()];
                                case 3:
                                    _p.sent();
                                    _p.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_3_1 = _p.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _p.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_g && (_h = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _h.call(_b)];
                                case 8:
                                    _p.sent();
                                    _p.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [4 /*yield*/, trx
                                        .updateTable("purchaseOrder")
                                        .set({ status: purchaseOrderStatusVoid_1 })
                                        .where("id", "=", receipt_1.data.sourceDocumentId)
                                        .execute()];
                                case 13:
                                    _p.sent();
                                    if (!(reversingJournalLines_1.length > 0)) return [3 /*break*/, 17];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 14:
                                    voidJournalEntryId = _p.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: voidJournalEntryId,
                                            accountingPeriodId: accountingPeriodId_1,
                                            description: "VOID Purchase Receipt ".concat(receipt_1.data.receiptId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Purchase Receipt",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 15:
                                    journal = _p.sent();
                                    journalId_1 = journal[0].id;
                                    if (!journalId_1)
                                        throw new Error("Failed to insert journal");
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(reversingJournalLines_1.map(function (journalLine) { return (__assign(__assign({}, journalLine), { journalId: journalId_1 })); }))
                                            .execute()];
                                case 16:
                                    _p.sent();
                                    _p.label = 17;
                                case 17:
                                    if (!(reversingItemLedger_1.length > 0)) return [3 /*break*/, 19];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(reversingItemLedger_1)
                                            .execute()];
                                case 18:
                                    _p.sent();
                                    _p.label = 19;
                                case 19:
                                    if (!(Object.keys(trackedEntityUpdatesVoid_1).length > 0)) return [3 /*break*/, 34];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            type: "Void Receipt",
                                            sourceDocument: "Receipt",
                                            sourceDocumentId: receiptId_1,
                                            sourceDocumentReadableId: receipt_1.data.receiptId,
                                            attributes: {
                                                "Purchase Order": receipt_1.data.sourceDocumentId,
                                                Receipt: receiptId_1,
                                                Employee: userId_1,
                                            },
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 20:
                                    voidActivity = _p.sent();
                                    voidActivityId = voidActivity[0].id;
                                    _p.label = 21;
                                case 21:
                                    _p.trys.push([21, 28, 29, 34]);
                                    _d = true, _e = __asyncValues(Object.entries(trackedEntityUpdatesVoid_1));
                                    _p.label = 22;
                                case 22: return [4 /*yield*/, _e.next()];
                                case 23:
                                    if (!(_f = _p.sent(), _k = _f.done, !_k)) return [3 /*break*/, 27];
                                    _m = _f.value;
                                    _d = false;
                                    id = _m[0], update = _m[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set(update)
                                            .where("id", "=", id)
                                            .execute()];
                                case 24:
                                    _p.sent();
                                    if (!voidActivityId) return [3 /*break*/, 26];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: voidActivityId,
                                            trackedEntityId: id,
                                            quantity: (_o = update.quantity) !== null && _o !== void 0 ? _o : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 25:
                                    _p.sent();
                                    _p.label = 26;
                                case 26:
                                    _d = true;
                                    return [3 /*break*/, 22];
                                case 27: return [3 /*break*/, 34];
                                case 28:
                                    e_4_1 = _p.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 34];
                                case 29:
                                    _p.trys.push([29, , 32, 33]);
                                    if (!(!_d && !_k && (_l = _e.return))) return [3 /*break*/, 31];
                                    return [4 /*yield*/, _l.call(_e)];
                                case 30:
                                    _p.sent();
                                    _p.label = 31;
                                case 31: return [3 /*break*/, 33];
                                case 32:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 33: return [7 /*endfinally*/];
                                case 34: return [4 /*yield*/, trx
                                        .updateTable("receipt")
                                        .set({
                                        status: "Voided",
                                        updatedAt: today,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", receiptId_1)
                                        .execute()];
                                case 35:
                                    _p.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 13:
                _127.sent();
                return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 14:
                _h = (_24 = receipt_1.data) === null || _24 === void 0 ? void 0 : _24.sourceDocument;
                switch (_h) {
                    case "Purchase Order": return [3 /*break*/, 15];
                    case "Inbound Transfer": return [3 /*break*/, 47];
                }
                return [3 /*break*/, 69];
            case 15:
                if (!receipt_1.data.sourceDocumentId)
                    throw new Error("Receipt has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("*")
                            .eq("id", receipt_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", receipt_1.data.sourceDocumentId),
                        client
                            .from("purchaseOrderDelivery")
                            .select("supplierShippingCost")
                            .eq("id", receipt_1.data.sourceDocumentId)
                            .single(),
                    ])];
            case 16:
                _j = _127.sent(), purchaseOrder_1 = _j[0], purchaseOrderLines = _j[1], purchaseOrderDelivery = _j[2];
                if (purchaseOrder_1.error)
                    throw new Error("Failed to fetch purchase order");
                if (purchaseOrderLines.error)
                    throw new Error("Failed to fetch purchase order lines");
                if (purchaseOrderDelivery.error)
                    throw new Error("Failed to fetch purchase order delivery");
                shippingCost = ((_26 = (_25 = purchaseOrderDelivery.data) === null || _25 === void 0 ? void 0 : _25.supplierShippingCost) !== null && _26 !== void 0 ? _26 : 0) *
                    ((_28 = (_27 = purchaseOrder_1.data) === null || _27 === void 0 ? void 0 : _27.exchangeRate) !== null && _28 !== void 0 ? _28 : 1);
                totalLinesCost = receiptLines_1.data.reduce(function (acc, receiptLine) {
                    var _a;
                    var safeReceivedQuantity = isNaN(receiptLine.receivedQuantity) ||
                        receiptLine.receivedQuantity == null
                        ? 0
                        : receiptLine.receivedQuantity;
                    var lineCost = Math.abs(safeReceivedQuantity) * ((_a = receiptLine.unitPrice) !== null && _a !== void 0 ? _a : 0);
                    return acc + lineCost;
                }, 0);
                return [4 /*yield*/, client
                        .from("supplier")
                        .select("*")
                        .eq("id", purchaseOrder_1.data.supplierId)
                        .eq("companyId", companyId_1)
                        .single()];
            case 17:
                supplier = _127.sent();
                if (supplier.error)
                    throw new Error("Failed to fetch supplier");
                itemLedgerInserts_1 = [];
                journalLineInserts_1 = [];
                journalLineDimensionsMeta_1 = [];
                isOutsideProcessing = purchaseOrder_1.data.purchaseOrderType === "Outside Processing";
                processIdByJobOperationId = new Map();
                if (!isOutsideProcessing) return [3 /*break*/, 19];
                jobOpIds = purchaseOrderLines.data
                    .map(function (pol) { return pol.jobOperationId; })
                    .filter(function (id) { return !!id; });
                if (!(jobOpIds.length > 0)) return [3 /*break*/, 19];
                return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id, processId")
                        .in("id", jobOpIds)];
            case 18:
                jobOps = _127.sent();
                for (_k = 0, _l = (_29 = jobOps.data) !== null && _29 !== void 0 ? _29 : []; _k < _l.length; _k++) {
                    op = _l[_k];
                    if (op.processId)
                        processIdByJobOperationId.set(op.id, op.processId);
                }
                _127.label = 19;
            case 19:
                receiptLinesByPurchaseOrderLineId_2 = receiptLines_1.data.reduce(function (acc, receiptLine) {
                    var _a;
                    if (receiptLine.lineId) {
                        acc[receiptLine.lineId] = __spreadArray(__spreadArray([], ((_a = acc[receiptLine.lineId]) !== null && _a !== void 0 ? _a : []), true), [
                            receiptLine,
                        ], false);
                    }
                    return acc;
                }, {});
                inboundInspectionInserts_1 = [];
                _loop_2 = function (receiptLine) {
                    var item = (_31 = items_1.data) === null || _31 === void 0 ? void 0 : _31.find(function (i) { return i.id === receiptLine.itemId; });
                    if (!(item === null || item === void 0 ? void 0 : item.requiresInspection))
                        return "continue";
                    if (!receiptLine.itemId)
                        return "continue";
                    var safeReceivedQuantity = isNaN(receiptLine.receivedQuantity) ||
                        receiptLine.receivedQuantity == null
                        ? 0
                        : receiptLine.receivedQuantity;
                    if (safeReceivedQuantity <= 0)
                        return "continue";
                    var plan = (_32 = samplingPlansByItemId.get(receiptLine.itemId)) !== null && _32 !== void 0 ? _32 : {
                        type: "All",
                        sampleSize: null,
                        percentage: null,
                        aql: null,
                        inspectionLevel: "II",
                        severity: "Normal",
                    };
                    var snapshot = (0, sampling_engine_ts_1.resolveSamplingPlan)(plan, safeReceivedQuantity, samplingStandard);
                    inboundInspectionInserts_1.push({
                        receiptLineId: receiptLine.id,
                        receiptId: receiptId_1,
                        itemId: receiptLine.itemId,
                        itemReadableId: receiptLine.itemReadableId,
                        supplierId: (_33 = purchaseOrder_1.data.supplierId) !== null && _33 !== void 0 ? _33 : null,
                        lotSize: safeReceivedQuantity,
                        samplingStandard: samplingStandard,
                        samplingPlanType: plan.type,
                        sampleSize: snapshot.sampleSize,
                        acceptanceNumber: snapshot.acceptance,
                        rejectionNumber: snapshot.rejection,
                        aql: (_34 = plan.aql) !== null && _34 !== void 0 ? _34 : null,
                        inspectionLevel: (_35 = plan.inspectionLevel) !== null && _35 !== void 0 ? _35 : null,
                        severity: (_36 = plan.severity) !== null && _36 !== void 0 ? _36 : null,
                        codeLetter: snapshot.codeLetter,
                        status: "Pending",
                        companyId: companyId_1,
                        createdBy: userId_1,
                    });
                };
                for (_m = 0, _o = (_30 = receiptLines_1.data) !== null && _30 !== void 0 ? _30 : []; _m < _o.length; _m++) {
                    receiptLine = _o[_m];
                    _loop_2(receiptLine);
                }
                trackedEntityUpdates_1 = (_38 = (_37 = receiptLineTracking.data) === null || _37 === void 0 ? void 0 : _37.reduce(function (acc, itemTracking) {
                    var _a, _b;
                    var receiptLine = (_a = receiptLines_1.data) === null || _a === void 0 ? void 0 : _a.find(function (receiptLine) {
                        var _a, _b;
                        return receiptLine.id ===
                            ((_b = (_a = itemTracking.attributes) === null || _a === void 0 ? void 0 : _a["Receipt Line"]) === null || _b === void 0 ? void 0 : _b.toString());
                    });
                    var safeReceivedQuantity = 
                    // @ts-ignore - chillllllll
                    isNaN(receiptLine === null || receiptLine === void 0 ? void 0 : receiptLine.receivedQuantity) ||
                        (receiptLine === null || receiptLine === void 0 ? void 0 : receiptLine.receivedQuantity) == null
                        ? 0
                        : receiptLine.receivedQuantity;
                    var quantity = (receiptLine === null || receiptLine === void 0 ? void 0 : receiptLine.requiresSerialTracking)
                        ? 1
                        : safeReceivedQuantity || itemTracking.quantity;
                    var item = (_b = items_1.data) === null || _b === void 0 ? void 0 : _b.find(function (item) { return item.id === (receiptLine === null || receiptLine === void 0 ? void 0 : receiptLine.itemId); });
                    var requiresInspection = (item === null || item === void 0 ? void 0 : item.requiresInspection) === true;
                    acc[itemTracking.id] = {
                        status: requiresInspection ? "On Hold" : "Available",
                        quantity: quantity,
                    };
                    return acc;
                }, {})) !== null && _38 !== void 0 ? _38 : {};
                jobOperationUpdates_1 = isOutsideProcessing
                    ? purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                        var _a;
                        var _b, _c;
                        var receiptLines = receiptLinesByPurchaseOrderLineId_2[purchaseOrderLine.id];
                        if (receiptLines &&
                            receiptLines.length > 0 &&
                            purchaseOrderLine.purchaseQuantity &&
                            purchaseOrderLine.purchaseQuantity > 0 &&
                            purchaseOrderLine.jobOperationId) {
                            var recivedQuantityInPurchaseUnit = receiptLines.reduce(function (acc, receiptLine) {
                                var safeReceivedQuantity = isNaN(receiptLine.receivedQuantity) ||
                                    receiptLine.receivedQuantity == null
                                    ? 0
                                    : receiptLine.receivedQuantity;
                                return acc + safeReceivedQuantity;
                            }, 0) / ((_b = receiptLines[0].conversionFactor) !== null && _b !== void 0 ? _b : 1);
                            var receivedComplete = purchaseOrderLine.receivedComplete ||
                                recivedQuantityInPurchaseUnit >=
                                    ((_c = purchaseOrderLine.quantityToReceive) !== null && _c !== void 0 ? _c : purchaseOrderLine.purchaseQuantity);
                            return __assign(__assign({}, acc), (_a = {}, _a[purchaseOrderLine.jobOperationId] = {
                                status: receivedComplete ? "Done" : "In Progress",
                            }, _a));
                        }
                        return acc;
                    }, {})
                    : {};
                purchaseOrderLineUpdates_1 = purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                    var _a;
                    var _b, _c, _d;
                    var receiptLines = receiptLinesByPurchaseOrderLineId_2[purchaseOrderLine.id];
                    if (receiptLines &&
                        receiptLines.length > 0 &&
                        purchaseOrderLine.purchaseQuantity &&
                        purchaseOrderLine.purchaseQuantity > 0) {
                        var recivedQuantityInPurchaseUnit = receiptLines.reduce(function (acc, receiptLine) {
                            var safeReceivedQuantity = isNaN(receiptLine.receivedQuantity) ||
                                receiptLine.receivedQuantity == null
                                ? 0
                                : receiptLine.receivedQuantity;
                            return acc + safeReceivedQuantity;
                        }, 0) / ((_b = receiptLines[0].conversionFactor) !== null && _b !== void 0 ? _b : 1);
                        var newQuantityReceived = ((_c = purchaseOrderLine.quantityReceived) !== null && _c !== void 0 ? _c : 0) +
                            recivedQuantityInPurchaseUnit;
                        var receivedComplete = purchaseOrderLine.receivedComplete ||
                            recivedQuantityInPurchaseUnit >=
                                ((_d = purchaseOrderLine.quantityToReceive) !== null && _d !== void 0 ? _d : purchaseOrderLine.purchaseQuantity);
                        return __assign(__assign({}, acc), (_a = {}, _a[purchaseOrderLine.id] = {
                            quantityReceived: newQuantityReceived,
                            receivedComplete: receivedComplete,
                            receivedDate: today,
                        }, _a));
                    }
                    return acc;
                }, {});
                if (!accountingEnabled_1) return [3 /*break*/, 21];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client, companyId_1)];
            case 20:
                _p = _127.sent();
                return [3 /*break*/, 22];
            case 21:
                _p = null;
                _127.label = 22;
            case 22:
                accountDefaults = _p;
                if (accountingEnabled_1 && ((accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.error) || !(accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) {
                    throw new Error("Error getting account defaults");
                }
                invoiceFirstQtyByPoLine = new Map();
                accrualUnitCostByPoLine = new Map();
                if (!accountingEnabled_1) return [3 /*break*/, 24];
                for (_q = 0, _r = purchaseOrderLines.data; _q < _r.length; _q++) {
                    pol = _r[_q];
                    invoicedInInventoryUnit = ((_39 = pol.quantityInvoiced) !== null && _39 !== void 0 ? _39 : 0) * ((_40 = pol.conversionFactor) !== null && _40 !== void 0 ? _40 : 1);
                    receivedInInventoryUnit = ((_41 = pol.quantityReceived) !== null && _41 !== void 0 ? _41 : 0) * ((_42 = pol.conversionFactor) !== null && _42 !== void 0 ? _42 : 1);
                    invoiceFirstQty = Math.max(0, invoicedInInventoryUnit - receivedInInventoryUnit);
                    if (invoiceFirstQty > 0) {
                        invoiceFirstQtyByPoLine.set(pol.id, invoiceFirstQty);
                    }
                }
                if (!(invoiceFirstQtyByPoLine.size > 0)) return [3 /*break*/, 24];
                accrualDocRefs = __spreadArray([], invoiceFirstQtyByPoLine.keys(), true).map(function (id) { return utils_ts_1.journalReference.to.purchaseInvoice(id); });
                return [4 /*yield*/, client
                        .from("journalLine")
                        .select("documentLineReference, amount, quantity")
                        .in("documentLineReference", accrualDocRefs)
                        .eq("accrual", true)
                        .eq("companyId", companyId_1)];
            case 23:
                accrualJournalLines = _127.sent();
                if (accrualJournalLines.error) {
                    throw new Error("Failed to fetch accrual journal lines");
                }
                accrualCostByPoLine = {};
                for (_s = 0, _t = (_43 = accrualJournalLines.data) !== null && _43 !== void 0 ? _43 : []; _s < _t.length; _s++) {
                    jl = _t[_s];
                    if (((_44 = jl.amount) !== null && _44 !== void 0 ? _44 : 0) < 0 && ((_45 = jl.quantity) !== null && _45 !== void 0 ? _45 : 0) > 0) {
                        _u = ((_46 = jl.documentLineReference) !== null && _46 !== void 0 ? _46 : "").split(":"), poLineId = _u[1];
                        if (!accrualCostByPoLine[poLineId]) {
                            accrualCostByPoLine[poLineId] = {
                                totalCost: 0,
                                totalQty: 0,
                            };
                        }
                        accrualCostByPoLine[poLineId].totalCost += Math.abs((_47 = jl.amount) !== null && _47 !== void 0 ? _47 : 0);
                        accrualCostByPoLine[poLineId].totalQty += (_48 = jl.quantity) !== null && _48 !== void 0 ? _48 : 0;
                    }
                }
                for (_v = 0, _w = Object.entries(accrualCostByPoLine); _v < _w.length; _v++) {
                    _x = _w[_v], poLineId = _x[0], info = _x[1];
                    if (info.totalQty > 0) {
                        accrualUnitCostByPoLine.set(poLineId, info.totalCost / info.totalQty);
                    }
                }
                _127.label = 24;
            case 24:
                _127.trys.push([24, 29, 30, 35]);
                _loop_3 = function () {
                    _11 = _0.value;
                    _y = false;
                    var receiptLine = _11;
                    var jlStartIdx = journalLineInserts_1.length;
                    var itemTrackingType = (_50 = (_49 = items_1.data.find(function (item) { return item.id === receiptLine.itemId; })) === null || _49 === void 0 ? void 0 : _49.itemTrackingType) !== null && _50 !== void 0 ? _50 : "Inventory";
                    var receivedQuantity = isNaN(receiptLine.receivedQuantity) ||
                        receiptLine.receivedQuantity == null
                        ? 0
                        : receiptLine.receivedQuantity;
                    var isNegativeReceipt = receivedQuantity < 0;
                    var absReceivedQuantity = Math.abs(receivedQuantity);
                    if (accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) && absReceivedQuantity > 0) {
                        var lineCost = absReceivedQuantity * receiptLine.unitPrice;
                        // Add proportional shipping cost based on line value percentage
                        var lineValuePercentage = totalLinesCost === 0 ? 0 : lineCost / totalLinesCost;
                        var lineWeightedShippingCost = shippingCost * lineValuePercentage;
                        var cost = lineCost + lineWeightedShippingCost;
                        var journalLineReference = (0, mod_ts_2.nanoid)();
                        // Find the PO line for this receipt line
                        var poLine = purchaseOrderLines.data.find(function (pol) { return pol.id === receiptLine.lineId; });
                        // Determine the debit account based on item type
                        var debitAccount = void 0;
                        var debitDescription = void 0;
                        if (itemTrackingType !== "Non-Inventory" && !isOutsideProcessing) {
                            debitAccount = accountDefaults.data.inventoryAccount;
                            debitDescription = "Inventory Account";
                        }
                        else if (isOutsideProcessing) {
                            debitAccount = accountDefaults.data.workInProgressAccount;
                            debitDescription = "WIP Account";
                        }
                        else {
                            debitAccount = accountDefaults.data.indirectCostAccount;
                            debitDescription = "Indirect Cost Account";
                        }
                        if (isNegativeReceipt) {
                            journalLineInserts_1.push({
                                accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                                description: "Goods Received Not Invoiced",
                                amount: (0, utils_ts_1.debit)("liability", cost),
                                quantity: absReceivedQuantity,
                                documentType: "Receipt",
                                documentId: (_52 = (_51 = receipt_1.data) === null || _51 === void 0 ? void 0 : _51.id) !== null && _52 !== void 0 ? _52 : undefined,
                                externalDocumentId: (_54 = (_53 = purchaseOrder_1.data) === null || _53 === void 0 ? void 0 : _53.supplierReference) !== null && _54 !== void 0 ? _54 : undefined,
                                documentLineReference: utils_ts_1.journalReference.to.receipt(receiptLine.lineId),
                                journalLineReference: journalLineReference,
                                companyId: companyId_1,
                            });
                            journalLineInserts_1.push({
                                accountId: debitAccount,
                                description: debitDescription,
                                amount: (0, utils_ts_1.credit)("asset", cost),
                                quantity: absReceivedQuantity,
                                documentType: "Receipt",
                                documentId: (_56 = (_55 = receipt_1.data) === null || _55 === void 0 ? void 0 : _55.id) !== null && _56 !== void 0 ? _56 : undefined,
                                externalDocumentId: (_58 = (_57 = purchaseOrder_1.data) === null || _57 === void 0 ? void 0 : _57.supplierReference) !== null && _58 !== void 0 ? _58 : undefined,
                                documentLineReference: utils_ts_1.journalReference.to.receipt(receiptLine.lineId),
                                journalLineReference: journalLineReference,
                                companyId: companyId_1,
                            });
                        }
                        else {
                            journalLineInserts_1.push({
                                accountId: debitAccount,
                                description: debitDescription,
                                amount: (0, utils_ts_1.debit)("asset", cost),
                                quantity: absReceivedQuantity,
                                documentType: "Receipt",
                                documentId: (_60 = (_59 = receipt_1.data) === null || _59 === void 0 ? void 0 : _59.id) !== null && _60 !== void 0 ? _60 : undefined,
                                externalDocumentId: (_62 = (_61 = purchaseOrder_1.data) === null || _61 === void 0 ? void 0 : _61.supplierReference) !== null && _62 !== void 0 ? _62 : undefined,
                                documentLineReference: utils_ts_1.journalReference.to.receipt(receiptLine.lineId),
                                journalLineReference: journalLineReference,
                                companyId: companyId_1,
                            });
                            journalLineInserts_1.push({
                                accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                                description: "Goods Received Not Invoiced",
                                amount: (0, utils_ts_1.credit)("liability", cost),
                                quantity: absReceivedQuantity,
                                documentType: "Receipt",
                                documentId: (_64 = (_63 = receipt_1.data) === null || _63 === void 0 ? void 0 : _63.id) !== null && _64 !== void 0 ? _64 : undefined,
                                externalDocumentId: (_66 = (_65 = purchaseOrder_1.data) === null || _65 === void 0 ? void 0 : _65.supplierReference) !== null && _66 !== void 0 ? _66 : undefined,
                                documentLineReference: utils_ts_1.journalReference.to.receipt(receiptLine.lineId),
                                journalLineReference: journalLineReference,
                                companyId: companyId_1,
                            });
                            // Invoice-first PPV: when invoice was posted before receipt,
                            // accrual entries used invoice cost for GR/IR. The standard
                            // entries above credited GR/IR at PO cost. Add adjustment
                            // entries so GR/IR clears at invoice cost and PPV captures
                            // the difference.
                            var poLineId = receiptLine.lineId;
                            if (poLineId && invoiceFirstQtyByPoLine.has(poLineId)) {
                                var remainingInvoiceFirstQty = invoiceFirstQtyByPoLine.get(poLineId);
                                var invoiceFirstQty = Math.min(absReceivedQuantity, remainingInvoiceFirstQty);
                                if (invoiceFirstQty > 0) {
                                    invoiceFirstQtyByPoLine.set(poLineId, remainingInvoiceFirstQty - invoiceFirstQty);
                                    var accrualUnitCost = (_67 = accrualUnitCostByPoLine.get(poLineId)) !== null && _67 !== void 0 ? _67 : 0;
                                    var poUnitCost = cost / absReceivedQuantity;
                                    var variance = invoiceFirstQty * (accrualUnitCost - poUnitCost);
                                    if (Math.abs(variance) > 0.005) {
                                        journalLineInserts_1.push({
                                            accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                                            description: "GR/IR Clearing",
                                            amount: (0, utils_ts_1.credit)("liability", variance),
                                            quantity: invoiceFirstQty,
                                            documentType: "Receipt",
                                            documentId: (_69 = (_68 = receipt_1.data) === null || _68 === void 0 ? void 0 : _68.id) !== null && _69 !== void 0 ? _69 : undefined,
                                            externalDocumentId: (_71 = (_70 = purchaseOrder_1.data) === null || _70 === void 0 ? void 0 : _70.supplierReference) !== null && _71 !== void 0 ? _71 : undefined,
                                            documentLineReference: utils_ts_1.journalReference.to.receipt(poLineId),
                                            journalLineReference: journalLineReference,
                                            companyId: companyId_1,
                                        });
                                        journalLineInserts_1.push({
                                            accountId: accountDefaults.data.purchaseVarianceAccount,
                                            description: "Purchase Price Variance",
                                            amount: (0, utils_ts_1.debit)("expense", variance),
                                            quantity: invoiceFirstQty,
                                            documentType: "Receipt",
                                            documentId: (_73 = (_72 = receipt_1.data) === null || _72 === void 0 ? void 0 : _72.id) !== null && _73 !== void 0 ? _73 : undefined,
                                            externalDocumentId: (_75 = (_74 = purchaseOrder_1.data) === null || _74 === void 0 ? void 0 : _74.supplierReference) !== null && _75 !== void 0 ? _75 : undefined,
                                            documentLineReference: utils_ts_1.journalReference.to.receipt(poLineId),
                                            journalLineReference: journalLineReference,
                                            companyId: companyId_1,
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (itemTrackingType === "Inventory" && !isOutsideProcessing) {
                        // For inventory entries, use the appropriate entry type based on quantity sign
                        var entryType = receivedQuantity < 0 ? "Negative Adjmt." : "Positive Adjmt.";
                        itemLedgerInserts_1.push({
                            postingDate: today,
                            itemId: receiptLine.itemId,
                            quantity: receivedQuantity,
                            locationId: receiptLine.locationId,
                            storageUnitId: receiptLine.storageUnitId,
                            entryType: entryType,
                            documentType: "Purchase Receipt",
                            documentId: (_77 = (_76 = receipt_1.data) === null || _76 === void 0 ? void 0 : _76.id) !== null && _77 !== void 0 ? _77 : undefined,
                            externalDocumentId: (_79 = (_78 = receipt_1.data) === null || _78 === void 0 ? void 0 : _78.externalDocumentId) !== null && _79 !== void 0 ? _79 : undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (receiptLine.requiresBatchTracking && !isOutsideProcessing) {
                        var entryType = receivedQuantity < 0 ? "Negative Adjmt." : "Positive Adjmt.";
                        itemLedgerInserts_1.push({
                            postingDate: today,
                            itemId: receiptLine.itemId,
                            quantity: receivedQuantity,
                            locationId: receiptLine.locationId,
                            storageUnitId: receiptLine.storageUnitId,
                            entryType: entryType,
                            documentType: "Purchase Receipt",
                            documentId: (_81 = (_80 = receipt_1.data) === null || _80 === void 0 ? void 0 : _80.id) !== null && _81 !== void 0 ? _81 : undefined,
                            trackedEntityId: (_83 = (_82 = receiptLineTracking.data) === null || _82 === void 0 ? void 0 : _82.find(function (tracking) {
                                var _a;
                                return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Receipt Line"]) === receiptLine.id;
                            })) === null || _83 === void 0 ? void 0 : _83.id,
                            externalDocumentId: (_85 = (_84 = receipt_1.data) === null || _84 === void 0 ? void 0 : _84.externalDocumentId) !== null && _85 !== void 0 ? _85 : undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (receiptLine.requiresSerialTracking && !isOutsideProcessing) {
                        var lineTracking = (_86 = receiptLineTracking.data) === null || _86 === void 0 ? void 0 : _86.filter(function (tracking) {
                            var _a;
                            return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Receipt Line"]) === receiptLine.id;
                        });
                        var safeReceiptLineQuantity = isNaN(receiptLine.receivedQuantity) ||
                            receiptLine.receivedQuantity == null
                            ? 0
                            : receiptLine.receivedQuantity;
                        var absReceivedQuantity_1 = Math.abs(safeReceiptLineQuantity);
                        var entryType = receivedQuantity < 0 ? "Negative Adjmt." : "Positive Adjmt.";
                        var quantityPerEntry = receivedQuantity < 0 ? -1 : 1;
                        var _loop_5 = function (i) {
                            var trackingWithIndex = lineTracking === null || lineTracking === void 0 ? void 0 : lineTracking.find(function (tracking) {
                                var _a;
                                return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Receipt Line Index"]) === i;
                            });
                            itemLedgerInserts_1.push({
                                postingDate: today,
                                itemId: receiptLine.itemId,
                                quantity: quantityPerEntry,
                                locationId: receiptLine.locationId,
                                storageUnitId: receiptLine.storageUnitId,
                                entryType: entryType,
                                documentType: "Purchase Receipt",
                                documentId: (_88 = (_87 = receipt_1.data) === null || _87 === void 0 ? void 0 : _87.id) !== null && _88 !== void 0 ? _88 : undefined,
                                trackedEntityId: trackingWithIndex === null || trackingWithIndex === void 0 ? void 0 : trackingWithIndex.id,
                                externalDocumentId: (_90 = (_89 = receipt_1.data) === null || _89 === void 0 ? void 0 : _89.externalDocumentId) !== null && _90 !== void 0 ? _90 : undefined,
                                createdBy: userId_1,
                                companyId: companyId_1,
                            });
                        };
                        for (var i = 0; i < absReceivedQuantity_1; i++) {
                            _loop_5(i);
                        }
                    }
                    // Track dimensions for this receipt line's journal lines
                    if (accountingEnabled_1) {
                        var jlCount = journalLineInserts_1.length - jlStartIdx;
                        var lineItemPostingGroupId = (_92 = (_91 = itemCosts.data.find(function (cost) { return cost.itemId === receiptLine.itemId; })) === null || _91 === void 0 ? void 0 : _91.itemPostingGroupId) !== null && _92 !== void 0 ? _92 : null;
                        var poLine = purchaseOrderLines.data.find(function (pol) { return pol.id === receiptLine.lineId; });
                        var lineProcessId = (poLine === null || poLine === void 0 ? void 0 : poLine.jobOperationId)
                            ? (_93 = processIdByJobOperationId.get(poLine.jobOperationId)) !== null && _93 !== void 0 ? _93 : null
                            : null;
                        for (var i = 0; i < jlCount; i++) {
                            journalLineDimensionsMeta_1.push({
                                supplierTypeId: (_94 = supplier.data.supplierTypeId) !== null && _94 !== void 0 ? _94 : null,
                                itemPostingGroupId: lineItemPostingGroupId,
                                locationId: (_95 = receiptLine.locationId) !== null && _95 !== void 0 ? _95 : null,
                                processId: lineProcessId,
                                fixedAssetClassId: null,
                            });
                        }
                    }
                };
                _y = true, _z = __asyncValues(receiptLines_1.data);
                _127.label = 25;
            case 25: return [4 /*yield*/, _z.next()];
            case 26:
                if (!(_0 = _127.sent(), _9 = _0.done, !_9)) return [3 /*break*/, 28];
                _loop_3();
                _127.label = 27;
            case 27:
                _y = true;
                return [3 /*break*/, 25];
            case 28: return [3 /*break*/, 35];
            case 29:
                e_1_1 = _127.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 35];
            case 30:
                _127.trys.push([30, , 33, 34]);
                if (!(!_y && !_9 && (_10 = _z.return))) return [3 /*break*/, 32];
                return [4 /*yield*/, _10.call(_z)];
            case 31:
                _127.sent();
                _127.label = 32;
            case 32: return [3 /*break*/, 34];
            case 33:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 34: return [7 /*endfinally*/];
            case 35: return [4 /*yield*/, client
                    .from("receiptFixedAssetLine")
                    .select("purchaseOrderLineId, serialNumber")
                    .eq("receiptId", receiptId_1)
                    .eq("received", true)];
            case 36:
                receiptFaLines = (_127.sent()).data;
                receivedFaPoLineIds_1 = new Set((receiptFaLines !== null && receiptFaLines !== void 0 ? receiptFaLines : []).map(function (r) { return r.purchaseOrderLineId; }));
                faSerialNumbers = new Map((receiptFaLines !== null && receiptFaLines !== void 0 ? receiptFaLines : []).map(function (r) { return [r.purchaseOrderLineId, r.serialNumber]; }));
                faPurchaseOrderLines = purchaseOrderLines.data.filter(function (pol) {
                    return pol.purchaseOrderLineType === "Fixed Asset" &&
                        pol.assetId &&
                        !pol.receivedComplete &&
                        pol.purchaseQuantity &&
                        pol.purchaseQuantity > 0 &&
                        receivedFaPoLineIds_1.has(pol.id);
                });
                _1 = 0, faPurchaseOrderLines_1 = faPurchaseOrderLines;
                _127.label = 37;
            case 37:
                if (!(_1 < faPurchaseOrderLines_1.length)) return [3 /*break*/, 42];
                faPoLine = faPurchaseOrderLines_1[_1];
                if (!(accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) return [3 /*break*/, 40];
                quantity = (_96 = faPoLine.purchaseQuantity) !== null && _96 !== void 0 ? _96 : 1;
                unitPrice = (_97 = faPoLine.unitPrice) !== null && _97 !== void 0 ? _97 : 0;
                cost = quantity * unitPrice;
                return [4 /*yield*/, client
                        .from("fixedAsset")
                        .select("id, status, acquisitionDate, depreciationStartDate, acquisitionCost, locationId, fixedAssetClassId, fixedAssetClass:fixedAssetClassId(assetAccountId)")
                        .eq("id", faPoLine.assetId)
                        .single()];
            case 38:
                assetRecord = _127.sent();
                if (assetRecord.error)
                    throw new Error("Failed to fetch fixed asset");
                journalLineRef = (0, mod_ts_2.nanoid)();
                journalLineInserts_1.push({
                    accountId: assetRecord.data.fixedAssetClass
                        .assetAccountId,
                    description: "Fixed Asset Acquisition",
                    amount: (0, utils_ts_1.debit)("asset", cost),
                    quantity: quantity,
                    documentType: "Receipt",
                    documentId: (_99 = (_98 = receipt_1.data) === null || _98 === void 0 ? void 0 : _98.id) !== null && _99 !== void 0 ? _99 : undefined,
                    externalDocumentId: (_101 = (_100 = purchaseOrder_1.data) === null || _100 === void 0 ? void 0 : _100.supplierReference) !== null && _101 !== void 0 ? _101 : undefined,
                    documentLineReference: utils_ts_1.journalReference.to.receipt(faPoLine.id),
                    journalLineReference: journalLineRef,
                    companyId: companyId_1,
                });
                journalLineInserts_1.push({
                    accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                    description: "Goods Received Not Invoiced",
                    amount: (0, utils_ts_1.credit)("liability", cost),
                    quantity: quantity,
                    documentType: "Receipt",
                    documentId: (_103 = (_102 = receipt_1.data) === null || _102 === void 0 ? void 0 : _102.id) !== null && _103 !== void 0 ? _103 : undefined,
                    externalDocumentId: (_105 = (_104 = purchaseOrder_1.data) === null || _104 === void 0 ? void 0 : _104.supplierReference) !== null && _105 !== void 0 ? _105 : undefined,
                    documentLineReference: utils_ts_1.journalReference.to.receipt(faPoLine.id),
                    journalLineReference: journalLineRef,
                    companyId: companyId_1,
                });
                for (i = 0; i < 2; i++) {
                    journalLineDimensionsMeta_1.push({
                        supplierTypeId: (_106 = supplier.data.supplierTypeId) !== null && _106 !== void 0 ? _106 : null,
                        itemPostingGroupId: null,
                        locationId: (_109 = (_108 = (_107 = faPoLine.locationId) !== null && _107 !== void 0 ? _107 : receipt_1.data.locationId) !== null && _108 !== void 0 ? _108 : assetRecord.data.locationId) !== null && _109 !== void 0 ? _109 : null,
                        processId: null,
                        fixedAssetClassId: (_110 = assetRecord.data.fixedAssetClassId) !== null && _110 !== void 0 ? _110 : null,
                    });
                }
                updateData = {
                    acquisitionCost: ((_111 = Number(assetRecord.data.acquisitionCost)) !== null && _111 !== void 0 ? _111 : 0) + cost,
                    updatedBy: userId_1,
                };
                if (!assetRecord.data.acquisitionDate) {
                    updateData.acquisitionDate = today;
                }
                if (!assetRecord.data.depreciationStartDate) {
                    updateData.depreciationStartDate = today;
                }
                if (assetRecord.data.status === "Draft") {
                    updateData.status = "Active";
                }
                serialNumber = faSerialNumbers.get(faPoLine.id);
                if (serialNumber) {
                    updateData.serialNumber = serialNumber;
                }
                faLineLocationId = (_112 = faPoLine.locationId) !== null && _112 !== void 0 ? _112 : receipt_1.data.locationId;
                if (faLineLocationId) {
                    updateData.locationId = faLineLocationId;
                }
                return [4 /*yield*/, client
                        .from("fixedAsset")
                        .update(updateData)
                        .eq("id", faPoLine.assetId)];
            case 39:
                _127.sent();
                _127.label = 40;
            case 40:
                purchaseOrderLineUpdates_1[faPoLine.id] = {
                    quantityReceived: faPoLine.purchaseQuantity,
                    receivedComplete: true,
                    receivedDate: today,
                };
                _127.label = 41;
            case 41:
                _1++;
                return [3 /*break*/, 37];
            case 42:
                if (!accountingEnabled_1) return [3 /*break*/, 44];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 43:
                _2 = _127.sent();
                return [3 /*break*/, 45];
            case 44:
                _2 = null;
                _127.label = 45;
            case 45:
                accountingPeriodId_2 = _2;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, purchaseOrderLineId, update, e_5_1, _d, _e, _f, jobOperationId, update, e_6_1, purchaseOrderLines, areAllLinesInvoiced, areAllLinesReceived, status, journalEntryId, journalResult_1, journalLineResults, journalLineDimensionInserts_1, trackedActivity, trackedActivityId, _g, _h, _j, id, update, e_7_1, _i, inboundInspectionInserts_2, row, _k;
                        var _l, e_5, _m, _o, _p, e_6, _q, _r, _s, e_7, _t, _u;
                        var _v;
                        return __generator(this, function (_w) {
                            switch (_w.label) {
                                case 0:
                                    _w.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(purchaseOrderLineUpdates_1));
                                    _w.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _w.sent(), _l = _c.done, !_l)) return [3 /*break*/, 5];
                                    _o = _c.value;
                                    _a = false;
                                    purchaseOrderLineId = _o[0], update = _o[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrderLine")
                                            .set(update)
                                            .where("id", "=", purchaseOrderLineId)
                                            .execute()];
                                case 3:
                                    _w.sent();
                                    _w.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_5_1 = _w.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _w.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_l && (_m = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _m.call(_b)];
                                case 8:
                                    _w.sent();
                                    _w.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_5) throw e_5.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12:
                                    _w.trys.push([12, 18, 19, 24]);
                                    _d = true, _e = __asyncValues(Object.entries(jobOperationUpdates_1));
                                    _w.label = 13;
                                case 13: return [4 /*yield*/, _e.next()];
                                case 14:
                                    if (!(_f = _w.sent(), _p = _f.done, !_p)) return [3 /*break*/, 17];
                                    _r = _f.value;
                                    _d = false;
                                    jobOperationId = _r[0], update = _r[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("jobOperation")
                                            .set(update)
                                            .where("id", "=", jobOperationId)
                                            .execute()];
                                case 15:
                                    _w.sent();
                                    _w.label = 16;
                                case 16:
                                    _d = true;
                                    return [3 /*break*/, 13];
                                case 17: return [3 /*break*/, 24];
                                case 18:
                                    e_6_1 = _w.sent();
                                    e_6 = { error: e_6_1 };
                                    return [3 /*break*/, 24];
                                case 19:
                                    _w.trys.push([19, , 22, 23]);
                                    if (!(!_d && !_p && (_q = _e.return))) return [3 /*break*/, 21];
                                    return [4 /*yield*/, _q.call(_e)];
                                case 20:
                                    _w.sent();
                                    _w.label = 21;
                                case 21: return [3 /*break*/, 23];
                                case 22:
                                    if (e_6) throw e_6.error;
                                    return [7 /*endfinally*/];
                                case 23: return [7 /*endfinally*/];
                                case 24: return [4 /*yield*/, trx
                                        .selectFrom("purchaseOrderLine")
                                        .select([
                                        "id",
                                        "purchaseOrderLineType",
                                        "invoicedComplete",
                                        "receivedComplete",
                                    ])
                                        .where("purchaseOrderId", "=", purchaseOrder_1.data.id)
                                        .execute()];
                                case 25:
                                    purchaseOrderLines = _w.sent();
                                    areAllLinesInvoiced = purchaseOrderLines.every(function (line) {
                                        return line.purchaseOrderLineType === "Comment" || line.invoicedComplete;
                                    });
                                    areAllLinesReceived = purchaseOrderLines.every(function (line) {
                                        return line.purchaseOrderLineType === "Comment" ||
                                            line.purchaseOrderLineType === "G/L Account" ||
                                            line.receivedComplete;
                                    });
                                    status = "To Receive and Invoice";
                                    if (areAllLinesInvoiced && areAllLinesReceived) {
                                        status = "Completed";
                                    }
                                    else if (areAllLinesInvoiced) {
                                        status = "To Receive";
                                    }
                                    else if (areAllLinesReceived) {
                                        status = "To Invoice";
                                    }
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrder")
                                            .set({
                                            status: status,
                                        })
                                            .where("id", "=", purchaseOrder_1.data.id)
                                            .execute()];
                                case 26:
                                    _w.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrderDelivery")
                                            .set({
                                            deliveryDate: today,
                                            locationId: receipt_1.data.locationId,
                                        })
                                            .where("id", "=", receipt_1.data.sourceDocumentId)
                                            .execute()];
                                case 27:
                                    _w.sent();
                                    if (!(accountingEnabled_1 && journalLineInserts_1.length > 0)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 28:
                                    journalEntryId = _w.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            accountingPeriodId: accountingPeriodId_2,
                                            description: "Purchase Receipt ".concat(receipt_1.data.receiptId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Purchase Receipt",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 29:
                                    journalResult_1 = _w.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts_1.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult_1.id })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 30:
                                    journalLineResults = _w.sent();
                                    if (!(dimensionMap_1.size > 0)) return [3 /*break*/, 32];
                                    journalLineDimensionInserts_1 = [];
                                    journalLineResults.forEach(function (jl, index) {
                                        var meta = journalLineDimensionsMeta_1[index];
                                        if (!meta)
                                            return;
                                        if (meta.supplierTypeId &&
                                            dimensionMap_1.has("SupplierType")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("SupplierType"),
                                                valueId: meta.supplierTypeId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.itemPostingGroupId &&
                                            dimensionMap_1.has("ItemPostingGroup")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("ItemPostingGroup"),
                                                valueId: meta.itemPostingGroupId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.locationId && dimensionMap_1.has("Location")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("Location"),
                                                valueId: meta.locationId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.processId && dimensionMap_1.has("Process")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("Process"),
                                                valueId: meta.processId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.fixedAssetClassId && dimensionMap_1.has("FixedAssetClass")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("FixedAssetClass"),
                                                valueId: meta.fixedAssetClassId,
                                                companyId: companyId_1,
                                            });
                                        }
                                    });
                                    if (!(journalLineDimensionInserts_1.length > 0)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLineDimension")
                                            .values(journalLineDimensionInserts_1)
                                            .execute()];
                                case 31:
                                    _w.sent();
                                    _w.label = 32;
                                case 32:
                                    if (!(itemLedgerInserts_1.length > 0)) return [3 /*break*/, 34];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_1)
                                            .returning(["id"])
                                            .execute()];
                                case 33:
                                    _w.sent();
                                    _w.label = 34;
                                case 34: return [4 /*yield*/, trx
                                        .updateTable("receipt")
                                        .set({
                                        status: "Posted",
                                        postingDate: today,
                                        postedBy: userId_1,
                                    })
                                        .where("id", "=", receiptId_1)
                                        .execute()];
                                case 35:
                                    _w.sent();
                                    if (!(Object.keys(trackedEntityUpdates_1).length > 0)) return [3 /*break*/, 50];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            type: "Receive",
                                            sourceDocument: "Receipt",
                                            sourceDocumentId: receiptId_1,
                                            sourceDocumentReadableId: receipt_1.data.receiptId,
                                            attributes: {
                                                "Purchase Order": receipt_1.data.sourceDocumentId,
                                                Receipt: receiptId_1,
                                                Employee: userId_1,
                                            },
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 36:
                                    trackedActivity = _w.sent();
                                    trackedActivityId = trackedActivity[0].id;
                                    _w.label = 37;
                                case 37:
                                    _w.trys.push([37, 44, 45, 50]);
                                    _g = true, _h = __asyncValues(Object.entries(trackedEntityUpdates_1));
                                    _w.label = 38;
                                case 38: return [4 /*yield*/, _h.next()];
                                case 39:
                                    if (!(_j = _w.sent(), _s = _j.done, !_s)) return [3 /*break*/, 43];
                                    _u = _j.value;
                                    _g = false;
                                    id = _u[0], update = _u[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set(update)
                                            .where("id", "=", id)
                                            .execute()];
                                case 40:
                                    _w.sent();
                                    if (!trackedActivityId) return [3 /*break*/, 42];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: trackedActivityId,
                                            trackedEntityId: id,
                                            quantity: (_v = update.quantity) !== null && _v !== void 0 ? _v : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 41:
                                    _w.sent();
                                    _w.label = 42;
                                case 42:
                                    _g = true;
                                    return [3 /*break*/, 38];
                                case 43: return [3 /*break*/, 50];
                                case 44:
                                    e_7_1 = _w.sent();
                                    e_7 = { error: e_7_1 };
                                    return [3 /*break*/, 50];
                                case 45:
                                    _w.trys.push([45, , 48, 49]);
                                    if (!(!_g && !_s && (_t = _h.return))) return [3 /*break*/, 47];
                                    return [4 /*yield*/, _t.call(_h)];
                                case 46:
                                    _w.sent();
                                    _w.label = 47;
                                case 47: return [3 /*break*/, 49];
                                case 48:
                                    if (e_7) throw e_7.error;
                                    return [7 /*endfinally*/];
                                case 49: return [7 /*endfinally*/];
                                case 50:
                                    if (!(inboundInspectionInserts_1.length > 0)) return [3 /*break*/, 56];
                                    _i = 0, inboundInspectionInserts_2 = inboundInspectionInserts_1;
                                    _w.label = 51;
                                case 51:
                                    if (!(_i < inboundInspectionInserts_2.length)) return [3 /*break*/, 54];
                                    row = inboundInspectionInserts_2[_i];
                                    _k = row;
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "inboundInspection", companyId_1)];
                                case 52:
                                    _k.inboundInspectionId = _w.sent();
                                    _w.label = 53;
                                case 53:
                                    _i++;
                                    return [3 /*break*/, 51];
                                case 54: return [4 /*yield*/, trx
                                        .insertInto("inboundInspection")
                                        .values(inboundInspectionInserts_1)
                                        .execute()];
                                case 55:
                                    _w.sent();
                                    _w.label = 56;
                                case 56: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 46:
                _127.sent();
                return [3 /*break*/, 70];
            case 47:
                if (!receipt_1.data.sourceDocumentId)
                    throw new Error("Receipt has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", receipt_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", receipt_1.data.sourceDocumentId),
                    ])];
            case 48:
                _3 = _127.sent(), warehouseTransfer_1 = _3[0], warehouseTransferLines = _3[1];
                if (warehouseTransfer_1.error)
                    throw new Error("Failed to fetch warehouse transfer");
                if (warehouseTransferLines.error)
                    throw new Error("Failed to fetch warehouse transfer lines");
                transferItemIds = warehouseTransferLines.data
                    .map(function (line) { return line.itemId; })
                    .filter(Boolean);
                return [4 /*yield*/, client
                        .from("itemCost")
                        .select("itemId, itemPostingGroupId, unitCost")
                        .in("itemId", transferItemIds)];
            case 49:
                itemCosts_1 = _127.sent();
                if (itemCosts_1.error) {
                    throw new Error("Failed to fetch item costs");
                }
                itemLedgerInserts_2 = [];
                journalLineInserts_2 = [];
                journalLineDimensionsMeta_2 = [];
                warehouseTransferLineUpdates_1 = {};
                if (!accountingEnabled_1) return [3 /*break*/, 51];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client, companyId_1)];
            case 50:
                _4 = _127.sent();
                return [3 /*break*/, 52];
            case 51:
                _4 = null;
                _127.label = 52;
            case 52:
                accountDefaults = _4;
                if (accountingEnabled_1 && ((accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.error) || !(accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) {
                    throw new Error("Error getting account defaults");
                }
                _127.label = 53;
            case 53:
                _127.trys.push([53, 58, 59, 64]);
                _loop_4 = function () {
                    _14 = _7.value;
                    _5 = false;
                    var receiptLine = _14;
                    var jlStartIdx = journalLineInserts_2.length;
                    var warehouseTransferLine = warehouseTransferLines.data.find(function (line) { return line.id === receiptLine.lineId; });
                    if (!warehouseTransferLine)
                        return "continue";
                    var receivedQuantity = isNaN(receiptLine.receivedQuantity) ||
                        receiptLine.receivedQuantity == null
                        ? 0
                        : receiptLine.receivedQuantity;
                    if (receivedQuantity === 0)
                        return "continue";
                    // Update warehouse transfer line received quantity
                    var newReceivedQuantity = ((_113 = warehouseTransferLine.receivedQuantity) !== null && _113 !== void 0 ? _113 : 0) + receivedQuantity;
                    warehouseTransferLineUpdates_1[warehouseTransferLine.id] = {
                        receivedQuantity: newReceivedQuantity,
                    };
                    // Get item cost for this item
                    var itemCost = (_114 = itemCosts_1.data) === null || _114 === void 0 ? void 0 : _114.find(function (cost) { return cost.itemId === receiptLine.itemId; });
                    var unitCost = (_115 = itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _115 !== void 0 ? _115 : 0;
                    var totalValue = Math.abs(receivedQuantity) * unitCost;
                    // Create item ledger entry for positive adjustment at destination
                    itemLedgerInserts_2.push({
                        postingDate: today,
                        itemId: receiptLine.itemId,
                        quantity: receivedQuantity,
                        locationId: receiptLine.locationId,
                        storageUnitId: receiptLine.storageUnitId,
                        entryType: "Transfer",
                        documentType: "Transfer Receipt",
                        documentId: (_116 = warehouseTransfer_1.data) === null || _116 === void 0 ? void 0 : _116.transferId,
                        externalDocumentId: (_118 = (_117 = receipt_1.data) === null || _117 === void 0 ? void 0 : _117.externalDocumentId) !== null && _118 !== void 0 ? _118 : undefined,
                        createdBy: userId_1,
                        companyId: companyId_1,
                    });
                    // Create journal entries for inventory movement if there's value
                    if (accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) && totalValue > 0) {
                        var journalLineReference = (0, mod_ts_2.nanoid)();
                        journalLineInserts_2.push({
                            accountId: accountDefaults.data.inventoryAccount,
                            description: "Transfer Out - ".concat((_119 = warehouseTransfer_1.data) === null || _119 === void 0 ? void 0 : _119.transferId),
                            amount: (0, utils_ts_1.credit)("asset", totalValue),
                            quantity: Math.abs(receivedQuantity),
                            documentType: "Receipt",
                            documentId: (_120 = receipt_1.data) === null || _120 === void 0 ? void 0 : _120.id,
                            externalDocumentId: (_121 = warehouseTransfer_1.data) === null || _121 === void 0 ? void 0 : _121.transferId,
                            documentLineReference: "transfer-receipt:".concat(receiptLine.lineId),
                            journalLineReference: journalLineReference,
                            companyId: companyId_1,
                        });
                        journalLineInserts_2.push({
                            accountId: accountDefaults.data.inventoryAccount,
                            description: "Transfer In - ".concat((_122 = warehouseTransfer_1.data) === null || _122 === void 0 ? void 0 : _122.transferId),
                            amount: (0, utils_ts_1.debit)("asset", totalValue),
                            quantity: Math.abs(receivedQuantity),
                            documentType: "Receipt",
                            documentId: (_123 = receipt_1.data) === null || _123 === void 0 ? void 0 : _123.id,
                            externalDocumentId: (_124 = warehouseTransfer_1.data) === null || _124 === void 0 ? void 0 : _124.transferId,
                            documentLineReference: "transfer-receipt:".concat(receiptLine.lineId),
                            journalLineReference: journalLineReference,
                            companyId: companyId_1,
                        });
                    }
                    // Track dimensions for this receipt line's journal lines
                    if (accountingEnabled_1) {
                        var jlCount = journalLineInserts_2.length - jlStartIdx;
                        for (var i = 0; i < jlCount; i++) {
                            journalLineDimensionsMeta_2.push({
                                itemPostingGroupId: (_125 = itemCost === null || itemCost === void 0 ? void 0 : itemCost.itemPostingGroupId) !== null && _125 !== void 0 ? _125 : null,
                                locationId: (_126 = receiptLine.locationId) !== null && _126 !== void 0 ? _126 : null,
                                fixedAssetClassId: null,
                            });
                        }
                    }
                };
                _5 = true, _6 = __asyncValues(receiptLines_1.data);
                _127.label = 54;
            case 54: return [4 /*yield*/, _6.next()];
            case 55:
                if (!(_7 = _127.sent(), _12 = _7.done, !_12)) return [3 /*break*/, 57];
                _loop_4();
                _127.label = 56;
            case 56:
                _5 = true;
                return [3 /*break*/, 54];
            case 57: return [3 /*break*/, 64];
            case 58:
                e_2_1 = _127.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 64];
            case 59:
                _127.trys.push([59, , 62, 63]);
                if (!(!_5 && !_12 && (_13 = _6.return))) return [3 /*break*/, 61];
                return [4 /*yield*/, _13.call(_6)];
            case 60:
                _127.sent();
                _127.label = 61;
            case 61: return [3 /*break*/, 63];
            case 62:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 63: return [7 /*endfinally*/];
            case 64:
                allLinesFullyReceived = warehouseTransferLines.data.every(function (line) {
                    var _a, _b, _c;
                    var updates = warehouseTransferLineUpdates_1[line.id];
                    var receivedQty = (_b = (_a = updates === null || updates === void 0 ? void 0 : updates.receivedQuantity) !== null && _a !== void 0 ? _a : line.receivedQuantity) !== null && _b !== void 0 ? _b : 0;
                    return receivedQty >= ((_c = line.quantity) !== null && _c !== void 0 ? _c : 0);
                });
                allLinesFullyShipped = warehouseTransferLines.data.every(function (line) {
                    var _a, _b;
                    var shippedQty = (_a = line.shippedQuantity) !== null && _a !== void 0 ? _a : 0;
                    return shippedQty >= ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0);
                });
                newStatus_1 = warehouseTransfer_1.data.status;
                if (allLinesFullyReceived && allLinesFullyShipped) {
                    newStatus_1 = "Completed";
                }
                else if (allLinesFullyReceived && !allLinesFullyShipped) {
                    newStatus_1 = "To Ship";
                }
                else if (!allLinesFullyReceived && allLinesFullyShipped) {
                    newStatus_1 = "To Receive";
                }
                if (!accountingEnabled_1) return [3 /*break*/, 66];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 65:
                _8 = _127.sent();
                return [3 /*break*/, 67];
            case 66:
                _8 = null;
                _127.label = 67;
            case 67:
                accountingPeriodId_3 = _8;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, lineId, update, e_8_1, transferJournalEntryId, transferJournalResult_1, journalLineResults, journalLineDimensionInserts_2;
                        var _d, e_8, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(warehouseTransferLineUpdates_1));
                                    _g.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                    _f = _c.value;
                                    _a = false;
                                    lineId = _f[0], update = _f[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("warehouseTransferLine")
                                            .set(update)
                                            .where("id", "=", lineId)
                                            .execute()];
                                case 3:
                                    _g.sent();
                                    _g.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_8_1 = _g.sent();
                                    e_8 = { error: e_8_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _g.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 8:
                                    _g.sent();
                                    _g.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_8) throw e_8.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: 
                                // Update warehouse transfer status
                                return [4 /*yield*/, trx
                                        .updateTable("warehouseTransfer")
                                        .set({
                                        status: newStatus_1,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", warehouseTransfer_1.data.id)
                                        .execute()];
                                case 13:
                                    // Update warehouse transfer status
                                    _g.sent();
                                    if (!(accountingEnabled_1 && journalLineInserts_2.length > 0)) return [3 /*break*/, 18];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 14:
                                    transferJournalEntryId = _g.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: transferJournalEntryId,
                                            accountingPeriodId: accountingPeriodId_3,
                                            description: "Transfer Receipt ".concat(receipt_1.data.receiptId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Transfer Receipt",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 15:
                                    transferJournalResult_1 = _g.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts_2.map(function (line) { return (__assign(__assign({}, line), { journalId: transferJournalResult_1.id })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 16:
                                    journalLineResults = _g.sent();
                                    if (!(dimensionMap_1.size > 0)) return [3 /*break*/, 18];
                                    journalLineDimensionInserts_2 = [];
                                    journalLineResults.forEach(function (jl, index) {
                                        var meta = journalLineDimensionsMeta_2[index];
                                        if (!meta)
                                            return;
                                        if (meta.itemPostingGroupId &&
                                            dimensionMap_1.has("ItemPostingGroup")) {
                                            journalLineDimensionInserts_2.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("ItemPostingGroup"),
                                                valueId: meta.itemPostingGroupId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.locationId && dimensionMap_1.has("Location")) {
                                            journalLineDimensionInserts_2.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("Location"),
                                                valueId: meta.locationId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.fixedAssetClassId && dimensionMap_1.has("FixedAssetClass")) {
                                            journalLineDimensionInserts_2.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("FixedAssetClass"),
                                                valueId: meta.fixedAssetClassId,
                                                companyId: companyId_1,
                                            });
                                        }
                                    });
                                    if (!(journalLineDimensionInserts_2.length > 0)) return [3 /*break*/, 18];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLineDimension")
                                            .values(journalLineDimensionInserts_2)
                                            .execute()];
                                case 17:
                                    _g.sent();
                                    _g.label = 18;
                                case 18:
                                    if (!(itemLedgerInserts_2.length > 0)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_2)
                                            .returning(["id"])
                                            .execute()];
                                case 19:
                                    _g.sent();
                                    _g.label = 20;
                                case 20: 
                                // Update receipt status
                                return [4 /*yield*/, trx
                                        .updateTable("receipt")
                                        .set({
                                        status: "Posted",
                                        postingDate: today,
                                        postedBy: userId_1,
                                    })
                                        .where("id", "=", receiptId_1)
                                        .execute()];
                                case 21:
                                    // Update receipt status
                                    _g.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 68:
                _127.sent();
                return [3 /*break*/, 70];
            case 69:
                {
                    return [3 /*break*/, 70];
                }
                _127.label = 70;
            case 70: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                })];
            case 71:
                err_1 = _127.sent();
                console.error(err_1);
                if (!(payload.type !== "void" && "receiptId" in payload)) return [3 /*break*/, 74];
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, payload.companyId, payload.userId, { update: "inventory" })];
            case 72:
                client = _127.sent();
                return [4 /*yield*/, client
                        .from("receipt")
                        .update({ status: "Draft" })
                        .eq("id", payload.receiptId)];
            case 73:
                _127.sent();
                _127.label = 74;
            case 74: return [2 /*return*/, new Response(JSON.stringify(err_1), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 500,
                })];
            case 75: return [2 /*return*/];
        }
    });
}); });
