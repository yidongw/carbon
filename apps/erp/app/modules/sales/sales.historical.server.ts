import type { Database } from "@carbon/database";
import { withIncludeDeleted } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as salesService from "./sales.service";

type CustomerResult = Awaited<ReturnType<typeof salesService.getCustomer>>;

export async function getCustomer(
  client: SupabaseClient<Database>,
  customerId: string,
  options?: { includeDeleted?: boolean }
): Promise<CustomerResult> {
  if (options?.includeDeleted) {
    return withIncludeDeleted(async () =>
      client.from("customer").select("*").eq("id", customerId).single()
    );
  }
  return salesService.getCustomer(client, customerId);
}

export async function getQuoteLinesList(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return withIncludeDeleted(() =>
    salesService.getQuoteLinesList(client, quoteId)
  );
}

export async function getQuoteMakeMethod(
  client: SupabaseClient<Database>,
  quoteMakeMethodId: string
) {
  return withIncludeDeleted(() =>
    salesService.getQuoteMakeMethod(client, quoteMakeMethodId)
  );
}

export async function getRootQuoteMakeMethod(
  client: SupabaseClient<Database>,
  quoteLineId: string
) {
  return withIncludeDeleted(() =>
    salesService.getRootQuoteMakeMethod(client, quoteLineId)
  );
}

export async function getQuoteMethodTreeArray(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return withIncludeDeleted(() =>
    salesService.getQuoteMethodTreeArray(client, quoteId)
  );
}

export async function getQuoteMethodTrees(
  client: SupabaseClient<Database>,
  quoteId: string
) {
  return withIncludeDeleted(() =>
    salesService.getQuoteMethodTrees(client, quoteId)
  );
}
