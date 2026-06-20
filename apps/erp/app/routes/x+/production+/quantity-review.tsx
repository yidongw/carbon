import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { VStack } from "@carbon/react";
import { trigger } from "@carbon/jobs";
import { NotificationEvent } from "@carbon/notifications";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useLocation, useNavigate, useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";
import {
  computeProductionQuantityReportEarnedAmount,
  getProductionPayApprovalRequestRows,
  resolveProductionPayApprovalScope,
  resolveProductionPayApprovalStatus
} from "~/modules/people";
import { ApprovalsTable } from "~/modules/people/ui/Approvals";
import {
  replaceProductionQuantityReportLines,
  replaceProductionQuantityReportLinesValidator,
  resolveProductionQuantityCanAutoApprove,
  syncProductionQuantityReportApproval
} from "~/modules/production";
import {
  approveRequest,
  canApproveRequest
} from "~/modules/shared";
import { getDatabaseClient } from "~/services/database.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Quantity Review`,
  to: `${path.to.quantityReview}?filter=${encodeURIComponent("approvalStatus:eq:Pending")}`,
  module: "production"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "people"
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getFullYear());
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const scope = resolveProductionPayApprovalScope(filters);
  const status = resolveProductionPayApprovalStatus(filters);
  const search = searchParams.get("search");

  const { data: employeeOptions, error: employeeOptionsError } = await client
    .from("employeeSummary")
    .select("id, name, avatarUrl")
    .eq("companyId", companyId)
    .order("name", { ascending: true });

  if (employeeOptionsError) {
    console.error("Failed to load employees for quantity review filters", employeeOptionsError);
  }

  const serviceRole = getCarbonServiceRole();
  const result = await getProductionPayApprovalRequestRows(
    client,
    companyId,
    scope,
    { search, limit, offset, sorts, filters },
    serviceRole
  );

  if (result.error) {
    console.error("Failed to load quantity review rows", result.error);
  }
  const baseRows = result.data ?? [];
  const rows = await Promise.all(
    baseRows.map(async (row) => {
      const canApproveRow =
        row.approvalStatus === "Pending"
          ? await canApproveRequest(
              serviceRole,
              {
                amount: row.amount,
                documentType: "productionQuantityReport",
                companyId
              },
              userId
            )
          : false;
      return { ...row, canApprove: canApproveRow };
    })
  );

  return {
    rows,
    count: result.count ?? 0,
    status,
    year,
    month,
    employees: employeeOptions ?? []
  };
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { userId } = await requirePermissions(request, {
    update: "people"
  });

  const url = new URL(request.url);
  const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(
    url.searchParams.get("month") ?? new Date().getMonth() + 1
  );

  const formData = await request.formData();
  const intent = formData.get("intent") as string | null;
  const approvalRequestId = formData.get("approvalRequestId") as string;

  if (!approvalRequestId) {
    return { error: "Missing approvalRequestId" };
  }

  const serviceRole = getCarbonServiceRole();
  const { data: approvalRequest, error: fetchError } = await serviceRole
    .from("approvalRequest")
    .select("id, status, documentType, documentId, companyId, amount, requestedBy")
    .eq("id", approvalRequestId)
    .single();

  if (fetchError || !approvalRequest) {
    return { error: "Approval request not found" };
  }

  if (approvalRequest.documentType !== "productionQuantityReport") {
    return { error: "Invalid approval request type" };
  }

  if (approvalRequest.status !== "Pending") {
    return { error: "Approval request is not pending" };
  }

  const canApprove = await canApproveRequest(
    serviceRole,
    {
      amount: approvalRequest.amount,
      documentType: approvalRequest.documentType,
      companyId: approvalRequest.companyId
    },
    userId
  );

  if (!canApprove) {
    return { error: "You do not have permission to approve this request" };
  }

  const db = getDatabaseClient();
  const reportId = approvalRequest.documentId;

  if (intent === "rejectWithCorrection") {
    const linesJson = formData.get("lines") as string | null;
    const notes = (formData.get("notes") as string | null)?.trim() || null;

    if (!linesJson) {
      return { error: "Missing quantity lines" };
    }

    let parsedLines: unknown;
    try {
      parsedLines = JSON.parse(linesJson);
    } catch {
      return { error: "Invalid quantity lines" };
    }

    const lineValidation = replaceProductionQuantityReportLinesValidator.safeParse(
      { notes: notes ?? undefined, lines: parsedLines }
    );
    if (!lineValidation.success) {
      return { error: "Invalid quantity lines" };
    }

    const { data: reportRow, error: reportRowError } = await serviceRole
      .from("productionQuantityReport")
      .select("employeeId")
      .eq("id", reportId)
      .eq("companyId", approvalRequest.companyId)
      .single();

    if (reportRowError || !reportRow) {
      return { error: "Production quantity report not found" };
    }

    const amount = await computeProductionQuantityReportEarnedAmount(
      serviceRole,
      reportId,
      approvalRequest.companyId
    );
    const canAutoApprove = await resolveProductionQuantityCanAutoApprove(
      serviceRole,
      approvalRequest.companyId,
      userId,
      amount
    );

    const paymentYear = canAutoApprove ? year : null;
    const paymentMonth = canAutoApprove ? month : null;

    const update = await replaceProductionQuantityReportLines(serviceRole, {
      reportId,
      companyId: approvalRequest.companyId,
      userId,
      employeeId: reportRow.employeeId ?? userId,
      notes,
      lines: lineValidation.data.lines.map((line) => ({
        ...line,
        scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined
      })),
      paymentYear,
      paymentMonth
    });

    if (update.error) {
      return { error: update.error.message ?? "Failed to update quantities" };
    }

    await syncProductionQuantityReportApproval(serviceRole, {
      reportId,
      companyId: approvalRequest.companyId,
      userId,
      canAutoApprove,
      paymentYear,
      paymentMonth
    });

    const requestedBy = approvalRequest.requestedBy;
    if (requestedBy && requestedBy !== userId) {
      try {
        await trigger("notify", {
          event: NotificationEvent.ApprovalRejected,
          companyId: approvalRequest.companyId,
          documentId: reportId,
          documentType: "productionQuantityReport",
          recipient: { type: "user", userId: requestedBy },
          from: userId
        });
      } catch (e) {
        console.error("Failed to trigger approval decision notification", e);
      }
    }

    return { ok: true, report: update.data };
  }

  const result = await approveRequest(db, approvalRequestId, userId, undefined, {
    productionPay: {
      paymentYear: year,
      paymentMonth: month,
      supabaseClient: serviceRole
    }
  });
  if (result.error) return { error: result.error.message };

  const requestedBy = approvalRequest.requestedBy;
  if (requestedBy && requestedBy !== userId) {
    try {
      await trigger("notify", {
        event: NotificationEvent.ApprovalApproved,
        companyId: approvalRequest.companyId,
        documentId: reportId,
        documentType: "productionQuantityReport",
        recipient: { type: "user", userId: requestedBy },
        from: userId
      });
    } catch (e) {
      console.error("Failed to trigger approval decision notification", e);
    }
  }

  return { ok: true };
}

export default function QuantityReviewRoute() {
  const { rows, count, status, year, month, employees } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const submitAction = useMemo(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has("year")) params.set("year", String(year));
    if (!params.has("month")) params.set("month", String(month));
    const query = params.toString();
    return query ? `${location.pathname}?${query}` : location.pathname;
  }, [location.pathname, location.search, year, month]);

  const onPeriodChange = useCallback(
    (y: number, m: number) => {
      const next = new URLSearchParams(searchParams);
      next.set("year", String(y));
      next.set("month", String(m));
      navigate(`${path.to.quantityReview}?${next.toString()}`);
    },
    [navigate, searchParams]
  );

  return (
    <VStack spacing={0} className="h-full">
      <ApprovalsTable
        data={rows}
        count={count}
        status={status}
        year={year}
        month={month}
        employees={employees}
        onPeriodChange={onPeriodChange}
        submitAction={submitAction}
      />
    </VStack>
  );
}
