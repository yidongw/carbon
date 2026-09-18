import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  getAvailableTrackedEntities,
  getPickOrder
} from "~/services/inventory.service";
import { setPickingListLineTrackedEntity } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 序列/批次拣货:GET 列出可拣批次;POST 拣一条/撤销。对齐网页 /x/picking/:id/tracked/:lineId。
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  const lineId = params.lineId ?? "";
  if (!companyId || !lineId) {
    return jsonResponse({
      trackingType: "",
      quantityRequired: 0,
      pickOrder: "Default",
      rows: []
    });
  }

  const lineRes = await client
    .from("pickingListLine")
    .select(
      "id, itemId, quantityToPick, quantityPicked, pickingList(locationId), item(itemTrackingType)"
    )
    .eq("id", lineId)
    .single();
  const line = lineRes.data as any;
  if (!line) {
    return jsonResponse({
      trackingType: "",
      quantityRequired: 0,
      pickOrder: "Default",
      rows: []
    });
  }

  const locationId = line.pickingList?.locationId ?? "";
  const trackingType = line.item?.itemTrackingType ?? "";

  const entitiesRes = await getAvailableTrackedEntities(client, {
    itemId: line.itemId,
    companyId,
    locationId,
    excludeLineside: true,
    excludeAllocated: true,
    excludeLineId: lineId
  });
  const rows = ((entitiesRes.data ?? []) as any[]).map((e) => ({
    id: e.trackedEntityId,
    readableId: e.readableId ?? "",
    quantity: e.availableQuantity ?? 0,
    storageUnitId: e.storageUnitId ?? null,
    storageUnitName: e.storageUnitName ?? "",
    expirationDate: e.expirationDate ?? null
  }));

  const pickOrder = await getPickOrder(client, {
    itemId: line.itemId,
    locationId,
    companyId
  });

  return jsonResponse({
    trackingType,
    quantityRequired: Math.max(
      0,
      (line.quantityToPick ?? 0) - (line.quantityPicked ?? 0)
    ),
    pickOrder,
    rows
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { userId, companyId } = await requireMiniappUser(request);
  if (!companyId)
    return jsonResponse({ success: false, message: "未加入公司" });
  const lineId = params.lineId ?? "";
  const body = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const trackedEntityId = String(body.trackedEntityId ?? "");
  if (!lineId || !trackedEntityId) {
    return jsonResponse({ success: false, message: "参数错误" });
  }

  const serviceRole = getCarbonServiceRole();
  const r = await setPickingListLineTrackedEntity(serviceRole, {
    pickingListLineId: lineId,
    trackedEntityId,
    fromStorageUnitId:
      body.fromStorageUnitId != null ? String(body.fromStorageUnitId) : null,
    quantity: body.quantity != null ? Number(body.quantity) : undefined,
    unpick: body.unpick === true,
    userId
  });
  if (r.error) {
    const msg =
      typeof r.error === "string"
        ? r.error
        : ((r.error as any)?.message ?? "操作失败");
    return jsonResponse({ success: false, message: msg });
  }
  return jsonResponse({ success: true });
}
