import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
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
  getSalesRFQ,
  isSalesRfqLocked,
  salesRfqLineValidator,
  upsertSalesRFQLine
} from "~/modules/sales";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { rfqId } = params;
  if (!rfqId) {
    throw new Error("rfqId not found");
  }

  const { client: viewClient } = await requirePermissions(request, {
    view: "sales"
  });

  const rfq = await getSalesRFQ(viewClient, rfqId);
  await requireUnlocked({
    request,
    isLocked: isSalesRfqLocked(rfq.data?.status),
    redirectTo: path.to.salesRfq(rfqId),
    message: "Cannot modify a locked RFQ. Reopen it first."
  });

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const formData = await request.formData();
  const validation = await validator(salesRfqLineValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    variantQuantities: variantQuantitiesFromValidator,
    configuration: _configurationFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let quantity = rawQuantity;
  let configuration: Json | undefined;

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

  const insertLine = await upsertSalesRFQLine(client, {
    ...d,
    quantity,
    ...(configuration !== undefined ? { configuration } : {}),
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });
  if (insertLine.error) {
    throw redirect(
      path.to.salesRfq(rfqId),
      await flash(request, error(insertLine.error, "Failed to insert RFQ line"))
    );
  }

  const lineId = insertLine.data?.id;
  if (!lineId) {
    throw redirect(
      path.to.salesRfq(rfqId),
      await flash(request, error(insertLine, "Failed to insert RFQ line"))
    );
  }

  throw redirect(path.to.salesRfqLine(rfqId, lineId));
}
