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
import {
  expandStyleConfigToVariantLines,
  hasStyleVariantsQuantity
} from "~/modules/items/styleOrderLines.server";
import { jobConfigurationUpdateFields } from "~/modules/production/variantsQuantityOverlay.server";
import type { SalesOrderLineType } from "~/modules/sales";
import {
  getCustomer,
  getSalesOrder,
  isSalesOrderLocked,
  replaceSalesOrderLinesWithStyleVariants,
  salesOrderLineValidator,
  upsertSalesOrderLine
} from "~/modules/sales";
import { getDatabaseClient } from "~/services/database.server";
import { setCustomFields } from "~/utils/form";
import { requireUnlocked } from "~/utils/lockedGuard.server";
import { path } from "~/utils/path";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";

  // Bare URL: redirect to the order details with the overlay open so the form
  // always renders as an overlay, never a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newSalesOrderLine({ orderId }));
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    throw redirect(
      query
        ? `${path.to.salesOrderDetails(orderId)}?${query}`
        : path.to.salesOrderDetails(orderId)
    );
  }

  const { client, userId, companyId } = await requirePermissions(request, {
    view: "sales"
  });

  const salesOrder = await getSalesOrder(client, orderId);
  if (salesOrder.error || !salesOrder.data) {
    throw redirect(
      path.to.salesOrders,
      await flash(
        request,
        error(salesOrder.error, "Failed to load sales order")
      )
    );
  }

  const customer = salesOrder.data.customerId
    ? await getCustomer(client, salesOrder.data.customerId)
    : null;

  const { getUserDefaults } = await import("~/modules/users/users.server");
  const defaults = await getUserDefaults(client, userId, companyId);

  return {
    initialValues: {
      salesOrderId: orderId,
      salesOrderLineType: "Style" as SalesOrderLineType,
      itemId: "",
      saleQuantity: 0,
      setupPrice: 0,
      storageUnitId: "",
      unitOfMeasureCode: "",
      unitPrice: 0,
      addOnCost: 0,
      nonTaxableAddOnCost: 0,
      locationId: salesOrder.data.locationId ?? defaults.data?.locationId ?? "",
      taxPercent: customer?.data?.taxPercent ?? 0,
      promisedDate:
        salesOrder.data.receiptPromisedDate ??
        salesOrder.data.receiptRequestedDate ??
        "",
      shippingCost: 0
    }
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const { client: viewClient } = await requirePermissions(request, {
    view: "sales"
  });

  const salesOrder = await getSalesOrder(viewClient, orderId);
  await requireUnlocked({
    request,
    isLocked: isSalesOrderLocked(salesOrder.data?.status),
    redirectTo: path.to.salesOrderDetails(orderId),
    message: "Cannot add lines to a locked sales order. Reopen it first."
  });

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "sales"
  });

  const formData = await request.formData();
  const validation = await validator(salesOrderLineValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id: _id,
    configuration: configStr,
    saleQuantity: rawQuantity,
    ...d
  } = validation.data;

  if (d.salesOrderLineType === "Comment") {
    d.accountId = undefined;
    d.assetId = undefined;
    d.itemId = undefined;
  } else if (d.salesOrderLineType === "Fixed Asset") {
    d.accountId = undefined;
    d.itemId = undefined;
  } else {
    d.accountId = undefined;
    d.assetId = undefined;
  }

  let configuration: Json | undefined;
  let saleQuantity = rawQuantity;
  if (configStr) {
    try {
      const parsed = JSON.parse(configStr) as Record<string, unknown>;
      const fields = jobConfigurationUpdateFields(parsed);
      configuration = fields.configuration;
      saleQuantity = fields.quantity;
    } catch {
      // Invalid JSON — create without configuration; keep typed quantity.
    }
  }

  // A stored config table means the per-variant quantity grid was used (Style
  // variants quantity, or a Consumable color set) → one line per variant SKU
  // (inventory identity), regardless of the picker's line type.
  if (d.itemId && configuration && hasStyleVariantsQuantity(configuration)) {
    const expanded = await expandStyleConfigToVariantLines(client, {
      parentItemId: d.itemId,
      companyId,
      variantQuantities: configuration
    });
    if (!expanded.ok) {
      if (isOverlay) {
        return data(
          { ok: false as const, error: expanded.error },
          await flash(request, error(expanded.error, expanded.error))
        );
      }
      throw redirect(
        path.to.salesOrderDetails(orderId),
        await flash(request, error(expanded.error, expanded.error))
      );
    }

    const onlyParent =
      expanded.variants.length === 1 &&
      expanded.variants[0].variantItemId === d.itemId;

    if (!onlyParent) {
      try {
        await replaceSalesOrderLinesWithStyleVariants(getDatabaseClient(), {
          companyId,
          userId,
          salesOrderId: d.salesOrderId,
          exchangeRate: salesOrder.data?.exchangeRate ?? 1,
          variants: expanded.variants,
          base: {
            salesOrderLineType: d.salesOrderLineType,
            description: d.description,
            locationId: d.locationId,
            storageUnitId: d.storageUnitId,
            methodType: d.methodType,
            unitOfMeasureCode: d.unitOfMeasureCode,
            unitPrice: d.unitPrice,
            setupPrice: d.setupPrice,
            shippingCost: d.shippingCost,
            addOnCost: d.addOnCost,
            nonTaxableAddOnCost: d.nonTaxableAddOnCost,
            taxPercent: d.taxPercent,
            promisedDate: d.promisedDate
          },
          customFields: setCustomFields(formData)
        });
      } catch (err) {
        if (isOverlay) {
          return data(
            {
              ok: false as const,
              error: "Failed to create sales order lines for style variants"
            },
            await flash(
              request,
              error(
                err,
                "Failed to create sales order lines for style variants"
              )
            )
          );
        }
        throw redirect(
          path.to.salesOrderDetails(orderId),
          await flash(
            request,
            error(err, "Failed to create sales order lines for style variants")
          )
        );
      }

      if (isOverlay) {
        return data(
          { ok: true as const },
          await flash(request, success("Sales order lines created"))
        );
      }
      throw redirect(
        path.to.salesOrderDetails(orderId),
        await flash(request, success("Sales order lines created"))
      );
    }

    // Single parent SKU (no children) — fall through to one-line upsert.
    saleQuantity = expanded.variants[0].quantity;
    configuration = undefined;
  }

  const createSalesOrderLine = await upsertSalesOrderLine(client, {
    ...d,
    saleQuantity,
    ...(configuration !== undefined ? { configuration } : {}),
    companyId,
    createdBy: userId,
    customFields: setCustomFields(formData)
  });

  if (createSalesOrderLine.error) {
    if (isOverlay) {
      const detail =
        typeof createSalesOrderLine.error === "object" &&
        createSalesOrderLine.error !== null &&
        "message" in createSalesOrderLine.error &&
        typeof createSalesOrderLine.error.message === "string"
          ? createSalesOrderLine.error.message
          : "Failed to create sales order line";
      return data(
        // The overlay host reports this payload directly; without a message it
        // can only show a generic failure, so the reason has to travel with it.
        { ok: false as const, error: detail },
        await flash(
          request,
          error(
            createSalesOrderLine.error,
            "Failed to create sales order line."
          )
        )
      );
    }
    throw redirect(
      path.to.salesOrderDetails(orderId),
      await flash(
        request,
        error(createSalesOrderLine.error, "Failed to create sales order line.")
      )
    );
  }

  if (isOverlay) {
    return data(
      { ok: true as const },
      await flash(request, success("Sales order line created"))
    );
  }

  throw redirect(
    path.to.salesOrderDetails(orderId),
    await flash(request, success("Sales order line created"))
  );
}

export default function NewSalesOrderLineRoute() {
  return null;
}
