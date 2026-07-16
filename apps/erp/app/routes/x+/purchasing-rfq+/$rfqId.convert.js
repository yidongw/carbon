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
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, rfqId, _d, rfqResult, linesResult, suppliersResult, _e, _f, _g, _h, _j, _k, lines, suppliers, _l, _m, _o, _p, createdQuotes, _i, suppliers_1, rfqSupplier, supplierId, quoteResult, supplierQuoteId, _q, lines_1, line, uom, _r, _s;
        var _t, _u, _v, _w, _x;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing"
                        })];
                case 1:
                    _c = _y.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    rfqId = params.rfqId;
                    if (!rfqId)
                        throw new Error("Could not find rfqId");
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getPurchasingRFQ)(client, rfqId),
                            (0, purchasing_1.getPurchasingRFQLines)(client, rfqId),
                            (0, purchasing_1.getPurchasingRFQSuppliers)(client, rfqId)
                        ])];
                case 2:
                    _d = _y.sent(), rfqResult = _d[0], linesResult = _d[1], suppliersResult = _d[2];
                    if (!rfqResult.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rfqResult.error, "Failed to load RFQ"))];
                case 3: throw _e.apply(void 0, _f.concat([_y.sent()]));
                case 4:
                    if (!linesResult.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(linesResult.error, "Failed to load RFQ lines"))];
                case 5: throw _g.apply(void 0, _h.concat([_y.sent()]));
                case 6:
                    if (!suppliersResult.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(suppliersResult.error, "Failed to load RFQ suppliers"))];
                case 7: throw _j.apply(void 0, _k.concat([_y.sent()]));
                case 8:
                    lines = (_t = linesResult.data) !== null && _t !== void 0 ? _t : [];
                    suppliers = (_u = suppliersResult.data) !== null && _u !== void 0 ? _u : [];
                    if (!(suppliers.length === 0)) return [3 /*break*/, 10];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "No suppliers found for this RFQ"))];
                case 9: throw _l.apply(void 0, _m.concat([_y.sent()]));
                case 10:
                    if (!(lines.length === 0)) return [3 /*break*/, 12];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "No line items found for this RFQ"))];
                case 11: throw _o.apply(void 0, _p.concat([_y.sent()]));
                case 12:
                    createdQuotes = [];
                    _i = 0, suppliers_1 = suppliers;
                    _y.label = 13;
                case 13:
                    if (!(_i < suppliers_1.length)) return [3 /*break*/, 21];
                    rfqSupplier = suppliers_1[_i];
                    supplierId = rfqSupplier.supplierId;
                    return [4 /*yield*/, (0, purchasing_1.insertSupplierQuote)(client, {
                            supplierId: supplierId,
                            companyId: companyId,
                            companyGroupId: companyGroupId,
                            createdBy: userId
                        })];
                case 14:
                    quoteResult = _y.sent();
                    if (quoteResult.error || !quoteResult.data) {
                        console.error("Failed to create supplier quote:", quoteResult.error);
                        return [3 /*break*/, 20];
                    }
                    supplierQuoteId = quoteResult.data.id;
                    createdQuotes.push(supplierQuoteId);
                    _q = 0, lines_1 = lines;
                    _y.label = 15;
                case 15:
                    if (!(_q < lines_1.length)) return [3 /*break*/, 18];
                    line = lines_1[_q];
                    // Skip lines without an itemId since supplierQuoteLine.itemId is NOT NULL
                    if (!line.itemId) {
                        console.warn("Skipping line without itemId:", line.id);
                        return [3 /*break*/, 17];
                    }
                    uom = (_v = line.unitOfMeasureCode) !== null && _v !== void 0 ? _v : "EA";
                    return [4 /*yield*/, (0, purchasing_1.upsertSupplierQuoteLine)(client, {
                            supplierQuoteId: supplierQuoteId,
                            supplierQuoteLineType: "Part",
                            itemId: line.itemId,
                            description: (_w = line.description) !== null && _w !== void 0 ? _w : "",
                            quantity: (_x = line.quantity) !== null && _x !== void 0 ? _x : [1],
                            inventoryUnitOfMeasureCode: uom,
                            purchaseUnitOfMeasureCode: uom,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 16:
                    _y.sent();
                    _y.label = 17;
                case 17:
                    _q++;
                    return [3 /*break*/, 15];
                case 18: 
                // Link RFQ to supplier quote
                return [4 /*yield*/, client.from("purchasingRfqToSupplierQuote").insert({
                        purchasingRfqId: rfqId,
                        supplierQuoteId: supplierQuoteId,
                        companyId: companyId
                    })];
                case 19:
                    // Link RFQ to supplier quote
                    _y.sent();
                    _y.label = 20;
                case 20:
                    _i++;
                    return [3 /*break*/, 13];
                case 21: 
                // Update RFQ status to Received
                return [4 /*yield*/, (0, purchasing_1.updatePurchasingRFQStatus)(client, {
                        id: rfqId,
                        status: "Requested",
                        updatedBy: userId
                    })];
                case 22:
                    // Update RFQ status to Received
                    _y.sent();
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Created ".concat(createdQuotes.length, " supplier quote(s)")))];
                case 23: throw _r.apply(void 0, _s.concat([_y.sent()]));
            }
        });
    });
}
