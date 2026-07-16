"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOutsideOperationType = isOutsideOperationType;
exports.isInsideOperationType = isInsideOperationType;
exports.showsSupplierRoutingFields = showsSupplierRoutingFields;
exports.showsPickupAndQuantityTabs = showsPickupAndQuantityTabs;
exports.disablesOutsideBopDetailTabs = disablesOutsideBopDetailTabs;
exports.defaultActorKindFromOperationType = defaultActorKindFromOperationType;
exports.allowsSupplierQuantityActor = allowsSupplierQuantityActor;
exports.locksActorToOperationSupplier = locksActorToOperationSupplier;
exports.seededActorFromOperationContext = seededActorFromOperationContext;
exports.defaultOperationTypeFromProcess = defaultOperationTypeFromProcess;
exports.isSupplierQuantityReportId = isSupplierQuantityReportId;
exports.isSupplierQuantityLineId = isSupplierQuantityLineId;
exports.isProductionQuantityReportId = isProductionQuantityReportId;
exports.requiresStrictOutsideRoutingFields = requiresStrictOutsideRoutingFields;
exports.requiresInsideLaborFields = requiresInsideLaborFields;
function isOutsideOperationType(operationType) {
    return operationType === "Outside";
}
function isInsideOperationType(operationType) {
    return operationType === "Inside" || operationType === "Inside and Outside";
}
/** Subcontract supplier + min/unit/lead on the operation form (Outside only). */
function showsSupplierRoutingFields(operationType) {
    return operationType === "Outside";
}
function showsPickupAndQuantityTabs(_operationType) {
    return true;
}
function disablesOutsideBopDetailTabs(operationType) {
    return isOutsideOperationType(operationType);
}
function defaultActorKindFromOperationType(operationType) {
    return isOutsideOperationType(operationType) ? "supplier" : "employee";
}
/** Pure Inside operations record employee quantities only. */
function allowsSupplierQuantityActor(operationType) {
    return operationType === "Outside" || operationType === "Inside and Outside";
}
/** Pure outside routing with a supplier on the operation locks pickup/qty actor. */
function locksActorToOperationSupplier(operationType, operationSupplierProcessId) {
    return (isOutsideOperationType(operationType) &&
        Boolean(operationSupplierProcessId === null || operationSupplierProcessId === void 0 ? void 0 : operationSupplierProcessId.trim()));
}
function seededActorFromOperationContext(context) {
    var _a, _b, _c;
    if (locksActorToOperationSupplier(context.operationType, context.operationSupplierProcessId)) {
        return {
            actorKind: "supplier",
            employeeId: "",
            supplierProcessId: context.operationSupplierProcessId.trim(),
            supplierId: (_b = (_a = context.supplierId) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "",
            lockActorSelection: true
        };
    }
    var actorKind = defaultActorKindFromOperationType(context.operationType);
    // An assigned employee operation seeds (and locks) the reporter to the
    // assignee; unassigned operations stay selectable.
    if (actorKind === "employee" && ((_c = context.assignee) === null || _c === void 0 ? void 0 : _c.trim())) {
        return {
            actorKind: "employee",
            employeeId: context.assignee.trim(),
            supplierProcessId: "",
            supplierId: "",
            lockActorSelection: true
        };
    }
    return {
        actorKind: actorKind,
        employeeId: "",
        supplierProcessId: "",
        supplierId: "",
        lockActorSelection: false
    };
}
function defaultOperationTypeFromProcess(processType) {
    if (processType === "Inside" ||
        processType === "Outside" ||
        processType === "Inside and Outside") {
        return processType;
    }
    return "Inside";
}
function isSupplierQuantityReportId(id) {
    return id.startsWith("josqr");
}
function isSupplierQuantityLineId(id) {
    return id.startsWith("josq") && !isSupplierQuantityReportId(id);
}
function isProductionQuantityReportId(id) {
    return id.startsWith("pqr");
}
/** Outside-only: subcontract min/unit/lead required on save. */
function requiresStrictOutsideRoutingFields(operationType) {
    return operationType === "Outside";
}
/** Inside labor/setup fields required (Inside and hybrid lines). */
function requiresInsideLaborFields(operationType) {
    return isInsideOperationType(operationType);
}
