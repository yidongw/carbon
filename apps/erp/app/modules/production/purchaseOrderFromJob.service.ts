import type { Database } from "@carbon/database";
import {
  calculateOutsideProcessingPurchaseOrderLines,
  toPurchaseOrderItemLineType
} from "@carbon/utils";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  upsertPurchaseOrder,
  upsertPurchaseOrderLine
} from "~/modules/purchasing/purchasing.service";
import { getNextSequence } from "~/modules/settings/settings.service";

type OutsideOperation = Database["public"]["Tables"]["jobOperation"]["Row"] & {
  jobMakeMethod: { itemId: string | null } | null;
};

export async function createPurchaseOrdersFromJob(
  client: SupabaseClient<Database>,
  args: {
    jobId: string;
    companyId: string;
    companyGroupId: string;
    userId: string;
    purchaseOrdersBySupplierId: Record<string, string>;
  }
) {
  const { data: job, error: jobError } = await client
    .from("job")
    .select("id, jobId, locationId")
    .eq("id", args.jobId)
    .eq("companyId", args.companyId)
    .single();

  if (jobError || !job) {
    return { data: null, error: jobError ?? new Error("Job not found") };
  }

  const { data: jobOperations, error: jobOperationsError } = await client
    .from("jobOperation")
    .select("*, jobMakeMethod(itemId)")
    .eq("jobId", args.jobId)
    .eq("companyId", args.companyId);

  if (jobOperationsError) {
    return { data: null, error: jobOperationsError };
  }

  const outsideOperations = (jobOperations ?? []).filter(
    (operation) => operation.operationType === "Outside"
  ) as OutsideOperation[];

  if (outsideOperations.length === 0) {
    return { data: { success: true }, error: null };
  }

  const supplierProcessIds = [
    ...new Set(
      outsideOperations
        .map((operation) => operation.operationSupplierProcessId)
        .filter((id): id is string => Boolean(id))
    )
  ];

  if (supplierProcessIds.length === 0) {
    return {
      data: null,
      error: new Error(
        "Outside operations must have a supplier before releasing the job"
      )
    };
  }

  const outsideOperationIds = outsideOperations.map(
    (operation) => operation.id
  );

  const [supplierProcessesResult, existingLinesResult] = await Promise.all([
    client.from("supplierProcess").select("*").in("id", supplierProcessIds),
    client
      .from("purchaseOrderLine")
      .select("jobOperationId")
      .eq("jobId", args.jobId)
      .in("jobOperationId", outsideOperationIds)
  ]);

  if (supplierProcessesResult.error) {
    return { data: null, error: supplierProcessesResult.error };
  }
  if (existingLinesResult.error) {
    return { data: null, error: existingLinesResult.error };
  }

  const existingJobOperationIds = new Set(
    existingLinesResult.data
      ?.map((line) => line.jobOperationId)
      .filter(Boolean) ?? []
  );

  const outsideOperationsBySupplierId = outsideOperations.reduce<
    Record<string, OutsideOperation[]>
  >((acc, operation) => {
    if (existingJobOperationIds.has(operation.id)) {
      return acc;
    }

    const supplierProcess = supplierProcessesResult.data?.find(
      (row) => row.id === operation.operationSupplierProcessId
    );
    if (!supplierProcess) {
      return acc;
    }

    if (!acc[supplierProcess.supplierId]) {
      acc[supplierProcess.supplierId] = [];
    }
    acc[supplierProcess.supplierId].push(operation);
    return acc;
  }, {});

  const supplierIds = Object.keys(outsideOperationsBySupplierId);
  if (supplierIds.length === 0) {
    return { data: { success: true }, error: null };
  }

  const itemIds = [
    ...new Set(
      outsideOperations
        .map((operation) => operation.jobMakeMethod?.itemId)
        .filter((id): id is string => Boolean(id))
    )
  ];

  const { data: items, error: itemsError } =
    itemIds.length > 0
      ? await client.from("item").select("*").in("id", itemIds)
      : { data: [], error: null };

  if (itemsError) {
    return { data: null, error: itemsError };
  }

  for (const supplierId of supplierIds) {
    const operations = outsideOperationsBySupplierId[supplierId];
    let purchaseOrderId =
      args.purchaseOrdersBySupplierId[supplierId] === "new"
        ? undefined
        : args.purchaseOrdersBySupplierId[supplierId];

    if (!purchaseOrderId) {
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
        .eq("id", supplierId)
        .single();

      const purchaseOrder = await upsertPurchaseOrder(client, {
        purchaseOrderId: nextSequence.data,
        supplierId,
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

      purchaseOrderId = purchaseOrder.data[0].id;
    }

    for (const operation of operations) {
      const item = items?.find(
        (row) => row.id === operation.jobMakeMethod?.itemId
      );
      const supplierProcess = supplierProcessesResult.data?.find(
        (row) => row.id === operation.operationSupplierProcessId
      );

      if (!item || !supplierProcess) {
        continue;
      }

      const unitCost =
        operation.operationUnitCost ?? supplierProcess.unitCost ?? 0;
      const minimumCost =
        operation.operationMinimumCost ?? supplierProcess.minimumCost ?? 0;
      const quantity = operation.operationQuantity ?? 1;

      const pricingLines = calculateOutsideProcessingPurchaseOrderLines({
        quantity,
        unitCost,
        minimumCost,
        minimumCostDescription: `Minimum cost - ${operation.description ?? item.name ?? "Outside processing"}`
      });

      const purchaseOrderLineType = toPurchaseOrderItemLineType(item.type);

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
            : operation.id,
          companyId: args.companyId,
          createdBy: args.userId
        });

        if (line.error) {
          return { data: null, error: line.error };
        }
      }
    }
  }

  return { data: { success: true }, error: null };
}
