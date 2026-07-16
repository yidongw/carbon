"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceJobOperationSupplierQuantityReportLinesValidator = exports.createJobOperationSupplierQuantityReportValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var productionQuantityReport_models_1 = require("./productionQuantityReport.models");
exports.createJobOperationSupplierQuantityReportValidator = zod_1.z.object({
    jobOperationId: zod_1.z.string().min(1),
    supplierProcessId: zod_1.z.string().min(1),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lines: zod_1.z.array(productionQuantityReport_models_1.productionQuantityLineInputValidator).min(1),
    operationUnitCost: zod_1.z.number().min(0).optional(),
    operationMinimumCost: zod_1.z.number().min(0).optional(),
    snapshotPricingEdited: zod_1.z.boolean().optional()
});
exports.replaceJobOperationSupplierQuantityReportLinesValidator = zod_1.z.object({
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lines: zod_1.z.array(productionQuantityReport_models_1.productionQuantityLineInputValidator).min(1)
});
