"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleSizeValidator = exports.styleValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var items_models_1 = require("./items.models");
exports.styleValidator = (0, items_models_1.applyStorageAndShelfLifeRefines)(items_models_1.itemValidator.merge(zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Style ID is required" }).max(255),
    revision: zod_1.z.string().min(1, { message: "Revision is required" }),
    modelUploadId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    thumbnailPath: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lotSize: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    templateId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})));
exports.styleSizeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    sizeCode: zod_1.z.string().min(1, { message: "Size code is required" }).max(50),
    sizeName: zod_1.z.string().min(1, { message: "Size name is required" }).max(255)
});
