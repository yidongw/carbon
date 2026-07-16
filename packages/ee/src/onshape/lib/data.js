"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onShapeDataValidator = void 0;
var zod_1 = require("zod");
var methodType = [
    "Purchase to Order",
    "Make to Order",
    "Pull from Inventory"
];
var replenishmentSystems = ["Buy", "Make", "Buy and Make"];
exports.onShapeDataValidator = zod_1.z
    .object({
    id: zod_1.z.string().optional(),
    index: zod_1.z.string(),
    readableId: zod_1.z.string().optional(),
    revision: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    quantity: zod_1.z.number(),
    replenishmentSystem: zod_1.z.enum(replenishmentSystems),
    defaultMethodType: zod_1.z.enum(methodType),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.any())
})
    .array();
