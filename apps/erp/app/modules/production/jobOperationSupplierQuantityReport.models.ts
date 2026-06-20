import { z } from "zod";
import { zfd } from "zod-form-data";
import { productionQuantityLineInputValidator } from "./productionQuantityReport.models";

export const createJobOperationSupplierQuantityReportValidator = z.object({
  jobOperationId: z.string().min(1),
  supplierProcessId: z.string().min(1),
  notes: zfd.text(z.string().optional()),
  lines: z.array(productionQuantityLineInputValidator).min(1),
  operationUnitCost: z.number().min(0).optional(),
  operationMinimumCost: z.number().min(0).optional(),
  snapshotPricingEdited: z.boolean().optional()
});

export const replaceJobOperationSupplierQuantityReportLinesValidator = z.object(
  {
    notes: zfd.text(z.string().optional()),
    lines: z.array(productionQuantityLineInputValidator).min(1)
  }
);
