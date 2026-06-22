type JobOperationItem = {
  id?: string | null;
  readableIdWithRevision?: string | null;
  name?: string | null;
};

type JobOperationJob = {
  id?: string | null;
  jobId?: string | null;
  item?: JobOperationItem | JobOperationItem[] | null;
};

type JobOperationProcess = {
  name?: string | null;
};

type JobOperationNested = {
  description?: string | null;
  insideUnitCost?: number | null;
  jobId?: string | null;
  job?: JobOperationJob | JobOperationJob[] | null;
  process?: JobOperationProcess | JobOperationProcess[] | null;
};

export type ProductionQuantityJobOperationRow = {
  id: string;
  quantity: number | null;
  createdAt: string | null;
  jobOperation?: JobOperationNested | JobOperationNested[] | null;
};

type JobOperationRow = {
  jobOperation?: JobOperationNested | JobOperationNested[] | null;
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

export function getEarned(row: ProductionQuantityJobOperationRow): number {
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

export function getJobInternalId(row: {
  jobId?: string | null;
  jobOperation?: JobOperationNested | JobOperationNested[] | null;
}): string | null {
  if (row.jobId?.trim()) return row.jobId.trim();
  const jo = getJobOperation(row);
  if (jo && "jobId" in jo && typeof jo.jobId === "string" && jo.jobId.trim()) {
    return jo.jobId.trim();
  }
  const job = getJob(row);
  return job?.id?.trim() || null;
}

export function getItemInternalId(row: {
  itemId?: string | null;
  jobOperation?: JobOperationNested | JobOperationNested[] | null;
}): string | null {
  if (row.itemId?.trim()) return row.itemId.trim();
  const item = getItem(row);
  return item?.id?.trim() || null;
}

export function hasConfigurationTable(configuration: unknown): boolean {
  if (
    configuration === null ||
    configuration === undefined ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return false;
  }
  const configTable = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(configTable) && configTable.length > 0;
}
