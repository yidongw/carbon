import { z } from "zod";
import { zfd } from "zod-form-data";

export const masterWorkOrderValidator = z.object({
  itemId: z.string().min(1, { message: "Style is required" }),
  quantity: zfd.numeric(
    z.number().min(0.0001, { message: "Quantity is required" })
  )
});
