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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.cancelApprovalRequestsForDocument = cancelApprovalRequestsForDocument;
exports.approveRequest = approveRequest;
exports.canApproveRequest = canApproveRequest;
exports.canApproveRequestInWindow = canApproveRequestInWindow;
exports.canCancelRequest = canCancelRequest;
exports.cancelApprovalRequest = cancelApprovalRequest;
exports.canViewApprovalRequest = canViewApprovalRequest;
exports.createApprovalRequest = createApprovalRequest;
exports.deleteApprovalRule = deleteApprovalRule;
exports.deleteNote = deleteNote;
exports.deleteSavedView = deleteSavedView;
exports.generateEmbedding = generateEmbedding;
exports.getApprovalById = getApprovalById;
exports.getApprovalRequestsByDocument = getApprovalRequestsByDocument;
exports.getApprovalRuleByAmount = getApprovalRuleByAmount;
exports.getApproverUserIdsForRule = getApproverUserIdsForRule;
exports.getLowerTierApproverUserIds = getLowerTierApproverUserIds;
exports.getApprovalRuleById = getApprovalRuleById;
exports.getApprovalRules = getApprovalRules;
exports.getApprovalRulesForApprover = getApprovalRulesForApprover;
exports.getApprovalsForUser = getApprovalsForUser;
exports.getBase64ImageFromSupabase = getBase64ImageFromSupabase;
exports.getCountries = getCountries;
exports.getLatestApprovalRequestForDocument = getLatestApprovalRequestForDocument;
exports.getDocumentType = getDocumentType;
exports.getModelByItemId = getModelByItemId;
exports.getNotes = getNotes;
exports.getPendingApprovalsForApprover = getPendingApprovalsForApprover;
exports.getPeriods = getPeriods;
exports.getSavedViews = getSavedViews;
exports.getTagsList = getTagsList;
exports.getTags = getTags;
exports.deleteTag = deleteTag;
exports.hasPendingApproval = hasPendingApproval;
exports.importCsv = importCsv;
exports.insertNote = insertNote;
exports.insertTag = insertTag;
exports.isApprovalRequired = isApprovalRequired;
exports.getExternalLink = getExternalLink;
exports.upsertExternalLink = upsertExternalLink;
exports.getCustomerPortals = getCustomerPortals;
exports.getCustomerPortal = getCustomerPortal;
exports.deleteCustomerPortal = deleteCustomerPortal;
exports.updateModelThumbnail = updateModelThumbnail;
exports.upsertModelUpload = upsertModelUpload;
exports.updateNote = updateNote;
exports.rejectRequest = rejectRequest;
exports.upsertApprovalRule = upsertApprovalRule;
exports.upsertSavedView = upsertSavedView;
exports.updateSavedViewOrder = updateSavedViewOrder;
exports.lookupPriceFromBreaks = lookupPriceFromBreaks;
exports.lookupBuyPriceFromMap = lookupBuyPriceFromMap;
exports.resolveSupplierPrice = resolveSupplierPrice;
exports.requestProductionPayApproval = requestProductionPayApproval;
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var utils_1 = require("@carbon/utils");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var PRODUCTION_PAY_DOCUMENT_TYPE = "productionQuantityReport";
var SUPERSEDE_NOTES = "Superseded by report revision";
var approvalHandlers = {
    purchaseOrder: {
        onApproveInTransaction: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var lines, calculatedStatus, poUpdate;
                var trx = _b.trx, documentId = _b.documentId, userId = _b.userId, now = _b.now;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, trx
                                .selectFrom("purchaseOrderLine")
                                .select([
                                "purchaseOrderLineType",
                                "invoicedComplete",
                                "receivedComplete"
                            ])
                                .where("purchaseOrderId", "=", documentId)
                                .execute()];
                        case 1:
                            lines = _c.sent();
                            calculatedStatus = (0, utils_1.getPurchaseOrderStatus)(lines).status;
                            return [4 /*yield*/, trx
                                    .updateTable("purchaseOrder")
                                    .set({ status: calculatedStatus, updatedBy: userId, updatedAt: now })
                                    .where("id", "=", documentId)
                                    .where("status", "=", "Needs Approval")
                                    .returning(["id"])
                                    .executeTakeFirst()];
                        case 2:
                            poUpdate = _c.sent();
                            if (!poUpdate) {
                                throw new Error("Failed to update purchase order status - it may no longer be in 'Needs Approval' state");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        onRejectInTransaction: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var poUpdate;
                var trx = _b.trx, documentId = _b.documentId, userId = _b.userId, now = _b.now;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, trx
                                .updateTable("purchaseOrder")
                                .set({ status: "Rejected", updatedBy: userId, updatedAt: now })
                                .where("id", "=", documentId)
                                .where("status", "=", "Needs Approval")
                                .returning(["id"])
                                .executeTakeFirst()];
                        case 1:
                            poUpdate = _c.sent();
                            if (!poUpdate) {
                                throw new Error("Failed to update purchase order status - it may no longer be in 'Needs Approval' state");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    qualityDocument: {
        onApproveInTransaction: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var qdUpdate;
                var trx = _b.trx, documentId = _b.documentId, userId = _b.userId, now = _b.now;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, trx
                                .updateTable("qualityDocument")
                                .set({ status: "Active", updatedBy: userId, updatedAt: now })
                                .where("id", "=", documentId)
                                .returning(["id"])
                                .executeTakeFirst()];
                        case 1:
                            qdUpdate = _c.sent();
                            if (!qdUpdate) {
                                throw new Error("Failed to update quality document status");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        // Note: qualityDocument rejection doesn't change status (stays Draft)
    },
    supplier: {
        onApproveInTransaction: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var supplierUpdate;
                var trx = _b.trx, documentId = _b.documentId, userId = _b.userId, now = _b.now;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, trx
                                .updateTable("supplier")
                                .set({ supplierStatus: "Active", updatedBy: userId, updatedAt: now })
                                .where("id", "=", documentId)
                                .returning(["id"])
                                .executeTakeFirst()];
                        case 1:
                            supplierUpdate = _c.sent();
                            if (!supplierUpdate) {
                                throw new Error("Failed to update supplier status");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        onRejectInTransaction: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var supplierUpdate;
                var trx = _b.trx, documentId = _b.documentId, userId = _b.userId, now = _b.now;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, trx
                                .updateTable("supplier")
                                .set({ supplierStatus: "Rejected", updatedBy: userId, updatedAt: now })
                                .where("id", "=", documentId)
                                .returning(["id"])
                                .executeTakeFirst()];
                        case 1:
                            supplierUpdate = _c.sent();
                            if (!supplierUpdate) {
                                throw new Error("Failed to update supplier status");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    },
    productionQuantityReport: {
        validateOptions: function (operation, options) {
            var ctx = options === null || options === void 0 ? void 0 : options.productionPay;
            if (!(ctx === null || ctx === void 0 ? void 0 : ctx.supabaseClient)) {
                return "Production pay ".concat(operation, " requires database client");
            }
            if (operation === "approve") {
                if (ctx.paymentYear == null || ctx.paymentMonth == null) {
                    return "Production pay approval requires payment period";
                }
            }
            return null;
        },
        afterApprove: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var ctx, now, error;
                var _c;
                var documentId = _b.documentId, userId = _b.userId, options = _b.options;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            ctx = options.productionPay;
                            now = new Date().toISOString();
                            return [4 /*yield*/, ctx.supabaseClient
                                    .from("productionQuantity")
                                    .update({
                                    paymentYear: ctx.paymentYear,
                                    paymentMonth: ctx.paymentMonth,
                                    updatedBy: userId,
                                    updatedAt: now
                                })
                                    .eq("reportId", documentId)
                                    .is("paymentYear", null)
                                    .is("invalidatedAt", null)];
                        case 1:
                            error = (_d.sent()).error;
                            if (error) {
                                return [2 /*return*/, {
                                        error: {
                                            message: (_c = error.message) !== null && _c !== void 0 ? _c : "Failed to apply payment period to quantities"
                                        }
                                    }];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        },
        afterReject: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var ctx, now, error;
                var _c;
                var documentId = _b.documentId, userId = _b.userId, options = _b.options;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            ctx = options.productionPay;
                            now = new Date().toISOString();
                            return [4 /*yield*/, ctx.supabaseClient
                                    .from("productionQuantity")
                                    .update({
                                    invalidatedAt: now,
                                    invalidatedBy: userId,
                                    updatedBy: userId,
                                    updatedAt: now
                                })
                                    .eq("reportId", documentId)
                                    .is("paymentYear", null)
                                    .is("invalidatedAt", null)];
                        case 1:
                            error = (_d.sent()).error;
                            if (error) {
                                return [2 /*return*/, {
                                        error: {
                                            message: (_c = error.message) !== null && _c !== void 0 ? _c : "Failed to invalidate production quantities"
                                        }
                                    }];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
};
function cancelApprovalRequestsForDocument(client_1, documentType_1, documentId_1, userId_1) {
    return __awaiter(this, arguments, void 0, function (client, documentType, documentId, userId, decisionNotes) {
        var now;
        if (decisionNotes === void 0) { decisionNotes = SUPERSEDE_NOTES; }
        return __generator(this, function (_a) {
            now = new Date().toISOString();
            return [2 /*return*/, client
                    .from("approvalRequest")
                    .update({
                    status: "Cancelled",
                    decisionNotes: decisionNotes,
                    updatedBy: userId,
                    updatedAt: now
                })
                    .eq("documentType", documentType)
                    .eq("documentId", documentId)
                    .in("status", ["Pending", "Approved"])];
        });
    });
}
function approveRequest(db, id, userId, notes, options) {
    return __awaiter(this, void 0, void 0, function () {
        var approvalRequest, documentType, documentId, handler, now, optionsError, result, postResult, rollbackNow, error_1;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db
                        .selectFrom("approvalRequest")
                        .select(["id", "status", "documentType", "documentId", "companyId"])
                        .where("id", "=", id)
                        .executeTakeFirst()];
                case 1:
                    approvalRequest = _c.sent();
                    if (!approvalRequest) {
                        return [2 /*return*/, { error: { message: "Approval request not found" }, data: null }];
                    }
                    if (approvalRequest.status !== "Pending") {
                        return [2 /*return*/, {
                                error: { message: "Approval request is not pending" },
                                data: null
                            }];
                    }
                    documentType = approvalRequest.documentType, documentId = approvalRequest.documentId;
                    handler = approvalHandlers[documentType];
                    now = new Date().toISOString();
                    optionsError = (_a = handler === null || handler === void 0 ? void 0 : handler.validateOptions) === null || _a === void 0 ? void 0 : _a.call(handler, "approve", options);
                    if (optionsError) {
                        return [2 /*return*/, { error: { message: optionsError }, data: null }];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var updatedApproval;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .updateTable("approvalRequest")
                                            .set({
                                            status: "Approved",
                                            decisionBy: userId,
                                            decisionAt: now,
                                            decisionNotes: notes || null,
                                            updatedBy: userId,
                                            updatedAt: now
                                        })
                                            .where("id", "=", id)
                                            .returning(["id", "documentType", "documentId"])
                                            .executeTakeFirstOrThrow()];
                                    case 1:
                                        updatedApproval = _b.sent();
                                        return [4 /*yield*/, ((_a = handler === null || handler === void 0 ? void 0 : handler.onApproveInTransaction) === null || _a === void 0 ? void 0 : _a.call(handler, {
                                                trx: trx,
                                                documentId: documentId,
                                                userId: userId,
                                                now: now,
                                                options: options
                                            }))];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/, updatedApproval];
                                }
                            });
                        }); })];
                case 3:
                    result = _c.sent();
                    return [4 /*yield*/, ((_b = handler === null || handler === void 0 ? void 0 : handler.afterApprove) === null || _b === void 0 ? void 0 : _b.call(handler, {
                            documentId: result.documentId,
                            userId: userId,
                            options: options
                        }))];
                case 4:
                    postResult = _c.sent();
                    if (!(postResult === null || postResult === void 0 ? void 0 : postResult.error)) return [3 /*break*/, 6];
                    rollbackNow = new Date().toISOString();
                    return [4 /*yield*/, db
                            .updateTable("approvalRequest")
                            .set({
                            status: "Pending",
                            decisionBy: null,
                            decisionAt: null,
                            decisionNotes: null,
                            updatedBy: userId,
                            updatedAt: rollbackNow
                        })
                            .where("id", "=", id)
                            .execute()];
                case 5:
                    _c.sent();
                    return [2 /*return*/, { error: postResult.error, data: null }];
                case 6: return [2 /*return*/, { data: result, error: null }];
                case 7:
                    error_1 = _c.sent();
                    return [2 /*return*/, {
                            error: {
                                message: error_1 instanceof Error ? error_1.message : "Failed to process approval"
                            },
                            data: null
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function canApproveRequest(client, approvalRequest, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var rules, matched, tierFloor, userGroups, userGroupIds;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getApprovalRulesForApprover(client, approvalRequest.documentType, approvalRequest.companyId)];
                case 1:
                    rules = _d.sent();
                    if (!rules.data || rules.data.length === 0) {
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, getApprovalRuleByAmount(client, approvalRequest.documentType, approvalRequest.companyId, (_a = approvalRequest.amount) !== null && _a !== void 0 ? _a : undefined)];
                case 2:
                    matched = _d.sent();
                    tierFloor = (_c = (_b = matched.data) === null || _b === void 0 ? void 0 : _b.lowerBoundAmount) !== null && _c !== void 0 ? _c : 0;
                    return [4 /*yield*/, client.rpc("groups_for_user", { uid: userId })];
                case 3:
                    userGroups = _d.sent();
                    userGroupIds = userGroups.data || [];
                    return [2 /*return*/, rules.data
                            .filter(function (rule) { var _a; return ((_a = rule.lowerBoundAmount) !== null && _a !== void 0 ? _a : 0) >= tierFloor; })
                            .some(function (rule) {
                            if (rule.defaultApproverId === userId) {
                                return true;
                            }
                            var approverGroupIds = rule.approverGroupIds;
                            if (!approverGroupIds || approverGroupIds.length === 0) {
                                return false;
                            }
                            // Direct individual approver
                            if (approverGroupIds.includes(userId)) {
                                return true;
                            }
                            // Member of an approver group
                            return approverGroupIds.some(function (groupId) { return userGroupIds.includes(groupId); });
                        })];
            }
        });
    });
}
/**
 * Checks if a user can approve a request based on the specific rule matching the amount.
 * This is the original approval check logic - user must be on the rule that matches the amount.
 * Used for "Assigned to Me" lists.
 */
