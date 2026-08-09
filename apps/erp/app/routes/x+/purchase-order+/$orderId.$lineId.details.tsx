import { assertIsPost, error, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { Fragment } from "react/jsx-runtime";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Outlet, redirect, useLoaderData, useParams } from "react-router";
import { CadModel, DeferredFiles } from "~/components";
import { usePermissions, useRouteData } from "~/hooks";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity
} from "~/modules/items/styleOrderLines.server";
import { variantTableUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import {
  getPurchaseOrder,
  getPurchaseOrderLine,
  getSupplierInteractionLineDocuments,
  isPurchaseOrderLocked,
  purchaseOrderLineValidator,
  replacePurchaseOrderLinesWithStyleVariants,
  upsertPurchaseOrderLine
} from "~/modules/purchasing";
import { PurchaseOrderLineForm } from "~/modules/purchasing/ui/PurchaseOrder";
import {
  SupplierInteractionLineDocuments,
  SupplierInteractionLineNotes
} from "~/modules/purchasing/ui/SupplierInteraction";
import { getDatabaseClient } from "~/services/database.server";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "purchasing",
    role: "employee",
    bypassRls: true
  });

  const { orderId, lineId } = params;
  if (!orderId) throw notFound("orderId not found");
  if (!lineId) throw notFound("lineId not found");

  const line = await getPurchaseOrderLine(client, lineId);
  if (line.error) {
    throw redirect(
      path.to.purchaseOrderDetails(orderId),
      await flash(request, error(line.error, "Failed to load sales order line"))
    );
  }

  return {
    line: line?.data ?? null,
    files: getSupplierInteractionLineDocuments(client, companyId, lineId)
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { orderId, lineId } = params;
  if (!orderId) throw new Error("Could not find orderId");
  if (!lineId) throw new Error("Could not find lineId");

  // First check with view permission to get the PO status
  const { client: viewClient } = await requirePermissions(request, {
    view: "purchasing"
  });

  // Get PO status and current line data
  const [purchaseOrder, currentLine] = await Promise.all([
    getPurchaseOrder(viewClient, orderId),
    getPurchaseOrderLine(viewClient, lineId)
  ]);

  if (purchaseOrder.error) {
    throw redirect(
      path.to.purchaseOrderLine(orderId, lineId),
      await flash(
        request,
        error(purchaseOrder.error, "Failed to load purchase order")
      )
    );
  }

  if (currentLine.error || !currentLine.data) {
    throw redirect(
      path.to.purchaseOrderLine(orderId, lineId),
      await flash(
        request,
        error(currentLine.error, "Failed to load purchase order line")
      )
    );
  }

  await requireUnlocked({
    request,
    isLocked: isPurchaseOrderLocked(purchaseOrder.data?.status),
    redirectTo: path.to.purchaseOrderLine(orderId, lineId),
    message: "Cannot modify a confirmed purchase order."
  });

  const { client, userId, companyId } = await requirePermissions(request, {
    update: "purchasing"
  });

  const formData = await request.formData();
  const validation = await validator(purchaseOrderLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  // Omit `id` — the route param is the source of truth.
  const {
    id: _id,
    variantQuantities: configStr,
    purchaseQuantity: rawQuantity,
    ...d
  } = validation.data;

  let purchaseQuantity = rawQuantity;
  let variantQuantities: Json | undefined;
  if (configStr) {
    try {
      const parsed = JSON.parse(configStr) as Record<string, unknown>;
      const fields = variantTableUpdateFields(parsed);
      variantQuantities = fields.variantQuantities;
      purchaseQuantity = fields.quantity;
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
        path.to.purchaseOrderLine(orderId, lineId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replacePurchaseOrderLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          purchaseOrderId: orderId,
          replaceLineId: lineId,
          variants: expanded.variants,
          base: {
            purchaseOrderLineType: d.purchaseOrderLineType,
            description: d.description,
            locationId: d.locationId,
            storageUnitId: d.storageUnitId,
            purchaseUnitOfMeasureCode: d.purchaseUnitOfMeasureCode,
            inventoryUnitOfMeasureCode: d.inventoryUnitOfMeasureCode,
            conversionFactor: d.conversionFactor,
            supplierUnitPrice: d.supplierUnitPrice,
            setupPrice: undefined,
            supplierShippingCost: d.supplierShippingCost,
            supplierTaxAmount: d.supplierTaxAmount,
            exchangeRate: d.exchangeRate,
            requiredDate: d.requiredDate,
            promisedDate: d.promisedDate
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        throw redirect(
          path.to.purchaseOrderLine(orderId, lineId),
          await flash(
            request,
            error(
              err,
              "Failed to update purchase order lines for style variants"
            )
          )
        );
      }

      throw redirect(path.to.purchaseOrderDetails(orderId));
    }

    purchaseQuantity = expanded.variants[0].quantity;
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const updatePurchaseOrderLine = await upsertPurchaseOrderLine(client, {
    id: lineId,
    ...d,
    purchaseQuantity,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });

  if (updatePurchaseOrderLine.error) {
    throw redirect(
      path.to.purchaseOrderLine(orderId, lineId),
      await flash(
        request,
        error(
          updatePurchaseOrderLine.error,
          "Failed to update purchase order line"
        )
      )
    );
  }

  throw redirect(path.to.purchaseOrderLine(orderId, lineId));
}

export default function EditPurchaseOrderLineRoute() {
  const { t } = useLingui();
  const { orderId, lineId } = useParams();
  if (!orderId) throw new Error("orderId not found");
  if (!lineId) throw new Error("lineId not found");

  const permissions = usePermissions();
  const routeData = useRouteData<{
    purchaseOrder: { status: string };
  }>(path.to.purchaseOrder(orderId));
  const isReadOnly = isPurchaseOrderLocked(routeData?.purchaseOrder?.status);

  const { line, files } = useLoaderData<typeof loader>();

  const initialValues = {
    id: line?.id ?? undefined,
    purchaseOrderId: line?.purchaseOrderId ?? "",
    purchaseOrderLineType:
      line?.purchaseOrderLineType === "Comment"
        ? "Part"
        : (line?.purchaseOrderLineType ?? "Part"),
    itemId: line?.itemId ?? "",
    accountId: line?.accountId ?? "",
    assetId: line?.assetId ?? "",
    conversionFactor: line?.conversionFactor ?? 1,
    description: line?.description ?? "",
    exchangeRate: line?.exchangeRate ?? 1,
    inventoryUnitOfMeasureCode: line?.inventoryUnitOfMeasureCode ?? "",
    jobId: line?.jobId ?? "",
    jobOperationId: line?.jobOperationId ?? "",
    locationId: line?.locationId ?? "",
    purchaseQuantity: line?.purchaseQuantity ?? 1,
    purchaseUnitOfMeasureCode: line?.purchaseUnitOfMeasureCode ?? "",
    requiredDate: line?.requiredDate ?? undefined,
    storageUnitId: line?.storageUnitId ?? "",
    supplierPartId: line?.supplierPartId ?? "",
    supplierShippingCost: line?.supplierShippingCost ?? 0,
    supplierTaxAmount: line?.supplierTaxAmount ?? 0,
    supplierUnitPrice: line?.supplierUnitPrice ?? 0,
    costCenterId: line?.costCenterId ?? "",
    taxPercent: line?.taxPercent ?? 0,
    // Style qty grid is FormData-only on create/edit; not stored on the line.
    variantQuantities: undefined,
    assetReadableId: (line as any)?.assetReadableId ?? "",
    assetName: (line as any)?.assetName ?? "",
    ...getCustomFields(line?.customFields)
  };

  return (
    <Fragment key={lineId}>
      <PurchaseOrderLineForm
        key={initialValues.id}
        initialValues={initialValues}
      />
      <SupplierInteractionLineNotes
        id={line?.id ?? ""}
        table="purchaseOrderLine"
        title={t`Notes`}
        subTitle={
          line.purchaseOrderLineType === "Fixed Asset"
            ? (line.assetName ?? line.description ?? "")
            : line.purchaseOrderLineType === "G/L Account"
              ? (line.description ?? "")
              : (line.itemReadableId ?? "")
        }
        internalNotes={line.internalNotes as JSONContent}
        externalNotes={line.externalNotes as JSONContent}
      />

      <DeferredFiles resolve={files}>
        {(resolvedFiles) => (
          <SupplierInteractionLineDocuments
            files={resolvedFiles ?? []}
            id={orderId}
            lineId={lineId}
            type="Purchase Order"
          />
        )}
      </DeferredFiles>
      <CadModel
        isReadOnly={isReadOnly || !permissions.can("update", "purchasing")}
        metadata={{
          itemId: line?.itemId ?? undefined
        }}
        modelPath={line?.modelPath ?? null}
        title={t`CAD Model`}
        uploadClassName="aspect-square min-h-[420px] max-h-[70vh]"
        viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"
      />

      <Outlet />
    </Fragment>
  );
}
