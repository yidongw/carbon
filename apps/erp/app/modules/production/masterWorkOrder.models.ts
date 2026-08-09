import { z } from "zod";
import { zfd } from "zod-form-data";
import { deadlineTypes } from "./production.models";

export const masterWorkOrderValidator = z.object({
  itemId: z.string().min(1, { message: "Style is required" }),
  quantity: zfd.numeric(
    z.number().min(0.0001, { message: "Quantity is required" })
  ),
  locationId: z.string().min(1, { message: "Location is required" }),
  dueDate: zfd.text(z.string().optional()),
  deadlineType: z.enum(deadlineTypes, {
    errorMap: () => ({ message: "Deadline type is required" })
  }),
  // JSON-encoded { variantTable } captured by the config modal (attribute combo
  // plan). Read + applied server-side.
  configuration: zfd.text(z.string().optional())
});
