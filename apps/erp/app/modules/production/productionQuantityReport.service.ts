import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  canApproveRequest,
  cancelApprovalRequestsForDocument,
  requestProductionPayApproval
} from "~/modules/shared";
import { replaceMasterCuttingSplitRows } from "./bundleWorkOrder.service";
import {
  computeJobConfigTableTotal,
  reportsExceedConfigPlan
} from "./jobConfiguration";
import {
  getJobVariantQuantities,
  jobVariantQuantitiesToConfigTable
} from "./jobVariantQuantity.service";
import { getMasterCuttingReportSplitTarget } from "./masterWorkOrder.service";
import { computeProductionQuantityReportEarnedAmount } from "./productionQuantityList.service";
import type { ProductionQuantityLineInput } from "./productionQuantityReport.models";

/**
 * Split a line's `configuration` into the config to store (merged, unchanged
 * downstream) and any raw cut rows the editor tucked under `splitRows` (kept
 * only for a master WO cutting report → masterWorkOrderSplitRow).
 */
function splitConfigAndRows(configuration: unknown): {
  config: unknown;
  rows: {
    valuesKey: string | null;
    quantity: number;
  }[];
} {
  if (
    !configuration ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return { config: configuration ?? null, rows: [] };
  }
  const { splitRows, ...config } = configuration as Record<string, unknown> & {
    splitRows?: unknown;
  };
  const rows = Array.isArray(splitRows)
    ? splitRows.map((r) => {
        const row = (r ?? {}) as Record<string, unknown>;
        const valuesKey =
          typeof row.valuesKey === "string" && row.valuesKey.trim()
            ? row.valuesKey.trim()
            : null;
        return {
          valuesKey,
          quantity: Number(row.quantity) || 0
        };
      })
    : [];
  return { config, rows };
}

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

