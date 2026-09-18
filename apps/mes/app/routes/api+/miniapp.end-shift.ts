import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  endProductionEvents,
  getActiveJobOperationsByEmployee
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** 结束班次：列出当前进行中工序（对齐 EndShift 弹窗）。 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) return jsonResponse({ rows: [] });

  const { data, error } = await getActiveJobOperationsByEmployee(client, {
    employeeId: userId,
    companyId
  });
  if (error) {
    return jsonResponse({ rows: [], message: error.message }, { status: 500 });
  }

  const rows = ((data ?? []) as any[]).map((o) => ({
    id: o.id as string,
    jobReadableId: o.jobReadableId ?? "",
    description: o.description ?? "",
    itemReadableId: o.itemReadableId ?? ""
  }));

  return jsonResponse({ rows });
}

/**
 * 结束班次：对齐网页 `/x/end-shift`。
 * Body JSON: { timezone? }
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed" }, { status: 405 });
  }

  const { userId, companyId, client } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse(
      { success: false, message: "未选择公司" },
      { status: 400 }
    );
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    /* empty body ok */
  }

  const timezone = String(body.timezone || "Asia/Shanghai");
  // Match MES: absolute-ish ISO end time in local zone via Date.
  const endTime = new Date().toISOString();

  const updates = await endProductionEvents(client, {
    companyId,
    employeeId: userId,
    endTime
  });

  if (updates.error) {
    return jsonResponse(
      { success: false, message: updates.error.message },
      { status: 500 }
    );
  }

  const serviceRole = getCarbonServiceRole();
  const settings = await serviceRole
    .from("companySettings")
    .select("*")
    .eq("id", companyId)
    .single();

  if ((settings.data as any)?.timeCardEnabled) {
    const clockOutResult = await serviceRole
      .from("timeCardEntry")
      .update({
        clockOut: endTime,
        updatedBy: userId
      } as any)
      .eq("employeeId", userId)
      .eq("companyId", companyId)
      .is("clockOut", null);

    if (clockOutResult.error) {
      console.error("Failed to clock out on end shift:", clockOutResult.error);
    }
  }

  // timezone reserved for future absolute-string parity with @internationalized/date
  void timezone;

  return jsonResponse({ success: true, message: "已结束所有进行中工序" });
}
