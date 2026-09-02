import {
  Badge,
  Button,
  HStack,
  MenuIcon,
  MenuItem,
  toast,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LuPencil, LuPlus, LuReceipt, LuTrash } from "react-icons/lu";
import {
  useFetcher,
  useParams,
  useRevalidator,
  useSearchParams
} from "react-router";
import { SupplierAvatar, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { ConfirmDelete } from "~/components/Modals";
import { overlay, useOverlay } from "~/components/Overlay";
import { useCurrencyFormatter, usePermissions } from "~/hooks";
import { EditableCreatedAtCell } from "~/modules/production/ui/EditableCreatedAtCell";
import { ProductionQuantityTableQuantityCell } from "~/modules/production/ui/ProductionQuantityTableCells";
import { useProductionQuantityLineCreatedAtSave } from "~/modules/production/ui/useEditableCreatedAt";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";
import type { ScrapReason } from "../../types";
import { useStyleProcessLabel } from "./jobLabels";
import { ProductionQuantityReportReporter } from "./ProductionQuantityReportReporter";
import {
  PRODUCTION_QUANTITY_TYPES,
  useProductionQuantityTypeLabel
} from "./productionQuantityLabels";
import {
  getUnifiedQuantityLineAmount,
  type UnifiedProductionQuantityListItem
} from "./unifiedQuantityFeeds";

type ProductionQuantitiesTableProps = {
  data: UnifiedProductionQuantityListItem[];
  count: number;
  operations: {
    id: string;
    description: string | null;
    isCutting?: boolean;
  }[];
  scrapReasons: ScrapReason[];
  // Override so the table can be reused outside the job route (e.g. a Bundle
  // Work Order's backing job). Falls back to the job route param.
  jobId?: string;
};

const ProductionQuantitiesTable = memo(
  ({
    data,
    count,
    operations,
    scrapReasons,
    jobId: jobIdProp
  }: ProductionQuantitiesTableProps) => {
    const params = useParams();
    const jobId = jobIdProp ?? params.jobId;
    const { t } = useLingui();
    const typeLabel = useProductionQuantityTypeLabel();
    const styleProcessLabel = useStyleProcessLabel();
    // Look up whether an operation is the (style-identified) cutting op, so the
    // list shows a translated "Cutting" label instead of the raw description.
    const isCuttingById = useMemo(() => {
      const map = new Map<string, boolean>();
      for (const op of operations) map.set(op.id, Boolean(op.isCutting));
      return map;
    }, [operations]);
    const operationLabel = useCallback(
      (id: string | null | undefined, description: string | null | undefined) =>
        styleProcessLabel(
          description,
          id ? (isCuttingById.get(id) ?? false) : false
        ),
      [styleProcessLabel, isCuttingById]
    );
    if (!jobId) throw new Error("Job ID is required");
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();
    const permissions = usePermissions();
    const canUpdate = permissions.can("update", "production");
    const canCreatePurchasing = permissions.can("create", "purchasing");
    const [people] = usePeople();
    const { saveCreatedAt, canEdit } = useProductionQuantityLineCreatedAtSave();
    const currencyFormatter = useCurrencyFormatter();

    // Turn a supplier completion report into an Outside Processing purchase
    // order (the backend is idempotent-ish: it back-links the report to the new
    // PO line so the action hides once created).
    const createPoFetcher = useFetcher<{ error?: string }>();
    const isCreatingPo = createPoFetcher.state !== "idle";
    const createPo = useCallback(
      (reportId: string) => {
        createPoFetcher.submit(
          {},
          {
            method: "post",
            action: path.to.api.supplierQuantityReportCreatePo(reportId)
          }
        );
      },
      [createPoFetcher]
    );

    useEffect(() => {
      if (createPoFetcher.state !== "idle" || !createPoFetcher.data) return;
      if (createPoFetcher.data.error) {
        toast.error(createPoFetcher.data.error);
        return;
      }
      toast.success(t`Purchase order created`);
      revalidator.revalidate();
    }, [createPoFetcher.state, createPoFetcher.data, revalidator, t]);

    const openEdit = useCallback(
      (quantityId: string) => {
        if (!canUpdate) return;
        openOverlay(
          overlay.to.editJobProductionQuantity({ jobId, quantityId }),
          {
            onSuccess: () => revalidator.revalidate()
          }
        );
      },
      [canUpdate, jobId, openOverlay, revalidator]
    );

    // When the list is filtered to a single operation, seed the new-completion
    // form with it (e.g. filtering to Assembly pre-selects Assembly).
    const [searchParams] = useSearchParams();
    const filteredOperationId = searchParams
      .getAll("filter")
      .find((f) => f.startsWith("jobOperationId:eq:"))
      ?.split(":")
      .slice(2)
      .join(":");

    const openNew = useCallback(() => {
      // Preset the operation from the active filter, or when there's only one
      // operation (e.g. a master work order's cutting), so the report opens with
      // it selected — otherwise the quantity + config trigger stay disabled
      // until an operation is picked.
      const presetOperationId =
        filteredOperationId ||
        (operations.length === 1 ? operations[0].id : undefined);
      openOverlay(
        overlay.to.newJobProductionQuantity({
          jobId,
          jobOperationId: presetOperationId
        }),
        {
          onCreated: () => revalidator.revalidate()
        }
      );
    }, [jobId, filteredOperationId, operations, openOverlay, revalidator]);

    const columns = useMemo<
      ColumnDef<UnifiedProductionQuantityListItem>[]
    >(() => {
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
                {operationLabel(
                  row.original.jobOperationId,
                  row.original.jobOperation?.description
                )}
              </button>
            ) : (
              <span>
                {operationLabel(
                  row.original.jobOperationId,
                  row.original.jobOperation?.description
                )}
              </span>
            ),
          meta: {
            filter: {
              type: "static",
              options: operations.map((operation) => ({
                value: operation.id,
                label: (
                  <Enumerable
                    value={operationLabel(operation.id, operation.description)}
                  />
                )
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
          // Display column keyed by id so the Table filters on "employeeId"
          // (falls back to column.id). Left non-sortable on purpose: the
          // supplier feed has no employeeId column and would 400 on .order().
          id: "employeeId",
          header: t`Employee`,
          cell: ({ row }) => {
            if (row.original.actorKind === "supplier") {
              const supplierId = row.original.supplierProcess?.supplierId;
              return (
                <HStack spacing={2} className="min-w-0 items-center">
                  <Badge
                    variant="outline"
                    className="shrink-0 text-xs font-normal"
                  >
                    <Trans>Supplier</Trans>
                  </Badge>
                  {supplierId ? (
                    <SupplierAvatar supplierId={supplierId} />
                  ) : null}
                </HStack>
              );
            }
            return (
              <ProductionQuantityReportReporter
                employeeId={row.original.employeeId}
                createdBy={row.original.createdBy}
              />
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
            <ProductionQuantityTableQuantityCell
              row={row.original}
              reportKind="productionQuantity"
            />
          )
        },
        {
          id: "amount",
          header: t`Amount`,
          cell: ({ row }) => {
            const amount = getUnifiedQuantityLineAmount(row.original);
            return amount == null ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              <span className="tabular-nums">
                {currencyFormatter.format(amount)}
              </span>
            );
          }
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
          header: t`Reported`,
          cell: ({ row }) => (
            <EditableCreatedAtCell
              createdAt={
                row.original.actorKind === "employee"
                  ? (row.original.productionQuantityReport?.createdAt ??
                    row.original.createdAt)
                  : row.original.createdAt
              }
              row={row.original}
              onSave={saveCreatedAt}
              canEdit={canEdit}
              className="tabular-nums"
            />
          )
        }
      ];
    }, [
      canEdit,
      canUpdate,
      currencyFormatter,
      openEdit,
      operationLabel,
      operations,
      people,
      saveCreatedAt,
      scrapReasons,
      t,
      typeLabel
    ]);

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
      (row) => {
        // Offer PO creation once per supplier report, anchored on its
        // Production line, and only until a PO has been created for it.
        const supplierReportId =
          row.actorKind === "supplier" &&
          row.type === "Production" &&
          !row.report?.purchaseOrderLineId &&
          canCreatePurchasing
            ? row.reportId
            : null;

        return (
          <>
            {supplierReportId ? (
              <MenuItem
                disabled={isCreatingPo}
                onClick={() => createPo(supplierReportId)}
              >
                <MenuIcon icon={<LuReceipt />} />
                <Trans>Create PO</Trans>
              </MenuItem>
            ) : null}
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
        );
      },

      [openEdit, permissions, canCreatePurchasing, createPo, isCreatingPo]
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
                ? t`${operationLabel(selectedEvent.jobOperationId, selectedEvent.jobOperation?.description) || t`Operation`} (supplier)`
                : t`${operationLabel(selectedEvent.jobOperationId, selectedEvent.jobOperation?.description) || t`Operation`} by ${
                    people.find((p) => p.id === selectedEvent.employeeId)
                      ?.name ?? t`Unknown Employee`
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
