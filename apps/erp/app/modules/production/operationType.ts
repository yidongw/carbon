import type { operationTypes } from "~/modules/shared/shared.models";

export type OperationType = (typeof operationTypes)[number];

export function isOutsideOperationType(
  operationType: OperationType | string | null | undefined
) {
  return operationType === "Outside";
}

export function isInsideOperationType(
  operationType: OperationType | string | null | undefined
) {
  return operationType === "Inside" || operationType === "Inside and Outside";
}

/** Subcontract supplier + min/unit/lead on the operation form (Outside only). */
export function showsSupplierRoutingFields(
  operationType: OperationType | string | null | undefined
) {
  return operationType === "Outside";
}

export function showsPickupAndQuantityTabs(
  _operationType: OperationType | string | null | undefined
) {
  return true;
}

export function disablesOutsideBopDetailTabs(
  operationType: OperationType | string | null | undefined
) {
  return isOutsideOperationType(operationType);
}

export function defaultActorKindFromOperationType(
  operationType: OperationType | string | null | undefined
): "employee" | "supplier" {
  return isOutsideOperationType(operationType) ? "supplier" : "employee";
}

/** Pure Inside operations record employee quantities only. */
export function allowsSupplierQuantityActor(
  operationType: OperationType | string | null | undefined
) {
  return operationType === "Outside" || operationType === "Inside and Outside";
}

/** Pure outside routing with a supplier on the operation locks pickup/qty actor. */
export function locksActorToOperationSupplier(
  operationType: OperationType | string | null | undefined,
  operationSupplierProcessId: string | null | undefined
) {
  return (
    isOutsideOperationType(operationType) &&
    Boolean(operationSupplierProcessId?.trim())
  );
}

export function seededActorFromOperationContext(context: {
  operationType: OperationType | string | null | undefined;
  operationSupplierProcessId?: string | null;
  supplierId?: string | null;
  assignee?: string | null;
}) {
  if (
    locksActorToOperationSupplier(
      context.operationType,
      context.operationSupplierProcessId
    )
  ) {
    return {
      actorKind: "supplier" as const,
      employeeId: "",
      supplierProcessId: context.operationSupplierProcessId!.trim(),
      supplierId: context.supplierId?.trim() ?? "",
      lockActorSelection: true
    };
  }

  const actorKind = defaultActorKindFromOperationType(context.operationType);

  // An assigned employee operation seeds (and locks) the reporter to the
  // assignee; unassigned operations stay selectable.
  if (actorKind === "employee" && context.assignee?.trim()) {
    return {
      actorKind: "employee" as const,
      employeeId: context.assignee.trim(),
      supplierProcessId: "",
      supplierId: "",
      lockActorSelection: true
    };
  }

  return {
    actorKind,
    employeeId: "",
    supplierProcessId: "",
    supplierId: "",
    lockActorSelection: false
  };
}

export function defaultOperationTypeFromProcess(
  processType: string | null | undefined
): OperationType {
  if (
    processType === "Inside" ||
    processType === "Outside" ||
    processType === "Inside and Outside"
  ) {
    return processType;
  }
  return "Inside";
}

export function isSupplierQuantityReportId(id: string) {
  return id.startsWith("josqr");
}

export function isSupplierQuantityLineId(id: string) {
  return id.startsWith("josq") && !isSupplierQuantityReportId(id);
}

export function isProductionQuantityReportId(id: string) {
  return id.startsWith("pqr");
}

/** Outside-only: subcontract min/unit/lead required on save. */
export function requiresStrictOutsideRoutingFields(
  operationType: OperationType | string | null | undefined
) {
  return operationType === "Outside";
}

/** Inside labor/setup fields required (Inside and hybrid lines). */
export function requiresInsideLaborFields(
  operationType: OperationType | string | null | undefined
) {
  return isInsideOperationType(operationType);
}
