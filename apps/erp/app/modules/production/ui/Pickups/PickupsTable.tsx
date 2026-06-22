import { IconButton, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { LuCalendar, LuHash, LuPlus, LuUser } from "react-icons/lu";
import { New, Table } from "~/components";
import { ProductionQuantityReportReporter } from "~/modules/production/ui/Jobs/ProductionQuantityReportReporter";
import {
  formatDateTime,
  getItemName,
  getItemReadableIdWithRevision,
  getJobReadableId,
  getProcessName
} from "~/modules/production/productionQuantityDisplay.utils";
import { path } from "~/utils/path";

type JobOperationPickup = {
  id: string;
  jobOperationId: string;
  employeeId: string;
  createdBy?: string | null;
  quantity: number;
  notes?: string | null;
  createdAt: string;
  jobOperation?: {
    description?: string | null;
    jobId?: string | null;
    process?: { name?: string | null } | null;
    job?: {
      jobId?: string | null;
      item?: {
        readableIdWithRevision?: string | null;
        name?: string | null;
      } | null;
    } | null;
  } | null;
};

type PickupsTableProps = {
  data: JobOperationPickup[];
  count: number;
};

export function PickupsTable({ data, count }: PickupsTableProps) {
  const { t } = useLingui();

  const columns = useMemo<ColumnDef<JobOperationPickup>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: t`Employee`,
        cell: ({ row }) => (
          <ProductionQuantityReportReporter
            employeeId={row.original.employeeId}
            createdBy={row.original.createdBy}
          />
        ),
        meta: { icon: <LuUser /> }
      },
      {
        id: "job",
        header: t`Job`,
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">
            {getJobReadableId(row.original)}
          </span>
        )
      },
      {
        id: "item",
        header: t`Item`,
        cell: ({ row }) => (
          <VStack spacing={0}>
            <span className="text-sm font-medium">
              {getItemReadableIdWithRevision(row.original)}
            </span>
            <div className="w-full truncate text-muted-foreground text-xs">
              {getItemName(row.original) || "—"}
            </div>
          </VStack>
        ),
        meta: { icon: <AiOutlinePartition /> }
      },
      {
        id: "operation",
        header: t`Operation`,
        cell: ({ row }) => (
          <div className="text-sm">{getProcessName(row.original) ?? "—"}</div>
        )
      },
      {
        accessorKey: "quantity",
        header: t`Qty`,
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.quantity}</span>
        ),
        meta: {
          icon: <LuHash />,
          renderTotal: true
        }
      },
      {
        accessorKey: "notes",
        header: t`Notes`,
        cell: ({ row }) => row.original.notes ?? "—"
      },
      {
        accessorKey: "createdAt",
        header: t`Submitted`,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
        meta: { icon: <LuCalendar /> }
      }
    ],
    [t]
  );

  return (
    <Table
      count={count}
      columns={columns}
      data={data}
      table="jobOperationPickup"
      withSearch
      withPagination
      title={t`Pickups`}
      primaryAction={
        <New
          label={<Trans>New Pickup</Trans>}
          to={path.to.newPickup}
          icon={<IconButton icon={<LuPlus />} label="New" />}
        />
      }
    />
  );
}
