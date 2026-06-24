import { Status } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { jobStatus } from "../../production.models";
import { useJobStatusLabel } from "./jobLabels";

type JobStatusProps = {
  status?: (typeof jobStatus)[number] | null;
  className?: string;
  iconOnly?: boolean;
};

export const STATUS_COLOR_MAP: Record<
  (typeof jobStatus)[number],
  "gray" | "yellow" | "blue" | "orange" | "green" | "red"
> = {
  Draft: "gray",
  Planned: "yellow",
  Ready: "blue",
  "In Progress": "blue",
  Paused: "orange",
  "Due Today": "orange",
  Completed: "green",
  Closed: "gray",
  Overdue: "red",
  Cancelled: "red"
} as const;

// Display text mirrors the badge label, mapping "Ready" -> "Released" while
// keeping every status translated. Shared so filter options can render the same
// text the chip extracts via reactNodeToString.
export function useJobStatusDisplayText() {
  const { t } = useLingui();
  const getJobStatusLabel = useJobStatusLabel();

  return (status: (typeof jobStatus)[number]) =>
    status === "Ready" ? t`Released` : getJobStatusLabel(status);
}

function JobStatus({ status, className, iconOnly }: JobStatusProps) {
  const getJobStatusLabel = useJobStatusLabel();
  const getDisplayText = useJobStatusDisplayText();

  if (!status) return null;

  const color = STATUS_COLOR_MAP[status];
  if (!color) return null;

  const displayText = getDisplayText(status);
  const tooltip = status === "Ready" ? getJobStatusLabel("Ready") : undefined;

  return (
    <Status
      color={color}
      className={className}
      tooltip={tooltip}
      iconOnly={iconOnly}
    >
      {displayText}
    </Status>
  );
}

export default JobStatus;
