import { assertIsPost } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { VStack } from "@carbon/react";
import { trigger } from "@carbon/jobs";
import { NotificationEvent } from "@carbon/notifications";
import { msg } from "@lingui/core/macro";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router";
import { useCallback, useMemo } from "react";
import {
  computeProductionQuantityReportEarnedAmount,
  ensureProductionQuantityApprovalRequest,
  getItemIdsWithConfigurationParameters,
  getProductionQuantityReportFilterOptions,
  getProductionQuantityReportPayRows,
  resolveProductionQuantityPayScope,
  resolveProductionQuantityPayStatus
} from "~/modules/production";
import { getItemInternalId } from "~/modules/production/productionQuantityDisplay.utils";
import { ProductionQuantitiesTable } from "~/modules/production/ui/ProductionQuantities";
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

const defaultPendingFilter = "approvalStatus:eq:Pending";

export const handle: Handle = {
  breadcrumb: msg`Process Completions`,
  to: `${path.to.productionQuantities}?filter=${encodeURIComponent(defaultPendingFilter)}`,
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
  const filterParams = searchParams.getAll("filter");
  const isQuantitiesIndex = url.pathname === path.to.productionQuantities;

  // Default to pending on first landing only; allow clearing filters to show all rows.
  if (
    isQuantitiesIndex &&
    filterParams.length === 0 &&
    searchParams.toString() === ""
  ) {
    throw redirect(
      `${path.to.productionQuantities}?filter=${encodeURIComponent(defaultPendingFilter)}`
    );
  }

  const now = new Date();
  const year = Number(searchParams.get("year") ?? now.getFullYear());
  const month = Number(searchParams.get("month") ?? now.getMonth() + 1);

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
    error: filterOptionsError
  } = await getProductionQuantityReportFilterOptions(client, companyId, serviceRole);

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

  const result = await getProductionQuantityReportPayRows(
    client,
    companyId,
    scope,
    { search, limit, offset, sorts, filters },
    serviceRole
  );

  if (result.error) {
    console.error("Failed to load production quantity rows", result.error);
  }
  const baseRows = result.data ?? [];
  const rows = await Promise.all(
    baseRows.map(async (row) => {
      let approvalRequestId = row.approvalRequestId;
      const isPending =
        row.approvalStatus === "Pending" && row.paymentYear == null;

      if (!approvalRequestId && isPending && row.reportId) {
        const ensured = await ensureProductionQuantityApprovalRequest(serviceRole, {
          reportId: row.reportId,
          companyId,
          requestedBy: row.createdBy ?? row.requestedBy ?? userId
        });
        if (ensured.data?.id) {
          approvalRequestId = ensured.data.id;
        }
      }

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
      return { ...row, approvalRequestId, canApprove: canApproveRow };
    })
  );

  const itemIds = [
    ...new Set(
      rows
        .map((row) => getItemInternalId(row))
        .filter((id): id is string => Boolean(id))
    )
  ];
  const configurableItemIds = await getItemIdsWithConfigurationParameters(
    client,
    companyId,
    itemIds
  );

  return {
    rows,
    count: result.count ?? 0,
    status,
    year,
    month,
    employees: employeeOptions ?? [],
    jobs: jobOptions,
    items: itemOptions,
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

export default function ProductionQuantitiesRoute() {
  const { rows, count, status, year, month, employees, jobs, items, configurableItemIds } =
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
      navigate(`${path.to.productionQuantities}?${next.toString()}`);
    },
    [navigate, searchParams]
  );

  return (
    <VStack spacing={0} className="h-full">
      <ProductionQuantitiesTable
        data={rows}
        count={count}
        status={status}
        year={year}
        month={month}
        employees={employees}
        jobs={jobs}
        items={items}
        onPeriodChange={onPeriodChange}
        submitAction={submitAction}
        showCreateAction
        configurableItemIds={configurableItemIds}
      />
      <Outlet />
    </VStack>
  );
}
