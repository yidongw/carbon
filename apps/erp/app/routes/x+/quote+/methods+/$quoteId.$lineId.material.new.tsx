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

  const { quoteId, lineId } = params;
  if (!quoteId) {
    throw new Error("quoteId not found");
  }
  if (!lineId) {
    throw new Error("lineId not found");
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
      // Invalid JSON — create without expand.
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

  const insertOne = async (args: {
    id: string;
    itemId: string;
    quantity: number;
    order: number;
  }) => {
    const insertQuoteMaterial = await upsertQuoteMaterial(serviceRole, {
      ...d,
      id: args.id,
      itemId: args.itemId,
      quantity: args.quantity,
      order: args.order,
      quoteId,
      quoteLineId: lineId,
      companyId,
      createdBy: userId,
      customFields: setCustomFields(formData)
    });
    if (insertQuoteMaterial.error) {
      return {
        ok: false as const,
        response: data(
          { id: null },
          await flash(
            request,
            error(insertQuoteMaterial.error, "Failed to insert quote material")
          )
        )
      };
    }

    const quoteMaterialId = insertQuoteMaterial.data?.id;
    if (!quoteMaterialId) {
      return {
        ok: false as const,
        response: data(
          { id: null },
          await flash(
            request,
            error(insertQuoteMaterial, "Failed to insert quote material")
          )
        )
      };
    }

    if (d.methodType === "Make to Order") {
      const materialMakeMethod = await serviceRole
        .from("quoteMaterialWithMakeMethodId")
        .select("*")
        .eq("id", quoteMaterialId)
        .single();
      if (materialMakeMethod.error) {
        return {
          ok: false as const,
          response: data(
            { id: null },
            await flash(
              request,
              error(
                materialMakeMethod.error,
                "Failed to get material make method"
              )
            )
          )
        };
      }
      const makeMethod = await upsertQuoteMaterialMakeMethod(serviceRole, {
        sourceId: args.itemId,
        targetId: materialMakeMethod.data?.quoteMaterialMakeMethodId!,
        companyId,
        userId
      });

      if (makeMethod.error) {
        return {
          ok: false as const,
          response: data(
            { id: quoteMaterialId },
            await flash(
              request,
              error(
                makeMethod.error,
                "Failed to insert quote material make method"
              )
            )
          )
        };
      }
    }

    return { ok: true as const, id: quoteMaterialId };
  };

  if (resolved.mode === "expand") {
    let firstId: string | null = null;
    for (let i = 0; i < resolved.variants.length; i++) {
      const variant = resolved.variants[i];
      const inserted = await insertOne({
        id: i === 0 ? d.id : nanoid(),
        itemId: variant.variantItemId,
        quantity: variant.quantity,
        order: d.order + i
      });
      if (!inserted.ok) return inserted.response;
      if (i === 0) firstId = inserted.id;
    }

    await recalculateQuoteLinePrices(serviceRole, quoteId, lineId, userId);

    return {
      id: firstId,
      success: true,
      message: "Materials created"
    };
  }

  const inserted = await insertOne({
    id: d.id,
    itemId: d.itemId,
    quantity: resolved.quantity,
    order: d.order
  });
  if (!inserted.ok) return inserted.response;

  await recalculateQuoteLinePrices(serviceRole, quoteId, lineId, userId);

  return {
    id: inserted.id,
    success: true,
    message: "Material created"
  };
}
