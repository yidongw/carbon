import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Any authenticated employee — no parts_view required.
  const { client, companyId } = await requirePermissions(request, {});

  // "Configurable" = the item actually has configuration parameters (color/size/…).
  // We read that from `configurationParameter`, whose RLS grants SELECT to any
  // employee (has_role('employee')). The older source — `itemReplenishment.requiresConfiguration`
  // — is gated by `parts_view`, so production-only users got zero rows and never
  // saw the config-quantity trigger. Reading the parameter table instead gives
  // every employee the correct answer under normal RLS (no service-role bypass),
  // and is the truer signal: the trigger should show exactly when there is
  // something to configure.
  const result = await client
    .from("configurationParameter")
    .select("itemId")
    .eq("companyId", companyId);

  if (result.error) return result;

  // A style has one parameter row per dimension (color, size, …); collapse to
  // the distinct set of configurable itemIds.
  const data = Array.from(new Set(result.data.map((r) => r.itemId))).map(
    (itemId) => ({ itemId })
  );

  return { data, error: null };
}
