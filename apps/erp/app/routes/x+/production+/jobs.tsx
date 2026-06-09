import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import {
  getCurrentProcessByJobIds,
  getItemIdsWithConfigurationParameters,
  getJobs,
  getTrackedEntitiesByJobMakeMethodIds
} from "~/modules/production";
import { JobsTable } from "~/modules/production/ui/Jobs";
import { getLocationsList } from "~/modules/resources";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Jobs`,
  to: path.to.jobs
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [jobs, locations, tags] = await Promise.all([
    getJobs(client, companyId, {
      search,
      limit,
      offset,
      sorts,
      filters
    }),
    getLocationsList(client, companyId),
    getTagsList(client, companyId, "job")
  ]);

  if (jobs.error) {
    redirect(
      path.to.productionDashboard,
      await flash(request, error(jobs.error, "Failed to fetch jobs"))
    );
  }

  const jobRows = jobs.data ?? [];
  const jobMakeMethodIds = [
    ...new Set(
      jobRows
        .map((job) => job.jobMakeMethodId)
        .filter((id): id is string => Boolean(id))
    )
  ];
  const itemIds = [
    ...new Set(
      jobRows.map((job) => job.itemId).filter((id): id is string => Boolean(id))
    )
  ];

  const [
    trackedEntities,
    itemIdsWithConfigurationParameters,
    currentProcessByJobId
  ] = await Promise.all([
    getTrackedEntitiesByJobMakeMethodIds(client, companyId, jobMakeMethodIds),
    getItemIdsWithConfigurationParameters(client, companyId, itemIds),
    getCurrentProcessByJobIds(client, jobRows)
  ]);

  return {
    count: jobs.count ?? 0,
    jobs: jobRows,
    locations: locations.data ?? [],
    tags: tags.data ?? [],
    trackedEntities,
    itemIdsWithConfigurationParameters,
    currentProcessByJobId
  };
}

export default function JobsRoute() {
  const {
    count,
    tags,
    jobs,
    trackedEntities,
    itemIdsWithConfigurationParameters,
    currentProcessByJobId
  } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <JobsTable
        data={jobs}
        count={count}
        tags={tags}
        trackedEntities={trackedEntities}
        itemIdsWithConfigurationParameters={itemIdsWithConfigurationParameters}
        currentProcessByJobId={currentProcessByJobId}
      />
      <Outlet />
    </VStack>
  );
}
