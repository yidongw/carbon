import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { type ActionFunctionArgs, redirect } from "react-router";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity
} from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import {
  getPurchasingRFQ,
  isRfqLocked,
  purchasingRfqLineValidator,
  replacePurchasingRfqLinesWithStyleVariants,
  upsertPurchasingRFQLine
} from "~/modules/purchasing";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client: viewClient } = await requirePermissions(request, {
    view: "purchasing"
  });
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing"
  });

  const { rfqId } = params;
  if (!rfqId) {
    throw new Error("rfqId not found");
  }

  const rfq = await getPurchasingRFQ(viewClient, rfqId);
  await requireUnlocked({
    request,
    isLocked: isRfqLocked(rfq.data?.status),
    redirectTo: path.to.purchasingRfq(rfqId),
    message: "Cannot modify a locked RFQ. Reopen it first."
  });

  const formData = await request.formData();
  const validation = await validator(purchasingRfqLineValidator).validate(
    formData
  );

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
      quantity = [fields.quantity];
    } catch {
      // Invalid JSON — create without variantQuantities; keep typed quantity.
    }
  }

  const serviceRole = getCarbonServiceRole();

  if (
    d.itemId &&
    variantQuantities &&
    hasStyleVariantsQuantity(variantQuantities)
  ) {
    const expanded = await expandVariantTableToLines(serviceRole, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities
    });
    if (!expanded.ok) {
      throw redirect(
        path.to.purchasingRfqDetails(rfqId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replacePurchasingRfqLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          purchasingRfqId: d.purchasingRfqId,
          variants: expanded.variants,
          base: {
            description: d.description,
            purchaseUnitOfMeasureCode: d.purchaseUnitOfMeasureCode,
            inventoryUnitOfMeasureCode: d.inventoryUnitOfMeasureCode,
            conversionFactor: d.conversionFactor
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        throw redirect(
          path.to.purchasingRfqDetails(rfqId),
          await flash(
            request,
            error(err, "Failed to create RFQ lines for style variants")
          )
        );
      }

      throw redirect(
        path.to.purchasingRfqDetails(rfqId),
        await flash(request, success("Variant quantities added"))
      );
    }

    quantity = [expanded.variants[0].quantity];
    variantQuantities = undefined;
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const insertLine = await upsertPurchasingRFQLine(client, {
    ...d,
    quantity,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });
  if (insertLine.error) {
    throw redirect(
      path.to.purchasingRfqDetails(rfqId),
      await flash(request, error(insertLine.error, "Failed to insert RFQ line"))
    );
  }

  const lineId = insertLine.data?.id;
  if (!lineId) {
    throw redirect(
      path.to.purchasingRfqDetails(rfqId),
      await flash(request, error(insertLine, "Failed to insert RFQ line"))
    );
  }

  throw redirect(path.to.purchasingRfqLine(rfqId, lineId));
}
