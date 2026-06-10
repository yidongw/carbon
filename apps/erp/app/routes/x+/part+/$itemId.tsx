import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { Skeleton } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Suspense, useEffect } from "react";
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
  useParams,
  useRevalidator
} from "react-router";
import type { PartSummary } from "~/modules/items";
import {
  createPartUsedInGroupPromises,
  getPartMethodTree
} from "~/modules/items/partUsedIn.server";
import {
  getItemFiles,
  getMakeMethods,
  getPart,
  getPickMethods,
  getSupplierParts
} from "~/modules/items";
import { UsedInSkeleton } from "~/modules/items/ui/Item/UsedIn";
import {
  PartDetailsPageShell,
  PartDetailsSectionsShell
} from "~/modules/items/ui/Parts/PartDetailsSectionsShell";
import PartExplorerPanel from "~/modules/items/ui/Parts/PartExplorerPanel";
import PartHeader from "~/modules/items/ui/Parts/PartHeader";
import PartProperties from "~/modules/items/ui/Parts/PartProperties";
import {
  PartResolvedDataProvider,
  type ResolvedPartRouteData
} from "~/modules/items/ui/Parts/PartResolvedDataContext";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import {
  clearPartRouteCache,
  getPartRouteCache,
  onPartRouteCacheReady,
  setPartRouteCache
} from "~/utils/partRouteCache";
import { prefetchPartSiblingRoutes } from "~/utils/partSiblingPrefetch";
import { consumePartShell, createPartShellLoaderData } from "~/utils/partShell";

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

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");

  const supplierPartsPromise = getSupplierParts(client, itemId, companyId);
  const pickMethodsPromise = getPickMethods(client, itemId, companyId);
  const tagsPromise = getTagsList(client, companyId, "part");
  const usedInGroups = createPartUsedInGroupPromises(client, itemId, companyId);
  const methodTree = getPartMethodTree(
    client,
    itemId,
    companyId,
    requestedMethodId
  );

  const partSummary = getPart(client, itemId, companyId).then(
    async (result) => {
      if (result.data?.companyId !== companyId) {
        throw redirect(path.to.items);
      }
      if (result.error) {
        throw redirect(
          path.to.items,
          await flash(
            request,
            error(result.error, "Failed to load part summary")
          )
        );
      }
      return result.data;
    }
  );

  return {
    partSummary,
    files: getItemFiles(client, itemId, companyId),
    supplierParts: supplierPartsPromise.then((r) => r.data ?? []),
    pickMethods: pickMethodsPromise.then((r) => r.data ?? []),
    makeMethods: getMakeMethods(client, itemId, companyId),
    tags: tagsPromise.then((r) => r.data ?? []),
    usedInGroups,
    methodTree
  };
}

export function shouldRevalidate({
  actionStatus,
  currentParams,
  defaultShouldRevalidate
}: ShouldRevalidateFunctionArgs) {
  if (actionStatus !== undefined) {
    const itemId = currentParams.itemId!;
    clearPartRouteCache(itemId);
    clearPartRouteCache(`details:${itemId}`);
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

  const shell = consumePartShell(key);
  if (shell) {
    serverLoader<typeof loader>()
      .then((fresh) => setPartRouteCache(key, fresh))
      .catch(() => clearPartRouteCache(key));
    return createPartShellLoaderData(shell, { shell: true });
  }

  const data = await serverLoader<typeof loader>();
  data.partSummary.then(() => setPartRouteCache(key, data));
  return data;
}

function PartPanelsLayout({
  explorer,
  content,
  properties
}: {
  explorer: React.ReactNode;
  content: React.ReactNode;
  properties: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 overflow-hidden w-full">
      <div className="flex w-72 flex-shrink-0 flex-col overflow-y-auto border-r bg-card shadow-lg">
        {explorer}
      </div>
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {content}
      </div>
      <div className="flex w-80 flex-shrink-0 flex-col overflow-y-auto border-l bg-card">
        {properties}
      </div>
    </div>
  );
}

function PartHeaderSkeleton() {
  return (
    <div className="flex h-[50px] flex-shrink-0 items-center border-b bg-card px-4">
      <Skeleton className="h-6 w-24" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

function PartPageSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden w-full">
      <PartHeaderSkeleton />
      <div className="flex min-h-0 flex-1 overflow-hidden w-full">
      <PartPanelsLayout
        explorer={
          <div className="p-2">
            <Skeleton className="mb-2 h-8 w-full" />
            <UsedInSkeleton />
          </div>
        }
        content={
          <div className="h-full min-h-0 overflow-y-auto w-full">
            <PartDetailsPageShell />
          </div>
        }
        properties={
          <div className="p-4">
            <PartDetailsSectionsShell />
          </div>
        }
      />
      </div>
    </div>
  );
}

function PartShellRefresh({
  itemId,
  isShell
}: {
  itemId: string;
  isShell: boolean;
}) {
  const revalidator = useRevalidator();

  useEffect(() => {
    if (!isShell) return;
    return onPartRouteCacheReady(itemId, () => {
      revalidator.revalidate();
    });
  }, [isShell, itemId, revalidator]);

  return null;
}

function PartRouteLoaded({
  data,
  partSummary,
  itemId,
  isShell = false
}: {
  data: Awaited<ReturnType<typeof loader>>;
  partSummary: PartSummary;
  itemId: string;
  isShell?: boolean;
}) {
  const resolved: ResolvedPartRouteData = {
    partSummary,
    files: data.files,
    supplierParts: data.supplierParts,
    pickMethods: data.pickMethods,
    makeMethods: data.makeMethods,
    tags: data.tags
  };

  useEffect(() => {
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
  }, [itemId]);

  return (
    <PartResolvedDataProvider value={resolved}>
      <PartShellRefresh itemId={itemId} isShell={isShell} />
      <div className="flex h-full min-h-0 flex-col overflow-hidden w-full">
        <PartHeader />
        <div className="flex min-h-0 flex-1 overflow-hidden w-full">
          <PartPanelsLayout
            explorer={
              <PartExplorerPanel
                usedInGroups={data.usedInGroups}
                methodTree={data.methodTree}
                partSummary={Promise.resolve(partSummary)}
              />
            }
            content={
              <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full min-h-0 overflow-y-auto w-full">
                <Suspense fallback={<PartDetailsPageShell />}>
                  <Outlet />
                </Suspense>
              </div>
            }
            properties={<PartProperties key={itemId} />}
          />
        </div>
      </div>
    </PartResolvedDataProvider>
  );
}

export default function PartRoute() {
  const data = useLoaderData<typeof loader>() as Awaited<
    ReturnType<typeof loader>
  > & { shell?: true };
  const navigation = useNavigation();
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  if (navigation.state === "loading") {
    return <PartPageSkeleton />;
  }

  return (
    <Suspense fallback={<PartPageSkeleton />}>
      <Await resolve={data.partSummary}>
        {(partSummary) => (
          <PartRouteLoaded
            data={data}
            partSummary={partSummary}
            itemId={itemId}
            isShell={data.shell === true}
          />
        )}
      </Await>
    </Suspense>
  );
}
