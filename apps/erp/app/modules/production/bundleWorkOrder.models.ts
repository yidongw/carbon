import { z } from "zod";
import { zfd } from "zod-form-data";

export const bundleWorkOrderValidator = z.object({
  masterWorkOrderId: z.string().min(1),
  colorCode: zfd.text(z.string().optional()),
  sizeCode: zfd.text(z.string().optional()),
  quantity: zfd.numeric(
    z.number().min(0.0001, { message: "Quantity is required" })
  )
});
