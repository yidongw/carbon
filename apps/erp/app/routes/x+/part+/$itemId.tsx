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
  Skeleton,
  TabsList,
  TabsTrigger
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { Suspense, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import {
  Await,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
  useRevalidator
} from "react-router";
import { PartContentSkeleton } from "~/components/Skeletons";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import {
  PartDetailsPageShell,
  PartPageHydrateFallback
} from "~/modules/items/ui/Parts/PartDetailsSectionsShell";
import { flattenTree } from "~/components/TreeView";
import type { PartSummary } from "~/modules/items";
import {
  getItemFiles,
  getMakeMethodById,
  getMakeMethods,
  getMethodTree,
  getPart,
  getPartUsedIn,
  getPickMethods,
  getSupplierParts
} from "~/modules/items";
import { BoMActions, BoMExplorer } from "~/modules/items/ui/Item";
import type { UsedInNode } from "~/modules/items/ui/Item/UsedIn";
import { UsedInSkeleton, UsedInTree } from "~/modules/items/ui/Item/UsedIn";
import { PartHeader, PartProperties } from "~/modules/items/ui/Parts";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import {
  getPartRouteCache,
  onPartRouteCacheReady,
  setPartRouteCache
} from "~/utils/partRouteCache";
import { prefetchPartSiblingRoutes } from "~/utils/partSiblingPrefetch";
import {
  consumePartShell,
  createPartShellLoaderData,
  createPlaceholderPartSummary
} from "~/utils/partShell";

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

  const methodTree = getMakeMethods(client, itemId, companyId).then(
    async (makeMethods) => {
      const makeMethod = requestedMethodId
        ? (makeMethods.data?.find((m) => m.id === requestedMethodId) ??
          makeMethods.data?.find((m) => m.status === "Active") ??
          makeMethods.data?.[0])
        : (makeMethods.data?.find((m) => m.status === "Active") ??
          makeMethods.data?.[0]);
      if (!makeMethod) return null;

      const fullMethod = await getMakeMethodById(
        client,
        makeMethod.id,
        companyId
      );
      if (fullMethod.error || !fullMethod.data) return null;

      const tree = await getMethodTree(client, fullMethod.data.id);
      if (tree.error) return null;

      const methods = tree.data.length > 0 ? flattenTree(tree.data[0]) : [];

      return {
        makeMethod: fullMethod.data,
        methods
      };
    }
  );

  return {
    partSummary: partSummary.data,
    files: getItemFiles(client, itemId, companyId),
    supplierParts: getSupplierParts(client, itemId, companyId),
    pickMethods: getPickMethods(client, itemId, companyId),
    makeMethods: getMakeMethods(client, itemId, companyId),
    tags: getTagsList(client, companyId, "part"),
    usedIn: getPartUsedIn(client, itemId, companyId),
    methodTree
  };
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

  const shell = consumePartShell(key);
  if (shell) {
    serverLoader<typeof loader>().then((fresh) => setPartRouteCache(key, fresh));
    return createPartShellLoaderData(shell, { shell: true });
  }

  serverLoader<typeof loader>().then((fresh) => setPartRouteCache(key, fresh));
  return createPartShellLoaderData(createPlaceholderPartSummary(key), {
    placeholder: true
  });
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
      <div className="flex h-[50px] flex-shrink-0 items-center border-b px-4">
        <Skeleton className="h-6 w-24" />
      </div>
      <PartPageHydrateFallback />
    </div>
  );
}

export default function PartRoute() {
  const { t } = useLingui();
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const loaderData = useLoaderData<
    Awaited<ReturnType<typeof loader>> & {
      shell?: true;
      placeholder?: true;
    }
  >();
  const { partSummary, usedIn, methodTree } = loaderData;
  const revalidator = useRevalidator();
  const isShell = loaderData.shell === true;
  const isPlaceholder = loaderData.placeholder === true;

  useEffect(() => {
    if (!isShell && !isPlaceholder) return;
    return onPartRouteCacheReady(itemId, () => revalidator.revalidate());
  }, [itemId, isShell, isPlaceholder, revalidator]);

  useEffect(() => {
    if (isShell || isPlaceholder) return;

    const id =
      window.requestIdleCallback?.(() => prefetchPartSiblingRoutes(itemId), {
        timeout: 2000
      }) ?? window.setTimeout(() => prefetchPartSiblingRoutes(itemId), 500);

    return () => {
      if (typeof id === "number") {
        window.clearTimeout(id);
      } else {
        window.cancelIdleCallback?.(id);
      }
    };
  }, [itemId, isShell, isPlaceholder]);

  const isManufactured = partSummary?.replenishmentSystem !== "Buy";

  const [filterText, setFilterText] = useState("");

  return (
    <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
      <PartHeader />
      <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
        <div className="flex flex-grow overflow-hidden">
          <PanelProvider>
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
                                  revisions={partSummary?.revisions}
                                  itemReadableId={partSummary?.readableId ?? ""}
                                  itemReadableIdWithRevision={
                                    partSummary?.readableIdWithRevision ?? ""
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
                                revisions={partSummary?.revisions}
                                itemReadableId={partSummary?.readableId ?? ""}
                                itemReadableIdWithRevision={
                                  partSummary?.readableIdWithRevision ?? ""
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
                <Suspense fallback={<PartDetailsPageShell />}>
                  <Outlet />
                </Suspense>
              </div>
            }
            properties={<PartProperties key={itemId} />}
          />
          </PanelProvider>
        </div>
      </div>
    </div>
  );
}
