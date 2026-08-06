import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import { jobConfigurationUpdateFields } from "~/modules/production/configTableOverlay.server";
import {
  getPurchaseOrder,
  isPurchaseOrderLocked,
  purchaseOrderLineValidator,
  upsertPurchaseOrderLine
} from "~/modules/purchasing";
import type { MethodItemType } from "~/modules/shared";
import { getUserDefaults } from "~/modules/users/users.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  // Bare URL (deep link / direct nav): redirect to the order with the overlay
  // open, so the form always renders as an overlay, never a full page.
  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newPurchaseOrderLine({ orderId }));
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    const details = path.to.purchaseOrderDetails(orderId);
    throw redirect(query ? `${details}?${query}` : details);
  }

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing"
  });

  const [purchaseOrder, defaults] = await Promise.all([
    getPurchaseOrder(client, orderId),
    getUserDefaults(client, userId, companyId)
  ]);

  if (purchaseOrder.error) {
    throw redirect(
      path.to.purchaseOrderDetails(orderId),
      await flash(
        request,
        error(purchaseOrder.error, "Failed to load purchase order")
      )
    );
  }

  await requireUnlocked({
    request,
    isLocked: isPurchaseOrderLocked(purchaseOrder.data?.status),
    redirectTo: path.to.purchaseOrderDetails(orderId),
    message: "Cannot modify a confirmed purchase order."
  });

  return {
    initialValues: {
      conversionFactor: 1,
      exchangeRate: purchaseOrder.data?.exchangeRate ?? 1,
      inventoryUnitOfMeasureCode: "",
      itemId: "",
      locationId:
        purchaseOrder.data?.locationId ?? defaults.data?.locationId ?? "",
      purchaseOrderId: orderId,
      purchaseOrderLineType: "Item" as MethodItemType,
      purchaseQuantity: 1,
      purchaseUnitOfMeasureCode: "",
      requiredDate: undefined,
      setupPrice: 0,
      storageUnitId: "",
      supplierShippingCost: 0,
      supplierTaxAmount: 0,
      supplierUnitPrice: 0
    }
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  // First check with view permission to verify PO status
  const { client: viewClient } = await requirePermissions(request, {
    view: "purchasing"
  });

  const purchaseOrder = await getPurchaseOrder(viewClient, orderId);
  if (purchaseOrder.error) {
    throw redirect(
      path.to.purchaseOrderDetails(orderId),
      await flash(
        request,
        error(purchaseOrder.error, "Failed to load purchase order")
      )
    );
  }

  await requireUnlocked({
    request,
    isLocked: isPurchaseOrderLocked(purchaseOrder.data?.status),
    redirectTo: path.to.purchaseOrderDetails(orderId),
    message: "Cannot modify a confirmed purchase order."
  });

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "purchasing"
  });

  const formData = await request.formData();
  const validation = await validator(purchaseOrderLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  // Omit `id` — create path must not send a client id.
  const {
    id: _id,
    configuration: configStr,
    purchaseQuantity: rawQuantity,
    ...d
  } = validation.data;

  let purchaseQuantity = rawQuantity;
  let configuration: Json | undefined;
  if (configStr) {
    try {
      const parsed = JSON.parse(configStr) as Record<string, unknown>;
      const fields = jobConfigurationUpdateFields(parsed);
      configuration = fields.configuration;
      purchaseQuantity = fields.quantity;
    } catch {
      // Invalid JSON — create without configuration; keep typed quantity.
    }
  }

  const createPurchaseOrderLine = await upsertPurchaseOrderLine(client, {
    ...d,
    purchaseQuantity,
    ...(configuration !== undefined ? { configuration } : {}),
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createPurchaseOrderLine.error) {
    if (isOverlay) {
      return data(
        { ok: false as const },
        await flash(
          request,
          error(
            createPurchaseOrderLine.error,
            "Failed to create purchase order line."
          )
        )
      );
    }
    throw redirect(
      path.to.purchaseOrderDetails(orderId),
      await flash(
        request,
        error(
          createPurchaseOrderLine.error,
          "Failed to create purchase order line."
        )
      )
    );
  }

  // The overlay host closes on `ok: true` and revalidates the order.
  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Purchase order line created"))
    );
  }

  throw redirect(path.to.purchaseOrderDetails(orderId));
}

export default function NewPurchaseOrderLineRoute() {
  return null;
}
