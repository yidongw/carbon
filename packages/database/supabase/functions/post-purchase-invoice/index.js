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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/std@0.205.0/datetime/mod.ts");
var mod_ts_2 = require("https://deno.land/x/nanoid@v3.0.0/mod.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var utils_ts_1 = require("../lib/utils.ts");
var get_accounting_period_ts_1 = require("../shared/get-accounting-period.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var get_posting_group_ts_1 = require("../shared/get-posting-group.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.default.object({
    type: npm_zod__3_24_1_1.default.enum(["post", "void"]).default("post"),
    invoiceId: npm_zod__3_24_1_1.default.string(),
    userId: npm_zod__3_24_1_1.default.string(),
    companyId: npm_zod__3_24_1_1.default.string(),
    skipReceiptPost: npm_zod__3_24_1_1.default.boolean().optional(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, _a, type, invoiceId_1, userId_1, companyId_1, skipReceiptPost_1, client, accountingEnabled_1, invoice_1, _b, originalItemLedger, originalJournalLines, originalCostLedger, invoiceLinesVoid, purchaseOrderLineIdsVoid, affectedPurchaseOrderIdsVoid, touchedLines, _i, _c, purchaseOrderId, purchaseOrderLinesVoid, _d, purchaseOrderLinesByIdVoid_1, purchaseOrderLineUpdatesVoid_1, purchaseOrderStatusUpdatesVoid_1, _loop_1, _e, affectedPurchaseOrderIdsVoid_1, purchaseOrderId, reversingJournalLines_1, reversingItemLedger_1, reversingCostLedger_1, accountingPeriodIdVoid_1, _f, companyRecord, companyGroupId, _g, purchaseInvoice_1, purchaseInvoiceLines, purchaseInvoiceDelivery, dimensions, dimensionMap_1, _h, _j, dim, shippingCost, totalLinesCost, itemIds, _k, items, itemCosts, purchaseOrderLines, supplier, purchaseOrders, costLedgerInserts_1, journalLineInserts_1, journalLineDimensionsMeta_1, processIdByJobOperationId, jobOpIds, jobOps, _l, _m, op, receiptLineInserts_1, itemLedgerInserts_1, purchaseInvoiceLinesByPurchaseOrderLine_1, purchaseOrderLineUpdates_1, journalLines, journalLinesByPurchaseOrderLine, accountDefaults, _o, _loop_2, _p, _q, _r, e_1_1, accountingPeriodId_1, _s, createdReceiptIds_1, err_1, client;
    var _t, e_1, _u, _v;
    var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91;
    return __generator(this, function (_92) {
        switch (_92.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _92.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _92.label = 2;
            case 2:
                _92.trys.push([2, 45, , 49]);
                _a = payloadValidator.parse(payload), type = _a.type, invoiceId_1 = _a.invoiceId, userId_1 = _a.userId, companyId_1 = _a.companyId, skipReceiptPost_1 = _a.skipReceiptPost;
                console.log({
                    function: "post-purchase-invoice",
                    type: type,
                    invoiceId: invoiceId_1,
                    userId: userId_1,
                    skipReceiptPost: skipReceiptPost_1,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "invoicing" })];
            case 3:
                client = _92.sent();
                return [4 /*yield*/, client
                        .from("companySettings")
                        .select("accountingEnabled")
                        .eq("id", companyId_1)
                        .single()
                        .then(function (r) { var _a, _b; return (_b = (_a = r.data) === null || _a === void 0 ? void 0 : _a.accountingEnabled) !== null && _b !== void 0 ? _b : false; })];
            case 4:
                accountingEnabled_1 = _92.sent();
                if (!(type === "void")) return [3 /*break*/, 17];
                return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .select("*")
                        .eq("id", invoiceId_1)
                        .single()];
            case 5:
                invoice_1 = _92.sent();
                if (invoice_1.error)
                    throw new Error("Failed to fetch purchaseInvoice");
                if (!invoice_1.data.postingDate) {
                    throw new Error("Can only void posted purchase invoices");
                }
                if (invoice_1.data.status === "Voided") {
                    throw new Error("Purchase invoice is already voided");
                }
                if (invoice_1.data.status === "Paid" ||
                    invoice_1.data.status === "Partially Paid") {
                    throw new Error("Cannot void a purchase invoice with payments applied. Reverse the payment first.");
                }
                return [4 /*yield*/, Promise.all([
                        client
                            .from("itemLedger")
                            .select("*")
                            .eq("documentId", invoiceId_1)
                            .eq("companyId", companyId_1),
                        client
                            .from("journalLine")
                            .select("*")
                            .eq("documentId", invoiceId_1)
                            .eq("documentType", "Invoice")
                            .eq("companyId", companyId_1),
                        client
                            .from("costLedger")
                            .select("*")
                            .eq("documentId", invoiceId_1)
                            .eq("documentType", "Purchase Invoice")
                            .eq("companyId", companyId_1),
                    ])];
            case 6:
                _b = _92.sent(), originalItemLedger = _b[0], originalJournalLines = _b[1], originalCostLedger = _b[2];
                if (originalItemLedger.error)
                    throw new Error("Failed to fetch item ledger entries");
                if (originalJournalLines.error)
                    throw new Error("Failed to fetch journal lines");
                if (originalCostLedger.error)
                    throw new Error("Failed to fetch cost ledger entries");
                return [4 /*yield*/, client
                        .from("purchaseInvoiceLine")
                        .select("*")
                        .eq("invoiceId", invoiceId_1)];
            case 7:
                invoiceLinesVoid = _92.sent();
                if (invoiceLinesVoid.error)
                    throw new Error("Failed to fetch purchase invoice lines");
                purchaseOrderLineIdsVoid = invoiceLinesVoid.data.reduce(function (acc, invoiceLine) {
                    if (invoiceLine.purchaseOrderLineId &&
                        !acc.includes(invoiceLine.purchaseOrderLineId)) {
                        acc.push(invoiceLine.purchaseOrderLineId);
                    }
                    return acc;
                }, []);
                affectedPurchaseOrderIdsVoid = [];
                if (!(purchaseOrderLineIdsVoid.length > 0)) return [3 /*break*/, 9];
                return [4 /*yield*/, client
                        .from("purchaseOrderLine")
                        .select("purchaseOrderId")
                        .in("id", purchaseOrderLineIdsVoid)];
            case 8:
                touchedLines = _92.sent();
                if (touchedLines.error)
                    throw new Error("Failed to fetch purchase order lines");
                for (_i = 0, _c = touchedLines.data; _i < _c.length; _i++) {
                    purchaseOrderId = _c[_i].purchaseOrderId;
                    if (purchaseOrderId &&
                        !affectedPurchaseOrderIdsVoid.includes(purchaseOrderId)) {
                        affectedPurchaseOrderIdsVoid.push(purchaseOrderId);
                    }
                }
                _92.label = 9;
            case 9:
                if (!(affectedPurchaseOrderIdsVoid.length > 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, client
                        .from("purchaseOrderLine")
                        .select("*")
                        .in("purchaseOrderId", affectedPurchaseOrderIdsVoid)];
            case 10:
                _d = _92.sent();
                return [3 /*break*/, 12];
            case 11:
                _d = { data: [], error: null };
                _92.label = 12;
            case 12:
                purchaseOrderLinesVoid = _d;
                if (purchaseOrderLinesVoid.error)
                    throw new Error("Failed to fetch purchase order lines");
                purchaseOrderLinesByIdVoid_1 = purchaseOrderLinesVoid.data.reduce(function (acc, purchaseOrderLine) {
                    acc[purchaseOrderLine.id] = purchaseOrderLine;
                    return acc;
                }, {});
                purchaseOrderLineUpdatesVoid_1 = invoiceLinesVoid.data.reduce(function (acc, invoiceLine) {
                    var _a, _b, _c;
                    var purchaseOrderLine = purchaseOrderLinesByIdVoid_1[(_a = invoiceLine.purchaseOrderLineId) !== null && _a !== void 0 ? _a : ""];
                    if (invoiceLine.purchaseOrderLineId &&
                        purchaseOrderLine &&
                        invoiceLine.quantity &&
                        purchaseOrderLine.purchaseQuantity &&
                        purchaseOrderLine.purchaseQuantity > 0) {
                        var invoicedQuantityInPurchaseUnit = invoiceLine.quantity / ((_b = invoiceLine.conversionFactor) !== null && _b !== void 0 ? _b : 1);
                        var newQuantityInvoiced = Math.max(0, ((_c = purchaseOrderLine.quantityInvoiced) !== null && _c !== void 0 ? _c : 0) -
                            invoicedQuantityInPurchaseUnit);
                        var invoicedComplete = newQuantityInvoiced >= purchaseOrderLine.purchaseQuantity;
                        acc[invoiceLine.purchaseOrderLineId] = {
                            quantityInvoiced: newQuantityInvoiced,
                            invoicedComplete: invoicedComplete,
                            purchaseOrderId: purchaseOrderLine.purchaseOrderId,
                        };
                    }
                    return acc;
                }, {});
                purchaseOrderStatusUpdatesVoid_1 = {};
                _loop_1 = function (purchaseOrderId) {
                    var projectedLines = purchaseOrderLinesVoid.data
                        .filter(function (line) { return line.purchaseOrderId === purchaseOrderId; })
                        .map(function (line) {
                        var update = purchaseOrderLineUpdatesVoid_1[line.id];
                        if (update && update.quantityInvoiced !== undefined) {
                            return __assign(__assign({}, line), { quantityInvoiced: update.quantityInvoiced });
                        }
                        return line;
                    });
                    var areAllLinesInvoicedProjected = projectedLines.every(function (line) {
                        var _a, _b;
                        if (line.purchaseOrderLineType === "Comment")
                            return true;
                        var target = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
                        if (target <= 0)
                            return true;
                        return ((_b = line.quantityInvoiced) !== null && _b !== void 0 ? _b : 0) >= target;
                    });
                    var areAllLinesReceivedProjected = projectedLines.every(function (line) {
                        var _a, _b;
                        if (line.purchaseOrderLineType === "Comment" || line.purchaseOrderLineType === "G/L Account")
                            return true;
                        var target = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
                        if (target <= 0)
                            return true;
                        return ((_b = line.quantityReceived) !== null && _b !== void 0 ? _b : 0) >= target;
                    });
                    var status_1 = "To Receive and Invoice";
                    if (areAllLinesInvoicedProjected && areAllLinesReceivedProjected) {
                        status_1 = "Completed";
                    }
                    else if (areAllLinesInvoicedProjected) {
                        status_1 = "To Receive";
                    }
                    else if (areAllLinesReceivedProjected) {
                        status_1 = "To Invoice";
                    }
                    purchaseOrderStatusUpdatesVoid_1[purchaseOrderId] = status_1;
                };
                for (_e = 0, affectedPurchaseOrderIdsVoid_1 = affectedPurchaseOrderIdsVoid; _e < affectedPurchaseOrderIdsVoid_1.length; _e++) {
                    purchaseOrderId = affectedPurchaseOrderIdsVoid_1[_e];
                    _loop_1(purchaseOrderId);
                }
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
                reversingCostLedger_1 = originalCostLedger.data.map(function (entry) { return ({
                    itemLedgerType: entry.itemLedgerType,
                    costLedgerType: entry.costLedgerType,
                    adjustment: entry.adjustment,
                    documentType: entry.documentType,
                    documentId: entry.documentId,
                    externalDocumentId: entry.externalDocumentId,
                    itemId: entry.itemId,
                    quantity: -entry.quantity,
                    nominalCost: -entry.nominalCost,
                    cost: -entry.cost,
                    supplierId: entry.supplierId,
                    companyId: companyId_1,
                }); });
                if (!accountingEnabled_1) return [3 /*break*/, 14];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 13:
                _f = _92.sent();
                return [3 /*break*/, 15];
            case 14:
                _f = null;
                _92.label = 15;
            case 15:
                accountingPeriodIdVoid_1 = _f;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, purchaseOrderLineId, update, _purchaseOrderId, lineUpdate, e_2_1, _d, _e, _f, purchaseOrderId, status_2, e_3_1, voidJournalEntryId, journal, journalId_1;
                        var _g, e_2, _h, _j, _k, e_3, _l, _m;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    _o.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(purchaseOrderLineUpdatesVoid_1));
                                    _o.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _o.sent(), _g = _c.done, !_g)) return [3 /*break*/, 5];
                                    _j = _c.value;
                                    _a = false;
                                    purchaseOrderLineId = _j[0], update = _j[1];
                                    _purchaseOrderId = update.purchaseOrderId, lineUpdate = __rest(update, ["purchaseOrderId"]);
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrderLine")
                                            .set(lineUpdate)
                                            .where("id", "=", purchaseOrderLineId)
                                            .execute()];
                                case 3:
                                    _o.sent();
                                    _o.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_2_1 = _o.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _o.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_g && (_h = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _h.call(_b)];
                                case 8:
                                    _o.sent();
                                    _o.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12:
                                    _o.trys.push([12, 18, 19, 24]);
                                    _d = true, _e = __asyncValues(Object.entries(purchaseOrderStatusUpdatesVoid_1));
                                    _o.label = 13;
                                case 13: return [4 /*yield*/, _e.next()];
                                case 14:
                                    if (!(_f = _o.sent(), _k = _f.done, !_k)) return [3 /*break*/, 17];
                                    _m = _f.value;
                                    _d = false;
                                    purchaseOrderId = _m[0], status_2 = _m[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrder")
                                            .set({ status: status_2 })
                                            .where("id", "=", purchaseOrderId)
                                            .execute()];
                                case 15:
                                    _o.sent();
                                    _o.label = 16;
                                case 16:
                                    _d = true;
                                    return [3 /*break*/, 13];
                                case 17: return [3 /*break*/, 24];
                                case 18:
                                    e_3_1 = _o.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 24];
                                case 19:
                                    _o.trys.push([19, , 22, 23]);
                                    if (!(!_d && !_k && (_l = _e.return))) return [3 /*break*/, 21];
                                    return [4 /*yield*/, _l.call(_e)];
                                case 20:
                                    _o.sent();
                                    _o.label = 21;
                                case 21: return [3 /*break*/, 23];
                                case 22:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 23: return [7 /*endfinally*/];
                                case 24:
                                    if (!(reversingJournalLines_1.length > 0)) return [3 /*break*/, 28];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 25:
                                    voidJournalEntryId = _o.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: voidJournalEntryId,
                                            accountingPeriodId: accountingPeriodIdVoid_1,
                                            description: "VOID Purchase Invoice ".concat(invoice_1.data.invoiceId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Purchase Invoice",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 26:
                                    journal = _o.sent();
                                    journalId_1 = journal[0].id;
                                    if (!journalId_1)
                                        throw new Error("Failed to insert journal");
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(reversingJournalLines_1.map(function (journalLine) { return (__assign(__assign({}, journalLine), { journalId: journalId_1 })); }))
                                            .execute()];
                                case 27:
                                    _o.sent();
                                    _o.label = 28;
                                case 28:
                                    if (!(reversingItemLedger_1.length > 0)) return [3 /*break*/, 30];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(reversingItemLedger_1)
                                            .execute()];
                                case 29:
                                    _o.sent();
                                    _o.label = 30;
                                case 30:
                                    if (!(reversingCostLedger_1.length > 0)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, trx
                                            .insertInto("costLedger")
                                            .values(reversingCostLedger_1)
                                            .execute()];
                                case 31:
                                    _o.sent();
                                    _o.label = 32;
                                case 32: return [4 /*yield*/, trx
                                        .updateTable("purchaseInvoice")
                                        .set({
                                        status: "Voided",
                                        updatedAt: today,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", invoiceId_1)
                                        .execute()];
                                case 33:
                                    _o.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 16:
                _92.sent();
                return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 17: return [4 /*yield*/, client
                    .from("company")
                    .select("companyGroupId")
                    .eq("id", companyId_1)
                    .single()];
            case 18:
                companyRecord = _92.sent();
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                companyGroupId = companyRecord.data.companyGroupId;
                return [4 /*yield*/, Promise.all([
                        client.from("purchaseInvoice").select("*").eq("id", invoiceId_1).single(),
                        client
                            .from("purchaseInvoiceLine")
                            .select("*")
                            .eq("invoiceId", invoiceId_1),
                        client
                            .from("purchaseInvoiceDelivery")
                            .select("supplierShippingCost")
                            .eq("id", invoiceId_1)
                            .single(),
                        client
                            .from("dimension")
                            .select("id, entityType")
                            .eq("companyGroupId", companyGroupId)
                            .eq("active", true)
                            .in("entityType", [
                            "SupplierType",
                            "ItemPostingGroup",
                            "Location",
                            "CostCenter",
                            "Process",
                            "FixedAssetClass",
                        ]),
                    ])];
            case 19:
                _g = _92.sent(), purchaseInvoice_1 = _g[0], purchaseInvoiceLines = _g[1], purchaseInvoiceDelivery = _g[2], dimensions = _g[3];
                if (purchaseInvoice_1.error)
                    throw new Error("Failed to fetch purchaseInvoice");
                if (purchaseInvoiceLines.error)
                    throw new Error("Failed to fetch receipt lines");
                if (purchaseInvoiceDelivery.error)
                    throw new Error("Failed to fetch purchase invoice delivery");
                if (dimensions.error) {
                    console.error("Failed to fetch dimensions", dimensions.error);
                }
                dimensionMap_1 = new Map();
                for (_h = 0, _j = (_w = dimensions.data) !== null && _w !== void 0 ? _w : []; _h < _j.length; _h++) {
                    dim = _j[_h];
                    if (dim.entityType)
                        dimensionMap_1.set(dim.entityType, dim.id);
                }
                shippingCost = ((_y = (_x = purchaseInvoiceDelivery.data) === null || _x === void 0 ? void 0 : _x.supplierShippingCost) !== null && _y !== void 0 ? _y : 0) *
                    ((_0 = (_z = purchaseInvoice_1.data) === null || _z === void 0 ? void 0 : _z.exchangeRate) !== null && _0 !== void 0 ? _0 : 1);
                totalLinesCost = purchaseInvoiceLines.data.reduce(function (acc, invoiceLine) {
                    var _a, _b, _c, _d;
                    var lineCost = ((_a = invoiceLine.quantity) !== null && _a !== void 0 ? _a : 0) * ((_b = invoiceLine.unitPrice) !== null && _b !== void 0 ? _b : 0) +
                        ((_c = invoiceLine.shippingCost) !== null && _c !== void 0 ? _c : 0) +
                        ((_d = invoiceLine.taxAmount) !== null && _d !== void 0 ? _d : 0);
                    return acc + lineCost;
                }, 0);
                itemIds = purchaseInvoiceLines.data.reduce(function (acc, invoiceLine) {
                    if (invoiceLine.itemId && !acc.includes(invoiceLine.itemId)) {
                        acc.push(invoiceLine.itemId);
                    }
                    return acc;
                }, []);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("item")
                            .select("id, itemTrackingType")
                            .in("id", itemIds)
                            .eq("companyId", companyId_1),
                        client
                            .from("itemCost")
                            .select("itemId, itemPostingGroupId")
                            .in("itemId", itemIds),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .in("id", purchaseInvoiceLines.data.reduce(function (acc, invoiceLine) {
                            if (invoiceLine.purchaseOrderLineId &&
                                !acc.includes(invoiceLine.purchaseOrderLineId)) {
                                acc.push(invoiceLine.purchaseOrderLineId);
                            }
                            return acc;
                        }, [])),
                        client
                            .from("supplier")
                            .select("*")
                            .eq("id", (_1 = purchaseInvoice_1.data.supplierId) !== null && _1 !== void 0 ? _1 : "")
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 20:
                _k = _92.sent(), items = _k[0], itemCosts = _k[1], purchaseOrderLines = _k[2], supplier = _k[3];
                if (items.error)
                    throw new Error("Failed to fetch items");
                if (itemCosts.error)
                    throw new Error("Failed to fetch item costs");
                if (purchaseOrderLines.error)
                    throw new Error("Failed to fetch purchase order lines");
                if (supplier.error)
                    throw new Error("Failed to fetch supplier");
                return [4 /*yield*/, client
                        .from("purchaseOrder")
                        .select("*")
                        .in("purchaseOrderId", purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                        if (purchaseOrderLine.purchaseOrderId &&
                            !acc.includes(purchaseOrderLine.purchaseOrderId)) {
                            acc.push(purchaseOrderLine.purchaseOrderId);
                        }
                        return acc;
                    }, []))
                        .eq("companyId", companyId_1)];
            case 21:
                purchaseOrders = _92.sent();
                if (purchaseOrders.error)
                    throw new Error("Failed to fetch purchase orders");
                costLedgerInserts_1 = [];
                journalLineInserts_1 = [];
                journalLineDimensionsMeta_1 = [];
                processIdByJobOperationId = new Map();
                jobOpIds = purchaseOrderLines.data
                    .map(function (pol) { return pol.jobOperationId; })
                    .filter(function (id) { return !!id; });
                if (!(jobOpIds.length > 0)) return [3 /*break*/, 23];
                return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id, processId")
                        .in("id", jobOpIds)];
            case 22:
                jobOps = _92.sent();
                for (_l = 0, _m = (_2 = jobOps.data) !== null && _2 !== void 0 ? _2 : []; _l < _m.length; _l++) {
                    op = _m[_l];
                    if (op.processId)
                        processIdByJobOperationId.set(op.id, op.processId);
                }
                _92.label = 23;
            case 23:
                receiptLineInserts_1 = [];
                itemLedgerInserts_1 = [];
                purchaseInvoiceLinesByPurchaseOrderLine_1 = purchaseInvoiceLines.data.reduce(function (acc, invoiceLine) {
                    if (invoiceLine.purchaseOrderLineId) {
                        acc[invoiceLine.purchaseOrderLineId] = invoiceLine;
                    }
                    return acc;
                }, {});
                purchaseOrderLineUpdates_1 = purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                    var _a;
                    var _b, _c;
                    var invoiceLine = purchaseInvoiceLinesByPurchaseOrderLine_1[purchaseOrderLine.id];
                    if (invoiceLine &&
                        invoiceLine.quantity &&
                        purchaseOrderLine.purchaseQuantity &&
                        purchaseOrderLine.purchaseQuantity > 0) {
                        var newQuantityInvoiced = ((_b = purchaseOrderLine.quantityInvoiced) !== null && _b !== void 0 ? _b : 0) + invoiceLine.quantity;
                        var invoicedComplete = purchaseOrderLine.invoicedComplete ||
                            invoiceLine.quantity >=
                                ((_c = purchaseOrderLine.quantityToInvoice) !== null && _c !== void 0 ? _c : purchaseOrderLine.purchaseQuantity);
                        return __assign(__assign({}, acc), (_a = {}, _a[purchaseOrderLine.id] = {
                            quantityInvoiced: newQuantityInvoiced,
                            invoicedComplete: invoicedComplete,
                            purchaseOrderId: purchaseOrderLine.purchaseOrderId,
                        }, _a));
                    }
                    return acc;
                }, {});
                return [4 /*yield*/, client
                        .from("journalLine")
                        .select("*")
                        .in("documentLineReference", purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                        var _a, _b;
                        if (((_a = purchaseOrderLine.quantityReceived) !== null && _a !== void 0 ? _a : 0) >
                            ((_b = purchaseOrderLine.quantityInvoiced) !== null && _b !== void 0 ? _b : 0)) {
                            acc.push(utils_ts_1.journalReference.to.receipt(purchaseOrderLine.id));
                        }
                        return acc;
                    }, []))
                        .eq("companyId", companyId_1)];
            case 24:
                journalLines = _92.sent();
                if (journalLines.error) {
                    throw new Error("Failed to fetch journal entries to reverse");
                }
                journalLinesByPurchaseOrderLine = journalLines.data.reduce(function (acc, journalEntry) {
                    var _a;
                    var _b = ((_a = journalEntry.documentLineReference) !== null && _a !== void 0 ? _a : "").split(":"), type = _b[0], purchaseOrderLineId = _b[1];
                    if (type === "receipt") {
                        if (acc[purchaseOrderLineId] &&
                            Array.isArray(acc[purchaseOrderLineId])) {
                            acc[purchaseOrderLineId].push(journalEntry);
                        }
                        else {
                            acc[purchaseOrderLineId] = [journalEntry];
                        }
                    }
                    return acc;
                }, {});
                if (!accountingEnabled_1) return [3 /*break*/, 26];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client, companyId_1)];
            case 25:
                _o = _92.sent();
                return [3 /*break*/, 27];
            case 26:
                _o = null;
                _92.label = 27;
            case 27:
                accountDefaults = _o;
                if (accountingEnabled_1 && ((accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.error) || !(accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) {
                    throw new Error("Error getting account defaults");
                }
                _92.label = 28;
            case 28:
                _92.trys.push([28, 34, 35, 40]);
                _loop_2 = function () {
                    var invoiceLine, invoiceLineQuantityInInventoryUnit, totalLineCost, lineCostPercentageOfTotalCost, lineWeightedShippingCost, totalLineCostWithWeightedShipping, invoiceLineUnitCostInInventoryUnit, journalLineReference, _93, item, itemTrackingType, debitAccount, debitDescription, lineItemPostingGroupId, itemDimMeta, existingJournalLines, previousJournalId_1, previousAccrual_1, currentGroup_1, existingJournalLineGroups, purchaseOrderLine, isOutsideProcessing, quantityReceived, quantityInvoiced, quantityToReverse_1, quantityAlreadyReversed_1, jlStartIdxReverse, receiptCostForReversedQty_1, quantityCounted_1, quantityReversedForVariance_1, invoiceCostForReversedQty, variance, reverseLineItemPostingGroupId, lineProcessId, reverseDimMeta, reverseJlCount, i, quantityToAccrue, accrualCost, accrualLineItemPostingGroupId, accrualProcessId, accrualDimMeta, purchaseOrderLine, wasReceived, faRecord, faLocationId, faClassId, jlStartIdxFa, faFixedAssetClassId, existingJournalLines, receiptCost, _94, existingJournalLines_1, entry, _95, existingJournalLines_2, entry, invoiceCost, variance, assetRecord, assetRecord, updateData, faJlCount, assetDimMeta, i, account, glDimMeta;
                    return __generator(this, function (_96) {
                        switch (_96.label) {
                            case 0:
                                _v = _r.value;
                                _p = false;
                                invoiceLine = _v;
                                invoiceLineQuantityInInventoryUnit = invoiceLine.quantity * ((_3 = invoiceLine.conversionFactor) !== null && _3 !== void 0 ? _3 : 1);
                                totalLineCost = invoiceLine.quantity * ((_4 = invoiceLine.unitPrice) !== null && _4 !== void 0 ? _4 : 0) +
                                    ((_5 = invoiceLine.shippingCost) !== null && _5 !== void 0 ? _5 : 0) +
                                    ((_6 = invoiceLine.taxAmount) !== null && _6 !== void 0 ? _6 : 0);
                                lineCostPercentageOfTotalCost = totalLinesCost === 0 ? 0 : totalLineCost / totalLinesCost;
                                lineWeightedShippingCost = shippingCost * lineCostPercentageOfTotalCost;
                                totalLineCostWithWeightedShipping = totalLineCost + lineWeightedShippingCost;
                                invoiceLineUnitCostInInventoryUnit = totalLineCostWithWeightedShipping /
                                    (invoiceLine.quantity * ((_7 = invoiceLine.conversionFactor) !== null && _7 !== void 0 ? _7 : 1));
                                journalLineReference = void 0;
                                _93 = invoiceLine.invoiceLineType;
                                switch (_93) {
                                    case "Part": return [3 /*break*/, 1];
                                    case "Service": return [3 /*break*/, 1];
                                    case "Consumable": return [3 /*break*/, 1];
                                    case "Fixture": return [3 /*break*/, 1];
                                    case "Material": return [3 /*break*/, 1];
                                    case "Tool": return [3 /*break*/, 1];
                                    case "Fixed Asset": return [3 /*break*/, 2];
                                    case "Comment": return [3 /*break*/, 12];
                                    case "G/L Account": return [3 /*break*/, 13];
                                }
                                return [3 /*break*/, 16];
                            case 1:
                                {
                                    item = items.data.find(function (item) { return item.id === invoiceLine.itemId; });
                                    itemTrackingType = (_8 = item === null || item === void 0 ? void 0 : item.itemTrackingType) !== null && _8 !== void 0 ? _8 : "Inventory";
                                    console.log({
                                        invoiceLineItemId: invoiceLine.itemId,
                                        foundItem: item,
                                        itemTrackingType: itemTrackingType,
                                        requiresSerialTracking: itemTrackingType === "Serial",
                                        requiresBatchTracking: itemTrackingType === "Batch",
                                    });
                                    // if the purchase order line is null, we receive the part, do the normal entries and do not use accrual/reversing
                                    if (invoiceLine.purchaseOrderLineId === null) {
                                        // create the receipt line
                                        receiptLineInserts_1.push({
                                            itemId: invoiceLine.itemId,
                                            lineId: invoiceLine.id,
                                            orderQuantity: invoiceLineQuantityInInventoryUnit,
                                            outstandingQuantity: invoiceLineQuantityInInventoryUnit,
                                            receivedQuantity: invoiceLineQuantityInInventoryUnit,
                                            locationId: invoiceLine.locationId,
                                            storageUnitId: invoiceLine.storageUnitId,
                                            unitOfMeasure: (_9 = invoiceLine.inventoryUnitOfMeasureCode) !== null && _9 !== void 0 ? _9 : "EA",
                                            unitPrice: (_10 = invoiceLine.unitPrice) !== null && _10 !== void 0 ? _10 : 0,
                                            requiresSerialTracking: itemTrackingType === "Serial",
                                            requiresBatchTracking: itemTrackingType === "Batch",
                                            createdBy: invoiceLine.createdBy,
                                            companyId: companyId_1,
                                        });
                                        // Only create item ledger entries if the receipt is being posted
                                        // (not when skipReceiptPost is true, as entries will be created when the receipt is posted later)
                                        if (itemTrackingType === "Inventory" && !skipReceiptPost_1) {
                                            // create the part ledger line
                                            itemLedgerInserts_1.push({
                                                postingDate: today,
                                                itemId: invoiceLine.itemId,
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                locationId: invoiceLine.locationId,
                                                storageUnitId: invoiceLine.storageUnitId,
                                                entryType: "Positive Adjmt.",
                                                documentType: "Purchase Receipt",
                                                documentId: (_12 = (_11 = purchaseInvoice_1.data) === null || _11 === void 0 ? void 0 : _11.id) !== null && _12 !== void 0 ? _12 : undefined,
                                                externalDocumentId: (_14 = (_13 = purchaseInvoice_1.data) === null || _13 === void 0 ? void 0 : _13.supplierReference) !== null && _14 !== void 0 ? _14 : undefined,
                                                createdBy: userId_1,
                                                companyId: companyId_1,
                                            });
                                        }
                                        // create the cost ledger line
                                        costLedgerInserts_1.push({
                                            itemLedgerType: "Purchase",
                                            costLedgerType: "Direct Cost",
                                            adjustment: false,
                                            documentType: "Purchase Invoice",
                                            documentId: (_16 = (_15 = purchaseInvoice_1.data) === null || _15 === void 0 ? void 0 : _15.id) !== null && _16 !== void 0 ? _16 : undefined,
                                            externalDocumentId: (_18 = (_17 = purchaseInvoice_1.data) === null || _17 === void 0 ? void 0 : _17.supplierReference) !== null && _18 !== void 0 ? _18 : undefined,
                                            itemId: invoiceLine.itemId,
                                            quantity: invoiceLineQuantityInInventoryUnit,
                                            nominalCost: invoiceLine.quantity * ((_19 = invoiceLine.unitPrice) !== null && _19 !== void 0 ? _19 : 0),
                                            cost: totalLineCostWithWeightedShipping,
                                            remainingQuantity: invoiceLineQuantityInInventoryUnit,
                                            supplierId: (_20 = purchaseInvoice_1.data) === null || _20 === void 0 ? void 0 : _20.supplierId,
                                            companyId: companyId_1,
                                        });
                                        // create the GL entries for a direct invoice (no PO)
                                        if (accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data)) {
                                            journalLineReference = (0, mod_ts_2.nanoid)();
                                            debitAccount = void 0;
                                            debitDescription = void 0;
                                            if (itemTrackingType === "Inventory" && !skipReceiptPost_1) {
                                                debitAccount = accountDefaults.data.inventoryAccount;
                                                debitDescription = "Inventory Account";
                                            }
                                            else if (itemTrackingType === "Non-Inventory") {
                                                debitAccount = accountDefaults.data.indirectCostAccount;
                                                debitDescription = "Indirect Cost Account";
                                            }
                                            else {
                                                debitAccount = accountDefaults.data.workInProgressAccount;
                                                debitDescription = "WIP Account";
                                            }
                                            journalLineInserts_1.push({
                                                accountId: debitAccount,
                                                description: debitDescription,
                                                amount: (0, utils_ts_1.debit)("asset", totalLineCostWithWeightedShipping),
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                documentType: "Invoice",
                                                documentId: (_21 = purchaseInvoice_1.data) === null || _21 === void 0 ? void 0 : _21.id,
                                                externalDocumentId: (_22 = purchaseInvoice_1.data) === null || _22 === void 0 ? void 0 : _22.supplierReference,
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.payablesAccount,
                                                description: "Accounts Payable",
                                                amount: (0, utils_ts_1.credit)("liability", totalLineCostWithWeightedShipping),
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                documentType: "Invoice",
                                                documentId: (_23 = purchaseInvoice_1.data) === null || _23 === void 0 ? void 0 : _23.id,
                                                externalDocumentId: (_24 = purchaseInvoice_1.data) === null || _24 === void 0 ? void 0 : _24.supplierReference,
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            lineItemPostingGroupId = (_26 = (_25 = itemCosts.data.find(function (cost) { return cost.itemId === invoiceLine.itemId; })) === null || _25 === void 0 ? void 0 : _25.itemPostingGroupId) !== null && _26 !== void 0 ? _26 : null;
                                            itemDimMeta = {
                                                supplierTypeId: (_27 = supplier.data.supplierTypeId) !== null && _27 !== void 0 ? _27 : null,
                                                itemPostingGroupId: lineItemPostingGroupId,
                                                locationId: (_28 = invoiceLine.locationId) !== null && _28 !== void 0 ? _28 : null,
                                                costCenterId: null,
                                                processId: null,
                                                fixedAssetClassId: null,
                                            };
                                            journalLineDimensionsMeta_1.push(itemDimMeta, itemDimMeta);
                                        }
                                    } // if the line is associated with a purchase order line, we do accrual/reversing
                                    else {
                                        // create the cost entry
                                        costLedgerInserts_1.push({
                                            itemLedgerType: "Purchase",
                                            costLedgerType: "Direct Cost",
                                            adjustment: false,
                                            documentType: "Purchase Invoice",
                                            documentId: (_30 = (_29 = purchaseInvoice_1.data) === null || _29 === void 0 ? void 0 : _29.id) !== null && _30 !== void 0 ? _30 : undefined,
                                            externalDocumentId: (_32 = (_31 = purchaseInvoice_1.data) === null || _31 === void 0 ? void 0 : _31.supplierReference) !== null && _32 !== void 0 ? _32 : undefined,
                                            itemId: invoiceLine.itemId,
                                            quantity: invoiceLineQuantityInInventoryUnit,
                                            nominalCost: invoiceLine.quantity * ((_33 = invoiceLine.unitPrice) !== null && _33 !== void 0 ? _33 : 0),
                                            cost: totalLineCostWithWeightedShipping,
                                            remainingQuantity: invoiceLineQuantityInInventoryUnit,
                                            supplierId: (_34 = purchaseInvoice_1.data) === null || _34 === void 0 ? void 0 : _34.supplierId,
                                            companyId: companyId_1,
                                        });
                                        existingJournalLines = invoiceLine.purchaseOrderLineId
                                            ? (_35 = journalLinesByPurchaseOrderLine[invoiceLine.purchaseOrderLineId]) !== null && _35 !== void 0 ? _35 : []
                                            : [];
                                        previousJournalId_1 = null;
                                        previousAccrual_1 = null;
                                        currentGroup_1 = 0;
                                        existingJournalLineGroups = existingJournalLines.reduce(function (acc, entry) {
                                            var journalId = entry.journalId, accrual = entry.accrual;
                                            if (journalId === previousJournalId_1 &&
                                                accrual === previousAccrual_1) {
                                                acc[currentGroup_1 - 1].push(entry);
                                            }
                                            else {
                                                acc.push([entry]);
                                                currentGroup_1++;
                                            }
                                            previousJournalId_1 = journalId;
                                            previousAccrual_1 = accrual;
                                            return acc;
                                        }, []);
                                        purchaseOrderLine = purchaseOrderLines.data.find(function (line) { return line.id === invoiceLine.purchaseOrderLineId; });
                                        isOutsideProcessing = !!(purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.jobOperationId);
                                        quantityReceived = ((_36 = purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.quantityReceived) !== null && _36 !== void 0 ? _36 : 0) *
                                            ((_37 = purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.conversionFactor) !== null && _37 !== void 0 ? _37 : 1);
                                        quantityInvoiced = ((_38 = purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.quantityInvoiced) !== null && _38 !== void 0 ? _38 : 0) *
                                            ((_39 = purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.conversionFactor) !== null && _39 !== void 0 ? _39 : 1);
                                        quantityToReverse_1 = Math.max(0, Math.min(invoiceLineQuantityInInventoryUnit, quantityReceived - quantityInvoiced));
                                        quantityAlreadyReversed_1 = quantityReceived > quantityInvoiced ? quantityInvoiced : 0;
                                        jlStartIdxReverse = journalLineInserts_1.length;
                                        if (quantityToReverse_1 > 0 && accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data)) {
                                            receiptCostForReversedQty_1 = 0;
                                            quantityCounted_1 = 0;
                                            quantityReversedForVariance_1 = 0;
                                            existingJournalLineGroups.forEach(function (entry) {
                                                var _a;
                                                if (entry[0].quantity) {
                                                    var unitCostForEntry = Math.abs((_a = entry[0].amount) !== null && _a !== void 0 ? _a : 0) / entry[0].quantity;
                                                    var quantityAvailableToReverseForEntry = quantityAlreadyReversed_1 > quantityCounted_1
                                                        ? entry[0].quantity +
                                                            quantityCounted_1 -
                                                            quantityAlreadyReversed_1
                                                        : entry[0].quantity;
                                                    var quantityRequiredToReverse = quantityToReverse_1 - quantityReversedForVariance_1;
                                                    var quantityToReverseForEntry = Math.max(0, Math.min(quantityAvailableToReverseForEntry, quantityRequiredToReverse));
                                                    receiptCostForReversedQty_1 +=
                                                        quantityToReverseForEntry * unitCostForEntry;
                                                    quantityCounted_1 += entry[0].quantity;
                                                    quantityReversedForVariance_1 += quantityToReverseForEntry;
                                                }
                                            });
                                            invoiceCostForReversedQty = quantityToReverse_1 * invoiceLineUnitCostInInventoryUnit;
                                            variance = invoiceCostForReversedQty - receiptCostForReversedQty_1;
                                            journalLineReference = (0, mod_ts_2.nanoid)();
                                            // DR GR/IR Clearing at receipt cost — clears the receipt's CR
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                                                description: "GR/IR Clearing",
                                                amount: (0, utils_ts_1.debit)("liability", receiptCostForReversedQty_1),
                                                quantity: quantityToReverse_1,
                                                documentType: "Invoice",
                                                documentId: (_40 = purchaseInvoice_1.data) === null || _40 === void 0 ? void 0 : _40.id,
                                                externalDocumentId: (_41 = purchaseInvoice_1.data) === null || _41 === void 0 ? void 0 : _41.supplierReference,
                                                documentLineReference: utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId),
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            // DR/CR Purchase Price Variance if invoice cost differs from receipt cost
                                            if (Math.abs(variance) > 0.005) {
                                                journalLineInserts_1.push({
                                                    accountId: accountDefaults.data.purchaseVarianceAccount,
                                                    description: "Purchase Price Variance",
                                                    amount: (0, utils_ts_1.debit)("expense", variance),
                                                    quantity: quantityToReverse_1,
                                                    documentType: "Invoice",
                                                    documentId: (_42 = purchaseInvoice_1.data) === null || _42 === void 0 ? void 0 : _42.id,
                                                    externalDocumentId: (_43 = purchaseInvoice_1.data) === null || _43 === void 0 ? void 0 : _43.supplierReference,
                                                    documentLineReference: utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId),
                                                    journalLineReference: journalLineReference,
                                                    companyId: companyId_1,
                                                });
                                            }
                                            // CR Accounts Payable at invoice cost
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.payablesAccount,
                                                description: "Accounts Payable",
                                                amount: (0, utils_ts_1.credit)("liability", invoiceCostForReversedQty),
                                                quantity: quantityToReverse_1,
                                                documentType: "Invoice",
                                                documentId: (_44 = purchaseInvoice_1.data) === null || _44 === void 0 ? void 0 : _44.id,
                                                externalDocumentId: (_45 = purchaseInvoice_1.data) === null || _45 === void 0 ? void 0 : _45.supplierReference,
                                                documentLineReference: utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId),
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            reverseLineItemPostingGroupId = (_47 = (_46 = itemCosts.data.find(function (cost) { return cost.itemId === invoiceLine.itemId; })) === null || _46 === void 0 ? void 0 : _46.itemPostingGroupId) !== null && _47 !== void 0 ? _47 : null;
                                            lineProcessId = (purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.jobOperationId)
                                                ? (_48 = processIdByJobOperationId.get(purchaseOrderLine.jobOperationId)) !== null && _48 !== void 0 ? _48 : null
                                                : null;
                                            reverseDimMeta = {
                                                supplierTypeId: (_49 = supplier.data.supplierTypeId) !== null && _49 !== void 0 ? _49 : null,
                                                itemPostingGroupId: reverseLineItemPostingGroupId,
                                                locationId: (_50 = invoiceLine.locationId) !== null && _50 !== void 0 ? _50 : null,
                                                costCenterId: null,
                                                processId: lineProcessId,
                                                fixedAssetClassId: null,
                                            };
                                            reverseJlCount = journalLineInserts_1.length - jlStartIdxReverse;
                                            for (i = 0; i < reverseJlCount; i++) {
                                                journalLineDimensionsMeta_1.push(reverseDimMeta);
                                            }
                                        }
                                        if (invoiceLineQuantityInInventoryUnit > quantityToReverse_1 && accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data)) {
                                            quantityToAccrue = invoiceLineQuantityInInventoryUnit - quantityToReverse_1;
                                            accrualCost = quantityToAccrue * invoiceLineUnitCostInInventoryUnit;
                                            journalLineReference = (0, mod_ts_2.nanoid)();
                                            // DR GR/IR Clearing — debit balance represents goods invoiced but not received
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                                                description: "GR/IR Clearing",
                                                accrual: true,
                                                amount: (0, utils_ts_1.debit)("liability", accrualCost),
                                                quantity: quantityToAccrue,
                                                documentType: "Invoice",
                                                documentId: (_51 = purchaseInvoice_1.data) === null || _51 === void 0 ? void 0 : _51.id,
                                                externalDocumentId: (_52 = purchaseInvoice_1.data) === null || _52 === void 0 ? void 0 : _52.supplierReference,
                                                documentLineReference: invoiceLine.purchaseOrderLineId
                                                    ? utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId)
                                                    : null,
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            // CR Accounts Payable
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.payablesAccount,
                                                description: "Accounts Payable",
                                                accrual: true,
                                                amount: (0, utils_ts_1.credit)("liability", accrualCost),
                                                quantity: quantityToAccrue,
                                                documentType: "Invoice",
                                                documentId: (_53 = purchaseInvoice_1.data) === null || _53 === void 0 ? void 0 : _53.id,
                                                externalDocumentId: (_54 = purchaseInvoice_1.data) === null || _54 === void 0 ? void 0 : _54.supplierReference,
                                                documentLineReference: invoiceLine.purchaseOrderLineId
                                                    ? utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId)
                                                    : null,
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            accrualLineItemPostingGroupId = (_56 = (_55 = itemCosts.data.find(function (cost) { return cost.itemId === invoiceLine.itemId; })) === null || _55 === void 0 ? void 0 : _55.itemPostingGroupId) !== null && _56 !== void 0 ? _56 : null;
                                            accrualProcessId = (purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.jobOperationId)
                                                ? (_57 = processIdByJobOperationId.get(purchaseOrderLine.jobOperationId)) !== null && _57 !== void 0 ? _57 : null
                                                : null;
                                            accrualDimMeta = {
                                                supplierTypeId: (_58 = supplier.data.supplierTypeId) !== null && _58 !== void 0 ? _58 : null,
                                                itemPostingGroupId: accrualLineItemPostingGroupId,
                                                locationId: (_59 = invoiceLine.locationId) !== null && _59 !== void 0 ? _59 : null,
                                                costCenterId: null,
                                                processId: accrualProcessId,
                                                fixedAssetClassId: null,
                                            };
                                            journalLineDimensionsMeta_1.push(accrualDimMeta, accrualDimMeta);
                                        }
                                    }
                                }
                                return [3 /*break*/, 17];
                            case 2:
                                if (!(accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) && invoiceLine.assetId)) return [3 /*break*/, 11];
                                purchaseOrderLine = purchaseOrderLines.data.find(function (line) { return line.id === invoiceLine.purchaseOrderLineId; });
                                wasReceived = purchaseOrderLine &&
                                    ((_60 = purchaseOrderLine.quantityReceived) !== null && _60 !== void 0 ? _60 : 0) > 0;
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .select("locationId, fixedAssetClassId")
                                        .eq("id", invoiceLine.assetId)
                                        .single()];
                            case 3:
                                faRecord = _96.sent();
                                faLocationId = (_62 = (_61 = faRecord.data) === null || _61 === void 0 ? void 0 : _61.locationId) !== null && _62 !== void 0 ? _62 : null;
                                faClassId = (_64 = (_63 = faRecord.data) === null || _63 === void 0 ? void 0 : _63.fixedAssetClassId) !== null && _64 !== void 0 ? _64 : null;
                                jlStartIdxFa = journalLineInserts_1.length;
                                faFixedAssetClassId = null;
                                if (!(wasReceived && invoiceLine.purchaseOrderLineId)) return [3 /*break*/, 7];
                                existingJournalLines = (_65 = journalLinesByPurchaseOrderLine[invoiceLine.purchaseOrderLineId]) !== null && _65 !== void 0 ? _65 : [];
                                receiptCost = 0;
                                for (_94 = 0, existingJournalLines_1 = existingJournalLines; _94 < existingJournalLines_1.length; _94++) {
                                    entry = existingJournalLines_1[_94];
                                    if (((_66 = entry.amount) !== null && _66 !== void 0 ? _66 : 0) > 0 &&
                                        entry.description === "Fixed Asset Acquisition") {
                                        receiptCost += Math.abs((_67 = entry.amount) !== null && _67 !== void 0 ? _67 : 0);
                                    }
                                }
                                if (receiptCost === 0) {
                                    for (_95 = 0, existingJournalLines_2 = existingJournalLines; _95 < existingJournalLines_2.length; _95++) {
                                        entry = existingJournalLines_2[_95];
                                        if (((_68 = entry.amount) !== null && _68 !== void 0 ? _68 : 0) < 0 &&
                                            entry.description === "Goods Received Not Invoiced") {
                                            receiptCost += Math.abs((_69 = entry.amount) !== null && _69 !== void 0 ? _69 : 0);
                                        }
                                    }
                                }
                                invoiceCost = totalLineCostWithWeightedShipping;
                                variance = invoiceCost - receiptCost;
                                journalLineReference = (0, mod_ts_2.nanoid)();
                                // DR GR/IR at receipt cost (clear the accrual)
                                journalLineInserts_1.push({
                                    accountId: accountDefaults.data.goodsReceivedNotInvoicedAccount,
                                    description: "GR/IR Clearing",
                                    amount: (0, utils_ts_1.debit)("liability", receiptCost),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_70 = purchaseInvoice_1.data) === null || _70 === void 0 ? void 0 : _70.id,
                                    externalDocumentId: (_71 = purchaseInvoice_1.data) === null || _71 === void 0 ? void 0 : _71.supplierReference,
                                    documentLineReference: utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId),
                                    journalLineReference: journalLineReference,
                                    companyId: companyId_1,
                                });
                                if (Math.abs(variance) > 0.005) {
                                    journalLineInserts_1.push({
                                        accountId: accountDefaults.data.purchaseVarianceAccount,
                                        description: "Purchase Price Variance",
                                        amount: (0, utils_ts_1.debit)("expense", variance),
                                        quantity: invoiceLineQuantityInInventoryUnit,
                                        documentType: "Invoice",
                                        documentId: (_72 = purchaseInvoice_1.data) === null || _72 === void 0 ? void 0 : _72.id,
                                        externalDocumentId: (_73 = purchaseInvoice_1.data) === null || _73 === void 0 ? void 0 : _73.supplierReference,
                                        documentLineReference: utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId),
                                        journalLineReference: journalLineReference,
                                        companyId: companyId_1,
                                    });
                                }
                                // CR Payables at invoice cost
                                journalLineInserts_1.push({
                                    accountId: accountDefaults.data.payablesAccount,
                                    description: "Accounts Payable",
                                    amount: (0, utils_ts_1.credit)("liability", invoiceCost),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_74 = purchaseInvoice_1.data) === null || _74 === void 0 ? void 0 : _74.id,
                                    externalDocumentId: (_75 = purchaseInvoice_1.data) === null || _75 === void 0 ? void 0 : _75.supplierReference,
                                    documentLineReference: utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId),
                                    journalLineReference: journalLineReference,
                                    companyId: companyId_1,
                                });
                                if (!(Math.abs(variance) > 0.005)) return [3 /*break*/, 6];
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .select("id, acquisitionCost")
                                        .eq("id", invoiceLine.assetId)
                                        .single()];
                            case 4:
                                assetRecord = _96.sent();
                                if (!!assetRecord.error) return [3 /*break*/, 6];
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .update({
                                        acquisitionCost: Number(assetRecord.data.acquisitionCost) + variance,
                                        updatedBy: userId_1,
                                    })
                                        .eq("id", invoiceLine.assetId)];
                            case 5:
                                _96.sent();
                                _96.label = 6;
                            case 6:
                                faFixedAssetClassId = faClassId;
                                return [3 /*break*/, 10];
                            case 7: return [4 /*yield*/, client
                                    .from("fixedAsset")
                                    .select("id, status, acquisitionDate, depreciationStartDate, acquisitionCost, fixedAssetClassId, fixedAssetClass:fixedAssetClassId(assetAccountId)")
                                    .eq("id", invoiceLine.assetId)
                                    .single()];
                            case 8:
                                assetRecord = _96.sent();
                                if (assetRecord.error)
                                    throw new Error("Failed to fetch fixed asset");
                                faFixedAssetClassId = (_76 = assetRecord.data.fixedAssetClassId) !== null && _76 !== void 0 ? _76 : null;
                                journalLineReference = (0, mod_ts_2.nanoid)();
                                journalLineInserts_1.push({
                                    accountId: assetRecord.data.fixedAssetClass
                                        .assetAccountId,
                                    description: "Fixed Asset Acquisition",
                                    amount: (0, utils_ts_1.debit)("asset", totalLineCostWithWeightedShipping),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_77 = purchaseInvoice_1.data) === null || _77 === void 0 ? void 0 : _77.id,
                                    externalDocumentId: (_78 = purchaseInvoice_1.data) === null || _78 === void 0 ? void 0 : _78.supplierReference,
                                    documentLineReference: invoiceLine.purchaseOrderLineId
                                        ? utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId)
                                        : null,
                                    journalLineReference: journalLineReference,
                                    companyId: companyId_1,
                                });
                                journalLineInserts_1.push({
                                    accountId: accountDefaults.data.payablesAccount,
                                    description: "Accounts Payable",
                                    amount: (0, utils_ts_1.credit)("liability", totalLineCostWithWeightedShipping),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_79 = purchaseInvoice_1.data) === null || _79 === void 0 ? void 0 : _79.id,
                                    externalDocumentId: (_80 = purchaseInvoice_1.data) === null || _80 === void 0 ? void 0 : _80.supplierReference,
                                    documentLineReference: invoiceLine.purchaseOrderLineId
                                        ? utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId)
                                        : null,
                                    journalLineReference: journalLineReference,
                                    companyId: companyId_1,
                                });
                                updateData = {
                                    acquisitionCost: ((_81 = Number(assetRecord.data.acquisitionCost)) !== null && _81 !== void 0 ? _81 : 0) +
                                        totalLineCostWithWeightedShipping,
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
                                if (invoiceLine.locationId) {
                                    updateData.locationId = invoiceLine.locationId;
                                }
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .update(updateData)
                                        .eq("id", invoiceLine.assetId)];
                            case 9:
                                _96.sent();
                                _96.label = 10;
                            case 10:
                                faJlCount = journalLineInserts_1.length - jlStartIdxFa;
                                assetDimMeta = {
                                    supplierTypeId: (_82 = supplier.data.supplierTypeId) !== null && _82 !== void 0 ? _82 : null,
                                    itemPostingGroupId: null,
                                    locationId: (_84 = (_83 = invoiceLine.locationId) !== null && _83 !== void 0 ? _83 : purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.locationId) !== null && _84 !== void 0 ? _84 : faLocationId,
                                    costCenterId: null,
                                    processId: null,
                                    fixedAssetClassId: faFixedAssetClassId,
                                };
                                for (i = 0; i < faJlCount; i++) {
                                    journalLineDimensionsMeta_1.push(assetDimMeta);
                                }
                                _96.label = 11;
                            case 11: return [3 /*break*/, 17];
                            case 12: return [3 /*break*/, 17];
                            case 13:
                                if (!(accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) return [3 /*break*/, 15];
                                return [4 /*yield*/, client
                                        .from("account")
                                        .select("id, name, isGroup")
                                        .eq("id", (_85 = invoiceLine.accountId) !== null && _85 !== void 0 ? _85 : "")
                                        .single()];
                            case 14:
                                account = _96.sent();
                                if (account.error || !account.data)
                                    throw new Error("Failed to fetch account");
                                if (account.data.isGroup)
                                    throw new Error("Cannot post to a group account");
                                journalLineReference = (0, mod_ts_2.nanoid)();
                                journalLineInserts_1.push({
                                    accountId: account.data.id,
                                    description: account.data.name,
                                    amount: (0, utils_ts_1.debit)("asset", totalLineCostWithWeightedShipping),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_86 = purchaseInvoice_1.data) === null || _86 === void 0 ? void 0 : _86.id,
                                    externalDocumentId: (_87 = purchaseInvoice_1.data) === null || _87 === void 0 ? void 0 : _87.supplierReference,
                                    documentLineReference: invoiceLine.purchaseOrderLineId
                                        ? utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId)
                                        : null,
                                    journalLineReference: journalLineReference,
                                    companyId: companyId_1,
                                });
                                journalLineInserts_1.push({
                                    accountId: accountDefaults.data.payablesAccount,
                                    description: "Accounts Payable",
                                    amount: (0, utils_ts_1.credit)("liability", totalLineCostWithWeightedShipping),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_88 = purchaseInvoice_1.data) === null || _88 === void 0 ? void 0 : _88.id,
                                    externalDocumentId: (_89 = purchaseInvoice_1.data) === null || _89 === void 0 ? void 0 : _89.supplierReference,
                                    documentLineReference: invoiceLine.purchaseOrderLineId
                                        ? utils_ts_1.journalReference.to.purchaseInvoice(invoiceLine.purchaseOrderLineId)
                                        : null,
                                    journalLineReference: journalLineReference,
                                    companyId: companyId_1,
                                });
                                glDimMeta = {
                                    supplierTypeId: null,
                                    itemPostingGroupId: null,
                                    locationId: (_90 = invoiceLine.locationId) !== null && _90 !== void 0 ? _90 : null,
                                    costCenterId: (_91 = invoiceLine.costCenterId) !== null && _91 !== void 0 ? _91 : null,
                                    processId: null,
                                    fixedAssetClassId: null,
                                };
                                journalLineDimensionsMeta_1.push(glDimMeta, glDimMeta);
                                _96.label = 15;
                            case 15: return [3 /*break*/, 17];
                            case 16: throw new Error("Unsupported invoice line type");
                            case 17: return [2 /*return*/];
                        }
                    });
                };
                _p = true, _q = __asyncValues(purchaseInvoiceLines.data);
                _92.label = 29;
            case 29: return [4 /*yield*/, _q.next()];
            case 30:
                if (!(_r = _92.sent(), _t = _r.done, !_t)) return [3 /*break*/, 33];
                return [5 /*yield**/, _loop_2()];
            case 31:
                _92.sent();
                _92.label = 32;
            case 32:
                _p = true;
                return [3 /*break*/, 29];
            case 33: return [3 /*break*/, 40];
            case 34:
                e_1_1 = _92.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 40];
            case 35:
                _92.trys.push([35, , 38, 39]);
                if (!(!_p && !_t && (_u = _q.return))) return [3 /*break*/, 37];
                return [4 /*yield*/, _u.call(_q)];
            case 36:
                _92.sent();
                _92.label = 37;
            case 37: return [3 /*break*/, 39];
            case 38:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 39: return [7 /*endfinally*/];
            case 40:
                if (!accountingEnabled_1) return [3 /*break*/, 42];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 41:
                _s = _92.sent();
                return [3 /*break*/, 43];
            case 42:
                _s = null;
                _92.label = 43;
            case 43:
                accountingPeriodId_1 = _s;
                createdReceiptIds_1 = [];
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var receiptLinesGroupedByLocationId, _loop_3, _a, _b, _c, e_4_1, _d, _e, _f, purchaseOrderLineId, update, e_5_1, purchaseOrdersUpdated, _g, purchaseOrdersUpdated_1, purchaseOrdersUpdated_1_1, purchaseOrderId, purchaseOrderLines_1, areAllLinesInvoiced, areAllLinesReceived, status_3, e_6_1, journalEntryId, journal, journalId_2, journalLineResults, journalLineDimensionInserts_1;
                        var _h, e_4, _j, _k, _l, e_5, _m, _o, _p, e_6, _q, _r;
                        var _s;
                        return __generator(this, function (_t) {
                            switch (_t.label) {
                                case 0:
                                    if (!(receiptLineInserts_1.length > 0)) return [3 /*break*/, 13];
                                    receiptLinesGroupedByLocationId = receiptLineInserts_1.reduce(function (acc, line) {
                                        if (line.locationId) {
                                            if (line.locationId in acc) {
                                                acc[line.locationId].push(line);
                                            }
                                            else {
                                                acc[line.locationId] = [line];
                                            }
                                        }
                                        return acc;
                                    }, {});
                                    _t.label = 1;
                                case 1:
                                    _t.trys.push([1, 7, 8, 13]);
                                    _loop_3 = function () {
                                        var locationId, receiptLines, readableReceiptId, receipt, receiptId;
                                        return __generator(this, function (_u) {
                                            switch (_u.label) {
                                                case 0:
                                                    _k = _c.value;
                                                    _a = false;
                                                    locationId = _k[0], receiptLines = _k[1];
                                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "receipt", companyId_1)];
                                                case 1:
                                                    readableReceiptId = _u.sent();
                                                    return [4 /*yield*/, trx
                                                            .insertInto("receipt")
                                                            .values({
                                                            receiptId: readableReceiptId,
                                                            locationId: locationId,
                                                            sourceDocument: "Purchase Invoice",
                                                            sourceDocumentId: purchaseInvoice_1.data.id,
                                                            sourceDocumentReadableId: purchaseInvoice_1.data.invoiceId,
                                                            externalDocumentId: purchaseInvoice_1.data.supplierReference,
                                                            supplierId: purchaseInvoice_1.data.supplierId,
                                                            status: skipReceiptPost_1 ? "Draft" : "Posted",
                                                            postingDate: skipReceiptPost_1 ? null : today,
                                                            postedBy: skipReceiptPost_1 ? null : userId_1,
                                                            invoiced: true,
                                                            companyId: companyId_1,
                                                            createdBy: purchaseInvoice_1.data.createdBy,
                                                        })
                                                            .returning(["id"])
                                                            .execute()];
                                                case 2:
                                                    receipt = _u.sent();
                                                    receiptId = receipt[0].id;
                                                    if (!receiptId)
                                                        throw new Error("Failed to insert receipt");
                                                    createdReceiptIds_1.push(receiptId);
                                                    return [4 /*yield*/, trx
                                                            .insertInto("receiptLine")
                                                            .values(receiptLines.map(function (r) { return (__assign(__assign({}, r), { receiptId: receiptId })); }))
                                                            .returning(["id"])
                                                            .execute()];
                                                case 3:
                                                    _u.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues(Object.entries(receiptLinesGroupedByLocationId));
                                    _t.label = 2;
                                case 2: return [4 /*yield*/, _b.next()];
                                case 3:
                                    if (!(_c = _t.sent(), _h = _c.done, !_h)) return [3 /*break*/, 6];
                                    return [5 /*yield**/, _loop_3()];
                                case 4:
                                    _t.sent();
                                    _t.label = 5;
                                case 5:
                                    _a = true;
                                    return [3 /*break*/, 2];
                                case 6: return [3 /*break*/, 13];
                                case 7:
                                    e_4_1 = _t.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 13];
                                case 8:
                                    _t.trys.push([8, , 11, 12]);
                                    if (!(!_a && !_h && (_j = _b.return))) return [3 /*break*/, 10];
                                    return [4 /*yield*/, _j.call(_b)];
                                case 9:
                                    _t.sent();
                                    _t.label = 10;
                                case 10: return [3 /*break*/, 12];
                                case 11:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 12: return [7 /*endfinally*/];
                                case 13:
                                    _t.trys.push([13, 19, 20, 25]);
                                    _d = true, _e = __asyncValues(Object.entries(purchaseOrderLineUpdates_1));
                                    _t.label = 14;
                                case 14: return [4 /*yield*/, _e.next()];
                                case 15:
                                    if (!(_f = _t.sent(), _l = _f.done, !_l)) return [3 /*break*/, 18];
                                    _o = _f.value;
                                    _d = false;
                                    purchaseOrderLineId = _o[0], update = _o[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrderLine")
                                            .set(update)
                                            .where("id", "=", purchaseOrderLineId)
                                            .execute()];
                                case 16:
                                    _t.sent();
                                    _t.label = 17;
                                case 17:
                                    _d = true;
                                    return [3 /*break*/, 14];
                                case 18: return [3 /*break*/, 25];
                                case 19:
                                    e_5_1 = _t.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 25];
                                case 20:
                                    _t.trys.push([20, , 23, 24]);
                                    if (!(!_d && !_l && (_m = _e.return))) return [3 /*break*/, 22];
                                    return [4 /*yield*/, _m.call(_e)];
                                case 21:
                                    _t.sent();
                                    _t.label = 22;
                                case 22: return [3 /*break*/, 24];
                                case 23:
                                    if (e_5) throw e_5.error;
                                    return [7 /*endfinally*/];
                                case 24: return [7 /*endfinally*/];
                                case 25:
                                    purchaseOrdersUpdated = Object.values(purchaseOrderLineUpdates_1).reduce(function (acc, update) {
                                        if (update.purchaseOrderId && !acc.includes(update.purchaseOrderId)) {
                                            acc.push(update.purchaseOrderId);
                                        }
                                        return acc;
                                    }, []);
                                    _t.label = 26;
                                case 26:
                                    _t.trys.push([26, 33, 34, 39]);
                                    _g = true, purchaseOrdersUpdated_1 = __asyncValues(purchaseOrdersUpdated);
                                    _t.label = 27;
                                case 27: return [4 /*yield*/, purchaseOrdersUpdated_1.next()];
                                case 28:
                                    if (!(purchaseOrdersUpdated_1_1 = _t.sent(), _p = purchaseOrdersUpdated_1_1.done, !_p)) return [3 /*break*/, 32];
                                    _r = purchaseOrdersUpdated_1_1.value;
                                    _g = false;
                                    purchaseOrderId = _r;
                                    return [4 /*yield*/, trx
                                            .selectFrom("purchaseOrderLine")
                                            .select([
                                            "id",
                                            "purchaseOrderLineType",
                                            "invoicedComplete",
                                            "receivedComplete",
                                        ])
                                            .where("purchaseOrderId", "=", purchaseOrderId)
                                            .execute()];
                                case 29:
                                    purchaseOrderLines_1 = _t.sent();
                                    areAllLinesInvoiced = purchaseOrderLines_1.every(function (line) {
                                        return line.purchaseOrderLineType === "Comment" || line.invoicedComplete;
                                    });
                                    areAllLinesReceived = purchaseOrderLines_1.every(function (line) {
                                        return line.purchaseOrderLineType === "Comment" ||
                                            line.purchaseOrderLineType === "G/L Account" ||
                                            line.receivedComplete;
                                    });
                                    status_3 = "To Receive and Invoice";
                                    if (areAllLinesInvoiced && areAllLinesReceived) {
                                        status_3 = "Completed";
                                    }
                                    else if (areAllLinesInvoiced) {
                                        status_3 = "To Receive";
                                    }
                                    else if (areAllLinesReceived) {
                                        status_3 = "To Invoice";
                                    }
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrder")
                                            .set({
                                            status: status_3,
                                        })
                                            .where("id", "=", purchaseOrderId)
                                            .execute()];
                                case 30:
                                    _t.sent();
                                    _t.label = 31;
                                case 31:
                                    _g = true;
                                    return [3 /*break*/, 27];
                                case 32: return [3 /*break*/, 39];
                                case 33:
                                    e_6_1 = _t.sent();
                                    e_6 = { error: e_6_1 };
                                    return [3 /*break*/, 39];
                                case 34:
                                    _t.trys.push([34, , 37, 38]);
                                    if (!(!_g && !_p && (_q = purchaseOrdersUpdated_1.return))) return [3 /*break*/, 36];
                                    return [4 /*yield*/, _q.call(purchaseOrdersUpdated_1)];
                                case 35:
                                    _t.sent();
                                    _t.label = 36;
                                case 36: return [3 /*break*/, 38];
                                case 37:
                                    if (e_6) throw e_6.error;
                                    return [7 /*endfinally*/];
                                case 38: return [7 /*endfinally*/];
                                case 39:
                                    if (!(accountingEnabled_1 && journalLineInserts_1.length > 0)) return [3 /*break*/, 44];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 40:
                                    journalEntryId = _t.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            accountingPeriodId: accountingPeriodId_1,
                                            description: "Purchase Invoice ".concat((_s = purchaseInvoice_1.data) === null || _s === void 0 ? void 0 : _s.invoiceId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Purchase Invoice",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 41:
                                    journal = _t.sent();
                                    journalId_2 = journal[0].id;
                                    if (!journalId_2)
                                        throw new Error("Failed to insert journal");
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts_1.map(function (journalLine) { return (__assign(__assign({}, journalLine), { journalId: journalId_2 })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 42:
                                    journalLineResults = _t.sent();
                                    if (!(dimensionMap_1.size > 0)) return [3 /*break*/, 44];
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
                                        if (meta.costCenterId && dimensionMap_1.has("CostCenter")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("CostCenter"),
                                                valueId: meta.costCenterId,
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
                                    if (!(journalLineDimensionInserts_1.length > 0)) return [3 /*break*/, 44];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLineDimension")
                                            .values(journalLineDimensionInserts_1)
                                            .execute()];
                                case 43:
                                    _t.sent();
                                    _t.label = 44;
                                case 44:
                                    if (!(itemLedgerInserts_1.length > 0)) return [3 /*break*/, 46];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_1)
                                            .returning(["id"])
                                            .execute()];
                                case 45:
                                    _t.sent();
                                    _t.label = 46;
                                case 46:
                                    if (!(costLedgerInserts_1.length > 0)) return [3 /*break*/, 48];
                                    return [4 /*yield*/, trx
                                            .insertInto("costLedger")
                                            .values(costLedgerInserts_1)
                                            .returning(["id"])
                                            .execute()];
                                case 47:
                                    _t.sent();
                                    _t.label = 48;
                                case 48: return [4 /*yield*/, trx
                                        .updateTable("purchaseInvoice")
                                        .set({
                                        datePaid: today, // TODO: remove this once we have payments working
                                        postingDate: today,
                                        status: "Open",
                                    })
                                        .where("id", "=", invoiceId_1)
                                        .execute()];
                                case 49:
                                    _t.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 44:
                _92.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        receiptIds: createdReceiptIds_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 45:
                err_1 = _92.sent();
                console.error(err_1);
                if (!(payload.type !== "void" && "invoiceId" in payload)) return [3 /*break*/, 48];
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, payload.companyId, payload.userId, { update: "invoicing" })];
            case 46:
                client = _92.sent();
                return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .update({ status: "Draft" })
                        .eq("id", payload.invoiceId)];
            case 47:
                _92.sent();
                _92.label = 48;
            case 48: return [2 /*return*/, new Response(JSON.stringify(err_1), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 500,
                })];
            case 49: return [2 /*return*/];
        }
    });
}); });
