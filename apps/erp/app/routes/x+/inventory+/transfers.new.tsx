import { assertIsPost, error, success } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import { validationError, validator } from "@carbon/form";
import type {
  ActionFunctionArgs,
  ClientActionFunctionArgs,
  LoaderFunctionArgs
} from "react-router";
import { data, redirect } from "react-router";
import {
  OVERLAY_PARAM,
  overlay,
  overlayToken,
  serializeSearch
} from "~/components/Overlay/overlay";
import {
  getInventoryItems,
  getOpenTransferCommitments,
  getTransferStockForItem,
  insertStockTransfer,
  insertWarehouseTransfer,
  newTransferValidator,
  resolveOrCreatePartnerLocation,
  upsertWarehouseTransferLine
} from "~/modules/inventory";
import type { TransferItem } from "~/modules/inventory/ui/Transfers/TransferForm";
import {
  expandVariantTableToLines,
  hasStyleVariantsQuantity,
  requireVariantQuantitiesIfAttributeParent
} from "~/modules/items/styleOrderLines.server";
import { getLocationsList } from "~/modules/resources";
import { path } from "~/utils/path";
import { getCompanyId, locationsQuery } from "~/utils/react-query";

const mapInventoryItems = (data: unknown): TransferItem[] =>
  ((data ?? []) as any[])
    .filter((i) => (i.quantityOnHand ?? 0) > 0)
    .map((i) => ({
      id: i.id,
      readableId: i.readableIdWithRevision ?? i.id,
      name: i.name ?? "",
      quantityOnHand: Number(i.quantityOnHand ?? 0),
      unitOfMeasureCode: i.unitOfMeasureCode ?? "EA",
      itemTrackingType: i.itemTrackingType ?? "Inventory",
      type: i.type ?? "Part"
    }));

