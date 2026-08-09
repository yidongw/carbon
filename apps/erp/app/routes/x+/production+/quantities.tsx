import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { trigger } from "@carbon/jobs";
import { NotificationEvent } from "@carbon/notifications";
import { VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { useMemo } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useLocation } from "react-router";
import {
  computeProductionQuantityReportEarnedAmount,
  getItemIdsWithVariantQuantityGrid,
  getProductionQuantityReportFilterOptions,
  getProductionQuantityReportPayRows,
  replaceProductionQuantityReportLines,
  replaceProductionQuantityReportLinesValidator,
  resolveProductionQuantityCanAutoApprove,
  resolveProductionQuantityPayScope,
  resolveProductionQuantityPayStatus,
  syncProductionQuantityReportApproval
} from "~/modules/production";
import { getItemInternalId } from "~/modules/production/productionQuantityDisplay.utils";
import { ProductionQuantitiesTable } from "~/modules/production/ui/ProductionQuantities";
import { approveRequest, canApproveRequest } from "~/modules/shared";
import { getDatabaseClient } from "~/services/database.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";

export const handle: Handle = {
  breadcrumb: msg`Process Completions`,
  to: path.to.productionQuantities,
  module: "production"
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, companyId, userId } = await requirePermissions(request, {
    view: "production",
    role: "employee",
    bypassRls: true
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const scope = resolveProductionQuantityPayScope(filters);
  const status = resolveProductionQuantityPayStatus(filters);
  const search = searchParams.get("search");
  const serviceRole = getCarbonServiceRole();

  const { data: employeeOptions, error: employeeOptionsError } = await client
    .from("employeeSummary")
    .select("id, name, avatarUrl")
    .eq("companyId", companyId)
    .order("name", { ascending: true });

  const {
    jobs: jobOptions,
    items: itemOptions,
    operations: operationOptions,
    error: filterOptionsError
  } = await getProductionQuantityReportFilterOptions(
    client,
    companyId,
    serviceRole
  );

  if (employeeOptionsError) {
    console.error(
      "Failed to load employees for production quantity filters",
      employeeOptionsError
    );
  }

  if (filterOptionsError) {
    console.error(
      "Failed to load job/item filters for production quantities",
      filterOptionsError
    );
  }

  // Pending count = distinct reports with at least one unpaid, non-invalidated line.
  // productionQuantity is the source of truth; no approvalRequest involvement.
  const [result, pendingLineData] = await Promise.all([
    getProductionQuantityReportPayRows(
      client,
      companyId,
      scope,
      { search, limit, offset, sorts, filters },
      serviceRole
    ),
    serviceRole
      .from("productionQuantity")
      .select("reportId")
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("paymentYear", null)
      .is("invalidatedAt", null)
      .not("reportId", "is", null)
  ]);

  const pendingCountResult = {
    count: new Set(
      (pendingLineData.data ?? [])
        .map((l) => l.reportId)
        .filter((id): id is string => Boolean(id))
    ).size
  };

  if (pendingLineData.error) {
    console.error("Failed to load pending count", pendingLineData.error);
  }

  if (result.error) {
    console.error("Failed to load production quantity rows", result.error);
  }
  const baseRows = result.data ?? [];
  const rows = await Promise.all(
    baseRows.map(async (row) => {
      const approvalRequestId = row.approvalRequestId;
      const isPending =
        row.approvalStatus === "Pending" && row.paymentYear == null;

      // Only show approve/reject for rows that already have an approval request.
      // Production quantities are not auto-submitted into the approval flow.
      const canApproveRow =
        approvalRequestId && isPending
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

  const itemIds = [
    ...new Set(
      rows
        .map((row) => getItemInternalId(row))
        .filter((id): id is string => Boolean(id))
    )
  ];
  const configurableItemIds = await getItemIdsWithVariantQuantityGrid(
    client,
    companyId,
    itemIds
  );

  return {
    rows,
    count: result.count ?? 0,
    status,
    pendingCount: pendingCountResult.count ?? 0,
    employees: (employeeOptions ?? []).filter(
      (e): e is typeof e & { id: string } => e.id != null
    ),
    jobs: jobOptions,
    items: itemOptions,
    operations: operationOptions,
    configurableItemIds
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
    .select(
      "id, status, documentType, documentId, companyId, amount, requestedBy"
    )
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

    const lineValidation =
      replaceProductionQuantityReportLinesValidator.safeParse({
        notes: notes ?? undefined,
        lines: parsedLines
      });
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

  const result = await approveRequest(
    db,
    approvalRequestId,
    userId,
    undefined,
    {
      productionPay: {
        paymentYear: year,
        paymentMonth: month,
        supabaseClient: serviceRole
      }
    }
  );
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

export default function ProductionQuantitiesRoute() {
  const {
    rows,
    count,
    status,
    pendingCount,
    employees,
    jobs,
    items,
    operations,
    configurableItemIds
  } = useLoaderData<typeof loader>();
  const location = useLocation();

  const submitAction = useMemo(() => {
    return location.search
      ? `${location.pathname}${location.search}`
      : location.pathname;
  }, [location.pathname, location.search]);

  return (
    <VStack spacing={0} className="h-full">
      <ProductionQuantitiesTable
        data={rows}
        count={count}
        status={status}
        pendingCount={pendingCount}
        employees={employees}
        jobs={jobs}
        items={items}
        operations={operations}
        submitAction={submitAction}
        showCreateAction
        configurableItemIds={configurableItemIds}
      />
    </VStack>
  );
}
