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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var email_1 = require("@carbon/documents/email");
var notifications_1 = require("@carbon/ee/notifications");
var plan_server_1 = require("@carbon/ee/plan.server");
var slack_server_1 = require("@carbon/ee/slack.server");
var env_1 = require("@carbon/env");
var notifications_2 = require("@carbon/notifications");
var components_1 = require("@react-email/components");
var client_1 = require("../../client");
function buildNotificationLink(event, documentId, companyId, documentType) {
    var params = new URLSearchParams({ event: event, documentId: documentId, companyId: companyId });
    if (documentType)
        params.set("documentType", documentType);
    return "".concat(env_1.ERP_URL, "/api/link?").concat(params.toString());
}
function getCompanyIntegrations(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companyIntegration")
                    .select("*")
                    .eq("companyId", companyId)];
        });
    });
}
function getDescription(client, type, documentId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, salesRfq, quote, expiredQuote, salesOrder, maintenanceDispatchCreated, maintenanceDispatch, workCenterName, dispatchId, nonConformance, job, completedJob, _b, operationId, jobOperation, procedure, digitalQuote, gaugeCalibration, stockTransfer, pickingList, trainingAssignment, training, purchaseOrder, purchaseInvoice, suggestion, submittedBy, risk, supplierQuoteAssignment, supplierQuote, externalNotes, respondedBy, purchaseOrderResult, qualityDocumentResult, qualityDocumentName, poApproved, qdApproved, poRejected, qdRejected;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16;
        return __generator(this, function (_17) {
            switch (_17.label) {
                case 0:
                    _a = type;
                    switch (_a) {
                        case notifications_2.NotificationEvent.SalesRfqReady: return [3 /*break*/, 1];
                        case notifications_2.NotificationEvent.SalesRfqAssignment: return [3 /*break*/, 1];
                        case notifications_2.NotificationEvent.QuoteAssignment: return [3 /*break*/, 3];
                        case notifications_2.NotificationEvent.QuoteExpired: return [3 /*break*/, 5];
                        case notifications_2.NotificationEvent.SalesOrderAssignment: return [3 /*break*/, 7];
                        case notifications_2.NotificationEvent.MaintenanceDispatchCreated: return [3 /*break*/, 9];
                        case notifications_2.NotificationEvent.MaintenanceDispatchAssignment: return [3 /*break*/, 11];
                        case notifications_2.NotificationEvent.NonConformanceAssignment: return [3 /*break*/, 13];
                        case notifications_2.NotificationEvent.JobAssignment: return [3 /*break*/, 15];
                        case notifications_2.NotificationEvent.JobCompleted: return [3 /*break*/, 17];
                        case notifications_2.NotificationEvent.JobOperationAssignment: return [3 /*break*/, 19];
                        case notifications_2.NotificationEvent.JobOperationMessage: return [3 /*break*/, 19];
                        case notifications_2.NotificationEvent.ProcedureAssignment: return [3 /*break*/, 21];
                        case notifications_2.NotificationEvent.DigitalQuoteResponse: return [3 /*break*/, 23];
                        case notifications_2.NotificationEvent.GaugeCalibrationExpired: return [3 /*break*/, 25];
                        case notifications_2.NotificationEvent.StockTransferAssignment: return [3 /*break*/, 27];
                        case notifications_2.NotificationEvent.PickingListAssignment: return [3 /*break*/, 29];
                        case notifications_2.NotificationEvent.TrainingAssignment: return [3 /*break*/, 31];
                        case notifications_2.NotificationEvent.ResourceTrainingAssignment: return [3 /*break*/, 33];
                        case notifications_2.NotificationEvent.PurchaseOrderAssignment: return [3 /*break*/, 35];
                        case notifications_2.NotificationEvent.PurchaseInvoiceAssignment: return [3 /*break*/, 37];
                        case notifications_2.NotificationEvent.SuggestionResponse: return [3 /*break*/, 39];
                        case notifications_2.NotificationEvent.RiskAssignment: return [3 /*break*/, 41];
                        case notifications_2.NotificationEvent.SupplierQuoteAssignment: return [3 /*break*/, 43];
                        case notifications_2.NotificationEvent.SupplierQuoteResponse: return [3 /*break*/, 45];
                        case notifications_2.NotificationEvent.ApprovalRequested: return [3 /*break*/, 47];
                        case notifications_2.NotificationEvent.ApprovalApproved: return [3 /*break*/, 52];
                        case notifications_2.NotificationEvent.ApprovalRejected: return [3 /*break*/, 57];
                    }
                    return [3 /*break*/, 62];
                case 1: return [4 /*yield*/, client
                        .from("salesRfq")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 2:
                    salesRfq = _17.sent();
                    if (salesRfq.error) {
                        console.error("Failed to get salesRfq", salesRfq.error);
                        throw salesRfq.error;
                    }
                    if (type === notifications_2.NotificationEvent.SalesRfqReady) {
                        return [2 /*return*/, "RFQ ".concat((_c = salesRfq === null || salesRfq === void 0 ? void 0 : salesRfq.data) === null || _c === void 0 ? void 0 : _c.rfqId, " is ready for quote")];
                    }
                    else if (type === notifications_2.NotificationEvent.SalesRfqAssignment) {
                        return [2 /*return*/, "RFQ ".concat((_d = salesRfq === null || salesRfq === void 0 ? void 0 : salesRfq.data) === null || _d === void 0 ? void 0 : _d.rfqId, " assigned to you")];
                    }
                    return [2 /*return*/, null];
                case 3: return [4 /*yield*/, client
                        .from("quote")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 4:
                    quote = _17.sent();
                    if (quote.error) {
                        console.error("Failed to get quote", quote.error);
                        throw quote.error;
                    }
                    return [2 /*return*/, "Quote ".concat((_e = quote === null || quote === void 0 ? void 0 : quote.data) === null || _e === void 0 ? void 0 : _e.quoteId, " assigned to you")];
                case 5: return [4 /*yield*/, client
                        .from("quote")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 6:
                    expiredQuote = _17.sent();
                    if (expiredQuote.error) {
                        console.error("Failed to get quote", expiredQuote.error);
                        throw expiredQuote.error;
                    }
                    return [2 /*return*/, "Quote ".concat((_f = expiredQuote === null || expiredQuote === void 0 ? void 0 : expiredQuote.data) === null || _f === void 0 ? void 0 : _f.quoteId, " has expired")];
                case 7: return [4 /*yield*/, client
                        .from("salesOrder")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 8:
                    salesOrder = _17.sent();
                    if (salesOrder.error) {
                        console.error("Failed to get salesOrder", salesOrder.error);
                        throw salesOrder.error;
                    }
                    return [2 /*return*/, "Sales Order ".concat((_g = salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.data) === null || _g === void 0 ? void 0 : _g.salesOrderId, " assigned to you")];
                case 9: return [4 /*yield*/, client
                        .from("maintenanceDispatch")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 10:
                    maintenanceDispatchCreated = _17.sent();
                    if (maintenanceDispatchCreated.error) {
                        console.error("Failed to get maintenanceDispatchCreated", maintenanceDispatchCreated.error);
                        throw maintenanceDispatchCreated.error;
                    }
                    return [2 /*return*/, "New maintenance dispatch ".concat((_h = maintenanceDispatchCreated === null || maintenanceDispatchCreated === void 0 ? void 0 : maintenanceDispatchCreated.data) === null || _h === void 0 ? void 0 : _h.maintenanceDispatchId, " created")];
                case 11: return [4 /*yield*/, client
                        .from("maintenanceDispatch")
                        .select("*, workCenter(id, name)")
                        .eq("id", documentId)
                        .single()];
                case 12:
                    maintenanceDispatch = _17.sent();
                    if (maintenanceDispatch.error) {
                        console.error("Failed to get maintenanceDispatch", maintenanceDispatch.error);
                        throw maintenanceDispatch.error;
                    }
                    workCenterName = (_l = (_k = (_j = maintenanceDispatch.data) === null || _j === void 0 ? void 0 : _j.workCenter) === null || _k === void 0 ? void 0 : _k.name) !== null && _l !== void 0 ? _l : "Unknown";
                    dispatchId = (_o = (_m = maintenanceDispatch.data) === null || _m === void 0 ? void 0 : _m.maintenanceDispatchId) !== null && _o !== void 0 ? _o : documentId;
                    return [2 /*return*/, "Maintenance dispatch ".concat(dispatchId, " for ").concat(workCenterName, " assigned to you")];
                case 13: return [4 /*yield*/, client
                        .from("nonConformance")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 14:
                    nonConformance = _17.sent();
                    if (nonConformance.error) {
                        console.error("Failed to get nonConformance", nonConformance.error);
                        throw nonConformance.error;
                    }
                    return [2 /*return*/, "Issue ".concat((_p = nonConformance === null || nonConformance === void 0 ? void 0 : nonConformance.data) === null || _p === void 0 ? void 0 : _p.nonConformanceId, " assigned to you")];
                case 15: return [4 /*yield*/, client
                        .from("job")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 16:
                    job = _17.sent();
                    if (job.error) {
                        console.error("Failed to get job", job.error);
                        throw job.error;
                    }
                    return [2 /*return*/, "Job ".concat((_q = job === null || job === void 0 ? void 0 : job.data) === null || _q === void 0 ? void 0 : _q.jobId, " assigned to you")];
                case 17: return [4 /*yield*/, client
                        .from("job")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 18:
                    completedJob = _17.sent();
                    if (completedJob.error) {
                        console.error("Failed to get job", completedJob.error);
                        throw completedJob.error;
                    }
                    return [2 /*return*/, "Job ".concat((_r = completedJob === null || completedJob === void 0 ? void 0 : completedJob.data) === null || _r === void 0 ? void 0 : _r.jobId, " is complete!")];
                case 19:
                    _b = documentId.split(":"), operationId = _b[1];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("*, job(id, jobId)")
                            .eq("id", operationId)
                            .single()];
                case 20:
                    jobOperation = _17.sent();
                    if (jobOperation.error) {
                        console.error("Failed to get jobOperation", jobOperation.error);
                        throw jobOperation.error;
                    }
                    if (type === notifications_2.NotificationEvent.JobOperationAssignment) {
                        return [2 /*return*/, "New job operation assigned to you on ".concat((_t = (_s = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.data) === null || _s === void 0 ? void 0 : _s.job) === null || _t === void 0 ? void 0 : _t.jobId)];
                    }
                    else if (type === notifications_2.NotificationEvent.JobOperationMessage) {
                        return [2 /*return*/, "New message on ".concat((_v = (_u = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.data) === null || _u === void 0 ? void 0 : _u.job) === null || _v === void 0 ? void 0 : _v.jobId, " operation: ").concat((_w = jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.data) === null || _w === void 0 ? void 0 : _w.description)];
                    }
                    return [2 /*return*/, null];
                case 21: return [4 /*yield*/, client
                        .from("procedure")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 22:
                    procedure = _17.sent();
                    if (procedure.error) {
                        console.error("Failed to get procedure", procedure.error);
                        throw procedure.error;
                    }
                    return [2 /*return*/, "Procedure ".concat((_x = procedure === null || procedure === void 0 ? void 0 : procedure.data) === null || _x === void 0 ? void 0 : _x.name, " version ").concat((_y = procedure === null || procedure === void 0 ? void 0 : procedure.data) === null || _y === void 0 ? void 0 : _y.version, " assigned to you")];
                case 23: return [4 /*yield*/, client
                        .from("quote")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 24:
                    digitalQuote = _17.sent();
                    if (digitalQuote.error) {
                        console.error("Failed to get digital quote", digitalQuote.error);
                        throw digitalQuote.error;
                    }
                    if (digitalQuote.data.digitalQuoteAcceptedBy) {
                        return [2 /*return*/, "Digital Quote ".concat((_z = digitalQuote === null || digitalQuote === void 0 ? void 0 : digitalQuote.data) === null || _z === void 0 ? void 0 : _z.quoteId, " was completed by ").concat(digitalQuote.data.digitalQuoteAcceptedBy)];
                    }
                    if (digitalQuote.data.digitalQuoteRejectedBy) {
                        return [2 /*return*/, "Digital Quote ".concat((_0 = digitalQuote === null || digitalQuote === void 0 ? void 0 : digitalQuote.data) === null || _0 === void 0 ? void 0 : _0.quoteId, " was rejected by ").concat(digitalQuote.data.digitalQuoteRejectedBy)];
                    }
                    return [2 /*return*/, "Digital Quote ".concat((_1 = digitalQuote === null || digitalQuote === void 0 ? void 0 : digitalQuote.data) === null || _1 === void 0 ? void 0 : _1.quoteId, " was accepted")];
                case 25: return [4 /*yield*/, client
                        .from("gaugeCalibrationRecord")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 26:
                    gaugeCalibration = _17.sent();
                    if (gaugeCalibration.error) {
                        console.error("Failed to get gaugeCalibration", gaugeCalibration.error);
                        throw gaugeCalibration.error;
                    }
                    return [2 /*return*/, "Gauge ".concat((_2 = gaugeCalibration === null || gaugeCalibration === void 0 ? void 0 : gaugeCalibration.data) === null || _2 === void 0 ? void 0 : _2.gaugeId, " is out of calibration")];
                case 27: return [4 /*yield*/, client
                        .from("stockTransfer")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 28:
                    stockTransfer = _17.sent();
                    if (stockTransfer.error) {
                        console.error("Failed to get stockTransfer", stockTransfer.error);
                        throw stockTransfer.error;
                    }
                    return [2 /*return*/, "Stock Transfer ".concat((_3 = stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.data) === null || _3 === void 0 ? void 0 : _3.stockTransferId, " assigned to you")];
                case 29: return [4 /*yield*/, client
                        .from("pickingList")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 30:
                    pickingList = _17.sent();
                    if (pickingList.error) {
                        console.error("Failed to get pickingList", pickingList.error);
                        throw pickingList.error;
                    }
                    return [2 /*return*/, "Picking List ".concat((_4 = pickingList === null || pickingList === void 0 ? void 0 : pickingList.data) === null || _4 === void 0 ? void 0 : _4.pickingListId, " assigned to you")];
                case 31: return [4 /*yield*/, client
                        .from("trainingAssignment")
                        .select("*, training(id, name)")
                        .eq("id", documentId)
                        .single()];
                case 32:
                    trainingAssignment = _17.sent();
                    if (trainingAssignment.error) {
                        console.error("Failed to get trainingAssignment", trainingAssignment.error);
                        throw trainingAssignment.error;
                    }
                    return [2 /*return*/, "Training \"".concat((_6 = (_5 = trainingAssignment === null || trainingAssignment === void 0 ? void 0 : trainingAssignment.data) === null || _5 === void 0 ? void 0 : _5.training) === null || _6 === void 0 ? void 0 : _6.name, "\" assigned to you")];
                case 33: return [4 /*yield*/, client
                        .from("training")
                        .select("name")
                        .eq("id", documentId)
                        .single()];
                case 34:
                    training = _17.sent();
                    if (training.error) {
                        console.error("Failed to get training", training.error);
                        throw training.error;
                    }
                    return [2 /*return*/, "Training \"".concat((_7 = training === null || training === void 0 ? void 0 : training.data) === null || _7 === void 0 ? void 0 : _7.name, "\" assigned to you")];
                case 35: return [4 /*yield*/, client
                        .from("purchaseOrder")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 36:
                    purchaseOrder = _17.sent();
                    if (purchaseOrder.error) {
                        console.error("Failed to get purchaseOrder", purchaseOrder.error);
                        throw purchaseOrder.error;
                    }
                    return [2 /*return*/, "Purchase Order ".concat((_8 = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.data) === null || _8 === void 0 ? void 0 : _8.purchaseOrderId, " assigned to you")];
                case 37: return [4 /*yield*/, client
                        .from("purchaseInvoice")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 38:
                    purchaseInvoice = _17.sent();
                    if (purchaseInvoice.error) {
                        console.error("Failed to get purchaseInvoice", purchaseInvoice.error);
                        throw purchaseInvoice.error;
                    }
                    return [2 /*return*/, "Purchase Invoice ".concat((_9 = purchaseInvoice === null || purchaseInvoice === void 0 ? void 0 : purchaseInvoice.data) === null || _9 === void 0 ? void 0 : _9.invoiceId, " assigned to you")];
                case 39: return [4 /*yield*/, client
                        .from("suggestion")
                        .select("*, user(id, fullName)")
                        .eq("id", documentId)
                        .single()];
                case 40:
                    suggestion = _17.sent();
                    if (suggestion.error) {
                        console.error("Failed to get suggestion", suggestion.error);
                        throw suggestion.error;
                    }
                    submittedBy = ((_10 = suggestion.data.user) === null || _10 === void 0 ? void 0 : _10.fullName) || "Anonymous";
                    return [2 /*return*/, "New suggestion submitted by ".concat(submittedBy)];
                case 41: return [4 /*yield*/, client
                        .from("riskRegister")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 42:
                    risk = _17.sent();
                    if (risk.error) {
                        console.error("Failed to get risk", risk.error);
                        throw risk.error;
                    }
                    return [2 /*return*/, "Risk \"".concat((_11 = risk === null || risk === void 0 ? void 0 : risk.data) === null || _11 === void 0 ? void 0 : _11.title, "\" assigned to you")];
                case 43: return [4 /*yield*/, client
                        .from("supplierQuote")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 44:
                    supplierQuoteAssignment = _17.sent();
                    if (supplierQuoteAssignment.error) {
                        console.error("Failed to get supplier quote", supplierQuoteAssignment.error);
                        throw supplierQuoteAssignment.error;
                    }
                    return [2 /*return*/, "Supplier Quote ".concat((_12 = supplierQuoteAssignment === null || supplierQuoteAssignment === void 0 ? void 0 : supplierQuoteAssignment.data) === null || _12 === void 0 ? void 0 : _12.supplierQuoteId, " assigned to you")];
                case 45: return [4 /*yield*/, client
                        .from("supplierQuote")
                        .select("*")
                        .eq("id", documentId)
                        .single()];
                case 46:
                    supplierQuote = _17.sent();
                    if (supplierQuote.error) {
                        console.error("Failed to get supplier quote", supplierQuote.error);
                        throw supplierQuote.error;
                    }
                    externalNotes = supplierQuote.data.externalNotes;
                    respondedBy = (externalNotes === null || externalNotes === void 0 ? void 0 : externalNotes.lastSubmittedBy) || "Supplier";
                    return [2 /*return*/, "Supplier Quote ".concat((_13 = supplierQuote === null || supplierQuote === void 0 ? void 0 : supplierQuote.data) === null || _13 === void 0 ? void 0 : _13.supplierQuoteId, " was submitted by ").concat(respondedBy)];
                case 47:
                    if (!(documentType === "purchaseOrder")) return [3 /*break*/, 49];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .select("purchaseOrderId")
                            .eq("id", documentId)
                            .single()];
                case 48:
                    purchaseOrderResult = _17.sent();
                    if (purchaseOrderResult.error || !purchaseOrderResult.data) {
                        console.error("Failed to retrieve purchase order for approval notification", purchaseOrderResult.error);
                        return [2 /*return*/, "Purchase order requires your approval"];
                    }
                    return [2 /*return*/, "Purchase order ".concat(purchaseOrderResult.data.purchaseOrderId, " requires your approval")];
                case 49:
                    if (!(documentType === "qualityDocument")) return [3 /*break*/, 51];
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .select("name")
                            .eq("id", documentId)
                            .single()];
                case 50:
                    qualityDocumentResult = _17.sent();
                    if (qualityDocumentResult.error || !qualityDocumentResult.data) {
                        console.error("Failed to retrieve quality document for approval notification", qualityDocumentResult.error);
                        return [2 /*return*/, "Quality document requires your approval"];
                    }
                    qualityDocumentName = (_14 = qualityDocumentResult.data.name) !== null && _14 !== void 0 ? _14 : "Untitled";
                    return [2 /*return*/, "Quality document \"".concat(qualityDocumentName, "\" requires your approval")];
                case 51: return [2 /*return*/, "Approval requested"];
                case 52:
                    if (!(documentType === "purchaseOrder")) return [3 /*break*/, 54];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .select("purchaseOrderId")
                            .eq("id", documentId)
                            .single()];
                case 53:
                    poApproved = _17.sent();
                    if (poApproved.error || !poApproved.data) {
                        return [2 /*return*/, "Your purchase order was approved"];
                    }
                    return [2 /*return*/, "Purchase order ".concat(poApproved.data.purchaseOrderId, " was approved")];
                case 54:
                    if (!(documentType === "qualityDocument")) return [3 /*break*/, 56];
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .select("name")
                            .eq("id", documentId)
                            .single()];
                case 55:
                    qdApproved = _17.sent();
                    if (qdApproved.error || !qdApproved.data) {
                        return [2 /*return*/, "Your quality document was approved"];
                    }
                    return [2 /*return*/, "Quality document \"".concat((_15 = qdApproved.data.name) !== null && _15 !== void 0 ? _15 : "Untitled", "\" was approved")];
                case 56: return [2 /*return*/, "Your approval request was approved"];
                case 57:
                    if (!(documentType === "purchaseOrder")) return [3 /*break*/, 59];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .select("purchaseOrderId")
                            .eq("id", documentId)
                            .single()];
                case 58:
                    poRejected = _17.sent();
                    if (poRejected.error || !poRejected.data) {
                        return [2 /*return*/, "Your purchase order was rejected"];
                    }
                    return [2 /*return*/, "Purchase order ".concat(poRejected.data.purchaseOrderId, " was rejected")];
                case 59:
                    if (!(documentType === "qualityDocument")) return [3 /*break*/, 61];
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .select("name")
                            .eq("id", documentId)
                            .single()];
                case 60:
                    qdRejected = _17.sent();
                    if (qdRejected.error || !qdRejected.data) {
                        return [2 /*return*/, "Your quality document was rejected"];
                    }
                    return [2 /*return*/, "Quality document \"".concat((_16 = qdRejected.data.name) !== null && _16 !== void 0 ? _16 : "Untitled", "\" was rejected")];
                case 61: return [2 /*return*/, "Your approval request was rejected"];
                case 62: return [2 /*return*/, null];
            }
        });
    });
}
// Per-event default destinations. Callers can override by passing
// `destinations` in the payload; otherwise these defaults apply.
// InApp is always added separately and cannot be opted out of.
var defaultDestinations = (_a = {},
    _a[notifications_2.NotificationEvent.ApprovalApproved] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.ApprovalRejected] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.ApprovalRequested] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.DigitalQuoteResponse] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.GaugeCalibrationExpired] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.JobAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.JobCompleted] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.JobOperationAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.JobOperationMessage] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.MaintenanceDispatchAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.MaintenanceDispatchCreated] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.NonConformanceAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.ProcedureAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.PurchaseInvoiceAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.PurchaseOrderAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.QuoteAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.QuoteExpired] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.RiskAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.SalesOrderAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.SalesRfqAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.SalesRfqReady] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.StockTransferAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.PickingListAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.SuggestionResponse] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.SupplierQuoteAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.SupplierQuoteResponse] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.TrainingAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a[notifications_2.NotificationEvent.ResourceTrainingAssignment] = [
        notifications_2.NotificationDestination.Email,
        notifications_2.NotificationDestination.Slack
    ],
    _a);
