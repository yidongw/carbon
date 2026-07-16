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
var jobs_1 = require("@carbon/jobs");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, rfqId, validation, _d, _e, supplierContacts, _f, rfqResult, linesResult, suppliersResult, _g, _h, _j, _k, _l, _m, lines, suppliers, _o, _p, _q, _r, _s, company, user, requestUrl, baseUrl, createdQuotes, emailsToSend, _loop_1, _i, suppliers_1, rfqSupplier, attachments, rfqDocs, _t, rfqDocs_1, doc, storagePath, signedUrlData, _u, lines_1, line, lineDocs, _v, lineDocs_1, doc, storagePath, signedUrlData, internalNotes, notesHtml, _w, emailsToSend_1, email, externalQuoteUrl, emailSubject, emailBody, emailSignature, htmlParts, err_1, _x, _y;
        var _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_14) {
            switch (_14.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing",
                            role: "employee",
                            bypassRls: true
                        })];
                case 1:
                    _c = _14.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    rfqId = params.rfqId;
                    if (!rfqId)
                        throw new Error("Could not find rfqId");
                    _e = (_d = (0, form_1.validator)(purchasing_1.purchasingRfqFinalizeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_14.sent()])];
                case 3:
                    validation = _14.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    supplierContacts = validation.data.suppliers;
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_1.getPurchasingRFQ)(client, rfqId),
                            (0, purchasing_1.getPurchasingRFQLines)(client, rfqId),
                            (0, purchasing_1.getPurchasingRFQSuppliers)(client, rfqId)
                        ])];
                case 4:
                    _f = _14.sent(), rfqResult = _f[0], linesResult = _f[1], suppliersResult = _f[2];
                    if (!rfqResult.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rfqResult.error, "Failed to load RFQ"))];
                case 5: throw _g.apply(void 0, _h.concat([_14.sent()]));
                case 6:
                    if (!linesResult.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(linesResult.error, "Failed to load RFQ lines"))];
                case 7: throw _j.apply(void 0, _k.concat([_14.sent()]));
                case 8:
                    if (!suppliersResult.error) return [3 /*break*/, 10];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(suppliersResult.error, "Failed to load RFQ suppliers"))];
                case 9: throw _l.apply(void 0, _m.concat([_14.sent()]));
                case 10:
                    lines = (_z = linesResult.data) !== null && _z !== void 0 ? _z : [];
                    suppliers = (_0 = suppliersResult.data) !== null && _0 !== void 0 ? _0 : [];
                    if (!(suppliers.length === 0)) return [3 /*break*/, 12];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "No suppliers found for this RFQ"))];
                case 11: throw _o.apply(void 0, _p.concat([_14.sent()]));
                case 12:
                    if (!(lines.length === 0)) return [3 /*break*/, 14];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "No line items found for this RFQ"))];
                case 13: throw _q.apply(void 0, _r.concat([_14.sent()]));
                case 14: return [4 /*yield*/, Promise.all([
                        (0, settings_1.getCompany)(client, companyId),
                        (0, users_server_1.getUser)(client, userId)
                    ])];
                case 15:
                    _s = _14.sent(), company = _s[0], user = _s[1];
                    requestUrl = new URL(request.url);
                    baseUrl = "".concat(requestUrl.protocol, "//").concat(requestUrl.host);
                    createdQuotes = [];
                    emailsToSend = [];
                    _loop_1 = function (rfqSupplier) {
                        var supplierId, supplierContactData, quoteResult, supplierQuoteId, supplierQuoteReadableId, _15, lines_2, line, existingLink, externalLinkResult, supplierContact;
                        return __generator(this, function (_16) {
                            switch (_16.label) {
                                case 0:
                                    supplierId = rfqSupplier.supplierId;
                                    supplierContactData = supplierContacts.find(function (sc) { return sc.supplierId === supplierId; });
                                    return [4 /*yield*/, (0, purchasing_1.insertSupplierQuote)(client, {
                                            supplierId: supplierId,
                                            companyId: companyId,
                                            companyGroupId: companyGroupId,
                                            createdBy: userId
                                        })];
                                case 1:
                                    quoteResult = _16.sent();
                                    if (quoteResult.error || !quoteResult.data) {
                                        console.error("Failed to create supplier quote:", quoteResult.error);
                                        return [2 /*return*/, "continue"];
                                    }
                                    supplierQuoteId = quoteResult.data.id;
                                    supplierQuoteReadableId = quoteResult.data.supplierQuoteId;
                                    createdQuotes.push(supplierQuoteId);
                                    _15 = 0, lines_2 = lines;
                                    _16.label = 2;
                                case 2:
                                    if (!(_15 < lines_2.length)) return [3 /*break*/, 5];
                                    line = lines_2[_15];
                                    // Skip lines without an itemId since supplierQuoteLine.itemId is NOT NULL
                                    if (!line.itemId) {
                                        console.warn("Skipping line without itemId:", line.id);
                                        return [3 /*break*/, 4];
                                    }
                                    return [4 /*yield*/, (0, purchasing_1.upsertSupplierQuoteLine)(client, {
                                            supplierQuoteId: supplierQuoteId,
                                            supplierQuoteLineType: "Part",
                                            itemId: line.itemId,
                                            description: (_1 = line.description) !== null && _1 !== void 0 ? _1 : "",
                                            quantity: (_2 = line.quantity) !== null && _2 !== void 0 ? _2 : [1],
                                            inventoryUnitOfMeasureCode: (_3 = line.inventoryUnitOfMeasureCode) !== null && _3 !== void 0 ? _3 : "EA",
                                            purchaseUnitOfMeasureCode: (_4 = line.purchaseUnitOfMeasureCode) !== null && _4 !== void 0 ? _4 : "EA",
                                            conversionFactor: (_5 = line.conversionFactor) !== null && _5 !== void 0 ? _5 : 1,
                                            companyId: companyId,
                                            createdBy: userId
                                        })];
                                case 3:
                                    _16.sent();
                                    _16.label = 4;
                                case 4:
                                    _15++;
                                    return [3 /*break*/, 2];
                                case 5: 
                                // Link RFQ to supplier quote
                                return [4 /*yield*/, client.from("purchasingRfqToSupplierQuote").insert({
                                        purchasingRfqId: rfqId,
                                        supplierQuoteId: supplierQuoteId,
                                        companyId: companyId
                                    })];
                                case 6:
                                    // Link RFQ to supplier quote
                                    _16.sent();
                                    return [4 /*yield*/, client
                                            .from("externalLink")
                                            .select("id")
                                            .eq("documentId", supplierQuoteId)
                                            .eq("documentType", "SupplierQuote")
                                            .eq("companyId", companyId)
                                            .maybeSingle()];
                                case 7:
                                    existingLink = _16.sent();
                                    return [4 /*yield*/, (0, shared_1.upsertExternalLink)(client, {
                                            id: (_6 = existingLink.data) === null || _6 === void 0 ? void 0 : _6.id,
                                            documentType: "SupplierQuote",
                                            documentId: supplierQuoteId,
                                            supplierId: supplierId,
                                            companyId: companyId
                                        })];
                                case 8:
                                    externalLinkResult = _16.sent();
                                    if (!externalLinkResult.data) return [3 /*break*/, 10];
                                    return [4 /*yield*/, client
                                            .from("supplierQuote")
                                            .update({ externalLinkId: externalLinkResult.data.id })
                                            .eq("id", supplierQuoteId)];
                                case 9:
                                    _16.sent();
                                    _16.label = 10;
                                case 10:
                                    if (!((supplierContactData === null || supplierContactData === void 0 ? void 0 : supplierContactData.contactId) && externalLinkResult.data)) return [3 /*break*/, 12];
                                    return [4 /*yield*/, (0, purchasing_1.getSupplierContact)(client, supplierContactData.contactId)];
                                case 11:
                                    supplierContact = _16.sent();
                                    if ((_8 = (_7 = supplierContact === null || supplierContact === void 0 ? void 0 : supplierContact.data) === null || _7 === void 0 ? void 0 : _7.contact) === null || _8 === void 0 ? void 0 : _8.email) {
                                        emailsToSend.push({
                                            contactEmail: supplierContact.data.contact.email,
                                            contactFirstName: (_9 = supplierContact.data.contact.firstName) !== null && _9 !== void 0 ? _9 : "there",
                                            supplierQuoteId: supplierQuoteId,
                                            supplierQuoteReadableId: supplierQuoteReadableId,
                                            externalLinkId: externalLinkResult.data.id
                                        });
                                    }
                                    _16.label = 12;
                                case 12: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, suppliers_1 = suppliers;
                    _14.label = 16;
                case 16:
                    if (!(_i < suppliers_1.length)) return [3 /*break*/, 19];
                    rfqSupplier = suppliers_1[_i];
                    return [5 /*yield**/, _loop_1(rfqSupplier)];
                case 17:
                    _14.sent();
                    _14.label = 18;
                case 18:
                    _i++;
                    return [3 /*break*/, 16];
                case 19: 
                // Update RFQ status to Requested
                return [4 /*yield*/, (0, purchasing_1.updatePurchasingRFQStatus)(client, {
                        id: rfqId,
                        status: "Requested",
                        updatedBy: userId
                    })];
                case 20:
                    // Update RFQ status to Requested
                    _14.sent();
                    if (!(emailsToSend.length > 0 && company.data && user.data)) return [3 /*break*/, 38];
                    attachments = [];
                    return [4 /*yield*/, (0, purchasing_1.getSupplierInteractionDocuments)(client, companyId, rfqId)];
                case 21:
                    rfqDocs = _14.sent();
                    _t = 0, rfqDocs_1 = rfqDocs;
                    _14.label = 22;
                case 22:
                    if (!(_t < rfqDocs_1.length)) return [3 /*break*/, 25];
                    doc = rfqDocs_1[_t];
                    storagePath = "".concat(companyId, "/supplier-interaction/").concat(rfqId, "/").concat(doc.name);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .createSignedUrl(storagePath, 3600)];
                case 23:
                    signedUrlData = (_14.sent()).data;
                    if (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl) {
                        attachments.push({ filename: doc.name, path: signedUrlData.signedUrl });
                    }
                    _14.label = 24;
                case 24:
                    _t++;
                    return [3 /*break*/, 22];
                case 25:
                    _u = 0, lines_1 = lines;
                    _14.label = 26;
                case 26:
                    if (!(_u < lines_1.length)) return [3 /*break*/, 32];
                    line = lines_1[_u];
                    if (!line.id)
                        return [3 /*break*/, 31];
                    return [4 /*yield*/, (0, purchasing_1.getSupplierInteractionLineDocuments)(client, companyId, line.id)];
                case 27:
                    lineDocs = _14.sent();
                    _v = 0, lineDocs_1 = lineDocs;
                    _14.label = 28;
                case 28:
                    if (!(_v < lineDocs_1.length)) return [3 /*break*/, 31];
                    doc = lineDocs_1[_v];
                    storagePath = "".concat(companyId, "/supplier-interaction-line/").concat(line.id, "/").concat(doc.name);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .createSignedUrl(storagePath, 3600)];
                case 29:
                    signedUrlData = (_14.sent()).data;
                    if (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl) {
                        attachments.push({
                            filename: doc.name,
                            path: signedUrlData.signedUrl
                        });
                    }
                    _14.label = 30;
                case 30:
                    _v++;
                    return [3 /*break*/, 28];
                case 31:
                    _u++;
                    return [3 /*break*/, 26];
                case 32:
                    internalNotes = ((_11 = (_10 = rfqResult.data) === null || _10 === void 0 ? void 0 : _10.internalNotes) !== null && _11 !== void 0 ? _11 : {});
                    notesHtml = (0, utils_1.tiptapToHTML)(internalNotes);
                    _w = 0, emailsToSend_1 = emailsToSend;
                    _14.label = 33;
                case 33:
                    if (!(_w < emailsToSend_1.length)) return [3 /*break*/, 38];
                    email = emailsToSend_1[_w];
                    _14.label = 34;
                case 34:
                    _14.trys.push([34, 36, , 37]);
                    externalQuoteUrl = "".concat(baseUrl).concat(path_1.path.to.externalSupplierQuote(email.externalLinkId));
                    emailSubject = "Supplier Quote ".concat(email.supplierQuoteReadableId, " from ").concat(company.data.name);
                    emailBody = "Hey ".concat(email.contactFirstName, ",\n\nPlease provide pricing and lead time(s) for the linked quote:");
                    emailSignature = "Thanks,\n".concat(user.data.firstName, " ").concat(user.data.lastName, "\n").concat(company.data.name);
                    htmlParts = [
                        emailBody.replace(/\n/g, "<br>"),
                        "<br><a href=\"".concat(externalQuoteUrl, "\">").concat(externalQuoteUrl, "</a>")
                    ];
                    if (notesHtml) {
                        htmlParts.push("<br><br>".concat(notesHtml));
                    }
                    htmlParts.push("<br><br>".concat(emailSignature.replace(/\n/g, "<br>")));
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [(_12 = user.data.email) !== null && _12 !== void 0 ? _12 : "", email.contactEmail],
                            from: (_13 = user.data.email) !== null && _13 !== void 0 ? _13 : "",
                            subject: emailSubject,
                            html: htmlParts.join(""),
                            text: "".concat(emailBody, "\n\n").concat(externalQuoteUrl, "\n\n").concat(emailSignature),
                            attachments: attachments,
                            companyId: companyId
                        })];
                case 35:
                    _14.sent();
                    return [3 /*break*/, 37];
                case 36:
                    err_1 = _14.sent();
                    console.error("Failed to send email:", err_1);
                    return [3 /*break*/, 37];
                case 37:
                    _w++;
                    return [3 /*break*/, 33];
                case 38:
                    _x = react_router_1.redirect;
                    _y = [path_1.path.to.purchasingRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Created ".concat(createdQuotes.length, " supplier quote(s)").concat(emailsToSend.length > 0
                            ? " and sent ".concat(emailsToSend.length, " email(s)")
                            : "")))];
                case 39: throw _x.apply(void 0, _y.concat([_14.sent()]));
            }
        });
    });
}
