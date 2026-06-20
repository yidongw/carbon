import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getAttributeCategories, getPeople } from "~/modules/people";
import { PeopleTable } from "~/modules/people/ui/People";
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

  const [attributeCategories, people, departments] = await Promise.all([
    getAttributeCategories(client, companyId),
    getPeople(client, companyId, { search, limit, offset, sorts, filters }),
    client
      .from("employeeSummary")
      .select("id, departmentName")
      .eq("companyId", companyId)
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

  const departmentByEmployeeId = Object.fromEntries(
    (departments.data ?? []).map((d) => [d.id, d.departmentName])
  );

  return {
    attributeCategories: attributeCategories.data,
    departmentByEmployeeId,
    people: people.data ?? [],
    count: people.count ?? 0
  };
}

export default function ResourcesPeopleRoute() {
  const { attributeCategories, count, departmentByEmployeeId, people } =
    useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <PeopleTable
        attributeCategories={attributeCategories}
        data={people ?? []}
        count={count ?? 0}
        departmentByEmployeeId={departmentByEmployeeId}
      />
      <Outlet />
    </VStack>
  );
}
