import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { insertJob } from "./production.service";

export type BundleWorkOrder = NonNullable<
  Awaited<ReturnType<typeof getBundleWorkOrders>>["data"]
>[number];

/** All bundle work orders belonging to a master work order (ordered by sequence). */
export async function getBundleWorkOrders(
  client: SupabaseClient<Database>,
  masterWorkOrderId: string,
  companyId: string
) {
  return client
    .from("bundleWorkOrders")
    .select("*")
    .eq("masterWorkOrderId", masterWorkOrderId)
    .eq("companyId", companyId)
    .order("sequence", { ascending: true });
}

export async function getBundleWorkOrder(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("bundleWorkOrders")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

/**
 * Create a bundle work order under a master. A child job (parentJobId = the
 * master's backing job) is created through `insertJob` for downstream execution,
 * then wrapped by the bundle work order carrying the color/size identity.
 */
export async function insertBundleWorkOrder(
  client: SupabaseClient<Database>,
  input: {
    masterWorkOrderId: string;
    parentJobId: string;
    itemId: string;
    quantity: number;
    bundleNumber: string;
    sequence?: number;
    colorCode?: string | null;
    sizeCode?: string | null;
    companyId: string;
    createdBy: string;
  }
) {
  const job = await insertJob(client, {
    itemId: input.itemId,
    quantity: input.quantity,
    companyId: input.companyId,
    createdBy: input.createdBy,
    parentJobId: input.parentJobId
  });

  if (job.error || !job.data) {
    return { data: null, error: job.error };
  }

  return client
    .from("bundleWorkOrder")
    .insert({
      masterWorkOrderId: input.masterWorkOrderId,
      jobId: job.data.id,
      bundleNumber: input.bundleNumber,
      sequence: input.sequence ?? 1,
      colorCode: input.colorCode ?? null,
      sizeCode: input.sizeCode ?? null,
      companyId: input.companyId,
      createdBy: input.createdBy
    })
    .select("id, jobId")
    .single();
}
