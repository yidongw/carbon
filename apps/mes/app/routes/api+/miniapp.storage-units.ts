import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getMiniappLocationId,
  requireMiniappUser
} from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 当前库位的存储单元列表 + 可选物料默认仓位。
 * 对齐 MES AdjustInventory 的 storageUnit Combobox / pickMethod 预填。
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [], locationId: null });

  const locationId = await getMiniappLocationId(client, userId, companyId);
  if (!locationId) {
    return jsonResponse({ rows: [], locationId: null });
  }

  const serviceRole = getCarbonServiceRole();
  const units = await serviceRole
    .from("storageUnit")
    .select("id, name")
    .eq("locationId", locationId)
    .order("name", { ascending: true });

  const url = new URL(request.url);
  const itemId = (url.searchParams.get("itemId") ?? "").trim();
  let defaultStorageUnitId: string | null = null;
  if (itemId) {
    const pm = await serviceRole
      .from("pickMethod")
      .select("defaultStorageUnitId")
      .eq("itemId", itemId)
      .eq("locationId", locationId)
      .maybeSingle();
    defaultStorageUnitId =
      (pm.data?.defaultStorageUnitId as string | null) ?? null;
  }

  return jsonResponse({
    locationId,
    defaultStorageUnitId,
    rows: ((units.data ?? []) as any[]).map((u) => ({
      id: u.id as string,
      name: (u.name as string) || ""
    }))
  });
}
