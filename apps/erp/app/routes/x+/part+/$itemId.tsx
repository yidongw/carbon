import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { msg } from "@lingui/core/macro";
import { Suspense, useEffect } from "react";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs
} from "react-router";
import {
  Outlet,
  redirect,
  useLoaderData,
  useParams,
  useRevalidator
} from "react-router";
import { PartContentSkeleton } from "~/components/Skeletons";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import type { ItemFile, PartSummary } from "~/modules/items";
import {
  getItemFiles,
  getMakeMethods,
  getPart,
  getPickMethods,
  getSupplierParts
} from "~/modules/items";
import { PartDetailsPageShell } from "~/modules/items/ui/Parts/PartDetailsSectionsShell";
import PartExplorerPanel from "~/modules/items/ui/Parts/PartExplorerPanel";
import PartHeader from "~/modules/items/ui/Parts/PartHeader";
import PartProperties from "~/modules/items/ui/Parts/PartProperties";
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

  return {
    partSummary: partSummary.data,
    files: getItemFiles(client, itemId, companyId),
    supplierParts: supplierPartsPromise.then((r) => r.data ?? []),
    pickMethods: pickMethodsPromise.then((r) => r.data ?? []),
    makeMethods: getMakeMethods(client, itemId, companyId),
    tags: tagsPromise.then((r) => r.data ?? [])
  };
}

export type PartLoaderData = Awaited<ReturnType<typeof loader>>;

// Clear cache on action-triggered revalidations so uploads/mutations show fresh data.
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
    serverLoader<typeof loader>().then((fresh) => setPartRouteCache(key, fresh));
    return createPartShellLoaderData(shell, { shell: true });
  }

  // Render the shell immediately; hydrate with server data when it arrives.
  serverLoader<typeof loader>().then((fresh) => setPartRouteCache(key, fresh));
  return createPartShellLoaderData(createPlaceholderPartSummary(key), {
    placeholder: true
  });
}

clientLoader.hydrate = true;

export function HydrateFallback() {
  return <PartContentSkeleton />;
}

export default function PartRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const partData = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    const needsFreshData =
      ("shell" in partData && partData.shell) ||
      ("placeholder" in partData && partData.placeholder);
    if (!needsFreshData) return;

    return onPartRouteCacheReady(itemId, () => revalidator.revalidate());
  }, [itemId, partData, revalidator]);

  useEffect(() => {
    const needsFreshData =
      ("shell" in partData && partData.shell) ||
      ("placeholder" in partData && partData.placeholder);
    if (needsFreshData) return;

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
  }, [itemId, partData]);

  return (
    <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
      <PartHeader />
      <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
        <div className="flex flex-grow overflow-hidden">
          <PanelProvider>
          <ResizablePanels
            explorer={
              <PartExplorerPanel partSummary={partData.partSummary} />
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
