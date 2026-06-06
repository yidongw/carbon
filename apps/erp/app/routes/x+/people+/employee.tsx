import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, Outlet, redirect, useLoaderData } from "react-router";
import { TableSkeleton } from "~/components/Skeletons";
import { getAttributeCategories, getPeople } from "~/modules/people";
import { PeopleTable } from "~/modules/people/ui/People";
import { getEmployeeTypes } from "~/modules/users";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "people",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("name");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  // Cheap lookups that feed the table's filters — keep them blocking.
  const [attributeCategories, employeeTypes] = await Promise.all([
    getAttributeCategories(client, companyId),
    getEmployeeTypes(client, companyId)
  ]);
  if (attributeCategories.error) {
    throw redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(attributeCategories.error, "Error loading attribute categories")
      )
    );
  }
  if (employeeTypes.error) {
    throw redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(employeeTypes.error, "Error loading employee types")
      )
    );
  }

  // Defer the heavy people query so the page renders instantly and rows stream
  // into the skeleton.
  const people = getPeople(client, companyId, {
    search,
    limit,
    offset,
    sorts,
    filters
  });

  return {
    attributeCategories: attributeCategories.data,
    employeeTypes: employeeTypes.data ?? [],
    people
  };
}

export default function ResourcesPeopleRoute() {
  const { attributeCategories, employeeTypes, people } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <Suspense fallback={<TableSkeleton />}>
        <Await
          resolve={people}
          errorElement={
            <div className="p-4 text-sm text-red-500">
              <Trans>Failed to load people.</Trans>
            </div>
          }
        >
          {(people) => (
            <PeopleTable
              attributeCategories={attributeCategories}
              data={people.data ?? []}
              count={people.count ?? 0}
              employeeTypes={employeeTypes}
            />
          )}
        </Await>
      </Suspense>
      <Outlet />
    </VStack>
  );
}
