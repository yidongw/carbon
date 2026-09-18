import type { LoaderFunctionArgs } from "react-router";
import {
  getJobOperationDependencies,
  getJobOperations
} from "~/services/operations.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

/**
 * 任务工序 DAG：对齐网页 `/x/job/:jobId`（JobDag）。
 * 返回 readableId + operations + dependencies，供小程序画布渲染。
 */
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { companyId, client } = await requireMiniappUser(request);
  const jobId = params.jobId ?? "";
  if (!companyId || !jobId) {
    return jsonResponse({ found: false });
  }

  const [job, operations, dependencies] = await Promise.all([
    client.from("jobs").select("jobId").eq("id", jobId).single(),
    getJobOperations(client, jobId),
    getJobOperationDependencies(client, jobId)
  ]);

  if (job.error || !job.data) {
    return jsonResponse({ found: false });
  }

  const ops = (operations.data ?? []) as any[];
  const deps = (dependencies.data ?? []) as any[];

  return jsonResponse({
    found: true,
    readableId: job.data.jobId ?? jobId,
    operations: ops.map((o) => ({
      id: o.id,
      description: o.description ?? "",
      status: o.status ?? "Todo",
      quantityComplete: Number(o.quantityComplete ?? 0),
      targetQuantity: Number(o.targetQuantity ?? 0),
      quantityReworked: Number(o.quantityReworked ?? 0),
      quantityScrapped: Number(o.quantityScrapped ?? 0),
      isRework: !!o.reworkId,
      itemId: o.jobMakeMethod?.item?.readableIdWithRevision ?? null
    })),
    dependencies: deps.map((d) => ({
      operationId: d.operationId,
      dependsOnId: d.dependsOnId
    }))
  });
}
