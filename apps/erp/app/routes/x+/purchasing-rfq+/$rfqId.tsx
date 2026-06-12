import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { type JSONContent, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Suspense } from "react";
import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs
} from "react-router";
import { Await, Outlet, redirect, useLoaderData, useParams } from "react-router";
import { ExplorerSkeleton } from "~/components/Skeletons";
import { PanelProvider, ResizablePanels } from "~/components/Layout/Panels";
import type { PurchasingRFQLine } from "~/modules/purchasing";
import {
  getLinkedSupplierQuotes,
  getPurchasingRFQ,
  getPurchasingRFQLines,
  getPurchasingRFQSuppliersWithLinks,
  getSupplierInteractionDocuments
} from "~/modules/purchasing";
import {
  PurchasingRFQExplorer,
  PurchasingRFQHeader,
  PurchasingRFQProperties
} from "~/modules/purchasing/ui/PurchasingRfq";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`RFQs`,
  to: path.to.purchasingRfqs
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId } = await requirePermissions(request, {
    view: "purchasing"
  });

  const { rfqId } = params;
  if (!rfqId) throw new Error("Could not find rfqId");

  const serviceRole = await getCarbonServiceRole();

  const [rfqSummary, suppliers, linkedQuotes] = await Promise.all([
    getPurchasingRFQ(serviceRole, rfqId),
    getPurchasingRFQSuppliersWithLinks(serviceRole, rfqId),
    getLinkedSupplierQuotes(serviceRole, rfqId)
  ]);

  if (rfqSummary.error) {
    throw redirect(
      path.to.purchasingRfqs,
      await flash(
        request,
        error(rfqSummary.error, "Failed to load purchasing RFQ summary")
      )
    );
  }

  // Start lines after primary record check; runs while quote links are processed
  const linesPromise = getPurchasingRFQLines(serviceRole, rfqId);

  // Extract supplier quotes from the linked data
  const supplierQuotes =
    linkedQuotes.data?.map((link) => link.supplierQuote).filter(Boolean) ?? [];

  // Create a map of supplierId -> quote externalLinkId for the header
  const quoteExternalLinkBySupplierId = new Map<string, string>();
  for (const quote of supplierQuotes) {
    if (quote && (quote as any).supplierId && (quote as any).externalLinkId) {
      quoteExternalLinkBySupplierId.set(
        (quote as any).supplierId,
        (quote as any).externalLinkId
      );
    }
  }

  return {
    rfqSummary: rfqSummary.data,
    lines: (await linesPromise).data ?? [],
    suppliers:
      suppliers.data?.map((s) => ({
        id: s.id,
        supplierId: s.supplierId,
        supplier: s.supplier,
        // Use the supplier quote's external link (for sharing), not the rfqSupplier's
        quoteExternalLinkId: quoteExternalLinkBySupplierId.get(s.supplierId)
      })) ?? [],
    linkedQuotes: supplierQuotes,
    // Use rfqId as the interaction ID for document storage
    files: getSupplierInteractionDocuments(serviceRole, companyId, rfqId)
  };
}

const rfqCache = new Map<string, { data: Awaited<ReturnType<typeof loader>>; ts: number }>();

export function shouldRevalidate({
  actionStatus,
  currentParams,
  defaultShouldRevalidate
}: ShouldRevalidateFunctionArgs) {
  if (actionStatus !== undefined) {
    rfqCache.delete(currentParams.rfqId!);
  }
  return defaultShouldRevalidate;
}

export async function clientLoader({
  serverLoader,
  params
}: ClientLoaderFunctionArgs) {
  const key = params.rfqId!;
  const hit = rfqCache.get(key);
  if (hit && Date.now() - hit.ts < 5 * 60_000) {
    serverLoader<typeof loader>().then((d) =>
      rfqCache.set(key, { data: d, ts: Date.now() })
    );
    return hit.data;
  }
  const data = await serverLoader<typeof loader>();
  rfqCache.set(key, { data, ts: Date.now() });
  return data;
}
clientLoader.hydrate = true;

export default function PurchasingRFQRoute() {
  const { rfqId } = useParams();
  if (!rfqId) throw new Error("Could not find rfqId");
  const { lines } = useLoaderData<typeof loader>();

  return (
    <PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <PurchasingRFQHeader />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-grow overflow-hidden">
            <ResizablePanels
              explorer={
                <Suspense fallback={<ExplorerSkeleton />}>
                  <Await
                    resolve={lines}
                    errorElement={
                      <div className="p-4 text-sm text-red-500">
                        <Trans>Failed to load RFQ lines.</Trans>
                      </div>
                    }
                  >
                    {(resolvedLines) => {
                      const normalizedLines = (resolvedLines.data ?? []).map(
                        (line: PurchasingRFQLine) => ({
                          ...line,
                          id: line.id ?? "",
                          order: line.order ?? 0,
                          purchaseUnitOfMeasureCode:
                            line.purchaseUnitOfMeasureCode ?? "",
                          inventoryUnitOfMeasureCode:
                            line.inventoryUnitOfMeasureCode ?? "",
                          conversionFactor: line.conversionFactor ?? 1,
                          description: line.description ?? "",
                          externalNotes: (line.externalNotes ??
                            {}) as JSONContent,
                          internalNotes: (line.internalNotes ??
                            {}) as JSONContent,
                          itemId: line.itemId ?? "",
                          quantity: line.quantity ?? [1]
                        })
                      );
                      return <PurchasingRFQExplorer lines={normalizedLines} />;
                    }}
                  </Await>
                </Suspense>
              }
              content={
                <div className="h-[calc(100dvh-99px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <VStack spacing={2} className="p-2">
                    <Outlet />
                  </VStack>
                </div>
              }
              properties={<PurchasingRFQProperties key={rfqId} />}
            />
          </div>
        </div>
      </div>
    </PanelProvider>
  );
}
