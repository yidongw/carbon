"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var zod_1 = require("zod");
var isFieldOptional_1 = require("./isFieldOptional");
(0, vitest_1.describe)("isFieldOptional", function () {
    var schema = zod_1.z.object({
        requiredName: zod_1.z.string(),
        optionalName: zod_1.z.string().optional(),
        defaultedName: zod_1.z.string().default(""),
        nested: zod_1.z.object({
            requiredChild: zod_1.z.string(),
            optionalChild: zod_1.z.string().optional()
        }),
        optionalNested: zod_1.z
            .object({
            requiredChild: zod_1.z.string()
        })
            .optional(),
        items: zod_1.z.array(zod_1.z.object({
            code: zod_1.z.string().optional()
        }))
    });
    (0, vitest_1.it)("returns false for required fields", function () {
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "requiredName")).toBe(false);
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "nested.requiredChild")).toBe(false);
    });
    (0, vitest_1.it)("returns true for optional fields", function () {
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "optionalName")).toBe(true);
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "defaultedName")).toBe(true);
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "nested.optionalChild")).toBe(true);
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "optionalNested.requiredChild")).toBe(true);
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "items[0].code")).toBe(true);
    });
    (0, vitest_1.it)("returns undefined when field path is not in schema", function () {
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "missingField")).toBeUndefined();
        (0, vitest_1.expect)((0, isFieldOptional_1.isFieldOptional)(schema, "optionalNested.missing")).toBeUndefined();
    });
});
