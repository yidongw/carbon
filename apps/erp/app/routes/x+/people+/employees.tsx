import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData, useLocation } from "react-router";
import { getAttributeCategories, getPeople } from "~/modules/people";
import { PeopleTable } from "~/modules/people/ui/People";
import { getEmployeeTypes } from "~/modules/users";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Employees`,
  to: path.to.people
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "people",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const pathname = url.pathname;
  const isEmployeesIndex = /\/employees\/?$/.test(pathname);

  if (!isEmployeesIndex) {
    return { isEmployeesIndex: false as const };
  }

  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("name");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [attributeCategories, people, employeeTypes] = await Promise.all([
    getAttributeCategories(client, companyId),
    getPeople(client, companyId, { search, limit, offset, sorts, filters }),
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
  if (people.error) {
    throw redirect(
      path.to.authenticatedRoot,
      await flash(request, error(people.error, "Error loading people"))
    );
  }

  return {
    isEmployeesIndex: true as const,
    attributeCategories: attributeCategories.data,
    employeeTypes: employeeTypes.data ?? [],
    people: people.data ?? [],
    count: people.count ?? 0
  };
}

export default function PeopleEmployeesRoute() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const isEmployeesIndex = /\/employees\/?$/.test(location.pathname);

  return (
    <VStack spacing={0} className="h-full">
      {isEmployeesIndex && data.isEmployeesIndex && (
        <PeopleTable
          attributeCategories={data.attributeCategories}
          data={data.people ?? []}
          count={data.count ?? 0}
          employeeTypes={data.employeeTypes}
        />
      )}
      <Outlet />
    </VStack>
  );
}
