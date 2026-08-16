import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { useRouteData } from "@carbon/react";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useParams } from "react-router";
import { useUser } from "~/hooks";
import type { SalesInvoice } from "~/modules/invoicing";
import {
  getSalesInvoice,
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
import type { MethodItemType } from "~/modules/shared";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { invoiceId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");

  // Check if SI is locked
  const { client: viewClient } = await requirePermissions(request, {
    view: "invoicing"
  });

  const invoice = await getSalesInvoice(viewClient, invoiceId);
  if (invoice.error) {
    throw redirect(
      path.to.salesInvoiceDetails(invoiceId),
      await flash(request, error(invoice.error, "Failed to load sales invoice"))
    );
  }

  await requireUnlocked({
    request,
    isLocked: isSalesInvoiceLocked(invoice.data?.status),
    redirectTo: path.to.salesInvoiceDetails(invoiceId),
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
      // Invalid JSON — create without variantQuantities; keep typed quantity.
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
        path.to.salesInvoiceDetails(invoiceId),
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
          invoiceId: d.invoiceId,
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
          path.to.salesInvoiceDetails(invoiceId),
          await flash(
            request,
            error(
              err,
              "Failed to create sales invoice lines for style variants"
            )
          )
        );
      }

      throw redirect(
        path.to.salesInvoiceDetails(invoiceId),
        await flash(request, success("Variant quantities added"))
      );
    }

    quantity = expanded.variants[0].quantity;
    variantQuantities = undefined;
  } else if (d.itemId) {
    const required = await requireVariantQuantitiesIfAttributeParent(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities,
      quantity: quantity ?? 0
    });
    if (!required.ok) {
      throw redirect(
        path.to.salesInvoiceDetails(invoiceId),
        await flash(request, error(required.error, required.error))
      );
    }
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const createSalesInvoiceLine = await upsertSalesInvoiceLine(client, {
    ...d,
    quantity,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createSalesInvoiceLine.error) {
    throw redirect(
      path.to.salesInvoiceDetails(invoiceId),
      await flash(
        request,
        error(
          createSalesInvoiceLine.error,
          "Failed to create sales invoice line."
        )
      )
    );
  }

  throw redirect(path.to.salesInvoiceDetails(invoiceId));
}

export default function NewSalesInvoiceLineRoute() {
  const { defaults } = useUser();
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("Could not find sales invoice id");
  const salesInvoiceData = useRouteData<{
    salesInvoice: SalesInvoice;
  }>(path.to.salesInvoice(invoiceId));

  if (!invoiceId) throw new Error("Could not find sales invoice id");

  const initialValues = {
    invoiceId: invoiceId,
    invoiceLineType: "Item" as MethodItemType,
    quantity: 1,
    unitOfMeasureCode: "EA",
    locationId:
      salesInvoiceData?.salesInvoice?.locationId ?? defaults.locationId ?? "",
    unitPrice: 0,
    shippingCost: 0,
    addOnCost: 0,
    nonTaxableAddOnCost: 0,
    taxPercent: 0,
    exchangeRate: salesInvoiceData?.salesInvoice?.exchangeRate ?? 1,
    variantQuantities: undefined
  };

  return <SalesInvoiceLineForm initialValues={initialValues} />;
}
