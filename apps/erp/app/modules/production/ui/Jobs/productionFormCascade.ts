export type ProductionFormCascadeInput = {
  isEditing: boolean;
  hasJobPicker: boolean;
  selectedJobId: string;
  jobOperationId: string;
  actorSelection: string;
  permissionDisabled?: boolean;
};

export function getProductionFormCascadeState({
  isEditing,
  hasJobPicker,
  selectedJobId,
  jobOperationId,
  actorSelection,
  permissionDisabled = false
}: ProductionFormCascadeInput) {
  const hasJobSelected =
    isEditing || !hasJobPicker || Boolean(selectedJobId.trim());
  const hasOperationSelected = isEditing || Boolean(jobOperationId.trim());
  const hasActorSelected = isEditing || Boolean(actorSelection.trim());

  const areDetailFieldsDisabled =
    permissionDisabled ||
    !hasJobSelected ||
    !hasOperationSelected ||
    !hasActorSelected;

  return {
    hasJobSelected,
    hasOperationSelected,
    hasActorSelected,
    areDetailFieldsDisabled,
    canSubmitDetails:
      hasJobSelected && hasOperationSelected && hasActorSelected
  };
}
