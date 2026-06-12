import {
  Badge,
  BarProgress,
  cn,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  HStack,
  IconButton,
  MenuIcon,
  MenuItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import {
  getLocalTimeZone,
  isSameDay,
  parseDate,
  today
} from "@internationalized/date";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuBookMarked,
  LuCalendar,
  LuClock,
  LuHash,
  LuListChecks,
  LuMapPin,
  LuMaximize2,
  LuPackageOpen,
  LuPencil,
  LuQrCode,
  LuSquareUser,
  LuTable,
  LuTag,
  LuTrash,
  LuUser,
  LuUsers,
  LuWorkflow
} from "react-icons/lu";
import { useFetcher, useNavigate, useRevalidator } from "react-router";
import {
  CustomerAvatar,
  EmployeeAvatar,
  Hyperlink,
  ItemThumbnail,
  New,
  Table
} from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useLocations } from "~/components/Form/Location";
import { ConfirmDelete } from "~/components/Modals";
import { overlay, useOverlay } from "~/components/Overlay";
import { useDateFormatter, usePermissions, useUrlParams } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { action } from "~/routes/x+/job+/update";
import { useCustomers, useParts, usePeople, useTools } from "~/stores";
import { path } from "~/utils/path";
import {
  completeJobPrefetch,
  jobPrefetchCache,
  prioritizeJobPrefetch,
  queueJobPrefetch,
  usePrefetchCache
} from "~/utils/prefetchCache";
import { deadlineTypes, isJobLocked, jobStatus } from "../../production.models";
import type { JobCurrentProcessInfo } from "../../production.service";
import type { Job } from "../../types";
import { getDeadlineIcon } from "./Deadline";
import JobStatus from "./JobStatus";
import { useDeadlineTypeLabel } from "./jobLabels";

type JobsTableProps = {
  data: Job[];
  count: number;
  tags: { name: string }[];
  currentProcessByJobId: Record<string, JobCurrentProcessInfo | null>;
  trackedEntities: Record<string, string>;
  itemIdsWithConfigurationParameters: string[];
};

const defaultColumnVisibility = {
  description: false,
  createdAt: false,
  createdBy: false,
  updatedAt: false,
  updatedBy: false,
  orderQuantity: false,
  inventoryQuantity: false,
  productionQuantity: false,
  scrapQuantity: false,
  quantityComplete: false,
  quantityShipped: false,
  quantityReceivedToInventory: false
};

