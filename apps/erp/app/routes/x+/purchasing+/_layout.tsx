import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { GroupedContentSidebar } from "~/components/Layout";
import { CollapsibleSidebarProvider } from "~/components/Layout/Navigation";
import usePurchasingSubmodules from "~/modules/purchasing/ui/usePurchasingSubmodules";
import { getApprovalCountAwaitingUser } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Purchasing" }];
};

export const handle: Handle = {
  breadcrumb: msg`Purchasing`,
  to: path.to.purchasingDashboard,
  module: "purchasing"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "purchasing",
    bypassRls: true
  });

  const pendingApprovalCount = await getApprovalCountAwaitingUser(
    client,
    userId,
    companyId,
    "purchaseOrder"
  );

  return { pendingApprovalCount };
}

export default function UsersRoute() {
  const { pendingApprovalCount } = useLoaderData<typeof loader>();
  const { groups } = usePurchasingSubmodules(pendingApprovalCount);

  return (
    <CollapsibleSidebarProvider>
      <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] w-full h-full">
        <GroupedContentSidebar groups={groups} />
        <VStack spacing={0} className="h-full flex-1 min-h-0">
          <Outlet />
        </VStack>
      </div>
    </CollapsibleSidebarProvider>
  );
}
