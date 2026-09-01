import {
  Badge,
  Button,
  cn,
  HStack,
  IconButton,
  Status,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import { memo, useCallback, useMemo } from "react";
import {
  LuBookMarked,
  LuCalendar,
  LuCircleCheckBig,
  LuCircleDashed,
  LuCirclePlay,
  LuCirclePlus,
  LuClipboardList,
  LuClock,
  LuHash,
  LuMapPin,
  LuPackageOpen,
  LuScissors,
  LuShirt,
  LuSquareUser,
  LuTable,
  LuTag,
  LuUser
} from "react-icons/lu";
import { useRevalidator } from "react-router";
import {
  Assignee,
  CustomerAvatar,
  Hyperlink,
  ItemThumbnail,
  Table
} from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useLocations } from "~/components/Form/Location";
import { editableCell } from "~/components/InlineEditor";
import { overlay, useOverlay } from "~/components/Overlay";
import { useDateFormatter, usePermissions } from "~/hooks";
import type {
  MasterCuttingProgress,
  MasterWorkOrder
} from "~/modules/production";
import { deriveCuttingStatus } from "~/modules/production/cuttingStatus";
import { useCustomers, usePeople } from "~/stores";
import { path } from "~/utils/path";
import { deadlineTypes, isJobLocked, jobStatus } from "../../production.models";
import type { Job } from "../../types";
import { getDeadlineIcon } from "../Jobs/Deadline";
import JobStatus from "../Jobs/JobStatus";
import JobStatusMenu from "../Jobs/JobStatusMenu";
import { useDeadlineTypeLabel } from "../Jobs/jobLabels";

// Master work orders are backed by a job; inline edits target that job via
// `idAccessor: (r) => r.jobId` on the shared job bulk-update action.
const JOB_UPDATE = {
  action: path.to.bulkUpdateJob,
  idKey: "ids" as const
};

type MasterWorkOrdersTableProps = {
  data: MasterWorkOrder[];
  count: number;
  itemIdsWithConfigurationParameters: string[];
  bundleCountByMasterId: Record<string, number>;
  processCountByMasterId: Record<string, number>;
  cuttingProgressByMasterId: Record<string, MasterCuttingProgress>;
};

