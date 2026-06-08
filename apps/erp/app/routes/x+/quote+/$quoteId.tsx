import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import { msg } from "@lingui/core/macro";
import type { FileObject } from "@supabase/storage-js";
import type { PostgrestResponse } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "react-router";
import {
  Outlet,
  redirect,
  useLoaderData,
  useParams,
  useSubmit
} from "react-router";
import { PanelProvider, ResizablePanels } from "~/components/Layout/Panels";
import { getCurrencyByCode } from "~/modules/accounting";
import { getSupplierPriceBreaksForItems } from "~/modules/items";
import type { SalesOrderLine } from "~/modules/sales";
import {
  getCustomer,
  getOpportunity,
  getOpportunityDocuments,
  getQuote,
  getQuoteLinePricesByQuoteId,
  getQuoteLines,
  getQuoteMethodTrees,
  getQuotePayment,
  getQuoteShipment,
  getSalesOrderLines
} from "~/modules/sales";
import {
  QuoteExplorer,
  QuoteHeader,
  QuoteProperties
} from "~/modules/sales/ui/Quotes";
import { useOptimisticDocumentDrag } from "~/modules/sales/ui/Quotes/QuoteExplorer";
import { getCompanySettings } from "~/modules/settings";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Quotes`,
  to: path.to.quotes,
  module: "sales"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId, companyGroupId } = await requirePermissions(
    request,
    {
      view: "sales",
      bypassRls: true
    }
  );

  const { quoteId } = params;
  if (!quoteId) throw new Error("Could not find quoteId");

  const quote = await getQuote(client, quoteId);

  if (quote.error) {
    throw redirect(
      path.to.quotes,
      await flash(request, error(quote.error, "Failed to load quote"))
    );
  }

  if (companyId !== quote.data?.companyId) {
    throw redirect(path.to.quotes);
  }

  // Start all queries immediately in parallel (no sequential waterfalls)
  const customerPromise = getCustomer(client, quote.data?.customerId ?? "");
  const shipmentPromise = getQuoteShipment(client, quoteId);
  const paymentPromise = getQuotePayment(client, quoteId);
  const linesPromise = getQuoteLines(client, quoteId);
  const pricesPromise = getQuoteLinePricesByQuoteId(client, quoteId);
  const opportunityPromise = getOpportunity(client, quote.data?.opportunityId);
  const methodsPromise = getQuoteMethodTrees(client, quoteId);
  const companySettingsPromise = getCompanySettings(client, companyId);

  // getCurrencyByCode can start immediately — currencyCode is already known
  const exchangeRatePromise = quote.data?.currencyCode
    ? getCurrencyByCode(client, companyGroupId, quote.data.currencyCode).then(
        (r) => r.data?.exchangeRate ?? 1
      )
    : Promise.resolve(1);

  // supplierPriceMap chains from lines+methods — runs in parallel once they resolve
  const supplierPriceMapPromise = Promise.all([
    linesPromise,
    methodsPromise
  ]).then(([lines, methods]) => {
    const methodTrees = methods.data ?? [];
    const buyItemIds = new Set<string>();
    function collectBuyItems(tree: (typeof methodTrees)[number]) {
      if (tree.data.methodType === "Purchase to Order" && tree.data.itemId) {
        buyItemIds.add(tree.data.itemId);
      }
      tree.children?.forEach(collectBuyItems);
    }
    methodTrees.forEach(collectBuyItems);
    for (const line of lines.data ?? []) {
      if (line.methodType === "Purchase to Order" && line.itemId) {
        buyItemIds.add(line.itemId);
      }
    }
    return getSupplierPriceBreaksForItems(client, Array.from(buyItemIds));
  });

  // Await only what needs error checks before returning
  const [customer, shipment, payment, lines, prices, opportunity, methods, companySettings] =
    await Promise.all([
      customerPromise,
      shipmentPromise,
      paymentPromise,
      linesPromise,
      pricesPromise,
      opportunityPromise,
      methodsPromise,
      companySettingsPromise
    ]);

  if (!opportunity.data) throw new Error("Failed to get opportunity record");

  if (shipment.error) {
    throw redirect(
      path.to.quotes,
      await flash(
        request,
        error(shipment.error, "Failed to load quote shipment")
      )
    );
  }

  if (payment.error) {
    throw redirect(
      path.to.quotes,
      await flash(request, error(payment.error, "Failed to load quote payment"))
    );
  }

  // salesOrderLines chains from opportunity — already started above, resolves in parallel
  const salesOrderLinesPromise =
    opportunity.data?.salesOrders.length &&
    opportunity.data.salesOrders[0]?.id
      ? getSalesOrderLines(client, opportunity.data.salesOrders[0].id).then(
          (r) => r?.data ?? null
        )
      : Promise.resolve(null);

  const defaultCc =
    // @ts-expect-error TS18048 - TODO: fix type
    customer.data?.defaultCc?.length > 0
      ? // @ts-expect-error TS18047 - TODO: fix type
        customer.data.defaultCc
      : (companySettings.data?.defaultCustomerCc ?? []);

  const methodTrees = methods.data ?? [];

  return {
    quote: quote.data,
    customer: customer.data,
    lines: lines.data ?? [],
    methods: methodTrees,
    files: getOpportunityDocuments(
      client,
      companyId,
      quote.data?.opportunityId ?? ""
    ),
    prices: prices.data ?? [],
    shipment: shipment.data,
    payment: payment.data,
    opportunity: opportunity.data,
    exchangeRate: exchangeRatePromise,
    salesOrderLines: salesOrderLinesPromise,
    defaultCc,
    supplierPriceMap: supplierPriceMapPromise
  };
}

export default function QuoteRoute() {
  const params = useParams();
  const { quoteId } = params;
  if (!quoteId) throw new Error("Could not find quoteId");
  const { methods } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const pendingItems = useOptimisticDocumentDrag();

  const handleDrop = (
    document: FileObject & { path: string },
    targetId: string
  ) => {
    if (
      pendingItems.find((item: any) => item.itemId === `pending-${document.id}`)
    )
      return;

    const formData = new FormData();
    const payload = {
      id: document.id,
      name: document.name,
      size: document.metadata?.size || 0,
      path: document.path,
      lineId: targetId.startsWith("quote-line-")
        ? targetId.replace("quote-line-", "")
        : undefined
    };

    formData.append("payload", JSON.stringify(payload));

    submit(formData, {
      method: "post",
      action: path.to.quoteDrag(quoteId),
      navigate: false,
      fetcherKey: `quote-drag:${document.name}`
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && active.data.current?.type === "opportunityDocument") {
      handleDrop(
        active.data.current as unknown as FileObject & { path: string },
        over.id as string
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <PanelProvider key={quoteId}>
        <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full ">
          <QuoteHeader />
          <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
            <div className="flex flex-grow overflow-hidden">
              <ResizablePanels
                explorer={<QuoteExplorer methods={methods} />}
                content={
                  <div className="h-[calc(100dvh-99px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                    <VStack spacing={2} className="p-2">
                      <Outlet />
                    </VStack>
                  </div>
                }
                properties={<QuoteProperties key={quoteId} />}
              />
            </div>
          </div>
        </div>
      </PanelProvider>
    </DndContext>
  );
}
