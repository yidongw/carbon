import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { trigger } from "@carbon/jobs";
import { NotificationEvent } from "@carbon/notifications";
import type { ActionFunctionArgs } from "react-router";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 建议提交：对齐网页 `/x/suggestion`。
 * Body JSON: { suggestion, emoji?, attachmentPath?, anonymous?, path? }
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed" }, { status: 405 });
  }

  const { userId, companyId } = await requireMiniappUser(request);
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
    return jsonResponse(
      { success: false, message: "无效请求" },
      { status: 400 }
    );
  }

  const suggestion = String(body.suggestion ?? "").trim();
  if (suggestion.length < 1) {
    return jsonResponse(
      { success: false, message: "请填写建议内容" },
      { status: 400 }
    );
  }

  const emoji = String(body.emoji ?? "💡") || "💡";
  const attachmentPath = body.attachmentPath
    ? String(body.attachmentPath)
    : null;
  const anonymous = body.anonymous !== false;
  const formUserId = anonymous ? null : userId;
  const path = String(body.path ?? "/miniapp/workstation");

  const serviceRole = getCarbonServiceRole();
  const insertSuggestion = await serviceRole
    .from("suggestion")
    .insert([
      {
        suggestion,
        emoji,
        path,
        attachmentPath,
        userId: formUserId,
        companyId
      }
    ])
    .select("id")
    .single();

  if (insertSuggestion.error) {
    return jsonResponse(
      { success: false, message: "提交失败" },
      { status: 500 }
    );
  }

  const company = await serviceRole
    .from("company")
    .select("suggestionNotificationGroup")
    .eq("id", companyId)
    .single();

  if (!company.error && company.data?.suggestionNotificationGroup?.length) {
    try {
      await trigger("notify", {
        companyId,
        documentId: insertSuggestion.data.id,
        event: NotificationEvent.SuggestionResponse,
        recipient: {
          type: "group",
          groupIds: company.data.suggestionNotificationGroup
        },
        from: formUserId || userId
      });
    } catch (err) {
      console.error("Failed to trigger suggestion notification", err);
    }
  }

  return jsonResponse({ success: true, message: "建议已提交" });
}
