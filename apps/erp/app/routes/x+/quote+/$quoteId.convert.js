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
var form_1 = require("@carbon/form");
var intl_parse_accept_language_1 = require("intl-parse-accept-language");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var shared_server_1 = require("~/modules/shared/shared.server");
var _id___pdf_1 = require("~/routes/file+/sales-order+/$id[.]pdf");
var path_1 = require("~/utils/path");
// the edge function grows larger than 2MB - so this is a workaround to avoid the edge function limit
function action(args) {
    return __awaiter(this, void 0, void 0, function () {
        var request, params, _a, companyId, userId, quoteId, formData, selectedLinesRaw, poNumber, _b, _c, parseResult, _d, _e, selectedLines, notificationValidation, notification, customerContact, cc, serviceRole, convert, _f, _g, salesOrderId, salesOrder, _h, fileName, documentFilePath, acceptLanguage, locales, err_1, _j, _k;
        var _l, _m, _o, _p, _q, _r, _s, _t;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0:
                    request = args.request, params = args.params;
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 1:
                    _a = _u.sent(), companyId = _a.companyId, userId = _a.userId;
                    quoteId = params.quoteId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _u.sent();
                    selectedLinesRaw = (_l = formData.get("selectedLines")) !== null && _l !== void 0 ? _l : "{}";
                    poNumber = ((_m = formData.get("poNumber")) !== null && _m !== void 0 ? _m : "");
                    if (!(typeof selectedLinesRaw !== "string")) return [3 /*break*/, 4];
                    _b = react_router_1.redirect;
                    _c = [path_1.path.to.quoteDetails(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Invalid selected lines data"))];
                case 3: throw _b.apply(void 0, _c.concat([_u.sent()]));
                case 4:
                    parseResult = sales_1.selectedLinesValidator.safeParse(JSON.parse(selectedLinesRaw));
                    if (!!parseResult.success) return [3 /*break*/, 6];
                    console.error("Validation error:", parseResult.error);
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.quoteDetails(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Invalid selected lines data"))];
                case 5: throw _d.apply(void 0, _e.concat([_u.sent()]));
                case 6:
                    selectedLines = parseResult.data;
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.salesConfirmValidator).validate(formData)];
                case 7:
                    notificationValidation = _u.sent();
                    notification = (_o = notificationValidation.data) === null || _o === void 0 ? void 0 : _o.notification;
                    customerContact = (_p = notificationValidation.data) === null || _p === void 0 ? void 0 : _p.customerContact;
                    cc = (_q = notificationValidation.data) === null || _q === void 0 ? void 0 : _q.cc;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.convertQuoteToOrder)(serviceRole, {
                            id: quoteId,
                            purchaseOrderNumber: poNumber !== null && poNumber !== void 0 ? poNumber : "",
                            companyId: companyId,
                            userId: userId,
                            selectedLines: selectedLines
                        })];
                case 8:
                    convert = _u.sent();
                    if (!convert.error) return [3 /*break*/, 10];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.quoteDetails(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(convert.error, "Failed to convert quote to order"))];
                case 9: throw _f.apply(void 0, _g.concat([_u.sent()]));
                case 10:
                    salesOrderId = (_r = convert.data) === null || _r === void 0 ? void 0 : _r.convertedId;
                    _u.label = 11;
                case 11:
                    _u.trys.push([11, 16, , 17]);
                    return [4 /*yield*/, (0, sales_1.getSalesOrder)(serviceRole, salesOrderId)];
                case 12:
                    salesOrder = _u.sent();
                    if (!(((_s = salesOrder.data) === null || _s === void 0 ? void 0 : _s.salesOrderId) && ((_t = salesOrder.data) === null || _t === void 0 ? void 0 : _t.opportunityId))) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, shared_server_1.generateAndAttachSalesOrderPdf)({
                            routeArgs: args,
                            salesOrderId: salesOrderId,
                            salesOrderIdentifier: salesOrder.data.salesOrderId,
                            opportunityId: salesOrder.data.opportunityId,
                            companyId: companyId,
                            userId: userId,
                            serviceRole: serviceRole,
                            pdfLoader: _id___pdf_1.loader
                        })];
                case 13:
                    _h = _u.sent(), fileName = _h.fileName, documentFilePath = _h.documentFilePath;
                    if (!(notification === "Email" && customerContact)) return [3 /*break*/, 15];
                    acceptLanguage = request.headers.get("accept-language");
                    locales = (0, intl_parse_accept_language_1.parseAcceptLanguage)(acceptLanguage, {
                        validate: Intl.DateTimeFormat.supportedLocalesOf
                    });
                    return [4 /*yield*/, (0, shared_server_1.sendSalesOrderEmail)({
                            salesOrderId: salesOrderId,
                            companyId: companyId,
                            userId: userId,
                            customerContactId: customerContact,
                            cc: cc,
                            documentFilePath: documentFilePath,
                            fileName: fileName,
                            serviceRole: serviceRole,
                            locales: locales
                        })];
                case 14:
                    _u.sent();
                    _u.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    err_1 = _u.sent();
                    console.error("Failed to generate PDF or send email after conversion", err_1);
                    return [3 /*break*/, 17];
                case 17:
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.salesOrder(salesOrderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully converted quote to order"))];
                case 18: throw _j.apply(void 0, _k.concat([_u.sent()]));
            }
        });
    });
}
