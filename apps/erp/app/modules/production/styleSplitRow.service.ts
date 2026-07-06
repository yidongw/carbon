import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildPendingSplitSourceRows,
  type PendingSplitSourceRow
} from "./styleSplit.service";

export type PersistedSplitRow = {
  id: string;
  productionQuantityId: string;
  reportId: string;
  styleId: string;
  rowKey: string;
  colorCode: string;
  sizeCode: string | null;
  shadeLot: string | null;
  configurationKey: string;
  quantity: number;
  allocatedQuantity: number;
};

export type ProductionQuantitySplitRowRecord = {
  productionQuantityId: string;
  reportId: string;
  jobId: string;
  jobOperationId: string;
  itemId: string;
  rowKey: string;
  colorCode: string;
  sizeCode: string | null;
  shadeLot: string | null;
  configurationKey: string;
  rowConfiguration: Database["public"]["Tables"]["productionQuantity"]["Row"]["configuration"];
  quantity: number;
  companyId: string;
  createdBy: string;
};

export function hydratePendingSplitRows(
  rows: PersistedSplitRow[]
): PendingSplitSourceRow[] {
  return rows.map((row) => ({
    sourceId: row.id,
    sourceRowKey: row.rowKey,
    reportId: row.reportId,
    styleId: row.styleId,
    colorCode: row.colorCode,
    sizeCode: row.sizeCode,
    shadeLot: row.shadeLot,
    configurationKey: row.configurationKey,
    reportedQuantity: row.quantity,
    allocatedQuantity: row.allocatedQuantity
  }));
}

export async function getPendingSplitSourceRows(
  client: SupabaseClient<Database>,
  args: {
    companyId: string;
    jobId: string;
  }
) {
  const splitRowClient = client as SupabaseClient<any>;
  const { data, error } = await splitRowClient
    .from("productionQuantitySplitRow")
    .select(
      `
        id,
        productionQuantityId,
        reportId,
        itemId,
        rowKey,
        colorCode,
        sizeCode,
        shadeLot,
        configurationKey,
        quantity,
        bundleAllocation(quantity)
      `
    )
    .eq("companyId", args.companyId)
    .eq("jobId", args.jobId)
    .order("createdAt", { ascending: true });

  if (error) {
    return { data: null, error };
  }

  const persistedRows = (data ?? []).map((row: any) => ({
    id: row.id as string,
    productionQuantityId: row.productionQuantityId as string,
    reportId: row.reportId as string,
    styleId: row.itemId as string,
    rowKey: row.rowKey as string,
    colorCode: row.colorCode as string,
    sizeCode: (row.sizeCode as string | null) ?? null,
    shadeLot: (row.shadeLot as string | null) ?? null,
    configurationKey: row.configurationKey as string,
    quantity: Number(row.quantity) || 0,
    allocatedQuantity: (row.bundleAllocation ?? []).reduce(
      (sum: number, allocation: { quantity?: number | null }) =>
        sum + (Number(allocation.quantity) || 0),
      0
    )
  })) satisfies PersistedSplitRow[];

  return {
    data: hydratePendingSplitRows(persistedRows),
    error: null
  };
}

export function buildProductionQuantitySplitRowRecords(args: {
  companyId: string;
  jobId: string;
  jobOperationId: string;
  itemId: string;
  createdBy: string;
  fallbackColorCode: string;
  lines: Array<{
    id: string;
    reportId: string;
    type: Database["public"]["Enums"]["productionQuantityType"];
    quantity: number;
    configuration: Database["public"]["Tables"]["productionQuantity"]["Row"]["configuration"];
  }>;
}): ProductionQuantitySplitRowRecord[] {
  return args.lines.flatMap((line) => {
    if (line.type !== "Production") {
      return [];
    }

    return buildPendingSplitSourceRows({
      sourceId: line.id,
      reportId: line.reportId,
      styleId: args.itemId,
      fallbackColorCode: args.fallbackColorCode,
      reportedQuantity: line.quantity,
      configuration: line.configuration
    }).map((row) => ({
      productionQuantityId: line.id,
      reportId: line.reportId,
      jobId: args.jobId,
      jobOperationId: args.jobOperationId,
      itemId: args.itemId,
      rowKey: row.sourceRowKey ?? "row-1",
      colorCode: row.colorCode,
      sizeCode: row.sizeCode ?? null,
      shadeLot: row.shadeLot ?? null,
      configurationKey: row.configurationKey,
      rowConfiguration: row.rowConfiguration ?? null,
      quantity: row.reportedQuantity,
      companyId: args.companyId,
      createdBy: args.createdBy
    }));
  });
}
