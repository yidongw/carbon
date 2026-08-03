import { Badge, HStack, useMode, VStack } from "@carbon/react";
import { getColorByValue } from "@carbon/utils";
import { useLingui } from "@lingui/react/macro";
import { useNumberFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { LuMoveDown, LuMoveUp, LuPackage, LuSigma } from "react-icons/lu";
import { Link } from "react-router";
import { Hyperlink, ItemThumbnail, Table } from "~/components";
import type { StockOverviewChip, StockOverviewItem } from "~/modules/inventory";
import { path } from "~/utils/path";
import { translateSeedDisplayName } from "~/utils/seedDataDisplayName";

type StockOverviewTableProps = {
  data: StockOverviewItem[];
  count: number;
};

const StockOverviewTable = memo(
  ({ data, count }: StockOverviewTableProps) => {
    const { t, i18n } = useLingui();
    const mode = useMode();
    const numberFormatter = useNumberFormatter();
    const format = numberFormatter.format.bind(numberFormatter);

    const columns = useMemo<ColumnDef<StockOverviewItem>[]>(() => {
      // A quantity cell: the total, plus one chip per warehouse with a non-zero
      // value for the field. Location names go through the seed-name translator
      // (e.g. Headquarters -> 总部). "To Send" chips read "from <wh>", "To
      // Receive" chips read "to <wh>" to make the direction explicit.
      const chipCell = (
        total: number,
        chips: StockOverviewChip[],
        direction?: "from" | "to"
      ) => (
        <VStack spacing={1} className="items-end py-1">
          <span className="font-medium tabular-nums">{format(total)}</span>
          {chips.length > 0 && (
            <HStack className="gap-1 flex-wrap justify-end">
              {chips.map((c) => {
                const loc = translateSeedDisplayName(c.locationName, i18n);
                const label =
                  direction === "from"
                    ? t`from ${loc}`
                    : direction === "to"
                      ? t`to ${loc}`
                      : loc;
                // Color by the raw location name so each warehouse matches its
                // chip on the Locations page (Enumerable styling).
                const style = getColorByValue(c.locationName, mode);
                return (
                  <Link key={c.id} to={c.href} className="inline-flex">
                    <Badge
                      className="cursor-pointer transition-opacity hover:opacity-80"
                      style={{ ...style, borderColor: `${style.color}33` }}
                    >
                      {label}: {format(c.quantity)}
                    </Badge>
                  </Link>
                );
              })}
            </HStack>
          )}
        </VStack>
      );

      return [
        {
          accessorKey: "readableIdWithRevision",
          header: t`Item ID`,
          cell: ({ row }) => (
            <HStack className="py-1">
              <ItemThumbnail
                size="sm"
                thumbnailPath={row.original.thumbnailPath}
                // @ts-expect-error type is a loose string here
                type={row.original.type}
              />
              <Hyperlink to={path.to.inventoryItem(row.original.itemId)}>
                <VStack spacing={0}>
                  {row.original.readableIdWithRevision}
                  <div className="w-full truncate text-muted-foreground text-xs">
                    {row.original.name}
                  </div>
                </VStack>
              </Hyperlink>
            </HStack>
          ),
          meta: { icon: <LuPackage /> }
        },
        {
          accessorKey: "onHand",
          header: t`On Hand`,
          cell: ({ row }) =>
            chipCell(row.original.onHand, row.original.onHandChips),
          meta: { icon: <LuPackage /> }
        },
        {
          accessorKey: "toSend",
          header: t`To Send`,
          cell: ({ row }) =>
            chipCell(row.original.toSend, row.original.toSendChips, "from"),
          meta: { icon: <LuMoveUp className="text-red-500" /> }
        },
        {
          accessorKey: "toReceive",
          header: t`To Receive`,
          cell: ({ row }) =>
            chipCell(row.original.toReceive, row.original.toReceiveChips, "to"),
          meta: { icon: <LuMoveDown className="text-emerald-500" /> }
        },
        {
          accessorKey: "total",
          header: t`Total`,
          cell: ({ row }) => (
            <span className="font-medium tabular-nums">
              {format(row.original.total)}
            </span>
          ),
          meta: { icon: <LuSigma /> }
        }
      ];
    }, [t, i18n, format, mode]);

    return (
      <Table<StockOverviewItem>
        data={data}
        columns={columns}
        count={count}
        defaultColumnPinning={{ left: ["readableIdWithRevision"] }}
        title={t`Stock Overview`}
        table="stockOverview"
      />
    );
  },
  (prev, next) => prev.data === next.data && prev.count === next.count
);

StockOverviewTable.displayName = "StockOverviewTable";

export default StockOverviewTable;
