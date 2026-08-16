import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { useLingui } from "@lingui/react/macro";
import { Fragment } from "react/jsx-runtime";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData, useParams } from "react-router";
import { DeferredFiles } from "~/components";
import {
  getSalesInvoice,
  getSalesInvoiceLine,
  isSalesInvoiceLocked,
  replaceSalesInvoiceLinesWithStyleVariants,
  salesInvoiceLineValidator,
  unitPriceForExpandedStyleVariants,
  upsertSalesInvoiceLine
} from "~/modules/invoicing";
import SalesInvoiceLineForm from "~/modules/invoicing/ui/SalesInvoice/SalesInvoiceLineForm";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import { getOpportunityLineDocuments } from "~/modules/sales";
import {
  OpportunityLineDocuments,
  OpportunityLineNotes
} from "~/modules/sales/ui/Opportunity";
import { getDatabaseClient } from "~/services/database.server";
import { useItems } from "~/stores";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "invoicing",
    role: "employee"
  });

  const { lineId } = params;
  if (!lineId) throw notFound("lineId not found");

  const salesInvoiceLine = await getSalesInvoiceLine(client, lineId);

  const itemId = salesInvoiceLine?.data?.itemId;

  return {
    salesInvoiceLine: salesInvoiceLine?.data ?? null,
    files: await getOpportunityLineDocuments(client, companyId, lineId, itemId)
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { invoiceId, lineId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");
  if (!lineId) throw new Error("Could not find lineId");

  // Check if SI is locked
  const { client: viewClient } = await requirePermissions(request, {
    view: "invoicing"
  });

  const invoice = await getSalesInvoice(viewClient, invoiceId);
  if (invoice.error) {
    throw redirect(
      path.to.salesInvoiceLine(invoiceId, lineId),
      await flash(request, error(invoice.error, "Failed to load sales invoice"))
    );
  }

  await requireUnlocked({
    request,
    isLocked: isSalesInvoiceLocked(invoice.data?.status),
    redirectTo: path.to.salesInvoiceLine(invoiceId, lineId),
    message: "Cannot modify a locked sales invoice. Reopen it first."
  });

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "invoicing"
  });

  const formData = await request.formData();
  const validation = await validator(salesInvoiceLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: variantQuantitiesFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  if (d.invoiceLineType === "Fixed Asset") {
    d.accountId = undefined;
    d.itemId = undefined;
  } else {
    d.accountId = undefined;
    d.assetId = undefined;
  }

  let quantity = rawQuantity;
  let variantQuantities: Json | undefined;
  const variantQuantitiesRaw = readVariantQuantitiesFormRaw(
    formData,
    variantQuantitiesFromValidator
  );
  if (variantQuantitiesRaw) {
    try {
      const parsed = JSON.parse(variantQuantitiesRaw) as Record<
        string,
        unknown
      >;
      const fields = variantTableUpdateFields(parsed);
      variantQuantities = fields.variantQuantities;
      quantity = fields.quantity;
    } catch {
      // Invalid JSON — keep typed quantity; FormData config is expand-only.
    }
  }

  // FormData variantTable means the per-variant quantity grid was used (Style
  // variants quantity, or a Consumable color set) — expand into variant SKU lines
  // regardless of the picker's line type.
  if (
    d.itemId &&
    variantQuantities &&
    hasStyleVariantsQuantity(variantQuantities)
  ) {
    const expanded = await expandVariantTableToLines(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      throw redirect(
        path.to.salesInvoiceLine(invoiceId, lineId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        const unitPrice = await unitPriceForExpandedStyleVariants(
          client,
          companyId,
          {
            customerId: invoice.data?.customerId,
            parentItemId: d.itemId,
            variants: expanded.variants,
            fallbackUnitPrice: d.unitPrice
          }
        );
        await replaceSalesInvoiceLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          invoiceId,
          replaceLineId: lineId,
          exchangeRate: d.exchangeRate ?? invoice.data?.exchangeRate ?? 1,
          variants: expanded.variants,
          base: {
            invoiceLineType: d.invoiceLineType,
            description: d.description,
            locationId: d.locationId,
            storageUnitId: d.storageUnitId,
            methodType: d.methodType,
            unitOfMeasureCode: d.unitOfMeasureCode,
            unitPrice,
            shippingCost: d.shippingCost,
            addOnCost: d.addOnCost,
            nonTaxableAddOnCost: d.nonTaxableAddOnCost,
            taxPercent: d.taxPercent
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        throw redirect(
          path.to.salesInvoiceLine(invoiceId, lineId),
          await flash(
            request,
            error(
              err,
              "Failed to update sales invoice lines for style variants"
            )
          )
        );
      }

      throw redirect(
        path.to.salesInvoiceDetails(invoiceId),
        await flash(request, success("Variant quantities updated"))
      );
    }

    quantity = expanded.variants[0].quantity;
  } else if (d.itemId) {
    const required = await requireVariantQuantitiesIfAttributeParent(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities,
      quantity: quantity ?? 0
    });
    if (!required.ok) {
      throw redirect(
        path.to.salesInvoiceLine(invoiceId, lineId),
        await flash(request, error(required.error, required.error))
      );
    }
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const updateSalesInvoiceLine = await upsertSalesInvoiceLine(client, {
    id: lineId,
    ...d,
    quantity,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });

  if (updateSalesInvoiceLine.error) {
    throw redirect(
      path.to.salesInvoiceLine(invoiceId, lineId),
      await flash(
        request,
        error(
          updateSalesInvoiceLine.error,
          "Failed to update sales invoice line"
        )
      )
    );
  }

  throw redirect(path.to.salesInvoiceLine(invoiceId, lineId));
}

export default function EditSalesInvoiceLineRoute() {
  const { t } = useLingui();
  const { invoiceId, lineId } = useParams();
  if (!invoiceId) throw notFound("invoiceId not found");
  if (!lineId) throw notFound("lineId not found");

  const { salesInvoiceLine, files } = useLoaderData<typeof loader>();

  const initialValues = {
    id: salesInvoiceLine?.id ?? undefined,
    invoiceId: salesInvoiceLine?.invoiceId ?? "",
    invoiceLineType:
      salesInvoiceLine?.invoiceLineType === "Comment"
        ? "Part"
        : (salesInvoiceLine?.invoiceLineType ?? "Part"),
    methodType: (salesInvoiceLine?.methodType ??
      "Pull from Inventory") as "Pull from Inventory",
    itemId: salesInvoiceLine?.itemId ?? "",
    accountId: salesInvoiceLine?.accountId ?? "",
    addOnCost: salesInvoiceLine?.addOnCost ?? 0,
    nonTaxableAddOnCost: salesInvoiceLine?.nonTaxableAddOnCost ?? 0,
    assetId: salesInvoiceLine?.assetId ?? "",
    description: salesInvoiceLine?.description ?? "",
    quantity: salesInvoiceLine?.quantity ?? 1,
    unitPrice: salesInvoiceLine?.unitPrice ?? 0,
    shippingCost: salesInvoiceLine?.shippingCost ?? 0,
    taxPercent: salesInvoiceLine?.taxPercent ?? 0,
    exchangeRate: salesInvoiceLine?.exchangeRate ?? 1,
    unitOfMeasureCode: salesInvoiceLine?.unitOfMeasureCode ?? "",
    storageUnitId: salesInvoiceLine?.storageUnitId ?? "",
    // Style qty grid is FormData-only on create/edit; not stored on the line.
    variantQuantities: undefined,
    assetReadableId: (salesInvoiceLine as any)?.assetReadableId ?? undefined,
    assetName: (salesInvoiceLine as any)?.assetName ?? undefined,
    ...getCustomFields(salesInvoiceLine?.customFields)
  };

  const [items] = useItems();

  return (
    <Fragment key={salesInvoiceLine?.id}>
      <SalesInvoiceLineForm
        key={initialValues.id}
        initialValues={initialValues}
        isSalesOrderLine={salesInvoiceLine?.salesOrderLineId !== undefined}
      />
      <OpportunityLineNotes
        id={salesInvoiceLine?.id ?? ""}
        table="salesInvoiceLine"
        title={t`Notes`}
        subTitle={getItemReadableId(items, salesInvoiceLine?.itemId) ?? ""}
        internalNotes={salesInvoiceLine?.internalNotes as JSONContent}
      />

      <DeferredFiles resolve={files}>
        {(resolvedFiles) => (
          <OpportunityLineDocuments
            files={resolvedFiles ?? []}
            id={invoiceId}
            lineId={lineId}
            itemId={salesInvoiceLine?.itemId}
            type="Sales Invoice"
          />
        )}
      </DeferredFiles>

      <Outlet />
    </Fragment>
  );
}
