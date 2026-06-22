import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requestProductionPayApproval } from "~/modules/shared/shared.service";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type {
  ProductionQuantityApprovalRequestStatus,
  ProductionQuantityListRow,
  ProductionQuantityPayScope,
  ProductionQuantityPayStatus,
  ProductionQuantityReportFilterOption
} from "./productionQuantityList.models";

export type {
  ProductionQuantityApprovalRequestStatus,
  ProductionQuantityListRow,
  ProductionQuantityPayScope,
  ProductionQuantityPayStatus,
  ProductionQuantityReportFilterOption
} from "./productionQuantityList.models";

const employeeSalaryCompletionSelect = `
  id, quantity, createdAt, paymentYear, paymentMonth,
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(jobId)
  )
`;

const employeePendingSalaryCompletionSelect = `
  id, quantity, createdAt,
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(jobId)
  )
`;

const productionPayApprovalSelect = `
  id, quantity, createdAt, employeeId, createdBy, paymentYear, paymentMonth, invalidatedAt, reportId, configuration,
  employee:user!productionQuantity_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))
  )
`;

const productionPayApprovalReportSelect = `
  id, employeeId, createdBy, originalQuantity, jobOperationId,
  employee:user!productionQuantityReport_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))
  )
`;

const productionQuantityReportListSelect = `
  id, employeeId, createdBy, originalQuantity, jobOperationId, createdAt, notes,
  employee:user!productionQuantityReport_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))
  )
`;

type ProductionQuantityLinePayState = {
  paymentYear: number | null;
  invalidatedAt: string | null;
};

function deriveLinePayStatus(
  lines: ProductionQuantityLinePayState[]
): ProductionQuantityPayStatus {
  if (lines.length === 0) return "pending";
  const active = lines.filter((line) => !line.invalidatedAt);
  if (active.length === 0) return "rejected";
  if (active.some((line) => line.paymentYear != null)) return "approved";
  return "pending";
}

function getItemIdFromJobOperation(jobOperation: unknown): string | null {
  const jo = Array.isArray(jobOperation) ? jobOperation[0] : jobOperation;
  if (!jo || typeof jo !== "object" || !("job" in jo)) return null;
  const job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
  if (!job || typeof job !== "object" || !("item" in job)) return null;
  const item = Array.isArray(job.item) ? job.item[0] : job.item;
  if (!item || typeof item !== "object" || !("id" in item)) return null;
  return typeof item.id === "string" ? item.id : null;
}

function scopeWantsStatus(
  scope: ProductionQuantityPayScope,
  status: ProductionQuantityPayStatus
): boolean {
  if (scope.mode === "all") return true;
  if (scope.mode === "single") return scope.status === status;
  return scope.statuses.includes(status);
}

