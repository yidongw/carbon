"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workCenterValidator = exports.trainingValidator = exports.trainingType = exports.trainingStatus = exports.trainingQuestionValidator = exports.trainingQuestionType = exports.trainingFrequency = exports.trainingCompletionValidator = exports.trainingAssignmentValidator = exports.trainingAssignmentStatusOptions = exports.processValidator = exports.partnerValidator = exports.oeeImpact = exports.maintenanceSource = exports.maintenanceSeverity = exports.maintenanceScheduleValidator = exports.maintenanceScheduleItemValidator = exports.maintenanceFrequency = exports.maintenanceDispatchIssueTrackedEntityValidator = exports.maintenanceDispatchIssueValidator = exports.maintenanceDispatchWorkCenterValidator = exports.maintenanceDispatchValidator = exports.MAINTENANCE_DISPATCH_LOCKED_STATUSES = exports.maintenanceDispatchStatus = exports.MaintenanceKPIs = exports.maintenanceDispatchPriority = exports.maintenanceDispatchItemValidator = exports.maintenanceDispatchEventValidator = exports.maintenanceDispatchCommentValidator = exports.locationValidator = exports.failureModeValidator = exports.maintenanceFailureModeType = exports.employeeAbilityValidator = exports.contractorValidator = exports.abilityValidator = exports.abilityNameValidator = exports.abilityCurveValidator = void 0;
exports.isMaintenanceDispatchLocked = isMaintenanceDispatchLocked;
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var shared_1 = require("../shared");
exports.abilityCurveValidator = zod_1.z.object({
    data: zod_1.z
        .string()
        .startsWith("[", { message: "Invalid JSON" })
        .endsWith("]", { message: "Invalid JSON" }),
    shadowWeeks: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Time shadowing is required" }))
});
exports.abilityNameValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" })
});
exports.abilityValidator = zod_1.z
    .object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    startingPoint: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Learning curve is required" })),
    weeks: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Weeks is required" })),
    shadowWeeks: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Shadow is required" })),
    employees: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .min(1, { message: "Group members are required" })
        .optional()
})
    .refine(function (schema) { return schema.shadowWeeks <= schema.weeks; }, {
    message: "name is required when you send color on request"
});
exports.contractorValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Supplier Contact is required" }),
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" }),
    hoursPerWeek: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Hours are required" })),
    // abilities: z
    //   .array(z.string().min(1, { message: "Invalid ability" }))
    //   .optional(),
    assignee: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.employeeAbilityValidator = zod_1.z.object({
    employeeId: zod_1.z.string().min(1, { message: "Employee is required" }),
    trainingStatus: zod_1.z.string().min(1, { message: "Status is required" }),
    trainingPercent: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    trainingDays: zod_form_data_1.zfd.numeric(zod_1.z.number().optional())
});
exports.maintenanceFailureModeType = [
    "Maintenance",
    "Quality",
    "Operations",
    "Other"
];
exports.failureModeValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    type: zod_1.z.enum(exports.maintenanceFailureModeType)
});
exports.locationValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    addressLine1: zod_1.z.string().min(1, { message: "Address is required" }),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, { message: "City is required" }),
    stateProvince: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    postalCode: zod_1.z.string().min(1, { message: "Postal Code is required" }),
    countryCode: zod_1.z.string().min(1, { message: "Country is required" }),
    timezone: zod_1.z.string().min(1, { message: "Timezone is required" }),
    latitude: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    longitude: zod_form_data_1.zfd.numeric(zod_1.z.number().optional())
})
    .superRefine(function (_a, ctx) {
    var latitude = _a.latitude, longitude = _a.longitude;
    if ((latitude && !longitude) || (!latitude && longitude)) {
        ctx.addIssue({
            code: "custom",
            message: "Both latitude and longitude are required"
        });
    }
});
exports.maintenanceDispatchCommentValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z.string().min(1, { message: "Dispatch is required" }),
    comment: zod_1.z.string().min(1, { message: "Comment is required" })
});
exports.maintenanceDispatchEventValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z
        .string()
        .min(1, { message: "Dispatch is required" }),
    employeeId: zod_1.z.string().min(1, { message: "Employee is required" }),
    workCenterId: zod_1.z.string().min(1, { message: "Work center is required" }),
    startTime: zod_1.z.string().min(1, { message: "Start time is required" }),
    endTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
})
    .refine(function (data) {
    if (data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
}, {
    message: "Start time must be before end time",
    path: ["endTime"]
});
exports.maintenanceDispatchItemValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z.string().min(1, { message: "Dispatch is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" }),
    unitCost: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
});
exports.maintenanceDispatchPriority = [
    "Low",
    "Medium",
    "High",
    "Critical"
];
exports.MaintenanceKPIs = [
    { key: "mttr", label: "Mean Time To Repair" },
    { key: "mtbf", label: "Mean Time Between Failures" },
    { key: "sparePartCost", label: "Spare Part Cost" },
    { key: "worstPerformingMachines", label: "Worst Performing Machines" },
    { key: "sparePartConsumption", label: "Spare Part Consumption" }
];
exports.maintenanceDispatchStatus = [
    "Open",
    "Assigned",
    "In Progress",
    "Completed",
    "Cancelled"
];
exports.MAINTENANCE_DISPATCH_LOCKED_STATUSES = [
    "Completed",
    "Cancelled"
];
function isMaintenanceDispatchLocked(status) {
    return exports.MAINTENANCE_DISPATCH_LOCKED_STATUSES.includes(status);
}
exports.maintenanceDispatchValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    status: zod_1.z.enum(exports.maintenanceDispatchStatus),
    priority: zod_1.z.enum(exports.maintenanceDispatchPriority),
    severity: zod_1.z
        .enum([
        "Preventive",
        "Operator Performed",
        "Support Required",
        "OEM Required"
    ])
        .optional(),
    source: zod_1.z
        .enum(["Scheduled", "Reactive", "Non-Conformance"])
        .optional(),
    oeeImpact: zod_1.z
        .enum(["Down", "Planned", "Impact", "No Impact"])
        .optional(),
    workCenterId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    suspectedFailureModeId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    plannedStartTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    plannedEndTime: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    assignee: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    content: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.maintenanceDispatchWorkCenterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceDispatchId: zod_1.z.string().min(1, { message: "Dispatch is required" }),
    workCenterId: zod_1.z.string().min(1, { message: "Work center is required" })
});
exports.maintenanceDispatchIssueValidator = zod_1.z.object({
    maintenanceDispatchItemId: zod_1.z
        .string()
        .min(1, { message: "Maintenance Dispatch Item is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number()),
    adjustmentType: zod_1.z.enum(["Positive Adjmt.", "Negative Adjmt."])
});
exports.maintenanceDispatchIssueTrackedEntityValidator = zod_1.z.object({
    maintenanceDispatchItemId: zod_1.z.string(),
    children: zod_1.z.array(zod_1.z.object({
        trackedEntityId: zod_1.z.string(),
        quantity: zod_1.z.number()
    }))
});
exports.maintenanceFrequency = [
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Annual"
];
exports.maintenanceScheduleItemValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    maintenanceScheduleId: zod_1.z.string().min(1, { message: "Schedule is required" }),
    itemId: zod_1.z.string().min(1, { message: "Item is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1)),
    unitOfMeasureCode: zod_1.z
        .string()
        .min(1, { message: "Unit of measure is required" })
});
exports.maintenanceScheduleValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    workCenterId: zod_1.z.string().min(1, { message: "Work center is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    frequency: zod_1.z.enum(exports.maintenanceFrequency),
    priority: zod_1.z.enum(exports.maintenanceDispatchPriority),
    estimatedDuration: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    active: zod_form_data_1.zfd.checkbox(),
    // Day-of-week fields for daily frequency
    monday: zod_form_data_1.zfd.checkbox(),
    tuesday: zod_form_data_1.zfd.checkbox(),
    wednesday: zod_form_data_1.zfd.checkbox(),
    thursday: zod_form_data_1.zfd.checkbox(),
    friday: zod_form_data_1.zfd.checkbox(),
    saturday: zod_form_data_1.zfd.checkbox(),
    sunday: zod_form_data_1.zfd.checkbox(),
    // Skip holidays option
    skipHolidays: zod_form_data_1.zfd.checkbox(),
    // Procedure
    procedureId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.maintenanceSeverity = [
    "Preventive",
    "Operator Performed",
    "Support Required",
    "OEM Required"
];
exports.maintenanceSource = [
    "Scheduled",
    "Reactive",
    "Non-Conformance"
];
exports.oeeImpact = ["Down", "Planned", "Impact", "No Impact"];
exports.partnerValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Supplier Location is required" }),
    supplierId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    hoursPerWeek: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Hours are required" }))
    // abilityId: z.string().min(1, { message: "Invalid ability" }),
});
exports.processValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Process name is required" }),
    processType: zod_1.z.enum(shared_1.processTypes, {
        errorMap: function () { return ({ message: "Process type is required" }); }
    }),
    defaultStandardFactor: zod_1.z
        .enum(shared_1.standardFactorType, {
        errorMap: function () { return ({ message: "Standard factor is required" }); }
    })
        .optional(),
    workCenters: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid work center" }))
        .optional(),
    completeAllOnScan: zod_form_data_1.zfd.checkbox()
})
    .refine(function (data) {
    if (data.processType !== "Outside" && !data.workCenters) {
        return { workCenters: ["Work center is required for inside process"] };
    }
    return true;
})
    .refine(function (data) {
    if (data.processType !== "Outside" && !data.defaultStandardFactor) {
        return { defaultStandardFactor: ["Standard factor is required"] };
    }
    return true;
});
exports.trainingAssignmentStatusOptions = [
    "Completed",
    "Pending",
    "Overdue",
    "Not Required"
];
exports.trainingAssignmentValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    trainingId: zod_1.z.string().min(1, { message: "Training is required" }),
    groupIds: zod_1.z
        .array(zod_1.z.string())
        .min(1, { message: "At least one group is required" })
});
exports.trainingCompletionValidator = zod_1.z.object({
    trainingAssignmentId: zod_1.z
        .string()
        .min(1, { message: "Training assignment is required" }),
    employeeId: zod_1.z.string().min(1, { message: "Employee is required" }),
    period: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.trainingFrequency = ["Once", "Quarterly", "Annual"];
exports.trainingQuestionType = [
    "MultipleChoice",
    "TrueFalse",
    "MultipleAnswers",
    "MatchingPairs",
    "Numerical"
];
exports.trainingQuestionValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    trainingId: zod_1.z.string().min(1, { message: "Training is required" }),
    question: zod_1.z.string().min(1, { message: "Question is required" }),
    type: zod_1.z.enum(exports.trainingQuestionType, {
        errorMap: function () { return ({ message: "Type is required" }); }
    }),
    sortOrder: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    required: zod_form_data_1.zfd.checkbox().optional(),
    // For MultipleChoice and MultipleAnswers
    options: zod_1.z.array(zod_1.z.string()).optional(),
    // Accept string (from Select) or array (from MultiSelect), normalize to array
    correctAnswers: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform(function (val) {
        if (!val)
            return undefined;
        if (Array.isArray(val))
            return val.filter(function (v) { return v.trim() !== ""; });
        return val.trim() !== "" ? [val] : undefined;
    }),
    // For TrueFalse - accept string "true"/"false" and transform to boolean
    correctBoolean: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform(function (val) {
        if (typeof val === "boolean")
            return val;
        if (typeof val === "string")
            return val === "true";
        return false;
    }),
    // For MatchingPairs - stored as JSON string
    matchingPairs: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    // For Numerical
    correctNumber: zod_form_data_1.zfd.numeric(zod_1.z.number().optional()),
    tolerance: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
})
    .refine(function (data) {
    if (data.type === "MultipleChoice" || data.type === "MultipleAnswers") {
        return (!!data.options &&
            data.options.length >= 2 &&
            data.options.every(function (option) { return option.trim() !== ""; }));
    }
    return true;
}, {
    message: "At least 2 options are required",
    path: ["options"]
})
    .refine(function (data) {
    if (data.type === "MultipleChoice") {
        return !!data.correctAnswers && data.correctAnswers.length === 1;
    }
    return true;
}, {
    message: "Exactly one correct answer is required for multiple choice",
    path: ["correctAnswers"]
})
    .refine(function (data) {
    if (data.type === "MultipleAnswers") {
        return !!data.correctAnswers && data.correctAnswers.length >= 1;
    }
    return true;
}, {
    message: "At least one correct answer is required",
    path: ["correctAnswers"]
})
    .refine(function (data) {
    if (data.type === "MatchingPairs") {
        if (!data.matchingPairs)
            return false;
        try {
            var pairs = JSON.parse(data.matchingPairs);
            return (Array.isArray(pairs) &&
                pairs.length >= 2 &&
                pairs.every(function (pair) { var _a, _b; return ((_a = pair.left) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = pair.right) === null || _b === void 0 ? void 0 : _b.trim()); }));
        }
        catch (_a) {
            return false;
        }
    }
    return true;
}, {
    message: "At least 2 matching pairs are required",
    path: ["matchingPairs"]
})
    .refine(function (data) {
    if (data.type === "Numerical") {
        return data.correctNumber !== undefined && data.correctNumber !== null;
    }
    return true;
}, {
    message: "Correct number is required",
    path: ["correctNumber"]
});
exports.trainingStatus = ["Draft", "Active", "Archived"];
exports.trainingType = ["Mandatory", "Optional"];
exports.trainingValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    content: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.workCenterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_1.z.string(),
    defaultStandardFactor: zod_1.z.enum(shared_1.standardFactorType, {
        errorMap: function () { return ({ message: "Standard factor is required" }); }
    }),
    departmentId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    laborRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    machineRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    overheadRate: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    processes: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid process" }))
        .optional()
    // requiredAbilityId: zfd.text(z.string().optional()),
});
