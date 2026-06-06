import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
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

  // Cheap lookups that feed the toolbar/filters — keep them blocking so the
  // toolbar is interactive immediately.
  const [locations, tags] = await Promise.all([
    getLocationsList(client, companyId),
    getTagsList(client, companyId, "job")
  ]);

  // Defer the jobs query AND its row-derived enrichment queries as a single
  // bundle: the page navigates instantly and the whole table streams in once
  // ready. (The enrichment queries depend on the job rows, so they can't run
  // until jobs resolves — bundling keeps them off the critical path together.)
  const jobs = (async () => {
    const jobs = await getJobs(client, companyId, {
      search,
      limit,
      offset,
      sorts,
      filters
    });
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
        jobRows
          .map((job) => job.itemId)
          .filter((id): id is string => Boolean(id))
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
      trackedEntities,
      itemIdsWithConfigurationParameters,
      currentProcessByJobId
    };
  })();

  return {
    jobs,
    locations: locations.data ?? [],
    tags: tags.data ?? []
  };
}

export default function JobsRoute() {
  const { jobs, tags } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={jobs}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load jobs.</Trans>
            </div>
          }
        >
          {(jobs) => (
            <JobsTable
              data={jobs.jobs}
              count={jobs.count}
              tags={tags}
              trackedEntities={jobs.trackedEntities}
              itemIdsWithConfigurationParameters={
                jobs.itemIdsWithConfigurationParameters
              }
              currentProcessByJobId={jobs.currentProcessByJobId}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
