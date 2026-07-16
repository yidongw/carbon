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
var client_server_1 = require("@carbon/auth/client.server");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var quality_models_1 = require("~/modules/quality/quality.models");
var shared_1 = require("~/modules/shared");
/**
 * Process transition to Active from Draft or Archived.
 * When approval rules apply: create request and use Draft as "in progress".
 * - Draft → submit: stay Draft until approved, then Draft → Active.
 * - Archived → submit: move to Draft, create request; when approved, Draft → Active.
 * Otherwise: update to Active immediately.
 */
function processToActive(client, serviceRole, companyId, userId, docList, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var idsToSkipActive, archivedIdsToMoveToDraft, canTransitionToActive, _i, docList_1, doc, approvalRequired, hasPending, rule, approverIds, _a, e_1, _b, archivedIdsToMoveToDraft_1, docId, idsToUpdateToActive;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    idsToSkipActive = [];
                    archivedIdsToMoveToDraft = [];
                    canTransitionToActive = function (s) {
                        return s === "Draft" || s === "Archived";
                    };
                    _i = 0, docList_1 = docList;
                    _c.label = 1;
                case 1:
                    if (!(_i < docList_1.length)) return [3 /*break*/, 14];
                    doc = docList_1[_i];
                    if (!canTransitionToActive(doc.status))
                        return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, shared_1.isApprovalRequired)(serviceRole, "qualityDocument", companyId, undefined)];
                case 2:
                    approvalRequired = _c.sent();
                    if (!approvalRequired)
                        return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, shared_1.hasPendingApproval)(serviceRole, "qualityDocument", doc.id)];
                case 3:
                    hasPending = _c.sent();
                    if (hasPending) {
                        idsToSkipActive.push(doc.id);
                        return [3 /*break*/, 13];
                    }
                    return [4 /*yield*/, (0, shared_1.createApprovalRequest)(serviceRole, {
                            documentType: "qualityDocument",
                            documentId: doc.id,
                            companyId: companyId,
                            requestedBy: userId,
                            createdBy: userId,
                            amount: undefined
                        })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, shared_1.getApprovalRuleByAmount)(serviceRole, "qualityDocument", companyId, undefined)];
                case 5:
                    rule = _c.sent();
                    if (!rule.data) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, shared_1.getApproverUserIdsForRule)(serviceRole, rule.data)];
                case 6:
                    _a = _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = [];
                    _c.label = 8;
                case 8:
                    approverIds = _a;
                    if (!(approverIds.length > 0)) return [3 /*break*/, 12];
                    _c.label = 9;
                case 9:
                    _c.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: notifications_1.NotificationEvent.ApprovalRequested,
                            companyId: companyId,
                            documentId: doc.id,
                            documentType: "qualityDocument",
                            recipient: { type: "users", userIds: approverIds },
                            from: userId
                        })];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 11:
                    e_1 = _c.sent();
                    console.error("Failed to trigger approval notification", e_1);
                    return [3 /*break*/, 12];
                case 12:
                    idsToSkipActive.push(doc.id);
                    if (doc.status === "Archived") {
                        archivedIdsToMoveToDraft.push(doc.id);
                    }
                    _c.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 1];
                case 14:
                    _b = 0, archivedIdsToMoveToDraft_1 = archivedIdsToMoveToDraft;
                    _c.label = 15;
                case 15:
                    if (!(_b < archivedIdsToMoveToDraft_1.length)) return [3 /*break*/, 18];
                    docId = archivedIdsToMoveToDraft_1[_b];
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .update({
                            status: "Draft",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", docId)];
                case 16:
                    _c.sent();
                    _c.label = 17;
                case 17:
                    _b++;
                    return [3 /*break*/, 15];
                case 18:
                    idsToUpdateToActive = ids.filter(function (id) { return !idsToSkipActive.includes(id); });
                    if (idsToUpdateToActive.length === 0) {
                        return [2 /*return*/, { data: null, error: null }];
                    }
                    return [2 /*return*/, client
                            .from("qualityDocument")
                            .update({
                            status: "Active",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", idsToUpdateToActive)];
            }
        });
    });
}
/**
 * Cancels pending approval requests when changing status to Archived or Draft.
 * - Archived: any user with update quality may archive; pending requests are cancelled.
 * - Draft: only the requester or an approver may change to Draft (withdraw); others get an error.
 */
