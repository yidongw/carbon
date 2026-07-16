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
var email_1 = require("@carbon/documents/email");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var components_1 = require("@react-email/components");
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var accounting_1 = require("~/modules/accounting");
var documents_1 = require("~/modules/documents");
var invoicing_1 = require("~/modules/invoicing");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
var users_server_1 = require("~/modules/users/users.server");
var _id___pdf_1 = require("~/routes/file+/sales-invoice+/$id[.]pdf");
var string_1 = require("~/utils/string");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, client, companyId, userId, invoiceId, file, fileName, documentFilePath, setPendingState, serviceRole, postSalesInvoice, err_1, salesInvoice, acceptLanguage, locales, pdf, documentFileUpload, createDocument, err_2, validation, _b, _c, _d, notification, customerContact, ccSelections, _e, _f, company, customer, salesInvoice_1, salesInvoiceLines, salesInvoiceLocations, salesInvoiceShipment, seller, paymentTerms, emailTemplate, html, text, signedUrlData, err_3;
        var _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "invoicing",
                            role: "employee"
                        })];
                case 1:
                    _a = _q.sent(), client = _a.client, companyId = _a.companyId, userId = _a.userId;
                    invoiceId = params.invoiceId;
                    if (!invoiceId) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Could not find invoiceId"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .update({
                            status: "Pending"
                        })
                            .eq("id", invoiceId)];
                case 2:
                    setPendingState = _q.sent();
                    if (setPendingState.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to update sales invoice status"
                            }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    _q.label = 3;
                case 3:
                    _q.trys.push([3, 7, , 9]);
                    return [4 /*yield*/, serviceRole.functions.invoke("post-sales-invoice", {
                            body: {
                                invoiceId: invoiceId,
                                userId: userId,
                                companyId: companyId
                            }
                        })];
                case 4:
                    postSalesInvoice = _q.sent();
                    if (!postSalesInvoice.error) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .update({
                            status: "Draft"
                        })
                            .eq("id", invoiceId)];
                case 5:
                    _q.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to post sales invoice"
                        }];
                case 6: return [3 /*break*/, 9];
                case 7:
                    err_1 = _q.sent();
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .update({
                            status: "Draft"
                        })
                            .eq("id", invoiceId)];
                case 8:
                    _q.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to post sales invoice"
                        }];
                case 9: return [4 /*yield*/, (0, invoicing_1.getSalesInvoice)(serviceRole, invoiceId)];
                case 10:
                    salesInvoice = _q.sent();
                    if (salesInvoice.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get sales invoice"
                            }];
                    }
                    if (salesInvoice.data.companyId !== companyId) {
                        return [2 /*return*/, {
                                success: false,
                                message: "You are not authorized to confirm this sales invoice"
                            }];
                    }
                    acceptLanguage = request.headers.get("accept-language");
                    locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
                        validate: Intl.DateTimeFormat.supportedLocalesOf
                    });
                    _q.label = 11;
                case 11:
                    _q.trys.push([11, 16, , 17]);
                    return [4 /*yield*/, (0, _id___pdf_1.loader)(__assign(__assign({}, args), { params: __assign(__assign({}, args.params), { id: invoiceId }) }))];
                case 12:
                    pdf = _q.sent();
                    if (pdf.headers.get("content-type") !== "application/pdf") {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to generate PDF"
                            }];
                    }
                    return [4 /*yield*/, pdf.arrayBuffer()];
                case 13:
                    file = _q.sent();
                    fileName = (0, string_1.stripSpecialCharacters)("".concat(salesInvoice.data.invoiceId, " - ").concat(new Date()
                        .toISOString()
                        .slice(0, -5), ".pdf"));
                    documentFilePath = "".concat(companyId, "/opportunity/").concat(salesInvoice.data.opportunityId, "/").concat(fileName);
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .upload(documentFilePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            contentType: "application/pdf",
                            upsert: true
                        })];
                case 14:
                    documentFileUpload = _q.sent();
                    if (documentFileUpload.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to upload file"
                            }];
                    }
                    return [4 /*yield*/, (0, documents_1.upsertDocument)(serviceRole, {
                            path: documentFilePath,
                            name: fileName,
                            size: Math.round(file.byteLength / 1024),
                            sourceDocument: "Sales Invoice",
                            sourceDocumentId: invoiceId,
                            readGroups: [userId],
                            writeGroups: [userId],
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 15:
                    createDocument = _q.sent();
                    if (createDocument.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create document"
                            }];
                    }
                    return [3 /*break*/, 17];
                case 16:
                    err_2 = _q.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to generate PDF"
                        }];
                case 17:
                    _c = (_b = (0, form_1.validator)(sales_1.salesConfirmValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 18: return [4 /*yield*/, _c.apply(_b, [_q.sent()])];
                case 19:
                    validation = _q.sent();
                    if (validation.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Invalid notification type"
                            }];
                    }
                    _d = validation.data, notification = _d.notification, customerContact = _d.customerContact, ccSelections = _d.cc;
                    _e = notification;
                    switch (_e) {
                        case "Email": return [3 /*break*/, 20];
                        case undefined: return [3 /*break*/, 28];
                        case "None": return [3 /*break*/, 28];
                    }
                    return [3 /*break*/, 29];
                case 20:
                    _q.trys.push([20, 26, , 27]);
                    if (!customerContact) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Customer contact is required"
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, companyId),
                            (0, sales_1.getCustomerContact)(serviceRole, customerContact),
                            (0, invoicing_1.getSalesInvoice)(serviceRole, invoiceId),
                            (0, invoicing_1.getSalesInvoiceLines)(serviceRole, invoiceId),
                            (0, invoicing_1.getSalesInvoiceCustomerDetails)(serviceRole, invoiceId),
                            (0, invoicing_1.getSalesInvoiceShipment)(serviceRole, invoiceId),
                            (0, users_server_1.getUser)(serviceRole, userId),
                            (0, accounting_1.getPaymentTermsList)(serviceRole, companyId)
                        ])];
                case 21:
                    _f = _q.sent(), company = _f[0], customer = _f[1], salesInvoice_1 = _f[2], salesInvoiceLines = _f[3], salesInvoiceLocations = _f[4], salesInvoiceShipment = _f[5], seller = _f[6], paymentTerms = _f[7];
                    if (!((_g = customer === null || customer === void 0 ? void 0 : customer.data) === null || _g === void 0 ? void 0 : _g.contact)) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get customer contact"
                            }];
                    }
                    if (!company.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get company"
                            }];
                    }
                    if (!seller.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get user"
                            }];
                    }
                    if (!salesInvoice_1.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get sales invoice"
                            }];
                    }
                    if (!salesInvoiceLocations.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get sales invoice locations"
                            }];
                    }
                    if (!salesInvoiceShipment.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get sales invoice shipment"
                            }];
                    }
                    if (!paymentTerms.data) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment terms"
                            }];
                    }
                    emailTemplate = (0, email_1.SalesInvoiceEmail)({
                        // @ts-expect-error TS2739 - TODO: fix type
                        company: company.data,
                        locale: (_h = locales === null || locales === void 0 ? void 0 : locales[0]) !== null && _h !== void 0 ? _h : "en-US",
                        salesInvoice: salesInvoice_1.data,
                        salesInvoiceLines: (_j = salesInvoiceLines.data) !== null && _j !== void 0 ? _j : [],
                        salesInvoiceLocations: salesInvoiceLocations.data,
                        salesInvoiceShipment: salesInvoiceShipment.data,
                        recipient: {
                            // @ts-expect-error TS2322 - TODO: fix type
                            email: customer.data.contact.email,
                            firstName: (_k = customer.data.contact.firstName) !== null && _k !== void 0 ? _k : undefined,
                            lastName: (_l = customer.data.contact.lastName) !== null && _l !== void 0 ? _l : undefined
                        },
                        sender: {
                            email: (_m = seller.data.email) !== null && _m !== void 0 ? _m : "",
                            firstName: seller.data.firstName,
                            lastName: seller.data.lastName
                        },
                        paymentTerms: paymentTerms.data
                    });
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate)];
                case 22:
                    html = _q.sent();
                    return [4 /*yield*/, (0, components_1.renderAsync)(emailTemplate, { plainText: true })];
                case 23:
                    text = _q.sent();
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .createSignedUrl(documentFilePath, 3600)];
                case 24:
                    signedUrlData = (_q.sent()).data;
                    return [4 /*yield*/, (0, jobs_1.trigger)("send-email", {
                            to: [(_o = seller.data.email) !== null && _o !== void 0 ? _o : "", customer.data.contact.email],
                            cc: (ccSelections === null || ccSelections === void 0 ? void 0 : ccSelections.length) ? ccSelections : undefined,
                            from: (_p = seller.data.email) !== null && _p !== void 0 ? _p : "",
                            subject: "Invoice ".concat(salesInvoice_1.data.invoiceId, " from ").concat(company.data.name),
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
                case 25:
                    _q.sent();
                    return [3 /*break*/, 27];
                case 26:
                    err_3 = _q.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to send email"
                        }];
                case 27: return [3 /*break*/, 30];
                case 28: return [3 /*break*/, 30];
                case 29: return [2 /*return*/, {
                        success: false,
                        message: "Invalid notification type"
                    }];
                case 30: return [2 /*return*/, {
                        success: true,
                        message: "Sales invoice confirmed"
                    }];
            }
        });
    });
}
