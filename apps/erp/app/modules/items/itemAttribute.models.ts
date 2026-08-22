import { z } from "zod";
import { zfd } from "zod-form-data";

const itemAttributeValueInputSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, { message: "Code is required" }).max(50),
  name: z.string().min(1, { message: "Name is required" }).max(255),
  color: z.string().nullish()
});

export const itemAttributeValidator = z.object({
  id: zfd.text(z.string().optional()),
  code: z.string().min(1, { message: "Code is required" }).max(50),
  name: z.string().min(1, { message: "Name is required" }).max(255),
  sortOrder: zfd.numeric(z.number().int().optional()),
  /** Ordered values managed in the attribute overlay (mirrors set attributeIds). */
  values: z.preprocess(
    (v) => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    },
    z.array(itemAttributeValueInputSchema).min(1, {
      message: "Add at least one value"
    })
  )
});

export const itemAttributeValueValidator = z.object({
  id: zfd.text(z.string().optional()),
  attributeId: z.string().min(1, { message: "Attribute is required" }),
  code: z.string().min(1, { message: "Code is required" }).max(50),
  name: z.string().min(1, { message: "Name is required" }).max(255),
  sortOrder: zfd.numeric(z.number().int().optional()),
  // Optional display color (hex). Used as the per-color BOM chip color.
  color: zfd.text(z.string().optional())
});

export const itemAttributeSetValidator = z.object({
  id: zfd.text(z.string().optional()),
  code: z.string().min(1, { message: "Code is required" }).max(50),
  name: z.string().min(1, { message: "Name is required" }).max(255),
  attributeIds: z.preprocess(
    (v) => {
      if (Array.isArray(v)) return v;
      if (typeof v === "string") {
        try {
          const parsed = JSON.parse(v);
          return Array.isArray(parsed) ? parsed : [v];
        } catch {
          return v ? [v] : [];
        }
      }
      return [];
    },
    z.array(z.string().min(1)).min(1, { message: "Add at least one attribute" })
  )
});

export const itemAttributeSetAssignmentValidator = z.object({
  id: zfd.text(z.string().optional()),
  itemType: z.enum([
    "Part",
    "Material",
    "Tool",
    "Consumable",
    "Fixture",
    "Service",
    "Style",
    "Sample"
  ]),
  attributeSetId: z.string().min(1, { message: "Attribute set is required" })
});

export const itemAttributeSelectionValidator = z.object({
  itemId: z.string().min(1),
  attributeSetId: zfd.text(z.string().optional()),
  /** Map of attributeId → attributeValueId[] as JSON */
  selections: z.preprocess(
    (v) => {
      if (typeof v !== "string") return v;
      try {
        return JSON.parse(v);
      } catch {
        return {};
      }
    },
    z.record(z.string(), z.array(z.string().min(1)))
  )
});
