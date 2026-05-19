import { useLingui } from "@lingui/react/macro";
import type { deadlineTypes, jobStatus } from "../../production.models";

export function useJobStatusLabel() {
  const { t } = useLingui();

  return (status: (typeof jobStatus)[number]) => {
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
  };
}

export function useDeadlineTypeLabel() {
  const { t } = useLingui();

  return (deadlineType: (typeof deadlineTypes)[number]) => {
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
  };
}
