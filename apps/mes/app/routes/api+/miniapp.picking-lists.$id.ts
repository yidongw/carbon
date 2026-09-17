import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import { isPickingListLocked } from "~/services/models";
import { getPickingListForExecution } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** 拣货单执行详情 — 对齐 MES /x/picking/:id */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId } = await requireMiniappUser(request);
  const id = params.id ?? "";
  if (!companyId || !id) return jsonResponse({ found: false });

  const serviceRole = getCarbonServiceRole();
  const r = await getPickingListForExecution(serviceRole, id);
  const pl = r.data as any;
  if (!pl || (pl.companyId && pl.companyId !== companyId)) {
    return jsonResponse({ found: false });
  }

  const lines = ((pl.lines ?? []) as any[]).map((line) => {
    const item = line.item as { name?: string; readableId?: string } | null;
    const job = line.job as { jobId?: string } | null;
    const jobOp = line.jobOperation as {
      order?: number | null;
      process?: { name?: string } | null;
      workCenter?: { name?: string } | null;
    } | null;
    const fromBin = line.storageUnit as { name?: string } | null;
    const toBin = line.toStorageUnit as { name?: string } | null;
    const tracking =
      (line.item as { itemTrackingType?: string } | null)?.itemTrackingType ??
      "Inventory";
    // itemTrackingType is on item table — re-fetch from nested if present
    return {
      id: line.id as string,
      itemId: (line.itemId as string) || "",
      itemName: item?.readableId || item?.name || "",
      itemDesc: item?.name || "",
      trackingType: tracking,
      jobId: job?.jobId || "",
      jobOperationId: (line.jobOperationId as string) || "",
      processName: jobOp?.process?.name || "",
      workCenterName: jobOp?.workCenter?.name || "",
      opOrder: jobOp?.order ?? null,
      quantityToPick: Number(line.quantityToPick ?? 0),
      quantityPicked: Number(line.quantityPicked ?? 0),
      availableQuantity: Number(line.availableQuantity ?? 0),
      status: (line.status as string) || "Pending",
      fromBin: fromBin?.name || "",
      toBin: toBin?.name || "",
      trackedEntities: ((line.trackedEntities ?? []) as any[])
        .filter((te) => Number(te.quantityPicked ?? te.quantity ?? 0) > 0)
        .map((te) => ({
          id: te.id as string,
          trackedEntityId: te.trackedEntityId as string,
          readableId:
            (te.trackedEntity as { readableId?: string } | null)?.readableId ||
            "",
          quantity: Number(te.quantityPicked ?? te.quantity ?? 0)
        }))
    };
  });

  // Need tracking type from item — the select may not include itemTrackingType.
  // Enrich via a quick batch if missing Inventory default is wrong.
  const needTrack = lines.some(
    (l) => !l.trackingType || l.trackingType === "Inventory"
  );
  if (needTrack && lines.length) {
    const itemIds = [...new Set(lines.map((l) => l.itemId).filter(Boolean))];
    if (itemIds.length) {
      const items = await serviceRole
        .from("item")
        .select("id, itemTrackingType, readableId, name")
        .in("id", itemIds);
      const map = new Map(
        ((items.data ?? []) as any[]).map((i) => [i.id as string, i])
      );
      for (const line of lines) {
        const i = map.get(line.itemId);
        if (i) {
          line.trackingType = (i.itemTrackingType as string) || "Inventory";
          if (!line.itemName) line.itemName = (i.readableId as string) || "";
          if (!line.itemDesc) line.itemDesc = (i.name as string) || "";
        }
      }
    }
  }

  // Group into kits by jobOperationId (MES detail page pattern)
  const kitMap = new Map<string, typeof lines>();
  for (const line of lines) {
    const key = line.jobOperationId || "_none";
    if (!kitMap.has(key)) kitMap.set(key, []);
    kitMap.get(key)!.push(line);
  }
  const kits = [...kitMap.entries()]
    .map(([key, kitLines]) => ({
      id: key,
      jobId: kitLines[0]?.jobId || "",
      processName: kitLines[0]?.processName || "",
      workCenterName: kitLines[0]?.workCenterName || "",
      title:
        [kitLines[0]?.jobId || "", kitLines[0]?.processName || ""]
          .filter(Boolean)
          .join(" · ") || (key === "_none" ? "其他" : "工序"),
      lines: kitLines
    }))
    .sort((a, b) => {
      const job = a.jobId.localeCompare(b.jobId);
      if (job !== 0) return job;
      return a.processName.localeCompare(b.processName);
    });

  const location = pl.location as { name?: string } | null;

  return jsonResponse({
    found: true,
    id: pl.id as string,
    pickingListId: (pl.pickingListId as string) || "",
    status: (pl.status as string) || "",
    locked: isPickingListLocked(pl.status),
    locationName: location?.name || "",
    dueDate: (pl.dueDate as string) || null,
    kits,
    lines
  });
}
