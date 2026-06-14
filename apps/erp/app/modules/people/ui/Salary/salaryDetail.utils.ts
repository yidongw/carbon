export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

type JobOperationItem = {
  readableIdWithRevision?: string | null;
  name?: string | null;
};

type JobOperationJob = {
  jobId?: string | null;
  item?: JobOperationItem | JobOperationItem[] | null;
};

type JobOperationProcess = {
  name?: string | null;
};

type JobOperationNested = {
  description?: string | null;
  insideUnitCost?: number | null;
  job?: JobOperationJob | JobOperationJob[] | null;
  process?: JobOperationProcess | JobOperationProcess[] | null;
};

export type SalaryCompletionRow = {
  id: string;
  quantity: number | null;
  createdAt: string | null;
  jobOperation?: JobOperationNested | JobOperationNested[] | null;
};

type EmployeeNameParts = {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export function formatDateTime(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/** Builds a display name from name parts, returning a fallback when empty. */
export function getEmployeeName(
  parts: EmployeeNameParts | null | undefined,
  fallback = "—"
) {
  if (!parts) return fallback;
  const full = parts.fullName?.trim();
  if (full) return full;
  const combined = `${parts.firstName ?? ""} ${parts.lastName ?? ""}`.trim();
  return combined || fallback;
}

export type SalaryPaymentStatus = "Unpaid" | "Partially Paid" | "Paid";

/** Payment status derived from totals (ignores legacy Draft/Approved values). */
export function getSalaryPaymentStatus(
  totalEarned: number | null | undefined,
  totalPaid: number | null | undefined
): SalaryPaymentStatus {
  const earned = totalEarned ?? 0;
  const paid = totalPaid ?? 0;

  if (paid > 0 && earned > 0 && paid >= earned) return "Paid";
  if (paid > 0) return "Partially Paid";
  return "Unpaid";
}

export function statusVariant(status: string | null | undefined) {
  switch (status) {
    case "Paid":
      return "green";
    case "Partially Paid":
      return "yellow";
    case "Unpaid":
    default:
      return "secondary";
  }
}

type JobOperationRow = {
  jobOperation?: JobOperationNested | JobOperationNested[] | null;
};

function getJobOperation(row: JobOperationRow): JobOperationNested | null {
  if (!row.jobOperation) return null;
  return Array.isArray(row.jobOperation)
    ? (row.jobOperation[0] ?? null)
    : row.jobOperation;
}

export function getJobReadableId(row: JobOperationRow) {
  const jo = getJobOperation(row);
  if (!jo) return "—";
  const job = Array.isArray(jo.job) ? jo.job[0] : jo.job;
  return job?.jobId ?? "—";
}

export function getProcessName(row: JobOperationRow) {
  const jo = getJobOperation(row);
  if (!jo) return null;
  const process = Array.isArray(jo.process) ? jo.process[0] : jo.process;
  return process?.name ?? null;
}

export function getUnitCost(row: JobOperationRow): number {
  return getJobOperation(row)?.insideUnitCost ?? 0;
}

export function getEarned(row: SalaryCompletionRow): number {
  return (row.quantity ?? 0) * getUnitCost(row);
}

export function getJobOperationDescription(row: JobOperationRow) {
  return getJobOperation(row)?.description ?? undefined;
}

function getJob(row: JobOperationRow) {
  const jo = getJobOperation(row);
  if (!jo) return null;
  return Array.isArray(jo.job) ? jo.job[0] : jo.job;
}

function getItem(row: JobOperationRow) {
  const job = getJob(row);
  if (!job) return null;
  return Array.isArray(job.item) ? job.item[0] : job.item;
}

export function getItemReadableIdWithRevision(row: JobOperationRow) {
  return getItem(row)?.readableIdWithRevision ?? "—";
}

export function getItemName(row: JobOperationRow) {
  return getItem(row)?.name ?? "";
}
