import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { getCompanyJobOperationPickups } from "~/modules/production";
import { PickupsTable } from "~/modules/production/ui/Pickups";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Pickups`,
  to: path.to.pickups
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

  const pickups = await getCompanyJobOperationPickups(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  if (pickups.error) {
    throw error(pickups.error, "Failed to fetch production pickups");
  }

  return {
    count: pickups.count ?? 0,
    pickups:
      pickups.data?.map((pickup) => ({
        id: pickup.id,
        jobOperationId: pickup.jobOperationId,
        employeeId: pickup.employeeId,
        quantity: pickup.quantity,
        notes: pickup.notes,
        createdAt: pickup.createdAt,
        jobId: pickup.jobOperation?.jobId ?? null,
        jobIdFormatted: pickup.jobOperation?.job?.jobId ?? null,
        operationDescription: pickup.jobOperation?.description ?? null,
        employeeName:
          pickup.employee?.fullName ??
          [pickup.employee?.firstName, pickup.employee?.lastName]
            .filter(Boolean)
            .join(" ") ||
          null
      })) ?? []
  };
}

export default function PickupsRoute() {
  const { count, pickups } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PickupsTable data={pickups} count={count} />
      <Outlet />
    </VStack>
  );
}
