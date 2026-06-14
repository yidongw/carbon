import type { Database, Json } from "@carbon/database";
import {
  calculateOutsideProcessingPurchaseOrderLines,
  toPurchaseOrderItemLineType
} from "@carbon/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type GenericQueryFilters,
  setGenericQueryFilters
} from "~/utils/query";
import { assertSupplierQuantityAllowedForOperation } from "./production.service";
import type { ProductionQuantityLineInput } from "./productionQuantityReport.models";
import { validateProductionQuantityLines } from "./productionQuantityReport.service";

export type JobOperationSupplierQuantityLine =
  Database["public"]["Tables"]["jobOperationSupplierQuantity"]["Row"] & {
    scrapReason?: { name: string | null } | null;
  };

export type JobOperationSupplierQuantityReportWithLines =
  Database["public"]["Tables"]["jobOperationSupplierQuantityReport"]["Row"] & {
    activeLines: JobOperationSupplierQuantityLine[];
    hasHistory: boolean;
    subcontractSnapshot?: Database["public"]["Tables"]["jobOperationSubcontractSnapshot"]["Row"];
    supplierProcess?: {
      id: string;
      supplierId: string;
      processId: string;
    } | null;
    purchaseOrderLine?: { purchaseOrderId: string } | null;
  };

function sumLineQuantity(lines: ProductionQuantityLineInput[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export type SubcontractPricingPreview = {
  operationUnitCost: number;
  operationMinimumCost: number;
  operationLeadTime: number;
  source: "snapshot" | "supplierProcess";
  snapshotId?: string;
};

function pricingValuesMatch(
  a: {
    operationUnitCost: number;
    operationMinimumCost: number;
    operationLeadTime?: number;
  },
  b: {
    operationUnitCost: number;
    operationMinimumCost: number;
    operationLeadTime?: number;
  }
) {
  return (
    a.operationUnitCost === b.operationUnitCost &&
    a.operationMinimumCost === b.operationMinimumCost &&
    (a.operationLeadTime ?? 0) === (b.operationLeadTime ?? 0)
  );
}

function snapshotToPreview(
  snapshot: Database["public"]["Tables"]["jobOperationSubcontractSnapshot"]["Row"]
): SubcontractPricingPreview {
  return {
    operationUnitCost: snapshot.operationUnitCost ?? 0,
    operationMinimumCost: snapshot.operationMinimumCost ?? 0,
    operationLeadTime: snapshot.operationLeadTime ?? 0,
    source: "snapshot",
    snapshotId: snapshot.id
  };
}

async function findPriorSubcontractSnapshotOnJob(
  client: SupabaseClient<Database>,
  args: { companyId: string; jobId: string; supplierId: string }
) {
  const { data: jobOperations, error: jobOperationsError } = await client
    .from("jobOperation")
    .select("id")
    .eq("jobId", args.jobId)
    .eq("companyId", args.companyId);

  if (jobOperationsError) {
    return null;
  }

  const jobOperationIds =
    jobOperations?.map((row) => row.id).filter(Boolean) ?? [];
  if (jobOperationIds.length === 0) {
    return null;
  }

  const { data: jobSnapshots, error: jobSnapshotsError } = await client
    .from("jobOperationSubcontractSnapshot")
    .select("*, supplierProcess!inner(supplierId)")
    .eq("companyId", args.companyId)
    .in("jobOperationId", jobOperationIds)
    .eq("supplierProcess.supplierId", args.supplierId)
    .order("createdAt", { ascending: true })
    .limit(1);

  if (jobSnapshotsError) {
    return null;
  }

  return jobSnapshots?.[0] ?? null;
}

async function resolveSupplierProcessPricing(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobOperationId: string;
    supplierProcessId: string;
  }
) {
  const [
    { data: supplierProcess, error: spError },
    { data: jobOperation, error: joError }
  ] = await Promise.all([
    client
      .from("supplierProcess")
      .select("minimumCost, unitCost, leadTime, supplierId")
      .eq("id", args.supplierProcessId)
      .eq("companyId", args.companyId)
      .single(),
    client
      .from("jobOperation")
      .select("operationMinimumCost, operationUnitCost, operationLeadTime")
      .eq("id", args.jobOperationId)
      .eq("companyId", args.companyId)
      .single()
  ]);

  if (spError || !supplierProcess) {
    return {
      data: null,
      error: spError ?? new Error("Supplier process not found")
    };
  }
  if (joError || !jobOperation) {
    return {
      data: null,
      error: joError ?? new Error("Job operation not found")
    };
  }

  return {
    data: {
      operationUnitCost:
        supplierProcess.unitCost ?? jobOperation.operationUnitCost ?? 0,
      operationMinimumCost:
        supplierProcess.minimumCost ?? jobOperation.operationMinimumCost ?? 0,
      operationLeadTime:
        supplierProcess.leadTime ?? jobOperation.operationLeadTime ?? 0,
      supplierId: supplierProcess.supplierId
    },
    error: null
  };
}

/** Read-only pricing for the quantity form (does not create a snapshot). */
export async function getSubcontractPricingPreview(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId: string;
    supplierProcessId: string;
  }
) {
  const { data: exactSnapshot, error: exactError } = await client
    .from("jobOperationSubcontractSnapshot")
    .select("*")
    .eq("jobOperationId", args.jobOperationId)
    .eq("supplierProcessId", args.supplierProcessId)
    .eq("companyId", args.companyId)
    .maybeSingle();

  if (exactError) {
    return { data: null, error: exactError };
  }
  if (exactSnapshot) {
    return { data: snapshotToPreview(exactSnapshot), error: null };
  }

  const resolved = await resolveSupplierProcessPricing(client, {
    companyId: args.companyId,
    jobOperationId: args.jobOperationId,
    supplierProcessId: args.supplierProcessId
  });
  if (resolved.error || !resolved.data) {
    return { data: null, error: resolved.error };
  }

  const priorOnJob = await findPriorSubcontractSnapshotOnJob(client, {
    companyId: args.companyId,
    jobId: args.jobId,
    supplierId: resolved.data.supplierId
  });
  if (priorOnJob) {
    return { data: snapshotToPreview(priorOnJob), error: null };
  }

  return {
    data: {
      operationUnitCost: resolved.data.operationUnitCost,
      operationMinimumCost: resolved.data.operationMinimumCost,
      operationLeadTime: resolved.data.operationLeadTime,
      source: "supplierProcess" as const
    },
    error: null
  };
}

