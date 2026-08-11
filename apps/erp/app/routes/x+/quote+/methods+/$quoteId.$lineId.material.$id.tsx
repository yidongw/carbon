import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { nanoid } from "nanoid";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import {
  deleteQuoteMaterial,
  quoteMaterialValidator,
  recalculateQuoteLinePrices,
  upsertQuoteMaterial,
  upsertQuoteMaterialMakeMethod
} from "~/modules/sales";
import { setCustomFields } from "~/utils/form";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const { quoteId, lineId, id } = params;
  if (!quoteId) {
    throw new Error("quoteId not found");
  }
  if (!lineId) {
    throw new Error("lineId not found");
  }
  if (!id) {
    throw new Error("id not found");
  }

  const formData = await request.formData();
  const validation = await validator(quoteMaterialValidator).validate(formData);

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

  const serviceRole = getCarbonServiceRole();
  const resolved = await resolveMaterialVariantQuantities(serviceRole, {
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
    await deleteQuoteMaterial(serviceRole, id);

    let firstId: string | null = null;
    let firstMethodType: string | null = null;

    for (let i = 0; i < resolved.variants.length; i++) {
      const variant = resolved.variants[i];
      const insertQuoteMaterial = await upsertQuoteMaterial(serviceRole, {
        ...d,
        id: nanoid(),
        itemId: variant.variantItemId,
        quantity: variant.quantity,
        order: d.order + i,
        quoteId,
        quoteLineId: lineId,
        companyId,
        createdBy: userId,
        customFields: setCustomFields(formData)
      });
      if (insertQuoteMaterial.error) {
        return data(
          { id: null },
          await flash(
            request,
            error(insertQuoteMaterial.error, "Failed to update quote materials")
          )
        );
      }

      const quoteMaterialId = insertQuoteMaterial.data?.id;
      if (!quoteMaterialId) {
        return data(
          { id: null },
          await flash(
            request,
            error(insertQuoteMaterial, "Failed to update quote materials")
          )
        );
      }

      if (i === 0) {
        firstId = quoteMaterialId;
        firstMethodType = insertQuoteMaterial.data.methodType;
      }

      if (d.methodType === "Make to Order") {
        const materialMakeMethod = await serviceRole
          .from("quoteMaterialWithMakeMethodId")
          .select("*")
          .eq("id", quoteMaterialId)
          .single();
        if (materialMakeMethod.error) {
          return data(
            { id: firstId },
            await flash(
              request,
              error(
                materialMakeMethod.error,
                "Failed to get material make method"
              )
            )
          );
        }
        const makeMethod = await upsertQuoteMaterialMakeMethod(serviceRole, {
          sourceId: variant.variantItemId,
          targetId: materialMakeMethod.data?.quoteMaterialMakeMethodId!,
          companyId,
          userId
        });
        if (makeMethod.error) {
          return data(
            { id: firstId },
            await flash(
              request,
              error(
                makeMethod.error,
                "Failed to insert quote material make method"
              )
            )
          );
        }
      }
    }

    await recalculateQuoteLinePrices(serviceRole, quoteId, lineId, userId);

    return {
      id: firstId,
      methodType: firstMethodType,
      success: true,
      message: "Materials updated"
    };
  }

  const updateQuoteMaterial = await upsertQuoteMaterial(serviceRole, {
    quoteId,
    quoteLineId: lineId,
    ...d,
    id: id,
    quantity: resolved.quantity,
    companyId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updateQuoteMaterial.error) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(updateQuoteMaterial.error, "Failed to update quote material")
      )
    );
  }

  const quoteMaterialId = updateQuoteMaterial.data?.id;
  if (!quoteMaterialId) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(updateQuoteMaterial, "Failed to update quote material")
      )
    );
  }

  await recalculateQuoteLinePrices(serviceRole, quoteId, lineId, userId);

  return {
    id: quoteMaterialId,
    methodType: updateQuoteMaterial.data.methodType,
    success: true,
    message: "Material updated"
  };
}
