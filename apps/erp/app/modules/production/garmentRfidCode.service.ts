import type { Database } from "@carbon/database";
import { fetchAllFromTable } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isStyleCareLabelOperation } from "~/modules/items/styleMethod.service";
import { validateCareLabelBulkBind } from "./careLabelBind";

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

export type GarmentRfidCode =
  Database["public"]["Tables"]["garmentRfidCode"]["Row"];

/** All RFID codes generated for a bundle work order, ordered by piece sequence. */
export async function getGarmentRfidCodes(
  client: SupabaseClient<Database>,
  bundleWorkOrderId: string,
  companyId: string
) {
  // Bundles can mint 1000+ pieces — page past PostgREST's default 1000-row cap.
  return fetchAllFromTable<GarmentRfidCode>(
    client,
    "garmentRfidCode",
    "*",
    (query) =>
      query
        .eq("bundleWorkOrderId", bundleWorkOrderId)
        .eq("companyId", companyId)
        .order("sequence", { ascending: true })
  );
}

/**
 * Generate one unique RFID code per garment piece for each selected bundle work
 * order (piece count = the bundle's quantity). Idempotent: a bundle that already
 * has codes is topped up only for the pieces still missing a code, so clicking
 * the button twice never duplicates or renumbers existing codes.
 *
 * Scope is deliberately narrow — this only mints and stores codes. Printing the
 * care label uses PrintCareLabelsModal; physical RFID chip encoding is outside.
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

/**
 * When a bundle's「打印水洗唛」job operation reaches Done, mint missing RFID
 * codes for that bundle. No-op for other ops / master jobs / incomplete ops.
 * Idempotent via generateGarmentRfidCodesForBundles.
 */
export async function maybeMintGarmentRfidOnCareLabelDone(
  client: SupabaseClient<Database>,
  input: {
    jobOperationId: string;
    companyId: string;
    userId: string;
  }
): Promise<{ error: Error | null; generated: number }> {
  const operation = await client
    .from("jobOperation")
    .select("id, jobId, status, tags, customFields")
    .eq("id", input.jobOperationId)
    .eq("companyId", input.companyId)
    .maybeSingle();

  if (operation.error) return { error: operation.error, generated: 0 };
  if (!operation.data || operation.data.status !== "Done") {
    return { error: null, generated: 0 };
  }
  if (!isStyleCareLabelOperation(operation.data)) {
    return { error: null, generated: 0 };
  }

  const bundle = await client
    .from("bundleWorkOrder")
    .select("id")
    .eq("jobId", operation.data.jobId)
    .eq("companyId", input.companyId)
    .maybeSingle();

  if (bundle.error) return { error: bundle.error, generated: 0 };
  if (!bundle.data?.id) return { error: null, generated: 0 };

  return generateGarmentRfidCodesForBundles(client, {
    bundleWorkOrderIds: [bundle.data.id],
    companyId: input.companyId,
    createdBy: input.userId
  });
}

export type BindGarmentRfidResult =
  | { error: null; bound: number }
  | {
      error: Error;
      bound: 0;
      reason?: "tooFew" | "tooMany" | "empty" | "noSystemCodes" | "chipInUse";
      uniqueCount?: number;
      expectedCount?: number;
    };

/**
 * Bulk-bind UHF chip EPCs from a handheld PDA read to this bundle's system
 * codes (1:1 by sequence). Unique EPC count must equal the number of system
 * rows; otherwise reject and ask the floor to re-scan. Replaces prior binds on
 * this bundle when successful.
 */
export async function bindGarmentRfidExternalCodes(
  client: SupabaseClient<Database>,
  input: {
    bundleWorkOrderId: string;
    companyId: string;
    userId: string;
    rawExternalCodes: string[];
  }
): Promise<BindGarmentRfidResult> {
  const rows = await client
    .from("garmentRfidCode")
    .select("id, sequence, externalCode")
    .eq("bundleWorkOrderId", input.bundleWorkOrderId)
    .eq("companyId", input.companyId)
    .order("sequence", { ascending: true });

  if (rows.error) return { error: rows.error, bound: 0 };

  const systemRows = rows.data ?? [];
  const validation = validateCareLabelBulkBind({
    rawExternalCodes: input.rawExternalCodes,
    expectedCount: systemRows.length
  });

  if (!validation.ok) {
    return {
      error: new Error(
        validation.reason === "tooFew"
          ? "数量不足，请重新扫描"
          : validation.reason === "tooMany"
            ? "数量过多，请重新扫描"
            : validation.reason === "noSystemCodes"
              ? "请先生成系统编码"
              : "未读到芯片，请重新扫描"
      ),
      bound: 0,
      reason: validation.reason,
      uniqueCount: validation.uniqueCount,
      expectedCount: validation.expectedCount
    };
  }

  const externalCodes = validation.externalCodes;

  // Reject chips already bound to a different bundle (same bundle re-bind OK).
  const inUse = await client
    .from("garmentRfidCode")
    .select("id, externalCode, bundleWorkOrderId")
    .eq("companyId", input.companyId)
    .in("externalCode", externalCodes);

  if (inUse.error) return { error: inUse.error, bound: 0 };

  const conflict = (inUse.data ?? []).find(
    (row) =>
      row.externalCode && row.bundleWorkOrderId !== input.bundleWorkOrderId
  );
  if (conflict) {
    return {
      error: new Error("芯片已被其他扎占用，请重新扫描"),
      bound: 0,
      reason: "chipInUse",
      uniqueCount: externalCodes.length,
      expectedCount: systemRows.length
    };
  }

  const now = new Date().toISOString();
  for (let i = 0; i < systemRows.length; i++) {
    const row = systemRows[i];
    const externalCode = externalCodes[i];
    const updated = await client
      .from("garmentRfidCode")
      .update({
        externalCode,
        boundAt: now,
        boundBy: input.userId,
        updatedAt: now,
        updatedBy: input.userId
      })
      .eq("id", row.id)
      .eq("companyId", input.companyId);
    if (updated.error) return { error: updated.error, bound: 0 };
  }

  return { error: null, bound: systemRows.length };
}
