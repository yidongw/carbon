import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { Menubar, Skeleton, VStack } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { lazy, Suspense } from "react";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import { redirect, useLoaderData, useParams } from "react-router";
import { DeferredFiles } from "~/components";
import { ExplorerSkeleton, PartContentSkeleton } from "~/components/Skeletons";
import { usePermissions, useRouteData } from "~/hooks";
import type { ItemFile, MakeMethod, PartSummary } from "~/modules/items";
import {
  getConfigurationParameters,
  getConfigurationRules,
  getItemManufacturing,
  getMakeMethods,
  getMethodMaterialsByMakeMethod,
  getMethodOperationsByMakeMethodId,
  itemManufacturingValidator,
  methodBindings,
  partConfigurationParametersBindings,
  partConfigurationRuleBindings,
  partValidator,
  upsertItemManufacturing,
  upsertPart
} from "~/modules/items";
import type { PartDetailsData } from "~/modules/items/ui/Parts/partDetails.types";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { getTagsList } from "~/modules/shared";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { path } from "~/utils/path";
import {
  getPartRouteCache,
  setPartRouteCache
} from "~/utils/partRouteCache";
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
const ItemDocuments = lazy(
  () => import("~/modules/items/ui/Item/ItemDocuments")
);
const ItemManufacturingForm = lazy(
  () => import("~/modules/items/ui/Item/ItemManufacturingForm")
);
const ItemNotes = lazy(() => import("~/modules/items/ui/Item/ItemNotes"));
const ItemRiskRegister = lazy(
  () => import("~/modules/items/ui/Item/ItemRiskRegister")
);
const MakeMethodTools = lazy(
  () => import("~/modules/items/ui/Item/MakeMethodTools")
);

function detailsCacheKey(itemId: string) {
  return `details:${itemId}`;
}

async function loadPartDetailsData(
  client: Parameters<typeof getMakeMethods>[0],
  itemId: string,
  companyId: string,
  requestedMethodId: string | null,
  makeMethodsData: Awaited<ReturnType<typeof getMakeMethods>>["data"]
): Promise<PartDetailsData> {
  const makeMethod = !makeMethodsData?.length
    ? null
    : requestedMethodId
      ? (makeMethodsData.find((m) => m.id === requestedMethodId) ??
        makeMethodsData.find((m) => m.status === "Active") ??
        makeMethodsData[0])
      : (makeMethodsData.find((m) => m.status === "Active") ??
        makeMethodsData[0]);

  if (!makeMethod) return { methodData: null, tags: [] };

  const [methodMaterials, methodOperations, tags, partManufacturing] =
    await Promise.all([
      getMethodMaterialsByMakeMethod(client, makeMethod.id),
      getMethodOperationsByMakeMethodId(client, makeMethod.id),
      getTagsList(client, companyId, "operation"),
      getItemManufacturing(client, itemId, companyId)
    ]);

  const configData = partManufacturing.data?.requiresConfiguration
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
      makeMethod,
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
      partManufacturing: partManufacturing.data,
      ...configData
    },
    tags: tags.data ?? []
  };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts"
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");

  const makeMethods = await getMakeMethods(client, itemId, companyId);
  const detailsData = await loadPartDetailsData(
    client,
    itemId,
    companyId,
    requestedMethodId,
    makeMethods.data
  );

  return {
    detailsData,
    makeMethods: makeMethods.data ?? []
  };
}

export async function clientLoader({
  serverLoader,
  params
}: ClientLoaderFunctionArgs) {
  const key = detailsCacheKey(params.itemId!);
  const hit = getPartRouteCache<Awaited<ReturnType<typeof loader>>>(key);
  if (hit) {
    serverLoader<typeof loader>().then((fresh) => setPartRouteCache(key, fresh));
    return hit;
  }
  const data = await serverLoader<typeof loader>();
  setPartRouteCache(key, data);
  return data;
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <PartContentSkeleton />;
}

function PartDetailsContent({
  detailsData,
  partData,
  makeMethods,
  itemId
}: {
  detailsData: PartDetailsData;
  partData: {
    partSummary: PartSummary;
    files: Promise<ItemFile[]>;
  };
  makeMethods: MakeMethod[];
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
            <MakeMethodTools
              itemId={methodData.makeMethod.itemId}
              makeMethods={makeMethods}
              type="Part"
              currentMethodId={methodData.makeMethod.id}
            />
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
              <Suspense fallback={<ExplorerSkeleton />}>
                <ItemDocuments
                  files={resolvedFiles}
                  itemId={itemId}
                  modelUpload={partData.partSummary ?? undefined}
                  type="Part"
                />
              </Suspense>
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
  const { detailsData, makeMethods } = useLoaderData<typeof loader>();

  const partData = useRouteData<{
    partSummary: PartSummary;
    files: Promise<ItemFile[]>;
  }>(path.to.part(itemId));

  if (!partData) throw new Error("Could not find part data");

  return (
    <VStack spacing={2} className="p-2">
      {permissions.is("employee") && (
        <Suspense fallback={<ExplorerSkeleton />}>
          <ItemNotes
            id={partData.partSummary?.id ?? null}
            title={partData.partSummary?.name ?? ""}
            subTitle={partData.partSummary?.readableIdWithRevision ?? ""}
            notes={partData.partSummary?.notes as JSONContent}
          />
        </Suspense>
      )}
      <PartDetailsContent
        detailsData={detailsData}
        partData={partData}
        makeMethods={makeMethods}
        itemId={itemId}
      />
    </VStack>
  );
}
