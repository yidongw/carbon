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
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var quality_1 = require("~/modules/quality");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, validation, _d, id, entityAssignments, splitQuantity, existing, _e, _f, lockedError, current, nowIso, effectiveSplitQty, entitiesToMove, links, _g, _h, remaining, _i, _j, link, qty, _k, _l, _m, _o, _p, _q, insert, _r, _s, newRowId, entityIds, move, _t, _u, update, _v, _w, _x, _y;
        var _z, _0, _1, _2, _3;
        var request = _b.request;
        return __generator(this, function (_4) {
            switch (_4.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    _c = _4.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _4.sent();
                    return [4 /*yield*/, (0, form_1.validator)(quality_1.splitIssueItemValidator).validate(formData)];
                case 3:
                    validation = _4.sent();
                    if (validation.error)
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    _d = validation.data, id = _d.id, entityAssignments = _d.entityAssignments, splitQuantity = _d.splitQuantity;
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .select("*, nonConformance(status)")
                            .eq("id", id)
                            .eq("companyId", companyId)
                            .single()];
                case 4:
                    existing = _4.sent();
                    if (!(existing.error || !existing.data)) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{ error: { message: "Item association not found" } }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(existing.error, "Item association not found"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_4.sent()]))];
                case 6:
                    lockedError = (0, lockedGuard_server_1.requireUnlockedBulk)({
                        statuses: [(_0 = (_z = existing.data.nonConformance) === null || _z === void 0 ? void 0 : _z.status) !== null && _0 !== void 0 ? _0 : null],
                        checkFn: quality_1.isIssueLocked,
                        message: "Cannot modify a closed issue. Reopen it first."
                    });
                    if (lockedError)
                        return [2 /*return*/, lockedError];
                    current = Number((_1 = existing.data.quantity) !== null && _1 !== void 0 ? _1 : 0);
                    nowIso = new Date().toISOString();
                    entitiesToMove = [];
                    if (!(entityAssignments && entityAssignments.length > 0)) return [3 /*break*/, 7];
                    effectiveSplitQty = entityAssignments.reduce(function (acc, a) { return acc + Number(a.quantity); }, 0);
                    entitiesToMove = entityAssignments;
                    return [3 /*break*/, 15];
                case 7:
                    if (!(typeof splitQuantity === "number" && splitQuantity > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, client
                            .from("nonConformanceItemTrackedEntity")
                            .select("trackedEntityId, quantity")
                            .eq("nonConformanceItemId", id)
                            .eq("companyId", companyId)
                            .order("quantity", { ascending: true })];
                case 8:
                    links = _4.sent();
                    if (!links.error) return [3 /*break*/, 10];
                    _g = react_router_1.data;
                    _h = [{ error: links.error }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(links.error, "Failed to load entity links"))];
                case 9: return [2 /*return*/, _g.apply(void 0, _h.concat([_4.sent()]))];
                case 10:
                    remaining = splitQuantity;
                    for (_i = 0, _j = ((_2 = links.data) !== null && _2 !== void 0 ? _2 : []); _i < _j.length; _i++) {
                        link = _j[_i];
                        qty = Number((_3 = link.quantity) !== null && _3 !== void 0 ? _3 : 0);
                        if (qty <= remaining + 1e-6) {
                            entitiesToMove.push({
                                trackedEntityId: link.trackedEntityId,
                                quantity: qty
                            });
                            remaining -= qty;
                            if (remaining <= 1e-6)
                                break;
                        }
                    }
                    if (!(Math.abs(remaining) > 1e-6)) return [3 /*break*/, 12];
                    _k = react_router_1.data;
                    _l = [{
                            error: {
                                message: "Cannot split by quantity alone — mixed batch sizes require explicit entity selection"
                            }
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Use the entity picker to split this row"))];
                case 11: return [2 /*return*/, _k.apply(void 0, _l.concat([_4.sent()]))];
                case 12:
                    effectiveSplitQty = splitQuantity;
                    return [3 /*break*/, 15];
                case 13:
                    _m = react_router_1.data;
                    _o = [{ error: { message: "Missing split parameters" } }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid split request"))];
                case 14: return [2 /*return*/, _m.apply(void 0, _o.concat([_4.sent()]))];
                case 15:
                    if (!(effectiveSplitQty >= current)) return [3 /*break*/, 17];
                    _p = react_router_1.data;
                    _q = [{
                            error: {
                                message: "Split quantity (".concat(effectiveSplitQty, ") must be less than the current quantity (").concat(current, ")")
                            }
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Split quantity too large"))];
                case 16: return [2 /*return*/, _p.apply(void 0, _q.concat([_4.sent()]))];
                case 17: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .insert({
                        nonConformanceId: existing.data.nonConformanceId,
                        itemId: existing.data.itemId,
                        quantity: effectiveSplitQty,
                        disposition: "Pending",
                        companyId: companyId,
                        createdBy: userId
                    })
                        .select("id")
                        .single()];
                case 18:
                    insert = _4.sent();
                    if (!(insert.error || !insert.data)) return [3 /*break*/, 20];
                    _r = react_router_1.data;
                    _s = [{ error: insert.error }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insert.error, "Failed to split line"))];
                case 19: return [2 /*return*/, _r.apply(void 0, _s.concat([_4.sent()]))];
                case 20:
                    newRowId = insert.data.id;
                    if (!(entitiesToMove.length > 0)) return [3 /*break*/, 23];
                    entityIds = entitiesToMove.map(function (e) { return e.trackedEntityId; });
                    return [4 /*yield*/, client
                            .from("nonConformanceItemTrackedEntity")
                            .update({
                            nonConformanceItemId: newRowId,
                            updatedBy: userId,
                            updatedAt: nowIso
                        })
                            .eq("nonConformanceItemId", id)
                            .in("trackedEntityId", entityIds)
                            .eq("companyId", companyId)];
                case 21:
                    move = _4.sent();
                    if (!move.error) return [3 /*break*/, 23];
                    _t = react_router_1.data;
                    _u = [{ error: move.error }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(move.error, "Failed to reassign tracked entities"))];
                case 22: return [2 /*return*/, _t.apply(void 0, _u.concat([_4.sent()]))];
                case 23: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .update({
                        quantity: current - effectiveSplitQty,
                        updatedBy: userId,
                        updatedAt: nowIso
                    })
                        .eq("id", id)
                        .eq("companyId", companyId)];
                case 24:
                    update = _4.sent();
                    if (!update.error) return [3 /*break*/, 26];
                    _v = react_router_1.data;
                    _w = [{ error: update.error }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update original"))];
                case 25: return [2 /*return*/, _v.apply(void 0, _w.concat([_4.sent()]))];
                case 26:
                    _x = react_router_1.data;
                    _y = [{ success: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Line split"))];
                case 27: return [2 /*return*/, _x.apply(void 0, _y.concat([_4.sent()]))];
            }
        });
    });
}
