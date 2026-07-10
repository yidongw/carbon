import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { Table } from "~/components";
import type { BundleWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";

type BundleWorkOrdersTableProps = {
  data: BundleWorkOrder[];
  count: number;
};

const BundleWorkOrdersTable = memo(
  ({ data, count }: BundleWorkOrdersTableProps) => {
    const { t } = useLingui();

    const rows = useMemo(() => data, [data]);

    const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
      return [
        {
          accessorKey: "bundleNumber",
          header: t`Bundle`,
          cell: ({ row }) => row.original.bundleNumber
        },
        {
          accessorKey: "itemName",
          header: t`Style`,
          cell: ({ row }) =>
            row.original.readableIdWithRevision ?? row.original.itemName
        },
        {
          accessorKey: "colorCode",
          header: t`Color`,
          cell: ({ row }) => row.original.colorCode ?? "—"
        },
        {
          accessorKey: "sizeCode",
          header: t`Size`,
          cell: ({ row }) => row.original.sizeCode ?? "—"
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => row.original.quantity
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: ({ row }) => row.original.status
        }
      ];
    }, [t]);

    return (
      <Table<(typeof rows)[number]>
        data={data}
        columns={columns}
        count={count}
        getRowHref={(row) =>
          row.id ? path.to.bundleWorkOrder(row.id) : undefined
        }
        title={t`Bundle Work Orders`}
      />
    );
  }
);

BundleWorkOrdersTable.displayName = "BundleWorkOrdersTable";
export default BundleWorkOrdersTable;
