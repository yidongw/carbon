"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraWebhookEventSchema = exports.JiraRemoteLinkSchema = exports.JiraAccessibleResourceSchema = exports.JiraTransitionSchema = exports.JiraIssueTypeSchema = exports.JiraProjectSchema = exports.JiraIssueMappingSchema = exports.JiraIssueSchema = exports.JiraUserSchema = exports.JiraStatusSchema = void 0;
var zod_1 = require("zod");
/**
 * Jira issue status
 */
exports.JiraStatusSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    statusCategory: zod_1.z.object({
        id: zod_1.z.number(),
        key: zod_1.z.enum(["new", "indeterminate", "done"]),
        name: zod_1.z.string()
    })
});
/**
 * Jira user (assignee)
 */
exports.JiraUserSchema = zod_1.z.object({
    accountId: zod_1.z.string(),
    emailAddress: zod_1.z.string().optional(),
    displayName: zod_1.z.string(),
    avatarUrls: zod_1.z
        .object({
        "48x48": zod_1.z.string().optional()
    })
        .optional()
});
/**
 * Jira issue - the main entity we work with
 */
exports.JiraIssueSchema = zod_1.z.object({
    id: zod_1.z.string(),
    key: zod_1.z.string(),
    self: zod_1.z.string().optional(),
    fields: zod_1.z.object({
        summary: zod_1.z.string(),
        description: zod_1.z.any().nullable(), // ADF format
        status: exports.JiraStatusSchema,
        assignee: exports.JiraUserSchema.nullable(),
        duedate: zod_1.z.string().nullable().optional(),
        issuetype: zod_1.z
            .object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            iconUrl: zod_1.z.string().optional()
        })
            .optional(),
        project: zod_1.z
            .object({
            id: zod_1.z.string(),
            key: zod_1.z.string(),
            name: zod_1.z.string()
        })
            .optional(),
        priority: zod_1.z
            .object({
            id: zod_1.z.string(),
            name: zod_1.z.string()
        })
            .optional()
    })
});
/**
 * Simplified Jira issue for external mapping storage
 */
exports.JiraIssueMappingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    key: zod_1.z.string(),
    summary: zod_1.z.string(),
    url: zod_1.z.string(),
    status: zod_1.z.object({
        name: zod_1.z.string(),
        category: zod_1.z.enum(["new", "indeterminate", "done"])
    }),
    assignee: zod_1.z
        .object({
        emailAddress: zod_1.z.string().optional(),
        displayName: zod_1.z.string()
    })
        .nullable()
});
/**
 * Jira project
 */
exports.JiraProjectSchema = zod_1.z.object({
    id: zod_1.z.string(),
    key: zod_1.z.string(),
    name: zod_1.z.string(),
    avatarUrls: zod_1.z
        .object({
        "48x48": zod_1.z.string().optional()
    })
        .optional()
});
/**
 * Jira issue type (Task, Bug, Story, etc.)
 */
exports.JiraIssueTypeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    iconUrl: zod_1.z.string().optional(),
    subtask: zod_1.z.boolean()
});
/**
 * Jira transition (for changing issue status)
 */
exports.JiraTransitionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    to: exports.JiraStatusSchema
});
/**
 * Jira accessible resource (returned from OAuth flow)
 */
exports.JiraAccessibleResourceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    url: zod_1.z.string(),
    name: zod_1.z.string(),
    scopes: zod_1.z.array(zod_1.z.string()),
    avatarUrl: zod_1.z.string().optional()
});
/**
 * Jira remote link (for backlinks from Jira to Carbon)
 */
exports.JiraRemoteLinkSchema = zod_1.z.object({
    id: zod_1.z.number(),
    self: zod_1.z.string(),
    globalId: zod_1.z.string(),
    application: zod_1.z.object({
        type: zod_1.z.string().optional(),
        name: zod_1.z.string().optional()
    }),
    object: zod_1.z.object({
        url: zod_1.z.string(),
        title: zod_1.z.string()
    })
});
/**
 * Jira webhook event payload
 */
exports.JiraWebhookEventSchema = zod_1.z.object({
    timestamp: zod_1.z.number(),
    webhookEvent: zod_1.z.string(),
    issue: exports.JiraIssueSchema.optional(),
    changelog: zod_1.z
        .object({
        id: zod_1.z.string(),
        items: zod_1.z.array(zod_1.z.object({
            field: zod_1.z.string(),
            fieldtype: zod_1.z.string(),
            fieldId: zod_1.z.string().optional(),
            from: zod_1.z.string().nullable(),
            fromString: zod_1.z.string().nullable(),
            to: zod_1.z.string().nullable(),
            toString: zod_1.z.string().nullable()
        }))
    })
        .optional(),
    user: exports.JiraUserSchema.optional()
});
