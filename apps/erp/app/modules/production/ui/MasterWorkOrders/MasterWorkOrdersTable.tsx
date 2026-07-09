import { Button } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuCirclePlus } from "react-icons/lu";
import { useRevalidator } from "react-router";
import { Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import type { MasterWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";

type MasterWorkOrdersTableProps = {
  data: MasterWorkOrder[];
  count: number;
};

const MasterWorkOrdersTable = memo(
  ({ data, count }: MasterWorkOrdersTableProps) => {
    const { t } = useLingui();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNew = useCallback(() => {
      openOverlay(overlay.to.newMasterWorkOrder(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const rows = useMemo(() => data, [data]);

    const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
      return [
        {
          accessorKey: "readableIdWithRevision",
          header: t`Style`,
          cell: ({ row }) =>
            row.original.readableIdWithRevision ?? row.original.itemName
        },
        {
          accessorKey: "itemName",
          header: t`Name`,
          cell: ({ row }) => row.original.itemName
        },
        {
          accessorKey: "jobReadableId",
          header: t`Job`,
          cell: ({ row }) => row.original.jobReadableId
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
          row.id ? path.to.masterWorkOrder(row.id) : undefined
        }
        primaryAction={
          permissions.can("create", "production") && (
            <Button
              type="button"
              variant="primary"
              leftIcon={<LuCirclePlus />}
              onClick={openNew}
            >
              <Trans>New Master Work Order</Trans>
            </Button>
          )
        }
        title={t`Master Work Orders`}
      />
    );
  }
);

MasterWorkOrdersTable.displayName = "MasterWorkOrdersTable";
export default MasterWorkOrdersTable;