function sumLineQuantity(lines: ProductionQuantityLineInput[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

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

/**
 * A variant-configured (attribute combo) item must report per cell: every line
 * for such a job has to carry a configuration whose total > 0. The report editor
 * gates all line types (Production/Scrap/Rework) through the config table, so the
 * guard covers them all. Bundle jobs are excluded — they have a fixed variant
 * and report a plain quantity. This guards the write layer so a configured report
 * can never be saved as a bare aggregate (configuration = NULL), regardless of
 * entry point (report form, edit, external API, import). Mirrors the report
 * form's config-table gate (item has variants quantity AND the job is not a bundle).
 */
async function validateConfiguredLinesHaveConfiguration(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    lines: ProductionQuantityLineInput[];
  }
): Promise<{ error: Error | null }> {
  const linesToCheck = args.lines.filter((l) => l.quantity > 0);
  if (linesToCheck.length === 0) return { error: null };

  // job (for itemId) and the bundle exclusion are independent — fetch together.
  const [job, bundle] = await Promise.all([
    client
      .from("job")
      .select("itemId")
      .eq("id", args.jobId)
      .eq("companyId", args.companyId)
      .single(),
    client
      .from("bundleWorkOrder")
      .select("id")
      .eq("jobId", args.jobId)
      .eq("companyId", args.companyId)
      .maybeSingle()
  ]);
  const itemId = job.data?.itemId;
  if (!itemId) return { error: null };
  // Bundle jobs carry a fixed variant and report a plain quantity.
  if (bundle.data) return { error: null };

  // Qty-grid configured = attribute selections only (not legacy configurationParameter).
  const selections = await (client as any)
    .from("itemAttributeSelection")
    .select("itemId")
    .eq("itemId", itemId)
    .eq("companyId", args.companyId)
    .limit(1);
  const isConfigured = (selections.data?.length ?? 0) > 0;
  if (!isConfigured) return { error: null };

  for (const line of linesToCheck) {
    const configTotal = line.configuration
      ? computeJobConfigTableTotal(line.configuration as Json)
      : 0;
    if (configTotal <= 0) {
      return {
        error: new Error(
          "This item is configured by attributes — enter the per-variant breakdown before reporting."
        )
      };
    }
  }
  return { error: null };
}

/**
 * Guard a production report against over-reporting: (1) a config-param job's
 * reported (produced) quantities can't exceed the planned quantity for any
 * variant combo, and (2) an operation's total reported quantity — completed +
 * scrapped + reworked — can't exceed its target quantity. Both mean "remaining
 * can't go negative".
 */
export async function validateProductionQuantityRemaining(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId: string;
    lines: ProductionQuantityLineInput[];
  }
): Promise<{ error: Error | null }> {
  if (args.lines.length === 0) return { error: null };
  // Every line type consumes the operation's input, so cap the grand total.
  const newTotal = args.lines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0),
    0
  );
  const newProductionLines = args.lines.filter((l) => l.type === "Production");

  const [operation, existing] = await Promise.all([
    client
      .from("jobOperation")
      .select("targetQuantity, operationQuantity")
      .eq("id", args.jobOperationId)
      .eq("companyId", args.companyId)
      .single(),
    client
      .from("productionQuantity")
      .select("quantity, type, configuration")
      .eq("jobOperationId", args.jobOperationId)
      .eq("companyId", args.companyId)
      .is("invalidatedAt", null)
  ]);

  const existingRows = existing.data ?? [];

  // (2) Operation target cap — completed + scrapped + reworked can't exceed it.
  const target =
    operation.data?.targetQuantity ?? operation.data?.operationQuantity ?? null;
  if (target != null) {
    const reportedSoFar = existingRows.reduce(
      (sum, r) => sum + (Number(r.quantity) || 0),
      0
    );
    if (reportedSoFar + newTotal > target + 0.0001) {
      const remaining = Math.max(0, target - reportedSoFar);
      return {
        error: new Error(
          `Reported quantity (completed + scrapped + reworked) exceeds the remaining ${remaining} for this operation.`
        )
      };
    }
  }

  // (1) Config-param plan cap (per variant cell, produced units only).
  const plannedQty = await getJobVariantQuantities(
    client,
    args.jobId,
    args.companyId
  );
  const planned =
    plannedQty.data.length > 0
      ? jobVariantQuantitiesToConfigTable(plannedQty.data)
      : null;
  const reportedConfigs = [
    ...existingRows
      .filter((r) => r.type === "Production")
      .map((r) => r.configuration),
    ...newProductionLines.map((l) => l.configuration ?? null)
  ];
  if (reportsExceedConfigPlan(planned, reportedConfigs)) {
    return {
      error: new Error(
        "Reported quantity exceeds the remaining planned quantity for one or more variant combos."
      )
    };
  }

  return { error: null };
}

