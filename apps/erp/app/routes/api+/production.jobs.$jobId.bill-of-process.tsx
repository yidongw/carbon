import { requirePermissions } from "@carbon/auth/auth.server";
import type { JSONContent } from "@carbon/react";
import type { ComponentProps } from "react";
import type { LoaderFunctionArgs } from "react-router";
import {
  getJob,
  getJobMakeMethodById,
  getJobMaterialsByMethodId,
  getJobOperationsByMethodId,
  getRootMakeMethod
} from "~/modules/production";
import type JobBillOfProcess from "~/modules/production/ui/Jobs/JobBillOfProcess";
import { getTagsList } from "~/modules/shared";

export type JobBillOfProcessOverlayLoaderData = {
  jobDisplayId: string | null;
  billOfProcess: ComponentProps<typeof JobBillOfProcess> | null;
};

export async function loader({
  request,
  params
}: LoaderFunctionArgs): Promise<JobBillOfProcessOverlayLoaderData> {
  const { client, companyId } = await requirePermissions(request, {
    view: "production",
    bypassRls: true
  });

  const { jobId } = params;
  if (!jobId) {
    return { jobDisplayId: null, billOfProcess: null };
  }

  const job = await getJob(client, jobId);
  if (job.error || !job.data) {
    return { jobDisplayId: null, billOfProcess: null };
  }

  const rootMethod = await getRootMakeMethod(client, jobId, companyId);
  if (rootMethod.error || !rootMethod.data?.id) {
    return { jobDisplayId: job.data.jobId ?? null, billOfProcess: null };
  }

  const methodId = rootMethod.data.id;

  const [materials, operations, tags, makeMethod] = await Promise.all([
    getJobMaterialsByMethodId(client, methodId),
    getJobOperationsByMethodId(client, methodId),
    getTagsList(client, companyId, "operation"),
    getJobMakeMethodById(client, methodId, companyId)
  ]);

  if (!makeMethod.data?.id) {
    return { jobDisplayId: job.data.jobId ?? null, billOfProcess: null };
  }

  return {
    jobDisplayId: job.data.jobId ?? null,
    billOfProcess: {
      routeJobId: job.data.id!,
      routeJob: job.data,
      customerId: job.data.customerId ?? "",
      itemId: makeMethod.data.itemId ?? "",
      jobMakeMethodId: makeMethod.data.id,
      locationId: job.data.locationId ?? "",
      materials:
        materials?.data?.map((m) => ({
          ...m,
          itemType: m.itemType as "Part",
          unitOfMeasureCode: m.unitOfMeasureCode ?? "",
          jobOperationId: m.jobOperationId ?? undefined
        })) ?? [],
      operations:
        operations.data?.map((o) => ({
          ...o,
          jobId: o.jobId ?? job.data.id!,
          description: o.description ?? "",
          workCenterId: o.workCenterId ?? undefined,
          laborRate: o.laborRate ?? 0,
          machineRate: o.machineRate ?? 0,
          operationSupplierProcessId: o.operationSupplierProcessId ?? undefined,
          jobMakeMethodId: o.jobMakeMethodId ?? methodId,
          workInstruction: o.workInstruction as JSONContent
        })) ?? [],
      salesOrderLineId: job.data.salesOrderLineId ?? "",
      tags: tags.data ?? []
    } as ComponentProps<typeof JobBillOfProcess>
  };
}
