import type { Database } from "@carbon/database";
import { withIncludeDeleted } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as itemsService from "./items.service";

export async function getItem(
  client: SupabaseClient<Database>,
  itemId: string,
  options?: { includeDeleted?: boolean }
) {
  if (options?.includeDeleted) {
    return withIncludeDeleted(async () =>
      client.from("item").select("*").eq("id", itemId).single()
    );
  }
  return client.from("item").select("*").eq("id", itemId).single();
}

export async function getItemCost(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    itemsService.getItemCost(client, itemId, companyId)
  );
}

export async function getMaterialUsedIn(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    itemsService.getMaterialUsedIn(client, itemId, companyId)
  );
}

export async function getPartUsedIn(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    itemsService.getPartUsedIn(client, itemId, companyId)
  );
}
