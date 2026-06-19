import { withIncludeDeleted } from "@carbon/database/soft-delete";
import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as qualityService from "./quality.service";

export async function getIssueItems(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    qualityService.getIssueItems(client, id, companyId)
  );
}

export async function getIssueAssociations(
  client: SupabaseClient<Database>,
  nonConformanceId: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    qualityService.getIssueAssociations(client, nonConformanceId, companyId)
  );
}
