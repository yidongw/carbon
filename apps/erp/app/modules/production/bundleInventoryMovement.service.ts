import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export type BundleMovementDirection = "In" | "Out";

export type BundleInventoryMovement = NonNullable<
  Awaited<ReturnType<typeof getBundleInventoryMovements>>["data"]
>[number];

/**
 * Resolve a scanned garment code to its bundle work order summary.
 *
 * This is the FIRST reader of `garmentRfidCode.code` — every other reference just
 * mints/prints it. Any one piece of a bundle resolves the whole bundle (the code
 * carries `bundleWorkOrderId`), which is exactly what "scan one, record the whole
 * bundle" needs. Returns `data: null` (no error) when the code isn't found.
 */
export async function getBundleByGarmentCode(
  client: SupabaseClient<Database>,
  code: string,
  companyId: string
) {
  const scanned = code.trim();
  if (!scanned) return { data: null, error: null };

  // Prefer system code; fall back to bound UHF chip EPC (externalCode).
  let rfid = await client
    .from("garmentRfidCode")
    .select("id, code, externalCode, bundleWorkOrderId, sequence")
    .eq("companyId", companyId)
    .eq("code", scanned)
    .maybeSingle();
  if (rfid.error) return { data: null, error: rfid.error };

  if (!rfid.data) {
    rfid = await client
      .from("garmentRfidCode")
      .select("id, code, externalCode, bundleWorkOrderId, sequence")
      .eq("companyId", companyId)
      .eq("externalCode", scanned)
      .maybeSingle();
    if (rfid.error) return { data: null, error: rfid.error };
  }

  if (!rfid.data) return { data: null, error: null };

  const bundle = await client
    .from("bundleWorkOrders")
    .select(
      "id, itemId, locationId, jobReadableId, styleReadableId, quantity, attributeLabel, status"
    )
    .eq("id", rfid.data.bundleWorkOrderId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (bundle.error) return { data: null, error: bundle.error };
  if (!bundle.data) return { data: null, error: null };

  return {
    data: {
      scannedCode: scanned,
      bundle: bundle.data
    },
    error: null
  };
}

/** Log one whole-bundle in/out movement (standalone ledger — no itemLedger post). */
export async function recordBundleInventoryMovement(
  client: SupabaseClient<Database>,
  input: {
    bundleWorkOrderId: string;
    direction: BundleMovementDirection;
    quantity: number;
    scannedCode: string;
    companyId: string;
    createdBy: string;
  }
) {
  return client.from("bundleInventoryMovement").insert({
    bundleWorkOrderId: input.bundleWorkOrderId,
    direction: input.direction,
    quantity: input.quantity,
    scannedCode: input.scannedCode,
    companyId: input.companyId,
    createdBy: input.createdBy
  });
}

/** All in/out movements for one bundle, newest first (the per-bundle history tab). */
export async function getBundleInventoryMovements(
  client: SupabaseClient<Database>,
  bundleWorkOrderId: string,
  companyId: string
) {
  return client
    .from("bundleInventoryMovement")
    .select("*", { count: "exact" })
    .eq("bundleWorkOrderId", bundleWorkOrderId)
    .eq("companyId", companyId)
    .order("createdAt", { ascending: false });
}

/** Latest movements across all bundles, newest first (the scan page's recent list). */
export async function getRecentBundleInventoryMovements(
  client: SupabaseClient<Database>,
  companyId: string,
  limit = 25
) {
  return client
    .from("bundleInventoryMovement")
    .select("*", { count: "exact" })
    .eq("companyId", companyId)
    .order("createdAt", { ascending: false })
    .limit(limit);
}
