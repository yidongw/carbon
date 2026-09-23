import type { ActionFunctionArgs } from "react-router";
import {
  findCurrentOperation,
  getBundleForScan,
  getBundleOperations
} from "~/services/bundle.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/** Same rules as MES `parseBundleScan` in QRScanner.tsx. */
function parseBundleScan(text: string): string | null {
  const trimmed = text.trim();
  const urlMatch = trimmed.match(/\/x\/bundle\/([^/?#\s]+)/);
  if (urlMatch?.[1]) return decodeURIComponent(urlMatch[1]);
  if (/^bwo_[A-Za-z0-9]+$/.test(trimmed)) return trimmed;
  return null;
}

function parseOperationScan(text: string): string | null {
  const trimmed = text.trim();
  const urlMatch = trimmed.match(/\/x\/(?:operation|start|end)\/([^/?#\s]+)/);
  if (urlMatch?.[1]) return decodeURIComponent(urlMatch[1]);
  // bare uuid
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      trimmed
    )
  ) {
    return trimmed;
  }
  return null;
}

/**
 * 扫码解析：对齐网页 `/x/bundle/:id?intent=`。
 * Body JSON: { code: string, intent?: 'view'|'pickup'|'report' }
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
    return jsonResponse(
      { success: false, message: "无效请求" },
      { status: 400 }
    );
  }

  const code = String(body.code ?? "").trim();
  if (!code) {
    return jsonResponse(
      { success: false, message: "扫码内容为空" },
      { status: 400 }
    );
  }

  const intent =
    body.intent === "pickup" || body.intent === "report"
      ? (body.intent as "pickup" | "report")
      : "view";

  // Direct operation QR (traveler start/end/operation)
  const directOpId = parseOperationScan(code);
  if (directOpId && !parseBundleScan(code)) {
    return jsonResponse({
      success: true,
      kind: "operation",
      operationId: directOpId,
      jobId: null,
      isMine: null,
      intent
    });
  }

  const bundleId = parseBundleScan(code);
  if (!bundleId) {
    return jsonResponse(
      {
        success: false,
        message: "无法识别的二维码，请扫描分包标签"
      },
      { status: 400 }
    );
  }

  const bundle = await getBundleForScan(client, bundleId, companyId);
  if (bundle.error || !bundle.data?.jobId) {
    return jsonResponse(
      { success: false, message: "找不到分包工单" },
      { status: 404 }
    );
  }

  const ops = await getBundleOperations(client, bundle.data.jobId);
  const cur = findCurrentOperation(ops.data ?? []);
  if (!cur) {
    return jsonResponse({
      success: true,
      kind: "job",
      operationId: null,
      jobId: bundle.data.jobId,
      isMine: false,
      intent,
      message: "该分包已无未完成工序"
    });
  }

  return jsonResponse({
    success: true,
    kind: "bundle",
    operationId: cur.id,
    jobId: bundle.data.jobId,
    isMine: cur.assignee === userId,
    assignee: cur.assignee ?? null,
    status: cur.status ?? "",
    description: cur.description ?? "",
    intent
  });
}
