import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { ProductionQuantitiesTable } from "~/modules/production/ui/ProductionQuantities";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Production Quantities`,
  to: path.to.productionQuantities
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

  // Query production quantity reports directly from the database
  const query = client
    .from("productionQuantityReport")
    .select(
      `
      *,
      job:jobOperation!inner(
        jobId,
        job(jobId, itemId),
        description
      ),
      employee:employeeId(name)
    `,
      { count: "exact" }
    )
    .eq("companyId", companyId)
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query.or(
      `notes.ilike.%${search}%,job.jobId.ilike.%${search}%`,
      { referencedTable: "job" }
    );
  }

  const { data, count, error: queryError } = await query;

  if (queryError) {
    redirect(
      path.to.productionDashboard,
      await flash(
        request,
        error(queryError, "Failed to fetch production quantities")
      )
    );
  }

  return {
    count: count ?? 0,
    reports: data ?? []
  };
}

export default function ProductionQuantitiesRoute() {
  const { count, reports } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <ProductionQuantitiesTable data={reports} count={count} />
      <Outlet />
    </VStack>
  );
}
