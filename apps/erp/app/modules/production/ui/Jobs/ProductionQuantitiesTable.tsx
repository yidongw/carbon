import { Badge, Button, HStack, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useParams, useRevalidator } from "react-router";
import { EmployeeAvatar, SupplierAvatar, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { ConfirmDelete } from "~/components/Modals";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { useProductionQuantityLineCreatedAtSave } from "~/modules/production/ui/useEditableCreatedAt";
import { EditableCreatedAtCell } from "~/modules/production/ui/EditableCreatedAtCell";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";
import type { ScrapReason } from "../../types";
import {
  PRODUCTION_QUANTITY_TYPES,
  useProductionQuantityTypeLabel
} from "./productionQuantityLabels";
import type { UnifiedProductionQuantityListItem } from "./unifiedQuantityFeeds";

type ProductionQuantitiesTableProps = {
  data: UnifiedProductionQuantityListItem[];
  count: number;
  operations: { id: string; description: string | null }[];
  scrapReasons: ScrapReason[];
};

const ProductionQuantitiesTable = memo(
  ({
    data,
    count,
    operations,
    scrapReasons
  }: ProductionQuantitiesTableProps) => {
    const { jobId } = useParams();
    const { t } = useLingui();
    const typeLabel = useProductionQuantityTypeLabel();
    if (!jobId) throw new Error("Job ID is required");
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();
    const permissions = usePermissions();
    const canUpdate = permissions.can("update", "production");
    const [people] = usePeople();
    const { saveCreatedAt, canEdit } = useProductionQuantityLineCreatedAtSave();

    const openEdit = useCallback(
      (quantityId: string) => {
        if (!canUpdate) return;
        openOverlay(overlay.to.editJobProductionQuantity({ jobId, quantityId }), {
          onSuccess: () => revalidator.revalidate()
        });
      },
      [canUpdate, jobId, openOverlay, revalidator]
    );

    const openNew = useCallback(() => {
      openOverlay(overlay.to.newJobProductionQuantity({ jobId }), {
        onCreated: () => revalidator.revalidate()
      });
    }, [jobId, openOverlay, revalidator]);

    const columns = useMemo<ColumnDef<UnifiedProductionQuantityListItem>[]>(
      () => {
      return [
        {
          accessorKey: "jobOperationId",
          header: t`Operation`,
          cell: ({ row }) =>
            canUpdate ? (
              <button
                type="button"
                className="text-left font-medium text-primary hover:underline"
                onClick={() => openEdit(row.original.id)}
              >
                {row.original.jobOperation?.description ?? null}
              </button>
            ) : (
              <span>{row.original.jobOperation?.description ?? null}</span>
            ),
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
          cell: ({ row }) => {
            return row.original.jobOperation?.jobMakeMethod?.item
              ?.readableIdWithRevision;
          }
        },
        {
          accessorKey: "createdBy",
          header: t`Name`,
          cell: ({ row }) => {
            const isSupplier = row.original.actorKind === "supplier";
            if (isSupplier) {
              const supplierId =
                row.original.actorKind === "supplier"
                  ? row.original.supplierProcess?.supplierId
                  : undefined;
              return (
                <HStack spacing={2} className="min-w-0 items-center">
                  <Badge variant="outline" className="shrink-0 text-xs font-normal">
                    <Trans>Supplier</Trans>
                  </Badge>
                  {supplierId ? (
                    <SupplierAvatar supplierId={supplierId} />
                  ) : null}
                </HStack>
              );
            }
            return (
              <HStack spacing={2} className="min-w-0 items-center">
                <Badge variant="outline" className="shrink-0 text-xs font-normal">
                  <Trans>Employee</Trans>
                </Badge>
                <EmployeeAvatar employeeId={row.original.createdBy} />
              </HStack>
            );
          },
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: <Enumerable value={employee.name} />
              }))
            }
          }
        },
        {
          accessorKey: "type",
          header: t`Type`,
          cell: ({ row }) => (
            <Badge
              variant={
                row.original.type === "Production"
                  ? "green"
                  : row.original.type === "Rework"
                    ? "orange"
                    : "red"
              }
            >
              {typeLabel(row.original.type)}
            </Badge>
          ),
          meta: {
            filter: {
              type: "static",
              options: PRODUCTION_QUANTITY_TYPES.map((type) => ({
                value: type,
                label: (
                  <Badge
                    variant={
                      type === "Production"
                        ? "green"
                        : type === "Rework"
                          ? "orange"
                          : "red"
                    }
                  >
                    {typeLabel(type)}
                  </Badge>
                )
              }))
            }
          }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => (
            <span className="tabular-nums">{row.original.quantity}</span>
          )
        },
        {
          accessorKey: "scrapReasonId",
          header: t`Scrap Reason`,
          cell: ({ row }) => {
            const scrapReason = scrapReasons.find(
              (reason) => reason.id === row.original.scrapReasonId
            );
            return <Enumerable value={scrapReason?.name ?? ""} />;
          },
          meta: {
            filter: {
              type: "static",
              options: scrapReasons?.map((reason) => ({
                value: reason.id,
                label: <Enumerable value={reason.name ?? ""} />
              }))
            }
          }
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
          header: t`Created At`,
          cell: ({ row }) => (
            <EditableCreatedAtCell
              createdAt={row.original.createdAt}
              row={row.original}
              onSave={saveCreatedAt}
              canEdit={canEdit}
              className="tabular-nums"
            />
          )
        }
      ];
      },
      [canEdit, canUpdate, openEdit, operations, people, saveCreatedAt, scrapReasons, t, typeLabel]
    );

    const deleteModal = useDisclosure();
    const [selectedEvent, setSelectedEvent] =
      useState<UnifiedProductionQuantityListItem | null>(null);

    const onDelete = (data: UnifiedProductionQuantityListItem) => {
      setSelectedEvent(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedEvent(null);
      deleteModal.onClose();
    };

    const renderContextMenu = useCallback<
      (row: UnifiedProductionQuantityListItem) => JSX.Element
    >(
      (row) => (
        <>
          <MenuItem
            disabled={!permissions.can("update", "production")}
            onClick={() => openEdit(row.id)}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Process Completion</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "production")}
            onClick={() => onDelete(row)}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Process Completion</Trans>
          </MenuItem>
        </>
      ),

      [openEdit, permissions]
    );

    return (
      <>
        <Table<UnifiedProductionQuantityListItem>
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
                <Trans>Process Completion</Trans>
              </Button>
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Process Completions`}
        />
        {deleteModal.isOpen && selectedEvent && (
          <ConfirmDelete
            action={path.to.deleteProductionQuantity(selectedEvent.id)}
            isOpen
            name={
              selectedEvent.actorKind === "supplier"
                ? t`${selectedEvent.jobOperation?.description ?? t`Operation`} (supplier)`
                : t`${selectedEvent.jobOperation?.description ?? t`Operation`} by ${
                    people.find((p) => p.id === selectedEvent.createdBy)?.name ??
                    t`Unknown Employee`
                  }`
            }
            text={t`Are you sure you want to delete this process completion? This action cannot be undone.`}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </>
    );
  }
);

ProductionQuantitiesTable.displayName = "ProductionQuantitiesTable";

export default ProductionQuantitiesTable;
