import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
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

/** Company-wide paginated list of bundle work orders (for the list page). */
export async function getBundleWorkOrdersList(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: { search: string | null } & GenericQueryFilters
) {
  let query = client
    .from("bundleWorkOrders")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.or(
      `bundleNumber.ilike.%${args.search}%,itemName.ilike.%${args.search}%,colorCode.ilike.%${args.search}%,jobReadableId.ilike.%${args.search}%`
    );
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "createdAt", ascending: false }
    ]);
  }

  return query;
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
 * Process reports (Production / Rework / Scrap) filed against a bundle's backing
 * job, across all of its operations. Reuses the existing `productionQuantity`
 * data (a "process report" line), filtered by job via the operation join.
 */
export async function getBundleProcessReports(
  client: SupabaseClient<Database>,
  jobId: string,
  companyId: string
) {
  return client
    .from("productionQuantity")
    .select(
      "id, quantity, type, createdAt, jobOperation!inner(description, jobId), scrapReason(name)"
    )
    .eq("jobOperation.jobId", jobId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
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
    itemId: string;
    quantity: number;
    bundleNumber: string;
    sequence?: number;
    colorCode?: string | null;
    sizeCode?: string | null;
    configuration?: Record<string, unknown> | null;
    companyId: string;
    createdBy: string;
  }
) {
  // The child job is the bundle's execution backing; the bundle -> master link
  // is carried by bundleWorkOrder.masterWorkOrderId (the job table has no
  // parentJobId column), so we don't set one here. The bundle's configuration
  // (color/size cell) is carried onto the child job too.
  const job = await insertJob(client, {
    itemId: input.itemId,
    quantity: input.quantity,
    companyId: input.companyId,
    createdBy: input.createdBy,
    configuration: input.configuration ?? undefined
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
      configuration: (input.configuration ?? null) as never,
      companyId: input.companyId,
      createdBy: input.createdBy
    })
    .select("id, jobId")
    .single();
}
