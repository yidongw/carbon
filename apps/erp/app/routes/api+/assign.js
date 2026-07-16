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
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var react_router_1 = require("react-router");
var shared_server_1 = require("~/modules/shared/shared.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, id, assignee, table, result, _d, _e, job, jobId, makeMethodId, materialId, bundle, task, notificationEvent, err_1, _f, _g, _h, _j;
        var _k, _l, _m, _o, _p, _q, _r;
        var request = _b.request;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _s.sent();
                    id = formData.get("id");
                    assignee = formData.get("assignee");
                    table = formData.get("table");
                    if (!(table && id)) return [3 /*break*/, 18];
                    return [4 /*yield*/, (0, shared_server_1.assign)(client, { table: table, id: id, assignee: assignee })];
                case 3:
                    result = _s.sent();
                    if (!result.error) return [3 /*break*/, 5];
                    _d = react_router_1.data;
                    _e = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to assign"))];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_s.sent()]))];
                case 5:
                    if (!(table === "jobOperation")) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("*, job(id, assignee), jobMakeMethod(id, parentMaterialId)")
                            .eq("id", id)
                            .single()];
                case 6:
                    job = _s.sent();
                    jobId = (_l = (_k = job.data) === null || _k === void 0 ? void 0 : _k.job) === null || _l === void 0 ? void 0 : _l.id;
                    makeMethodId = (_o = (_m = job.data) === null || _m === void 0 ? void 0 : _m.jobMakeMethod) === null || _o === void 0 ? void 0 : _o.id;
                    materialId = (_q = (_p = job.data) === null || _p === void 0 ? void 0 : _p.jobMakeMethod) === null || _q === void 0 ? void 0 : _q.parentMaterialId;
                    if (!jobId) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("bundleWorkOrder")
                            .select("id")
                            .eq("jobId", jobId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 7:
                    bundle = _s.sent();
                    if (!bundle.data) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("job")
                            .update({
                            assignee: assignee ? assignee : null,
                            assignedAt: assignee ? new Date().toISOString() : null,
                            updatedBy: userId
                        })
                            .eq("id", jobId)
                            .eq("companyId", companyId)];
                case 8:
                    _s.sent();
                    _s.label = 9;
                case 9:
                    id = "".concat(jobId, ":").concat(id, ":").concat(makeMethodId, ":").concat(materialId !== null && materialId !== void 0 ? materialId : "");
                    _s.label = 10;
                case 10:
                    if (!(table === "nonConformanceActionTask" ||
                        table === "nonConformanceApprovalTask")) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from(table)
                            .select("nonConformanceId")
                            .eq("id", id)
                            .single()];
                case 11:
                    task = _s.sent();
                    id = (_r = task.data) === null || _r === void 0 ? void 0 : _r.nonConformanceId;
                    _s.label = 12;
                case 12:
                    if (!(id && assignee)) return [3 /*break*/, 17];
                    notificationEvent = getNotificationEvent(table);
                    if (!notificationEvent) return [3 /*break*/, 17];
                    _s.label = 13;
                case 13:
                    _s.trys.push([13, 15, , 17]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companyId,
                            documentId: id,
                            event: notificationEvent,
                            recipient: {
                                type: "user",
                                userId: assignee
                            },
                            from: userId
                        })];
                case 14:
                    _s.sent();
                    return [3 /*break*/, 17];
                case 15:
                    err_1 = _s.sent();
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to notify user"))];
                case 16: return [2 /*return*/, _f.apply(void 0, _g.concat([_s.sent()]))];
                case 17: return [2 /*return*/, { success: true }];
                case 18:
                    _h = react_router_1.data;
                    _j = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Failed to assign"))];
                case 19: return [2 /*return*/, _h.apply(void 0, _j.concat([_s.sent()]))];
            }
        });
    });
}
function getNotificationEvent(table) {
    switch (table) {
        case "salesRfq":
            return notifications_1.NotificationEvent.SalesRfqAssignment;
        case "quote":
            return notifications_1.NotificationEvent.QuoteAssignment;
        case "salesOrder":
            return notifications_1.NotificationEvent.SalesOrderAssignment;
        case "job":
            return notifications_1.NotificationEvent.JobAssignment;
        case "jobCompleted":
            return notifications_1.NotificationEvent.JobCompleted;
        case "jobOperation":
            return notifications_1.NotificationEvent.JobOperationAssignment;
        case "maintenanceDispatch":
            return notifications_1.NotificationEvent.MaintenanceDispatchAssignment;
        case "nonConformanceInvestigationTask":
        case "nonConformanceActionTask":
        case "nonConformanceApprovalTask":
        case "nonConformance":
            return notifications_1.NotificationEvent.NonConformanceAssignment;
        case "procedure":
            return notifications_1.NotificationEvent.ProcedureAssignment;
        case "purchaseOrder":
            return notifications_1.NotificationEvent.PurchaseOrderAssignment;
        case "purchaseInvoice":
            return notifications_1.NotificationEvent.PurchaseInvoiceAssignment;
        case "riskRegister":
            return notifications_1.NotificationEvent.RiskAssignment;
        case "supplierQuote":
            return notifications_1.NotificationEvent.SupplierQuoteAssignment;
        case "stockTransfer":
            return notifications_1.NotificationEvent.StockTransferAssignment;
        case "pickingList":
            return notifications_1.NotificationEvent.PickingListAssignment;
        case "training":
            return notifications_1.NotificationEvent.ResourceTrainingAssignment;
        case "trainingAssignment":
            return notifications_1.NotificationEvent.TrainingAssignment;
        default:
            return null;
    }
}
