import { assertIsPost, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  createOutsideProcessingPoFromSupplierReport,
  isJobLocked
} from "~/modules/production";
import { requireUnlocked } from "~/utils/lockedGuard.server";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { client, companyId, companyGroupId, userId } =
    await requirePermissions(request, {
      create: "purchasing"
    });

  const { reportId } = params;
  if (!reportId) throw notFound("reportId not found");

  const { data: report, error: reportError } = await client
    .from("jobOperationSupplierQuantityReport")
    .select("jobId")
    .eq("id", reportId)
    .eq("companyId", companyId)
    .single();

  if (reportError || !report?.jobId) {
    return data({ error: "Report not found" }, { status: 404 });
  }

  const { client: viewClient } = await requirePermissions(request, {
    view: "production"
  });
  const { data: job } = await viewClient
    .from("job")
    .select("status")
    .eq("id", report.jobId)
    .single();

  await requireUnlocked({
    request,
    isLocked: isJobLocked(job?.status),
    redirectTo: `/x/job/${report.jobId}`,
    message: "Cannot modify a locked job. Reopen it first."
  });

  const result = await createOutsideProcessingPoFromSupplierReport(client, {
    reportId,
    companyId,
    companyGroupId,
    userId
  });

  if (result.error) {
    return data(
      {
        error:
          result.error instanceof Error
            ? result.error.message
            : String(result.error)
      },
      { status: 500 }
    );
  }

  return { ...result.data };
}
