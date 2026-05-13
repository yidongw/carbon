import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import { msg } from "@lingui/core/macro";
import type { FunctionsResponse } from "@supabase/functions-js";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLocation, useNavigate } from "react-router";
import { RegisteredEntityFormModal } from "~/components/NewEntityModal";
import { useUrlParams } from "~/hooks";
import {
  createSalesInvoiceFromSalesOrder,
  createSalesInvoiceFromShipment,
  salesInvoiceValidator,
  upsertSalesInvoice
} from "~/modules/invoicing";
import { getNextSequence } from "~/modules/settings";
import { setCustomFields } from "~/utils/form";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Sales`,
  to: path.to.sales,
  module: "sales"
};

export async function loader({ request }: LoaderFunctionArgs) {
  // we don't use the client here -- if they have this permission, we'll upgrade to a service role if needed
  const { companyId, userId } = await requirePermissions(request, {
    create: "invoicing"
  });

  const url = new URL(request.url);
  const sourceDocument = url.searchParams.get("sourceDocument") ?? undefined;
  const sourceDocumentId = url.searchParams.get("sourceDocumentId") ?? "";

  let result: FunctionsResponse<{ id: string }>;

  switch (sourceDocument) {
    case "Sales Order":
      if (!sourceDocumentId) throw new Error("Missing sourceDocumentId");

      result = await createSalesInvoiceFromSalesOrder(
        getCarbonServiceRole(),
        sourceDocumentId,
        companyId,
        userId
      );

      if (result.error || !result?.data) {
        throw redirect(
          request.headers.get("Referer") ?? path.to.salesOrders,
          await flash(
            request,
            error(result.error, "Failed to create sales invoice")
          )
        );
      }

      throw redirect(path.to.salesInvoice(result.data?.id!));

    case "Shipment":
      if (!sourceDocumentId) throw new Error("Missing sourceDocumentId");
      result = await createSalesInvoiceFromShipment(
        getCarbonServiceRole(),
        sourceDocumentId,
        companyId,
        userId
      );

      if (result.error || !result?.data) {
        throw redirect(
          request.headers.get("Referer") ?? path.to.shipment(sourceDocumentId),
          await flash(
            request,
            error(result.error, "Failed to create sales invoice")
          )
        );
      }

      throw redirect(path.to.salesInvoice(result.data?.id!));

    default:
      return null;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "invoicing"
  });

  const formData = await request.formData();
  const validation = await validator(salesInvoiceValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, ...d } = validation.data;
  let invoiceId = d.invoiceId;
  const useNextSequence = !invoiceId;

  if (useNextSequence) {
    const nextSequence = await getNextSequence(
      client,
      "salesInvoice",
      companyId
    );
    if (nextSequence.error) {
      return data(
        {
          error: {
            message: "Failed to get next sequence"
          }
        },
        await flash(
          request,
          error(nextSequence.error, "Failed to get next sequence")
        )
      );
    }
    invoiceId = nextSequence.data;
  }

  if (!invoiceId) throw new Error("invoiceId is not defined");

  const createSalesInvoice = await upsertSalesInvoice(client, {
    ...d,
    invoiceId,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createSalesInvoice.error || !createSalesInvoice.data?.[0]) {
    console.error(createSalesInvoice.error);
    return data(
      {
        data: createSalesInvoice.data,
        error: {
          message: "Failed to insert sales invoice"
        }
      },
      await flash(
        request,
        error(createSalesInvoice.error, "Failed to insert sales invoice")
      )
    );
  }

  return data(createSalesInvoice, { status: 201 });
}

export default function SalesInvoiceNewRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [params] = useUrlParams();

  return (
    <RegisteredEntityFormModal
      to={path.to.newSalesInvoice}
      searchParams={params}
      onClose={() => {
        if (from) {
          navigate(from);
        } else {
          navigate(-1);
        }
      }}
    />
  );
}
