import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { computeJobConfigTableTotal } from "./jobConfiguration";
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
  }
) {
  const lineValidation = validateProductionQuantityLines(args.lines);
  if (lineValidation.error) {
    return { data: null, error: lineValidation.error };
  }

  const originalQuantity = sumLineQuantity(args.lines);
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
    scrapReasonId: line.type === "Scrap" ? line.scrapReasonId ?? null : null,
    notes: line.notes ?? null,
    createdBy: args.userId,
    employeeId: args.employeeId
  }));

  const { data: lines, error: linesError } = await client
    .from("productionQuantity")
    .insert(lineRows)
    .select("*, scrapReason(name)");

  if (linesError) {
    return { data: null, error: linesError };
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
    employeeId: string;
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
    scrapReasonId: line.type === "Scrap" ? line.scrapReasonId ?? null : null,
    notes: line.notes ?? null,
    createdBy: args.userId,
    employeeId: args.employeeId
  }));

  const { data: newLines, error: insertError } = await client
    .from("productionQuantity")
    .insert(lineRows)
    .select("*, scrapReason(name)");

  if (insertError) {
    return { data: null, error: insertError };
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

  const { data: reports, error, count } = await client
    .from("productionQuantityReport")
    .select("*", { count: "exact" })
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

export async function getOperationQuantitySummary(
  client: SupabaseClient<Database>,
  jobOperationId: string,
  companyId: string
): Promise<{ data: OperationQuantitySummary | null; error: unknown }> {
  const { data: lines, error } = await client
    .from("productionQuantity")
    .select("type, quantity, configuration")
    .eq("jobOperationId", jobOperationId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null);

  if (error) {
    return { data: null, error };
  }

  let production = 0;
  let scrap = 0;
  let rework = 0;
  const productionConfigurations: Json[] = [];
  const scrapConfigurations: Json[] = [];
  const reworkConfigurations: Json[] = [];

  for (const line of lines ?? []) {
    switch (line.type) {
      case "Production":
        production += line.quantity;
        if (line.configuration) {
          productionConfigurations.push(line.configuration);
        }
        break;
      case "Scrap":
        scrap += line.quantity;
        if (line.configuration) {
          scrapConfigurations.push(line.configuration);
        }
        break;
      case "Rework":
        rework += line.quantity;
        if (line.configuration) {
          reworkConfigurations.push(line.configuration);
        }
        break;
      default:
        break;
    }
  }

  return {
    data: {
      production,
      scrap,
      rework,
      productionConfigurations,
      scrapConfigurations,
      reworkConfigurations
    },
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
