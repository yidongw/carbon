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
        var _c, client, companyId, userId, receiptId, serviceRole, receipt, _d, _e, _f, _g, _h, _j, voidReceipt, _k, _l, _m, _o, err_1, _p, _q;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    receiptId = params.receiptId;
                    if (!receiptId)
                        throw new Error("receiptId not found");
                    _r.label = 2;
                case 2:
                    _r.trys.push([2, 14, , 16]);
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, client
                            .from("receipt")
                            .select("status, invoiced")
                            .eq("id", receiptId)
                            .eq("companyId", companyId)
                            .single()];
                case 3:
                    receipt = (_r.sent()).data;
                    if (!!receipt) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.receipts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Receipt not found"), "Invalid operation"))];
                case 4: throw _d.apply(void 0, _e.concat([_r.sent()]));
                case 5:
                    if (!(receipt.status !== "Posted")) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.receiptDetails(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Can only void posted receipts"), "Invalid operation"))];
                case 6: throw _f.apply(void 0, _g.concat([_r.sent()]));
                case 7:
                    if (!receipt.invoiced) return [3 /*break*/, 9];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.receiptDetails(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Cannot void a receipt created by a purchase invoice. Void the invoice instead."), "Invalid operation"))];
                case 8: throw _h.apply(void 0, _j.concat([_r.sent()]));
                case 9: return [4 /*yield*/, serviceRole.functions.invoke("post-receipt", {
                        body: {
                            type: "void",
                            receiptId: receiptId,
                            userId: userId,
                            companyId: companyId
                        }
                    })];
                case 10:
                    voidReceipt = _r.sent();
                    if (!voidReceipt.error) return [3 /*break*/, 12];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.receiptDetails(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(voidReceipt.error, "Failed to void receipt"))];
                case 11: throw _k.apply(void 0, _l.concat([_r.sent()]));
                case 12:
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.receiptDetails(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Receipt voided"))];
                case 13: return [2 /*return*/, _m.apply(void 0, _o.concat([_r.sent()]))];
                case 14:
                    err_1 = _r.sent();
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.receiptDetails(receiptId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to void receipt"))];
                case 15: throw _p.apply(void 0, _q.concat([_r.sent()]));
                case 16: return [2 /*return*/];
            }
        });
    });
}
