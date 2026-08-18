import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { Menubar, VStack } from "@carbon/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { Suspense } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData, useParams } from "react-router";
import { DeferredFiles } from "~/components";
import { usePermissions, useRouteData } from "~/hooks";
import type { ConsumableSummary, ItemFile, MakeMethod } from "~/modules/items";
import {
  consumableValidator,
  getConfigurationParameters,
  getConfigurationRules,
  getItemManufacturing,
  getMakeMethodById,
  getMakeMethods,
  getMethodMaterialsByMakeMethod,
  getMethodOperationsByMakeMethodId,
  itemManufacturingValidator,
  methodBindings,
  partConfigurationParametersBindings,
  partConfigurationRuleBindings,
  upsertConsumable,
  upsertItemManufacturing
} from "~/modules/items";
import {
  BillOfMaterial,
  BillOfProcess,
  ItemDocuments,
  ItemNotes,
  ItemRiskRegister,
  MakeMethodTools
} from "~/modules/items/ui/Item";
import ItemManufacturingForm from "~/modules/items/ui/Item/ItemManufacturingForm";
import { ConfigurationParametersForm } from "~/modules/items/ui/Parts";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { getTagsList } from "~/modules/shared";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");

  const [makeMethods] = await Promise.all([
    getMakeMethods(client, itemId, companyId)
  ]);

  const makeMethod = requestedMethodId
    ? (makeMethods.data?.find((m) => m.id === requestedMethodId) ??
      makeMethods.data?.find((m) => m.status === "Active") ??
      makeMethods.data?.[0])
    : (makeMethods.data?.find((m) => m.status === "Active") ??
      makeMethods.data?.[0]);

  if (!makeMethod) {
    return { methodData: null, tags: [] };
  }

  const fullMethod = await getMakeMethodById(client, makeMethod.id, companyId);
  if (fullMethod.error || !fullMethod.data) {
    return { methodData: null, tags: [] };
  }

  const [methodMaterials, methodOperations, tags, consumableManufacturing] =
    await Promise.all([
      getMethodMaterialsByMakeMethod(client, fullMethod.data.id),
      getMethodOperationsByMakeMethodId(client, fullMethod.data.id),
      getTagsList(client, companyId, "operation"),
      getItemManufacturing(client, itemId, companyId)
    ]);

  const configData = consumableManufacturing.data?.requiresConfiguration
    ? {
        configurationParametersAndGroups: await getConfigurationParameters(
          client,
          itemId,
          companyId
        ),
        configurationRules: await getConfigurationRules(
          client,
          itemId,
          companyId
        )
      }
    : {
        configurationParametersAndGroups: { groups: [], parameters: [] },
        configurationRules: []
      };

  return {
    methodData: {
      makeMethod: fullMethod.data,
      methodMaterials:
        methodMaterials.data?.map((m) => ({
          ...m,
          description: m.item?.name ?? "",
          methodType: m.methodType as MethodType,
          itemType: m.itemType as MethodItemType
        })) ?? [],
      methodOperations:
        methodOperations.data?.map((operation) => ({
          ...operation,
          workCenterId: operation.workCenterId ?? undefined,
          operationSupplierProcessId:
            operation.operationSupplierProcessId ?? undefined,
          workInstruction: operation.workInstruction as JSONContent | null
        })) ?? [],
      partManufacturing: consumableManufacturing.data,
      ...configData
    },
    tags: tags.data ?? []
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "manufacturing") {
    const validation = await validator(itemManufacturingValidator).validate(
      formData
    );

    if (validation.error) {
      console.error(validation.error);
      return validationError(validation.error);
    }

    const updateConsumableManufacturing = await upsertItemManufacturing(
      client,
      {
        ...validation.data,
        requiresConfiguration: validation.data.requiresConfiguration ?? false,
        itemId,
        updatedBy: userId,
        customFields: setCustomFields(formData)
      }
    );
    if (updateConsumableManufacturing.error) {
      throw redirect(
        path.to.consumable(itemId),
        await flash(
          request,
          error(
            updateConsumableManufacturing.error,
            "Failed to update consumable manufacturing"
          )
        )
      );
    }

    throw redirect(
      path.to.consumableDetails(itemId),
      await flash(request, success("Updated consumable manufacturing"))
    );
  }

  const validation = await validator(consumableValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateConsumable = await upsertConsumable(client, {
    ...validation.data,
    id: itemId,
    customFields: setCustomFields(formData),
    updatedBy: userId
  });
  if (updateConsumable.error) {
    throw redirect(
      path.to.consumable(itemId),
      await flash(
        request,
        error(updateConsumable.error, "Failed to update consumable")
      )
    );
  }

  throw redirect(
    path.to.consumable(itemId),
    await flash(request, success("Updated consumable"))
  );
}

