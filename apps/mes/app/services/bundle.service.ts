import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMasterWorkOrdersList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("masterWorkOrders")
    .select(
      "id, jobId, jobReadableId, readableIdWithRevision, itemName, quantity, status, assignee, dueDate, deadlineType, salesOrderReadableId, locationName"
    )
    .eq("companyId", companyId)
    .order("createdAt", { ascending: false });
}

export async function getBundleWorkOrdersList(
  client: SupabaseClient<Database>,
  companyId: string,
  masterWorkOrderId?: string
) {
  let query = client
    .from("bundleWorkOrders")
    .select(
      "id, jobId, jobReadableId, readableIdWithRevision, itemName, colorCode, colorName, sizeCode, sequence, quantity, status, assignee, assignedAt, masterWorkOrderId, processCount"
    )
    .eq("companyId", companyId);

  if (masterWorkOrderId) {
    query = query.eq("masterWorkOrderId", masterWorkOrderId);
  }

  return query
    .order("jobReadableId", { ascending: true })
    .order("sequence", { ascending: true });
}
