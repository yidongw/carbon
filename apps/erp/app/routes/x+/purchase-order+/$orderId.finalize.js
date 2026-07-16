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
var email_1 = require("@carbon/documents/email");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var utils_1 = require("@carbon/utils");
var components_1 = require("@react-email/components");
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var react_router_1 = require("react-router");
var accounting_1 = require("~/modules/accounting");
var documents_1 = require("~/modules/documents");
var purchasing_1 = require("~/modules/purchasing");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var _orderId___pdf_1 = require("~/routes/file+/purchase-order+/$orderId[.]pdf");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, client, companyId, userId, orderId, file, fileName, documentFilePath, serviceRole, purchaseOrder, _b, _c, _d, _e, supplierApprovalRequired, supplier, _f, _g, orderAmount, approvalRequired, finalize, _h, _j, hasPending, rule, approverIds, _k, e_1, _l, _m, companySettings, priceUpdate, acceptLanguage, locales, pdf, documentFileUpload, _o, _p, createDocument, _q, _r, err_1, _s, _t, validation, _u, _v, _w, notification, supplierContact, ccSelections, _x, _y, company, supplier, purchaseOrder_1, purchaseOrderLines, purchaseOrderLocations, paymentTerms, buyer, emailTemplate, html, text, attachments, interactionId, docs, _i, docs_1, doc, storagePath, signedUrlData, itemIds, defaults, _z, defaults_1, r, signedUrlData, totalKb, err_2, _0, _1, _2, _3;
        var _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18;
        return __generator(this, function (_19) {
            switch (_19.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing",
                            role: "employee"
                        })];
                case 1:
                    _a = _19.sent(), client = _a.client, companyId = _a.companyId, userId = _a.userId;
                    orderId = params.orderId;
                    if (!orderId)
                        throw new Error("Could not find orderId");
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, purchasing_1.getPurchaseOrder)(serviceRole, orderId)];
                case 2:
                    purchaseOrder = _19.sent();
                    if (!purchaseOrder.error) return [3 /*break*/, 4];
                    _b = react_router_1.redirect;
                    _c = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(purchaseOrder.error, "Failed to get purchase order"))];
                case 3: throw _b.apply(void 0, _c.concat([_19.sent()]));
                case 4:
                    if (!(purchaseOrder.data.companyId !== companyId)) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchaseOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("You are not authorized to finalize this purchase order"))];
                case 5: throw _d.apply(void 0, _e.concat([_19.sent()]));
                case 6: return [4 /*yield*/, (0, shared_1.isApprovalRequired)(serviceRole, "supplier", companyId)];
                case 7:
                    supplierApprovalRequired = _19.sent();
                    if (!(supplierApprovalRequired && purchaseOrder.data.supplierId)) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, purchasing_1.getSupplier)(serviceRole, purchaseOrder.data.supplierId)];
                case 8:
                    supplier = _19.sent();
                    if (!(((_4 = supplier.data) === null || _4 === void 0 ? void 0 : _4.status) !== "Active")) return [3 /*break*/, 10];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Cannot finalize: supplier is not approved (Active)"))];
                case 9: throw _f.apply(void 0, _g.concat([_19.sent()]));
                case 10:
                    orderAmount = (_5 = purchaseOrder.data.orderTotal) !== null && _5 !== void 0 ? _5 : 0;
                    return [4 /*yield*/, (0, shared_1.isApprovalRequired)(serviceRole, "purchaseOrder", companyId, orderAmount)];
                case 11:
                    approvalRequired = _19.sent();
                    return [4 /*yield*/, (0, purchasing_1.finalizePurchaseOrder)(client, orderId, userId)];
                case 12:
                    finalize = _19.sent();
                    if (!finalize.error) return [3 /*break*/, 14];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(finalize.error, "Failed to finalize purchase order"))];
                case 13: throw _h.apply(void 0, _j.concat([_19.sent()]));
                case 14:
                    if (!approvalRequired) return [3 /*break*/, 27];
                    return [4 /*yield*/, (0, shared_1.hasPendingApproval)(serviceRole, "purchaseOrder", orderId)];
                case 15:
                    hasPending = _19.sent();
                    if (!!hasPending) return [3 /*break*/, 24];
                    return [4 /*yield*/, (0, shared_1.createApprovalRequest)(serviceRole, {
                            documentType: "purchaseOrder",
                            documentId: orderId,
                            companyId: companyId,
                            requestedBy: userId,
                            createdBy: userId,
                            amount: orderAmount
                        })];
                case 16:
                    _19.sent();
                    return [4 /*yield*/, (0, shared_1.getApprovalRuleByAmount)(serviceRole, "purchaseOrder", companyId, orderAmount)];
                case 17:
                    rule = _19.sent();
                    if (!rule.data) return [3 /*break*/, 19];
                    return [4 /*yield*/, (0, shared_1.getApproverUserIdsForRule)(serviceRole, rule.data)];
                case 18:
                    _k = _19.sent();
                    return [3 /*break*/, 20];
                case 19:
                    _k = [];
                    _19.label = 20;
                case 20:
                    approverIds = _k;
                    if (!(approverIds.length > 0)) return [3 /*break*/, 24];
                    _19.label = 21;
                case 21:
                    _19.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            event: notifications_1.NotificationEvent.ApprovalRequested,
                            companyId: companyId,
                            documentId: orderId,
                            documentType: "purchaseOrder",
                            recipient: { type: "users", userIds: approverIds },
                            from: userId
                        })];
                case 22:
                    _19.sent();
                    return [3 /*break*/, 24];
                case 23:
                    e_1 = _19.sent();
                    console.error("Failed to trigger approval notification", e_1);
                    return [3 /*break*/, 24];
                case 24: return [4 /*yield*/, (0, purchasing_1.updatePurchaseOrderStatus)(client, {
                        id: orderId,
                        status: "Needs Approval",
                        assignee: undefined,
                        updatedBy: userId
                    })];
                case 25:
                    _19.sent();
                    _l = react_router_1.redirect;
                    _m = [(_6 = (0, path_1.requestReferrer)(request)) !== null && _6 !== void 0 ? _6 : path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Purchase order submitted for approval"))];
                case 26: throw _l.apply(void 0, _m.concat([_19.sent()]));
                case 27: return [4 /*yield*/, (0, settings_1.getCompanySettings)(serviceRole, companyId)];
                case 28:
                    companySettings = _19.sent();
                    if (!(((_7 = companySettings.data) === null || _7 === void 0 ? void 0 : _7.purchasePriceUpdateTiming) ===
                        "Purchase Order Finalize")) return [3 /*break*/, 30];
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
                case 29:
                    priceUpdate = _19.sent();
                    if (priceUpdate.error) {
                        console.error("Failed to update purchased prices:", priceUpdate.error);
                        // Don't fail the entire finalization, just log the error
                    }
                    _19.label = 30;
                case 30:
                    acceptLanguage = request.headers.get("accept-language");
                    locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
                        validate: Intl.DateTimeFormat.supportedLocalesOf
                    });
                    _19.label = 31;
                case 31:
                    _19.trys.push([31, 40, , 42]);
                    return [4 /*yield*/, (0, _orderId___pdf_1.loader)(args)];
                case 32:
                    pdf = _19.sent();
                    if (pdf.headers.get("content-type") !== "application/pdf")
                        throw new Error("Failed to generate PDF");
                    return [4 /*yield*/, pdf.arrayBuffer()];
                case 33:
                    file = _19.sent();
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
                case 34:
                    documentFileUpload = _19.sent();
                    if (!documentFileUpload.error) return [3 /*break*/, 36];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(documentFileUpload.error, "Failed to upload file"))];
                case 35: throw _o.apply(void 0, _p.concat([_19.sent()]));
                case 36: return [4 /*yield*/, (0, documents_1.upsertDocument)(serviceRole, {
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
                case 37:
                    createDocument = _19.sent();
                    if (!createDocument.error) return [3 /*break*/, 39];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createDocument.error, "Failed to create document"))];
                case 38: return [2 /*return*/, _q.apply(void 0, _r.concat([_19.sent()]))];
                case 39: return [3 /*break*/, 42];
                case 40:
                    err_1 = _19.sent();
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to generate PDF"))];
                case 41: throw _s.apply(void 0, _t.concat([_19.sent()]));
                case 42:
                    _v = (_u = (0, form_1.validator)(purchasing_1.purchaseOrderFinalizeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 43: return [4 /*yield*/, _v.apply(_u, [_19.sent()])];
                case 44:
                    validation = _19.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _w = validation.data, notification = _w.notification, supplierContact = _w.supplierContact, ccSelections = _w.cc;
                    _x = notification;
                    switch (_x) {
                        case "Email": return [3 /*break*/, 45];
                        case undefined: return [3 /*break*/, 63];
                        case "None": return [3 /*break*/, 63];
                    }
                    return [3 /*break*/, 64];
                case 45:
                    _19.trys.push([45, 60, , 62]);
                    if (!supplierContact)
                        throw new Error("Supplier contact is required");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, companyId),
                            (0, purchasing_1.getSupplierContact)(serviceRole, supplierContact),
                            (0, purchasing_1.getPurchaseOrder)(serviceRole, orderId),
                            (0, purchasing_1.getPurchaseOrderLines)(serviceRole, orderId),
                            (0, purchasing_1.getPurchaseOrderLocations)(serviceRole, orderId),
                            (0, accounting_1.getPaymentTermsList)(serviceRole, companyId),
                            (0, users_server_1.getUser)(serviceRole, userId)
                        ])];
                case 46:
                    _y = _19.sent(), company = _y[0], supplier = _y[1], purchaseOrder_1 = _y[2], purchaseOrderLines = _y[3], purchaseOrderLocations = _y[4], paymentTerms = _y[5], buyer = _y[6];
                    if (!((_8 = supplier === null || supplier === void 0 ? void 0 : supplier.data) === null || _8 === void 0 ? void 0 : _8.contact))
                        throw new Error("Failed to get supplier contact");
                    if (!company.data)
                        throw new Error("Failed to get company");
                    if (!buyer.data)
                        throw new Error("Failed to get user");
                    if (!purchaseOrder_1.data)
                        throw new Error("Failed to get purchase order");
                    if (!purchaseOrderLocations.data)
                        throw new Error("Failed to get purchase order locations");
                    if (!paymentTerms.data)
                        throw new Error("Failed to get payment terms");
                    if (!supplier.data.contact.email)
                        return [3 /*break*/, 65];
                    emailTemplate = (0, email_1.PurchaseOrderEmail)({
                        // @ts-expect-error TS2739 - TODO: fix type
                        company: company.data,
                        locale: (_9 = locales === null || locales === void 0 ? void 0 : locales[0]) !== null && _9 !== void 0 ? _9 : "en-US",
                        purchaseOrder: purchaseOrder_1.data,
                        purchaseOrderLines: (_10 = purchaseOrderLines.data) !== null && _10 !== void 0 ? _10 : [],
                        purchaseOrderLocations: purchaseOrderLocations.data,
                        recipient: {
                            email: supplier.data.contact.email,
                            firstName: (_11 = supplier.data.contact.firstName) !== null && _11 !== void 0 ? _11 : undefined,
                            lastName: (_12 = supplier.data.contact.lastName) !== null && _12 !== void 0 ? _12 : undefined
                        },
                        sender: {
                            email: (_13 = buyer.data.email) !== null && _13 !== void 0 ? _13 : "",
                            firstName: buyer.data.firstName,
                            lastName: buyer.data.lastName
                        },
                        paymentTerms: paymentTerms.data
                    });
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate)];
                case 47:
                    html = _19.sent();
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate, { plainText: true })];
                case 48:
                    text = _19.sent();
                    attachments = [];
                    interactionId = purchaseOrder_1.data.supplierInteractionId;
                    if (!interactionId) return [3 /*break*/, 53];
                    return [4 /*yield*/, (0, purchasing_1.getSupplierInteractionDocuments)(serviceRole, companyId, interactionId)];
                case 49:
                    docs = _19.sent();
                    _i = 0, docs_1 = docs;
                    _19.label = 50;
                case 50:
                    if (!(_i < docs_1.length)) return [3 /*break*/, 53];
                    doc = docs_1[_i];
                    storagePath = "".concat(companyId, "/supplier-interaction/").concat(interactionId, "/").concat(doc.name);
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .createSignedUrl(storagePath, 3600)];
                case 51:
                    signedUrlData = (_19.sent()).data;
                    if (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl) {
                        attachments.push({
                            filename: doc.name,
                            path: signedUrlData.signedUrl
                        });
                    }
                    _19.label = 52;
                case 52:
                    _i++;
                    return [3 /*break*/, 50];
                case 53:
                    itemIds = Array.from(new Set(((_14 = purchaseOrderLines.data) !== null && _14 !== void 0 ? _14 : [])
                        .map(function (l) { return l.itemId; })
                        .filter(function (id) { return !!id; })));
                    return [4 /*yield*/, (0, purchasing_1.getDefaultAttachmentsForPO)(serviceRole, {
                            companyId: companyId,
                            supplierId: (_15 = purchaseOrder_1.data.supplierId) !== null && _15 !== void 0 ? _15 : null,
                            itemIds: itemIds
                        })];
                case 54:
                    defaults = _19.sent();
                    _z = 0, defaults_1 = defaults;
                    _19.label = 55;
                case 55:
                    if (!(_z < defaults_1.length)) return [3 /*break*/, 58];
                    r = defaults_1[_z];
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .createSignedUrl(r.path, 3600)];
                case 56:
                    signedUrlData = (_19.sent()).data;
                    if (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl) {
                        attachments.push({
                            filename: r.name,
                            path: signedUrlData.signedUrl
                        });
                    }
                    _19.label = 57;
                case 57:
                    _z++;
                    return [3 /*break*/, 55];
                case 58:
                    totalKb = attachments.length
                        ? Math.round(file.byteLength / 1024) +
                            defaults.reduce(function (sum, r) { var _a; return sum + ((_a = r.size) !== null && _a !== void 0 ? _a : 0); }, 0)
                        : 0;
                    if (totalKb > utils_1.PO_EMAIL_ATTACHMENT_LIMIT_MB * 1024) {
                        throw new Error("Total attachments exceed ".concat(utils_1.PO_EMAIL_ATTACHMENT_LIMIT_MB, " MB limit"));
                    }
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [(_16 = buyer.data.email) !== null && _16 !== void 0 ? _16 : "", supplier.data.contact.email],
                            cc: (ccSelections === null || ccSelections === void 0 ? void 0 : ccSelections.length) ? ccSelections : undefined,
                            from: (_17 = buyer.data.email) !== null && _17 !== void 0 ? _17 : "",
                            subject: "Purchase Order ".concat(purchaseOrder_1.data.purchaseOrderId, " from ").concat(company.data.name),
                            html: html,
                            text: text,
                            attachments: attachments.length ? attachments : undefined,
                            companyId: companyId
                        })];
                case 59:
                    _19.sent();
                    return [3 /*break*/, 62];
                case 60:
                    err_2 = _19.sent();
                    _0 = react_router_1.redirect;
                    _1 = [path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_2, "Failed to send email"))];
                case 61: throw _0.apply(void 0, _1.concat([_19.sent()]));
                case 62: return [3 /*break*/, 65];
                case 63: return [3 /*break*/, 65];
                case 64: throw new Error("Invalid notification type");
                case 65:
                    _2 = react_router_1.redirect;
                    _3 = [(_18 = (0, path_1.requestReferrer)(request)) !== null && _18 !== void 0 ? _18 : path_1.path.to.purchaseOrder(orderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Purchase order finalized"))];
                case 66: throw _2.apply(void 0, _3.concat([_19.sent()]));
            }
        });
    });
}
