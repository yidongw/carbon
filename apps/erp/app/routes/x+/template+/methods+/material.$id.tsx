import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { nanoid } from "nanoid";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  deleteTemplateMethodMaterial,
  methodMaterialValidator,
  upsertTemplateMethodMaterial
} from "~/modules/items";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import { setCustomFields } from "~/utils/form";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

  const { id } = params;
  if (!id) {
    throw new Error("id not found");
  }

  const formData = await request.formData();
  const validation = await validator(methodMaterialValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
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
      { id: null },
      await flash(request, error(resolved.error, resolved.error))
    );
  }

  if (resolved.mode === "expand") {
    // Replace this material with one row per variant SKU.
    await deleteTemplateMethodMaterial(client, id);
    const ids: string[] = [];
    for (let i = 0; i < resolved.variants.length; i++) {
      const variant = resolved.variants[i];
      const insertMethodMaterial = await upsertTemplateMethodMaterial(client, {
        ...d,
        id: nanoid(),
        itemId: variant.variantItemId,
        quantity: variant.quantity,
        order: d.order + i,
        companyId,
        createdBy: userId,
        customFields: setCustomFields(formData)
      });
      if (insertMethodMaterial.error) {
        return data(
          { id: null },
          await flash(
            request,
            error(
              insertMethodMaterial.error,
              "Failed to update method materials"
            )
          )
        );
      }
      if (insertMethodMaterial.data?.id) {
        ids.push(insertMethodMaterial.data.id);
      }
    }
    return {
      id: ids[0] ?? null,
      success: true,
      message: "Materials updated"
    };
  }

  const updateMethodMaterial = await upsertTemplateMethodMaterial(client, {
    ...d,
    id: id,
    quantity: resolved.quantity,
    companyId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updateMethodMaterial.error) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(updateMethodMaterial.error, "Failed to update method material")
      )
    );
  }

  const methodMaterialId = updateMethodMaterial.data?.id;
  if (!methodMaterialId) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(updateMethodMaterial, "Failed to update method material")
      )
    );
  }

  return {
    id: methodMaterialId,
    success: true,
    message: "Material updated"
  };
}
