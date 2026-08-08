import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";

/**
 * Item ids that use the attribute qty grid (Style / Consumable variants).
 *
 * Query `for=methods` returns items with legacy `configurationParameter` rows
 * (Make Method get/save/configure). Default is attributes only — old Part
 * config params must not open the job Quantity grid.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // Any authenticated employee — no parts_view required.
  const { client, companyId } = await requirePermissions(request, {});
  const forMethods = new URL(request.url).searchParams.get("for") === "methods";

  if (forMethods) {
    const params = await client
      .from("configurationParameter")
      .select("itemId")
      .eq("companyId", companyId);
    if (params.error) return params;
    const data = Array.from(
      new Set((params.data ?? []).map((r) => r.itemId))
    ).map((itemId) => ({ itemId }));
    return { data, error: null };
  }

  const selections = await (client as any)
    .from("itemAttributeSelection")
    .select("itemId")
    .eq("companyId", companyId);
  if (selections.error) return selections;

  const data = Array.from(
    new Set(
      ((selections.data ?? []) as { itemId: string }[]).map((r) => r.itemId)
    )
  ).map((itemId) => ({ itemId }));

  return { data, error: null };
}
