"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductionFormCascadeState = getProductionFormCascadeState;
function getProductionFormCascadeState(_a) {
    var isEditing = _a.isEditing, hasJobPicker = _a.hasJobPicker, selectedJobId = _a.selectedJobId, jobOperationId = _a.jobOperationId, actorSelection = _a.actorSelection, _b = _a.permissionDisabled, permissionDisabled = _b === void 0 ? false : _b;
    var hasJobSelected = isEditing || !hasJobPicker || Boolean(selectedJobId.trim());
    var hasOperationSelected = isEditing || Boolean(jobOperationId.trim());
    var hasActorSelected = isEditing || Boolean(actorSelection.trim());
    var areDetailFieldsDisabled = permissionDisabled ||
        !hasJobSelected ||
        !hasOperationSelected ||
        !hasActorSelected;
    return {
        hasJobSelected: hasJobSelected,
        hasOperationSelected: hasOperationSelected,
        hasActorSelected: hasActorSelected,
        areDetailFieldsDisabled: areDetailFieldsDisabled,
        canSubmitDetails: hasJobSelected && hasOperationSelected && hasActorSelected
    };
}