const resolveMode = (url: URL): "stock" | "warehouse" =>
  url.searchParams.get("mode") === "stock" ? "stock" : "warehouse";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isOverlay = url.searchParams.get("overlay") === "true";
  const mode = resolveMode(url);

  // Bare URL (deep link / direct nav): redirect to the matching list with the
  // overlay open, so the form always renders as an overlay, never a full page.
  if (!isOverlay) {
    const token = overlayToken(overlay.to.newTransfer(mode));
    const redirectParams = new URLSearchParams();
    if (token) redirectParams.append(OVERLAY_PARAM, token);
    const query = serializeSearch(redirectParams);
    const listPath =
      mode === "stock" ? path.to.stockTransfers : path.to.warehouseTransfers;
    throw redirect(query ? `${listPath}?${query}` : listPath);
  }

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory",
    bypassRls: true
  });

  const { getUserDefaults } = await import("~/modules/users/users.server");
  const defaults = await getUserDefaults(client, userId, companyId);
  const fromLocationId = defaults.data?.locationId ?? "";

  // Preload on-hand items for every warehouse up front so switching the From/To
  // warehouse in the form never triggers a reload (or loses items on switch-back).
  const locationsResult = await getLocationsList(client, companyId);
  const locations = (locationsResult.data ?? []) as { id: string }[];
  const itemsByLocation: Record<string, TransferItem[]> = {};
  await Promise.all(
    locations.map(async (loc) => {
      const result = await getInventoryItems(client, loc.id, companyId, {
        search: null,
        limit: 200,
        offset: 0,
        sorts: [],
        filters: []
      });
      itemsByLocation[loc.id] = mapInventoryItems(result.data);
    })
  );

  // Warehouses linked to a customer/supplier are partner-only destinations
  // (reached via the Customer/Supplier selector), never a pickable From/To
  // warehouse, so surface their ids for the form to exclude from its pickers.
  const partnerLocations = await client
    .from("location")
    .select("id")
    .eq("companyId", companyId)
    .or("customerId.not.is.null,supplierId.not.is.null");
  const partnerLocationIds = (
    (partnerLocations.data ?? []) as { id: string }[]
  ).map((l) => l.id);

  return { fromLocationId, itemsByLocation, mode, partnerLocationIds };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "inventory"
  });

  const isOverlay = new URL(request.url).searchParams.get("overlay") === "true";

  const validation = await validator(newTransferValidator).validate(
    await request.formData()
  );
  if (validation.error) return validationError(validation.error);

  const {
    mode,
    toType,
    fromLocationId,
    toLocationId,
    toCustomerId,
    toSupplierId,
    toCustomerLocationId,
    toSupplierLocationId,
    lines: submittedLines
  } = validation.data;

  // Style parent + variantTable → one line per variant SKU (same as SO/PO).
  const lines: typeof submittedLines = [];
  for (const l of submittedLines) {
    if (hasStyleVariantsQuantity(l.variantQuantities)) {
      const expanded = await expandVariantTableToLines(client, {
        parentItemId: l.itemId,
        companyId,
        variantQuantities: l.variantQuantities
      });
      if (!expanded.ok) {
        return validationError({
          fieldErrors: { lines: expanded.error }
        } as never);
      }
      for (const v of expanded.variants) {
        lines.push({
          itemId: v.variantItemId,
          quantity: v.quantity,
          fromStorageUnitId: l.fromStorageUnitId,
          toStorageUnitId: l.toStorageUnitId,
          trackedEntityId: undefined,
          variantQuantities: null
        });
      }
    } else {
      const required = await requireVariantQuantitiesIfAttributeParent(client, {
        parentItemId: l.itemId,
        companyId,
        variantQuantities: l.variantQuantities,
        quantity: l.quantity
      });
      if (!required.ok) {
        return validationError({
          fieldErrors: { lines: required.error }
        } as never);
      }
      lines.push(l);
    }
  }

  // Server-side guard: aggregated demand can't exceed availability — checked at
  // both the item level (whole source warehouse) and the chosen source bin. We
  // sum every line's quantity per item and per bin so two lines drawing from the
  // same source can't each pass while together over-transferring. Mirrors the
  // picking-list flow, which nets allocations across lines rather than per line.
  const availability = await getInventoryItems(
    client,
    fromLocationId,
    companyId,
    {
      search: null,
      limit: 500,
      offset: 0,
      sorts: [],
      filters: []
    }
  );
  const onHandById = new Map(
    (
      (availability.data ?? []) as { id: string; quantityOnHand?: number }[]
    ).map((i) => [i.id, Number(i.quantityOnHand ?? 0)])
  );

  // Per-bin availability for each item in play (sums serials/lots within a bin).
  // Style parents are already expanded to variant SKUs above; still use the
  // transfer-stock helper so any leftover parent-id lines roll up correctly.
  const uniqueItemIds = [...new Set(lines.map((l) => l.itemId))];
  const availByItemBin = new Map<string, number>();
  await Promise.all(
    uniqueItemIds.map(async (itemId) => {
      const stock = await getTransferStockForItem(
        client,
        itemId,
        companyId,
        fromLocationId
      );
      for (const r of stock) {
        const key = `${itemId}::${r.storageUnitId ?? ""}`;
        availByItemBin.set(
          key,
          (availByItemBin.get(key) ?? 0) + Number(r.quantity ?? 0)
        );
      }
    })
  );

  // Variant SKUs are excluded from get_inventory_quantities list rows — fill
  // on-hand from the per-bin totals so expanded Style lines can validate.
  for (const itemId of uniqueItemIds) {
    if (onHandById.has(itemId)) continue;
    let total = 0;
    for (const [key, qty] of availByItemBin) {
      if (key.startsWith(`${itemId}::`)) total += qty;
    }
    onHandById.set(itemId, total);
  }

  // Net out stock already committed to other open transfers (reservation): a
  // serial on another open transfer can't be picked again, and its fungible
  // quantity is subtracted from what's available here.
  const { committedSerials, committedQtyByItemBin } =
    await getOpenTransferCommitments(
      client,
      companyId,
      fromLocationId,
      uniqueItemIds
    );
  const serialTaken = lines.find(
    (l) => l.trackedEntityId && committedSerials.has(l.trackedEntityId)
  );
  if (serialTaken) {
    return validationError({
      fieldErrors: {
        lines: "A selected serial is already committed to another transfer"
      }
    } as never);
  }
  for (const [key, qty] of committedQtyByItemBin) {
    const id = key.slice(0, key.indexOf("::"));
    onHandById.set(id, (onHandById.get(id) ?? 0) - qty);
    availByItemBin.set(key, (availByItemBin.get(key) ?? 0) - qty);
  }

  // Aggregate line demand per item and per (item, source bin).
  const demandByItem = new Map<string, number>();
  const demandByItemBin = new Map<string, number>();
  for (const l of lines) {
    demandByItem.set(l.itemId, (demandByItem.get(l.itemId) ?? 0) + l.quantity);
    if (l.fromStorageUnitId) {
      const key = `${l.itemId}::${l.fromStorageUnitId}`;
      demandByItemBin.set(key, (demandByItemBin.get(key) ?? 0) + l.quantity);
    }
  }

  const itemOver = [...demandByItem].some(
    ([id, q]) => q > (onHandById.get(id) ?? 0)
  );
  const binOver = [...demandByItemBin].some(
    ([key, q]) => q > (availByItemBin.get(key) ?? 0)
  );
  if (itemOver || binOver) {
    return validationError({
      fieldErrors: {
        lines: "The transfer exceeds the quantity available at the source"
      }
    } as never);
  }

  // Stock mode → one warehouse, bin-to-bin; warehouse mode → across warehouses.
  if (mode === "stock") {
    const stock = await insertStockTransfer(client, {
      locationId: fromLocationId,
      lines: lines.map((l) => ({
        itemId: l.itemId,
        quantity: l.quantity,
        fromStorageUnitId: l.fromStorageUnitId || null,
        toStorageUnitId: l.toStorageUnitId || null,
        trackedEntityId: l.trackedEntityId || null,
        variantQuantities: l.variantQuantities ?? null
      })),
      companyId,
      createdBy: userId
    });
    if (stock.error || !stock.data) {
      if (isOverlay) {
        return data(
          { ok: false as const },
          await flash(request, error(stock.error, "Failed to create transfer"))
        );
      }
      throw redirect(
        path.to.stockTransfers,
        await flash(request, error(stock.error, "Failed to create transfer"))
      );
    }
    // Close the overlay and send the caller to the created transfer (the table's
    // onSuccess navigates to redirectTo).
    if (isOverlay) {
      return data(
        {
          ok: true as const,
          redirectTo: path.to.stockTransfer(stock.data.id)
        },
        await flash(request, success("Transfer created"))
      );
    }
    throw redirect(
      path.to.stockTransfer(stock.data.id),
      await flash(request, success("Transfer created"))
    );
  }

  // Customer/Supplier destination → the partner's dedicated warehouse (created
  // on first use). Warehouse destination → the picked location.
  let effectiveToLocationId = toLocationId ?? "";
  if (toType !== "warehouse") {
    const resolved = await resolveOrCreatePartnerLocation(
      client,
      companyId,
      userId,
      toType === "customer"
        ? {
            customerId: toCustomerId as string,
            customerLocationId: toCustomerLocationId ?? null
          }
        : {
            supplierId: toSupplierId as string,
            supplierLocationId: toSupplierLocationId ?? null
          }
    );
    if (resolved.error || !resolved.id) {
      if (isOverlay) {
        return data(
          { ok: false as const },
          await flash(
            request,
            error(resolved.error, "Failed to resolve partner warehouse")
          )
        );
      }
      throw redirect(
        path.to.warehouseTransfers,
        await flash(
          request,
          error(resolved.error, "Failed to resolve partner warehouse")
        )
      );
    }
    effectiveToLocationId = resolved.id;
  }

  const created = await insertWarehouseTransfer(client, {
    fromLocationId,
    toLocationId: effectiveToLocationId,
    companyId,
    createdBy: userId
  });
  if (created.error || !created.data) {
    if (isOverlay) {
      return data(
        { ok: false as const },
        await flash(request, error(created.error, "Failed to create transfer"))
      );
    }
    throw redirect(
      path.to.warehouseTransfers,
      await flash(request, error(created.error, "Failed to create transfer"))
    );
  }

  for (const line of lines) {
    const lineResult = await upsertWarehouseTransferLine(client, {
      transferId: created.data.id,
      itemId: line.itemId,
      quantity: line.quantity,
      fromLocationId,
      toLocationId: effectiveToLocationId,
      fromStorageUnitId: line.fromStorageUnitId || null,
      toStorageUnitId: line.toStorageUnitId || null,
      trackedEntityId: line.trackedEntityId || null,
      variantQuantities: line.variantQuantities ?? null,
      companyId,
      createdBy: userId
    } as never);
    if (lineResult.error) {
      if (isOverlay) {
        return data(
          { ok: false as const },
          await flash(request, error(lineResult.error, "Failed to add a line"))
        );
      }
      throw redirect(
        path.to.warehouseTransferDetails(created.data.id),
        await flash(request, error(lineResult.error, "Failed to add a line"))
      );
    }
  }

  // Close the overlay and send the caller to the created transfer (the table's
  // onSuccess navigates to redirectTo).
  if (isOverlay) {
    return data(
      {
        ok: true as const,
        redirectTo: path.to.warehouseTransferDetails(created.data.id)
      },
      await flash(request, success("Transfer created"))
    );
  }
  throw redirect(
    path.to.warehouseTransferDetails(created.data.id),
    await flash(request, success("Transfer created"))
  );
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  // A warehouse transfer to a customer/supplier auto-creates that partner's
  // dedicated warehouse. Drop the cached locations list so the new location
  // resolves right away (e.g. the "To Location" name on the transfer detail
  // page) instead of only after the client cache later expires.
  window.clientCache?.setQueryData(
    locationsQuery(getCompanyId()).queryKey,
    null
  );
  return await serverAction();
}

export default function NewTransferRoute() {
  return null;
}
