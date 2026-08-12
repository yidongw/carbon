import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { hasStyleVariantsQuantity } from "~/modules/items/styleOrderLines.server";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import {
  getQuote,
  isQuoteLocked,
  quoteLineValidator,
  recalculateQuoteLinePrices,
  resolvePurchaseToOrderPrices,
  resolveQuoteLinePrices,
  upsertQuoteLine,
  upsertQuoteLineMethod
} from "~/modules/sales";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const { quoteId } = params;
  if (!quoteId) throw new Error("Could not find quoteId");

  const { client: viewClient } = await requirePermissions(request, {
    view: "sales"
  });
  const quote = await getQuote(viewClient, quoteId);
  await requireUnlocked({
    request,
    isLocked: isQuoteLocked(quote.data?.status),
    redirectTo: path.to.quote(quoteId),
    message: "Cannot modify a locked quote. Reopen it first."
  });

  const formData = await request.formData();
  const validation = await validator(quoteLineValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: variantQuantitiesFromValidator,
    configuration: configurationFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let quantity = rawQuantity;
  // Part method params vs Style variantTable — both live on quoteLine.configuration.
  // Convert expands Style lines via hasVariantsQuantityTable(line.configuration).
  let configuration: Json | undefined;
  let methodConfiguration: Record<string, unknown> | undefined;

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
      if (hasStyleVariantsQuantity(fields.variantQuantities)) {
        configuration = fields.variantQuantities;
        quantity = [fields.quantity];
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (
    !configuration &&
    configurationFromValidator &&
    typeof configurationFromValidator === "string"
  ) {
    try {
      configuration = JSON.parse(configurationFromValidator);
      methodConfiguration = configuration as Record<string, unknown>;
    } catch (err) {
      console.error(err);
    }
  } else if (
    configuration &&
    !hasStyleVariantsQuantity(configuration) &&
    typeof configuration === "object"
  ) {
    methodConfiguration = configuration as Record<string, unknown>;
  }

  const serviceRole = getCarbonServiceRole();
  const createQuotationLine = await upsertQuoteLine(serviceRole, {
    ...d,
    quantity,
    companyId,
    configuration,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createQuotationLine.error) {
    throw redirect(
      path.to.quote(quoteId),
      await flash(
        request,
        error(createQuotationLine.error, "Failed to create quote line.")
      )
    );
  }

  const quoteLineId = createQuotationLine.data.id;

  if (d.methodType === "Purchase to Order") {
    const quantities = quantity ?? [1];
    const priceResult = await resolvePurchaseToOrderPrices(
      serviceRole,
      companyId,
      quoteId,
      quoteLineId,
      quantities,
      userId
    );
    if (priceResult?.error) {
      throw redirect(
        path.to.quoteLine(quoteId, quoteLineId),
        await flash(
          request,
          error(priceResult.error, "Failed to resolve Purchase to Order prices")
        )
      );
    }
  }

  if (d.methodType === "Pull from Inventory") {
    const quantities = quantity ?? [1];
    const priceResult = await resolveQuoteLinePrices(
      serviceRole,
      companyId,
      quoteId,
      quoteLineId,
      quantities,
      userId
    );
    if (priceResult?.error) {
      throw redirect(
        path.to.quoteLine(quoteId, quoteLineId),
        await flash(
          request,
          error(
            priceResult.error,
            "Failed to resolve Pull from Inventory prices"
          )
        )
      );
    }
  }

  if (d.methodType === "Make to Order") {
    const upsertMethod = await upsertQuoteLineMethod(serviceRole, {
      quoteId,
      quoteLineId,
      itemId: d.itemId,
      // Style variantTable is line-level only — never Part method params.
      configuration: methodConfiguration,
      companyId,
      userId
    });

    if (upsertMethod.error) {
      throw redirect(
        path.to.quoteLine(quoteId, quoteLineId),
        await flash(
          request,
          error(upsertMethod.error, "Failed to create quote line method.")
        )
      );
    }
    const recalcResult = await recalculateQuoteLinePrices(
      serviceRole,
      quoteId,
      quoteLineId,
      userId
    );
    if (recalcResult?.error) {
      throw redirect(
        path.to.quoteLine(quoteId, quoteLineId),
        await flash(
          request,
          error(recalcResult.error, "Failed to recalculate quote line prices")
        )
      );
    }
  }

  throw redirect(path.to.quoteLine(quoteId, quoteLineId));
}
