"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCarbonStatusToLinearStatus = exports.mapLinearStatusToCarbonStatus = exports.LinearWorkStateType = void 0;
var LinearWorkStateType;
(function (LinearWorkStateType) {
    LinearWorkStateType["Triage"] = "triage";
    LinearWorkStateType["Backlog"] = "backlog";
    LinearWorkStateType["Todo"] = "todo";
    LinearWorkStateType["Unstarted"] = "unstarted";
    LinearWorkStateType["Started"] = "started";
    LinearWorkStateType["Completed"] = "completed";
    LinearWorkStateType["Canceled"] = "canceled";
})(LinearWorkStateType || (exports.LinearWorkStateType = LinearWorkStateType = {}));
var mapLinearStatusToCarbonStatus = function (status) {
    switch (status) {
        case LinearWorkStateType.Started:
            return "In Progress";
        case LinearWorkStateType.Canceled:
            return "Skipped";
        case LinearWorkStateType.Completed:
            return "Completed";
        case LinearWorkStateType.Triage:
        case LinearWorkStateType.Unstarted:
        case LinearWorkStateType.Todo:
        case LinearWorkStateType.Backlog:
        default:
            return "Pending";
    }
};
exports.mapLinearStatusToCarbonStatus = mapLinearStatusToCarbonStatus;
var mapCarbonStatusToLinearStatus = function (status) {
    switch (status) {
        case "Pending":
            return LinearWorkStateType.Unstarted;
        case "In Progress":
            return LinearWorkStateType.Started;
        case "Completed":
            return LinearWorkStateType.Completed;
        case "Skipped":
            return LinearWorkStateType.Canceled;
        default:
            throw new Error("Unknown Carbon task status: ".concat(status));
    }
};
exports.mapCarbonStatusToLinearStatus = mapCarbonStatusToLinearStatus;
