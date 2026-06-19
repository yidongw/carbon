import type { Database } from "@carbon/database";
import { withIncludeDeleted } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";
import * as purchasingService from "./purchasing.service";

type SupplierResult = Awaited<ReturnType<typeof purchasingService.getSupplier>>;

export async function getSupplier(
  client: SupabaseClient<Database>,
  supplierId: string,
  options?: { includeDeleted?: boolean }
): Promise<SupplierResult> {
  if (options?.includeDeleted) {
    return withIncludeDeleted(async () =>
      client.from("supplier").select("*").eq("id", supplierId).single()
    );
  }
  return purchasingService.getSupplier(client, supplierId);
}
