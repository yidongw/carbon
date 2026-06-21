import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

type ActorQuantityRow = {
  jobOperationId: string;
  quantity: number;
  employeeId?: string | null;
  supplierProcessId?: string | null;
};

function actorKey(row: ActorQuantityRow) {
  if (row.employeeId) return `employee:${row.employeeId}`;
  if (row.supplierProcessId) return `supplier:${row.supplierProcessId}`;
  return "unknown";
}

function addActorQuantity(
  totalsByOperation: Map<string, Map<string, number>>,
  row: ActorQuantityRow
) {
  const operationTotals =
    totalsByOperation.get(row.jobOperationId) ?? new Map<string, number>();
  const key = actorKey(row);
  operationTotals.set(key, (operationTotals.get(key) ?? 0) + Number(row.quantity));
  totalsByOperation.set(row.jobOperationId, operationTotals);
}

/** In-progress quantity = each actor's pickups minus their production on the operation. */
export function calculateInProgressQuantityByOperation(
  pickups: ActorQuantityRow[],
  productions: ActorQuantityRow[]
): Map<string, number> {
  const pickupTotalsByOperation = new Map<string, Map<string, number>>();
  const productionTotalsByOperation = new Map<string, Map<string, number>>();

  for (const pickup of pickups) {
    addActorQuantity(pickupTotalsByOperation, pickup);
  }
  for (const production of productions) {
    addActorQuantity(productionTotalsByOperation, production);
  }

  const inProgressByOperation = new Map<string, number>();

  for (const [operationId, pickupByActor] of pickupTotalsByOperation) {
    const productionByActor =
      productionTotalsByOperation.get(operationId) ?? new Map<string, number>();
    let total = 0;

    for (const [actor, pickupQty] of pickupByActor) {
      const productionQty = productionByActor.get(actor) ?? 0;
      total += Math.max(0, pickupQty - productionQty);
    }

    inProgressByOperation.set(operationId, total);
  }

  return inProgressByOperation;
}

export async function fetchInProgressQuantitiesByOperation(
  client: SupabaseClient<Database>,
  companyId: string,
  operationIds: string[]
): Promise<Map<string, number>> {
  if (operationIds.length === 0) return new Map();

  const [
    { data: employeePickups },
    { data: supplierPickups },
    { data: employeeProductions },
    { data: supplierProductions }
  ] = await Promise.all([
    client
      .from("jobOperationPickup")
      .select("jobOperationId, employeeId, quantity")
      .in("jobOperationId", operationIds)
      .eq("companyId", companyId),
    client
      .from("jobOperationSupplierPickup")
      .select("jobOperationId, supplierProcessId, quantity")
      .in("jobOperationId", operationIds)
      .eq("companyId", companyId),
    client
      .from("productionQuantity")
      .select("jobOperationId, employeeId, quantity")
      .in("jobOperationId", operationIds)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null),
    client
      .from("jobOperationSupplierQuantity")
      .select("jobOperationId, supplierProcessId, quantity")
      .in("jobOperationId", operationIds)
      .eq("companyId", companyId)
      .eq("type", "Production")
      .is("invalidatedAt", null)
  ]);

  const pickups: ActorQuantityRow[] = [
    ...(employeePickups ?? []).map((row) => ({
      jobOperationId: row.jobOperationId,
      employeeId: row.employeeId,
      quantity: row.quantity as number
    })),
    ...(supplierPickups ?? []).map((row) => ({
      jobOperationId: row.jobOperationId,
      supplierProcessId: row.supplierProcessId,
      quantity: row.quantity as number
    }))
  ];

  const productions: ActorQuantityRow[] = [
    ...(employeeProductions ?? []).map((row) => ({
      jobOperationId: row.jobOperationId,
      employeeId: row.employeeId,
      quantity: row.quantity as number
    })),
    ...(supplierProductions ?? []).map((row) => ({
      jobOperationId: row.jobOperationId,
      supplierProcessId: row.supplierProcessId,
      quantity: row.quantity as number
    }))
  ];

  return calculateInProgressQuantityByOperation(pickups, productions);
}
