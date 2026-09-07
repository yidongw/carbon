import { Badge } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, type ReactNode, useMemo } from "react";
import { LuArrowDownUp, LuClock, LuHash, LuTag } from "react-icons/lu";
import { Table } from "~/components";
import type { BundleInventoryMovement } from "~/modules/production";

type BundleInventoryMovementsTableProps = {
  data: BundleInventoryMovement[];
  count: number;
  primaryAction?: ReactNode;
};

const BundleInventoryMovementsTable = memo(
  ({ data, count, primaryAction }: BundleInventoryMovementsTableProps) => {
    const { t } = useLingui();
    const dateFormatter = useDateFormatter({
      dateStyle: "medium",
      timeStyle: "short"
    });

    const columns = useMemo<ColumnDef<BundleInventoryMovement>[]>(
      () => [
        {
          accessorKey: "direction",
          header: t`Direction`,
          cell: ({ row }) =>
            row.original.direction === "In" ? (
              <Badge variant="green">{t`In`}</Badge>
            ) : (
              <Badge variant="yellow">{t`Out`}</Badge>
            ),
          meta: { icon: <LuArrowDownUp /> }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => (
            <span className="tabular-nums">{row.original.quantity}</span>
          ),
          meta: { icon: <LuHash /> }
        },
        {
          accessorKey: "scannedCode",
          header: t`Scanned Code`,
          cell: ({ row }) => (
            <span className="font-mono">{row.original.scannedCode}</span>
          ),
          meta: { icon: <LuTag /> }
        },
        {
          accessorKey: "createdAt",
          header: t`Recorded At`,
          cell: ({ row }) =>
            row.original.createdAt
              ? dateFormatter.format(new Date(row.original.createdAt))
              : "—",
          meta: { icon: <LuClock /> }
        }
      ],
      [t, dateFormatter]
    );

    return (
      <Table<BundleInventoryMovement>
        data={data}
        columns={columns}
        count={count}
        primaryAction={primaryAction}
        title={t`Inventory Movements`}
      />
    );
  }
);

BundleInventoryMovementsTable.displayName = "BundleInventoryMovementsTable";
export default BundleInventoryMovementsTable;
