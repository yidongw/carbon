"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardFactorType = exports.savedViewStateValidator = exports.savedViewValidator = exports.operationParameterValidator = exports.operationToolValidator = exports.operationStepValidator = exports.oAuthCallbackSchema = exports.tagTableLabels = exports.tagTables = exports.tagValidator = exports.suggestionValidator = exports.feedbackValidator = exports.processTypes = exports.procedureStepType = exports.operationTypes = exports.noteValidator = exports.validMethodTypesByReplenishment = exports.sourcingType = exports.methodType = exports.methodOperationOrders = exports.months = exports.methodItemType = exports.tablesWithTags = exports.inspectionStatus = exports.incoterms = exports.documentTypes = exports.chartIntervals = exports.approvalStatusType = exports.approvalRuleValidator = exports.approvalRequestValidator = exports.approvalFiltersValidator = exports.approvalDocumentTypesWithAmounts = exports.approvalDocumentTypeLabel = exports.approvalDocumentType = exports.approvalDecisionValidator = void 0;
exports.getValidMethodTypes = getValidMethodTypes;
var utils_1 = require("@carbon/utils");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
exports.approvalDecisionValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    decision: zod_1.z.enum(["Approved", "Rejected"], {
        errorMap: function () { return ({ message: "Decision is required" }); }
    }),
    decisionNotes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.approvalDocumentType = [
    "purchaseOrder",
    "qualityDocument",
    "supplier",
    "productionQuantityReport"
];
exports.approvalDocumentTypeLabel = {
    purchaseOrder: "Purchase Order",
    qualityDocument: "Quality Document",
    supplier: "Supplier",
    productionQuantityReport: "Quantity Review"
};
exports.approvalDocumentTypesWithAmounts = [
    "purchaseOrder"
];
exports.approvalFiltersValidator = zod_1.z.object({
    documentType: zod_1.z.enum(exports.approvalDocumentType, {
        errorMap: function () { return ({ message: "Document type is required" }); }
    }),
    status: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateFrom: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    dateTo: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
exports.approvalRequestValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    documentType: zod_1.z.enum(exports.approvalDocumentType, {
        errorMap: function () { return ({ message: "Document type is required" }); }
    }),
    documentId: zod_form_data_1.zfd.text(zod_1.z.string().min(1, { message: "Document ID is required" })),
    approverGroupIds: zod_form_data_1.zfd.repeatableOfType(zod_1.z.string()).optional()
});
exports.approvalRuleValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    documentType: zod_1.z.enum(exports.approvalDocumentType, {
        errorMap: function () { return ({ message: "Document type is required" }); }
    }),
    approverGroupIds: zod_1.z.array(zod_1.z.string().min(1, { message: "Invalid selection" })),
    defaultApproverId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    lowerBoundAmount: zod_form_data_1.zfd.numeric(zod_1.z.number().gt(0).default(0)).optional(),
    enabled: zod_form_data_1.zfd.checkbox()
});
exports.approvalStatusType = [
    "Pending",
    "Approved",
    "Rejected",
    "Cancelled"
];
exports.chartIntervals = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "quarter", label: "Quarter" },
    { key: "year", label: "Year" },
    { key: "custom", label: "Custom" }
];
exports.documentTypes = [
    "Archive",
    "Document",
    "Presentation",
    "PDF",
    "Spreadsheet",
    "Text",
    "Image",
    "Video",
    "Audio",
    "Model",
    "Other"
];
exports.incoterms = [
    "EXW",
    "FCA",
    "FAS",
    "FOB",
    "CPT",
    "CIP",
    "CFR",
    "CIF",
    "DAP",
    "DPU",
    "DDP"
];
exports.inspectionStatus = ["Pass", "Fail"];
exports.tablesWithTags = [
    "consumable",
    "fixture",
    "job",
    "material",
    "part",
    "suggestion",
    "tool"
];
exports.methodItemType = [
    "Style",
    "Part",
    "Material",
    "Tool",
    "Consumable"
    // "Service",
];
exports.months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
exports.methodOperationOrders = [
    "After Previous",
    "With Previous"
];
exports.methodType = [
    "Purchase to Order",
    "Pull from Inventory",
    "Make to Order"
];
exports.sourcingType = [
    "Specified",
    "Drop Ship",
    "Ship from Inventory"
];
exports.validMethodTypesByReplenishment = {
    Buy: ["Pull from Inventory", "Purchase to Order"],
    Make: ["Pull from Inventory", "Make to Order"],
    "Buy and Make": ["Pull from Inventory", "Purchase to Order"]
};
function getValidMethodTypes(replenishmentSystem) {
    var _a;
    return (_a = exports.validMethodTypesByReplenishment[replenishmentSystem]) !== null && _a !== void 0 ? _a : [];
}
exports.noteValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    documentId: zod_1.z.string().min(1),
    note: zod_1.z.string().min(1, { message: "Note is required" })
});
exports.operationTypes = [
    "Inside",
    "Outside",
    "Inside and Outside"
];
exports.procedureStepType = [
    "Task",
    "Value",
    "Measurement",
    "Checkbox",
    "Timestamp",
    "Person",
    "List",
    "File",
    "Inspection"
];
exports.processTypes = [
    "Inside",
    "Outside",
    "Inside and Outside"
];
exports.feedbackValidator = zod_1.z.object({
    feedback: zod_1.z.string().min(1, { message: "" }),
    attachmentPath: zod_1.z.string().optional(),
    location: zod_1.z.string()
});
exports.suggestionValidator = zod_1.z.object({
    suggestion: zod_1.z.string().min(1, { message: "Suggestion is required" }),
    emoji: zod_1.z.string().default("💡"),
    attachmentPath: zod_1.z.string().optional(),
    path: zod_1.z.string(),
    userId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
// A tag is scoped to a table (any taggable table — part, job, customer, …);
// the `tag` table is generic, so `table` is just a string here.
exports.tagValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }).max(255),
    table: zod_1.z.string().min(1, { message: "Table is required" })
});
// The tables that actually expose a Tags field in the UI, with friendly labels.
// This is the set offered when creating a tag from the Tags settings page, and
// the source for labeling a tag's `table` in lists. (Tags can technically exist
// for any table, but these are the surfaces where they're used.)
exports.tagTables = [
    { table: "part", label: "Part" },
    { table: "material", label: "Material" },
    { table: "tool", label: "Tool" },
    { table: "consumable", label: "Consumable" },
    { table: "operation", label: "Operation" },
    { table: "job", label: "Job" },
    { table: "procedure", label: "Procedure" },
    { table: "supplier", label: "Supplier" },
    { table: "customer", label: "Customer" },
    { table: "nonConformance", label: "Issue" },
    { table: "qualityDocument", label: "Quality Document" },
    { table: "suggestion", label: "Suggestion" },
    { table: "training", label: "Training" }
];
exports.tagTableLabels = Object.fromEntries(exports.tagTables.map(function (t) { return [t.table, t.label]; }));
exports.oAuthCallbackSchema = zod_1.z.object({
    code: zod_1.z.string(),
    state: zod_1.z.string()
});
exports.operationStepValidator = zod_1.z
    .object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    operationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    description: zod_1.z
        .string()
        .min(1, { message: "Description is required" })
        // Returns `any`: the tiptap doc is consumed both as a DB Json value and as
        // editor JSONContent, and a narrower type breaks one of the two call sites.
        .transform(function (val) {
        var parsed;
        try {
            parsed = JSON.parse(val);
            // biome-ignore lint/correctness/noUnusedVariables: raw text is not JSON
        }
        catch (e) {
            parsed = val;
        }
        // Always store a tiptap doc object, never a scalar string (jsonb scalar
        // strings break method copies) and never silently drop content to {}.
        if (typeof parsed === "string")
            return (0, utils_1.textToTiptap)(parsed);
        if (parsed && typeof parsed === "object")
            return parsed;
        return (0, utils_1.textToTiptap)(String(val));
    }),
    type: zod_1.z.enum(exports.procedureStepType, {
        errorMap: function () { return ({ message: "Type is required" }); }
    }),
    unitOfMeasureCode: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    minValue: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    maxValue: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional()),
    listValues: zod_1.z.array(zod_1.z.string()).optional(),
    sortOrder: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0).optional())
})
    .refine(function (data) {
    if (data.type === "Measurement") {
        return !!data.unitOfMeasureCode;
    }
    return true;
}, {
    message: "Unit of measure is required",
    path: ["unitOfMeasureCode"]
})
    .refine(function (data) {
    if (data.type === "List") {
        return (Array.isArray(data.listValues) &&
            data.listValues.length > 0 &&
            data.listValues.every(function (option) { return option.trim() !== ""; }));
    }
    return true;
}, {
    message: "List options are required",
    path: ["listOptions"]
})
    .refine(function (data) {
    if (data.minValue != null && data.maxValue != null) {
        return data.maxValue >= data.minValue;
    }
    return true;
}, {
    message: "Maximum value must be greater than or equal to minimum value",
    path: ["maxValue"]
});
exports.operationToolValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    operationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    toolId: zod_1.z.string().min(1, { message: "Tool is required" }),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.000001, { message: "Quantity is required" }))
});
exports.operationParameterValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    operationId: zod_1.z.string().min(1, { message: "Operation is required" }),
    key: zod_1.z.string().min(1, { message: "Key is required" }),
    value: zod_1.z.string().min(1, { message: "Value is required" })
});
exports.savedViewValidator = zod_1.z.object({
    id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    table: zod_1.z.string(),
    name: zod_1.z.string().min(1, { message: "A name is required to save a view" }),
    description: zod_1.z.string().optional(),
    filter: zod_1.z.string().optional(),
    sort: zod_1.z.string().optional(),
    state: zod_1.z.string(),
    type: zod_1.z.enum(["Public", "Private"])
});
exports.savedViewStateValidator = zod_1.z.object({
    columnOrder: zod_1.z.array(zod_1.z.string()),
    columnPinning: zod_1.z.any(),
    columnVisibility: zod_1.z.record(zod_1.z.boolean()),
    filters: zod_1.z.array(zod_1.z.string()).optional(),
    sorts: zod_1.z.array(zod_1.z.string()).optional()
});
exports.standardFactorType = [
    "Hours/Piece",
    "Hours/100 Pieces",
    "Hours/1000 Pieces",
    "Minutes/Piece",
    "Minutes/100 Pieces",
    "Minutes/1000 Pieces",
    "Pieces/Hour",
    "Pieces/Minute",
    "Seconds/Piece",
    "Total Hours",
    "Total Minutes"
];
