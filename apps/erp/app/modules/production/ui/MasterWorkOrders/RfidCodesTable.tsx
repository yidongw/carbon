import { useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, type ReactNode, useMemo } from "react";
import { LuClock, LuHash, LuLink, LuTag } from "react-icons/lu";
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
          header: t`系统编码`,
          cell: ({ row }) => (
            <span className="font-mono">{row.original.code}</span>
          ),
          meta: { icon: <LuTag /> }
        },
        {
          accessorKey: "externalCode",
          header: t`水洗唛芯片`,
          cell: ({ row }) =>
            row.original.externalCode ? (
              <span className="font-mono">{row.original.externalCode}</span>
            ) : (
              "—"
            ),
          meta: { icon: <LuLink /> }
        },
        {
          accessorKey: "boundAt",
          header: t`绑定时间`,
          cell: ({ row }) =>
            row.original.boundAt
              ? dateFormatter.format(new Date(row.original.boundAt))
              : "—",
          meta: { icon: <LuClock /> }
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
