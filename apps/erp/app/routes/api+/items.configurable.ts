import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Any authenticated employee — no parts_view required.
  const { client, companyId } = await requirePermissions(request, {});

  // "Configurable" = the item has configuration parameters OR attribute
  // selections that synthesize a qty matrix. Prefer parameter / selection
  // tables over `itemReplenishment.requiresConfiguration` — that flag is gated
  // by parts_view and is no longer set for new Styles.
  const [params, selections] = await Promise.all([
    client
      .from("configurationParameter")
      .select("itemId")
      .eq("companyId", companyId),
    (client as any)
      .from("itemAttributeSelection")
      .select("itemId")
      .eq("companyId", companyId)
  ]);

  if (params.error) return params;
  if (selections.error) return selections;

  const data = Array.from(
    new Set([
      ...(params.data ?? []).map((r: { itemId: string }) => r.itemId),
      ...(selections.data ?? []).map((r: { itemId: string }) => r.itemId)
    ])
  ).map((itemId) => ({ itemId }));

  return { data, error: null };
}
