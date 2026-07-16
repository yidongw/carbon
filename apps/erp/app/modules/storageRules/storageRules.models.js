"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRuleAcknowledgeValidator = exports.storageRuleAssignmentValidator = exports.storageRuleValidator = exports.storageRuleConditionAstSchema = exports.storageRuleMatchKinds = exports.storageRuleOperators = exports.storageRuleSeverities = void 0;
var utils_1 = require("@carbon/utils");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.storageRuleSeverities = ["error", "warn"];
exports.storageRuleOperators = [
    "eq",
    "neq",
    "in",
    "notIn",
    "isSet",
    "isNotSet",
    "gt",
    "lt"
];
var storageRuleConditionValueSchema = zod_1.z.union([
    zod_1.z.string(),
    zod_1.z.number(),
    zod_1.z.boolean(),
    zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()])),
    zod_1.z.null()
]);
var storageRuleConditionSchema = zod_1.z.object({
    field: zod_1.z.string().min(1, { message: "Field is required" }),
    op: zod_1.z.enum(exports.storageRuleOperators),
    value: storageRuleConditionValueSchema.optional()
});
exports.storageRuleMatchKinds = ["all", "any", "none"];
exports.storageRuleConditionAstSchema = zod_1.z.object({
    kind: zod_1.z.enum(exports.storageRuleMatchKinds),
    conditions: zod_1.z
        .array(storageRuleConditionSchema)
        .min(1, { message: "At least one condition is required" })
});
var storageRuleConditionAstFormField = zod_1.z.preprocess(function (raw) {
    if (typeof raw !== "string")
        return raw;
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        return raw;
    }
}, exports.storageRuleConditionAstSchema);
exports.storageRuleValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(120),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    message: zod_1.z.string().min(1, { message: "Message is required" }).max(500),
    severity: zod_1.z.enum(exports.storageRuleSeverities),
    targetType: zod_1.z.enum(utils_1.TARGET_TYPES),
    // Broadcast gate for workCenter rules. Item rules ignore this and use the
    // filteredItem* fields instead (empty = all items).
    appliesToAll: zod_form_data_1.zfd.checkbox(),
    filteredItemTypes: zod_form_data_1.zfd.repeatableOfType(zod_1.z.string()).optional(),
    filteredItemGroupIds: zod_form_data_1.zfd.repeatableOfType(zod_1.z.string()).optional(),
    filteredItemMatchAll: zod_form_data_1.zfd.checkbox(),
    active: zod_form_data_1.zfd.checkbox(),
    surfaces: zod_form_data_1.zfd
        .repeatableOfType(zod_1.z.enum(utils_1.TRANSACTION_SURFACES))
        .refine(function (arr) { return arr.length >= 1; }, {
        message: "Pick at least one surface"
    }),
    conditionAst: storageRuleConditionAstFormField
})
    .superRefine(function (val, ctx) {
    // Reject any surface that isn't valid for the chosen targetType. Schema
    // enforcement only — DB has no CHECK; UI also filters the picker.
    var allowed = new Set(utils_1.SURFACES_BY_TARGET_TYPE[val.targetType]);
    for (var i = 0; i < val.surfaces.length; i++) {
        var s = val.surfaces[i];
        if (!allowed.has(s)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["surfaces", i],
                message: "Surface \"".concat(s, "\" not valid for ").concat(val.targetType, " rules")
            });
        }
    }
    // Reject conditions on a registry field whose context the evaluator won't
    // populate for every selected surface (else it resolves undefined → false
    // "X is required"). Unknown paths are left to runtime presence handling.
    val.conditionAst.conditions.forEach(function (c, i) {
        var def = (0, utils_1.getFieldDef)(c.field);
        if (def && !(0, utils_1.isFieldAvailableOnSurfaces)(def, val.surfaces)) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ["conditionAst", "conditions", i, "field"],
                message: "\"".concat(def.label, "\" isn't available on the selected surface(s)")
            });
        }
    });
});
/**
 * Polymorphic assignment validator factory. The form's hidden field tells the
 * action which targetType is in play, then this validator picks the right
 * target-id key.
 */
var storageRuleAssignmentValidator = function (targetType) {
    var _a;
    var idKey = targetType === "item" ? "itemId" : "workCenterId";
    return zod_1.z.object((_a = {},
        _a[idKey] = zod_1.z.string().min(1, { message: "Target ID is required" }),
        _a.ruleId = zod_1.z.string().min(1, { message: "Rule ID is required" }),
        _a));
};
exports.storageRuleAssignmentValidator = storageRuleAssignmentValidator;
exports.storageRuleAcknowledgeValidator = zod_form_data_1.zfd.checkbox();
