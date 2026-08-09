import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getOpenTransferCommitments,
  getTransferStockForItem
} from "~/modules/inventory";

// An item's on-hand broken down by storage unit + tracked entity (serial/lot)
// at a location, so the New Transfer line editor can let you pick the exact
// unit/serial to move and see where it currently sits. Style parents include
// child variant SKU ledgers (inventory lives on variants).
export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "inventory",
    bypassRls: true
  });

  const url = new URL(request.url);
  const itemId = url.searchParams.get("itemId");
  const locationId = url.searchParams.get("locationId");
  if (!itemId || !locationId) return { stock: [] };

  const stockRows = await getTransferStockForItem(
    client,
    itemId,
    companyId,
    locationId
  );

  // Subtract stock already committed to other open transfers so a unit/serial
  // can't be transferred twice (reservation).
  const { committedSerials, committedQtyByItemBin } =
    await getOpenTransferCommitments(client, companyId, locationId, [itemId]);

  // Mutable copy so the qty committed to open transfers is *consumed* across the
  // rows of a bin. This matters for serial items whose committing line didn't
  // name a serial (trackedEntityId is null): it still reserves N units of the
  // bin, so N of the bin's serial units must be dropped even though we can't say
  // which ones.
  const committedByBin = new Map(committedQtyByItemBin);

  const stock = stockRows
    .map((r) => {
      // A serial already named on an open transfer is fully spoken for → drop it.
      if (r.trackedEntityId && committedSerials.has(r.trackedEntityId)) {
        return { ...r, quantity: 0 };
      }
      const binKey = `${itemId}::${r.storageUnitId ?? ""}`;
      const committed = committedByBin.get(binKey) ?? 0;
      if (committed <= 0) return { ...r, quantity: Number(r.quantity) };

      if (r.trackedEntityId) {
        // Serial unit: it satisfies one unit of the bin's unnamed commitment.
        const qty = Number(r.quantity) || 1;
        committedByBin.set(binKey, committed - qty);
        return { ...r, quantity: 0 };
      }
      // Fungible bin: subtract the committed quantity.
      committedByBin.set(binKey, Math.max(0, committed - Number(r.quantity)));
      return { ...r, quantity: Number(r.quantity) - committed };
    })
    .filter((r) => Number(r.quantity) > 0)
    .map((r) => ({
      storageUnitId: r.storageUnitId,
      storageUnitName: r.storageUnitName,
      trackedEntityId: r.trackedEntityId,
      readableId: r.readableId,
      quantity: Number(r.quantity)
    }));

  // Attach attribute combo (from the serial's attributes) so the picker can group
  // serial units by configuration instead of listing opaque serial numbers.
  const serialIds = stock
    .map((r) => r.trackedEntityId)
    .filter((id): id is string => !!id);
  const attributesById = new Map<
    string,
    { color: string | null; size: string | null }
  >();
  if (serialIds.length > 0) {
    const entities = await client
      .from("trackedEntity")
      .select("id, attributes")
      .in("id", serialIds);
    for (const e of (entities.data ?? []) as Array<{
      id: string;
      attributes: Record<string, unknown> | null;
    }>) {
      const a = e.attributes ?? {};
      attributesById.set(e.id, {
        color: (a.Color as string) ?? null,
        size: (a.Size as string) ?? null
      });
    }
  }

  const stockWithConfig = stock.map((r) => ({
    ...r,
    color: r.trackedEntityId
      ? (attributesById.get(r.trackedEntityId)?.color ?? null)
      : null,
    size: r.trackedEntityId
      ? (attributesById.get(r.trackedEntityId)?.size ?? null)
      : null
  }));

  return { stock: stockWithConfig };
}
