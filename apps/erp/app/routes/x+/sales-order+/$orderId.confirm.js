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
var form_1 = require("@carbon/form");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var production_service_1 = require("~/modules/production/production.service");
var sales_1 = require("~/modules/sales");
var shared_server_1 = require("~/modules/shared/shared.server");
var _id___pdf_1 = require("~/routes/file+/sales-order+/$id[.]pdf");
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, client, companyId, userId, orderId, serviceRole, salesOrder, acceptLanguage, locales, fileName, documentFilePath, result, err_1, validation, _b, _c, _d, notification, customerContact, ccSelections, _e, emailResult, err_2, orderLines, status_1, confirm_1, err_3;
        var _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    request = args.request, params = args.params;
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 20, , 21]);
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales",
                            role: "employee"
                        })];
                case 2:
                    _a = _h.sent(), client = _a.client, companyId = _a.companyId, userId = _a.userId;
                    orderId = params.orderId;
                    if (!orderId) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Could not find orderId"
                            }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.getSalesOrder)(serviceRole, orderId)];
                case 3:
                    salesOrder = _h.sent();
                    if (salesOrder.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get sales order"
                            }];
                    }
                    if (salesOrder.data.companyId !== companyId) {
                        return [2 /*return*/, {
                                success: false,
                                message: "You are not authorized to confirm this sales order"
                            }];
                    }
                    acceptLanguage = request.headers.get("accept-language");
                    locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
                        validate: Intl.DateTimeFormat.supportedLocalesOf
                    });
                    fileName = void 0;
                    documentFilePath = void 0;
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, (0, shared_server_1.generateAndAttachSalesOrderPdf)({
                            routeArgs: args,
                            salesOrderId: orderId,
                            salesOrderIdentifier: salesOrder.data.salesOrderId,
                            opportunityId: salesOrder.data.opportunityId,
                            companyId: companyId,
                            userId: userId,
                            serviceRole: serviceRole,
                            pdfLoader: _id___pdf_1.loader
                        })];
                case 5:
                    result = _h.sent();
                    fileName = result.fileName;
                    documentFilePath = result.documentFilePath;
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _h.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to generate PDF"
                        }];
                case 7:
                    _c = (_b = (0, form_1.validator)(sales_1.salesConfirmValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 8: return [4 /*yield*/, _c.apply(_b, [_h.sent()])];
                case 9:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Invalid form data"
                            }];
                    }
                    _d = validation.data, notification = _d.notification, customerContact = _d.customerContact, ccSelections = _d.cc;
                    _e = notification;
                    switch (_e) {
                        case "Email": return [3 /*break*/, 10];
                        case undefined: return [3 /*break*/, 14];
                        case "None": return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 15];
                case 10:
                    _h.trys.push([10, 12, , 13]);
                    if (!customerContact) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Customer contact is required"
                            }];
                    }
                    return [4 /*yield*/, (0, shared_server_1.sendSalesOrderEmail)({
                            salesOrderId: orderId,
                            companyId: companyId,
                            userId: userId,
                            customerContactId: customerContact,
                            cc: ccSelections,
                            documentFilePath: documentFilePath,
                            fileName: fileName,
                            serviceRole: serviceRole,
                            locales: locales
                        })];
                case 11:
                    emailResult = _h.sent();
                    if (!emailResult.success) {
                        return [2 /*return*/, {
                                success: false,
                                message: (_f = emailResult.message) !== null && _f !== void 0 ? _f : "Failed to send email"
                            }];
                    }
                    return [3 /*break*/, 13];
                case 12:
                    err_2 = _h.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Failed to send email"
                        }];
                case 13: return [3 /*break*/, 16];
                case 14: return [3 /*break*/, 16];
                case 15: return [2 /*return*/, {
                        success: false,
                        message: "Invalid notification type"
                    }];
                case 16: return [4 /*yield*/, (0, sales_1.getSalesOrderLines)(serviceRole, orderId)];
                case 17:
                    orderLines = _h.sent();
                    status_1 = (0, utils_1.getSalesOrderStatus)(orderLines.data || []).status;
                    return [4 /*yield*/, client
                            .from("salesOrder")
                            .update({
                            status: status_1,
                            orderDate: (_g = salesOrder.data.orderDate) !== null && _g !== void 0 ? _g : (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                            updatedBy: userId
                        })
                            .eq("id", orderId)];
                case 18:
                    confirm_1 = _h.sent();
                    if (confirm_1.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to confirm sales order"
                            }];
                    }
                    return [4 /*yield*/, (0, production_service_1.runMRP)((0, client_server_1.getCarbonServiceRole)(), {
                            type: "salesOrder",
                            id: orderId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 19:
                    _h.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: "Sales order confirmed"
                        }];
                case 20:
                    err_3 = _h.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: err_3 instanceof Error ? err_3.message : "An unexpected error occurred"
                        }];
                case 21: return [2 /*return*/];
            }
        });
    });
}
