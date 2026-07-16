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
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, client, companyId, userId, id, quote, _b, _c, externalLink, send, _d, _e, err_1, _f, _g, validation, _h, _j, _k, notification, supplierContactId, ccSelections, _l, _m, company, supplierContact, supplierQuote, user, attachments, interactionId, topDocs, _i, topDocs_1, doc, storagePath, signedUrlData, lines, _o, _p, line, docs, _q, docs_1, doc, storagePath, signedUrlData, requestUrl, baseUrl, externalQuoteUrl, emailSubject, emailBody, emailSignature, err_2, _r, _s, _t, _u;
        var _v, _w, _x, _y, _z, _0, _1, _2;
        return __generator(this, function (_3) {
            switch (_3.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing",
                            role: "employee",
                            bypassRls: true
                        })];
                case 1:
                    _a = _3.sent(), client = _a.client, companyId = _a.companyId, userId = _a.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find supplier quote id");
                    return [4 /*yield*/, (0, purchasing_1.getSupplierQuote)(client, id)];
                case 2:
                    quote = _3.sent();
                    if (!quote.error) return [3 /*break*/, 4];
                    _b = react_router_1.redirect;
                    _c = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to get supplier quote"))];
                case 3: throw _b.apply(void 0, _c.concat([_3.sent()]));
                case 4: return [4 /*yield*/, (0, shared_1.upsertExternalLink)(client, {
                        id: (_v = quote.data.externalLinkId) !== null && _v !== void 0 ? _v : undefined,
                        documentType: "SupplierQuote",
                        documentId: id,
                        supplierId: quote.data.supplierId,
                        expiresAt: quote.data.expirationDate,
                        companyId: companyId
                    })];
                case 5:
                    externalLink = _3.sent();
                    if (!(externalLink.data && quote.data.externalLinkId !== externalLink.data.id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("supplierQuote")
                            .update({
                            externalLinkId: externalLink.data.id
                        })
                            .eq("id", id)];
                case 6:
                    _3.sent();
                    _3.label = 7;
                case 7:
                    _3.trys.push([7, 11, , 13]);
                    return [4 /*yield*/, (0, purchasing_1.sendSupplierQuote)(client, id, userId)];
                case 8:
                    send = _3.sent();
                    if (!send.error) return [3 /*break*/, 10];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(send.error, "Failed to send supplier quote"))];
                case 9: throw _d.apply(void 0, _e.concat([_3.sent()]));
                case 10: return [3 /*break*/, 13];
                case 11:
                    err_1 = _3.sent();
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to send supplier quote"))];
                case 12: throw _f.apply(void 0, _g.concat([_3.sent()]));
                case 13:
                    _j = (_h = (0, form_1.validator)(purchasing_1.supplierQuoteFinalizeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 14: return [4 /*yield*/, _j.apply(_h, [_3.sent()])];
                case 15:
                    validation = _3.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _k = validation.data, notification = _k.notification, supplierContactId = _k.supplierContact, ccSelections = _k.cc;
                    _l = notification;
                    switch (_l) {
                        case "Email": return [3 /*break*/, 16];
                        case undefined: return [3 /*break*/, 35];
                        case "Share": return [3 /*break*/, 35];
                    }
                    return [3 /*break*/, 36];
                case 16:
                    _3.trys.push([16, 32, , 34]);
                    if (!supplierContactId)
                        throw new Error("Supplier contact is required");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, purchasing_1.getSupplierContact)(client, supplierContactId),
                            (0, purchasing_1.getSupplierQuote)(client, id),
                            (0, users_server_1.getUser)(client, userId)
                        ])];
                case 17:
                    _m = _3.sent(), company = _m[0], supplierContact = _m[1], supplierQuote = _m[2], user = _m[3];
                    if (!company.data)
                        throw new Error("Failed to get company");
                    if (!((_w = supplierContact === null || supplierContact === void 0 ? void 0 : supplierContact.data) === null || _w === void 0 ? void 0 : _w.contact))
                        throw new Error("Failed to get supplier contact");
                    if (!supplierQuote.data)
                        throw new Error("Failed to get supplier quote");
                    if (!user.data)
                        throw new Error("Failed to get user");
                    attachments = [];
                    interactionId = supplierQuote.data.supplierInteractionId;
                    if (!interactionId) return [3 /*break*/, 22];
                    return [4 /*yield*/, (0, purchasing_1.getSupplierInteractionDocuments)(client, companyId, interactionId)];
                case 18:
                    topDocs = _3.sent();
                    _i = 0, topDocs_1 = topDocs;
                    _3.label = 19;
                case 19:
                    if (!(_i < topDocs_1.length)) return [3 /*break*/, 22];
                    doc = topDocs_1[_i];
                    storagePath = "".concat(companyId, "/supplier-interaction/").concat(interactionId, "/").concat(doc.name);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .createSignedUrl(storagePath, 3600)];
                case 20:
                    signedUrlData = (_3.sent()).data;
                    if (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl) {
                        attachments.push({
                            filename: doc.name,
                            path: signedUrlData.signedUrl
                        });
                    }
                    _3.label = 21;
                case 21:
                    _i++;
                    return [3 /*break*/, 19];
                case 22: return [4 /*yield*/, (0, purchasing_1.getSupplierQuoteLines)(client, id)];
                case 23:
                    lines = _3.sent();
                    if (!lines.data) return [3 /*break*/, 30];
                    _o = 0, _p = lines.data;
                    _3.label = 24;
                case 24:
                    if (!(_o < _p.length)) return [3 /*break*/, 30];
                    line = _p[_o];
                    return [4 /*yield*/, (0, purchasing_1.getSupplierInteractionLineDocuments)(client, companyId, (_x = line.id) !== null && _x !== void 0 ? _x : "")];
                case 25:
                    docs = _3.sent();
                    _q = 0, docs_1 = docs;
                    _3.label = 26;
                case 26:
                    if (!(_q < docs_1.length)) return [3 /*break*/, 29];
                    doc = docs_1[_q];
                    storagePath = "".concat(companyId, "/supplier-interaction-line/").concat(line.id, "/").concat(doc.name);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .createSignedUrl(storagePath, 3600)];
                case 27:
                    signedUrlData = (_3.sent()).data;
                    if (signedUrlData === null || signedUrlData === void 0 ? void 0 : signedUrlData.signedUrl) {
                        attachments.push({
                            filename: doc.name,
                            path: signedUrlData.signedUrl
                        });
                    }
                    _3.label = 28;
                case 28:
                    _q++;
                    return [3 /*break*/, 26];
                case 29:
                    _o++;
                    return [3 /*break*/, 24];
                case 30:
                    requestUrl = new URL(request.url);
                    baseUrl = "".concat(requestUrl.protocol, "//").concat(requestUrl.host);
                    externalQuoteUrl = "".concat(baseUrl).concat(path_1.path.to.externalSupplierQuote((_z = (_y = externalLink.data) === null || _y === void 0 ? void 0 : _y.id) !== null && _z !== void 0 ? _z : ""));
                    emailSubject = "Supplier Quote ".concat(supplierQuote.data.supplierQuoteId, " from ").concat(company.data.name);
                    emailBody = "Hey ".concat(supplierContact.data.contact.firstName || "there", ",\n\nPlease provide pricing and lead time(s) for the linked quote:");
                    emailSignature = "Thanks,\n".concat(user.data.firstName, " ").concat(user.data.lastName, "\n").concat(company.data.name);
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [
                                (_0 = user.data.email) !== null && _0 !== void 0 ? _0 : "",
                                (_1 = supplierContact.data.contact) === null || _1 === void 0 ? void 0 : _1.email
                            ].filter(Boolean),
                            cc: (ccSelections === null || ccSelections === void 0 ? void 0 : ccSelections.length) ? ccSelections : undefined,
                            from: (_2 = user.data.email) !== null && _2 !== void 0 ? _2 : "",
                            subject: emailSubject,
                            html: "".concat(emailBody.replace(/\n/g, "<br>"), "<br><a href=\"").concat(externalQuoteUrl, "\">").concat(externalQuoteUrl, "</a><br><br>").concat(emailSignature.replace(/\n/g, "<br>")),
                            text: "".concat(emailBody, "\n\n").concat(externalQuoteUrl, "\n\n").concat(emailSignature),
                            attachments: attachments,
                            companyId: companyId
                        })];
                case 31:
                    _3.sent();
                    return [3 /*break*/, 34];
                case 32:
                    err_2 = _3.sent();
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_2, "Failed to send email"))];
                case 33: throw _r.apply(void 0, _s.concat([_3.sent()]));
                case 34: return [3 /*break*/, 37];
                case 35: return [3 /*break*/, 37];
                case 36: throw new Error("Invalid notification type");
                case 37:
                    _t = react_router_1.redirect;
                    _u = [path_1.path.to.supplierQuote(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Supplier quote sent successfully"))];
                case 38: throw _t.apply(void 0, _u.concat([_3.sent()]));
            }
        });
    });
}
