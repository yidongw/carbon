import { Badge, HStack, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { EmployeeAvatar, Hyperlink, New, SupplierAvatar, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { ConfirmDelete } from "~/components/Modals";
import { useDateFormatter, usePermissions, useUrlParams } from "~/hooks";
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
    const { formatDateTime } = useDateFormatter();
    const [people] = usePeople();

    const columns = useMemo<ColumnDef<UnifiedProductionQuantityListItem>[]>(
      () => {
      return [
        {
          accessorKey: "jobOperationId",
          header: t`Operation`,
          cell: ({ row }) => (
            <Hyperlink to={row.original.id}>
              {row.original.jobOperation?.description ?? null}
            </Hyperlink>
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
            <span className="tabular-nums">
              {formatDateTime(row.original.createdAt)}
            </span>
          )
        }
      ];
      },
      [operations, people, scrapReasons, t, typeLabel, formatDateTime]
    );

    const permissions = usePermissions();

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

    const navigate = useNavigate();
    const [params] = useUrlParams();

    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    const renderContextMenu = useCallback<
      (row: UnifiedProductionQuantityListItem) => JSX.Element
    >(
      (row) => (
        <>
          <MenuItem
            disabled={!permissions.can("update", "production")}
            onClick={() => navigate(row.id)}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Quantity</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "production")}
            onClick={() => onDelete(row)}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Quantity</Trans>
          </MenuItem>
        </>
      ),

      [permissions]
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
              <New
                label={t`Production Quantity`}
                to={`new?${params.toString()}`}
              />
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Production Quantities`}
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
            text={t`Are you sure you want to delete this production quantity? This action cannot be undone.`}
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
