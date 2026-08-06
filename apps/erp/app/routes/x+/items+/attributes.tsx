import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getItemAttributes } from "~/modules/items/itemAttribute.service";
import { ItemAttributesTable } from "~/modules/items/ui/ItemAttributes";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Attributes`,
  to: path.to.itemAttributes
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  const attributes = await getItemAttributes(client, companyId, { search });
  if (attributes.error) {
    throw redirect(
      path.to.items,
      await flash(request, error(null, "Error loading attributes"))
    );
  }

  return {
    attributes: attributes.data ?? [],
    count: attributes.count ?? 0
  };
}

export default function ItemAttributesRoute() {
  const { attributes, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <ItemAttributesTable data={attributes} count={count} />
      <Outlet />
    </VStack>
  );
}
