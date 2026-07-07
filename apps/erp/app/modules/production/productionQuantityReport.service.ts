import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  canApproveRequest,
  cancelApprovalRequestsForDocument,
  requestProductionPayApproval
} from "~/modules/shared";
import { computeJobConfigTableTotal } from "./jobConfiguration";
import { computeProductionQuantityReportEarnedAmount } from "./productionQuantityList.service";
import type { ProductionQuantityLineInput } from "./productionQuantityReport.models";

export type ProductionQuantityReportLine =
  Database["public"]["Tables"]["productionQuantity"]["Row"] & {
    scrapReason?: { name: string | null } | null;
  };

export type ProductionQuantityReportWithLines =
  Database["public"]["Tables"]["productionQuantityReport"]["Row"] & {
    activeLines: ProductionQuantityReportLine[];
    hasHistory: boolean;
  };

export type OperationQuantitySummary = {
  production: number;
  scrap: number;
  rework: number;
  productionConfigurations: Json[];
  scrapConfigurations: Json[];
  reworkConfigurations: Json[];
};

export function validateProductionQuantityLines(
  lines: ProductionQuantityLineInput[]
) {
  const types = lines.map((l) => l.type);
  if (types.length !== new Set(types).size) {
    return {
      error: new Error(
        "Each quantity line must have a distinct type (Production, Rework, or Scrap)"
      )
    };
  }

  for (const line of lines) {
    if (line.quantity <= 0) {
      return {
        error: new Error("Each line must have a quantity greater than zero")
      };
    }
    if (line.type !== "Scrap") {
      line.scrapReasonId = undefined;
    }
    if (line.configuration) {
      const configTotal = computeJobConfigTableTotal(
        line.configuration as Json
      );
      if (configTotal > 0 && Math.abs(configTotal - line.quantity) > 0.0001) {
        return {
          error: new Error(
            `Line quantity (${line.quantity}) must match configuration total (${configTotal})`
          )
        };
      }
    }
  }
  return { error: null };
}

export async function listProductionQuantityReportsForOperation(
  client: SupabaseClient<Database>,
  args: {
    jobOperationId: string;
    companyId: string;
    page?: number;
    pageSize?: number;
  }
) {
  const page = args.page ?? 1;
  const pageSize = args.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const {
    data: reports,
    error,
    count
  } = await client
    .from("productionQuantityReport")
    .select("*", { count: "exact" })
    .eq("jobOperationId", args.jobOperationId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) {
    return { data: null, error, count: 0, hasMore: false };
  }

  const reportIds = (reports ?? []).map((r) => r.id);
  if (reportIds.length === 0) {
    return {
      data: [] as ProductionQuantityReportWithLines[],
      error: null,
      count: count ?? 0,
      hasMore: false
    };
  }

  const { data: lines, error: linesError } = await client
    .from("productionQuantity")
    .select("*, scrapReason(name)")
    .eq("companyId", args.companyId)
    .in("reportId", reportIds)
    .order("createdAt", { ascending: true });

  if (linesError) {
    return { data: null, error: linesError, count: 0, hasMore: false };
  }

  const activeByReport = new Map<string, ProductionQuantityReportLine[]>();
  const hasHistoryByReport = new Map<string, boolean>();

  for (const line of lines ?? []) {
    if (line.invalidatedAt) {
      hasHistoryByReport.set(line.reportId, true);
      continue;
    }
    const list = activeByReport.get(line.reportId) ?? [];
    list.push(line as ProductionQuantityReportLine);
    activeByReport.set(line.reportId, list);
  }

  const result: ProductionQuantityReportWithLines[] = (reports ?? []).map(
    (report) => ({
      ...report,
      activeLines: activeByReport.get(report.id) ?? [],
      hasHistory: hasHistoryByReport.get(report.id) ?? false
    })
  );

  return {
    data: result,
    error: null,
    count: count ?? 0,
    hasMore: count !== null && offset + pageSize < count
  };
}

export async function listProductionQuantityReportLines(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    includeInvalidated?: boolean;
  }
) {
  let query = client
    .from("productionQuantity")
    .select("*, scrapReason(name)")
    .eq("reportId", args.reportId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: true });

  if (!args.includeInvalidated) {
    query = query.is("invalidatedAt", null);
  }

  return query;
}

export async function getProductionQuantityReportWithLines(
  client: SupabaseClient<Database>,
  args: { reportId: string; companyId: string }
) {
  const { data: report, error: reportError } = await client
    .from("productionQuantityReport")
    .select("*")
    .eq("id", args.reportId)
    .eq("companyId", args.companyId)
    .single();

  if (reportError || !report) {
    return { data: null, error: reportError };
  }

  const { data: activeLines, error: linesError } =
    await listProductionQuantityReportLines(client, {
      reportId: args.reportId,
      companyId: args.companyId
    });

  if (linesError) {
    return { data: null, error: linesError };
  }

  const { count: historyCount } = await client
    .from("productionQuantity")
    .select("id", { count: "exact", head: true })
    .eq("reportId", args.reportId)
    .eq("companyId", args.companyId)
    .not("invalidatedAt", "is", null);

  return {
    data: {
      ...report,
      activeLines: (activeLines ?? []) as ProductionQuantityReportLine[],
      hasHistory: (historyCount ?? 0) > 0
    } satisfies ProductionQuantityReportWithLines,
    error: null
  };
}

