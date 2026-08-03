import { z } from "zod";
import { zfd } from "zod-form-data";
import { applyStorageAndShelfLifeRefines, itemValidator } from "./items.models";

export const createStyleSampleLineValidator = z.object({
  colorId: z.string().min(1, { message: "Color is required" }),
  size: z.string().min(1, { message: "Size is required" }),
  quantity: z.coerce.number().int().min(1)
});

export const createStyleSampleValidator = z.object({
  styleId: z.string().min(1),
  locationId: z.string().min(1, { message: "Location is required" }),
  // Required so every sample unit lands in a real bin. Loose (null-bin) units
  // make later transfers/adjustments go inconsistent (negative on-hand).
  storageUnitId: z.string().min(1, { message: "Storage unit is required" }),
  // Rows of [color, size, quantity], submitted as a JSON string in a Hidden field.
  lines: z.preprocess(
    (v) => {
      if (typeof v !== "string") return v;
      try {
        return JSON.parse(v);
      } catch {
        return [];
      }
    },
    z
      .array(createStyleSampleLineValidator)
      .min(1, { message: "Add at least one sample row" })
  )
});

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

export const styleSizeValidator = z.object({
  id: zfd.text(z.string().optional()),
  sizeCode: z.string().min(1, { message: "Size code is required" }).max(50),
  sizeName: z.string().min(1, { message: "Size name is required" }).max(255)
});
