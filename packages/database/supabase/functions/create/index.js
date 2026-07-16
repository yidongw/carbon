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
var mod_ts_1 = require("https://deno.land/x/nanoid@v3.0.0/mod.ts");
var database_ts_1 = require("../lib/database.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var outside_processing_pricing_ts_1 = require("../lib/outside-processing-pricing.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.default.discriminatedUnion("type", [
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("nonConformanceTasks"),
        id: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("purchaseOrderFromJob"),
        jobId: npm_zod__3_24_1_1.default.string(),
        purchaseOrdersBySupplierId: npm_zod__3_24_1_1.default.record(npm_zod__3_24_1_1.default.string(), npm_zod__3_24_1_1.default.string()),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("receiptDefault"),
        locationId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("receiptFromPurchaseOrder"),
        locationId: npm_zod__3_24_1_1.default.string().optional(),
        purchaseOrderId: npm_zod__3_24_1_1.default.string(),
        receiptId: npm_zod__3_24_1_1.default.string().optional(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("receiptFromInboundTransfer"),
        warehouseTransferId: npm_zod__3_24_1_1.default.string(),
        receiptId: npm_zod__3_24_1_1.default.string().optional(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("receiptFromWarehouseTransfer"),
        warehouseTransferId: npm_zod__3_24_1_1.default.string(),
        receiptId: npm_zod__3_24_1_1.default.string().optional(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("receiptLineSplit"),
        quantity: npm_zod__3_24_1_1.default.number(),
        locationId: npm_zod__3_24_1_1.default.string(),
        receiptId: npm_zod__3_24_1_1.default.string(),
        receiptLineId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("shipmentDefault"),
        locationId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("shipmentFromPurchaseOrder"),
        locationId: npm_zod__3_24_1_1.default.string(),
        purchaseOrderId: npm_zod__3_24_1_1.default.string(),
        shipmentId: npm_zod__3_24_1_1.default.string().optional(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("shipmentFromWarehouseTransfer"),
        warehouseTransferId: npm_zod__3_24_1_1.default.string(),
        shipmentId: npm_zod__3_24_1_1.default.string().optional(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("shipmentFromSalesOrder"),
        locationId: npm_zod__3_24_1_1.default.string(),
        salesOrderId: npm_zod__3_24_1_1.default.string(),
        shipmentId: npm_zod__3_24_1_1.default.string().optional(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("shipmentFromSalesOrderLine"),
        locationId: npm_zod__3_24_1_1.default.string(),
        salesOrderLineId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("shipmentLineSplit"),
        quantity: npm_zod__3_24_1_1.default.number(),
        locationId: npm_zod__3_24_1_1.default.string(),
        shipmentId: npm_zod__3_24_1_1.default.string(),
        shipmentLineId: npm_zod__3_24_1_1.default.string(),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
    npm_zod__3_24_1_1.default.object({
        type: npm_zod__3_24_1_1.default.literal("journalEntry"),
        companyId: npm_zod__3_24_1_1.default.string(),
        userId: npm_zod__3_24_1_1.default.string(),
    }),
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, _a, type, companyId, userId, permissionsByType, client, _b, id_1, _c, nonConformance_1, actionTasks, approvalTasks, existingReviewers, workflow_1, _d, currentActionTasks_1, currentApprovalTasks_1, actionTasksToDelete_1, approvalTasksToDelete_1, reviewersToDelete_1, actionTaskInserts_1, approvalTaskInserts_1, reviewerInserts_1, hasMRBApproval, hasExistingMRBTask, hasExistingReviewers, error_1, jobId_1, purchaseOrdersBySupplierId_1, _e, job_1, jobOperations, outsideOperations, supplierProcessIds, supplierProcessIdList, outsideOperationIds, _f, supplierProcesses_1, existingPurchaseOrderLines_1, outsideOperationsBySupplierId_1, supplierIds, itemIds, supplierIdList, itemIdList, _g, suppliers_1, supplierPayments_1, supplierShipping_1, items_1, currencyCodes, companyRecord_1, exchangeRates_1, err_1, message, locationId_1, createdDocumentId_1, err_2, purchaseOrderId, existingReceiptId, userLocationId_1, _h, purchaseOrder_1, purchaseOrderLines, fixedAssetPoLines_1, receipt, locationId_2, items, serializedItems_1, batchItems_1, receiptItemIds, pickMethods, pickMethodKey_1, defaultStorageUnitByItemLocation_1, _i, _j, row, hasReceipt_1, isOutsideOperation_1, previouslyReceivedQuantitiesByLine_1, receiptLineItems_1, hasUnreceivedFaLines, receiptId_1, receiptIdReadable_1, err_3, warehouseTransferId_1, existingReceiptId, _k, warehouseTransfer_1, warehouseTransferLines, receipt_1, locationId_3, items, serializedItems_2, batchItems_2, hasReceipt_2, previouslyReceivedQuantitiesByLine_2, receiptLineItems_2, result, err_4, warehouseTransferId_2, existingReceiptId, _l, warehouseTransfer_2, warehouseTransferLines, receipt_2, locationId_4, items, serializedItems_3, batchItems_3, hasReceipt_3, previouslyReceivedQuantitiesByLine_3, receiptLineItems_3, result, err_5, receiptId, receiptLineId_1, quantity_1, locationId, _m, receiptLine_1, trackedEntities_1, err_6, createdDocumentId_2, locationId_5, err_7, warehouseTransferId_3, existingShipmentId, _o, warehouseTransfer_3, warehouseTransferLines, shipment_1, locationId_6, items, serializedItems_4, batchItems_4, hasShipment_1, previouslyShippedQuantitiesByLine_1, shipmentLineItems_1, result, err_8, purchaseOrderId, existingShipmentId, locationId_7, _p, purchaseOrder_2, purchaseOrderLines_1, purchaseOrderDelivery_1, shipment, items, serializedItems_5, batchItems_5, hasShipment_2, isOutsideOperation_2, previouslyShippedQuantitiesByLine_2, shipmentId_1, shipmentIdReadable_1, err_9, salesOrderId, existingShipmentId, locationId_8, _q, salesOrder_1, salesOrderLines_1, fixedAssetSoLines_1, salesOrderShipment_1, shipment, jobs, items, serializedItems_6, batchItems_6, hasShipment_3, jobsBySalesOrderLine_1, previouslyShippedQuantitiesByLine_3, shipmentId_2, shipmentIdReadable_2, err_10, salesOrderLineId_1, existingShipmentId, locationId_9, salesOrderLine_1, salesOrderId, _r, salesOrder_2, salesOrderShipment_2, shipment, jobs_1, item, isSerial_1, isBatch_1, hasShipment_4, previouslyShippedQuantity_1, shipmentId_3, shipmentIdReadable_3, err_11, shipmentId, shipmentLineId_1, quantity_2, locationId, shipmentLine_1, err_12, createdDocumentId_3, err_13;
    var _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45;
    return __generator(this, function (_46) {
        switch (_46.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _46.sent();
                _a = payloadValidator.parse(payload), type = _a.type, companyId = _a.companyId, userId = _a.userId;
                permissionsByType = {
                    nonConformanceTasks: { update: "quality" },
                    purchaseOrderFromJob: { create: ["purchasing", "production"] },
                    receiptDefault: { create: "inventory" },
                    receiptFromPurchaseOrder: { create: "inventory" },
                    receiptFromInboundTransfer: { create: "inventory" },
                    receiptFromWarehouseTransfer: { create: "inventory" },
                    receiptLineSplit: { create: "inventory" },
                    shipmentDefault: { create: "inventory" },
                    shipmentFromPurchaseOrder: { create: "inventory" },
                    shipmentFromWarehouseTransfer: { create: "inventory" },
                    shipmentFromSalesOrder: { create: "inventory" },
                    shipmentFromSalesOrderLine: { create: "inventory" },
                    shipmentLineSplit: { create: "inventory" },
                    journalEntry: { create: "accounting" },
                };
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId, userId, (_s = permissionsByType[type]) !== null && _s !== void 0 ? _s : { update: "settings" })];
            case 2:
                client = _46.sent();
                _b = type;
                switch (_b) {
                    case "nonConformanceTasks": return [3 /*break*/, 3];
                    case "purchaseOrderFromJob": return [3 /*break*/, 12];
                    case "receiptDefault": return [3 /*break*/, 23];
                    case "receiptFromPurchaseOrder": return [3 /*break*/, 27];
                    case "receiptFromInboundTransfer": return [3 /*break*/, 34];
                    case "receiptFromWarehouseTransfer": return [3 /*break*/, 40];
                    case "receiptLineSplit": return [3 /*break*/, 46];
                    case "shipmentDefault": return [3 /*break*/, 51];
                    case "shipmentFromWarehouseTransfer": return [3 /*break*/, 55];
                    case "shipmentFromPurchaseOrder": return [3 /*break*/, 61];
                    case "shipmentFromSalesOrder": return [3 /*break*/, 67];
                    case "shipmentFromSalesOrderLine": return [3 /*break*/, 73];
                    case "shipmentLineSplit": return [3 /*break*/, 80];
                    case "journalEntry": return [3 /*break*/, 85];
                }
                return [3 /*break*/, 88];
            case 3:
                id_1 = payload.id;
                console.log({
                    function: "create",
                    type: type,
                    id: id_1,
                });
                _46.label = 4;
            case 4:
                _46.trys.push([4, 10, , 11]);
                return [4 /*yield*/, Promise.all([
                        client.from("nonConformance").select("*").eq("id", id_1).single(),
                        client
                            .from("nonConformanceActionTask")
                            .select("*")
                            .eq("nonConformanceId", id_1),
                        client
                            .from("nonConformanceApprovalTask")
                            .select("*")
                            .eq("nonConformanceId", id_1),
                        client
                            .from("nonConformanceReviewer")
                            .select("*")
                            .eq("nonConformanceId", id_1),
                    ])];
            case 5:
                _c = _46.sent(), nonConformance_1 = _c[0], actionTasks = _c[1], approvalTasks = _c[2], existingReviewers = _c[3];
                if (nonConformance_1.error)
                    throw new Error(nonConformance_1.error.message);
                if (!((_t = nonConformance_1.data) === null || _t === void 0 ? void 0 : _t.nonConformanceWorkflowId)) return [3 /*break*/, 7];
                return [4 /*yield*/, client
                        .from("nonConformanceWorkflow")
                        .select("*")
                        .eq("id", (_u = nonConformance_1.data) === null || _u === void 0 ? void 0 : _u.nonConformanceWorkflowId)
                        .maybeSingle()];
            case 6:
                _d = _46.sent();
                return [3 /*break*/, 8];
            case 7:
                _d = null;
                _46.label = 8;
            case 8:
                workflow_1 = _d;
                if (workflow_1 === null || workflow_1 === void 0 ? void 0 : workflow_1.error)
                    throw new Error(workflow_1.error.message);
                currentActionTasks_1 = (_w = (_v = actionTasks.data) === null || _v === void 0 ? void 0 : _v.reduce(function (acc, d) {
                    if (d.actionTypeId && !acc[d.actionTypeId]) {
                        acc[d.actionTypeId] = d.id;
                    }
                    return acc;
                }, {})) !== null && _w !== void 0 ? _w : {};
                currentApprovalTasks_1 = (_y = (_x = approvalTasks.data) === null || _x === void 0 ? void 0 : _x.reduce(function (acc, d) {
                    if (d.approvalType && !acc[d.approvalType]) {
                        acc[d.approvalType] = d.id;
                    }
                    return acc;
                }, {})) !== null && _y !== void 0 ? _y : {};
                actionTasksToDelete_1 = [];
                approvalTasksToDelete_1 = [];
                reviewersToDelete_1 = [];
                Object.keys(currentActionTasks_1).forEach(function (actionTypeId) {
                    var _a, _b;
                    if (!((_b = (_a = nonConformance_1.data) === null || _a === void 0 ? void 0 : _a.requiredActionIds) !== null && _b !== void 0 ? _b : []).some(function (d) { return d === actionTypeId; })) {
                        actionTasksToDelete_1.push(currentActionTasks_1[actionTypeId]);
                    }
                });
                Object.keys(currentApprovalTasks_1).forEach(function (approvalType) {
                    var _a, _b;
                    if (!((_b = (_a = nonConformance_1.data) === null || _a === void 0 ? void 0 : _a.approvalRequirements) !== null && _b !== void 0 ? _b : []).some(function (d) { return d === approvalType; })) {
                        approvalTasksToDelete_1.push(currentApprovalTasks_1[approvalType]);
                    }
                });
                actionTaskInserts_1 = [];
                approvalTaskInserts_1 = [];
                reviewerInserts_1 = [];
                (_0 = (_z = nonConformance_1.data) === null || _z === void 0 ? void 0 : _z.requiredActionIds) === null || _0 === void 0 ? void 0 : _0.forEach(function (actionTypeId, index) {
                    if (!currentActionTasks_1[actionTypeId]) {
                        actionTaskInserts_1.push({
                            nonConformanceId: id_1,
                            actionTypeId: actionTypeId,
                            sortOrder: index + 1,
                            companyId: companyId,
                            createdBy: userId,
                        });
                    }
                });
                (_2 = (_1 = nonConformance_1.data) === null || _1 === void 0 ? void 0 : _1.approvalRequirements) === null || _2 === void 0 ? void 0 : _2.forEach(function (approvalType) {
                    if (!currentApprovalTasks_1[approvalType]) {
                        approvalTaskInserts_1.push({
                            nonConformanceId: id_1,
                            approvalType: approvalType,
                            companyId: companyId,
                            createdBy: userId,
                        });
                    }
                });
                hasMRBApproval = Array.isArray((_3 = nonConformance_1.data) === null || _3 === void 0 ? void 0 : _3.approvalRequirements) &&
                    ((_4 = nonConformance_1.data) === null || _4 === void 0 ? void 0 : _4.approvalRequirements.includes("MRB"));
                hasExistingMRBTask = Object.keys(currentApprovalTasks_1).includes("MRB");
                hasExistingReviewers = ((_6 = (_5 = existingReviewers.data) === null || _5 === void 0 ? void 0 : _5.length) !== null && _6 !== void 0 ? _6 : 0) > 0;
                // If MRB is no longer required but we have existing reviewers, delete them
                if (!hasMRBApproval && hasExistingReviewers) {
                    (_7 = existingReviewers.data) === null || _7 === void 0 ? void 0 : _7.forEach(function (reviewer) {
                        reviewersToDelete_1.push(reviewer.id);
                    });
                }
                // Only add reviewers if MRB is required and either:
                // 1. MRB task is newly added (not in currentApprovalTasks)
                // 2. There are no existing reviewers
                else if (hasMRBApproval &&
                    (!hasExistingMRBTask || !hasExistingReviewers)) {
                    reviewerInserts_1.push({
                        nonConformanceId: id_1,
                        title: "Engineering",
                        companyId: companyId,
                        createdBy: userId,
                    });
                    reviewerInserts_1.push({
                        nonConformanceId: id_1,
                        title: "Quality",
                        companyId: companyId,
                        createdBy: userId,
                    });
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var contentFromWorkflow, insertedContent;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    if (!(typeof ((_a = nonConformance_1.data) === null || _a === void 0 ? void 0 : _a.content) === "object" &&
                                        // @ts-ignore -- content is json
                                        Object.keys((_c = (_b = nonConformance_1.data) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : {}).length === 0)) return [3 /*break*/, 2];
                                    contentFromWorkflow = (_f = (_e = (_d = workflow_1 === null || workflow_1 === void 0 ? void 0 : workflow_1.data) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : [];
                                    insertedContent = {
                                        type: "doc",
                                        content: contentFromWorkflow,
                                    };
                                    if ((_g = nonConformance_1.data) === null || _g === void 0 ? void 0 : _g.description) {
                                        insertedContent.content.unshift({
                                            type: "paragraph",
                                            content: [
                                                { type: "text", text: (_h = nonConformance_1.data) === null || _h === void 0 ? void 0 : _h.description },
                                            ],
                                        });
                                    }
                                    console.log({
                                        description: (_j = nonConformance_1.data) === null || _j === void 0 ? void 0 : _j.description,
                                        insertedContent: insertedContent,
                                    });
                                    if (!(insertedContent.content.length > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, trx
                                            .updateTable("nonConformance")
                                            .set({
                                            content: JSON.stringify(insertedContent),
                                        })
                                            .where("id", "=", id_1)
                                            .execute()];
                                case 1:
                                    _k.sent();
                                    _k.label = 2;
                                case 2:
                                    if (!(actionTaskInserts_1.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx
                                            .insertInto("nonConformanceActionTask")
                                            .values(actionTaskInserts_1)
                                            .execute()];
                                case 3:
                                    _k.sent();
                                    _k.label = 4;
                                case 4:
                                    if (!(approvalTaskInserts_1.length > 0)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, trx
                                            .insertInto("nonConformanceApprovalTask")
                                            .values(approvalTaskInserts_1)
                                            .execute()];
                                case 5:
                                    _k.sent();
                                    _k.label = 6;
                                case 6:
                                    if (!(actionTasksToDelete_1.length > 0)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, trx
                                            .deleteFrom("nonConformanceActionTask")
                                            .where("id", "=", actionTasksToDelete_1)
                                            .execute()];
                                case 7:
                                    _k.sent();
                                    _k.label = 8;
                                case 8:
                                    if (!(approvalTasksToDelete_1.length > 0)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, trx
                                            .deleteFrom("nonConformanceApprovalTask")
                                            .where("id", "=", approvalTasksToDelete_1)
                                            .execute()];
                                case 9:
                                    _k.sent();
                                    _k.label = 10;
                                case 10:
                                    if (!(reviewerInserts_1.length > 0)) return [3 /*break*/, 12];
                                    return [4 /*yield*/, trx
                                            .insertInto("nonConformanceReviewer")
                                            .values(reviewerInserts_1)
                                            .execute()];
                                case 11:
                                    _k.sent();
                                    _k.label = 12;
                                case 12:
                                    if (!(reviewersToDelete_1.length > 0)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, trx
                                            .deleteFrom("nonConformanceReviewer")
                                            .where("id", "in", reviewersToDelete_1)
                                            .execute()];
                                case 13:
                                    _k.sent();
                                    _k.label = 14;
                                case 14: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 9:
                _46.sent();
                return [3 /*break*/, 11];
            case 10:
                error_1 = _46.sent();
                console.error(error_1);
                return [2 /*return*/, new Response(error_1.message, {
                        status: 500,
                        headers: headers_ts_1.corsHeaders,
                    })];
            case 11: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 12:
                jobId_1 = payload.jobId, purchaseOrdersBySupplierId_1 = payload.purchaseOrdersBySupplierId;
                console.log({
                    function: "create",
                    type: type,
                    jobId: jobId_1,
                    companyId: companyId,
                    userId: userId,
                });
                _46.label = 13;
            case 13:
                _46.trys.push([13, 21, , 22]);
                return [4 /*yield*/, Promise.all([
                        client.from("job").select("*").eq("id", jobId_1).single(),
                        client
                            .from("jobOperation")
                            .select("*, jobMakeMethod(itemId)")
                            .eq("jobId", jobId_1),
                    ])];
            case 14:
                _e = _46.sent(), job_1 = _e[0], jobOperations = _e[1];
                if (jobOperations.error)
                    throw new Error(jobOperations.error.message);
                outsideOperations = (_8 = jobOperations.data) === null || _8 === void 0 ? void 0 : _8.filter(function (d) { return d.operationType === "Outside"; });
                if (!(outsideOperations.length > 0)) return [3 /*break*/, 20];
                supplierProcessIds = new Set(outsideOperations
                    .map(function (d) { return d.operationSupplierProcessId; })
                    .filter(Boolean));
                supplierProcessIdList = Array.from(supplierProcessIds);
                outsideOperationIds = outsideOperations.map(function (d) { return d.id; });
                return [4 /*yield*/, Promise.all([
                        supplierProcessIdList.length > 0
                            ? client
                                .from("supplierProcess")
                                .select("*")
                                .in("id", supplierProcessIdList)
                            : Promise.resolve({ data: [], error: null }),
                        outsideOperationIds.length > 0
                            ? client
                                .from("purchaseOrderLine")
                                .select("*")
                                .eq("jobId", jobId_1)
                                .in("jobOperationId", outsideOperationIds)
                            : Promise.resolve({ data: [], error: null }),
                    ])];
            case 15:
                _f = _46.sent(), supplierProcesses_1 = _f[0], existingPurchaseOrderLines_1 = _f[1];
                if (supplierProcesses_1.error)
                    throw new Error(supplierProcesses_1.error.message);
                if (existingPurchaseOrderLines_1.error)
                    throw new Error(existingPurchaseOrderLines_1.error.message);
                outsideOperationsBySupplierId_1 = outsideOperations.reduce(function (acc, oo) {
                    var _a, _b;
                    var supplierProcess = (_a = supplierProcesses_1.data) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.id === oo.operationSupplierProcessId; });
                    if ((_b = existingPurchaseOrderLines_1.data) === null || _b === void 0 ? void 0 : _b.find(function (d) { return d.jobOperationId === oo.id; })) {
                        return acc;
                    }
                    if (!supplierProcess)
                        return acc;
                    if (!acc[supplierProcess.supplierId]) {
                        acc[supplierProcess.supplierId] = [];
                    }
                    acc[supplierProcess.supplierId].push(oo);
                    return acc;
                }, {});
                supplierIds = new Set(Object.keys(outsideOperationsBySupplierId_1));
                itemIds = new Set(outsideOperations
                    .map(function (d) { var _a; return (_a = d.jobMakeMethod) === null || _a === void 0 ? void 0 : _a.itemId; })
                    .filter(Boolean));
                supplierIdList = Array.from(supplierIds);
                itemIdList = Array.from(itemIds);
                return [4 /*yield*/, Promise.all([
                        supplierIdList.length > 0
                            ? client.from("supplier").select("*").in("id", supplierIdList)
                            : Promise.resolve({ data: [], error: null }),
                        supplierIdList.length > 0
                            ? client
                                .from("supplierPayment")
                                .select("*")
                                .in("supplierId", supplierIdList)
                            : Promise.resolve({ data: [], error: null }),
                        supplierIdList.length > 0
                            ? client
                                .from("supplierShipping")
                                .select("*")
                                .in("supplierId", supplierIdList)
                            : Promise.resolve({ data: [], error: null }),
                        itemIdList.length > 0
                            ? client.from("item").select("*").in("id", itemIdList)
                            : Promise.resolve({ data: [], error: null }),
                    ])];
            case 16:
                _g = _46.sent(), suppliers_1 = _g[0], supplierPayments_1 = _g[1], supplierShipping_1 = _g[2], items_1 = _g[3];
                if (suppliers_1.error)
                    throw new Error(suppliers_1.error.message);
                if (supplierPayments_1.error)
                    throw new Error(supplierPayments_1.error.message);
                if (supplierShipping_1.error)
                    throw new Error(supplierShipping_1.error.message);
                currencyCodes = new Set((_9 = suppliers_1.data) === null || _9 === void 0 ? void 0 : _9.map(function (d) { return d.currencyCode; }).filter(Boolean));
                return [4 /*yield*/, client
                        .from("company")
                        .select("companyGroupId")
                        .eq("id", companyId)
                        .single()];
            case 17:
                companyRecord_1 = _46.sent();
                if (companyRecord_1.error)
                    throw new Error(companyRecord_1.error.message);
                return [4 /*yield*/, Promise.all(Array.from(currencyCodes).map(function (currencyCode) { return __awaiter(void 0, void 0, void 0, function () {
                        var exchangeRate;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, client
                                        .from("currency")
                                        .select("*")
                                        .eq("code", currencyCode)
                                        .eq("companyGroupId", companyRecord_1.data.companyGroupId)
                                        .single()];
                                case 1:
                                    exchangeRate = _c.sent();
                                    return [2 /*return*/, {
                                            currencyCode: currencyCode,
                                            exchangeRate: (_b = (_a = exchangeRate.data) === null || _a === void 0 ? void 0 : _a.exchangeRate) !== null && _b !== void 0 ? _b : 1,
                                        }];
                            }
                        });
                    }); }))];
            case 18:
                exchangeRates_1 = _46.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _loop_1, _a, _b, _c, e_1_1;
                        var _d, e_1, _e, _f, _g, e_2, _h, _j;
                        var _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
                        return __generator(this, function (_10) {
                            switch (_10.label) {
                                case 0:
                                    _10.trys.push([0, 6, 7, 12]);
                                    _loop_1 = function () {
                                        var supplier, outsideOperations_2, payment, shipping, purchaseOrderId, supplierInteraction, supplierInteractionId, nextSequence, order, locationId, shippingMethodId, shippingTermId, paymentTermId, invoiceSupplierId, invoiceSupplierContactId, invoiceSupplierLocationId, purchaseOrderLineInserts, _loop_2, _11, outsideOperations_1, outsideOperations_1_1, e_2_1;
                                        return __generator(this, function (_12) {
                                            switch (_12.label) {
                                                case 0:
                                                    _f = _c.value;
                                                    _a = false;
                                                    supplier = _f;
                                                    outsideOperations_2 = outsideOperationsBySupplierId_1[supplier];
                                                    payment = (_k = supplierPayments_1.data) === null || _k === void 0 ? void 0 : _k.find(function (d) { return d.supplierId === supplier; });
                                                    shipping = (_l = supplierShipping_1.data) === null || _l === void 0 ? void 0 : _l.find(function (d) { return d.supplierId === supplier; });
                                                    purchaseOrderId = purchaseOrdersBySupplierId_1[supplier] === "new"
                                                        ? undefined
                                                        : purchaseOrdersBySupplierId_1[supplier];
                                                    if (!!purchaseOrderId) return [3 /*break*/, 5];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("supplierInteraction")
                                                            .values({
                                                            companyId: companyId,
                                                            supplierId: supplier,
                                                        })
                                                            .returning(["id"])
                                                            .execute()];
                                                case 1:
                                                    supplierInteraction = _12.sent();
                                                    supplierInteractionId = (_m = supplierInteraction === null || supplierInteraction === void 0 ? void 0 : supplierInteraction[0]) === null || _m === void 0 ? void 0 : _m.id;
                                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "purchaseOrder", companyId)];
                                                case 2:
                                                    nextSequence = _12.sent();
                                                    if (!nextSequence)
                                                        throw new Error("Failed to get next sequence");
                                                    if (!supplierInteractionId)
                                                        throw new Error("Failed to create supplier interaction");
                                                    return [4 /*yield*/, trx
                                                            .insertInto("purchaseOrder")
                                                            .values({
                                                            purchaseOrderId: nextSequence,
                                                            status: "Draft",
                                                            supplierId: supplier,
                                                            jobId: jobId_1,
                                                            jobReadableId: (_o = job_1.data) === null || _o === void 0 ? void 0 : _o.jobId,
                                                            companyId: companyId,
                                                            createdBy: userId,
                                                            purchaseOrderType: "Outside Processing",
                                                            supplierInteractionId: supplierInteractionId,
                                                            currencyCode: (_r = (_q = (_p = suppliers_1.data) === null || _p === void 0 ? void 0 : _p.find(function (d) { return d.id === supplier; })) === null || _q === void 0 ? void 0 : _q.currencyCode) !== null && _r !== void 0 ? _r : "USD",
                                                            exchangeRate: (_t = (_s = exchangeRates_1.find(function (d) {
                                                                var _a, _b;
                                                                return d.currencyCode ===
                                                                    ((_b = (_a = suppliers_1.data) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.id === supplier; })) === null || _b === void 0 ? void 0 : _b.currencyCode);
                                                            })) === null || _s === void 0 ? void 0 : _s.exchangeRate) !== null && _t !== void 0 ? _t : 1,
                                                            exchangeRateUpdatedAt: new Date().toISOString(),
                                                        })
                                                            .returning(["id"])
                                                            .execute()];
                                                case 3:
                                                    order = _12.sent();
                                                    if (!((_u = order === null || order === void 0 ? void 0 : order[0]) === null || _u === void 0 ? void 0 : _u.id))
                                                        throw new Error("Failed to create purchase order");
                                                    purchaseOrderId = order[0].id;
                                                    locationId = (_w = (_v = job_1.data) === null || _v === void 0 ? void 0 : _v.locationId) !== null && _w !== void 0 ? _w : null;
                                                    shippingMethodId = shipping === null || shipping === void 0 ? void 0 : shipping.shippingMethodId;
                                                    shippingTermId = shipping === null || shipping === void 0 ? void 0 : shipping.shippingTermId;
                                                    paymentTermId = payment === null || payment === void 0 ? void 0 : payment.paymentTermId;
                                                    invoiceSupplierId = payment === null || payment === void 0 ? void 0 : payment.invoiceSupplierId;
                                                    invoiceSupplierContactId = payment === null || payment === void 0 ? void 0 : payment.invoiceSupplierContactId;
                                                    invoiceSupplierLocationId = payment === null || payment === void 0 ? void 0 : payment.invoiceSupplierLocationId;
                                                    return [4 /*yield*/, Promise.all([
                                                            trx
                                                                .insertInto("purchaseOrderDelivery")
                                                                .values({
                                                                id: purchaseOrderId,
                                                                locationId: locationId,
                                                                shippingMethodId: shippingMethodId,
                                                                shippingTermId: shippingTermId,
                                                                companyId: companyId,
                                                            })
                                                                .execute(),
                                                            trx
                                                                .insertInto("purchaseOrderPayment")
                                                                .values({
                                                                id: purchaseOrderId,
                                                                invoiceSupplierId: invoiceSupplierId,
                                                                invoiceSupplierContactId: invoiceSupplierContactId,
                                                                invoiceSupplierLocationId: invoiceSupplierLocationId,
                                                                paymentTermId: paymentTermId,
                                                                companyId: companyId,
                                                            })
                                                                .execute(),
                                                        ])];
                                                case 4:
                                                    _12.sent();
                                                    _12.label = 5;
                                                case 5:
                                                    purchaseOrderLineInserts = [];
                                                    _12.label = 6;
                                                case 6:
                                                    _12.trys.push([6, 11, 12, 17]);
                                                    _loop_2 = function () {
                                                        _j = outsideOperations_1_1.value;
                                                        _11 = false;
                                                        var operation = _j;
                                                        // Get the item associated with the operation
                                                        var item = (_x = items_1.data) === null || _x === void 0 ? void 0 : _x.find(function (d) { var _a; return d.id === ((_a = operation.jobMakeMethod) === null || _a === void 0 ? void 0 : _a.itemId); });
                                                        var supplierProcess = (_y = supplierProcesses_1.data) === null || _y === void 0 ? void 0 : _y.find(function (d) { return d.id === operation.operationSupplierProcessId; });
                                                        if (item && supplierProcess) {
                                                            var unitCost = (_0 = (_z = operation.operationUnitCost) !== null && _z !== void 0 ? _z : supplierProcess.unitCost) !== null && _0 !== void 0 ? _0 : 0;
                                                            var minimumCost = (_2 = (_1 = operation.operationMinimumCost) !== null && _1 !== void 0 ? _1 : supplierProcess.minimumCost) !== null && _2 !== void 0 ? _2 : 0;
                                                            var quantity = (_3 = operation.operationQuantity) !== null && _3 !== void 0 ? _3 : 1;
                                                            var exchangeRate = (_5 = (_4 = exchangeRates_1.find(function (d) {
                                                                var _a, _b;
                                                                return d.currencyCode ===
                                                                    ((_b = (_a = suppliers_1.data) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.id === supplier; })) === null || _b === void 0 ? void 0 : _b.currencyCode);
                                                            })) === null || _4 === void 0 ? void 0 : _4.exchangeRate) !== null && _5 !== void 0 ? _5 : 1;
                                                            var pricingLines = (0, outside_processing_pricing_ts_1.calculateOutsideProcessingPurchaseOrderLines)({
                                                                quantity: quantity,
                                                                unitCost: unitCost,
                                                                minimumCost: minimumCost,
                                                                minimumCostDescription: "Minimum cost - ".concat((_7 = (_6 = operation.description) !== null && _6 !== void 0 ? _6 : item.name) !== null && _7 !== void 0 ? _7 : "Outside processing")
                                                            });
                                                            var purchaseOrderLineType = (0, outside_processing_pricing_ts_1.toPurchaseOrderItemLineType)(item.type);
                                                            for (var _i = 0, pricingLines_1 = pricingLines; _i < pricingLines_1.length; _i++) {
                                                                var pricingLine = pricingLines_1[_i];
                                                                purchaseOrderLineInserts.push({
                                                                    purchaseOrderId: purchaseOrderId,
                                                                    purchaseOrderLineType: purchaseOrderLineType,
                                                                    itemId: item.id,
                                                                    description: pricingLine.isMinimumCostLine
                                                                        ? pricingLine.description
                                                                        : item.name || item.description,
                                                                    purchaseQuantity: pricingLine.purchaseQuantity,
                                                                    purchaseUnitOfMeasureCode: item.unitOfMeasureCode,
                                                                    inventoryUnitOfMeasureCode: item.unitOfMeasureCode,
                                                                    conversionFactor: 1,
                                                                    supplierUnitPrice: pricingLine.supplierUnitPrice,
                                                                    locationId: (_8 = job_1.data) === null || _8 === void 0 ? void 0 : _8.locationId,
                                                                    jobId: (_9 = job_1.data) === null || _9 === void 0 ? void 0 : _9.id,
                                                                    jobOperationId: pricingLine.isMinimumCostLine
                                                                        ? undefined
                                                                        : operation.id,
                                                                    companyId: companyId,
                                                                    createdBy: userId,
                                                                    exchangeRate: exchangeRate
                                                                });
                                                            }
                                                        }
                                                    };
                                                    _11 = true, outsideOperations_1 = (e_2 = void 0, __asyncValues(outsideOperations_2));
                                                    _12.label = 7;
                                                case 7: return [4 /*yield*/, outsideOperations_1.next()];
                                                case 8:
                                                    if (!(outsideOperations_1_1 = _12.sent(), _g = outsideOperations_1_1.done, !_g)) return [3 /*break*/, 10];
                                                    _loop_2();
                                                    _12.label = 9;
                                                case 9:
                                                    _11 = true;
                                                    return [3 /*break*/, 7];
                                                case 10: return [3 /*break*/, 17];
                                                case 11:
                                                    e_2_1 = _12.sent();
                                                    e_2 = { error: e_2_1 };
                                                    return [3 /*break*/, 17];
                                                case 12:
                                                    _12.trys.push([12, , 15, 16]);
                                                    if (!(!_11 && !_g && (_h = outsideOperations_1.return))) return [3 /*break*/, 14];
                                                    return [4 /*yield*/, _h.call(outsideOperations_1)];
                                                case 13:
                                                    _12.sent();
                                                    _12.label = 14;
                                                case 14: return [3 /*break*/, 16];
                                                case 15:
                                                    if (e_2) throw e_2.error;
                                                    return [7 /*endfinally*/];
                                                case 16: return [7 /*endfinally*/];
                                                case 17:
                                                    if (!(purchaseOrderLineInserts.length > 0)) return [3 /*break*/, 19];
                                                    return [4 /*yield*/, trx
                                                            .insertInto("purchaseOrderLine")
                                                            .values(purchaseOrderLineInserts)
                                                            .execute()];
                                                case 18:
                                                    _12.sent();
                                                    _12.label = 19;
                                                case 19: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _a = true, _b = __asyncValues(Object.keys(outsideOperationsBySupplierId_1));
                                    _10.label = 1;
                                case 1: return [4 /*yield*/, _b.next()];
                                case 2:
                                    if (!(_c = _10.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                                    return [5 /*yield**/, _loop_1()];
                                case 3:
                                    _10.sent();
                                    _10.label = 4;
                                case 4:
                                    _a = true;
                                    return [3 /*break*/, 1];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_1_1 = _10.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _10.trys.push([7, , 10, 11]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 8:
                                    _10.sent();
                                    _10.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 19:
                _46.sent();
                _46.label = 20;
            case 20: return [3 /*break*/, 22];
            case 21:
                err_1 = _46.sent();
                console.error(err_1);
                message = err_1 instanceof Error ? err_1.message : String(err_1 !== null && err_1 !== void 0 ? err_1 : "Unknown error");
                return [2 /*return*/, new Response(JSON.stringify({ message: message }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 22: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 23:
                locationId_1 = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    locationId: locationId_1,
                    companyId: companyId,
                    userId: userId,
                });
                _46.label = 24;
            case 24:
                _46.trys.push([24, 26, , 27]);
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newReceipt;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "receipt", companyId)];
                                case 1:
                                    createdDocumentId_1 = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("receipt")
                                            .values({
                                            receiptId: createdDocumentId_1,
                                            companyId: companyId,
                                            locationId: locationId_1,
                                            createdBy: userId,
                                        })
                                            .returning(["id", "receiptId"])
                                            .execute()];
                                case 2:
                                    newReceipt = _b.sent();
                                    createdDocumentId_1 = (_a = newReceipt === null || newReceipt === void 0 ? void 0 : newReceipt[0]) === null || _a === void 0 ? void 0 : _a.id;
                                    if (!createdDocumentId_1)
                                        throw new Error("Failed to create receipt");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 25:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: createdDocumentId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 26:
                err_2 = _46.sent();
                console.error(err_2);
                return [2 /*return*/, new Response(JSON.stringify(err_2), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 27:
                purchaseOrderId = payload.purchaseOrderId, existingReceiptId = payload.receiptId, userLocationId_1 = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    purchaseOrderId: purchaseOrderId,
                    existingReceiptId: existingReceiptId,
                    userLocationId: userLocationId_1,
                    userId: userId,
                });
                _46.label = 28;
            case 28:
                _46.trys.push([28, 33, , 34]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrders")
                            .select("*")
                            .eq("id", purchaseOrderId)
                            .single(),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", purchaseOrderId)
                            .in("purchaseOrderLineType", [
                            "Part",
                            "Material",
                            "Tool",
                            "Fixture",
                            "Consumable",
                        ]),
                        client
                            .from("purchaseOrderLine")
                            .select("id, purchaseOrderLineType, assetId, purchaseQuantity, quantityReceived, receivedComplete")
                            .eq("purchaseOrderId", purchaseOrderId)
                            .eq("purchaseOrderLineType", "Fixed Asset"),
                        client
                            .from("receipt")
                            .select("*")
                            .eq("id", existingReceiptId)
                            .maybeSingle(),
                    ])];
            case 29:
                _h = _46.sent(), purchaseOrder_1 = _h[0], purchaseOrderLines = _h[1], fixedAssetPoLines_1 = _h[2], receipt = _h[3];
                if (!purchaseOrder_1.data)
                    throw new Error("Purchase order not found");
                if (purchaseOrderLines.error)
                    throw new Error(purchaseOrderLines.error.message);
                locationId_2 = purchaseOrder_1.data.locationId;
                if (purchaseOrderLines.data.some(function (d) {
                    return d.locationId !== locationId_2 && d.locationId === userLocationId_1;
                })) {
                    locationId_2 = userLocationId_1;
                }
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .in("id", purchaseOrderLines.data
                        .filter(function (d) { return d.locationId === locationId_2; })
                        .map(function (d) { return d.itemId; }))];
            case 30:
                items = _46.sent();
                serializedItems_1 = new Set((_10 = items.data) === null || _10 === void 0 ? void 0 : _10.filter(function (d) { return d.itemTrackingType === "Serial"; }).map(function (d) { return d.id; }));
                batchItems_1 = new Set((_11 = items.data) === null || _11 === void 0 ? void 0 : _11.filter(function (d) { return d.itemTrackingType === "Batch"; }).map(function (d) { return d.id; }));
                receiptItemIds = purchaseOrderLines.data
                    .filter(function (d) { return !!d.itemId; })
                    .map(function (d) { return d.itemId; });
                return [4 /*yield*/, client
                        .from("pickMethod")
                        .select("itemId, locationId, defaultStorageUnitId")
                        .in("itemId", receiptItemIds)];
            case 31:
                pickMethods = _46.sent();
                pickMethodKey_1 = function (itemId, loc) {
                    return "".concat(itemId, "::").concat(loc !== null && loc !== void 0 ? loc : "");
                };
                defaultStorageUnitByItemLocation_1 = new Map();
                for (_i = 0, _j = (_12 = pickMethods.data) !== null && _12 !== void 0 ? _12 : []; _i < _j.length; _i++) {
                    row = _j[_i];
                    if (row.defaultStorageUnitId) {
                        defaultStorageUnitByItemLocation_1.set(pickMethodKey_1(row.itemId, row.locationId), row.defaultStorageUnitId);
                    }
                }
                hasReceipt_1 = !!((_13 = receipt.data) === null || _13 === void 0 ? void 0 : _13.id);
                isOutsideOperation_1 = purchaseOrder_1.data.purchaseOrderType === "Outside Processing";
                previouslyReceivedQuantitiesByLine_1 = ((_14 = purchaseOrderLines.data) !== null && _14 !== void 0 ? _14 : []).reduce(function (acc, d) {
                    var _a;
                    if (d.id)
                        acc[d.id] = (_a = d.quantityReceived) !== null && _a !== void 0 ? _a : 0;
                    return acc;
                }, {});
                receiptLineItems_1 = purchaseOrderLines.data.reduce(function (acc, d) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                    if (!d.itemId ||
                        !d.purchaseQuantity ||
                        d.purchaseOrderLineType === "Service" ||
                        d.purchaseOrderLineType === "G/L Account") {
                        return acc;
                    }
                    var unitPrice = (_a = d.unitPrice) !== null && _a !== void 0 ? _a : 0;
                    var outstandingQuantity = d.purchaseQuantity -
                        ((_b = previouslyReceivedQuantitiesByLine_1[d.id]) !== null && _b !== void 0 ? _b : 0);
                    var shippingAndTaxUnitCost = (((_c = d.taxAmount) !== null && _c !== void 0 ? _c : 0) + ((_d = d.shippingCost) !== null && _d !== void 0 ? _d : 0)) /
                        (d.purchaseQuantity * ((_e = d.conversionFactor) !== null && _e !== void 0 ? _e : 1));
                    acc.push({
                        lineId: d.id,
                        companyId: companyId,
                        itemId: d.itemId,
                        orderQuantity: d.purchaseQuantity * ((_f = d.conversionFactor) !== null && _f !== void 0 ? _f : 1),
                        outstandingQuantity: outstandingQuantity * ((_g = d.conversionFactor) !== null && _g !== void 0 ? _g : 1),
                        receivedQuantity: outstandingQuantity * ((_h = d.conversionFactor) !== null && _h !== void 0 ? _h : 1),
                        conversionFactor: (_j = d.conversionFactor) !== null && _j !== void 0 ? _j : 1,
                        requiresSerialTracking: serializedItems_1.has(d.itemId) && !isOutsideOperation_1,
                        requiresBatchTracking: batchItems_1.has(d.itemId) && !isOutsideOperation_1,
                        unitPrice: unitPrice / ((_k = d.conversionFactor) !== null && _k !== void 0 ? _k : 1) + shippingAndTaxUnitCost,
                        unitOfMeasure: (_l = d.inventoryUnitOfMeasureCode) !== null && _l !== void 0 ? _l : "EA",
                        locationId: (_m = d.locationId) !== null && _m !== void 0 ? _m : null,
                        storageUnitId: (_q = (_o = d.storageUnitId) !== null && _o !== void 0 ? _o : defaultStorageUnitByItemLocation_1.get(pickMethodKey_1(d.itemId, (_p = d.locationId) !== null && _p !== void 0 ? _p : null))) !== null && _q !== void 0 ? _q : null,
                        createdBy: userId !== null && userId !== void 0 ? userId : "",
                    });
                    return acc;
                }, []);
                hasUnreceivedFaLines = ((_15 = fixedAssetPoLines_1.data) !== null && _15 !== void 0 ? _15 : []).some(function (d) { return d.assetId && d.purchaseQuantity && !d.receivedComplete; });
                if (receiptLineItems_1.length === 0 && !hasUnreceivedFaLines) {
                    throw new Error("No valid receipt line items found");
                }
                receiptId_1 = hasReceipt_1 ? (_16 = receipt.data) === null || _16 === void 0 ? void 0 : _16.id : "";
                receiptIdReadable_1 = hasReceipt_1 ? (_17 = receipt.data) === null || _17 === void 0 ? void 0 : _17.receiptId : "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newReceipt, unreceivedFaLines;
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!hasReceipt_1) return [3 /*break*/, 3];
                                    // update existing receipt
                                    return [4 /*yield*/, trx
                                            .updateTable("receipt")
                                            .set({
                                            sourceDocument: "Purchase Order",
                                            sourceDocumentId: purchaseOrder_1.data.id,
                                            sourceDocumentReadableId: purchaseOrder_1.data.purchaseOrderId,
                                            locationId: locationId_2,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", receiptId_1)
                                            .returning(["id", "receiptId"])
                                            .execute()];
                                case 1:
                                    // update existing receipt
                                    _d.sent();
                                    // delete existing receipt lines
                                    return [4 /*yield*/, trx
                                            .deleteFrom("receiptLine")
                                            .where("receiptId", "=", receiptId_1)
                                            .execute()];
                                case 2:
                                    // delete existing receipt lines
                                    _d.sent();
                                    return [3 /*break*/, 6];
                                case 3: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "receipt", companyId)];
                                case 4:
                                    receiptIdReadable_1 = _d.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("receipt")
                                            .values({
                                            receiptId: receiptIdReadable_1,
                                            sourceDocument: "Purchase Order",
                                            sourceDocumentId: purchaseOrder_1.data.id,
                                            sourceDocumentReadableId: purchaseOrder_1.data.purchaseOrderId,
                                            supplierId: purchaseOrder_1.data.supplierId,
                                            supplierInteractionId: purchaseOrder_1.data.supplierInteractionId,
                                            companyId: companyId,
                                            locationId: locationId_2,
                                            createdBy: userId,
                                        })
                                            .returning(["id", "receiptId"])
                                            .execute()];
                                case 5:
                                    newReceipt = _d.sent();
                                    receiptId_1 = (_a = newReceipt === null || newReceipt === void 0 ? void 0 : newReceipt[0]) === null || _a === void 0 ? void 0 : _a.id;
                                    receiptIdReadable_1 = (_b = newReceipt === null || newReceipt === void 0 ? void 0 : newReceipt[0]) === null || _b === void 0 ? void 0 : _b.receiptId;
                                    _d.label = 6;
                                case 6:
                                    if (!(receiptLineItems_1.length > 0)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, trx
                                            .insertInto("receiptLine")
                                            .values(receiptLineItems_1.map(function (line) { return (__assign(__assign({}, line), { receiptId: receiptId_1, locationId: locationId_2 })); }))
                                            .execute()];
                                case 7:
                                    _d.sent();
                                    _d.label = 8;
                                case 8:
                                    unreceivedFaLines = ((_c = fixedAssetPoLines_1.data) !== null && _c !== void 0 ? _c : []).filter(function (d) { return d.assetId && d.purchaseQuantity && !d.receivedComplete; });
                                    if (!(unreceivedFaLines.length > 0)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, trx
                                            .deleteFrom("receiptFixedAssetLine")
                                            .where("receiptId", "=", receiptId_1)
                                            .execute()];
                                case 9:
                                    _d.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("receiptFixedAssetLine")
                                            .values(unreceivedFaLines.map(function (line) { return ({
                                            receiptId: receiptId_1,
                                            purchaseOrderLineId: line.id,
                                            received: true,
                                            companyId: companyId,
                                            createdBy: userId,
                                        }); }))
                                            .execute()];
                                case 10:
                                    _d.sent();
                                    _d.label = 11;
                                case 11: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 32:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: receiptId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 33:
                err_3 = _46.sent();
                console.error(err_3);
                return [2 /*return*/, new Response(JSON.stringify(err_3), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 34:
                warehouseTransferId_1 = payload.warehouseTransferId, existingReceiptId = payload.receiptId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    warehouseTransferId: warehouseTransferId_1,
                    existingReceiptId: existingReceiptId,
                    userId: userId,
                });
                _46.label = 35;
            case 35:
                _46.trys.push([35, 39, , 40]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", warehouseTransferId_1)
                            .single(),
                        client
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", warehouseTransferId_1),
                        client
                            .from("receipt")
                            .select("*")
                            .eq("id", existingReceiptId)
                            .maybeSingle(),
                    ])];
            case 36:
                _k = _46.sent(), warehouseTransfer_1 = _k[0], warehouseTransferLines = _k[1], receipt_1 = _k[2];
                if (!warehouseTransfer_1.data)
                    throw new Error("Warehouse transfer not found");
                if (warehouseTransferLines.error)
                    throw new Error(warehouseTransferLines.error.message);
                locationId_3 = warehouseTransfer_1.data.toLocationId;
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .in("id", warehouseTransferLines.data
                        .map(function (d) { return d.itemId; })
                        .filter(Boolean))];
            case 37:
                items = _46.sent();
                serializedItems_2 = new Set((_18 = items.data) === null || _18 === void 0 ? void 0 : _18.filter(function (d) { return d.itemTrackingType === "Serial"; }).map(function (d) { return d.id; }));
                batchItems_2 = new Set((_19 = items.data) === null || _19 === void 0 ? void 0 : _19.filter(function (d) { return d.itemTrackingType === "Batch"; }).map(function (d) { return d.id; }));
                hasReceipt_2 = !!((_20 = receipt_1.data) === null || _20 === void 0 ? void 0 : _20.id);
                previouslyReceivedQuantitiesByLine_2 = ((_21 = warehouseTransferLines.data) !== null && _21 !== void 0 ? _21 : []).reduce(function (acc, d) {
                    var _a;
                    if (d.id)
                        acc[d.id] = (_a = d.receivedQuantity) !== null && _a !== void 0 ? _a : 0;
                    return acc;
                }, {});
                receiptLineItems_2 = warehouseTransferLines.data.reduce(function (acc, d) {
                    var _a, _b, _c, _d, _e;
                    if (!d.itemId || !d.quantity)
                        return acc;
                    var serialTracking = serializedItems_2.has(d.itemId);
                    var batchTracking = batchItems_2.has(d.itemId);
                    // For unshipped lines, we want all lines where shippedQuantity < quantity
                    var quantityToReceive = Math.max(0, ((_a = d.shippedQuantity) !== null && _a !== void 0 ? _a : 0) -
                        ((_b = previouslyReceivedQuantitiesByLine_2[d.id]) !== null && _b !== void 0 ? _b : 0));
                    if (quantityToReceive === 0)
                        return acc;
                    acc.push({
                        lineId: d.id,
                        itemId: d.itemId,
                        locationId: (_c = d.toLocationId) !== null && _c !== void 0 ? _c : locationId_3,
                        storageUnitId: d.toStorageUnitId,
                        requiresSerialTracking: serialTracking,
                        requiresBatchTracking: batchTracking,
                        receivedQuantity: quantityToReceive,
                        outstandingQuantity: quantityToReceive,
                        unitPrice: 0, // Transfers don't have a unit price
                        conversionFactor: 1,
                        unitOfMeasure: (_d = d.unitOfMeasureCode) !== null && _d !== void 0 ? _d : "EA",
                        companyId: companyId,
                        createdBy: userId,
                        orderQuantity: (_e = d.quantity) !== null && _e !== void 0 ? _e : 0,
                    });
                    return acc;
                }, []);
                if (receiptLineItems_2.length === 0) {
                    throw new Error("No lines to receive");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var receiptId, id, insertReceipt;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "receipt", companyId)];
                                case 1:
                                    receiptId = _c.sent();
                                    if (!hasReceipt_2) return [3 /*break*/, 3];
                                    id = receipt_1.data.id;
                                    return [4 /*yield*/, trx
                                            .updateTable("receipt")
                                            .set({
                                            sourceDocument: "Inbound Transfer",
                                            sourceDocumentId: warehouseTransferId_1,
                                            sourceDocumentReadableId: warehouseTransfer_1.data.transferId,
                                            locationId: locationId_3,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", id)
                                            .execute()];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, trx
                                        .insertInto("receipt")
                                        .values({
                                        receiptId: receiptId,
                                        sourceDocument: "Inbound Transfer",
                                        sourceDocumentId: warehouseTransferId_1,
                                        sourceDocumentReadableId: warehouseTransfer_1.data.transferId,
                                        locationId: locationId_3,
                                        status: "Draft",
                                        companyId: companyId,
                                        createdBy: userId,
                                    })
                                        .returning(["id"])
                                        .execute()];
                                case 4:
                                    insertReceipt = _c.sent();
                                    id = (_b = (_a = insertReceipt[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                                    _c.label = 5;
                                case 5: return [4 /*yield*/, trx
                                        .deleteFrom("receiptLine")
                                        .where("receiptId", "=", id)
                                        .execute()];
                                case 6:
                                    _c.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("receiptLine")
                                            .values(receiptLineItems_2.map(function (lineItem) { return (__assign(__assign({}, lineItem), { receiptId: id })); }))
                                            .execute()];
                                case 7:
                                    _c.sent();
                                    return [2 /*return*/, { id: id }];
                            }
                        });
                    }); })];
            case 38:
                result = _46.sent();
                return [2 /*return*/, new Response(JSON.stringify(result, null, 2), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 39:
                err_4 = _46.sent();
                console.error(err_4);
                return [2 /*return*/, new Response(JSON.stringify(err_4), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 40:
                warehouseTransferId_2 = payload.warehouseTransferId, existingReceiptId = payload.receiptId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    warehouseTransferId: warehouseTransferId_2,
                    existingReceiptId: existingReceiptId,
                    userId: userId,
                });
                _46.label = 41;
            case 41:
                _46.trys.push([41, 45, , 46]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", warehouseTransferId_2)
                            .single(),
                        client
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", warehouseTransferId_2),
                        client
                            .from("receipt")
                            .select("*")
                            .eq("id", existingReceiptId)
                            .maybeSingle(),
                    ])];
            case 42:
                _l = _46.sent(), warehouseTransfer_2 = _l[0], warehouseTransferLines = _l[1], receipt_2 = _l[2];
                if (!warehouseTransfer_2.data)
                    throw new Error("Warehouse transfer not found");
                if (warehouseTransferLines.error)
                    throw new Error(warehouseTransferLines.error.message);
                locationId_4 = warehouseTransfer_2.data.toLocationId;
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .in("id", warehouseTransferLines.data
                        .map(function (d) { return d.itemId; })
                        .filter(Boolean))];
            case 43:
                items = _46.sent();
                serializedItems_3 = new Set((_22 = items.data) === null || _22 === void 0 ? void 0 : _22.filter(function (d) { return d.itemTrackingType === "Serial"; }).map(function (d) { return d.id; }));
                batchItems_3 = new Set((_23 = items.data) === null || _23 === void 0 ? void 0 : _23.filter(function (d) { return d.itemTrackingType === "Batch"; }).map(function (d) { return d.id; }));
                hasReceipt_3 = !!((_24 = receipt_2.data) === null || _24 === void 0 ? void 0 : _24.id);
                previouslyReceivedQuantitiesByLine_3 = ((_25 = warehouseTransferLines.data) !== null && _25 !== void 0 ? _25 : []).reduce(function (acc, d) {
                    var _a;
                    if (d.id)
                        acc[d.id] = (_a = d.receivedQuantity) !== null && _a !== void 0 ? _a : 0;
                    return acc;
                }, {});
                receiptLineItems_3 = warehouseTransferLines.data.reduce(function (acc, d) {
                    var _a, _b, _c, _d, _e;
                    if (!d.itemId || !d.quantity)
                        return acc;
                    var serialTracking = serializedItems_3.has(d.itemId);
                    var batchTracking = batchItems_3.has(d.itemId);
                    var quantityToReceive = Math.max(0, ((_a = d.shippedQuantity) !== null && _a !== void 0 ? _a : 0) -
                        ((_b = previouslyReceivedQuantitiesByLine_3[d.id]) !== null && _b !== void 0 ? _b : 0));
                    if (quantityToReceive === 0)
                        return acc;
                    acc.push({
                        lineId: d.id,
                        itemId: d.itemId,
                        locationId: (_c = d.toLocationId) !== null && _c !== void 0 ? _c : locationId_4,
                        storageUnitId: d.toStorageUnitId,
                        requiresSerialTracking: serialTracking,
                        requiresBatchTracking: batchTracking,
                        receivedQuantity: quantityToReceive,
                        outstandingQuantity: quantityToReceive,
                        unitPrice: 0, // Transfers don't have a unit price
                        conversionFactor: 1,
                        unitOfMeasure: (_d = d.unitOfMeasureCode) !== null && _d !== void 0 ? _d : "EA",
                        companyId: companyId,
                        createdBy: userId,
                        orderQuantity: (_e = d.quantity) !== null && _e !== void 0 ? _e : 0,
                    });
                    return acc;
                }, []);
                if (receiptLineItems_3.length === 0) {
                    throw new Error("No lines to receive");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var receiptId, id, insertReceipt;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "receipt", companyId)];
                                case 1:
                                    receiptId = _c.sent();
                                    if (!hasReceipt_3) return [3 /*break*/, 3];
                                    id = receipt_2.data.id;
                                    return [4 /*yield*/, trx
                                            .updateTable("receipt")
                                            .set({
                                            sourceDocument: "Inbound Transfer",
                                            sourceDocumentId: warehouseTransferId_2,
                                            sourceDocumentReadableId: warehouseTransfer_2.data.transferId,
                                            locationId: locationId_4,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", id)
                                            .execute()];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, trx
                                        .insertInto("receipt")
                                        .values({
                                        receiptId: receiptId,
                                        sourceDocument: "Inbound Transfer",
                                        sourceDocumentId: warehouseTransferId_2,
                                        sourceDocumentReadableId: warehouseTransfer_2.data.transferId,
                                        locationId: locationId_4,
                                        status: "Draft",
                                        companyId: companyId,
                                        createdBy: userId,
                                    })
                                        .returning(["id"])
                                        .execute()];
                                case 4:
                                    insertReceipt = _c.sent();
                                    id = (_b = (_a = insertReceipt[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                                    _c.label = 5;
                                case 5: return [4 /*yield*/, trx
                                        .insertInto("receiptLine")
                                        .values(receiptLineItems_3.map(function (d) { return ({
                                        receiptId: id,
                                        lineId: d.lineId,
                                        itemId: d.itemId,
                                        locationId: d.locationId,
                                        storageUnitId: d.storageUnitId,
                                        requiresSerialTracking: d.requiresSerialTracking,
                                        requiresBatchTracking: d.requiresBatchTracking,
                                        receivedQuantity: d.receivedQuantity,
                                        outstandingQuantity: d.outstandingQuantity,
                                        unitPrice: d.unitPrice,
                                        conversionFactor: d.conversionFactor,
                                        unitOfMeasure: d.unitOfMeasure,
                                        orderQuantity: d.orderQuantity,
                                        companyId: companyId,
                                        createdBy: userId,
                                    }); }))
                                        .execute()];
                                case 6:
                                    _c.sent();
                                    return [2 /*return*/, { id: id }];
                            }
                        });
                    }); })];
            case 44:
                result = _46.sent();
                return [2 /*return*/, new Response(JSON.stringify(result), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 45:
                err_5 = _46.sent();
                console.error(err_5);
                return [2 /*return*/, new Response(JSON.stringify(err_5), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 46:
                receiptId = payload.receiptId, receiptLineId_1 = payload.receiptLineId, quantity_1 = payload.quantity, locationId = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    locationId: locationId,
                    receiptId: receiptId,
                    receiptLineId: receiptLineId_1,
                    quantity: quantity_1,
                    userId: userId,
                });
                _46.label = 47;
            case 47:
                _46.trys.push([47, 50, , 51]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("receiptLine")
                            .select("*")
                            .eq("id", receiptLineId_1)
                            .single(),
                        client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes->> Receipt Line", receiptLineId_1),
                    ])];
            case 48:
                _m = _46.sent(), receiptLine_1 = _m[0], trackedEntities_1 = _m[1];
                console.log({
                    trackedEntities: trackedEntities_1,
                });
                if (!receiptLine_1.data)
                    throw new Error("Receipt line not found");
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, id, data, newReceiptLineRows, newReceiptLineId, _i, _b, entity, attrs, _ignored, rest, newAttributes;
                        var _c, _d, _e, _f, _g, _h, _j;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    _a = receiptLine_1.data, id = _a.id, data = __rest(_a, ["id"]);
                                    if (!(receiptLine_1.data.requiresSerialTracking &&
                                        ((_c = trackedEntities_1.data) === null || _c === void 0 ? void 0 : _c.length))) return [3 /*break*/, 2];
                                    // TODO: update the Receipt Line and Index attributes to point to the new line
                                    return [4 /*yield*/, trx
                                            .deleteFrom("trackedEntity")
                                            .where("id", "in", (_e = (_d = trackedEntities_1.data) === null || _d === void 0 ? void 0 : _d.map(function (d) { return d.id; })) !== null && _e !== void 0 ? _e : [])
                                            .execute()];
                                case 1:
                                    // TODO: update the Receipt Line and Index attributes to point to the new line
                                    _k.sent();
                                    _k.label = 2;
                                case 2: return [4 /*yield*/, trx
                                        .insertInto("receiptLine")
                                        .values(__assign(__assign({}, data), { orderQuantity: quantity_1, outstandingQuantity: quantity_1, receivedQuantity: quantity_1, createdBy: userId }))
                                        .returning(["id"])
                                        .execute()];
                                case 3:
                                    newReceiptLineRows = _k.sent();
                                    newReceiptLineId = (_f = newReceiptLineRows[0]) === null || _f === void 0 ? void 0 : _f.id;
                                    return [4 /*yield*/, trx
                                            .updateTable("receiptLine")
                                            .set({
                                            orderQuantity: receiptLine_1.data.orderQuantity - quantity_1,
                                            outstandingQuantity: receiptLine_1.data.outstandingQuantity - quantity_1,
                                            receivedQuantity: receiptLine_1.data.receivedQuantity - quantity_1,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", receiptLineId_1)
                                            .execute()];
                                case 4:
                                    _k.sent();
                                    if (!(!receiptLine_1.data.requiresSerialTracking &&
                                        newReceiptLineId &&
                                        ((_g = trackedEntities_1.data) === null || _g === void 0 ? void 0 : _g.length))) return [3 /*break*/, 9];
                                    _i = 0, _b = trackedEntities_1.data;
                                    _k.label = 5;
                                case 5:
                                    if (!(_i < _b.length)) return [3 /*break*/, 9];
                                    entity = _b[_i];
                                    attrs = ((_h = entity.attributes) !== null && _h !== void 0 ? _h : {});
                                    _ignored = attrs["Receipt Line Index"], rest = __rest(attrs, ["Receipt Line Index"]);
                                    newAttributes = __assign(__assign({}, rest), { "Receipt Line": newReceiptLineId });
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedEntity")
                                            .values({
                                            id: (0, mod_ts_1.nanoid)(),
                                            quantity: quantity_1,
                                            status: entity.status,
                                            sourceDocument: entity.sourceDocument,
                                            sourceDocumentId: entity.sourceDocumentId,
                                            sourceDocumentReadableId: entity.sourceDocumentReadableId,
                                            readableId: entity.readableId,
                                            attributes: newAttributes,
                                            companyId: entity.companyId,
                                            createdBy: userId,
                                            itemId: entity.itemId,
                                            expirationDate: entity.expirationDate,
                                        })
                                            .execute()];
                                case 6:
                                    _k.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            quantity: Math.max(0, ((_j = entity.quantity) !== null && _j !== void 0 ? _j : 0) - quantity_1),
                                        })
                                            .where("id", "=", entity.id)
                                            .execute()];
                                case 7:
                                    _k.sent();
                                    _k.label = 8;
                                case 8:
                                    _i++;
                                    return [3 /*break*/, 5];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 49:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: receiptLineId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 50:
                err_6 = _46.sent();
                console.error(err_6);
                return [2 /*return*/, new Response(JSON.stringify(err_6), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 51:
                locationId_5 = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    locationId: locationId_5,
                    userId: userId,
                });
                _46.label = 52;
            case 52:
                _46.trys.push([52, 54, , 55]);
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newShipment;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId)];
                                case 1:
                                    createdDocumentId_2 = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipment")
                                            .values({
                                            shipmentId: createdDocumentId_2,
                                            companyId: companyId,
                                            locationId: locationId_5,
                                            createdBy: userId,
                                        })
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 2:
                                    newShipment = _b.sent();
                                    createdDocumentId_2 = (_a = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _a === void 0 ? void 0 : _a.id;
                                    if (!createdDocumentId_2)
                                        throw new Error("Failed to create shipment");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 53:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: createdDocumentId_2,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 54:
                err_7 = _46.sent();
                console.error(err_7);
                return [2 /*return*/, new Response(JSON.stringify(err_7), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 55:
                warehouseTransferId_3 = payload.warehouseTransferId, existingShipmentId = payload.shipmentId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    warehouseTransferId: warehouseTransferId_3,
                    existingShipmentId: existingShipmentId,
                    userId: userId,
                });
                _46.label = 56;
            case 56:
                _46.trys.push([56, 60, , 61]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", warehouseTransferId_3)
                            .single(),
                        client
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", warehouseTransferId_3),
                        client
                            .from("shipment")
                            .select("*")
                            .eq("id", existingShipmentId)
                            .maybeSingle(),
                    ])];
            case 57:
                _o = _46.sent(), warehouseTransfer_3 = _o[0], warehouseTransferLines = _o[1], shipment_1 = _o[2];
                if (!warehouseTransfer_3.data)
                    throw new Error("Warehouse transfer not found");
                if (warehouseTransferLines.error)
                    throw new Error(warehouseTransferLines.error.message);
                locationId_6 = warehouseTransfer_3.data.toLocationId;
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .in("id", warehouseTransferLines.data
                        .map(function (d) { return d.itemId; })
                        .filter(Boolean))];
            case 58:
                items = _46.sent();
                serializedItems_4 = new Set((_26 = items.data) === null || _26 === void 0 ? void 0 : _26.filter(function (d) { return d.itemTrackingType === "Serial"; }).map(function (d) { return d.id; }));
                batchItems_4 = new Set((_27 = items.data) === null || _27 === void 0 ? void 0 : _27.filter(function (d) { return d.itemTrackingType === "Batch"; }).map(function (d) { return d.id; }));
                hasShipment_1 = !!((_28 = shipment_1.data) === null || _28 === void 0 ? void 0 : _28.id);
                previouslyShippedQuantitiesByLine_1 = ((_29 = warehouseTransferLines.data) !== null && _29 !== void 0 ? _29 : []).reduce(function (acc, d) {
                    var _a;
                    if (d.id)
                        acc[d.id] = (_a = d.shippedQuantity) !== null && _a !== void 0 ? _a : 0;
                    return acc;
                }, {});
                shipmentLineItems_1 = warehouseTransferLines.data.reduce(function (acc, d) {
                    var _a, _b, _c, _d, _e;
                    if (!d.itemId || !d.quantity)
                        return acc;
                    var serialTracking = serializedItems_4.has(d.itemId);
                    var batchTracking = batchItems_4.has(d.itemId);
                    // For unshipped lines, we want all lines where shippedQuantity < quantity
                    var quantityToShip = Math.max(0, ((_a = d.quantity) !== null && _a !== void 0 ? _a : 0) - ((_b = previouslyShippedQuantitiesByLine_1[d.id]) !== null && _b !== void 0 ? _b : 0));
                    if (quantityToShip === 0)
                        return acc;
                    acc.push({
                        lineId: d.id,
                        itemId: d.itemId,
                        locationId: (_c = d.fromLocationId) !== null && _c !== void 0 ? _c : locationId_6,
                        storageUnitId: d.fromStorageUnitId,
                        requiresSerialTracking: serialTracking,
                        requiresBatchTracking: batchTracking,
                        shippedQuantity: quantityToShip,
                        outstandingQuantity: quantityToShip,
                        unitPrice: 0, // Transfers don't have a unit price
                        unitOfMeasure: (_d = d.unitOfMeasureCode) !== null && _d !== void 0 ? _d : "EA",
                        companyId: companyId,
                        createdBy: userId,
                        orderQuantity: (_e = d.quantity) !== null && _e !== void 0 ? _e : 0,
                    });
                    return acc;
                }, []);
                if (shipmentLineItems_1.length === 0) {
                    throw new Error("No lines to ship");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var shipmentId, id, insertShipment;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId)];
                                case 1:
                                    shipmentId = _c.sent();
                                    if (!hasShipment_1) return [3 /*break*/, 3];
                                    id = shipment_1.data.id;
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            sourceDocument: "Outbound Transfer",
                                            sourceDocumentId: warehouseTransferId_3,
                                            sourceDocumentReadableId: warehouseTransfer_3.data.transferId,
                                            locationId: locationId_6,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", id)
                                            .execute()];
                                case 2:
                                    _c.sent();
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, trx
                                        .insertInto("shipment")
                                        .values({
                                        shipmentId: shipmentId,
                                        sourceDocument: "Outbound Transfer",
                                        sourceDocumentId: warehouseTransferId_3,
                                        sourceDocumentReadableId: warehouseTransfer_3.data.transferId,
                                        locationId: locationId_6,
                                        status: "Draft",
                                        companyId: companyId,
                                        createdBy: userId,
                                    })
                                        .returning(["id"])
                                        .execute()];
                                case 4:
                                    insertShipment = _c.sent();
                                    id = (_b = (_a = insertShipment[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
                                    _c.label = 5;
                                case 5: return [4 /*yield*/, trx
                                        .deleteFrom("shipmentLine")
                                        .where("shipmentId", "=", id)
                                        .execute()];
                                case 6:
                                    _c.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values(shipmentLineItems_1.map(function (lineItem) { return (__assign(__assign({}, lineItem), { shipmentId: id })); }))
                                            .execute()];
                                case 7:
                                    _c.sent();
                                    return [2 /*return*/, { id: id }];
                            }
                        });
                    }); })];
            case 59:
                result = _46.sent();
                return [2 /*return*/, new Response(JSON.stringify(result, null, 2), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 60:
                err_8 = _46.sent();
                console.error(err_8);
                return [2 /*return*/, new Response(JSON.stringify(err_8), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 61:
                purchaseOrderId = payload.purchaseOrderId, existingShipmentId = payload.shipmentId, locationId_7 = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    locationId: locationId_7,
                    purchaseOrderId: purchaseOrderId,
                    existingShipmentId: existingShipmentId,
                    userId: userId,
                });
                _46.label = 62;
            case 62:
                _46.trys.push([62, 66, , 67]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("purchaseOrder")
                            .select("*")
                            .eq("id", purchaseOrderId)
                            .single(),
                        client
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", purchaseOrderId)
                            .in("purchaseOrderLineType", [
                            "Part",
                            "Material",
                            "Tool",
                            "Fixture",
                            "Consumable",
                        ])
                            .eq("locationId", locationId_7),
                        client
                            .from("purchaseOrderDelivery")
                            .select("*")
                            .eq("id", purchaseOrderId)
                            .maybeSingle(),
                        client
                            .from("shipment")
                            .select("*")
                            .eq("id", existingShipmentId)
                            .maybeSingle(),
                    ])];
            case 63:
                _p = _46.sent(), purchaseOrder_2 = _p[0], purchaseOrderLines_1 = _p[1], purchaseOrderDelivery_1 = _p[2], shipment = _p[3];
                if (!purchaseOrder_2.data)
                    throw new Error("Purchase order not found");
                if (purchaseOrderLines_1.error)
                    throw new Error(purchaseOrderLines_1.error.message);
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .in("id", purchaseOrderLines_1.data.map(function (d) { return d.itemId; }))];
            case 64:
                items = _46.sent();
                serializedItems_5 = new Set((_30 = items.data) === null || _30 === void 0 ? void 0 : _30.filter(function (d) { return d.itemTrackingType === "Serial"; }).map(function (d) { return d.id; }));
                batchItems_5 = new Set((_31 = items.data) === null || _31 === void 0 ? void 0 : _31.filter(function (d) { return d.itemTrackingType === "Batch"; }).map(function (d) { return d.id; }));
                hasShipment_2 = !!((_32 = shipment.data) === null || _32 === void 0 ? void 0 : _32.id);
                isOutsideOperation_2 = purchaseOrder_2.data.purchaseOrderType === "Outside Processing";
                previouslyShippedQuantitiesByLine_2 = ((_33 = purchaseOrderLines_1.data) !== null && _33 !== void 0 ? _33 : []).reduce(function (acc, d) {
                    var _a;
                    if (d.id)
                        acc[d.id] = (_a = d.quantityShipped) !== null && _a !== void 0 ? _a : 0;
                    return acc;
                }, {});
                shipmentId_1 = hasShipment_2 ? (_34 = shipment.data) === null || _34 === void 0 ? void 0 : _34.id : "";
                shipmentIdReadable_1 = hasShipment_2 ? (_35 = shipment.data) === null || _35 === void 0 ? void 0 : _35.shipmentId : "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newShipment, _a, _b, _c, purchaseOrderLine, isSerial, isBatch, outstandingQuantity, shippingAndTaxUnitCost, e_3_1;
                        var _d, e_3, _e, _f;
                        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                        return __generator(this, function (_t) {
                            switch (_t.label) {
                                case 0:
                                    if (!hasShipment_2) return [3 /*break*/, 3];
                                    // update existing shipment
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            sourceDocument: "Purchase Order",
                                            sourceDocumentId: purchaseOrder_2.data.id,
                                            sourceDocumentReadableId: purchaseOrder_2.data.purchaseOrderId,
                                            supplierId: purchaseOrder_2.data.supplierId,
                                            supplierInteractionId: purchaseOrder_2.data.supplierInteractionId,
                                            shippingMethodId: (_g = purchaseOrderDelivery_1.data) === null || _g === void 0 ? void 0 : _g.shippingMethodId,
                                            locationId: locationId_7,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", shipmentId_1)
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 1:
                                    // update existing shipment
                                    _t.sent();
                                    // delete existing shipment lines
                                    return [4 /*yield*/, trx
                                            .deleteFrom("shipmentLine")
                                            .where("shipmentId", "=", shipmentId_1)
                                            .execute()];
                                case 2:
                                    // delete existing shipment lines
                                    _t.sent();
                                    return [3 /*break*/, 6];
                                case 3: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId)];
                                case 4:
                                    shipmentIdReadable_1 = _t.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipment")
                                            .values({
                                            shipmentId: shipmentIdReadable_1,
                                            sourceDocument: "Purchase Order",
                                            sourceDocumentId: purchaseOrder_2.data.id,
                                            sourceDocumentReadableId: purchaseOrder_2.data.purchaseOrderId,
                                            externalDocumentId: purchaseOrder_2.data.supplierReference,
                                            supplierId: purchaseOrder_2.data.supplierId,
                                            supplierInteractionId: purchaseOrder_2.data.supplierInteractionId,
                                            shippingMethodId: (_h = purchaseOrderDelivery_1.data) === null || _h === void 0 ? void 0 : _h.shippingMethodId,
                                            companyId: companyId,
                                            locationId: locationId_7,
                                            createdBy: userId,
                                        })
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 5:
                                    newShipment = _t.sent();
                                    shipmentId_1 = (_j = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _j === void 0 ? void 0 : _j.id;
                                    shipmentIdReadable_1 = (_k = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _k === void 0 ? void 0 : _k.shipmentId;
                                    _t.label = 6;
                                case 6:
                                    _t.trys.push([6, 12, 13, 18]);
                                    _a = true, _b = __asyncValues(purchaseOrderLines_1.data);
                                    _t.label = 7;
                                case 7: return [4 /*yield*/, _b.next()];
                                case 8:
                                    if (!(_c = _t.sent(), _d = _c.done, !_d)) return [3 /*break*/, 11];
                                    _f = _c.value;
                                    _a = false;
                                    purchaseOrderLine = _f;
                                    if (!purchaseOrderLine.itemId ||
                                        !purchaseOrderLine.purchaseQuantity ||
                                        purchaseOrderLine.purchaseOrderLineType === "Service" ||
                                        purchaseOrderLine.purchaseOrderLineType === "G/L Account") {
                                        return [3 /*break*/, 10];
                                    }
                                    isSerial = serializedItems_5.has(purchaseOrderLine.itemId);
                                    isBatch = batchItems_5.has(purchaseOrderLine.itemId);
                                    outstandingQuantity = (_m = ((_l = purchaseOrderLine.purchaseQuantity) !== null && _l !== void 0 ? _l : 0) -
                                        previouslyShippedQuantitiesByLine_2[purchaseOrderLine.id]) !== null && _m !== void 0 ? _m : 0;
                                    shippingAndTaxUnitCost = (((_o = purchaseOrderLine.shippingCost) !== null && _o !== void 0 ? _o : 0) /
                                        ((_p = purchaseOrderLine.purchaseQuantity) !== null && _p !== void 0 ? _p : 0) +
                                        ((_q = purchaseOrderLine.unitPrice) !== null && _q !== void 0 ? _q : 0)) *
                                        (1 + ((_r = purchaseOrderLine.taxPercent) !== null && _r !== void 0 ? _r : 0));
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values({
                                            shipmentId: shipmentId_1,
                                            lineId: purchaseOrderLine.id,
                                            companyId: companyId,
                                            itemId: purchaseOrderLine.itemId,
                                            orderQuantity: purchaseOrderLine.purchaseQuantity,
                                            outstandingQuantity: outstandingQuantity,
                                            shippedQuantity: outstandingQuantity !== null && outstandingQuantity !== void 0 ? outstandingQuantity : 0,
                                            requiresSerialTracking: isSerial && !isOutsideOperation_2,
                                            requiresBatchTracking: isBatch && !isOutsideOperation_2,
                                            unitPrice: shippingAndTaxUnitCost,
                                            unitOfMeasure: (_s = purchaseOrderLine.purchaseUnitOfMeasureCode) !== null && _s !== void 0 ? _s : "EA",
                                            locationId: purchaseOrderLine.locationId,
                                            storageUnitId: purchaseOrderLine.storageUnitId,
                                            createdBy: userId !== null && userId !== void 0 ? userId : "",
                                        })
                                            .execute()];
                                case 9:
                                    _t.sent();
                                    _t.label = 10;
                                case 10:
                                    _a = true;
                                    return [3 /*break*/, 7];
                                case 11: return [3 /*break*/, 18];
                                case 12:
                                    e_3_1 = _t.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 18];
                                case 13:
                                    _t.trys.push([13, , 16, 17]);
                                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 15];
                                    return [4 /*yield*/, _e.call(_b)];
                                case 14:
                                    _t.sent();
                                    _t.label = 15;
                                case 15: return [3 /*break*/, 17];
                                case 16:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 17: return [7 /*endfinally*/];
                                case 18: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 65:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: shipmentId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 66:
                err_9 = _46.sent();
                console.error(err_9);
                return [2 /*return*/, new Response(JSON.stringify(err_9), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 67:
                salesOrderId = payload.salesOrderId, existingShipmentId = payload.shipmentId, locationId_8 = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    locationId: locationId_8,
                    salesOrderId: salesOrderId,
                    existingShipmentId: existingShipmentId,
                    userId: userId,
                });
                _46.label = 68;
            case 68:
                _46.trys.push([68, 72, , 73]);
                return [4 /*yield*/, Promise.all([
                        client.from("salesOrder").select("*").eq("id", salesOrderId).single(),
                        client
                            .from("salesOrderLine")
                            .select("*")
                            .eq("salesOrderId", salesOrderId)
                            .in("salesOrderLineType", [
                            "Part",
                            "Material",
                            "Tool",
                            "Fixture",
                            "Consumable",
                        ])
                            .eq("locationId", locationId_8),
                        client
                            .from("salesOrderLine")
                            .select("id, salesOrderLineType, assetId, saleQuantity, quantitySent, sentComplete")
                            .eq("salesOrderId", salesOrderId)
                            .eq("salesOrderLineType", "Fixed Asset"),
                        client
                            .from("salesOrderShipment")
                            .select("*")
                            .eq("id", salesOrderId)
                            .maybeSingle(),
                        client
                            .from("shipment")
                            .select("*")
                            .eq("id", existingShipmentId)
                            .maybeSingle(),
                        client
                            .from("job")
                            .select("*")
                            .eq("salesOrderId", salesOrderId)
                            .neq("status", "Cancelled"),
                    ])];
            case 69:
                _q = _46.sent(), salesOrder_1 = _q[0], salesOrderLines_1 = _q[1], fixedAssetSoLines_1 = _q[2], salesOrderShipment_1 = _q[3], shipment = _q[4], jobs = _q[5];
                if (!salesOrder_1.data)
                    throw new Error("Sales order not found");
                if (salesOrderLines_1.error)
                    throw new Error(salesOrderLines_1.error.message);
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .in("id", salesOrderLines_1.data.map(function (d) { return d.itemId; }))];
            case 70:
                items = _46.sent();
                serializedItems_6 = new Set((_36 = items.data) === null || _36 === void 0 ? void 0 : _36.filter(function (d) { return d.itemTrackingType === "Serial"; }).map(function (d) { return d.id; }));
                batchItems_6 = new Set((_37 = items.data) === null || _37 === void 0 ? void 0 : _37.filter(function (d) { return d.itemTrackingType === "Batch"; }).map(function (d) { return d.id; }));
                hasShipment_3 = !!((_38 = shipment.data) === null || _38 === void 0 ? void 0 : _38.id);
                jobsBySalesOrderLine_1 = (jobs.data || []).reduce(function (acc, job) {
                    if (job.salesOrderLineId) {
                        if (!acc[job.salesOrderLineId]) {
                            acc[job.salesOrderLineId] = [];
                        }
                        acc[job.salesOrderLineId].push(job);
                    }
                    return acc;
                }, {});
                previouslyShippedQuantitiesByLine_3 = ((_39 = salesOrderLines_1.data) !== null && _39 !== void 0 ? _39 : []).reduce(function (acc, d) {
                    var _a;
                    if (d.id)
                        acc[d.id] = (_a = d.quantitySent) !== null && _a !== void 0 ? _a : 0;
                    return acc;
                }, {});
                shipmentId_2 = hasShipment_3 ? (_40 = shipment.data) === null || _40 === void 0 ? void 0 : _40.id : "";
                shipmentIdReadable_2 = hasShipment_3 ? (_41 = shipment.data) === null || _41 === void 0 ? void 0 : _41.shipmentId : "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newShipment, shipmentLineItems, _a, _b, _c, salesOrderLine, isSerial, isBatch, _d, _e, _f, job, quantityToShip, fulfillment, fulfillmentId, shippingAndTaxUnitCost, shipmentLine, shipmentLineId, jobMakeMethod, trackedEntities, index, _g, _h, _j, trackedEntity, e_4_1, e_5_1, outstandingQuantity, shippingAndTaxUnitCost, e_6_1, unshippedFaLines;
                        var _k, e_6, _l, _m, _o, e_5, _p, _q, _r, e_4, _s, _t;
                        var _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
                        return __generator(this, function (_13) {
                            switch (_13.label) {
                                case 0:
                                    if (!hasShipment_3) return [3 /*break*/, 3];
                                    // update existing shipment
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            sourceDocument: "Sales Order",
                                            sourceDocumentId: salesOrder_1.data.id,
                                            sourceDocumentReadableId: salesOrder_1.data.salesOrderId,
                                            customerId: salesOrder_1.data.customerId,
                                            shippingMethodId: (_u = salesOrderShipment_1.data) === null || _u === void 0 ? void 0 : _u.shippingMethodId,
                                            opportunityId: salesOrder_1.data.opportunityId,
                                            locationId: locationId_8,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", shipmentId_2)
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 1:
                                    // update existing shipment
                                    _13.sent();
                                    // delete existing shipment lines
                                    return [4 /*yield*/, trx
                                            .deleteFrom("shipmentLine")
                                            .where("shipmentId", "=", shipmentId_2)
                                            .execute()];
                                case 2:
                                    // delete existing shipment lines
                                    _13.sent();
                                    return [3 /*break*/, 6];
                                case 3: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId)];
                                case 4:
                                    shipmentIdReadable_2 = _13.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipment")
                                            .values({
                                            shipmentId: shipmentIdReadable_2,
                                            sourceDocument: "Sales Order",
                                            sourceDocumentId: salesOrder_1.data.id,
                                            sourceDocumentReadableId: salesOrder_1.data.salesOrderId,
                                            externalDocumentId: salesOrder_1.data.customerReference,
                                            shippingMethodId: (_v = salesOrderShipment_1.data) === null || _v === void 0 ? void 0 : _v.shippingMethodId,
                                            customerId: salesOrder_1.data.customerId,
                                            opportunityId: salesOrder_1.data.opportunityId,
                                            companyId: companyId,
                                            locationId: locationId_8,
                                            createdBy: userId,
                                        })
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 5:
                                    newShipment = _13.sent();
                                    shipmentId_2 = (_w = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _w === void 0 ? void 0 : _w.id;
                                    shipmentIdReadable_2 = (_x = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _x === void 0 ? void 0 : _x.shipmentId;
                                    _13.label = 6;
                                case 6:
                                    shipmentLineItems = [];
                                    _13.label = 7;
                                case 7:
                                    _13.trys.push([7, 42, 43, 48]);
                                    _a = true, _b = __asyncValues(salesOrderLines_1.data);
                                    _13.label = 8;
                                case 8: return [4 /*yield*/, _b.next()];
                                case 9:
                                    if (!(_c = _13.sent(), _k = _c.done, !_k)) return [3 /*break*/, 41];
                                    _m = _c.value;
                                    _a = false;
                                    salesOrderLine = _m;
                                    if (!salesOrderLine.itemId ||
                                        !salesOrderLine.saleQuantity ||
                                        salesOrderLine.salesOrderLineType === "Service") {
                                        return [3 /*break*/, 40];
                                    }
                                    isSerial = serializedItems_6.has(salesOrderLine.itemId);
                                    isBatch = batchItems_6.has(salesOrderLine.itemId);
                                    if (!(salesOrderLine.methodType === "Make to Order")) return [3 /*break*/, 38];
                                    _13.label = 10;
                                case 10:
                                    _13.trys.push([10, 31, 32, 37]);
                                    _d = true, _e = (e_5 = void 0, __asyncValues((_y = jobsBySalesOrderLine_1[salesOrderLine.id]) !== null && _y !== void 0 ? _y : []));
                                    _13.label = 11;
                                case 11: return [4 /*yield*/, _e.next()];
                                case 12:
                                    if (!(_f = _13.sent(), _o = _f.done, !_o)) return [3 /*break*/, 30];
                                    _q = _f.value;
                                    _d = false;
                                    job = _q;
                                    if (!salesOrderLine.itemId)
                                        return [2 /*return*/];
                                    quantityToShip = Math.max(0, ((_z = job.quantityComplete) !== null && _z !== void 0 ? _z : 0) - ((_0 = job.quantityShipped) !== null && _0 !== void 0 ? _0 : 0));
                                    if (!(!isSerial || (isSerial && quantityToShip > 0))) return [3 /*break*/, 29];
                                    return [4 /*yield*/, trx
                                            .insertInto("fulfillment")
                                            .values({
                                            salesOrderLineId: salesOrderLine.id,
                                            type: "Job",
                                            jobId: job.id,
                                            quantity: quantityToShip,
                                            companyId: companyId,
                                            createdBy: userId,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 13:
                                    fulfillment = _13.sent();
                                    fulfillmentId = (_1 = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment[0]) === null || _1 === void 0 ? void 0 : _1.id;
                                    shippingAndTaxUnitCost = (salesOrderLine.shippingCost / quantityToShip +
                                        ((_2 = salesOrderLine.unitPrice) !== null && _2 !== void 0 ? _2 : 0)) *
                                        (1 + salesOrderLine.taxPercent);
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values({
                                            shipmentId: shipmentId_2,
                                            lineId: salesOrderLine.id,
                                            companyId: companyId,
                                            fulfillmentId: fulfillmentId,
                                            itemId: salesOrderLine.itemId,
                                            orderQuantity: salesOrderLine.saleQuantity,
                                            outstandingQuantity: (_3 = salesOrderLine.quantityToSend) !== null && _3 !== void 0 ? _3 : salesOrderLine.saleQuantity,
                                            shippedQuantity: quantityToShip,
                                            requiresSerialTracking: isSerial,
                                            requiresBatchTracking: isBatch,
                                            unitPrice: shippingAndTaxUnitCost,
                                            unitOfMeasure: (_4 = salesOrderLine.unitOfMeasureCode) !== null && _4 !== void 0 ? _4 : "EA",
                                            createdBy: userId !== null && userId !== void 0 ? userId : "",
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 14:
                                    shipmentLine = _13.sent();
                                    shipmentLineId = (_5 = shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine[0]) === null || _5 === void 0 ? void 0 : _5.id;
                                    if (!shipmentLineId)
                                        throw new Error("Shipment line not found");
                                    if (!(isSerial || isBatch)) return [3 /*break*/, 29];
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMakeMethod")
                                            .select(["id"])
                                            .where("jobId", "=", job.id)
                                            .where("parentMaterialId", "is", null)
                                            .executeTakeFirst()];
                                case 15:
                                    jobMakeMethod = _13.sent();
                                    if (!(jobMakeMethod === null || jobMakeMethod === void 0 ? void 0 : jobMakeMethod.id)) return [3 /*break*/, 29];
                                    return [4 /*yield*/, client
                                            .from("trackedEntity")
                                            .select("*")
                                            .eq("attributes->>Job Make Method", jobMakeMethod.id)
                                            .order("createdAt", { ascending: true })];
                                case 16:
                                    trackedEntities = _13.sent();
                                    index = 0;
                                    _13.label = 17;
                                case 17:
                                    _13.trys.push([17, 23, 24, 29]);
                                    _g = true, _h = (e_4 = void 0, __asyncValues((_6 = trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.data) !== null && _6 !== void 0 ? _6 : []));
                                    _13.label = 18;
                                case 18: return [4 /*yield*/, _h.next()];
                                case 19:
                                    if (!(_j = _13.sent(), _r = _j.done, !_r)) return [3 /*break*/, 22];
                                    _t = _j.value;
                                    _g = false;
                                    trackedEntity = _t;
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            attributes: __assign(__assign({}, trackedEntity.attributes), { Shipment: shipmentId_2, "Shipment Line": shipmentLineId, "Shipment Line Index": index }),
                                        })
                                            .where("id", "=", trackedEntity.id)
                                            .execute()];
                                case 20:
                                    _13.sent();
                                    index++;
                                    _13.label = 21;
                                case 21:
                                    _g = true;
                                    return [3 /*break*/, 18];
                                case 22: return [3 /*break*/, 29];
                                case 23:
                                    e_4_1 = _13.sent();
                                    e_4 = { error: e_4_1 };
                                    return [3 /*break*/, 29];
                                case 24:
                                    _13.trys.push([24, , 27, 28]);
                                    if (!(!_g && !_r && (_s = _h.return))) return [3 /*break*/, 26];
                                    return [4 /*yield*/, _s.call(_h)];
                                case 25:
                                    _13.sent();
                                    _13.label = 26;
                                case 26: return [3 /*break*/, 28];
                                case 27:
                                    if (e_4) throw e_4.error;
                                    return [7 /*endfinally*/];
                                case 28: return [7 /*endfinally*/];
                                case 29:
                                    _d = true;
                                    return [3 /*break*/, 11];
                                case 30: return [3 /*break*/, 37];
                                case 31:
                                    e_5_1 = _13.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 37];
                                case 32:
                                    _13.trys.push([32, , 35, 36]);
                                    if (!(!_d && !_o && (_p = _e.return))) return [3 /*break*/, 34];
                                    return [4 /*yield*/, _p.call(_e)];
                                case 33:
                                    _13.sent();
                                    _13.label = 34;
                                case 34: return [3 /*break*/, 36];
                                case 35:
                                    if (e_5) throw e_5.error;
                                    return [7 /*endfinally*/];
                                case 36: return [7 /*endfinally*/];
                                case 37: return [3 /*break*/, 40];
                                case 38:
                                    outstandingQuantity = (_8 = ((_7 = salesOrderLine.saleQuantity) !== null && _7 !== void 0 ? _7 : 0) -
                                        previouslyShippedQuantitiesByLine_3[salesOrderLine.id]) !== null && _8 !== void 0 ? _8 : 0;
                                    shippingAndTaxUnitCost = (salesOrderLine.shippingCost /
                                        ((_9 = salesOrderLine.saleQuantity) !== null && _9 !== void 0 ? _9 : 0) +
                                        ((_10 = salesOrderLine.unitPrice) !== null && _10 !== void 0 ? _10 : 0)) *
                                        (1 + salesOrderLine.taxPercent);
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values({
                                            shipmentId: shipmentId_2,
                                            lineId: salesOrderLine.id,
                                            companyId: companyId,
                                            itemId: salesOrderLine.itemId,
                                            orderQuantity: salesOrderLine.saleQuantity,
                                            outstandingQuantity: outstandingQuantity,
                                            shippedQuantity: outstandingQuantity !== null && outstandingQuantity !== void 0 ? outstandingQuantity : 0,
                                            requiresSerialTracking: isSerial,
                                            requiresBatchTracking: isBatch,
                                            unitPrice: shippingAndTaxUnitCost,
                                            unitOfMeasure: (_11 = salesOrderLine.unitOfMeasureCode) !== null && _11 !== void 0 ? _11 : "EA",
                                            locationId: salesOrderLine.locationId,
                                            storageUnitId: salesOrderLine.storageUnitId,
                                            createdBy: userId !== null && userId !== void 0 ? userId : "",
                                        })
                                            .execute()];
                                case 39:
                                    _13.sent();
                                    _13.label = 40;
                                case 40:
                                    _a = true;
                                    return [3 /*break*/, 8];
                                case 41: return [3 /*break*/, 48];
                                case 42:
                                    e_6_1 = _13.sent();
                                    e_6 = { error: e_6_1 };
                                    return [3 /*break*/, 48];
                                case 43:
                                    _13.trys.push([43, , 46, 47]);
                                    if (!(!_a && !_k && (_l = _b.return))) return [3 /*break*/, 45];
                                    return [4 /*yield*/, _l.call(_b)];
                                case 44:
                                    _13.sent();
                                    _13.label = 45;
                                case 45: return [3 /*break*/, 47];
                                case 46:
                                    if (e_6) throw e_6.error;
                                    return [7 /*endfinally*/];
                                case 47: return [7 /*endfinally*/];
                                case 48:
                                    if (!(shipmentLineItems.length > 0)) return [3 /*break*/, 50];
                                    // Insert all shipment lines
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values(shipmentLineItems.map(function (line) { return (__assign(__assign({}, line), { shipmentId: shipmentId_2, locationId: locationId_8 })); }))
                                            .execute()];
                                case 49:
                                    // Insert all shipment lines
                                    _13.sent();
                                    _13.label = 50;
                                case 50:
                                    unshippedFaLines = ((_12 = fixedAssetSoLines_1.data) !== null && _12 !== void 0 ? _12 : []).filter(function (d) { return d.assetId && d.saleQuantity && !d.sentComplete; });
                                    if (!(unshippedFaLines.length > 0)) return [3 /*break*/, 53];
                                    return [4 /*yield*/, trx
                                            .deleteFrom("shipmentFixedAssetLine")
                                            .where("shipmentId", "=", shipmentId_2)
                                            .execute()];
                                case 51:
                                    _13.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentFixedAssetLine")
                                            .values(unshippedFaLines.map(function (line) { return ({
                                            shipmentId: shipmentId_2,
                                            salesOrderLineId: line.id,
                                            shipped: true,
                                            companyId: companyId,
                                            createdBy: userId,
                                        }); }))
                                            .execute()];
                                case 52:
                                    _13.sent();
                                    _13.label = 53;
                                case 53: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 71:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: shipmentId_2,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 72:
                err_10 = _46.sent();
                console.error(err_10);
                return [2 /*return*/, new Response(JSON.stringify(err_10), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 73:
                salesOrderLineId_1 = payload.salesOrderLineId, existingShipmentId = payload.shipmentId, locationId_9 = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    companyId: companyId,
                    locationId: locationId_9,
                    salesOrderLineId: salesOrderLineId_1,
                    existingShipmentId: existingShipmentId,
                    userId: userId,
                });
                _46.label = 74;
            case 74:
                _46.trys.push([74, 79, , 80]);
                return [4 /*yield*/, client
                        .from("salesOrderLine")
                        .select("*")
                        .eq("id", salesOrderLineId_1)
                        .eq("locationId", locationId_9)
                        .single()];
            case 75:
                salesOrderLine_1 = _46.sent();
                if (!salesOrderLine_1.data || !salesOrderLine_1.data.itemId)
                    throw new Error("Sales order line not found");
                salesOrderId = salesOrderLine_1.data.salesOrderId;
                return [4 /*yield*/, Promise.all([
                        client
                            .from("salesOrder")
                            .select("*")
                            .eq("id", salesOrderId)
                            .single(),
                        client
                            .from("salesOrderShipment")
                            .select("*")
                            .eq("id", salesOrderId)
                            .maybeSingle(),
                        client
                            .from("shipment")
                            .select("*")
                            .eq("id", existingShipmentId)
                            .maybeSingle(),
                        client
                            .from("job")
                            .select("*")
                            .eq("salesOrderLineId", salesOrderLineId_1)
                            .neq("status", "Cancelled"),
                    ])];
            case 76:
                _r = _46.sent(), salesOrder_2 = _r[0], salesOrderShipment_2 = _r[1], shipment = _r[2], jobs_1 = _r[3];
                if (!salesOrder_2.data)
                    throw new Error("Sales order not found");
                return [4 /*yield*/, client
                        .from("item")
                        .select("id, itemTrackingType")
                        .eq("id", salesOrderLine_1.data.itemId)
                        .single()];
            case 77:
                item = _46.sent();
                if (!item.data)
                    throw new Error("Item not found");
                isSerial_1 = item.data.itemTrackingType === "Serial";
                isBatch_1 = item.data.itemTrackingType === "Batch";
                hasShipment_4 = !!((_42 = shipment.data) === null || _42 === void 0 ? void 0 : _42.id);
                previouslyShippedQuantity_1 = (_43 = salesOrderLine_1.data.quantitySent) !== null && _43 !== void 0 ? _43 : 0;
                shipmentId_3 = hasShipment_4 ? (_44 = shipment.data) === null || _44 === void 0 ? void 0 : _44.id : "";
                shipmentIdReadable_3 = hasShipment_4 ? (_45 = shipment.data) === null || _45 === void 0 ? void 0 : _45.shipmentId : "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var newShipment, _a, _b, _c, job, quantityToShip, fulfillment, fulfillmentId, shippingAndTaxUnitCost, shipmentLine, shipmentLineId, jobMakeMethod, trackedEntities, index, _d, _e, _f, trackedEntity, e_7_1, e_8_1, outstandingQuantity, shippingAndTaxUnitCost;
                        var _g, e_8, _h, _j, _k, e_7, _l, _m;
                        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
                        return __generator(this, function (_6) {
                            switch (_6.label) {
                                case 0:
                                    if (!hasShipment_4) return [3 /*break*/, 3];
                                    // update existing shipment
                                    return [4 /*yield*/, trx
                                            .updateTable("shipment")
                                            .set({
                                            sourceDocument: "Sales Order",
                                            sourceDocumentId: salesOrder_2.data.id,
                                            sourceDocumentReadableId: salesOrder_2.data.salesOrderId,
                                            locationId: locationId_9,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", shipmentId_3)
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 1:
                                    // update existing shipment
                                    _6.sent();
                                    // delete existing shipment lines
                                    return [4 /*yield*/, trx
                                            .deleteFrom("shipmentLine")
                                            .where("shipmentId", "=", shipmentId_3)
                                            .execute()];
                                case 2:
                                    // delete existing shipment lines
                                    _6.sent();
                                    return [3 /*break*/, 6];
                                case 3: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId)];
                                case 4:
                                    shipmentIdReadable_3 = _6.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipment")
                                            .values({
                                            shipmentId: shipmentIdReadable_3,
                                            sourceDocument: "Sales Order",
                                            sourceDocumentId: salesOrder_2.data.id,
                                            sourceDocumentReadableId: salesOrder_2.data.salesOrderId,
                                            externalDocumentId: salesOrder_2.data.customerReference,
                                            shippingMethodId: (_o = salesOrderShipment_2.data) === null || _o === void 0 ? void 0 : _o.shippingMethodId,
                                            customerId: salesOrder_2.data.customerId,
                                            opportunityId: salesOrder_2.data.opportunityId,
                                            companyId: companyId,
                                            locationId: locationId_9,
                                            createdBy: userId,
                                        })
                                            .returning(["id", "shipmentId"])
                                            .execute()];
                                case 5:
                                    newShipment = _6.sent();
                                    shipmentId_3 = (_p = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _p === void 0 ? void 0 : _p.id;
                                    shipmentIdReadable_3 = (_q = newShipment === null || newShipment === void 0 ? void 0 : newShipment[0]) === null || _q === void 0 ? void 0 : _q.shipmentId;
                                    _6.label = 6;
                                case 6:
                                    if (!(salesOrderLine_1.data.methodType === "Make to Order")) return [3 /*break*/, 35];
                                    _6.label = 7;
                                case 7:
                                    _6.trys.push([7, 28, 29, 34]);
                                    _a = true, _b = __asyncValues((_r = jobs_1.data) !== null && _r !== void 0 ? _r : []);
                                    _6.label = 8;
                                case 8: return [4 /*yield*/, _b.next()];
                                case 9:
                                    if (!(_c = _6.sent(), _g = _c.done, !_g)) return [3 /*break*/, 27];
                                    _j = _c.value;
                                    _a = false;
                                    job = _j;
                                    if (!salesOrderLine_1.data.itemId)
                                        return [2 /*return*/];
                                    quantityToShip = Math.max(0, ((_s = job.quantityComplete) !== null && _s !== void 0 ? _s : 0) - ((_t = job.quantityShipped) !== null && _t !== void 0 ? _t : 0));
                                    if (!(!isSerial_1 || (isSerial_1 && quantityToShip > 0))) return [3 /*break*/, 26];
                                    return [4 /*yield*/, trx
                                            .insertInto("fulfillment")
                                            .values({
                                            salesOrderLineId: salesOrderLineId_1,
                                            type: "Job",
                                            jobId: job.id,
                                            quantity: quantityToShip,
                                            companyId: companyId,
                                            createdBy: userId,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 10:
                                    fulfillment = _6.sent();
                                    fulfillmentId = (_u = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment[0]) === null || _u === void 0 ? void 0 : _u.id;
                                    shippingAndTaxUnitCost = (salesOrderLine_1.data.shippingCost / quantityToShip +
                                        ((_v = salesOrderLine_1.data.unitPrice) !== null && _v !== void 0 ? _v : 0)) *
                                        (1 + salesOrderLine_1.data.taxPercent);
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values({
                                            shipmentId: shipmentId_3,
                                            lineId: salesOrderLineId_1,
                                            companyId: companyId,
                                            fulfillmentId: fulfillmentId,
                                            itemId: salesOrderLine_1.data.itemId,
                                            orderQuantity: (_w = job.productionQuantity) !== null && _w !== void 0 ? _w : 0,
                                            outstandingQuantity: Math.max(0, (_x = job.productionQuantity) !== null && _x !== void 0 ? _x : 0),
                                            shippedQuantity: quantityToShip,
                                            requiresSerialTracking: isSerial_1,
                                            requiresBatchTracking: isBatch_1,
                                            unitPrice: shippingAndTaxUnitCost,
                                            unitOfMeasure: (_y = salesOrderLine_1.data.unitOfMeasureCode) !== null && _y !== void 0 ? _y : "EA",
                                            createdBy: userId !== null && userId !== void 0 ? userId : "",
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 11:
                                    shipmentLine = _6.sent();
                                    shipmentLineId = (_z = shipmentLine === null || shipmentLine === void 0 ? void 0 : shipmentLine[0]) === null || _z === void 0 ? void 0 : _z.id;
                                    if (!shipmentLineId)
                                        throw new Error("Shipment line not found");
                                    if (!(isSerial_1 || isBatch_1)) return [3 /*break*/, 26];
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMakeMethod")
                                            .select(["id"])
                                            .where("jobId", "=", job.id)
                                            .where("parentMaterialId", "is", null)
                                            .executeTakeFirst()];
                                case 12:
                                    jobMakeMethod = _6.sent();
                                    if (!(jobMakeMethod === null || jobMakeMethod === void 0 ? void 0 : jobMakeMethod.id)) return [3 /*break*/, 26];
                                    return [4 /*yield*/, client
                                            .from("trackedEntity")
                                            .select("*")
                                            .eq("attributes->>Job Make Method", jobMakeMethod.id)
                                            .order("createdAt", { ascending: true })];
                                case 13:
                                    trackedEntities = _6.sent();
                                    index = 0;
                                    _6.label = 14;
                                case 14:
                                    _6.trys.push([14, 20, 21, 26]);
                                    _d = true, _e = (e_7 = void 0, __asyncValues((_0 = trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.data) !== null && _0 !== void 0 ? _0 : []));
                                    _6.label = 15;
                                case 15: return [4 /*yield*/, _e.next()];
                                case 16:
                                    if (!(_f = _6.sent(), _k = _f.done, !_k)) return [3 /*break*/, 19];
                                    _m = _f.value;
                                    _d = false;
                                    trackedEntity = _m;
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            attributes: __assign(__assign({}, trackedEntity.attributes), { Shipment: shipmentId_3, "Shipment Line": shipmentLineId, "Shipment Line Index": index }),
                                        })
                                            .where("id", "=", trackedEntity.id)
                                            .execute()];
                                case 17:
                                    _6.sent();
                                    index++;
                                    _6.label = 18;
                                case 18:
                                    _d = true;
                                    return [3 /*break*/, 15];
                                case 19: return [3 /*break*/, 26];
                                case 20:
                                    e_7_1 = _6.sent();
                                    e_7 = { error: e_7_1 };
                                    return [3 /*break*/, 26];
                                case 21:
                                    _6.trys.push([21, , 24, 25]);
                                    if (!(!_d && !_k && (_l = _e.return))) return [3 /*break*/, 23];
                                    return [4 /*yield*/, _l.call(_e)];
                                case 22:
                                    _6.sent();
                                    _6.label = 23;
                                case 23: return [3 /*break*/, 25];
                                case 24:
                                    if (e_7) throw e_7.error;
                                    return [7 /*endfinally*/];
                                case 25: return [7 /*endfinally*/];
                                case 26:
                                    _a = true;
                                    return [3 /*break*/, 8];
                                case 27: return [3 /*break*/, 34];
                                case 28:
                                    e_8_1 = _6.sent();
                                    e_8 = { error: e_8_1 };
                                    return [3 /*break*/, 34];
                                case 29:
                                    _6.trys.push([29, , 32, 33]);
                                    if (!(!_a && !_g && (_h = _b.return))) return [3 /*break*/, 31];
                                    return [4 /*yield*/, _h.call(_b)];
                                case 30:
                                    _6.sent();
                                    _6.label = 31;
                                case 31: return [3 /*break*/, 33];
                                case 32:
                                    if (e_8) throw e_8.error;
                                    return [7 /*endfinally*/];
                                case 33: return [7 /*endfinally*/];
                                case 34: return [3 /*break*/, 37];
                                case 35:
                                    outstandingQuantity = Math.max(0, ((_1 = salesOrderLine_1.data.saleQuantity) !== null && _1 !== void 0 ? _1 : 0) -
                                        previouslyShippedQuantity_1);
                                    shippingAndTaxUnitCost = (salesOrderLine_1.data.shippingCost /
                                        ((_2 = salesOrderLine_1.data.saleQuantity) !== null && _2 !== void 0 ? _2 : 0) +
                                        ((_3 = salesOrderLine_1.data.unitPrice) !== null && _3 !== void 0 ? _3 : 0)) *
                                        (1 + salesOrderLine_1.data.taxPercent);
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values({
                                            shipmentId: shipmentId_3,
                                            lineId: salesOrderLineId_1,
                                            companyId: companyId,
                                            itemId: salesOrderLine_1.data.itemId,
                                            orderQuantity: (_4 = salesOrderLine_1.data.saleQuantity) !== null && _4 !== void 0 ? _4 : 0,
                                            outstandingQuantity: outstandingQuantity,
                                            shippedQuantity: outstandingQuantity,
                                            requiresSerialTracking: isSerial_1,
                                            requiresBatchTracking: isBatch_1,
                                            unitPrice: shippingAndTaxUnitCost,
                                            unitOfMeasure: (_5 = salesOrderLine_1.data.unitOfMeasureCode) !== null && _5 !== void 0 ? _5 : "EA",
                                            locationId: salesOrderLine_1.data.locationId,
                                            storageUnitId: salesOrderLine_1.data.storageUnitId,
                                            createdBy: userId !== null && userId !== void 0 ? userId : "",
                                        })
                                            .execute()];
                                case 36:
                                    _6.sent();
                                    _6.label = 37;
                                case 37: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 78:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: shipmentId_3,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 79:
                err_11 = _46.sent();
                console.error(err_11);
                return [2 /*return*/, new Response(JSON.stringify(err_11), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 80:
                shipmentId = payload.shipmentId, shipmentLineId_1 = payload.shipmentLineId, quantity_2 = payload.quantity, locationId = payload.locationId;
                console.log({
                    function: "create",
                    type: type,
                    locationId: locationId,
                    shipmentId: shipmentId,
                    shipmentLineId: shipmentLineId_1,
                    quantity: quantity_2,
                    userId: userId,
                });
                _46.label = 81;
            case 81:
                _46.trys.push([81, 84, , 85]);
                return [4 /*yield*/, Promise.all([
                        client
                            .from("shipmentLine")
                            .select("*")
                            .eq("id", shipmentLineId_1)
                            .single(),
                    ])];
            case 82:
                shipmentLine_1 = (_46.sent())[0];
                if (!shipmentLine_1.data)
                    throw new Error("Shipment line not found");
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, id, data;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = shipmentLine_1.data, id = _a.id, data = __rest(_a, ["id"]);
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values(__assign(__assign({}, data), { orderQuantity: quantity_2, outstandingQuantity: quantity_2, shippedQuantity: quantity_2, createdBy: userId }))
                                            .execute()];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("shipmentLine")
                                            .set({
                                            orderQuantity: shipmentLine_1.data.orderQuantity - quantity_2,
                                            outstandingQuantity: shipmentLine_1.data.outstandingQuantity - quantity_2,
                                            shippedQuantity: shipmentLine_1.data.shippedQuantity - quantity_2,
                                            updatedBy: userId,
                                        })
                                            .where("id", "=", shipmentLineId_1)
                                            .execute()];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 83:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: shipmentLineId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 84:
                err_12 = _46.sent();
                console.error(err_12);
                return [2 /*return*/, new Response(JSON.stringify(err_12), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 85:
                _46.trys.push([85, 87, , 88]);
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var journalEntryId, newJournalEntry;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId)];
                                case 1:
                                    journalEntryId = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            postingDate: new Date().toISOString().split("T")[0],
                                            companyId: companyId,
                                            sourceType: "Manual",
                                            status: "Draft",
                                            createdBy: userId,
                                        })
                                            .returning(["id"])
                                            .execute()];
                                case 2:
                                    newJournalEntry = _b.sent();
                                    createdDocumentId_3 = (_a = newJournalEntry === null || newJournalEntry === void 0 ? void 0 : newJournalEntry[0]) === null || _a === void 0 ? void 0 : _a.id;
                                    if (!createdDocumentId_3)
                                        throw new Error("Failed to create journal entry");
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 86:
                _46.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: createdDocumentId_3,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 87:
                err_13 = _46.sent();
                console.error(err_13);
                return [2 /*return*/, new Response(JSON.stringify(err_13), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 88: return [2 /*return*/, new Response(JSON.stringify({ error: "Invalid document type" }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 400,
                })];
        }
    });
}); });
