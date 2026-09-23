import type { LoaderFunctionArgs } from "react-router";
import {
  findCurrentOperation,
  getBundleForScan,
  getBundleOperations
} from "~/services/bundle.service";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

// 扫码解析:分包工单码(bwo_…)→ 当前工序。
// 对齐网页 /x/bundle/:bundleWorkOrderId 的重定向逻辑:
//   bundle → 后台 jobId → 该 job 全部工序(按 order)→ 第一个未 Done/Canceled 的 = 当前工序。
// 返回 operationId 让小程序跳工序执行页;若全部完成则 allDone=true(前端提示,不跳)。
export async function loader({ request, params }: LoaderFunctionArgs) {
  const { userId, companyId, client } = await requireMiniappUser(request);
  const id = params.id ?? "";
  const empty = {
    found: false,
    operationId: "",
    jobId: "",
    jobReadableId: "",
    allDone: false,
    isMine: false
  };
  if (!companyId || !id) return jsonResponse(empty);

  const bundle = await getBundleForScan(client, id, companyId);
  const jobId = (bundle.data?.jobId as string) ?? "";
  if (!jobId) return jsonResponse(empty);
  const jobReadableId = (bundle.data?.jobReadableId as string) ?? "";

  const ops = await getBundleOperations(client, jobId);
  const cur = findCurrentOperation(ops.data ?? []);
  if (!cur) {
    // 所有工序均已完成/取消 —— 网页会跳工序图,小程序侧提示即可。
    return jsonResponse({
      found: true,
      operationId: "",
      jobId,
      jobReadableId,
      allDone: true,
      isMine: false
    });
  }

  return jsonResponse({
    found: true,
    operationId: cur.id,
    jobId,
    jobReadableId,
    allDone: false,
    isMine: cur.assignee === userId
  });
}
