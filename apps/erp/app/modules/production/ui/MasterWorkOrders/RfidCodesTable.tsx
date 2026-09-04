import { useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, type ReactNode, useMemo } from "react";
import { LuClock, LuHash, LuTag } from "react-icons/lu";
import { Table } from "~/components";
import type { GarmentRfidCode } from "~/modules/production";

type RfidCodesTableProps = {
  data: GarmentRfidCode[];
  count: number;
  primaryAction?: ReactNode;
};

const RfidCodesTable = memo(
  ({ data, count, primaryAction }: RfidCodesTableProps) => {
    const { t } = useLingui();
    const dateFormatter = useDateFormatter({
      dateStyle: "medium",
      timeStyle: "short"
    });

    const columns = useMemo<ColumnDef<GarmentRfidCode>[]>(
      () => [
        {
          accessorKey: "sequence",
          header: t`Piece`,
          cell: ({ row }) => (
            <span className="tabular-nums">{row.original.sequence}</span>
          ),
          meta: { icon: <LuHash /> }
        },
        {
          accessorKey: "code",
          header: t`RFID Code`,
          cell: ({ row }) => (
            <span className="font-mono">{row.original.code}</span>
          ),
          meta: { icon: <LuTag /> }
        },
        {
          accessorKey: "createdAt",
          header: t`Generated At`,
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
      <Table<GarmentRfidCode>
        data={data}
        columns={columns}
        count={count}
        primaryAction={primaryAction}
        title={t`RFID Codes`}
      />
    );
  }
);

RfidCodesTable.displayName = "RfidCodesTable";
export default RfidCodesTable;