async function getProductionQuantityReportIdsForScope(
  client: SupabaseClient<Database>,
  companyId: string,
  scope: ProductionQuantityPayScope,
  enrichmentClient?: SupabaseClient<Database>
): Promise<Set<string> | null> {
  if (scope.mode === "all") return null;

  const db = enrichmentClient ?? client;
  const ids = new Set<string>();
  const latestApprovalByReport = new Map<
    string,
    ProductionQuantityApprovalRequestStatus
  >();

  const approvalStatuses: ProductionQuantityApprovalRequestStatus[] = [];
  if (scopeWantsStatus(scope, "pending")) approvalStatuses.push("Pending");
  if (scopeWantsStatus(scope, "approved")) approvalStatuses.push("Approved");
  if (scopeWantsStatus(scope, "rejected")) {
    approvalStatuses.push("Rejected", "Cancelled");
  }

  if (approvalStatuses.length > 0) {
    const { data: requests } = await db
      .from("approvalRequest")
      .select("documentId, status, requestedAt")
      .eq("companyId", companyId)
      .eq("documentType", "productionQuantityReport")
      .in("status", approvalStatuses)
      .order("requestedAt", { ascending: false });

    for (const req of requests ?? []) {
      if (!latestApprovalByReport.has(req.documentId)) {
        latestApprovalByReport.set(
          req.documentId,
          req.status as ProductionQuantityApprovalRequestStatus
        );
      }
    }

    for (const [reportId, status] of latestApprovalByReport) {
      const bucket: ProductionQuantityPayStatus =
        status === "Pending"
          ? "pending"
          : status === "Approved"
            ? "approved"
            : "rejected";
      if (scopeWantsStatus(scope, bucket)) {
        ids.add(reportId);
      }
    }
  }

  const { data: lineRows, error: lineRowsError } = await db
    .from("productionQuantity")
    .select("reportId, paymentYear, invalidatedAt")
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("invalidatedAt", null)
    .not("reportId", "is", null);

  if (!lineRowsError) {
    const linesByReport = new Map<string, ProductionQuantityLinePayState[]>();
    for (const line of lineRows ?? []) {
      if (!line.reportId) continue;
      const bucket = linesByReport.get(line.reportId) ?? [];
      bucket.push({
        paymentYear: line.paymentYear,
        invalidatedAt: line.invalidatedAt
      });
      linesByReport.set(line.reportId, bucket);
    }

    for (const [reportId, lines] of linesByReport) {
      if (latestApprovalByReport.has(reportId)) continue;
      const bucket = deriveLinePayStatus(lines);
      if (scopeWantsStatus(scope, bucket)) {
        ids.add(reportId);
      }
    }
  }

  return ids;
}

async function getActiveProductionQuantityReportIds(
  client: SupabaseClient<Database>,
  companyId: string,
  enrichmentClient?: SupabaseClient<Database>
) {
  const db = enrichmentClient ?? client;
  const { data, error } = await db
    .from("productionQuantity")
    .select("reportId")
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("invalidatedAt", null)
    .not("reportId", "is", null);

  if (error) {
    return { data: null as Set<string> | null, error };
  }

  return {
    data: new Set(
      (data ?? [])
        .map((row) => row.reportId)
        .filter((id): id is string => Boolean(id))
    ),
    error: null
  };
}

function normalizeProductionQuantityPayStatus(
  value: string
): ProductionQuantityPayStatus | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return null;
}

export function resolveProductionQuantityPayScope(
  filters: { column: string; operator: string; value?: string }[] | undefined
): ProductionQuantityPayScope {
  const statusFilters = filters?.filter((f) => f.column === "approvalStatus") ?? [];
  if (statusFilters.length === 0) {
    return { mode: "all" };
  }

  const statuses = new Set<ProductionQuantityPayStatus>();
  for (const statusFilter of statusFilters) {
    if (!statusFilter.value) continue;
    const values =
      statusFilter.operator === "in" || statusFilter.operator === "contains"
        ? statusFilter.value.split(",").map((v) => v.trim()).filter(Boolean)
        : [statusFilter.value];
    for (const value of values) {
      const normalized = normalizeProductionQuantityPayStatus(value);
      if (normalized) statuses.add(normalized);
    }
  }

  const list = [...statuses];
  if (list.length === 0 || list.length >= 3) {
    return { mode: "all" };
  }
  if (list.length === 1) {
    return { mode: "single", status: list[0]! };
  }

  return { mode: "multiple", statuses: list };
}

/** @deprecated Use resolveProductionQuantityPayScope */
export function resolveProductionQuantityPayStatus(
  filters: { column: string; value: string }[] | undefined
): ProductionQuantityPayStatus | "all" {
  const scope = resolveProductionQuantityPayScope(filters);
  if (scope.mode === "single") return scope.status;
  return "all";
}

