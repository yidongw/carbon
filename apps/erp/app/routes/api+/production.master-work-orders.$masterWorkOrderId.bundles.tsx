import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  type BundleWorkOrder,
  getBundleWorkOrdersList,
  getMasterCuttingProgress,
  getMasterWorkOrder
} from "~/modules/production";

export type MasterWorkOrderBundlesOverlayLoaderData = {
  bundleWorkOrders: BundleWorkOrder[];
  count: number;
  masterDisplayId: string | null;
  masterWorkOrderId: string;
  // Pieces already cut but not yet placed in a bundle (cut − bundled). Drives
  // the overlay's "Split remaining" button; 0 hides it.
  remainingToSplit: number;
};

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<MasterWorkOrderBundlesOverlayLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) return null;

  const [master, bundleWorkOrders] = await Promise.all([
    getMasterWorkOrder(client, masterWorkOrderId, companyId),
    getBundleWorkOrdersList(client, companyId, {
      search: null,
      masterWorkOrderId
    })
  ]);

  const bundles = bundleWorkOrders.data ?? [];

  let remainingToSplit = 0;
  const m = master.data;
  if (m?.id && m.jobId) {
    const progress = await getMasterCuttingProgress(
      client,
      [{ id: m.id, jobId: m.jobId, itemId: m.itemId, quantity: m.quantity }],
      companyId
    );
    const cut = progress[m.id]?.reported ?? 0;
    const bundled = bundles.reduce((sum, b) => sum + (b.quantity ?? 0), 0);
    remainingToSplit = Math.max(0, cut - bundled);
  }

  return {
    bundleWorkOrders: bundles,
    count: bundleWorkOrders.count ?? 0,
    masterDisplayId: master.data?.jobReadableId ?? null,
    masterWorkOrderId,
    remainingToSplit
  };
}
