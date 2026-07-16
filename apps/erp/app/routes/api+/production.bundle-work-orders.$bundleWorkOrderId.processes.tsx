import { requirePermissions } from "@carbon/auth/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import {
  getBundleWorkOrder,
  getJobOperations,
  type JobOperation
} from "~/modules/production";

export type BundleWorkOrderProcessesOverlayLoaderData = {
  operations: JobOperation[];
  count: number;
  jobId: string;
  bundleDisplayId: string | null;
  jobStatus: string;
};

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<BundleWorkOrderProcessesOverlayLoaderData | null> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    role: "employee"
  });

  const { bundleWorkOrderId } = params;
  if (!bundleWorkOrderId) return null;

  const bundleWorkOrder = await getBundleWorkOrder(
    client,
    bundleWorkOrderId,
    companyId
  );
  if (bundleWorkOrder.error || !bundleWorkOrder.data?.jobId) return null;
  const jobId = bundleWorkOrder.data.jobId;

  const operations = await getJobOperations(client, jobId, { search: null });

  return {
    operations: operations.data ?? [],
    count: operations.count ?? 0,
    jobId,
    bundleDisplayId: bundleWorkOrder.data.jobReadableId ?? null,
    jobStatus: bundleWorkOrder.data.status ?? ""
  };
}
