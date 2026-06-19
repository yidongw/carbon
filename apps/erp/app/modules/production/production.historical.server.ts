import type { Database } from "@carbon/database";
import { withIncludeDeleted } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as productionService from "./production.service";

export async function getJob(client: SupabaseClient<Database>, id: string) {
  return withIncludeDeleted(() => productionService.getJob(client, id));
}

export async function getJobByOperationId(
  client: SupabaseClient<Database>,
  operationId: string
) {
  return withIncludeDeleted(() =>
    productionService.getJobByOperationId(client, operationId)
  );
}

export async function getJobMakeMethodById(
  client: SupabaseClient<Database>,
  jobMakeMethodId: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    productionService.getJobMakeMethodById(client, jobMakeMethodId, companyId)
  );
}

export async function getRootMakeMethod(
  client: SupabaseClient<Database>,
  jobId: string,
  companyId: string
) {
  return withIncludeDeleted(() =>
    productionService.getRootMakeMethod(client, jobId, companyId)
  );
}

export async function getJobMethodTreeArray(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return withIncludeDeleted(() =>
    productionService.getJobMethodTreeArray(client, jobId)
  );
}

export async function getJobMethodTree(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return withIncludeDeleted(() =>
    productionService.getJobMethodTree(client, jobId)
  );
}

export async function getItemReplenishmentsForItems(
  client: SupabaseClient<Database>,
  companyId: string,
  itemIds: string[]
) {
  return withIncludeDeleted(async () =>
    client
      .from("itemReplenishment")
      .select(
        "itemId, leadTime, lotSize, manufacturingBlocked, purchasingBlocked, preferredSupplierId, requiresConfiguration, scrapPercentage, ...item(replenishmentSystem)"
      )
      .in("itemId", itemIds)
      .eq("companyId", companyId)
  );
}

export async function getJobMakeMethodsForJob(
  client: SupabaseClient<Database>,
  jobId: string
) {
  return withIncludeDeleted(async () =>
    client
      .from("jobMakeMethod")
      .select("*, ...item(itemType:type)")
      .eq("jobId", jobId)
      .order("createdAt", { ascending: true })
  );
}

export async function getItemWithModelUpload(
  client: SupabaseClient<Database>,
  itemId: string
) {
  return withIncludeDeleted(async () =>
    client
      .from("item")
      .select("*, modelUpload(thumbnailPath)")
      .eq("id", itemId)
      .single()
  );
}
