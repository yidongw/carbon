import { z } from "zod";
import { zfd } from "zod-form-data";

export const productionQuantityLineInputValidator = z.object({
  type: z.enum(["Production", "Rework", "Scrap"]),
  quantity: zfd.numeric(
    z.number().positive({ message: "Quantity must be greater than zero" })
  ),
  scrapReasonId: zfd.text(z.string().optional()),
  notes: zfd.text(z.string().optional()),
  configuration: z.any().optional()
});

/** Line payload parsed from `JSON.stringify` (browser); `quantity` is a JSON number. */
export const productionQuantityLineJsonValidator = z.object({
  type: z.enum(["Production", "Rework", "Scrap"]),
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity must be greater than zero" }),
  scrapReasonId: z.string().optional(),
  notes: z.string().optional(),
  configuration: z.any().optional()
});

export const createProductionQuantityReportValidator = z.object({
  jobOperationId: z.string().min(1),
  employeeId: zfd.text(z.string().optional()),
  notes: zfd.text(z.string().optional()),
  lines: z.array(productionQuantityLineInputValidator).min(1)
});

export const replaceProductionQuantityReportLinesValidator = z.object({
  notes: zfd.text(z.string().optional()),
  lines: z.array(productionQuantityLineInputValidator).min(1)
});

export type ProductionQuantityLineInput = z.infer<
  typeof productionQuantityLineInputValidator
>;
