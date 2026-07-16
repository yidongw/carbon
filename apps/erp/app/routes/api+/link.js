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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var company_server_1 = require("@carbon/auth/company.server");
var session_server_1 = require("@carbon/auth/session.server");
var notifications_1 = require("@carbon/notifications");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function resolve(serviceRole, event, documentId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, assignment, _b, jobId, operationId, makeMethodId, materialId, link;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = event;
                    switch (_a) {
                        case notifications_1.NotificationEvent.TrainingAssignment: return [3 /*break*/, 1];
                        case notifications_1.NotificationEvent.ResourceTrainingAssignment: return [3 /*break*/, 3];
                        case notifications_1.NotificationEvent.JobAssignment: return [3 /*break*/, 4];
                        case notifications_1.NotificationEvent.JobCompleted: return [3 /*break*/, 4];
                        case notifications_1.NotificationEvent.JobOperationAssignment: return [3 /*break*/, 5];
                        case notifications_1.NotificationEvent.JobOperationMessage: return [3 /*break*/, 5];
                        case notifications_1.NotificationEvent.PurchaseInvoiceAssignment: return [3 /*break*/, 6];
                        case notifications_1.NotificationEvent.PurchaseOrderAssignment: return [3 /*break*/, 7];
                        case notifications_1.NotificationEvent.QuoteAssignment: return [3 /*break*/, 8];
                        case notifications_1.NotificationEvent.QuoteExpired: return [3 /*break*/, 8];
                        case notifications_1.NotificationEvent.DigitalQuoteResponse: return [3 /*break*/, 8];
                        case notifications_1.NotificationEvent.SupplierQuoteAssignment: return [3 /*break*/, 9];
                        case notifications_1.NotificationEvent.SupplierQuoteResponse: return [3 /*break*/, 9];
                        case notifications_1.NotificationEvent.SalesOrderAssignment: return [3 /*break*/, 10];
                        case notifications_1.NotificationEvent.SalesRfqAssignment: return [3 /*break*/, 11];
                        case notifications_1.NotificationEvent.SalesRfqReady: return [3 /*break*/, 11];
                        case notifications_1.NotificationEvent.MaintenanceDispatchAssignment: return [3 /*break*/, 12];
                        case notifications_1.NotificationEvent.MaintenanceDispatchCreated: return [3 /*break*/, 12];
                        case notifications_1.NotificationEvent.GaugeCalibrationExpired: return [3 /*break*/, 13];
                        case notifications_1.NotificationEvent.NonConformanceAssignment: return [3 /*break*/, 14];
                        case notifications_1.NotificationEvent.RiskAssignment: return [3 /*break*/, 15];
                        case notifications_1.NotificationEvent.ProcedureAssignment: return [3 /*break*/, 16];
                        case notifications_1.NotificationEvent.StockTransferAssignment: return [3 /*break*/, 17];
                        case notifications_1.NotificationEvent.PickingListAssignment: return [3 /*break*/, 18];
                        case notifications_1.NotificationEvent.SuggestionResponse: return [3 /*break*/, 19];
                        case notifications_1.NotificationEvent.ApprovalApproved: return [3 /*break*/, 20];
                        case notifications_1.NotificationEvent.ApprovalRejected: return [3 /*break*/, 20];
                        case notifications_1.NotificationEvent.ApprovalRequested: return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 21];
                case 1: return [4 /*yield*/, serviceRole
                        .from("trainingAssignment")
                        .select("trainingId")
                        .eq("id", documentId)
                        .maybeSingle()];
                case 2:
                    assignment = _d.sent();
                    return [2 /*return*/, ((_c = assignment.data) === null || _c === void 0 ? void 0 : _c.trainingId)
                            ? path_1.path.to.trainingAssignmentDetail(assignment.data.trainingId)
                            : null];
                case 3:
                    {
                        return [2 /*return*/, path_1.path.to.training(documentId)];
                    }
                    _d.label = 4;
                case 4: return [2 /*return*/, path_1.path.to.job(documentId)];
                case 5:
                    {
                        _b = documentId.split(":"), jobId = _b[0], operationId = _b[1], makeMethodId = _b[2], materialId = _b[3];
                        if (!jobId || !operationId || !makeMethodId)
                            return [2 /*return*/, null];
                        link = materialId
                            ? path_1.path.to.jobMakeMethod(jobId, makeMethodId)
                            : path_1.path.to.jobMethod(jobId, makeMethodId);
                        return [2 /*return*/, "".concat(link, "?selectedOperation=").concat(operationId)];
                    }
                    _d.label = 6;
                case 6: return [2 /*return*/, path_1.path.to.purchaseInvoice(documentId)];
                case 7: return [2 /*return*/, path_1.path.to.purchaseOrder(documentId)];
                case 8: return [2 /*return*/, path_1.path.to.quote(documentId)];
                case 9: return [2 /*return*/, path_1.path.to.supplierQuote(documentId)];
                case 10: return [2 /*return*/, path_1.path.to.salesOrder(documentId)];
                case 11: return [2 /*return*/, path_1.path.to.salesRfq(documentId)];
                case 12: return [2 /*return*/, path_1.path.to.maintenanceDispatch(documentId)];
                case 13: return [2 /*return*/, path_1.path.to.gauge(documentId)];
                case 14: return [2 /*return*/, path_1.path.to.issue(documentId)];
                case 15: return [2 /*return*/, path_1.path.to.risk(documentId)];
                case 16: return [2 /*return*/, path_1.path.to.procedure(documentId)];
                case 17: return [2 /*return*/, path_1.path.to.stockTransfer(documentId)];
                case 18: return [2 /*return*/, path_1.path.to.pickingList(documentId)];
                case 19: return [2 /*return*/, path_1.path.to.suggestion(documentId)];
                case 20:
                    if (documentType === "purchaseOrder")
                        return [2 /*return*/, path_1.path.to.purchaseOrder(documentId)];
                    if (documentType === "qualityDocument")
                        return [2 /*return*/, path_1.path.to.qualityDocument(documentId)];
                    if (documentType === "supplier")
                        return [2 /*return*/, path_1.path.to.supplierApproval(documentId)];
                    return [2 /*return*/, null];
                case 21: return [2 /*return*/, null];
            }
        });
    });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, sessionCompanyId, userId, url, event, documentId, documentType, companyId, serviceRole, link, redirectTo, companies, matchedCompany, sessionCookie, companyIdCookie;
        var _d, _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _f.sent(), client = _c.client, sessionCompanyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    event = url.searchParams.get("event");
                    documentId = url.searchParams.get("documentId");
                    documentType = url.searchParams.get("documentType");
                    companyId = url.searchParams.get("companyId");
                    if (!event || !documentId) {
                        throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot);
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, resolve(serviceRole, event, documentId, documentType !== null && documentType !== void 0 ? documentType : undefined)];
                case 2:
                    link = _f.sent();
                    redirectTo = link !== null && link !== void 0 ? link : path_1.path.to.authenticatedRoot;
                    if (!(companyId && companyId !== sessionCompanyId)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, settings_1.getCompanies)(client, userId)];
                case 3:
                    companies = _f.sent();
                    matchedCompany = (_d = companies.data) === null || _d === void 0 ? void 0 : _d.find(function (company) { return company.id === companyId; });
                    if (!matchedCompany) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, session_server_1.updateCompanySession)(request, companyId, (_e = matchedCompany.companyGroupId) !== null && _e !== void 0 ? _e : "")];
                case 4:
                    sessionCookie = _f.sent();
                    companyIdCookie = (0, company_server_1.setCompanyId)(companyId);
                    throw (0, react_router_1.redirect)(redirectTo, {
                        headers: [
                            ["Set-Cookie", sessionCookie],
                            ["Set-Cookie", companyIdCookie]
                        ]
                    });
                case 5: throw (0, react_router_1.redirect)(redirectTo);
            }
        });
    });
}
