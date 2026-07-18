import { requirePermissions } from "@carbon/auth/auth.server";
import { useLingui } from "@lingui/react/macro";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { BundleScanPage } from "~/components/BundleScanPage";
import { getReleasedBundleWorkOrders } from "~/services/bundle.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {});
  const released = await getReleasedBundleWorkOrders(client, companyId);
  return {
    released: (released.data ?? []).filter(
      (b): b is typeof b & { id: string } => Boolean(b.id)
    )
  };
}

export default function PickupRoute() {
  const { released } = useLoaderData<typeof loader>();
  const { t } = useLingui();
  return (
    <BundleScanPage
      intent="pickup"
      title={t`Pickup Bundle Job`}
      description={t`Scan a bundle ticket to take the job and start working.`}
      releasedBundles={released}
    />
  );
}
