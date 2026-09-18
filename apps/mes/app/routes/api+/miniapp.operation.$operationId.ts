import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import { convertKbToString } from "@carbon/utils";
import type { LoaderFunctionArgs } from "react-router";
import {
  getFileType,
  getJobByOperationId,
  getJobFiles,
  getJobMaterialsByOperationId,
  getJobOperationById,
  getProductionEventsForJobOperation,
  getProductionQuantitiesForJobOperation,
  getWorkCenter
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { resolveUserNames } from "~/utils/miniapp-names.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 工序执行详情:对齐网页 /x/operation/:operationId 的字段。
// 统计数字用「未作废报工记录实时求和」,与网页 sumLiveQuantity 口径一致。
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  const serviceRole = getCarbonServiceRole();
  const operationId = params.operationId ?? "";
  if (!companyId || !operationId) {
    return jsonResponse({ found: false });
  }

  const opRes = await getJobOperationById(client, operationId);
  const op = (opRes.data ?? [])[0] as any;
  if (!op) return jsonResponse({ found: false });

  // 实时求和(未作废)。
  const qRes = await getProductionQuantitiesForJobOperation(
    client,
    operationId
  );
  const quantities = (qRes.data ?? []) as any[];
  const sum = (type: string, pred?: (q: any) => boolean) =>
    quantities
      .filter((q) => q.type === type && (!pred || pred(q)))
      .reduce((s, q) => s + (q.quantity ?? 0), 0);
  const completed = sum("Production");
  const rework = sum("Rework");
  const scrap = sum("Scrap");
  const pending = sum("Production", (q) => q.paymentYear == null);

  // 生产事件:是否进行中 + 累计实际工时(已结束用时长,进行中算到当下)。
  const eRes = await getProductionEventsForJobOperation(client, {
    operationId,
    userId
  });
  const events = (eRes.data ?? []) as any[];
  const active = events.some((e) => !e.endTime);
  let timeTotalMs = 0;
  for (const e of events) {
    const start = e.startTime ? Date.parse(e.startTime) : 0;
    if (!start) continue;
    const end = e.endTime ? Date.parse(e.endTime) : Date.now();
    timeTotalMs += Math.max(0, end - start);
  }
  const timePerUnitMs = completed > 0 ? Math.round(timeTotalMs / completed) : 0;

  // 工作中心名。
  let workCenter = "";
  if (op.workCenterId) {
    try {
      const wc = await getWorkCenter(client, op.workCenterId);
      workCenter = wc.data?.name ?? "";
    } catch {
      /* 忽略 */
    }
  }

  // 分包变体(款-色-码)。
  let variant = "";
  if (op.jobId) {
    const b = await client
      .from("bundleWorkOrders")
      .select("attributeLabel")
      .eq("jobId", op.jobId)
      .eq("companyId", companyId)
      .maybeSingle();
    variant = localizeVariantAttributeLabel(b.data?.attributeLabel, "zh");
  }

  // 生产日志:未作废的报工记录(合格/返工/报废),含报工人姓名与时间。
  const logs = quantities
    .slice()
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .map((q) => ({
      id: q.id,
      type: q.type as string,
      quantity: q.quantity ?? 0,
      who:
        [q.employee?.firstName, q.employee?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim() || "",
      date: q.createdAt as string
    }));

  // 材料清单 —— 与网页 getJobMaterialsByOperationId 同口径(含 kit 展开),
  // 用 serviceRole 避免 MES 员工 RLS 读不到 jobMaterial 视图。
  let materials: {
    id: string;
    materialId: string;
    itemId: string;
    name: string;
    desc: string;
    source: string;
    estimated: number;
    actual: number;
    toIssue: number;
  }[] = [];
  if (op.jobMakeMethodId) {
    try {
      const m = await getJobMaterialsByOperationId(serviceRole, {
        operation: op,
        trackedEntityId: undefined,
        requiresSerialTracking: false
      });
      materials = ((m.materials ?? []) as any[]).map((r) => {
        const estimated = r.estimatedQuantity ?? r.quantity ?? 0;
        const actual = r.quantityIssued ?? 0;
        return {
          id: r.id,
          materialId: r.id,
          itemId: r.itemId ?? "",
          name: r.itemReadableId ?? r.description ?? "",
          desc: r.description ?? "",
          source: r.methodType ?? "",
          estimated,
          actual,
          toIssue: r.quantityToIssue ?? Math.max(0, estimated - actual)
        };
      });
    } catch {
      /* 忽略 */
    }
  }

  const names = await resolveUserNames(client, [op.assignee]);
  const target =
    op.targetQuantity && op.targetQuantity > 0
      ? op.targetQuantity
      : (op.operationQuantity ?? 0);

  // 文件列表 —— 对齐网页 getJobFiles(job + opportunity-line + parts)。
  let files: {
    id: string;
    name: string;
    size: string;
    type: string;
    path: string;
  }[] = [];
  try {
    const jobRes = await getJobByOperationId(serviceRole, operationId);
    const job = jobRes.data as any;
    if (job?.id) {
      const items = op.itemId ? [{ itemId: op.itemId as string }] : [];
      const raw = await getJobFiles(serviceRole, companyId, job, items);
      files = (raw ?? [])
        .filter((f: any) => f?.id && f?.name && f.metadata != null)
        .map((f: any) => {
          const bucket = f.bucket as string;
          let folderId: string | null | undefined = "";
          if (bucket === "job") folderId = job.id;
          else if (bucket === "opportunity-line")
            folderId = job.salesOrderLineId ?? job.quoteLineId;
          else if (bucket === "parts") folderId = f.itemId ?? job.itemId;
          const storagePath = `${companyId}/${bucket}/${folderId}/${f.name}`;
          const sizeKb = Math.floor(Number(f.metadata?.size ?? 0) / 1024);
          return {
            id: String(f.id),
            name: f.name as string,
            size: convertKbToString(sizeKb),
            type: getFileType(f.name),
            path: storagePath
          };
        });
    }
  } catch {
    /* 忽略 */
  }

  return jsonResponse({
    found: true,
    id: op.id,
    readableId: op.jobReadableId ?? "",
    description: op.description ?? "",
    itemReadableId: op.itemReadableId ?? "",
    itemDescription: op.itemDescription ?? "",
    variant,
    unitOfMeasure: op.itemUnitOfMeasure ?? "",
    status: op.operationStatus ?? "",
    assignee: names.get(op.assignee) ?? "",
    assigneeId: op.assignee ?? "",
    isMine: op.assignee === userId,
    completed,
    target,
    rework,
    scrap,
    pending,
    deadlineType: op.jobDeadlineType ?? null,
    dueDate: op.operationDueDate ?? op.jobDueDate ?? null,
    workCenter,
    active,
    timeTotalMs,
    timePerUnitMs,
    unitOfMeasureText: op.itemUnitOfMeasure ?? "件",
    materials,
    files,
    logs
  });
}
