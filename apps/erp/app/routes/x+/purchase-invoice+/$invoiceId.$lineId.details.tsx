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
  getPurchaseInvoice,
  getPurchaseInvoiceLine,
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
import { getSupplierInteractionLineDocuments } from "~/modules/purchasing";
import {
  SupplierInteractionLineDocuments,
  SupplierInteractionLineNotes
} from "~/modules/purchasing/ui/SupplierInteraction";
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

  const [purchaseInvoiceLine, files] = await Promise.all([
    getPurchaseInvoiceLine(client, lineId),
    getSupplierInteractionLineDocuments(client, companyId, lineId)
  ]);

  return {
    purchaseInvoiceLine: purchaseInvoiceLine?.data ?? null,
    files
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { invoiceId, lineId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");
  if (!lineId) throw new Error("Could not find lineId");

  // Check if PI is locked
  const { client: viewClient } = await requirePermissions(request, {
    view: "invoicing"
  });

  const purchaseInvoice = await getPurchaseInvoice(viewClient, invoiceId);
  if (purchaseInvoice.error) {
    throw redirect(
      path.to.purchaseInvoiceLine(invoiceId, lineId),
      await flash(
        request,
        error(purchaseInvoice.error, "Failed to load purchase invoice")
      )
    );
  }

  await requireUnlocked({
    request,
    isLocked: isPurchaseInvoiceLocked(purchaseInvoice.data?.status),
    redirectTo: path.to.purchaseInvoiceLine(invoiceId, lineId),
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
        path.to.purchaseInvoiceLine(invoiceId, lineId),
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
            invoiceId,
            replaceLineId: lineId,
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
          path.to.purchaseInvoiceLine(invoiceId, lineId),
          await flash(
            request,
            error(
              err,
              "Failed to update purchase invoice lines for style variants"
            )
          )
        );
      }

      throw redirect(
        path.to.purchaseInvoiceDetails(invoiceId),
        await flash(request, success("Variant quantities updated"))
      );
    }

    quantity = expanded.variants[0].quantity;
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
        path.to.purchaseInvoiceLine(invoiceId, lineId),
        await flash(request, error(required.error, required.error))
      );
    }
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const updatePurchaseInvoiceLine = await upsertPurchaseInvoiceLine(client, {
    id: lineId,
    ...d,
    quantity,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });

  if (updatePurchaseInvoiceLine.error) {
    throw redirect(
      path.to.purchaseInvoiceLine(invoiceId, lineId),
      await flash(
        request,
        error(
          updatePurchaseInvoiceLine.error,
          "Failed to update purchase invoice line"
        )
      )
    );
  }

  throw redirect(path.to.purchaseInvoiceLine(invoiceId, lineId));
}

export default function EditPurchaseInvoiceLineRoute() {
  const { t } = useLingui();
  const { invoiceId, lineId } = useParams();
  if (!invoiceId) throw notFound("invoiceId not found");
  if (!lineId) throw notFound("lineId not found");

  const [items] = useItems();
  const { purchaseInvoiceLine, files } = useLoaderData<typeof loader>();

  const initialValues = {
    id: purchaseInvoiceLine?.id ?? undefined,
    invoiceId: purchaseInvoiceLine?.invoiceId ?? "",
    invoiceLineType:
      purchaseInvoiceLine?.invoiceLineType === "Comment"
        ? "Part"
        : (purchaseInvoiceLine?.invoiceLineType ?? "Part"),
    itemId: purchaseInvoiceLine?.itemId ?? "",

    accountId: purchaseInvoiceLine?.accountId ?? "",
    assetId: purchaseInvoiceLine?.assetId ?? "",
    description: purchaseInvoiceLine?.description ?? "",
    quantity: purchaseInvoiceLine?.quantity ?? 1,
    supplierUnitPrice: purchaseInvoiceLine?.supplierUnitPrice ?? 0,
    supplierShippingCost: purchaseInvoiceLine?.supplierShippingCost ?? 0,
    supplierTaxAmount: purchaseInvoiceLine?.supplierTaxAmount ?? 0,
    exchangeRate: purchaseInvoiceLine?.exchangeRate ?? 1,
    purchaseUnitOfMeasureCode:
      purchaseInvoiceLine?.purchaseUnitOfMeasureCode ?? "",
    inventoryUnitOfMeasureCode:
      purchaseInvoiceLine?.inventoryUnitOfMeasureCode ?? "",
    conversionFactor: purchaseInvoiceLine?.conversionFactor ?? 1,
    storageUnitId: purchaseInvoiceLine?.storageUnitId ?? "",
    costCenterId: purchaseInvoiceLine?.costCenterId ?? "",
    taxPercent: purchaseInvoiceLine?.taxPercent ?? 0,
    // Style qty grid is FormData-only on create/edit; not stored on the line.
    variantQuantities: undefined,
    assetReadableId: (purchaseInvoiceLine as any)?.assetReadableId ?? "",
    assetName: (purchaseInvoiceLine as any)?.assetName ?? "",
    ...getCustomFields(purchaseInvoiceLine?.customFields)
  };

  return (
    <Fragment key={purchaseInvoiceLine?.id}>
      <PurchaseInvoiceLineForm
        key={initialValues.id}
        initialValues={initialValues}
      />
      <SupplierInteractionLineNotes
        id={purchaseInvoiceLine?.id ?? ""}
        table="purchaseInvoiceLine"
        title={t`Notes`}
        subTitle={
          purchaseInvoiceLine?.invoiceLineType === "Fixed Asset"
            ? ((purchaseInvoiceLine as any)?.assetName ??
              purchaseInvoiceLine?.description ??
              "")
            : purchaseInvoiceLine?.invoiceLineType === "G/L Account"
              ? (purchaseInvoiceLine?.description ?? "")
              : (getItemReadableId(items, purchaseInvoiceLine?.itemId) ?? "")
        }
        internalNotes={purchaseInvoiceLine?.internalNotes as JSONContent}
      />

      <DeferredFiles resolve={files}>
        {(resolvedFiles) => (
          <SupplierInteractionLineDocuments
            files={resolvedFiles ?? []}
            id={invoiceId}
            lineId={lineId}
            type="Purchase Invoice"
          />
        )}
      </DeferredFiles>

      <Outlet />
    </Fragment>
  );
}
