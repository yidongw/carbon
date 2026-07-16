"use strict";
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
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, client, companyId, userId, id, quote, _b, _c, externalLink, _d, quoteLines, quoteLinePrices, _e, _f, _g, _h, lines, prices, _loop_1, _i, lines_1, line, finalize, _j, _k, supplierId, _loop_2, _l, lines_2, line, err_1, _m, _o, _p, _q;
        var _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        return __generator(this, function (_5) {
            switch (_5.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing",
                            role: "employee",
                            bypassRls: true
                        })];
                case 1:
                    _a = _5.sent(), client = _a.client, companyId = _a.companyId, userId = _a.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find supplier quote id");
                    return [4 /*yield*/, (0, purchasing_1.getSupplierQuote)(client, id)];
                case 2:
                    quote = _5.sent();
                    if (!quote.error) return [3 /*break*/, 4];
                    _b = react_router_1.redirect;
                    _c = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to get supplier quote"))];
                case 3: throw _b.apply(void 0, _c.concat([_5.sent()]));
                case 4: return [4 /*yield*/, (0, shared_1.upsertExternalLink)(client, {
                        id: (_r = quote.data.externalLinkId) !== null && _r !== void 0 ? _r : undefined,
                        documentType: "SupplierQuote",
                        documentId: id,
                        supplierId: quote.data.supplierId,
                        expiresAt: quote.data.expirationDate,
                        companyId: companyId
                    })];
                case 5:
                    externalLink = _5.sent();
                    if (!(externalLink.data && quote.data.externalLinkId !== externalLink.data.id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .update({
                            externalLinkId: externalLink.data.id,
                            status: "Active"
                        })
                            .eq("id", id)];
                case 6:
                    _5.sent();
                    _5.label = 7;
                case 7: return [4 /*yield*/, Promise.all([
                        (0, purchasing_1.getSupplierQuoteLines)(client, id),
                        (0, purchasing_1.getSupplierQuoteLinePricesByQuoteId)(client, id)
                    ])];
                case 8:
                    _d = _5.sent(), quoteLines = _d[0], quoteLinePrices = _d[1];
                    if (!quoteLines.error) return [3 /*break*/, 10];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quoteLines.error, "Failed to get supplier quote lines"))];
                case 9: throw _e.apply(void 0, _f.concat([_5.sent()]));
                case 10:
                    if (!quoteLinePrices.error) return [3 /*break*/, 12];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quoteLinePrices.error, "Failed to get supplier quote line prices"))];
                case 11: throw _g.apply(void 0, _h.concat([_5.sent()]));
                case 12:
                    lines = (_s = quoteLines.data) !== null && _s !== void 0 ? _s : [];
                    prices = (_t = quoteLinePrices.data) !== null && _t !== void 0 ? _t : [];
                    _loop_1 = function (line) {
                        var linePrices, hasValidPriceAndLeadTime, _6, _7;
                        return __generator(this, function (_8) {
                            switch (_8.label) {
                                case 0:
                                    if (!line.id)
                                        return [2 /*return*/, "continue"];
                                    linePrices = prices.filter(function (p) { return p.supplierQuoteLineId === line.id; });
                                    hasValidPriceAndLeadTime = linePrices.some(function (price) {
                                        return price.supplierUnitPrice !== null &&
                                            price.supplierUnitPrice !== 0 &&
                                            price.leadTime !== null &&
                                            price.leadTime !== 0;
                                    });
                                    if (!!hasValidPriceAndLeadTime) return [3 /*break*/, 2];
                                    _6 = react_router_1.redirect;
                                    _7 = [path_1.path.to.supplierQuote(id)];
                                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Line ".concat(line.itemReadableId, " must have at least one quantity with price and lead time")))];
                                case 1: throw _6.apply(void 0, _7.concat([_8.sent()]));
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, lines_1 = lines;
                    _5.label = 13;
                case 13:
                    if (!(_i < lines_1.length)) return [3 /*break*/, 16];
                    line = lines_1[_i];
                    return [5 /*yield**/, _loop_1(line)];
                case 14:
                    _5.sent();
                    _5.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 13];
                case 16:
                    _5.trys.push([16, 24, , 26]);
                    return [4 /*yield*/, (0, purchasing_1.finalizeSupplierQuote)(client, id, userId)];
                case 17:
                    finalize = _5.sent();
                    if (!finalize.error) return [3 /*break*/, 19];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(finalize.error, "Failed to finalize supplier quote"))];
                case 18: throw _j.apply(void 0, _k.concat([_5.sent()]));
                case 19:
                    supplierId = quote.data.supplierId;
                    if (!supplierId)
                        throw new Error("Supplier quote has no supplier");
                    _loop_2 = function (line) {
                        var linePrices, existingPart, supplierPartId, newPart, conversionFactor, _9, linePrices_1, price, unitPriceInInventoryUnit, upsertResult, bestPrice;
                        return __generator(this, function (_10) {
                            switch (_10.label) {
                                case 0:
                                    if (!line.id || !line.itemId)
                                        return [2 /*return*/, "continue"];
                                    linePrices = prices.filter(function (p) { return p.supplierQuoteLineId === line.id; });
                                    if (linePrices.length === 0)
                                        return [2 /*return*/, "continue"];
                                    return [4 /*yield*/, client
                                            .from("supplierPart")
                                            .select("id")
                                            .eq("itemId", line.itemId)
                                            .eq("supplierId", supplierId)
                                            .eq("companyId", companyId)
                                            .single()];
                                case 1:
                                    existingPart = _10.sent();
                                    supplierPartId = void 0;
                                    if (!((_u = existingPart.data) === null || _u === void 0 ? void 0 : _u.id)) return [3 /*break*/, 2];
                                    supplierPartId = existingPart.data.id;
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, client
                                        .from("supplierPart")
                                        .insert({
                                        itemId: line.itemId,
                                        supplierId: supplierId,
                                        supplierPartId: (_v = line.supplierPartId) !== null && _v !== void 0 ? _v : undefined,
                                        supplierUnitOfMeasureCode: (_w = line.purchaseUnitOfMeasureCode) !== null && _w !== void 0 ? _w : undefined,
                                        conversionFactor: (_x = line.conversionFactor) !== null && _x !== void 0 ? _x : 1,
                                        companyId: companyId,
                                        createdBy: userId
                                    })
                                        .select("id")
                                        .single()];
                                case 3:
                                    newPart = _10.sent();
                                    if (newPart.error || !((_y = newPart.data) === null || _y === void 0 ? void 0 : _y.id)) {
                                        console.error("Error creating supplier part:", newPart.error);
                                        return [2 /*return*/, "continue"];
                                    }
                                    supplierPartId = newPart.data.id;
                                    _10.label = 4;
                                case 4:
                                    if (!supplierPartId)
                                        return [2 /*return*/, "continue"];
                                    conversionFactor = (_z = line.conversionFactor) !== null && _z !== void 0 ? _z : 1;
                                    _9 = 0, linePrices_1 = linePrices;
                                    _10.label = 5;
                                case 5:
                                    if (!(_9 < linePrices_1.length)) return [3 /*break*/, 8];
                                    price = linePrices_1[_9];
                                    if (!price.supplierUnitPrice || price.supplierUnitPrice === 0)
                                        return [3 /*break*/, 7];
                                    unitPriceInInventoryUnit = ((_0 = price.unitPrice) !== null && _0 !== void 0 ? _0 : 0) / conversionFactor;
                                    return [4 /*yield*/, client.from("supplierPartPrice").upsert({
                                            supplierPartId: supplierPartId,
                                            quantity: (_1 = price.quantity) !== null && _1 !== void 0 ? _1 : 1,
                                            unitPrice: unitPriceInInventoryUnit,
                                            leadTime: (_2 = price.leadTime) !== null && _2 !== void 0 ? _2 : 0,
                                            sourceType: "Quote",
                                            sourceDocumentId: id,
                                            companyId: companyId,
                                            createdBy: userId,
                                            updatedBy: userId,
                                            updatedAt: new Date().toISOString()
                                        }, { onConflict: "supplierPartId,quantity" })];
                                case 6:
                                    upsertResult = _10.sent();
                                    if (upsertResult.error) {
                                        console.error("Error upserting supplier part price:", upsertResult.error);
                                    }
                                    _10.label = 7;
                                case 7:
                                    _9++;
                                    return [3 /*break*/, 5];
                                case 8:
                                    bestPrice = linePrices
                                        .filter(function (p) { return p.unitPrice != null && p.unitPrice !== 0; })
                                        .sort(function (a, b) { var _a, _b; return ((_a = a.unitPrice) !== null && _a !== void 0 ? _a : Infinity) - ((_b = b.unitPrice) !== null && _b !== void 0 ? _b : Infinity); })[0];
                                    if (!bestPrice) return [3 /*break*/, 10];
                                    return [4 /*yield*/, client
                                            .from("supplierPart")
                                            .update({
                                            unitPrice: ((_3 = bestPrice.unitPrice) !== null && _3 !== void 0 ? _3 : 0) / conversionFactor,
                                            minimumOrderQuantity: (_4 = bestPrice.quantity) !== null && _4 !== void 0 ? _4 : 1
                                        })
                                            .eq("id", supplierPartId)];
                                case 9:
                                    _10.sent();
                                    _10.label = 10;
                                case 10: return [2 /*return*/];
                            }
                        });
                    };
                    _l = 0, lines_2 = lines;
                    _5.label = 20;
                case 20:
                    if (!(_l < lines_2.length)) return [3 /*break*/, 23];
                    line = lines_2[_l];
                    return [5 /*yield**/, _loop_2(line)];
                case 21:
                    _5.sent();
                    _5.label = 22;
                case 22:
                    _l++;
                    return [3 /*break*/, 20];
                case 23: return [3 /*break*/, 26];
                case 24:
                    err_1 = _5.sent();
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to finalize supplier quote"))];
                case 25: throw _m.apply(void 0, _o.concat([_5.sent()]));
                case 26:
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Supplier quote finalized successfully"))];
                case 27: throw _p.apply(void 0, _q.concat([_5.sent()]));
            }
        });
    });
}
