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
var date_1 = require("@internationalized/date");
var accounting_1 = require("~/modules/accounting");
var invoicing_1 = require("~/modules/invoicing");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyGroupId, userId, formData, ids, field, value, data, editableFields, lockedError, _d, currencyCode, supplier, currency, paymentTerms, currency;
        var _e, _f;
        var _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "sales"
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _l.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string" ||
                        (typeof value !== "string" && value !== null)) {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .select("id, status")
                            .in("id", ids)];
                case 3:
                    data = (_l.sent()).data;
                    editableFields = ["dateIssued", "dateDue", "datePaid"];
                    if (!editableFields.includes(field)) {
                        lockedError = (0, lockedGuard_server_1.requireUnlockedBulk)({
                            statuses: (data !== null && data !== void 0 ? data : []).map(function (d) { return d.status; }),
                            checkFn: invoicing_1.isPurchaseInvoiceLocked,
                            message: "Cannot modify a confirmed purchase invoice."
                        });
                        if (lockedError)
                            return [2 /*return*/, lockedError];
                    }
                    _d = field;
                    switch (_d) {
                        case "invoiceSupplierId": return [3 /*break*/, 4];
                        case "dateIssued": return [3 /*break*/, 10];
                        case "currencyCode": return [3 /*break*/, 16];
                        case "supplierId": return [3 /*break*/, 19];
                        case "invoiceSupplierContactId": return [3 /*break*/, 19];
                        case "invoiceSupplierLocationId": return [3 /*break*/, 19];
                        case "locationId": return [3 /*break*/, 19];
                        case "supplierReference": return [3 /*break*/, 19];
                        case "paymentTermId": return [3 /*break*/, 19];
                        case "exchangeRate": return [3 /*break*/, 19];
                        case "dateDue": return [3 /*break*/, 19];
                        case "datePaid": return [3 /*break*/, 19];
                    }
                    return [3 /*break*/, 21];
                case 4:
                    currencyCode = void 0;
                    if (!(value && ids.length === 1)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (client === null || client === void 0 ? void 0 : client.from("supplier").select("currencyCode").eq("id", value).single())];
                case 5:
                    supplier = _l.sent();
                    if (!((_g = supplier.data) === null || _g === void 0 ? void 0 : _g.currencyCode)) return [3 /*break*/, 8];
                    currencyCode = supplier.data.currencyCode;
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, currencyCode)];
                case 6:
                    currency = _l.sent();
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .update({
                            invoiceSupplierId: value !== null && value !== void 0 ? value : undefined,
                            invoiceSupplierContactId: null,
                            invoiceSupplierLocationId: null,
                            currencyCode: currencyCode !== null && currencyCode !== void 0 ? currencyCode : undefined,
                            exchangeRate: (_j = (_h = currency.data) === null || _h === void 0 ? void 0 : _h.exchangeRate) !== null && _j !== void 0 ? _j : 1,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", ids)];
                case 7: return [2 /*return*/, _l.sent()];
                case 8: return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .update({
                        supplierId: value !== null && value !== void 0 ? value : undefined,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("id", ids)];
                case 9: return [2 /*return*/, _l.sent()];
                case 10:
                    if (!(ids.length === 1)) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("paymentTerm")
                            .select("*")
                            .eq("id", value)
                            .single()];
                case 11:
                    paymentTerms = _l.sent();
                    if (!paymentTerms.data) return [3 /*break*/, 13];
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .update({
                            dateIssued: value,
                            dateDue: (0, date_1.parseDate)(value)
                                .add({ days: paymentTerms.data.daysDue })
                                .toString(),
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", ids[0])];
                case 12: return [2 /*return*/, _l.sent()];
                case 13: return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .update((_e = {},
                        _e[field] = value ? value : null,
                        _e.updatedBy = userId,
                        _e.updatedAt = new Date().toISOString(),
                        _e))
                        .in("id", ids)];
                case 14: return [2 /*return*/, _l.sent()];
                case 15: return [3 /*break*/, 22];
                case 16:
                    if (!value) return [3 /*break*/, 19];
                    return [4 /*yield*/, (0, accounting_1.getCurrencyByCode)(client, companyGroupId, value)];
                case 17:
                    currency = _l.sent();
                    if (!currency.data) return [3 /*break*/, 19];
                    return [4 /*yield*/, client
                            .from("purchaseInvoice")
                            .update({
                            currencyCode: value,
                            exchangeRate: (_k = currency.data.exchangeRate) !== null && _k !== void 0 ? _k : 1,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", ids)];
                case 18: return [2 /*return*/, _l.sent()];
                case 19: return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .update((_f = {},
                        _f[field] = value ? value : null,
                        _f.updatedBy = userId,
                        _f.updatedAt = new Date().toISOString(),
                        _f))
                        .in("id", ids)];
                case 20: return [2 /*return*/, _l.sent()];
                case 21: return [2 /*return*/, { error: { message: "Invalid field" }, data: null }];
                case 22: return [2 /*return*/];
            }
        });
    });
}
