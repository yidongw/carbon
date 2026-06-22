import { IconButton } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import { LuCalendar, LuHash, LuPlus, LuUser } from "react-icons/lu";
import { New, Table } from "~/components";
import { formatDateTime, getProcessName } from "~/modules/production/productionQuantityDisplay.utils";
import { ProductionQuantityReportReporter } from "~/modules/production/ui/Jobs/ProductionQuantityReportReporter";
import {
  ProductionQuantityTableItemCell,
  ProductionQuantityTableJobCell,
  ProductionQuantityTableQuantityCell,
  type ProductionQuantityTableRowLike
} from "~/modules/production/ui/ProductionQuantityTableCells";
import { path } from "~/utils/path";

type JobOperationPickup = ProductionQuantityTableRowLike & {
  id: string;
  jobOperationId: string;
  employeeId: string;
  createdBy?: string | null;
  quantity: number;
  notes?: string | null;
  createdAt: string;
};

type PickupsTableProps = {
  data: JobOperationPickup[];
  count: number;
  configurableItemIds?: string[];
};

export function PickupsTable({
  data,
  count,
  configurableItemIds = []
}: PickupsTableProps) {
  const { t } = useLingui();
  const configurableItemIdSet = useMemo(
    () => new Set(configurableItemIds),
    [configurableItemIds]
  );

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
        cell: ({ row }) => <ProductionQuantityTableJobCell row={row.original} />
      },
      {
        id: "item",
        header: t`Item`,
        cell: ({ row }) => <ProductionQuantityTableItemCell row={row.original} />,
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
          <ProductionQuantityTableQuantityCell
            row={row.original}
            configurableItemIds={configurableItemIdSet}
          />
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
    [configurableItemIdSet, t]
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
