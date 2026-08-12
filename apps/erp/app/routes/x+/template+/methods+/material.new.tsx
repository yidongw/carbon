import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { nanoid } from "nanoid";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  methodMaterialValidator,
  upsertTemplateMethodMaterial
} from "~/modules/items";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import { setCustomFields } from "~/utils/form";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "parts"
  });

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
      { id: null },
      await flash(request, error(resolved.error, resolved.error))
    );
  }

  if (resolved.mode === "expand") {
    const ids: string[] = [];
    for (let i = 0; i < resolved.variants.length; i++) {
      const variant = resolved.variants[i];
      const insertMethodMaterial = await upsertTemplateMethodMaterial(client, {
        ...d,
        id: i === 0 ? d.id : nanoid(),
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
              "Failed to insert method materials"
            )
          )
        );
      }
      if (insertMethodMaterial.data?.id) {
        ids.push(insertMethodMaterial.data.id);
      }
    }
    const firstId = ids[0] ?? null;
    if (!firstId) {
      return data(
        { id: null },
        await flash(request, error(null, "Failed to insert method materials"))
      );
    }
    return {
      id: firstId,
      success: true,
      message: "Materials created"
    };
  }

  const insertMethodMaterial = await upsertTemplateMethodMaterial(client, {
    ...d,
    quantity: resolved.quantity,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (insertMethodMaterial.error) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(insertMethodMaterial.error, "Failed to insert method material")
      )
    );
  }

  const methodMaterialId = insertMethodMaterial.data?.id;
  if (!methodMaterialId) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(insertMethodMaterial, "Failed to insert method material")
      )
    );
  }

  return {
    id: methodMaterialId,
    success: true,
    message: "Material created"
  };
}
