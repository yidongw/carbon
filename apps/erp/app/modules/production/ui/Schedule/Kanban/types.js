"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnValidator = void 0;
var zod_1 = require("zod");
var production_models_1 = require("../../../production.models");
exports.columnValidator = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    active: zod_1.z.boolean().optional(),
    type: zod_1.z.array(zod_1.z.string()),
    isBlocked: zod_1.z.boolean().optional(),
    blockingDispatchId: zod_1.z.string().optional(),
    blockingDispatchReadableId: zod_1.z.string().optional()
});
// Base item fields shared by both job and operation items
var baseItemValidator = zod_1.z.object({
    id: zod_1.z.string(),
    assignee: zod_1.z.string().optional(),
    columnId: zod_1.z.string(),
    columnType: zod_1.z.string(),
    customerId: zod_1.z.string().optional(),
    deadlineType: zod_1.z.enum(production_models_1.deadlineTypes).optional(),
    description: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().optional(), // 2024-05-28
    employeeIds: zod_1.z.array(zod_1.z.string()).optional(),
    itemDescription: zod_1.z.string().optional(),
    itemReadableId: zod_1.z.string(),
    jobId: zod_1.z.string(),
    jobReadableId: zod_1.z.string(),
    link: zod_1.z.string().optional(),
    priority: zod_1.z.number(),
    progress: zod_1.z.number().optional(), // miliseconds
    reworkId: zod_1.z.string().nullable().optional(),
    targetQuantity: zod_1.z.number().optional(),
    quantity: zod_1.z.number().optional(),
    quantityCompleted: zod_1.z.number().optional(),
    quantityReworked: zod_1.z.number().optional(),
    quantityScrapped: zod_1.z.number().optional(),
    salesOrderId: zod_1.z.string().optional(),
    salesOrderLineId: zod_1.z.string().optional(),
    salesOrderReadableId: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    thumbnailPath: zod_1.z.string().optional(),
    title: zod_1.z.string()
});
// Operation item with operation-level status
var operationItemValidator = baseItemValidator.extend({
    duration: zod_1.z.number().optional(), // miliseconds
    laborDuration: zod_1.z.number().optional(),
    machineDuration: zod_1.z.number().optional(),
    setupDuration: zod_1.z.number().optional(),
    status: zod_1.z.enum(production_models_1.jobOperationStatus).optional()
});
// Job item with job-level status
var jobItemValidator = baseItemValidator.extend({
    status: zod_1.z.enum(production_models_1.jobStatus).optional(),
    completedDate: zod_1.z.string().optional(),
    hasConflict: zod_1.z.boolean().optional(),
    jobMakeMethodId: zod_1.z.string()
});
