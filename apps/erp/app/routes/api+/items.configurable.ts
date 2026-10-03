import { requirePermissions } from "@carbon/auth/auth.server";
import { fetchAllFromTable } from "@carbon/database";
import type { LoaderFunctionArgs } from "react-router";

/**
 * Item ids that use the attribute qty grid (Style / Consumable variants).
 *
 * Query `for=methods` returns items with legacy `configurationParameter` rows
 * (Make Method get/save/configure). Default is attributes only — old Part
 * Part configuration parameters must not open the job Quantity grid.
 *
 * Both sources have many rows per item (one per attribute value / parameter), so
 * a plain `.select()` is capped at PostgREST `max_rows=1000` on production
 * companies and silently drops the newest items — e.g. a just-created style
 * wouldn't open the Quantity grid. Paginate so every configurable item is seen.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // Any authenticated employee — no parts_view required.
  const { client, companyId } = await requirePermissions(request, {});
  const forMethods = new URL(request.url).searchParams.get("for") === "methods";

  const result = await fetchAllFromTable<{ itemId: string }>(
    client,
    forMethods ? "configurationParameter" : "itemAttributeSelection",
    "itemId",
    (query) => query.eq("companyId", companyId)
  );
  if (result.error) return result;

  const data = Array.from(
    new Set((result.data ?? []).map((r) => r.itemId))
  ).map((itemId) => ({ itemId }));

  return { data, error: null };
}
