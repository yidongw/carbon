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
var date_1 = require("npm:@internationalized/date");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var format_ts_1 = require("https://deno.land/std@0.205.0/datetime/format.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var pool = (0, database_ts_1.getConnectionPool)(2);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.z.discriminatedUnion("type", [
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("methodVersionToActive"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("purchaseOrderToPurchaseInvoice"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("quoteToSalesOrder"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
        purchaseOrderNumber: npm_zod__3_24_1_1.z.string().optional(),
        selectedLines: npm_zod__3_24_1_1.z.record(npm_zod__3_24_1_1.z.string(), npm_zod__3_24_1_1.z.object({
            quantity: npm_zod__3_24_1_1.z.number(),
            netUnitPrice: npm_zod__3_24_1_1.z.number(),
            convertedNetUnitPrice: npm_zod__3_24_1_1.z.number(),
            addOn: npm_zod__3_24_1_1.z.number(),
            convertedAddOn: npm_zod__3_24_1_1.z.number(),
            taxableAddOn: npm_zod__3_24_1_1.z.number().optional(),
            convertedTaxableAddOn: npm_zod__3_24_1_1.z.number().optional(),
            shippingCost: npm_zod__3_24_1_1.z.number(),
            convertedShippingCost: npm_zod__3_24_1_1.z.number(),
            leadTime: npm_zod__3_24_1_1.z.number(),
        })),
        digitalQuoteAcceptedBy: npm_zod__3_24_1_1.z.string().optional(),
        digitalQuoteAcceptedByEmail: npm_zod__3_24_1_1.z.string().optional(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("salesOrderToSalesInvoice"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("salesRfqToQuote"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("shipmentToSalesInvoice"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("supplierQuoteToPurchaseOrder"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
        selectedLines: npm_zod__3_24_1_1.z.record(npm_zod__3_24_1_1.z.string(), npm_zod__3_24_1_1.z.object({
            leadTime: npm_zod__3_24_1_1.z.number(),
            quantity: npm_zod__3_24_1_1.z.number(),
            shippingCost: npm_zod__3_24_1_1.z.number(),
            supplierShippingCost: npm_zod__3_24_1_1.z.number(),
            supplierUnitPrice: npm_zod__3_24_1_1.z.number(),
            supplierTaxAmount: npm_zod__3_24_1_1.z.number(),
            unitPrice: npm_zod__3_24_1_1.z.number(),
        })),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("warehouseTransferToShipment"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("warehouseTransferToReceipt"),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, convertedId, _a, type, id_1, companyId_1, userId_1, permissionsByType, client_1, _b, makeMethodId_1, makeMethod, _c, relatedMakeMethods, draftQuotes, draftJobs, draftMakeMethodIds, activeMakeMethodIds_1, relatedMakeMethodIds_1, methodMaterials, purchaseOrderId, _d, purchaseOrder_1, purchaseOrderLines, purchaseOrderPayment_1, purchaseOrderDelivery_1, uninvoicedLines_1, uninvoicedSubtotal_1, purchaseInvoiceId_1, selectedLines_1, purchaseOrderNumber_1, digitalQuoteAcceptedBy_1, digitalQuoteAcceptedByEmail_1, _e, quote_1, quoteLines_1, quotePayment_1, quoteShipping_1, company_1, insertedSalesOrderId_1, salesOrderId, _f, salesOrder_1, salesOrderLines, salesOrderPayment_1, salesOrderShipment_1, uninvoicedLines_2, uninvoicedSubtotal_2, salesInvoiceId_1, _g, salesRfq_1, salesRfqLines, linesToCreateItems, readableIdToLineIdMapping_1, itemInserts_1, _h, customerPayment, customerShipping, customer, company, currencyCode_1, currency, exchangeRate_1, _j, paymentTermId_1, invoiceCustomerId_1, invoiceCustomerContactId_1, invoiceCustomerLocationId_1, _k, shippingMethodId_1, shippingTermId_1, incoterm_1, incotermLocation_1, insertedQuoteId_1, insertedQuoteLines_1, shipmentId_1, _l, shipment, shipmentLines, shipmentFixedAssetLines, quantitiesByLine_1, _i, _m, line, lineId, salesOrderLineIds, _o, salesOrder_2, salesOrderLines, salesOrderPayment_2, salesOrderShipment_2, uninvoicedLines_3, uninvoicedSubtotal_3, salesInvoiceId_2, selectedLines_2, _p, quote_2, quoteLines_2, company_2, employeeJob_1, _q, supplierPayment_1, supplierShipping_1, supplier_1, pickMethods_1, insertedPurchaseOrderId_1, linkedRfqs, warehouseTransferId_1, _r, warehouseTransfer_1, warehouseTransferLines_1, shipmentId_2, warehouseTransferId_2, _s, warehouseTransfer_2, warehouseTransferLines_2, receiptId_1, err_1;
    var _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
    return __generator(this, function (_16) {
        switch (_16.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _16.sent();
                convertedId = "";
                _16.label = 2;
            case 2:
                _16.trys.push([2, 45, , 46]);
                _a = payloadValidator.parse(payload), type = _a.type, id_1 = _a.id, companyId_1 = _a.companyId, userId_1 = _a.userId;
                console.log({
                    function: "convert",
                    type: type,
                    id: id_1,
                    companyId: companyId_1,
                    userId: userId_1,
                });
                permissionsByType = {
                    methodVersionToActive: { update: "resources" },
                    purchaseOrderToPurchaseInvoice: { update: "invoicing" },
                    quoteToSalesOrder: { update: "sales" },
                    salesOrderToSalesInvoice: { update: "invoicing" },
                    salesRfqToQuote: { update: "sales" },
                    shipmentToSalesInvoice: { update: "invoicing" },
                    supplierQuoteToPurchaseOrder: { update: "purchasing" },
                    warehouseTransferToShipment: { update: "inventory" },
                    warehouseTransferToReceipt: { update: "inventory" },
                };
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, (_t = permissionsByType[type]) !== null && _t !== void 0 ? _t : { update: "settings" })];
            case 3:
                client_1 = _16.sent();
                _b = type;
                switch (_b) {
                    case "methodVersionToActive": return [3 /*break*/, 4];
                    case "purchaseOrderToPurchaseInvoice": return [3 /*break*/, 9];
                    case "quoteToSalesOrder": return [3 /*break*/, 12];
                    case "salesOrderToSalesInvoice": return [3 /*break*/, 15];
                    case "salesRfqToQuote": return [3 /*break*/, 18];
                    case "shipmentToSalesInvoice": return [3 /*break*/, 26];
                    case "supplierQuoteToPurchaseOrder": return [3 /*break*/, 30];
                    case "warehouseTransferToShipment": return [3 /*break*/, 37];
                    case "warehouseTransferToReceipt": return [3 /*break*/, 40];
                }
                return [3 /*break*/, 43];
            case 4:
                makeMethodId_1 = id_1;
                return [4 /*yield*/, client_1
                        .from("makeMethod")
                        .select("*")
                        .eq("id", makeMethodId_1)
                        .single()];
            case 5:
                makeMethod = _16.sent();
                if (makeMethod.error)
                    throw new Error(makeMethod.error.message);
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("makeMethod")
                            .select("*")
                            .eq("itemId", (_u = makeMethod.data) === null || _u === void 0 ? void 0 : _u.itemId)
                            .eq("companyId", companyId_1),
                        client_1
                            .from("quote")
                            .select("*")
                            .eq("companyId", companyId_1)
                            .eq("status", "Draft"),
                        client_1
                            .from("job")
                            .select("*")
                            .eq("companyId", companyId_1)
                            .eq("status", "Draft"),
                    ])];
            case 6:
                _c = _16.sent(), relatedMakeMethods = _c[0], draftQuotes = _c[1], draftJobs = _c[2];
                if (relatedMakeMethods.error)
                    throw new Error(relatedMakeMethods.error.message);
                if (draftQuotes.error)
                    throw new Error(draftQuotes.error.message);
                if (draftJobs.error)
                    throw new Error(draftJobs.error.message);
                draftMakeMethodIds = (_w = (_v = relatedMakeMethods.data) === null || _v === void 0 ? void 0 : _v.filter(function (makeMethod) {
                    return makeMethod.id !== makeMethodId_1 && makeMethod.status === "Draft";
                })) === null || _w === void 0 ? void 0 : _w.map(function (makeMethod) { return makeMethod.id; });
                activeMakeMethodIds_1 = (_y = (_x = relatedMakeMethods.data) === null || _x === void 0 ? void 0 : _x.filter(function (makeMethod) {
                    return makeMethod.id !== makeMethodId_1 && makeMethod.status === "Active";
                })) === null || _y === void 0 ? void 0 : _y.map(function (makeMethod) { return makeMethod.id; });
                relatedMakeMethodIds_1 = __spreadArray(__spreadArray([], (draftMakeMethodIds !== null && draftMakeMethodIds !== void 0 ? draftMakeMethodIds : []), true), (activeMakeMethodIds_1 !== null && activeMakeMethodIds_1 !== void 0 ? activeMakeMethodIds_1 : []), true);
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("methodMaterial")
                            .select("*")
                            .in("materialMakeMethodId", relatedMakeMethodIds_1)
                            .eq("companyId", companyId_1),
                    ])];
            case 7:
                methodMaterials = (_16.sent())[0];
                if (methodMaterials.error)
                    throw new Error(methodMaterials.error.message);
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(activeMakeMethodIds_1.length > 0)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, trx
                                            .updateTable("makeMethod")
                                            .set({ status: "Archived" })
                                            .where("id", "in", activeMakeMethodIds_1)
                                            .execute()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [4 /*yield*/, trx
                                        .updateTable("makeMethod")
                                        .set({ status: "Active" })
                                        .where("id", "=", makeMethodId_1)
                                        .execute()];
                                case 3:
                                    _a.sent();
                                    if (!(relatedMakeMethodIds_1.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .updateTable("methodMaterial")
                                            .set({ materialMakeMethodId: makeMethodId_1 })
                                            .where("materialMakeMethodId", "in", relatedMakeMethodIds_1)
                                            .execute()];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 8:
                _16.sent();
                return [3 /*break*/, 44];
            case 9:
                purchaseOrderId = id_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("purchaseOrder")
                            .select("*")
                            .eq("id", purchaseOrderId)
                            .single(),
                        client_1
                            .from("purchaseOrderLine")
                            .select("*")
                            .eq("purchaseOrderId", purchaseOrderId),
                        client_1
                            .from("purchaseOrderPayment")
                            .select("*")
                            .eq("id", purchaseOrderId)
                            .single(),
                        client_1
                            .from("purchaseOrderDelivery")
                            .select("*")
                            .eq("id", purchaseOrderId)
                            .single(),
                    ])];
            case 10:
                _d = _16.sent(), purchaseOrder_1 = _d[0], purchaseOrderLines = _d[1], purchaseOrderPayment_1 = _d[2], purchaseOrderDelivery_1 = _d[3];
                if (!purchaseOrder_1.data)
                    throw new Error("Purchase order not found");
                if (purchaseOrderLines.error)
                    throw new Error(purchaseOrderLines.error.message);
                if (!purchaseOrderPayment_1.data)
                    throw new Error("Purchase order payment not found");
                if (!purchaseOrderDelivery_1.data)
                    throw new Error("Purchase order delivery not found");
                uninvoicedLines_1 = (_z = purchaseOrderLines === null || purchaseOrderLines === void 0 ? void 0 : purchaseOrderLines.data) === null || _z === void 0 ? void 0 : _z.reduce(function (acc, line) {
                    if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) &&
                        line.quantityToInvoice > 0 &&
                        !line.invoicedComplete) {
                        acc.push(line);
                    }
                    return acc;
                }, []);
                if (!uninvoicedLines_1 || uninvoicedLines_1.length === 0) {
                    throw new Error("No lines available to invoice. All lines may already be marked as invoiced complete.");
                }
                uninvoicedSubtotal_1 = uninvoicedLines_1.reduce(function (acc, line) {
                    if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) &&
                        line.unitPrice &&
                        line.quantityToInvoice > 0) {
                        acc += line.quantityToInvoice * line.unitPrice;
                    }
                    return acc;
                }, 0);
                purchaseInvoiceId_1 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var purchaseInvoice, purchaseInvoiceLines;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "purchaseInvoice", companyId_1)];
                                case 1:
                                    purchaseInvoiceId_1 = _e.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("purchaseInvoice")
                                            .values({
                                            invoiceId: purchaseInvoiceId_1,
                                            status: "Draft",
                                            supplierId: purchaseOrder_1.data.supplierId,
                                            supplierReference: (_a = purchaseOrder_1.data.supplierReference) !== null && _a !== void 0 ? _a : "",
                                            invoiceSupplierId: purchaseOrderPayment_1.data.invoiceSupplierId,
                                            invoiceSupplierContactId: purchaseOrderPayment_1.data.invoiceSupplierContactId,
                                            invoiceSupplierLocationId: purchaseOrderPayment_1.data.invoiceSupplierLocationId,
                                            locationId: purchaseOrderDelivery_1.data.locationId,
                                            paymentTermId: purchaseOrderPayment_1.data.paymentTermId,
                                            currencyCode: (_b = purchaseOrder_1.data.currencyCode) !== null && _b !== void 0 ? _b : "USD",
                                            dateIssued: new Date().toISOString().split("T")[0],
                                            exchangeRate: (_c = purchaseOrder_1.data.exchangeRate) !== null && _c !== void 0 ? _c : 1,
                                            subtotal: uninvoicedSubtotal_1 !== null && uninvoicedSubtotal_1 !== void 0 ? uninvoicedSubtotal_1 : 0,
                                            supplierInteractionId: purchaseOrder_1.data.supplierInteractionId,
                                            totalDiscount: 0,
                                            totalAmount: uninvoicedSubtotal_1 !== null && uninvoicedSubtotal_1 !== void 0 ? uninvoicedSubtotal_1 : 0,
                                            totalTax: 0,
                                            balance: uninvoicedSubtotal_1 !== null && uninvoicedSubtotal_1 !== void 0 ? uninvoicedSubtotal_1 : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    purchaseInvoice = _e.sent();
                                    if (!purchaseInvoice.id)
                                        throw new Error("Purchase invoice not created");
                                    purchaseInvoiceId_1 = purchaseInvoice.id;
                                    return [4 /*yield*/, trx
                                            .insertInto("purchaseInvoiceDelivery")
                                            .values({
                                            id: purchaseInvoiceId_1,
                                            locationId: purchaseOrderDelivery_1.data.locationId,
                                            supplierShippingCost: (_d = purchaseOrderDelivery_1.data.supplierShippingCost) !== null && _d !== void 0 ? _d : 0,
                                            shippingMethodId: purchaseOrderDelivery_1.data.shippingMethodId,
                                            shippingTermId: purchaseOrderDelivery_1.data.shippingTermId,
                                            incoterm: purchaseOrderDelivery_1.data.incoterm,
                                            incotermLocation: purchaseOrderDelivery_1.data.incotermLocation,
                                            companyId: companyId_1,
                                            updatedBy: userId_1,
                                        })
                                            .execute()];
                                case 3:
                                    _e.sent();
                                    purchaseInvoiceLines = uninvoicedLines_1.map(function (line) {
                                        var _a, _b, _c, _d, _e;
                                        return ({
                                            invoiceId: purchaseInvoiceId_1,
                                            invoiceLineType: line.purchaseOrderLineType,
                                            purchaseOrderId: line.purchaseOrderId,
                                            purchaseOrderLineId: line.id,
                                            itemId: line.itemId,
                                            locationId: line.locationId,
                                            storageUnitId: line.storageUnitId,
                                            accountId: line.accountId,
                                            costCenterId: line.costCenterId,
                                            assetId: line.assetId,
                                            description: line.description,
                                            quantity: line.quantityToInvoice,
                                            supplierUnitPrice: (_a = line.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0,
                                            supplierShippingCost: (_b = line.supplierShippingCost) !== null && _b !== void 0 ? _b : 0,
                                            supplierTaxAmount: (_c = line.supplierTaxAmount) !== null && _c !== void 0 ? _c : 0,
                                            purchaseUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                                            inventoryUnitOfMeasureCode: line.inventoryUnitOfMeasureCode,
                                            conversionFactor: line.conversionFactor,
                                            exchangeRate: (_d = line.exchangeRate) !== null && _d !== void 0 ? _d : 1,
                                            jobOperationId: line.jobOperationId,
                                            sortOrder: (_e = line.sortOrder) !== null && _e !== void 0 ? _e : 1,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        });
                                    });
                                    return [4 /*yield*/, trx
                                            .insertInto("purchaseInvoiceLine")
                                            .values(purchaseInvoiceLines)
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 11:
                _16.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: purchaseInvoiceId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 12:
                selectedLines_1 = payload.selectedLines, purchaseOrderNumber_1 = payload.purchaseOrderNumber, digitalQuoteAcceptedBy_1 = payload.digitalQuoteAcceptedBy, digitalQuoteAcceptedByEmail_1 = payload.digitalQuoteAcceptedByEmail;
                return [4 /*yield*/, Promise.all([
                        client_1.from("quote").select("*").eq("id", id_1).single(),
                        client_1.from("quoteLine").select("*").eq("quoteId", id_1),
                        client_1.from("quotePayment").select("*").eq("id", id_1).single(),
                        client_1.from("quoteShipment").select("*").eq("id", id_1).single(),
                        client_1.from("company").select("*").eq("id", companyId_1).single(),
                    ])];
            case 13:
                _e = _16.sent(), quote_1 = _e[0], quoteLines_1 = _e[1], quotePayment_1 = _e[2], quoteShipping_1 = _e[3], company_1 = _e[4];
                if (quote_1.error)
                    throw new Error("Quote with id ".concat(id_1, " not found"));
                if (quoteLines_1.error)
                    throw new Error("Quote Lines with id ".concat(id_1, " not found"));
                if (quotePayment_1.error)
                    throw new Error("Quote payment with id ".concat(id_1, " not found"));
                if (quoteShipping_1.error)
                    throw new Error("Quote shipping with id ".concat(id_1, " not found"));
                insertedSalesOrderId_1 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var today, salesOrderId, hasZeroQuantityLines, salesOrderStatus, salesOrder, selectedQuoteLines, pickMethodDefaultsByLineId, salesOrderLineInserts, newQuoteStatus, customerPartSeen, customerPartToItemInserts, updatedItemModels, _a, updatedItemModels_1, updatedItemModels_1_1, update, e_1_1;
                        var _b, e_1, _c, _d;
                        var _e, _f, _g, _h, _j, _k;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0:
                                    today = (0, format_ts_1.format)(new Date(), "yyyy-MM-dd");
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "salesOrder", companyId_1)];
                                case 1:
                                    salesOrderId = _l.sent();
                                    hasZeroQuantityLines = quoteLines_1.data.some(function (line) {
                                        return line.id &&
                                            selectedLines_1 &&
                                            line.id in selectedLines_1 &&
                                            selectedLines_1[line.id].quantity === 0;
                                    });
                                    salesOrderStatus = "To Ship and Invoice";
                                    return [4 /*yield*/, trx
                                            .insertInto("salesOrder")
                                            .values([
                                            {
                                                salesOrderId: salesOrderId,
                                                revisionId: 0,
                                                orderDate: today,
                                                customerId: quote_1.data.customerId,
                                                customerContactId: quote_1.data.customerContactId,
                                                customerEngineeringContactId: quote_1.data.customerEngineeringContactId,
                                                customerLocationId: quote_1.data.customerLocationId,
                                                customerReference: purchaseOrderNumber_1 !== null && purchaseOrderNumber_1 !== void 0 ? purchaseOrderNumber_1 : "",
                                                locationId: quote_1.data.locationId,
                                                salesPersonId: (_e = quote_1.data.salesPersonId) !== null && _e !== void 0 ? _e : userId_1,
                                                status: salesOrderStatus,
                                                createdBy: userId_1,
                                                companyId: companyId_1,
                                                currencyCode: (_h = (_f = quote_1.data.currencyCode) !== null && _f !== void 0 ? _f : (_g = company_1.data) === null || _g === void 0 ? void 0 : _g.baseCurrencyCode) !== null && _h !== void 0 ? _h : "USD",
                                                externalNotes: quote_1.data.externalNotes,
                                                internalNotes: quote_1.data.internalNotes,
                                                exchangeRate: (_j = quote_1.data.exchangeRate) !== null && _j !== void 0 ? _j : 1,
                                                exchangeRateUpdatedAt: (_k = quote_1.data.exchangeRateUpdatedAt) !== null && _k !== void 0 ? _k : new Date().toISOString(),
                                                opportunityId: quote_1.data.opportunityId,
                                            },
                                        ])
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    salesOrder = _l.sent();
                                    if (!salesOrder.id) {
                                        throw new Error("sales order is not created");
                                    }
                                    insertedSalesOrderId_1 = salesOrder.id;
                                    // Copy quotePayment data to salesOrderPayment
                                    return [4 /*yield*/, trx
                                            .insertInto("salesOrderPayment")
                                            .values(__assign(__assign({}, quotePayment_1.data), { id: insertedSalesOrderId_1 }))
                                            .execute()];
                                case 3:
                                    // Copy quotePayment data to salesOrderPayment
                                    _l.sent();
                                    // Copy quoteShipment data to salesOrderShipment
                                    return [4 /*yield*/, trx
                                            .insertInto("salesOrderShipment")
                                            .values(__assign(__assign({}, quoteShipping_1.data), { id: insertedSalesOrderId_1 }))
                                            .execute()];
                                case 4:
                                    // Copy quoteShipment data to salesOrderShipment
                                    _l.sent();
                                    selectedQuoteLines = quoteLines_1.data.filter(function (line) {
                                        return line.id &&
                                            selectedLines_1 &&
                                            line.id in selectedLines_1 &&
                                            selectedLines_1[line.id].quantity > 0;
                                    });
                                    pickMethodDefaultsByLineId = new Map();
                                    return [4 /*yield*/, Promise.all(selectedQuoteLines.map(function (line) { return __awaiter(void 0, void 0, void 0, function () {
                                            var lineLocationId, pickMethod;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        if (!line.id || !line.itemId)
                                                            return [2 /*return*/];
                                                        if (line.methodType === "Make to Order")
                                                            return [2 /*return*/];
                                                        lineLocationId = (_a = line.locationId) !== null && _a !== void 0 ? _a : quote_1.data.locationId;
                                                        if (!lineLocationId)
                                                            return [2 /*return*/];
                                                        return [4 /*yield*/, trx
                                                                .selectFrom("pickMethod")
                                                                .where("itemId", "=", line.itemId)
                                                                .where("locationId", "=", lineLocationId)
                                                                .where("companyId", "=", companyId_1)
                                                                .select("defaultStorageUnitId")
                                                                .executeTakeFirst()];
                                                    case 1:
                                                        pickMethod = _b.sent();
                                                        if (pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.defaultStorageUnitId) {
                                                            pickMethodDefaultsByLineId.set(line.id, pickMethod.defaultStorageUnitId);
                                                        }
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 5:
                                    _l.sent();
                                    salesOrderLineInserts = selectedQuoteLines.map(function (line) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h;
                                        return {
                                            id: line.id,
                                            salesOrderId: insertedSalesOrderId_1,
                                            salesOrderLineType: line.itemType,
                                            addOnCost: (_a = selectedLines_1[line.id].taxableAddOn) !== null && _a !== void 0 ? _a : selectedLines_1[line.id].addOn,
                                            nonTaxableAddOnCost: ((_b = selectedLines_1[line.id].addOn) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = selectedLines_1[line.id].taxableAddOn) !== null && _c !== void 0 ? _c : selectedLines_1[line.id].addOn) !== null && _d !== void 0 ? _d : 0),
                                            description: line.description,
                                            itemId: line.itemId,
                                            locationId: (_e = line.locationId) !== null && _e !== void 0 ? _e : quote_1.data.locationId,
                                            methodType: line.methodType,
                                            storageUnitId: (_f = pickMethodDefaultsByLineId.get(line.id)) !== null && _f !== void 0 ? _f : null,
                                            internalNotes: line.internalNotes,
                                            externalNotes: line.externalNotes,
                                            saleQuantity: selectedLines_1[line.id].quantity,
                                            status: "Ordered",
                                            unitOfMeasureCode: line.unitOfMeasureCode,
                                            unitPrice: selectedLines_1[line.id].netUnitPrice,
                                            promisedDate: (0, format_ts_1.format)(new Date(Date.now() +
                                                selectedLines_1[line.id].leadTime * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
                                            createdBy: userId_1,
                                            companyId: companyId_1,
                                            exchangeRate: (_g = quote_1.data.exchangeRate) !== null && _g !== void 0 ? _g : 1,
                                            taxPercent: line.taxPercent,
                                            shippingCost: selectedLines_1[line.id].shippingCost,
                                            sortOrder: (_h = line.sortOrder) !== null && _h !== void 0 ? _h : 1,
                                        };
                                    });
                                    if (!(salesOrderLineInserts.length > 0)) return [3 /*break*/, 8];
                                    return [4 /*yield*/, trx
                                            .insertInto("salesOrderLine")
                                            .values(salesOrderLineInserts)
                                            .execute()];
                                case 6:
                                    _l.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("item")
                                            .set({ active: true })
                                            .where("id", "in", salesOrderLineInserts.map(function (insert) { return insert.itemId; }))
                                            .execute()];
                                case 7:
                                    _l.sent();
                                    _l.label = 8;
                                case 8:
                                    newQuoteStatus = hasZeroQuantityLines
                                        ? "Partial"
                                        : "Ordered";
                                    return [4 /*yield*/, trx
                                            .updateTable("quote")
                                            .set({
                                            status: newQuoteStatus,
                                            digitalQuoteAcceptedBy: digitalQuoteAcceptedBy_1 !== null && digitalQuoteAcceptedBy_1 !== void 0 ? digitalQuoteAcceptedBy_1 : null,
                                            digitalQuoteAcceptedByEmail: digitalQuoteAcceptedByEmail_1 !== null && digitalQuoteAcceptedByEmail_1 !== void 0 ? digitalQuoteAcceptedByEmail_1 : null,
                                        })
                                            .where("id", "=", quote_1.data.id)
                                            .execute()];
                                case 9:
                                    _l.sent();
                                    customerPartSeen = new Set();
                                    customerPartToItemInserts = quoteLines_1.data
                                        .map(function (line) {
                                        var _a, _b;
                                        return ({
                                            companyId: companyId_1,
                                            customerId: (_a = quote_1.data) === null || _a === void 0 ? void 0 : _a.customerId,
                                            customerPartId: line.customerPartId,
                                            customerPartRevision: (_b = line.customerPartRevision) !== null && _b !== void 0 ? _b : "",
                                            itemId: line.itemId,
                                        });
                                    })
                                        .filter(function (line) {
                                        if (!line.itemId || !line.customerPartId)
                                            return false;
                                        var key = "".concat(line.customerId, "-").concat(line.itemId);
                                        if (customerPartSeen.has(key))
                                            return false;
                                        customerPartSeen.add(key);
                                        return true;
                                    });
                                    if (!(customerPartToItemInserts.length > 0)) return [3 /*break*/, 11];
                                    return [4 /*yield*/, trx
                                            .insertInto("customerPartToItem")
                                            .values(customerPartToItemInserts)
                                            .onConflict(function (oc) {
                                            return oc.columns(["customerId", "itemId"]).doUpdateSet(function (eb) { return ({
                                                customerPartId: eb.ref("excluded.customerPartId"),
                                                customerPartRevision: eb.ref("excluded.customerPartRevision"),
                                            }); });
                                        })
                                            .execute()];
                                case 10:
                                    _l.sent();
                                    _l.label = 11;
                                case 11:
                                    updatedItemModels = quoteLines_1.data
                                        .filter(function (line) { return !!line.modelUploadId && !!line.itemId; })
                                        .map(function (line) { return ({
                                        id: line.itemId,
                                        modelUploadId: line.modelUploadId,
                                    }); });
                                    if (!(updatedItemModels.length > 0)) return [3 /*break*/, 24];
                                    _l.label = 12;
                                case 12:
                                    _l.trys.push([12, 18, 19, 24]);
                                    _a = true, updatedItemModels_1 = __asyncValues(updatedItemModels);
                                    _l.label = 13;
                                case 13: return [4 /*yield*/, updatedItemModels_1.next()];
                                case 14:
                                    if (!(updatedItemModels_1_1 = _l.sent(), _b = updatedItemModels_1_1.done, !_b)) return [3 /*break*/, 17];
                                    _d = updatedItemModels_1_1.value;
                                    _a = false;
                                    update = _d;
                                    return [4 /*yield*/, trx
                                            .updateTable("item")
                                            .set(update)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 15:
                                    _l.sent();
                                    _l.label = 16;
                                case 16:
                                    _a = true;
                                    return [3 /*break*/, 13];
                                case 17: return [3 /*break*/, 24];
                                case 18:
                                    e_1_1 = _l.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 24];
                                case 19:
                                    _l.trys.push([19, , 22, 23]);
                                    if (!(!_a && !_b && (_c = updatedItemModels_1.return))) return [3 /*break*/, 21];
                                    return [4 /*yield*/, _c.call(updatedItemModels_1)];
                                case 20:
                                    _l.sent();
                                    _l.label = 21;
                                case 21: return [3 /*break*/, 23];
                                case 22:
                                    if (e_1) throw e_1.error;
                                    return [7 /*endfinally*/];
                                case 23: return [7 /*endfinally*/];
                                case 24: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 14:
                _16.sent();
                if (!insertedSalesOrderId_1) {
                    throw new Error("Failed to insert sales order");
                }
                convertedId = insertedSalesOrderId_1;
                return [3 /*break*/, 44];
            case 15:
                salesOrderId = id_1;
                return [4 /*yield*/, Promise.all([
                        client_1.from("salesOrder").select("*").eq("id", salesOrderId).single(),
                        client_1
                            .from("salesOrderLine")
                            .select("*")
                            .eq("salesOrderId", salesOrderId),
                        client_1
                            .from("salesOrderPayment")
                            .select("*")
                            .eq("id", salesOrderId)
                            .single(),
                        client_1
                            .from("salesOrderShipment")
                            .select("*")
                            .eq("id", salesOrderId)
                            .single(),
                    ])];
            case 16:
                _f = _16.sent(), salesOrder_1 = _f[0], salesOrderLines = _f[1], salesOrderPayment_1 = _f[2], salesOrderShipment_1 = _f[3];
                if (!salesOrder_1.data)
                    throw new Error("Purchase order not found");
                if (salesOrderLines.error)
                    throw new Error(salesOrderLines.error.message);
                if (!salesOrderPayment_1.data)
                    throw new Error("Purchase order payment not found");
                if (!salesOrderShipment_1.data)
                    throw new Error("Purchase order delivery not found");
                uninvoicedLines_2 = (_0 = salesOrderLines === null || salesOrderLines === void 0 ? void 0 : salesOrderLines.data) === null || _0 === void 0 ? void 0 : _0.reduce(function (acc, line) {
                    if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) && line.quantityToInvoice > 0) {
                        acc.push(line);
                    }
                    return acc;
                }, []);
                uninvoicedSubtotal_2 = uninvoicedLines_2 === null || uninvoicedLines_2 === void 0 ? void 0 : uninvoicedLines_2.reduce(function (acc, line) {
                    if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) &&
                        line.unitPrice &&
                        line.quantityToInvoice > 0) {
                        acc += line.quantityToInvoice * line.unitPrice;
                    }
                    return acc;
                }, 0);
                salesInvoiceId_1 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var salesInvoice, salesInvoiceLines;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "salesInvoice", companyId_1)];
                                case 1:
                                    salesInvoiceId_1 = _e.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("salesInvoice")
                                            .values({
                                            invoiceId: salesInvoiceId_1,
                                            status: "Draft",
                                            customerId: salesOrder_1.data.customerId,
                                            customerReference: (_a = salesOrder_1.data.customerReference) !== null && _a !== void 0 ? _a : "",
                                            invoiceCustomerId: salesOrderPayment_1.data.invoiceCustomerId,
                                            invoiceCustomerContactId: salesOrderPayment_1.data.invoiceCustomerContactId,
                                            invoiceCustomerLocationId: salesOrderPayment_1.data.invoiceCustomerLocationId,
                                            locationId: salesOrderShipment_1.data.locationId,
                                            paymentTermId: salesOrderPayment_1.data.paymentTermId,
                                            currencyCode: (_b = salesOrder_1.data.currencyCode) !== null && _b !== void 0 ? _b : "USD",
                                            dateIssued: new Date().toISOString().split("T")[0],
                                            exchangeRate: (_c = salesOrder_1.data.exchangeRate) !== null && _c !== void 0 ? _c : 1,
                                            subtotal: uninvoicedSubtotal_2 !== null && uninvoicedSubtotal_2 !== void 0 ? uninvoicedSubtotal_2 : 0,
                                            opportunityId: salesOrder_1.data.opportunityId,
                                            totalDiscount: 0,
                                            totalAmount: uninvoicedSubtotal_2 !== null && uninvoicedSubtotal_2 !== void 0 ? uninvoicedSubtotal_2 : 0,
                                            totalTax: 0,
                                            balance: uninvoicedSubtotal_2 !== null && uninvoicedSubtotal_2 !== void 0 ? uninvoicedSubtotal_2 : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    salesInvoice = _e.sent();
                                    if (!salesInvoice.id)
                                        throw new Error("Purchase invoice not created");
                                    salesInvoiceId_1 = salesInvoice.id;
                                    return [4 /*yield*/, trx
                                            .insertInto("salesInvoiceShipment")
                                            .values({
                                            id: salesInvoiceId_1,
                                            locationId: salesOrderShipment_1.data.locationId,
                                            shippingCost: (_d = salesOrderShipment_1.data.shippingCost) !== null && _d !== void 0 ? _d : 0,
                                            shippingMethodId: salesOrderShipment_1.data.shippingMethodId,
                                            shippingTermId: salesOrderShipment_1.data.shippingTermId,
                                            incoterm: salesOrderShipment_1.data.incoterm,
                                            incotermLocation: salesOrderShipment_1.data.incotermLocation,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        })
                                            .execute()];
                                case 3:
                                    _e.sent();
                                    salesInvoiceLines = uninvoicedLines_2 === null || uninvoicedLines_2 === void 0 ? void 0 : uninvoicedLines_2.reduce(function (acc, line) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h;
                                        if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) &&
                                            line.quantityToInvoice > 0 &&
                                            !line.invoicedComplete) {
                                            acc.push({
                                                invoiceId: salesInvoiceId_1,
                                                invoiceLineType: line.salesOrderLineType,
                                                salesOrderId: line.salesOrderId,
                                                salesOrderLineId: line.id,
                                                methodType: line.methodType,
                                                itemId: line.itemId,
                                                locationId: line.locationId,
                                                storageUnitId: line.storageUnitId,
                                                accountId: line.accountId,
                                                assetId: line.assetId,
                                                description: line.description,
                                                quantity: line.quantityToInvoice,
                                                unitPrice: (_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0,
                                                addOnCost: (_b = line.addOnCost) !== null && _b !== void 0 ? _b : 0,
                                                nonTaxableAddOnCost: (_c = line.nonTaxableAddOnCost) !== null && _c !== void 0 ? _c : 0,
                                                shippingCost: (_d = line.shippingCost) !== null && _d !== void 0 ? _d : 0,
                                                taxPercent: (_e = line.taxPercent) !== null && _e !== void 0 ? _e : 0,
                                                unitOfMeasureCode: (_f = line.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "EA",
                                                exchangeRate: (_g = line.exchangeRate) !== null && _g !== void 0 ? _g : 1,
                                                sortOrder: (_h = line.sortOrder) !== null && _h !== void 0 ? _h : 1,
                                                companyId: companyId_1,
                                                createdBy: userId_1,
                                            });
                                        }
                                        return acc;
                                    }, []);
                                    if (!(salesInvoiceLines.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("salesInvoiceLine")
                                            .values(salesInvoiceLines)
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    _e.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 17:
                _16.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: salesInvoiceId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 18: return [4 /*yield*/, Promise.all([
                    client_1.from("salesRfq").select("*").eq("id", id_1).single(),
                    client_1.from("salesRfqLines").select("*").eq("salesRfqId", id_1),
                ])];
            case 19:
                _g = _16.sent(), salesRfq_1 = _g[0], salesRfqLines = _g[1];
                if (salesRfq_1.error)
                    throw new Error("Sales RFQ with id ".concat(id_1, " not found"));
                if (((_1 = salesRfq_1.data) === null || _1 === void 0 ? void 0 : _1.status) !== "Ready for Quote")
                    throw new Error("Sales RFQ with id ".concat(id_1, " is not in Ready for Quote status"));
                if (salesRfqLines.error) {
                    throw new Error("Sales RFQ Lines with id ".concat(id_1, " not found"));
                }
                linesToCreateItems = salesRfqLines.data.filter(function (line) { return !line.itemId; });
                readableIdToLineIdMapping_1 = new Map();
                itemInserts_1 = [];
                if (!(linesToCreateItems.length > 0)) return [3 /*break*/, 21];
                return [4 /*yield*/, Promise.all(linesToCreateItems.map(function (line) { return __awaiter(void 0, void 0, void 0, function () {
                        var revisionId, readableId, suffix, _a, data, error;
                        var _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    revisionId = (_b = line.customerPartRevision) !== null && _b !== void 0 ? _b : "0";
                                    readableId = (_c = line.customerPartId) !== null && _c !== void 0 ? _c : "";
                                    suffix = 1;
                                    _f.label = 1;
                                case 1:
                                    if (!true) return [3 /*break*/, 3];
                                    return [4 /*yield*/, client_1
                                            .from("item")
                                            .select("id")
                                            .eq("readableId", readableId)
                                            .eq("revision", revisionId)
                                            .eq("companyId", companyId_1)
                                            .single()];
                                case 2:
                                    _a = _f.sent(), data = _a.data, error = _a.error;
                                    if (
                                    // If multiple line items in the RFQ have the same customer part number and revision,
                                    // make sure they get assiged different readableIds
                                    !readableIdToLineIdMapping_1.has(readableId) &&
                                        (error || !data)) {
                                        // readableId is unique, we can use it
                                        return [3 /*break*/, 3];
                                    }
                                    // If not unique, append or increment suffix
                                    revisionId = "".concat(revisionId, " (").concat(suffix, ")");
                                    suffix++;
                                    return [3 /*break*/, 1];
                                case 3:
                                    readableIdToLineIdMapping_1.set(readableId, line.id);
                                    return [2 /*return*/, {
                                            readableId: readableId,
                                            revision: revisionId,
                                            type: "Part",
                                            active: false,
                                            name: (_e = (_d = line.description) !== null && _d !== void 0 ? _d : line.itemName) !== null && _e !== void 0 ? _e : "",
                                            description: "",
                                            itemTrackingType: "Inventory",
                                            replenishmentSystem: "Make",
                                            defaultMethodType: "Make to Order",
                                            unitOfMeasureCode: "EA",
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        }];
                            }
                        });
                    }); }))];
            case 20:
                itemInserts_1 = _16.sent();
                _16.label = 21;
            case 21:
                if (!salesRfq_1.data.customerId) {
                    throw new Error("Sales RFQ with id ".concat(id_1, " has no customerId"));
                }
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("customerPayment")
                            .select("*")
                            .eq("customerId", salesRfq_1.data.customerId)
                            .single(),
                        client_1
                            .from("customerShipping")
                            .select("*")
                            .eq("customerId", salesRfq_1.data.customerId)
                            .single(),
                        client_1
                            .from("customer")
                            .select("*")
                            .eq("id", salesRfq_1.data.customerId)
                            .single(),
                        client_1.from("company").select("*").eq("id", companyId_1).single(),
                    ])];
            case 22:
                _h = _16.sent(), customerPayment = _h[0], customerShipping = _h[1], customer = _h[2], company = _h[3];
                if (customerPayment.error)
                    throw customerPayment.error;
                if (customerShipping.error)
                    throw customerShipping.error;
                if (customer.error)
                    throw customer.error;
                if (company.error)
                    throw company.error;
                currencyCode_1 = (_5 = (_3 = (_2 = customer.data) === null || _2 === void 0 ? void 0 : _2.currencyCode) !== null && _3 !== void 0 ? _3 : (_4 = company.data) === null || _4 === void 0 ? void 0 : _4.baseCurrencyCode) !== null && _5 !== void 0 ? _5 : "USD";
                return [4 /*yield*/, client_1
                        .from("currency")
                        .select("*")
                        .eq("code", currencyCode_1)
                        .eq("companyId", companyId_1)
                        .single()];
            case 23:
                currency = _16.sent();
                exchangeRate_1 = (_7 = (_6 = currency.data) === null || _6 === void 0 ? void 0 : _6.exchangeRate) !== null && _7 !== void 0 ? _7 : 1;
                _j = customerPayment.data, paymentTermId_1 = _j.paymentTermId, invoiceCustomerId_1 = _j.invoiceCustomerId, invoiceCustomerContactId_1 = _j.invoiceCustomerContactId, invoiceCustomerLocationId_1 = _j.invoiceCustomerLocationId;
                _k = customerShipping.data, shippingMethodId_1 = _k.shippingMethodId, shippingTermId_1 = _k.shippingTermId, incoterm_1 = _k.incoterm, incotermLocation_1 = _k.incotermLocation;
                insertedQuoteId_1 = "";
                insertedQuoteLines_1 = [];
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var itemIds, partInserts, salesRfqLineUpdates, _a, salesRfqLineUpdates_1, salesRfqLineUpdates_1_1, update, e_2_1, quoteId, externalLinkId, quote, salesRfqLinesWithItemIds, quoteLineInserts, rfqCustomerPartSeen, customerPartToItemInserts, updatedItemModels, _b, updatedItemModels_2, updatedItemModels_2_1, update, e_3_1;
                        var _c, e_2, _d, _e, _f, e_3, _g, _h;
                        var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0:
                                    if (!(itemInserts_1.length > 0)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .insertInto("item")
                                            .values(itemInserts_1)
                                            .returning(["id", "readableId", "revision"])
                                            .execute()];
                                case 1:
                                    itemIds = _v.sent();
                                    partInserts = itemIds.map(function (item) { return ({
                                        id: item.readableId,
                                        companyId: companyId_1,
                                        createdBy: userId_1,
                                    }); });
                                    return [4 /*yield*/, trx
                                            .insertInto("part")
                                            .values(partInserts)
                                            .onConflict(function (oc) {
                                            return oc.columns(["id", "companyId"]).doUpdateSet({
                                                updatedAt: new Date().toISOString(),
                                                updatedBy: userId_1,
                                            });
                                        })
                                            .execute()];
                                case 2:
                                    _v.sent();
                                    salesRfqLineUpdates = itemIds.map(function (item) { return ({
                                        itemId: item.id,
                                        id: readableIdToLineIdMapping_1.get(item.readableId),
                                    }); });
                                    _v.label = 3;
                                case 3:
                                    _v.trys.push([3, 9, 10, 15]);
                                    _a = true, salesRfqLineUpdates_1 = __asyncValues(salesRfqLineUpdates);
                                    _v.label = 4;
                                case 4: return [4 /*yield*/, salesRfqLineUpdates_1.next()];
                                case 5:
                                    if (!(salesRfqLineUpdates_1_1 = _v.sent(), _c = salesRfqLineUpdates_1_1.done, !_c)) return [3 /*break*/, 8];
                                    _e = salesRfqLineUpdates_1_1.value;
                                    _a = false;
                                    update = _e;
                                    return [4 /*yield*/, trx
                                            .updateTable("salesRfqLine")
                                            .set({ itemId: update.itemId })
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 6:
                                    _v.sent();
                                    _v.label = 7;
                                case 7:
                                    _a = true;
                                    return [3 /*break*/, 4];
                                case 8: return [3 /*break*/, 15];
                                case 9:
                                    e_2_1 = _v.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 15];
                                case 10:
                                    _v.trys.push([10, , 13, 14]);
                                    if (!(!_a && !_c && (_d = salesRfqLineUpdates_1.return))) return [3 /*break*/, 12];
                                    return [4 /*yield*/, _d.call(salesRfqLineUpdates_1)];
                                case 11:
                                    _v.sent();
                                    _v.label = 12;
                                case 12: return [3 /*break*/, 14];
                                case 13:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 14: return [7 /*endfinally*/];
                                case 15: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "quote", companyId_1)];
                                case 16:
                                    quoteId = _v.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("externalLink")
                                            .values({
                                            documentId: quoteId,
                                            documentType: "Quote",
                                            companyId: companyId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 17:
                                    externalLinkId = _v.sent();
                                    if (!salesRfq_1.data.customerId) {
                                        throw new Error("Sales RFQ with id ".concat(id_1, " has no customerId"));
                                    }
                                    return [4 /*yield*/, trx
                                            .insertInto("quote")
                                            .values([
                                            {
                                                quoteId: quoteId,
                                                customerId: (_j = salesRfq_1.data) === null || _j === void 0 ? void 0 : _j.customerId,
                                                customerContactId: (_k = salesRfq_1.data) === null || _k === void 0 ? void 0 : _k.customerContactId,
                                                customerEngineeringContactId: (_l = salesRfq_1.data) === null || _l === void 0 ? void 0 : _l.customerEngineeringContactId,
                                                customerLocationId: (_m = salesRfq_1.data) === null || _m === void 0 ? void 0 : _m.customerLocationId,
                                                customerReference: (_o = salesRfq_1.data) === null || _o === void 0 ? void 0 : _o.customerReference,
                                                locationId: (_p = salesRfq_1.data) === null || _p === void 0 ? void 0 : _p.locationId,
                                                expirationDate: (0, date_1.toCalendarDate)((0, date_1.now)((0, date_1.getLocalTimeZone)()).add({ days: 30 })).toString(),
                                                salesPersonId: (_r = (_q = salesRfq_1.data) === null || _q === void 0 ? void 0 : _q.salesPersonId) !== null && _r !== void 0 ? _r : userId_1,
                                                status: "Draft",
                                                externalNotes: (_s = salesRfq_1.data) === null || _s === void 0 ? void 0 : _s.externalNotes,
                                                internalNotes: (_t = salesRfq_1.data) === null || _t === void 0 ? void 0 : _t.internalNotes,
                                                companyId: companyId_1,
                                                createdBy: userId_1,
                                                currencyCode: currencyCode_1,
                                                exchangeRate: exchangeRate_1,
                                                exchangeRateUpdatedAt: new Date().toISOString(),
                                                externalLinkId: externalLinkId.id,
                                                opportunityId: salesRfq_1.data.opportunityId,
                                            },
                                        ])
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 18:
                                    quote = _v.sent();
                                    if (!quote.id) {
                                        throw new Error("Failed to insert quote");
                                    }
                                    // Insert quotePayment
                                    return [4 /*yield*/, trx
                                            .insertInto("quotePayment")
                                            .values({
                                            id: quote.id,
                                            invoiceCustomerId: invoiceCustomerId_1,
                                            invoiceCustomerContactId: invoiceCustomerContactId_1,
                                            invoiceCustomerLocationId: invoiceCustomerLocationId_1,
                                            paymentTermId: paymentTermId_1,
                                            companyId: companyId_1,
                                        })
                                            .execute()];
                                case 19:
                                    // Insert quotePayment
                                    _v.sent();
                                    // Insert quoteShipment
                                    return [4 /*yield*/, trx
                                            .insertInto("quoteShipment")
                                            .values({
                                            id: quote.id,
                                            locationId: (_u = salesRfq_1.data) === null || _u === void 0 ? void 0 : _u.locationId,
                                            shippingMethodId: shippingMethodId_1,
                                            shippingTermId: shippingTermId_1,
                                            incoterm: incoterm_1,
                                            incotermLocation: incotermLocation_1,
                                            companyId: companyId_1,
                                        })
                                            .execute()];
                                case 20:
                                    // Insert quoteShipment
                                    _v.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("salesRfqLines")
                                            .selectAll()
                                            .where("salesRfqId", "=", id_1)
                                            .execute()];
                                case 21:
                                    salesRfqLinesWithItemIds = _v.sent();
                                    quoteLineInserts = salesRfqLinesWithItemIds.map(function (line) {
                                        var _a, _b, _c, _d, _e;
                                        return ({
                                            id: (_a = line.id) !== null && _a !== void 0 ? _a : undefined,
                                            quoteId: quote.id,
                                            itemId: line.itemId,
                                            customerPartId: line.customerPartId,
                                            customerPartRevision: line.customerPartRevision,
                                            description: (_c = (_b = line.description) !== null && _b !== void 0 ? _b : line.itemName) !== null && _c !== void 0 ? _c : "",
                                            itemType: line.itemType,
                                            locationId: (_d = salesRfq_1.data) === null || _d === void 0 ? void 0 : _d.locationId,
                                            methodType: line.methodType,
                                            modelUploadId: line.modelUploadId,
                                            internalNotes: line.internalNotes,
                                            externalNotes: line.externalNotes,
                                            quantity: line.quantity,
                                            status: "Not Started",
                                            unitOfMeasureCode: line.unitOfMeasureCode,
                                            // Sales RFQ uses "order" column; map it to quoteLine.sortOrder
                                            sortOrder: (_e = line.order) !== null && _e !== void 0 ? _e : 1,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        });
                                    });
                                    if (!(quoteLineInserts.length > 0)) return [3 /*break*/, 23];
                                    return [4 /*yield*/, trx
                                            .insertInto("quoteLine")
                                            .values(quoteLineInserts)
                                            .returning(["id", "itemId", "methodType"])
                                            .execute()];
                                case 22:
                                    insertedQuoteLines_1 = _v.sent();
                                    _v.label = 23;
                                case 23: 
                                // update salesRfq status
                                return [4 /*yield*/, trx
                                        .updateTable("salesRfq")
                                        .set({ status: "Ready for Quote" })
                                        .where("id", "=", id_1)
                                        .execute()];
                                case 24:
                                    // update salesRfq status
                                    _v.sent();
                                    rfqCustomerPartSeen = new Set();
                                    customerPartToItemInserts = salesRfqLinesWithItemIds
                                        .map(function (line) {
                                        var _a, _b;
                                        return ({
                                            companyId: companyId_1,
                                            customerId: (_a = salesRfq_1.data) === null || _a === void 0 ? void 0 : _a.customerId,
                                            customerPartId: line.customerPartId,
                                            customerPartRevision: (_b = line.customerPartRevision) !== null && _b !== void 0 ? _b : "",
                                            itemId: line.itemId,
                                        });
                                    })
                                        .filter(function (line) {
                                        if (!line.itemId || !line.customerPartId)
                                            return false;
                                        var key = "".concat(line.customerId, "-").concat(line.itemId);
                                        if (rfqCustomerPartSeen.has(key))
                                            return false;
                                        rfqCustomerPartSeen.add(key);
                                        return true;
                                    });
                                    if (!(customerPartToItemInserts.length > 0)) return [3 /*break*/, 26];
                                    return [4 /*yield*/, trx
                                            .insertInto("customerPartToItem")
                                            .values(customerPartToItemInserts)
                                            .onConflict(function (oc) {
                                            return oc.columns(["customerId", "itemId"]).doUpdateSet(function (eb) { return ({
                                                customerPartId: eb.ref("excluded.customerPartId"),
                                                customerPartRevision: eb.ref("excluded.customerPartRevision"),
                                            }); });
                                        })
                                            .execute()];
                                case 25:
                                    _v.sent();
                                    _v.label = 26;
                                case 26: return [4 /*yield*/, trx
                                        .updateTable("salesRfq")
                                        .set({
                                        status: "Quoted",
                                    })
                                        .where("id", "=", id_1)
                                        .execute()];
                                case 27:
                                    _v.sent();
                                    updatedItemModels = salesRfqLinesWithItemIds
                                        .filter(function (line) { return !!line.modelUploadId && !!line.itemId; })
                                        .map(function (line) { return ({
                                        id: line.itemId,
                                        modelUploadId: line.modelUploadId,
                                    }); });
                                    if (!(updatedItemModels.length > 0)) return [3 /*break*/, 40];
                                    _v.label = 28;
                                case 28:
                                    _v.trys.push([28, 34, 35, 40]);
                                    _b = true, updatedItemModels_2 = __asyncValues(updatedItemModels);
                                    _v.label = 29;
                                case 29: return [4 /*yield*/, updatedItemModels_2.next()];
                                case 30:
                                    if (!(updatedItemModels_2_1 = _v.sent(), _f = updatedItemModels_2_1.done, !_f)) return [3 /*break*/, 33];
                                    _h = updatedItemModels_2_1.value;
                                    _b = false;
                                    update = _h;
                                    return [4 /*yield*/, trx
                                            .updateTable("item")
                                            .set(update)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 31:
                                    _v.sent();
                                    _v.label = 32;
                                case 32:
                                    _b = true;
                                    return [3 /*break*/, 29];
                                case 33: return [3 /*break*/, 40];
                                case 34:
                                    e_3_1 = _v.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 40];
                                case 35:
                                    _v.trys.push([35, , 38, 39]);
                                    if (!(!_b && !_f && (_g = updatedItemModels_2.return))) return [3 /*break*/, 37];
                                    return [4 /*yield*/, _g.call(updatedItemModels_2)];
                                case 36:
                                    _v.sent();
                                    _v.label = 37;
                                case 37: return [3 /*break*/, 39];
                                case 38:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 39: return [7 /*endfinally*/];
                                case 40:
                                    insertedQuoteId_1 = quote.id;
                                    convertedId = insertedQuoteId_1;
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 24:
                _16.sent();
                // get method for each make line
                return [4 /*yield*/, Promise.all(insertedQuoteLines_1
                        .filter(function (line) { return line.methodType === "Make to Order"; })
                        .map(function (line) {
                        return client_1.functions.invoke("get-method", {
                            body: {
                                type: "itemToQuoteLine",
                                sourceId: line.itemId,
                                targetId: "".concat(insertedQuoteId_1, ":").concat(line.id),
                                companyId: companyId_1,
                                userId: userId_1,
                            },
                        });
                    }))];
            case 25:
                // get method for each make line
                _16.sent();
                return [3 /*break*/, 44];
            case 26:
                shipmentId_1 = id_1;
                return [4 /*yield*/, Promise.all([
                        client_1.from("shipment").select("*").eq("id", shipmentId_1).single(),
                        client_1.from("shipmentLine").select("*").eq("shipmentId", shipmentId_1),
                        client_1
                            .from("shipmentFixedAssetLine")
                            .select("*")
                            .eq("shipmentId", shipmentId_1)
                            .eq("shipped", true),
                    ])];
            case 27:
                _l = _16.sent(), shipment = _l[0], shipmentLines = _l[1], shipmentFixedAssetLines = _l[2];
                if (shipmentLines.error)
                    throw shipmentLines.error;
                if (shipmentFixedAssetLines.error)
                    throw shipmentFixedAssetLines.error;
                quantitiesByLine_1 = shipmentLines.data.reduce(function (acc, line) {
                    var lineId = line.lineId;
                    acc[lineId] = (acc[lineId] || 0) + line.shippedQuantity;
                    return acc;
                }, {});
                // Each shipped fixed asset line counts as quantity 1
                for (_i = 0, _m = shipmentFixedAssetLines.data; _i < _m.length; _i++) {
                    line = _m[_i];
                    lineId = line.salesOrderLineId;
                    quantitiesByLine_1[lineId] = (quantitiesByLine_1[lineId] || 0) + 1;
                }
                salesOrderLineIds = Object.keys(quantitiesByLine_1);
                if (!((_8 = shipment.data) === null || _8 === void 0 ? void 0 : _8.sourceDocumentId) ||
                    ((_9 = shipment.data) === null || _9 === void 0 ? void 0 : _9.sourceDocument) !== "Sales Order") {
                    throw new Error("Shipment has no source document id");
                }
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("salesOrder")
                            .select("*")
                            .eq("id", (_10 = shipment.data) === null || _10 === void 0 ? void 0 : _10.sourceDocumentId)
                            .single(),
                        client_1.from("salesOrderLine").select("*").in("id", salesOrderLineIds),
                        client_1
                            .from("salesOrderPayment")
                            .select("*")
                            .eq("id", (_11 = shipment.data) === null || _11 === void 0 ? void 0 : _11.sourceDocumentId)
                            .single(),
                        client_1
                            .from("salesOrderShipment")
                            .select("*")
                            .eq("id", (_12 = shipment.data) === null || _12 === void 0 ? void 0 : _12.sourceDocumentId)
                            .single(),
                    ])];
            case 28:
                _o = _16.sent(), salesOrder_2 = _o[0], salesOrderLines = _o[1], salesOrderPayment_2 = _o[2], salesOrderShipment_2 = _o[3];
                if (!salesOrder_2.data)
                    throw new Error("Purchase order not found");
                if (salesOrderLines.error)
                    throw new Error(salesOrderLines.error.message);
                if (!salesOrderPayment_2.data)
                    throw new Error("Purchase order payment not found");
                if (!salesOrderShipment_2.data)
                    throw new Error("Purchase order delivery not found");
                uninvoicedLines_3 = (_13 = salesOrderLines === null || salesOrderLines === void 0 ? void 0 : salesOrderLines.data) === null || _13 === void 0 ? void 0 : _13.reduce(function (acc, line) {
                    var _a;
                    if (line.id in quantitiesByLine_1) {
                        var shippedInThisShipment = quantitiesByLine_1[line.id];
                        var remainingToInvoice = (_a = line.quantityToInvoice) !== null && _a !== void 0 ? _a : 0;
                        var quantityToInvoice = Math.min(shippedInThisShipment, remainingToInvoice);
                        if (quantityToInvoice > 0) {
                            acc.push(__assign(__assign({}, line), { quantityToInvoice: quantityToInvoice }));
                        }
                    }
                    return acc;
                }, []);
                uninvoicedSubtotal_3 = uninvoicedLines_3 === null || uninvoicedLines_3 === void 0 ? void 0 : uninvoicedLines_3.reduce(function (acc, line) {
                    if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) &&
                        line.unitPrice &&
                        line.quantityToInvoice > 0) {
                        acc += line.quantityToInvoice * line.unitPrice;
                    }
                    return acc;
                }, 0);
                salesInvoiceId_2 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var salesInvoice, salesInvoiceLines;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "salesInvoice", companyId_1)];
                                case 1:
                                    salesInvoiceId_2 = _e.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("salesInvoice")
                                            .values({
                                            invoiceId: salesInvoiceId_2,
                                            status: "Draft",
                                            customerId: salesOrder_2.data.customerId,
                                            customerReference: (_a = salesOrder_2.data.customerReference) !== null && _a !== void 0 ? _a : "",
                                            invoiceCustomerId: salesOrderPayment_2.data.invoiceCustomerId,
                                            invoiceCustomerContactId: salesOrderPayment_2.data.invoiceCustomerContactId,
                                            invoiceCustomerLocationId: salesOrderPayment_2.data.invoiceCustomerLocationId,
                                            locationId: salesOrderShipment_2.data.locationId,
                                            paymentTermId: salesOrderPayment_2.data.paymentTermId,
                                            currencyCode: (_b = salesOrder_2.data.currencyCode) !== null && _b !== void 0 ? _b : "USD",
                                            dateIssued: new Date().toISOString().split("T")[0],
                                            exchangeRate: (_c = salesOrder_2.data.exchangeRate) !== null && _c !== void 0 ? _c : 1,
                                            subtotal: uninvoicedSubtotal_3 !== null && uninvoicedSubtotal_3 !== void 0 ? uninvoicedSubtotal_3 : 0,
                                            opportunityId: salesOrder_2.data.opportunityId,
                                            shipmentId: shipmentId_1,
                                            totalDiscount: 0,
                                            totalAmount: uninvoicedSubtotal_3 !== null && uninvoicedSubtotal_3 !== void 0 ? uninvoicedSubtotal_3 : 0,
                                            totalTax: 0,
                                            balance: uninvoicedSubtotal_3 !== null && uninvoicedSubtotal_3 !== void 0 ? uninvoicedSubtotal_3 : 0,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    salesInvoice = _e.sent();
                                    if (!salesInvoice.id)
                                        throw new Error("Purchase invoice not created");
                                    salesInvoiceId_2 = salesInvoice.id;
                                    return [4 /*yield*/, trx
                                            .insertInto("salesInvoiceShipment")
                                            .values({
                                            id: salesInvoiceId_2,
                                            locationId: salesOrderShipment_2.data.locationId,
                                            shippingCost: (_d = salesOrderShipment_2.data.shippingCost) !== null && _d !== void 0 ? _d : 0,
                                            shippingMethodId: salesOrderShipment_2.data.shippingMethodId,
                                            shippingTermId: salesOrderShipment_2.data.shippingTermId,
                                            incoterm: salesOrderShipment_2.data.incoterm,
                                            incotermLocation: salesOrderShipment_2.data.incotermLocation,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                        })
                                            .execute()];
                                case 3:
                                    _e.sent();
                                    salesInvoiceLines = uninvoicedLines_3 === null || uninvoicedLines_3 === void 0 ? void 0 : uninvoicedLines_3.reduce(function (acc, line) {
                                        var _a, _b, _c, _d, _e, _f, _g, _h;
                                        if ((line === null || line === void 0 ? void 0 : line.quantityToInvoice) &&
                                            line.quantityToInvoice > 0 &&
                                            !line.invoicedComplete) {
                                            acc.push({
                                                invoiceId: salesInvoiceId_2,
                                                invoiceLineType: line.salesOrderLineType,
                                                salesOrderId: line.salesOrderId,
                                                salesOrderLineId: line.id,
                                                methodType: line.methodType,
                                                itemId: line.itemId,
                                                locationId: line.locationId,
                                                storageUnitId: line.storageUnitId,
                                                accountId: line.accountId,
                                                assetId: line.assetId,
                                                description: line.description,
                                                quantity: line.quantityToInvoice,
                                                unitPrice: (_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0,
                                                addOnCost: (_b = line.addOnCost) !== null && _b !== void 0 ? _b : 0,
                                                nonTaxableAddOnCost: (_c = line.nonTaxableAddOnCost) !== null && _c !== void 0 ? _c : 0,
                                                shippingCost: (_d = line.shippingCost) !== null && _d !== void 0 ? _d : 0,
                                                taxPercent: (_e = line.taxPercent) !== null && _e !== void 0 ? _e : 0,
                                                unitOfMeasureCode: (_f = line.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "EA",
                                                exchangeRate: (_g = line.exchangeRate) !== null && _g !== void 0 ? _g : 1,
                                                sortOrder: (_h = line.sortOrder) !== null && _h !== void 0 ? _h : 1,
                                                companyId: companyId_1,
                                                createdBy: userId_1,
                                            });
                                        }
                                        return acc;
                                    }, []);
                                    if (!(salesInvoiceLines.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("salesInvoiceLine")
                                            .values(salesInvoiceLines)
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    _e.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 29:
                _16.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        id: salesInvoiceId_2,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 201,
                    })];
            case 30:
                selectedLines_2 = payload.selectedLines;
                return [4 /*yield*/, Promise.all([
                        client_1.from("supplierQuote").select("*").eq("id", id_1).single(),
                        client_1
                            .from("supplierQuoteLine")
                            .select("*, item(type)")
                            .eq("supplierQuoteId", id_1),
                        client_1.from("company").select("*").eq("id", companyId_1).single(),
                        client_1
                            .from("employeeJob")
                            .select("*")
                            .eq("id", userId_1)
                            .eq("companyId", companyId_1)
                            .single(),
                    ])];
            case 31:
                _p = _16.sent(), quote_2 = _p[0], quoteLines_2 = _p[1], company_2 = _p[2], employeeJob_1 = _p[3];
                if (quote_2.error)
                    throw new Error("Quote with id ".concat(id_1, " not found"));
                if (quoteLines_2.error)
                    throw new Error("Quote Lines with id ".concat(id_1, " not found"));
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("supplierPayment")
                            .select("*")
                            .eq("supplierId", quote_2.data.supplierId)
                            .single(),
                        client_1
                            .from("supplierShipping")
                            .select("*")
                            .eq("supplierId", quote_2.data.supplierId)
                            .single(),
                        client_1
                            .from("supplier")
                            .select("*")
                            .eq("id", quote_2.data.supplierId)
                            .single(),
                        client_1
                            .from("pickMethod")
                            .select("*")
                            .in("itemId", quoteLines_2.data.map(function (line) { return line.itemId; }))
                            .eq("locationId", (_15 = (_14 = employeeJob_1.data) === null || _14 === void 0 ? void 0 : _14.locationId) !== null && _15 !== void 0 ? _15 : ""),
                    ])];
            case 32:
                _q = _16.sent(), supplierPayment_1 = _q[0], supplierShipping_1 = _q[1], supplier_1 = _q[2], pickMethods_1 = _q[3];
                if (supplierPayment_1.error)
                    throw supplierPayment_1.error;
                if (supplierShipping_1.error)
                    throw supplierShipping_1.error;
                if (supplier_1.error)
                    throw supplier_1.error;
                insertedPurchaseOrderId_1 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var purchaseOrderId, purchaseOrder, purchaseOrderLineInserts, itemIdsToActivate, supplierPartMap, supplierPartToItemInserts, supplierParts, supplierPartIdByItemId, _i, _a, line, spId, selectedLine, exchangeRate, conversionFactor, unitPriceInInventoryUnit, _b, supplierPartIdByItemId_1, _c, spId, bestTier;
                        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                        return __generator(this, function (_q) {
                            switch (_q.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "purchaseOrder", companyId_1)];
                                case 1:
                                    purchaseOrderId = _q.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("purchaseOrder")
                                            .values([
                                            {
                                                purchaseOrderId: purchaseOrderId,
                                                purchaseOrderType: quote_2.data.supplierQuoteType,
                                                supplierId: quote_2.data.supplierId,
                                                supplierContactId: quote_2.data.supplierContactId,
                                                supplierLocationId: quote_2.data.supplierLocationId,
                                                supplierReference: quote_2.data.supplierReference,
                                                supplierInteractionId: quote_2.data.supplierInteractionId,
                                                createdBy: userId_1,
                                                companyId: companyId_1,
                                                currencyCode: (_h = (_f = (_d = quote_2.data.currencyCode) !== null && _d !== void 0 ? _d : (_e = supplier_1.data) === null || _e === void 0 ? void 0 : _e.currencyCode) !== null && _f !== void 0 ? _f : (_g = company_2.data) === null || _g === void 0 ? void 0 : _g.baseCurrencyCode) !== null && _h !== void 0 ? _h : "USD",
                                                exchangeRate: (_j = quote_2.data.exchangeRate) !== null && _j !== void 0 ? _j : 1,
                                                exchangeRateUpdatedAt: (_k = quote_2.data.exchangeRateUpdatedAt) !== null && _k !== void 0 ? _k : new Date().toISOString(),
                                            },
                                        ])
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    purchaseOrder = _q.sent();
                                    if (!purchaseOrder.id) {
                                        throw new Error("purchase order is not created");
                                    }
                                    insertedPurchaseOrderId_1 = purchaseOrder.id;
                                    return [4 /*yield*/, Promise.all([
                                            trx
                                                .insertInto("purchaseOrderPayment")
                                                .values({
                                                id: insertedPurchaseOrderId_1,
                                                invoiceSupplierId: supplierPayment_1.data.invoiceSupplierId,
                                                invoiceSupplierContactId: supplierPayment_1.data.invoiceSupplierContactId,
                                                invoiceSupplierLocationId: supplierPayment_1.data.invoiceSupplierLocationId,
                                                paymentTermId: supplierPayment_1.data.paymentTermId,
                                                companyId: companyId_1,
                                            })
                                                .execute(),
                                            trx
                                                .insertInto("purchaseOrderDelivery")
                                                .values({
                                                id: insertedPurchaseOrderId_1,
                                                locationId: (_l = employeeJob_1.data) === null || _l === void 0 ? void 0 : _l.locationId,
                                                shippingMethodId: supplierShipping_1.data.shippingMethodId,
                                                shippingTermId: supplierShipping_1.data.shippingTermId,
                                                incoterm: supplierShipping_1.data.incoterm,
                                                incotermLocation: supplierShipping_1.data.incotermLocation,
                                                companyId: companyId_1,
                                            })
                                                .execute(),
                                        ])];
                                case 3:
                                    _q.sent();
                                    purchaseOrderLineInserts = quoteLines_2.data
                                        .filter(function (line) {
                                        return line.id &&
                                            selectedLines_2 &&
                                            line.id in selectedLines_2 &&
                                            selectedLines_2[line.id].quantity > 0;
                                    })
                                        .map(function (line) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        var isIndirect = line.supplierQuoteLineType === "G/L Account";
                                        return {
                                            purchaseOrderId: insertedPurchaseOrderId_1,
                                            purchaseOrderLineType: isIndirect
                                                ? "G/L Account"
                                                : (_a = line.item) === null || _a === void 0 ? void 0 : _a.type,
                                            description: line.description,
                                            itemId: isIndirect ? null : line.itemId,
                                            accountId: isIndirect ? line.accountId : null,
                                            costCenterId: isIndirect ? line.costCenterId : null,
                                            locationId: isIndirect ? null : (_b = employeeJob_1.data) === null || _b === void 0 ? void 0 : _b.locationId,
                                            storageUnitId: (_e = (_d = (_c = pickMethods_1.data) === null || _c === void 0 ? void 0 : _c.find(function (method) { return method.itemId === line.itemId; })) === null || _d === void 0 ? void 0 : _d.defaultStorageUnitId) !== null && _e !== void 0 ? _e : null,
                                            exchangeRate: (_f = quote_2.data.exchangeRate) !== null && _f !== void 0 ? _f : 1,
                                            conversionFactor: line.conversionFactor,
                                            internalNotes: line.internalNotes,
                                            externalNotes: line.externalNotes,
                                            purchaseQuantity: selectedLines_2[line.id].quantity,
                                            inventoryUnitOfMeasureCode: line.inventoryUnitOfMeasureCode,
                                            purchaseUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                                            supplierUnitPrice: selectedLines_2[line.id].supplierUnitPrice,
                                            supplierShippingCost: selectedLines_2[line.id].supplierShippingCost,
                                            supplierTaxAmount: selectedLines_2[line.id].supplierTaxAmount,
                                            sortOrder: (_g = line.sortOrder) !== null && _g !== void 0 ? _g : 1,
                                            createdBy: userId_1,
                                            companyId: companyId_1,
                                        };
                                    });
                                    if (!(purchaseOrderLineInserts.length > 0)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, trx
                                            .insertInto("purchaseOrderLine")
                                            .values(purchaseOrderLineInserts)
                                            .execute()];
                                case 4:
                                    _q.sent();
                                    itemIdsToActivate = purchaseOrderLineInserts
                                        .map(function (insert) { return insert.itemId; })
                                        .filter(function (id) { return !!id; });
                                    if (!(itemIdsToActivate.length > 0)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, trx
                                            .updateTable("item")
                                            .set({ active: true })
                                            .where("id", "in", itemIdsToActivate)
                                            .execute()];
                                case 5:
                                    _q.sent();
                                    _q.label = 6;
                                case 6:
                                    supplierPartMap = new Map();
                                    quoteLines_2.data
                                        .filter(function (line) {
                                        return !!line.itemId &&
                                            line.id &&
                                            selectedLines_2 &&
                                            line.id in selectedLines_2;
                                    })
                                        .forEach(function (line) {
                                        var _a, _b, _c;
                                        var key = "".concat(line.itemId, "-").concat(quote_2.data.supplierId);
                                        var selectedLine = selectedLines_2[line.id];
                                        var exchangeRate = (_a = quote_2.data.exchangeRate) !== null && _a !== void 0 ? _a : 1;
                                        var unitPriceInInventoryUnit = (selectedLine.supplierUnitPrice /
                                            (exchangeRate === 0 ? 1 : exchangeRate)) /
                                            ((_b = line.conversionFactor) !== null && _b !== void 0 ? _b : 1);
                                        supplierPartMap.set(key, {
                                            companyId: companyId_1,
                                            supplierId: (_c = quote_2.data) === null || _c === void 0 ? void 0 : _c.supplierId,
                                            supplierPartId: line.supplierPartId,
                                            supplierUnitOfMeasureCode: line.purchaseUnitOfMeasureCode,
                                            conversionFactor: line.conversionFactor,
                                            itemId: line.itemId,
                                            createdBy: userId_1,
                                            unitPrice: unitPriceInInventoryUnit,
                                        });
                                    });
                                    supplierPartToItemInserts = Array.from(supplierPartMap.values());
                                    if (!(supplierPartToItemInserts.length > 0)) return [3 /*break*/, 17];
                                    return [4 /*yield*/, trx
                                            .insertInto("supplierPart")
                                            .values(supplierPartToItemInserts)
                                            .onConflict(function (oc) {
                                            return oc
                                                .columns(["itemId", "supplierId", "companyId"])
                                                .doUpdateSet(function (eb) { return ({
                                                supplierPartId: eb.ref("excluded.supplierPartId"),
                                                unitPrice: eb.ref("excluded.unitPrice"),
                                            }); });
                                        })
                                            .execute()];
                                case 7:
                                    _q.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("supplierPart")
                                            .select(["id", "itemId"])
                                            .where("supplierId", "=", quote_2.data.supplierId)
                                            .where("companyId", "=", companyId_1)
                                            .where("itemId", "in", supplierPartToItemInserts.map(function (i) { return i.itemId; }))
                                            .execute()];
                                case 8:
                                    supplierParts = _q.sent();
                                    supplierPartIdByItemId = new Map(supplierParts.map(function (sp) { return [sp.itemId, sp.id]; }));
                                    _i = 0, _a = quoteLines_2.data.filter(function (l) {
                                        return !!l.itemId &&
                                            l.id &&
                                            selectedLines_2 &&
                                            l.id in selectedLines_2;
                                    });
                                    _q.label = 9;
                                case 9:
                                    if (!(_i < _a.length)) return [3 /*break*/, 12];
                                    line = _a[_i];
                                    spId = supplierPartIdByItemId.get(line.itemId);
                                    if (!spId)
                                        return [3 /*break*/, 11];
                                    selectedLine = selectedLines_2[line.id];
                                    exchangeRate = (_m = quote_2.data.exchangeRate) !== null && _m !== void 0 ? _m : 1;
                                    conversionFactor = (_o = line.conversionFactor) !== null && _o !== void 0 ? _o : 1;
                                    unitPriceInInventoryUnit = (selectedLine.supplierUnitPrice /
                                        (exchangeRate === 0 ? 1 : exchangeRate)) /
                                        conversionFactor;
                                    return [4 /*yield*/, trx
                                            .insertInto("supplierPartPrice")
                                            .values({
                                            supplierPartId: spId,
                                            quantity: selectedLine.quantity,
                                            unitPrice: unitPriceInInventoryUnit,
                                            leadTime: (_p = selectedLine.leadTime) !== null && _p !== void 0 ? _p : 0,
                                            sourceType: "Purchase Order",
                                            sourceDocumentId: insertedPurchaseOrderId_1,
                                            companyId: companyId_1,
                                            createdBy: userId_1,
                                            updatedBy: userId_1,
                                            updatedAt: new Date().toISOString(),
                                        })
                                            .onConflict(function (oc) {
                                            return oc
                                                .columns(["supplierPartId", "quantity"])
                                                .doUpdateSet(function (eb) { return ({
                                                unitPrice: eb.ref("excluded.unitPrice"),
                                                leadTime: eb.ref("excluded.leadTime"),
                                                sourceType: eb.ref("excluded.sourceType"),
                                                sourceDocumentId: eb.ref("excluded.sourceDocumentId"),
                                                updatedBy: eb.ref("excluded.updatedBy"),
                                                updatedAt: eb.ref("excluded.updatedAt"),
                                            }); });
                                        })
                                            .execute()];
                                case 10:
                                    _q.sent();
                                    _q.label = 11;
                                case 11:
                                    _i++;
                                    return [3 /*break*/, 9];
                                case 12:
                                    _b = 0, supplierPartIdByItemId_1 = supplierPartIdByItemId;
                                    _q.label = 13;
                                case 13:
                                    if (!(_b < supplierPartIdByItemId_1.length)) return [3 /*break*/, 17];
                                    _c = supplierPartIdByItemId_1[_b], spId = _c[1];
                                    return [4 /*yield*/, trx
                                            .selectFrom("supplierPartPrice")
                                            .select(["unitPrice", "quantity"])
                                            .where("supplierPartId", "=", spId)
                                            .orderBy("unitPrice", "asc")
                                            .executeTakeFirst()];
                                case 14:
                                    bestTier = _q.sent();
                                    if (!bestTier) return [3 /*break*/, 16];
                                    return [4 /*yield*/, trx
                                            .updateTable("supplierPart")
                                            .set({
                                            unitPrice: Number(bestTier.unitPrice),
                                            minimumOrderQuantity: Number(bestTier.quantity),
                                        })
                                            .where("id", "=", spId)
                                            .execute()];
                                case 15:
                                    _q.sent();
                                    _q.label = 16;
                                case 16:
                                    _b++;
                                    return [3 /*break*/, 13];
                                case 17: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 33:
                _16.sent();
                if (!insertedPurchaseOrderId_1) {
                    throw new Error("Failed to insert purchase order");
                }
                return [4 /*yield*/, client_1
                        .from("purchasingRfqToSupplierQuote")
                        .select("purchasingRfqId")
                        .eq("supplierQuoteId", id_1)];
            case 34:
                linkedRfqs = (_16.sent()).data;
                if (!(linkedRfqs && linkedRfqs.length > 0)) return [3 /*break*/, 36];
                return [4 /*yield*/, client_1.from("purchasingRfqToPurchaseOrder").insert(linkedRfqs.map(function (rfq) { return ({
                        purchasingRfqId: rfq.purchasingRfqId,
                        purchaseOrderId: insertedPurchaseOrderId_1,
                        companyId: companyId_1,
                    }); }))];
            case 35:
                _16.sent();
                _16.label = 36;
            case 36:
                convertedId = insertedPurchaseOrderId_1;
                return [3 /*break*/, 44];
            case 37:
                warehouseTransferId_1 = id_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", warehouseTransferId_1)
                            .single(),
                        client_1
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", warehouseTransferId_1),
                    ])];
            case 38:
                _r = _16.sent(), warehouseTransfer_1 = _r[0], warehouseTransferLines_1 = _r[1];
                if (warehouseTransfer_1.error)
                    throw new Error(warehouseTransfer_1.error.message);
                if (warehouseTransferLines_1.error)
                    throw new Error(warehouseTransferLines_1.error.message);
                shipmentId_2 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var shipment, shipmentLineInserts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "shipment", companyId_1)];
                                case 1:
                                    // Create shipment for outbound transfer
                                    shipmentId_2 = _a.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("shipment")
                                            .values({
                                            shipmentId: shipmentId_2,
                                            status: "Draft",
                                            sourceDocument: "Outbound Transfer",
                                            sourceDocumentId: warehouseTransferId_1,
                                            sourceDocumentReadableId: warehouseTransfer_1.data.transferId,
                                            locationId: warehouseTransfer_1.data.fromLocationId,
                                            createdBy: userId_1,
                                            companyId: companyId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    shipment = _a.sent();
                                    if (!shipment.id)
                                        throw new Error("Failed to create shipment");
                                    shipmentId_2 = shipment.id;
                                    shipmentLineInserts = warehouseTransferLines_1.data.map(function (line) { return ({
                                        shipmentId: shipmentId_2,
                                        lineId: line.id,
                                        itemId: line.itemId,
                                        locationId: line.fromLocationId,
                                        storageUnitId: line.fromStorageUnitId,
                                        orderQuantity: line.quantity,
                                        shippedQuantity: 0,
                                        unitOfMeasure: line.unitOfMeasureCode || "EA",
                                        unitPrice: 0,
                                        companyId: companyId_1,
                                        createdBy: userId_1,
                                    }); });
                                    if (!(shipmentLineInserts.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx
                                            .insertInto("shipmentLine")
                                            .values(shipmentLineInserts)
                                            .execute()];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 39:
                _16.sent();
                convertedId = shipmentId_2;
                return [3 /*break*/, 44];
            case 40:
                warehouseTransferId_2 = id_1;
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("warehouseTransfer")
                            .select("*")
                            .eq("id", warehouseTransferId_2)
                            .single(),
                        client_1
                            .from("warehouseTransferLine")
                            .select("*")
                            .eq("transferId", warehouseTransferId_2),
                    ])];
            case 41:
                _s = _16.sent(), warehouseTransfer_2 = _s[0], warehouseTransferLines_2 = _s[1];
                if (warehouseTransfer_2.error)
                    throw new Error(warehouseTransfer_2.error.message);
                if (warehouseTransferLines_2.error)
                    throw new Error(warehouseTransferLines_2.error.message);
                receiptId_1 = "";
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var receipt, receiptLineInserts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "receipt", companyId_1)];
                                case 1:
                                    // Create receipt for inbound transfer
                                    receiptId_1 = _a.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("receipt")
                                            .values({
                                            receiptId: receiptId_1,
                                            status: "Draft",
                                            sourceDocument: "Inbound Transfer",
                                            sourceDocumentId: warehouseTransferId_2,
                                            sourceDocumentReadableId: warehouseTransfer_2.data.transferId,
                                            locationId: warehouseTransfer_2.data.toLocationId,
                                            createdBy: userId_1,
                                            companyId: companyId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    receipt = _a.sent();
                                    if (!receipt.id)
                                        throw new Error("Failed to create receipt");
                                    receiptId_1 = receipt.id;
                                    receiptLineInserts = warehouseTransferLines_2.data.map(function (line) { return ({
                                        receiptId: receiptId_1,
                                        lineId: line.id,
                                        itemId: line.itemId,
                                        locationId: line.toLocationId,
                                        storageUnitId: line.toStorageUnitId,
                                        orderQuantity: line.quantity,
                                        receivedQuantity: 0,
                                        unitOfMeasure: line.unitOfMeasureCode || "EA",
                                        unitPrice: 0,
                                        companyId: companyId_1,
                                        createdBy: userId_1,
                                    }); });
                                    if (!(receiptLineInserts.length > 0)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, trx
                                            .insertInto("receiptLine")
                                            .values(receiptLineInserts)
                                            .execute()];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 42:
                _16.sent();
                convertedId = receiptId_1;
                return [3 /*break*/, 44];
            case 43: throw new Error("Invalid type  ".concat(type));
            case 44: return [2 /*return*/, new Response(JSON.stringify({
                    convertedId: convertedId,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 45:
                err_1 = _16.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 46: return [2 /*return*/];
        }
    });
}); });
