"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterWorkOrderValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var production_models_1 = require("./production.models");
exports.masterWorkOrderValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Style is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001, { message: "Quantity is required" })),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    dueDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    deadlineType: zod_1.z.enum(production_models_1.deadlineTypes, {
        errorMap: function () { return ({ message: "Deadline type is required" }); }
    }),
    // JSON-encoded { configTable, configTablePrimaryKeys } captured by the config
    // modal (color/size plan). Read + applied server-side.
    configuration: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
