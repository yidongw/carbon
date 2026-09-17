import type { LoaderFunctionArgs } from "react-router";
import { isPickingListLocked } from "~/services/models";
import { getPickingListForExecution } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 拣货单详情(按工序分箱 kit + 明细行 + 已拣批次),对齐网页 /x/picking/:id。
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  const id = params.id ?? "";
  if (!companyId || !id) return jsonResponse({ found: false });

  const r = await getPickingListForExecution(client, id);
  const pl = r.data as any;
  if (!pl) return jsonResponse({ found: false });

  const rawLines = (pl.lines ?? []) as any[];

  // 追踪类型(Inventory/Serial/Batch)——明细查询未 join,单独批量取。
  const itemIds = [...new Set(rawLines.map((l) => l.itemId).filter(Boolean))];
  const trackMap = new Map<string, string>();
  if (itemIds.length) {
    const items = await client
      .from("item")
      .select("id, itemTrackingType")
      .in("id", itemIds);
    for (const it of (items.data ?? []) as any[])
      trackMap.set(it.id, it.itemTrackingType);
  }

  const lines = rawLines.map((l) => ({
    id: l.id,
    itemId: l.itemId ?? "",
    itemName: l.item?.name ?? "",
    itemDesc: l.item?.readableId ?? "",
    trackingType: trackMap.get(l.itemId) ?? "Inventory",
    jobId: l.job?.jobId ?? "",
    jobOperationId: l.jobOperationId ?? "",
    processName: l.jobOperation?.process?.name ?? "",
    workCenterName: l.jobOperation?.workCenter?.name ?? "",
    opOrder: l.jobOperation?.order ?? null,
    quantityToPick: l.quantityToPick ?? 0,
    quantityPicked: l.quantityPicked ?? 0,
    availableQuantity: l.availableQuantity ?? 0,
    status: l.status ?? "",
    fromBin: l.storageUnit?.name ?? "",
    toBin: l.toStorageUnit?.name ?? "",
    trackedEntities: ((l.trackedEntities ?? []) as any[]).map((t) => ({
      id: t.trackedEntityId,
      trackedEntityId: t.trackedEntityId,
      readableId: t.trackedEntity?.readableId ?? "",
      quantity: t.quantityPicked ?? t.quantity ?? 0
    }))
  }));

  // 按 jobOperationId 分箱(不同工序的料不可混装)。
  const kitMap = new Map<string, any>();
  for (const l of lines) {
    const key = l.jobOperationId || "ungrouped";
    let k = kitMap.get(key);
    if (!k) {
      k = {
        id: key,
        jobId: l.jobId,
        processName: l.processName,
        workCenterName: l.workCenterName,
        title: [l.jobId, l.processName].filter(Boolean).join(" · "),
        lines: []
      };
      kitMap.set(key, k);
    }
    k.lines.push(l);
  }
  const kits = [...kitMap.values()].sort((a, b) =>
    `${a.jobId}${a.processName}`.localeCompare(`${b.jobId}${b.processName}`)
  );

  return jsonResponse({
    found: true,
    id: pl.id,
    pickingListId: pl.pickingListId ?? "",
    status: pl.status ?? "",
    locked: isPickingListLocked(pl.status),
    locationName: pl.location?.name ?? "",
    dueDate: pl.dueDate ?? null,
    kits,
    lines
  });
}