function cancelPendingApprovalsForArchiveOrDraft(serviceRole, userId, docList, allowAnyUpdater) {
    return __awaiter(this, void 0, void 0, function () {
        var toCancel, _i, docList_2, doc, latest, req, isRequester, isApprover, _a, toCancel_1, reqId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toCancel = [];
                    _i = 0, docList_2 = docList;
                    _b.label = 1;
                case 1:
                    if (!(_i < docList_2.length)) return [3 /*break*/, 6];
                    doc = docList_2[_i];
                    return [4 /*yield*/, (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "qualityDocument", doc.id)];
                case 2:
                    latest = _b.sent();
                    req = latest.data;
                    if (!req || req.status !== "Pending")
                        return [3 /*break*/, 5];
                    if (!!allowAnyUpdater) return [3 /*break*/, 4];
                    isRequester = req.requestedBy === userId;
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                            amount: req.amount,
                            documentType: req.documentType,
                            companyId: req.companyId
                        }, userId)];
                case 3:
                    isApprover = _b.sent();
                    if (!isRequester && !isApprover) {
                        return [2 /*return*/, {
                                message: "Only the requester or an approver can change status to Draft when there is a pending approval request"
                            }];
                    }
                    _b.label = 4;
                case 4:
                    if (req.id)
                        toCancel.push({ id: req.id });
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    _a = 0, toCancel_1 = toCancel;
                    _b.label = 7;
                case 7:
                    if (!(_a < toCancel_1.length)) return [3 /*break*/, 10];
                    reqId = toCancel_1[_a].id;
                    return [4 /*yield*/, serviceRole
                            .from("approvalRequest")
                            .update({
                            status: "Cancelled",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", reqId)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _a++;
                    return [3 /*break*/, 7];
                case 10: return [2 /*return*/, null];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, serviceRole, formData, ids, field, value, _d, statusValue, currentDocs, docList, idList, allowAnyUpdater, err;
        var _e, _f;
        var _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "quality"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    ids = formData.getAll("ids");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string" || typeof value !== "string") {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    _d = field;
                    switch (_d) {
                        case "content": return [3 /*break*/, 3];
                        case "name": return [3 /*break*/, 3];
                        case "status": return [3 /*break*/, 5];
                        case "tags": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 3: return [4 /*yield*/, client
                        .from("qualityDocument")
                        .update((_e = {},
                        _e[field] = value,
                        _e.updatedBy = userId,
                        _e.updatedAt = new Date().toISOString(),
                        _e))
                        .in("id", ids)];
                case 4: return [2 /*return*/, _h.sent()];
                case 5:
                    statusValue = value;
                    if (!quality_models_1.qualityDocumentStatus.includes(statusValue)) {
                        return [2 /*return*/, { error: { message: "Invalid status" }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .select("id, status")
                            .in("id", ids)];
                case 6:
                    currentDocs = _h.sent();
                    if (currentDocs.error) {
                        return [2 /*return*/, { error: currentDocs.error, data: null }];
                    }
                    docList = ((_g = currentDocs.data) !== null && _g !== void 0 ? _g : []);
                    idList = ids;
                    if (statusValue === "Active") {
                        return [2 /*return*/, processToActive(client, serviceRole, companyId, userId, docList, idList)];
                    }
                    if (!(statusValue === "Archived" || statusValue === "Draft")) return [3 /*break*/, 8];
                    allowAnyUpdater = statusValue === "Archived";
                    return [4 /*yield*/, cancelPendingApprovalsForArchiveOrDraft(serviceRole, userId, docList, allowAnyUpdater)];
                case 7:
                    err = _h.sent();
                    if (err)
                        return [2 /*return*/, { error: { message: err.message }, data: null }];
                    _h.label = 8;
                case 8: return [4 /*yield*/, client
                        .from("qualityDocument")
                        .update({
                        status: statusValue,
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("id", idList)];
                case 9: return [2 /*return*/, _h.sent()];
                case 10: return [4 /*yield*/, client
                        .from("qualityDocument")
                        .update((_f = {},
                        _f[field] = formData.getAll("value"),
                        _f.updatedBy = userId,
                        _f.updatedAt = new Date().toISOString(),
                        _f))
                        .in("id", ids)];
                case 11: return [2 /*return*/, _h.sent()];
                case 12: return [2 /*return*/, { error: { message: "Invalid field" }, data: null }];
            }
        });
    });
}
