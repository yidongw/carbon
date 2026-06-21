import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { ProductionQuantitiesTable } from "~/modules/production/ui/ProductionQuantities";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters, setGenericQueryFilters } from "~/utils/query";

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

  let query = client
    .from("productionQuantityReport")
    .select(
      `
      *,
      employee:user!productionQuantityReport_employeeId_fkey(id, firstName, lastName, fullName),
      jobOperation!inner(
        id,
        description,
        jobId,
        job:jobId(jobId)
      )
    `,
      { count: "exact" }
    )
    .eq("companyId", companyId);

  if (search) {
    query = query.or(
      `notes.ilike.%${search}%,jobOperation.description.ilike.%${search}%`
    );
  }

  query = setGenericQueryFilters(query, { limit, offset, sorts, filters }, [
    { column: "createdAt", ascending: false }
  ]);

  const { data, count, error: queryError } = await query;

  if (queryError) {
    throw error(queryError, "Failed to fetch production quantities");
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
