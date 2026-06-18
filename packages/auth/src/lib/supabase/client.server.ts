import type { Database } from "@carbon/database";
import { wrapSoftDeleteClient } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from "../../config/env";
import {
  getCarbonAPIKeyClient as createCarbonAPIKeyClient,
  getCarbonClient
} from "./client";

export const getCarbonServiceRole = (
  deletedBy?: string | null
): SupabaseClient<Database> => {
  return wrapSoftDeleteClient(getCarbonClient(SUPABASE_SERVICE_ROLE_KEY!), {
    deletedBy
  });
};

export const getCarbon = (
  accessToken?: string,
  deletedBy?: string | null
): SupabaseClient<Database, "public"> => {
  return wrapSoftDeleteClient(getCarbonClient(SUPABASE_ANON_KEY!, accessToken), {
    deletedBy
  });
};

export const getCarbonAPIKeyClient = (apiKey: string) => {
  return wrapSoftDeleteClient(createCarbonAPIKeyClient(apiKey));
};
