import type { Database, Json } from "@carbon/database";
import {
  calculateOutsideProcessingPurchaseOrderLines,
  toPurchaseOrderItemLineType
} from "@carbon/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import { assertSupplierQuantityAllowedForOperation } from "./production.service";
import type { ProductionQuantityLineInput } from "./productionQuantityReport.models";
import { validateProductionQuantityLines } from "./productionQuantityReport.service";
import { assertStyleJobCanRecordQuantities } from "./styleBundleExecution.service.server";
import {
  getJobOperationSupplierQuantityReport,
  getOrCreateSubcontractSnapshot,
  updateSubcontractSnapshotPricing,
  type JobOperationSupplierQuantityReportWithLines
} from "./jobOperationSupplierQuantityReport.service";

function sumLineQuantity(lines: ProductionQuantityLineInput[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

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
  const styleExecution = await assertStyleJobCanRecordQuantities(client, {
    companyId: args.companyId,
    jobId: args.jobId,
    jobOperationId: args.jobOperationId
  });
  if (styleExecution.error) {
    return { data: null, error: styleExecution.error };
  }

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
