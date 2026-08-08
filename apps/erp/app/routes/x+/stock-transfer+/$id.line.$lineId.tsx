import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { useRouteData } from "@carbon/react";
import type { ActionFunctionArgs } from "react-router";
import { data, redirect, useNavigate, useParams } from "react-router";
import {
  checkTransferLineAvailability,
  getStockTransfer,
  isStockTransferLocked,
  replaceStockTransferLineWithStyleVariants,
  stockTransferLineValidator,
  upsertStockTransferLine
} from "~/modules/inventory";
import type {
  StockTransfer,
  StockTransferLine
} from "~/modules/inventory/types";
import StockTransferLineForm from "~/modules/inventory/ui/StockTransfers/StockTransferLineForm";
import {
  expandStyleConfigToVariantLines,
  hasStyleConfigTable,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import { jobConfigurationUpdateFields } from "~/modules/production/configTableOverlay.server";
import { getDatabaseClient } from "~/services/database.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";

import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const { id, lineId } = params;
  if (!id) throw notFound("id not found");
  if (!lineId) throw notFound("lineId not found");

  const { client: viewClient } = await requirePermissions(request, {
    view: "inventory"
  });
  const transfer = await getStockTransfer(viewClient, id);
  await requireUnlocked({
    request,
    isLocked: isStockTransferLocked(transfer.data?.status),
    redirectTo: path.to.stockTransfer(id),
    message: "Cannot modify a locked stock transfer. Reopen it first."
  });

  const formData = await request.formData();

  const validation = await validator(stockTransferLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: configStr,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let variantQuantities: Json | undefined;
  let quantity = rawQuantity;
  if (configStr) {
    try {
      const parsed = JSON.parse(configStr) as Record<string, unknown>;
      const fields = jobConfigurationUpdateFields(parsed);
      variantQuantities = fields.configuration;
      quantity = fields.quantity;
    } catch {
      // invalid JSON — keep the typed quantity
    }
  }

  if (hasStyleConfigTable(variantQuantities)) {
    const expanded = await expandStyleConfigToVariantLines(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      return validationError({
        fieldErrors: { quantity: expanded.error }
      } as never);
    }

    for (const v of expanded.variants) {
      const availability = await checkTransferLineAvailability(client, {
        companyId,
        locationId: transfer.data?.locationId ?? "",
        itemId: v.variantItemId,
        fromStorageUnitId: d.fromStorageUnitId || null,
        quantity: v.quantity,
        excludeLineId: lineId
      });
      if (!availability.ok) {
        return validationError({
          fieldErrors: { quantity: availability.message }
        } as never);
      }
    }

    try {
      await replaceStockTransferLineWithStyleVariants(getDatabaseClient(), {
        companyId,
        userId,
        stockTransferId: id,
        replaceLineId: lineId,
        fromStorageUnitId: d.fromStorageUnitId,
        toStorageUnitId: d.toStorageUnitId,
        variants: expanded.variants.map((v) => ({
          variantItemId: v.variantItemId,
          quantity: v.quantity
        }))
      });
    } catch (err) {
      return data(
        {},
        await flash(request, error(err, "Failed to update line"))
      );
    }

    return redirect(
      path.to.stockTransfer(id),
      await flash(request, success("Line updated"))
    );
  }

  const required = await requireVariantQuantitiesIfAttributeParent(client, {
    parentItemId: d.itemId,
    companyId,
    variantQuantities,
    quantity
  });
  if (!required.ok) {
    return validationError({
      fieldErrors: { quantity: required.error }
    } as never);
  }

  const availability = await checkTransferLineAvailability(client, {
    companyId,
    locationId: transfer.data?.locationId ?? "",
    itemId: d.itemId,
    fromStorageUnitId: d.fromStorageUnitId || null,
    quantity,
    excludeLineId: lineId
  });
  if (!availability.ok) {
    return validationError({
      fieldErrors: { quantity: availability.message }
    } as never);
  }

  const updateStockTransferLine = await upsertStockTransferLine(client, {
    id: lineId,
    ...d,
    quantity,
    variantQuantities,
    updatedBy: userId
  });
  if (updateStockTransferLine.error) {
    return data(
      {},
      await flash(
        request,
        error(updateStockTransferLine.error, "Failed to update line")
      )
    );
  }

  return redirect(
    path.to.stockTransfer(id),
    await flash(request, success("Line updated"))
  );
}

export default function NewStockTransferLinesRoute() {
  const { id, lineId } = useParams();
  if (!id) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");
  const navigate = useNavigate();
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
    stockTransferLines: StockTransferLine[];
  }>(path.to.stockTransfer(id));

  if (!routeData?.stockTransfer?.locationId)
    throw new Error("No location found");

  const line = routeData?.stockTransferLines?.find(
    (line) => line.id === lineId
  );

  const initialValues = {
    id: lineId,
    stockTransferId: id,
    itemId: line?.itemId ?? "",
    quantity: line?.quantity ?? 1,
    fromStorageUnitId: line?.fromStorageUnitId ?? "",
    toStorageUnitId: line?.toStorageUnitId ?? "",
    variantQuantities: line?.variantQuantities
      ? JSON.stringify(line.variantQuantities)
      : undefined
  };

  return (
    <StockTransferLineForm
      locationId={routeData?.stockTransfer.locationId}
      onClose={() => navigate(-1)}
      // @ts-expect-error TS2739 - TODO: fix type
      initialValues={initialValues}
    />
  );
}
