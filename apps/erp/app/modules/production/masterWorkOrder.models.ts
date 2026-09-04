import { z } from "zod";
import { zfd } from "zod-form-data";
import { deadlineTypes } from "./production.models";

export const masterWorkOrderValidator = z
  .object({
    itemId: z.string().min(1, { message: "Style is required" }),
    // 0 is allowed: it means "no fixed target" (e.g. cut-to-ratio), in which case
    // cutting is reported unrestricted. A remark is then required (see refine).
    quantity: zfd.numeric(
      z.number().min(0, { message: "Quantity must be 0 or greater" })
    ),
    locationId: z.string().min(1, { message: "Location is required" }),
    dueDate: zfd.text(z.string().optional()),
    deadlineType: z.enum(deadlineTypes, {
      errorMap: () => ({ message: "Deadline type is required" })
    }),
    // Optional free-text note. Mandatory when quantity is 0 so a no-target master
    // work order always explains its real requirement.
    remarks: zfd.text(z.string().optional()),
    // JSON-encoded { variantTable } captured by the variants-quantity modal.
    // Read + applied server-side into jobVariantQuantity.
    variantQuantities: zfd.text(z.string().optional())
  })
  .superRefine((data, ctx) => {
    if (data.quantity === 0 && !data.remarks?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["remarks"],
        message: "Remarks are required when quantity is 0"
      });
    }
  });
