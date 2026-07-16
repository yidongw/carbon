"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDocumentCreated = formatDocumentCreated;
exports.formatStatusUpdate = formatStatusUpdate;
exports.formatTaskUpdate = formatTaskUpdate;
exports.formatAssignmentUpdate = formatAssignmentUpdate;
exports.formatSimpleNotification = formatSimpleNotification;
exports.getStatusEmoji = getStatusEmoji;
exports.getTaskStatusEmoji = getTaskStatusEmoji;
exports.formatNonConformanceCreated = formatNonConformanceCreated;
function getDocumentTypeInfo(documentType) {
    var typeMap = {
        nonConformance: {
            emoji: "⚠️",
            name: "Issue",
            urlPath: "/x/issue"
        }
    };
    return typeMap[documentType];
}
/**
 * Get document identifier for display
 */
function getDocumentIdentifier(data) {
    switch (data.documentType) {
        case "nonConformance":
            return data.nonConformanceId;
        default:
            throw new Error("Unknown document type: ".concat(data.documentType));
    }
}
/**
 * Format the initial document creation message
 */
function formatDocumentCreated(data, baseUrl) {
    var typeInfo = getDocumentTypeInfo(data.documentType);
    var identifier = getDocumentIdentifier(data);
    var blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: "".concat(typeInfo.emoji, " #").concat(identifier)
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*".concat(data.title || "No title", "*\n").concat(data.description || "_No description provided_")
            },
            fields: [
                {
                    type: "mrkdwn",
                    text: "*Status:*\n".concat(data.status || "Unknown")
                },
                {
                    type: "mrkdwn",
                    text: "*Type:*\n".concat(typeInfo.name)
                }
            ]
        }
    ];
    // Add document-specific fields
    var specificFields = getDocumentSpecificFields(data);
    if (specificFields.length > 0) {
        blocks.push({
            type: "section",
            fields: specificFields
        });
    }
    // Add document-specific sections
    var specificSections = getDocumentSpecificSections(data);
    blocks.push.apply(blocks, specificSections);
    // Add context
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: "Created ".concat(data.createdBy ? "by <@".concat(data.createdBy, ">") : "", " ").concat(data.createdAt
                    ? "on <!date^".concat(Math.floor(new Date(data.createdAt).getTime() / 1000), "^{date_short_pretty} at {time}|").concat(data.createdAt, ">")
                    : "").trim()
            }
        ]
    });
    // Add action buttons
    blocks.push({
        type: "actions",
        elements: [
            {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "View in Carbon"
                },
                url: "".concat(baseUrl).concat(typeInfo.urlPath, "/").concat(data.id),
                action_id: "view_in_carbon"
            },
            {
                type: "button",
                text: {
                    type: "plain_text",
                    text: "Update Status"
                },
                value: data.id,
                action_id: "update_".concat(data.documentType, "_status")
            }
        ]
    });
    return blocks;
}
/**
 * Get document-specific fields for the main section
 */
function getDocumentSpecificFields(data) {
    var fields = [];
    switch (data.documentType) {
        case "nonConformance":
            var ncrData = data;
            if (ncrData.severity) {
                fields.push({
                    type: "mrkdwn",
                    text: "*Severity:*\n".concat(ncrData.severity)
                });
            }
            if (ncrData.typeName) {
                fields.push({
                    type: "mrkdwn",
                    text: "*Issue Type:*\n".concat(ncrData.typeName)
                });
            }
            break;
    }
    return fields;
}
/**
 * Get document-specific sections
 */
function getDocumentSpecificSections(data) {
    var _a, _b, _c, _d;
    var sections = [];
    switch (data.documentType) {
        case "nonConformance":
            var ncrData = data;
            if (((_a = ncrData.investigationTypes) === null || _a === void 0 ? void 0 : _a.length) ||
                ((_b = ncrData.requiredActions) === null || _b === void 0 ? void 0 : _b.length)) {
                var text = "";
                if ((_c = ncrData.investigationTypes) === null || _c === void 0 ? void 0 : _c.length) {
                    text += "*Investigations:*\n".concat(ncrData.investigationTypes
                        .map(function (t) { return "\u2022 ".concat(t); })
                        .join("\n"), "\n\n");
                }
                if ((_d = ncrData.requiredActions) === null || _d === void 0 ? void 0 : _d.length) {
                    text += "*Required Actions:*\n".concat(ncrData.requiredActions
                        .map(function (a) { return "\u2022 ".concat(a); })
                        .join("\n"));
                }
                sections.push({
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: text.trim()
                    }
                });
            }
            break;
    }
    return sections;
}
/**
 * Format a status update message
 */
