"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reprintValidator = exports.updateAssignmentValidator = exports.printerRouteValidator = exports.manualPrintValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var assignments_1 = require("./assignments");
exports.manualPrintValidator = zod_1.z.object({
    sourceDocument: zod_1.z.string().min(1),
    sourceDocumentId: zod_1.z.string().min(1),
    locationId: zod_1.z.string().optional(),
    workCenterId: zod_1.z.string().optional(),
    printerRouteId: zod_1.z.string().optional()
});
exports.printerRouteValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    format: zod_1.z.enum(["zpl", "pdf"]),
    mediaSizeId: zod_1.z.string().min(1, { message: "Media size is required" }),
    printerUrl: zod_1.z.string().url({ message: "Must be a valid URL" }),
    apiKey: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    templateId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.updateAssignmentValidator = zod_1.z
    .object({
    locationId: zod_1.z.string().min(1),
    context: zod_1.z.enum(assignments_1.printerContexts),
    contextId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    printerRouteId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    autoPrint: zod_form_data_1.zfd.checkbox()
})
    .refine(function (data) { return data.context !== "workCenter" || !!data.contextId; }, {
    message: "contextId is required for workCenter assignments",
    path: ["contextId"]
});
exports.reprintValidator = zod_1.z.object({
    printJobId: zod_1.z.string().min(1, { message: "Print job ID is required" }),
    printerUrl: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
