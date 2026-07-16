"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomFieldsSchema = useCustomFieldsSchema;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var zod_1 = require("zod");
var path_1 = require("~/utils/path");
function useCustomFieldsSchema() {
    var data = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var customFields = (0, react_2.useMemo)(function () {
        var result = {};
        if (!(data === null || data === void 0 ? void 0 : data.customFields) || !Array.isArray(data.customFields))
            return result;
        data.customFields.forEach(function (field) {
            var fields = fieldValidator.safeParse(field.fields);
            if (fields.success && "table" in field) {
                result[field.table] = fields.data;
            }
        });
        return result;
    }, [data === null || data === void 0 ? void 0 : data.customFields]);
    return customFields;
}
var fieldValidator = zod_1.z
    .array(zod_1.z.object({
    dataTypeId: zod_1.z.number(),
    id: zod_1.z.string(),
    listOptions: zod_1.z.array(zod_1.z.string()).nullable(),
    name: zod_1.z.string(),
    required: zod_1.z.boolean().default(false),
    sortOrder: zod_1.z.number(),
    tags: zod_1.z.array(zod_1.z.string()).nullable()
}))
    .nullable();
