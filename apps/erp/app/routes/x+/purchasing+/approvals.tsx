import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import PurchaseOrderApprovalsTable from "~/modules/purchasing/ui/PurchaseOrder/PurchaseOrderApprovalsTable";
import { getApprovalsAwaitingUser } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Approvals`,
  to: path.to.purchasingApprovals,
  module: "purchasing"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "purchasing",
    bypassRls: true
  });

  const approvals = await getApprovalsAwaitingUser(
    client,
    userId,
    companyId,
    "purchaseOrder"
  );

  return { approvals: approvals.data ?? [], count: approvals.count ?? 0 };
}

export default function PurchasingApprovalsRoute() {
  const { approvals, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PurchaseOrderApprovalsTable data={approvals} count={count} />
    </VStack>
  );
}
