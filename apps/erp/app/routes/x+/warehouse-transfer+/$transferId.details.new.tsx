import { requirePermissions } from "@carbon/auth/auth.server";
import type { Json } from "@carbon/database";
import { validationError } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useNavigate, useParams } from "react-router";
import { useRouteData } from "~/hooks";
import type {
  WarehouseTransfer,
  WarehouseTransferLine
} from "~/modules/inventory";
import {
  checkTransferLineAvailability,
  getWarehouseTransfer,
  insertWarehouseTransferLinesWithStyleVariants,
  isWarehouseTransferLocked,
  upsertWarehouseTransferLine,
  warehouseTransferLineValidator
} from "~/modules/inventory";
import { WarehouseTransferLineForm } from "~/modules/inventory/ui/WarehouseTransfers";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import { variantTableUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import { getDatabaseClient } from "~/services/database.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "inventory"
  });

  const { transferId } = params;
  if (!transferId) {
    throw new Error("transferId not found");
  }

  const { client: viewClient } = await requirePermissions(request, {
    view: "inventory"
  });
  const transfer = await getWarehouseTransfer(viewClient, transferId);
  await requireUnlocked({
    request,
    isLocked: isWarehouseTransferLocked(transfer.data?.status),
    redirectTo: path.to.warehouseTransfer(transferId),
    message: "Cannot modify a locked warehouse transfer. Reopen it first."
  });

  const formData = await request.formData();
  const validation = warehouseTransferLineValidator.safeParse(
    Object.fromEntries(formData)
  );

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid form data"
    };
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
      const fields = variantTableUpdateFields(parsed);
      variantQuantities = fields.configuration;
      quantity = fields.quantity;
    } catch {
      // invalid JSON — keep the typed quantity
    }
  }

  // Style/Consumable parent + variantTable → one warehouse-transfer line per variant SKU.
  // variantTableUpdateFields bridges the shared modal payload (still named
  // `configuration`) into variantQuantities for inventory lines.
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
        locationId: transfer.data?.fromLocationId ?? d.fromLocationId,
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
      await insertWarehouseTransferLinesWithStyleVariants(getDatabaseClient(), {
        companyId,
        userId,
        transferId,
        fromLocationId: d.fromLocationId,
        toLocationId: d.toLocationId,
        fromStorageUnitId: d.fromStorageUnitId,
        toStorageUnitId: d.toStorageUnitId,
        notes: d.notes,
        variants: expanded.variants.map((v) => ({
          variantItemId: v.variantItemId,
          quantity: v.quantity
        }))
      });
    } catch {
      return {
        success: false,
        message: "Failed to create warehouse transfer line"
      };
    }

    return redirect(path.to.warehouseTransfer(transferId));
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
    locationId: transfer.data?.fromLocationId ?? d.fromLocationId,
    itemId: d.itemId,
    fromStorageUnitId: d.fromStorageUnitId || null,
    quantity
  });
  if (!availability.ok) {
    return validationError({
      fieldErrors: { quantity: availability.message }
    } as never);
  }

  const createWarehouseTransferLine = await upsertWarehouseTransferLine(
    client,
    {
      ...d,
      quantity,
      variantQuantities,
      companyId: companyId,
      createdBy: userId
    }
  );

  if (createWarehouseTransferLine.error) {
    return {
      success: false,
      message: "Failed to create warehouse transfer line"
    };
  }

  return redirect(path.to.warehouseTransfer(transferId));
}

export default function NewWarehouseTransferLineRoute() {
  const navigate = useNavigate();
  const { transferId } = useParams();

  if (!transferId) throw new Error("Could not find transferId");

  const routeData = useRouteData<{
    warehouseTransfer: WarehouseTransfer;
    warehouseTransferLines: WarehouseTransferLine[];
  }>(path.to.warehouseTransfer(transferId));

  if (!routeData?.warehouseTransfer) {
    throw new Error("Could not find warehouse transfer in routeData");
  }

  const initialValues = {
    type: "create" as const,
    transferId,
    fromLocationId: routeData.warehouseTransfer.fromLocationId,
    toLocationId: routeData.warehouseTransfer.toLocationId,
    itemId: "",
    quantity: 1,
    fromStorageUnitId: "",
    toStorageUnitId: "",
    unitOfMeasureCode: "",
    notes: ""
  };

  return (
    <WarehouseTransferLineForm
      initialValues={initialValues}
      warehouseTransfer={routeData.warehouseTransfer}
      onClose={() => navigate(path.to.warehouseTransfer(transferId))}
    />
  );
}
