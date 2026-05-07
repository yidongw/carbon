import { requirePermissions } from "@carbon/auth/auth.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import { getTemplate } from "~/modules/items";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Templates`,
  to: path.to.templates,
  module: "items"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");

  const template = await getTemplate(client, templateId, companyId);
  if (template.error || !template.data) {
    throw new Response("Not found", { status: 404 });
  }

  return { template: template.data };
}

export default function TemplateLayoutRoute() {
  const { template } = useLoaderData<typeof loader>();

  return (
    <VStack spacing={3} className="p-4 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold">{template.name}</h1>
        {template.description ? (
          <p className="text-muted-foreground text-sm mt-1">
            {template.description}
          </p>
        ) : null}
      </div>
      <Outlet />
    </VStack>
  );
}
