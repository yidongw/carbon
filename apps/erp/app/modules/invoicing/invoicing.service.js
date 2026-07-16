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
exports.createPurchaseInvoiceFromPurchaseOrder = createPurchaseInvoiceFromPurchaseOrder;
exports.createSalesInvoiceFromSalesOrder = createSalesInvoiceFromSalesOrder;
exports.createSalesInvoiceFromShipment = createSalesInvoiceFromShipment;
exports.deletePurchaseInvoice = deletePurchaseInvoice;
exports.deletePurchaseInvoiceLine = deletePurchaseInvoiceLine;
exports.deleteSalesInvoice = deleteSalesInvoice;
exports.deleteSalesInvoiceLine = deleteSalesInvoiceLine;
exports.getPurchaseInvoice = getPurchaseInvoice;
exports.getPurchaseInvoices = getPurchaseInvoices;
exports.getPurchaseInvoiceDelivery = getPurchaseInvoiceDelivery;
exports.getPurchaseInvoiceLines = getPurchaseInvoiceLines;
exports.getPurchaseInvoiceLine = getPurchaseInvoiceLine;
exports.getSalesInvoice = getSalesInvoice;
exports.getSalesInvoiceCustomerDetails = getSalesInvoiceCustomerDetails;
exports.getSalesInvoices = getSalesInvoices;
exports.getSalesInvoiceShipment = getSalesInvoiceShipment;
exports.getSalesInvoiceLines = getSalesInvoiceLines;
exports.getSalesInvoiceLine = getSalesInvoiceLine;
exports.updatePurchaseInvoiceExchangeRate = updatePurchaseInvoiceExchangeRate;
exports.updatePurchaseInvoiceStatus = updatePurchaseInvoiceStatus;
exports.updateSalesInvoiceExchangeRate = updateSalesInvoiceExchangeRate;
exports.updateSalesInvoiceStatus = updateSalesInvoiceStatus;
exports.insertPurchaseInvoice = insertPurchaseInvoice;
exports.updatePurchaseInvoice = updatePurchaseInvoice;
exports.upsertPurchaseInvoice = upsertPurchaseInvoice;
exports.upsertPurchaseInvoiceDelivery = upsertPurchaseInvoiceDelivery;
exports.upsertPurchaseInvoiceLine = upsertPurchaseInvoiceLine;
exports.updatePurchaseInvoiceLineOrder = updatePurchaseInvoiceLineOrder;
exports.insertSalesInvoice = insertSalesInvoice;
exports.updateSalesInvoice = updateSalesInvoice;
exports.upsertSalesInvoice = upsertSalesInvoice;
exports.upsertSalesInvoiceShipment = upsertSalesInvoiceShipment;
exports.upsertSalesInvoiceLine = upsertSalesInvoiceLine;
exports.updateSalesInvoiceLineOrder = updateSalesInvoiceLineOrder;
var date_1 = require("@internationalized/date");
var purchasing_1 = require("~/modules/purchasing");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var accounting_service_1 = require("../accounting/accounting.service");
var people_service_1 = require("../people/people.service");
var sales_service_1 = require("../sales/sales.service");
function createPurchaseInvoiceFromPurchaseOrder(client, purchaseOrderId, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: {
                        type: "purchaseOrderToPurchaseInvoice",
                        id: purchaseOrderId,
                        companyId: companyId,
                        userId: userId
                    }
                })];
        });
    });
}
function createSalesInvoiceFromSalesOrder(client, salesOrderId, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: {
                        type: "salesOrderToSalesInvoice",
                        id: salesOrderId,
                        companyId: companyId,
                        userId: userId
                    }
                })];
        });
    });
}
function createSalesInvoiceFromShipment(client, shipmentId, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("convert", {
                    body: {
                        type: "shipmentToSalesInvoice",
                        id: shipmentId,
                        companyId: companyId,
                        userId: userId
                    }
                })];
        });
    });
}
function deletePurchaseInvoice(client, purchaseInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        var invoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .select("id, status")
                        .eq("id", purchaseInvoiceId)
                        .single()];
                case 1:
                    invoice = _a.sent();
                    if (invoice.error) {
                        return [2 /*return*/, invoice];
                    }
                    if (invoice.data.status !== "Draft") {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Cannot delete purchase invoice with status \"".concat(invoice.data.status, "\". Only Draft invoices can be deleted."),
                                    code: "INVOICE_NOT_DRAFT"
                                }
                            }];
                    }
                    return [2 /*return*/, client.from("purchaseInvoice").delete().eq("id", purchaseInvoiceId)];
            }
        });
    });
}
function deletePurchaseInvoiceLine(client, purchaseInvoiceLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseInvoiceLine")
                    .delete()
                    .eq("id", purchaseInvoiceLineId)];
        });
    });
}
function deleteSalesInvoice(client, salesInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        var invoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("salesInvoice")
                        .select("id, status")
                        .eq("id", salesInvoiceId)
                        .single()];
                case 1:
                    invoice = _a.sent();
                    if (invoice.error) {
                        return [2 /*return*/, invoice];
                    }
                    if (invoice.data.status !== "Draft") {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Cannot delete sales invoice with status \"".concat(invoice.data.status, "\". Only Draft invoices can be deleted."),
                                    code: "INVOICE_NOT_DRAFT"
                                }
                            }];
                    }
                    return [2 /*return*/, client.from("salesInvoice").delete().eq("id", salesInvoiceId)];
            }
        });
    });
}
function deleteSalesInvoiceLine(client, salesInvoiceLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("salesInvoiceLine").delete().eq("id", salesInvoiceLineId)];
        });
    });
}
function getPurchaseInvoice(client, purchaseInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseInvoices")
                    .select("*")
                    .eq("id", purchaseInvoiceId)
                    .single()];
        });
    });
}
function getPurchaseInvoices(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("purchaseInvoices")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("invoiceId", "%".concat(args.search, "%"));
            }
            if (args.supplierId) {
                query = query.eq("supplierId", args.supplierId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "invoiceId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getPurchaseInvoiceDelivery(client, purchaseInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseInvoiceDelivery")
                    .select("*")
                    .eq("id", purchaseInvoiceId)
                    .single()];
        });
    });
}
function getPurchaseInvoiceLines(client, purchaseInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseInvoiceLines")
                    .select("*")
                    .eq("invoiceId", purchaseInvoiceId)
                    .order("sortOrder", { ascending: true })
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getPurchaseInvoiceLine(client, purchaseInvoiceLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseInvoiceLine")
                    .select("*")
                    .eq("id", purchaseInvoiceLineId)
                    .single()];
        });
    });
}
function getSalesInvoice(client, salesInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoices")
                    .select("*")
                    .eq("id", salesInvoiceId)
                    .single()];
        });
    });
}
function getSalesInvoiceCustomerDetails(client, salesInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoiceLocations")
                    .select("*")
                    .eq("id", salesInvoiceId)
                    .single()];
        });
    });
}
function getSalesInvoices(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("salesInvoices")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("invoiceId", "%".concat(args.search, "%"));
            }
            if (args.customerId) {
                query = query.eq("customerId", args.customerId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "invoiceId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getSalesInvoiceShipment(client, salesInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoiceShipment")
                    .select("*")
                    .eq("id", salesInvoiceId)
                    .single()];
        });
    });
}
function getSalesInvoiceLines(client, salesInvoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoiceLines")
                    .select("*")
                    .eq("invoiceId", salesInvoiceId)
                    .order("sortOrder", { ascending: true })
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getSalesInvoiceLine(client, salesInvoiceLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("salesInvoiceLine")
                    .select("*")
                    .eq("id", salesInvoiceLineId)
                    .single()];
        });
    });
}
function updatePurchaseInvoiceExchangeRate(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        return __generator(this, function (_a) {
            update = {
                id: data.id,
                exchangeRate: data.exchangeRate,
                exchangeRateUpdatedAt: new Date().toISOString()
            };
            return [2 /*return*/, client.from("purchaseInvoice").update(update).eq("id", update.id)];
        });
    });
}
function updatePurchaseInvoiceStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        var status, rest, updateData;
        return __generator(this, function (_a) {
            status = update.status, rest = __rest(update, ["status"]);
            updateData = __assign(__assign({ status: status }, rest), (["Paid"].includes(status)
                ? { datePaid: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() }
                : {}));
            return [2 /*return*/, client.from("purchaseInvoice").update(updateData).eq("id", update.id)];
        });
    });
}
function updateSalesInvoiceExchangeRate(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        return __generator(this, function (_a) {
            update = {
                id: data.id,
                exchangeRate: data.exchangeRate,
                exchangeRateUpdatedAt: new Date().toISOString()
            };
            return [2 /*return*/, client.from("salesInvoice").update(update).eq("id", update.id)];
        });
    });
}
function updateSalesInvoiceStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        var status, rest, updateData;
        return __generator(this, function (_a) {
            status = update.status, rest = __rest(update, ["status"]);
            updateData = __assign(__assign({ status: status }, rest), (["Paid"].includes(status)
                ? { datePaid: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString() }
                : {}));
            return [2 /*return*/, client.from("salesInvoice").update(updateData).eq("id", update.id)];
        });
    });
}
function insertPurchaseInvoice(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var invoiceId, seq, _a, supplierInteraction, supplierPayment, supplierShipping, purchaser, _b, paymentTermId, invoiceSupplierId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, exchangeRate, exchangeRateUpdatedAt, currency, locationId, invoice, delivery;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    if (!input.invoiceId) return [3 /*break*/, 1];
                    invoiceId = input.invoiceId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "purchaseInvoice",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _w.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_d = seq.error) !== null && _d !== void 0 ? _d : {
                                    message: "Failed to generate purchaseInvoice sequence"
                                }
                            }];
                    }
                    invoiceId = seq.data;
                    _w.label = 3;
                case 3: return [4 /*yield*/, Promise.all([
                        (0, purchasing_1.insertSupplierInteraction)(client, input.companyId, input.supplierId),
                        (0, purchasing_1.getSupplierPayment)(client, input.supplierId),
                        (0, purchasing_1.getSupplierShipping)(client, input.supplierId),
                        (0, people_service_1.getEmployeeJob)(client, input.createdBy, input.companyId)
                    ])];
                case 4:
                    _a = _w.sent(), supplierInteraction = _a[0], supplierPayment = _a[1], supplierShipping = _a[2], purchaser = _a[3];
                    if (supplierInteraction.error)
                        return [2 /*return*/, { data: null, error: supplierInteraction.error }];
                    if (supplierPayment.error)
                        return [2 /*return*/, { data: null, error: supplierPayment.error }];
                    if (supplierShipping.error)
                        return [2 /*return*/, { data: null, error: supplierShipping.error }];
                    _b = supplierPayment.data, paymentTermId = _b.paymentTermId, invoiceSupplierId = _b.invoiceSupplierId;
                    _c = supplierShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    exchangeRate = (_e = input.exchangeRate) !== null && _e !== void 0 ? _e : 1;
                    exchangeRateUpdatedAt = (_f = input.exchangeRateUpdatedAt) !== null && _f !== void 0 ? _f : new Date().toISOString();
                    if (!input.currencyCode) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, input.companyGroupId, input.currencyCode)];
                case 5:
                    currency = _w.sent();
                    if (currency.data) {
                        exchangeRate = (_g = currency.data.exchangeRate) !== null && _g !== void 0 ? _g : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _w.label = 6;
                case 6:
                    locationId = (_k = (_h = input.locationId) !== null && _h !== void 0 ? _h : (_j = purchaser === null || purchaser === void 0 ? void 0 : purchaser.data) === null || _j === void 0 ? void 0 : _j.locationId) !== null && _k !== void 0 ? _k : null;
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .insert({
                            invoiceId: invoiceId,
                            supplierId: input.supplierId,
                            supplierReference: (_l = input.supplierReference) !== null && _l !== void 0 ? _l : null,
                            invoiceSupplierId: (_o = (_m = input.invoiceSupplierId) !== null && _m !== void 0 ? _m : invoiceSupplierId) !== null && _o !== void 0 ? _o : input.supplierId,
                            invoiceSupplierContactId: (_p = input.invoiceSupplierContactId) !== null && _p !== void 0 ? _p : null,
                            invoiceSupplierLocationId: (_q = input.invoiceSupplierLocationId) !== null && _q !== void 0 ? _q : null,
                            supplierInteractionId: (_r = supplierInteraction.data) === null || _r === void 0 ? void 0 : _r.id,
                            currencyCode: (_s = input.currencyCode) !== null && _s !== void 0 ? _s : "USD",
                            exchangeRate: exchangeRate,
                            exchangeRateUpdatedAt: exchangeRateUpdatedAt,
                            paymentTermId: (_t = input.paymentTermId) !== null && _t !== void 0 ? _t : paymentTermId,
                            dateIssued: (_u = input.dateIssued) !== null && _u !== void 0 ? _u : (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            dateDue: (_v = input.dateDue) !== null && _v !== void 0 ? _v : null,
                            locationId: locationId,
                            customFields: input.customFields,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, invoiceId")
                            .single()];
                case 7:
                    invoice = _w.sent();
                    if (invoice.error)
                        return [2 /*return*/, { data: null, error: invoice.error }];
                    return [4 /*yield*/, client.from("purchaseInvoiceDelivery").insert({
                            id: invoice.data.id,
                            locationId: locationId,
                            shippingMethodId: shippingMethodId,
                            shippingTermId: shippingTermId,
                            incoterm: incoterm,
                            incotermLocation: incotermLocation,
                            companyId: input.companyId
                        })];
                case 8:
                    delivery = _w.sent();
                    if (!delivery.error) return [3 /*break*/, 10];
                    return [4 /*yield*/, client.from("purchaseInvoice").delete().eq("id", invoice.data.id)];
                case 9:
                    _w.sent();
                    return [2 /*return*/, { data: null, error: delivery.error }];
                case 10: return [2 /*return*/, {
                        data: { id: invoice.data.id, invoiceId: invoice.data.invoiceId },
                        error: null
                    }];
            }
        });
    });
}
function updatePurchaseInvoice(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = input.id, rest = __rest(input, ["id"]);
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .update(__assign(__assign({}, (0, supabase_1.sanitize)(rest)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                            .eq("id", id)
                            .select("id")
                            .single()];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    return [2 /*return*/, { data: { id: result.data.id }, error: null }];
            }
        });
    });
}
/** @deprecated Use insertPurchaseInvoice for new invoices, updatePurchaseInvoice for existing invoices */
function upsertPurchaseInvoice(client, purchaseInvoice) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, supplierInteraction, supplierPayment, supplierShipping, purchaser, _b, paymentTermId, invoiceSupplierId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, currency, locationId, _companyGroupId, purchaseInvoiceData, invoice, invoiceId, delivery;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if ("id" in purchaseInvoice) {
                        return [2 /*return*/, client
                                .from("purchaseInvoice")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(purchaseInvoice)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", purchaseInvoice.id)
                                .select("id, invoiceId")];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.insertSupplierInteraction)(client, purchaseInvoice.companyId, purchaseInvoice.supplierId),
                            (0, purchasing_1.getSupplierPayment)(client, purchaseInvoice.supplierId),
                            (0, purchasing_1.getSupplierShipping)(client, purchaseInvoice.supplierId),
                            (0, people_service_1.getEmployeeJob)(client, purchaseInvoice.createdBy, purchaseInvoice.companyId)
                        ])];
                case 1:
                    _a = _l.sent(), supplierInteraction = _a[0], supplierPayment = _a[1], supplierShipping = _a[2], purchaser = _a[3];
                    if (supplierInteraction.error)
                        return [2 /*return*/, supplierInteraction];
                    if (supplierPayment.error)
                        return [2 /*return*/, supplierPayment];
                    if (supplierShipping.error)
                        return [2 /*return*/, supplierShipping];
                    _b = supplierPayment.data, paymentTermId = _b.paymentTermId, invoiceSupplierId = _b.invoiceSupplierId;
                    _c = supplierShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    if (!purchaseInvoice.currencyCode) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, purchaseInvoice.companyGroupId, purchaseInvoice.currencyCode)];
                case 2:
                    currency = _l.sent();
                    if (currency.data) {
                        purchaseInvoice.exchangeRate = (_d = currency.data.exchangeRate) !== null && _d !== void 0 ? _d : undefined;
                        purchaseInvoice.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    purchaseInvoice.exchangeRate = 1;
                    purchaseInvoice.exchangeRateUpdatedAt = new Date().toISOString();
                    _l.label = 4;
                case 4:
                    locationId = (_g = (_e = purchaseInvoice.locationId) !== null && _e !== void 0 ? _e : (_f = purchaser === null || purchaser === void 0 ? void 0 : purchaser.data) === null || _f === void 0 ? void 0 : _f.locationId) !== null && _g !== void 0 ? _g : null;
                    _companyGroupId = purchaseInvoice.companyGroupId, purchaseInvoiceData = __rest(purchaseInvoice, ["companyGroupId"]);
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .insert([
                            __assign(__assign({}, purchaseInvoiceData), { invoiceSupplierId: invoiceSupplierId !== null && invoiceSupplierId !== void 0 ? invoiceSupplierId : purchaseInvoice.supplierId, supplierInteractionId: (_h = supplierInteraction.data) === null || _h === void 0 ? void 0 : _h.id, currencyCode: (_j = purchaseInvoice.currencyCode) !== null && _j !== void 0 ? _j : "USD", paymentTermId: (_k = purchaseInvoice.paymentTermId) !== null && _k !== void 0 ? _k : paymentTermId })
                        ])
                            .select("id, invoiceId")];
                case 5:
                    invoice = _l.sent();
                    if (invoice.error)
                        return [2 /*return*/, invoice];
                    invoiceId = invoice.data[0].id;
                    return [4 /*yield*/, client.from("purchaseInvoiceDelivery").insert([
                            {
                                id: invoiceId,
                                locationId: locationId,
                                shippingMethodId: shippingMethodId,
                                shippingTermId: shippingTermId,
                                incoterm: incoterm,
                                incotermLocation: incotermLocation,
                                companyId: purchaseInvoice.companyId
                            }
                        ])];
                case 6:
                    delivery = _l.sent();
                    if (!delivery.error) return [3 /*break*/, 8];
                    return [4 /*yield*/, client.from("purchaseInvoice").delete().eq("id", invoiceId)];
                case 7:
                    _l.sent();
                    return [2 /*return*/, delivery];
                case 8: return [2 /*return*/, invoice];
            }
        });
    });
}
function upsertPurchaseInvoiceDelivery(client, purchaseInvoiceDelivery) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in purchaseInvoiceDelivery) {
                return [2 /*return*/, client
                        .from("purchaseInvoiceDelivery")
                        .update((0, supabase_1.sanitize)(purchaseInvoiceDelivery))
                        .eq("id", purchaseInvoiceDelivery.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("purchaseInvoiceDelivery")
                    .insert([purchaseInvoiceDelivery])
                    .select("id")
                    .single()];
        });
    });
}
function upsertPurchaseInvoiceLine(client, purchaseInvoiceLine) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, maxSortOrder;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ("id" in purchaseInvoiceLine) {
                        return [2 /*return*/, client
                                .from("purchaseInvoiceLine")
                                .update((0, supabase_1.sanitize)(purchaseInvoiceLine))
                                .eq("id", purchaseInvoiceLine.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("purchaseInvoiceLine")
                            .select("sortOrder")
                            .eq("invoiceId", purchaseInvoiceLine.invoiceId)];
                case 1:
                    existing = _b.sent();
                    maxSortOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("purchaseInvoiceLine")
                            .insert([__assign(__assign({}, purchaseInvoiceLine), { sortOrder: maxSortOrder + 1 })])
                            .select("id")
                            .single()];
            }
        });
    });
}
function updatePurchaseInvoiceLineOrder(db, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, updates_1, _a, id, sortOrder, updatedBy;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, updates_1 = updates;
                                _b.label = 1;
                            case 1:
                                if (!(_i < updates_1.length)) return [3 /*break*/, 4];
                                _a = updates_1[_i], id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                                return [4 /*yield*/, trx
                                        .updateTable("purchaseInvoiceLine")
                                        .set({ sortOrder: sortOrder, updatedBy: updatedBy })
                                        .where("id", "=", id)
                                        .execute()];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function insertSalesInvoice(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var invoiceId, seq, _a, opportunity, customerPayment, customerShipping, salesPerson, _b, paymentTermId, invoiceCustomerId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, exchangeRate, exchangeRateUpdatedAt, currency, locationId, invoice, delivery;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    if (!input.invoiceId) return [3 /*break*/, 1];
                    invoiceId = input.invoiceId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "salesInvoice",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _w.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_d = seq.error) !== null && _d !== void 0 ? _d : {
                                    message: "Failed to generate salesInvoice sequence"
                                }
                            }];
                    }
                    invoiceId = seq.data;
                    _w.label = 3;
                case 3: return [4 /*yield*/, Promise.all([
                        client
                            .from("opportunity")
                            .insert({
                            companyId: input.companyId,
                            customerId: input.customerId
                        })
                            .select("id")
                            .single(),
                        (0, sales_service_1.getCustomerPayment)(client, input.customerId),
                        (0, sales_service_1.getCustomerShipping)(client, input.customerId),
                        (0, people_service_1.getEmployeeJob)(client, input.createdBy, input.companyId)
                    ])];
                case 4:
                    _a = _w.sent(), opportunity = _a[0], customerPayment = _a[1], customerShipping = _a[2], salesPerson = _a[3];
                    if (opportunity.error)
                        return [2 /*return*/, { data: null, error: opportunity.error }];
                    if (customerPayment.error)
                        return [2 /*return*/, { data: null, error: customerPayment.error }];
                    if (customerShipping.error)
                        return [2 /*return*/, { data: null, error: customerShipping.error }];
                    _b = customerPayment.data, paymentTermId = _b.paymentTermId, invoiceCustomerId = _b.invoiceCustomerId;
                    _c = customerShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    exchangeRate = (_e = input.exchangeRate) !== null && _e !== void 0 ? _e : 1;
                    exchangeRateUpdatedAt = (_f = input.exchangeRateUpdatedAt) !== null && _f !== void 0 ? _f : new Date().toISOString();
                    if (!input.currencyCode) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, input.companyGroupId, input.currencyCode)];
                case 5:
                    currency = _w.sent();
                    if (currency.data) {
                        exchangeRate = (_g = currency.data.exchangeRate) !== null && _g !== void 0 ? _g : 1;
                        exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    _w.label = 6;
                case 6:
                    locationId = (_k = (_h = input.locationId) !== null && _h !== void 0 ? _h : (_j = salesPerson === null || salesPerson === void 0 ? void 0 : salesPerson.data) === null || _j === void 0 ? void 0 : _j.locationId) !== null && _k !== void 0 ? _k : null;
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .insert({
                            invoiceId: invoiceId,
                            customerId: input.customerId,
                            customerReference: (_l = input.customerReference) !== null && _l !== void 0 ? _l : null,
                            invoiceCustomerId: (_o = (_m = input.invoiceCustomerId) !== null && _m !== void 0 ? _m : invoiceCustomerId) !== null && _o !== void 0 ? _o : input.customerId,
                            invoiceCustomerContactId: (_p = input.invoiceCustomerContactId) !== null && _p !== void 0 ? _p : null,
                            invoiceCustomerLocationId: (_q = input.invoiceCustomerLocationId) !== null && _q !== void 0 ? _q : null,
                            opportunityId: (_r = opportunity.data) === null || _r === void 0 ? void 0 : _r.id,
                            currencyCode: (_s = input.currencyCode) !== null && _s !== void 0 ? _s : "USD",
                            exchangeRate: exchangeRate,
                            exchangeRateUpdatedAt: exchangeRateUpdatedAt,
                            paymentTermId: (_t = input.paymentTermId) !== null && _t !== void 0 ? _t : paymentTermId,
                            dateIssued: (_u = input.dateIssued) !== null && _u !== void 0 ? _u : (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            dateDue: (_v = input.dateDue) !== null && _v !== void 0 ? _v : null,
                            locationId: locationId,
                            customFields: input.customFields,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id, invoiceId")
                            .single()];
                case 7:
                    invoice = _w.sent();
                    if (invoice.error)
                        return [2 /*return*/, { data: null, error: invoice.error }];
                    return [4 /*yield*/, client.from("salesInvoiceShipment").insert({
                            id: invoice.data.id,
                            locationId: locationId,
                            shippingMethodId: shippingMethodId,
                            shippingTermId: shippingTermId,
                            incoterm: incoterm,
                            incotermLocation: incotermLocation,
                            companyId: input.companyId,
                            createdBy: input.createdBy
                        })];
                case 8:
                    delivery = _w.sent();
                    if (!delivery.error) return [3 /*break*/, 10];
                    return [4 /*yield*/, client.from("salesInvoice").delete().eq("id", invoice.data.id)];
                case 9:
                    _w.sent();
                    return [2 /*return*/, { data: null, error: delivery.error }];
                case 10: return [2 /*return*/, {
                        data: { id: invoice.data.id, invoiceId: invoice.data.invoiceId },
                        error: null
                    }];
            }
        });
    });
}
function updateSalesInvoice(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = input.id, rest = __rest(input, ["id"]);
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .update(__assign(__assign({}, (0, supabase_1.sanitize)(rest)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                            .eq("id", id)
                            .select("id")
                            .single()];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    return [2 /*return*/, { data: { id: result.data.id }, error: null }];
            }
        });
    });
}
/** @deprecated Use insertSalesInvoice for new invoices, updateSalesInvoice for existing invoices */
function upsertSalesInvoice(client, salesInvoice) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, opportunity, customerPayment, customerShipping, salesPerson, _b, paymentTermId, invoiceCustomerId, _c, shippingMethodId, shippingTermId, incoterm, incotermLocation, currency, locationId, _companyGroupId, salesInvoiceData, invoice, invoiceId, delivery;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if ("id" in salesInvoice) {
                        return [2 /*return*/, client
                                .from("salesInvoice")
                                .update(__assign(__assign({}, (0, supabase_1.sanitize)(salesInvoice)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                                .eq("id", salesInvoice.id)
                                .select("id, invoiceId")];
                    }
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("opportunity")
                                .insert([
                                {
                                    companyId: salesInvoice.companyId,
                                    customerId: salesInvoice.customerId
                                }
                            ])
                                .select("id")
                                .single(),
                            (0, sales_service_1.getCustomerPayment)(client, salesInvoice.customerId),
                            (0, sales_service_1.getCustomerShipping)(client, salesInvoice.customerId),
                            (0, people_service_1.getEmployeeJob)(client, salesInvoice.createdBy, salesInvoice.companyId)
                        ])];
                case 1:
                    _a = _l.sent(), opportunity = _a[0], customerPayment = _a[1], customerShipping = _a[2], salesPerson = _a[3];
                    if (opportunity.error)
                        return [2 /*return*/, opportunity];
                    if (customerPayment.error)
                        return [2 /*return*/, customerPayment];
                    if (customerShipping.error)
                        return [2 /*return*/, customerShipping];
                    _b = customerPayment.data, paymentTermId = _b.paymentTermId, invoiceCustomerId = _b.invoiceCustomerId;
                    _c = customerShipping.data, shippingMethodId = _c.shippingMethodId, shippingTermId = _c.shippingTermId, incoterm = _c.incoterm, incotermLocation = _c.incotermLocation;
                    if (!salesInvoice.currencyCode) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, accounting_service_1.getCurrencyByCode)(client, salesInvoice.companyGroupId, salesInvoice.currencyCode)];
                case 2:
                    currency = _l.sent();
                    if (currency.data) {
                        salesInvoice.exchangeRate = (_d = currency.data.exchangeRate) !== null && _d !== void 0 ? _d : undefined;
                        salesInvoice.exchangeRateUpdatedAt = new Date().toISOString();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    salesInvoice.exchangeRate = 1;
                    salesInvoice.exchangeRateUpdatedAt = new Date().toISOString();
                    _l.label = 4;
                case 4:
                    locationId = (_g = (_e = salesInvoice.locationId) !== null && _e !== void 0 ? _e : (_f = salesPerson === null || salesPerson === void 0 ? void 0 : salesPerson.data) === null || _f === void 0 ? void 0 : _f.locationId) !== null && _g !== void 0 ? _g : null;
                    _companyGroupId = salesInvoice.companyGroupId, salesInvoiceData = __rest(salesInvoice, ["companyGroupId"]);
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .insert([
                            __assign(__assign({}, salesInvoiceData), { invoiceCustomerId: invoiceCustomerId !== null && invoiceCustomerId !== void 0 ? invoiceCustomerId : salesInvoice.customerId, opportunityId: (_h = opportunity.data) === null || _h === void 0 ? void 0 : _h.id, currencyCode: (_j = salesInvoice.currencyCode) !== null && _j !== void 0 ? _j : "USD", paymentTermId: (_k = salesInvoice.paymentTermId) !== null && _k !== void 0 ? _k : paymentTermId })
                        ])
                            .select("id, invoiceId")];
                case 5:
                    invoice = _l.sent();
                    if (invoice.error)
                        return [2 /*return*/, invoice];
                    invoiceId = invoice.data[0].id;
                    return [4 /*yield*/, client.from("salesInvoiceShipment").insert([
                            {
                                id: invoiceId,
                                locationId: locationId,
                                shippingMethodId: shippingMethodId,
                                shippingTermId: shippingTermId,
                                incoterm: incoterm,
                                incotermLocation: incotermLocation,
                                companyId: salesInvoice.companyId,
                                createdBy: salesInvoice.createdBy
                            }
                        ])];
                case 6:
                    delivery = _l.sent();
                    if (!delivery.error) return [3 /*break*/, 8];
                    return [4 /*yield*/, client.from("salesInvoice").delete().eq("id", invoiceId)];
                case 7:
                    _l.sent();
                    return [2 /*return*/, delivery];
                case 8: return [2 /*return*/, invoice];
            }
        });
    });
}
function upsertSalesInvoiceShipment(client, salesInvoiceShipment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in salesInvoiceShipment) {
                return [2 /*return*/, client
                        .from("salesInvoiceShipment")
                        .update((0, supabase_1.sanitize)(salesInvoiceShipment))
                        .eq("id", salesInvoiceShipment.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("salesInvoiceShipment")
                    .insert([salesInvoiceShipment])
                    .select("id")
                    .single()];
        });
    });
}
function upsertSalesInvoiceLine(client, salesInvoiceLine) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, maxSortOrder;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ("id" in salesInvoiceLine) {
                        return [2 /*return*/, client
                                .from("salesInvoiceLine")
                                .update((0, supabase_1.sanitize)(salesInvoiceLine))
                                .eq("id", salesInvoiceLine.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("salesInvoiceLine")
                            .select("sortOrder")
                            .eq("invoiceId", salesInvoiceLine.invoiceId)];
                case 1:
                    existing = _b.sent();
                    maxSortOrder = ((_a = existing.data) !== null && _a !== void 0 ? _a : []).reduce(function (max, row) { var _a; return Math.max(max, (_a = row.sortOrder) !== null && _a !== void 0 ? _a : 0); }, 0);
                    return [2 /*return*/, client
                            .from("salesInvoiceLine")
                            .insert([__assign(__assign({}, salesInvoiceLine), { sortOrder: maxSortOrder + 1 })])
                            .select("id")
                            .single()];
            }
        });
    });
}
function updateSalesInvoiceLineOrder(db, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, updates_2, _a, id, sortOrder, updatedBy;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, updates_2 = updates;
                                _b.label = 1;
                            case 1:
                                if (!(_i < updates_2.length)) return [3 /*break*/, 4];
                                _a = updates_2[_i], id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                                return [4 /*yield*/, trx
                                        .updateTable("salesInvoiceLine")
                                        .set({ sortOrder: sortOrder, updatedBy: updatedBy })
                                        .where("id", "=", id)
                                        .execute()];
                            case 2:
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
