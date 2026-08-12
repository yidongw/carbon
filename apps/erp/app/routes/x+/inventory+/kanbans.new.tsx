import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect, useNavigate, useSearchParams } from "react-router";
import { useUser } from "~/hooks";
import { KanbanForm, kanbanValidator, upsertKanban } from "~/modules/inventory";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import { getParams, path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "inventory"
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const formData = await request.formData();

  const validation = await validator(kanbanValidator).validate(formData);

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
      // Invalid JSON — create without expand.
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
            error(createKanban.error, "Failed to insert kanban")
          )
        );
      }
    }
    throw redirect(
      `${path.to.kanbans}?${getParams(request)}`,
      await flash(request, success("Kanbans created"))
    );
  }

  const createKanban = await upsertKanban(client, {
    ...d,
    quantity: resolved.quantity,
    companyId,
    createdBy: userId
  });

  if (createKanban.error) {
    return data(
      {},
      await flash(request, error(createKanban.error, "Failed to insert kanban"))
    );
  }

  throw redirect(
    `${path.to.kanbans}?${getParams(request)}`,
    await flash(request, success("Kanban created"))
  );
}

export default function NewKanbanRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { defaults } = useUser();
  const locationId =
    (searchParams.get("location") || defaults.locationId) ?? "";

  const initialValues = {
    itemId: "",
    quantity: 1,
    replenishmentSystem: "Buy" as const,
    locationId,
    conversionFactor: 1,
    autoRelease: false,
    autoStartJob: false,
    completedBarcodeOverride: ""
  };

  return (
    <KanbanForm
      initialValues={initialValues}
      locationId={locationId}
      onClose={() => navigate(-1)}
    />
  );
}
