import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { Menubar, Skeleton, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { lazy, Suspense } from "react";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs
} from "react-router";
import { Await, redirect, useParams } from "react-router";
import { DeferredFiles } from "~/components";
import { ExplorerSkeleton } from "~/components/Skeletons";
import { usePermissions, useRouteData } from "~/hooks";
import type { ItemFile, MakeMethod, PartSummary } from "~/modules/items";
import {
  itemManufacturingValidator,
  methodBindings,
  partConfigurationParametersBindings,
  partConfigurationRuleBindings,
  partValidator,
  upsertItemManufacturing,
  upsertPart
} from "~/modules/items";
import { ItemDocuments, ItemNotes } from "~/modules/items/ui/Item";
import ItemManufacturingForm from "~/modules/items/ui/Item/ItemManufacturingForm";
import MakeMethodTools from "~/modules/items/ui/Item/MakeMethodTools";
import type { PartDetailsData } from "./$itemId";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";
import { configurableItemsQuery, getCompanyId } from "~/utils/react-query";

const BillOfMaterial = lazy(
  () => import("~/modules/items/ui/Item/BillOfMaterial")
);
const BillOfProcess = lazy(
  () => import("~/modules/items/ui/Item/BillOfProcess")
);
const CadModel = lazy(() => import("~/components/CadModel"));
const ConfigurationParametersForm = lazy(
  () => import("~/modules/items/ui/Parts/ConfigurationParameters")
);
const ItemRiskRegister = lazy(
  () => import("~/modules/items/ui/Item/ItemRiskRegister")
);

function PartDetailsContent({
  detailsData,
  partData,
  itemId
}: {
  detailsData: PartDetailsData;
  partData: {
    partSummary: PartSummary;
    files: Promise<ItemFile[]>;
    makeMethods: Promise<PostgrestResponse<MakeMethod>>;
  };
  itemId: string;
}) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { methodData, tags } = detailsData;

  const manufacturingInitialValues = methodData?.partManufacturing
    ? {
        ...methodData.partManufacturing,
        lotSize: methodData.partManufacturing.lotSize ?? 0,
        ...getCustomFields(methodData.partManufacturing.customFields)
      }
    : null;

  const isManufactured = ["Make", "Buy and Make"].includes(
    partData.partSummary?.replenishmentSystem ?? ""
  );

  return (
    <>
      {permissions.is("employee") && methodData && isManufactured && (
        <>
          <Suspense fallback={<Menubar />}>
            <Await resolve={partData.makeMethods}>
              {(makeMethods) => (
                <MakeMethodTools
                  itemId={methodData.makeMethod.itemId}
                  makeMethods={makeMethods?.data ?? []}
                  type="Part"
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
            <Suspense fallback={<ExplorerSkeleton />}>
              <ConfigurationParametersForm
                key={`options:${itemId}`}
                bindings={partConfigurationParametersBindings(itemId)}
                parameters={
                  methodData.configurationParametersAndGroups.parameters
                }
                groups={methodData.configurationParametersAndGroups.groups}
              />
            </Suspense>
          )}
          <Suspense fallback={<ExplorerSkeleton />}>
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
              replenishmentSystem={partData.partSummary?.replenishmentSystem}
            />
          </Suspense>
          <Suspense fallback={<ExplorerSkeleton />}>
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
          </Suspense>
        </>
      )}
      {permissions.is("employee") && (
        <>
          <DeferredFiles resolve={partData.files}>
            {(resolvedFiles) => (
              <ItemDocuments
                files={resolvedFiles}
                itemId={itemId}
                modelUpload={partData.partSummary ?? undefined}
                type="Part"
              />
            )}
          </DeferredFiles>

          <Suspense
            fallback={
              <div className="p-4">
                <Skeleton className="h-48 w-full" />
              </div>
            }
          >
            <CadModel
              isReadOnly={!permissions.can("update", "parts")}
              metadata={{ itemId }}
              modelPath={partData.partSummary?.modelPath ?? null}
              title={t`CAD Model`}
            />
          </Suspense>
          <Suspense fallback={<ExplorerSkeleton />}>
            <ItemRiskRegister itemId={itemId} />
          </Suspense>
        </>
      )}
    </>
  );
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

    const updatePartManufacturing = await upsertItemManufacturing(client, {
      ...validation.data,
      requiresConfiguration: validation.data.requiresConfiguration ?? false,
      itemId,
      updatedBy: userId,
      customFields: setCustomFields(formData)
    });
    if (updatePartManufacturing.error) {
      throw redirect(
        path.to.part(itemId),
        await flash(
          request,
          error(
            updatePartManufacturing.error,
            "Failed to update part manufacturing"
          )
        )
      );
    }

    throw redirect(
      path.to.partDetails(itemId),
      await flash(request, success("Updated part manufacturing"))
    );
  }

  const validation = await validator(partValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePart = await upsertPart(client, {
    ...validation.data,
    id: itemId,
    customFields: setCustomFields(formData),
    updatedBy: userId
  });
  if (updatePart.error) {
    throw redirect(
      path.to.part(itemId),
      await flash(request, error(updatePart.error, "Failed to update part"))
    );
  }

  throw redirect(
    path.to.part(itemId),
    await flash(request, success("Updated part"))
  );
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  window.clientCache?.setQueryData(
    configurableItemsQuery(getCompanyId()).queryKey,
    null
  );
  return await serverAction();
}

export default function PartDetailsRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const permissions = usePermissions();

  const partData = useRouteData<{
    partSummary: PartSummary;
    files: Promise<ItemFile[]>;
    makeMethods: Promise<PostgrestResponse<MakeMethod>>;
    detailsData: Promise<PartDetailsData>;
  }>(path.to.part(itemId));

  if (!partData) throw new Error("Could not find part data");

  return (
    <VStack spacing={2} className="p-2">
      {permissions.is("employee") && (
        <ItemNotes
          id={partData.partSummary?.id ?? null}
          title={partData.partSummary?.name ?? ""}
          subTitle={partData.partSummary?.readableIdWithRevision ?? ""}
          notes={partData.partSummary?.notes as JSONContent}
        />
      )}
      <Suspense fallback={<ExplorerSkeleton />}>
        <Await resolve={partData.detailsData}>
          {(detailsData) => (
            <PartDetailsContent
              detailsData={detailsData}
              partData={partData}
              itemId={itemId}
            />
          )}
        </Await>
      </Suspense>
    </VStack>
  );
}