function formatStatusUpdate(documentType, documentIdentifier, update) {
    var emoji = getStatusEmoji(update.newStatus);
    var blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "".concat(emoji, " *Issue Status Updated*\n").concat(documentIdentifier)
            }
        },
        {
            type: "section",
            fields: [
                {
                    type: "mrkdwn",
                    text: "*From:*\n".concat(update.previousStatus)
                },
                {
                    type: "mrkdwn",
                    text: "*To:*\n".concat(update.newStatus)
                }
            ]
        }
    ];
    if (update.reason) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Reason:* ".concat(update.reason)
            }
        });
    }
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: "Updated by <@".concat(update.updatedBy, "> at <!date^").concat(Math.floor(Date.now() / 1000), "^{date_short_pretty} {time}|").concat(new Date().toISOString(), ">")
            }
        ]
    });
    return blocks;
}
/**
 * Format a task update message
 */
function formatTaskUpdate(documentType, documentIdentifier, update) {
    var taskTypeLabel = {
        investigation: "Investigation",
        action: "Action",
        approval: "Approval"
    }[update.taskType];
    var statusEmoji = getTaskStatusEmoji(update.status);
    var blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "".concat(statusEmoji, " *").concat(taskTypeLabel, " Task ").concat(update.status, "*\n_").concat(update.taskName, "_")
            }
        }
    ];
    var fields = [];
    if (update.assignee) {
        fields.push({
            type: "mrkdwn",
            text: "*Assigned to:*\n<@".concat(update.assignee, ">")
        });
    }
    if (update.completedBy) {
        fields.push({
            type: "mrkdwn",
            text: "*Completed by:*\n<@".concat(update.completedBy, ">")
        });
    }
    if (fields.length > 0) {
        blocks.push({
            type: "section",
            fields: fields
        });
    }
    if (update.notes) {
        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Notes:* ".concat(update.notes)
            }
        });
    }
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: "#".concat(documentIdentifier, " ").concat(update.completedAt
                    ? "\u2022 Completed <!date^".concat(Math.floor(new Date(update.completedAt).getTime() / 1000), "^{date_short_pretty} at {time}|").concat(update.completedAt, ">")
                    : "").trim()
            }
        ]
    });
    return blocks;
}
/**
 * Format an assignment update message
 */
function formatAssignmentUpdate(documentType, documentIdentifier, update) {
    var blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "\uD83C\uDFAF *Assignment Updated*\n".concat(documentIdentifier)
            }
        }
    ];
    var fields = [];
    if (update.previousAssignee) {
        fields.push({
            type: "mrkdwn",
            text: "*Previous Assignee:*\n<@".concat(update.previousAssignee, ">")
        });
    }
    fields.push({
        type: "mrkdwn",
        text: "*New Assignee:*\n<@".concat(update.newAssignee, ">")
    });
    blocks.push({
        type: "section",
        fields: fields
    });
    blocks.push({
        type: "context",
        elements: [
            {
                type: "mrkdwn",
                text: "Updated by <@".concat(update.updatedBy, "> at <!date^").concat(Math.floor(Date.now() / 1000), "^{date_short_pretty} {time}|").concat(new Date().toISOString(), ">")
            }
        ]
    });
    return blocks;
}
/**
 * Format a simple notification message
 */
function formatSimpleNotification(title, message, context) {
    var blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*".concat(title, "*\n").concat(message)
            }
        }
    ];
    if (context) {
        blocks.push({
            type: "context",
            elements: [
                {
                    type: "mrkdwn",
                    text: context
                }
            ]
        });
    }
    return blocks;
}
/**
 * Get status emoji based on status string
 */
function getStatusEmoji(status) {
    var statusLower = status.toLowerCase();
    if (statusLower.includes("closed") || statusLower.includes("complete")) {
        return "✅";
    }
    else if (statusLower.includes("progress") ||
        statusLower.includes("review")) {
        return "🚀";
    }
    else if (statusLower.includes("pending") || statusLower.includes("open")) {
        return "📋";
    }
    else if (statusLower.includes("rejected") ||
        statusLower.includes("cancelled")) {
        return "❌";
    }
    return "📌";
}
/**
 * Get task status emoji based on status string
 */
function getTaskStatusEmoji(status) {
    var statusLower = status.toLowerCase();
    if (statusLower.includes("completed")) {
        return "✅";
    }
    else if (statusLower.includes("progress")) {
        return "⏳";
    }
    else if (statusLower.includes("skipped")) {
        return "⏭️";
    }
    else if (statusLower.includes("pending")) {
        return "⏸️";
    }
    return "📝";
}
// Backward compatibility exports for NCR-specific functions
function formatNonConformanceCreated(data, baseUrl) {
    return formatDocumentCreated(data, baseUrl);
}
