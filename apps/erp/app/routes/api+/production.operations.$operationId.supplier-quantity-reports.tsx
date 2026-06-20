import { assertIsPost, notFound } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  createJobOperationSupplierQuantityReport,
  createJobOperationSupplierQuantityReportValidator,
  getOperationQuantitySummary,
  isJobLocked,
  listJobOperationSupplierQuantityReportsForOperation
} from "~/modules/production";
import { requireUnlocked } from "~/utils/lockedGuard.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "production"
  });

  const { operationId } = params;
  if (!operationId) throw notFound("operationId not found");

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const summaryOnly = url.searchParams.get("summary") === "true";

  if (summaryOnly) {
    const { data: summary, error: summaryError } =
      await getOperationQuantitySummary(client, operationId, companyId);
    if (summaryError) {
      return data(
        {
          error:
            summaryError instanceof Error
              ? summaryError.message
              : String(summaryError)
        },
        { status: 500 }
      );
    }
    return { summary };
  }

  const result = await listJobOperationSupplierQuantityReportsForOperation(
    client,
    {
      jobOperationId: operationId,
      companyId,
      page: Number.isFinite(page) ? page : 1
    }
  );

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

  return {
    reports: result.data,
    count: result.count,
    hasMore: result.hasMore
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);

  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const { operationId } = params;
  if (!operationId) throw notFound("operationId not found");

  const { data: operation, error: operationError } = await client
    .from("jobOperation")
    .select("jobId")
    .eq("id", operationId)
    .eq("companyId", companyId)
    .single();

  if (operationError || !operation?.jobId) {
    return data({ error: "Operation not found" }, { status: 404 });
  }

  const { client: viewClient } = await requirePermissions(request, {
    view: "production"
  });
  const { data: job } = await viewClient
    .from("job")
    .select("status")
    .eq("id", operation.jobId)
    .single();

  await requireUnlocked({
    request,
    isLocked: isJobLocked(job?.status),
    redirectTo: `/x/job/${operation.jobId}`,
    message: "Cannot modify a locked job. Reopen it first."
  });

  const body = await request.json();
  const parsed = createJobOperationSupplierQuantityReportValidator.safeParse(body);
  if (!parsed.success) {
    return data({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    supplierProcessId,
    notes,
    lines,
    operationUnitCost,
    operationMinimumCost,
    snapshotPricingEdited
  } = parsed.data;
  const result = await createJobOperationSupplierQuantityReport(client, {
    companyId,
    jobId: operation.jobId,
    jobOperationId: operationId,
    supplierProcessId,
    userId,
    notes: notes ?? null,
    lines,
    snapshotPricing:
      operationUnitCost != null
        ? {
            operationUnitCost,
            operationMinimumCost: operationMinimumCost ?? 0
          }
        : undefined,
    snapshotPricingEdited: snapshotPricingEdited === true
  });

  if (result.error) {
    return data(
      { error: result.error.message ?? "Failed to create report" },
      { status: 500 }
    );
  }

  return { report: result.data };
}
