import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getBundleWorkOrdersList,
  getMasterWorkOrder,
  type BundleWorkOrder
} from "~/modules/production";

export type MasterWorkOrderBundlesOverlayLoaderData = {
  bundleWorkOrders: BundleWorkOrder[];
  count: number;
  masterDisplayId: string | null;
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

  return {
    bundleWorkOrders: bundleWorkOrders.data ?? [],
    count: bundleWorkOrders.count ?? 0,
    masterDisplayId: master.data?.jobReadableId ?? null
  };
}
