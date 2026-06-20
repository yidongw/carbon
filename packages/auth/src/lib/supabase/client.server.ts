import type { Database } from "@carbon/database";
import { wrapClient } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY } from "../../config/env";
import { getCarbonClient } from "./client";

export const getCarbonServiceRole = (
  options?: { includeDeleted?: boolean }
): SupabaseClient<Database> => {
  const client = getCarbonClient(SUPABASE_SERVICE_ROLE_KEY!);
  return wrapClient(client, options);
};