const MasterWorkOrdersTable = memo(
  ({
    data,
    count,
    itemIdsWithConfigurationParameters,
    bundleCountByMasterId,
    processCountByMasterId,
    cuttingProgressByMasterId
  }: MasterWorkOrdersTableProps) => {
    const { t } = useLingui();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();
    const { revalidate } = revalidator;
    const { formatDate } = useDateFormatter();
    const getDeadlineTypeLabel = useDeadlineTypeLabel();
    const [customers] = useCustomers();
    const [people] = usePeople();
    const locations = useLocations();
    // usePermissions() returns a fresh object each render, so depend on a stable
    // boolean instead — keeping it in the columns deps would recompute `columns`
    // every render and thrash the table into a re-render loop.
    const canUpdateProduction = permissions.can("update", "production");

    const configuredItemIds = useMemo(
      () => new Set(itemIdsWithConfigurationParameters),
      [itemIdsWithConfigurationParameters]
    );

    const openNew = useCallback(() => {
      openOverlay(overlay.to.newMasterWorkOrder(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const openVariantsQuantity = useCallback(
      (e: MouseEvent, jobId: string) => {
        e.stopPropagation();
        openOverlay(overlay.to.jobVariantsQuantity({ jobId }), {
          onCreated: revalidate
        });
      },
      [openOverlay, revalidate]
    );

    const openBundles = useCallback(
      (e: MouseEvent, masterWorkOrderId: string) => {
        e.stopPropagation();
        openOverlay(overlay.to.masterWorkOrderBundles({ masterWorkOrderId }));
      },
      [openOverlay]
    );

    const openProcesses = useCallback(
      (e: MouseEvent, masterWorkOrderId: string) => {
        e.stopPropagation();
        openOverlay(overlay.to.masterWorkOrderProcesses({ masterWorkOrderId }));
      },
      [openOverlay]
    );

    // Report cutting against the master's cutting operation (locked), then open
    // Split Batch prefilled with what was just cut.
    const openReportCutting = useCallback(
      (
        e: MouseEvent,
        masterWorkOrderId: string,
        progress: MasterCuttingProgress
      ) => {
        e.stopPropagation();
        if (!progress.cuttingOperationId) return;
        openOverlay(
          overlay.to.newProductionQuantity({
            jobId: progress.jobId,
            jobOperationId: progress.cuttingOperationId,
            lockOperation: true
          }),
          {
            onCreated: () => {
              revalidate();
              openOverlay(
                overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId }),
                { onCreated: revalidate }
              );
            }
          }
        );
      },
      [openOverlay, revalidate]
    );

    // Read-only config table of what's left to cut per variant combo.
    const openRemainingConfig = useCallback(
      (e: MouseEvent, progress: MasterCuttingProgress) => {
        e.stopPropagation();
        if (!progress.itemId) return;
        openOverlay(
          overlay.to.itemVariantsQuantity(
            { itemId: progress.itemId },
            { variantQuantities: progress.remainingConfiguration }
          )
        );
      },
      [openOverlay]
    );

    const columns = useMemo<ColumnDef<MasterWorkOrder>[]>(() => {
      return [
        {
          accessorKey: "jobReadableId",
          header: t`ID`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.masterWorkOrder(row.original.id!)}>
              {row.original.jobReadableId}
            </Hyperlink>
          ),
          meta: { icon: <LuBookMarked /> }
        },
        {
          accessorKey: "readableIdWithRevision",
          header: t`Style`,
          cell: ({ row }) => {
            const label =
              row.original.readableIdWithRevision ?? row.original.itemName;
            return (
              <HStack>
                <ItemThumbnail
                  size="md"
                  thumbnailPath={row.original.thumbnailPath}
                  // @ts-ignore
                  type={row.original.itemType}
                />
                <VStack spacing={0}>
                  {row.original.itemId ? (
                    <Hyperlink to={path.to.style(row.original.itemId)}>
                      {label}
                    </Hyperlink>
                  ) : (
                    label
                  )}
                  <div className="w-full truncate text-muted-foreground text-xs">
                    {row.original.itemName}
                  </div>
                </VStack>
              </HStack>
            );
          },
          meta: { icon: <LuShirt /> }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => {
            const quantity = row.original.quantity ?? 0;
            const showVariantsQuantityUi =
              !!row.original.itemId &&
              !!row.original.jobId &&
              configuredItemIds.has(row.original.itemId);
            if (!showVariantsQuantityUi) return quantity;
            const canEditVariantsQuantity =
              canUpdateProduction && !isJobLocked(row.original.status);
            return (
              <HStack spacing={1}>
                <span className="line-clamp-1 tabular-nums">{quantity}</span>
                <IconButton
                  type="button"
                  icon={<LuTable size="1em" strokeWidth={3} />}
                  aria-label={t`Edit variant quantities`}
                  size="sm"
                  variant="secondary"
                  className={cn(
                    quantity > 0 && "text-emerald-500 hover:text-emerald-500"
                  )}
                  isDisabled={!canEditVariantsQuantity}
                  onClick={(e) => openVariantsQuantity(e, row.original.jobId!)}
                />
              </HStack>
            );
          },
          meta: { icon: <LuHash />, renderTotal: true }
        },
        {
          id: "bundles",
          header: t`Bundles`,
          cell: ({ row }) => {
            const bundleCount = row.original.id
              ? (bundleCountByMasterId[row.original.id] ?? 0)
              : 0;
            return (
              <HStack spacing={1}>
                <span className="tabular-nums">{bundleCount}</span>
                {row.original.id ? (
                  <IconButton
                    type="button"
                    icon={<LuPackageOpen size="1em" strokeWidth={2.5} />}
                    aria-label={t`View bundles`}
                    size="sm"
                    variant="secondary"
                    isDisabled={bundleCount === 0}
                    onClick={(e) => openBundles(e, row.original.id!)}
                  />
                ) : null}
              </HStack>
            );
          },
          meta: { icon: <LuPackageOpen /> }
        },
        {
          id: "processes",
          header: t`Processes`,
          cell: ({ row }) => {
            const processCount = row.original.id
              ? (processCountByMasterId[row.original.id] ?? 0)
              : 0;
            return (
              <HStack spacing={1}>
                <span className="tabular-nums">{processCount}</span>
                {row.original.id ? (
                  <IconButton
                    type="button"
                    icon={<LuClipboardList size="1em" strokeWidth={2.5} />}
                    aria-label={t`View processes`}
                    size="sm"
                    variant="secondary"
                    isDisabled={processCount === 0}
                    onClick={(e) => openProcesses(e, row.original.id!)}
                  />
                ) : null}
              </HStack>
            );
          },
          meta: { icon: <LuClipboardList /> }
        },
        {
          id: "reported",
          header: t`Reported`,
          cell: ({ row }) => {
            const progress = row.original.id
              ? cuttingProgressByMasterId[row.original.id]
              : undefined;
            const canReport =
              canUpdateProduction &&
              !isJobLocked(row.original.status) &&
              !!progress?.cuttingOperationId;
            return (
              <HStack spacing={1}>
                <span className="tabular-nums">{progress?.reported ?? 0}</span>
                {progress ? (
                  <IconButton
                    type="button"
                    icon={<LuScissors size="1em" strokeWidth={2.5} />}
                    aria-label={t`Report Cutting`}
                    size="sm"
                    variant="secondary"
                    isDisabled={!canReport}
                    onClick={(e) =>
                      openReportCutting(e, row.original.id!, progress)
                    }
                  />
                ) : null}
              </HStack>
            );
          },
          meta: { icon: <LuCircleCheckBig /> }
        },
        {
          id: "remaining",
          header: t`Remaining`,
          cell: ({ row }) => {
            const progress = row.original.id
              ? cuttingProgressByMasterId[row.original.id]
              : undefined;
            return (
              <HStack spacing={1}>
                <span className="tabular-nums">{progress?.remaining ?? 0}</span>
                {progress?.itemId ? (
                  <IconButton
                    type="button"
                    icon={<LuTable size="1em" strokeWidth={2.5} />}
                    aria-label={t`View remaining`}
                    size="sm"
                    variant="secondary"
                    onClick={(e) => openRemainingConfig(e, progress)}
                  />
                ) : null}
              </HStack>
            );
          },
          meta: { icon: <LuCircleDashed /> }
        },
        {
          id: "cuttingStatus",
          header: t`Cutting`,
          cell: ({ row }) => {
            const progress = row.original.id
              ? cuttingProgressByMasterId[row.original.id]
              : undefined;
            const status = deriveCuttingStatus(
              progress,
              row.original.quantity ?? 0
            );
            // Cut = done; Ready = pieces released by the pre-cut process are
            // cuttable now; Waiting = remaining but nothing released yet.
            switch (status) {
              case "Cut":
                return <Status color="green">{t`Cut`}</Status>;
              case "Ready":
                return <Status color="blue">{t`Ready to cut`}</Status>;
              case "Waiting":
                return <Status color="gray">{t`Waiting`}</Status>;
              default:
                return null;
            }
          },
          meta: {
            icon: <LuScissors />,
            filter: {
              type: "static",
              options: [
                {
                  value: "Ready",
                  label: <Status color="blue">{t`Ready to cut`}</Status>
                },
                {
                  value: "Waiting",
                  label: <Status color="gray">{t`Waiting`}</Status>
                },
                { value: "Cut", label: <Status color="green">{t`Cut`}</Status> }
              ]
            }
          }
        },
        {
          id: "customerId",
          header: t`Customer`,
          cell: editableCell<MasterWorkOrder>({
            kind: "picker",
            field: "customerId",
            update: JOB_UPDATE,
            idAccessor: (r) => r.jobId,
            value: (r) => r.customerId,
            options:
              customers?.map((c) => ({ value: c.id, label: c.name })) ?? [],
            renderInline: (v) => <CustomerAvatar customerId={v} />
          }),
          meta: {
            icon: <LuSquareUser />,
            filter: {
              type: "static",
              options: customers?.map((customer) => ({
                value: customer.id,
                label: customer.name
              }))
            },
            isEmpty: (row) => !row.customerId
          }
        },
        {
          accessorKey: "salesOrderReadableId",
          header: t`Sales Order`,
          cell: ({ row }) =>
            row.original.salesOrderId && row.original.salesOrderLineId ? (
              <Hyperlink
                to={path.to.salesOrderLine(
                  row.original.salesOrderId,
                  row.original.salesOrderLineId
                )}
              >
                {row.original.salesOrderReadableId}
              </Hyperlink>
            ) : null,
          meta: {
            icon: <LuBookMarked />,
            isEmpty: (row) => !row.salesOrderId || !row.salesOrderReadableId
          }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: ({ row }) => (
            <JobStatusMenu
              disableComplete
              job={
                {
                  ...row.original,
                  id: row.original.jobId,
                  jobId: row.original.jobReadableId
                } as unknown as Job
              }
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
        },
        {
          id: "assignee",
          header: t`Assignee`,
          cell: ({ row }) => (
            <Assignee
              id={row.original.jobId ?? ""}
              table="job"
              value={row.original.assignee ?? ""}
              variant="button"
              size="sm"
            />
          ),
          meta: {
            icon: <LuUser />,
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            isEmpty: (row) => !row.assignee
          }
        },
        {
          accessorKey: "startDate",
          header: t`Start Date`,
          cell: editableCell<MasterWorkOrder>({
            kind: "date",
            field: "startDate",
            update: JOB_UPDATE,
            idAccessor: (r) => r.jobId,
            value: (r) => r.startDate,
            renderInline: (v) => formatDate(v)
          }),
          meta: { icon: <LuCalendar />, isEmpty: (row) => !row.startDate }
        },
        {
          accessorKey: "dueDate",
          header: t`Due Date`,
          cell: editableCell<MasterWorkOrder>({
            kind: "date",
            field: "dueDate",
            update: JOB_UPDATE,
            idAccessor: (r) => r.jobId,
            value: (r) => r.dueDate,
            renderInline: (v) => formatDate(v)
          }),
          meta: { icon: <LuCalendar />, isEmpty: (row) => !row.dueDate }
        },
        {
          accessorKey: "deadlineType",
          header: t`Deadline Type`,
          cell: editableCell<MasterWorkOrder>({
            kind: "enum",
            field: "deadlineType",
            update: JOB_UPDATE,
            idAccessor: (r) => r.jobId,
            value: (r) => r.deadlineType,
            options: deadlineTypes.map((value) => ({
              value,
              label: getDeadlineTypeLabel(value)
            })),
            renderInline: (v) => (
              <div className="flex items-center gap-1">
                {getDeadlineIcon(v as (typeof deadlineTypes)[number])}
                <span>
                  {getDeadlineTypeLabel(v as (typeof deadlineTypes)[number])}
                </span>
              </div>
            )
          }),
          meta: {
            icon: <LuClock />,
            filter: {
              type: "static",
              options: deadlineTypes.map((type) => ({
                value: type,
                label: (
                  <div className="flex gap-1 items-center">
                    {getDeadlineIcon(type)}
                    <span>{getDeadlineTypeLabel(type)}</span>
                  </div>
                )
              }))
            }
          }
        },
        {
          accessorKey: "tags",
          header: t`Tags`,
          cell: ({ row }) => (
            <HStack spacing={1} className="flex-wrap">
              {(row.original.tags ?? []).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </HStack>
          ),
          meta: { icon: <LuTag />, isEmpty: (row) => !row.tags?.length }
        },
        {
          accessorKey: "createdAt",
          header: t`Created At`,
          cell: ({ row }) =>
            row.original.createdAt ? formatDate(row.original.createdAt) : null,
          meta: {
            icon: <LuCalendar />,
            isEmpty: (row) => !row.createdAt
          }
        },
        {
          accessorKey: "locationId",
          header: t`Location`,
          cell: editableCell<MasterWorkOrder>({
            kind: "picker",
            field: "locationId",
            update: JOB_UPDATE,
            idAccessor: (r) => r.jobId,
            value: (r) => r.locationId,
            options: locations.map((l) => ({
              value: l.value,
              label: typeof l.label === "string" ? l.label : String(l.label)
            })),
            renderInline: (v, opts) => (
              <Enumerable
                value={
                  opts.find((o) => o.value === v)?.label?.toString() ?? null
                }
              />
            )
          }),
          meta: {
            icon: <LuMapPin />,
            filter: {
              type: "static",
              options: locations.map((l) => ({
                value: l.value,
                label: <Enumerable value={l.label} />
              }))
            },
            isEmpty: (row) => !row.locationId
          }
        }
      ];
    }, [
      t,
      formatDate,
      customers,
      people,
      locations,
      getDeadlineTypeLabel,
      configuredItemIds,
      openVariantsQuantity,
      canUpdateProduction,
      bundleCountByMasterId,
      openBundles,
      processCountByMasterId,
      openProcesses,
      cuttingProgressByMasterId,
      openReportCutting,
      openRemainingConfig
    ]);

    return (
      <Table<MasterWorkOrder>
        data={data}
        columns={columns}
        count={count}
        defaultColumnPinning={{
          left: ["jobReadableId", "readableIdWithRevision"]
        }}
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
              <Trans>Master Work Order</Trans>
            </Button>
          )
        }
        title={t`Master Work Orders`}
        table="masterWorkOrder"
        withSavedView
        withSelectableRows
      />
    );
  }
);

MasterWorkOrdersTable.displayName = "MasterWorkOrdersTable";
export default MasterWorkOrdersTable;
