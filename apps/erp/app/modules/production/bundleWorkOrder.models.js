"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleWorkOrderValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.bundleWorkOrderValidator = zod_1.z.object({
    masterWorkOrderId: zod_1.z.string().min(1),
    colorCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sizeCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001, { message: "Quantity is required" }))
});
