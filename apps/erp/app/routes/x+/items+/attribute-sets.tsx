import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getItemAttributeSets } from "~/modules/items/itemAttribute.service";
import { ItemAttributeSetsTable } from "~/modules/items/ui/ItemAttributeSets";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Attribute Sets`,
  to: path.to.itemAttributeSets
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const sets = await getItemAttributeSets(client, companyId, { search });
  if (sets.error) {
    throw redirect(
      path.to.items,
      await flash(request, error(null, "Error loading attribute sets"))
    );
  }

  return { sets: sets.data ?? [], count: sets.count ?? 0 };
}

export default function ItemAttributeSetsRoute() {
  const { sets, count } = useLoaderData<typeof loader>();
  return (
    <VStack spacing={0} className="h-full">
      <ItemAttributeSetsTable data={sets} count={count} />
      <Outlet />
    </VStack>
  );
}
