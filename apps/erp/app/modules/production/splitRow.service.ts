import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getBundleWorkOrders,
  insertBundleWorkOrder
} from "./bundleWorkOrder.service";
import { getMasterWorkOrder } from "./masterWorkOrder.service";
import type { SplitRowItem } from "./splitRow.models";

export type MasterWorkOrderSplitRow =
  Database["public"]["Tables"]["masterWorkOrderSplitRow"]["Row"];

/** All split rows for a master work order (pending first, then materialized). */
export async function getMasterWorkOrderSplitRows(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string,
  companyId: string
) {
  return client
    .from("masterWorkOrderSplitRow")
    .select("*")
    .eq("masterWorkOrderId", masterWorkOrderId)
    .eq("companyId", companyId)
    .order("createdAt", { ascending: true });
}

/**
 * Report cutting: replace the pending (not-yet-bundled) split rows for a master
 * work order with the supplied color/size/quantity rows. Rows already
 * materialized into bundles are left untouched.
 */
export async function replacePendingSplitRows(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    companyId: string;
    createdBy: string;
    rows: SplitRowItem[];
  }
) {
  const del = await client
    .from("masterWorkOrderSplitRow")
    .delete()
    .eq("masterWorkOrderId", input.masterWorkOrderId)
    .eq("companyId", input.companyId)
    .is("bundleWorkOrderId", null);
  if (del.error) return { data: null, error: del.error };

  if (input.rows.length === 0) {
    return { data: [], error: null };
  }

  return client
    .from("masterWorkOrderSplitRow")
    .insert(
      input.rows.map((row) => ({
        masterWorkOrderId: input.masterWorkOrderId,
        companyId: input.companyId,
        createdBy: input.createdBy,
        colorCode: row.colorCode ?? null,
        sizeCode: row.sizeCode ?? null,
        quantity: row.quantity
      }))
    )
    .select("id");
}

/**
 * Confirm the split: for each (edited) pending row, materialize a bundle work
 * order (with its child job) and link the row to it. Bundle numbers continue
 * from any existing bundles on the master.
 */
export async function confirmSplit(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    companyId: string;
    createdBy: string;
    rows: SplitRowItem[];
  }
) {
  const master = await getMasterWorkOrder(
    client,
    input.masterWorkOrderId,
    input.companyId
  );
  if (master.error || !master.data?.itemId) {
    return {
      data: null,
      error: master.error ?? new Error("Master work order not found")
    };
  }
  const itemId = master.data.itemId;
  const prefix = master.data.jobReadableId ?? "MWO";

  const existing = await getBundleWorkOrders(
    client,
    input.masterWorkOrderId,
    input.companyId
  );
  let sequence = existing.data?.length ?? 0;

  const created: { id: string; jobId: string }[] = [];
  for (const row of input.rows) {
    sequence += 1;
    const bundleNumber = `${prefix}-${String(sequence).padStart(2, "0")}`;
    const bundle = await insertBundleWorkOrder(client, {
      masterWorkOrderId: input.masterWorkOrderId,
      itemId,
      quantity: row.quantity,
      bundleNumber,
      sequence,
      colorCode: row.colorCode ?? null,
      sizeCode: row.sizeCode ?? null,
      companyId: input.companyId,
      createdBy: input.createdBy
    });
    if (bundle.error || !bundle.data) {
      return { data: null, error: bundle.error };
    }
    created.push(bundle.data);

    if (row.id) {
      await client
        .from("masterWorkOrderSplitRow")
        .update({
          bundleWorkOrderId: bundle.data.id,
          colorCode: row.colorCode ?? null,
          sizeCode: row.sizeCode ?? null,
          quantity: row.quantity,
          updatedBy: input.createdBy
        })
        .eq("id", row.id)
        .eq("companyId", input.companyId);
    }
  }

  return { data: created, error: null };
}
