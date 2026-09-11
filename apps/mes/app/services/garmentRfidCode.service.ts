import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

const STYLE_CARE_LABEL_OPERATION_TAG = "style:care-label-operation";

function getStyleStage(customFields: Json | null | undefined) {
  if (!customFields || typeof customFields !== "object") return null;
  const styleStage = (customFields as Record<string, unknown>).styleStage;
  return typeof styleStage === "string" ? styleStage : null;
}

function isStyleCareLabelOperation(operation: {
  tags?: string[] | null;
  customFields?: Json | null;
}) {
  const tags = operation.tags ?? [];
  return (
    tags.includes(STYLE_CARE_LABEL_OPERATION_TAG) ||
    getStyleStage(operation.customFields) === "care-label"
  );
}

function generateRfidCode(bundleReadableId: string, sequence: number): string {
  return `${bundleReadableId}-${String(sequence).padStart(3, "0")}`;
}

async function generateGarmentRfidCodesForBundles(
  client: SupabaseClient<Database>,
  input: {
    bundleWorkOrderIds: string[];
    companyId: string;
    createdBy: string;
  }
): Promise<{ error: Error | null; generated: number }> {
  const ids = Array.from(new Set(input.bundleWorkOrderIds.filter(Boolean)));
  if (ids.length === 0) return { error: null, generated: 0 };

  const bundles = await client
    .from("bundleWorkOrders")
    .select("id, quantity, jobReadableId")
    .eq("companyId", input.companyId)
    .in("id", ids);
  if (bundles.error) return { error: bundles.error, generated: 0 };

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

/** Mint RFID codes when MES finishes a「打印水洗唛」bundle operation. */
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
