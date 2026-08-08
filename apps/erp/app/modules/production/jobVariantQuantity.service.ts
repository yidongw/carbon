import type { Database, Json } from "@carbon/database";
import type { Kysely, KyselyDatabase } from "@carbon/database/client";
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

export function isNonEmptyConfigTable(
  configuration: unknown
): configuration is {
  configTable: unknown[];
  configTablePrimaryKeys?: unknown[];
} {
  return (
    isConfigTableConfiguration(configuration) &&
    configuration.configTable.length > 0
  );
}

/**
 * Replace all planned variant quantities for a job and sync `job.quantity`.
 * Absence of a variant = qty 0 (no zero rows stored).
 * Writes run in one Kysely transaction (delete + insert + job update + optional history).
 * Caller passes `getDatabaseClient()` — do not import database.server here (client graph).
 */
export async function replaceJobVariantQuantities(
  db: Kysely<KyselyDatabase>,
  args: {
    jobId: string;
    companyId: string;
    userId: string;
    lines: Array<{ variantItemId: string; quantity: number }>;
    /** When set, written in the same transaction as the replace. */
    history?: {
      configuration: Record<string, unknown>;
      quantity: number;
    };
    /** Clear legacy Style configTable JSON from job.configuration. */
    clearJobConfiguration?: boolean;
  }
): Promise<{ quantity: number; error: Error | null }> {
  const { jobId, companyId, userId } = args;

  const lines = args.lines.filter(
    (l) =>
      Boolean(l.variantItemId) &&
      Number.isFinite(l.quantity) &&
      Number(l.quantity) > 0
  );

  const quantity = lines.reduce((sum, l) => sum + Number(l.quantity), 0);
  const now = new Date().toISOString();

  try {
    await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("jobVariantQuantity")
        .where("jobId", "=", jobId)
        .where("companyId", "=", companyId)
        .execute();

      if (lines.length > 0) {
        await trx
          .insertInto("jobVariantQuantity")
          .values(
            lines.map((l) => ({
              jobId,
              companyId,
              variantItemId: l.variantItemId,
              quantity: Number(l.quantity),
              createdBy: userId
            }))
          )
          .execute();
      }

      await trx
        .updateTable("job")
        .set({
          quantity,
          updatedBy: userId,
          updatedAt: now,
          ...(args.clearJobConfiguration ? { configuration: null } : {})
        })
        .where("id", "=", jobId)
        .where("companyId", "=", companyId)
        .execute();

      if (args.history) {
        await trx
          .insertInto("jobConfigurationHistory")
          .values({
            jobId,
            companyId,
            configuration: args.history.configuration as Json,
            quantity: args.history.quantity,
            createdBy: userId
          })
          .execute();
      }
    });

    return { quantity, error: null };
  } catch (err) {
    return {
      quantity: 0,
      error:
        err instanceof Error
          ? err
          : new Error("Failed to replace job variant quantities")
    };
  }
}

export async function getJobVariantQuantities(
  client: Db,
  jobId: string,
  companyId: string
): Promise<{ data: JobVariantQuantityLine[]; error: Error | null }> {
  const { data, error } = await client
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
  if (rows.length > 0) {
    return attachValuesKeys(client, companyId, rows);
  }

  // Dual-read: legacy Style plans still stored as job.configuration.configTable
  // before jobVariantQuantity existed (or before a backfill).
  const { data: job, error: jobError } = await client
    .from("job")
    .select("itemId, configuration")
    .eq("id", jobId)
    .eq("companyId", companyId)
    .maybeSingle();

  if (jobError) {
    return {
      data: [],
      error: new Error(jobError.message ?? "Failed to load job for dual-read")
    };
  }

  if (!job?.itemId || !isNonEmptyConfigTable(job.configuration)) {
    return { data: [], error: null };
  }

  const expanded = await expandConfigTableToVariantQuantities(client, {
    parentItemId: job.itemId,
    companyId,
    configuration: job.configuration
  });
  if (expanded.error) {
    return { data: [], error: expanded.error };
  }

  return {
    data: expanded.data.map((r) => ({
      variantItemId: r.variantItemId,
      quantity: r.quantity,
      valuesKey: r.valuesKey
    })),
    error: null
  };
}

async function attachValuesKeys(
  client: Db,
  companyId: string,
  rows: Array<{ variantItemId: string; quantity: number }>
): Promise<{ data: JobVariantQuantityLine[]; error: Error | null }> {
  const variantIds = rows.map((r) => r.variantItemId);
  const { data: variants, error: variantError } = await client
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
  db: Kysely<KyselyDatabase>,
  args: {
    jobId: string;
    parentItemId: string;
    companyId: string;
    userId: string;
    configuration: unknown;
    history?: {
      configuration: Record<string, unknown>;
      quantity: number;
    };
    clearJobConfiguration?: boolean;
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

  return replaceJobVariantQuantities(db, {
    jobId: args.jobId,
    companyId: args.companyId,
    userId: args.userId,
    lines: expanded.data.map((r) => ({
      variantItemId: r.variantItemId,
      quantity: r.quantity
    })),
    history: args.history,
    clearJobConfiguration: args.clearJobConfiguration
  });
}

/**
 * Persist Style qty to jobVariantQuantity and clear Style configTable from
 * `job.configuration` so Part flat params remain the only JSON shape there.
 */
export async function persistStyleJobConfiguration(
  client: Db,
  db: Kysely<KyselyDatabase>,
  args: {
    jobId: string;
    parentItemId: string;
    companyId: string;
    userId: string;
    configuration: Record<string, unknown>;
  }
): Promise<{ quantity: number; error: Error | null }> {
  return replaceJobVariantQuantitiesFromConfigTable(client, db, {
    jobId: args.jobId,
    parentItemId: args.parentItemId,
    companyId: args.companyId,
    userId: args.userId,
    configuration: args.configuration,
    clearJobConfiguration: true
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
