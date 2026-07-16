"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemPriority = exports.ItemDeadline = exports.ItemStatus = exports.columnValidator = void 0;
var zod_1 = require("zod");
var models_1 = require("~/services/models");
exports.columnValidator = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string(),
    active: zod_1.z.boolean().optional(),
    type: zod_1.z.array(zod_1.z.string()),
    isBlocked: zod_1.z.boolean().optional(),
    blockingDispatchId: zod_1.z.string().optional(),
    blockingDispatchReadableId: zod_1.z.string().optional()
});
var itemValidator = zod_1.z.object({
    id: zod_1.z.string(),
    assignee: zod_1.z.string().optional(),
    columnId: zod_1.z.string(),
    columnType: zod_1.z.string(),
    title: zod_1.z.string(),
    link: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    priority: zod_1.z.number(),
    customerId: zod_1.z.string().optional(),
    employeeIds: zod_1.z.array(zod_1.z.string()).optional(),
    description: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().optional(), // 2024-05-28
    duration: zod_1.z.number().optional(), // miliseconds
    deadlineType: zod_1.z.enum(models_1.deadlineTypes).optional(),
    itemDescription: zod_1.z.string().optional(),
    itemReadableId: zod_1.z.string().optional(),
    jobReadableId: zod_1.z.string().optional(),
    operationQuantity: zod_1.z.number().optional(),
    targetQuantity: zod_1.z.number().optional(),
    progress: zod_1.z.number().optional(), // miliseconds
    quantity: zod_1.z.number().optional(),
    quantityCompleted: zod_1.z.number().optional(),
    quantityReworked: zod_1.z.number().optional(),
    quantityScrapped: zod_1.z.number().optional(),
    setupDuration: zod_1.z.number().optional(), // milliseconds
    laborDuration: zod_1.z.number().optional(), // milliseconds
    machineDuration: zod_1.z.number().optional(), // milliseconds
    reworkId: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(models_1.jobOperationStatus).optional(),
    salesOrderReadableId: zod_1.z.string().optional(),
    salesOrderId: zod_1.z.string().optional(),
    salesOrderLineId: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    thumbnailPath: zod_1.z.string().optional()
});
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["Canceled"] = "CANCELED";
    ItemStatus["Done"] = "DONE";
    ItemStatus["InProgress"] = "IN_PROGRESS";
    ItemStatus["Paused"] = "PAUSED";
    ItemStatus["Ready"] = "READY";
    ItemStatus["Todo"] = "TODO";
    ItemStatus["Waiting"] = "WAITING";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
var ItemDeadline;
(function (ItemDeadline) {
    ItemDeadline["ASAP"] = "ASAP";
    ItemDeadline["HardDeadline"] = "Hard Deadline";
    ItemDeadline["SoftDeadline"] = "Soft Deadline";
    ItemDeadline["NoDeadline"] = "No Deadline";
})(ItemDeadline || (exports.ItemDeadline = ItemDeadline = {}));
var ItemPriority;
(function (ItemPriority) {
    ItemPriority["ASAP"] = "ASAP";
    ItemPriority["High"] = "HIGH";
    ItemPriority["Average"] = "AVERAGE";
    ItemPriority["Low"] = "LOW";
})(ItemPriority || (exports.ItemPriority = ItemPriority = {}));
