import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { getCompanySettings } from "~/modules/settings";
import {
  getJob,
  getJobMaterialsWithQuantityOnHand,
  getMasterWorkOrder
} from "~/modules/production";
import { JobMaterialsTable } from "~/modules/production/ui/Jobs";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { masterWorkOrderId } = params;
  if (!masterWorkOrderId) throw new Error("Could not find masterWorkOrderId");

  const masterWorkOrder = await getMasterWorkOrder(
    client,
    masterWorkOrderId,
    companyId
  );
  if (masterWorkOrder.error || !masterWorkOrder.data?.jobId) {
    throw redirect(path.to.masterWorkOrders);
  }
  const jobId = masterWorkOrder.data.jobId;

  const searchParams = new URLSearchParams(new URL(request.url).search);
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const job = await getJob(client, jobId);
  const [materials, settings] = await Promise.all([
    getJobMaterialsWithQuantityOnHand(
      client,
      jobId,
      companyId,
      job.data?.locationId ?? "",
      { search: searchParams.get("search"), limit, offset, sorts, filters }
    ),
    getCompanySettings(client, companyId)
  ]);

  const inventoryShelfLife = settings.data?.inventoryShelfLife as {
    nearExpiryWarningDays?: number | null;
  } | null;

  return {
    materials: materials.data ?? [],
    count: materials.count ?? 0,
    jobId,
    jobStatus: masterWorkOrder.data.status ?? "",
    nearExpiryWarningDays: inventoryShelfLife?.nearExpiryWarningDays ?? null
  };
}

export default function MasterWorkOrderMaterialsRoute() {
  const { materials, count, jobId, jobStatus, nearExpiryWarningDays } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <JobMaterialsTable
        data={materials}
        count={count}
        jobId={jobId}
        jobStatus={jobStatus}
        nearExpiryWarningDays={nearExpiryWarningDays}
        disableNavigation
      />
    </VStack>
  );
}
