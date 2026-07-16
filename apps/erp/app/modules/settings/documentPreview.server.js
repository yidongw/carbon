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
exports.listPreviewEntities = listPreviewEntities;
exports.buildPreviewProps = buildPreviewProps;
var accounting_1 = require("~/modules/accounting");
var inventory_1 = require("~/modules/inventory");
var invoicing_1 = require("~/modules/invoicing");
var purchasing_1 = require("~/modules/purchasing");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
/** Document types that support previewing against a real record. */
var LIST_CONFIG = {
    salesInvoice: { view: "salesInvoices", idColumn: "invoiceId" },
    salesOrder: { view: "salesOrders", idColumn: "salesOrderId" },
    purchaseOrder: { view: "purchaseOrders", idColumn: "purchaseOrderId" },
    quote: { view: "quotes", idColumn: "quoteId" },
    stockTransfer: { view: "stockTransfer", idColumn: "stockTransferId" }
};
/** Recent records of a document type, to populate the preview record picker. */
function listPreviewEntities(client, companyId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        var cfg, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cfg = LIST_CONFIG[documentType];
                    if (!cfg)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from(cfg.view)
                            .select("id, ".concat(cfg.idColumn))
                            .eq("companyId", companyId)
                            .order("createdAt", { ascending: false })
                            // Just the latest handful — the picker is for sampling, not browsing.
                            .limit(6)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, (data !== null && data !== void 0 ? data : [])
                            .filter(function (row) { return row.id; })
                            .map(function (row) { var _a; return ({ id: row.id, label: (_a = row[cfg.idColumn]) !== null && _a !== void 0 ? _a : row.id }); })];
            }
        });
    });
}
var emptyThumbnails = {};
/**
 * Fetch the real data props a document's PDF needs for a record id, mirroring
 * the live PDF route loaders. Returns null when unsupported / not found, so the
 * preview falls back to sample data.
 */
