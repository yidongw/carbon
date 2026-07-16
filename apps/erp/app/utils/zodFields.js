"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalRequiredStringArray = exports.requiredString = exports.REQUIRED_FIELD_MESSAGE = void 0;
var zod_1 = require("zod");
/** Stable message id; translated in `formatValidationError` when shown in Form fields. */
exports.REQUIRED_FIELD_MESSAGE = "Required";
/** Use with Form/Array `formatError` so the message is translatable via Lingui. */
exports.requiredString = zod_1.z
    .string()
    .min(1, { message: exports.REQUIRED_FIELD_MESSAGE });
exports.optionalRequiredStringArray = zod_1.z.array(exports.requiredString).optional();
