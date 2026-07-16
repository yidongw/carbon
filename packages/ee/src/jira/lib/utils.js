"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCarbonStatusToJiraCategory = exports.mapJiraStatusToCarbonStatus = void 0;
/**
 * Maps Jira status category to Carbon task status.
 *
 * Jira organizes all statuses into three categories:
 * - "new" (To Do, Backlog, Open, etc.) → Pending
 * - "indeterminate" (In Progress, In Review, etc.) → In Progress
 * - "done" (Done, Closed, Resolved, etc.) → Completed
 */
var mapJiraStatusToCarbonStatus = function (statusCategory) {
    switch (statusCategory) {
        case "new":
            return "Pending";
        case "indeterminate":
            return "In Progress";
        case "done":
            return "Completed";
        default:
            return "Pending";
    }
};
exports.mapJiraStatusToCarbonStatus = mapJiraStatusToCarbonStatus;
/**
 * Maps Carbon task status to target Jira status category.
 *
 * Note: Jira uses transitions to change status, not direct status updates.
 * The caller must find an available transition that leads to a status
 * in the target category.
 */
var mapCarbonStatusToJiraCategory = function (status) {
    switch (status) {
        case "Pending":
            return "new";
        case "In Progress":
            return "indeterminate";
        case "Completed":
        case "Skipped":
            return "done";
        default:
            throw new Error("Unknown Carbon task status: ".concat(status));
    }
};
exports.mapCarbonStatusToJiraCategory = mapCarbonStatusToJiraCategory;