/** True when user is in an approver group (e.g. Admin or Quantity Review) for production pay. */
export async function resolveProductionQuantityCanAutoApprove(
  client: SupabaseClient<Database>,
  companyId: string,
  userId: string,
  amount?: number | null
) {
  return canApproveRequest(
    client,
    {
      amount: amount ?? 0,
      documentType: "productionQuantityReport",
      companyId
    },
    userId
  );
}

function accumulateConfigBreakdown(
  lines: { type: string; configuration: Json | null }[] | null,
  totals: {
    productionConfigurations: Json[];
    scrapConfigurations: Json[];
    reworkConfigurations: Json[];
  }
) {
  for (const line of lines ?? []) {
    if (!line.configuration) continue;
    switch (line.type) {
      case "Production":
        totals.productionConfigurations.push(line.configuration);
        break;
      case "Scrap":
        totals.scrapConfigurations.push(line.configuration);
        break;
      case "Rework":
        totals.reworkConfigurations.push(line.configuration);
        break;
      default:
        break;
    }
  }
}

export async function getOperationQuantitySummary(
  client: SupabaseClient<Database>,
  jobOperationId: string,
  companyId: string
): Promise<{ data: OperationQuantitySummary | null; error: unknown }> {
  const [
    { data: employeeLines, error: employeeError },
    { data: supplierLines, error: supplierError },
    { data: jobOperation, error: operationError }
  ] = await Promise.all([
    client
      .from("productionQuantity")
      .select("type, quantity, configuration")
      .eq("jobOperationId", jobOperationId)
      .eq("companyId", companyId)
      .is("invalidatedAt", null),
    client
      .from("jobOperationSupplierQuantity")
      .select("type, quantity, configuration")
      .eq("jobOperationId", jobOperationId)
      .eq("companyId", companyId)
      .is("invalidatedAt", null),
    client
      .from("jobOperation")
      .select("quantityComplete, quantityScrapped, quantityReworked")
      .eq("id", jobOperationId)
      .eq("companyId", companyId)
      .single()
  ]);

  if (employeeError || supplierError || operationError) {
    return {
      data: null,
      error: employeeError ?? supplierError ?? operationError
    };
  }

  const totals = {
    production: jobOperation?.quantityComplete ?? 0,
    scrap: jobOperation?.quantityScrapped ?? 0,
    rework: jobOperation?.quantityReworked ?? 0,
    productionConfigurations: [] as Json[],
    scrapConfigurations: [] as Json[],
    reworkConfigurations: [] as Json[]
  };

  // Headline totals come from jobOperation rollups; config breakdown unions active lines.
  accumulateConfigBreakdown(employeeLines, totals);
  accumulateConfigBreakdown(supplierLines, totals);

  return {
    data: {
      production: totals.production,
      scrap: totals.scrap,
      rework: totals.rework,
      productionConfigurations: totals.productionConfigurations,
      scrapConfigurations: totals.scrapConfigurations,
      reworkConfigurations: totals.reworkConfigurations
    },
    error: null
  };
}

/**
 * Hard-deletes a production quantity report and its entire history.
 *
 * Deleting the `productionQuantityReport` row cascades to all of its
 * `productionQuantity` lines (FK `reportId` is ON DELETE CASCADE), which in
 * turn cascades to their operation notes. `approvalRequest.documentId` is a
 * soft reference (no FK), so any approval requests for the report are removed
 * first to avoid orphaning them.
 *
 * NOTE: `productionQuantityReport` has no DELETE RLS policy, so callers must
 * pass a service-role client.
 */
export async function deleteProductionQuantityReport(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
  }
) {
  const { error: approvalError } = await client
    .from("approvalRequest")
    .delete()
    .eq("documentType", "productionQuantityReport")
    .eq("documentId", args.reportId)
    .eq("companyId", args.companyId);

  if (approvalError) {
    return { data: null, error: approvalError };
  }

  return client
    .from("productionQuantityReport")
    .delete()
    .eq("id", args.reportId)
    .eq("companyId", args.companyId);
}

/** After create or revise: auto-approve clears requests; otherwise supersede + request when rules require. */
export async function syncProductionQuantityReportApproval(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    userId: string;
    canAutoApprove: boolean;
    paymentYear: number | null;
    paymentMonth: number | null;
  }
) {
  const {
    reportId,
    companyId,
    userId,
    canAutoApprove,
    paymentYear,
    paymentMonth
  } = args;

  if (canAutoApprove && paymentYear != null && paymentMonth != null) {
    await cancelApprovalRequestsForDocument(
      client,
      "productionQuantityReport",
      reportId,
      userId,
      "Auto-approved"
    );
    return;
  }

  const amount = await computeProductionQuantityReportEarnedAmount(
    client,
    reportId,
    companyId
  );

  await requestProductionPayApproval(client, {
    reportId,
    companyId,
    requestedBy: userId,
    amount
  });
}
