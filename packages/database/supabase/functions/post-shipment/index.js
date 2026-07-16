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
var calculate_cogs_ts_1 = require("../shared/calculate-cogs.ts");
var get_accounting_period_ts_1 = require("../shared/get-accounting-period.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var get_posting_group_ts_1 = require("../shared/get-posting-group.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = mod_ts_3.z.object({
    type: mod_ts_3.z.enum(["post", "void"]),
    shipmentId: mod_ts_3.z.string(),
    userId: mod_ts_3.z.string(),
    companyId: mod_ts_3.z.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, _a, type, shipmentId_1, userId_1, companyId_1, client, _b, shipment_1, shipmentLines_1, shipmentLineTracking, itemIds, jobIds, _c, items, itemCosts, jobs, splitEntityIds_1, _d, _e, _f, salesOrder_1, salesOrderLines, salesOrderDelivery, customer, _g, companyRecord, accountingSettings, companyGroupId, accountingEnabled_1, accountDefaults, _h, dimensions, _j, dimensionMap_1, _i, _k, dim, itemLedgerInserts_1, journalLineInserts_1, journalLineDimensionsMeta_1, jobUpdates_1, serialNumbersConsumed_1, locationId_1, _loop_1, _l, _m, _o, e_1_1, shipmentLinesBySalesOrderLineId_1, salesOrderLineUpdates_1, shipmentFaLines, shippedFaSoLineIds_1, faSalesOrderLines, _p, faSalesOrderLines_1, faSoLine, assetRecord, assetClass, acquisitionCost, accumulatedDepreciation, nbv, jlRef, nbvJlRef, removeJlRef, trackedEntitySplits_1, trackedEntityUpdates_1, accountingPeriodId_1, _q, purchaseOrder_1, purchaseOrderLines, supplier, jobOperationsUpdates_1, _loop_2, _r, _s, _t, e_2_1, shipmentLinesByPurchaseOrderLineId_1, purchaseOrderLineUpdates_1, trackedEntitySplits_2, trackedEntityUpdates_2, _u, warehouseTransfer_1, warehouseTransferLines, itemLedgerInserts_2, warehouseTransferLineUpdates_1, _loop_3, _v, _w, _x, e_3_1, allLinesFullyShipped, allLinesFullyReceived, newStatus_1, _y, _z, salesOrder_2, salesOrderLines, originalJournalLines, accountingSettings, accountingEnabled_2, reversingJournalLines_1, customer, itemLedgerInserts_3, jobUpdates_2, locationId_2, _loop_4, _0, _1, _2, e_4_1, shipmentLinesBySalesOrderLineId_2, salesOrderLineUpdates_2, faSoLinesForVoid, _loop_5, _3, faSoLinesForVoid_1, faSoLine, trackedEntityUpdates_3, accountingPeriodId_2, _4, _5, purchaseOrder_2, purchaseOrderLines, supplier, jobOperationsUpdates_2, _loop_6, _6, _7, _8, e_5_1, shipmentLinesByPurchaseOrderLineId_2, purchaseOrderLineUpdates_2, trackedEntityUpdates_4, itemLedgerInserts_4, locationId_3, _loop_7, _9, _10, _11, e_6_1, _12, warehouseTransfer_2, warehouseTransferLines, itemLedgerInserts_5, warehouseTransferLineUpdates_2, _loop_8, _13, _14, _15, e_7_1, allLinesFullyShipped, allLinesFullyReceived, newStatus_2, err_1, client;
    var _16, e_1, _17, _18, _19, e_2, _20, _21, _22, e_3, _23, _24, _25, e_4, _26, _27, _28, e_5, _29, _30, _31, e_6, _32, _33, _34, e_7, _35, _36;
    var _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72, _73, _74, _75, _76, _77, _78, _79, _80, _81, _82, _83, _84, _85, _86, _87, _88, _89, _90, _91, _92, _93, _94, _95, _96, _97, _98, _99, _100, _101, _102, _103, _104, _105, _106, _107, _108, _109, _110, _111, _112, _113, _114, _115, _116, _117, _118, _119, _120, _121, _122, _123, _124, _125, _126, _127, _128, _129, _130, _131, _132, _133, _134, _135, _136, _137, _138, _139, _140;
    return __generator(this, function (_141) {
        switch (_141.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _141.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _141.label = 2;
            case 2:
                _141.trys.push([2, 142, , 146]);
                _a = payloadValidator.parse(payload), type = _a.type, shipmentId_1 = _a.shipmentId, userId_1 = _a.userId, companyId_1 = _a.companyId;
                console.log({
                    function: "post-shipment",
                    type: type,
                    shipmentId: shipmentId_1,
                    userId: userId_1,
                    companyId: companyId_1,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "inventory" })];
            case 3:
                client = _141.sent();
                return [4 /*yield*/, Promise.all([
                        client.from("shipment").select("*").eq("id", shipmentId_1).single(),
                        client
                            .from("shipmentLine")
                            .select("*, fulfillment(*)")
                            .eq("shipmentId", shipmentId_1),
                        client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes->> Shipment", shipmentId_1),
                    ])];
            case 4:
                _b = _141.sent(), shipment_1 = _b[0], shipmentLines_1 = _b[1], shipmentLineTracking = _b[2];
                if (shipment_1.error)
                    throw new Error("Failed to fetch shipment");
                if (shipmentLines_1.error)
                    throw new Error("Failed to fetch shipment lines");
                itemIds = shipmentLines_1.data.reduce(function (acc, shipmentLine) {
                    if (shipmentLine.itemId && !acc.includes(shipmentLine.itemId)) {
                        acc.push(shipmentLine.itemId);
                    }
                    return acc;
                }, []);
                jobIds = shipmentLines_1.data.reduce(function (acc, shipmentLine) {
                    var _a, _b, _c;
                    if (((_a = shipmentLine.fulfillment) === null || _a === void 0 ? void 0 : _a.jobId) &&
                        !acc.includes((_b = shipmentLine.fulfillment) === null || _b === void 0 ? void 0 : _b.jobId)) {
                        acc.push((_c = shipmentLine.fulfillment) === null || _c === void 0 ? void 0 : _c.jobId);
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
                            .from("job")
                            .select("id, quantity, quantityComplete, quantityShipped, status")
                            .in("id", jobIds),
                    ])];
            case 5:
                _c = _141.sent(), items = _c[0], itemCosts = _c[1], jobs = _c[2];
                if (items.error) {
                    throw new Error("Failed to fetch items");
                }
                if (itemCosts.error) {
                    throw new Error("Failed to fetch item costs");
                }
                if (jobs.error) {
                    throw new Error("Failed to fetch jobs");
                }
                splitEntityIds_1 = [];
                _d = type;
                switch (_d) {
                    case "post": return [3 /*break*/, 6];
                    case "void": return [3 /*break*/, 72];
                }
                return [3 /*break*/, 141];
            case 6:
                _e = (_37 = shipment_1.data) === null || _37 === void 0 ? void 0 : _37.sourceDocument;
                switch (_e) {
                    case "Sales Order": return [3 /*break*/, 7];
                    case "Purchase Order": return [3 /*break*/, 39];
                    case "Outbound Transfer": return [3 /*break*/, 55];
                }
                return [3 /*break*/, 70];
            case 7:
                if (!shipment_1.data.sourceDocumentId)
                    throw new Error("Shipment has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("salesOrder")
                            .select("*")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("salesOrderLine")
                            .select("*")
                            .eq("salesOrderId", shipment_1.data.sourceDocumentId),
                        client
                            .from("salesOrderShipment")
                            .select("shippingCost")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                    ])];
            case 8:
                _f = _141.sent(), salesOrder_1 = _f[0], salesOrderLines = _f[1], salesOrderDelivery = _f[2];
                if (salesOrder_1.error)
                    throw new Error("Failed to fetch purchase order");
                if (salesOrderLines.error)
                    throw new Error("Failed to fetch sales order lines");
                if (salesOrderDelivery.error)
                    throw new Error("Failed to fetch sales order delivery");
                return [4 /*yield*/, client
                        .from("customer")
                        .select("*")
                        .eq("id", salesOrder_1.data.customerId)
                        .eq("companyId", companyId_1)
                        .single()];
            case 9:
                customer = _141.sent();
                if (customer.error)
                    throw new Error("Failed to fetch customer");
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
            case 10:
                _g = _141.sent(), companyRecord = _g[0], accountingSettings = _g[1];
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                companyGroupId = companyRecord.data.companyGroupId;
                accountingEnabled_1 = (_39 = (_38 = accountingSettings.data) === null || _38 === void 0 ? void 0 : _38.accountingEnabled) !== null && _39 !== void 0 ? _39 : false;
                if (!accountingEnabled_1) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client, companyId_1)];
            case 11:
                _h = _141.sent();
                return [3 /*break*/, 13];
            case 12:
                _h = null;
                _141.label = 13;
            case 13:
                accountDefaults = _h;
                if (accountingEnabled_1 && ((accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.error) || !(accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabled_1) return [3 /*break*/, 15];
                return [4 /*yield*/, client
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyGroupId)
                        .eq("active", true)
                        .in("entityType", [
                        "CustomerType",
                        "ItemPostingGroup",
                        "Location",
                        "CostCenter",
                        "FixedAssetClass",
                    ])];
            case 14:
                _j = _141.sent();
                return [3 /*break*/, 16];
            case 15:
                _j = null;
                _141.label = 16;
            case 16:
                dimensions = _j;
                dimensionMap_1 = new Map();
                if (dimensions === null || dimensions === void 0 ? void 0 : dimensions.data) {
                    for (_i = 0, _k = dimensions.data; _i < _k.length; _i++) {
                        dim = _k[_i];
                        if (dim.entityType)
                            dimensionMap_1.set(dim.entityType, dim.id);
                    }
                }
                itemLedgerInserts_1 = [];
                journalLineInserts_1 = [];
                journalLineDimensionsMeta_1 = [];
                jobUpdates_1 = {};
                serialNumbersConsumed_1 = [];
                locationId_1 = shipment_1.data.locationId;
                _141.label = 17;
            case 17:
                _141.trys.push([17, 22, 23, 28]);
                _loop_1 = function () {
                    _18 = _o.value;
                    _l = false;
                    var shipmentLine = _18;
                    var salesOrderLine = salesOrderLines.data.find(function (sol) { return sol.id === shipmentLine.lineId; });
                    if (((_40 = shipmentLine.fulfillment) === null || _40 === void 0 ? void 0 : _40.type) === "Job" &&
                        ((_41 = shipmentLine.fulfillment) === null || _41 === void 0 ? void 0 : _41.jobId)) {
                        // Update quantity shipped on job, accumulating totals from multiple shipments
                        var jobId_1 = shipmentLine.fulfillment.jobId;
                        var currentJob = jobs.data.find(function (j) { return j.id === jobId_1; });
                        // Log job and shipment line data to debug NaN issues
                        console.log("Processing job update:", {
                            jobId: jobId_1,
                            currentJob: currentJob
                                ? {
                                    id: currentJob.id,
                                    quantity: currentJob.quantity,
                                    quantityShipped: currentJob.quantityShipped,
                                    quantityComplete: currentJob.quantityComplete,
                                    status: currentJob.status,
                                }
                                : null,
                            shipmentLine: {
                                id: shipmentLine.id,
                                shippedQuantity: shipmentLine.shippedQuantity,
                                shippedQuantityType: typeof shipmentLine.shippedQuantity,
                            },
                        });
                        var currentQuantityShipped = (_42 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityShipped) !== null && _42 !== void 0 ? _42 : 0;
                        // Ensure shippedQuantity is a valid number to prevent "100NaN" errors
                        var shippedQuantity_1 = typeof shipmentLine.shippedQuantity === "number" &&
                            !isNaN(shipmentLine.shippedQuantity)
                            ? shipmentLine.shippedQuantity
                            : 0;
                        console.log("Calculated values:", {
                            currentQuantityShipped: currentQuantityShipped,
                            shippedQuantity: shippedQuantity_1,
                            newTotal: currentQuantityShipped + shippedQuantity_1,
                            jobQuantity: currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantity,
                        });
                        // If we've already updated this job in this transaction, use that as the base
                        // instead of the current DB value to avoid double counting
                        if (jobUpdates_1[jobId_1]) {
                            var newQuantityShipped = ((_44 = (_43 = jobUpdates_1[jobId_1]) === null || _43 === void 0 ? void 0 : _43.quantityShipped) !== null && _44 !== void 0 ? _44 : 0) + shippedQuantity_1;
                            var newQuantityComplete = (currentJob === null || currentJob === void 0 ? void 0 : currentJob.status) === "Completed"
                                ? currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityComplete
                                : Math.max((_45 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityComplete) !== null && _45 !== void 0 ? _45 : 0, shippedQuantity_1);
                            var newStatus = currentQuantityShipped + shippedQuantity_1 >=
                                ((_46 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantity) !== null && _46 !== void 0 ? _46 : 0)
                                ? "Completed"
                                : currentJob === null || currentJob === void 0 ? void 0 : currentJob.status;
                            console.log("Updating existing job update:", {
                                jobId: jobId_1,
                                previousUpdate: jobUpdates_1[jobId_1],
                                newUpdate: {
                                    status: newStatus,
                                    quantityComplete: newQuantityComplete,
                                    quantityShipped: newQuantityShipped,
                                },
                            });
                            jobUpdates_1[jobId_1] = {
                                status: newStatus,
                                quantityComplete: newQuantityComplete,
                                quantityShipped: newQuantityShipped,
                            };
                        }
                        else {
                            var newQuantityShipped = currentQuantityShipped + shippedQuantity_1;
                            var newQuantityComplete = (currentJob === null || currentJob === void 0 ? void 0 : currentJob.status) === "Completed"
                                ? currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityComplete
                                : Math.max((_47 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityComplete) !== null && _47 !== void 0 ? _47 : 0, shippedQuantity_1);
                            var newStatus = currentQuantityShipped + shippedQuantity_1 >=
                                ((_48 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantity) !== null && _48 !== void 0 ? _48 : 0)
                                ? "Completed"
                                : currentJob === null || currentJob === void 0 ? void 0 : currentJob.status;
                            console.log("Creating new job update:", {
                                jobId: jobId_1,
                                update: {
                                    status: newStatus,
                                    quantityComplete: newQuantityComplete,
                                    quantityShipped: newQuantityShipped,
                                },
                            });
                            jobUpdates_1[jobId_1] = {
                                status: newStatus,
                                quantityComplete: newQuantityComplete,
                                quantityShipped: newQuantityShipped,
                            };
                        }
                    }
                    var itemTrackingType = (_50 = (_49 = items.data.find(function (item) { return item.id === shipmentLine.itemId; })) === null || _49 === void 0 ? void 0 : _49.itemTrackingType) !== null && _50 !== void 0 ? _50 : "Inventory";
                    // Default shippedQuantity to 0 if not defined or NaN
                    var shippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                        shipmentLine.shippedQuantity == null
                        ? 0
                        : shipmentLine.shippedQuantity;
                    if (itemTrackingType === "Inventory") {
                        itemLedgerInserts_1.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: -shippedQuantity,
                            locationId: (_51 = shipmentLine.locationId) !== null && _51 !== void 0 ? _51 : locationId_1,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Negative Adjmt.",
                            documentType: "Sales Shipment",
                            documentId: (_53 = (_52 = shipment_1.data) === null || _52 === void 0 ? void 0 : _52.id) !== null && _53 !== void 0 ? _53 : undefined,
                            externalDocumentId: undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (shipmentLine.requiresBatchTracking) {
                        itemLedgerInserts_1.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: -shippedQuantity,
                            locationId: (_54 = shipmentLine.locationId) !== null && _54 !== void 0 ? _54 : locationId_1,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Negative Adjmt.",
                            documentType: "Sales Shipment",
                            documentId: (_56 = (_55 = shipment_1.data) === null || _55 === void 0 ? void 0 : _55.id) !== null && _56 !== void 0 ? _56 : undefined,
                            trackedEntityId: (_58 = (_57 = shipmentLineTracking.data) === null || _57 === void 0 ? void 0 : _57.find(function (tracking) {
                                var _a;
                                return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === shipmentLine.id;
                            })) === null || _58 === void 0 ? void 0 : _58.id,
                            externalDocumentId: undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (shipmentLine.requiresSerialTracking) {
                        var lineTracking = (_59 = shipmentLineTracking.data) === null || _59 === void 0 ? void 0 : _59.filter(function (tracking) {
                            var _a;
                            return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === shipmentLine.id;
                        });
                        lineTracking === null || lineTracking === void 0 ? void 0 : lineTracking.forEach(function (tracking) {
                            var _a, _b, _c;
                            itemLedgerInserts_1.push({
                                postingDate: today,
                                itemId: shipmentLine.itemId,
                                quantity: -1,
                                locationId: (_a = shipmentLine.locationId) !== null && _a !== void 0 ? _a : locationId_1,
                                storageUnitId: shipmentLine.storageUnitId,
                                entryType: "Negative Adjmt.",
                                documentType: "Sales Shipment",
                                documentId: (_c = (_b = shipment_1.data) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : undefined,
                                trackedEntityId: tracking.id,
                                externalDocumentId: undefined,
                                createdBy: userId_1,
                                companyId: companyId_1,
                            });
                            if (tracking.id) {
                                serialNumbersConsumed_1.push(tracking.id);
                            }
                        });
                    }
                    // COGS journal entries for this shipment line
                    if (accountingEnabled_1 &&
                        (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) &&
                        shipmentLine.itemId &&
                        shippedQuantity > 0 &&
                        itemTrackingType !== "Non-Inventory") {
                        var itemPostingGroupId = (_61 = (_60 = itemCosts.data.find(function (cost) { return cost.itemId === shipmentLine.itemId; })) === null || _60 === void 0 ? void 0 : _60.itemPostingGroupId) !== null && _61 !== void 0 ? _61 : null;
                        var salesOrderLine_1 = salesOrderLines.data.find(function (sol) { return sol.id === shipmentLine.lineId; });
                        var journalLineReference = (0, mod_ts_2.nanoid)();
                        journalLineInserts_1.push({
                            accountId: accountDefaults.data.costOfGoodsSoldAccount,
                            description: "Cost of Goods Sold",
                            amount: 0,
                            quantity: shippedQuantity,
                            documentType: "Sales Shipment",
                            documentId: (_62 = shipment_1.data) === null || _62 === void 0 ? void 0 : _62.id,
                            externalDocumentId: (_64 = (_63 = salesOrder_1.data) === null || _63 === void 0 ? void 0 : _63.customerReference) !== null && _64 !== void 0 ? _64 : undefined,
                            documentLineReference: utils_ts_1.journalReference.to.shipment(shipmentLine.id),
                            journalLineReference: journalLineReference,
                            companyId: companyId_1,
                        });
                        journalLineInserts_1.push({
                            accountId: accountDefaults.data.inventoryAccount,
                            description: "Inventory Account",
                            amount: 0,
                            quantity: shippedQuantity,
                            documentType: "Sales Shipment",
                            documentId: (_65 = shipment_1.data) === null || _65 === void 0 ? void 0 : _65.id,
                            externalDocumentId: (_67 = (_66 = salesOrder_1.data) === null || _66 === void 0 ? void 0 : _66.customerReference) !== null && _67 !== void 0 ? _67 : undefined,
                            documentLineReference: utils_ts_1.journalReference.to.shipment(shipmentLine.id),
                            journalLineReference: journalLineReference,
                            companyId: companyId_1,
                        });
                        for (var i = 0; i < 2; i++) {
                            journalLineDimensionsMeta_1.push({
                                customerTypeId: (_68 = customer.data.customerTypeId) !== null && _68 !== void 0 ? _68 : null,
                                itemPostingGroupId: itemPostingGroupId,
                                locationId: (_70 = (_69 = shipmentLine.locationId) !== null && _69 !== void 0 ? _69 : locationId_1) !== null && _70 !== void 0 ? _70 : null,
                                costCenterId: (_71 = salesOrderLine_1 === null || salesOrderLine_1 === void 0 ? void 0 : salesOrderLine_1.costCenterId) !== null && _71 !== void 0 ? _71 : null,
                                fixedAssetClassId: null,
                            });
                        }
                    }
                };
                _l = true, _m = __asyncValues(shipmentLines_1.data);
                _141.label = 18;
            case 18: return [4 /*yield*/, _m.next()];
            case 19:
                if (!(_o = _141.sent(), _16 = _o.done, !_16)) return [3 /*break*/, 21];
                _loop_1();
                _141.label = 20;
            case 20:
                _l = true;
                return [3 /*break*/, 18];
            case 21: return [3 /*break*/, 28];
            case 22:
                e_1_1 = _141.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 28];
            case 23:
                _141.trys.push([23, , 26, 27]);
                if (!(!_l && !_16 && (_17 = _m.return))) return [3 /*break*/, 25];
                return [4 /*yield*/, _17.call(_m)];
            case 24:
                _141.sent();
                _141.label = 25;
            case 25: return [3 /*break*/, 27];
            case 26:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 27: return [7 /*endfinally*/];
            case 28:
                shipmentLinesBySalesOrderLineId_1 = shipmentLines_1.data.reduce(function (acc, shipmentLine) {
                    var _a;
                    if (shipmentLine.lineId) {
                        acc[shipmentLine.lineId] = __spreadArray(__spreadArray([], ((_a = acc[shipmentLine.lineId]) !== null && _a !== void 0 ? _a : []), true), [
                            shipmentLine,
                        ], false);
                    }
                    return acc;
                }, {});
                salesOrderLineUpdates_1 = salesOrderLines.data.reduce(function (acc, salesOrderLine) {
                    var _a;
                    var _b;
                    var shipmentLines = shipmentLinesBySalesOrderLineId_1[salesOrderLine.id];
                    if (shipmentLines &&
                        shipmentLines.length > 0 &&
                        salesOrderLine.saleQuantity &&
                        salesOrderLine.saleQuantity > 0) {
                        var shippedQuantity = shipmentLines.reduce(function (acc, shipmentLine) {
                            var safeShippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                                shipmentLine.shippedQuantity == null
                                ? 0
                                : shipmentLine.shippedQuantity;
                            return acc + safeShippedQuantity;
                        }, 0);
                        var newQuantitySent = ((_b = salesOrderLine.quantitySent) !== null && _b !== void 0 ? _b : 0) + shippedQuantity;
                        var sentComplete = salesOrderLine.sentComplete ||
                            newQuantitySent >= salesOrderLine.saleQuantity;
                        var updates = __assign(__assign({}, acc), (_a = {}, _a[salesOrderLine.id] = {
                            quantitySent: newQuantitySent,
                            sentComplete: sentComplete,
                        }, _a));
                        if (sentComplete && !salesOrderLine.sentDate) {
                            updates[salesOrderLine.id].sentDate = today;
                        }
                        return updates;
                    }
                    return acc;
                }, {});
                return [4 /*yield*/, client
                        .from("shipmentFixedAssetLine")
                        .select("salesOrderLineId, serialNumber")
                        .eq("shipmentId", shipmentId_1)
                        .eq("shipped", true)];
            case 29:
                shipmentFaLines = (_141.sent()).data;
                shippedFaSoLineIds_1 = new Set((shipmentFaLines !== null && shipmentFaLines !== void 0 ? shipmentFaLines : []).map(function (r) { return r.salesOrderLineId; }));
                faSalesOrderLines = salesOrderLines.data.filter(function (sol) {
                    return sol.salesOrderLineType === "Fixed Asset" &&
                        sol.assetId &&
                        !sol.sentComplete &&
                        sol.saleQuantity &&
                        sol.saleQuantity > 0 &&
                        shippedFaSoLineIds_1.has(sol.id);
                });
                _p = 0, faSalesOrderLines_1 = faSalesOrderLines;
                _141.label = 30;
            case 30:
                if (!(_p < faSalesOrderLines_1.length)) return [3 /*break*/, 36];
                faSoLine = faSalesOrderLines_1[_p];
                if (!(accountingEnabled_1 && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data))) return [3 /*break*/, 34];
                return [4 /*yield*/, client
                        .from("fixedAsset")
                        .select("id, status, acquisitionCost, accumulatedDepreciation, locationId, fixedAssetClassId, fixedAssetClass:fixedAssetClassId(assetAccountId, accumulatedDepreciationAccountId, writeOffAccountId)")
                        .eq("id", faSoLine.assetId)
                        .single()];
            case 31:
                assetRecord = _141.sent();
                if (assetRecord.error)
                    throw new Error("Failed to fetch fixed asset for disposal");
                assetClass = assetRecord.data.fixedAssetClass;
                acquisitionCost = (_72 = Number(assetRecord.data.acquisitionCost)) !== null && _72 !== void 0 ? _72 : 0;
                accumulatedDepreciation = (_73 = Number(assetRecord.data.accumulatedDepreciation)) !== null && _73 !== void 0 ? _73 : 0;
                nbv = acquisitionCost - accumulatedDepreciation;
                if (accumulatedDepreciation > 0) {
                    jlRef = (0, mod_ts_2.nanoid)();
                    journalLineInserts_1.push({
                        accountId: assetClass.accumulatedDepreciationAccountId,
                        description: "Clear accumulated depreciation",
                        amount: (0, utils_ts_1.debit)("asset", accumulatedDepreciation),
                        quantity: 1,
                        documentType: "Sales Shipment",
                        documentId: (_74 = shipment_1.data) === null || _74 === void 0 ? void 0 : _74.id,
                        externalDocumentId: (_76 = (_75 = salesOrder_1.data) === null || _75 === void 0 ? void 0 : _75.customerReference) !== null && _76 !== void 0 ? _76 : undefined,
                        documentLineReference: utils_ts_1.journalReference.to.shipment(faSoLine.id),
                        journalLineReference: jlRef,
                        companyId: companyId_1,
                    });
                    journalLineDimensionsMeta_1.push({
                        customerTypeId: (_77 = customer.data.customerTypeId) !== null && _77 !== void 0 ? _77 : null,
                        itemPostingGroupId: null,
                        locationId: (_78 = locationId_1 !== null && locationId_1 !== void 0 ? locationId_1 : assetRecord.data.locationId) !== null && _78 !== void 0 ? _78 : null,
                        costCenterId: (_79 = faSoLine.costCenterId) !== null && _79 !== void 0 ? _79 : null,
                        fixedAssetClassId: (_80 = assetRecord.data.fixedAssetClassId) !== null && _80 !== void 0 ? _80 : null,
                    });
                }
                if (nbv > 0) {
                    nbvJlRef = (0, mod_ts_2.nanoid)();
                    journalLineInserts_1.push({
                        accountId: assetClass.writeOffAccountId,
                        description: "Write-off remaining book value",
                        amount: (0, utils_ts_1.debit)("expense", nbv),
                        quantity: 1,
                        documentType: "Sales Shipment",
                        documentId: (_81 = shipment_1.data) === null || _81 === void 0 ? void 0 : _81.id,
                        externalDocumentId: (_83 = (_82 = salesOrder_1.data) === null || _82 === void 0 ? void 0 : _82.customerReference) !== null && _83 !== void 0 ? _83 : undefined,
                        documentLineReference: utils_ts_1.journalReference.to.shipment(faSoLine.id),
                        journalLineReference: nbvJlRef,
                        companyId: companyId_1,
                    });
                    journalLineDimensionsMeta_1.push({
                        customerTypeId: (_84 = customer.data.customerTypeId) !== null && _84 !== void 0 ? _84 : null,
                        itemPostingGroupId: null,
                        locationId: (_85 = locationId_1 !== null && locationId_1 !== void 0 ? locationId_1 : assetRecord.data.locationId) !== null && _85 !== void 0 ? _85 : null,
                        costCenterId: (_86 = faSoLine.costCenterId) !== null && _86 !== void 0 ? _86 : null,
                        fixedAssetClassId: (_87 = assetRecord.data.fixedAssetClassId) !== null && _87 !== void 0 ? _87 : null,
                    });
                }
                removeJlRef = (0, mod_ts_2.nanoid)();
                journalLineInserts_1.push({
                    accountId: assetClass.assetAccountId,
                    description: "Remove asset at cost",
                    amount: (0, utils_ts_1.credit)("asset", acquisitionCost),
                    quantity: 1,
                    documentType: "Sales Shipment",
                    documentId: (_88 = shipment_1.data) === null || _88 === void 0 ? void 0 : _88.id,
                    externalDocumentId: (_90 = (_89 = salesOrder_1.data) === null || _89 === void 0 ? void 0 : _89.customerReference) !== null && _90 !== void 0 ? _90 : undefined,
                    documentLineReference: utils_ts_1.journalReference.to.shipment(faSoLine.id),
                    journalLineReference: removeJlRef,
                    companyId: companyId_1,
                });
                journalLineDimensionsMeta_1.push({
                    customerTypeId: (_91 = customer.data.customerTypeId) !== null && _91 !== void 0 ? _91 : null,
                    itemPostingGroupId: null,
                    locationId: (_92 = locationId_1 !== null && locationId_1 !== void 0 ? locationId_1 : assetRecord.data.locationId) !== null && _92 !== void 0 ? _92 : null,
                    costCenterId: (_93 = faSoLine.costCenterId) !== null && _93 !== void 0 ? _93 : null,
                    fixedAssetClassId: (_94 = assetRecord.data.fixedAssetClassId) !== null && _94 !== void 0 ? _94 : null,
                });
                return [4 /*yield*/, client
                        .from("fixedAsset")
                        .update({
                        status: "Disposed",
                        disposalDate: today,
                        disposalMethod: "Sale",
                        updatedBy: userId_1,
                    })
                        .eq("id", faSoLine.assetId)];
            case 32:
                _141.sent();
                return [4 /*yield*/, client.from("fixedAssetDisposal").insert({
                        fixedAssetId: faSoLine.assetId,
                        disposalMethod: "Sale",
                        disposalDate: today,
                        saleProceeds: 0,
                        netBookValueAtDisposal: nbv,
                        gainLoss: -nbv,
                        companyId: companyId_1,
                        createdBy: userId_1,
                    })];
            case 33:
                _141.sent();
                _141.label = 34;
            case 34:
                salesOrderLineUpdates_1[faSoLine.id] = {
                    quantitySent: faSoLine.saleQuantity,
                    sentComplete: true,
                    sentDate: today,
                };
                _141.label = 35;
            case 35:
                _p++;
                return [3 /*break*/, 30];
            case 36:
                trackedEntitySplits_1 = {};
                trackedEntityUpdates_1 = (_96 = (_95 = shipmentLineTracking.data) === null || _95 === void 0 ? void 0 : _95.reduce(function (acc, trackedEntity) {
                    var _a, _b, _c, _d;
                    var shipmentLine = (_a = shipmentLines_1.data) === null || _a === void 0 ? void 0 : _a.find(function (shipmentLine) {
                        var _a;
                        return shipmentLine.id ===
                            ((_a = trackedEntity.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                    });
                    if ((shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine.shippedQuantity) !== undefined &&
                        trackedEntity.quantity !== undefined &&
                        shipmentLine.shippedQuantity < trackedEntity.quantity) {
                        // Need to split the batch
                        trackedEntitySplits_1[trackedEntity.id] = {
                            originalEntityId: trackedEntity.id,
                            originalQuantity: trackedEntity.quantity,
                            shippedQuantity: shipmentLine.shippedQuantity,
                            remainingQuantity: trackedEntity.quantity - shipmentLine.shippedQuantity,
                            readableId: trackedEntity.readableId,
                            attributes: trackedEntity.attributes,
                            sourceDocument: trackedEntity.sourceDocument,
                            sourceDocumentId: trackedEntity.sourceDocumentId,
                            sourceDocumentReadableId: trackedEntity.sourceDocumentReadableId,
                            companyId: trackedEntity.companyId,
                            itemId: (_b = trackedEntity.itemId) !== null && _b !== void 0 ? _b : null,
                            expirationDate: (_c = trackedEntity.expirationDate) !== null && _c !== void 0 ? _c : null,
                        };
                    }
                    acc[trackedEntity.id] = {
                        status: "Consumed",
                        quantity: (_d = shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine.shippedQuantity) !== null && _d !== void 0 ? _d : trackedEntity.quantity,
                    };
                    return acc;
                }, {})) !== null && _96 !== void 0 ? _96 : {};
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 37:
                accountingPeriodId_1 = _141.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, salesOrderLineId, update, e_8_1, salesOrderLines, areAllLinesInvoiced, areAllLinesShipped, status, trackedActivity, trackedActivityId, _loop_9, _d, _e, _f, e_9_1, _g, _h, _j, id, update, e_10_1, _k, _l, _m, jobId, update, e_11_1, itemShipmentQuantities, _loop_10, i, _i, itemShipmentQuantities_1, _o, itemId, info, cogsResult, costAssigned, idx, jlIdx, lineQty, lineCost, journalEntryId, journalResult_1, journalLineResults, journalLineDimensionInserts_1;
                        var _p, e_8, _q, _r, _s, e_9, _t, _u, _v, e_10, _w, _x, _y, e_11, _z, _0;
                        var _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
                        return __generator(this, function (_13) {
                            switch (_13.label) {
                                case 0:
                                    _13.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(salesOrderLineUpdates_1));
                                    _13.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _13.sent(), _p = _c.done, !_p)) return [3 /*break*/, 5];
                                    _r = _c.value;
                                    _a = false;
                                    salesOrderLineId = _r[0], update = _r[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("salesOrderLine")
                                            .set(update)
                                            .where("id", "=", salesOrderLineId)
                                            .execute()];
                                case 3:
                                    _13.sent();
                                    _13.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_8_1 = _13.sent();
                                    e_8 = { error: e_8_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _13.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_p && (_q = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _q.call(_b)];
                                case 8:
                                    _13.sent();
                                    _13.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_8) throw e_8.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [4 /*yield*/, trx
                                        .selectFrom("salesOrderLine")
                                        .select([
                                        "id",
                                        "salesOrderLineType",
                                        "invoicedComplete",
                                        "sentComplete",
                                    ])
                                        .where("salesOrderId", "=", salesOrder_1.data.id)
                                        .execute()];
                                case 13:
                                    salesOrderLines = _13.sent();
                                    areAllLinesInvoiced = salesOrderLines.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.invoicedComplete;
                                    });
                                    areAllLinesShipped = salesOrderLines.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.sentComplete;
                                    });
                                    status = "To Ship and Invoice";
                                    if (areAllLinesInvoiced && areAllLinesShipped) {
                                        status = "Completed";
                                    }
                                    else if (areAllLinesShipped) {
                                        status = "To Invoice";
                                    }
                                    else if (areAllLinesInvoiced) {
                                        status = "To Ship";
                                    }
                                    return [4 /*yield*/, trx
                                            .updateTable("salesOrder")
                                            .set({
                                            status: status,
                                        })
                                            .where("id", "=", salesOrder_1.data.id)
                                            .execute()];
                                case 14:
                                    _13.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            status: "Posted",
                                            postingDate: today,
                                            postedBy: userId_1,
                                        })
                                            .where("id", "=", shipmentId_1)
                                            .execute()];
                                case 15:
                                    _13.sent();
                                    if (!(Object.keys(trackedEntityUpdates_1).length > 0)) return [3 /*break*/, 42];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            type: "Shipment",
                                            sourceDocument: "Shipment",
                                            sourceDocumentId: shipmentId_1,
                                            sourceDocumentReadableId: shipment_1.data.shipmentId,
                                            attributes: {
                                                Shipment: shipmentId_1,
                                                "Sales Order": salesOrder_1.data.id,
                                            },
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 16:
                                    trackedActivity = _13.sent();
                                    trackedActivityId = trackedActivity[0].id;
                                    _13.label = 17;
                                case 17:
                                    _13.trys.push([17, 23, 24, 29]);
                                    _loop_9 = function () {
                                        var splitInfo, splitActivity, splitActivityId, newTrackedEntity, newTrackedEntityId, originalEntity, updatedAttributes, updatedAttributesObj;
                                        return __generator(this, function (_14) {
                                            switch (_14.label) {
                                                case 0:
                                                    _u = _f.value;
                                                    _d = false;
                                                    splitInfo = _u;
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivity")
                                                            .values({
                                                            type: "Split",
                                                            sourceDocument: "Shipment",
                                                            sourceDocumentId: shipmentId_1,
                                                            sourceDocumentReadableId: shipment_1.data.shipmentId,
                                                            attributes: {
                                                                "Original Quantity": splitInfo.originalQuantity,
                                                                "Shipped Quantity": splitInfo.shippedQuantity,
                                                                "Remaining Quantity": splitInfo.remainingQuantity,
                                                            },
                                                            companyId: splitInfo.companyId,
                                                            createdBy: userId_1,
                                                            createdAt: today,
                                                        })
                                                            .returning(["id"])
                                                            .execute()];
                                                case 1:
                                                    splitActivity = _14.sent();
                                                    splitActivityId = splitActivity[0].id;
                                                    // Record the original entity as input to the split
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivityInput")
                                                            .values({
                                                            trackedActivityId: splitActivityId,
                                                            trackedEntityId: splitInfo.originalEntityId,
                                                            quantity: splitInfo.originalQuantity,
                                                            companyId: splitInfo.companyId,
                                                            createdBy: userId_1,
                                                            createdAt: today,
                                                        })
                                                            .execute()];
                                                case 2:
                                                    // Record the original entity as input to the split
                                                    _14.sent();
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedEntity")
                                                            .values({
                                                            readableId: splitInfo.readableId,
                                                            quantity: splitInfo.remainingQuantity,
                                                            status: "Available",
                                                            sourceDocument: splitInfo.sourceDocument,
                                                            sourceDocumentId: splitInfo.sourceDocumentId,
                                                            sourceDocumentReadableId: splitInfo.sourceDocumentReadableId,
                                                            attributes: splitInfo.attributes,
                                                            itemId: splitInfo.itemId,
                                                            expirationDate: splitInfo.expirationDate,
                                                            companyId: splitInfo.companyId,
                                                            createdBy: userId_1,
                                                            createdAt: today,
                                                        })
                                                            .returning(["id"])
                                                            .execute()];
                                                case 3:
                                                    newTrackedEntity = _14.sent();
                                                    newTrackedEntityId = newTrackedEntity[0].id;
                                                    splitEntityIds_1.push(newTrackedEntityId);
                                                    return [4 /*yield*/, trx
                                                            .selectFrom("trackedEntity")
                                                            .select(["attributes"])
                                                            .where("id", "=", splitInfo.originalEntityId)
                                                            .executeTakeFirst()];
                                                case 4:
                                                    originalEntity = _14.sent();
                                                    if (!originalEntity) return [3 /*break*/, 6];
                                                    updatedAttributes = __assign(__assign({}, (originalEntity.attributes ||
                                                        {})), { "Split Entity ID": newTrackedEntityId });
                                                    updatedAttributesObj = __assign({}, (originalEntity.attributes ||
                                                        {}));
                                                    // Delete shipment-related attributes
                                                    delete updatedAttributesObj["Shipment"];
                                                    delete updatedAttributesObj["Shipment Line"];
                                                    delete updatedAttributesObj["Shipment Line Index"];
                                                    // Add the split entity reference
                                                    updatedAttributesObj["Split Entity ID"] =
                                                        newTrackedEntityId;
                                                    // Update the original entity with the reference to the new split entity
                                                    return [4 /*yield*/, trx
                                                            .updateTable("trackedEntity")
                                                            .set({
                                                            attributes: updatedAttributes,
                                                        })
                                                            .where("id", "=", splitInfo.originalEntityId)
                                                            .execute()];
                                                case 5:
                                                    // Update the original entity with the reference to the new split entity
                                                    _14.sent();
                                                    _14.label = 6;
                                                case 6: 
                                                // Record the new entity as output from the split
                                                return [4 /*yield*/, trx
                                                        .insertInto("trackedActivityOutput")
                                                        .values({
                                                        trackedActivityId: splitActivityId,
                                                        trackedEntityId: newTrackedEntityId,
                                                        quantity: splitInfo.remainingQuantity,
                                                        companyId: splitInfo.companyId,
                                                        createdBy: userId_1,
                                                        createdAt: today,
                                                    })
                                                        .execute()];
                                                case 7:
                                                    // Record the new entity as output from the split
                                                    _14.sent();
                                                    // Record the shipped portion as output (will be consumed by shipment)
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivityOutput")
                                                            .values({
                                                            trackedActivityId: splitActivityId,
                                                            trackedEntityId: splitInfo.originalEntityId,
                                                            quantity: splitInfo.shippedQuantity,
                                                            companyId: splitInfo.companyId,
                                                            createdBy: userId_1,
                                                            createdAt: today,
                                                        })
                                                            .execute()];
                                                case 8:
                                                    // Record the shipped portion as output (will be consumed by shipment)
                                                    _14.sent();
                                                    itemLedgerInserts_1.push({
                                                        postingDate: today,
                                                        itemId: (_1 = shipmentLines_1.data.find(function (sl) {
                                                            var _a;
                                                            return sl.id ===
                                                                ((_a = splitInfo.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                                                        })) === null || _1 === void 0 ? void 0 : _1.itemId,
                                                        quantity: -splitInfo.originalQuantity,
                                                        locationId: locationId_1,
                                                        storageUnitId: (_2 = shipmentLines_1.data.find(function (sl) {
                                                            var _a;
                                                            return sl.id ===
                                                                ((_a = splitInfo.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                                                        })) === null || _2 === void 0 ? void 0 : _2.storageUnitId,
                                                        entryType: "Negative Adjmt.",
                                                        documentType: "Batch Split",
                                                        documentId: splitActivityId,
                                                        trackedEntityId: splitInfo.originalEntityId,
                                                        createdBy: userId_1,
                                                        companyId: companyId_1,
                                                    });
                                                    itemLedgerInserts_1.push({
                                                        postingDate: today,
                                                        itemId: (_3 = shipmentLines_1.data.find(function (sl) {
                                                            var _a;
                                                            return sl.id ===
                                                                ((_a = splitInfo.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                                                        })) === null || _3 === void 0 ? void 0 : _3.itemId,
                                                        quantity: splitInfo.shippedQuantity,
                                                        locationId: locationId_1,
                                                        storageUnitId: (_4 = shipmentLines_1.data.find(function (sl) {
                                                            var _a;
                                                            return sl.id ===
                                                                ((_a = splitInfo.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                                                        })) === null || _4 === void 0 ? void 0 : _4.storageUnitId,
                                                        entryType: "Positive Adjmt.",
                                                        documentType: "Batch Split",
                                                        documentId: splitActivityId,
                                                        trackedEntityId: splitInfo.originalEntityId,
                                                        createdBy: userId_1,
                                                        companyId: companyId_1,
                                                    });
                                                    itemLedgerInserts_1.push({
                                                        postingDate: today,
                                                        itemId: (_5 = shipmentLines_1.data.find(function (sl) {
                                                            var _a;
                                                            return sl.id ===
                                                                ((_a = splitInfo.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                                                        })) === null || _5 === void 0 ? void 0 : _5.itemId,
                                                        quantity: splitInfo.remainingQuantity,
                                                        locationId: locationId_1,
                                                        storageUnitId: (_6 = shipmentLines_1.data.find(function (sl) {
                                                            var _a;
                                                            return sl.id ===
                                                                ((_a = splitInfo.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                                                        })) === null || _6 === void 0 ? void 0 : _6.storageUnitId,
                                                        entryType: "Positive Adjmt.",
                                                        documentType: "Batch Split",
                                                        documentId: splitActivityId,
                                                        trackedEntityId: newTrackedEntityId,
                                                        createdBy: userId_1,
                                                        companyId: companyId_1,
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _d = true, _e = __asyncValues(Object.values(trackedEntitySplits_1));
                                    _13.label = 18;
                                case 18: return [4 /*yield*/, _e.next()];
                                case 19:
                                    if (!(_f = _13.sent(), _s = _f.done, !_s)) return [3 /*break*/, 22];
                                    return [5 /*yield**/, _loop_9()];
                                case 20:
                                    _13.sent();
                                    _13.label = 21;
                                case 21:
                                    _d = true;
                                    return [3 /*break*/, 18];
                                case 22: return [3 /*break*/, 29];
                                case 23:
                                    e_9_1 = _13.sent();
                                    e_9 = { error: e_9_1 };
                                    return [3 /*break*/, 29];
                                case 24:
                                    _13.trys.push([24, , 27, 28]);
                                    if (!(!_d && !_s && (_t = _e.return))) return [3 /*break*/, 26];
                                    return [4 /*yield*/, _t.call(_e)];
                                case 25:
                                    _13.sent();
                                    _13.label = 26;
                                case 26: return [3 /*break*/, 28];
                                case 27:
                                    if (e_9) throw e_9.error;
                                    return [7 /*endfinally*/];
                                case 28: return [7 /*endfinally*/];
                                case 29:
                                    _13.trys.push([29, 36, 37, 42]);
                                    _g = true, _h = __asyncValues(Object.entries(trackedEntityUpdates_1));
                                    _13.label = 30;
                                case 30: return [4 /*yield*/, _h.next()];
                                case 31:
                                    if (!(_j = _13.sent(), _v = _j.done, !_v)) return [3 /*break*/, 35];
                                    _x = _j.value;
                                    _g = false;
                                    id = _x[0], update = _x[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set(update)
                                            .where("id", "=", id)
                                            .execute()];
                                case 32:
                                    _13.sent();
                                    if (!trackedActivityId) return [3 /*break*/, 34];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: trackedActivityId,
                                            trackedEntityId: id,
                                            quantity: (_7 = update.quantity) !== null && _7 !== void 0 ? _7 : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 33:
                                    _13.sent();
                                    _13.label = 34;
                                case 34:
                                    _g = true;
                                    return [3 /*break*/, 30];
                                case 35: return [3 /*break*/, 42];
                                case 36:
                                    e_10_1 = _13.sent();
                                    e_10 = { error: e_10_1 };
                                    return [3 /*break*/, 42];
                                case 37:
                                    _13.trys.push([37, , 40, 41]);
                                    if (!(!_g && !_v && (_w = _h.return))) return [3 /*break*/, 39];
                                    return [4 /*yield*/, _w.call(_h)];
                                case 38:
                                    _13.sent();
                                    _13.label = 39;
                                case 39: return [3 /*break*/, 41];
                                case 40:
                                    if (e_10) throw e_10.error;
                                    return [7 /*endfinally*/];
                                case 41: return [7 /*endfinally*/];
                                case 42:
                                    if (!(itemLedgerInserts_1.length > 0)) return [3 /*break*/, 44];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_1)
                                            .returning(["id"])
                                            .execute()];
                                case 43:
                                    _13.sent();
                                    _13.label = 44;
                                case 44:
                                    if (!(Object.keys(jobUpdates_1).length > 0)) return [3 /*break*/, 57];
                                    console.log("Final job updates to be applied:", jobUpdates_1);
                                    _13.label = 45;
                                case 45:
                                    _13.trys.push([45, 51, 52, 57]);
                                    _k = true, _l = __asyncValues(Object.entries(jobUpdates_1));
                                    _13.label = 46;
                                case 46: return [4 /*yield*/, _l.next()];
                                case 47:
                                    if (!(_m = _13.sent(), _y = _m.done, !_y)) return [3 /*break*/, 50];
                                    _0 = _m.value;
                                    _k = false;
                                    jobId = _0[0], update = _0[1];
                                    console.log("Updating job ".concat(jobId, " with:"), update);
                                    return [4 /*yield*/, trx
                                            .updateTable("job")
                                            .set(update)
                                            .where("id", "=", jobId)
                                            .execute()];
                                case 48:
                                    _13.sent();
                                    _13.label = 49;
                                case 49:
                                    _k = true;
                                    return [3 /*break*/, 46];
                                case 50: return [3 /*break*/, 57];
                                case 51:
                                    e_11_1 = _13.sent();
                                    e_11 = { error: e_11_1 };
                                    return [3 /*break*/, 57];
                                case 52:
                                    _13.trys.push([52, , 55, 56]);
                                    if (!(!_k && !_y && (_z = _l.return))) return [3 /*break*/, 54];
                                    return [4 /*yield*/, _z.call(_l)];
                                case 53:
                                    _13.sent();
                                    _13.label = 54;
                                case 54: return [3 /*break*/, 56];
                                case 55:
                                    if (e_11) throw e_11.error;
                                    return [7 /*endfinally*/];
                                case 56: return [7 /*endfinally*/];
                                case 57:
                                    if (!(accountingEnabled_1 && journalLineInserts_1.length > 0)) return [3 /*break*/, 67];
                                    itemShipmentQuantities = new Map();
                                    _loop_10 = function (i) {
                                        var jl = journalLineInserts_1[i];
                                        var ref = jl.documentLineReference;
                                        var shipmentLine = shipmentLines_1.data.find(function (sl) { return ref === utils_ts_1.journalReference.to.shipment(sl.id); });
                                        if (!(shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine.itemId))
                                            return "continue";
                                        var existing = itemShipmentQuantities.get(shipmentLine.itemId);
                                        if (existing) {
                                            existing.totalQuantity += (_8 = jl.quantity) !== null && _8 !== void 0 ? _8 : 0;
                                            existing.lineIndices.push(i);
                                        }
                                        else {
                                            itemShipmentQuantities.set(shipmentLine.itemId, {
                                                totalQuantity: (_9 = jl.quantity) !== null && _9 !== void 0 ? _9 : 0,
                                                lineIndices: [i],
                                            });
                                        }
                                    };
                                    for (i = 0; i < journalLineInserts_1.length; i += 2) {
                                        _loop_10(i);
                                    }
                                    _i = 0, itemShipmentQuantities_1 = itemShipmentQuantities;
                                    _13.label = 58;
                                case 58:
                                    if (!(_i < itemShipmentQuantities_1.length)) return [3 /*break*/, 62];
                                    _o = itemShipmentQuantities_1[_i], itemId = _o[0], info = _o[1];
                                    return [4 /*yield*/, (0, calculate_cogs_ts_1.calculateCOGS)(trx, {
                                            itemId: itemId,
                                            quantity: info.totalQuantity,
                                            companyId: companyId_1,
                                        })];
                                case 59:
                                    cogsResult = _13.sent();
                                    costAssigned = 0;
                                    for (idx = 0; idx < info.lineIndices.length; idx++) {
                                        jlIdx = info.lineIndices[idx];
                                        lineQty = (_10 = journalLineInserts_1[jlIdx].quantity) !== null && _10 !== void 0 ? _10 : 0;
                                        lineCost = idx === info.lineIndices.length - 1
                                            ? cogsResult.totalCost - costAssigned
                                            : (lineQty / info.totalQuantity) * cogsResult.totalCost;
                                        costAssigned += lineCost;
                                        journalLineInserts_1[jlIdx].amount = (0, utils_ts_1.debit)("expense", lineCost);
                                        journalLineInserts_1[jlIdx + 1].amount = (0, utils_ts_1.credit)("asset", lineCost);
                                    }
                                    return [4 /*yield*/, trx
                                            .insertInto("costLedger")
                                            .values({
                                            itemLedgerType: "Sale",
                                            costLedgerType: "Direct Cost",
                                            adjustment: false,
                                            documentType: "Sales Shipment",
                                            documentId: (_12 = (_11 = shipment_1.data) === null || _11 === void 0 ? void 0 : _11.id) !== null && _12 !== void 0 ? _12 : "",
                                            itemId: itemId,
                                            quantity: -info.totalQuantity,
                                            cost: -cogsResult.totalCost,
                                            remainingQuantity: 0,
                                            companyId: companyId_1,
                                        })
                                            .execute()];
                                case 60:
                                    _13.sent();
                                    _13.label = 61;
                                case 61:
                                    _i++;
                                    return [3 /*break*/, 58];
                                case 62: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 63:
                                    journalEntryId = _13.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            accountingPeriodId: accountingPeriodId_1,
                                            description: "Sales Shipment ".concat(shipment_1.data.shipmentId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Sales Shipment",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 64:
                                    journalResult_1 = _13.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts_1.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult_1.id })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 65:
                                    journalLineResults = _13.sent();
                                    if (!(dimensionMap_1.size > 0)) return [3 /*break*/, 67];
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
                                    if (!(journalLineDimensionInserts_1.length > 0)) return [3 /*break*/, 67];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLineDimension")
                                            .values(journalLineDimensionInserts_1)
                                            .execute()];
                                case 66:
                                    _13.sent();
                                    _13.label = 67;
                                case 67: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 38:
                _141.sent();
                return [3 /*break*/, 71];
            case 39:
                if (!shipment_1.data.sourceDocumentId)
                    throw new Error("Shipment has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("*")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", shipment_1.data.sourceDocumentId),
                    ])];
            case 40:
                _q = _141.sent(), purchaseOrder_1 = _q[0], purchaseOrderLines = _q[1];
                if (purchaseOrder_1.error)
                    throw new Error("Failed to fetch purchase order");
                if (purchaseOrderLines.error)
                    throw new Error("Failed to fetch purchase order lines");
                return [4 /*yield*/, client
                        .from("supplier")
                        .select("*")
                        .eq("id", purchaseOrder_1.data.supplierId)
                        .eq("companyId", companyId_1)
                        .single()];
            case 41:
                supplier = _141.sent();
                if (supplier.error)
                    throw new Error("Failed to fetch supplier");
                jobOperationsUpdates_1 = {};
                _141.label = 42;
            case 42:
                _141.trys.push([42, 47, 48, 53]);
                _loop_2 = function () {
                    _21 = _t.value;
                    _r = false;
                    var shipmentLine = _21;
                    var purchaseOrderLine = purchaseOrderLines.data.find(function (pol) { return pol.id === shipmentLine.lineId; });
                    if ((purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.jobId) &&
                        purchaseOrderLine.jobOperationId) {
                        // Update quantity shipped on job, accumulating totals from multiple shipments
                        var jobOperationId = purchaseOrderLine.jobOperationId;
                        jobOperationsUpdates_1[jobOperationId] = {
                            status: "In Progress",
                        };
                        return "continue";
                    }
                };
                _r = true, _s = __asyncValues(shipmentLines_1.data);
                _141.label = 43;
            case 43: return [4 /*yield*/, _s.next()];
            case 44:
                if (!(_t = _141.sent(), _19 = _t.done, !_19)) return [3 /*break*/, 46];
                _loop_2();
                _141.label = 45;
            case 45:
                _r = true;
                return [3 /*break*/, 43];
            case 46: return [3 /*break*/, 53];
            case 47:
                e_2_1 = _141.sent();
                e_2 = { error: e_2_1 };
                return [3 /*break*/, 53];
            case 48:
                _141.trys.push([48, , 51, 52]);
                if (!(!_r && !_19 && (_20 = _s.return))) return [3 /*break*/, 50];
                return [4 /*yield*/, _20.call(_s)];
            case 49:
                _141.sent();
                _141.label = 50;
            case 50: return [3 /*break*/, 52];
            case 51:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
            case 52: return [7 /*endfinally*/];
            case 53:
                shipmentLinesByPurchaseOrderLineId_1 = shipmentLines_1.data.reduce(function (acc, shipmentLine) {
                    var _a;
                    if (shipmentLine.lineId) {
                        acc[shipmentLine.lineId] = __spreadArray(__spreadArray([], ((_a = acc[shipmentLine.lineId]) !== null && _a !== void 0 ? _a : []), true), [
                            shipmentLine,
                        ], false);
                    }
                    return acc;
                }, {});
                purchaseOrderLineUpdates_1 = purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                    var _a;
                    var _b;
                    var shipmentLines = shipmentLinesByPurchaseOrderLineId_1[purchaseOrderLine.id];
                    if (shipmentLines &&
                        shipmentLines.length > 0 &&
                        purchaseOrderLine.purchaseQuantity &&
                        purchaseOrderLine.purchaseQuantity > 0) {
                        var shippedQuantity = shipmentLines.reduce(function (acc, shipmentLine) {
                            var safeShippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                                shipmentLine.shippedQuantity == null
                                ? 0
                                : shipmentLine.shippedQuantity;
                            return acc + safeShippedQuantity;
                        }, 0);
                        var newQuantityShipped = ((_b = purchaseOrderLine.quantityShipped) !== null && _b !== void 0 ? _b : 0) + shippedQuantity;
                        var updates = __assign(__assign({}, acc), (_a = {}, _a[purchaseOrderLine.id] = {
                            quantityShipped: newQuantityShipped,
                        }, _a));
                        return updates;
                    }
                    return acc;
                }, {});
                trackedEntitySplits_2 = {};
                trackedEntityUpdates_2 = (_98 = (_97 = shipmentLineTracking.data) === null || _97 === void 0 ? void 0 : _97.reduce(function (acc, trackedEntity) {
                    var _a, _b, _c, _d;
                    var shipmentLine = (_a = shipmentLines_1.data) === null || _a === void 0 ? void 0 : _a.find(function (shipmentLine) {
                        var _a;
                        return shipmentLine.id ===
                            ((_a = trackedEntity.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                    });
                    if ((shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine.shippedQuantity) !== undefined &&
                        trackedEntity.quantity !== undefined &&
                        shipmentLine.shippedQuantity < trackedEntity.quantity) {
                        // Need to split the batch
                        trackedEntitySplits_2[trackedEntity.id] = {
                            originalEntityId: trackedEntity.id,
                            originalQuantity: trackedEntity.quantity,
                            shippedQuantity: shipmentLine.shippedQuantity,
                            remainingQuantity: trackedEntity.quantity - shipmentLine.shippedQuantity,
                            readableId: trackedEntity.readableId,
                            attributes: trackedEntity.attributes,
                            sourceDocument: trackedEntity.sourceDocument,
                            sourceDocumentId: trackedEntity.sourceDocumentId,
                            sourceDocumentReadableId: trackedEntity.sourceDocumentReadableId,
                            companyId: trackedEntity.companyId,
                            itemId: (_b = trackedEntity.itemId) !== null && _b !== void 0 ? _b : null,
                            expirationDate: (_c = trackedEntity.expirationDate) !== null && _c !== void 0 ? _c : null,
                        };
                    }
                    acc[trackedEntity.id] = {
                        quantity: (_d = shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine.shippedQuantity) !== null && _d !== void 0 ? _d : trackedEntity.quantity,
                    };
                    return acc;
                }, {})) !== null && _98 !== void 0 ? _98 : {};
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, purchaseOrderLineId, update, e_12_1, trackedActivity, trackedActivityId, _d, _e, _f, splitInfo, splitActivity, splitActivityId, newTrackedEntity, newTrackedEntityId, originalEntity, updatedAttributes, updatedAttributesObj, e_13_1, _g, _h, _j, id, update, e_14_1, _k, _l, _m, jobOperationId, update, e_15_1;
                        var _o, e_12, _p, _q, _r, e_13, _s, _t, _u, e_14, _v, _w, _x, e_15, _y, _z;
                        var _0;
                        return __generator(this, function (_1) {
                            switch (_1.label) {
                                case 0:
                                    _1.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(purchaseOrderLineUpdates_1));
                                    _1.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _1.sent(), _o = _c.done, !_o)) return [3 /*break*/, 5];
                                    _q = _c.value;
                                    _a = false;
                                    purchaseOrderLineId = _q[0], update = _q[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("purchaseOrderLine")
                                            .set(update)
                                            .where("id", "=", purchaseOrderLineId)
                                            .execute()];
                                case 3:
                                    _1.sent();
                                    _1.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_12_1 = _1.sent();
                                    e_12 = { error: e_12_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _1.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_o && (_p = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _p.call(_b)];
                                case 8:
                                    _1.sent();
                                    _1.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_12) throw e_12.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [4 /*yield*/, trx
                                        .updateTable("shipment")
                                        .set({
                                        status: "Posted",
                                        postingDate: today,
                                        postedBy: userId_1,
                                    })
                                        .where("id", "=", shipmentId_1)
                                        .execute()];
                                case 13:
                                    _1.sent();
                                    if (!(Object.keys(trackedEntityUpdates_2).length > 0)) return [3 /*break*/, 47];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            type: "Shipment",
                                            sourceDocument: "Shipment",
                                            sourceDocumentId: shipmentId_1,
                                            sourceDocumentReadableId: shipment_1.data.shipmentId,
                                            attributes: {
                                                Shipment: shipmentId_1,
                                                "Purchase Order": purchaseOrder_1.data.id,
                                            },
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 14:
                                    trackedActivity = _1.sent();
                                    trackedActivityId = trackedActivity[0].id;
                                    _1.label = 15;
                                case 15:
                                    _1.trys.push([15, 28, 29, 34]);
                                    _d = true, _e = __asyncValues(Object.values(trackedEntitySplits_2));
                                    _1.label = 16;
                                case 16: return [4 /*yield*/, _e.next()];
                                case 17:
                                    if (!(_f = _1.sent(), _r = _f.done, !_r)) return [3 /*break*/, 27];
                                    _t = _f.value;
                                    _d = false;
                                    splitInfo = _t;
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            type: "Split",
                                            sourceDocument: "Shipment",
                                            sourceDocumentId: shipmentId_1,
                                            sourceDocumentReadableId: shipment_1.data.shipmentId,
                                            attributes: {
                                                "Original Quantity": splitInfo.originalQuantity,
                                                "Shipped Quantity": splitInfo.shippedQuantity,
                                                "Remaining Quantity": splitInfo.remainingQuantity,
                                            },
                                            companyId: splitInfo.companyId,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 18:
                                    splitActivity = _1.sent();
                                    splitActivityId = splitActivity[0].id;
                                    // Record the original entity as input to the split
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: splitActivityId,
                                            trackedEntityId: splitInfo.originalEntityId,
                                            quantity: splitInfo.originalQuantity,
                                            companyId: splitInfo.companyId,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 19:
                                    // Record the original entity as input to the split
                                    _1.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedEntity")
                                            .values({
                                            readableId: splitInfo.readableId,
                                            quantity: splitInfo.remainingQuantity,
                                            status: "Available",
                                            sourceDocument: splitInfo.sourceDocument,
                                            sourceDocumentId: splitInfo.sourceDocumentId,
                                            sourceDocumentReadableId: splitInfo.sourceDocumentReadableId,
                                            attributes: splitInfo.attributes,
                                            itemId: splitInfo.itemId,
                                            expirationDate: splitInfo.expirationDate,
                                            companyId: splitInfo.companyId,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 20:
                                    newTrackedEntity = _1.sent();
                                    newTrackedEntityId = newTrackedEntity[0].id;
                                    splitEntityIds_1.push(newTrackedEntityId);
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .select(["attributes"])
                                            .where("id", "=", splitInfo.originalEntityId)
                                            .executeTakeFirst()];
                                case 21:
                                    originalEntity = _1.sent();
                                    if (!originalEntity) return [3 /*break*/, 23];
                                    updatedAttributes = __assign(__assign({}, (originalEntity.attributes ||
                                        {})), { "Split Entity ID": newTrackedEntityId });
                                    updatedAttributesObj = __assign({}, (originalEntity.attributes ||
                                        {}));
                                    // Delete shipment-related attributes
                                    delete updatedAttributesObj["Shipment"];
                                    delete updatedAttributesObj["Shipment Line"];
                                    delete updatedAttributesObj["Shipment Line Index"];
                                    // Add the split entity reference
                                    updatedAttributesObj["Split Entity ID"] =
                                        newTrackedEntityId;
                                    // Update the original entity with the reference to the new split entity
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            attributes: updatedAttributes,
                                        })
                                            .where("id", "=", splitInfo.originalEntityId)
                                            .execute()];
                                case 22:
                                    // Update the original entity with the reference to the new split entity
                                    _1.sent();
                                    _1.label = 23;
                                case 23: 
                                // Record the new entity as output from the split
                                return [4 /*yield*/, trx
                                        .insertInto("trackedActivityOutput")
                                        .values({
                                        trackedActivityId: splitActivityId,
                                        trackedEntityId: newTrackedEntityId,
                                        quantity: splitInfo.remainingQuantity,
                                        companyId: splitInfo.companyId,
                                        createdBy: userId_1,
                                        createdAt: today,
                                    })
                                        .execute()];
                                case 24:
                                    // Record the new entity as output from the split
                                    _1.sent();
                                    // Record the shipped portion as output (will be consumed by shipment)
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: splitActivityId,
                                            trackedEntityId: splitInfo.originalEntityId,
                                            quantity: splitInfo.shippedQuantity,
                                            companyId: splitInfo.companyId,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 25:
                                    // Record the shipped portion as output (will be consumed by shipment)
                                    _1.sent();
                                    _1.label = 26;
                                case 26:
                                    _d = true;
                                    return [3 /*break*/, 16];
                                case 27: return [3 /*break*/, 34];
                                case 28:
                                    e_13_1 = _1.sent();
                                    e_13 = { error: e_13_1 };
                                    return [3 /*break*/, 34];
                                case 29:
                                    _1.trys.push([29, , 32, 33]);
                                    if (!(!_d && !_r && (_s = _e.return))) return [3 /*break*/, 31];
                                    return [4 /*yield*/, _s.call(_e)];
                                case 30:
                                    _1.sent();
                                    _1.label = 31;
                                case 31: return [3 /*break*/, 33];
                                case 32:
                                    if (e_13) throw e_13.error;
                                    return [7 /*endfinally*/];
                                case 33: return [7 /*endfinally*/];
                                case 34:
                                    _1.trys.push([34, 41, 42, 47]);
                                    _g = true, _h = __asyncValues(Object.entries(trackedEntityUpdates_2));
                                    _1.label = 35;
                                case 35: return [4 /*yield*/, _h.next()];
                                case 36:
                                    if (!(_j = _1.sent(), _u = _j.done, !_u)) return [3 /*break*/, 40];
                                    _w = _j.value;
                                    _g = false;
                                    id = _w[0], update = _w[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set(update)
                                            .where("id", "=", id)
                                            .execute()];
                                case 37:
                                    _1.sent();
                                    if (!trackedActivityId) return [3 /*break*/, 39];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: trackedActivityId,
                                            trackedEntityId: id,
                                            quantity: (_0 = update.quantity) !== null && _0 !== void 0 ? _0 : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 38:
                                    _1.sent();
                                    _1.label = 39;
                                case 39:
                                    _g = true;
                                    return [3 /*break*/, 35];
                                case 40: return [3 /*break*/, 47];
                                case 41:
                                    e_14_1 = _1.sent();
                                    e_14 = { error: e_14_1 };
                                    return [3 /*break*/, 47];
                                case 42:
                                    _1.trys.push([42, , 45, 46]);
                                    if (!(!_g && !_u && (_v = _h.return))) return [3 /*break*/, 44];
                                    return [4 /*yield*/, _v.call(_h)];
                                case 43:
                                    _1.sent();
                                    _1.label = 44;
                                case 44: return [3 /*break*/, 46];
                                case 45:
                                    if (e_14) throw e_14.error;
                                    return [7 /*endfinally*/];
                                case 46: return [7 /*endfinally*/];
                                case 47:
                                    if (!(Object.keys(jobOperationsUpdates_1).length > 0)) return [3 /*break*/, 60];
                                    console.log("Final job updates to be applied:", jobOperationsUpdates_1);
                                    _1.label = 48;
                                case 48:
                                    _1.trys.push([48, 54, 55, 60]);
                                    _k = true, _l = __asyncValues(Object.entries(jobOperationsUpdates_1));
                                    _1.label = 49;
                                case 49: return [4 /*yield*/, _l.next()];
                                case 50:
                                    if (!(_m = _1.sent(), _x = _m.done, !_x)) return [3 /*break*/, 53];
                                    _z = _m.value;
                                    _k = false;
                                    jobOperationId = _z[0], update = _z[1];
                                    console.log("Updating job operation ".concat(jobOperationId, " with:"), update);
                                    return [4 /*yield*/, trx
                                            .updateTable("jobOperation")
                                            .set(update)
                                            .where("id", "=", jobOperationId)
                                            .execute()];
                                case 51:
                                    _1.sent();
                                    _1.label = 52;
                                case 52:
                                    _k = true;
                                    return [3 /*break*/, 49];
                                case 53: return [3 /*break*/, 60];
                                case 54:
                                    e_15_1 = _1.sent();
                                    e_15 = { error: e_15_1 };
                                    return [3 /*break*/, 60];
                                case 55:
                                    _1.trys.push([55, , 58, 59]);
                                    if (!(!_k && !_x && (_y = _l.return))) return [3 /*break*/, 57];
                                    return [4 /*yield*/, _y.call(_l)];
                                case 56:
                                    _1.sent();
                                    _1.label = 57;
                                case 57: return [3 /*break*/, 59];
                                case 58:
                                    if (e_15) throw e_15.error;
                                    return [7 /*endfinally*/];
                                case 59: return [7 /*endfinally*/];
                                case 60: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 54:
                _141.sent();
                return [3 /*break*/, 71];
            case 55:
                if (!shipment_1.data.sourceDocumentId)
                    throw new Error("Shipment has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", shipment_1.data.sourceDocumentId),
                    ])];
            case 56:
                _u = _141.sent(), warehouseTransfer_1 = _u[0], warehouseTransferLines = _u[1];
                if (warehouseTransfer_1.error)
                    throw new Error("Failed to fetch warehouse transfer");
                if (warehouseTransferLines.error)
                    throw new Error("Failed to fetch warehouse transfer lines");
                itemLedgerInserts_2 = [];
                warehouseTransferLineUpdates_1 = {};
                _141.label = 57;
            case 57:
                _141.trys.push([57, 62, 63, 68]);
                _loop_3 = function () {
                    _24 = _x.value;
                    _v = false;
                    var shipmentLine = _24;
                    var warehouseTransferLine = warehouseTransferLines.data.find(function (line) { return line.id === shipmentLine.lineId; });
                    if (!warehouseTransferLine)
                        return "continue";
                    var shippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                        shipmentLine.shippedQuantity == null
                        ? 0
                        : shipmentLine.shippedQuantity;
                    // Update warehouse transfer line shipped quantity
                    var newShippedQuantity = ((_99 = warehouseTransferLine.shippedQuantity) !== null && _99 !== void 0 ? _99 : 0) + shippedQuantity;
                    warehouseTransferLineUpdates_1[warehouseTransferLine.id] = {
                        shippedQuantity: newShippedQuantity,
                    };
                    // Create item ledger entry for negative adjustment at source
                    if (shippedQuantity !== 0) {
                        itemLedgerInserts_2.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: -shippedQuantity, // Negative for outbound transfer
                            locationId: shipmentLine.locationId,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Transfer",
                            documentType: "Transfer Shipment",
                            documentId: (_100 = warehouseTransfer_1.data) === null || _100 === void 0 ? void 0 : _100.transferId,
                            externalDocumentId: (_102 = (_101 = shipment_1.data) === null || _101 === void 0 ? void 0 : _101.externalDocumentId) !== null && _102 !== void 0 ? _102 : undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                };
                _v = true, _w = __asyncValues(shipmentLines_1.data);
                _141.label = 58;
            case 58: return [4 /*yield*/, _w.next()];
            case 59:
                if (!(_x = _141.sent(), _22 = _x.done, !_22)) return [3 /*break*/, 61];
                _loop_3();
                _141.label = 60;
            case 60:
                _v = true;
                return [3 /*break*/, 58];
            case 61: return [3 /*break*/, 68];
            case 62:
                e_3_1 = _141.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 68];
            case 63:
                _141.trys.push([63, , 66, 67]);
                if (!(!_v && !_22 && (_23 = _w.return))) return [3 /*break*/, 65];
                return [4 /*yield*/, _23.call(_w)];
            case 64:
                _141.sent();
                _141.label = 65;
            case 65: return [3 /*break*/, 67];
            case 66:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
            case 67: return [7 /*endfinally*/];
            case 68:
                allLinesFullyShipped = warehouseTransferLines.data.every(function (line) {
                    var _a, _b, _c;
                    var updates = warehouseTransferLineUpdates_1[line.id];
                    var shippedQty = (_b = (_a = updates === null || updates === void 0 ? void 0 : updates.shippedQuantity) !== null && _a !== void 0 ? _a : line.shippedQuantity) !== null && _b !== void 0 ? _b : 0;
                    return shippedQty >= ((_c = line.quantity) !== null && _c !== void 0 ? _c : 0);
                });
                allLinesFullyReceived = warehouseTransferLines.data.every(function (line) {
                    var _a, _b;
                    var receivedQty = (_a = line.receivedQuantity) !== null && _a !== void 0 ? _a : 0;
                    return receivedQty >= ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0);
                });
                newStatus_1 = warehouseTransfer_1.data.status;
                if (allLinesFullyShipped && allLinesFullyReceived) {
                    newStatus_1 = "Completed";
                }
                else if (allLinesFullyShipped && !allLinesFullyReceived) {
                    newStatus_1 = "To Receive";
                }
                else if (!allLinesFullyShipped && allLinesFullyReceived) {
                    newStatus_1 = "To Ship";
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, lineId, update, e_16_1;
                        var _d, e_16, _e, _f;
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
                                    e_16_1 = _g.sent();
                                    e_16 = { error: e_16_1 };
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
                                    if (e_16) throw e_16.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: 
                                // Update warehouse transfer status
                                return [4 /*yield*/, trx
                                        .updateTable("warehouseTransfer")
                                        .set({
                                        status: newStatus_1,
                                        transferDate: today,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", warehouseTransfer_1.data.id)
                                        .execute()];
                                case 13:
                                    // Update warehouse transfer status
                                    _g.sent();
                                    if (!(itemLedgerInserts_2.length > 0)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_2)
                                            .returning(["id"])
                                            .execute()];
                                case 14:
                                    _g.sent();
                                    _g.label = 15;
                                case 15: 
                                // Update shipment status
                                return [4 /*yield*/, trx
                                        .updateTable("shipment")
                                        .set({
                                        status: "Posted",
                                        postedBy: userId_1,
                                    })
                                        .where("id", "=", shipmentId_1)
                                        .execute()];
                                case 16:
                                    // Update shipment status
                                    _g.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 69:
                _141.sent();
                return [3 /*break*/, 71];
            case 70:
                {
                    throw new Error("Invalid source document type: ".concat(shipment_1.data.sourceDocument));
                }
                _141.label = 71;
            case 71: return [3 /*break*/, 141];
            case 72:
                _y = (_103 = shipment_1.data) === null || _103 === void 0 ? void 0 : _103.sourceDocument;
                switch (_y) {
                    case "Sales Order": return [3 /*break*/, 73];
                    case "Purchase Order": return [3 /*break*/, 96];
                    case "Outbound Transfer": return [3 /*break*/, 124];
                }
                return [3 /*break*/, 139];
            case 73:
                if (!shipment_1.data.sourceDocumentId)
                    throw new Error("Shipment has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("salesOrder")
                            .select("*")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("salesOrderLine")
                            .select("*")
                            .eq("salesOrderId", shipment_1.data.sourceDocumentId),
                        client
                            .from("journalLine")
                            .select("*")
                            .eq("documentId", shipmentId_1)
                            .eq("documentType", "Sales Shipment")
                            .eq("companyId", companyId_1),
                        client
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_1)
                            .single(),
                    ])];
            case 74:
                _z = _141.sent(), salesOrder_2 = _z[0], salesOrderLines = _z[1], originalJournalLines = _z[2], accountingSettings = _z[3];
                if (salesOrder_2.error)
                    throw new Error("Failed to fetch sales order");
                if (salesOrderLines.error)
                    throw new Error("Failed to fetch sales order lines");
                if (originalJournalLines.error)
                    throw new Error("Failed to fetch journal lines");
                accountingEnabled_2 = (_105 = (_104 = accountingSettings.data) === null || _104 === void 0 ? void 0 : _104.accountingEnabled) !== null && _105 !== void 0 ? _105 : false;
                reversingJournalLines_1 = accountingEnabled_2
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
                return [4 /*yield*/, client
                        .from("customer")
                        .select("*")
                        .eq("id", salesOrder_2.data.customerId)
                        .eq("companyId", companyId_1)
                        .single()];
            case 75:
                customer = _141.sent();
                if (customer.error)
                    throw new Error("Failed to fetch customer");
                itemLedgerInserts_3 = [];
                jobUpdates_2 = {};
                locationId_2 = shipment_1.data.locationId;
                _141.label = 76;
            case 76:
                _141.trys.push([76, 81, 82, 87]);
                _loop_4 = function () {
                    _27 = _2.value;
                    _0 = false;
                    var shipmentLine = _27;
                    if (((_106 = shipmentLine.fulfillment) === null || _106 === void 0 ? void 0 : _106.type) === "Job" &&
                        ((_107 = shipmentLine.fulfillment) === null || _107 === void 0 ? void 0 : _107.jobId)) {
                        // Reverse job quantities for void shipment
                        var jobId_2 = shipmentLine.fulfillment.jobId;
                        var currentJob = jobs.data.find(function (j) { return j.id === jobId_2; });
                        console.log("Processing job void:", {
                            jobId: jobId_2,
                            currentJob: currentJob
                                ? {
                                    id: currentJob.id,
                                    quantity: currentJob.quantity,
                                    quantityShipped: currentJob.quantityShipped,
                                    quantityComplete: currentJob.quantityComplete,
                                    status: currentJob.status,
                                }
                                : null,
                            shipmentLine: {
                                id: shipmentLine.id,
                                shippedQuantity: shipmentLine.shippedQuantity,
                                shippedQuantityType: typeof shipmentLine.shippedQuantity,
                            },
                        });
                        var currentQuantityShipped = (_108 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityShipped) !== null && _108 !== void 0 ? _108 : 0;
                        // Ensure shippedQuantity is a valid number
                        var shippedQuantity_2 = typeof shipmentLine.shippedQuantity === "number" &&
                            !isNaN(shipmentLine.shippedQuantity)
                            ? shipmentLine.shippedQuantity
                            : 0;
                        console.log("Calculated values for void:", {
                            currentQuantityShipped: currentQuantityShipped,
                            shippedQuantity: shippedQuantity_2,
                            newTotal: currentQuantityShipped - shippedQuantity_2,
                            jobQuantity: currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantity,
                        });
                        // Reduce shipped quantity (reverse of posting)
                        var newQuantityShipped = Math.max(0, currentQuantityShipped - shippedQuantity_2);
                        var newQuantityComplete = Math.max((_109 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantityComplete) !== null && _109 !== void 0 ? _109 : 0, shippedQuantity_2);
                        // Update status based on new quantities
                        var newStatus = currentJob === null || currentJob === void 0 ? void 0 : currentJob.status;
                        if ((currentJob === null || currentJob === void 0 ? void 0 : currentJob.status) === "Completed" &&
                            newQuantityShipped < ((_110 = currentJob === null || currentJob === void 0 ? void 0 : currentJob.quantity) !== null && _110 !== void 0 ? _110 : 0)) {
                            newStatus = "In Progress";
                        }
                        jobUpdates_2[jobId_2] = {
                            status: newStatus,
                            quantityComplete: newQuantityComplete,
                            quantityShipped: newQuantityShipped,
                        };
                    }
                    var itemTrackingType = (_112 = (_111 = items.data.find(function (item) { return item.id === shipmentLine.itemId; })) === null || _111 === void 0 ? void 0 : _111.itemTrackingType) !== null && _112 !== void 0 ? _112 : "Inventory";
                    // Default shippedQuantity to 0 if not defined or NaN
                    var shippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                        shipmentLine.shippedQuantity == null
                        ? 0
                        : shipmentLine.shippedQuantity;
                    if (itemTrackingType === "Inventory") {
                        // Create positive adjustment to restore inventory
                        itemLedgerInserts_3.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: shippedQuantity, // Positive to restore inventory
                            locationId: (_113 = shipmentLine.locationId) !== null && _113 !== void 0 ? _113 : locationId_2,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Positive Adjmt.",
                            documentType: "Sales Shipment",
                            documentId: (_115 = (_114 = shipment_1.data) === null || _114 === void 0 ? void 0 : _114.id) !== null && _115 !== void 0 ? _115 : undefined,
                            externalDocumentId: undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (shipmentLine.requiresBatchTracking) {
                        itemLedgerInserts_3.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: shippedQuantity, // Positive to restore inventory
                            locationId: (_116 = shipmentLine.locationId) !== null && _116 !== void 0 ? _116 : locationId_2,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Positive Adjmt.",
                            documentType: "Sales Shipment",
                            documentId: (_118 = (_117 = shipment_1.data) === null || _117 === void 0 ? void 0 : _117.id) !== null && _118 !== void 0 ? _118 : undefined,
                            trackedEntityId: (_120 = (_119 = shipmentLineTracking.data) === null || _119 === void 0 ? void 0 : _119.find(function (tracking) {
                                var _a;
                                return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === shipmentLine.id;
                            })) === null || _120 === void 0 ? void 0 : _120.id,
                            externalDocumentId: undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (shipmentLine.requiresSerialTracking) {
                        var lineTracking = (_121 = shipmentLineTracking.data) === null || _121 === void 0 ? void 0 : _121.filter(function (tracking) {
                            var _a;
                            return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === shipmentLine.id;
                        });
                        lineTracking === null || lineTracking === void 0 ? void 0 : lineTracking.forEach(function (tracking) {
                            var _a, _b, _c;
                            itemLedgerInserts_3.push({
                                postingDate: today,
                                itemId: shipmentLine.itemId,
                                quantity: 1, // Positive to restore inventory
                                locationId: (_a = shipmentLine.locationId) !== null && _a !== void 0 ? _a : locationId_2,
                                storageUnitId: shipmentLine.storageUnitId,
                                entryType: "Positive Adjmt.",
                                documentType: "Sales Shipment",
                                documentId: (_c = (_b = shipment_1.data) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : undefined,
                                trackedEntityId: tracking.id,
                                externalDocumentId: undefined,
                                createdBy: userId_1,
                                companyId: companyId_1,
                            });
                        });
                    }
                };
                _0 = true, _1 = __asyncValues(shipmentLines_1.data);
                _141.label = 77;
            case 77: return [4 /*yield*/, _1.next()];
            case 78:
                if (!(_2 = _141.sent(), _25 = _2.done, !_25)) return [3 /*break*/, 80];
                _loop_4();
                _141.label = 79;
            case 79:
                _0 = true;
                return [3 /*break*/, 77];
            case 80: return [3 /*break*/, 87];
            case 81:
                e_4_1 = _141.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 87];
            case 82:
                _141.trys.push([82, , 85, 86]);
                if (!(!_0 && !_25 && (_26 = _1.return))) return [3 /*break*/, 84];
                return [4 /*yield*/, _26.call(_1)];
            case 83:
                _141.sent();
                _141.label = 84;
            case 84: return [3 /*break*/, 86];
            case 85:
                if (e_4) throw e_4.error;
                return [7 /*endfinally*/];
            case 86: return [7 /*endfinally*/];
            case 87:
                shipmentLinesBySalesOrderLineId_2 = shipmentLines_1.data.reduce(function (acc, shipmentLine) {
                    var _a;
                    if (shipmentLine.lineId) {
                        acc[shipmentLine.lineId] = __spreadArray(__spreadArray([], ((_a = acc[shipmentLine.lineId]) !== null && _a !== void 0 ? _a : []), true), [
                            shipmentLine,
                        ], false);
                    }
                    return acc;
                }, {});
                salesOrderLineUpdates_2 = salesOrderLines.data.reduce(function (acc, salesOrderLine) {
                    var _a;
                    var _b;
                    var shipmentLines = shipmentLinesBySalesOrderLineId_2[salesOrderLine.id];
                    if (shipmentLines &&
                        shipmentLines.length > 0 &&
                        salesOrderLine.saleQuantity &&
                        salesOrderLine.saleQuantity > 0) {
                        var shippedQuantity = shipmentLines.reduce(function (acc, shipmentLine) {
                            var safeShippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                                shipmentLine.shippedQuantity == null
                                ? 0
                                : shipmentLine.shippedQuantity;
                            return acc + safeShippedQuantity;
                        }, 0);
                        // Reduce shipped quantity (reverse of posting)
                        var newQuantitySent = Math.max(0, ((_b = salesOrderLine.quantitySent) !== null && _b !== void 0 ? _b : 0) - shippedQuantity);
                        var sentComplete = newQuantitySent >= salesOrderLine.saleQuantity;
                        var updates = __assign(__assign({}, acc), (_a = {}, _a[salesOrderLine.id] = {
                            quantitySent: newQuantitySent,
                            sentComplete: sentComplete,
                        }, _a));
                        // Clear sent date if no longer complete
                        if (!sentComplete && salesOrderLine.sentDate) {
                            updates[salesOrderLine.id].sentDate = null;
                        }
                        return updates;
                    }
                    return acc;
                }, {});
                faSoLinesForVoid = salesOrderLines.data.filter(function (sol) {
                    return sol.salesOrderLineType === "Fixed Asset" &&
                        sol.assetId &&
                        sol.sentComplete;
                });
                _loop_5 = function (faSoLine) {
                    var hasShipmentEntries;
                    return __generator(this, function (_142) {
                        switch (_142.label) {
                            case 0:
                                hasShipmentEntries = originalJournalLines.data.some(function (jl) {
                                    return jl.documentLineReference ===
                                        utils_ts_1.journalReference.to.shipment(faSoLine.id);
                                });
                                if (!hasShipmentEntries) return [3 /*break*/, 3];
                                salesOrderLineUpdates_2[faSoLine.id] = {
                                    quantitySent: 0,
                                    sentComplete: false,
                                    sentDate: null,
                                };
                                return [4 /*yield*/, client
                                        .from("fixedAsset")
                                        .update({
                                        status: "Active",
                                        disposalDate: null,
                                        disposalMethod: null,
                                        updatedBy: userId_1,
                                    })
                                        .eq("id", faSoLine.assetId)];
                            case 1:
                                _142.sent();
                                return [4 /*yield*/, client
                                        .from("fixedAssetDisposal")
                                        .delete()
                                        .eq("fixedAssetId", faSoLine.assetId)
                                        .eq("companyId", companyId_1)];
                            case 2:
                                _142.sent();
                                _142.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                };
                _3 = 0, faSoLinesForVoid_1 = faSoLinesForVoid;
                _141.label = 88;
            case 88:
                if (!(_3 < faSoLinesForVoid_1.length)) return [3 /*break*/, 91];
                faSoLine = faSoLinesForVoid_1[_3];
                return [5 /*yield**/, _loop_5(faSoLine)];
            case 89:
                _141.sent();
                _141.label = 90;
            case 90:
                _3++;
                return [3 /*break*/, 88];
            case 91:
                trackedEntityUpdates_3 = (_123 = (_122 = shipmentLineTracking.data) === null || _122 === void 0 ? void 0 : _122.reduce(function (acc, trackedEntity) {
                    var _a;
                    var shipmentLine = (_a = shipmentLines_1.data) === null || _a === void 0 ? void 0 : _a.find(function (shipmentLine) {
                        var _a;
                        return shipmentLine.id ===
                            ((_a = trackedEntity.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]);
                    });
                    // Restore original quantity and set to available
                    acc[trackedEntity.id] = {
                        status: "Available",
                        quantity: trackedEntity.quantity, // Restore original quantity
                    };
                    return acc;
                }, {})) !== null && _123 !== void 0 ? _123 : {};
                if (!(accountingEnabled_2 && reversingJournalLines_1.length > 0)) return [3 /*break*/, 93];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 92:
                _4 = _141.sent();
                return [3 /*break*/, 94];
            case 93:
                _4 = null;
                _141.label = 94;
            case 94:
                accountingPeriodId_2 = _4;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, salesOrderLineId, update, e_17_1, salesOrderLines, areAllLinesInvoiced, areAllLinesShipped, status, voidActivity, voidActivityId, _d, _e, _f, id, update, e_18_1, _g, _h, _j, jobId, update, e_19_1, voidJournalEntryId, voidJournalResult_1;
                        var _k, e_17, _l, _m, _o, e_18, _p, _q, _r, e_19, _s, _t;
                        var _u;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0:
                                    _v.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(salesOrderLineUpdates_2));
                                    _v.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _v.sent(), _k = _c.done, !_k)) return [3 /*break*/, 5];
                                    _m = _c.value;
                                    _a = false;
                                    salesOrderLineId = _m[0], update = _m[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("salesOrderLine")
                                            .set(update)
                                            .where("id", "=", salesOrderLineId)
                                            .execute()];
                                case 3:
                                    _v.sent();
                                    _v.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_17_1 = _v.sent();
                                    e_17 = { error: e_17_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _v.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_k && (_l = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _l.call(_b)];
                                case 8:
                                    _v.sent();
                                    _v.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_17) throw e_17.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [4 /*yield*/, trx
                                        .selectFrom("salesOrderLine")
                                        .select([
                                        "id",
                                        "salesOrderLineType",
                                        "invoicedComplete",
                                        "sentComplete",
                                    ])
                                        .where("salesOrderId", "=", salesOrder_2.data.id)
                                        .execute()];
                                case 13:
                                    salesOrderLines = _v.sent();
                                    areAllLinesInvoiced = salesOrderLines.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.invoicedComplete;
                                    });
                                    areAllLinesShipped = salesOrderLines.every(function (line) {
                                        return line.salesOrderLineType === "Comment" || line.sentComplete;
                                    });
                                    status = "To Ship and Invoice";
                                    if (areAllLinesInvoiced && areAllLinesShipped) {
                                        status = "Completed";
                                    }
                                    else if (areAllLinesShipped) {
                                        status = "To Invoice";
                                    }
                                    else if (areAllLinesInvoiced) {
                                        status = "To Ship";
                                    }
                                    return [4 /*yield*/, trx
                                            .updateTable("salesOrder")
                                            .set({
                                            status: status,
                                        })
                                            .where("id", "=", salesOrder_2.data.id)
                                            .execute()];
                                case 14:
                                    _v.sent();
                                    // Update shipment status to Voided
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            status: "Voided",
                                            updatedAt: today,
                                            updatedBy: userId_1,
                                        })
                                            .where("id", "=", shipmentId_1)
                                            .execute()];
                                case 15:
                                    // Update shipment status to Voided
                                    _v.sent();
                                    if (!(Object.keys(trackedEntityUpdates_3).length > 0)) return [3 /*break*/, 30];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            type: "Void Shipment",
                                            sourceDocument: "Shipment",
                                            sourceDocumentId: shipmentId_1,
                                            sourceDocumentReadableId: shipment_1.data.shipmentId,
                                            attributes: {
                                                Shipment: shipmentId_1,
                                                "Sales Order": salesOrder_2.data.id,
                                            },
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 16:
                                    voidActivity = _v.sent();
                                    voidActivityId = voidActivity[0].id;
                                    _v.label = 17;
                                case 17:
                                    _v.trys.push([17, 24, 25, 30]);
                                    _d = true, _e = __asyncValues(Object.entries(trackedEntityUpdates_3));
                                    _v.label = 18;
                                case 18: return [4 /*yield*/, _e.next()];
                                case 19:
                                    if (!(_f = _v.sent(), _o = _f.done, !_o)) return [3 /*break*/, 23];
                                    _q = _f.value;
                                    _d = false;
                                    id = _q[0], update = _q[1];
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set(update)
                                            .where("id", "=", id)
                                            .execute()];
                                case 20:
                                    _v.sent();
                                    if (!voidActivityId) return [3 /*break*/, 22];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: voidActivityId,
                                            trackedEntityId: id,
                                            quantity: (_u = update.quantity) !== null && _u !== void 0 ? _u : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            createdAt: today,
                                        })
                                            .execute()];
                                case 21:
                                    _v.sent();
                                    _v.label = 22;
                                case 22:
                                    _d = true;
                                    return [3 /*break*/, 18];
                                case 23: return [3 /*break*/, 30];
                                case 24:
                                    e_18_1 = _v.sent();
                                    e_18 = { error: e_18_1 };
                                    return [3 /*break*/, 30];
                                case 25:
                                    _v.trys.push([25, , 28, 29]);
                                    if (!(!_d && !_o && (_p = _e.return))) return [3 /*break*/, 27];
                                    return [4 /*yield*/, _p.call(_e)];
                                case 26:
                                    _v.sent();
                                    _v.label = 27;
                                case 27: return [3 /*break*/, 29];
                                case 28:
                                    if (e_18) throw e_18.error;
                                    return [7 /*endfinally*/];
                                case 29: return [7 /*endfinally*/];
                                case 30:
                                    if (!(itemLedgerInserts_3.length > 0)) return [3 /*break*/, 32];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_3)
                                            .returning(["id"])
                                            .execute()];
                                case 31:
                                    _v.sent();
                                    _v.label = 32;
                                case 32:
                                    if (!(Object.keys(jobUpdates_2).length > 0)) return [3 /*break*/, 45];
                                    console.log("Final job void updates to be applied:", jobUpdates_2);
                                    _v.label = 33;
                                case 33:
                                    _v.trys.push([33, 39, 40, 45]);
                                    _g = true, _h = __asyncValues(Object.entries(jobUpdates_2));
                                    _v.label = 34;
                                case 34: return [4 /*yield*/, _h.next()];
                                case 35:
                                    if (!(_j = _v.sent(), _r = _j.done, !_r)) return [3 /*break*/, 38];
                                    _t = _j.value;
                                    _g = false;
                                    jobId = _t[0], update = _t[1];
                                    console.log("Voiding job ".concat(jobId, " with:"), update);
                                    return [4 /*yield*/, trx
                                            .updateTable("job")
                                            .set(update)
                                            .where("id", "=", jobId)
                                            .execute()];
                                case 36:
                                    _v.sent();
                                    _v.label = 37;
                                case 37:
                                    _g = true;
                                    return [3 /*break*/, 34];
                                case 38: return [3 /*break*/, 45];
                                case 39:
                                    e_19_1 = _v.sent();
                                    e_19 = { error: e_19_1 };
                                    return [3 /*break*/, 45];
                                case 40:
                                    _v.trys.push([40, , 43, 44]);
                                    if (!(!_g && !_r && (_s = _h.return))) return [3 /*break*/, 42];
                                    return [4 /*yield*/, _s.call(_h)];
                                case 41:
                                    _v.sent();
                                    _v.label = 42;
                                case 42: return [3 /*break*/, 44];
                                case 43:
                                    if (e_19) throw e_19.error;
                                    return [7 /*endfinally*/];
                                case 44: return [7 /*endfinally*/];
                                case 45:
                                    if (!(accountingEnabled_2 &&
                                        reversingJournalLines_1.length > 0 &&
                                        accountingPeriodId_2)) return [3 /*break*/, 49];
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 46:
                                    voidJournalEntryId = _v.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: voidJournalEntryId,
                                            accountingPeriodId: accountingPeriodId_2,
                                            description: "VOID: Sales Shipment ".concat(shipment_1.data.shipmentId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Sales Shipment",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 47:
                                    voidJournalResult_1 = _v.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(reversingJournalLines_1.map(function (line) { return (__assign(__assign({}, line), { journalId: voidJournalResult_1.id })); }))
                                            .execute()];
                                case 48:
                                    _v.sent();
                                    _v.label = 49;
                                case 49: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 95:
                _141.sent();
                return [3 /*break*/, 140];
            case 96:
                if (!shipment_1.data.sourceDocumentId)
                    throw new Error("Shipment has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("*")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", shipment_1.data.sourceDocumentId),
                    ])];
            case 97:
                _5 = _141.sent(), purchaseOrder_2 = _5[0], purchaseOrderLines = _5[1];
                if (purchaseOrder_2.error)
                    throw new Error("Failed to fetch purchase order");
                if (purchaseOrderLines.error)
                    throw new Error("Failed to fetch purchase order lines");
                return [4 /*yield*/, client
                        .from("supplier")
                        .select("*")
                        .eq("id", purchaseOrder_2.data.supplierId)
                        .eq("companyId", companyId_1)
                        .single()];
            case 98:
                supplier = _141.sent();
                if (supplier.error)
                    throw new Error("Failed to fetch supplier");
                jobOperationsUpdates_2 = {};
                _141.label = 99;
            case 99:
                _141.trys.push([99, 104, 105, 110]);
                _loop_6 = function () {
                    _30 = _8.value;
                    _6 = false;
                    var shipmentLine = _30;
                    var purchaseOrderLine = purchaseOrderLines.data.find(function (pol) { return pol.id === shipmentLine.lineId; });
                    if ((purchaseOrderLine === null || purchaseOrderLine === void 0 ? void 0 : purchaseOrderLine.jobId) &&
                        purchaseOrderLine.jobOperationId) {
                        // Reset job operation status when voiding
                        var jobOperationId = purchaseOrderLine.jobOperationId;
                        jobOperationsUpdates_2[jobOperationId] = {
                            status: "Ready",
                        };
                        return "continue";
                    }
                };
                _6 = true, _7 = __asyncValues(shipmentLines_1.data);
                _141.label = 100;
            case 100: return [4 /*yield*/, _7.next()];
            case 101:
                if (!(_8 = _141.sent(), _28 = _8.done, !_28)) return [3 /*break*/, 103];
                _loop_6();
                _141.label = 102;
            case 102:
                _6 = true;
                return [3 /*break*/, 100];
            case 103: return [3 /*break*/, 110];
            case 104:
                e_5_1 = _141.sent();
                e_5 = { error: e_5_1 };
                return [3 /*break*/, 110];
            case 105:
                _141.trys.push([105, , 108, 109]);
                if (!(!_6 && !_28 && (_29 = _7.return))) return [3 /*break*/, 107];
                return [4 /*yield*/, _29.call(_7)];
            case 106:
                _141.sent();
                _141.label = 107;
            case 107: return [3 /*break*/, 109];
            case 108:
                if (e_5) throw e_5.error;
                return [7 /*endfinally*/];
            case 109: return [7 /*endfinally*/];
            case 110:
                shipmentLinesByPurchaseOrderLineId_2 = shipmentLines_1.data.reduce(function (acc, shipmentLine) {
                    var _a;
                    if (shipmentLine.lineId) {
                        acc[shipmentLine.lineId] = __spreadArray(__spreadArray([], ((_a = acc[shipmentLine.lineId]) !== null && _a !== void 0 ? _a : []), true), [
                            shipmentLine,
                        ], false);
                    }
                    return acc;
                }, {});
                purchaseOrderLineUpdates_2 = purchaseOrderLines.data.reduce(function (acc, purchaseOrderLine) {
                    var _a;
                    var _b;
                    var shipmentLines = shipmentLinesByPurchaseOrderLineId_2[purchaseOrderLine.id];
                    if (shipmentLines &&
                        shipmentLines.length > 0 &&
                        purchaseOrderLine.purchaseQuantity &&
                        purchaseOrderLine.purchaseQuantity > 0) {
                        var shippedQuantity = shipmentLines.reduce(function (acc, shipmentLine) {
                            var safeShippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                                shipmentLine.shippedQuantity == null
                                ? 0
                                : shipmentLine.shippedQuantity;
                            return acc + safeShippedQuantity;
                        }, 0);
                        // Reduce shipped quantity (reverse of posting)
                        var newQuantityShipped = Math.max(0, ((_b = purchaseOrderLine.quantityShipped) !== null && _b !== void 0 ? _b : 0) - shippedQuantity);
                        var updates = __assign(__assign({}, acc), (_a = {}, _a[purchaseOrderLine.id] = {
                            quantityShipped: newQuantityShipped,
                        }, _a));
                        return updates;
                    }
                    return acc;
                }, {});
                trackedEntityUpdates_4 = (_125 = (_124 = shipmentLineTracking.data) === null || _124 === void 0 ? void 0 : _124.reduce(function (acc, trackedEntity) {
                    // Restore original quantity and set to available
                    acc[trackedEntity.id] = {
                        status: "Available",
                        quantity: trackedEntity.quantity,
                    };
                    return acc;
                }, {})) !== null && _125 !== void 0 ? _125 : {};
                itemLedgerInserts_4 = [];
                locationId_3 = shipment_1.data.locationId;
                _141.label = 111;
            case 111:
                _141.trys.push([111, 116, 117, 122]);
                _loop_7 = function () {
                    _33 = _11.value;
                    _9 = false;
                    var shipmentLine = _33;
                    var itemTrackingType = (_127 = (_126 = items.data.find(function (item) { return item.id === shipmentLine.itemId; })) === null || _126 === void 0 ? void 0 : _126.itemTrackingType) !== null && _127 !== void 0 ? _127 : "Inventory";
                    var shippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                        shipmentLine.shippedQuantity == null
                        ? 0
                        : shipmentLine.shippedQuantity;
                    if (itemTrackingType === "Inventory" && shippedQuantity !== 0) {
                        // Create negative adjustment to remove inventory that was added during posting
                        itemLedgerInserts_4.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: -shippedQuantity, // Negative to remove inventory
                            locationId: (_128 = shipmentLine.locationId) !== null && _128 !== void 0 ? _128 : locationId_3,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Negative Adjmt.",
                            documentType: "Purchase Receipt",
                            documentId: (_130 = (_129 = shipment_1.data) === null || _129 === void 0 ? void 0 : _129.id) !== null && _130 !== void 0 ? _130 : undefined,
                            externalDocumentId: undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (shipmentLine.requiresBatchTracking) {
                        itemLedgerInserts_4.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: -shippedQuantity, // Negative to remove inventory
                            locationId: (_131 = shipmentLine.locationId) !== null && _131 !== void 0 ? _131 : locationId_3,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Negative Adjmt.",
                            documentType: "Purchase Receipt",
                            documentId: (_133 = (_132 = shipment_1.data) === null || _132 === void 0 ? void 0 : _132.id) !== null && _133 !== void 0 ? _133 : undefined,
                            trackedEntityId: (_135 = (_134 = shipmentLineTracking.data) === null || _134 === void 0 ? void 0 : _134.find(function (tracking) {
                                var _a;
                                return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === shipmentLine.id;
                            })) === null || _135 === void 0 ? void 0 : _135.id,
                            externalDocumentId: undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                    if (shipmentLine.requiresSerialTracking) {
                        var lineTracking = (_136 = shipmentLineTracking.data) === null || _136 === void 0 ? void 0 : _136.filter(function (tracking) {
                            var _a;
                            return ((_a = tracking.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === shipmentLine.id;
                        });
                        lineTracking === null || lineTracking === void 0 ? void 0 : lineTracking.forEach(function (tracking) {
                            var _a, _b, _c;
                            itemLedgerInserts_4.push({
                                postingDate: today,
                                itemId: shipmentLine.itemId,
                                quantity: -1, // Negative to remove inventory
                                locationId: (_a = shipmentLine.locationId) !== null && _a !== void 0 ? _a : locationId_3,
                                storageUnitId: shipmentLine.storageUnitId,
                                entryType: "Negative Adjmt.",
                                documentType: "Purchase Receipt",
                                documentId: (_c = (_b = shipment_1.data) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : undefined,
                                trackedEntityId: tracking.id,
                                externalDocumentId: undefined,
                                createdBy: userId_1,
                                companyId: companyId_1,
                            });
                        });
                    }
                };
                _9 = true, _10 = __asyncValues(shipmentLines_1.data);
                _141.label = 112;
            case 112: return [4 /*yield*/, _10.next()];
            case 113:
                if (!(_11 = _141.sent(), _31 = _11.done, !_31)) return [3 /*break*/, 115];
                _loop_7();
                _141.label = 114;
            case 114:
                _9 = true;
                return [3 /*break*/, 112];
            case 115: return [3 /*break*/, 122];
            case 116:
                e_6_1 = _141.sent();
                e_6 = { error: e_6_1 };
                return [3 /*break*/, 122];
            case 117:
                _141.trys.push([117, , 120, 121]);
                if (!(!_9 && !_31 && (_32 = _10.return))) return [3 /*break*/, 119];
                return [4 /*yield*/, _32.call(_10)];
            case 118:
                _141.sent();
                _141.label = 119;
            case 119: return [3 /*break*/, 121];
            case 120:
                if (e_6) throw e_6.error;
                return [7 /*endfinally*/];
            case 121: return [7 /*endfinally*/];
            case 122: return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, purchaseOrderLineId, update, e_20_1, voidActivity, voidActivityId, _d, _e, _f, id, update, e_21_1, _g, _h, _j, jobOperationId, update, e_22_1;
                    var _k, e_20, _l, _m, _o, e_21, _p, _q, _r, e_22, _s, _t;
                    var _u;
                    return __generator(this, function (_v) {
                        switch (_v.label) {
                            case 0:
                                _v.trys.push([0, 6, 7, 12]);
                                _a = true, _b = __asyncValues(Object.entries(purchaseOrderLineUpdates_2));
                                _v.label = 1;
                            case 1: return [4 /*yield*/, _b.next()];
                            case 2:
                                if (!(_c = _v.sent(), _k = _c.done, !_k)) return [3 /*break*/, 5];
                                _m = _c.value;
                                _a = false;
                                purchaseOrderLineId = _m[0], update = _m[1];
                                return [4 /*yield*/, trx
                                        .updateTable("purchaseOrderLine")
                                        .set(update)
                                        .where("id", "=", purchaseOrderLineId)
                                        .execute()];
                            case 3:
                                _v.sent();
                                _v.label = 4;
                            case 4:
                                _a = true;
                                return [3 /*break*/, 1];
                            case 5: return [3 /*break*/, 12];
                            case 6:
                                e_20_1 = _v.sent();
                                e_20 = { error: e_20_1 };
                                return [3 /*break*/, 12];
                            case 7:
                                _v.trys.push([7, , 10, 11]);
                                if (!(!_a && !_k && (_l = _b.return))) return [3 /*break*/, 9];
                                return [4 /*yield*/, _l.call(_b)];
                            case 8:
                                _v.sent();
                                _v.label = 9;
                            case 9: return [3 /*break*/, 11];
                            case 10:
                                if (e_20) throw e_20.error;
                                return [7 /*endfinally*/];
                            case 11: return [7 /*endfinally*/];
                            case 12:
                                if (!(itemLedgerInserts_4.length > 0)) return [3 /*break*/, 14];
                                return [4 /*yield*/, trx
                                        .insertInto("itemLedger")
                                        .values(itemLedgerInserts_4)
                                        .returning(["id"])
                                        .execute()];
                            case 13:
                                _v.sent();
                                _v.label = 14;
                            case 14: 
                            // Update shipment status to Voided
                            return [4 /*yield*/, trx
                                    .updateTable("shipment")
                                    .set({
                                    status: "Voided",
                                    updatedAt: today,
                                    updatedBy: userId_1,
                                })
                                    .where("id", "=", shipmentId_1)
                                    .execute()];
                            case 15:
                                // Update shipment status to Voided
                                _v.sent();
                                if (!(Object.keys(trackedEntityUpdates_4).length > 0)) return [3 /*break*/, 30];
                                return [4 /*yield*/, trx
                                        .insertInto("trackedActivity")
                                        .values({
                                        type: "Void Shipment",
                                        sourceDocument: "Shipment",
                                        sourceDocumentId: shipmentId_1,
                                        sourceDocumentReadableId: shipment_1.data.shipmentId,
                                        attributes: {
                                            Shipment: shipmentId_1,
                                            "Purchase Order": purchaseOrder_2.data.id,
                                        },
                                        companyId: companyId_1,
                                        createdBy: userId_1,
                                        createdAt: today,
                                    })
                                        .returning(["id"])
                                        .execute()];
                            case 16:
                                voidActivity = _v.sent();
                                voidActivityId = voidActivity[0].id;
                                _v.label = 17;
                            case 17:
                                _v.trys.push([17, 24, 25, 30]);
                                _d = true, _e = __asyncValues(Object.entries(trackedEntityUpdates_4));
                                _v.label = 18;
                            case 18: return [4 /*yield*/, _e.next()];
                            case 19:
                                if (!(_f = _v.sent(), _o = _f.done, !_o)) return [3 /*break*/, 23];
                                _q = _f.value;
                                _d = false;
                                id = _q[0], update = _q[1];
                                return [4 /*yield*/, trx
                                        .updateTable("trackedEntity")
                                        .set(update)
                                        .where("id", "=", id)
                                        .execute()];
                            case 20:
                                _v.sent();
                                if (!voidActivityId) return [3 /*break*/, 22];
                                return [4 /*yield*/, trx
                                        .insertInto("trackedActivityInput")
                                        .values({
                                        trackedActivityId: voidActivityId,
                                        trackedEntityId: id,
                                        quantity: (_u = update.quantity) !== null && _u !== void 0 ? _u : 0,
                                        companyId: companyId_1,
                                        createdBy: userId_1,
                                        createdAt: today,
                                    })
                                        .execute()];
                            case 21:
                                _v.sent();
                                _v.label = 22;
                            case 22:
                                _d = true;
                                return [3 /*break*/, 18];
                            case 23: return [3 /*break*/, 30];
                            case 24:
                                e_21_1 = _v.sent();
                                e_21 = { error: e_21_1 };
                                return [3 /*break*/, 30];
                            case 25:
                                _v.trys.push([25, , 28, 29]);
                                if (!(!_d && !_o && (_p = _e.return))) return [3 /*break*/, 27];
                                return [4 /*yield*/, _p.call(_e)];
                            case 26:
                                _v.sent();
                                _v.label = 27;
                            case 27: return [3 /*break*/, 29];
                            case 28:
                                if (e_21) throw e_21.error;
                                return [7 /*endfinally*/];
                            case 29: return [7 /*endfinally*/];
                            case 30:
                                if (!(Object.keys(jobOperationsUpdates_2).length > 0)) return [3 /*break*/, 43];
                                console.log("Final job operation void updates to be applied:", jobOperationsUpdates_2);
                                _v.label = 31;
                            case 31:
                                _v.trys.push([31, 37, 38, 43]);
                                _g = true, _h = __asyncValues(Object.entries(jobOperationsUpdates_2));
                                _v.label = 32;
                            case 32: return [4 /*yield*/, _h.next()];
                            case 33:
                                if (!(_j = _v.sent(), _r = _j.done, !_r)) return [3 /*break*/, 36];
                                _t = _j.value;
                                _g = false;
                                jobOperationId = _t[0], update = _t[1];
                                console.log("Voiding job operation ".concat(jobOperationId, " with:"), update);
                                return [4 /*yield*/, trx
                                        .updateTable("jobOperation")
                                        .set(update)
                                        .where("id", "=", jobOperationId)
                                        .execute()];
                            case 34:
                                _v.sent();
                                _v.label = 35;
                            case 35:
                                _g = true;
                                return [3 /*break*/, 32];
                            case 36: return [3 /*break*/, 43];
                            case 37:
                                e_22_1 = _v.sent();
                                e_22 = { error: e_22_1 };
                                return [3 /*break*/, 43];
                            case 38:
                                _v.trys.push([38, , 41, 42]);
                                if (!(!_g && !_r && (_s = _h.return))) return [3 /*break*/, 40];
                                return [4 /*yield*/, _s.call(_h)];
                            case 39:
                                _v.sent();
                                _v.label = 40;
                            case 40: return [3 /*break*/, 42];
                            case 41:
                                if (e_22) throw e_22.error;
                                return [7 /*endfinally*/];
                            case 42: return [7 /*endfinally*/];
                            case 43: return [2 /*return*/];
                        }
                    });
                }); })];
            case 123:
                _141.sent();
                return [3 /*break*/, 140];
            case 124:
                if (!shipment_1.data.sourceDocumentId)
                    throw new Error("Shipment has no sourceDocumentId");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", shipment_1.data.sourceDocumentId)
                            .single(),
                        client
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", shipment_1.data.sourceDocumentId),
                    ])];
            case 125:
                _12 = _141.sent(), warehouseTransfer_2 = _12[0], warehouseTransferLines = _12[1];
                if (warehouseTransfer_2.error)
                    throw new Error("Failed to fetch warehouse transfer");
                if (warehouseTransferLines.error)
                    throw new Error("Failed to fetch warehouse transfer lines");
                itemLedgerInserts_5 = [];
                warehouseTransferLineUpdates_2 = {};
                _141.label = 126;
            case 126:
                _141.trys.push([126, 131, 132, 137]);
                _loop_8 = function () {
                    _36 = _15.value;
                    _13 = false;
                    var shipmentLine = _36;
                    var warehouseTransferLine = warehouseTransferLines.data.find(function (line) { return line.id === shipmentLine.lineId; });
                    if (!warehouseTransferLine)
                        return "continue";
                    var shippedQuantity = isNaN(shipmentLine.shippedQuantity) ||
                        shipmentLine.shippedQuantity == null
                        ? 0
                        : shipmentLine.shippedQuantity;
                    // Reverse warehouse transfer line shipped quantity
                    var newShippedQuantity = Math.max(0, ((_137 = warehouseTransferLine.shippedQuantity) !== null && _137 !== void 0 ? _137 : 0) - shippedQuantity);
                    warehouseTransferLineUpdates_2[warehouseTransferLine.id] = {
                        shippedQuantity: newShippedQuantity,
                    };
                    // Create item ledger entry to restore inventory at source
                    if (shippedQuantity !== 0) {
                        itemLedgerInserts_5.push({
                            postingDate: today,
                            itemId: shipmentLine.itemId,
                            quantity: shippedQuantity, // Positive to restore inventory
                            locationId: shipmentLine.locationId,
                            storageUnitId: shipmentLine.storageUnitId,
                            entryType: "Transfer",
                            documentType: "Transfer Shipment",
                            documentId: (_138 = warehouseTransfer_2.data) === null || _138 === void 0 ? void 0 : _138.transferId,
                            externalDocumentId: (_140 = (_139 = shipment_1.data) === null || _139 === void 0 ? void 0 : _139.externalDocumentId) !== null && _140 !== void 0 ? _140 : undefined,
                            createdBy: userId_1,
                            companyId: companyId_1,
                        });
                    }
                };
                _13 = true, _14 = __asyncValues(shipmentLines_1.data);
                _141.label = 127;
            case 127: return [4 /*yield*/, _14.next()];
            case 128:
                if (!(_15 = _141.sent(), _34 = _15.done, !_34)) return [3 /*break*/, 130];
                _loop_8();
                _141.label = 129;
            case 129:
                _13 = true;
                return [3 /*break*/, 127];
            case 130: return [3 /*break*/, 137];
            case 131:
                e_7_1 = _141.sent();
                e_7 = { error: e_7_1 };
                return [3 /*break*/, 137];
            case 132:
                _141.trys.push([132, , 135, 136]);
                if (!(!_13 && !_34 && (_35 = _14.return))) return [3 /*break*/, 134];
                return [4 /*yield*/, _35.call(_14)];
            case 133:
                _141.sent();
                _141.label = 134;
            case 134: return [3 /*break*/, 136];
            case 135:
                if (e_7) throw e_7.error;
                return [7 /*endfinally*/];
            case 136: return [7 /*endfinally*/];
            case 137:
                allLinesFullyShipped = warehouseTransferLines.data.every(function (line) {
                    var _a, _b, _c;
                    var updates = warehouseTransferLineUpdates_2[line.id];
                    var shippedQty = (_b = (_a = updates === null || updates === void 0 ? void 0 : updates.shippedQuantity) !== null && _a !== void 0 ? _a : line.shippedQuantity) !== null && _b !== void 0 ? _b : 0;
                    return shippedQty >= ((_c = line.quantity) !== null && _c !== void 0 ? _c : 0);
                });
                allLinesFullyReceived = warehouseTransferLines.data.every(function (line) {
                    var _a, _b;
                    var receivedQty = (_a = line.receivedQuantity) !== null && _a !== void 0 ? _a : 0;
                    return receivedQty >= ((_b = line.quantity) !== null && _b !== void 0 ? _b : 0);
                });
                newStatus_2 = warehouseTransfer_2.data.status;
                if (allLinesFullyShipped && allLinesFullyReceived) {
                    newStatus_2 = "Completed";
                }
                else if (allLinesFullyShipped && !allLinesFullyReceived) {
                    newStatus_2 = "To Receive";
                }
                else if (!allLinesFullyShipped && allLinesFullyReceived) {
                    newStatus_2 = "To Ship";
                }
                else {
                    newStatus_2 = "Draft";
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c, lineId, update, e_23_1;
                        var _d, e_23, _e, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 6, 7, 12]);
                                    _a = true, _b = __asyncValues(Object.entries(warehouseTransferLineUpdates_2));
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
                                    e_23_1 = _g.sent();
                                    e_23 = { error: e_23_1 };
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
                                    if (e_23) throw e_23.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: 
                                // Update warehouse transfer status
                                return [4 /*yield*/, trx
                                        .updateTable("warehouseTransfer")
                                        .set({
                                        status: newStatus_2,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", warehouseTransfer_2.data.id)
                                        .execute()];
                                case 13:
                                    // Update warehouse transfer status
                                    _g.sent();
                                    if (!(itemLedgerInserts_5.length > 0)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_5)
                                            .returning(["id"])
                                            .execute()];
                                case 14:
                                    _g.sent();
                                    _g.label = 15;
                                case 15: 
                                // Update shipment status to Voided
                                return [4 /*yield*/, trx
                                        .updateTable("shipment")
                                        .set({
                                        status: "Voided",
                                        updatedAt: today,
                                        updatedBy: userId_1,
                                    })
                                        .where("id", "=", shipmentId_1)
                                        .execute()];
                                case 16:
                                    // Update shipment status to Voided
                                    _g.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 138:
                _141.sent();
                return [3 /*break*/, 140];
            case 139:
                {
                    throw new Error("Invalid source document type: ".concat(shipment_1.data.sourceDocument));
                }
                _141.label = 140;
            case 140: return [3 /*break*/, 141];
            case 141: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                    splitEntityIds: splitEntityIds_1,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                })];
            case 142:
                err_1 = _141.sent();
                console.error(err_1);
                if (!("shipmentId" in payload)) return [3 /*break*/, 145];
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, payload.companyId, payload.userId, { update: "inventory" })];
            case 143:
                client = _141.sent();
                return [4 /*yield*/, client
                        .from("shipment")
                        .update({ status: "Draft" })
                        .eq("id", payload.shipmentId)];
            case 144:
                _141.sent();
                _141.label = 145;
            case 145: return [2 /*return*/, new Response(JSON.stringify(err_1), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 500,
                })];
            case 146: return [2 /*return*/];
        }
    });
}); });
