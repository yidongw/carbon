import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { useRouteData } from "@carbon/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate, useParams } from "react-router";
import {
  checkTransferLineAvailability,
  getStockTransfer,
  insertStockTransferLinesWithStyleVariants,
  isStockTransferLocked,
  stockTransferLineValidator,
  upsertStockTransferLine
} from "~/modules/inventory";
import type { StockTransfer } from "~/modules/inventory/types";
import StockTransferLineForm from "~/modules/inventory/ui/StockTransfers/StockTransferLineForm";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import { jobConfigurationUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import { getDatabaseClient } from "~/services/database.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";

import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "inventory"
  });

  return null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const { id } = params;
  if (!id) throw notFound("id not found");

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
    id: _lineId,
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

  if (hasStyleVariantsQuantity(variantQuantities)) {
    const expanded = await expandVariantTableToLines(client, {
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
        quantity: v.quantity
      });
      if (!availability.ok) {
        return validationError({
          fieldErrors: { quantity: availability.message }
        } as never);
      }
    }

    try {
      await insertStockTransferLinesWithStyleVariants(getDatabaseClient(), {
        companyId,
        userId,
        stockTransferId: id,
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
        await flash(request, error(err, "Failed to insert line"))
      );
    }

    return redirect(
      path.to.stockTransfer(id),
      await flash(request, success("Line created"))
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
    quantity
  });
  if (!availability.ok) {
    return validationError({
      fieldErrors: { quantity: availability.message }
    } as never);
  }

  const insertStockTransferLine = await upsertStockTransferLine(client, {
    ...d,
    quantity,
    variantQuantities,
    companyId,
    createdBy: userId
  });
  if (insertStockTransferLine.error) {
    return data(
      {},
      await flash(
        request,
        error(insertStockTransferLine.error, "Failed to insert line")
      )
    );
  }

  return redirect(
    path.to.stockTransfer(id),
    await flash(request, success("Line created"))
  );
}

export default function NewStockTransferLinesRoute() {
  const { id } = useParams();
  if (!id) throw new Error("Could not find id");
  const navigate = useNavigate();
  const routeData = useRouteData<{
    stockTransfer: StockTransfer;
  }>(path.to.stockTransfer(id));

  if (!routeData?.stockTransfer?.locationId)
    throw new Error("No location found");

  const initialValues = {
    stockTransferId: id,
    itemId: "",
    quantity: 1,
    fromStorageUnitId: "",
    toStorageUnitId: ""
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
