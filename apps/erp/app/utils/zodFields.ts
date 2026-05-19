import { z } from "zod";

/** Stable message id; translated in `formatValidationError` when shown in Form fields. */
export const REQUIRED_FIELD_MESSAGE = "Required";

/** Use with Form/Array `formatError` so the message is translatable via Lingui. */
export const requiredString = z
  .string()
  .min(1, { message: REQUIRED_FIELD_MESSAGE });

export const optionalRequiredStringArray = z.array(requiredString).optional();
