import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity
} from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import {
  getSupplierQuote,
  isSupplierQuoteLocked,
  replaceSupplierQuoteLinesWithStyleVariants,
  supplierQuoteLineValidator,
  upsertSupplierQuoteLine
} from "~/modules/purchasing";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    create: "purchasing"
  });

  const { id: supplierQuoteId } = params;
  if (!supplierQuoteId) throw new Error("Could not find supplierQuoteId");

  const { client: viewClient } = await requirePermissions(request, {
    view: "purchasing"
  });
  const quote = await getSupplierQuote(viewClient, supplierQuoteId);
  await requireUnlocked({
    request,
    isLocked: isSupplierQuoteLocked(quote.data?.status),
    redirectTo: path.to.supplierQuote(supplierQuoteId),
    message: "Cannot modify a locked supplier quote. Reopen it first."
  });

  const formData = await request.formData();
  const validation = await validator(supplierQuoteLineValidator).validate(
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
      // Supplier quote quantity is numeric[] (price breaks); map grid total
      // into a single-tier array until expand replaces the parent line.
      quantity = [fields.quantity];
    } catch {
      // Invalid JSON — create without variantQuantities; keep typed quantity.
    }
  }

  const serviceRole = getCarbonServiceRole();

  // FormData variantTable means the per-variant quantity grid was used (Style
  // variants quantity, or a Consumable color set) — expand into variant SKU lines
  // regardless of the picker's line type.
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
        path.to.supplierQuote(supplierQuoteId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replaceSupplierQuoteLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          supplierQuoteId: d.supplierQuoteId,
          variants: expanded.variants,
          base: {
            supplierQuoteLineType: d.supplierQuoteLineType,
            description: d.description,
            supplierPartId: d.supplierPartId,
            purchaseUnitOfMeasureCode: d.purchaseUnitOfMeasureCode,
            inventoryUnitOfMeasureCode: d.inventoryUnitOfMeasureCode,
            conversionFactor: d.conversionFactor,
            requiredDate: d.requiredDate,
            accountId: d.accountId,
            costCenterId: d.costCenterId
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        throw redirect(
          path.to.supplierQuote(supplierQuoteId),
          await flash(
            request,
            error(
              err,
              "Failed to create supplier quote lines for style variants"
            )
          )
        );
      }

      throw redirect(
        path.to.supplierQuote(supplierQuoteId),
        await flash(request, success("Variant quantities added"))
      );
    }

    quantity = [expanded.variants[0].quantity];
    variantQuantities = undefined;
  }

  // FormData `variantQuantities` is expand-only; never persist on the line.
  const createQuotationLine = await upsertSupplierQuoteLine(serviceRole, {
    ...d,
    quantity,
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createQuotationLine.error) {
    throw redirect(
      path.to.supplierQuote(supplierQuoteId),
      await flash(
        request,
        error(createQuotationLine.error, "Failed to create quote line.")
      )
    );
  }

  const quoteLineId = createQuotationLine.data.id;

  throw redirect(path.to.supplierQuoteLine(supplierQuoteId, quoteLineId));
}
