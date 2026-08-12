import { assertIsPost, error, notFound, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useLoaderData, useNavigate } from "react-router";
import {
  deleteKanban,
  getKanban,
  KanbanForm,
  kanbanValidator,
  upsertKanban
} from "~/modules/inventory";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
    role: "employee"
  });

  const { id } = params;
  if (!id) throw notFound("id not found");

  const kanban = await getKanban(client, id);

  return {
    kanban: kanban?.data ?? null
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    update: "inventory"
  });

  const { id: routeId } = params;
  if (!routeId) throw notFound("id not found");

  const formData = await request.formData();
  const validation = await validator(kanbanValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id,
    variantQuantities: variantQuantitiesFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;
  if (!id) throw new Error("id not found");

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
      // Invalid JSON — update without expand.
    }
  }

  const resolved = await resolveMaterialVariantQuantities(client, {
    companyId,
    itemId: d.itemId,
    quantity,
    variantQuantities
  });
  if (!resolved.ok) {
    return data(
      {},
      await flash(request, error(resolved.error, resolved.error))
    );
  }

  if (resolved.mode === "expand") {
    await deleteKanban(client, id);
    for (const variant of resolved.variants) {
      const createKanban = await upsertKanban(client, {
        ...d,
        itemId: variant.variantItemId,
        quantity: variant.quantity,
        companyId,
        createdBy: userId
      });
      if (createKanban.error) {
        return data(
          {},
          await flash(
            request,
            error(createKanban.error, "Failed to update kanban")
          )
        );
      }
    }
    throw redirect(
      `${path.to.kanbans}?${getParams(request)}`,
      await flash(request, success("Kanbans updated"))
    );
  }

  const updateKanban = await upsertKanban(client, {
    id,
    ...d,
    quantity: resolved.quantity,
    updatedBy: userId
  });

  if (updateKanban.error) {
    return data(
      {},
      await flash(request, error(updateKanban.error, "Failed to update kanban"))
    );
  }

  throw redirect(
    `${path.to.kanbans}?${getParams(request)}`,
    await flash(request, success("Updated kanban"))
  );
}

export default function EditKanbanRoute() {
  const { kanban } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const initialValues = {
    id: kanban?.id ?? undefined,
    itemId: kanban?.itemId ?? "",
    quantity: kanban?.quantity ?? 1,
    replenishmentSystem: kanban?.replenishmentSystem ?? "Buy",
    locationId: kanban?.locationId ?? "",
    storageUnitId: kanban?.storageUnitId ?? "",
    supplierId: kanban?.supplierId ?? "",
    purchaseUnitOfMeasureCode: kanban?.purchaseUnitOfMeasureCode ?? "",
    conversionFactor: kanban?.conversionFactor ?? 1,
    autoRelease: kanban?.autoRelease ?? false,
    autoStartJob: kanban?.autoStartJob ?? false,
    completedBarcodeOverride: kanban?.completedBarcodeOverride ?? ""
  };

  return (
    <KanbanForm
      key={initialValues.id}
      initialValues={initialValues}
      locationId={initialValues.locationId}
      onClose={() => navigate(-1)}
    />
  );
}
