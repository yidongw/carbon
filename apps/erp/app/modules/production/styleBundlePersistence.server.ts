import { sql } from "kysely";
import { getDatabaseClient } from "~/services/database.server";
import type {
  PersistedSplitRow,
  ProductionQuantitySplitRowRecord
} from "./styleSplitRow.service";

export async function getPersistedSplitRowsForJob(args: {
  companyId: string;
  jobId: string;
}): Promise<{ data: PersistedSplitRow[] | null; error: Error | null }> {
  try {
    const db = getDatabaseClient();
    const result = await sql<PersistedSplitRow>`
      select
        psr."id",
        psr."productionQuantityId",
        psr."reportId",
        psr."itemId" as "styleId",
        psr."rowKey",
        psr."colorCode",
        psr."sizeCode",
        psr."shadeLot",
        psr."configurationKey",
        psr."quantity",
        coalesce(sum(ba."quantity"), 0) as "allocatedQuantity"
      from "productionQuantitySplitRow" psr
      left join "bundleAllocation" ba
        on ba."productionQuantitySplitRowId" = psr."id"
       and ba."companyId" = psr."companyId"
      where psr."companyId" = ${args.companyId}
        and psr."jobId" = ${args.jobId}
      group by
        psr."id",
        psr."productionQuantityId",
        psr."reportId",
        psr."itemId",
        psr."rowKey",
        psr."colorCode",
        psr."sizeCode",
        psr."shadeLot",
        psr."configurationKey",
        psr."quantity",
        psr."createdAt"
      order by psr."createdAt" asc
    `.execute(db);

    return { data: result.rows, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to load persisted split rows")
    };
  }
}

export async function deleteProductionQuantitySplitRowsForReport(args: {
  reportId: string;
  companyId: string;
}) {
  try {
    const db = getDatabaseClient();
    await sql`
      delete from "productionQuantitySplitRow"
      where "reportId" = ${args.reportId}
        and "companyId" = ${args.companyId}
    `.execute(db);
    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to delete split rows for report")
    };
  }
}

export async function deleteProductionQuantitySplitRowsForProductionQuantity(args: {
  productionQuantityId: string;
  companyId: string;
}) {
  try {
    const db = getDatabaseClient();
    await sql`
      delete from "productionQuantitySplitRow"
      where "productionQuantityId" = ${args.productionQuantityId}
        and "companyId" = ${args.companyId}
    `.execute(db);
    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to delete split rows for quantity")
    };
  }
}

export async function insertProductionQuantitySplitRows(
  rows: ProductionQuantitySplitRowRecord[]
) {
  try {
    const db = getDatabaseClient();
    for (const row of rows) {
      await sql`
        insert into "productionQuantitySplitRow" (
          "productionQuantityId",
          "reportId",
          "jobId",
          "jobOperationId",
          "itemId",
          "rowKey",
          "colorCode",
          "sizeCode",
          "shadeLot",
          "configurationKey",
          "rowConfiguration",
          "quantity",
          "companyId",
          "createdBy"
        ) values (
          ${row.productionQuantityId},
          ${row.reportId},
          ${row.jobId},
          ${row.jobOperationId},
          ${row.itemId},
          ${row.rowKey},
          ${row.colorCode},
          ${row.sizeCode},
          ${row.shadeLot},
          ${row.configurationKey},
          ${row.rowConfiguration},
          ${row.quantity},
          ${row.companyId},
          ${row.createdBy}
        )
      `.execute(db);
    }

    return { data: rows, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to insert split rows")
    };
  }
}

export async function insertSplitBatch(args: {
  jobId: string;
  jobOperationId?: string | null;
  itemId: string;
  status: string;
  notes?: string | null;
  companyId: string;
  createdBy: string;
}) {
  try {
    const db = getDatabaseClient();
    const result = await sql<{ id: string }>`
      insert into "splitBatch" (
        "jobId",
        "jobOperationId",
        "itemId",
        "status",
        "notes",
        "companyId",
        "createdBy"
      ) values (
        ${args.jobId},
        ${args.jobOperationId ?? null},
        ${args.itemId},
        ${args.status},
        ${args.notes ?? null},
        ${args.companyId},
        ${args.createdBy}
      )
      returning "id"
    `.execute(db);
    return { data: result.rows[0] ?? null, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to insert split batch")
    };
  }
}

