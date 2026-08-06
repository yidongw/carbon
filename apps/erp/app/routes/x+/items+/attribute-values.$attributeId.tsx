import { error, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import {
  getItemAttribute,
  getItemAttributeValues
} from "~/modules/items/itemAttribute.service";
import { ItemAttributeValuesTable } from "~/modules/items/ui/ItemAttributes";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Attribute Values`,
  to: path.to.itemAttributes
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    role: "employee"
  });

  const { attributeId } = params;
  if (!attributeId) throw notFound("attributeId not found");

  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  const [attribute, values] = await Promise.all([
    getItemAttribute(client, attributeId),
    getItemAttributeValues(client, attributeId, companyId, { search })
  ]);

  if (attribute.error || !attribute.data) {
    throw redirect(
      path.to.itemAttributes,
      await flash(request, error(attribute.error, "Attribute not found"))
    );
  }

  if (values.error) {
    throw redirect(
      path.to.itemAttributes,
      await flash(
        request,
        error(values.error, "Error loading attribute values")
      )
    );
  }

  return {
    attribute: attribute.data,
    values: values.data ?? [],
    count: values.count ?? 0
  };
}

export default function ItemAttributeValuesRoute() {
  const { attribute, values, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <ItemAttributeValuesTable
        attributeId={attribute.id}
        attributeName={attribute.name}
        data={values}
        count={count}
      />
      <Outlet />
    </VStack>
  );
}