export async function createProductionQuantityReport(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId: string;
    userId: string;
    employeeId: string;
    notes?: string | null;
    lines: ProductionQuantityLineInput[];
    paymentYear?: number | null;
    paymentMonth?: number | null;
  }
) {
  const lineValidation = validateProductionQuantityLines(args.lines);
  if (lineValidation.error) {
    return { data: null, error: lineValidation.error };
  }

  const configCheck = await validateConfiguredLinesHaveConfiguration(client, {
    companyId: args.companyId,
    jobId: args.jobId,
    lines: args.lines
  });
  if (configCheck.error) {
    return { data: null, error: configCheck.error };
  }

  const remainingCheck = await validateProductionQuantityRemaining(client, {
    companyId: args.companyId,
    jobId: args.jobId,
    jobOperationId: args.jobOperationId,
    lines: args.lines
  });
  if (remainingCheck.error) {
    return { data: null, error: remainingCheck.error };
  }

  const originalQuantity = sumLineQuantity(args.lines);
  // Peel raw cut rows out of each line's config (config stays merged/unchanged).
  const prepared = args.lines.map((line) => ({
    line,
    ...splitConfigAndRows(line.configuration)
  }));
  const originalConfiguration = prepared[0]?.config ?? null;

  const { data: report, error: reportError } = await client
    .from("productionQuantityReport")
    .insert({
      companyId: args.companyId,
      jobId: args.jobId,
      jobOperationId: args.jobOperationId,
      employeeId: args.employeeId,
      originalQuantity,
      originalConfiguration: originalConfiguration as Json,
      notes: args.notes ?? null,
      createdBy: args.userId
    })
    .select("*")
    .single();

  if (reportError || !report) {
    return { data: null, error: reportError };
  }

  const lineRows = prepared.map(({ line, config }) => ({
    companyId: args.companyId,
    jobOperationId: args.jobOperationId,
    reportId: report.id,
    type: line.type,
    quantity: line.quantity,
    configuration: (config ?? null) as Json,
    scrapReasonId: line.type === "Scrap" ? (line.scrapReasonId ?? null) : null,
    notes: line.notes ?? null,
    createdBy: args.userId,
    employeeId: args.employeeId,
    paymentYear: args.paymentYear ?? null,
    paymentMonth: args.paymentMonth ?? null
  }));

  const { data: lines, error: linesError } = await client
    .from("productionQuantity")
    .insert(lineRows)
    .select("*, scrapReason(name)");

  if (linesError) {
    return { data: null, error: linesError };
  }

  // Reporting production claims the work: assign the reported operation and its
  // job to the reporting employee (applies to every job/operation).
  if (args.employeeId) {
    const assignedAt = new Date().toISOString();
    await client
      .from("jobOperation")
      .update({
        assignee: args.employeeId,
        assignedAt,
        updatedBy: args.userId,
        updatedAt: assignedAt
      })
      .eq("id", args.jobOperationId)
      .eq("companyId", args.companyId);
    await client
      .from("job")
      .update({
        assignee: args.employeeId,
        assignedAt,
        updatedBy: args.userId,
        updatedAt: assignedAt
      })
      .eq("id", args.jobId)
      .eq("companyId", args.companyId);
  }

  // A master WO cutting report leads into Split Batch: resolve the master once
  // and reuse it for both the persisted cut rows and the follow-up signal the
  // caller returns to the overlay host.
  const splitBatchMasterWorkOrderId = await getMasterCuttingReportSplitTarget(
    client,
    args.jobId,
    args.jobOperationId,
    args.companyId
  );
  const productionRows = prepared.find(
    (p) => p.line.type === "Production"
  )?.rows;
  if (
    splitBatchMasterWorkOrderId &&
    productionRows &&
    productionRows.length > 0
  ) {
    await replaceMasterCuttingSplitRows(client, {
      masterWorkOrderId: splitBatchMasterWorkOrderId,
      productionQuantityReportId: report.id,
      companyId: args.companyId,
      createdBy: args.userId,
      rows: productionRows
    });
  }

  return {
    data: {
      ...report,
      activeLines: lines ?? [],
      hasHistory: false
    } satisfies ProductionQuantityReportWithLines,
    error: null,
    splitBatchMasterWorkOrderId
  };
}

