import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getLocationsList } from "~/modules/resources";
import { path } from "~/utils/path";
import type { StockOverviewChip, StockOverviewItem } from "./types";

// Statuses in which an outbound transfer line still has quantity waiting to ship.
const TO_SHIP_STATUSES = new Set(["Draft", "To Ship and Receive", "To Ship"]);

type DocEntry = { locationId: string; quantity: number; href: string };

/**
 * Company-wide "stock across warehouses" for every item with non-zero on-hand
 * in at least one location. Each quantity carries clickable chips:
 *  - On Hand: one chip per warehouse -> the item's quantity page at that location
 *  - To Send: one chip per warehouse transfer (unshipped) -> the transfer page
 *  - To Receive: one chip per in-transit warehouse transfer -> the transfer page,
 *    plus one chip per pending purchase-order receipt -> the receipt page
 */
export async function getStockOverview(
  client: SupabaseClient<Database>,
  companyId: string
): Promise<{
  locations: { id: string; name: string }[];
  items: StockOverviewItem[];
}> {
  const locations = await getLocationsList(client, companyId);
  const locationList = locations.data ?? [];
  const nameOf = (id: string) =>
    locationList.find((l) => l.id === id)?.name ?? id;

  const [perLocation, transfers, pendingReceipts] = await Promise.all([
    Promise.all(
      locationList.map((loc) =>
        client
          .rpc("get_inventory_quantities", {
            location_id: loc.id,
            company_id: companyId
          })
          .select(
            "id, readableIdWithRevision, name, thumbnailPath, type, unitOfMeasureCode, quantityOnHand"
          )
          .neq("quantityOnHand", 0)
          .limit(10000)
      )
    ),
    client
      .from("warehouseTransferLine")
      .select(
        "itemId, transferId, quantity, shippedQuantity, receivedQuantity, fromLocationId, toLocationId, warehouseTransfer(transferId, status)"
      )
      .eq("companyId", companyId),
    client
      .from("receiptLine")
      .select(
        "itemId, locationId, receivedQuantity, receipt!inner(id, status, sourceDocument, locationId)"
      )
      .eq("companyId", companyId)
      .eq("receipt.sourceDocument", "Purchase Order")
      .in("receipt.status", ["Draft", "Pending"])
  ]);

  // itemId -> locationId -> on-hand
  const onHandByItem = new Map<string, Map<string, number>>();
  // itemId -> docKey -> { locationId, quantity, href }
  const toSendByItem = new Map<string, Map<string, DocEntry>>();
  const toReceiveByItem = new Map<string, Map<string, DocEntry>>();
  const meta = new Map<
    string,
    Pick<
      StockOverviewItem,
      | "itemId"
      | "readableIdWithRevision"
      | "name"
      | "thumbnailPath"
      | "type"
      | "unitOfMeasureCode"
    >
  >();

  const addDoc = (
    map: Map<string, Map<string, DocEntry>>,
    itemId: string,
    key: string,
    locationId: string,
    quantity: number,
    href: string
  ) => {
    let docs = map.get(itemId);
    if (!docs) {
      docs = new Map();
      map.set(itemId, docs);
    }
    const existing = docs.get(key);
    if (existing) existing.quantity += quantity;
    else docs.set(key, { locationId, quantity, href });
  };

  // On hand per location (only items with non-zero on-hand somewhere).
  perLocation.forEach((res, i) => {
    const locationId = locationList[i].id;
    for (const row of (res.data ?? []) as Array<Record<string, unknown>>) {
      const itemId = row.id as string;
      let locs = onHandByItem.get(itemId);
      if (!locs) {
        locs = new Map();
        onHandByItem.set(itemId, locs);
      }
      locs.set(
        locationId,
        (locs.get(locationId) ?? 0) + ((row.quantityOnHand as number) ?? 0)
      );
      if (!meta.has(itemId)) {
        meta.set(itemId, {
          itemId,
          readableIdWithRevision: (row.readableIdWithRevision as string) ?? "",
          name: (row.name as string) ?? "",
          thumbnailPath: (row.thumbnailPath as string | null) ?? null,
          type: (row.type as string | null) ?? null,
          unitOfMeasureCode: (row.unitOfMeasureCode as string | null) ?? null
        });
      }
    }
  });

  // Warehouse transfers -> To Send (unshipped) and To Receive (in-transit),
  // one chip per transfer, linking to that transfer's detail page.
  for (const line of transfers.data ?? []) {
    if (!onHandByItem.has(line.itemId)) continue;
    const transfer = Array.isArray(line.warehouseTransfer)
      ? line.warehouseTransfer[0]
      : line.warehouseTransfer;
    const status = transfer?.status;
    if (status === "Cancelled") continue;
    const transferHref = path.to.warehouseTransferDetails(line.transferId);

    const outstandingToShip =
      (line.quantity ?? 0) - (line.shippedQuantity ?? 0);
    if (outstandingToShip > 0 && status && TO_SHIP_STATUSES.has(status)) {
      addDoc(
        toSendByItem,
        line.itemId,
        line.transferId,
        line.fromLocationId,
        outstandingToShip,
        transferHref
      );
    }

    const inTransit =
      (line.shippedQuantity ?? 0) - (line.receivedQuantity ?? 0);
    if (inTransit > 0) {
      addDoc(
        toReceiveByItem,
        line.itemId,
        `wt:${line.transferId}`,
        line.toLocationId,
        inTransit,
        transferHref
      );
    }
  }

  // Pending PO receipts -> To Receive, one chip per receipt.
  for (const line of pendingReceipts.data ?? []) {
    if (!onHandByItem.has(line.itemId)) continue;
    const receipt = Array.isArray(line.receipt)
      ? line.receipt[0]
      : line.receipt;
    const receiptId = receipt?.id;
    if (!receiptId) continue;
    const locationId = line.locationId ?? receipt?.locationId;
    if (!locationId) continue;
    addDoc(
      toReceiveByItem,
      line.itemId,
      `po:${receiptId}`,
      locationId,
      line.receivedQuantity ?? 0,
      path.to.receiptDetails(receiptId)
    );
  }

  const chipsFrom = (
    docs: Map<string, DocEntry> | undefined,
    prefix: string
  ): { chips: StockOverviewChip[]; total: number } => {
    const chips: StockOverviewChip[] = [];
    let total = 0;
    for (const [key, entry] of docs ?? []) {
      total += entry.quantity;
      chips.push({
        id: `${prefix}-${key}`,
        locationId: entry.locationId,
        locationName: nameOf(entry.locationId),
        quantity: entry.quantity,
        href: entry.href
      });
    }
    chips.sort((a, b) => a.locationName.localeCompare(b.locationName));
    return { chips, total };
  };

  const items: StockOverviewItem[] = [];
  for (const [itemId, locs] of onHandByItem) {
    const m = meta.get(itemId);
    if (!m) continue;

    const onHandChips: StockOverviewChip[] = [];
    let onHand = 0;
    for (const [locationId, qty] of locs) {
      onHand += qty;
      if (qty !== 0) {
        onHandChips.push({
          id: `oh-${locationId}`,
          locationId,
          locationName: nameOf(locationId),
          quantity: qty,
          href: `${path.to.inventoryItem(itemId)}?location=${locationId}`
        });
      }
    }
    onHandChips.sort((a, b) => a.locationName.localeCompare(b.locationName));

    const send = chipsFrom(toSendByItem.get(itemId), "ts");
    const receive = chipsFrom(toReceiveByItem.get(itemId), "tr");

    items.push({
      ...m,
      onHand,
      toSend: send.total,
      toReceive: receive.total,
      inTransit: receive.total,
      total: onHand + receive.total,
      onHandChips,
      toSendChips: send.chips,
      toReceiveChips: receive.chips
    });
  }

  items.sort((a, b) =>
    a.readableIdWithRevision.localeCompare(b.readableIdWithRevision)
  );

  return { locations: locationList, items };
}
