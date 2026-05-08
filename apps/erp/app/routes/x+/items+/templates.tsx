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

  const templateRows = templates.data ?? [];
  const templateIds = templateRows.map((template) => template.id);

  const configurationParameterCounts = new Map<string, number>();
  const bomCounts = new Map<string, number>();
  const bopCounts = new Map<string, number>();

  if (templateIds.length > 0) {
    const [configurationParameters, templateMakeMethods] = await Promise.all([
      client
        .from("templateConfigurationParameter")
        .select("templateId")
        .in("templateId", templateIds)
        .eq("companyId", companyId),
      client
        .from("templateMakeMethod")
        .select("id, templateId")
        .in("templateId", templateIds)
        .eq("companyId", companyId)
    ]);

    for (const parameter of configurationParameters.data ?? []) {
      configurationParameterCounts.set(
        parameter.templateId,
        (configurationParameterCounts.get(parameter.templateId) ?? 0) + 1
      );
    }

    const methodRows = templateMakeMethods.data ?? [];
    const methodIds = methodRows.map((method) => method.id);
    const methodToTemplate = new Map(
      methodRows.map((method) => [method.id, method.templateId] as const)
    );

    if (methodIds.length > 0) {
      const [methodMaterials, methodOperations] = await Promise.all([
        client
          .from("templateMethodMaterial")
          .select("templateMakeMethodId")
          .in("templateMakeMethodId", methodIds)
          .eq("companyId", companyId),
        client
          .from("templateMethodOperation")
          .select("templateMakeMethodId")
          .in("templateMakeMethodId", methodIds)
          .eq("companyId", companyId)
      ]);

      for (const material of methodMaterials.data ?? []) {
        const templateId = methodToTemplate.get(material.templateMakeMethodId);
        if (!templateId) continue;
        bomCounts.set(templateId, (bomCounts.get(templateId) ?? 0) + 1);
      }

      for (const operation of methodOperations.data ?? []) {
        const templateId = methodToTemplate.get(operation.templateMakeMethodId);
        if (!templateId) continue;
        bopCounts.set(templateId, (bopCounts.get(templateId) ?? 0) + 1);
      }
    }
  }

  return {
    templates: templateRows.map((template) => ({
      ...template,
      configurationParameterCount:
        configurationParameterCounts.get(template.id) ?? 0,
      bomCount: bomCounts.get(template.id) ?? 0,
      bopCount: bopCounts.get(template.id) ?? 0
    })),
    count: templateRows.length
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