export async function replaceProductionQuantityReportLines(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    userId: string;
    notes?: string | null;
    lines: ProductionQuantityLineInput[];
    paymentYear?: number | null;
    paymentMonth?: number | null;
  }
) {
  const lineValidation = validateProductionQuantityLines(args.lines);
  if (lineValidation.error) {
    return { data: null, error: lineValidation.error };
  }

  // Fetch the report first so the config guard can run BEFORE we invalidate the
  // existing lines — a rejected edit must not wipe the current report.
  const report = await client
    .from("productionQuantityReport")
    .select("*")
    .eq("id", args.reportId)
    .eq("companyId", args.companyId)
    .single();

  if (report.error || !report.data) {
    return { data: null, error: report.error };
  }

  const configCheck = await validateConfiguredLinesHaveConfiguration(client, {
    companyId: args.companyId,
    jobId: report.data.jobId,
    lines: args.lines
  });
  if (configCheck.error) {
    return { data: null, error: configCheck.error };
  }

  const now = new Date().toISOString();

  const { data: activeLines, error: activeError } = await client
    .from("productionQuantity")
    .select("id")
    .eq("reportId", args.reportId)
    .eq("companyId", args.companyId)
    .is("invalidatedAt", null);

  if (activeError) {
    return { data: null, error: activeError };
  }

  if (activeLines && activeLines.length > 0) {
    const { error: invalidateError } = await client
      .from("productionQuantity")
      .update({
        invalidatedAt: now,
        invalidatedBy: args.userId,
        updatedBy: args.userId,
        updatedAt: now
      })
      .eq("reportId", args.reportId)
      .eq("companyId", args.companyId)
      .is("invalidatedAt", null);

    if (invalidateError) {
      return { data: null, error: invalidateError };
    }
  }

  if (args.notes !== undefined) {
    await client
      .from("productionQuantityReport")
      .update({
        notes: args.notes,
        updatedBy: args.userId,
        updatedAt: now
      })
      .eq("id", args.reportId);
  }

  const prepared = args.lines.map((line) => ({
    line,
    ...splitConfigAndRows(line.configuration)
  }));
  const lineRows = prepared.map(({ line, config }) => ({
    companyId: args.companyId,
    jobOperationId: report.data.jobOperationId,
    reportId: args.reportId,
    type: line.type,
    quantity: line.quantity,
    configuration: (config ?? null) as Json,
    scrapReasonId: line.type === "Scrap" ? (line.scrapReasonId ?? null) : null,
    notes: line.notes ?? null,
    createdBy: args.userId,
    // The credited employee always comes from the report itself; only createdBy
    // becomes the editor. Editing lines never reassigns the report's employee.
    employeeId: report.data.employeeId,
    paymentYear: args.paymentYear ?? null,
    paymentMonth: args.paymentMonth ?? null
  }));

  const { data: newLines, error: insertError } = await client
    .from("productionQuantity")
    .insert(lineRows)
    .select("*, scrapReason(name)");

  if (insertError) {
    return { data: null, error: insertError };
  }

  // Re-reporting replaces this report's still-pending cut rows (master cutting);
  // an empty set clears them.
  const productionRows = prepared.find(
    (p) => p.line.type === "Production"
  )?.rows;
  if (productionRows) {
    const masterWorkOrderId = await getMasterCuttingReportSplitTarget(
      client,
      report.data.jobId,
      report.data.jobOperationId,
      args.companyId
    );
    if (masterWorkOrderId) {
      await replaceMasterCuttingSplitRows(client, {
        masterWorkOrderId,
        productionQuantityReportId: args.reportId,
        companyId: args.companyId,
        createdBy: args.userId,
        rows: productionRows
      });
    }
  }

  const { count: historyCount } = await client
    .from("productionQuantity")
    .select("id", { count: "exact", head: true })
    .eq("reportId", args.reportId)
    .not("invalidatedAt", "is", null);

  return {
    data: {
      ...report.data,
      activeLines: newLines ?? [],
      hasHistory: (historyCount ?? 0) > 0
    } satisfies ProductionQuantityReportWithLines,
    error: null
  };
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

export async function invalidateProductionQuantity(
  client: SupabaseClient<Database>,
  args: {
    productionQuantityId: string;
    companyId: string;
    userId: string;
  }
) {
  const now = new Date().toISOString();
  return client
    .from("productionQuantity")
    .update({
      invalidatedAt: now,
      invalidatedBy: args.userId,
      updatedBy: args.userId,
      updatedAt: now
    })
    .eq("id", args.productionQuantityId)
    .eq("companyId", args.companyId)
    .is("invalidatedAt", null);
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
