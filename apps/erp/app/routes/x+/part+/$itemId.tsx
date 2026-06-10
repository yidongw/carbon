import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useRouteData
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { Suspense, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { PartContentSkeleton } from "~/components/Skeletons";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs
} from "react-router";
import {
  Await,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useParams
} from "react-router";
import { ResizablePanels } from "~/components/Layout";
import { flattenTree } from "~/components/TreeView";
import type { ItemFile, PartSummary } from "~/modules/items";
import type { JSONContent } from "@carbon/react";
import {
  getConfigurationParameters,
  getConfigurationRules,
  getItemFiles,
  getItemManufacturing,
  getMakeMethods,
  getMethodMaterialsByMakeMethod,
  getMethodOperationsByMakeMethodId,
  getMethodTree,
  getPart,
  getPartUsedIn,
  getPickMethods,
  getSupplierParts
} from "~/modules/items";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { BoMActions, BoMExplorer } from "~/modules/items/ui/Item";
import type { UsedInNode } from "~/modules/items/ui/Item/UsedIn";
import { UsedInSkeleton, UsedInTree } from "~/modules/items/ui/Item/UsedIn";
import { PartHeader, PartProperties } from "~/modules/items/ui/Parts";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import {
  clearPartRouteCache,
  getPartRouteCache,
  setPartRouteCache
} from "~/utils/partRouteCache";

export const handle: Handle = {
  breadcrumb: msg`Parts`,
  to: path.to.parts,
  module: "items"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  // Start secondary queries immediately before awaiting only the primary record
  const supplierPartsPromise = getSupplierParts(client, itemId, companyId);
  const pickMethodsPromise = getPickMethods(client, itemId, companyId);
  const tagsPromise = getTagsList(client, companyId, "part");

  const partSummary = await getPart(client, itemId, companyId);

  if (partSummary.data?.companyId !== companyId) {
    throw redirect(path.to.items);
  }

  if (partSummary.error) {
    throw redirect(
      path.to.items,
      await flash(
        request,
        error(partSummary.error, "Failed to load part summary")
      )
    );
  }

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");

  // Single shared promise — used by both methodTree and the return value
  const makeMethodsPromise = getMakeMethods(client, itemId, companyId);

  const selectMakeMethod = (
    makeMethods: Awaited<ReturnType<typeof getMakeMethods>>
  ) => {
    if (!makeMethods.data?.length) return null;
    return requestedMethodId
      ? (makeMethods.data.find((m) => m.id === requestedMethodId) ??
          makeMethods.data.find((m) => m.status === "Active") ??
          makeMethods.data[0])
      : (makeMethods.data.find((m) => m.status === "Active") ??
          makeMethods.data[0]);
  };

  const methodTree = makeMethodsPromise.then(async (makeMethods) => {
    const makeMethod = selectMakeMethod(makeMethods);
    if (!makeMethod) return null;

    // getMakeMethodById was redundant — getMakeMethods already returns SELECT * for the same record
    const tree = await getMethodTree(client, makeMethod.id);
    if (tree.error) return null;

    const methods = tree.data.length > 0 ? flattenTree(tree.data[0]) : [];

    return {
      makeMethod,
      methods
    };
  });

  // Deferred — consumed by the details tab via <Await>, not blocking navigation.
  const detailsData = makeMethodsPromise.then(async (makeMethods) => {
    const makeMethod = selectMakeMethod(makeMethods);
    if (!makeMethod) return { methodData: null, tags: [] as { name: string }[] };

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
  });

  return {
    partSummary: partSummary.data,
    files: getItemFiles(client, itemId, companyId),
    supplierParts: supplierPartsPromise.then((r) => r.data ?? []),
    pickMethods: pickMethodsPromise.then((r) => r.data ?? []),
    makeMethods: makeMethodsPromise,
    tags: tagsPromise.then((r) => r.data ?? []),
    usedIn: getPartUsedIn(client, itemId, companyId),
    methodTree,
    detailsData
  };
}

export type PartDetailsData = Awaited<
  Awaited<ReturnType<typeof loader>>["detailsData"]
>;

// Clear cache on action-triggered revalidations so uploads/mutations show fresh data.
export function shouldRevalidate({
  actionStatus,
  currentParams,
  defaultShouldRevalidate
}: ShouldRevalidateFunctionArgs) {
  if (actionStatus !== undefined) {
    clearPartRouteCache(currentParams.itemId!);
  }
  return defaultShouldRevalidate;
}

export async function clientLoader({
  serverLoader,
  params
}: ClientLoaderFunctionArgs) {
  const key = params.itemId!;
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

function PartOutlet() {
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <PartContentSkeleton />;
  }

  return (
    <Suspense fallback={<PartContentSkeleton />}>
      <Outlet />
    </Suspense>
  );
}

