import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { Hyperlink, Table } from "~/components";
import { useOperationTypeLabel } from "~/modules/production/ui/Jobs/productionQuantityLabels";
import { operationTypes } from "~/modules/shared";
import { useParts, useTools } from "~/stores";
import type { MethodOperation } from "../../types";
import { getPathToMakeMethod } from "./utils";

type MethodOperationsTableProps = {
  data: MethodOperation[];
  count: number;
};

const MethodOperationsTable = memo(
  ({ data, count }: MethodOperationsTableProps) => {
    const { t } = useLingui();
    const operationTypeLabel = useOperationTypeLabel();
    const parts = useParts();
    const tools = useTools();

    const items = useMemo(() => [...parts, ...tools], [parts, tools]);

    const columns = useMemo<ColumnDef<MethodOperation>[]>(() => {
      return [
        {
          accessorKey: "description",
          header: t`Description`,
          cell: ({ row }) => (
            <Hyperlink
              to={getPathToMakeMethod(
                // @ts-ignore
                row.original.makeMethod?.item?.type,
                // @ts-ignore
                row.original.makeMethod?.item?.id,
                // @ts-ignore
                row.original.makeMethod?.id
              )}
              className="max-w-[260px] truncate"
            >
              {row.original.description}
            </Hyperlink>
          )
        },
        {
          accessorKey: "makeMethod.item.readableIdWithRevision",
          header: t`Item ID`,
          cell: ({ row }) => {
            // @ts-ignore
            return row.original.makeMethod?.item?.readableIdWithRevision;
          },
          meta: {
            filter: {
              type: "static",
              options: items?.map((item) => ({
                value: item.readableIdWithRevision,
                label: item.readableIdWithRevision
              }))
            }
          }
        },
        {
          accessorKey: "operationType",
          header: t`Operation Type`,
          cell: (item) =>
            operationTypeLabel(item.getValue<string>() ?? ""),
          meta: {
            filter: {
              type: "static",
              options: operationTypes.map((value) => ({
                value,
                label: operationTypeLabel(value)
              }))
            }
          }
        },
        {
          accessorKey: "setupTime",
          header: t`Setup Time`,
          cell: ({ row }) => {
            return `${row.original.setupTime} ${row.original.setupUnit}`;
          }
        },
        {
          accessorKey: "laborTime",
          header: t`Labor Time`,
          cell: ({ row }) => {
            return `${row.original.laborTime} ${row.original.laborUnit}`;
          }
        },
        {
          accessorKey: "machineTime",
          header: t`Machine Time`,
          cell: ({ row }) => {
            return `${row.original.machineTime} ${row.original.machineUnit}`;
          }
        }
      ];
    }, [items, operationTypeLabel, t]);

    return (
      <Table<MethodOperation>
        count={count}
        columns={columns}
        data={data}
        title={t`Method Operations`}
      />
    );
  }
);

MethodOperationsTable.displayName = "MethodOperationsTable";

export default MethodOperationsTable;
