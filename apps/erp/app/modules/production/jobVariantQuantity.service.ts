import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { expandConfigTableToVariantQuantities } from "~/modules/items/itemAttribute.service";

export type JobVariantQuantityLine = {
  variantItemId: string;
  quantity: number;
  valuesKey: string;
};

type Db = SupabaseClient<Database>;

/** True when configuration is a Style/attribute qty table (not Part flat params). */
export function isConfigTableConfiguration(
  configuration: unknown
): configuration is {
  configTable: unknown[];
  configTablePrimaryKeys?: unknown[];
} {
  if (!configuration || typeof configuration !== "object") return false;
  return Array.isArray(
    (configuration as { configTable?: unknown }).configTable
  );
}

/**
 * Replace all planned variant quantities for a job and sync `job.quantity`.
 * Absence of a variant = qty 0 (no zero rows stored).
 */
export async function replaceJobVariantQuantities(
  client: Db,
  args: {
    jobId: string;
    companyId: string;
    userId: string;
    lines: Array<{ variantItemId: string; quantity: number }>;
  }
): Promise<{ quantity: number; error: Error | null }> {
  const db = client as any;
  const { jobId, companyId, userId } = args;

  const lines = args.lines.filter(
    (l) =>
      Boolean(l.variantItemId) &&
      Number.isFinite(l.quantity) &&
      Number(l.quantity) > 0
  );

  const quantity = lines.reduce((sum, l) => sum + Number(l.quantity), 0);

  const { error: deleteError } = await db
    .from("jobVariantQuantity")
    .delete()
    .eq("jobId", jobId)
    .eq("companyId", companyId);
  if (deleteError) {
    return {
      quantity: 0,
      error: new Error(
        deleteError.message ?? "Failed to clear job variant quantities"
      )
    };
  }

  if (lines.length > 0) {
    const { error: insertError } = await db.from("jobVariantQuantity").insert(
      lines.map((l) => ({
        jobId,
        companyId,
        variantItemId: l.variantItemId,
        quantity: Number(l.quantity),
        createdBy: userId
      }))
    );
    if (insertError) {
      return {
        quantity: 0,
        error: new Error(
          insertError.message ?? "Failed to insert job variant quantities"
        )
      };
    }
  }

  const { error: jobError } = await db
    .from("job")
    .update({
      quantity,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    })
    .eq("id", jobId)
    .eq("companyId", companyId);
  if (jobError) {
    return {
      quantity,
      error: new Error(jobError.message ?? "Failed to sync job quantity")
    };
  }

  return { quantity, error: null };
}

export async function getJobVariantQuantities(
  client: Db,
  jobId: string,
  companyId: string
): Promise<{ data: JobVariantQuantityLine[]; error: Error | null }> {
  const db = client as any;
  const { data, error } = await db
    .from("jobVariantQuantity")
    .select("variantItemId, quantity")
    .eq("jobId", jobId)
    .eq("companyId", companyId);

  if (error) {
    return {
      data: [],
      error: new Error(error.message ?? "Failed to load job variant quantities")
    };
  }

  const rows = (data ?? []) as Array<{
    variantItemId: string;
    quantity: number;
  }>;
  if (rows.length === 0) return { data: [], error: null };

  const variantIds = rows.map((r) => r.variantItemId);
  const { data: variants, error: variantError } = await db
    .from("itemVariant")
    .select("variantItemId, valuesKey")
    .eq("companyId", companyId)
    .in("variantItemId", variantIds);

  if (variantError) {
    return {
      data: [],
      error: new Error(
        variantError.message ?? "Failed to load variant valuesKeys"
      )
    };
  }

  const keyByVariant = new Map<string, string>(
    (
      (variants ?? []) as Array<{ variantItemId: string; valuesKey: string }>
    ).map((v) => [v.variantItemId, v.valuesKey])
  );

  return {
    data: rows.map((r) => ({
      variantItemId: r.variantItemId,
      quantity: Number(r.quantity) || 0,
      valuesKey: keyByVariant.get(r.variantItemId) ?? r.variantItemId
    })),
    error: null
  };
}

/** Expand a combo/matrix configTable payload into jobVariantQuantity rows. */
export async function replaceJobVariantQuantitiesFromConfigTable(
  client: Db,
  args: {
    jobId: string;
    parentItemId: string;
    companyId: string;
    userId: string;
    configuration: unknown;
  }
): Promise<{ quantity: number; error: Error | null }> {
  const expanded = await expandConfigTableToVariantQuantities(client, {
    parentItemId: args.parentItemId,
    companyId: args.companyId,
    configuration: args.configuration
  });
  if (expanded.error) {
    return { quantity: 0, error: expanded.error };
  }

  return replaceJobVariantQuantities(client, {
    jobId: args.jobId,
    companyId: args.companyId,
    userId: args.userId,
    lines: expanded.data.map((r) => ({
      variantItemId: r.variantItemId,
      quantity: r.quantity
    }))
  });
}

/** Build combo editor rows from stored jobVariantQuantity lines. */
export function jobVariantQuantitiesToConfigTable(
  lines: JobVariantQuantityLine[]
): {
  configTable: Array<{ valuesKey: string; Quantities: number }>;
  configTablePrimaryKeys: ["Quantities"];
} {
  return {
    configTable: lines
      .filter((l) => l.quantity > 0)
      .map((l) => ({
        valuesKey: l.valuesKey,
        Quantities: l.quantity
      })),
    configTablePrimaryKeys: ["Quantities"]
  };
}

export function sumJobVariantQuantities(
  lines: Array<{ quantity: number }>
): number {
  return lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);
}
