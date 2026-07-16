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
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, invoiceId, serviceRole, salesInvoice, _d, _e, _f, _g, voidInvoice, _h, _j, _k, _l, err_1, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "invoicing"
                    })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    invoiceId = params.invoiceId;
                    if (!invoiceId)
                        throw new Error("invoiceId not found");
                    _p.label = 2;
                case 2:
                    _p.trys.push([2, 12, , 14]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .select("status, postingDate")
                            .eq("id", invoiceId)
                            .eq("companyId", companyId)
                            .single()];
                case 3:
                    salesInvoice = (_p.sent()).data;
                    if (!!salesInvoice) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.salesInvoices];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Sales invoice not found"), "Invalid operation"))];
                case 4: throw _d.apply(void 0, _e.concat([_p.sent()]));
                case 5:
                    if (!!salesInvoice.postingDate) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Can only void posted invoices"), "Invalid operation"))];
                case 6: throw _f.apply(void 0, _g.concat([_p.sent()]));
                case 7: return [4 /*yield*/, serviceRole.functions.invoke("post-sales-invoice", {
                        body: {
                            type: "void",
                            invoiceId: invoiceId,
                            userId: userId,
                            companyId: companyId
                        }
                    })];
                case 8:
                    voidInvoice = _p.sent();
                    if (!voidInvoice.error) return [3 /*break*/, 10];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(voidInvoice.error, "Failed to void sales invoice"))];
                case 9: throw _h.apply(void 0, _j.concat([_p.sent()]));
                case 10:
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Sales invoice voided"))];
                case 11: return [2 /*return*/, _k.apply(void 0, _l.concat([_p.sent()]))];
                case 12:
                    err_1 = _p.sent();
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.salesInvoiceDetails(invoiceId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to void sales invoice"))];
                case 13: throw _m.apply(void 0, _o.concat([_p.sent()]));
                case 14: return [2 /*return*/];
            }
        });
    });
}
