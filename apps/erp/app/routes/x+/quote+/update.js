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
var sales_1 = require("~/modules/sales");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyGroupId, userId, formData, ids, field, value, quotes, lockedError, _d, currencyCode, customer, currency;
        var _e;
        var _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "sales"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string" ||
                        (typeof value !== "string" && value !== null)) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("quote")
                            .select("status")
                            .in("id", ids)];
                case 3:
                    quotes = _h.sent();
                    lockedError = (0, lockedGuard_server_1.requireUnlockedBulk)({
                        statuses: ((_f = quotes.data) !== null && _f !== void 0 ? _f : []).map(function (q) { return q.status; }),
                        checkFn: sales_1.isQuoteLocked,
                        message: "Cannot modify a locked quote. Reopen it first."
                    });
                    if (lockedError)
                        return [2 /*return*/, lockedError];
                    _d = field;
                    switch (_d) {
                        case "customerId": return [3 /*break*/, 4];
                        case "currencyCode": return [3 /*break*/, 9];
                        case "customerContactId": return [3 /*break*/, 12];
                        case "customerEngineeringContactId": return [3 /*break*/, 12];
                        case "customerLocationId": return [3 /*break*/, 12];
                        case "customerReference": return [3 /*break*/, 12];
                        case "dueDate": return [3 /*break*/, 12];
                        case "estimatorId": return [3 /*break*/, 12];
                        case "expirationDate": return [3 /*break*/, 12];
                        case "locationId": return [3 /*break*/, 12];
                        case "salesPersonId": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 14];
                case 4:
                    currencyCode = void 0;
                    if (!(value && ids.length === 1)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (client === null || client === void 0 ? void 0 : client.from("customer").select("currencyCode").eq("id", value).single())];
                case 5:
                    customer = _h.sent();
                    if (!((_g = customer.data) === null || _g === void 0 ? void 0 : _g.currencyCode)) return [3 /*break*/, 7];
                    currencyCode = customer.data.currencyCode;
                    return [4 /*yield*/, client
                            .from("quote")
                            .update({
                            customerId: value !== null && value !== void 0 ? value : undefined,
                            currencyCode: currencyCode ? currencyCode : undefined,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", ids)];
                case 6: return [2 /*return*/, _h.sent()];
                case 7: return [4 /*yield*/, client
                        .from("quote")
                        .update({
                        customerId: value !== null && value !== void 0 ? value : undefined,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("id", ids)];
                case 8: return [2 /*return*/, _h.sent()];
                case 9: return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, value)];
                case 10:
                    currency = _h.sent();
                    if (!currency.data) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("quote")
                            .update({
                            currencyCode: value,
                            exchangeRate: currency.data.exchangeRate,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", ids)];
                case 11: return [2 /*return*/, _h.sent()];
                case 12: return [4 /*yield*/, client
                        .from("quote")
                        .update((_e = {},
                        _e[field] = value ? value : null,
                        _e.updatedBy = userId,
                        _e.updatedAt = new Date().toISOString(),
                        _e))
                        .in("id", ids)];
                case 13: return [2 /*return*/, _h.sent()];
                case 14: return [2 /*return*/, { error: { message: "Invalid field" }, data: null }];
            }
        });
    });
}
