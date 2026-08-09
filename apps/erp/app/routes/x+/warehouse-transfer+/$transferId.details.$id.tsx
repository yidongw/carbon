import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  data,
  redirect,
  useLoaderData,
  useNavigate,
  useParams
} from "react-router";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  checkTransferLineAvailability,
  deleteWarehouseTransferLine,
  getWarehouseTransfer,
  getWarehouseTransferLine,
  isWarehouseTransferLocked,
  replaceWarehouseTransferLineWithStyleVariants,
  upsertWarehouseTransferLine,
  WarehouseTransferLineForm
} from "~/modules/inventory";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import { variantTableUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import { getDatabaseClient } from "~/services/database.server";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

const warehouseTransferLineActionValidator = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("create"),
    transferId: z.string().min(1),
    itemId: z.string().min(1),
    quantity: zfd.numeric(z.number().min(0.0001)),
    fromStorageUnitId: zfd.text(z.string().optional()),
    toStorageUnitId: zfd.text(z.string().optional()),
    notes: zfd.text(z.string().optional()),
    variantQuantities: zfd.text(z.string().optional())
  }),
  z.object({
    type: z.literal("update"),
    id: z.string().min(1),
    quantity: zfd.numeric(z.number().min(0.0001)),
    fromStorageUnitId: zfd.text(z.string().optional()),
    toStorageUnitId: zfd.text(z.string().optional()),
    notes: zfd.text(z.string().optional()),
    variantQuantities: zfd.text(z.string().optional())
  }),
  z.object({
    type: z.literal("delete"),
    id: z.string().min(1)
  })
]);

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "inventory"
  });

  const { transferId, id } = params;
  if (!transferId) throw new Error("transferId not found");
  if (!id) throw new Error("id not found");

  const warehouseTransferLine = await getWarehouseTransferLine(
    client,
    transferId,
    id
  );
  if (warehouseTransferLine.error) {
    throw redirect(
      path.to.warehouseTransferDetails(transferId),
      await flash(
        request,
        error(
          warehouseTransferLine.error,
          "Failed to load warehouse transfer line"
        )
      )
    );
  }

  return { warehouseTransferLine: warehouseTransferLine.data };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "inventory"
  });

  const { transferId, id } = params;
  if (!transferId) throw new Error("transferId not found");
  if (!id) throw new Error("id not found");

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
  const validation = await validator(
    warehouseTransferLineActionValidator
  ).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { type, ...d } = validation.data;

  switch (type) {
    case "update": {
      // The update payload doesn't carry itemId (item is fixed on edit), so read
      // it from the existing line to check availability at the new quantity/bin.
      const existingLine = await getWarehouseTransferLine(
        viewClient,
        transferId,
        id
      );
      const updateData = d as {
        quantity: number;
        fromStorageUnitId?: string;
        variantQuantities?: string;
      };

      let variantQuantities: Json | undefined;
      let quantity = updateData.quantity;
      if (updateData.variantQuantities) {
        try {
          const parsed = JSON.parse(updateData.variantQuantities) as Record<
            string,
            unknown
          >;
          const fields = variantTableUpdateFields(parsed);
          variantQuantities = fields.configuration;
          quantity = fields.quantity;
        } catch {
          // invalid JSON — keep the typed quantity
        }
      }

      const { variantQuantities: _configStr, ...rest } = updateData;
      const parentItemId = existingLine.data?.itemId ?? "";

      if (hasStyleVariantsQuantity(variantQuantities)) {
        const expanded = await expandVariantTableToLines(client, {
          parentItemId,
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
            locationId: transfer.data?.fromLocationId ?? "",
            itemId: v.variantItemId,
            fromStorageUnitId: updateData.fromStorageUnitId || null,
            quantity: v.quantity,
            excludeLineId: id
          });
          if (!availability.ok) {
            return validationError({
              fieldErrors: { quantity: availability.message }
            } as never);
          }
        }

        try {
          await replaceWarehouseTransferLineWithStyleVariants(
            getDatabaseClient(),
            {
              companyId,
              userId,
              transferId,
              replaceLineId: id,
              fromLocationId:
                existingLine.data?.fromLocationId ??
                transfer.data?.fromLocationId ??
                "",
              toLocationId:
                existingLine.data?.toLocationId ??
                transfer.data?.toLocationId ??
                "",
              fromStorageUnitId: updateData.fromStorageUnitId,
              toStorageUnitId: (rest as { toStorageUnitId?: string })
                .toStorageUnitId,
              notes: (rest as { notes?: string }).notes,
              variants: expanded.variants.map((v) => ({
                variantItemId: v.variantItemId,
                quantity: v.quantity
              }))
            }
          );
        } catch (err) {
          return data(
            { error: err },
            await flash(
              request,
              error(err, "Failed to update warehouse transfer line")
            )
          );
        }

        throw redirect(
          path.to.warehouseTransferDetails(transferId),
          await flash(request, success("Updated warehouse transfer line"))
        );
      }

      const required = await requireVariantQuantitiesIfAttributeParent(client, {
        parentItemId,
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
        locationId: transfer.data?.fromLocationId ?? "",
        itemId: parentItemId,
        fromStorageUnitId: updateData.fromStorageUnitId || null,
        quantity,
        excludeLineId: id
      });
      if (!availability.ok) {
        return validationError({
          fieldErrors: { quantity: availability.message }
        } as never);
      }

      const result = await upsertWarehouseTransferLine(client, {
        id,
        ...rest,
        quantity,
        variantQuantities,
        transferId,
        companyId,
        updatedBy: userId
      });

      if (result.error) {
        return data(
          { error: result.error },
          await flash(
            request,
            error(result.error, "Failed to update warehouse transfer line")
          )
        );
      }

      throw redirect(
        path.to.warehouseTransferDetails(transferId),
        await flash(request, success("Updated warehouse transfer line"))
      );
    }

    case "delete": {
      const result = await deleteWarehouseTransferLine(client, id);

      if (result.error) {
        return data(
          { error: result.error },
          await flash(
            request,
            error(result.error, "Failed to delete warehouse transfer line")
          )
        );
      }

      throw redirect(
        path.to.warehouseTransferDetails(transferId),
        await flash(request, success("Deleted warehouse transfer line"))
      );
    }

    default:
      throw redirect(
        path.to.warehouseTransferDetails(transferId),
        await flash(
          request,
          error("Invalid action type", "Invalid action type")
        )
      );
  }
}

export default function WarehouseTransferLineDetailsRoute() {
  const params = useParams();
  const { transferId, id } = params;
  if (!transferId) throw new Error("transferId not found");
  if (!id) throw new Error("id not found");

  const { warehouseTransferLine } = useLoaderData<typeof loader>();
  const initialValues = {
    type: "update" as const,
    id,
    transferId,
    itemId: warehouseTransferLine.itemId ?? "",
    fromLocationId:
      warehouseTransferLine.warehouseTransfer?.fromLocationId ?? "",
    toLocationId: warehouseTransferLine.warehouseTransfer?.toLocationId ?? "",
    quantity: warehouseTransferLine.quantity ?? 1,
    fromStorageUnitId: warehouseTransferLine.fromStorageUnitId ?? "",
    toStorageUnitId: warehouseTransferLine.toStorageUnitId ?? "",
    notes: warehouseTransferLine.notes ?? "",
    variantQuantities: warehouseTransferLine.variantQuantities
      ? JSON.stringify(warehouseTransferLine.variantQuantities)
      : undefined
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 pb-16 w-full">
      <WarehouseTransferLineForm
        key={initialValues.id}
        initialValues={initialValues}
        warehouseTransfer={warehouseTransferLine.warehouseTransfer!}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}