exports.notifyFunction = client_1.inngest.createFunction({
    id: "notify",
    retries: 3
}, { event: "carbon/notify" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, destinations, client, description, userIds, topic, emailAllowed, emailEvents, slackEvents;
    var _c, _d;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                payload = event.data;
                destinations = Array.from(new Set(__spreadArray([
                    notifications_2.NotificationDestination.InApp
                ], ((_d = (_c = payload.destinations) !== null && _c !== void 0 ? _c : defaultDestinations[payload.event]) !== null && _d !== void 0 ? _d : []), true)));
                client = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, step.run("get-description", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, getDescription(client, payload.event, payload.documentId, payload.documentType)];
                        });
                    }); })];
            case 1:
                description = _e.sent();
                if (!description) {
                    throw new Error("No description found for notification type ".concat(payload.event, " with documentId ").concat(payload.documentId));
                }
                return [4 /*yield*/, step.run("resolve-recipients", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var ids, result;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(payload.recipient.type === "user")) return [3 /*break*/, 1];
                                    ids = [payload.recipient.userId];
                                    return [3 /*break*/, 4];
                                case 1:
                                    if (!(payload.recipient.type === "users")) return [3 /*break*/, 2];
                                    ids = payload.recipient.userIds;
                                    return [3 /*break*/, 4];
                                case 2: return [4 /*yield*/, client.rpc("users_for_groups", {
                                        groups: payload.recipient.groupIds
                                    })];
                                case 3:
                                    result = _b.sent();
                                    if (result.error) {
                                        console.error("Failed to get userIds for groups", result.error);
                                        throw result.error;
                                    }
                                    ids = ((_a = result.data) !== null && _a !== void 0 ? _a : []);
                                    _b.label = 4;
                                case 4:
                                    // Don't notify the sender about their own action.
                                    if (payload.from)
                                        ids = ids.filter(function (id) { return id !== payload.from; });
                                    return [2 /*return*/, __spreadArray([], new Set(ids), true)];
                            }
                        });
                    }); })];
            case 2:
                userIds = _e.sent();
                if (userIds.length === 0) {
                    return [2 /*return*/];
                }
                if (!(payload.event === notifications_2.NotificationEvent.NonConformanceAssignment &&
                    payload.recipient.type === "user")) return [3 /*break*/, 4];
                return [4 /*yield*/, step.run("send-integration-notification", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var integrationsResult, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    return [4 /*yield*/, getCompanyIntegrations(client, payload.companyId)];
                                case 1:
                                    integrationsResult = _a.sent();
                                    if (!(integrationsResult.data && integrationsResult.data.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, notifications_1.notifyTaskAssigned)({ client: client }, integrationsResult.data, {
                                            carbonUrl: "".concat(env_1.ERP_URL, "/x/issue/").concat(payload.documentId),
                                            companyId: payload.companyId,
                                            task: {
                                                assignee: payload.recipient.type === "user"
                                                    ? payload.recipient.userId
                                                    : "",
                                                id: payload.documentId,
                                                table: "nonConformance",
                                                title: description
                                            },
                                            userId: payload.from || "system"
                                        })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _a.sent();
                                    console.error("Failed to send integration assignment notification:", error_1);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                topic = (0, notifications_2.getNotificationTopic)(payload.event);
                if (!destinations.includes(notifications_2.NotificationDestination.InApp)) return [3 /*break*/, 6];
                return [4 /*yield*/, step.run("write-in-app-notifications", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var rows, _a, data, error;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    rows = userIds.map(function (userId) {
                                        var _a, _b;
                                        return ({
                                            companyId: payload.companyId,
                                            documentType: (_a = payload.documentType) !== null && _a !== void 0 ? _a : null,
                                            event: payload.event,
                                            from: (_b = payload.from) !== null && _b !== void 0 ? _b : null,
                                            payload: __assign({ description: description, event: payload.event, from: payload.from, documentId: payload.documentId }, (payload.documentType && { documentType: payload.documentType })),
                                            documentId: payload.documentId,
                                            title: description,
                                            topic: topic,
                                            userId: userId
                                        });
                                    });
                                    return [4 /*yield*/, client
                                            .from("notification")
                                            .insert(rows)
                                            .select("id")];
                                case 1:
                                    _a = _c.sent(), data = _a.data, error = _a.error;
                                    if (error) {
                                        console.error("Failed to insert notification rows", error);
                                        throw error;
                                    }
                                    return [2 /*return*/, { inserted: (_b = data === null || data === void 0 ? void 0 : data.length) !== null && _b !== void 0 ? _b : 0, userIds: userIds }];
                            }
                        });
                    }); })];
            case 5:
                _e.sent();
                _e.label = 6;
            case 6:
                if (!destinations.includes(notifications_2.NotificationDestination.Email)) return [3 /*break*/, 10];
                return [4 /*yield*/, step.run("check-email-plan", function () {
                        return (0, plan_server_1.companyHasPlan)(client, payload.companyId, {
                            feature: "EMAIL_NOTIFICATIONS"
                        });
                    })];
            case 7:
                emailAllowed = _e.sent();
                if (!emailAllowed) {
                    console.warn("Email not allowed");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, step.run("resolve-email-recipients", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, users, error, subject, heading, ctaLabel, ctaUrl, recipients, events;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, client
                                        .from("user")
                                        .select("id, email, fullName")
                                        .in("id", userIds)];
                                case 1:
                                    _a = _b.sent(), users = _a.data, error = _a.error;
                                    if (error) {
                                        console.error("Failed to resolve email recipients", error);
                                        throw error;
                                    }
                                    subject = description;
                                    heading = (0, notifications_2.getNotificationEmailHeading)(payload.event);
                                    ctaLabel = (0, notifications_2.getNotificationEmailCtaLabel)(payload.event);
                                    ctaUrl = buildNotificationLink(payload.event, payload.documentId, payload.companyId, payload.documentType);
                                    recipients = (users !== null && users !== void 0 ? users : []).filter(function (u) { return u.email; });
                                    return [4 /*yield*/, Promise.all(recipients.map(function (u) { return __awaiter(void 0, void 0, void 0, function () {
                                            var html;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, (0, components_1.render)((0, email_1.NotificationEmail)({
                                                            ctaLabel: ctaLabel,
                                                            ctaUrl: ctaUrl,
                                                            heading: heading,
                                                            message: description,
                                                            preview: heading,
                                                            recipientName: (_a = u.fullName) !== null && _a !== void 0 ? _a : undefined
                                                        }))];
                                                    case 1:
                                                        html = _b.sent();
                                                        return [2 /*return*/, {
                                                                data: {
                                                                    companyId: payload.companyId,
                                                                    html: html,
                                                                    subject: subject,
                                                                    text: "".concat(description, "\n\n").concat(ctaLabel, ": ").concat(ctaUrl),
                                                                    to: u.email
                                                                },
                                                                name: "carbon/send-email"
                                                            }];
                                                }
                                            });
                                        }); }))];
                                case 2:
                                    events = _b.sent();
                                    return [2 /*return*/, events];
                            }
                        });
                    }); })];
            case 8:
                emailEvents = _e.sent();
                if (!(emailEvents.length > 0)) return [3 /*break*/, 10];
                return [4 /*yield*/, step.sendEvent("fan-out-emails", emailEvents)];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10:
                if (!destinations.includes(notifications_2.NotificationDestination.Slack)) return [3 /*break*/, 13];
                return [4 /*yield*/, step.run("resolve-slack-recipients", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, integration, error, metadata, accessToken, ctaUrl, text, slackUserIds;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, client
                                        .from("companyIntegration")
                                        .select("active, metadata")
                                        .eq("companyId", payload.companyId)
                                        .eq("id", "slack")
                                        .maybeSingle()];
                                case 1:
                                    _a = _b.sent(), integration = _a.data, error = _a.error;
                                    if (error) {
                                        console.error("Failed to resolve Slack integration", error);
                                        return [2 /*return*/, []];
                                    }
                                    if (!(integration === null || integration === void 0 ? void 0 : integration.active))
                                        return [2 /*return*/, []];
                                    metadata = integration.metadata;
                                    accessToken = metadata === null || metadata === void 0 ? void 0 : metadata.access_token;
                                    if (!accessToken)
                                        return [2 /*return*/, []];
                                    ctaUrl = buildNotificationLink(payload.event, payload.documentId, payload.companyId, payload.documentType);
                                    text = "".concat(description, "\n<").concat(ctaUrl, "|View in Carbon>");
                                    return [4 /*yield*/, Promise.all(userIds.map(function (userId) {
                                            return (0, slack_server_1.getSlackUserIdByCarbonId)(client, accessToken, userId);
                                        }))];
                                case 2:
                                    slackUserIds = _b.sent();
                                    return [2 /*return*/, slackUserIds
                                            .filter(function (id) { return !!id; })
                                            .map(function (slackUserId) { return ({
                                            data: {
                                                channel: slackUserId,
                                                companyId: payload.companyId,
                                                text: text
                                            },
                                            name: "carbon/send-slack"
                                        }); })];
                            }
                        });
                    }); })];
            case 11:
                slackEvents = _e.sent();
                if (!(slackEvents.length > 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, step.sendEvent("fan-out-slack", slackEvents)];
            case 12:
                _e.sent();
                _e.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
