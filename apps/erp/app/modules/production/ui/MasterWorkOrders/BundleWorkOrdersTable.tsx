import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import {
  LuCirclePlay,
  LuHash,
  LuPackageOpen,
  LuPalette,
  LuRuler,
  LuShirt
} from "react-icons/lu";
import { Hyperlink, Table } from "~/components";
import type { BundleWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";
import { jobStatus } from "../../production.models";
import JobStatus from "../Jobs/JobStatus";

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
          cell: ({ row }) => (
            <Hyperlink to={path.to.bundleWorkOrder(row.original.id!)}>
              {row.original.bundleNumber}
            </Hyperlink>
          ),
          meta: { icon: <LuPackageOpen /> }
        },
        {
          accessorKey: "itemName",
          header: t`Style`,
          cell: ({ row }) =>
            row.original.readableIdWithRevision ?? row.original.itemName,
          meta: { icon: <LuShirt /> }
        },
        {
          accessorKey: "colorCode",
          header: t`Color`,
          cell: ({ row }) => row.original.colorCode ?? "—",
          meta: { icon: <LuPalette /> }
        },
        {
          accessorKey: "sizeCode",
          header: t`Size`,
          cell: ({ row }) => row.original.sizeCode ?? "—",
          meta: { icon: <LuRuler /> }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => row.original.quantity,
          meta: { icon: <LuHash /> }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: ({ row }) => (
            <JobStatus
              status={row.original.status as (typeof jobStatus)[number]}
            />
          ),
          meta: {
            icon: <LuCirclePlay />,
            filter: {
              type: "static",
              options: jobStatus.map((status) => ({
                label: <JobStatus status={status} />,
                value: status
              }))
            }
          }
        }
      ];
    }, [t]);

    return (
      <Table<(typeof rows)[number]>
        data={data}
        columns={columns}
        count={count}
        defaultColumnPinning={{ left: ["bundleNumber"] }}
        getRowHref={(row) =>
          row.id ? path.to.bundleWorkOrder(row.id) : undefined
        }
        title={t`Bundle Work Orders`}
        table="bundleWorkOrder"
        withSavedView
        withSelectableRows
      />
    );
  }
);

BundleWorkOrdersTable.displayName = "BundleWorkOrdersTable";
export default BundleWorkOrdersTable;
