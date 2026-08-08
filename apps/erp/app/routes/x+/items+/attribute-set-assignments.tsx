import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getItemAttributeSetAssignments } from "~/modules/items/itemAttribute.service";
import { ItemAttributeSetAssignmentsTable } from "~/modules/items/ui/ItemAttributeSetAssignments";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Item Attribute Sets`,
  to: path.to.itemAttributeSetAssignments
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const assignments = await getItemAttributeSetAssignments(client, companyId, {
    search
  });
  if (assignments.error) {
    throw redirect(
      path.to.items,
      await flash(request, error(null, "Error loading item attributes sets"))
    );
  }

  return {
    assignments: assignments.data ?? [],
    count: assignments.count ?? 0
  };
}

export default function ItemAttributeSetAssignmentsRoute() {
  const { assignments, count } = useLoaderData<typeof loader>();
  return (
    <VStack spacing={0} className="h-full">
      <ItemAttributeSetAssignmentsTable data={assignments} count={count} />
      <Outlet />
    </VStack>
  );
}
