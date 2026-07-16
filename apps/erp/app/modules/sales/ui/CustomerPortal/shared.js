"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobOperationValidator = void 0;
var zod_1 = require("zod");
var production_1 = require("~/modules/production");
var shared_1 = require("~/modules/shared");
exports.jobOperationValidator = zod_1.z
    .object({
    id: zod_1.z.string(),
    status: zod_1.z.enum(production_1.jobOperationStatus),
    description: zod_1.z.string(),
    order: zod_1.z.number(),
    operationType: zod_1.z.enum(shared_1.operationTypes),
    operationQuantity: zod_1.z.number(),
    quantityComplete: zod_1.z.number()
})
    .array();