export default function ConsumableDetailsRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const permissions = usePermissions();
  const { methodData, tags } = useLoaderData<typeof loader>();

  const consumableData = useRouteData<{
    consumableSummary: ConsumableSummary;
    files: Promise<ItemFile[]>;
    makeMethods: Promise<PostgrestResponse<MakeMethod>>;
  }>(path.to.consumable(itemId));

  if (!consumableData) throw new Error("Could not find consumable data");

  const manufacturingInitialValues = methodData?.partManufacturing
    ? {
        ...methodData.partManufacturing,
        lotSize: methodData.partManufacturing.lotSize ?? 0,
        ...getCustomFields(methodData.partManufacturing.customFields)
      }
    : null;

  return (
    <VStack spacing={2} className="p-2">
      <ItemNotes
        id={consumableData.consumableSummary?.id ?? null}
        title={consumableData.consumableSummary?.name ?? ""}
        subTitle={
          consumableData.consumableSummary?.readableIdWithRevision ?? ""
        }
        notes={consumableData.consumableSummary?.notes as JSONContent}
      />
      {permissions.is("employee") &&
        methodData &&
        ["Make", "Buy and Make"].includes(
          consumableData.consumableSummary?.replenishmentSystem ?? ""
        ) && (
          <>
            <Suspense fallback={<Menubar />}>
              <Await resolve={consumableData?.makeMethods}>
                {(makeMethods) => (
                  <MakeMethodTools
                    itemId={methodData.makeMethod.itemId}
                    makeMethods={makeMethods?.data ?? []}
                    type="Consumable"
                    currentMethodId={methodData.makeMethod.id}
                  />
                )}
              </Await>
            </Suspense>
            {manufacturingInitialValues && (
              <ItemManufacturingForm
                key={itemId}
                // @ts-ignore
                initialValues={manufacturingInitialValues}
              />
            )}
            {methodData.partManufacturing?.requiresConfiguration && (
              <ConfigurationParametersForm
                key={`options:${itemId}`}
                bindings={partConfigurationParametersBindings(itemId)}
                parameters={
                  methodData.configurationParametersAndGroups.parameters
                }
                groups={methodData.configurationParametersAndGroups.groups}
              />
            )}
            <BillOfMaterial
              key={`bom:${itemId}`}
              methodBindings={methodBindings(itemId)}
              configurationRuleBindings={partConfigurationRuleBindings(itemId)}
              makeMethod={methodData.makeMethod}
              // @ts-ignore
              materials={methodData.methodMaterials ?? []}
              // @ts-ignore
              operations={methodData.methodOperations}
              configurable={methodData.partManufacturing?.requiresConfiguration}
              configurationRules={methodData.configurationRules}
              parameters={
                methodData.configurationParametersAndGroups.parameters
              }
              replenishmentSystem={
                consumableData.consumableSummary?.replenishmentSystem
              }
            />
            <BillOfProcess
              key={`bop:${itemId}`}
              methodBindings={methodBindings(itemId)}
              configurationRuleBindings={partConfigurationRuleBindings(itemId)}
              makeMethod={methodData.makeMethod}
              // @ts-ignore
              operations={methodData.methodOperations ?? []}
              configurable={methodData.partManufacturing?.requiresConfiguration}
              // @ts-ignore
              materials={methodData.methodMaterials ?? []}
              configurationRules={methodData.configurationRules}
              parameters={
                methodData.configurationParametersAndGroups.parameters
              }
              tags={tags}
            />
          </>
        )}
      {permissions.is("employee") && (
        <>
          <DeferredFiles resolve={consumableData?.files}>
            {(resolvedFiles) => (
              <ItemDocuments
                files={resolvedFiles}
                itemId={itemId}
                type="Consumable"
              />
            )}
          </DeferredFiles>

          <ItemRiskRegister itemId={itemId} />
        </>
      )}
    </VStack>
  );
}
