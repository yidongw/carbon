import type { Database } from "@carbon/database";
// Side-effect import: installs the AsyncLocalStorage-backed soft-delete
// context. This file is server-only, so `node:async_hooks` never reaches the
// browser bundle.
import "@carbon/database/soft-delete.server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY } from "../../config/env";
import { getCarbonClient } from "./client";

export const getCarbonServiceRole = (
  deletedBy?: string | null
): SupabaseClient<Database> => {
  return getCarbonClient(SUPABASE_SERVICE_ROLE_KEY!, undefined, { deletedBy });
};