function buildPreviewProps(client, companyId, companyGroupId, documentType, id, locale) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, company, companySettings, base, _b, _c, invoice, lines, locations, shipment, terms, payment, shipping, ar, _d, order, lines, locations, terms, payment, shipping, ar, _e, order, lines, locations, terms, payment, ap, _f, quote, lines, prices, locations, payment, shipment, terms, paymentTerms, shipping, exchangeRate, currency, _g, transfer, lines, location_1;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        return __generator(this, function (_8) {
            switch (_8.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, settings_1.getCompany)(client, companyId),
                        (0, settings_1.getCompanySettings)(client, companyId)
                    ])];
                case 1:
                    _a = _8.sent(), company = _a[0], companySettings = _a[1];
                    if (!company.data)
                        return [2 /*return*/, null];
                    base = {
                        company: company.data,
                        companySettings: companySettings.data,
                        locale: locale,
                        thumbnails: emptyThumbnails
                    };
                    _b = documentType;
                    switch (_b) {
                        case "salesInvoice": return [3 /*break*/, 2];
                        case "salesOrder": return [3 /*break*/, 4];
                        case "purchaseOrder": return [3 /*break*/, 6];
                        case "quote": return [3 /*break*/, 8];
                        case "stockTransfer": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 15];
                case 2: return [4 /*yield*/, Promise.all([
                        (0, invoicing_1.getSalesInvoice)(client, id),
                        (0, invoicing_1.getSalesInvoiceLines)(client, id),
                        (0, invoicing_1.getSalesInvoiceCustomerDetails)(client, id),
                        (0, invoicing_1.getSalesInvoiceShipment)(client, id),
                        (0, sales_1.getSalesTerms)(client, companyId),
                        (0, accounting_1.getPaymentTermsList)(client, companyId),
                        (0, inventory_1.getShippingMethodsList)(client, companyId),
                        (0, settings_1.getAccountsReceivableBillingAddress)(client, companyId)
                    ])];
                case 3:
                    _c = _8.sent(), invoice = _c[0], lines = _c[1], locations = _c[2], shipment = _c[3], terms = _c[4], payment = _c[5], shipping = _c[6], ar = _c[7];
                    if (!invoice.data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, __assign(__assign({}, base), { salesInvoice: invoice.data, salesInvoiceLines: (_h = lines.data) !== null && _h !== void 0 ? _h : [], salesInvoiceLocations: locations.data, salesInvoiceShipment: shipment.data, accountsReceivableBillingAddress: ((_j = companySettings.data) === null || _j === void 0 ? void 0 : _j.accountsReceivableAddress)
                                ? ar.data
                                : null, terms: ((_l = (_k = terms === null || terms === void 0 ? void 0 : terms.data) === null || _k === void 0 ? void 0 : _k.salesTerms) !== null && _l !== void 0 ? _l : {}), paymentTerms: (_m = payment.data) !== null && _m !== void 0 ? _m : [], shippingMethods: (_o = shipping.data) !== null && _o !== void 0 ? _o : [] })];
                case 4: return [4 /*yield*/, Promise.all([
                        (0, sales_1.getSalesOrder)(client, id),
                        (0, sales_1.getSalesOrderLines)(client, id),
                        (0, sales_1.getSalesOrderCustomerDetails)(client, id),
                        (0, sales_1.getSalesTerms)(client, companyId),
                        (0, accounting_1.getPaymentTermsList)(client, companyId),
                        (0, inventory_1.getShippingMethodsList)(client, companyId),
                        (0, settings_1.getAccountsReceivableBillingAddress)(client, companyId)
                    ])];
                case 5:
                    _d = _8.sent(), order = _d[0], lines = _d[1], locations = _d[2], terms = _d[3], payment = _d[4], shipping = _d[5], ar = _d[6];
                    if (!order.data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, __assign(__assign({}, base), { salesOrder: order.data, salesOrderLines: (_p = lines.data) !== null && _p !== void 0 ? _p : [], salesOrderLocations: locations.data, accountsReceivableBillingAddress: ((_q = companySettings.data) === null || _q === void 0 ? void 0 : _q.accountsReceivableAddress)
                                ? ar.data
                                : null, terms: ((_s = (_r = terms === null || terms === void 0 ? void 0 : terms.data) === null || _r === void 0 ? void 0 : _r.salesTerms) !== null && _s !== void 0 ? _s : {}), paymentTerms: (_t = payment.data) !== null && _t !== void 0 ? _t : [], shippingMethods: (_u = shipping.data) !== null && _u !== void 0 ? _u : [] })];
                case 6: return [4 /*yield*/, Promise.all([
                        (0, purchasing_1.getPurchaseOrder)(client, id),
                        (0, purchasing_1.getPurchaseOrderLines)(client, id),
                        (0, purchasing_1.getPurchaseOrderLocations)(client, id),
                        (0, purchasing_1.getPurchasingTerms)(client, companyId),
                        (0, accounting_1.getPaymentTermsList)(client, companyId),
                        (0, settings_1.getAccountsPayableBillingAddress)(client, companyId)
                    ])];
                case 7:
                    _e = _8.sent(), order = _e[0], lines = _e[1], locations = _e[2], terms = _e[3], payment = _e[4], ap = _e[5];
                    if (!order.data)
                        return [2 /*return*/, null];
                    return [2 /*return*/, __assign(__assign({}, base), { purchaseOrder: order.data, purchaseOrderLines: (_v = lines.data) !== null && _v !== void 0 ? _v : [], purchaseOrderLocations: locations.data, accountsPayableBillingAddress: ((_w = companySettings.data) === null || _w === void 0 ? void 0 : _w.accountsPayableAddress)
                                ? ap.data
                                : null, terms: ((_y = (_x = terms === null || terms === void 0 ? void 0 : terms.data) === null || _x === void 0 ? void 0 : _x.purchasingTerms) !== null && _y !== void 0 ? _y : {}), paymentTerms: (_z = payment.data) !== null && _z !== void 0 ? _z : [] })];
                case 8: return [4 /*yield*/, Promise.all([
                        (0, sales_1.getQuote)(client, id),
                        (0, sales_1.getQuoteLines)(client, id),
                        (0, sales_1.getQuoteLinePricesByQuoteId)(client, id),
                        (0, sales_1.getQuoteCustomerDetails)(client, id),
                        (0, sales_1.getQuotePayment)(client, id),
                        (0, sales_1.getQuoteShipment)(client, id),
                        (0, sales_1.getSalesTerms)(client, companyId),
                        (0, accounting_1.getPaymentTermsList)(client, companyId),
                        (0, inventory_1.getShippingMethodsList)(client, companyId)
                    ])];
                case 9:
                    _f = _8.sent(), quote = _f[0], lines = _f[1], prices = _f[2], locations = _f[3], payment = _f[4], shipment = _f[5], terms = _f[6], paymentTerms = _f[7], shipping = _f[8];
                    if (!quote.data)
                        return [2 /*return*/, null];
                    exchangeRate = 1;
                    if (!quote.data.currencyCode) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, quote.data.currencyCode)];
                case 10:
                    currency = _8.sent();
                    if ((_0 = currency.data) === null || _0 === void 0 ? void 0 : _0.exchangeRate)
                        exchangeRate = currency.data.exchangeRate;
                    _8.label = 11;
                case 11: return [2 /*return*/, __assign(__assign({}, base), { exchangeRate: exchangeRate, quote: quote.data, quoteLines: (_1 = lines.data) !== null && _1 !== void 0 ? _1 : [], quoteLinePrices: (_2 = prices.data) !== null && _2 !== void 0 ? _2 : [], quoteCustomerDetails: locations.data, payment: payment === null || payment === void 0 ? void 0 : payment.data, shipment: shipment === null || shipment === void 0 ? void 0 : shipment.data, terms: ((_4 = (_3 = terms === null || terms === void 0 ? void 0 : terms.data) === null || _3 === void 0 ? void 0 : _3.salesTerms) !== null && _4 !== void 0 ? _4 : {}), paymentTerms: (_5 = paymentTerms.data) !== null && _5 !== void 0 ? _5 : [], shippingMethods: (_6 = shipping.data) !== null && _6 !== void 0 ? _6 : [] })];
                case 12: return [4 /*yield*/, Promise.all([
                        (0, inventory_1.getStockTransfer)(client, id),
                        (0, inventory_1.getStockTransferLines)(client, id)
                    ])];
                case 13:
                    _g = _8.sent(), transfer = _g[0], lines = _g[1];
                    if (!transfer.data)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, client
                            .from("location")
                            .select("*")
                            .eq("id", transfer.data.locationId)
                            .single()];
                case 14:
                    location_1 = _8.sent();
                    return [2 /*return*/, __assign(__assign({}, base), { stockTransfer: transfer.data, stockTransferLines: (_7 = lines.data) !== null && _7 !== void 0 ? _7 : [], location: location_1.data })];
                case 15: return [2 /*return*/, null];
            }
        });
    });
}
