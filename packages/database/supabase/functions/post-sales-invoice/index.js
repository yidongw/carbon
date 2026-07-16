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
var calculate_cogs_ts_1 = require("../shared/calculate-cogs.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.default.object({
    type: npm_zod__3_24_1_1.default.enum(["post", "void"]).default("post"),
    invoiceId: npm_zod__3_24_1_1.default.string(),
    userId: npm_zod__3_24_1_1.default.string(),
    companyId: npm_zod__3_24_1_1.default.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, _a, type, invoiceId_1, userId_1, companyId_1, client, _b, companyRecord, accountingSettings, companyGroupId_1, accountingEnabled_1, _c, salesInvoice_1, salesInvoiceLines_1, salesInvoiceShipment_1, shippingCost, salesOrderLineIds, salesOrderLines, _d, totalLinesCost_1, itemIds, _e, items_1, itemCosts, customer, isIntercompany_1, intercompanyPartnerId_1, salesOrders, journalLineInserts_1, shipmentLineInserts_1, itemLedgerInserts_1, salesInvoiceLinesBySalesOrderLine_1, salesOrderLineUpdates_1, accountDefaults, _f, dimensions, _g, dimensionMap_1, _i, _h, dim, journalLineDimensionsMeta_1, receivablesAccountId, icAccount, _loop_1, _j, _k, _l, e_1_1, accountingPeriodId_1, _m, journalEntries, invoiceShipments_1, salesOrderLinesBySalesOrderLineId_1, salesOrderLineUpdates_2, reversingJournalEntries_1, reversingItemLedgerEntries_1, originalItemLedgerEntries, accountingPeriodId_2, _o, err_1, client;
    var _p, e_1, _q, _r;
    var _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90;
    return __generator(this, function (_91) {
        switch (_91.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _91.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _91.label = 2;
            case 2:
                _91.trys.push([2, 44, , 48]);
                _a = payloadValidator.parse(payload), type = _a.type, invoiceId_1 = _a.invoiceId, userId_1 = _a.userId, companyId_1 = _a.companyId;
                console.log({
                    function: "post-sales-invoice",
                    type: type,
                    invoiceId: invoiceId_1,
                    userId: userId_1,
                    companyId: companyId_1,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "invoicing" })];
            case 3:
                client = _91.sent();
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
                _b = _91.sent(), companyRecord = _b[0], accountingSettings = _b[1];
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                companyGroupId_1 = companyRecord.data.companyGroupId;
                accountingEnabled_1 = (_t = (_s = accountingSettings.data) === null || _s === void 0 ? void 0 : _s.accountingEnabled) !== null && _t !== void 0 ? _t : false;
                return [4 /*yield*/, Promise.all([
                        client.from("salesInvoice").select("*").eq("id", invoiceId_1).single(),
                        client.from("salesInvoiceLine").select("*").eq("invoiceId", invoiceId_1),
                        client
                            .from("salesInvoiceShipment")
                            .select("shippingCost, shippingMethodId")
                            .eq("id", invoiceId_1)
                            .single(),
                    ])];
            case 5:
                _c = _91.sent(), salesInvoice_1 = _c[0], salesInvoiceLines_1 = _c[1], salesInvoiceShipment_1 = _c[2];
                if (salesInvoice_1.error)
                    throw new Error("Failed to fetch salesInvoice");
                if (salesInvoiceLines_1.error)
                    throw new Error("Failed to fetch shipment lines");
                if (salesInvoiceShipment_1.error)
                    throw new Error("Failed to fetch sales invoice shipment");
                shippingCost = (_v = (_u = salesInvoiceShipment_1.data) === null || _u === void 0 ? void 0 : _u.shippingCost) !== null && _v !== void 0 ? _v : 0;
                salesOrderLineIds = salesInvoiceLines_1.data.reduce(function (acc, invoiceLine) {
                    if (invoiceLine.salesOrderLineId &&
                        !acc.includes(invoiceLine.salesOrderLineId)) {
                        acc.push(invoiceLine.salesOrderLineId);
                    }
                    return acc;
                }, []);
                return [4 /*yield*/, client
                        .from("salesOrderLine")
                        .select("*")
                        .in("id", salesOrderLineIds)];
            case 6:
                salesOrderLines = (_91.sent()).data;
                if (!salesOrderLines) {
                    throw new Error("Failed to fetch sales order lines");
                }
                _d = type;
                switch (_d) {
                    case "post": return [3 /*break*/, 7];
                    case "void": return [3 /*break*/, 35];
                }
                return [3 /*break*/, 43];
            case 7:
                totalLinesCost_1 = salesInvoiceLines_1.data.reduce(function (acc, invoiceLine) {
                    var _a, _b, _c, _d;
                    var lineCost = ((_a = invoiceLine.quantity) !== null && _a !== void 0 ? _a : 0) * ((_b = invoiceLine.unitPrice) !== null && _b !== void 0 ? _b : 0) +
                        ((_c = invoiceLine.shippingCost) !== null && _c !== void 0 ? _c : 0) +
                        ((_d = invoiceLine.addOnCost) !== null && _d !== void 0 ? _d : 0);
                    return acc + lineCost;
                }, 0);
                itemIds = salesInvoiceLines_1.data.reduce(function (acc, invoiceLine) {
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
                            .select("itemId, itemPostingGroupId, costingMethod")
                            .in("itemId", itemIds),
                        client
                            .from("customer")
                            .select("*")
                            .eq("id", (_w = salesInvoice_1.data.customerId) !== null && _w !== void 0 ? _w : "")
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 8:
                _e = _91.sent(), items_1 = _e[0], itemCosts = _e[1], customer = _e[2];
                if (items_1.error)
                    throw new Error("Failed to fetch items");
                if (itemCosts.error)
                    throw new Error("Failed to fetch item costs");
                if (customer.error)
                    throw new Error("Failed to fetch customer");
                isIntercompany_1 = customer.data.intercompanyCompanyId != null;
                intercompanyPartnerId_1 = isIntercompany_1
                    ? customer.data.intercompanyCompanyId
                    : null;
                return [4 /*yield*/, client
                        .from("salesOrder")
                        .select("*")
                        .in("salesOrderId", salesOrderLines.reduce(function (acc, salesOrderLine) {
                        if (salesOrderLine.salesOrderId &&
                            !acc.includes(salesOrderLine.salesOrderId)) {
                            acc.push(salesOrderLine.salesOrderId);
                        }
                        return acc;
                    }, []))
                        .eq("companyId", companyId_1)];
            case 9:
                salesOrders = _91.sent();
                if (salesOrders.error)
                    throw new Error("Failed to fetch sales orders");
                journalLineInserts_1 = [];
                shipmentLineInserts_1 = [];
                itemLedgerInserts_1 = [];
                salesInvoiceLinesBySalesOrderLine_1 = salesInvoiceLines_1.data.reduce(function (acc, invoiceLine) {
                    if (invoiceLine.salesOrderLineId) {
                        acc[invoiceLine.salesOrderLineId] = invoiceLine;
                    }
                    return acc;
                }, {});
                salesOrderLineUpdates_1 = salesOrderLines.reduce(function (acc, salesOrderLine) {
                    var _a;
                    var _b, _c;
                    var invoiceLine = salesInvoiceLinesBySalesOrderLine_1[salesOrderLine.id];
                    if (invoiceLine &&
                        invoiceLine.quantity &&
                        salesOrderLine.saleQuantity &&
                        salesOrderLine.saleQuantity > 0) {
                        var newQuantityInvoiced = ((_b = salesOrderLine.quantityInvoiced) !== null && _b !== void 0 ? _b : 0) + invoiceLine.quantity;
                        var invoicedComplete = newQuantityInvoiced >=
                            ((_c = salesOrderLine.quantityToInvoice) !== null && _c !== void 0 ? _c : salesOrderLine.saleQuantity);
                        return __assign(__assign({}, acc), (_a = {}, _a[salesOrderLine.id] = {
                            quantityInvoiced: newQuantityInvoiced,
                            invoicedComplete: invoicedComplete,
                            salesOrderId: salesOrderLine.salesOrderId,
                        }, _a));
                    }
                    return acc;
                }, {});
                if (!accountingEnabled_1) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client, companyId_1)];
            case 10:
                _f = _91.sent();
                return [3 /*break*/, 12];
            case 11:
                _f = null;
                _91.label = 12;
            case 12:
                accountDefaults = _f;
                if (accountingEnabled_1 && ((accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.error) || !(accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabled_1) return [3 /*break*/, 14];
                return [4 /*yield*/, client
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyGroupId_1)
                        .eq("active", true)
                        .in("entityType", [
                        "CustomerType",
                        "ItemPostingGroup",
                        "Location",
                        "CostCenter",
                        "FixedAssetClass",
                    ])];
            case 13:
                _g = _91.sent();
                return [3 /*break*/, 15];
            case 14:
                _g = null;
                _91.label = 15;
            case 15:
                dimensions = _g;
                dimensionMap_1 = new Map();
                if (dimensions === null || dimensions === void 0 ? void 0 : dimensions.data) {
                    for (_i = 0, _h = dimensions.data; _i < _h.length; _i++) {
                        dim = _h[_i];
                        if (dim.entityType)
                            dimensionMap_1.set(dim.entityType, dim.id);
                    }
                }
                journalLineDimensionsMeta_1 = [];
                receivablesAccountId = void 0;
                if (!(isIntercompany_1 && companyGroupId_1)) return [3 /*break*/, 17];
                return [4 /*yield*/, client
                        .from("account")
                        .select("id")
                        .eq("number", "1130")
                        .eq("companyGroupId", companyGroupId_1)
                        .single()];
            case 16:
                icAccount = _91.sent();
                if (icAccount.error)
                    throw new Error("Failed to fetch IC receivables account 1130");
                receivablesAccountId = icAccount.data.id;
                return [3 /*break*/, 18];
            case 17:
                receivablesAccountId = (_x = accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) === null || _x === void 0 ? void 0 : _x.receivablesAccount;
                _91.label = 18;
            case 18:
                _91.trys.push([18, 24, 25, 30]);
                _loop_1 = function () {
                    var invoiceLine, invoiceLineQuantityInInventoryUnit, totalLineCost, lineCostPercentageOfTotalCost, lineWeightedShippingCost, totalLineCostWithWeightedShipping, invoiceLineUnitCostInInventoryUnit, journalLineReference, _92, itemTrackingType, lineItemPostingGroupId, i, cogsJournalLineReference, i, itemPostingGroupId, i, salesOrderLine, wasShipped, saleProceeds, assetRecord, writeOffAccountId, arJournalLineReference, i, disposal, nbv, assetRecord, assetClass, acquisitionCost, accumulatedDepreciation, nbv, nbvJournalLineReference, removeJournalLineReference, arJournalLineReference, i;
                    return __generator(this, function (_93) {
                        switch (_93.label) {
                            case 0:
                                _r = _l.value;
                                _j = false;
                                invoiceLine = _r;
                                invoiceLineQuantityInInventoryUnit = invoiceLine.quantity;
                                totalLineCost = (invoiceLine.quantity * ((_y = invoiceLine.unitPrice) !== null && _y !== void 0 ? _y : 0) +
                                    ((_z = invoiceLine.shippingCost) !== null && _z !== void 0 ? _z : 0) +
                                    ((_0 = invoiceLine.addOnCost) !== null && _0 !== void 0 ? _0 : 0)) *
                                    (1 + ((_1 = invoiceLine.taxPercent) !== null && _1 !== void 0 ? _1 : 0));
                                lineCostPercentageOfTotalCost = totalLinesCost_1 === 0 ? 0 : totalLineCost / totalLinesCost_1;
                                lineWeightedShippingCost = shippingCost * lineCostPercentageOfTotalCost;
                                totalLineCostWithWeightedShipping = totalLineCost + lineWeightedShippingCost;
                                invoiceLineUnitCostInInventoryUnit = totalLineCostWithWeightedShipping / invoiceLine.quantity;
                                journalLineReference = void 0;
                                _92 = invoiceLine.invoiceLineType;
                                switch (_92) {
                                    case "Part": return [3 /*break*/, 1];
                                    case "Service": return [3 /*break*/, 1];
                                    case "Consumable": return [3 /*break*/, 1];
                                    case "Fixture": return [3 /*break*/, 1];
                                    case "Material": return [3 /*break*/, 1];
                                    case "Tool": return [3 /*break*/, 1];
                                    case "Fixed Asset": return [3 /*break*/, 2];
                                    case "Comment": return [3 /*break*/, 13];
                                }
                                return [3 /*break*/, 14];
                            case 1:
                                {
                                    itemTrackingType = (_3 = (_2 = items_1.data.find(function (item) { return item.id === invoiceLine.itemId; })) === null || _2 === void 0 ? void 0 : _2.itemTrackingType) !== null && _3 !== void 0 ? _3 : "Inventory";
                                    // if the sales order line is null, we ship the part, do the normal entries and do not use accrual/reversing
                                    if (invoiceLine.salesOrderLineId === null &&
                                        invoiceLine.methodType !== "Make to Order") {
                                        // create the shipment line
                                        shipmentLineInserts_1.push({
                                            itemId: invoiceLine.itemId,
                                            lineId: invoiceLine.id,
                                            orderQuantity: invoiceLineQuantityInInventoryUnit,
                                            outstandingQuantity: invoiceLineQuantityInInventoryUnit,
                                            shippedQuantity: invoiceLineQuantityInInventoryUnit,
                                            locationId: invoiceLine.locationId,
                                            storageUnitId: invoiceLine.storageUnitId,
                                            unitOfMeasure: (_4 = invoiceLine.unitOfMeasureCode) !== null && _4 !== void 0 ? _4 : "EA",
                                            unitPrice: (_5 = invoiceLine.unitPrice) !== null && _5 !== void 0 ? _5 : 0,
                                            createdBy: invoiceLine.createdBy,
                                            companyId: companyId_1,
                                        });
                                        if (itemTrackingType === "Inventory") {
                                            // create the part ledger line
                                            itemLedgerInserts_1.push({
                                                postingDate: today,
                                                itemId: invoiceLine.itemId,
                                                quantity: -invoiceLineQuantityInInventoryUnit,
                                                locationId: invoiceLine.locationId,
                                                storageUnitId: invoiceLine.storageUnitId,
                                                entryType: "Negative Adjmt.",
                                                documentType: "Sales Shipment",
                                                documentId: (_7 = (_6 = salesInvoice_1.data) === null || _6 === void 0 ? void 0 : _6.id) !== null && _7 !== void 0 ? _7 : undefined,
                                                externalDocumentId: (_9 = (_8 = salesInvoice_1.data) === null || _8 === void 0 ? void 0 : _8.customerReference) !== null && _9 !== void 0 ? _9 : undefined,
                                                createdBy: userId_1,
                                                companyId: companyId_1,
                                            });
                                        }
                                        // create the normal GL entries for a part
                                        if (accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data)) {
                                            lineItemPostingGroupId = (_11 = (_10 = itemCosts.data.find(function (cost) { return cost.itemId === invoiceLine.itemId; })) === null || _10 === void 0 ? void 0 : _10.itemPostingGroupId) !== null && _11 !== void 0 ? _11 : null;
                                            journalLineReference = (0, mod_ts_2.nanoid)();
                                            // credit the sales account
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.salesAccount,
                                                description: "Sales Account",
                                                amount: (0, utils_ts_1.credit)("revenue", totalLineCostWithWeightedShipping),
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                documentType: "Invoice",
                                                documentId: (_12 = salesInvoice_1.data) === null || _12 === void 0 ? void 0 : _12.id,
                                                externalDocumentId: (_13 = salesInvoice_1.data) === null || _13 === void 0 ? void 0 : _13.customerReference,
                                                documentLineReference: utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId),
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            // debit the accounts receivable account
                                            journalLineInserts_1.push({
                                                accountId: receivablesAccountId,
                                                description: isIntercompany_1
                                                    ? "IC Receivables"
                                                    : "Accounts Receivable",
                                                amount: (0, utils_ts_1.debit)("asset", totalLineCostWithWeightedShipping),
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                documentType: "Invoice",
                                                documentId: (_14 = salesInvoice_1.data) === null || _14 === void 0 ? void 0 : _14.id,
                                                externalDocumentId: (_15 = salesInvoice_1.data) === null || _15 === void 0 ? void 0 : _15.customerReference,
                                                documentLineReference: utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId),
                                                journalLineReference: journalLineReference,
                                                intercompanyPartnerId: intercompanyPartnerId_1,
                                                companyId: companyId_1,
                                            });
                                            for (i = 0; i < 2; i++) {
                                                journalLineDimensionsMeta_1.push({
                                                    customerTypeId: (_16 = customer.data.customerTypeId) !== null && _16 !== void 0 ? _16 : null,
                                                    itemPostingGroupId: lineItemPostingGroupId,
                                                    locationId: (_17 = invoiceLine.locationId) !== null && _17 !== void 0 ? _17 : null,
                                                    costCenterId: null,
                                                    fixedAssetClassId: null,
                                                });
                                            }
                                            if (itemTrackingType === "Inventory") {
                                                cogsJournalLineReference = (0, mod_ts_2.nanoid)();
                                                journalLineInserts_1.push({
                                                    accountId: accountDefaults.data.costOfGoodsSoldAccount,
                                                    description: "Cost of Goods Sold",
                                                    amount: 0,
                                                    quantity: invoiceLineQuantityInInventoryUnit,
                                                    documentType: "Invoice",
                                                    documentId: (_18 = salesInvoice_1.data) === null || _18 === void 0 ? void 0 : _18.id,
                                                    externalDocumentId: (_19 = salesInvoice_1.data) === null || _19 === void 0 ? void 0 : _19.customerReference,
                                                    journalLineReference: cogsJournalLineReference,
                                                    companyId: companyId_1,
                                                });
                                                journalLineInserts_1.push({
                                                    accountId: accountDefaults.data.inventoryAccount,
                                                    description: "Inventory Account",
                                                    amount: 0,
                                                    quantity: invoiceLineQuantityInInventoryUnit,
                                                    documentType: "Invoice",
                                                    documentId: (_20 = salesInvoice_1.data) === null || _20 === void 0 ? void 0 : _20.id,
                                                    externalDocumentId: (_21 = salesInvoice_1.data) === null || _21 === void 0 ? void 0 : _21.customerReference,
                                                    journalLineReference: cogsJournalLineReference,
                                                    companyId: companyId_1,
                                                });
                                                for (i = 0; i < 2; i++) {
                                                    journalLineDimensionsMeta_1.push({
                                                        customerTypeId: (_22 = customer.data.customerTypeId) !== null && _22 !== void 0 ? _22 : null,
                                                        itemPostingGroupId: lineItemPostingGroupId,
                                                        locationId: (_23 = invoiceLine.locationId) !== null && _23 !== void 0 ? _23 : null,
                                                        costCenterId: null,
                                                        fixedAssetClassId: null,
                                                    });
                                                }
                                            }
                                        }
                                    } // if the line is associated with a sales order line, COGS was posted at shipment — keep only AR + Revenue
                                    else {
                                        if (accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data)) {
                                            // Create the normal GL entries for the invoice
                                            journalLineReference = (0, mod_ts_2.nanoid)();
                                            // Credit the sales account
                                            journalLineInserts_1.push({
                                                accountId: accountDefaults.data.salesAccount,
                                                description: "Sales Account",
                                                amount: (0, utils_ts_1.credit)("revenue", totalLineCostWithWeightedShipping),
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                documentType: "Invoice",
                                                documentId: (_24 = salesInvoice_1.data) === null || _24 === void 0 ? void 0 : _24.id,
                                                externalDocumentId: (_25 = salesInvoice_1.data) === null || _25 === void 0 ? void 0 : _25.customerReference,
                                                documentLineReference: invoiceLine.salesOrderLineId
                                                    ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                                    : null,
                                                journalLineReference: journalLineReference,
                                                companyId: companyId_1,
                                            });
                                            // Debit the accounts receivable account
                                            journalLineInserts_1.push({
                                                accountId: receivablesAccountId,
                                                description: isIntercompany_1
                                                    ? "IC Receivables"
                                                    : "Accounts Receivable",
                                                amount: (0, utils_ts_1.debit)("asset", totalLineCostWithWeightedShipping),
                                                quantity: invoiceLineQuantityInInventoryUnit,
                                                documentType: "Invoice",
                                                documentId: (_26 = salesInvoice_1.data) === null || _26 === void 0 ? void 0 : _26.id,
                                                externalDocumentId: (_27 = salesInvoice_1.data) === null || _27 === void 0 ? void 0 : _27.customerReference,
                                                documentLineReference: invoiceLine.salesOrderLineId
                                                    ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                                    : null,
                                                journalLineReference: journalLineReference,
                                                intercompanyPartnerId: intercompanyPartnerId_1,
                                                companyId: companyId_1,
                                            });
                                            itemPostingGroupId = (_29 = (_28 = itemCosts.data.find(function (cost) { return cost.itemId === invoiceLine.itemId; })) === null || _28 === void 0 ? void 0 : _28.itemPostingGroupId) !== null && _29 !== void 0 ? _29 : null;
                                            for (i = 0; i < 2; i++) {
                                                journalLineDimensionsMeta_1.push({
                                                    customerTypeId: (_30 = customer.data.customerTypeId) !== null && _30 !== void 0 ? _30 : null,
                                                    itemPostingGroupId: itemPostingGroupId,
                                                    locationId: (_31 = invoiceLine.locationId) !== null && _31 !== void 0 ? _31 : null,
                                                    costCenterId: null,
                                                    fixedAssetClassId: null,
                                                });
                                            }
                                        }
                                    }
                                }
                                return [3 /*break*/, 15];
                            case 2:
                                if (!(accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) && invoiceLine.assetId)) return [3 /*break*/, 12];
                                salesOrderLine = salesOrderLines === null || salesOrderLines === void 0 ? void 0 : salesOrderLines.find(function (sol) { return sol.id === invoiceLine.salesOrderLineId; });
                                wasShipped = (salesOrderLine === null || salesOrderLine === void 0 ? void 0 : salesOrderLine.sentComplete) === true;
                                saleProceeds = totalLineCostWithWeightedShipping;
                                if (!(wasShipped && invoiceLine.salesOrderLineId)) return [3 /*break*/, 8];
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .select("locationId, fixedAssetClassId, fixedAssetClass:fixedAssetClassId(writeOffAccountId)")
                                        .eq("id", invoiceLine.assetId)
                                        .single()];
                            case 3:
                                assetRecord = _93.sent();
                                if (assetRecord.error)
                                    throw new Error("Failed to fetch fixed asset");
                                writeOffAccountId = assetRecord.data.fixedAssetClass.writeOffAccountId;
                                arJournalLineReference = (0, mod_ts_2.nanoid)();
                                journalLineInserts_1.push({
                                    accountId: receivablesAccountId,
                                    description: "Accounts Receivable",
                                    amount: (0, utils_ts_1.debit)("asset", saleProceeds),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_33 = (_32 = salesInvoice_1.data) === null || _32 === void 0 ? void 0 : _32.id) !== null && _33 !== void 0 ? _33 : undefined,
                                    externalDocumentId: (_35 = (_34 = salesInvoice_1.data) === null || _34 === void 0 ? void 0 : _34.customerReference) !== null && _35 !== void 0 ? _35 : undefined,
                                    documentLineReference: utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId),
                                    journalLineReference: arJournalLineReference,
                                    intercompanyPartnerId: intercompanyPartnerId_1,
                                    companyId: companyId_1,
                                });
                                journalLineInserts_1.push({
                                    accountId: writeOffAccountId,
                                    description: "Disposal proceeds",
                                    amount: (0, utils_ts_1.credit)("expense", saleProceeds),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_37 = (_36 = salesInvoice_1.data) === null || _36 === void 0 ? void 0 : _36.id) !== null && _37 !== void 0 ? _37 : undefined,
                                    externalDocumentId: (_39 = (_38 = salesInvoice_1.data) === null || _38 === void 0 ? void 0 : _38.customerReference) !== null && _39 !== void 0 ? _39 : undefined,
                                    documentLineReference: utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId),
                                    journalLineReference: arJournalLineReference,
                                    intercompanyPartnerId: intercompanyPartnerId_1,
                                    companyId: companyId_1,
                                });
                                for (i = 0; i < 2; i++) {
                                    journalLineDimensionsMeta_1.push({
                                        customerTypeId: (_40 = customer.data.customerTypeId) !== null && _40 !== void 0 ? _40 : null,
                                        itemPostingGroupId: null,
                                        locationId: (_43 = (_42 = (_41 = invoiceLine.locationId) !== null && _41 !== void 0 ? _41 : salesOrderLine === null || salesOrderLine === void 0 ? void 0 : salesOrderLine.locationId) !== null && _42 !== void 0 ? _42 : assetRecord.data.locationId) !== null && _43 !== void 0 ? _43 : null,
                                        costCenterId: null,
                                        fixedAssetClassId: (_45 = (_44 = assetRecord.data.fixedAssetClass) === null || _44 === void 0 ? void 0 : _44.id) !== null && _45 !== void 0 ? _45 : null,
                                    });
                                }
                                return [4 /*yield*/, client
                                        .from("fixedAssetDisposal")
                                        .select("id, netBookValueAtDisposal")
                                        .eq("fixedAssetId", invoiceLine.assetId)
                                        .order("createdAt", { ascending: false })
                                        .limit(1)
                                        .single()];
                            case 4:
                                disposal = _93.sent();
                                if (!(!disposal.error && disposal.data)) return [3 /*break*/, 6];
                                nbv = Number(disposal.data.netBookValueAtDisposal);
                                return [4 /*yield*/, client
                                        .from("fixedAssetDisposal")
                                        .update({
                                        saleProceeds: saleProceeds,
                                        gainLoss: saleProceeds - nbv,
                                    })
                                        .eq("id", disposal.data.id)];
                            case 5:
                                _93.sent();
                                _93.label = 6;
                            case 6: return [4 /*yield*/, client
                                    .from("fixedAsset")
                                    .update({
                                    saleProceeds: saleProceeds,
                                    updatedBy: userId_1,
                                })
                                    .eq("id", invoiceLine.assetId)];
                            case 7:
                                _93.sent();
                                return [3 /*break*/, 12];
                            case 8: return [4 /*yield*/, client
                                    .from("fixedAsset")
                                    .select("id, status, acquisitionCost, accumulatedDepreciation, locationId, fixedAssetClass:fixedAssetClassId(id, assetAccountId, accumulatedDepreciationAccountId, writeOffAccountId)")
                                    .eq("id", invoiceLine.assetId)
                                    .single()];
                            case 9:
                                assetRecord = _93.sent();
                                if (assetRecord.error)
                                    throw new Error("Failed to fetch fixed asset for disposal");
                                assetClass = assetRecord.data.fixedAssetClass;
                                acquisitionCost = (_46 = Number(assetRecord.data.acquisitionCost)) !== null && _46 !== void 0 ? _46 : 0;
                                accumulatedDepreciation = (_47 = Number(assetRecord.data.accumulatedDepreciation)) !== null && _47 !== void 0 ? _47 : 0;
                                nbv = acquisitionCost - accumulatedDepreciation;
                                if (accumulatedDepreciation > 0) {
                                    journalLineReference = (0, mod_ts_2.nanoid)();
                                    journalLineInserts_1.push({
                                        accountId: assetClass.accumulatedDepreciationAccountId,
                                        description: "Clear accumulated depreciation",
                                        amount: (0, utils_ts_1.debit)("asset", accumulatedDepreciation),
                                        quantity: 1,
                                        documentType: "Invoice",
                                        documentId: (_49 = (_48 = salesInvoice_1.data) === null || _48 === void 0 ? void 0 : _48.id) !== null && _49 !== void 0 ? _49 : undefined,
                                        externalDocumentId: (_51 = (_50 = salesInvoice_1.data) === null || _50 === void 0 ? void 0 : _50.customerReference) !== null && _51 !== void 0 ? _51 : undefined,
                                        documentLineReference: invoiceLine.salesOrderLineId
                                            ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                            : null,
                                        journalLineReference: journalLineReference,
                                        companyId: companyId_1,
                                    });
                                    journalLineDimensionsMeta_1.push({
                                        customerTypeId: (_52 = customer.data.customerTypeId) !== null && _52 !== void 0 ? _52 : null,
                                        itemPostingGroupId: null,
                                        locationId: (_55 = (_54 = (_53 = invoiceLine.locationId) !== null && _53 !== void 0 ? _53 : salesOrderLine === null || salesOrderLine === void 0 ? void 0 : salesOrderLine.locationId) !== null && _54 !== void 0 ? _54 : assetRecord.data.locationId) !== null && _55 !== void 0 ? _55 : null,
                                        costCenterId: null,
                                        fixedAssetClassId: (_57 = (_56 = assetRecord.data.fixedAssetClass) === null || _56 === void 0 ? void 0 : _56.id) !== null && _57 !== void 0 ? _57 : null,
                                    });
                                }
                                if (nbv > 0) {
                                    nbvJournalLineReference = (0, mod_ts_2.nanoid)();
                                    journalLineInserts_1.push({
                                        accountId: assetClass.writeOffAccountId,
                                        description: "Write-off remaining book value",
                                        amount: (0, utils_ts_1.debit)("expense", nbv),
                                        quantity: 1,
                                        documentType: "Invoice",
                                        documentId: (_59 = (_58 = salesInvoice_1.data) === null || _58 === void 0 ? void 0 : _58.id) !== null && _59 !== void 0 ? _59 : undefined,
                                        externalDocumentId: (_61 = (_60 = salesInvoice_1.data) === null || _60 === void 0 ? void 0 : _60.customerReference) !== null && _61 !== void 0 ? _61 : undefined,
                                        documentLineReference: invoiceLine.salesOrderLineId
                                            ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                            : null,
                                        journalLineReference: nbvJournalLineReference,
                                        companyId: companyId_1,
                                    });
                                    journalLineDimensionsMeta_1.push({
                                        customerTypeId: (_62 = customer.data.customerTypeId) !== null && _62 !== void 0 ? _62 : null,
                                        itemPostingGroupId: null,
                                        locationId: (_65 = (_64 = (_63 = invoiceLine.locationId) !== null && _63 !== void 0 ? _63 : salesOrderLine === null || salesOrderLine === void 0 ? void 0 : salesOrderLine.locationId) !== null && _64 !== void 0 ? _64 : assetRecord.data.locationId) !== null && _65 !== void 0 ? _65 : null,
                                        costCenterId: null,
                                        fixedAssetClassId: (_67 = (_66 = assetRecord.data.fixedAssetClass) === null || _66 === void 0 ? void 0 : _66.id) !== null && _67 !== void 0 ? _67 : null,
                                    });
                                }
                                removeJournalLineReference = (0, mod_ts_2.nanoid)();
                                journalLineInserts_1.push({
                                    accountId: assetClass.assetAccountId,
                                    description: "Remove asset at cost",
                                    amount: (0, utils_ts_1.credit)("asset", acquisitionCost),
                                    quantity: 1,
                                    documentType: "Invoice",
                                    documentId: (_69 = (_68 = salesInvoice_1.data) === null || _68 === void 0 ? void 0 : _68.id) !== null && _69 !== void 0 ? _69 : undefined,
                                    externalDocumentId: (_71 = (_70 = salesInvoice_1.data) === null || _70 === void 0 ? void 0 : _70.customerReference) !== null && _71 !== void 0 ? _71 : undefined,
                                    documentLineReference: invoiceLine.salesOrderLineId
                                        ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                        : null,
                                    journalLineReference: removeJournalLineReference,
                                    companyId: companyId_1,
                                });
                                journalLineDimensionsMeta_1.push({
                                    customerTypeId: (_72 = customer.data.customerTypeId) !== null && _72 !== void 0 ? _72 : null,
                                    itemPostingGroupId: null,
                                    locationId: (_74 = (_73 = invoiceLine.locationId) !== null && _73 !== void 0 ? _73 : salesOrderLine === null || salesOrderLine === void 0 ? void 0 : salesOrderLine.locationId) !== null && _74 !== void 0 ? _74 : null,
                                    costCenterId: null,
                                    fixedAssetClassId: (_76 = (_75 = assetRecord.data.fixedAssetClass) === null || _75 === void 0 ? void 0 : _75.id) !== null && _76 !== void 0 ? _76 : null,
                                });
                                arJournalLineReference = (0, mod_ts_2.nanoid)();
                                journalLineInserts_1.push({
                                    accountId: receivablesAccountId,
                                    description: "Accounts Receivable",
                                    amount: (0, utils_ts_1.debit)("asset", saleProceeds),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_78 = (_77 = salesInvoice_1.data) === null || _77 === void 0 ? void 0 : _77.id) !== null && _78 !== void 0 ? _78 : undefined,
                                    externalDocumentId: (_80 = (_79 = salesInvoice_1.data) === null || _79 === void 0 ? void 0 : _79.customerReference) !== null && _80 !== void 0 ? _80 : undefined,
                                    documentLineReference: invoiceLine.salesOrderLineId
                                        ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                        : null,
                                    journalLineReference: arJournalLineReference,
                                    intercompanyPartnerId: intercompanyPartnerId_1,
                                    companyId: companyId_1,
                                });
                                journalLineInserts_1.push({
                                    accountId: assetClass.writeOffAccountId,
                                    description: "Disposal proceeds",
                                    amount: (0, utils_ts_1.credit)("expense", saleProceeds),
                                    quantity: invoiceLineQuantityInInventoryUnit,
                                    documentType: "Invoice",
                                    documentId: (_82 = (_81 = salesInvoice_1.data) === null || _81 === void 0 ? void 0 : _81.id) !== null && _82 !== void 0 ? _82 : undefined,
                                    externalDocumentId: (_84 = (_83 = salesInvoice_1.data) === null || _83 === void 0 ? void 0 : _83.customerReference) !== null && _84 !== void 0 ? _84 : undefined,
                                    documentLineReference: invoiceLine.salesOrderLineId
                                        ? utils_ts_1.journalReference.to.salesInvoice(invoiceLine.salesOrderLineId)
                                        : null,
                                    journalLineReference: arJournalLineReference,
                                    intercompanyPartnerId: intercompanyPartnerId_1,
                                    companyId: companyId_1,
                                });
                                for (i = 0; i < 2; i++) {
                                    journalLineDimensionsMeta_1.push({
                                        customerTypeId: (_85 = customer.data.customerTypeId) !== null && _85 !== void 0 ? _85 : null,
                                        itemPostingGroupId: null,
                                        locationId: (_88 = (_87 = (_86 = invoiceLine.locationId) !== null && _86 !== void 0 ? _86 : salesOrderLine === null || salesOrderLine === void 0 ? void 0 : salesOrderLine.locationId) !== null && _87 !== void 0 ? _87 : assetRecord.data.locationId) !== null && _88 !== void 0 ? _88 : null,
                                        costCenterId: null,
                                        fixedAssetClassId: (_90 = (_89 = assetRecord.data.fixedAssetClass) === null || _89 === void 0 ? void 0 : _89.id) !== null && _90 !== void 0 ? _90 : null,
                                    });
                                }
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .update({
                                        status: "Disposed",
                                        disposalDate: today,
                                        disposalMethod: "Sale",
                                        saleProceeds: saleProceeds,
                                        updatedBy: userId_1,
                                    })
                                        .eq("id", invoiceLine.assetId)];
                            case 10:
                                _93.sent();
                                return [4 /*yield*/, client.from("fixedAssetDisposal").insert({
                                        fixedAssetId: invoiceLine.assetId,
                                        disposalMethod: "Sale",
                                        disposalDate: today,
                                        saleProceeds: saleProceeds,
                                        netBookValueAtDisposal: nbv,
                                        gainLoss: saleProceeds - nbv,
                                        companyId: companyId_1,
                                        createdBy: userId_1,
                                    })];
                            case 11:
                                _93.sent();
                                _93.label = 12;
                            case 12: return [3 /*break*/, 15];
                            case 13: return [3 /*break*/, 15];
                            case 14: throw new Error("Unsupported invoice line type");
                            case 15: return [2 /*return*/];
                        }
                    });
                };
                _j = true, _k = __asyncValues(salesInvoiceLines_1.data);
                _91.label = 19;
            case 19: return [4 /*yield*/, _k.next()];
            case 20:
                if (!(_l = _91.sent(), _p = _l.done, !_p)) return [3 /*break*/, 23];
                return [5 /*yield**/, _loop_1()];
            case 21:
                _91.sent();
                _91.label = 22;
            case 22:
                _j = true;
                return [3 /*break*/, 19];
            case 23: return [3 /*break*/, 30];
            case 24:
                e_1_1 = _91.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 30];
            case 25:
                _91.trys.push([25, , 28, 29]);
                if (!(!_j && !_p && (_q = _k.return))) return [3 /*break*/, 27];
                return [4 /*yield*/, _q.call(_k)];
            case 26:
                _91.sent();
                _91.label = 27;
            case 27: return [3 /*break*/, 29];
            case 28:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 29: return [7 /*endfinally*/];
            case 30:
                if (!accountingEnabled_1) return [3 /*break*/, 32];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 31:
                _m = _91.sent();
                return [3 /*break*/, 33];
            case 32:
                _m = null;
                _91.label = 33;
            case 33:
                accountingPeriodId_1 = _m;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var shipmentLinesGroupedByLocationId, _loop_2, _a, _b, _c, e_2_1, _d, _e, _f, salesOrderLineId, update, e_3_1, salesOrdersUpdated, _g, salesOrdersUpdated_1, salesOrdersUpdated_1_1, salesOrderId, salesOrderLines_1, areAllLinesInvoiced, areAllLinesShipped, status_1, e_4_1, directInvoiceItems, _loop_3, _i, directInvoiceItems_1, directLine, journalLineResults, journalEntryId, journalResult_1, journalLineDimensionInserts_1, icJournalLineId;
                        var _h, e_2, _j, _k, _l, e_3, _m, _o, _p, e_4, _q, _r;
                        var _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
                        return __generator(this, function (_2) {
                            switch (_2.label) {
                                case 0:
                                    if (!(shipmentLineInserts_1.length > 0)) return [3 /*break*/, 13];
                                    shipmentLinesGroupedByLocationId = shipmentLineInserts_1.reduce(function (acc, line) {
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
                                    _2.label = 1;
                                case 1:
                                    _2.trys.push([1, 7, 8, 13]);
                                    _loop_2 = function () {
                                        var locationId, shipmentLines, readableShipmentId, shipment, shipmentId;
                                        return __generator(this, function (_3) {
                                            switch (_3.label) {
                                                case 0:
                                                    _k = _c.value;
                                                    _a = false;
                                                    locationId = _k[0], shipmentLines = _k[1];
                                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId_1)];
                                                case 1:
                                                    readableShipmentId = _3.sent();
                                                    return [4 /*yield*/, trx
                                                            .insertInto("shipment")
                                                            .values({
                                                            shipmentId: readableShipmentId !== null && readableShipmentId !== void 0 ? readableShipmentId : "x",
                                                            locationId: locationId,
                                                            sourceDocument: "Sales Invoice",
                                                            sourceDocumentId: salesInvoice_1.data.id,
                                                            sourceDocumentReadableId: salesInvoice_1.data.invoiceId,
                                                            shippingMethodId: (_s = salesInvoiceShipment_1.data) === null || _s === void 0 ? void 0 : _s.shippingMethodId,
                                                            customerId: salesInvoice_1.data.customerId,
                                                            externalDocumentId: salesInvoice_1.data.customerReference,
                                                            status: "Posted",
                                                            postingDate: today,
                                                            postedBy: userId_1,
                                                            invoiced: true,
                                                            opportunityId: salesInvoice_1.data.opportunityId,
                                                            companyId: companyId_1,
                                                            createdBy: salesInvoice_1.data.createdBy,
                                                        })
                                                            .returning(["id"])
                                                            .execute()];
                                                case 2:
                                                    shipment = _3.sent();
                                                    shipmentId = shipment[0].id;
                                                    if (!shipmentId)
                                                        throw new Error("Failed to insert shipment");
                                                    return [4 /*yield*/, trx
                                                            .insertInto("shipmentLine")
                                                            .values(shipmentLines.map(function (r) { return (__assign(__assign({}, r), { shipmentId: shipmentId })); }))
                                                            .returning(["id"])
                                                            .execute()];
                                                case 3:
                                                    _3.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues(Object.entries(shipmentLinesGroupedByLocationId));
                                    _2.label = 2;
                                case 2: return [4 /*yield*/, _b.next()];
                                case 3:
                                    if (!(_c = _2.sent(), _h = _c.done, !_h)) return [3 /*break*/, 6];
                                    return [5 /*yield**/, _loop_2()];
                                case 4:
                                    _2.sent();
                                    _2.label = 5;
                                case 5:
                                    _a = true;
                                    return [3 /*break*/, 2];
                                case 6: return [3 /*break*/, 13];
                                case 7:
                                    e_2_1 = _2.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 13];
                                case 8:
                                    _2.trys.push([8, , 11, 12]);
                                    if (!(!_a && !_h && (_j = _b.return))) return [3 /*break*/, 10];
                                    return [4 /*yield*/, _j.call(_b)];
                                case 9:
                                    _2.sent();
                                    _2.label = 10;
                                case 10: return [3 /*break*/, 12];
                                case 11:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 12: return [7 /*endfinally*/];
                                case 13:
                                    _2.trys.push([13, 19, 20, 25]);
                                    _d = true, _e = __asyncValues(Object.entries(salesOrderLineUpdates_1));
                                    _2.label = 14;
                                case 14: return [4 /*yield*/, _e.next()];
                                case 15:
                                    if (!(_f = _2.sent(), _l = _f.done, !_l)) return [3 /*break*/, 18];
                                    _o = _f.value;
                                    _d = false;
                                    salesOrderLineId = _o[0], update = _o[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("salesOrderLine")
                                            .set(update)
                                            .where("id", "=", salesOrderLineId)
                                            .execute()];
                                case 16:
                                    _2.sent();
                                    _2.label = 17;
                                case 17:
                                    _d = true;
                                    return [3 /*break*/, 14];
                                case 18: return [3 /*break*/, 25];
                                case 19:
                                    e_3_1 = _2.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 25];
                                case 20:
                                    _2.trys.push([20, , 23, 24]);
                                    if (!(!_d && !_l && (_m = _e.return))) return [3 /*break*/, 22];
                                    return [4 /*yield*/, _m.call(_e)];
                                case 21:
                                    _2.sent();
                                    _2.label = 22;
                                case 22: return [3 /*break*/, 24];
                                case 23:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 24: return [7 /*endfinally*/];
                                case 25:
                                    salesOrdersUpdated = Object.values(salesOrderLineUpdates_1).reduce(function (acc, update) {
                                        if (update.salesOrderId && !acc.includes(update.salesOrderId)) {
                                            acc.push(update.salesOrderId);
                                        }
                                        return acc;
                                    }, []);
                                    _2.label = 26;
                                case 26:
                                    _2.trys.push([26, 35, 36, 41]);
                                    _g = true, salesOrdersUpdated_1 = __asyncValues(salesOrdersUpdated);
                                    _2.label = 27;
                                case 27: return [4 /*yield*/, salesOrdersUpdated_1.next()];
                                case 28:
                                    if (!(salesOrdersUpdated_1_1 = _2.sent(), _p = salesOrdersUpdated_1_1.done, !_p)) return [3 /*break*/, 34];
                                    _r = salesOrdersUpdated_1_1.value;
                                    _g = false;
                                    salesOrderId = _r;
                                    return [4 /*yield*/, trx
                                            .selectFrom("salesOrderLine")
                                            .selectAll()
                                            .where("salesOrderId", "=", salesOrderId)
                                            .execute()];
                                case 29:
                                    salesOrderLines_1 = _2.sent();
                                    areAllLinesInvoiced = salesOrderLines_1.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.invoicedComplete;
                                    });
                                    areAllLinesShipped = salesOrderLines_1.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.sentComplete;
                                    });
                                    status_1 = "To Ship and Invoice";
                                    if (areAllLinesInvoiced && areAllLinesShipped) {
                                        status_1 = "Completed";
                                    }
                                    else if (areAllLinesInvoiced) {
                                        status_1 = "To Ship";
                                    }
                                    else if (areAllLinesShipped) {
                                        status_1 = "To Invoice";
                                    }
                                    if (!areAllLinesInvoiced) return [3 /*break*/, 31];
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            invoiced: true,
                                        })
                                            .where("sourceDocumentId", "=", salesOrderId)
                                            .execute()];
                                case 30:
                                    _2.sent();
                                    _2.label = 31;
                                case 31: return [4 /*yield*/, trx
                                        .updateTable("salesOrder")
                                        .set({
                                        status: status_1,
                                    })
                                        .where("id", "=", salesOrderId)
                                        .execute()];
                                case 32:
                                    _2.sent();
                                    _2.label = 33;
                                case 33:
                                    _g = true;
                                    return [3 /*break*/, 27];
                                case 34: return [3 /*break*/, 41];
                                case 35:
                                    e_4_1 = _2.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 41];
                                case 36:
                                    _2.trys.push([36, , 39, 40]);
                                    if (!(!_g && !_p && (_q = salesOrdersUpdated_1.return))) return [3 /*break*/, 38];
                                    return [4 /*yield*/, _q.call(salesOrdersUpdated_1)];
                                case 37:
                                    _2.sent();
                                    _2.label = 38;
                                case 38: return [3 /*break*/, 40];
                                case 39:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 40: return [7 /*endfinally*/];
                                case 41:
                                    directInvoiceItems = salesInvoiceLines_1.data.filter(function (line) { return line.salesOrderLineId === null && line.itemId; });
                                    _loop_3 = function (directLine) {
                                        var itemTrackingType, cogsResult, i, jl;
                                        return __generator(this, function (_4) {
                                            switch (_4.label) {
                                                case 0:
                                                    if (!directLine.itemId)
                                                        return [2 /*return*/, "continue"];
                                                    itemTrackingType = (_u = (_t = items_1.data.find(function (item) { return item.id === directLine.itemId; })) === null || _t === void 0 ? void 0 : _t.itemTrackingType) !== null && _u !== void 0 ? _u : "Inventory";
                                                    if (itemTrackingType !== "Inventory")
                                                        return [2 /*return*/, "continue"];
                                                    return [4 /*yield*/, (0, calculate_cogs_ts_1.calculateCOGS)(trx, {
                                                            itemId: directLine.itemId,
                                                            quantity: directLine.quantity,
                                                            companyId: companyId_1,
                                                        })];
                                                case 1:
                                                    cogsResult = _4.sent();
                                                    i = 0;
                                                    _4.label = 2;
                                                case 2:
                                                    if (!(i < journalLineInserts_1.length)) return [3 /*break*/, 5];
                                                    jl = journalLineInserts_1[i];
                                                    if (!(jl.description === "Cost of Goods Sold" &&
                                                        jl.amount === 0 &&
                                                        jl.quantity === directLine.quantity)) return [3 /*break*/, 4];
                                                    journalLineInserts_1[i].amount = (0, utils_ts_1.debit)("expense", cogsResult.totalCost);
                                                    if (i + 1 < journalLineInserts_1.length) {
                                                        journalLineInserts_1[i + 1].amount = (0, utils_ts_1.credit)("asset", cogsResult.totalCost);
                                                    }
                                                    return [4 /*yield*/, trx
                                                            .insertInto("costLedger")
                                                            .values({
                                                            itemLedgerType: "Sale",
                                                            costLedgerType: "Direct Cost",
                                                            adjustment: false,
                                                            documentType: "Sales Shipment",
                                                            documentId: (_w = (_v = salesInvoice_1.data) === null || _v === void 0 ? void 0 : _v.id) !== null && _w !== void 0 ? _w : "",
                                                            itemId: directLine.itemId,
                                                            quantity: -directLine.quantity,
                                                            cost: -cogsResult.totalCost,
                                                            remainingQuantity: 0,
                                                            companyId: companyId_1,
                                                        })
                                                            .execute()];
                                                case 3:
                                                    _4.sent();
                                                    return [3 /*break*/, 5];
                                                case 4:
                                                    i++;
                                                    return [3 /*break*/, 2];
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, directInvoiceItems_1 = directInvoiceItems;
                                    _2.label = 42;
                                case 42:
                                    if (!(_i < directInvoiceItems_1.length)) return [3 /*break*/, 45];
                                    directLine = directInvoiceItems_1[_i];
                                    return [5 /*yield**/, _loop_3(directLine)];
                                case 43:
                                    _2.sent();
                                    _2.label = 44;
                                case 44:
                                    _i++;
                                    return [3 /*break*/, 42];
                                case 45:
                                    journalLineResults = [];
                                    if (!accountingEnabled_1) return [3 /*break*/, 51];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 46:
                                    journalEntryId = _2.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            accountingPeriodId: accountingPeriodId_1,
                                            description: "Sales Invoice ".concat((_x = salesInvoice_1.data) === null || _x === void 0 ? void 0 : _x.invoiceId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Sales Invoice",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 47:
                                    journalResult_1 = _2.sent();
                                    if (!(journalLineInserts_1.length > 0)) return [3 /*break*/, 49];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts_1.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult_1.id })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 48:
                                    journalLineResults = _2.sent();
                                    _2.label = 49;
                                case 49:
                                    if (!(dimensionMap_1.size > 0)) return [3 /*break*/, 51];
                                    journalLineDimensionInserts_1 = [];
                                    journalLineResults.forEach(function (jl, index) {
                                        var meta = journalLineDimensionsMeta_1[index];
                                        if (!meta)
                                            return;
                                        if (meta.customerTypeId && dimensionMap_1.has("CustomerType")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("CustomerType"),
                                                valueId: meta.customerTypeId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (meta.itemPostingGroupId && dimensionMap_1.has("ItemPostingGroup")) {
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
                                        if (meta.fixedAssetClassId && dimensionMap_1.has("FixedAssetClass")) {
                                            journalLineDimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("FixedAssetClass"),
                                                valueId: meta.fixedAssetClassId,
                                                companyId: companyId_1,
                                            });
                                        }
                                    });
                                    if (!(journalLineDimensionInserts_1.length > 0)) return [3 /*break*/, 51];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLineDimension")
                                            .values(journalLineDimensionInserts_1)
                                            .execute()];
                                case 50:
                                    _2.sent();
                                    _2.label = 51;
                                case 51:
                                    if (!(itemLedgerInserts_1.length > 0)) return [3 /*break*/, 53];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_1)
                                            .returning(["id"])
                                            .execute()];
                                case 52:
                                    _2.sent();
                                    _2.label = 53;
                                case 53:
                                    if (!salesInvoice_1.data.shipmentId) return [3 /*break*/, 55];
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            invoiced: true,
                                        })
                                            .where("id", "=", salesInvoice_1.data.shipmentId)
                                            .execute()];
                                case 54:
                                    _2.sent();
                                    _2.label = 55;
                                case 55:
                                    if (!(accountingEnabled_1 && isIntercompany_1 && intercompanyPartnerId_1)) return [3 /*break*/, 57];
                                    icJournalLineId = journalLineResults.length > 0
                                        ? journalLineResults[0].id
                                        : null;
                                    return [4 /*yield*/, trx
                                            .insertInto("intercompanyTransaction")
                                            .values({
                                            companyGroupId: companyGroupId_1,
                                            sourceCompanyId: companyId_1,
                                            targetCompanyId: intercompanyPartnerId_1,
                                            sourceJournalLineId: icJournalLineId,
                                            amount: totalLinesCost_1,
                                            currencyCode: (_z = (_y = salesInvoice_1.data) === null || _y === void 0 ? void 0 : _y.currencyCode) !== null && _z !== void 0 ? _z : "USD",
                                            description: "Sales Invoice ".concat((_0 = salesInvoice_1.data) === null || _0 === void 0 ? void 0 : _0.invoiceId),
                                            documentType: "Invoice",
                                            documentId: (_1 = salesInvoice_1.data) === null || _1 === void 0 ? void 0 : _1.id,
                                            status: "Unmatched",
                                        })
                                            .execute()];
                                case 56:
                                    _2.sent();
                                    _2.label = 57;
                                case 57: return [4 /*yield*/, trx
                                        .updateTable("salesInvoice")
                                        .set({
                                        dateIssued: today,
                                        postingDate: today,
                                        status: "Submitted",
                                    })
                                        .where("id", "=", invoiceId_1)
                                        .execute()];
                                case 58:
                                    _2.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 34:
                _91.sent();
                return [3 /*break*/, 43];
            case 35: return [4 /*yield*/, client
                    .from("journalLine")
                    .select("*")
                    .eq("documentId", invoiceId_1)
                    .eq("documentType", "Invoice")];
            case 36:
                journalEntries = (_91.sent()).data;
                if (!journalEntries) {
                    throw new Error("No journal entries found for invoice");
                }
                return [4 /*yield*/, client
                        .from("shipment")
                        .select("id")
                        .eq("sourceDocument", "Sales Invoice")
                        .eq("sourceDocumentId", invoiceId_1)];
            case 37:
                invoiceShipments_1 = (_91.sent()).data;
                salesOrderLinesBySalesOrderLineId_1 = salesOrderLines.reduce(function (acc, salesOrderLine) {
                    acc[salesOrderLine.id] = salesOrderLine;
                    return acc;
                }, {});
                salesOrderLineUpdates_2 = salesInvoiceLines_1.data.reduce(function (acc, invoiceLine) {
                    var _a;
                    var _b, _c;
                    var salesOrderLine = salesOrderLinesBySalesOrderLineId_1[(_b = invoiceLine.salesOrderLineId) !== null && _b !== void 0 ? _b : ""];
                    if (invoiceLine.salesOrderLineId &&
                        salesOrderLine &&
                        invoiceLine.quantity &&
                        salesOrderLine.saleQuantity &&
                        salesOrderLine.saleQuantity > 0) {
                        var newQuantityInvoiced = Math.max(0, ((_c = salesOrderLine.quantityInvoiced) !== null && _c !== void 0 ? _c : 0) - invoiceLine.quantity);
                        var invoicedComplete = newQuantityInvoiced >= salesOrderLine.saleQuantity;
                        var updates = {
                            quantityInvoiced: newQuantityInvoiced,
                            invoicedComplete: invoicedComplete,
                            salesOrderId: salesOrderLine.salesOrderId,
                        };
                        return __assign(__assign({}, acc), (_a = {}, _a[invoiceLine.salesOrderLineId] = updates, _a));
                    }
                    return acc;
                }, {});
                reversingJournalEntries_1 = accountingEnabled_1
                    ? journalEntries.map(function (entry) {
                        var _a;
                        return ({
                            accountId: entry.accountId,
                            description: "VOID: ".concat(entry.description),
                            amount: -entry.amount, // Reverse the amount
                            quantity: -entry.quantity,
                            documentType: "Invoice",
                            documentId: (_a = salesInvoice_1.data) === null || _a === void 0 ? void 0 : _a.id,
                            externalDocumentId: entry.externalDocumentId,
                            documentLineReference: entry.documentLineReference,
                            journalLineReference: entry.journalLineReference,
                            companyId: companyId_1,
                        });
                    })
                    : [];
                reversingItemLedgerEntries_1 = [];
                return [4 /*yield*/, client
                        .from("itemLedger")
                        .select("*")
                        .eq("documentId", invoiceId_1)
                        .eq("documentType", "Sales Shipment")];
            case 38:
                originalItemLedgerEntries = (_91.sent()).data;
                if (originalItemLedgerEntries) {
                    originalItemLedgerEntries.forEach(function (entry) {
                        var _a, _b;
                        reversingItemLedgerEntries_1.push({
                            postingDate: today,
                            itemId: entry.itemId,
                            quantity: -entry.quantity, // Reverse the quantity
                            locationId: entry.locationId,
                            storageUnitId: entry.storageUnitId,
                            entryType: entry.entryType === "Negative Adjmt."
                                ? "Positive Adjmt."
                                : "Negative Adjmt.",
                            documentType: "Sales Shipment",
                            documentId: (_b = (_a = salesInvoice_1.data) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : undefined,
                            externalDocumentId: entry.externalDocumentId,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    });
                }
                if (!accountingEnabled_1) return [3 /*break*/, 40];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 39:
                _o = _91.sent();
                return [3 /*break*/, 41];
            case 40:
                _o = null;
                _91.label = 41;
            case 41:
                accountingPeriodId_2 = _o;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, salesOrderLineId, update, e_5_1, salesOrdersUpdated, _d, salesOrdersUpdated_2, salesOrdersUpdated_2_1, salesOrderId, salesOrderLines_2, areAllLinesInvoiced, areAllLinesShipped, status_2, e_6_1, voidJournalEntryId, voidJournalResult_1, _i, invoiceShipments_2, shipment;
                        var _e, e_5, _f, _g, _h, e_6, _j, _k;
                        var _l;
                        return __generator(this, function (_m) {
                            switch (_m.label) {
                                case 0:
                                    _m.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(salesOrderLineUpdates_2));
                                    _m.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _m.sent(), _e = _c.done, !_e)) return [3 /*break*/, 5];
                                    _g = _c.value;
                                    _a = false;
                                    salesOrderLineId = _g[0], update = _g[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("salesOrderLine")
                                            .set(update)
                                            .where("id", "=", salesOrderLineId)
                                            .execute()];
                                case 3:
                                    _m.sent();
                                    _m.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_5_1 = _m.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _m.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _f.call(_b)];
                                case 8:
                                    _m.sent();
                                    _m.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_5) throw e_5.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12:
                                    salesOrdersUpdated = Object.values(salesOrderLineUpdates_2).reduce(function (acc, update) {
                                        if (update.salesOrderId && !acc.includes(update.salesOrderId)) {
                                            acc.push(update.salesOrderId);
                                        }
                                        return acc;
                                    }, []);
                                    _m.label = 13;
                                case 13:
                                    _m.trys.push([13, 22, 23, 28]);
                                    _d = true, salesOrdersUpdated_2 = __asyncValues(salesOrdersUpdated);
                                    _m.label = 14;
                                case 14: return [4 /*yield*/, salesOrdersUpdated_2.next()];
                                case 15:
                                    if (!(salesOrdersUpdated_2_1 = _m.sent(), _h = salesOrdersUpdated_2_1.done, !_h)) return [3 /*break*/, 21];
                                    _k = salesOrdersUpdated_2_1.value;
                                    _d = false;
                                    salesOrderId = _k;
                                    return [4 /*yield*/, trx
                                            .selectFrom("salesOrderLine")
                                            .selectAll()
                                            .where("salesOrderId", "=", salesOrderId)
                                            .execute()];
                                case 16:
                                    salesOrderLines_2 = _m.sent();
                                    areAllLinesInvoiced = salesOrderLines_2.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.invoicedComplete;
                                    });
                                    areAllLinesShipped = salesOrderLines_2.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.sentComplete;
                                    });
                                    status_2 = "To Ship and Invoice";
                                    if (areAllLinesInvoiced && areAllLinesShipped) {
                                        status_2 = "Completed";
                                    }
                                    else if (areAllLinesInvoiced) {
                                        status_2 = "To Ship";
                                    }
                                    else if (areAllLinesShipped) {
                                        status_2 = "To Invoice";
                                    }
                                    if (!!areAllLinesInvoiced) return [3 /*break*/, 18];
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            invoiced: false,
                                        })
                                            .where("sourceDocumentId", "=", salesOrderId)
                                            .execute()];
                                case 17:
                                    _m.sent();
                                    _m.label = 18;
                                case 18: return [4 /*yield*/, trx
                                        .updateTable("salesOrder")
                                        .set({
                                        status: status_2,
                                    })
                                        .where("id", "=", salesOrderId)
                                        .execute()];
                                case 19:
                                    _m.sent();
                                    _m.label = 20;
                                case 20:
                                    _d = true;
                                    return [3 /*break*/, 14];
                                case 21: return [3 /*break*/, 28];
                                case 22:
                                    e_6_1 = _m.sent();
                                    e_6 = { error: e_6_1 };
                                    return [3 /*break*/, 28];
                                case 23:
                                    _m.trys.push([23, , 26, 27]);
                                    if (!(!_d && !_h && (_j = salesOrdersUpdated_2.return))) return [3 /*break*/, 25];
                                    return [4 /*yield*/, _j.call(salesOrdersUpdated_2)];
                                case 24:
                                    _m.sent();
                                    _m.label = 25;
                                case 25: return [3 /*break*/, 27];
                                case 26:
                                    if (e_6) throw e_6.error;
                                    return [7 /*endfinally*/];
                                case 27: return [7 /*endfinally*/];
                                case 28:
                                    if (!accountingEnabled_1) return [3 /*break*/, 32];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 29:
                                    voidJournalEntryId = _m.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: voidJournalEntryId,
                                            accountingPeriodId: accountingPeriodId_2,
                                            description: "VOID Sales Invoice ".concat((_l = salesInvoice_1.data) === null || _l === void 0 ? void 0 : _l.invoiceId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Sales Invoice",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 30:
                                    voidJournalResult_1 = _m.sent();
                                    if (!(reversingJournalEntries_1.length > 0)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(reversingJournalEntries_1.map(function (line) { return (__assign(__assign({}, line), { journalId: voidJournalResult_1.id })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 31:
                                    _m.sent();
                                    _m.label = 32;
                                case 32:
                                    if (!(reversingItemLedgerEntries_1.length > 0)) return [3 /*break*/, 34];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(reversingItemLedgerEntries_1)
                                            .returning(["id"])
                                            .execute()];
                                case 33:
                                    _m.sent();
                                    _m.label = 34;
                                case 34:
                                    if (!(invoiceShipments_1 && invoiceShipments_1.length > 0)) return [3 /*break*/, 38];
                                    _i = 0, invoiceShipments_2 = invoiceShipments_1;
                                    _m.label = 35;
                                case 35:
                                    if (!(_i < invoiceShipments_2.length)) return [3 /*break*/, 38];
                                    shipment = invoiceShipments_2[_i];
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            invoiced: false,
                                            status: "Voided",
                                            updatedAt: today,
                                            updatedBy: userId_1,
                                        })
                                            .where("id", "=", shipment.id)
                                            .execute()];
                                case 36:
                                    _m.sent();
                                    _m.label = 37;
                                case 37:
                                    _i++;
                                    return [3 /*break*/, 35];
                                case 38:
                                    if (!salesInvoice_1.data.shipmentId) return [3 /*break*/, 40];
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            invoiced: false,
                                        })
                                            .where("id", "=", salesInvoice_1.data.shipmentId)
                                            .execute()];
                                case 39:
                                    _m.sent();
                                    _m.label = 40;
                                case 40: 
                                // Update invoice status to voided
                                return [4 /*yield*/, trx
                                        .updateTable("salesInvoice")
                                        .set({
                                        status: "Voided",
                                        updatedAt: today,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", invoiceId_1)
                                        .execute()];
                                case 41:
                                    // Update invoice status to voided
                                    _m.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 42:
                _91.sent();
                return [3 /*break*/, 43];
            case 43: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                })];
            case 44:
                err_1 = _91.sent();
                console.error(err_1);
                if (!("invoiceId" in payload)) return [3 /*break*/, 47];
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, payload.companyId, payload.userId, { update: "invoicing" })];
            case 45:
                client = _91.sent();
                return [4 /*yield*/, client
                        .from("salesInvoice")
                        .update({ status: "Draft" })
                        .eq("id", payload.invoiceId)];
            case 46:
                _91.sent();
                _91.label = 47;
            case 47: return [2 /*return*/, new Response(JSON.stringify(err_1), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 500,
                })];
            case 48: return [2 /*return*/];
        }
    });
}); });
