import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getPersistedSplitRowsForJob } from "./styleBundlePersistence.server";
import { hydratePendingSplitRows } from "./styleSplitRow.service";

export async function getPendingSplitSourceRows(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const { data, error } = await getPersistedSplitRowsForJob(args);

  if (error) {
    return { data: null, error };
  }

  return {
    data: hydratePendingSplitRows(data ?? []),
    error: null
  };
}
