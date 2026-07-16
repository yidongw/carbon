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
var auth_server_1 = require("@carbon/auth/auth.server");
var accounting_1 = require("~/modules/accounting");
var purchasing_1 = require("~/modules/purchasing");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyGroupId, userId, formData, ids, field, value, purchaseOrders, lockedError, _d, currencyCode, supplier, currency, lineUpdates, currency;
        var _e, _f, _g, _h;
        var _j, _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "purchasing"
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _o.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string") {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    if (!(field === "delete")) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .delete()
                            .in("id", ids)];
                case 3: return [2 /*return*/, _o.sent()];
                case 4:
                    if (!(field !== "deliveryDate")) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .select("status")
                            .in("id", ids)];
                case 5:
                    purchaseOrders = _o.sent();
                    lockedError = (0, lockedGuard_server_1.requireUnlockedBulk)({
                        statuses: ((_j = purchaseOrders.data) !== null && _j !== void 0 ? _j : []).map(function (d) { return d.status; }),
                        checkFn: purchasing_1.isPurchaseOrderLocked,
                        message: "Cannot modify a confirmed purchase order."
                    });
                    if (lockedError) {
                        return [2 /*return*/, lockedError];
                    }
                    _o.label = 6;
                case 6:
                    if (typeof value !== "string" && value !== null) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    _d = field;
                    switch (_d) {
                        case "supplierId": return [3 /*break*/, 7];
                        case "receiptRequestedDate": return [3 /*break*/, 13];
                        case "locationId": return [3 /*break*/, 13];
                        case "shippingMethodId": return [3 /*break*/, 13];
                        case "deliveryDate": return [3 /*break*/, 13];
                        case "paymentTermId": return [3 /*break*/, 15];
                        case "receiptPromisedDate": return [3 /*break*/, 17];
                        case "currencyCode": return [3 /*break*/, 20];
                        case "supplierContactId": return [3 /*break*/, 23];
                        case "supplierLocationId": return [3 /*break*/, 23];
                        case "supplierReference": return [3 /*break*/, 23];
                        case "exchangeRate": return [3 /*break*/, 23];
                        case "orderDate": return [3 /*break*/, 23];
                    }
                    return [3 /*break*/, 25];
                case 7:
                    currencyCode = void 0;
                    if (!(value && ids.length === 1)) return [3 /*break*/, 11];
                    return [4 /*yield*/, (client === null || client === void 0 ? void 0 : client.from("supplier").select("currencyCode").eq("id", value).single())];
                case 8:
                    supplier = _o.sent();
                    if (!((_k = supplier.data) === null || _k === void 0 ? void 0 : _k.currencyCode)) return [3 /*break*/, 11];
                    currencyCode = supplier.data.currencyCode;
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, currencyCode)];
                case 9:
                    currency = _o.sent();
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .update({
                            supplierId: value !== null && value !== void 0 ? value : undefined,
                            currencyCode: currencyCode !== null && currencyCode !== void 0 ? currencyCode : undefined,
                            exchangeRate: (_m = (_l = currency.data) === null || _l === void 0 ? void 0 : _l.exchangeRate) !== null && _m !== void 0 ? _m : 1,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", ids)];
                case 10: return [2 /*return*/, _o.sent()];
                case 11: return [4 /*yield*/, client
                        .from("purchaseOrder")
                        .update({
                        supplierId: value !== null && value !== void 0 ? value : undefined,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("id", ids)];
                case 12: return [2 /*return*/, _o.sent()];
                case 13: return [4 /*yield*/, client
                        .from("purchaseOrderDelivery")
                        .update((_e = {},
                        _e[field] = value ? value : null,
                        _e.updatedBy = userId,
                        _e.updatedAt = new Date().toISOString(),
                        _e))
                        .in("id", ids)];
                case 14: return [2 /*return*/, _o.sent()];
                case 15: return [4 /*yield*/, client
                        .from("purchaseOrderPayment")
                        .update((_f = {},
                        _f[field] = value ? value : null,
                        _f.updatedBy = userId,
                        _f.updatedAt = new Date().toISOString(),
                        _f))
                        .in("id", ids)];
                case 16: return [2 /*return*/, _o.sent()];
                case 17: return [4 /*yield*/, client
                        .from("purchaseOrderLine")
                        .update({
                        promisedDate: value !== null && value !== void 0 ? value : undefined,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("purchaseOrderId", ids)
                        .is("promisedDate", null)];
                case 18:
                    lineUpdates = _o.sent();
                    if (lineUpdates.error) {
                        return [2 /*return*/, lineUpdates];
                    }
                    return [4 /*yield*/, client
                            .from("purchaseOrderDelivery")
                            .update((_g = {},
                            _g[field] = value !== null && value !== void 0 ? value : undefined,
                            _g.updatedBy = userId,
                            _g.updatedAt = new Date().toISOString(),
                            _g))
                            .in("id", ids)];
                case 19: return [2 /*return*/, _o.sent()];
                case 20:
                    if (!value) return [3 /*break*/, 23];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, value)];
                case 21:
                    currency = _o.sent();
                    if (!currency.data) return [3 /*break*/, 23];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .update({
                            currencyCode: value,
                            exchangeRate: currency.data.exchangeRate,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", ids)];
                case 22: return [2 /*return*/, _o.sent()];
                case 23: return [4 /*yield*/, client
                        .from("purchaseOrder")
                        .update((_h = {},
                        _h[field] = value ? value : null,
                        _h.updatedBy = userId,
                        _h.updatedAt = new Date().toISOString(),
                        _h))
                        .in("id", ids)];
                case 24: return [2 /*return*/, _o.sent()];
                case 25: return [2 /*return*/, { error: { message: "Invalid field" }, data: null }];
            }
        });
    });
}
