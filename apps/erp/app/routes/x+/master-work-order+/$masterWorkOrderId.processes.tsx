import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getMasterProcessBreakdown } from "~/modules/production";
import MasterProcessesTable from "~/modules/production/ui/MasterWorkOrders/MasterProcessesTable";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");

  const processes = await getMasterProcessBreakdown(
    client,
    masterWorkOrderId,
    companyId
  );

  return { processes };
}

export default function MasterWorkOrderProcessesRoute() {
  const { processes } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <MasterProcessesTable data={processes} />
    </VStack>
  );
}
