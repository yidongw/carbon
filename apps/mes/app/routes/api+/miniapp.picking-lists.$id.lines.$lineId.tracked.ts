import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  getAvailableTrackedEntities,
  getPickOrder
} from "~/services/inventory.service";
import { setPickingListLineTrackedEntity } from "~/services/picking.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** GET: 可拣批次/序列号；POST: 拣/撤销追溯物料 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId } = await requireMiniappUser(request);
  const lineId = params.lineId ?? "";
  if (!companyId || !lineId) return jsonResponse({ rows: [] });

  const serviceRole = getCarbonServiceRole();
  const lineResult = await serviceRole
    .from("pickingListLine")
    .select(
      "id, itemId, quantityToPick, quantityPicked, pickingList(locationId), item(itemTrackingType)"
    )
    .eq("id", lineId)
    .single();

  if (lineResult.error || !lineResult.data) {
    return jsonResponse({ rows: [], message: "行不存在" });
  }

  const line = lineResult.data as any;
  const locationId = (line.pickingList as { locationId: string } | null)
    ?.locationId;
  const trackingType =
    (line.item as { itemTrackingType: string } | null)?.itemTrackingType ??
    "Batch";

  const entities = locationId
    ? await getAvailableTrackedEntities(serviceRole, {
        itemId: line.itemId,
        companyId,
        locationId,
        excludeLineside: true,
        excludeAllocated: true,
        excludeLineId: lineId
      })
    : { data: [] };

  const order = locationId
    ? await getPickOrder(serviceRole, {
        itemId: line.itemId,
        locationId,
        companyId
      })
    : "Default";

  return jsonResponse({
    trackingType,
    quantityRequired: Math.max(
      0,
      Number(line.quantityToPick ?? 0) - Number(line.quantityPicked ?? 0)
    ),
    pickOrder: order,
    rows: ((entities.data ?? []) as any[]).map((e) => ({
      id: (e.trackedEntityId as string) || "",
      readableId: (e.readableId as string) || "",
      quantity: Number(e.availableQuantity ?? 0),
      storageUnitId: (e.storageUnitId as string) || null,
      storageUnitName: (e.storageUnitName as string) || "",
      expirationDate: (e.expirationDate as string) || null
    }))
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }
  const { userId, companyId } = await requireMiniappUser(request);
  const lineId = params.lineId ?? "";
  if (!companyId || !lineId) {
    return jsonResponse({ success: false, message: "缺少参数" });
  }

  const body = (await request.json().catch(() => ({}))) as {
    trackedEntityId?: string;
    quantity?: number;
    fromStorageUnitId?: string | null;
    unpick?: boolean;
  };
  if (!body.trackedEntityId) {
    return jsonResponse({ success: false, message: "缺少批次/序列号" });
  }

  const serviceRole = getCarbonServiceRole();
  const result = await setPickingListLineTrackedEntity(serviceRole, {
    pickingListLineId: lineId,
    trackedEntityId: body.trackedEntityId,
    fromStorageUnitId: body.fromStorageUnitId,
    quantity: body.quantity,
    unpick: !!body.unpick,
    userId
  });

  if (result.error) {
    const message =
      typeof result.error === "string"
        ? result.error
        : ((result.error as { message?: string }).message ?? "拣货失败");
    return jsonResponse({ success: false, message });
  }
  return jsonResponse({ success: true });
}
