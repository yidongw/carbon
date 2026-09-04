import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getPurchaseOrders } from "~/modules/purchasing";
import { PurchaseOrdersTable } from "~/modules/purchasing/ui/PurchaseOrder";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Orders`,
  to: path.to.purchaseOrders
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "purchasing",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const purchasOrders = await getPurchaseOrders(client, companyId, {
    search,
    status,
    supplierId,
    limit,
    offset,
    sorts,
    filters
  });

  if (purchasOrders.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(purchasOrders.error, "Failed to fetch purchase orders")
      )
    );
  }

  // Lowest enabled purchase-order approval tier. An order needs approval when
  // its total reaches this amount; null means no enabled rule → nothing needs
  // approval. Drives the per-row Approval badge (and mirrors isApprovalRequired).
  const approvalRules = await client
    .from("approvalRule")
    .select("lowerBoundAmount")
    .eq("companyId", companyId)
    .eq("documentType", "purchaseOrder")
    .eq("enabled", true);
  const lowerBounds = (approvalRules.data ?? []).map((r) =>
    Number(r.lowerBoundAmount ?? 0)
  );
  const approvalThreshold = lowerBounds.length
    ? Math.min(...lowerBounds)
    : null;

  return {
    count: purchasOrders.count ?? 0,
    purchasOrders: purchasOrders.data ?? [],
    approvalThreshold
  };
}

export default function PurchaseOrdersSearchRoute() {
  const { count, purchasOrders, approvalThreshold } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PurchaseOrdersTable
        data={purchasOrders}
        count={count}
        approvalThreshold={approvalThreshold}
      />
      <Outlet />
    </VStack>
  );
}
