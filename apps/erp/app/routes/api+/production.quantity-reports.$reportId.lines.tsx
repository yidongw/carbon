import { assertIsPost, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  isJobLocked,
  listProductionQuantityReportLines,
  replaceProductionQuantityReportLines,
  replaceProductionQuantityReportLinesValidator
} from "~/modules/production";
import { requireUnlocked } from "~/utils/lockedGuard.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const { reportId } = params;
  if (!reportId) throw notFound("reportId not found");

  const includeInvalidated =
    new URL(request.url).searchParams.get("includeInvalidated") === "true";

  const { data: lines, error } = await listProductionQuantityReportLines(
    client,
    {
      reportId,
      companyId,
      includeInvalidated
    }
  );

  if (error) {
    return data({ error: error.message }, { status: 500 });
  }

  const { data: report } = await client
    .from("productionQuantityReport")
    .select("*")
    .eq("id", reportId)
    .eq("companyId", companyId)
    .single();

  return { report: report ?? null, lines: lines ?? [] };
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "PATCH" && request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client, companyId, userId } = await requirePermissions(request, {
    update: "production"
  });

  const { reportId } = params;
  if (!reportId) throw notFound("reportId not found");

  const { data: report, error: reportError } = await client
    .from("productionQuantityReport")
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

  const body = await request.json();
  const parsed = replaceProductionQuantityReportLinesValidator.safeParse(body);
  if (!parsed.success) {
    return data({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = await replaceProductionQuantityReportLines(client, {
    reportId,
    companyId,
    userId,
    employeeId: userId,
    notes: parsed.data.notes ?? null,
    lines: parsed.data.lines
  });

  if (result.error) {
    return data(
      { error: result.error.message ?? "Failed to update report" },
      { status: 500 }
    );
  }

  return { report: result.data };
}
