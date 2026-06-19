import type { Database } from "@carbon/database";
import { withIncludeDeleted } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getJobByOperationId(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const operation = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", operationId)
    .single();
  if (operation.error) return operation;
  return withIncludeDeleted(() =>
    client
      .from("jobs")
      .select("*, customer(name)")
      .eq("id", operation.data.jobId)
      .single()
  );
}
