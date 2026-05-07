import { requirePermissions } from "@carbon/auth/auth.server";
import type { JSONContent } from "@carbon/react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useParams } from "react-router";
import type { ConfigurationRule, MakeMethod } from "~/modules/items";
import {
  getTemplateConfigurationParameters,
  getTemplateConfigurationRules,
  getTemplateMakeMethodById,
  getTemplateMakeMethods,
  getTemplateMethodMaterialsByMakeMethod,
  getTemplateMethodOperationsByMakeMethodId,
  mapTemplateConfigurationParametersForForm,
  mapTemplateMethodOperationForBillOfProcess,
  templateConfigurationParametersBindings,
  templateConfigurationRuleBindings,
  templateMethodBindings
} from "~/modules/items";
import { BillOfMaterial, BillOfProcess } from "~/modules/items/ui/Item";
import { ConfigurationParametersForm } from "~/modules/items/ui/Parts";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { getTagsList } from "~/modules/shared";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");

  const makeMethods = await getTemplateMakeMethods(
    client,
    templateId,
    companyId
  );
  const makeMethod = requestedMethodId
    ? (makeMethods.data?.find((m) => m.id === requestedMethodId) ??
      makeMethods.data?.find((m) => m.status === "Draft") ??
      makeMethods.data?.[0])
    : (makeMethods.data?.find((m) => m.status === "Draft") ??
      makeMethods.data?.[0]);

  if (!makeMethod) {
    return {
      methodData: null,
      tags: []
    };
  }

  const fullMethod = await getTemplateMakeMethodById(
    client,
    makeMethod.id,
    companyId
  );
  if (fullMethod.error || !fullMethod.data) {
    return { methodData: null, tags: [] };
  }

  const [methodMaterials, methodOperations, tags, configParams, configRules] =
    await Promise.all([
      getTemplateMethodMaterialsByMakeMethod(client, fullMethod.data.id),
      getTemplateMethodOperationsByMakeMethodId(client, fullMethod.data.id),
      getTagsList(client, companyId, "operation"),
      getTemplateConfigurationParameters(client, templateId, companyId),
      getTemplateConfigurationRules(client, templateId, companyId)
    ]);

  const configurationRulesForUi = configRules.map((r) => ({
    ...r,
    itemId: templateId
  })) as ConfigurationRule[];

  const methodOperationsForUi =
    methodOperations.data?.map((operation: Record<string, unknown>) => {
      const mapped = mapTemplateMethodOperationForBillOfProcess(operation);
      return {
        ...mapped,
        workCenterId: mapped.workCenterId ?? undefined,
        operationSupplierProcessId:
          mapped.operationSupplierProcessId ?? undefined,
        workInstruction: mapped.workInstruction as JSONContent | null,
        tags: (mapped.tags ?? []) as string[]
      };
    }) ?? [];

  return {
    methodData: {
      makeMethod: fullMethod.data as unknown as MakeMethod,
      methodMaterials: (methodMaterials.data?.map((m) => ({
        ...m,
        makeMethodId: m.templateMakeMethodId,
        description: "",
        methodType: m.methodType as MethodType,
        itemType: m.itemType as MethodItemType,
        storageUnitIds: (m.storageUnitIds ?? {}) as Record<string, string>,
        methodOperationId: m.methodOperationId ?? undefined,
        item: {
          name: "",
          itemTrackingType: "Inventory" as const,
          replenishmentSystem: null
        }
      })) ?? []) as any,
      methodOperations: methodOperationsForUi as any,
      configurationParametersAndGroups: {
        groups: configParams.groups,
        parameters: mapTemplateConfigurationParametersForForm(
          configParams.parameters
        )
      },
      configurationRules: configurationRulesForUi
    },
    tags: tags.data ?? []
  };
}

export default function TemplateDetailsRoute() {
  const { templateId } = useParams();
  if (!templateId) throw new Error("Could not find templateId");

  const { methodData, tags } = useLoaderData<typeof loader>();

  if (!methodData) {
    return null;
  }

  const bindings = templateConfigurationParametersBindings(templateId);
  const methodBindings = templateMethodBindings();
  const configurationRuleBindings =
    templateConfigurationRuleBindings(templateId);

  return (
    <>
      <ConfigurationParametersForm
        key={`options:${templateId}`}
        bindings={bindings}
        parameters={methodData.configurationParametersAndGroups.parameters}
        groups={methodData.configurationParametersAndGroups.groups}
      />
      <BillOfMaterial
        key={`bom:${templateId}`}
        methodBindings={methodBindings}
        makeMethod={methodData.makeMethod}
        materials={methodData.methodMaterials ?? []}
        operations={methodData.methodOperations}
        configurable
        configurationRules={methodData.configurationRules}
        parameters={methodData.configurationParametersAndGroups.parameters}
        configurationRuleBindings={configurationRuleBindings}
      />
      <BillOfProcess
        key={`bop:${templateId}`}
        methodBindings={methodBindings}
        makeMethod={methodData.makeMethod}
        operations={methodData.methodOperations ?? []}
        configurable
        materials={methodData.methodMaterials ?? []}
        configurationRules={methodData.configurationRules}
        parameters={methodData.configurationParametersAndGroups.parameters}
        tags={tags}
        configurationRuleBindings={configurationRuleBindings}
      />
    </>
  );
}
