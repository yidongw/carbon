import { Button, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";
import { useParams, useRevalidator } from "react-router";
import { EmployeeAvatar, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { ConfirmDelete } from "~/components/Modals";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { usePickupCreatedAtSave } from "~/modules/production/ui/useEditableCreatedAt";
import { EditableCreatedAtCell } from "~/modules/production/ui/EditableCreatedAtCell";
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
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();
    const { saveCreatedAt, canEdit } = usePickupCreatedAtSave();

    const openNew = useCallback(() => {
      openOverlay(overlay.to.newJobPickup({ jobId }), {
        onCreated: () => revalidator.revalidate()
      });
    }, [jobId, openOverlay, revalidator]);

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
          cell: ({ row }) => (
            <EditableCreatedAtCell
              createdAt={row.original.createdAt}
              row={row.original}
              onSave={saveCreatedAt}
              canEdit={canEdit}
            />
          )
        }
      ];
    }, [canEdit, operations, saveCreatedAt, t]);

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

    const renderContextMenu = useCallback<(row: JobPickup) => JSX.Element>(
      (row) => (
        <>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "production")}
            onClick={() => onDelete(row)}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Process Pickup</Trans>
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
              <Button
                type="button"
                variant="primary"
                leftIcon={<LuPlus />}
                onClick={openNew}
              >
                <Trans>Process Pickup</Trans>
              </Button>
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Process Pickups`}
        />
        {deleteModal.isOpen && selectedPickup && (
          <ConfirmDelete
            action={path.to.deleteJobPickup(selectedPickup.id)}
            isOpen
            name={t`Process Pickup by ${selectedPickup.employeeId}`}
            text={t`Are you sure you want to delete this process pickup? This action cannot be undone.`}
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
