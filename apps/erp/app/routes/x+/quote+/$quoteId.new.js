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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, quoteId, viewClient, quote, formData, validation, _d, id, d, configuration, serviceRole, createQuotationLine, _e, _f, quoteLineId, quantities, priceResult, _g, _h, quantities, priceResult, _j, _k, upsertMethod, _l, _m, recalcResult, _o, _p;
        var _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 1:
                    _c = _t.sent(), companyId = _c.companyId, userId = _c.userId;
                    quoteId = params.quoteId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 2:
                    viewClient = (_t.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getQuote)(viewClient, quoteId)];
                case 3:
                    quote = _t.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isQuoteLocked)((_q = quote.data) === null || _q === void 0 ? void 0 : _q.status),
                            redirectTo: path_1.path.to.quote(quoteId),
                            message: "Cannot modify a locked quote. Reopen it first."
                        })];
                case 4:
                    _t.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _t.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.quoteLineValidator).validate(formData)];
                case 6:
                    validation = _t.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    configuration = undefined;
                    if (d.configuration) {
                        try {
                            configuration = JSON.parse(d.configuration);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLine)(serviceRole, __assign(__assign({}, d), { companyId: companyId, configuration: configuration, createdBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    createQuotationLine = _t.sent();
                    console.log(createQuotationLine);
                    if (!createQuotationLine.error) return [3 /*break*/, 9];
                    console.log(createQuotationLine);
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createQuotationLine.error, "Failed to create quote line."))];
                case 8: throw _e.apply(void 0, _f.concat([_t.sent()]));
                case 9:
                    quoteLineId = createQuotationLine.data.id;
                    if (!(d.methodType === "Purchase to Order")) return [3 /*break*/, 12];
                    quantities = (_r = d.quantity) !== null && _r !== void 0 ? _r : [1];
                    return [4 /*yield*/, (0, sales_1.resolvePurchaseToOrderPrices)(serviceRole, companyId, quoteId, quoteLineId, quantities, userId)];
                case 10:
                    priceResult = _t.sent();
                    if (!(priceResult === null || priceResult === void 0 ? void 0 : priceResult.error)) return [3 /*break*/, 12];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.quoteLine(quoteId, quoteLineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(priceResult.error, "Failed to resolve Purchase to Order prices"))];
                case 11: throw _g.apply(void 0, _h.concat([_t.sent()]));
                case 12:
                    if (!(d.methodType === "Pull from Inventory")) return [3 /*break*/, 15];
                    quantities = (_s = d.quantity) !== null && _s !== void 0 ? _s : [1];
                    return [4 /*yield*/, (0, sales_1.resolveQuoteLinePrices)(serviceRole, companyId, quoteId, quoteLineId, quantities, userId)];
                case 13:
                    priceResult = _t.sent();
                    if (!(priceResult === null || priceResult === void 0 ? void 0 : priceResult.error)) return [3 /*break*/, 15];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.quoteLine(quoteId, quoteLineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(priceResult.error, "Failed to resolve Pull from Inventory prices"))];
                case 14: throw _j.apply(void 0, _k.concat([_t.sent()]));
                case 15:
                    if (!(d.methodType === "Make to Order")) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLineMethod)(serviceRole, {
                            quoteId: quoteId,
                            quoteLineId: quoteLineId,
                            itemId: d.itemId,
                            configuration: configuration,
                            companyId: companyId,
                            userId: userId
                        })];
                case 16:
                    upsertMethod = _t.sent();
                    if (!upsertMethod.error) return [3 /*break*/, 18];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.quoteLine(quoteId, quoteLineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(upsertMethod.error, "Failed to create quote line method."))];
                case 17: throw _l.apply(void 0, _m.concat([_t.sent()]));
                case 18: return [4 /*yield*/, (0, sales_1.recalculateQuoteLinePrices)(serviceRole, quoteId, quoteLineId, userId)];
                case 19:
                    recalcResult = _t.sent();
                    if (!(recalcResult === null || recalcResult === void 0 ? void 0 : recalcResult.error)) return [3 /*break*/, 21];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.quoteLine(quoteId, quoteLineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(recalcResult.error, "Failed to recalculate quote line prices"))];
                case 20: throw _o.apply(void 0, _p.concat([_t.sent()]));
                case 21: throw (0, react_router_1.redirect)(path_1.path.to.quoteLine(quoteId, quoteLineId));
            }
        });
    });
}
