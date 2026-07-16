"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbilityEmployeeStatus = void 0;
exports.getTrainingStatus = getTrainingStatus;
var AbilityEmployeeStatus;
(function (AbilityEmployeeStatus) {
    AbilityEmployeeStatus["NotStarted"] = "Not Started";
    AbilityEmployeeStatus["InProgress"] = "In Progress";
    AbilityEmployeeStatus["Complete"] = "Complete";
})(AbilityEmployeeStatus || (exports.AbilityEmployeeStatus = AbilityEmployeeStatus = {}));
function getTrainingStatus(employeeAbility) {
    if (!employeeAbility)
        return undefined;
    if (employeeAbility.trainingCompleted)
        return AbilityEmployeeStatus.Complete;
    if (employeeAbility.trainingDays > 0)
        return AbilityEmployeeStatus.InProgress;
    return AbilityEmployeeStatus.NotStarted;
}