function formatReportedQuantity(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

type JobsTableSupplementalData = {
  currentProcessByJobId: Record<string, JobCurrentProcessInfo | null>;
  trackedEntities: Record<string, string>;
  itemIdsWithConfigurationParameters: Set<string>;
};

const JobsTableSupplementalContext = createContext<JobsTableSupplementalData>({
  currentProcessByJobId: {},
  trackedEntities: {},
  itemIdsWithConfigurationParameters: new Set()
});

function useJobsTableSupplemental() {
  return useContext(JobsTableSupplementalContext);
}

const RoutingProgressCell = memo(function RoutingProgressCell({
  job,
  onOpenBillOfProcess
}: {
  job: Job;
  onOpenBillOfProcess: (jobId: string) => void;
}) {
  const { t } = useLingui();
  const completedOps = job.completedOperationCount ?? 0;
  const totalOps = job.operationCount ?? 0;
  const qtyThrough = job.quantityFullyComplete ?? 0;
  const qtyTotal = job.quantity ?? 0;

  const opsPct = totalOps > 0 ? (completedOps / totalOps) * 100 : 0;
  const qtyPct = qtyTotal > 0 ? (qtyThrough / qtyTotal) * 100 : 0;

  const opsLabel = `${completedOps}/${totalOps}`;
  const qtyLabel = `${qtyThrough}/${qtyTotal}`;

  const openBopPreview = (e: MouseEvent) => {
    e.stopPropagation();
    if (job.id) {
      onOpenBillOfProcess(job.id);
    }
  };

  return (
    <HStack spacing={1} className="w-[10.5rem] min-w-[10.5rem]">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="min-w-0 flex-1 cursor-help">
            <div className="flex flex-row gap-2 md:flex-col md:gap-1 w-full">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <LuWorkflow className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                <BarProgress
                  className="flex-1 min-w-0"
                  barHeight={6}
                  gradient
                  progress={opsPct}
                  value={opsLabel}
                />
              </div>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <LuHash className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                <BarProgress
                  className="flex-1 min-w-0"
                  barHeight={6}
                  gradient
                  progress={qtyPct}
                  value={qtyLabel}
                />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs text-xs">
          <div className="space-y-2 text-left">
            <p>
              {t`Processes (${completedOps}/${totalOps}): operations marked Done.`}
            </p>
            <p className="text-muted-foreground">
              {t`Quantity (${qtyThrough}/${qtyTotal}): completed quantity across all operations.`}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
      <span className="shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <IconButton
              type="button"
              size="sm"
              variant="ghost"
              className="shrink-0"
              aria-label={t`View bill of process`}
              icon={<LuMaximize2 />}
              isDisabled={!job.id}
              onClick={openBopPreview}
            />
          </TooltipTrigger>
          <TooltipContent side="left">
            <Trans>View bill of process</Trans>
          </TooltipContent>
        </Tooltip>
      </span>
    </HStack>
  );
});

const CurrentProcessCell = memo(function CurrentProcessCell({
  jobId
}: {
  jobId: string;
}) {
  const { t } = useLingui();
  const { currentProcessByJobId } = useJobsTableSupplemental();
  const cp = currentProcessByJobId[jobId];
  if (!cp) {
    return <span className="text-muted-foreground tabular-nums">—</span>;
  }
  return (
    <div className="min-w-0 max-w-[14rem] flex flex-wrap items-baseline gap-x-1.5 md:flex-col md:items-start md:gap-x-0">
      <span className="truncate md:line-clamp-2 md:whitespace-normal text-sm leading-snug">
        {cp.description?.trim() || t`Untitled operation`}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
        <span
          className={cn(
            "font-medium",
            cp.reportedTotal > 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-foreground"
          )}
        >
          {formatReportedQuantity(cp.reportedTotal)}
        </span>{" "}
        {t`reported`}
      </span>
    </div>
  );
});

const TrackingCell = memo(function TrackingCell({ job }: { job: Job }) {
  const { trackedEntities } = useJobsTableSupplemental();
  if (!job.jobMakeMethodId || !trackedEntities[job.jobMakeMethodId]) {
    return null;
  }
  return (
    <Badge variant="secondary" className="items-center gap-1">
      <LuQrCode />
      {trackedEntities[job.jobMakeMethodId]}
    </Badge>
  );
});

const JobQuantityCell = memo(function JobQuantityCell({
  job,
  onOpenConfigTable
}: {
  job: Job;
  onOpenConfigTable: (e: MouseEvent, job: Job) => void;
}) {
  const { itemIdsWithConfigurationParameters } = useJobsTableSupplemental();
  const permissions = usePermissions();
  const quantity = job.quantity ?? 0;
  const quantityComplete = job.quantityComplete ?? 0;
  const showConfiguredQuantityUi =
    !!job.itemId && itemIdsWithConfigurationParameters.has(job.itemId);

  if (showConfiguredQuantityUi) {
    const canConfigure =
      permissions.can("update", "production") && !isJobLocked(job.status);
    return (
      <HStack spacing={1} className="ml-auto justify-end">
        <span className="line-clamp-1 tabular-nums">{quantity}</span>
        <IconButton
          type="button"
          icon={<LuTable size="1em" strokeWidth={3} />}
          aria-label="Configure quantities"
          size="sm"
          variant="secondary"
          className={cn(
            quantity > 0 && "text-emerald-500 hover:text-emerald-500"
          )}
          isDisabled={!canConfigure}
          onClick={(e) => onOpenConfigTable(e, job)}
        />
      </HStack>
    );
  }

  if (["In Progress", "Released", "Paused"].includes(job.status ?? "")) {
    return (
      <BarProgress
        progress={(quantityComplete / quantity) * 100}
        value={`${quantityComplete}/${quantity}`}
      />
    );
  }
  return quantity;
});

const JobsTable = memo(
  ({
    data,
    count,
    tags,
    currentProcessByJobId,
    trackedEntities,
    itemIdsWithConfigurationParameters: itemIdsWithConfigurationParametersList
  }: JobsTableProps) => {
    const navigate = useNavigate();
    const { t } = useLingui();
    const getDeadlineTypeLabel = useDeadlineTypeLabel();
    const { formatDate } = useDateFormatter();
    const prefetchCache = usePrefetchCache(jobPrefetchCache);
    const tableRef = useRef<HTMLDivElement>(null);
    const prefetchFetcher = useFetcher();
    const pendingPrefetchId = useRef<string | null>(null);

    const loadJob = useCallback(
      (href: string) => {
        const match = href.match(/\/x\/job\/([^/]+)/);
        if (match?.[1]) {
          pendingPrefetchId.current = match[1];
          prefetchFetcher.load(href);
        }
      },
      [prefetchFetcher]
    );

    useEffect(() => {
      if (prefetchFetcher.state !== "idle" || !pendingPrefetchId.current) return;
      const jobId = pendingPrefetchId.current;
      pendingPrefetchId.current = null;
      completeJobPrefetch(jobId, loadJob);
    }, [prefetchFetcher.state, loadJob]);

    useEffect(() => {
      const container = tableRef.current;
      if (!container) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const href = (entry.target as HTMLAnchorElement).getAttribute("href");
            const match = href?.match(/\/x\/job\/([^/]+)/);
            if (match?.[1]) queueJobPrefetch(match[1], loadJob);
          });
        },
        { rootMargin: "200px" }
      );
      container.querySelectorAll('a[href*="/x/job/"]').forEach((el) => {
        observer.observe(el);
      });
      return () => observer.disconnect();
    }, [data, loadJob]);

    const [params] = useUrlParams();
    const parts = useParts();
    const tools = useTools();

    const items = useMemo(() => [...parts, ...tools], [parts, tools]);

    const [people] = usePeople();
    const [customers] = useCustomers();
    const locations = useLocations();

    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const { openOverlay } = useOverlay();
    const { revalidate } = useRevalidator();

    const supplementalData = useMemo<JobsTableSupplementalData>(
      () => ({
        currentProcessByJobId,
        trackedEntities,
        itemIdsWithConfigurationParameters: new Set(
          itemIdsWithConfigurationParametersList
        )
      }),
      [
        currentProcessByJobId,
        trackedEntities,
        itemIdsWithConfigurationParametersList
      ]
    );

    const supplementalRef = useRef(supplementalData);
    supplementalRef.current = supplementalData;

    const openBillOfProcessPreview = useCallback(
      (jobId: string) => {
        openOverlay(overlay.to.jobBillOfProcessPreview(jobId));
      },
      [openOverlay]
    );

    const openConfigTable = useCallback(
      (e: MouseEvent, job: Job) => {
        e.stopPropagation();
        if (!job.id) return;
        openOverlay(overlay.to.jobConfigTable(job.id), {
          onCreated: revalidate
        });
      },
      [openOverlay, revalidate]
    );

    const fetcher = useFetcher<typeof action>();
    useEffect(() => {
      if (fetcher.data?.error) {
        toast.error(fetcher.data.error.message);
      }
    }, [fetcher.data]);

    const onDelete = (data: Job) => {
      setSelectedJob(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedJob(null);
      deleteModal.onClose();
    };

    const todaysDate = useMemo(() => today(getLocalTimeZone()), []);

    const customColumns = useCustomColumns<Job>("job");
    const columns = useMemo<ColumnDef<Job>[]>(() => {
      const defaultColumns: ColumnDef<Job>[] = [
        {
          accessorKey: "jobId",
          header: t`Job ID`,
          cell: ({ row }) => (
            <HStack>
              <ItemThumbnail
                size="md"
                thumbnailPath={row.original.thumbnailPath}
                // @ts-ignore
                type={row.original.itemType}
              />
              <Hyperlink
                to={path.to.job(row.original.id!)}
                prefetch="none"
                onMouseEnter={() =>
                  row.original.id &&
                  prioritizeJobPrefetch(row.original.id, loadJob)
                }
                onFocus={() =>
                  row.original.id &&
                  prioritizeJobPrefetch(row.original.id, loadJob)
                }
              >
                {row.original?.jobId}
              </Hyperlink>
            </HStack>
          ),
          meta: {
            icon: <LuBookMarked />
          }
        },
        {
          accessorKey: "itemReadableIdWithRevision",
          header: t`Item`,
          cell: ({ row }) => {
            return (
              <VStack spacing={0}>
                {row.original.itemReadableIdWithRevision}
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.name}
                </div>
              </VStack>
            );
          },
          meta: {
            filter: {
              type: "static",
              options: items?.map((item) => ({
                value: item.readableIdWithRevision,
                label: item.readableIdWithRevision
              }))
            },
            icon: <AiOutlinePartition />
          }
        },
        {
          id: "routingProgress",
          header: t`Progress`,
          size: 176,
          minSize: 176,
          cell: ({ row }) => (
            <RoutingProgressCell
              job={row.original}
              onOpenBillOfProcess={openBillOfProcessPreview}
            />
          ),
          meta: {
            icon: <LuListChecks />,
            cellClassName: "overflow-visible max-w-none whitespace-normal"
          }
        },
        {
          id: "currentProcess",
          size: 240,
          header: t`Current process`,
          cell: ({ row }) =>
            row.original.id ? (
              <CurrentProcessCell jobId={row.original.id} />
            ) : null,
          meta: {
            icon: <LuWorkflow />,
            isEmpty: (row) => {
              if (!row.id) return true;
              return !supplementalRef.current.currentProcessByJobId[row.id];
            }
          }
        },
        {
          id: "trackedEntityId",
          header: t`Tracking`,
          cell: ({ row }) => <TrackingCell job={row.original} />,
          meta: {
            icon: <LuQrCode />,
            isEmpty: (row) =>
              !row.jobMakeMethodId ||
              !supplementalRef.current.trackedEntities[row.jobMakeMethodId]
          }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => (
            <JobQuantityCell
              job={row.original}
              onOpenConfigTable={openConfigTable}
            />
          ),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          id: "customerId",
          header: t`Customer`,
          cell: ({ row }) => (
            <CustomerAvatar customerId={row.original.customerId} />
          ),
          meta: {
            filter: {
              type: "static",
              options: customers?.map((customer) => ({
                value: customer.id,
                label: customer.name
              }))
            },
            icon: <LuSquareUser />,
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
                  row.original.salesOrderLineId!
                )}
              >
                {row.original?.salesOrderReadableId}
              </Hyperlink>
            ) : null,
          meta: {
            icon: <LuBookMarked />,
            filter: {
              type: "fetcher",
              endpoint: path.to.api.salesOrders,
              transform: (
                data: { id: string; salesOrderId: string }[] | null
              ) =>
                data?.map(({ salesOrderId }) => ({
                  value: salesOrderId,
                  label: salesOrderId
                })) ?? []
            },
            isEmpty: (row) => !row.salesOrderId || !row.salesOrderReadableId
          }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: ({ row }) => {
            const status = row.original.status;
            const dueDate = row.original.dueDate;
            return (
              <HStack spacing={1}>
                <JobStatus status={status} />
                {[
                  "Draft",
                  "Planned",
                  "In Progress",
                  "Ready",
                  "Paused"
                ].includes(status ?? "") && (
                  <>
                    {dueDate && isSameDay(parseDate(dueDate), todaysDate) && (
                      <JobStatus status="Due Today" />
                    )}
                    {dueDate && parseDate(dueDate) < todaysDate && (
                      <JobStatus status="Overdue" />
                    )}
                  </>
                )}
              </HStack>
            );
          },
          meta: {
            filter: {
              type: "static",
              options: jobStatus.map((status) => ({
                value: status,
                label: <JobStatus status={status} />
              }))
            },
            pluralHeader: t`Statuses`,
            icon: <LuUsers />
          }
        },
        {
          id: "assignee",
          header: t`Assignee`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.assignee} />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />,
            isEmpty: (row) => !row.assignee
          }
        },
        {
          accessorKey: "startDate",
          header: t`Start Date`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />,
            isEmpty: (row) => !row.startDate
          }
        },
        {
          accessorKey: "dueDate",
          header: t`Due Date`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />,
            isEmpty: (row) => !row.dueDate
          }
        },
        {
          accessorKey: "deadlineType",
          header: t`Deadline Type`,
          cell: ({ row }) => {
            const dueDate = row.original.dueDate!;
            const deadlineType = row.original.deadlineType!;

            if (!dueDate)
              return (
                <div className="flex gap-1 items-center">
                  {getDeadlineIcon(deadlineType)}
                  <span>{getDeadlineTypeLabel(deadlineType)}</span>
                </div>
              );

            return (
              <div className="flex items-center gap-1">
                {getDeadlineIcon(deadlineType)}
                <span>{getDeadlineTypeLabel(deadlineType)}</span>
              </div>
            );
          },
          meta: {
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
            },
            icon: <LuClock />
          }
        },
        {
          accessorKey: "tags",
          header: t`Tags`,
          cell: ({ row }) => (
            <HStack spacing={0} className="gap-1">
              {row.original.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </HStack>
          ),
          meta: {
            filter: {
              type: "static",
              options: tags?.map((tag) => ({
                value: tag.name,
                label: <Badge variant="secondary">{tag.name}</Badge>
              })),
              isArray: true
            },
            icon: <LuTag />,
            isEmpty: (row) => !row.tags?.length
          }
        },
        {
          accessorKey: "orderQuantity",
          header: t`Order Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "inventoryQuantity",
          header: t`Inventory Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "productionQuantity",
          header: t`Production Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "scrapQuantity",
          header: t`Scrap Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "quantityComplete",
          header: t`Completed Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "quantityShipped",
          header: t`Shipped Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "quantityReceivedToInventory",
          header: t`Received Qty`,
          cell: (item) => item.getValue<number>(),
          meta: {
            icon: <LuHash />,
            renderTotal: true
          }
        },
        {
          accessorKey: "locationId",
          header: t`Location`,
          cell: ({ row }) => (
            <Enumerable
              value={
                locations.find((l) => l.value === row.original.locationId)
                  ?.label ?? null
              }
            />
          ),
          meta: {
            icon: <LuMapPin />,
            filter: {
              type: "static",
              options: locations.map((l) => ({
                value: l.value,
                label: <Enumerable value={l.label} />
              }))
            }
          }
        },
        {
          id: "createdBy",
          header: t`Created By`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.createdBy} />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />
          }
        },
        {
          accessorKey: "createdAt",
          header: t`Created At`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          id: "updatedBy",
          header: t`Updated By`,
          cell: ({ row }) => (
            <EmployeeAvatar employeeId={row.original.updatedBy} />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />
          }
        },
        {
          accessorKey: "updatedAt",
          header: t`Updated At`,
          cell: (item) => formatDate(item.getValue<string>()),
          meta: {
            icon: <LuCalendar />
          }
        }
      ];
      return [...defaultColumns, ...customColumns];
    }, [
      customColumns,
      customers,
      formatDate,
      items,
      locations,
      openBillOfProcessPreview,
      openConfigTable,
      people,
      tags,
      getDeadlineTypeLabel,
      t,
      todaysDate,
      loadJob
    ]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    const onBulkUpdate = useCallback(
      (selectedRows: typeof data, field: "delete", value?: string) => {
        const formData = new FormData();
        selectedRows.forEach((row) => {
          if (row.id) formData.append("ids", row.id);
        });
        formData.append("field", field);
        if (value) formData.append("value", value);
        fetcher.submit(formData, {
          method: "post",
          action: path.to.bulkUpdateJob
        });
      },

      []
    );

    const renderActions = useCallback(
      (selectedRows: typeof data) => {
        return (
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuLabel>
              <Trans>Update</Trans>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={
                  !permissions.can("delete", "production") ||
                  selectedRows.some(
                    (row) =>
                      ![
                        "Draft",
                        "Planned",
                        "Due Today",
                        "Overdue",
                        "Draft"
                      ].includes(row.status ?? "")
                  )
                }
                destructive
                onClick={() => onBulkUpdate(selectedRows, "delete")}
              >
                <MenuIcon icon={<LuTrash />} />
                <Trans>Delete Jobs</Trans>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        );
      },
      [onBulkUpdate, permissions]
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    const renderContextMenu = useCallback<(row: Job) => JSX.Element>(
      (row) => (
        <>
          <MenuItem
            onClick={() => {
              navigate(path.to.job(row.id!));
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Job</Trans>
          </MenuItem>
          {permissions.can("create", "production") && row.id ? (
            <MenuItem
              onClick={() => {
                openOverlay(overlay.to.newJobProductionQuantity(row.id!));
              }}
            >
              <MenuIcon icon={<LuHash />} />
              <Trans>Record production quantity</Trans>
            </MenuItem>
          ) : null}
          {permissions.can("create", "production") && row.id ? (
            <MenuItem
              onClick={() => {
                openOverlay(overlay.to.newJobPickup(row.id!));
              }}
            >
              <MenuIcon icon={<LuPackageOpen />} />
              <Trans>Record pickup</Trans>
            </MenuItem>
          ) : null}
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "production")}
            onClick={() => onDelete(row)}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Job</Trans>
          </MenuItem>
        </>
      ),

      [navigate, openOverlay, params, permissions]
    );

    return (
      <div ref={tableRef} className="contents">
        <JobsTableSupplementalContext.Provider value={supplementalData}>
          <Table<Job>
            data={data}
            defaultColumnVisibility={defaultColumnVisibility}
            defaultFeaturedColumns={["currentProcess", "routingProgress"]}
            defaultColumnPinning={{
              left: ["jobId", "itemReadableIdWithRevision"]
            }}
            columns={columns}
            count={count ?? 0}
            primaryAction={
              permissions.can("update", "resources") && (
                <New label={t`Job`} to={path.to.newJob} />
              )
            }
            renderActions={renderActions}
            renderContextMenu={renderContextMenu}
            getRowHref={(row) => (row.id ? path.to.job(row.id) : undefined)}
            title={t`Jobs`}
            table="job"
            withSavedView
            withSelectableRows
          />
        </JobsTableSupplementalContext.Provider>

        {selectedJob && selectedJob.id && (
          <ConfirmDelete
            action={path.to.deleteJob(selectedJob.id)}
            name={selectedJob?.jobId ?? ""}
            text={`Are you sure you want to delete the job: ${selectedJob?.jobId}?`}
            isOpen={deleteModal.isOpen}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </div>
    );
  }
);

JobsTable.displayName = "JobsTable";
export default JobsTable;
