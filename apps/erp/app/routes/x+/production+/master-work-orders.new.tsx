import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import {
  insertMasterWorkOrder,
  masterWorkOrderValidator
} from "~/modules/production";
import {
  isVariantsQuantityConfiguration,
  replaceJobVariantQuantitiesFromTable
} from "~/modules/production/jobVariantQuantity.service";
import { variantTableUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import { getDatabaseClient } from "~/services/database.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  // Bare URL (deep link / direct nav): redirect to the list with the overlay
  // open so the form always renders as an overlay, never a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newMasterWorkOrder());
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query ? `${path.to.masterWorkOrders}?${query}` : path.to.masterWorkOrders
    );
  }

  await requirePermissions(request, { view: "production" });

  return {
    initialValues: {
      itemId: "",
      quantity: 0,
      locationId: "",
      dueDate: "",
      deadlineType: "No Deadline" as const
    }
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const formData = await request.formData();
  const validation = await validator(masterWorkOrderValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    variantQuantities: variantQuantitiesStr,
    quantity: rawQuantity,
    ...rest
  } = validation.data;

  // Style qty grid → jobVariantQuantity (MWO is Style-only).
  let styleVariantsQuantity: Record<string, unknown> | undefined;
  let quantity = rawQuantity;
  if (variantQuantitiesStr) {
    try {
      const parsed = JSON.parse(variantQuantitiesStr) as Record<
        string,
        unknown
      >;
      if (isVariantsQuantityConfiguration(parsed)) {
        styleVariantsQuantity = parsed;
        quantity = variantTableUpdateFields(parsed).quantity;
      }
    } catch {
      // invalid JSON — keep the typed quantity
    }
  }

  const insert = await insertMasterWorkOrder(client, {
    ...rest,
    quantity,
    companyId,
    createdBy: userId
  });

  if (insert.error) {
    return data(
      { ok: false as const },
      await flash(
        request,
        error(insert.error, "Failed to create master work order")
      )
    );
  }

  if (styleVariantsQuantity && insert.data?.jobId) {
    const replaced = await replaceJobVariantQuantitiesFromTable(
      client,
      getDatabaseClient(),
      {
        jobId: insert.data.jobId,
        parentItemId: rest.itemId,
        companyId,
        userId,
        configuration: styleVariantsQuantity
      }
    );
    if (replaced.error) {
      return data(
        { ok: false as const },
        await flash(
          request,
          error(replaced.error, "Failed to save variant quantities")
        )
      );
    }
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Master work order created"))
    );
  }

  return redirect(
    path.to.masterWorkOrders,
    await flash(request, success("Master work order created"))
  );
}

export default function NewMasterWorkOrderRoute() {
  return null;
}