export async function updateSubcontractSnapshotPricing(
  client: SupabaseClient<Database>,
  args: {
    snapshotId: string;
    companyId: string;
    pricing: {
      operationUnitCost: number;
      operationMinimumCost: number;
      operationLeadTime?: number;
    };
  }
) {
  return client
    .from("jobOperationSubcontractSnapshot")
    .update({
      operationUnitCost: args.pricing.operationUnitCost,
      operationMinimumCost: args.pricing.operationMinimumCost,
      operationLeadTime: args.pricing.operationLeadTime
    })
    .eq("id", args.snapshotId)
    .eq("companyId", args.companyId);
}

export async function getOrCreateSubcontractSnapshot(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobOperationId: string;
    supplierProcessId: string;
    userId: string;
  }
) {
  const { data: existing, error: existingError } = await client
    .from("jobOperationSubcontractSnapshot")
    .select("*")
    .eq("jobOperationId", args.jobOperationId)
    .eq("supplierProcessId", args.supplierProcessId)
    .eq("companyId", args.companyId)
    .maybeSingle();

  if (existingError) {
    return { data: null, error: existingError };
  }
  if (existing) {
    return { data: existing, error: null };
  }

  const { data: jobOperation, error: joError } = await client
    .from("jobOperation")
    .select("jobId, operationMinimumCost, operationUnitCost, operationLeadTime")
    .eq("id", args.jobOperationId)
    .eq("companyId", args.companyId)
    .single();

  if (joError || !jobOperation?.jobId) {
    return {
      data: null,
      error: joError ?? new Error("Job operation not found")
    };
  }

  const resolved = await resolveSupplierProcessPricing(client, {
    companyId: args.companyId,
    jobOperationId: args.jobOperationId,
    supplierProcessId: args.supplierProcessId
  });
  if (resolved.error || !resolved.data) {
    return { data: null, error: resolved.error };
  }

  let operationMinimumCost = resolved.data.operationMinimumCost;
  let operationUnitCost = resolved.data.operationUnitCost;
  let operationLeadTime = resolved.data.operationLeadTime;

  const priorOnJob = await findPriorSubcontractSnapshotOnJob(client, {
    companyId: args.companyId,
    jobId: jobOperation.jobId,
    supplierId: resolved.data.supplierId
  });
  if (priorOnJob) {
    operationMinimumCost =
      priorOnJob.operationMinimumCost ?? operationMinimumCost;
    operationUnitCost = priorOnJob.operationUnitCost ?? operationUnitCost;
    operationLeadTime = priorOnJob.operationLeadTime ?? operationLeadTime;
  }

  const { data: created, error: createError } = await client
    .from("jobOperationSubcontractSnapshot")
    .insert({
      companyId: args.companyId,
      jobOperationId: args.jobOperationId,
      supplierProcessId: args.supplierProcessId,
      operationMinimumCost,
      operationUnitCost,
      operationLeadTime,
      createdBy: args.userId
    })
    .select("*")
    .single();

  return { data: created, error: createError };
}