export async function insertBundles(
  rows: Array<{
    splitBatchId: string;
    itemId: string;
    bundleNumber: string;
    sequence: number;
    colorCode: string;
    colorName: string;
    sizeCode: string | null;
    shadeLot: string | null;
    quantity: number;
    status: string;
    companyId: string;
    createdBy: string;
  }>
) {
  try {
    const db = getDatabaseClient();
    const inserted: Array<{
      id: string;
      sequence: number;
      bundleNumber: string;
      quantity: number;
      colorCode: string;
      colorName: string;
      sizeCode: string | null;
      shadeLot: string | null;
      status?: string | null;
      jobId?: string | null;
    }> = [];

    for (const row of rows) {
      const result = await sql<{
        id: string;
        sequence: number;
        bundleNumber: string;
        quantity: number;
        colorCode: string;
        colorName: string;
        sizeCode: string | null;
        shadeLot: string | null;
        status: string;
        jobId: string | null;
      }>`
        insert into "bundle" (
          "splitBatchId",
          "itemId",
          "bundleNumber",
          "sequence",
          "colorCode",
          "colorName",
          "sizeCode",
          "shadeLot",
          "quantity",
          "status",
          "companyId",
          "createdBy"
        ) values (
          ${row.splitBatchId},
          ${row.itemId},
          ${row.bundleNumber},
          ${row.sequence},
          ${row.colorCode},
          ${row.colorName},
          ${row.sizeCode},
          ${row.shadeLot},
          ${row.quantity},
          ${row.status},
          ${row.companyId},
          ${row.createdBy}
        )
        returning
          "id",
          "sequence",
          "bundleNumber",
          "quantity",
          "colorCode",
          "colorName",
          "sizeCode",
          "shadeLot",
          "status",
          "jobId"
      `.execute(db);
      if (result.rows[0]) inserted.push(result.rows[0]);
    }

    return { data: inserted, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Failed to insert bundles")
    };
  }
}

export async function insertBundleAllocations(
  rows: Array<{
    bundleId: string;
    productionQuantitySplitRowId: string;
    quantity: number;
    companyId: string;
    createdBy: string;
  }>
) {
  try {
    const db = getDatabaseClient();
    for (const row of rows) {
      await sql`
        insert into "bundleAllocation" (
          "bundleId",
          "productionQuantitySplitRowId",
          "quantity",
          "companyId",
          "createdBy"
        ) values (
          ${row.bundleId},
          ${row.productionQuantitySplitRowId},
          ${row.quantity},
          ${row.companyId},
          ${row.createdBy}
        )
      `.execute(db);
    }

    return { data: rows, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to insert bundle allocations")
    };
  }
}

export async function getConfirmedSplitBatchIdsForJob(args: {
  companyId: string;
  jobId: string;
}) {
  try {
    const db = getDatabaseClient();
    const result = await sql<{ id: string }>`
      select "id"
      from "splitBatch"
      where "companyId" = ${args.companyId}
        and "jobId" = ${args.jobId}
        and "status" = 'Confirmed'
    `.execute(db);
    return { data: result.rows.map((row) => row.id), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to load confirmed split batches")
    };
  }
}

export async function getAllSplitBatchIdsForJob(args: {
  companyId: string;
  jobId: string;
}) {
  try {
    const db = getDatabaseClient();
    const result = await sql<{ id: string }>`
      select "id"
      from "splitBatch"
      where "companyId" = ${args.companyId}
        and "jobId" = ${args.jobId}
    `.execute(db);
    return { data: result.rows.map((row) => row.id), error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to load split batches")
    };
  }
}

export async function getBundlesForSplitBatchIds(args: {
  companyId: string;
  splitBatchIds: string[];
}) {
  try {
    if (args.splitBatchIds.length === 0) {
      return { data: [] as Array<Record<string, unknown>>, error: null };
    }

    const db = getDatabaseClient();
    const splitBatchIdList = sql.join(
      args.splitBatchIds.map((id) => sql`${id}`),
      sql`, `
    );

    const result = await sql<{
      id: string;
      bundleNumber: string;
      status: string;
      jobId: string | null;
      quantity: number;
      colorCode: string;
      colorName: string;
      sizeCode: string | null;
      shadeLot: string | null;
      sequence: number;
    }>`
      select
        "id",
        "bundleNumber",
        "status",
        "jobId",
        "quantity",
        "colorCode",
        "colorName",
        "sizeCode",
        "shadeLot",
        "sequence"
      from "bundle"
      where "companyId" = ${args.companyId}
        and "splitBatchId" in (${splitBatchIdList})
      order by "sequence" asc
    `.execute(db);

    return { data: result.rows, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Failed to load bundles")
    };
  }
}

export async function updateBundleJobLink(args: {
  bundleId: string;
  companyId: string;
  jobId: string;
  userId: string;
}) {
  try {
    const db = getDatabaseClient();
    await sql`
      update "bundle"
      set
        "jobId" = ${args.jobId},
        "updatedBy" = ${args.userId}
      where "id" = ${args.bundleId}
        and "companyId" = ${args.companyId}
    `.execute(db);
    return { data: true, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Failed to link bundle job")
    };
  }
}
