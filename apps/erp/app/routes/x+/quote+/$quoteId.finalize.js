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
var session_server_1 = require("@carbon/auth/session.server");
var email_1 = require("@carbon/documents/email");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var date_1 = require("@internationalized/date");
var components_1 = require("@react-email/components");
var react_router_1 = require("react-router");
var documents_1 = require("~/modules/documents");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var users_server_1 = require("~/modules/users/users.server");
var _id___pdf_1 = require("~/routes/file+/quote+/$id[.]pdf");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, client, companyId, userId, quoteId, file, fileName, documentFilePath, quote, _b, _c, externalLink, pdf, documentFileUpload, _d, _e, createDocument, _f, _g, finalize, _h, _j, err_1, _k, _l, validation, _m, _o, _p, notification, customerContactId, ccSelections, _q, _r, company, companySettings, customer, customerContact, user, emailTemplate, html, text, signedUrlData, err_2, _s, _t, _u, _v;
        var _w, _x, _y, _z, _0;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales",
                            role: "employee",
                            bypassRls: true
                        })];
                case 1:
                    _a = _1.sent(), client = _a.client, companyId = _a.companyId, userId = _a.userId;
                    quoteId = params.quoteId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    return [4 /*yield*/, (0, sales_1.getQuote)(client, quoteId)];
                case 2:
                    quote = _1.sent();
                    if (!quote.error) return [3 /*break*/, 4];
                    _b = react_router_1.redirect;
                    _c = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to get quote"))];
                case 3: throw _b.apply(void 0, _c.concat([_1.sent()]));
                case 4: return [4 /*yield*/, (0, shared_1.upsertExternalLink)(client, {
                        id: (_w = quote.data.externalLinkId) !== null && _w !== void 0 ? _w : undefined, // TODO
                        documentType: "Quote",
                        documentId: quoteId,
                        customerId: quote.data.customerId,
                        expiresAt: quote.data.expirationDate,
                        companyId: companyId
                    })];
                case 5:
                    externalLink = _1.sent();
                    if (!(externalLink.data && quote.data.externalLinkId !== externalLink.data.id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("quote")
                            .update({
                            externalLinkId: externalLink.data.id,
                            completedDate: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString()
                        })
                            .eq("id", quoteId)];
                case 6:
                    _1.sent();
                    _1.label = 7;
                case 7:
                    _1.trys.push([7, 19, , 21]);
                    return [4 /*yield*/, (0, _id___pdf_1.loader)(__assign(__assign({}, args), { params: { id: quoteId } }))];
                case 8:
                    pdf = _1.sent();
                    if (pdf.headers.get("content-type") !== "application/pdf")
                        throw new Error("Failed to generate PDF");
                    return [4 /*yield*/, pdf.arrayBuffer()];
                case 9:
                    file = _1.sent();
                    fileName = (0, string_1.stripSpecialCharacters)("".concat(quote.data.quoteId, " - ").concat(new Date().toISOString().slice(0, -5), ".pdf"));
                    documentFilePath = "".concat(companyId, "/opportunity/").concat(quote.data.opportunityId, "/").concat(fileName);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .upload(documentFilePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            contentType: "application/pdf",
                            upsert: true
                        })];
                case 10:
                    documentFileUpload = _1.sent();
                    if (!documentFileUpload.error) return [3 /*break*/, 12];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(documentFileUpload.error, "Failed to upload file"))];
                case 11: throw _d.apply(void 0, _e.concat([_1.sent()]));
                case 12: return [4 /*yield*/, (0, documents_1.upsertDocument)(client, {
                        path: documentFilePath,
                        name: fileName,
                        size: Math.round(file.byteLength / 1024),
                        sourceDocument: "Quote",
                        sourceDocumentId: quoteId,
                        readGroups: [userId],
                        writeGroups: [userId],
                        createdBy: userId,
                        companyId: companyId
                    })];
                case 13:
                    createDocument = _1.sent();
                    if (!createDocument.error) return [3 /*break*/, 15];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createDocument.error, "Failed to create document"))];
                case 14: return [2 /*return*/, _f.apply(void 0, _g.concat([_1.sent()]))];
                case 15: return [4 /*yield*/, (0, sales_1.finalizeQuote)(client, quoteId, userId)];
                case 16:
                    finalize = _1.sent();
                    if (!finalize.error) return [3 /*break*/, 18];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(finalize.error, "Failed to finalize quote"))];
                case 17: throw _h.apply(void 0, _j.concat([_1.sent()]));
                case 18: return [3 /*break*/, 21];
                case 19:
                    err_1 = _1.sent();
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to finalize quote"))];
                case 20: throw _k.apply(void 0, _l.concat([_1.sent()]));
                case 21:
                    _o = (_m = (0, form_1.validator)(sales_1.quoteFinalizeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 22: return [4 /*yield*/, _o.apply(_m, [_1.sent()])];
                case 23:
                    validation = _1.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _p = validation.data, notification = _p.notification, customerContactId = _p.customerContact, ccSelections = _p.cc;
                    _q = notification;
                    switch (_q) {
                        case "Email": return [3 /*break*/, 24];
                        case undefined: return [3 /*break*/, 33];
                        case "None": return [3 /*break*/, 33];
                    }
                    return [3 /*break*/, 34];
                case 24:
                    _1.trys.push([24, 30, , 32]);
                    if (!customerContactId)
                        throw new Error("Customer contact is required");
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(client, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, sales_1.getCustomer)(client, quote.data.customerId),
                            (0, sales_1.getCustomerContact)(client, customerContactId),
                            (0, users_server_1.getUser)(client, userId)
                        ])];
                case 25:
                    _r = _1.sent(), company = _r[0], companySettings = _r[1], customer = _r[2], customerContact = _r[3], user = _r[4];
                    if (!company.data)
                        throw new Error("Failed to get company");
                    if (!companySettings.data)
                        throw new Error("Failed to get company settings");
                    if (!customer.data)
                        throw new Error("Failed to get customer");
                    if (!customerContact.data)
                        throw new Error("Failed to get customer contact");
                    if (!user.data)
                        throw new Error("Failed to get user");
                    emailTemplate = (0, email_1.QuoteEmail)({
                        // @ts-expect-error TS2739 - TODO: fix type
                        company: company.data,
                        companySettings: companySettings.data,
                        // @ts-expect-error
                        quote: quote.data,
                        recipient: {
                            email: (_x = customerContact.data) === null || _x === void 0 ? void 0 : _x.contact.email,
                            firstName: customerContact.data.contact.firstName,
                            lastName: customerContact.data.contact.lastName
                        },
                        sender: {
                            email: (_y = user.data.email) !== null && _y !== void 0 ? _y : "",
                            firstName: user.data.firstName,
                            lastName: user.data.lastName
                        }
                    });
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate)];
                case 26:
                    html = _1.sent();
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate, { plainText: true })];
                case 27:
                    text = _1.sent();
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .createSignedUrl(documentFilePath, 3600)];
                case 28:
                    signedUrlData = (_1.sent()).data;
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [(_z = user.data.email) !== null && _z !== void 0 ? _z : "", customerContact.data.contact.email],
                            cc: (ccSelections === null || ccSelections === void 0 ? void 0 : ccSelections.length) ? ccSelections : undefined,
                            from: (_0 = user.data.email) !== null && _0 !== void 0 ? _0 : "",
                            subject: "Quote ".concat(quote.data.quoteId),
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
                case 29:
                    _1.sent();
                    return [3 /*break*/, 32];
                case 30:
                    err_2 = _1.sent();
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_2, "Failed to send email"))];
                case 31: throw _s.apply(void 0, _t.concat([_1.sent()]));
                case 32: return [3 /*break*/, 35];
                case 33: return [3 /*break*/, 35];
                case 34: throw new Error("Invalid notification type");
                case 35:
                    _u = react_router_1.redirect;
                    _v = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Quote finalized successfully"))];
                case 36: throw _u.apply(void 0, _v.concat([_1.sent()]));
            }
        });
    });
}