export async function createJobOperationSupplierQuantityReport(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId: string;
    supplierProcessId: string;
    userId: string;
    notes?: string | null;
    lines: ProductionQuantityLineInput[];
    snapshotPricing?: {
      operationUnitCost: number;
      operationMinimumCost: number;
      operationLeadTime?: number;
    };
    snapshotPricingEdited?: boolean;
  }
) {
  const lineValidation = validateProductionQuantityLines(args.lines);
  if (lineValidation.error) {
    return { data: null, error: lineValidation.error };
  }

  const operationValidation = await assertSupplierQuantityAllowedForOperation(
    client,
    args.jobOperationId,
    args.companyId
  );
  if (operationValidation.error) {
    return { data: null, error: operationValidation.error };
  }

  const snapshotResult = await getOrCreateSubcontractSnapshot(client, {
    companyId: args.companyId,
    jobOperationId: args.jobOperationId,
    supplierProcessId: args.supplierProcessId,
    userId: args.userId
  });

  if (snapshotResult.error || !snapshotResult.data) {
    return { data: null, error: snapshotResult.error };
  }

  let snapshot = snapshotResult.data;

  if (
    args.snapshotPricingEdited &&
    args.snapshotPricing &&
    !pricingValuesMatch(snapshot, args.snapshotPricing)
  ) {
    const { error: updateError } = await updateSubcontractSnapshotPricing(
      client,
      {
        snapshotId: snapshot.id,
        companyId: args.companyId,
        pricing: args.snapshotPricing
      }
    );
    if (updateError) {
      return { data: null, error: updateError };
    }
    snapshot = {
      ...snapshot,
      operationUnitCost: args.snapshotPricing.operationUnitCost,
      operationMinimumCost: args.snapshotPricing.operationMinimumCost,
      operationLeadTime:
        args.snapshotPricing.operationLeadTime ?? snapshot.operationLeadTime
    };
  }

  const originalQuantity = sumLineQuantity(args.lines);
  const primaryLine = args.lines[0];
  const originalConfiguration = primaryLine?.configuration ?? null;

  const { data: report, error: reportError } = await client
    .from("jobOperationSupplierQuantityReport")
    .insert({
      companyId: args.companyId,
      jobId: args.jobId,
      jobOperationId: args.jobOperationId,
      supplierProcessId: args.supplierProcessId,
      subcontractSnapshotId: snapshot.id,
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

  const lineRows = args.lines.map((line) => ({
    companyId: args.companyId,
    jobOperationId: args.jobOperationId,
    reportId: report.id,
    supplierProcessId: args.supplierProcessId,
    type: line.type,
    quantity: line.quantity,
    configuration: (line.configuration ?? null) as Json,
    scrapReasonId: line.type === "Scrap" ? (line.scrapReasonId ?? null) : null,
    notes: line.notes ?? null,
    createdBy: args.userId
  }));

  const { data: lines, error: linesError } = await client
    .from("jobOperationSupplierQuantity")
    .insert(lineRows)
    .select("*, scrapReason(name)");

  if (linesError) {
    return { data: null, error: linesError };
  }

  return {
    data: {
      ...report,
      activeLines: lines ?? [],
      hasHistory: false,
      subcontractSnapshot: snapshot
    } satisfies JobOperationSupplierQuantityReportWithLines,
    error: null
  };
}

export async function replaceJobOperationSupplierQuantityReportLines(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    userId: string;
    notes?: string | null;
    lines: ProductionQuantityLineInput[];
  }
) {
  const lineValidation = validateProductionQuantityLines(args.lines);
  if (lineValidation.error) {
    return { data: null, error: lineValidation.error };
  }

  const now = new Date().toISOString();

  const { data: activeLines, error: activeError } = await client
    .from("jobOperationSupplierQuantity")
    .select("id")
    .eq("reportId", args.reportId)
    .eq("companyId", args.companyId)
    .is("invalidatedAt", null);

  if (activeError) {
    return { data: null, error: activeError };
  }

  if (activeLines && activeLines.length > 0) {
    const { error: invalidateError } = await client
      .from("jobOperationSupplierQuantity")
      .update({
        invalidatedAt: now,
        invalidatedBy: args.userId
      })
      .eq("reportId", args.reportId)
      .eq("companyId", args.companyId)
      .is("invalidatedAt", null);

    if (invalidateError) {
      return { data: null, error: invalidateError };
    }
  }

  const report = await client
    .from("jobOperationSupplierQuantityReport")
    .select("*, subcontractSnapshot:jobOperationSubcontractSnapshot(*)")
    .eq("id", args.reportId)
    .eq("companyId", args.companyId)
    .single();

  if (report.error || !report.data) {
    return { data: null, error: report.error };
  }

  if (args.notes !== undefined) {
    await client
      .from("jobOperationSupplierQuantityReport")
      .update({
        notes: args.notes,
        updatedBy: args.userId,
        updatedAt: now
      })
      .eq("id", args.reportId);
  }

  const lineRows = args.lines.map((line) => ({
    companyId: args.companyId,
    jobOperationId: report.data.jobOperationId,
    reportId: args.reportId,
    supplierProcessId: report.data.supplierProcessId,
    type: line.type,
    quantity: line.quantity,
    configuration: (line.configuration ?? null) as Json,
    scrapReasonId: line.type === "Scrap" ? (line.scrapReasonId ?? null) : null,
    notes: line.notes ?? null,
    createdBy: args.userId
  }));

  const { data: newLines, error: insertError } = await client
    .from("jobOperationSupplierQuantity")
    .insert(lineRows)
    .select("*, scrapReason(name)");

  if (insertError) {
    return { data: null, error: insertError };
  }

  const { count: historyCount } = await client
    .from("jobOperationSupplierQuantity")
    .select("id", { count: "exact", head: true })
    .eq("reportId", args.reportId)
    .not("invalidatedAt", "is", null);

  const snapshot = Array.isArray(report.data.subcontractSnapshot)
    ? report.data.subcontractSnapshot[0]
    : report.data.subcontractSnapshot;

  return {
    data: {
      ...report.data,
      subcontractSnapshot: snapshot ?? undefined,
      activeLines: newLines ?? [],
      hasHistory: (historyCount ?? 0) > 0
    } satisfies JobOperationSupplierQuantityReportWithLines,
    error: null
  };
}

export async function listJobOperationSupplierQuantityReportsForOperation(
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
    .from("jobOperationSupplierQuantityReport")
    .select(
      "*, subcontractSnapshot:jobOperationSubcontractSnapshot(*), supplierProcess(id, supplierId, processId), purchaseOrderLine:purchaseOrderLine!jobOperationSupplierQuantityReport_purchaseOrderLineId_fkey(purchaseOrderId)",
      { count: "exact" }
    )
    .eq("jobOperationId", args.jobOperationId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    return { data: null, error, count: 0, hasMore: false };
  }

  const reportIds = (reports ?? []).map((r) => r.id);
  if (reportIds.length === 0) {
    return {
      data: [] as JobOperationSupplierQuantityReportWithLines[],
      error: null,
      count: count ?? 0,
      hasMore: false
    };
  }

  const { data: lines, error: linesError } = await client
    .from("jobOperationSupplierQuantity")
    .select("*, scrapReason(name)")
    .eq("companyId", args.companyId)
    .in("reportId", reportIds)
    .order("createdAt", { ascending: true });

  if (linesError) {
    return { data: null, error: linesError, count: 0, hasMore: false };
  }

  const activeByReport = new Map<string, JobOperationSupplierQuantityLine[]>();
  const hasHistoryByReport = new Map<string, boolean>();

  for (const line of lines ?? []) {
    if (line.invalidatedAt) {
      hasHistoryByReport.set(line.reportId, true);
      continue;
    }
    const list = activeByReport.get(line.reportId) ?? [];
    list.push(line as JobOperationSupplierQuantityLine);
    activeByReport.set(line.reportId, list);
  }

  const result: JobOperationSupplierQuantityReportWithLines[] = (
    reports ?? []
  ).map((report) => {
    const snapshot = Array.isArray(report.subcontractSnapshot)
      ? report.subcontractSnapshot[0]
      : report.subcontractSnapshot;
    const supplierProcess = Array.isArray(report.supplierProcess)
      ? report.supplierProcess[0]
      : report.supplierProcess;
    const purchaseOrderLine = Array.isArray(report.purchaseOrderLine)
      ? report.purchaseOrderLine[0]
      : report.purchaseOrderLine;

    return {
      ...report,
      subcontractSnapshot: snapshot ?? undefined,
      supplierProcess: supplierProcess ?? undefined,
      purchaseOrderLine: purchaseOrderLine ?? undefined,
      activeLines: activeByReport.get(report.id) ?? [],
      hasHistory: hasHistoryByReport.get(report.id) ?? false
    };
  });

  return {
    data: result,
    error: null,
    count: count ?? 0,
    hasMore: count !== null && offset + pageSize < count
  };
}

export async function listJobOperationSupplierQuantityReportLines(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    includeInvalidated?: boolean;
  }
) {
  let query = client
    .from("jobOperationSupplierQuantity")
    .select("*, scrapReason(name)")
    .eq("reportId", args.reportId)
    .eq("companyId", args.companyId)
    .order("createdAt", { ascending: true });

  if (!args.includeInvalidated) {
    query = query.is("invalidatedAt", null);
  }

  return query;
}

