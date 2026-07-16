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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
var purchasing_1 = require("~/modules/purchasing");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, formData, status, _c, _d, viewClient, currentPo, currentStatus, isCurrentlyLocked, requiresDeletePermission, _e, client, userId, companyId, serviceRole, cancelResult, pendingApprovals, latestApproval, isRequester, isApprover, _f, _g, update, _h, _j, _k, _l;
        var _m, _o, _p, _q;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    id = params.orderId;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _r.sent();
                    status = formData.get("status");
                    if (!(!status || !purchasing_1.purchaseOrderStatusType.includes(status))) return [3 /*break*/, 3];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Invalid status"))];
                case 2: throw _c.apply(void 0, _d.concat([_r.sent()]));
                case 3: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 4:
                    viewClient = (_r.sent()).client;
                    return [4 /*yield*/, viewClient
                            .from("purchaseOrder")
                            .select("status")
                            .eq("id", id)
                            .single()];
                case 5:
                    currentPo = _r.sent();
                    currentStatus = (_m = currentPo.data) === null || _m === void 0 ? void 0 : _m.status;
                    isCurrentlyLocked = (0, purchasing_1.isPurchaseOrderLocked)(currentStatus);
                    requiresDeletePermission = (status === "Draft" && isCurrentlyLocked) || status === "Closed";
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, __assign({}, (requiresDeletePermission
                            ? { delete: "purchasing" }
                            : { update: "purchasing" })))];
                case 6:
                    _e = _r.sent(), client = _e.client, userId = _e.userId, companyId = _e.companyId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    if (!(status === "Closed")) return [3 /*break*/, 8];
                    return [4 /*yield*/, serviceRole
                            .from("approvalRequest")
                            .update({
                            status: "Cancelled",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("documentType", "purchaseOrder")
                            .eq("documentId", id)
                            .eq("status", "Pending")
                            .select("id")];
                case 7:
                    cancelResult = _r.sent();
                    if (cancelResult.data && cancelResult.data.length > 0) {
                        console.log("Cancelled ".concat(cancelResult.data.length, " pending approval request(s) for PO ").concat(id, " when closing"));
                    }
                    _r.label = 8;
                case 8:
                    if (!(status === "Draft")) return [3 /*break*/, 16];
                    return [4 /*yield*/, serviceRole
                            .from("approvalRequest")
                            .select("*")
                            .eq("documentType", "purchaseOrder")
                            .eq("documentId", id)
                            .eq("status", "Pending")];
                case 9:
                    pendingApprovals = _r.sent();
                    if (!(pendingApprovals.data && pendingApprovals.data.length > 0)) return [3 /*break*/, 16];
                    if (!(currentStatus === "Closed")) return [3 /*break*/, 11];
                    // System action when reopening from Closed - cancel all regardless of requester
                    return [4 /*yield*/, serviceRole
                            .from("approvalRequest")
                            .update({
                            status: "Cancelled",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("documentType", "purchaseOrder")
                            .eq("documentId", id)
                            .eq("status", "Pending")];
                case 10:
                    // System action when reopening from Closed - cancel all regardless of requester
                    _r.sent();
                    return [3 /*break*/, 16];
                case 11:
                    if (!(currentStatus === "Needs Approval")) return [3 /*break*/, 16];
                    latestApproval = pendingApprovals.data[0];
                    isRequester = latestApproval.requestedBy === userId;
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                            amount: latestApproval.amount,
                            documentType: latestApproval.documentType,
                            companyId: latestApproval.companyId
                        }, userId)];
                case 12:
                    isApprover = _r.sent();
                    if (!(!isRequester && !isApprover)) return [3 /*break*/, 14];
                    _f = react_router_1.redirect;
                    _g = [(_o = (0, path_1.requestReferrer)(request)) !== null && _o !== void 0 ? _o : path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Only the requester or an approver can reopen a purchase order that needs approval"), "You do not have permission to reopen this purchase order"))];
                case 13: throw _f.apply(void 0, _g.concat([_r.sent()]));
                case 14: 
                // Cancel all pending approval requests when reopening (user has permission)
                return [4 /*yield*/, serviceRole
                        .from("approvalRequest")
                        .update({
                        status: "Cancelled",
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .eq("documentType", "purchaseOrder")
                        .eq("documentId", id)
                        .eq("status", "Pending")];
                case 15:
                    // Cancel all pending approval requests when reopening (user has permission)
                    _r.sent();
                    _r.label = 16;
                case 16: return [4 /*yield*/, (0, purchasing_1.updatePurchaseOrderStatus)(client, {
                        id: id,
                        status: status,
                        assignee: ["Closed"].includes(status) ? null : undefined,
                        updatedBy: userId
                    })];
                case 17:
                    update = _r.sent();
                    if (!update.error) return [3 /*break*/, 19];
                    _h = react_router_1.redirect;
                    _j = [(_p = (0, path_1.requestReferrer)(request)) !== null && _p !== void 0 ? _p : path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update purchasing order status"))];
                case 18: throw _h.apply(void 0, _j.concat([_r.sent()]));
                case 19:
                    if (!(status === "Planned")) return [3 /*break*/, 21];
                    return [4 /*yield*/, (0, production_1.runMRP)(serviceRole, {
                            type: "purchaseOrder",
                            id: id,
                            companyId: companyId,
                            userId: userId
                        })];
                case 20:
                    _r.sent();
                    _r.label = 21;
                case 21:
                    _k = react_router_1.redirect;
                    _l = [(_q = (0, path_1.requestReferrer)(request)) !== null && _q !== void 0 ? _q : path_1.path.to.quote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated purchasing order status"))];
                case 22: throw _k.apply(void 0, _l.concat([_r.sent()]));
            }
        });
    });
}
