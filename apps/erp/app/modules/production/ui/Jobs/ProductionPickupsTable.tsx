import { MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { LuTrash } from "react-icons/lu";
import { useParams } from "react-router";
import { EmployeeAvatar, Hyperlink, New, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { ConfirmDelete } from "~/components/Modals";
import { useDateFormatter, usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";
import type { JobPickup } from "../../types";

type ProductionPickupsTableProps = {
  data: JobPickup[];
  count: number;
  operations: { id: string; description: string | null }[];
};

const ProductionPickupsTable = memo(
  ({ data, count, operations }: ProductionPickupsTableProps) => {
    const { jobId } = useParams();
    const { t } = useLingui();
    if (!jobId) throw new Error("Job ID is required");
    const { formatDateTime } = useDateFormatter();
    const permissions = usePermissions();

    const columns = useMemo<ColumnDef<JobPickup>[]>(() => {
      return [
        {
          accessorKey: "jobOperationId",
          header: t`Operation`,
          cell: ({ row }) =>
            row.original.jobOperation?.description ?? null,
          meta: {
            filter: {
              type: "static",
              options: operations.map((operation) => ({
                value: operation.id,
                label: <Enumerable value={operation.description} />
              }))
            }
          }
        },
        {
          id: "item",
          header: t`Item`,
          cell: ({ row }) =>
            row.original.jobOperation?.jobMakeMethod?.item
              ?.readableIdWithRevision
        },
        {
          accessorKey: "employeeId",
          header: t`Employee`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.employeeId} />
          )
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => row.original.quantity
        },
        {
          accessorKey: "notes",
          header: t`Notes`,
          cell: ({ row }) => (
            <span className="max-w-[200px] truncate block">
              {row.original.notes}
            </span>
          )
        },
        {
          accessorKey: "createdAt",
          header: t`Recorded At`,
          cell: ({ row }) => formatDateTime(row.original.createdAt)
        }
      ];
    }, [operations, t, formatDateTime]);

    const deleteModal = useDisclosure();
    const [selectedPickup, setSelectedPickup] = useState<JobPickup | null>(
      null
    );

    const onDelete = (data: JobPickup) => {
      setSelectedPickup(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedPickup(null);
      deleteModal.onClose();
    };

    const [params] = useUrlParams();

    const renderContextMenu = useCallback<(row: JobPickup) => JSX.Element>(
      (row) => (
        <>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "production")}
            onClick={() => onDelete(row)}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Pickup</Trans>
          </MenuItem>
        </>
      ),
      [permissions]
    );

    return (
      <>
        <Table<JobPickup>
          compact
          count={count}
          columns={columns}
          data={data}
          primaryAction={
            permissions.can("create", "production") && (
              <New label={t`Pickup`} to={`new?${params.toString()}`} />
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Pickups`}
        />
        {deleteModal.isOpen && selectedPickup && (
          <ConfirmDelete
            action={path.to.deleteJobPickup(selectedPickup.id)}
            isOpen
            name={t`pickup by ${selectedPickup.employeeId}`}
            text={t`Are you sure you want to delete this pickup? This action cannot be undone.`}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </>
    );
  }
);

ProductionPickupsTable.displayName = "ProductionPickupsTable";

export default ProductionPickupsTable;