export async function getJobOperationSupplierQuantities(
  client: SupabaseClient<Database>,
  jobOperationIds: string[],
  companyId: string,
  args?: { search: string | null } & Partial<GenericQueryFilters>
) {
  if (jobOperationIds.length === 0) {
    return { data: [], count: 0, error: null };
  }

  let query = client
    .from("jobOperationSupplierQuantity")
    .select(
      `*,
      jobOperation(description, jobMakeMethod(parentMaterialId, item(readableIdWithRevision))),
      supplierProcess!jobOperationSupplierQuantity_supplierProcessId_fkey(id, supplierId, processId)`,
      { count: "exact" }
    )
    .in("jobOperationId", jobOperationIds)
    .eq("companyId", companyId)
    .is("invalidatedAt", null);

  if (args?.search) {
    query = query.or(`jobOperation.description.ilike.%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "createdAt", ascending: false }
    ]);
  }

  return await query;
}

export async function getJobOperationSupplierQuantityReport(
  client: SupabaseClient<Database>,
  reportId: string,
  companyId: string
) {
  const { data: report, error } = await client
    .from("jobOperationSupplierQuantityReport")
    .select(
      "*, subcontractSnapshot:jobOperationSubcontractSnapshot(*), supplierProcess(id, supplierId, processId)"
    )
    .eq("id", reportId)
    .eq("companyId", companyId)
    .single();

  if (error || !report) {
    return { data: null, error };
  }

  const { data: lines, error: linesError } = await client
    .from("jobOperationSupplierQuantity")
    .select("*, scrapReason(name)")
    .eq("reportId", reportId)
    .eq("companyId", companyId)
    .order("createdAt", { ascending: true });

  if (linesError) {
    return { data: null, error: linesError };
  }

  const activeLines: JobOperationSupplierQuantityLine[] = [];
  let hasHistory = false;
  for (const line of lines ?? []) {
    if (line.invalidatedAt) {
      hasHistory = true;
    } else {
      activeLines.push(line as JobOperationSupplierQuantityLine);
    }
  }

  const snapshot = Array.isArray(report.subcontractSnapshot)
    ? report.subcontractSnapshot[0]
    : report.subcontractSnapshot;
  const supplierProcess = Array.isArray(report.supplierProcess)
    ? report.supplierProcess[0]
    : report.supplierProcess;

  return {
    data: {
      ...report,
      subcontractSnapshot: snapshot ?? undefined,
      supplierProcess: supplierProcess ?? undefined,
      activeLines,
      hasHistory
    } satisfies JobOperationSupplierQuantityReportWithLines,
    error: null
  };
}

export async function createOutsideProcessingPoFromSupplierReport(
  client: SupabaseClient<Database>,
  args: {
    reportId: string;
    companyId: string;
    companyGroupId: string;
    userId: string;
  }
) {
  const reportResult = await getJobOperationSupplierQuantityReport(
    client,
    args.reportId,
    args.companyId
  );

  if (reportResult.error || !reportResult.data) {
    return {
      data: null,
      error: reportResult.error ?? new Error("Report not found")
    };
  }

  const report = reportResult.data;
  if (report.purchaseOrderLineId) {
    return {
      data: { purchaseOrderLineId: report.purchaseOrderLineId },
      error: null
    };
  }

  // Heal a prior partial run: if a PO line already references this report
  // (insert succeeded but the report → line back-link failed last time),
  // re-link instead of creating a duplicate line.
  const { data: orphanedLine } = await client
    .from("purchaseOrderLine")
    .select("id, purchaseOrderId")
    .eq("jobOperationSupplierQuantityReportId", report.id)
    .eq("companyId", args.companyId)
    .maybeSingle();

  if (orphanedLine?.id) {
    const { error: relinkError } = await client
      .from("jobOperationSupplierQuantityReport")
      .update({
        purchaseOrderLineId: orphanedLine.id,
        updatedBy: args.userId,
        updatedAt: new Date().toISOString()
      })
      .eq("id", report.id)
      .eq("companyId", args.companyId);

    if (relinkError) {
      return { data: null, error: relinkError };
    }

    return {
      data: {
        purchaseOrderId: orphanedLine.purchaseOrderId,
        purchaseOrderLineId: orphanedLine.id
      },
      error: null
    };
  }

  const snapshot = report.subcontractSnapshot;
  if (!snapshot) {
    return { data: null, error: new Error("Subcontract snapshot not found") };
  }

  const productionQty = report.activeLines
    .filter((l) => l.type === "Production")
    .reduce((sum, l) => sum + l.quantity, 0);

  if (productionQty <= 0) {
    return {
      data: null,
      error: new Error("Report must include a Production quantity line")
    };
  }

  const unitCost = snapshot.operationUnitCost ?? 0;
  const minimumCost = snapshot.operationMinimumCost ?? 0;

  const { data: supplierProcess, error: spError } = await client
    .from("supplierProcess")
    .select("supplierId")
    .eq("id", report.supplierProcessId)
    .eq("companyId", args.companyId)
    .single();

  if (spError || !supplierProcess?.supplierId) {
    return {
      data: null,
      error: spError ?? new Error("Supplier process not found")
    };
  }

  const { data: job, error: jobError } = await client
    .from("job")
    .select("id, jobId, itemId, locationId")
    .eq("id", report.jobId)
    .eq("companyId", args.companyId)
    .single();

  if (jobError || !job?.itemId) {
    return { data: null, error: jobError ?? new Error("Job not found") };
  }

  const { data: item, error: itemError } = await client
    .from("item")
    .select("id, type, name, description, unitOfMeasureCode")
    .eq("id", job.itemId)
    .single();

  if (itemError || !item) {
    return { data: null, error: itemError ?? new Error("Item not found") };
  }

  const { data: jobOperation } = await client
    .from("jobOperation")
    .select("description")
    .eq("id", report.jobOperationId)
    .single();

  const pricingLines = calculateOutsideProcessingPurchaseOrderLines({
    quantity: productionQty,
    unitCost,
    minimumCost,
    minimumCostDescription: `Minimum cost - ${jobOperation?.description ?? item.name ?? "Outside processing"}`
  });

  if (
    pricingLines.every(
      (line) => line.purchaseQuantity * line.supplierUnitPrice <= 0
    )
  ) {
    return {
      data: null,
      error: new Error("Snapshot minimum and unit costs cannot both be zero")
    };
  }

  const { getNextSequence } = await import(
    "~/modules/settings/settings.service"
  );
  const { upsertPurchaseOrder, upsertPurchaseOrderLine } = await import(
    "~/modules/purchasing/purchasing.service"
  );

  const nextSequence = await getNextSequence(
    client,
    "purchaseOrder",
    args.companyId
  );
  if (nextSequence.error || !nextSequence.data) {
    return {
      data: null,
      error: nextSequence.error ?? new Error("Failed to get PO sequence")
    };
  }

  const { data: supplier } = await client
    .from("supplier")
    .select("currencyCode")
    .eq("id", supplierProcess.supplierId)
    .single();

  const purchaseOrder = await upsertPurchaseOrder(client, {
    purchaseOrderId: nextSequence.data,
    supplierId: supplierProcess.supplierId,
    companyId: args.companyId,
    companyGroupId: args.companyGroupId,
    createdBy: args.userId,
    purchaseOrderType: "Outside Processing",
    locationId: job.locationId ?? "",
    currencyCode: supplier?.currencyCode ?? "USD",
    status: "Draft",
    jobId: job.id,
    jobReadableId: job.jobId
  });

  if (purchaseOrder.error || !purchaseOrder.data?.[0]?.id) {
    return { data: null, error: purchaseOrder.error };
  }

  const purchaseOrderId = purchaseOrder.data[0].id;
  const purchaseOrderLineType = toPurchaseOrderItemLineType(item.type);

  let primaryLineId: string | undefined;

  for (const pricingLine of pricingLines) {
    const line = await upsertPurchaseOrderLine(client, {
      purchaseOrderId,
      purchaseOrderLineType,
      itemId: item.id,
      description: pricingLine.isMinimumCostLine
        ? pricingLine.description
        : item.name || item.description || undefined,
      purchaseQuantity: pricingLine.purchaseQuantity,
      purchaseUnitOfMeasureCode: item.unitOfMeasureCode ?? undefined,
      inventoryUnitOfMeasureCode: item.unitOfMeasureCode ?? undefined,
      conversionFactor: 1,
      supplierUnitPrice: pricingLine.supplierUnitPrice,
      locationId: job.locationId,
      jobId: job.id,
      jobOperationId: pricingLine.isMinimumCostLine
        ? undefined
        : report.jobOperationId,
      jobOperationSupplierQuantityReportId: pricingLine.isMinimumCostLine
        ? undefined
        : report.id,
      companyId: args.companyId,
      createdBy: args.userId
    });

    if (line.error || !line.data?.id) {
      return { data: null, error: line.error };
    }

    if (!pricingLine.isMinimumCostLine) {
      primaryLineId = line.data.id;
    }
  }

  if (!primaryLineId) {
    return {
      data: null,
      error: new Error("Failed to create purchase order line")
    };
  }

  const { error: linkError } = await client
    .from("jobOperationSupplierQuantityReport")
    .update({
      purchaseOrderLineId: primaryLineId,
      updatedBy: args.userId,
      updatedAt: new Date().toISOString()
    })
    .eq("id", report.id)
    .eq("companyId", args.companyId);

  if (linkError) {
    return { data: null, error: linkError };
  }

  return {
    data: {
      purchaseOrderId,
      purchaseOrderLineId: primaryLineId
    },
    error: null
  };
}

export async function invalidateJobOperationSupplierQuantity(
  client: SupabaseClient<Database>,
  args: {
    supplierQuantityId: string;
    companyId: string;
    userId: string;
  }
) {
  const now = new Date().toISOString();
  return client
    .from("jobOperationSupplierQuantity")
    .update({
      invalidatedAt: now,
      invalidatedBy: args.userId
    })
    .eq("id", args.supplierQuantityId)
    .eq("companyId", args.companyId)
    .is("invalidatedAt", null);
}
