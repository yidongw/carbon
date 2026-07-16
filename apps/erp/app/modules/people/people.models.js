"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobAssignmentRuleValidator = exports.jobAssignmentRuleConditionValidator = exports.JOB_RULE_OPERATORS = exports.JOB_RULE_FIELDS = exports.salaryPaymentValidator = exports.deleteTimeCardEntryValidator = exports.updateTimeCardEntryValidator = exports.timecardValidator = exports.clockOutValidator = exports.clockInValidator = exports.shiftValidator = exports.holidayValidator = exports.employeeJobValidator = exports.departmentValidator = exports.attributeCategoryValidator = exports.attributeValidator = void 0;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_1 = require("~/modules/shared");
var zodFields_1 = require("~/utils/zodFields");
exports.attributeValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    userAttributeCategoryId: zod_1.z.string().min(20),
    attributeDataTypeId: zod_form_data_1.zfd.numeric(),
    listOptions: zodFields_1.optionalRequiredStringArray,
    canSelfManage: zod_form_data_1.zfd.checkbox()
})
    .refine(function (input) {
    // allows bar to be optional only when foo is 'foo'
    if (input.attributeDataTypeId === shared_1.DataType.List &&
        (input.listOptions === undefined ||
            input.listOptions.length === 0 ||
            input.listOptions.some(function (option) { return option.length === 0; })))
        return false;
    return true;
}, { message: "List options are required", path: ["listOptions"] });
exports.attributeCategoryValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    emoji: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    isPublic: zod_form_data_1.zfd.checkbox()
});
exports.departmentValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    parentDepartmentId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.employeeJobValidator = zod_1.z.object({
    title: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    startDate: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    shiftId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    managerId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    departmentId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.holidayValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    date: zod_1.z.string().min(1, { message: "Date is required" })
});
exports.shiftValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    startTime: zod_1.z.string().min(1, { message: "Start time is required" }),
    endTime: zod_1.z.string().min(1, { message: "End time is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    monday: zod_form_data_1.zfd.checkbox(),
    tuesday: zod_form_data_1.zfd.checkbox(),
    wednesday: zod_form_data_1.zfd.checkbox(),
    thursday: zod_form_data_1.zfd.checkbox(),
    friday: zod_form_data_1.zfd.checkbox(),
    saturday: zod_form_data_1.zfd.checkbox(),
    sunday: zod_form_data_1.zfd.checkbox()
});
exports.clockInValidator = zod_1.z.object({
    intent: zod_1.z.literal("clockIn"),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.clockOutValidator = zod_1.z.object({
    intent: zod_1.z.literal("clockOut"),
    employeeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    note: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.timecardValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    employeeId: zod_1.z.string().min(1, { message: "Employee is required" }),
    clockIn: zod_1.z.string().min(1, { message: "Clock in is required" }),
    clockOut: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    note: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.updateTimeCardEntryValidator = zod_1.z.object({
    intent: zod_1.z.literal("updateEntry"),
    entryId: zod_1.z.string().min(1),
    clockIn: zod_1.z.string().min(1),
    clockOut: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    note: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.deleteTimeCardEntryValidator = zod_1.z.object({
    intent: zod_1.z.literal("deleteEntry"),
    entryId: zod_1.z.string().min(1)
});
// ─── Salary ────────────────────────────────────────────────────────────────
exports.salaryPaymentValidator = zod_1.z.object({
    salaryRecordId: zod_1.z.string().min(1, { message: "Salary record is required" }),
    amount: zod_form_data_1.zfd.numeric(zod_1.z.number().positive({ message: "Amount must be greater than 0" })),
    paidAt: zod_1.z.string().min(1, { message: "Payment date is required" }),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
// ─── Job Assignment Rules ──────────────────────────────────────────────────
exports.JOB_RULE_FIELDS = [
    { value: "customerId", label: "Customer" },
    { value: "processId", label: "Process" },
    { value: "workCenterId", label: "Work Center" },
    { value: "locationId", label: "Location" },
    { value: "tags", label: "Tags" }
];
exports.JOB_RULE_OPERATORS = [
    { value: "eq", label: "equals" },
    { value: "neq", label: "not equals" },
    { value: "in", label: "is one of" },
    { value: "contains", label: "contains" }
];
var jobRuleField = zod_1.z.enum(exports.JOB_RULE_FIELDS.map(function (f) { return f.value; }));
var jobRuleOperator = zod_1.z.enum(exports.JOB_RULE_OPERATORS.map(function (o) { return o.value; }));
exports.jobAssignmentRuleConditionValidator = zod_1.z.object({
    field: jobRuleField,
    operator: jobRuleOperator,
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
});
var jobAssignmentRuleConditionsValidator = zod_1.z
    .string()
    .transform(function (s, ctx) {
    try {
        return JSON.parse(s);
    }
    catch (_a) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Conditions must be valid JSON"
        });
        return zod_1.z.NEVER;
    }
})
    .pipe(zod_1.z.array(exports.jobAssignmentRuleConditionValidator));
exports.jobAssignmentRuleValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    conditions: jobAssignmentRuleConditionsValidator,
    targetGroupId: zod_1.z.string().min(1, { message: "Target group is required" }),
    priority: zod_form_data_1.zfd.numeric(zod_1.z.number().int().min(0).default(0)),
    active: zod_form_data_1.zfd.checkbox()
});
