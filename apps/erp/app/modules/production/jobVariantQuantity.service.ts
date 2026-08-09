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
    .eq("companyId", companyId)
    // Stable order so downstream aggregate-cut spreading is deterministic.
    .order("variantItemId", { ascending: true });

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

/**
 * Batched form of {@link getJobVariantQuantities} for a list of jobs. Resolves
 * the common (jobVariantQuantity-backed) case in two queries total — one for all
 * rows, one for all valuesKeys — and only falls back to the per-job dual-read for
 * legacy jobs that have no jobVariantQuantity rows. Avoids the N×(2–4) round-trip
 * fan-out of mapping getJobVariantQuantities over every job on list pages.
 */
export async function getJobVariantQuantitiesForJobs(
  client: Db,
  jobIds: string[],
  companyId: string
): Promise<{
  data: Map<string, JobVariantQuantityLine[]>;
  error: Error | null;
}> {
  const result = new Map<string, JobVariantQuantityLine[]>();
  if (jobIds.length === 0) return { data: result, error: null };

  const { data, error } = await client
    .from("jobVariantQuantity")
    .select("jobId, variantItemId, quantity")
    .eq("companyId", companyId)
    .in("jobId", jobIds)
    // Stable order so downstream aggregate-cut spreading is deterministic.
    .order("variantItemId", { ascending: true });
  if (error) {
    return {
      data: result,
      error: new Error(error.message ?? "Failed to load job variant quantities")
    };
  }

  const rowsByJob = new Map<
    string,
    Array<{ variantItemId: string; quantity: number }>
  >();
  for (const row of (data ?? []) as Array<{
    jobId: string;
    variantItemId: string;
    quantity: number;
  }>) {
    const list = rowsByJob.get(row.jobId);
    if (list)
      list.push({ variantItemId: row.variantItemId, quantity: row.quantity });
    else
      rowsByJob.set(row.jobId, [
        { variantItemId: row.variantItemId, quantity: row.quantity }
      ]);
  }

  // Batch the valuesKey lookup across every variant referenced by any job.
  const allVariantIds = [
    ...new Set(
      [...rowsByJob.values()].flatMap((rows) =>
        rows.map((r) => r.variantItemId)
      )
    )
  ];
  const keyByVariant = new Map<string, string>();
  if (allVariantIds.length > 0) {
    const { data: variants, error: variantError } = await client
      .from("itemVariant")
      .select("variantItemId, valuesKey")
      .eq("companyId", companyId)
      .in("variantItemId", allVariantIds);
    if (variantError) {
      return {
        data: result,
        error: new Error(
          variantError.message ?? "Failed to load variant valuesKeys"
        )
      };
    }
    for (const v of (variants ?? []) as Array<{
      variantItemId: string;
      valuesKey: string;
    }>) {
      keyByVariant.set(v.variantItemId, v.valuesKey);
    }
  }

  const legacyJobIds: string[] = [];
  for (const jobId of jobIds) {
    const rows = rowsByJob.get(jobId);
    if (!rows || rows.length === 0) {
      legacyJobIds.push(jobId);
      continue;
    }
    result.set(
      jobId,
      rows.map((r) => ({
        variantItemId: r.variantItemId,
        quantity: Number(r.quantity) || 0,
        valuesKey: keyByVariant.get(r.variantItemId) ?? r.variantItemId
      }))
    );
  }

  // Legacy jobs (no live rows) still need the per-job dual-read expansion.
  const fallbacks = await Promise.all(
    legacyJobIds.map(async (jobId) => ({
      jobId,
      res: await getJobVariantQuantities(client, jobId, companyId)
    }))
  );
  for (const { jobId, res } of fallbacks) {
    if (res.error) return { data: result, error: res.error };
    if (res.data.length > 0) result.set(jobId, res.data);
  }

  return { data: result, error: null };
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
