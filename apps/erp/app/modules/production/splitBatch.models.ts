import { z } from "zod";

export const splitBatchConfirmValidator = z.object({
  jobId: z.string().min(1, { message: "Job is required" }),
  jobOperationId: z.string().optional(),
  itemId: z.string().min(1, { message: "Style item is required" }),
  styleCode: z.string().min(1, { message: "Style code is required" }),
  colorCode: z.string().min(1, { message: "Color code is required" }),
  colorName: z.string().min(1, { message: "Color name is required" }),
  sizeCode: z.string().optional(),
  shadeLot: z.string().optional(),
  configurationKey: z.string().min(1, {
    message: "Pending split group is required"
  }),
  notes: z.string().optional(),
  bundleQuantities: z
    .array(z.number().positive("Bundle quantity must be greater than zero"))
    .min(1, "At least one bundle is required")
});
