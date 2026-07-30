import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  // Only require an authenticated employee; scope strictly to their company.
  const { companyId } = await requirePermissions(request, {});

  // Read with the service role so this works for every employee. `requiresConfiguration`
  // lives on `itemReplenishment`, whose RLS is gated by `parts_view` — production-only
  // users lack it, which would otherwise hide the style config-quantity trigger for them.
  // Only a company-scoped list of configurable itemIds is exposed (a benign flag).
  return await getCarbonServiceRole()
    .from("itemReplenishment")
    .select("itemId")
    .eq("requiresConfiguration", true)
    .eq("companyId", companyId);
}
