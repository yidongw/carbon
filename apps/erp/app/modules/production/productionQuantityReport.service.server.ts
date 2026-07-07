import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getStyleColorContext } from "../items/style.server";
import { assertStyleJobCanRecordQuantities } from "./styleBundleExecution.service.server";
import {
  deleteProductionQuantitySplitRowsForProductionQuantity,
  deleteProductionQuantitySplitRowsForReport,
  insertProductionQuantitySplitRows
} from "./styleBundlePersistence.server";
import {
  validateProductionQuantityLines,
  type ProductionQuantityReportWithLines
} from "./productionQuantityReport.service";
import type { ProductionQuantityLineInput } from "./productionQuantityReport.models";
import { buildProductionQuantitySplitRowRecords } from "./styleSplitRow.service";

async function resolveStyleSplitContext(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const { data: job, error: jobError } = await client
    .from("job")
    .select("itemId, ...item(itemType:type)")
    .eq("id", args.jobId)
    .eq("companyId", args.companyId)
    .single();

  if (jobError) {
    return { data: null, error: jobError };
  }

  if (!job?.itemId || job.itemType !== "Style") {
    return { data: null, error: null };
  }

  const { data: style, error: styleError } = await getStyleColorContext(
    job.itemId,
    args.companyId
  );

  if (styleError || !style?.colorCode) {
    return { data: null, error: styleError };
  }

  return {
    data: {
      itemId: job.itemId as string,
      colorCode: style.colorCode as string
    },
    error: null
  };
}

async function syncStyleSplitRowsForReport(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
    jobOperationId: string;
    reportId: string;
    userId: string;
    activeLines: Array<
      Pick<
        Database["public"]["Tables"]["productionQuantity"]["Row"],
        "id" | "reportId" | "type" | "quantity" | "configuration"
      >
    >;
  }
) {
  const styleContext = await resolveStyleSplitContext(client, {
    companyId: args.companyId,
    jobId: args.jobId
  });

  if (styleContext.error) {
    return { data: null, error: styleContext.error };
  }

  if (!styleContext.data) {
    return { data: null, error: null };
  }

  const { error: deleteError } =
    await deleteProductionQuantitySplitRowsForReport({
      reportId: args.reportId,
      companyId: args.companyId
    });

  if (deleteError) {
    return { data: null, error: deleteError };
  }

  const splitRows = buildProductionQuantitySplitRowRecords({
    companyId: args.companyId,
    jobId: args.jobId,
    jobOperationId: args.jobOperationId,
    itemId: styleContext.data.itemId,
    createdBy: args.userId,
    fallbackColorCode: styleContext.data.colorCode,
    lines: args.activeLines
  });

  if (splitRows.length === 0) {
    return { data: [], error: null };
  }

  const { error: insertError } =
    await insertProductionQuantitySplitRows(splitRows);

  if (insertError) {
    return { data: null, error: insertError };
  }

  return { data: splitRows, error: null };
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

  const originalQuantity = args.lines.reduce(
    (sum, line) => sum + line.quantity,
    0
  );
  const primaryLine = args.lines[0];
  const originalConfiguration = primaryLine?.configuration ?? null;

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

  const lineRows = args.lines.map((line) => ({
    companyId: args.companyId,
    jobOperationId: args.jobOperationId,
    reportId: report.id,
    type: line.type,
    quantity: line.quantity,
    configuration: (line.configuration ?? null) as Json,
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

  const splitRowSync = await syncStyleSplitRowsForReport(client, {
    companyId: args.companyId,
    jobId: args.jobId,
    jobOperationId: args.jobOperationId,
    reportId: report.id,
    userId: args.userId,
    activeLines: (lines ?? []).map((line) => ({
      id: line.id,
      reportId: line.reportId,
      type: line.type,
      quantity: line.quantity,
      configuration: line.configuration
    }))
  });

  if (splitRowSync.error) {
    return { data: null, error: splitRowSync.error };
  }

  return {
    data: {
      ...report,
      activeLines: lines ?? [],
      hasHistory: false
    } satisfies ProductionQuantityReportWithLines,
    error: null
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

  const report = await client
    .from("productionQuantityReport")
    .select("*")
    .eq("id", args.reportId)
    .eq("companyId", args.companyId)
    .single();

  if (report.error || !report.data) {
    return { data: null, error: report.error };
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

  const lineRows = args.lines.map((line) => ({
    companyId: args.companyId,
    jobOperationId: report.data.jobOperationId,
    reportId: args.reportId,
    type: line.type,
    quantity: line.quantity,
    configuration: (line.configuration ?? null) as Json,
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

  const splitRowSync = await syncStyleSplitRowsForReport(client, {
    companyId: args.companyId,
    jobId: report.data.jobId,
    jobOperationId: report.data.jobOperationId,
    reportId: args.reportId,
    userId: args.userId,
    activeLines: (newLines ?? []).map((line) => ({
      id: line.id,
      reportId: line.reportId,
      type: line.type,
      quantity: line.quantity,
      configuration: line.configuration
    }))
  });

  if (splitRowSync.error) {
    return { data: null, error: splitRowSync.error };
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

export async function invalidateProductionQuantity(
  client: SupabaseClient<Database>,
  args: {
    productionQuantityId: string;
    companyId: string;
    userId: string;
  }
) {
  const now = new Date().toISOString();
  const invalidation = await client
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

  if (invalidation.error) {
    return invalidation;
  }

  const { error: splitRowDeleteError } =
    await deleteProductionQuantitySplitRowsForProductionQuantity({
      productionQuantityId: args.productionQuantityId,
      companyId: args.companyId
    });

  if (splitRowDeleteError) {
    return { data: null, error: splitRowDeleteError };
  }

  return invalidation;
}
