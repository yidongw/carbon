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

export type ResolvedGarmentPiece = {
  scannedCode: string;
  garmentRfidCodeId: string;
  systemCode: string;
  externalCode: string | null;
  /** Variant SKU that holds inventory for this piece's bundle. */
  variantItemId: string;
  /** Style parent when the SKU is an itemVariant child; null otherwise. */
  parentItemId: string | null;
  styleReadableId: string | null;
  attributeLabel: string | null;
};

/**
 * Batch-resolve PDA scans (system Code128 or bound UHF EPC) to individual
 * garment pieces. Unlike `getBundleByGarmentCode`, this does not collapse to
 * whole-bundle quantity — each unique code is one piece.
 */
export async function resolveGarmentPiecesByScannedCodes(
  client: SupabaseClient<Database>,
  codes: string[],
  companyId: string
): Promise<{
  data: ResolvedGarmentPiece[];
  unknown: string[];
  error: unknown;
}> {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const raw of codes) {
    const code = raw.trim();
    if (!code || seen.has(code)) continue;
    seen.add(code);
    unique.push(code);
  }
  if (unique.length === 0) {
    return { data: [], unknown: [], error: null };
  }

  const bySystem = await client
    .from("garmentRfidCode")
    .select("id, code, externalCode, bundleWorkOrderId")
    .eq("companyId", companyId)
    .in("code", unique);
  if (bySystem.error) {
    return { data: [], unknown: unique, error: bySystem.error };
  }

  const matched = new Map<
    string,
    {
      id: string;
      code: string;
      externalCode: string | null;
      bundleWorkOrderId: string;
      scannedCode: string;
    }
  >();
  for (const row of bySystem.data ?? []) {
    if (unique.includes(row.code)) {
      matched.set(row.code, {
        id: row.id,
        code: row.code,
        externalCode: row.externalCode,
        bundleWorkOrderId: row.bundleWorkOrderId,
        scannedCode: row.code
      });
    }
  }

  const remaining = unique.filter((c) => !matched.has(c));
  if (remaining.length > 0) {
    const byEpc = await client
      .from("garmentRfidCode")
      .select("id, code, externalCode, bundleWorkOrderId")
      .eq("companyId", companyId)
      .in("externalCode", remaining);
    if (byEpc.error) {
      return { data: [], unknown: unique, error: byEpc.error };
    }
    for (const row of byEpc.data ?? []) {
      const epc = row.externalCode?.trim();
      if (!epc || matched.has(epc)) continue;
      if (!remaining.includes(epc)) continue;
      matched.set(epc, {
        id: row.id,
        code: row.code,
        externalCode: row.externalCode,
        bundleWorkOrderId: row.bundleWorkOrderId,
        scannedCode: epc
      });
    }
  }

  const unknown = unique.filter((c) => !matched.has(c));
  const matchedRows = [...matched.values()];
  if (matchedRows.length === 0) {
    return { data: [], unknown, error: null };
  }

  const bundleIds = [...new Set(matchedRows.map((r) => r.bundleWorkOrderId))];
  const bundles = await client
    .from("bundleWorkOrders")
    .select("id, itemId, styleReadableId, attributeLabel")
    .eq("companyId", companyId)
    .in("id", bundleIds);
  if (bundles.error) {
    return { data: [], unknown: unique, error: bundles.error };
  }
  const bundleById = new Map((bundles.data ?? []).map((b) => [b.id, b]));

  const variantIds = [
    ...new Set(
      (bundles.data ?? [])
        .map((b) => b.itemId)
        .filter((id): id is string => Boolean(id))
    )
  ];
  const parentByVariant = new Map<string, string>();
  if (variantIds.length > 0) {
    const parents = await client
      .from("itemVariant")
      .select("variantItemId, parentItemId")
      .eq("companyId", companyId)
      .in("variantItemId", variantIds);
    if (parents.error) {
      return { data: [], unknown: unique, error: parents.error };
    }
    for (const row of parents.data ?? []) {
      parentByVariant.set(row.variantItemId, row.parentItemId);
    }
  }

  const data: ResolvedGarmentPiece[] = [];
  for (const row of matchedRows) {
    const bundle = bundleById.get(row.bundleWorkOrderId);
    if (!bundle?.itemId) {
      unknown.push(row.scannedCode);
      continue;
    }
    data.push({
      scannedCode: row.scannedCode,
      garmentRfidCodeId: row.id,
      systemCode: row.code,
      externalCode: row.externalCode,
      variantItemId: bundle.itemId,
      parentItemId: parentByVariant.get(bundle.itemId) ?? null,
      styleReadableId: bundle.styleReadableId,
      attributeLabel: bundle.attributeLabel
    });
  }

  return { data, unknown, error: null };
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
