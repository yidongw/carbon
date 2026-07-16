"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.handle = void 0;
exports.action = action;
exports.loader = loader;
exports.default = PurchaseOrderRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var email_1 = require("@carbon/documents/email");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var components_1 = require("@react-email/components");
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var accounting_1 = require("~/modules/accounting");
var documents_1 = require("~/modules/documents");
var purchasing_1 = require("~/modules/purchasing");
var PurchaseOrder_1 = require("~/modules/purchasing/ui/PurchaseOrder");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var _orderId___pdf_1 = require("~/routes/file+/purchase-order+/$orderId[.]pdf");
var database_server_1 = require("~/services/database.server");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Orders"], ["Orders"]))),
    to: path_1.path.to.purchaseOrders,
    module: "purchasing"
};
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, userId, companyId, orderId, validation, _b, _c, _d, approvalRequestId, decision, notification, supplierContact, ccSelections, serviceRole, approvalRequest, _e, _f, canApproveResult, _g, _h, db, result, _j, _k, _l, requestedBy, e_1, lowerTierIds, recipients, e_2, purchaseOrder, fileName, documentFilePath, pdf, file, documentFileUpload, err_1, acceptLanguage, locales, _m, company, supplier, purchaseOrderLines, purchaseOrderLocations, paymentTerms, buyer, supplierEmail, emailTemplate, html, text, signedUrlData, err_2, companySettings, priceUpdate, _o, _p;
        var _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        return __generator(this, function (_8) {
            switch (_8.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "purchasing"
                        })];
                case 1:
                    _a = _8.sent(), userId = _a.userId, companyId = _a.companyId;
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    _c = (_b = (0, form_1.validator)(purchasing_1.purchaseOrderApprovalValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _c.apply(_b, [_8.sent()])];
                case 3:
                    validation = _8.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, approvalRequestId = _d.approvalRequestId, decision = _d.decision, notification = _d.notification, supplierContact = _d.supplierContact, ccSelections = _d.cc;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "purchaseOrder", orderId)];
                case 4:
                    approvalRequest = _8.sent();
                    if (!(!approvalRequest.data || approvalRequest.data.id !== approvalRequestId)) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Approval request not found"))];
                case 5: throw _e.apply(void 0, _f.concat([_8.sent()]));
                case 6: return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                        amount: approvalRequest.data.amount,
                        documentType: approvalRequest.data.documentType,
                        companyId: approvalRequest.data.companyId
                    }, userId)];
                case 7:
                    canApproveResult = _8.sent();
                    if (!!canApproveResult) return [3 /*break*/, 9];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "You do not have permission to approve this request"))];
                case 8: throw _g.apply(void 0, _h.concat([_8.sent()]));
                case 9:
                    db = (0, database_server_1.getDatabaseClient)();
                    if (!(decision === "Approved")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, shared_1.approveRequest)(db, approvalRequestId, userId)];
                case 10:
                    _j = _8.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, (0, shared_1.rejectRequest)(db, approvalRequestId, userId)];
                case 12:
                    _j = _8.sent();
                    _8.label = 13;
                case 13:
                    result = _j;
                    if (!result.error) return [3 /*break*/, 15];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, (_r = (_q = result.error) === null || _q === void 0 ? void 0 : _q.message) !== null && _r !== void 0 ? _r : "Failed to process approval decision"))];
                case 14: throw _k.apply(void 0, _l.concat([_8.sent()]));
                case 15:
                    requestedBy = (_s = approvalRequest.data) === null || _s === void 0 ? void 0 : _s.requestedBy;
                    if (!(requestedBy && requestedBy !== userId)) return [3 /*break*/, 19];
                    _8.label = 16;
                case 16:
                    _8.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: decision === "Approved"
                                ? notifications_1.NotificationEvent.ApprovalApproved
                                : notifications_1.NotificationEvent.ApprovalRejected,
                            companyId: companyId,
                            documentId: orderId,
                            documentType: "purchaseOrder",
                            recipient: { type: "user", userId: requestedBy },
                            from: userId
                        })];
                case 17:
                    _8.sent();
                    return [3 /*break*/, 19];
                case 18:
                    e_1 = _8.sent();
                    console.error("Failed to trigger approval decision notification", e_1);
                    return [3 /*break*/, 19];
                case 19:
                    _8.trys.push([19, 23, , 24]);
                    return [4 /*yield*/, (0, shared_1.getLowerTierApproverUserIds)(serviceRole, "purchaseOrder", companyId, (_t = approvalRequest.data.amount) !== null && _t !== void 0 ? _t : undefined)];
                case 20:
                    lowerTierIds = _8.sent();
                    recipients = lowerTierIds.filter(function (id) { return id !== requestedBy && id !== userId; });
                    if (!(recipients.length > 0)) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: decision === "Approved"
                                ? notifications_1.NotificationEvent.ApprovalApproved
                                : notifications_1.NotificationEvent.ApprovalRejected,
                            companyId: companyId,
                            documentId: orderId,
                            documentType: "purchaseOrder",
                            recipient: { type: "users", userIds: recipients },
                            from: userId
                        })];
                case 21:
                    _8.sent();
                    _8.label = 22;
                case 22: return [3 /*break*/, 24];
                case 23:
                    e_2 = _8.sent();
                    console.error("Failed to trigger lower-tier spend notification for purchase order", e_2);
                    return [3 /*break*/, 24];
                case 24:
                    if (!(decision === "Approved")) return [3 /*break*/, 45];
                    return [4 /*yield*/, (0, purchasing_1.getPurchaseOrder)(serviceRole, orderId)];
                case 25:
                    purchaseOrder = _8.sent();
                    if (!purchaseOrder.data) return [3 /*break*/, 45];
                    fileName = void 0;
                    documentFilePath = void 0;
                    _8.label = 26;
                case 26:
                    _8.trys.push([26, 32, , 33]);
                    return [4 /*yield*/, (0, _orderId___pdf_1.loader)(args)];
                case 27:
                    pdf = _8.sent();
                    if (!(pdf.headers.get("content-type") === "application/pdf")) return [3 /*break*/, 31];
                    return [4 /*yield*/, pdf.arrayBuffer()];
                case 28:
                    file = _8.sent();
                    fileName = (0, string_1.stripSpecialCharacters)("".concat(purchaseOrder.data.purchaseOrderId, " - ").concat(new Date()
                        .toISOString()
                        .slice(0, -5), ".pdf"));
                    documentFilePath = "".concat(companyId, "/supplier-interaction/").concat(purchaseOrder.data.supplierInteractionId, "/").concat(fileName);
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .upload(documentFilePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            contentType: "application/pdf",
                            upsert: true
                        })];
                case 29:
                    documentFileUpload = _8.sent();
                    if (!!documentFileUpload.error) return [3 /*break*/, 31];
                    return [4 /*yield*/, (0, documents_1.upsertDocument)(serviceRole, {
                            path: documentFilePath,
                            name: fileName,
                            size: Math.round(file.byteLength / 1024),
                            sourceDocument: "Purchase Order",
                            sourceDocumentId: orderId,
                            readGroups: [userId],
                            writeGroups: [userId],
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 30:
                    _8.sent();
                    _8.label = 31;
                case 31: return [3 /*break*/, 33];
                case 32:
                    err_1 = _8.sent();
                    // Log but don't fail the approval - PDF generation is not critical
                    console.error("Failed to generate PDF after approval:", err_1);
                    return [3 /*break*/, 33];
                case 33:
                    if (!(notification === "Email" &&
                        supplierContact &&
                        documentFilePath &&
                        fileName)) return [3 /*break*/, 42];
                    _8.label = 34;
                case 34:
                    _8.trys.push([34, 41, , 42]);
                    acceptLanguage = request.headers.get("accept-language");
                    locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
                        validate: Intl.DateTimeFormat.supportedLocalesOf
                    });
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, companyId),
                            (0, purchasing_1.getSupplierContact)(serviceRole, supplierContact),
                            (0, purchasing_1.getPurchaseOrderLines)(serviceRole, orderId),
                            (0, purchasing_1.getPurchaseOrderLocations)(serviceRole, orderId),
                            (0, accounting_1.getPaymentTermsList)(serviceRole, companyId),
                            (0, users_server_1.getUser)(serviceRole, userId)
                        ])];
                case 35:
                    _m = _8.sent(), company = _m[0], supplier = _m[1], purchaseOrderLines = _m[2], purchaseOrderLocations = _m[3], paymentTerms = _m[4], buyer = _m[5];
                    supplierEmail = (_v = (_u = supplier === null || supplier === void 0 ? void 0 : supplier.data) === null || _u === void 0 ? void 0 : _u.contact) === null || _v === void 0 ? void 0 : _v.email;
                    if (!(supplierEmail &&
                        company.data &&
                        buyer.data &&
                        purchaseOrderLocations.data &&
                        paymentTerms.data)) return [3 /*break*/, 40];
                    emailTemplate = (0, email_1.PurchaseOrderEmail)({
                        // @ts-expect-error TS2739 - TODO: fix type
                        company: company.data,
                        locale: (_w = locales === null || locales === void 0 ? void 0 : locales[0]) !== null && _w !== void 0 ? _w : "en-US",
                        purchaseOrder: purchaseOrder.data,
                        purchaseOrderLines: (_x = purchaseOrderLines.data) !== null && _x !== void 0 ? _x : [],
                        purchaseOrderLocations: purchaseOrderLocations.data,
                        recipient: {
                            email: supplierEmail,
                            firstName: (_0 = (_z = (_y = supplier.data) === null || _y === void 0 ? void 0 : _y.contact) === null || _z === void 0 ? void 0 : _z.firstName) !== null && _0 !== void 0 ? _0 : undefined,
                            lastName: (_3 = (_2 = (_1 = supplier.data) === null || _1 === void 0 ? void 0 : _1.contact) === null || _2 === void 0 ? void 0 : _2.lastName) !== null && _3 !== void 0 ? _3 : undefined
                        },
                        sender: {
                            email: (_4 = buyer.data.email) !== null && _4 !== void 0 ? _4 : "",
                            firstName: buyer.data.firstName,
                            lastName: buyer.data.lastName
                        },
                        paymentTerms: paymentTerms.data
                    });
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate)];
                case 36:
                    html = _8.sent();
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate, { plainText: true })];
                case 37:
                    text = _8.sent();
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .createSignedUrl(documentFilePath, 3600)];
                case 38:
                    signedUrlData = (_8.sent()).data;
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [(_5 = buyer.data.email) !== null && _5 !== void 0 ? _5 : "", supplierEmail],
                            cc: (ccSelections === null || ccSelections === void 0 ? void 0 : ccSelections.length) ? ccSelections : undefined,
                            from: (_6 = buyer.data.email) !== null && _6 !== void 0 ? _6 : "",
                            subject: "Purchase Order ".concat(purchaseOrder.data.purchaseOrderId, " from ").concat(company.data.name),
                            html: html,
                            text: text,
                            attachments: (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl)
                                ? [
                                    {
                                        path: signedUrlData.signedUrl,
                                        filename: fileName
                                    }
                                ]
                                : undefined,
                            companyId: companyId
                        })];
                case 39:
                    _8.sent();
                    _8.label = 40;
                case 40: return [3 /*break*/, 42];
                case 41:
                    err_2 = _8.sent();
                    console.error("Failed to send email after approval:", err_2);
                    return [3 /*break*/, 42];
                case 42: return [4 /*yield*/, (0, settings_1.getCompanySettings)(serviceRole, companyId)];
                case 43:
                    companySettings = _8.sent();
                    if (!(((_7 = companySettings.data) === null || _7 === void 0 ? void 0 : _7.purchasePriceUpdateTiming) ===
                        "Purchase Order Finalize")) return [3 /*break*/, 45];
                    return [4 /*yield*/, serviceRole.functions.invoke("update-purchased-prices", {
                            body: {
                                purchaseOrderId: orderId,
                                companyId: companyId,
                                userId: userId,
                                source: "purchaseOrder",
                                updatePrices: true,
                                updateLeadTimes: false
                            }
                        })];
                case 44:
                    priceUpdate = _8.sent();
                    if (priceUpdate.error) {
                        console.error("Failed to update purchased prices:", priceUpdate.error);
                    }
                    _8.label = 45;
                case 45:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Approval request ".concat(decision.toLowerCase(), " successfully")))];
                case 46: throw _o.apply(void 0, _p.concat([_8.sent()]));
            }
        });
    });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, orderId, _d, purchaseOrder, lines, purchaseOrderDelivery, _e, _f, _g, _h, serviceRole, _j, supplier, interaction, approvalRequest, companySettings, defaultCc, canApprove, canReopen, canDelete, requestedBy, status_1, isRequester, isApprover, itemIds, supplierInteractionId, _k, defaultAttachments, adHocDocs, adHocAttachments, resolvedAttachments;
        var _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing",
                        bypassRls: true
                    })];
                case 1:
                    _c = _1.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getPurchaseOrder)(client, orderId),
                            (0, purchasing_1.getPurchaseOrderLines)(client, orderId),
                            (0, purchasing_1.getPurchaseOrderDelivery)(client, orderId)
                        ])];
                case 2:
                    _d = _1.sent(), purchaseOrder = _d[0], lines = _d[1], purchaseOrderDelivery = _d[2];
                    if (!(((_l = purchaseOrder.data) === null || _l === void 0 ? void 0 : _l.companyId) !== companyId)) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.purchaseOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("You are not authorized to view this purchase order"))];
                case 3: throw _e.apply(void 0, _f.concat([_1.sent()]));
                case 4:
                    if (!purchaseOrder.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.items];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrder.error, "Failed to load purchaseOrder"))];
                case 5: throw _g.apply(void 0, _h.concat([_1.sent()]));
                case 6:
                    if (companyId !== ((_m = purchaseOrder.data) === null || _m === void 0 ? void 0 : _m.companyId)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.purchaseOrders);
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, Promise.all([
                            ((_o = purchaseOrder.data) === null || _o === void 0 ? void 0 : _o.supplierId)
                                ? (0, purchasing_1.getSupplier)(client, purchaseOrder.data.supplierId)
                                : null,
                            (0, purchasing_1.getSupplierInteraction)(client, purchaseOrder.data.supplierInteractionId),
                            // Only fetch approval request if status is "Needs Approval"
                            ((_p = purchaseOrder.data) === null || _p === void 0 ? void 0 : _p.status) === "Needs Approval"
                                ? (0, shared_1.getLatestApprovalRequestForDocument)(serviceRole, "purchaseOrder", orderId)
                                : Promise.resolve({ data: null, error: null }),
                            (0, settings_1.getCompanySettings)(serviceRole, companyId)
                        ])];
                case 7:
                    _j = _1.sent(), supplier = _j[0], interaction = _j[1], approvalRequest = _j[2], companySettings = _j[3];
                    defaultCc = ((_r = (_q = supplier === null || supplier === void 0 ? void 0 : supplier.data) === null || _q === void 0 ? void 0 : _q.defaultCc) === null || _r === void 0 ? void 0 : _r.length)
                        ? supplier.data.defaultCc
                        : ((_t = (_s = companySettings.data) === null || _s === void 0 ? void 0 : _s.defaultSupplierCc) !== null && _t !== void 0 ? _t : []);
                    canApprove = false;
                    canReopen = true;
                    canDelete = true;
                    if (!(approvalRequest.data &&
                        ((_u = purchaseOrder.data) === null || _u === void 0 ? void 0 : _u.status) === "Needs Approval" &&
                        approvalRequest.data.status === "Pending" &&
                        approvalRequest.data.requestedBy)) return [3 /*break*/, 9];
                    requestedBy = approvalRequest.data.requestedBy;
                    status_1 = approvalRequest.data.status;
                    return [4 /*yield*/, (0, shared_1.canApproveRequest)(serviceRole, {
                            amount: approvalRequest.data.amount,
                            documentType: approvalRequest.data.documentType,
                            companyId: approvalRequest.data.companyId
                        }, userId)];
                case 8:
                    canApprove = _1.sent();
                    isRequester = (0, shared_1.canCancelRequest)({
                        requestedBy: requestedBy,
                        status: status_1
                    }, userId);
                    isApprover = canApprove;
                    canReopen = isRequester || isApprover;
                    // Check if user can delete: only requester can delete POs in "Needs Approval"
                    // Approvers should reject instead, normal users have no permission
                    canDelete = isRequester;
                    _1.label = 9;
                case 9:
                    itemIds = Array.from(new Set(((_v = lines.data) !== null && _v !== void 0 ? _v : []).map(function (l) { return l.itemId; }).filter(function (id) { return !!id; })));
                    supplierInteractionId = (_w = purchaseOrder.data) === null || _w === void 0 ? void 0 : _w.supplierInteractionId;
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getDefaultAttachmentsForPO)(serviceRole, {
                                companyId: companyId,
                                supplierId: (_y = (_x = purchaseOrder.data) === null || _x === void 0 ? void 0 : _x.supplierId) !== null && _y !== void 0 ? _y : null,
                                itemIds: itemIds
                            }),
                            supplierInteractionId
                                ? (0, purchasing_1.getSupplierInteractionDocuments)(serviceRole, companyId, supplierInteractionId)
                                : Promise.resolve([])
                        ])];
                case 10:
                    _k = _1.sent(), defaultAttachments = _k[0], adHocDocs = _k[1];
                    adHocAttachments = adHocDocs.map(function (d) {
                        var _a;
                        return ({
                            source: "po",
                            name: d.name,
                            size: ((_a = d.metadata) === null || _a === void 0 ? void 0 : _a.size) != null
                                ? Math.round(d.metadata.size / 1024)
                                : null,
                            path: "".concat(companyId, "/supplier-interaction/").concat(supplierInteractionId, "/").concat(d.name)
                        });
                    });
                    resolvedAttachments = __spreadArray(__spreadArray([], defaultAttachments, true), adHocAttachments, true);
                    return [2 /*return*/, {
                            purchaseOrder: purchaseOrder.data,
                            purchaseOrderDelivery: purchaseOrderDelivery.data,
                            lines: (_z = lines.data) !== null && _z !== void 0 ? _z : [],
                            files: (0, purchasing_1.getSupplierInteractionDocuments)(client, companyId, purchaseOrder.data.supplierInteractionId),
                            interaction: interaction === null || interaction === void 0 ? void 0 : interaction.data,
                            supplier: (_0 = supplier === null || supplier === void 0 ? void 0 : supplier.data) !== null && _0 !== void 0 ? _0 : null,
                            approvalRequest: approvalRequest.data,
                            canApprove: canApprove,
                            canReopen: canReopen,
                            canDelete: canDelete,
                            defaultCc: defaultCc,
                            resolvedAttachments: resolvedAttachments
                        }];
            }
        });
    });
}
function PurchaseOrderRoute() {
    var params = (0, react_router_1.useParams)();
    var orderId = params.orderId;
    if (!orderId)
        throw new Error("Could not find orderId");
    return (<Layout_1.PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <PurchaseOrder_1.PurchaseOrderHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels 
    // explorer={<PurchaseOrderExplorer />}
    content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <react_1.VStack spacing={2} className="p-2">
                    <react_router_1.Outlet />
                  </react_1.VStack>
                </div>} properties={<PurchaseOrder_1.PurchaseOrderProperties key={orderId}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
