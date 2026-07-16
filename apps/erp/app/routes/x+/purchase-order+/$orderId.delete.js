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
var purchasing_1 = require("~/modules/purchasing");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, orderId, serviceRole, purchaseOrder, _d, _e, poStatus, approvalRequest, isRequester, isApprover, _f, _g, _h, _j, remove, _k, _l;
        var _m;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            delete: "purchasing"
                        })];
                case 1:
                    _c = _o.sent(), client = _c.client, userId = _c.userId;
                    orderId = params.orderId;
                    if (!orderId)
                        throw (0, auth_1.notFound)("orderId not found");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, purchasing_1.getPurchaseOrder)(serviceRole, orderId)];
                case 2:
                    purchaseOrder = _o.sent();
                    if (!(purchaseOrder.error || !purchaseOrder.data)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchaseOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)((_m = purchaseOrder.error) !== null && _m !== void 0 ? _m : new Error("Purchase order not found"), "Purchase order not found"))];
                case 3: throw _d.apply(void 0, _e.concat([_o.sent()]));
                case 4:
                    poStatus = purchaseOrder.data.status;
                    if (!(poStatus && poStatus === "Needs Approval")) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "purchaseOrder", orderId)];
                case 5:
                    approvalRequest = _o.sent();
                    if (!(approvalRequest.data &&
                        approvalRequest.data.status === "Pending" &&
                        approvalRequest.data.requestedBy)) return [3 /*break*/, 10];
                    isRequester = (0, shared_1.canCancelRequest)({
                        requestedBy: approvalRequest.data.requestedBy,
                        status: approvalRequest.data.status
                    }, userId);
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                            amount: approvalRequest.data.amount,
                            documentType: approvalRequest.data.documentType,
                            companyId: approvalRequest.data.companyId
                        }, userId)];
                case 6:
                    isApprover = _o.sent();
                    if (!!isRequester) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error(isApprover
                            ? "Approvers cannot delete purchase orders. Please reject the approval request instead."
                            : "Only the requester can delete a purchase order that needs approval"), isApprover
                            ? "Please reject the approval request instead of deleting"
                            : "You do not have permission to delete this purchase order"))];
                case 7: throw _f.apply(void 0, _g.concat([_o.sent()]));
                case 8: 
                // Cancel pending approval requests before deletion
                return [4 /*yield*/, serviceRole
                        .from("approvalRequest")
                        .update({
                        status: "Cancelled",
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .eq("documentType", "purchaseOrder")
                        .eq("documentId", orderId)
                        .eq("status", "Pending")];
                case 9:
                    // Cancel pending approval requests before deletion
                    _o.sent();
                    _o.label = 10;
                case 10:
                    if (!(!poStatus || !["Draft", "Planned", "Needs Approval"].includes(poStatus))) return [3 /*break*/, 12];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(new Error("Cannot delete purchase order in this status"), "Cannot delete purchase order with status \"".concat(poStatus !== null && poStatus !== void 0 ? poStatus : "unknown", "\". Only Draft, Planned, or Needs Approval (if you're the requester) purchase orders can be deleted.")))];
                case 11: throw _h.apply(void 0, _j.concat([_o.sent()]));
                case 12: return [4 /*yield*/, (0, purchasing_1.deletePurchaseOrder)(client, orderId)];
                case 13:
                    remove = _o.sent();
                    if (!remove.error) return [3 /*break*/, 15];
                    console.error("Failed to delete purchase order:", remove.error);
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.purchaseOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(remove.error, remove.error.message))];
                case 14: throw _k.apply(void 0, _l.concat([_o.sent()]));
                case 15: throw (0, react_router_1.redirect)(path_1.path.to.purchaseOrders);
            }
        });
    });
}
