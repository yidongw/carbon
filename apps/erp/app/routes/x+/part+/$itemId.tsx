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
  Await,
  Outlet,
  redirect,
  useLoaderData,
  useParams
} from "react-router";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import type { PartSummary } from "~/modules/items";
import {
  getItemFiles,
  getMakeMethods,
  getPart,
  getPickMethods,
  getSupplierParts
} from "~/modules/items";
import {
  PartDetailsPageShell,
  PartPageHydrateFallback
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

  const supplierPartsPromise = getSupplierParts(client, itemId, companyId);
  const pickMethodsPromise = getPickMethods(client, itemId, companyId);
  const tagsPromise = getTagsList(client, companyId, "part");

  // Defer getPart so the route shell can render while summary data streams in.
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
    tags: tagsPromise.then((r) => r.data ?? [])
  };
}

export type PartLoaderData = ReturnType<typeof loader> extends Promise<infer T>
  ? T
  : never;

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

  const data = await serverLoader<typeof loader>();
  data.partSummary.then(() => setPartRouteCache(key, data));
  return data;
}

export function HydrateFallback() {
  return <PartPageHydrateFallback />;
}

function PartRouteLayout({
  data,
  partSummary
}: {
  data: Awaited<ReturnType<typeof loader>>;
  partSummary: PartSummary;
}) {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

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
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <PartHeader />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-grow overflow-hidden">
            <PanelProvider>
              <ResizablePanels
                explorer={
                  <PartExplorerPanel partSummary={partSummary} />
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
    </PartResolvedDataProvider>
  );
}

export default function PartRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<PartPageHydrateFallback />}>
      <Await resolve={data.partSummary}>
        {(partSummary) => (
          <PartRouteLayout data={data} partSummary={partSummary} />
        )}
      </Await>
    </Suspense>
  );
}
