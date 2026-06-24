import { cn, Status } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import {
  LuCircleCheck,
  LuCircleDashed,
  LuCirclePause,
  LuCirclePlay,
  LuCircleSlash,
  LuCircleX,
  LuClock,
  LuLoaderCircle
} from "react-icons/lu";
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

// Colored status icon used in the inline status menu (mirrors the badge colors
// so the dropdown reads at a glance, like the operation status menu).
const STATUS_ICON_MAP: Record<
  (typeof jobStatus)[number],
  { icon: typeof LuCircleDashed; className: string }
> = {
  Draft: { icon: LuCircleDashed, className: "text-muted-foreground" },
  Planned: { icon: LuClock, className: "text-yellow-500" },
  Ready: { icon: LuCirclePlay, className: "text-blue-600" },
  "In Progress": { icon: LuLoaderCircle, className: "text-blue-600" },
  Paused: { icon: LuCirclePause, className: "text-orange-500" },
  Completed: { icon: LuCircleCheck, className: "text-green-600" },
  Closed: { icon: LuCircleSlash, className: "text-muted-foreground" },
  Cancelled: { icon: LuCircleX, className: "text-red-600" },
  "Due Today": { icon: LuClock, className: "text-orange-500" },
  Overdue: { icon: LuCircleX, className: "text-red-600" }
};

export function JobStatusIcon({
  status,
  className
}: {
  status: (typeof jobStatus)[number];
  className?: string;
}) {
  const entry = STATUS_ICON_MAP[status];
  if (!entry) return null;
  const Icon = entry.icon;
  return <Icon className={cn(entry.className, className)} />;
}

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
