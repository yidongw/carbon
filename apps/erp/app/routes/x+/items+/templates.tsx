import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData } from "react-router";
import { getTemplatesList } from "~/modules/items";
import TemplatesTable from "~/modules/items/ui/Templates/TemplatesTable";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Templates`,
  to: path.to.templates
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const templates = await getTemplatesList(client, companyId);

  if (templates.error) {
    throw redirect(
      path.to.authenticatedRoot,
      await flash(request, error(templates.error, "Failed to fetch templates"))
    );
  }

  return {
    templates: templates.data ?? [],
    count: templates.data?.length ?? 0
  };
}

export default function TemplatesListRoute() {
  const { templates, count } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={0} className="h-full">
      <TemplatesTable data={templates} count={count} />
      <Outlet />
    </VStack>
  );
}
