import { Status } from "@carbon/react";

const STATUS_COLORS: Record<
  string,
  "gray" | "yellow" | "blue" | "orange" | "green" | "red"
> = {
  Draft: "gray",
  Planned: "yellow",
  Ready: "blue",
  "In Progress": "blue",
  Paused: "orange",
  Completed: "green",
  Closed: "gray",
  Cancelled: "red"
};

/**
 * Job-status badge shared by the MES work-order lists (jobs, master / bundle
 * work orders, pickup). "Ready" is shown as "Released".
 */
export function JobStatus({ status }: { status: string | null }) {
  if (!status) return null;
  const color = STATUS_COLORS[status] ?? "gray";
  return (
    <Status color={color}>{status === "Ready" ? "Released" : status}</Status>
  );
}
