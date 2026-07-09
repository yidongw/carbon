import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { insertJob } from "./production.service";

/**
 * Paginated list of master work orders, joined to their backing job + style item
 * via the `masterWorkOrders` view. Mirrors the `getJobs` pattern so the list UI
 * reuses the generic query-filter machinery.
 */
export async function getMasterWorkOrders(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: { search: string | null } & GenericQueryFilters
) {
  let query = client
    .from("masterWorkOrders")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.or(
      `jobReadableId.ilike.%${args.search}%,itemName.ilike.%${args.search}%,readableIdWithRevision.ilike.%${args.search}%`
    );
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "createdAt", ascending: false }
    ]);
  }

  return query;
}

export async function getMasterWorkOrder(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("masterWorkOrders")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

/**
 * Create a master work order for a Style item. The backing job is created
 * through the existing `insertJob` path (get-method + recalculate), and the
 * master work order row wraps it 1:1.
 */
export async function insertMasterWorkOrder(
  client: SupabaseClient<Database>,
  input: {
    itemId: string;
    quantity: number;
    companyId: string;
    createdBy: string;
    locationId?: string;
    dueDate?: string;
    colorSize?: Database["public"]["Tables"]["masterWorkOrder"]["Insert"]["colorSize"];
  }
) {
  const job = await insertJob(client, {
    itemId: input.itemId,
    quantity: input.quantity,
    companyId: input.companyId,
    createdBy: input.createdBy,
    locationId: input.locationId,
    dueDate: input.dueDate
  });

  if (job.error || !job.data) {
    return { data: null, error: job.error };
  }

  const masterWorkOrder = await client
    .from("masterWorkOrder")
    .insert({
      jobId: job.data.id,
      companyId: input.companyId,
      createdBy: input.createdBy,
      colorSize: input.colorSize ?? null
    })
    .select("id, jobId")
    .single();

  return masterWorkOrder;
}
