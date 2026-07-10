import { z } from "zod";

/** One color/size/quantity row captured at cutting (and edited in the split). */
export const splitRowItemSchema = z.object({
  id: z.string().optional(),
  colorCode: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  sizeCode: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  quantity: z.coerce.number().min(0.0001, { message: "Quantity is required" })
});

export type SplitRowItem = z.infer<typeof splitRowItemSchema>;

/** The form payload: `rows` is a JSON-encoded array of {colorCode,sizeCode,quantity}. */
export const splitRowsFormValidator = z.object({
  masterWorkOrderId: z.string().min(1),
  rows: z.string().min(1)
});

/** Parse + validate the JSON `rows` payload into typed split rows. */
export function parseSplitRows(json: string): SplitRowItem[] {
  const parsed = z.array(splitRowItemSchema).safeParse(JSON.parse(json));
  if (!parsed.success) {
    throw new Error("Invalid split rows");
  }
  return parsed.data;
}
