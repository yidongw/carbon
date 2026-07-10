import { z } from "zod";
import { zfd } from "zod-form-data";

export const masterWorkOrderValidator = z.object({
  itemId: z.string().min(1, { message: "Style is required" }),
  quantity: zfd.numeric(
    z.number().min(0.0001, { message: "Quantity is required" })
  ),
  // JSON-encoded { configTable, configTablePrimaryKeys } captured by the config
  // modal (color/size plan). Read + applied server-side.
  configuration: zfd.text(z.string().optional())
});
