import type { Database } from "@carbon/database";
import type { Kysely, KyselyDatabase } from "@carbon/database/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { expandVariantsQuantityTable } from "~/modules/items/itemAttribute.service";
import { resolveStyleMethodItemId } from "~/modules/items/styleMethod.service";
import { readVariantTableRows } from "~/modules/production/variantTableWire";

export type JobVariantQuantityLine = {
  variantItemId: string;
  quantity: number;
  valuesKey: string;
};

type Db = SupabaseClient<Database>;

/** True when payload is a Style/attribute qty table (not Part flat params). */
export function isVariantsQuantityPayload(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;
  const cfg = payload as Record<string, unknown>;
  // Dual-read legacy `configTable` during the wire-key rename window.
  return Array.isArray(cfg.variantTable) || Array.isArray(cfg.configTable);
}

export function isNonEmptyVariantsQuantity(payload: unknown): boolean {
  return readVariantTableRows(payload).length > 0;
}

/**
 * Replace all planned variant quantities for a job and sync `job.quantity`.
 * Absence of a variant = qty 0 (no zero rows stored).
 * Writes run in one Kysely transaction (delete + insert + job update).
 * Caller passes `getDatabaseClient()` — do not import database.server here (client graph).
 */
export async function replaceJobVariantQuantities(
  db: Kysely<KyselyDatabase>,
  args: {
    jobId: string;
    companyId: string;
    userId: string;
    lines: Array<{ variantItemId: string; quantity: number }>;
    /** Clear legacy Style variantTable JSON left on job.configuration. */
    clearStyleVariantQuantitiesFromJob?: boolean;
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
          ...(args.clearStyleVariantQuantitiesFromJob
            ? { configuration: null }
            : {})
        })
        .where("id", "=", jobId)
        .where("companyId", "=", companyId)
        .execute();
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

  // Dual-read: legacy Style plans still stored as job.configuration.variantTable
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

  if (!job?.itemId || !isNonEmptyVariantsQuantity(job.configuration)) {
    return { data: [], error: null };
  }

  const parentItemId = await resolveStyleMethodItemId(client, {
    itemId: job.itemId,
    companyId
  });
  const expanded = await expandVariantsQuantityTable(client, {
    parentItemId,
    companyId,
    variantQuantities: job.configuration
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

/** Expand a combo/matrix variantTable payload into jobVariantQuantity rows. */
export async function replaceJobVariantQuantitiesFromTable(
  client: Db,
  db: Kysely<KyselyDatabase>,
  args: {
    jobId: string;
    parentItemId: string;
    companyId: string;
    userId: string;
    variantQuantities: unknown;
    clearStyleVariantQuantitiesFromJob?: boolean;
  }
): Promise<{ quantity: number; error: Error | null }> {
  const expanded = await expandVariantsQuantityTable(client, {
    parentItemId: args.parentItemId,
    companyId: args.companyId,
    variantQuantities: args.variantQuantities
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
    clearStyleVariantQuantitiesFromJob: args.clearStyleVariantQuantitiesFromJob
  });
}

/**
 * Persist Style qty to jobVariantQuantity and clear any Style variantTable
 * left on `job.configuration` so Part flat params remain the only JSON there.
 */
export async function persistStyleJobVariantQuantities(
  client: Db,
  db: Kysely<KyselyDatabase>,
  args: {
    jobId: string;
    parentItemId: string;
    companyId: string;
    userId: string;
    variantQuantities: Record<string, unknown>;
  }
): Promise<{ quantity: number; error: Error | null }> {
  return replaceJobVariantQuantitiesFromTable(client, db, {
    jobId: args.jobId,
    parentItemId: args.parentItemId,
    companyId: args.companyId,
    userId: args.userId,
    variantQuantities: args.variantQuantities,
    clearStyleVariantQuantitiesFromJob: true
  });
}

/** Build combo editor rows from stored jobVariantQuantity lines. */
export function jobVariantQuantitiesToTable(lines: JobVariantQuantityLine[]): {
  variantTable: Array<{ valuesKey: string; Quantities: number }>;
} {
  return {
    variantTable: lines
      .filter((l) => l.quantity > 0)
      .map((l) => ({
        valuesKey: l.valuesKey,
        Quantities: l.quantity
      }))
  };
}

/**
 * Planned Style qty payload for editors / BOP targets.
 * Uses `getJobVariantQuantities` (includes legacy dual-read expand).
 */
export async function getJobPlannedVariantQuantities(
  client: Db,
  jobId: string,
  companyId: string
): Promise<{
  variantTable: Array<{ valuesKey: string; Quantities: number }>;
} | null> {
  const planned = await getJobVariantQuantities(client, jobId, companyId);
  if (planned.error || planned.data.length === 0) return null;
  return jobVariantQuantitiesToTable(planned.data);
}

export function sumJobVariantQuantities(
  lines: Array<{ quantity: number }>
): number {
  return lines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);
}
