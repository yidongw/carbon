"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.inngest = void 0;
// Re-export the inngest client and helpers
var client_ts_1 = require("./client.ts");
Object.defineProperty(exports, "inngest", { enumerable: true, get: function () { return client_ts_1.inngest; } });
var events_1 = require("./functions/events");
var integrations_1 = require("./functions/integrations");
// Import all functions
var notifications_1 = require("./functions/notifications");
var scheduled_1 = require("./functions/scheduled");
var tasks_1 = require("./functions/tasks");
// Export all functions for serving via serve() or connect()
exports.functions = [
    // Notifications
    notifications_1.notifyFunction,
    notifications_1.sendEmailFunction,
    notifications_1.sendSlackFunction,
    // Event handlers
    events_1.auditFunction,
    events_1.eventQueueFunction,
    events_1.searchFunction,
    events_1.syncFunction,
    events_1.webhookFunction,
    events_1.workflowFunction,
    events_1.embeddingFunction,
    // Tasks
    tasks_1.modelThumbnailFunction,
    tasks_1.updatePermissionsFunction,
    tasks_1.recalculateFunction,
    tasks_1.releaseJobFunction,
    tasks_1.userAdminFunction,
    tasks_1.postTransactionFunction,
    tasks_1.rescheduleJobFunction,
    tasks_1.onboardFunction,
    tasks_1.printJobFunction,
    tasks_1.printJobDeliverFunction,
    // Scheduled
    scheduled_1.cleanupFunction,
    scheduled_1.demoCleanupFunction,
    scheduled_1.dispatchFunction,
    scheduled_1.expireAnnualPlansFunction,
    scheduled_1.auditArchiveFunction,
    scheduled_1.mrpFunction,
    scheduled_1.weeklyFunction,
    scheduled_1.updateExchangeRatesFunction,
    scheduled_1.notificationDigestFunction,
    scheduled_1.notificationPurgeFunction,
    // Integrations
    integrations_1.jiraSyncFunction,
    integrations_1.linearSyncFunction,
    integrations_1.paperlessPartsFunction,
    integrations_1.accountingBackfillFunction,
    integrations_1.syncExternalAccountingFunction,
    integrations_1.slackDocumentCreatedFunction,
    integrations_1.slackDocumentStatusUpdateFunction,
    integrations_1.slackDocumentTaskUpdateFunction,
    integrations_1.slackDocumentAssignmentUpdateFunction,
    integrations_1.timeCardAutoCloseFunction
];
