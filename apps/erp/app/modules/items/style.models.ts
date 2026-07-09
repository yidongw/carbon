import { z } from "zod";
import { zfd } from "zod-form-data";
import { applyStorageAndShelfLifeRefines, itemValidator } from "./items.models";

export const styleValidator = applyStorageAndShelfLifeRefines(
  itemValidator.merge(
    z.object({
      id: z.string().min(1, { message: "Style ID is required" }).max(255),
      revision: z.string().min(1, { message: "Revision is required" }),
      modelUploadId: zfd.text(z.string().optional()),
      thumbnailPath: zfd.text(z.string().optional()),
      lotSize: zfd.numeric(z.number().min(0).optional()),
      templateId: zfd.text(z.string().optional())
    })
  )
);
