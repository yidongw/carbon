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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var sales_service_1 = require("~/modules/sales/sales.service");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, quoteId, lineId, configuration, _d, result, quoteLine, _e, _f, _g, _h, serviceRole, upsertMethod, _j, _k, buyMaterials, buyItemIds, priceMap, _i, _l, mat, price, _m, _o;
        var _p, _q, _r, _s, _t, _u;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _v.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    quoteId = params.quoteId, lineId = params.lineId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, request.json()];
                case 2:
                    configuration = _v.sent();
                    if (!configuration) return [3 /*break*/, 18];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("quoteLine")
                                .update({
                                configuration: configuration,
                                updatedAt: new Date().toISOString(),
                                updatedBy: userId
                            })
                                .eq("id", lineId),
                            client.from("quoteLine").select("itemId").eq("id", lineId).single(),
                            client.from("quoteLinePrice").delete().eq("quoteLineId", lineId)
                        ])];
                case 3:
                    _d = _v.sent(), result = _d[0], quoteLine = _d[1];
                    if (!result.error) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [(_p = (0, path_1.requestReferrer)(request)) !== null && _p !== void 0 ? _p : path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to update quote line"))];
                case 4: throw _e.apply(void 0, _f.concat([_v.sent()]));
                case 5:
                    if (!quoteLine.error) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [(_q = (0, path_1.requestReferrer)(request)) !== null && _q !== void 0 ? _q : path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to get quote line"))];
                case 6: throw _g.apply(void 0, _h.concat([_v.sent()]));
                case 7: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 8:
                    serviceRole = _v.sent();
                    return [4 /*yield*/, (0, sales_service_1.upsertQuoteLineMethod)(serviceRole, {
                            quoteId: quoteId,
                            quoteLineId: lineId,
                            itemId: quoteLine.data.itemId,
                            configuration: configuration,
                            companyId: companyId,
                            userId: userId
                        })];
                case 9:
                    upsertMethod = _v.sent();
                    if (!upsertMethod.error) return [3 /*break*/, 11];
                    _j = react_router_1.redirect;
                    _k = [(_r = (0, path_1.requestReferrer)(request)) !== null && _r !== void 0 ? _r : path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to update quote line method"))];
                case 10: throw _j.apply(void 0, _k.concat([_v.sent()]));
                case 11: return [4 /*yield*/, serviceRole
                        .from("quoteMaterial")
                        .select("id, itemId, unitCost")
                        .eq("quoteLineId", lineId)
                        .eq("methodType", "Purchase to Order")];
                case 12:
                    buyMaterials = _v.sent();
                    buyItemIds = __spreadArray([], new Set(((_s = buyMaterials.data) !== null && _s !== void 0 ? _s : []).map(function (m) { return m.itemId; })), true);
                    return [4 /*yield*/, (0, items_1.getSupplierPriceBreaksForItems)(serviceRole, buyItemIds)];
                case 13:
                    priceMap = _v.sent();
                    _i = 0, _l = (_t = buyMaterials.data) !== null && _t !== void 0 ? _t : [];
                    _v.label = 14;
                case 14:
                    if (!(_i < _l.length)) return [3 /*break*/, 17];
                    mat = _l[_i];
                    price = (0, shared_1.lookupBuyPriceFromMap)(mat.itemId, 1, priceMap, mat.unitCost);
                    if (!(price !== mat.unitCost)) return [3 /*break*/, 16];
                    return [4 /*yield*/, serviceRole
                            .from("quoteMaterial")
                            .update({ unitCost: price })
                            .eq("id", mat.id)];
                case 15:
                    _v.sent();
                    _v.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17: return [3 /*break*/, 19];
                case 18: throw new Error("No configuration provided");
                case 19:
                    _m = react_router_1.redirect;
                    _o = [(_u = (0, path_1.requestReferrer)(request)) !== null && _u !== void 0 ? _u : path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated quote line"))];
                case 20: throw _m.apply(void 0, _o.concat([_v.sent()]));
            }
        });
    });
}
