/**
 * Variant SKU helpers for edge functions (Deno).
 * Mirrors apps/erp/.../itemAttribute.service.ts resolve/expand logic.
 */

type SupabaseLike = {
  from: (table: string) => any;
};

type ConfigRow = Record<string, unknown>;

export async function resolveVariantItemId(
  client: SupabaseLike,
  args: {
    parentItemId: string;
    companyId: string;
    colorCode?: string | null;
    sizeCode?: string | null;
  }
): Promise<string> {
  const { parentItemId, companyId, colorCode, sizeCode } = args;
  if (!colorCode && !sizeCode) return parentItemId;

  const valuesKey = [colorCode, sizeCode].filter(Boolean).join("|");
  const { data, error } = await client
    .from("itemVariant")
    .select("variantItemId")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId)
    .eq("valuesKey", valuesKey)
    .maybeSingle();

  if (error) throw error;
  return (data?.variantItemId as string | undefined) ?? parentItemId;
}

export async function expandConfigTableToVariantQuantities(
  client: SupabaseLike,
  args: {
    parentItemId: string;
    companyId: string;
    configuration: unknown;
  }
): Promise<Array<{ variantItemId: string; quantity: number; valuesKey: string }>> {
  const raw = (args.configuration ?? {}) as Record<string, unknown>;
  const table = Array.isArray(raw.configTable)
    ? (raw.configTable as ConfigRow[])
    : [];
  const primaryKeys = Array.isArray(raw.configTablePrimaryKeys)
    ? (raw.configTablePrimaryKeys as string[])
    : [];

  const out: Array<{
    variantItemId: string;
    quantity: number;
    valuesKey: string;
  }> = [];

  for (const row of table) {
    const color =
      (row.color as string) ??
      (row.Color as string) ??
      (row.colorCode as string) ??
      "";
    for (const size of primaryKeys) {
      const qty = Number(row[size] ?? 0);
      if (!qty || qty <= 0) continue;
      const valuesKey = color ? `${color}|${size}` : size;
      const variantItemId = await resolveVariantItemId(client, {
        parentItemId: args.parentItemId,
        companyId: args.companyId,
        colorCode: color || null,
        sizeCode: size
      });
      out.push({ variantItemId, quantity: qty, valuesKey });
    }
  }

  return out;
}

export function hasConfigTable(configuration: unknown): boolean {
  if (!configuration || typeof configuration !== "object") return false;
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) && table.length > 0;
}
