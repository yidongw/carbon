import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import type { LoaderFunctionArgs } from "react-router";
import { getBundleWorkOrdersList } from "~/services/bundle.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 分包工单:对齐网页 /x/bundle-work-orders,读 `bundleWorkOrders` 视图。
// 可选 masterWorkOrderId 参数把列表限定到某个主工单(网页的下钻)。
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const masterWorkOrderId =
    new URL(request.url).searchParams.get("masterWorkOrderId") ?? undefined;

  const bundles = await getBundleWorkOrdersList(
    client,
    companyId,
    masterWorkOrderId
  );
  const rows = (bundles.data ?? []) as any[];

  const masterIds = [
    ...new Set(rows.map((b) => b.masterWorkOrderId).filter(Boolean))
  ] as string[];
  const masterWOMap: Record<string, string> = {};
  if (masterIds.length) {
    const masterWOs = await client
      .from("masterWorkOrders")
      .select("id, jobReadableId")
      .in("id", masterIds);
    for (const m of (masterWOs.data ?? []) as any[]) {
      if (m.id && m.jobReadableId) masterWOMap[m.id] = m.jobReadableId;
    }
  }

  const names = await resolveUserNames(
    client,
    rows.map((b) => b.assignee)
  );

  return jsonResponse({
    rows: rows.map((b) => ({
      id: b.id,
      bundle: b.readableIdWithRevision ?? "",
      masterWo: b.masterWorkOrderId
        ? (masterWOMap[b.masterWorkOrderId] ?? "")
        : "",
      style: b.styleReadableId ?? "",
      itemName: b.itemName ?? "",
      attributes: localizeVariantAttributeLabel(b.attributeLabel, "zh"),
      quantity: b.quantity ?? 0,
      processCount: b.processCount ?? 0,
      assignee: names.get(b.assignee) ?? "",
      status: b.status ?? ""
    }))
  });
}