function canApproveRequestInWindow(client, approvalRequest, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var rule, approverGroupIds, userGroups, userGroupIds;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getApprovalRuleByAmount(client, approvalRequest.documentType, approvalRequest.companyId, (_a = approvalRequest.amount) !== null && _a !== void 0 ? _a : undefined)];
                case 1:
                    rule = _b.sent();
                    if (!rule.data) {
                        return [2 /*return*/, false];
                    }
                    if (rule.data.defaultApproverId === userId) {
                        return [2 /*return*/, true];
                    }
                    approverGroupIds = rule.data.approverGroupIds;
                    if (!approverGroupIds || approverGroupIds.length === 0) {
                        return [2 /*return*/, false];
                    }
                    // Check if user ID is directly in approverGroupIds (for individual approvers)
                    if (approverGroupIds.includes(userId)) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, client.rpc("groups_for_user", { uid: userId })];
                case 2:
                    userGroups = _b.sent();
                    userGroupIds = userGroups.data || [];
                    return [2 /*return*/, approverGroupIds.some(function (groupId) { return userGroupIds.includes(groupId); })];
            }
        });
    });
}
function canCancelRequest(approvalRequest, userId) {
    return (approvalRequest.requestedBy === userId &&
        approvalRequest.status === "Pending");
}
function cancelApprovalRequest(client, id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("approvalRequest")
                        .select("id, status, requestedBy")
                        .eq("id", id)
                        .single()];
                case 1:
                    existing = _a.sent();
                    if (existing.error || !existing.data) {
                        return [2 /*return*/, { error: { message: "Approval request not found" }, data: null }];
                    }
                    if (existing.data.status !== "Pending") {
                        return [2 /*return*/, {
                                error: { message: "Approval request is not pending" },
                                data: null
                            }];
                    }
                    if (existing.data.requestedBy !== userId) {
                        return [2 /*return*/, {
                                error: { message: "Only the requester can cancel an approval request" },
                                data: null
                            }];
                    }
                    return [2 /*return*/, client
                            .from("approvalRequest")
                            .update({
                            status: "Cancelled",
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", id)
                            .select("id")
                            .single()];
            }
        });
    });
}
function canViewApprovalRequest(client, approvalRequest, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (approvalRequest.requestedBy === userId) {
                return [2 /*return*/, true];
            }
            return [2 /*return*/, canApproveRequest(client, {
                    amount: approvalRequest.amount,
                    documentType: approvalRequest.documentType,
                    companyId: approvalRequest.companyId
                }, userId)];
        });
    });
}
function createApprovalRequest(client, request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, client
                    .from("approvalRequest")
                    .insert([
                    {
                        documentType: request.documentType,
                        documentId: request.documentId,
                        requestedBy: request.requestedBy,
                        amount: (_a = request.amount) !== null && _a !== void 0 ? _a : null,
                        companyId: request.companyId,
                        createdBy: request.createdBy
                    }
                ])
                    .select("id")
                    .single()];
        });
    });
}
function deleteApprovalRule(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("approvalRule")
                    .delete()
                    .eq("id", id)
                    .eq("companyId", companyId)];
        });
    });
}
function deleteNote(client, noteId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("note").update({ active: false }).eq("id", noteId)];
        });
    });
}
function deleteSavedView(client, viewId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("tableView").delete().eq("id", viewId)];
        });
    });
}
function generateEmbedding(client, text) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.functions.invoke("embedding", {
                        body: { text: text }
                    })];
                case 1:
                    response = _b.sent();
                    if (response.error) {
                        throw new Error("Failed to generate embedding: ".concat(response.error.message || "Unknown error"));
                    }
                    if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.embedding)) {
                        throw new Error("No embedding returned from function");
                    }
                    return [2 /*return*/, response.data.embedding];
            }
        });
    });
}
function getApprovalById(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var baseRequest, viewData;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .from("approvalRequest")
                        .select("*")
                        .eq("id", id)
                        .single()];
                case 1:
                    baseRequest = _e.sent();
                    if (baseRequest.error || !baseRequest.data) {
                        return [2 /*return*/, baseRequest];
                    }
                    return [4 /*yield*/, client
                            .from("approvalRequests")
                            .select("documentReadableId, documentDescription")
                            .eq("id", id)
                            .single()];
                case 2:
                    viewData = _e.sent();
                    return [2 /*return*/, {
                            data: __assign(__assign({}, baseRequest.data), { documentReadableId: (_b = (_a = viewData.data) === null || _a === void 0 ? void 0 : _a.documentReadableId) !== null && _b !== void 0 ? _b : null, documentDescription: (_d = (_c = viewData.data) === null || _c === void 0 ? void 0 : _c.documentDescription) !== null && _d !== void 0 ? _d : null }),
                            error: null
                        }];
            }
        });
    });
}
function getApprovalRequestsByDocument(client, documentType, documentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("approvalRequests")
                    .select("*")
                    .eq("documentType", documentType)
                    .eq("documentId", documentId)
                    .order("requestedAt", { ascending: false })];
        });
    });
}
function getApprovalRuleByAmount(client, documentType, companyId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("approvalRule")
                .select("*")
                .eq("documentType", documentType)
                .eq("companyId", companyId)
                .eq("enabled", true);
            if (amount !== undefined && amount !== null) {
                // The matching tier is the highest one whose floor is at or below the
                // amount; the next tier's floor is where its coverage ends.
                query = query.lte("lowerBoundAmount", amount);
            }
            else {
                query = query.eq("lowerBoundAmount", 0);
            }
            return [2 /*return*/, query
                    .order("lowerBoundAmount", { ascending: false })
                    .order("id", { ascending: true })
                    .limit(1)
                    .maybeSingle()];
        });
    });
}
function getApproverUserIdsForRule(client, rule) {
    return __awaiter(this, void 0, void 0, function () {
        var groupIds, defaultId, fromGroups, _a, ids, combined;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    groupIds = (_c = (_b = rule.approverGroupIds) === null || _b === void 0 ? void 0 : _b.filter(Boolean)) !== null && _c !== void 0 ? _c : [];
                    defaultId = (_d = rule.defaultApproverId) !== null && _d !== void 0 ? _d : null;
                    if (!(groupIds.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.rpc("users_for_groups", { groups: groupIds })];
                case 1:
                    _a = _e.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = { data: [], error: null };
                    _e.label = 3;
                case 3:
                    fromGroups = _a;
                    if (fromGroups.error) {
                        console.error("getApproverUserIdsForRule: users_for_groups failed", fromGroups.error);
                        return [2 /*return*/, defaultId ? [defaultId] : []];
                    }
                    ids = Array.isArray(fromGroups.data)
                        ? fromGroups.data
                        : [];
                    combined = defaultId
                        ? __spreadArray([], new Set(__spreadArray(__spreadArray([], ids, true), [defaultId], false)), true) : __spreadArray([], new Set(ids), true);
                    return [2 /*return*/, combined];
            }
        });
    });
}
/**
 * "Notified of spend" cascade resolver. When a tiered approval lands at
 * a high tier, approvers of every enabled rule with a strictly lower
 * `lowerBoundAmount` get pinged — visibility into spend that bypassed
 * their tier. Returns deduped user IDs.
 */