export default function PartRoute() {
  const { t } = useLingui();
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const partData = useRouteData<{
    partSummary: PartSummary;
    files: Promise<ItemFile[]>;
  }>(path.to.part(itemId));

  if (!partData) throw new Error("Could not find part data");

  const { usedIn, methodTree } = useLoaderData<typeof loader>();

  const isManufactured = partData.partSummary?.replenishmentSystem !== "Buy";

  const [filterText, setFilterText] = useState("");

  return (
    <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
      <PartHeader />
      <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
        <div className="flex flex-grow overflow-hidden">
          <ResizablePanels
            explorer={
              <div className="flex flex-col h-full">
                {isManufactured ? (
                  <Tabs
                    defaultValue="manufacturing"
                    className="flex flex-col h-full"
                  >
                    <div className="px-2 pt-2 flex-shrink-0">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="manufacturing">
                          <Trans>Manufacturing</Trans>
                        </TabsTrigger>
                        <TabsTrigger value="used-in">
                          <Trans>Used In</Trans>
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
                      <InputGroup size="sm" className="flex flex-grow">
                        <InputLeftElement>
                          <LuSearch className="h-4 w-4" />
                        </InputLeftElement>
                        <Input
                          placeholder={t`Search...`}
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                        />
                      </InputGroup>
                      <Suspense fallback={null}>
                        <Await resolve={methodTree}>
                          {(resolved) =>
                            resolved ? (
                              <BoMActions
                                makeMethodId={resolved.makeMethod.id}
                              />
                            ) : null
                          }
                        </Await>
                      </Suspense>
                    </HStack>
                    <div className="flex-1 overflow-y-auto">
                      <TabsContent value="manufacturing">
                        <Suspense
                          fallback={
                            <div className="flex w-full items-center justify-center p-4">
                              <Spinner className="h-6 w-6" />
                            </div>
                          }
                        >
                          <Await resolve={methodTree}>
                            {(resolved) =>
                              resolved ? (
                                <div className="w-full p-2">
                                  <BoMExplorer
                                    itemType="Part"
                                    makeMethod={resolved.makeMethod}
                                    // @ts-ignore
                                    methods={resolved.methods}
                                    methodId={resolved.makeMethod.id}
                                    filterText={filterText}
                                    hideSearch
                                  />
                                </div>
                              ) : null
                            }
                          </Await>
                        </Suspense>
                      </TabsContent>
                      <TabsContent value="used-in">
                        <Suspense fallback={<UsedInSkeleton />}>
                          <Await resolve={usedIn}>
                            {(resolvedUsedIn) => {
                              const {
                                issues,
                                jobMaterials,
                                jobs,
                                maintenanceDispatchItems,
                                methodMaterials,
                                purchaseOrderLines,
                                receiptLines,
                                quoteLines,
                                quoteMaterials,
                                salesOrderLines,
                                shipmentLines,
                                supplierQuotes
                              } = resolvedUsedIn;

                              const tree: UsedInNode[] = [
                                {
                                  key: "issues",
                                  name: t`Issues`,
                                  module: "quality",
                                  children: issues
                                },
                                {
                                  key: "jobs",
                                  name: t`Jobs`,
                                  module: "production",
                                  children: jobs.map((job) => ({
                                    ...job,
                                    methodType: "Make to Order"
                                  }))
                                },
                                {
                                  key: "jobMaterials",
                                  name: t`Job Materials`,
                                  module: "production",
                                  children: jobMaterials
                                },
                                {
                                  key: "maintenanceDispatchItems",
                                  name: t`Maintenance`,
                                  module: "resources",
                                  children: maintenanceDispatchItems
                                },
                                {
                                  key: "methodMaterials",
                                  name: t`Method Materials`,
                                  module: "parts",
                                  // @ts-expect-error
                                  children: methodMaterials
                                },
                                {
                                  key: "purchaseOrderLines",
                                  name: t`Purchase Orders`,
                                  module: "purchasing",
                                  children: purchaseOrderLines.map((po) => ({
                                    ...po,
                                    methodType: "Purchase to Order"
                                  }))
                                },
                                {
                                  key: "receiptLines",
                                  name: t`Receipts`,
                                  module: "inventory",
                                  children: receiptLines.map((receipt) => ({
                                    ...receipt,
                                    methodType: "Pull from Inventory"
                                  }))
                                },
                                {
                                  key: "quoteLines",
                                  name: t`Quotes`,
                                  module: "sales",
                                  children: quoteLines
                                },
                                {
                                  key: "quoteMaterials",
                                  name: t`Quote Materials`,
                                  module: "sales",
                                  children: quoteMaterials?.map((qm) => ({
                                    ...qm,
                                    documentReadableId:
                                      qm.documentReadableId ?? ""
                                  }))
                                },
                                {
                                  key: "salesOrderLines",
                                  name: t`Sales Orders`,
                                  module: "sales",
                                  children: salesOrderLines
                                },
                                {
                                  key: "shipmentLines",
                                  name: t`Shipments`,
                                  module: "inventory",
                                  children: shipmentLines.map((shipment) => ({
                                    ...shipment,
                                    methodType: "Shipment"
                                  }))
                                },
                                {
                                  key: "supplierQuotes",
                                  name: t`Supplier Quotes`,
                                  module: "purchasing",
                                  children: supplierQuotes
                                }
                              ];

                              return (
                                <UsedInTree
                                  tree={tree}
                                  revisions={partData.partSummary?.revisions}
                                  itemReadableId={
                                    partData.partSummary?.readableId ?? ""
                                  }
                                  itemReadableIdWithRevision={
                                    partData.partSummary
                                      ?.readableIdWithRevision ?? ""
                                  }
                                  filterText={filterText}
                                  hideSearch
                                />
                              );
                            }}
                          </Await>
                        </Suspense>
                      </TabsContent>
                    </div>
                  </Tabs>
                ) : (
                  <>
                    <HStack className="w-full justify-between flex-shrink-0 p-2 pb-0">
                      <InputGroup size="sm" className="flex flex-grow">
                        <InputLeftElement>
                          <LuSearch className="h-4 w-4" />
                        </InputLeftElement>
                        <Input
                          placeholder={t`Search...`}
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                        />
                      </InputGroup>
                    </HStack>
                    <div className="flex-1 overflow-y-auto">
                      <Suspense fallback={<UsedInSkeleton />}>
                        <Await resolve={usedIn}>
                          {(resolvedUsedIn) => {
                            const {
                              issues,
                              jobMaterials,
                              jobs,
                              maintenanceDispatchItems,
                              methodMaterials,
                              purchaseOrderLines,
                              receiptLines,
                              quoteLines,
                              quoteMaterials,
                              salesOrderLines,
                              shipmentLines,
                              supplierQuotes
                            } = resolvedUsedIn;

                            const tree: UsedInNode[] = [
                              {
                                key: "issues",
                                name: t`Issues`,
                                module: "quality",
                                children: issues
                              },
                              {
                                key: "jobs",
                                name: t`Jobs`,
                                module: "production",
                                children: jobs.map((job) => ({
                                  ...job,
                                  methodType: "Make to Order"
                                }))
                              },
                              {
                                key: "jobMaterials",
                                name: t`Job Materials`,
                                module: "production",
                                children: jobMaterials
                              },
                              {
                                key: "maintenanceDispatchItems",
                                name: t`Maintenance`,
                                module: "resources",
                                children: maintenanceDispatchItems
                              },
                              {
                                key: "methodMaterials",
                                name: t`Method Materials`,
                                module: "parts",
                                // @ts-expect-error
                                children: methodMaterials
                              },
                              {
                                key: "purchaseOrderLines",
                                name: t`Purchase Orders`,
                                module: "purchasing",
                                children: purchaseOrderLines.map((po) => ({
                                  ...po,
                                  methodType: "Purchase to Order"
                                }))
                              },
                              {
                                key: "receiptLines",
                                name: t`Receipts`,
                                module: "inventory",
                                children: receiptLines.map((receipt) => ({
                                  ...receipt,
                                  methodType: "Pull from Inventory"
                                }))
                              },
                              {
                                key: "quoteLines",
                                name: t`Quotes`,
                                module: "sales",
                                children: quoteLines
                              },
                              {
                                key: "quoteMaterials",
                                name: t`Quote Materials`,
                                module: "sales",
                                children: quoteMaterials?.map((qm) => ({
                                  ...qm,
                                  documentReadableId:
                                    qm.documentReadableId ?? ""
                                }))
                              },
                              {
                                key: "salesOrderLines",
                                name: t`Sales Orders`,
                                module: "sales",
                                children: salesOrderLines
                              },
                              {
                                key: "shipmentLines",
                                name: t`Shipments`,
                                module: "inventory",
                                children: shipmentLines.map((shipment) => ({
                                  ...shipment,
                                  methodType: "Shipment"
                                }))
                              },
                              {
                                key: "supplierQuotes",
                                name: t`Supplier Quotes`,
                                module: "purchasing",
                                children: supplierQuotes
                              }
                            ];

                            return (
                              <UsedInTree
                                tree={tree}
                                revisions={partData.partSummary?.revisions}
                                itemReadableId={
                                  partData.partSummary?.readableId ?? ""
                                }
                                itemReadableIdWithRevision={
                                  partData.partSummary
                                    ?.readableIdWithRevision ?? ""
                                }
                                filterText={filterText}
                                hideSearch
                              />
                            );
                          }}
                        </Await>
                      </Suspense>
                    </div>
                  </>
                )}
              </div>
            }
            content={
              <div className="h-[calc(100dvh-99px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                <PartOutlet />
              </div>
            }
            properties={<PartProperties key={itemId} />}
          />
        </div>
      </div>
    </div>
  );
}
