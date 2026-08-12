import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useParams } from "react-router";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import {
  getSalesInvoice,
  getSalesInvoiceLines,
  getSalesInvoiceShipment
} from "~/modules/invoicing";
// import SalesInvoiceExplorer from "~/modules/invoicing/ui/SalesInvoice/SalesInvoiceExplorer";
import SalesInvoiceHeader from "~/modules/invoicing/ui/SalesInvoice/SalesInvoiceHeader";
import SalesInvoiceProperties from "~/modules/invoicing/ui/SalesInvoice/SalesInvoiceProperties";
import { getAttributeValueNames } from "~/modules/items";
import {
  getCustomer,
  getOpportunity,
  getOpportunityDocuments
} from "~/modules/sales/sales.service";
import { getCompanySettings } from "~/modules/settings";
import { getStyleVariantLineMetaByItemIds } from "~/modules/shared/styleVariantLineMeta.server";
import { buildAttributeValueNames } from "~/modules/shared/variantDisplay";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Invoices`,
  to: path.to.salesInvoices
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "invoicing"
  });

  const { invoiceId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");

  const [salesInvoice, salesInvoiceLines, salesInvoiceShipment] =
    await Promise.all([
      getSalesInvoice(client, invoiceId),
      getSalesInvoiceLines(client, invoiceId),
      getSalesInvoiceShipment(client, invoiceId)
    ]);

  if (salesInvoice.error) {
    throw redirect(
      path.to.salesInvoices,
      await flash(
        request,
        error(salesInvoice.error, "Failed to load sales invoice")
      )
    );
  }

  const lineItemIds = Array.from(
    new Set(
      (salesInvoiceLines.data ?? [])
        .map((l) => l.itemId)
        .filter((id): id is string => !!id)
    )
  );

  const serviceRole = getCarbonServiceRole();
  const [
    customer,
    opportunity,
    companySettings,
    styleVariantByItemId,
    attributeValueNameRows
  ] = await Promise.all([
    salesInvoice.data?.customerId
      ? getCustomer(client, salesInvoice.data.customerId)
      : null,
    salesInvoice.data?.opportunityId
      ? getOpportunity(client, salesInvoice.data.opportunityId)
      : null,
    getCompanySettings(serviceRole, companyId),
    getStyleVariantLineMetaByItemIds(client, lineItemIds, companyId),
    getAttributeValueNames(client, companyId)
  ]);

  const defaultCc = customer?.data?.defaultCc?.length
    ? customer.data.defaultCc
    : (companySettings.data?.defaultCustomerCc ?? []);

  const attributeValueNames = buildAttributeValueNames(
    attributeValueNameRows.data ?? []
  );

  return {
    salesInvoice: salesInvoice.data,
    salesInvoiceLines: salesInvoiceLines.data ?? [],
    salesInvoiceShipment: salesInvoiceShipment.data,
    attributeValueNames,
    styleVariantByItemId,
    files: getOpportunityDocuments(
      client,
      companyId,
      salesInvoice.data?.opportunityId!
    ),
    opportunity: opportunity?.data ?? null,
    customer: customer?.data ?? null,
    defaultCc
  };
}

export async function action({ request }: ActionFunctionArgs) {
  throw redirect(
    request.headers.get("Referer") ?? new URL(request.url).pathname
  );
}

export default function SalesInvoiceRoute() {
  const params = useParams();
  const { invoiceId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");

  return (
    <PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <SalesInvoiceHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <ResizablePanels
              // explorer={<SalesInvoiceExplorer />}
              content={
                <div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <VStack spacing={2} className="p-2">
                    <Outlet />
                  </VStack>
                </div>
              }
              properties={<SalesInvoiceProperties key={invoiceId} />}
            />
          </div>
        </div>
      </div>
    </PanelProvider>
  );
}
