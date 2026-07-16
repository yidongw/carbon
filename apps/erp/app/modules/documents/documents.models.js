"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentLabelsValidator = exports.documentValidator = exports.documentSourceTypes = void 0;
var zod_1 = require("zod");
var shared_1 = require("~/modules/shared");
exports.documentSourceTypes = __spreadArray([
    "Job",
    "Gauge Calibration Record",
    "Issue",
    "Purchase Order",
    "Purchase Invoice",
    "Quote",
    "Request for Quote",
    "Purchasing Request for Quote",
    "Supplier Quote",
    "Sales Order",
    "Sales Invoice",
    "Shipment"
], shared_1.methodItemType, true);
exports.documentValidator = zod_1.z.object({
    id: zod_1.z.string().min(1, { message: "Document ID is required" }),
    name: zod_1.z.string().min(3).max(50),
    extension: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    labels: zod_1.z.array(zod_1.z.string().min(1).max(50)).optional(),
    readGroups: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .min(1, { message: "Read permissions are required" }),
    writeGroups: zod_1.z
        .array(zod_1.z.string().min(1, { message: "Invalid selection" }))
        .min(1, { message: "Write permissions are required" })
});
exports.documentLabelsValidator = zod_1.z.object({
    documentId: zod_1.z.string().min(20),
    labels: zod_1.z.array(zod_1.z.string().min(1).max(50)).optional()
});