function applyProductionQuantityPayScope(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  scope: ProductionQuantityPayScope
) {
  if (scope.mode === "all") {
    return query;
  }

  if (scope.mode === "single") {
    switch (scope.status) {
      case "pending":
        return query.is("paymentYear", null).is("invalidatedAt", null);
      case "approved":
        return query.not("paymentYear", "is", null).is("invalidatedAt", null);
      case "rejected":
        return query.not("invalidatedAt", "is", null);
    }
  }

  const hasPending = scope.statuses.includes("pending");
  const hasApproved = scope.statuses.includes("approved");
  const hasRejected = scope.statuses.includes("rejected");

  // Avoid PostgREST `.or()` when a single predicate covers the pair (also keeps
  // the query compatible with a separate search `.or()` on related tables).
  if (hasPending && hasApproved && !hasRejected) {
    return query.is("invalidatedAt", null);
  }
  if (hasPending && hasRejected && !hasApproved) {
    return query.or(
      "and(paymentYear.is.null,invalidatedAt.is.null),not.invalidatedAt.is.null"
    );
  }
  if (hasApproved && hasRejected && !hasPending) {
    return query.or(
      "and(paymentYear.not.is.null,invalidatedAt.is.null),not.invalidatedAt.is.null"
    );
  }

  return query;
}

async function getEmployeeIdsMatchingSearch(
  client: SupabaseClient<Database>,
  companyId: string,
  term: string
) {
  const pattern = `%${term}%`;
  return client
    .from("employeeSummary")
    .select("id")
    .eq("companyId", companyId)
    .or(
      `fullName.ilike.${pattern},firstName.ilike.${pattern},lastName.ilike.${pattern}`
    );
}

function getEmployeeIdsFromFilters(
  filters: GenericQueryFilters["filters"]
): string[] | null {
  return getFilterValuesFromFilters(filters, "employeeId");
}

function getFilterValuesFromFilters(
  filters: GenericQueryFilters["filters"],
  column: string
): string[] | null {
  if (!filters?.length) return null;

  const ids = new Set<string>();
  for (const filter of filters) {
    if (filter.column !== column || !filter.value) continue;
    if (filter.operator === "eq") {
      ids.add(filter.value);
    } else if (filter.operator === "in" || filter.operator === "contains") {
      for (const id of filter.value.split(",")) {
        const trimmed = id.trim();
        if (trimmed) ids.add(trimmed);
      }
    }
  }

  return ids.size > 0 ? [...ids] : null;
}


export async function getProductionQuantityReportFilterOptions(
  client: SupabaseClient<Database>,
  companyId: string,
  enrichmentClient?: SupabaseClient<Database>
) {
  const { data: activeReportIds, error: activeReportIdsError } =
    await getActiveProductionQuantityReportIds(
      client,
      companyId,
      enrichmentClient
    );

  if (activeReportIdsError) {
    return {
      jobs: [] as ProductionQuantityReportFilterOption[],
      items: [] as ProductionQuantityReportFilterOption[],
      error: activeReportIdsError
    };
  }

  if (!activeReportIds || activeReportIds.size === 0) {
    return {
      jobs: [] as ProductionQuantityReportFilterOption[],
      items: [] as ProductionQuantityReportFilterOption[],
      error: null
    };
  }

  const { data, error } = await client
    .from("productionQuantityReport")
    .select(
      `jobId, job:jobId(id, jobId, item:itemId(id, readableIdWithRevision, name))`
    )
    .eq("companyId", companyId)
    .in("id", [...activeReportIds]);

  if (error) {
    return { jobs: [] as ProductionQuantityReportFilterOption[], items: [] as ProductionQuantityReportFilterOption[], error };
  }

  const jobsMap = new Map<string, ProductionQuantityReportFilterOption>();
  const itemsMap = new Map<string, ProductionQuantityReportFilterOption>();

  for (const row of data ?? []) {
    const job = Array.isArray(row.job) ? row.job[0] : row.job;
    if (job?.id && job.jobId) {
      jobsMap.set(job.id, { id: job.id, label: job.jobId });
    }
    const item = job?.item;
    const itemRow = Array.isArray(item) ? item[0] : item;
    if (itemRow?.id) {
      const label =
        itemRow.readableIdWithRevision?.trim() ||
        itemRow.name?.trim() ||
        itemRow.id;
      itemsMap.set(itemRow.id, { id: itemRow.id, label });
    }
  }

  const sortByLabel = (
    a: ProductionQuantityReportFilterOption,
    b: ProductionQuantityReportFilterOption
  ) => a.label.localeCompare(b.label);

  return {
    jobs: [...jobsMap.values()].sort(sortByLabel),
    items: [...itemsMap.values()].sort(sortByLabel),
    error: null
  };
}

