"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJobStatusLabel = useJobStatusLabel;
exports.useStyleProcessLabel = useStyleProcessLabel;
exports.useJobOperationStatusLabel = useJobOperationStatusLabel;
exports.useDeadlineTypeLabel = useDeadlineTypeLabel;
exports.useProcedureStatusLabel = useProcedureStatusLabel;
exports.useMaintenanceDispatchPriorityLabel = useMaintenanceDispatchPriorityLabel;
exports.useMaintenanceDispatchStatusLabel = useMaintenanceDispatchStatusLabel;
exports.useMaintenanceFrequencyLabel = useMaintenanceFrequencyLabel;
exports.useMaintenanceSeverityLabel = useMaintenanceSeverityLabel;
exports.useMaintenanceSourceLabel = useMaintenanceSourceLabel;
exports.useOeeImpactLabel = useOeeImpactLabel;
exports.useKpiLabel = useKpiLabel;
exports.useKpiEmptyMessage = useKpiEmptyMessage;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
function useJobStatusLabel() {
    var t = (0, macro_1.useLingui)().t;
    // Memoized so the returned function has a stable identity across renders.
    // Tables put these label helpers in their column-builder useMemo deps; an
    // unstable function would rebuild the columns every render and remount cells.
    return (0, react_1.useCallback)(function (status) {
        switch (status) {
            case "Draft":
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Draft"], ["Draft"])));
            case "Planned":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Planned"], ["Planned"])));
            case "Ready":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Ready"], ["Ready"])));
            case "In Progress":
                return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["In Progress"], ["In Progress"])));
            case "Paused":
                return t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Paused"], ["Paused"])));
            case "Completed":
                return t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Completed"], ["Completed"])));
            case "Closed":
                return t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Closed"], ["Closed"])));
            case "Cancelled":
                return t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Cancelled"], ["Cancelled"])));
            case "Overdue":
                return t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Overdue"], ["Overdue"])));
            case "Due Today":
                return t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Due Today"], ["Due Today"])));
            default:
                return status;
        }
    }, [t]);
}
// Cutting is a system-identified style stage (styleStage === "cutting" / the
// cutting tag), so its process name can be shown translated. Other process
// names are free-text user data and pass through unchanged. Memoized for a
// stable identity (feeds table column-builder useMemo deps).
function useStyleProcessLabel() {
    var t = (0, macro_1.useLingui)().t;
    return (0, react_1.useCallback)(function (description, isCutting) {
        return isCutting ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Cutting"], ["Cutting"]))) : (description !== null && description !== void 0 ? description : "");
    }, [t]);
}
function useJobOperationStatusLabel() {
    var t = (0, macro_1.useLingui)().t;
    // Memoized so the returned function has a stable identity across renders.
    // Tables put this in their column-builder useMemo deps; an unstable function
    // rebuilds the columns every render and remounts cells — which slams open
    // dropdowns (the operation-status menu) shut the instant they open.
    return (0, react_1.useCallback)(function (status) {
        switch (status) {
            case "Todo":
                return t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Todo"], ["Todo"])));
            case "Ready":
                return t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Ready"], ["Ready"])));
            case "Waiting":
                return t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Waiting"], ["Waiting"])));
            case "In Progress":
                return t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["In Progress"], ["In Progress"])));
            case "Paused":
                return t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Paused"], ["Paused"])));
            case "Done":
                return t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Done"], ["Done"])));
            case "Canceled":
                return t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Canceled"], ["Canceled"])));
            default:
                return status;
        }
    }, [t]);
}
function useDeadlineTypeLabel() {
    var t = (0, macro_1.useLingui)().t;
    return (0, react_1.useCallback)(function (deadlineType) {
        switch (deadlineType) {
            case "ASAP":
                return t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["ASAP"], ["ASAP"])));
            case "Hard Deadline":
                return t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Hard Deadline"], ["Hard Deadline"])));
            case "Soft Deadline":
                return t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Soft Deadline"], ["Soft Deadline"])));
            case "No Deadline":
                return t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["No Deadline"], ["No Deadline"])));
            default:
                return deadlineType;
        }
    }, [t]);
}
function useProcedureStatusLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (status) {
        switch (status) {
            case "Draft":
                return t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Draft"], ["Draft"])));
            case "Active":
                return t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Active"], ["Active"])));
            case "Archived":
                return t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Archived"], ["Archived"])));
            default:
                return status;
        }
    };
}
function useMaintenanceDispatchPriorityLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (priority) {
        switch (priority) {
            case "Low":
                return t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Low"], ["Low"])));
            case "Medium":
                return t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Medium"], ["Medium"])));
            case "High":
                return t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["High"], ["High"])));
            case "Critical":
                return t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Critical"], ["Critical"])));
            default:
                return priority;
        }
    };
}
function useMaintenanceDispatchStatusLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (status) {
        switch (status) {
            case "Open":
                return t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Open"], ["Open"])));
            case "Assigned":
                return t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Assigned"], ["Assigned"])));
            case "In Progress":
                return t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["In Progress"], ["In Progress"])));
            case "Completed":
                return t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Completed"], ["Completed"])));
            case "Cancelled":
                return t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Cancelled"], ["Cancelled"])));
            default:
                return status;
        }
    };
}
function useMaintenanceFrequencyLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (frequency) {
        switch (frequency) {
            case "Daily":
                return t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Daily"], ["Daily"])));
            case "Weekly":
                return t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Weekly"], ["Weekly"])));
            case "Monthly":
                return t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Monthly"], ["Monthly"])));
            case "Quarterly":
                return t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Quarterly"], ["Quarterly"])));
            case "Annual":
                return t(templateObject_39 || (templateObject_39 = __makeTemplateObject(["Annual"], ["Annual"])));
            default:
                return frequency;
        }
    };
}
function useMaintenanceSeverityLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (severity) {
        switch (severity) {
            case "Preventive":
                return t(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Preventive"], ["Preventive"])));
            case "Operator Performed":
                return t(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Operator Performed"], ["Operator Performed"])));
            case "Support Required":
                return t(templateObject_42 || (templateObject_42 = __makeTemplateObject(["Support Required"], ["Support Required"])));
            case "OEM Required":
                return t(templateObject_43 || (templateObject_43 = __makeTemplateObject(["OEM Required"], ["OEM Required"])));
            default:
                return severity;
        }
    };
}
function useMaintenanceSourceLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (source) {
        switch (source) {
            case "Scheduled":
                return t(templateObject_44 || (templateObject_44 = __makeTemplateObject(["Scheduled"], ["Scheduled"])));
            case "Reactive":
                return t(templateObject_45 || (templateObject_45 = __makeTemplateObject(["Reactive"], ["Reactive"])));
            case "Non-Conformance":
                return t(templateObject_46 || (templateObject_46 = __makeTemplateObject(["Non-Conformance"], ["Non-Conformance"])));
            default:
                return source;
        }
    };
}
function useOeeImpactLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (impact) {
        switch (impact) {
            case "Down":
                return t(templateObject_47 || (templateObject_47 = __makeTemplateObject(["Down"], ["Down"])));
            case "Planned":
                return t(templateObject_48 || (templateObject_48 = __makeTemplateObject(["Planned"], ["Planned"])));
            case "Impact":
                return t(templateObject_49 || (templateObject_49 = __makeTemplateObject(["Impact"], ["Impact"])));
            case "No Impact":
                return t(templateObject_50 || (templateObject_50 = __makeTemplateObject(["No Impact"], ["No Impact"])));
            default:
                return impact;
        }
    };
}
function useKpiLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (key) {
        switch (key) {
            case "utilization":
                return t(templateObject_51 || (templateObject_51 = __makeTemplateObject(["Work Center Utilization"], ["Work Center Utilization"])));
            case "estimatesVsActuals":
                return t(templateObject_52 || (templateObject_52 = __makeTemplateObject(["Estimates vs Actuals"], ["Estimates vs Actuals"])));
            case "completionTime":
                return t(templateObject_53 || (templateObject_53 = __makeTemplateObject(["Completion Time"], ["Completion Time"])));
            default:
                return key;
        }
    };
}
function useKpiEmptyMessage() {
    var t = (0, macro_1.useLingui)().t;
    return function (key) {
        switch (key) {
            case "utilization":
                return t(templateObject_54 || (templateObject_54 = __makeTemplateObject(["No work center utilization data within range"], ["No work center utilization data within range"])));
            case "estimatesVsActuals":
            case "completionTime":
                return t(templateObject_55 || (templateObject_55 = __makeTemplateObject(["No completed jobs within range"], ["No completed jobs within range"])));
            default:
                return "";
        }
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49, templateObject_50, templateObject_51, templateObject_52, templateObject_53, templateObject_54, templateObject_55;
