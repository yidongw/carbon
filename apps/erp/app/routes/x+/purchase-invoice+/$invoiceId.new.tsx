import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { useRouteData } from "@carbon/react";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useParams } from "react-router";
import { useUser } from "~/hooks";
import type { PurchaseInvoice } from "~/modules/invoicing";
import {
  getPurchaseInvoice,
  isPurchaseInvoiceLocked,
  PurchaseInvoiceLineForm,
  purchaseInvoiceLineValidator,
  replacePurchaseInvoiceLinesWithStyleVariants,
  upsertPurchaseInvoiceLine
} from "~/modules/invoicing";
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

  // Check if PI is locked
  const { client: viewClient } = await requirePermissions(request, {
    view: "invoicing"
  });

  const purchaseInvoice = await getPurchaseInvoice(viewClient, invoiceId);
  if (purchaseInvoice.error) {
    throw redirect(
      path.to.purchaseInvoiceDetails(invoiceId),
      await flash(
        request,
        error(purchaseInvoice.error, "Failed to load purchase invoice")
      )
    );
  }

  await requireUnlocked({
    request,
    isLocked: isPurchaseInvoiceLocked(purchaseInvoice.data?.status),
    redirectTo: path.to.purchaseInvoiceDetails(invoiceId),
    message: "Cannot modify a confirmed purchase invoice."
  });

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "invoicing"
  });

  const formData = await request.formData();
  const validation = await validator(purchaseInvoiceLineValidator).validate(
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
        path.to.purchaseInvoiceDetails(invoiceId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replacePurchaseInvoiceLinesWithStyleVariants(
          getDatabaseClient(),
          {
            companyId,
            userId,
            invoiceId: d.invoiceId,
            variants: expanded.variants,
            base: {
              invoiceLineType: d.invoiceLineType,
              description: d.description,
              locationId: d.locationId,
              storageUnitId: d.storageUnitId,
              purchaseUnitOfMeasureCode: d.purchaseUnitOfMeasureCode,
              inventoryUnitOfMeasureCode: d.inventoryUnitOfMeasureCode,
              conversionFactor: d.conversionFactor,
              supplierUnitPrice: d.supplierUnitPrice,
              supplierShippingCost: d.supplierShippingCost,
              supplierTaxAmount: d.supplierTaxAmount,
              exchangeRate: d.exchangeRate,
              requiredDate: d.requiredDate,
              purchaseOrderId: d.purchaseOrderId,
              purchaseOrderLineId: d.purchaseOrderLineId
            },
            customFields: setCustomFields(formData)
          }
        );
      } catch (err) {
        throw redirect(
          path.to.purchaseInvoiceDetails(invoiceId),
          await flash(
            request,
            error(
              err,
              "Failed to create purchase invoice lines for style variants"
            )
          )
        );
      }

      throw redirect(
        path.to.purchaseInvoiceDetails(invoiceId),
        await flash(request, success("Variant quantities added"))
      );
    }

    quantity = expanded.variants[0].quantity;
    variantQuantities = undefined;
  }

  if (d.itemId) {
    const required = await requireVariantQuantitiesIfAttributeParent(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities,
      quantity: quantity ?? 0
    });
    if (!required.ok) {
      throw redirect(
        path.to.purchaseInvoiceDetails(invoiceId),
        await flash(request, error(required.error, required.error))
      );
    }
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const createPurchaseInvoiceLine = await upsertPurchaseInvoiceLine(client, {
    ...d,
    quantity,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createPurchaseInvoiceLine.error) {
    throw redirect(
      path.to.purchaseInvoiceDetails(invoiceId),
      await flash(
        request,
        error(
          createPurchaseInvoiceLine.error,
          "Failed to create purchase invoice line."
        )
      )
    );
  }

  throw redirect(path.to.purchaseInvoiceDetails(invoiceId));
}

export default function NewPurchaseInvoiceLineRoute() {
  const { defaults } = useUser();
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("Could not find purchase invoice id");
  const purchaseInvoiceData = useRouteData<{
    purchaseInvoice: PurchaseInvoice;
  }>(path.to.purchaseInvoice(invoiceId));

  if (!invoiceId) throw new Error("Could not find purchase invoice id");

  const initialValues = {
    invoiceId: invoiceId,
    invoiceLineType: "Item" as MethodItemType,
    quantity: 1,
    locationId:
      purchaseInvoiceData?.purchaseInvoice?.locationId ??
      defaults.locationId ??
      "",
    supplierUnitPrice: 0,
    supplierShippingCost: 0,
    supplierTaxAmount: 0,
    exchangeRate: purchaseInvoiceData?.purchaseInvoice?.exchangeRate ?? 1,
    variantQuantities: undefined
  };

  return <PurchaseInvoiceLineForm initialValues={initialValues} />;
}
