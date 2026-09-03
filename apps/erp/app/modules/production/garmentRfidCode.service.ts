import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Mint the RFID/EPC code for a single garment piece.
 *
 * This is the ONE place the code format lives. The default is a readable,
 * company-unique value derived from the bundle's (job) readable id plus the
 * piece sequence — e.g. `WO000123-001`. When the customer's real EPC spec is
 * known, replace only this function.
 */
export function generateRfidCode(
  bundleReadableId: string,
  sequence: number
): string {
  return `${bundleReadableId}-${String(sequence).padStart(3, "0")}`;
}

export type GarmentRfidCode = NonNullable<
  Awaited<ReturnType<typeof getGarmentRfidCodes>>["data"]
>[number];

/** All RFID codes generated for a bundle work order, ordered by piece sequence. */
export async function getGarmentRfidCodes(
  client: SupabaseClient<Database>,
  bundleWorkOrderId: string,
  companyId: string
) {
  return client
    .from("garmentRfidCode")
    .select("*", { count: "exact" })
    .eq("bundleWorkOrderId", bundleWorkOrderId)
    .eq("companyId", companyId)
    .order("sequence", { ascending: true });
}

/**
 * Generate one unique RFID code per garment piece for each selected bundle work
 * order (piece count = the bundle's quantity). Idempotent: a bundle that already
 * has codes is topped up only for the pieces still missing a code, so clicking
 * the button twice never duplicates or renumbers existing codes.
 *
 * Scope is deliberately narrow — this only mints and stores codes. Printing the
 * care label and encoding the physical RFID chip are handled outside the system.
 */
export async function generateGarmentRfidCodesForBundles(
  client: SupabaseClient<Database>,
  input: {
    bundleWorkOrderIds: string[];
    companyId: string;
    createdBy: string;
  }
): Promise<{ error: Error | null; generated: number }> {
  const ids = Array.from(new Set(input.bundleWorkOrderIds.filter(Boolean)));
  if (ids.length === 0) return { error: null, generated: 0 };

  // Piece count + readable id per selected bundle.
  const bundles = await client
    .from("bundleWorkOrders")
    .select("id, quantity, jobReadableId")
    .eq("companyId", input.companyId)
    .in("id", ids);
  if (bundles.error) return { error: bundles.error, generated: 0 };

  // How many pieces in each bundle already carry a code (top-up, not replace).
  const existing = await client
    .from("garmentRfidCode")
    .select("bundleWorkOrderId")
    .eq("companyId", input.companyId)
    .in("bundleWorkOrderId", ids);
  if (existing.error) return { error: existing.error, generated: 0 };

  const existingCountByBundle = new Map<string, number>();
  for (const row of existing.data ?? []) {
    existingCountByBundle.set(
      row.bundleWorkOrderId,
      (existingCountByBundle.get(row.bundleWorkOrderId) ?? 0) + 1
    );
  }

  const rows: Database["public"]["Tables"]["garmentRfidCode"]["Insert"][] = [];
  for (const bundle of bundles.data ?? []) {
    if (!bundle.id) continue;
    const quantity = Number(bundle.quantity) || 0;
    const alreadyHave = existingCountByBundle.get(bundle.id) ?? 0;
    const readableId = bundle.jobReadableId ?? bundle.id;
    for (let sequence = alreadyHave + 1; sequence <= quantity; sequence++) {
      rows.push({
        code: generateRfidCode(readableId, sequence),
        bundleWorkOrderId: bundle.id,
        sequence,
        companyId: input.companyId,
        createdBy: input.createdBy
      });
    }
  }

  if (rows.length === 0) return { error: null, generated: 0 };

  const insert = await client.from("garmentRfidCode").insert(rows);
  if (insert.error) return { error: insert.error, generated: 0 };

  return { error: null, generated: rows.length };
}
