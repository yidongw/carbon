import { useLingui } from "@lingui/react/macro";
import { useCallback } from "react";
import type {
  deadlineTypes,
  jobOperationStatus,
  jobStatus,
  KPIs,
  maintenanceDispatchPriority,
  maintenanceDispatchStatus,
  maintenanceFrequency,
  maintenanceSeverity,
  maintenanceSource,
  oeeImpact,
  procedureStatus
} from "./production.models";

export function useJobStatusLabel() {
  const { t } = useLingui();

  // Memoized so the returned function has a stable identity across renders.
  // Tables put these label helpers in their column-builder useMemo deps; an
  // unstable function would rebuild the columns every render and remount cells.
  return useCallback(
    (status: (typeof jobStatus)[number]) => {
      switch (status) {
        case "Draft":
          return t`Draft`;
        case "Planned":
          return t`Planned`;
        case "Ready":
          return t`Ready`;
        case "In Progress":
          return t`In Progress`;
        case "Paused":
          return t`Paused`;
        case "Completed":
          return t`Completed`;
        case "Closed":
          return t`Closed`;
        case "Cancelled":
          return t`Cancelled`;
        case "Overdue":
          return t`Overdue`;
        case "Due Today":
          return t`Due Today`;
        default:
          return status;
      }
    },
    [t]
  );
}

// Cutting is a system-identified style stage (styleStage === "cutting" / the
// cutting tag), so its process name can be shown translated. Other process
// names are free-text user data and pass through unchanged. Memoized for a
// stable identity (feeds table column-builder useMemo deps).
export function useStyleProcessLabel() {
  const { t } = useLingui();

  return useCallback(
    (description: string | null | undefined, isCutting: boolean) =>
      isCutting ? t`Cutting` : (description ?? ""),
    [t]
  );
}

export function useJobOperationStatusLabel() {
  const { t } = useLingui();

  // Memoized so the returned function has a stable identity across renders.
  // Tables put this in their column-builder useMemo deps; an unstable function
  // rebuilds the columns every render and remounts cells — which slams open
  // dropdowns (the operation-status menu) shut the instant they open.
  return useCallback(
    (status: (typeof jobOperationStatus)[number]) => {
      switch (status) {
        case "Todo":
          return t`Todo`;
        case "Ready":
          return t`Ready`;
        case "Waiting":
          return t`Waiting`;
        case "In Progress":
          return t`In Progress`;
        case "Paused":
          return t`Paused`;
        case "Done":
          return t`Done`;
        case "Canceled":
          return t`Canceled`;
        default:
          return status;
      }
    },
    [t]
  );
}

export function useDeadlineTypeLabel() {
  const { t } = useLingui();

  return useCallback(
    (deadlineType: (typeof deadlineTypes)[number]) => {
      switch (deadlineType) {
        case "ASAP":
          return t`ASAP`;
        case "Hard Deadline":
          return t`Hard Deadline`;
        case "Soft Deadline":
          return t`Soft Deadline`;
        case "No Deadline":
          return t`No Deadline`;
        default:
          return deadlineType;
      }
    },
    [t]
  );
}

export function useProcedureStatusLabel() {
  const { t } = useLingui();

  return (status: (typeof procedureStatus)[number]) => {
    switch (status) {
      case "Draft":
        return t`Draft`;
      case "Active":
        return t`Active`;
      case "Archived":
        return t`Archived`;
      default:
        return status;
    }
  };
}

export function useMaintenanceDispatchPriorityLabel() {
  const { t } = useLingui();

  return (priority: (typeof maintenanceDispatchPriority)[number]) => {
    switch (priority) {
      case "Low":
        return t`Low`;
      case "Medium":
        return t`Medium`;
      case "High":
        return t`High`;
      case "Critical":
        return t`Critical`;
      default:
        return priority;
    }
  };
}

export function useMaintenanceDispatchStatusLabel() {
  const { t } = useLingui();

  return (status: (typeof maintenanceDispatchStatus)[number]) => {
    switch (status) {
      case "Open":
        return t`Open`;
      case "Assigned":
        return t`Assigned`;
      case "In Progress":
        return t`In Progress`;
      case "Completed":
        return t`Completed`;
      case "Cancelled":
        return t`Cancelled`;
      default:
        return status;
    }
  };
}

export function useMaintenanceFrequencyLabel() {
  const { t } = useLingui();

  return (frequency: (typeof maintenanceFrequency)[number]) => {
    switch (frequency) {
      case "Daily":
        return t`Daily`;
      case "Weekly":
        return t`Weekly`;
      case "Monthly":
        return t`Monthly`;
      case "Quarterly":
        return t`Quarterly`;
      case "Annual":
        return t`Annual`;
      default:
        return frequency;
    }
  };
}

export function useMaintenanceSeverityLabel() {
  const { t } = useLingui();

  return (severity: (typeof maintenanceSeverity)[number]) => {
    switch (severity) {
      case "Preventive":
        return t`Preventive`;
      case "Operator Performed":
        return t`Operator Performed`;
      case "Support Required":
        return t`Support Required`;
      case "OEM Required":
        return t`OEM Required`;
      default:
        return severity;
    }
  };
}

export function useMaintenanceSourceLabel() {
  const { t } = useLingui();

  return (source: (typeof maintenanceSource)[number]) => {
    switch (source) {
      case "Scheduled":
        return t`Scheduled`;
      case "Reactive":
        return t`Reactive`;
      case "Non-Conformance":
        return t`Non-Conformance`;
      default:
        return source;
    }
  };
}

export function useOeeImpactLabel() {
  const { t } = useLingui();

  return (impact: (typeof oeeImpact)[number]) => {
    switch (impact) {
      case "Down":
        return t`Down`;
      case "Planned":
        return t`Planned`;
      case "Impact":
        return t`Impact`;
      case "No Impact":
        return t`No Impact`;
      default:
        return impact;
    }
  };
}

export function useKpiLabel() {
  const { t } = useLingui();

  return (key: (typeof KPIs)[number]["key"]) => {
    switch (key) {
      case "utilization":
        return t`Work Center Utilization`;
      case "estimatesVsActuals":
        return t`Estimates vs Actuals`;
      case "completionTime":
        return t`Completion Time`;
      default:
        return key;
    }
  };
}

export function useKpiEmptyMessage() {
  const { t } = useLingui();

  return (key: (typeof KPIs)[number]["key"]) => {
    switch (key) {
      case "utilization":
        return t`No work center utilization data within range`;
      case "estimatesVsActuals":
      case "completionTime":
        return t`No completed jobs within range`;
      default:
        return "";
    }
  };
}