async function getProductionQuantityReportIdsForEmployees(
  client: SupabaseClient<Database>,
  companyId: string,
  employeeIds: string[]
) {
  if (employeeIds.length === 0) {
    return { data: [] as string[], error: null };
  }

  const { data, error } = await client
    .from("productionQuantityReport")
    .select("id")
    .eq("companyId", companyId)
    .in("employeeId", employeeIds);

  if (error) {
    return { data: null, error };
  }

  return { data: data?.map((row) => row.id) ?? [], error: null };
}

export async function getProductionQuantityPayLines(
  client: SupabaseClient<Database>,
  companyId: string,
  scope: ProductionQuantityPayScope,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("productionQuantity")
    .select(productionPayApprovalSelect, { count: "exact" })
    .eq("companyId", companyId)
    .eq("type", "Production");

  query = applyProductionQuantityPayScope(query, scope);

  if (args?.search) {
    const term = args.search.trim();
    if (term) {
      const { data: employees, error: searchError } =
        await getEmployeeIdsMatchingSearch(client, companyId, term);

      if (searchError) {
        return { data: null, error: searchError, count: null, status: 0, statusText: "" };
      }

      const employeeIds = employees?.map((row) => row.id) ?? [];
      if (employeeIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }

      query = query.in("employeeId", employeeIds);
    }
  }

  if (args) {
    const dbFilters = args.filters?.filter(
      (f) => f.column !== "approvalStatus"
    );
    query = setGenericQueryFilters(
      query,
      { ...args, filters: dbFilters },
      [{ column: "createdAt", ascending: false }]
    );
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  return query;
}

function mapScopeToApprovalRequestStatuses(
  scope: ProductionQuantityPayScope
): ProductionQuantityApprovalRequestStatus[] | null {
  if (scope.mode === "all") {
    return ["Pending", "Approved", "Rejected"];
  }
  if (scope.mode === "single") {
    switch (scope.status) {
      case "pending":
        return ["Pending"];
      case "approved":
        return ["Approved"];
      case "rejected":
        return ["Rejected"];
    }
  }
  const statuses: ProductionQuantityApprovalRequestStatus[] = [];
  if (scope.statuses.includes("pending")) statuses.push("Pending");
  if (scope.statuses.includes("approved")) statuses.push("Approved");
  if (scope.statuses.includes("rejected")) statuses.push("Rejected");
  return statuses.length > 0 ? statuses : null;
}

export async function getProductionQuantityListRows(
  client: SupabaseClient<Database>,
  companyId: string,
  scope: ProductionQuantityPayScope,
  args?: GenericQueryFilters & { search: string | null },
  enrichmentClient?: SupabaseClient<Database>
) {
  const statuses = mapScopeToApprovalRequestStatuses(scope);

  let query = client
    .from("approvalRequest")
    .select("*", { count: "exact" })
    .eq("companyId", companyId)
    .eq("documentType", "productionQuantityReport");

  if (statuses) {
    query = query.in("status", statuses);
  }

  let filteredDocumentIds: string[] | null = null;

  const filterEmployeeIds = getEmployeeIdsFromFilters(args?.filters);
  if (filterEmployeeIds) {
    const reportsForEmployees = await getProductionQuantityReportIdsForEmployees(
      client,
      companyId,
      filterEmployeeIds
    );
    if (reportsForEmployees.error) {
      return {
        data: null,
        error: reportsForEmployees.error,
        count: null,
        status: 0,
        statusText: ""
      };
    }
    filteredDocumentIds = reportsForEmployees.data;
    if (filteredDocumentIds.length === 0) {
      return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
    }
  }

  if (args?.search) {
    const term = args.search.trim();
    if (term) {
      const { data: employees, error: searchError } =
        await getEmployeeIdsMatchingSearch(client, companyId, term);
      if (searchError) {
        return {
          data: null,
          error: searchError,
          count: null,
          status: 0,
          statusText: ""
        };
      }
      const employeeIds = employees?.map((row) => row.id) ?? [];
      if (employeeIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }
      const reportsForSearch = await getProductionQuantityReportIdsForEmployees(
        client,
        companyId,
        employeeIds
      );
      if (reportsForSearch.error) {
        return {
          data: null,
          error: reportsForSearch.error,
          count: null,
          status: 0,
          statusText: ""
        };
      }
      const searchReportIds = reportsForSearch.data;
      if (searchReportIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }
      filteredDocumentIds =
        filteredDocumentIds === null
          ? searchReportIds
          : filteredDocumentIds.filter((id) => searchReportIds.includes(id));
      if (filteredDocumentIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }
    }
  }

  if (filteredDocumentIds) {
    query = query.in("documentId", filteredDocumentIds);
  }

  const dbFilters = args?.filters?.filter(
    (f) => f.column !== "approvalStatus" && f.column !== "employeeId"
  );
  if (args) {
    query = setGenericQueryFilters(
      query,
      { ...args, filters: dbFilters },
      [{ column: "requestedAt", ascending: false }]
    );
  } else {
    query = query.order("requestedAt", { ascending: false });
  }

  const requests = await query;
  if (requests.error) {
    return requests;
  }

  const list = requests.data ?? [];
  if (list.length === 0) {
    return {
      data: [],
      error: null,
      count: requests.count ?? 0,
      status: requests.status,
      statusText: requests.statusText
    };
  }

  const reportIds = list.map((r) => r.documentId);
  // Enrich with service role when provided: productionQuantity RLS (employee_role) can
  // block managers from loading line details even when approval requests are visible.
  const linesClient = enrichmentClient ?? client;
  const { data: lines, error: linesError } = await linesClient
    .from("productionQuantity")
    .select(productionPayApprovalSelect)
    .in("reportId", reportIds)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("invalidatedAt", null);

  if (linesError) {
    return {
      data: null,
      error: linesError,
      count: null,
      status: 0,
      statusText: ""
    };
  }

  const linesByReport = new Map<string, NonNullable<typeof lines>>();
  for (const line of lines ?? []) {
    if (!line.reportId) continue;
    const bucket = linesByReport.get(line.reportId) ?? [];
    bucket.push(line);
    linesByReport.set(line.reportId, bucket);
  }

  const missingReportIds = reportIds.filter((id) => !linesByReport.has(id));
  const reportFallbackById = new Map<
    string,
    {
      employeeId: string | null;
      createdBy: string | null;
      quantity: number;
      employee: ProductionQuantityListRow["employee"];
      jobOperation: unknown;
    }
  >();

  if (missingReportIds.length > 0) {
    const { data: reports, error: reportsError } = await linesClient
      .from("productionQuantityReport")
      .select(productionPayApprovalReportSelect)
      .in("id", missingReportIds)
      .eq("companyId", companyId);

    if (reportsError) {
      return {
        data: null,
        error: reportsError,
        count: null,
        status: 0,
        statusText: ""
      };
    }

    for (const report of reports ?? []) {
      reportFallbackById.set(report.id, {
        employeeId: report.employeeId,
        createdBy: report.createdBy,
        quantity: report.originalQuantity ?? 0,
        employee: report.employee,
        jobOperation: report.jobOperation
      });
    }
  }

  const rows: ProductionQuantityListRow[] = [];
  for (const req of list) {
    const reportLines = linesByReport.get(req.documentId) ?? [];
    const fallback = reportFallbackById.get(req.documentId);
    const primary = reportLines[0];
    const totalQty =
      reportLines.length > 0
        ? reportLines.reduce((sum, l) => sum + (l.quantity ?? 0), 0)
        : (fallback?.quantity ?? 0);
    const paymentYear = primary?.paymentYear ?? null;
    const paymentMonth = primary?.paymentMonth ?? null;

    rows.push({
      approvalRequestId: req.id,
      reportId: req.documentId,
      approvalStatus: req.status as ProductionQuantityApprovalRequestStatus,
      amount: req.amount ?? null,
      requestedBy: req.requestedBy ?? null,
      id: req.id,
      quantity: totalQty,
      createdAt: req.requestedAt ?? primary?.createdAt ?? null,
      employeeId: primary?.employeeId ?? fallback?.employeeId ?? null,
      createdBy: primary?.createdBy ?? fallback?.createdBy ?? null,
      paymentYear,
      paymentMonth,
      invalidatedAt: primary?.invalidatedAt ?? null,
      employee: primary?.employee ?? fallback?.employee ?? null,
      jobOperation: primary?.jobOperation ?? fallback?.jobOperation
    });
  }

  return {
    data: rows,
    error: null,
    count: requests.count,
    status: requests.status,
    statusText: requests.statusText
  };
}

/** Lists all production quantity reports with approval + line enrichment. */
export async function getProductionQuantityReportPayRows(
  client: SupabaseClient<Database>,
  companyId: string,
  scope: ProductionQuantityPayScope,
  args?: GenericQueryFilters & { search: string | null },
  enrichmentClient?: SupabaseClient<Database>
) {
  const { data: activeReportIds, error: activeReportIdsError } =
    await getActiveProductionQuantityReportIds(
      client,
      companyId,
      enrichmentClient
    );

  if (activeReportIdsError) {
    return {
      data: null,
      error: activeReportIdsError,
      count: null,
      status: 0,
      statusText: ""
    };
  }

  if (!activeReportIds || activeReportIds.size === 0) {
    return {
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: "OK"
    };
  }

  const scopeReportIds = await getProductionQuantityReportIdsForScope(
    client,
    companyId,
    scope,
    enrichmentClient
  );

  const reportIdFilter = scopeReportIds
    ? [...scopeReportIds].filter((id) => activeReportIds.has(id))
    : [...activeReportIds];

  if (reportIdFilter.length === 0) {
    return {
      data: [],
      error: null,
      count: 0,
      status: 200,
      statusText: "OK"
    };
  }

  let query = client
    .from("productionQuantityReport")
    .select(productionQuantityReportListSelect, { count: "exact" })
    .eq("companyId", companyId)
    .in("id", reportIdFilter);

  const filterEmployeeIds = getEmployeeIdsFromFilters(args?.filters);
  if (filterEmployeeIds) {
    query = query.in("employeeId", filterEmployeeIds);
  }

  const filterJobIds = getFilterValuesFromFilters(args?.filters, "jobId");
  const filterItemIds = getFilterValuesFromFilters(args?.filters, "itemId");
  let resolvedJobIds: string[] | null = filterJobIds;

  if (filterItemIds) {
    const { data: jobsForItems, error: jobsForItemsError } = await client
      .from("job")
      .select("id")
      .eq("companyId", companyId)
      .in("itemId", filterItemIds);

    if (jobsForItemsError) {
      return {
        data: null,
        error: jobsForItemsError,
        count: null,
        status: 0,
        statusText: ""
      };
    }

    const itemJobIds = jobsForItems?.map((job) => job.id) ?? [];
    if (itemJobIds.length === 0) {
      return {
        data: [],
        error: null,
        count: 0,
        status: 200,
        statusText: "OK"
      };
    }

    resolvedJobIds = resolvedJobIds
      ? resolvedJobIds.filter((id) => itemJobIds.includes(id))
      : itemJobIds;

    if (resolvedJobIds.length === 0) {
      return {
        data: [],
        error: null,
        count: 0,
        status: 200,
        statusText: "OK"
      };
    }
  }

  if (resolvedJobIds) {
    query = query.in("jobId", resolvedJobIds);
  }

  if (args?.search) {
    const term = args.search.trim();
    if (term) {
      const pattern = `%${term}%`;
      const { data: employees, error: searchError } =
        await getEmployeeIdsMatchingSearch(client, companyId, term);

      if (searchError) {
        return {
          data: null,
          error: searchError,
          count: null,
          status: 0,
          statusText: ""
        };
      }

      const employeeIds = employees?.map((row) => row.id) ?? [];
      const conditions = [
        `notes.ilike.${pattern}`,
        `jobOperation.description.ilike.${pattern}`
      ];
      if (employeeIds.length > 0) {
        conditions.push(`employeeId.in.(${employeeIds.join(",")})`);
      }
      query = query.or(conditions.join(","));
    }
  }

  const dbFilters = args?.filters?.filter(
    (f) =>
      f.column !== "approvalStatus" &&
      f.column !== "employeeId" &&
      f.column !== "jobId" &&
      f.column !== "itemId"
  );
  if (args) {
    query = setGenericQueryFilters(
      query,
      { ...args, filters: dbFilters },
      [{ column: "createdAt", ascending: false }]
    );
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  const reports = await query;
  if (reports.error) {
    return reports;
  }

  const reportList = reports.data ?? [];
  if (reportList.length === 0) {
    return {
      data: [],
      error: null,
      count: reports.count ?? 0,
      status: reports.status,
      statusText: reports.statusText
    };
  }

  const reportIds = reportList.map((report) => report.id);
  const linesClient = enrichmentClient ?? client;

  const [{ data: approvals, error: approvalsError }, { data: lines, error: linesError }] =
    await Promise.all([
      linesClient
        .from("approvalRequest")
        .select("id, documentId, status, amount, requestedBy, requestedAt")
        .eq("companyId", companyId)
        .eq("documentType", "productionQuantityReport")
        .in("documentId", reportIds)
        .order("requestedAt", { ascending: false }),
      linesClient
        .from("productionQuantity")
        .select(productionPayApprovalSelect)
        .in("reportId", reportIds)
        .eq("companyId", companyId)
        .eq("type", "Production")
        .is("invalidatedAt", null)
    ]);

  if (approvalsError) {
    return {
      data: null,
      error: approvalsError,
      count: null,
      status: 0,
      statusText: ""
    };
  }

  if (linesError) {
    return {
      data: null,
      error: linesError,
      count: null,
      status: 0,
      statusText: ""
    };
  }

  const latestApprovalByReport = new Map<
    string,
    NonNullable<typeof approvals>[number]
  >();
  for (const approval of approvals ?? []) {
    if (!latestApprovalByReport.has(approval.documentId)) {
      latestApprovalByReport.set(approval.documentId, approval);
    }
  }

  const linesByReport = new Map<string, NonNullable<typeof lines>>();
  for (const line of lines ?? []) {
    if (!line.reportId) continue;
    const bucket = linesByReport.get(line.reportId) ?? [];
    bucket.push(line);
    linesByReport.set(line.reportId, bucket);
  }

  const rows: ProductionQuantityListRow[] = [];
  for (const report of reportList) {
    const approval = latestApprovalByReport.get(report.id);
    const reportLines = linesByReport.get(report.id) ?? [];
    const primary = reportLines[0];
    const totalQty =
      reportLines.length > 0
        ? reportLines.reduce((sum, line) => sum + (line.quantity ?? 0), 0)
        : (report.originalQuantity ?? 0);
    const paymentYear = primary?.paymentYear ?? null;
    const paymentMonth = primary?.paymentMonth ?? null;
    const lineStatus = deriveLinePayStatus(
      reportLines.map((line) => ({
        paymentYear: line.paymentYear,
        invalidatedAt: line.invalidatedAt
      }))
    );
    const approvalStatus: ProductionQuantityApprovalRequestStatus | undefined =
      approval?.status ??
      (lineStatus === "pending"
        ? "Pending"
        : lineStatus === "approved"
          ? "Approved"
          : "Rejected");

    const jobOperation = primary?.jobOperation ?? report.jobOperation;

    rows.push({
      approvalRequestId: approval?.id,
      reportId: report.id,
      approvalStatus,
      amount: approval?.amount ?? null,
      requestedBy: approval?.requestedBy ?? null,
      id: approval?.id ?? report.id,
      quantity: totalQty,
      createdAt: approval?.requestedAt ?? primary?.createdAt ?? report.createdAt ?? null,
      employeeId: primary?.employeeId ?? report.employeeId ?? null,
      createdBy: primary?.createdBy ?? report.createdBy ?? null,
      jobId: report.jobId ?? null,
      itemId: getItemIdFromJobOperation(jobOperation),
      paymentYear,
      paymentMonth,
      invalidatedAt: primary?.invalidatedAt ?? null,
      configuration: primary?.configuration ?? null,
      employee: primary?.employee ?? report.employee ?? null,
      jobOperation
    });
  }

  return {
    data: rows,
    error: null,
    count: reports.count,
    status: reports.status,
    statusText: reports.statusText
  };
}

export async function ensureProductionQuantityApprovalRequest(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    requestedBy: string;
  }
) {
  const { reportId, companyId, requestedBy } = args;

  const { data: pending, error: pendingError } = await client
    .from("approvalRequest")
    .select("id")
    .eq("companyId", companyId)
    .eq("documentType", "productionQuantityReport")
    .eq("documentId", reportId)
    .eq("status", "Pending")
    .order("requestedAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pendingError) {
    return { data: null, error: pendingError };
  }

  if (pending?.id) {
    return { data: { id: pending.id }, error: null };
  }

  const amount = await computeProductionQuantityReportEarnedAmount(
    client,
    reportId,
    companyId
  );

  return requestProductionPayApproval(client, {
    reportId,
    companyId,
    requestedBy,
    amount
  });
}

export async function computeProductionQuantityReportEarnedAmount(
  client: SupabaseClient<Database>,
  reportId: string,
  companyId: string
): Promise<number> {
  const { data: lines, error } = await client
    .from("productionQuantity")
    .select(
      `quantity, jobOperation!inner(insideUnitCost)`,
    )
    .eq("reportId", reportId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null);

  if (error || !lines) return 0;

  return lines.reduce((sum, line) => {
    const jo = line.jobOperation as { insideUnitCost?: number | null } | null;
    const unitCost = jo?.insideUnitCost ?? 0;
    return sum + (line.quantity ?? 0) * unitCost;
  }, 0);
}

/** Production quantities assigned to an employee's pay period (salary detail). */
export async function getEmployeeSalaryCompletions(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string,
  year: number,
  month: number
) {
  return client
    .from("productionQuantity")
    .select(employeeSalaryCompletionSelect)
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .eq("paymentYear", year)
    .eq("paymentMonth", month)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

/** Pending production quantities for an employee (salary detail approval). */
export async function getPendingSalaryCompletions(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("productionQuantity")
    .select(employeePendingSalaryCompletionSelect)
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("paymentYear", null)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

export async function rejectProductionQuantity(
  client: SupabaseClient<Database>,
  productionQuantityId: string,
  updatedBy: string
) {
  const now = new Date().toISOString();
  return client
    .from("productionQuantity")
    .update({
      invalidatedAt: now,
      invalidatedBy: updatedBy,
      updatedBy,
      updatedAt: now
    })
    .eq("id", productionQuantityId)
    .is("paymentYear", null)
    .is("invalidatedAt", null)
    .select("id")
    .single();
}

export async function approveProductionQuantity(
  client: SupabaseClient<Database>,
  productionQuantityId: string,
  year: number,
  month: number,
  updatedBy: string
) {
  return client
    .from("productionQuantity")
    .update({
      paymentYear: year,
      paymentMonth: month,
      updatedBy,
      updatedAt: new Date().toISOString()
    })
    .eq("id", productionQuantityId)
    .select("id")
    .single();
}
