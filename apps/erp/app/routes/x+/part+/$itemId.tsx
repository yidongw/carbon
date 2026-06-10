import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { useRouteData } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { lazy, Suspense } from "react";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs
} from "react-router";
import { Outlet, redirect, useParams } from "react-router";
import { PartContentSkeleton } from "~/components/Skeletons";
import { ResizablePanels } from "~/components/Layout";
import type { ItemFile, PartSummary } from "~/modules/items";
import {
  getItemFiles,
  getPart,
  getPickMethods,
  getSupplierParts
} from "~/modules/items";
import { PartHeader } from "~/modules/items/ui/Parts/PartHeader";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import {
  clearPartRouteCache,
  getPartRouteCache,
  setPartRouteCache
} from "~/utils/partRouteCache";
const PartExplorerPanel = lazy(
  () => import("~/modules/items/ui/Parts/PartExplorerPanel")
);
const PartProperties = lazy(
  () => import("~/modules/items/ui/Parts/PartProperties")
);

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

export default function PartRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const partData = useRouteData<{
    partSummary: PartSummary;
    files: Promise<ItemFile[]>;
  }>(path.to.part(itemId));

  if (!partData) throw new Error("Could not find part data");

  return (
    <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
      <PartHeader />
      <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
        <div className="flex flex-grow overflow-hidden">
          <ResizablePanels
            explorer={
              <Suspense
                fallback={
                  <div className="flex w-full items-center justify-center p-8">
                    <PartContentSkeleton />
                  </div>
                }
              >
                <PartExplorerPanel partSummary={partData.partSummary} />
              </Suspense>
            }
            content={
              <div className="h-[calc(100dvh-99px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                <Suspense fallback={<PartContentSkeleton />}>
                  <Outlet />
                </Suspense>
              </div>
            }
            properties={
              <Suspense fallback={<PartContentSkeleton />}>
                <PartProperties key={itemId} />
              </Suspense>
            }
          />
        </div>
      </div>
    </div>
  );
}
