"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceProductionQuantityReportLinesValidator = exports.createProductionQuantityReportValidator = exports.productionQuantityLineJsonValidator = exports.productionQuantityLineInputValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.productionQuantityLineInputValidator = zod_1.z.object({
    type: zod_1.z.enum(["Production", "Rework", "Scrap"]),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().positive({ message: "Quantity must be greater than zero" })),
    scrapReasonId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    configuration: zod_1.z.any().optional()
});
/** Line payload parsed from `JSON.stringify` (browser); `quantity` is a JSON number. */
exports.productionQuantityLineJsonValidator = zod_1.z.object({
    type: zod_1.z.enum(["Production", "Rework", "Scrap"]),
    quantity: zod_1.z.coerce
        .number()
        .positive({ message: "Quantity must be greater than zero" }),
    scrapReasonId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    configuration: zod_1.z.any().optional()
});
exports.createProductionQuantityReportValidator = zod_1.z.object({
    jobOperationId: zod_1.z.string().min(1),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lines: zod_1.z.array(exports.productionQuantityLineInputValidator).min(1)
});
exports.replaceProductionQuantityReportLinesValidator = zod_1.z.object({
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lines: zod_1.z.array(exports.productionQuantityLineInputValidator).min(1)
});
