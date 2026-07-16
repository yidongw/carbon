"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncIssueFromLinearSchema = exports.syncIssueFromJiraSchema = void 0;
var zod_1 = require("zod");
/**
 * Webhook payload schemas.
 * Extracted into a separate file so they can be imported by app code
 * without pulling in server-only dependencies.
 */
exports.syncIssueFromJiraSchema = zod_1.z.object({
    companyId: zod_1.z.string(),
    event: zod_1.z.object({
        timestamp: zod_1.z.number().optional(),
        webhookEvent: zod_1.z.string(),
        issue: zod_1.z
            .object({
            id: zod_1.z.string(),
            key: zod_1.z.string(),
            fields: zod_1.z.object({
                summary: zod_1.z.string().optional(),
                description: zod_1.z.any().nullable().optional(),
                status: zod_1.z
                    .object({
                    name: zod_1.z.string().optional(),
                    statusCategory: zod_1.z
                        .object({
                        key: zod_1.z.string()
                    })
                        .optional()
                })
                    .optional(),
                assignee: zod_1.z
                    .object({
                    accountId: zod_1.z.string().optional(),
                    emailAddress: zod_1.z.string().optional(),
                    displayName: zod_1.z.string().optional()
                })
                    .nullable()
                    .optional(),
                duedate: zod_1.z.string().nullable().optional()
            })
        })
            .optional(),
        changelog: zod_1.z
            .object({
            items: zod_1.z.array(zod_1.z.object({
                field: zod_1.z.string(),
                fieldtype: zod_1.z.string().optional(),
                from: zod_1.z.string().nullable().optional(),
                fromString: zod_1.z.string().nullable().optional(),
                to: zod_1.z.string().nullable().optional(),
                toString: zod_1.z.string().nullable().optional()
            }))
        })
            .optional()
    })
});
exports.syncIssueFromLinearSchema = zod_1.z.object({
    companyId: zod_1.z.string(),
    event: zod_1.z.discriminatedUnion("type", [
        zod_1.z.object({
            type: zod_1.z.literal("Issue"),
            action: zod_1.z.literal("update"),
            data: zod_1.z.object({
                id: zod_1.z.string(),
                assigneeId: zod_1.z.string().optional()
            })
        })
    ])
});
