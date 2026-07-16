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
var client_server_1 = require("@carbon/auth/client.server");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var sales_1 = require("~/modules/sales");
var settings_1 = require("~/modules/settings");
var shared_server_1 = require("~/modules/shared/shared.server");
var _id___pdf_1 = require("~/routes/file+/sales-order+/$id[.]pdf");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, id, formData, type, serviceRole, quote, companySettings, _a, digitalQuoteAcceptedBy, digitalQuoteAcceptedByEmail, selectedLinesRaw, file, parseResult, selectedLines, purchaseOrderNumber, convert, salesOrderId, salesOrder, err_1, err_2, purchaseOrderDocumentPath, fileUpload, updateOpportunity, digitalQuoteRejectedBy, digitalQuoteRejectedByEmail, rejectQuote, err_3;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _p.sent();
                    type = String(formData.get("type"));
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.getQuoteByExternalId)(serviceRole, id)];
                case 2:
                    quote = _p.sent();
                    if (quote.error) {
                        console.error("Quote not found", quote.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Quote not found"
                            }];
                    }
                    return [4 /*yield*/, (0, settings_1.getCompanySettings)(serviceRole, quote.data.companyId)];
                case 3:
                    companySettings = _p.sent();
                    _a = type;
                    switch (_a) {
                        case "accept": return [3 /*break*/, 4];
                        case "reject": return [3 /*break*/, 19];
                    }
                    return [3 /*break*/, 25];
                case 4:
                    digitalQuoteAcceptedBy = String(formData.get("digitalQuoteAcceptedBy"));
                    digitalQuoteAcceptedByEmail = String(formData.get("digitalQuoteAcceptedByEmail"));
                    selectedLinesRaw = (_b = formData.get("selectedLines")) !== null && _b !== void 0 ? _b : "{}";
                    file = formData.get("file");
                    if (typeof selectedLinesRaw !== "string") {
                        return [2 /*return*/, { success: false, message: "Invalid selected lines data" }];
                    }
                    parseResult = sales_1.selectedLinesValidator.safeParse(JSON.parse(selectedLinesRaw));
                    if (!parseResult.success) {
                        console.error("Validation error:", parseResult.error);
                        return [2 /*return*/, { success: false, message: "Invalid selected lines data" }];
                    }
                    selectedLines = parseResult.data;
                    purchaseOrderNumber = "";
                    if (file instanceof File && file.name.toLowerCase().endsWith(".pdf")) {
                        purchaseOrderNumber = file.name.replace(/\.pdf$/i, "");
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.convertQuoteToOrder)(serviceRole, {
                                id: quote.data.id,
                                companyId: quote.data.companyId,
                                userId: quote.data.createdBy,
                                selectedLines: selectedLines,
                                digitalQuoteAcceptedBy: digitalQuoteAcceptedBy,
                                digitalQuoteAcceptedByEmail: digitalQuoteAcceptedByEmail,
                                purchaseOrderNumber: purchaseOrderNumber
                            })
                        ])];
                case 5:
                    convert = (_p.sent())[0];
                    if (convert.error) {
                        console.error("Failed to convert quote to order", convert.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to convert quote to order"
                            }];
                    }
                    salesOrderId = (_c = convert.data) === null || _c === void 0 ? void 0 : _c.convertedId;
                    if (!salesOrderId) return [3 /*break*/, 11];
                    _p.label = 6;
                case 6:
                    _p.trys.push([6, 10, , 11]);
                    return [4 /*yield*/, (0, sales_1.getSalesOrder)(serviceRole, salesOrderId)];
                case 7:
                    salesOrder = _p.sent();
                    if (!(((_d = salesOrder.data) === null || _d === void 0 ? void 0 : _d.salesOrderId) && ((_e = salesOrder.data) === null || _e === void 0 ? void 0 : _e.opportunityId))) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, shared_server_1.generateAndAttachSalesOrderPdf)({
                            routeArgs: args,
                            salesOrderId: salesOrderId,
                            salesOrderIdentifier: salesOrder.data.salesOrderId,
                            opportunityId: salesOrder.data.opportunityId,
                            companyId: quote.data.companyId,
                            userId: quote.data.createdBy,
                            serviceRole: serviceRole,
                            pdfLoader: _id___pdf_1.loader
                        })];
                case 8:
                    _p.sent();
                    _p.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_1 = _p.sent();
                    console.error("Failed to generate PDF after digital quote acceptance", err_1);
                    return [3 /*break*/, 11];
                case 11:
                    if (companySettings.error) {
                        console.error("Failed to get company settings", companySettings.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to send notification"
                            }];
                    }
                    if (!((_g = (_f = companySettings.data) === null || _f === void 0 ? void 0 : _f.digitalQuoteNotificationGroup) === null || _g === void 0 ? void 0 : _g.length)) return [3 /*break*/, 15];
                    _p.label = 12;
                case 12:
                    _p.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companySettings.data.id,
                            documentId: quote.data.id,
                            event: notifications_1.NotificationEvent.DigitalQuoteResponse,
                            recipient: {
                                type: "group",
                                groupIds: (_j = (_h = companySettings.data) === null || _h === void 0 ? void 0 : _h.digitalQuoteNotificationGroup) !== null && _j !== void 0 ? _j : []
                            }
                        })];
                case 13:
                    _p.sent();
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _p.sent();
                    console.error("Failed to trigger notification", err_2);
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to send notification"
                        }];
                case 15:
                    if (!(file && file instanceof File)) return [3 /*break*/, 18];
                    purchaseOrderDocumentPath = "".concat(companySettings.data.id, "/opportunity/").concat(quote.data.opportunityId, "/").concat(file.name);
                    return [4 /*yield*/, serviceRole.storage
                            .from("private")
                            .upload(purchaseOrderDocumentPath, file)];
                case 16:
                    fileUpload = _p.sent();
                    if (fileUpload.error) {
                        console.error("Failed to upload file", fileUpload.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to upload file"
                            }];
                    }
                    return [4 /*yield*/, serviceRole
                            .from("opportunity")
                            .update({
                            purchaseOrderDocumentPath: purchaseOrderDocumentPath
                        })
                            .eq("id", quote.data.opportunityId)];
                case 17:
                    updateOpportunity = _p.sent();
                    if (updateOpportunity.error) {
                        console.error("Failed to update opportunity", updateOpportunity.error);
                    }
                    _p.label = 18;
                case 18: return [2 /*return*/, {
                        success: true,
                        message: "Quote accepted!"
                    }];
                case 19:
                    digitalQuoteRejectedBy = String(formData.get("digitalQuoteRejectedBy"));
                    digitalQuoteRejectedByEmail = String(formData.get("digitalQuoteRejectedByEmail"));
                    return [4 /*yield*/, serviceRole
                            .from("quote")
                            .update({
                            status: "Lost",
                            digitalQuoteRejectedBy: digitalQuoteRejectedBy,
                            digitalQuoteRejectedByEmail: digitalQuoteRejectedByEmail
                        })
                            .eq("id", quote.data.id)];
                case 20:
                    rejectQuote = _p.sent();
                    if (rejectQuote.error) {
                        console.error("Failed to reject quote", rejectQuote.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to reject quote"
                            }];
                    }
                    if (!((_l = (_k = companySettings.data) === null || _k === void 0 ? void 0 : _k.digitalQuoteNotificationGroup) === null || _l === void 0 ? void 0 : _l.length)) return [3 /*break*/, 24];
                    _p.label = 21;
                case 21:
                    _p.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companySettings.data.id,
                            documentId: quote.data.id,
                            event: notifications_1.NotificationEvent.DigitalQuoteResponse,
                            recipient: {
                                type: "group",
                                groupIds: (_o = (_m = companySettings.data) === null || _m === void 0 ? void 0 : _m.digitalQuoteNotificationGroup) !== null && _o !== void 0 ? _o : []
                            }
                        })];
                case 22:
                    _p.sent();
                    return [3 /*break*/, 24];
                case 23:
                    err_3 = _p.sent();
                    console.error("Failed to trigger notification", err_3);
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to send notification"
                        }];
                case 24: return [2 /*return*/, {
                        success: true,
                        message: "Quote rejected!"
                    }];
                case 25: return [2 /*return*/, { success: false, message: "Invalid type" }];
            }
        });
    });
}
