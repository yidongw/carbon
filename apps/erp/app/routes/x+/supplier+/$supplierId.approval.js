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
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var shared_1 = require("~/modules/shared");
var database_server_1 = require("~/services/database.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, supplierId, formData, intent, serviceRole_1, pending, _d, _e, rule, approverIds, _f, e_1, _g, _h, serviceRole_2, canApprove_1, _j, _k, _l, _m, validation, _o, approvalRequestId, decision, notes, serviceRole, approvalRequest, _p, _q, canApprove, _r, _s, db, result, _t, _u, _v, requestedBy, requestCompanyId, e_2, _w, _x;
        var _y, _z, _0, _1;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "purchasing"
                        })];
                case 1:
                    _c = _2.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    supplierId = params.supplierId;
                    if (!supplierId)
                        throw new Error("Could not find supplierId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _2.sent();
                    intent = formData.get("intent");
                    if (!(intent === "request-approval")) return [3 /*break*/, 17];
                    serviceRole_1 = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.hasPendingApproval)(serviceRole_1, "supplier", supplierId)];
                case 3:
                    pending = _2.sent();
                    if (!pending) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "An approval request already exists for this supplier"))];
                case 4: throw _d.apply(void 0, _e.concat([_2.sent()]));
                case 5: return [4 /*yield*/, (0, shared_1.createApprovalRequest)(serviceRole_1, {
                        documentType: "supplier",
                        documentId: supplierId,
                        companyId: companyId,
                        requestedBy: userId,
                        createdBy: userId,
                        amount: undefined
                    })];
                case 6:
                    _2.sent();
                    // Update supplier status to Pending
                    return [4 /*yield*/, client
                            .from("supplier")
                            .update({
                            supplierStatus: "Pending",
                            updatedBy: userId,
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString()
                        })
                            .eq("id", supplierId)];
                case 7:
                    // Update supplier status to Pending
                    _2.sent();
                    return [4 /*yield*/, (0, shared_1.getApprovalRuleByAmount)(serviceRole_1, "supplier", companyId, undefined)];
                case 8:
                    rule = _2.sent();
                    if (!rule.data) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, shared_1.getApproverUserIdsForRule)(serviceRole_1, rule.data)];
                case 9:
                    _f = _2.sent();
                    return [3 /*break*/, 11];
                case 10:
                    _f = [];
                    _2.label = 11;
                case 11:
                    approverIds = _f;
                    if (!(approverIds.length > 0)) return [3 /*break*/, 15];
                    _2.label = 12;
                case 12:
                    _2.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: notifications_1.NotificationEvent.ApprovalRequested,
                            companyId: companyId,
                            documentId: supplierId,
                            documentType: "supplier",
                            recipient: { type: "users", userIds: approverIds },
                            from: userId
                        })];
                case 13:
                    _2.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_1 = _2.sent();
                    console.error("Failed to trigger approval notification", e_1);
                    return [3 /*break*/, 15];
                case 15:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Approval request submitted"))];
                case 16: throw _g.apply(void 0, _h.concat([_2.sent()]));
                case 17:
                    if (!(intent === "make-inactive")) return [3 /*break*/, 23];
                    serviceRole_2 = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole_2, {
                            amount: null,
                            documentType: "supplier",
                            companyId: companyId
                        }, userId)];
                case 18:
                    canApprove_1 = _2.sent();
                    if (!!canApprove_1) return [3 /*break*/, 20];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "You do not have permission to deactivate this supplier"))];
                case 19: throw _j.apply(void 0, _k.concat([_2.sent()]));
                case 20: return [4 /*yield*/, client
                        .from("supplier")
                        .update({
                        supplierStatus: "Inactive",
                        updatedBy: userId,
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString()
                    })
                        .eq("id", supplierId)];
                case 21:
                    _2.sent();
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Supplier deactivated"))];
                case 22: throw _l.apply(void 0, _m.concat([_2.sent()]));
                case 23: return [4 /*yield*/, (0, form_1.validator)(purchasing_1.supplierApprovalDecisionValidator).validate(formData)];
                case 24:
                    validation = _2.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _o = validation.data, approvalRequestId = _o.approvalRequestId, decision = _o.decision, notes = _o.notes;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "supplier", supplierId)];
                case 25:
                    approvalRequest = _2.sent();
                    if (!(!approvalRequest.data || approvalRequest.data.id !== approvalRequestId)) return [3 /*break*/, 27];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Approval request not found"))];
                case 26: throw _p.apply(void 0, _q.concat([_2.sent()]));
                case 27: return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                        amount: approvalRequest.data.amount,
                        documentType: approvalRequest.data.documentType,
                        companyId: approvalRequest.data.companyId
                    }, userId)];
                case 28:
                    canApprove = _2.sent();
                    if (!!canApprove) return [3 /*break*/, 30];
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "You do not have permission to approve this request"))];
                case 29: throw _r.apply(void 0, _s.concat([_2.sent()]));
                case 30:
                    db = (0, database_server_1.getDatabaseClient)();
                    if (!(decision === "Approved")) return [3 /*break*/, 32];
                    return [4 /*yield*/, (0, shared_1.approveRequest)(db, approvalRequestId, userId, notes || undefined)];
                case 31:
                    _t = _2.sent();
                    return [3 /*break*/, 34];
                case 32: return [4 /*yield*/, (0, shared_1.rejectRequest)(db, approvalRequestId, userId, notes || undefined)];
                case 33:
                    _t = _2.sent();
                    _2.label = 34;
                case 34:
                    result = _t;
                    if (!result.error) return [3 /*break*/, 36];
                    _u = react_router_1.redirect;
                    _v = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, (_z = (_y = result.error) === null || _y === void 0 ? void 0 : _y.message) !== null && _z !== void 0 ? _z : "Failed to process approval decision"))];
                case 35: throw _u.apply(void 0, _v.concat([_2.sent()]));
                case 36:
                    requestedBy = (_0 = approvalRequest.data) === null || _0 === void 0 ? void 0 : _0.requestedBy;
                    requestCompanyId = (_1 = approvalRequest.data) === null || _1 === void 0 ? void 0 : _1.companyId;
                    if (!(requestedBy && requestCompanyId && requestedBy !== userId)) return [3 /*break*/, 40];
                    _2.label = 37;
                case 37:
                    _2.trys.push([37, 39, , 40]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: decision === "Approved"
                                ? notifications_1.NotificationEvent.ApprovalApproved
                                : notifications_1.NotificationEvent.ApprovalRejected,
                            companyId: requestCompanyId,
                            documentId: supplierId,
                            documentType: "supplier",
                            recipient: { type: "user", userId: requestedBy },
                            from: userId
                        })];
                case 38:
                    _2.sent();
                    return [3 /*break*/, 40];
                case 39:
                    e_2 = _2.sent();
                    console.error("Failed to trigger approval decision notification", e_2);
                    return [3 /*break*/, 40];
                case 40:
                    _w = react_router_1.redirect;
                    _x = [path_1.path.to.supplier(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Approval request ".concat(decision.toLowerCase(), " successfully")))];
                case 41: throw _w.apply(void 0, _x.concat([_2.sent()]));
            }
        });
    });
}
