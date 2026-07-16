"use strict";
// Notification event taxonomy. Kept as a standalone package because the
// enums are referenced from app routes, scheduled jobs, and the inngest
// notify function. Callers dispatch a `carbon/notify` event via
// @carbon/lib's `trigger()` and the notify function handles fan-out
// (in-app / email / slack).
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDestination = exports.NotificationTopic = exports.NotificationEvent = void 0;
exports.getNotificationTopic = getNotificationTopic;
exports.getNotificationEmailHeading = getNotificationEmailHeading;
exports.getNotificationEmailCtaLabel = getNotificationEmailCtaLabel;
exports.getNotificationTopicPhrase = getNotificationTopicPhrase;
var NotificationEvent;
(function (NotificationEvent) {
    NotificationEvent["ApprovalApproved"] = "approval-approved";
    NotificationEvent["ApprovalRejected"] = "approval-rejected";
    NotificationEvent["ApprovalRequested"] = "approval-requested";
    NotificationEvent["DigitalQuoteResponse"] = "digital-quote-response";
    NotificationEvent["GaugeCalibrationExpired"] = "gauge-calibration-expired";
    NotificationEvent["JobAssignment"] = "job-assignment";
    NotificationEvent["JobCompleted"] = "job-completed";
    NotificationEvent["JobOperationAssignment"] = "job-operation-assignment";
    NotificationEvent["JobOperationMessage"] = "job-operation-message";
    NotificationEvent["MaintenanceDispatchAssignment"] = "maintenance-dispatch-assignment";
    NotificationEvent["MaintenanceDispatchCreated"] = "maintenance-dispatch-created";
    NotificationEvent["NonConformanceAssignment"] = "issue-assignment";
    NotificationEvent["PickingListAssignment"] = "picking-list-assignment";
    NotificationEvent["ProcedureAssignment"] = "procedure-assignment";
    NotificationEvent["PurchaseInvoiceAssignment"] = "purchase-invoice-assignment";
    NotificationEvent["PurchaseOrderAssignment"] = "purchase-order-assignment";
    NotificationEvent["QuoteAssignment"] = "quote-assignment";
    NotificationEvent["QuoteExpired"] = "quote-expired";
    NotificationEvent["RiskAssignment"] = "risk-assignment";
    NotificationEvent["SalesOrderAssignment"] = "sales-order-assignment";
    NotificationEvent["SalesRfqAssignment"] = "sales-rfq-assignment";
    NotificationEvent["SalesRfqReady"] = "sales-rfq-ready";
    NotificationEvent["StockTransferAssignment"] = "stock-transfer-assignment";
    NotificationEvent["SuggestionResponse"] = "suggestion-response";
    NotificationEvent["SupplierQuoteAssignment"] = "supplier-quote-assignment";
    NotificationEvent["SupplierQuoteResponse"] = "supplier-quote-response";
    NotificationEvent["TrainingAssignment"] = "training-assignment";
    NotificationEvent["ResourceTrainingAssignment"] = "resource-training-assignment";
    NotificationEvent["Digest"] = "digest";
})(NotificationEvent || (exports.NotificationEvent = NotificationEvent = {}));
// Coarse topic buckets. Each event maps to exactly one topic via
// getNotificationTopic. The string values are persisted in the
// `notification.topic` column, so renaming any of these is a migration.
var NotificationTopic;
(function (NotificationTopic) {
    NotificationTopic["Approval"] = "approval";
    NotificationTopic["General"] = "general";
    NotificationTopic["Inventory"] = "inventory";
    NotificationTopic["Job"] = "job";
    NotificationTopic["Maintenance"] = "maintenance";
    NotificationTopic["Purchasing"] = "purchasing";
    NotificationTopic["Quality"] = "quality";
    NotificationTopic["Quote"] = "quote";
    NotificationTopic["Sales"] = "sales";
    NotificationTopic["Suggestion"] = "suggestion";
    NotificationTopic["Training"] = "training";
})(NotificationTopic || (exports.NotificationTopic = NotificationTopic = {}));
// Fan-out targets understood by the notify Inngest function. inApp is
// always included regardless of what the caller passes — the topbar reflects
// every notification. email and slack are opt-in extras.
var NotificationDestination;
(function (NotificationDestination) {
    NotificationDestination["InApp"] = "inApp";
    NotificationDestination["Email"] = "email";
    NotificationDestination["Slack"] = "slack";
})(NotificationDestination || (exports.NotificationDestination = NotificationDestination = {}));
function getNotificationTopic(event) {
    switch (event) {
        case NotificationEvent.JobAssignment:
        case NotificationEvent.JobOperationAssignment:
        case NotificationEvent.JobOperationMessage:
        case NotificationEvent.JobCompleted:
            return NotificationTopic.Job;
        case NotificationEvent.PurchaseInvoiceAssignment:
        case NotificationEvent.PurchaseOrderAssignment:
            return NotificationTopic.Purchasing;
        case NotificationEvent.QuoteAssignment:
        case NotificationEvent.QuoteExpired:
        case NotificationEvent.DigitalQuoteResponse:
        case NotificationEvent.SupplierQuoteAssignment:
        case NotificationEvent.SupplierQuoteResponse:
            return NotificationTopic.Quote;
        case NotificationEvent.SalesOrderAssignment:
        case NotificationEvent.SalesRfqAssignment:
        case NotificationEvent.SalesRfqReady:
            return NotificationTopic.Sales;
        case NotificationEvent.MaintenanceDispatchAssignment:
        case NotificationEvent.MaintenanceDispatchCreated:
        case NotificationEvent.GaugeCalibrationExpired:
            return NotificationTopic.Maintenance;
        case NotificationEvent.NonConformanceAssignment:
        case NotificationEvent.RiskAssignment:
            return NotificationTopic.Quality;
        case NotificationEvent.ProcedureAssignment:
        case NotificationEvent.TrainingAssignment:
        case NotificationEvent.ResourceTrainingAssignment:
            return NotificationTopic.Training;
        case NotificationEvent.PickingListAssignment:
        case NotificationEvent.StockTransferAssignment:
            return NotificationTopic.Inventory;
        case NotificationEvent.SuggestionResponse:
            return NotificationTopic.Suggestion;
        case NotificationEvent.ApprovalApproved:
        case NotificationEvent.ApprovalRejected:
        case NotificationEvent.ApprovalRequested:
            return NotificationTopic.Approval;
        default:
            return NotificationTopic.General;
    }
}
// Generic category label rendered as the in-email heading (sits under the
// "New notification" eyebrow). The inbox subject is the per-event description
// so users can scan their inbox; this gives the email body a stable category
// title regardless of the record specifics in the description.
function getNotificationEmailHeading(event) {
    switch (event) {
        case NotificationEvent.JobAssignment:
            return "Job assigned to you";
        case NotificationEvent.JobCompleted:
            return "Job completed";
        case NotificationEvent.JobOperationAssignment:
            return "Job operation assigned to you";
        case NotificationEvent.JobOperationMessage:
            return "New job operation message";
        case NotificationEvent.PurchaseInvoiceAssignment:
            return "Purchase invoice assigned to you";
        case NotificationEvent.PurchaseOrderAssignment:
            return "Purchase order assigned to you";
        case NotificationEvent.QuoteAssignment:
            return "Quote assigned to you";
        case NotificationEvent.QuoteExpired:
            return "Quote expired";
        case NotificationEvent.DigitalQuoteResponse:
            return "Digital quote response";
        case NotificationEvent.SupplierQuoteAssignment:
            return "Supplier quote assigned to you";
        case NotificationEvent.SupplierQuoteResponse:
            return "Supplier quote response";
        case NotificationEvent.SalesOrderAssignment:
            return "Sales order assigned to you";
        case NotificationEvent.SalesRfqAssignment:
            return "RFQ assigned to you";
        case NotificationEvent.SalesRfqReady:
            return "RFQ ready for quote";
        case NotificationEvent.MaintenanceDispatchAssignment:
            return "Maintenance dispatch assigned to you";
        case NotificationEvent.MaintenanceDispatchCreated:
            return "New maintenance dispatch";
        case NotificationEvent.GaugeCalibrationExpired:
            return "Gauge calibration expired";
        case NotificationEvent.NonConformanceAssignment:
            return "Issue assigned to you";
        case NotificationEvent.RiskAssignment:
            return "Risk assigned to you";
        case NotificationEvent.ProcedureAssignment:
            return "Procedure assigned to you";
        case NotificationEvent.TrainingAssignment:
            return "Training assigned to you";
        case NotificationEvent.ResourceTrainingAssignment:
            return "New training available";
        case NotificationEvent.PickingListAssignment:
            return "Picking list assigned to you";
        case NotificationEvent.StockTransferAssignment:
            return "Stock transfer assigned to you";
        case NotificationEvent.SuggestionResponse:
            return "New suggestion submitted";
        case NotificationEvent.ApprovalRequested:
            return "Approval requested";
        case NotificationEvent.ApprovalApproved:
            return "Your request was approved";
        case NotificationEvent.ApprovalRejected:
            return "Your request was rejected";
        default:
            return "You have a new notification";
    }
}
// Action label shown on the email's CTA button. Falls back to "View" when no
// link is available. Tone matches the heading — short, imperative.
function getNotificationEmailCtaLabel(event) {
    switch (event) {
        case NotificationEvent.ApprovalRequested:
            return "Review approval";
        case NotificationEvent.ApprovalApproved:
        case NotificationEvent.ApprovalRejected:
            return "View decision";
        case NotificationEvent.JobCompleted:
            return "View job";
        case NotificationEvent.SuggestionResponse:
            return "View suggestion";
        case NotificationEvent.GaugeCalibrationExpired:
            return "View gauge";
        case NotificationEvent.QuoteExpired:
            return "View quote";
        case NotificationEvent.DigitalQuoteResponse:
        case NotificationEvent.SupplierQuoteResponse:
            return "View response";
        default:
            return "View details";
    }
}
function getNotificationTopicPhrase(topic, count) {
    var plural = count === 1 ? "notification" : "notifications";
    switch (topic) {
        case NotificationTopic.Job:
            return "".concat(count, " job ").concat(plural);
        case NotificationTopic.Purchasing:
            return "".concat(count, " purchasing ").concat(plural);
        case NotificationTopic.Quote:
            return "".concat(count, " quote ").concat(plural);
        case NotificationTopic.Sales:
            return "".concat(count, " sales ").concat(plural);
        case NotificationTopic.Maintenance:
            return "".concat(count, " maintenance ").concat(plural);
        case NotificationTopic.Quality:
            return "".concat(count, " quality ").concat(plural);
        case NotificationTopic.Training:
            return "".concat(count, " training ").concat(plural);
        case NotificationTopic.Inventory:
            return "".concat(count, " inventory ").concat(plural);
        case NotificationTopic.Suggestion:
            return "".concat(count, " suggestion ").concat(plural);
        case NotificationTopic.Approval:
            return "".concat(count, " approval ").concat(plural);
        case NotificationTopic.General:
        default:
            return "".concat(count, " unread ").concat(plural);
    }
}
