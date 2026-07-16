"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFieldOptional = isFieldOptional;
var zod_1 = require("zod");
var utils_1 = require("../utils");
function unwrapSchema(schema, io) {
    var _a, _b, _c, _d, _e, _f;
    if (io === void 0) { io = "output"; }
    var current = schema;
    var isOptional = false;
    var hasDefault = false;
    var seen = new Set();
    while (true) {
        if (seen.has(current))
            return { schema: current, isOptional: isOptional, hasDefault: hasDefault };
        seen.add(current);
        var def = (_b = (_a = current._zod) === null || _a === void 0 ? void 0 : _a.def) !== null && _b !== void 0 ? _b : current._def;
        var type = (_c = def === null || def === void 0 ? void 0 : def.type) !== null && _c !== void 0 ? _c : def === null || def === void 0 ? void 0 : def.typeName;
        switch (type) {
            // optionality wrappers
            case "optional":
            case "ZodOptional":
                isOptional = true;
                current = def.innerType;
                continue;
            case "default":
            case "ZodDefault":
                isOptional = true;
                hasDefault = true;
                current = def.innerType;
                continue;
            case "prefault":
                isOptional = true;
                hasDefault = true;
                current = def.innerType;
                continue;
            case "catch":
            case "ZodCatch":
                isOptional = true;
                current = def.innerType;
                continue;
            // nullable — semantically distinct from optional
            case "nullable":
            case "ZodNullable":
                current = def.innerType;
                continue;
            // transparent wrappers
            case "readonly":
            case "ZodReadonly":
                current = def.innerType;
                continue;
            case "nonoptional":
                isOptional = false;
                current = def.innerType;
                continue;
            case "promise":
            case "ZodPromise":
                current = def.innerType;
                continue;
            case "ZodBranded":
                current = def.type;
                continue;
            // lazy — resolve the thunk
            case "lazy":
            case "ZodLazy": {
                var inner = (_e = (_d = current._zod) === null || _d === void 0 ? void 0 : _d.innerType) !== null && _e !== void 0 ? _e : (_f = def.getter) === null || _f === void 0 ? void 0 : _f.call(def);
                if (!inner)
                    return { schema: current, isOptional: isOptional, hasDefault: hasDefault };
                current = inner;
                continue;
            }
            // pipe — direction matters
            case "pipe":
            case "ZodPipeline":
                current = io === "input" ? def.in : def.out;
                continue;
            // effects (v3 refine/transform/preprocess)
            case "ZodEffects":
                current = def.schema;
                continue;
            default:
                return { schema: current, isOptional: isOptional, hasDefault: hasDefault };
        }
    }
}
function getChildSchema(schema, segment) {
    var _a, _b;
    if (schema instanceof zod_1.z.ZodObject) {
        var shape = schema.shape;
        if (typeof segment !== "string")
            return null;
        return (_a = shape[segment]) !== null && _a !== void 0 ? _a : null;
    }
    if (schema instanceof zod_1.z.ZodArray) {
        return schema.element;
    }
    if (schema instanceof zod_1.z.ZodTuple) {
        var index = typeof segment === "number"
            ? segment
            : Number.isNaN(Number(segment))
                ? null
                : Number(segment);
        if (index === null)
            return null;
        return (_b = schema.items[index]) !== null && _b !== void 0 ? _b : null;
    }
    if (schema instanceof zod_1.z.ZodRecord) {
        return schema._def.valueType;
    }
    return null;
}
function isFieldOptional(schema, fieldName) {
    var dir = "input"; // Can be a param
    if (!schema || !fieldName)
        return undefined;
    var path = (0, utils_1.stringToPathArray)(fieldName);
    var current = schema;
    var optionalFromParent = false;
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var segment = path_1[_i];
        if (!current)
            return undefined;
        var unwrapped = unwrapSchema(current, dir);
        current = unwrapped.schema;
        optionalFromParent = optionalFromParent || unwrapped.isOptional;
        current = getChildSchema(current, segment);
    }
    if (!current)
        return undefined;
    var final = unwrapSchema(current, dir);
    return optionalFromParent || final.isOptional;
}
