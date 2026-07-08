import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useMount, VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { usePanels } from "~/components/Layout";
import {
  filterOperationsByIds,
  getJob,
  getJobOperations,
  getVisibleJobOperationIds
} from "~/modules/production";
import { JobOperationsTable } from "~/modules/production/ui/Jobs";

import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { jobId } = params;
  if (!jobId) throw new Error("Could not find jobId");

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const job = await getJob(client, jobId);
  if (job.error) {
    throw redirect(
      path.to.jobs,
      await flash(request, error(job.error, "Failed to fetch job"))
    );
  }

  const visibleOperationIds = await getVisibleJobOperationIds(client, {
    companyId: job.data.companyId,
    jobId
  });
  if (visibleOperationIds.error) {
    throw redirect(
      path.to.jobs,
      await flash(
        request,
        error(visibleOperationIds.error, "Failed to fetch visible operations")
      )
    );
  }

  const operations = await getJobOperations(client, jobId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (operations.error) {
    redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(operations.error, "Failed to fetch job operations")
      )
    );
  }

  const filteredOperations = filterOperationsByIds(
    operations.data ?? [],
    visibleOperationIds.data
  );

  return {
    count: filteredOperations.length,
    operations: filteredOperations
  };
}

export default function JobOperationsRoute() {
  const { count, operations } = useLoaderData<typeof loader>();

  const { setIsExplorerCollapsed } = usePanels();

  useMount(() => {
    setIsExplorerCollapsed(true);
  });

  return (
    <VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <JobOperationsTable data={operations} count={count} />
    </VStack>
  );
}