function getLowerTierApproverUserIds(client, documentType, companyId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var matched, lowerRules, expanded;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (amount == null)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, getApprovalRuleByAmount(client, documentType, companyId, amount)];
                case 1:
                    matched = _c.sent();
                    if (!matched.data)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from("approvalRule")
                            .select("approverGroupIds, defaultApproverId")
                            .eq("documentType", documentType)
                            .eq("companyId", companyId)
                            .eq("enabled", true)
                            .lt("lowerBoundAmount", (_a = matched.data.lowerBoundAmount) !== null && _a !== void 0 ? _a : 0)];
                case 2:
                    lowerRules = _c.sent();
                    if (lowerRules.error || !((_b = lowerRules.data) === null || _b === void 0 ? void 0 : _b.length))
                        return [2 /*return*/, []];
                    return [4 /*yield*/, Promise.all(lowerRules.data.map(function (rule) { return getApproverUserIdsForRule(client, rule); }))];
                case 3:
                    expanded = _c.sent();
                    return [2 /*return*/, __spreadArray([], new Set(expanded.flat()), true)];
            }
        });
    });
}
function getApprovalRuleById(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("approvalRule")
                    .select("*")
                    .eq("id", id)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getApprovalRules(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("approvalRule").select("*").eq("companyId", companyId)];
        });
    });
}
function getApprovalRulesForApprover(client, documentType, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("approvalRule")
                    .select("*")
                    .eq("documentType", documentType)
                    .eq("companyId", companyId)
                    .eq("enabled", true)
                    .order("lowerBoundAmount", { ascending: false })];
        });
    });
}
function getApprovalsForUser(client, userId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query, requestedByUserBase, requestedByUser, pendingQuery, allPending, pendingWithReadableFields, canApprovePromises, approvableByUser, allApprovals, filtered, offset;
        var _this = this;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = client
                        .from("approvalRequest")
                        .select("*", { count: "exact" })
                        .eq("companyId", companyId)
                        .eq("requestedBy", userId);
                    if (args === null || args === void 0 ? void 0 : args.documentType) {
                        query = query.eq("documentType", args.documentType);
                    }
                    if (args === null || args === void 0 ? void 0 : args.status) {
                        query = query.eq("status", args.status);
                    }
                    if (args === null || args === void 0 ? void 0 : args.dateFrom) {
                        query = query.gte("requestedAt", args.dateFrom);
                    }
                    if (args === null || args === void 0 ? void 0 : args.dateTo) {
                        query = query.lte("requestedAt", args.dateTo);
                    }
                    return [4 /*yield*/, query];
                case 1:
                    requestedByUserBase = _b.sent();
                    return [4 /*yield*/, Promise.all((requestedByUserBase.data || []).map(function (approval) { return __awaiter(_this, void 0, void 0, function () {
                            var viewData;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, client
                                            .from("approvalRequests")
                                            .select("documentReadableId, documentDescription")
                                            .eq("id", approval.id)
                                            .single()];
                                    case 1:
                                        viewData = _e.sent();
                                        return [2 /*return*/, __assign(__assign({}, approval), { documentReadableId: (_b = (_a = viewData.data) === null || _a === void 0 ? void 0 : _a.documentReadableId) !== null && _b !== void 0 ? _b : null, documentDescription: (_d = (_c = viewData.data) === null || _c === void 0 ? void 0 : _c.documentDescription) !== null && _d !== void 0 ? _d : null })];
                                }
                            });
                        }); }))];
                case 2:
                    requestedByUser = _b.sent();
                    pendingQuery = client
                        .from("approvalRequest")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("status", "Pending")
                        .neq("requestedBy", userId);
                    if (args === null || args === void 0 ? void 0 : args.documentType) {
                        pendingQuery = pendingQuery.eq("documentType", args.documentType);
                    }
                    if (args === null || args === void 0 ? void 0 : args.dateFrom) {
                        pendingQuery = pendingQuery.gte("requestedAt", args.dateFrom);
                    }
                    if (args === null || args === void 0 ? void 0 : args.dateTo) {
                        pendingQuery = pendingQuery.lte("requestedAt", args.dateTo);
                    }
                    return [4 /*yield*/, pendingQuery];
                case 3:
                    allPending = _b.sent();
                    return [4 /*yield*/, Promise.all((allPending.data || []).map(function (approval) { return __awaiter(_this, void 0, void 0, function () {
                            var viewData;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, client
                                            .from("approvalRequests")
                                            .select("documentReadableId, documentDescription")
                                            .eq("id", approval.id)
                                            .single()];
                                    case 1:
                                        viewData = _e.sent();
                                        return [2 /*return*/, __assign(__assign({}, approval), { documentReadableId: (_b = (_a = viewData.data) === null || _a === void 0 ? void 0 : _a.documentReadableId) !== null && _b !== void 0 ? _b : null, documentDescription: (_d = (_c = viewData.data) === null || _c === void 0 ? void 0 : _c.documentDescription) !== null && _d !== void 0 ? _d : null })];
                                }
                            });
                        }); }))];
                case 4:
                    pendingWithReadableFields = _b.sent();
                    canApprovePromises = pendingWithReadableFields.map(function (approval) { return __awaiter(_this, void 0, void 0, function () {
                        var canApprove;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, canApproveRequest(client, {
                                        amount: approval.amount,
                                        documentType: approval.documentType,
                                        companyId: approval.companyId
                                    }, userId)];
                                case 1:
                                    canApprove = _a.sent();
                                    return [2 /*return*/, canApprove ? approval : null];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(canApprovePromises)];
                case 5:
                    approvableByUser = (_b.sent()).filter(function (approval) { return approval !== null; });
                    allApprovals = __spreadArray(__spreadArray([], requestedByUser, true), approvableByUser, true);
                    filtered = allApprovals;
                    if ((args === null || args === void 0 ? void 0 : args.status) && args.status !== "Pending") {
                        filtered = allApprovals.filter(function (a) { return a.status === args.status; });
                    }
                    filtered.sort(function (a, b) {
                        var aDate = new Date(a.requestedAt).getTime();
                        var bDate = new Date(b.requestedAt).getTime();
                        return bDate - aDate;
                    });
                    if (args === null || args === void 0 ? void 0 : args.limit) {
                        offset = args.offset || 0;
                        filtered = filtered.slice(offset, offset + args.limit);
                    }
                    return [2 /*return*/, {
                            data: filtered,
                            count: (_a = requestedByUserBase.count) !== null && _a !== void 0 ? _a : allApprovals.length,
                            error: null
                        }];
            }
        });
    });
}
function getBase64ImageFromSupabase(client, path) {
    return __awaiter(this, void 0, void 0, function () {
        function arrayBufferToBase64(buffer) {
            return Buffer.from(buffer).toString("base64");
        }
        var _a, data, error, arrayBuffer, base64String, fileExtension, mimeType;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.storage.from("private").download(path)];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, data.arrayBuffer()];
                case 2:
                    arrayBuffer = _c.sent();
                    base64String = arrayBufferToBase64(arrayBuffer);
                    fileExtension = (_b = path.split(".").pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                    mimeType = fileExtension === "jpg" || fileExtension === "jpeg"
                        ? "image/jpeg"
                        : "image/png";
                    return [2 /*return*/, "data:".concat(mimeType, ";base64,").concat(base64String)];
            }
        });
    });
}
function getCountries(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("country").select("*").order("name")];
        });
    });
}
function getLatestApprovalRequestForDocument(client, documentType, documentId) {
    return __awaiter(this, void 0, void 0, function () {
        var baseRequest, viewData;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .from("approvalRequest")
                        .select("*")
                        .eq("documentType", documentType)
                        .eq("documentId", documentId)
                        .eq("status", "Pending")
                        .order("requestedAt", { ascending: false })
                        .limit(1)
                        .maybeSingle()];
                case 1:
                    baseRequest = _e.sent();
                    if (baseRequest.error || !baseRequest.data) {
                        return [2 /*return*/, baseRequest];
                    }
                    return [4 /*yield*/, client
                            .from("approvalRequests")
                            .select("documentReadableId, documentDescription")
                            .eq("id", baseRequest.data.id)
                            .single()];
                case 2:
                    viewData = _e.sent();
                    return [2 /*return*/, {
                            data: __assign(__assign({}, baseRequest.data), { documentReadableId: (_b = (_a = viewData.data) === null || _a === void 0 ? void 0 : _a.documentReadableId) !== null && _b !== void 0 ? _b : null, documentDescription: (_d = (_c = viewData.data) === null || _c === void 0 ? void 0 : _c.documentDescription) !== null && _d !== void 0 ? _d : null }),
                            error: null
                        }];
            }
        });
    });
}
function getDocumentType(fileName) {
    var _a, _b;
    var extension = (_b = (_a = fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
        return "Archive";
    }
    if (["pdf"].includes(extension)) {
        return "PDF";
    }
    if (["doc", "docx", "txt", "rtf"].includes(extension)) {
        return "Document";
    }
    if (["ppt", "pptx"].includes(extension)) {
        return "Presentation";
    }
    if (["csv", "xls", "xlsx"].includes(extension)) {
        return "Spreadsheet";
    }
    if (["txt"].includes(extension)) {
        return "Text";
    }
    if (["png", "jpg", "jpeg", "gif", "avif"].includes(extension)) {
        return "Image";
    }
    if (["mp4", "mov", "avi", "wmv", "flv", "mkv"].includes(extension)) {
        return "Video";
    }
    if (["mp3", "wav", "wma", "aac", "ogg", "flac"].includes(extension)) {
        return "Audio";
    }
    if (utils_1.supportedModelTypes.includes(extension)) {
        return "Model";
    }
    return "Other";
}
function getModelByItemId(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var item, model;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, client
                        .from("item")
                        .select("id, type, modelUploadId")
                        .eq("id", itemId)
                        .single()];
                case 1:
                    item = _j.sent();
                    if (!item.data || !item.data.modelUploadId) {
                        return [2 /*return*/, {
                                itemId: (_b = (_a = item.data) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null,
                                type: (_d = (_c = item.data) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : null,
                                modelPath: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("modelUpload")
                            .select("*")
                            .eq("id", item.data.modelUploadId)
                            .maybeSingle()];
                case 2:
                    model = _j.sent();
                    if (!model.data) {
                        return [2 /*return*/, {
                                itemId: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : null,
                                type: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.type) !== null && _h !== void 0 ? _h : null,
                                modelSize: null
                            }];
                    }
                    return [2 /*return*/, __assign({ itemId: item.data.id, type: item.data.type }, model.data)];
            }
        });
    });
}
function getNotes(client, documentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("note")
                    .select("id, note, createdAt, user(id, fullName, avatarUrl)")
                    .eq("documentId", documentId)
                    .eq("active", true)
                    .order("createdAt")];
        });
    });
}
function getPendingApprovalsForApprover(client, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var allPending, pendingWithReadableFields, canApprovePromises, approvableByUser;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("approvalRequest")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("status", "Pending")
                        .order("requestedAt", { ascending: false })];
                case 1:
                    allPending = _a.sent();
                    if (allPending.error || !allPending.data) {
                        return [2 /*return*/, allPending];
                    }
                    return [4 /*yield*/, Promise.all(allPending.data.map(function (approval) { return __awaiter(_this, void 0, void 0, function () {
                            var viewData;
                            var _a, _b, _c, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, client
                                            .from("approvalRequests")
                                            .select("documentReadableId, documentDescription")
                                            .eq("id", approval.id)
                                            .single()];
                                    case 1:
                                        viewData = _e.sent();
                                        return [2 /*return*/, __assign(__assign({}, approval), { documentReadableId: (_b = (_a = viewData.data) === null || _a === void 0 ? void 0 : _a.documentReadableId) !== null && _b !== void 0 ? _b : null, documentDescription: (_d = (_c = viewData.data) === null || _c === void 0 ? void 0 : _c.documentDescription) !== null && _d !== void 0 ? _d : null })];
                                }
                            });
                        }); }))];
                case 2:
                    pendingWithReadableFields = _a.sent();
                    canApprovePromises = pendingWithReadableFields.map(function (approval) { return __awaiter(_this, void 0, void 0, function () {
                        var canApprove;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, canApproveRequestInWindow(client, {
                                        amount: approval.amount,
                                        documentType: approval.documentType,
                                        companyId: approval.companyId
                                    }, userId)];
                                case 1:
                                    canApprove = _a.sent();
                                    return [2 /*return*/, canApprove ? approval : null];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(canApprovePromises)];
                case 3:
                    approvableByUser = (_a.sent()).filter(function (approval) { return approval !== null; });
                    return [2 /*return*/, {
                            data: approvableByUser,
                            error: null
                        }];
            }
        });
    });
}
function getPeriods(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var endWithTime;
        var startDate = _b.startDate, endDate = _b.endDate;
        return __generator(this, function (_c) {
            endWithTime = endDate.includes("T") ? endDate : "".concat(endDate, "T23:59:59");
            return [2 /*return*/, client
                    .from("period")
                    .select("*")
                    .gte("startDate", startDate)
                    .lte("endDate", endWithTime)];
        });
    });
}
function getSavedViews(client, userId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("tableView")
                    .select("*")
                    .eq("createdBy", userId)
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getTagsList(client, companyId, table) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.from("tag").select("name").eq("companyId", companyId);
            if (table) {
                query = query.eq("table", table);
            }
            return [2 /*return*/, query.order("name")];
        });
    });
}
function getTags(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("tag")
                .select("name, table, createdAt", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function deleteTag(client, companyId, table, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("tag")
                    .delete()
                    .eq("companyId", companyId)
                    .eq("table", table)
                    .eq("name", name)];
        });
    });
}
function hasPendingApproval(client, documentType, documentId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("approvalRequest")
                        .select("id")
                        .eq("documentType", documentType)
                        .eq("documentId", documentId)
                        .eq("status", "Pending")
                        .limit(1)];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, ((_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0];
            }
        });
    });
}
function importCsv(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("import-csv", {
                    body: args
                })];
        });
    });
}
function insertNote(client, note) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("note").insert([note]).select("*").single()];
        });
    });
}
function insertTag(client, tag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("tag").insert(tag).select("*").single()];
        });
    });
}
function isApprovalRequired(client, documentType, companyId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getApprovalRuleByAmount(client, documentType, companyId, amount)];
                case 1:
                    config = _a.sent();
                    if (!config.data) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, config.data.enabled];
            }
        });
    });
}
function getExternalLink(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.from("externalLink").select("*").eq("id", id).single();
            return [2 /*return*/, query];
        });
    });
}
function upsertExternalLink(client, externalLink) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in externalLink && externalLink.id) {
                return [2 /*return*/, client
                        .from("externalLink")
                        .update(externalLink)
                        .eq("id", externalLink.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("externalLink")
                    .insert(externalLink)
                    .select("id")
                    .single()];
        });
    });
}
function getCustomerPortals(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("externalLink")
                .select("*", { count: "exact" })
                .eq("companyId", companyId)
                .eq("documentType", "Customer");
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("customer.name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getCustomerPortal(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("externalLink")
                    .select("*, customer:customerId(id, name)")
                    .eq("id", id)
                    .eq("documentType", "Customer")
                    .single()];
        });
    });
}
function deleteCustomerPortal(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("externalLink").delete().eq("id", id)];
        });
    });
}
function updateModelThumbnail(client, modelId, thumbnailPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("modelUpload").update({ thumbnailPath: thumbnailPath }).eq("id", modelId)];
        });
    });
}
function upsertModelUpload(client, upload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in upload) {
                return [2 /*return*/, client.from("modelUpload").insert(upload)];
            }
            return [2 /*return*/, client.from("modelUpload").update(upload).eq("id", upload.id)];
        });
    });
}
function updateNote(client, id, note) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("note").update({ note: note }).eq("id", id)];
        });
    });
}
function rejectRequest(db, id, userId, notes, options) {
    return __awaiter(this, void 0, void 0, function () {
        var approvalRequest, documentType, documentId, handler, now, optionsError, result, postResult, error_2;
        var _this = this;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db
                        .selectFrom("approvalRequest")
                        .select(["id", "status", "documentType", "documentId"])
                        .where("id", "=", id)
                        .executeTakeFirst()];
                case 1:
                    approvalRequest = _c.sent();
                    if (!approvalRequest) {
                        return [2 /*return*/, { error: { message: "Approval request not found" }, data: null }];
                    }
                    if (approvalRequest.status !== "Pending") {
                        return [2 /*return*/, {
                                error: { message: "Approval request is not pending" },
                                data: null
                            }];
                    }
                    documentType = approvalRequest.documentType, documentId = approvalRequest.documentId;
                    handler = approvalHandlers[documentType];
                    now = new Date().toISOString();
                    optionsError = (_a = handler === null || handler === void 0 ? void 0 : handler.validateOptions) === null || _a === void 0 ? void 0 : _a.call(handler, "reject", options);
                    if (optionsError) {
                        return [2 /*return*/, { error: { message: optionsError }, data: null }];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var updatedApproval;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .updateTable("approvalRequest")
                                            .set({
                                            status: "Rejected",
                                            decisionBy: userId,
                                            decisionAt: now,
                                            decisionNotes: notes || null,
                                            updatedBy: userId,
                                            updatedAt: now
                                        })
                                            .where("id", "=", id)
                                            .returning(["id", "documentType", "documentId"])
                                            .executeTakeFirstOrThrow()];
                                    case 1:
                                        updatedApproval = _b.sent();
                                        return [4 /*yield*/, ((_a = handler === null || handler === void 0 ? void 0 : handler.onRejectInTransaction) === null || _a === void 0 ? void 0 : _a.call(handler, {
                                                trx: trx,
                                                documentId: documentId,
                                                userId: userId,
                                                now: now,
                                                options: options
                                            }))];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/, updatedApproval];
                                }
                            });
                        }); })];
                case 3:
                    result = _c.sent();
                    return [4 /*yield*/, ((_b = handler === null || handler === void 0 ? void 0 : handler.afterReject) === null || _b === void 0 ? void 0 : _b.call(handler, {
                            documentId: result.documentId,
                            userId: userId,
                            options: options
                        }))];
                case 4:
                    postResult = _c.sent();
                    if (postResult === null || postResult === void 0 ? void 0 : postResult.error) {
                        return [2 /*return*/, { error: postResult.error, data: null }];
                    }
                    return [2 /*return*/, { data: result, error: null }];
                case 5:
                    error_2 = _c.sent();
                    return [2 /*return*/, {
                            error: {
                                message: error_2 instanceof Error ? error_2.message : "Failed to process rejection"
                            },
                            data: null
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function upsertApprovalRule(client, rule) {
    return __awaiter(this, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!("id" in rule)) return [3 /*break*/, 2];
                    return [4 /*yield*/, client
                            .from("approvalRule")
                            .select("companyId")
                            .eq("id", rule.id)
                            .single()];
                case 1:
                    existing = _a.sent();
                    if (existing.error || !existing.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: existing.error || { message: "Rule not found" }
                            }];
                    }
                    return [2 /*return*/, client
                            .from("approvalRule")
                            .update((0, supabase_1.sanitize)(rule))
                            .eq("id", rule.id)
                            .eq("companyId", existing.data.companyId)
                            .select("id")
                            .single()];
                case 2: return [2 /*return*/, client.from("approvalRule").insert([rule]).select("id").single()];
            }
        });
    });
}
function upsertSavedView(client, view) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, data, _a, maxSortOrderData, maxSortOrderError, newSortOrder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = view.userId, data = __rest(view, ["userId"]);
                    if ("id" in view && view.id) {
                        return [2 /*return*/, client
                                .from("tableView")
                                .update(__assign(__assign({}, data), { updatedBy: userId }))
                                .eq("id", view.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("tableView")
                            .select("sortOrder")
                            .order("sortOrder", { ascending: false })
                            .limit(1)
                            .maybeSingle()];
                case 1:
                    _a = _b.sent(), maxSortOrderData = _a.data, maxSortOrderError = _a.error;
                    if (maxSortOrderError) {
                        return [2 /*return*/, { data: null, error: maxSortOrderError }];
                    }
                    newSortOrder = maxSortOrderData ? maxSortOrderData.sortOrder + 1 : 1;
                    return [2 /*return*/, client
                            .from("tableView")
                            .insert(__assign(__assign({}, data), { createdBy: userId, sortOrder: newSortOrder }))
                            .select("id")
                            .single()];
            }
        });
    });
}
function updateSavedViewOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client.from("tableView").update({ sortOrder: sortOrder, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
/**
 * Core sync lookup: given price break tiers and a requested quantity,
 * return the unit price from the highest qualifying tier
 * (where tier.quantity <= requestedQty). Falls back to fallbackPrice.
 */
function lookupPriceFromBreaks(priceBreaks, requestedQty, fallbackPrice) {
    var eligible = priceBreaks.filter(function (pb) { return pb.quantity <= requestedQty; });
    if (eligible.length) {
        return eligible.reduce(function (best, pb) {
            return pb.quantity > best.quantity ? pb : best;
        }).unitPrice;
    }
    return fallbackPrice;
}
/**
 * Map-aware wrapper: look up itemId in a SupplierPriceMap, then resolve
 * via lookupPriceFromBreaks. Used by useLineCosts for BOM tree costing.
 */
function lookupBuyPriceFromMap(itemId, requestedQty, priceMap, fallbackCost) {
    var _a;
    var entry = priceMap[itemId];
    if (!entry)
        return fallbackCost;
    return lookupPriceFromBreaks(entry.priceBreaks, requestedQty, (_a = entry.fallbackUnitPrice) !== null && _a !== void 0 ? _a : fallbackCost);
}
/**
 * Resolve the best supplier unit price for a quantity, applying exchange
 * rate conversion.
 */
function resolveSupplierPrice(priceBreaks, quantity, fallbackUnitPrice, exchangeRate) {
    if (!priceBreaks.length)
        return fallbackUnitPrice;
    return (lookupPriceFromBreaks(priceBreaks, quantity, fallbackUnitPrice * exchangeRate) / exchangeRate);
}
function requestProductionPayApproval(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var reportId, companyId, requestedBy, amount, approvalRequired, created, rule, approverIds, _a, e_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    reportId = args.reportId, companyId = args.companyId, requestedBy = args.requestedBy, amount = args.amount;
                    return [4 /*yield*/, isApprovalRequired(client, PRODUCTION_PAY_DOCUMENT_TYPE, companyId)];
                case 1:
                    approvalRequired = _e.sent();
                    if (!approvalRequired) {
                        return [2 /*return*/, { data: null, error: null, skipped: true }];
                    }
                    return [4 /*yield*/, cancelApprovalRequestsForDocument(client, PRODUCTION_PAY_DOCUMENT_TYPE, reportId, requestedBy)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, createApprovalRequest(client, {
                            documentType: PRODUCTION_PAY_DOCUMENT_TYPE,
                            documentId: reportId,
                            companyId: companyId,
                            requestedBy: requestedBy,
                            createdBy: requestedBy,
                            amount: amount !== null && amount !== void 0 ? amount : undefined
                        })];
                case 3:
                    created = _e.sent();
                    if (created.error || !((_b = created.data) === null || _b === void 0 ? void 0 : _b.id)) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: (_d = (_c = created.error) === null || _c === void 0 ? void 0 : _c.message) !== null && _d !== void 0 ? _d : "Failed to create approval request"
                                }
                            }];
                    }
                    return [4 /*yield*/, getApprovalRuleByAmount(client, PRODUCTION_PAY_DOCUMENT_TYPE, companyId, amount !== null && amount !== void 0 ? amount : undefined)];
                case 4:
                    rule = _e.sent();
                    if (!rule.data) return [3 /*break*/, 6];
                    return [4 /*yield*/, getApproverUserIdsForRule(client, rule.data)];
                case 5:
                    _a = _e.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = [];
                    _e.label = 7;
                case 7:
                    approverIds = _a;
                    if (!(approverIds.length > 0)) return [3 /*break*/, 11];
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: notifications_1.NotificationEvent.ApprovalRequested,
                            companyId: companyId,
                            documentId: reportId,
                            documentType: PRODUCTION_PAY_DOCUMENT_TYPE,
                            recipient: { type: "users", userIds: approverIds },
                            from: requestedBy
                        })];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_1 = _e.sent();
                    console.error("Failed to trigger production pay approval notification", e_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, { data: { id: created.data.id }, error: null }];
            }
        });
    });
}
