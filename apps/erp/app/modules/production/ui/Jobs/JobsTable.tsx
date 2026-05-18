import { useCarbon } from "@carbon/auth";
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
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuBookMarked,
  LuCalendar,
  LuClock,
  LuHash,
  LuListChecks,
  LuMapPin,
  LuMaximize2,
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
import { useFetcher, useNavigate } from "react-router";
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
import {
  useDateFormatter,
  usePermissions,
  useUrlParams,
  useUser
} from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { action } from "~/routes/x+/job+/update";
import { useCustomers, useParts, usePeople, useTools } from "~/stores";
import { path } from "~/utils/path";
import { computeJobConfigTableTotal } from "../../jobConfiguration";
import { deadlineTypes, isJobLocked, jobStatus } from "../../production.models";
import type { Job } from "../../types";
import { getDeadlineIcon } from "./Deadline";
import JobStatus from "./JobStatus";

type JobsTableProps = {
  data: Job[];
  count: number;
  tags: { name: string }[];
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

function useReadableTrackedEntities(data: Job[], companyId: string) {
  const [trackedEntities, setTrackedEntities] = useState<
    Record<string, string>
  >({});
  const { carbon } = useCarbon();

  async function getTrackedEntities(
    jobMakeMethodIds: string[],
    companyId: string
  ) {
    if (carbon) {
      const response = await carbon
        ?.from("trackedEntity")
        .select("*")
        .in("attributes->>Job Make Method", jobMakeMethodIds)
        .eq("companyId", companyId);

      if (response.data) {
        const result = response.data.reduce<Record<string, string>>(
          (acc, curr) => {
            if (
              curr.attributes !== null &&
              typeof curr.attributes === "object" &&
              "Job Make Method" in curr.attributes &&
              curr.readableId
            ) {
              acc[curr.attributes["Job Make Method"] as string] =
                curr.readableId;
            }
            return acc;
          },
          {}
        );

        setTrackedEntities(result);
      }
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    getTrackedEntities(
      data.reduce<string[]>((acc, curr) => {
        if (curr.jobMakeMethodId) {
          acc.push(curr.jobMakeMethodId);
        }
        return acc;
      }, []),
      companyId
    );
  }, [data]);

  return trackedEntities;
}

function useItemIdsWithConfigurationParameters(data: Job[], companyId: string) {
  const { carbon } = useCarbon();
  const [itemIdsWithParams, setItemIdsWithParams] = useState<Set<string>>(
    () => new Set()
  );

  const itemIds = useMemo(
    () => [...new Set(data.map((j) => j.itemId).filter(Boolean))] as string[],
    [data]
  );

  useEffect(() => {
    if (!carbon || itemIds.length === 0) {
      setItemIdsWithParams(new Set());
      return;
    }
    let cancelled = false;
    carbon
      .from("configurationParameter")
      .select("itemId")
      .in("itemId", itemIds)
      .eq("companyId", companyId)
      .then(({ data: rows }) => {
        if (cancelled || !rows) return;
        setItemIdsWithParams(new Set(rows.map((r) => r.itemId)));
      });
    return () => {
      cancelled = true;
    };
  }, [carbon, companyId, itemIds]);

  return itemIdsWithParams;
}

type CurrentProcessInfo = {
  operationId: string;
  description: string | null;
  reportedTotal: number;
};

function formatReportedQuantity(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

/** Root routing only: first operation by `order` where status is not Done/Canceled. */
function useCurrentProcessByJobId(data: Job[]) {
  const { carbon } = useCarbon();
  const [byJobId, setByJobId] = useState<
    Record<string, CurrentProcessInfo | null>
  >({});

  const jobsForQuery = useMemo(
    () =>
      data
        .filter((j): j is Job & { id: string } => Boolean(j.id))
        .map((j) => ({
          id: j.id,
          jobMakeMethodId: j.jobMakeMethodId ?? null
        })),
    [data]
  );

  useEffect(() => {
    if (!carbon || jobsForQuery.length === 0) {
      setByJobId({});
      return;
    }

    let cancelled = false;
    const jobIds = jobsForQuery.map((j) => j.id);

    void (async () => {
      const { data: ops } = await carbon
        .from("jobOperation")
        .select(
          "id, jobId, description, order, status, quantityComplete, quantityScrapped, quantityReworked, jobMakeMethodId"
        )
        .in("jobId", jobIds);

      if (cancelled) return;

      const metaByJobId = new Map(
        jobsForQuery.map((j) => [j.id, j.jobMakeMethodId])
      );

      const opsByJob = new Map<string, NonNullable<typeof ops>>();
      for (const op of ops ?? []) {
        const list = opsByJob.get(op.jobId) ?? [];
        list.push(op);
        opsByJob.set(op.jobId, list);
      }

      const next: Record<string, CurrentProcessInfo | null> = {};
      for (const job of jobsForQuery) {
        const rootMm = metaByJobId.get(job.id);
        let list = opsByJob.get(job.id) ?? [];
        if (rootMm) {
          list = list.filter((o) => o.jobMakeMethodId === rootMm);
        }
        list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const current = list.find(
          (o) => o.status !== "Done" && o.status !== "Canceled"
        );
        if (!current) {
          next[job.id] = null;
          continue;
        }
        next[job.id] = {
          operationId: current.id,
          description: current.description,
          reportedTotal:
            (current.quantityComplete ?? 0) +
            (current.quantityScrapped ?? 0) +
            (current.quantityReworked ?? 0)
        };
      }
      setByJobId(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [carbon, jobsForQuery]);

  return byJobId;
}

const JobsTable = memo(({ data, count, tags }: JobsTableProps) => {
  const navigate = useNavigate();
  const { t } = useLingui();
  const { formatDate } = useDateFormatter();
  const [params] = useUrlParams();
  const parts = useParts();
  const tools = useTools();
  const {
    company: { id: companyId }
  } = useUser();

  const items = useMemo(() => [...parts, ...tools], [parts, tools]);

  const [people] = usePeople();
  const [customers] = useCustomers();
  const locations = useLocations();

  const permissions = usePermissions();
  const deleteModal = useDisclosure();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { openOverlay } = useOverlay();
  const trackedEntities = useReadableTrackedEntities(data, companyId);
  const itemIdsWithConfigurationParameters =
    useItemIdsWithConfigurationParameters(data, companyId);
  const currentProcessByJobId = useCurrentProcessByJobId(data);

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
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
            <Hyperlink to={path.to.job(row.original.id!)}>
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
        cell: ({ row }) => {
          const completedOps = row.original.completedOperationCount ?? 0;
          const totalOps = row.original.operationCount ?? 0;
          const qtyThrough = row.original.quantityFullyComplete ?? 0;
          const qtyTotal = row.original.quantity ?? 0;

          const opsPct = totalOps > 0 ? (completedOps / totalOps) * 100 : 0;
          const qtyPct = qtyTotal > 0 ? (qtyThrough / qtyTotal) * 100 : 0;

          const opsLabel = `${completedOps}/${totalOps}`;
          const qtyLabel = `${qtyThrough}/${qtyTotal}`;

          const openBopPreview = (e: MouseEvent) => {
            e.stopPropagation();
            if (row.original.id) {
              openOverlay(overlay.to.jobBillOfProcessPreview(row.original.id));
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
                      isDisabled={!row.original.id}
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
        },
        meta: {
          icon: <LuListChecks />,
          cellClassName: "overflow-visible max-w-none whitespace-normal"
        }
      },
      {
        id: "currentProcess",
        size: 240,
        header: t`Current process`,
        cell: ({ row }) => {
          const job = row.original;
          const id = job.id;
          if (!id) return null;
          const cp = currentProcessByJobId[id];
          if (!cp) {
            return (
              <span className="text-muted-foreground tabular-nums">—</span>
            );
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
        },
        meta: {
          icon: <LuWorkflow />,
          isEmpty: (row) => {
            if (!row.id) return true;
            return !currentProcessByJobId[row.id];
          }
        }
      },
      {
        id: "trackedEntityId",
        header: t`Tracking`,
        cell: ({ row }) =>
          row.original.jobMakeMethodId &&
          trackedEntities[row.original.jobMakeMethodId] ? (
            <Badge variant="secondary" className="items-center gap-1">
              <LuQrCode />
              {trackedEntities[row.original.jobMakeMethodId]}
            </Badge>
          ) : null,
        meta: {
          icon: <LuQrCode />,
          isEmpty: (row) =>
            !row.jobMakeMethodId || !trackedEntities[row.jobMakeMethodId]
        }
      },
      {
        accessorKey: "quantity",
        header: t`Quantity`,
        cell: ({ row }) => {
          const job = row.original;
          const quantity = job.quantity;
          const quantityComplete = job.quantityComplete ?? 0;
          const configTableTotal = computeJobConfigTableTotal(
            job.configuration
          );
          const configuredQuantity =
            configTableTotal > 0 ? configTableTotal : (quantity ?? 0);
          const showConfiguredQuantityUi =
            !!job.itemId && itemIdsWithConfigurationParameters.has(job.itemId);

          if (showConfiguredQuantityUi) {
            const canConfigure =
              permissions.can("update", "production") &&
              !isJobLocked(job.status);
            return (
              <HStack
                spacing={0}
                className="w-full min-w-[7rem] justify-between"
              >
                <span className="line-clamp-1 tabular-nums">
                  {configuredQuantity}
                </span>
                <IconButton
                  icon={<LuTable size="1em" strokeWidth={3} />}
                  aria-label={t`Configure quantities`}
                  size="sm"
                  variant="secondary"
                  className={cn(
                    configTableTotal > 0 &&
                      "text-emerald-500 hover:text-emerald-500"
                  )}
                  isDisabled={!canConfigure}
                  onClick={() => navigate(path.to.job(job.id!))}
                />
              </HStack>
            );
          }

          if (
            ["In Progress", "Released", "Paused"].includes(job.status ?? "")
          ) {
            return (
              <BarProgress
                progress={(quantityComplete / (quantity ?? 0)) * 100}
                value={`${quantityComplete}/${quantity}`}
              />
            );
          }
          return quantity;
        },
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
            transform: (data: { id: string; salesOrderId: string }[] | null) =>
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
              {["Draft", "Planned", "In Progress", "Ready", "Paused"].includes(
                status ?? ""
              ) && (
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
                <span>{deadlineType}</span>
              </div>
            );

          return (
            <div className="flex items-center gap-1">
              {getDeadlineIcon(deadlineType)}
              <span>{deadlineType}</span>
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
                  <span>{type}</span>
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
    params,
    customColumns,
    trackedEntities,
    itemIdsWithConfigurationParameters,
    currentProcessByJobId,
    permissions,
    navigate,
    t
  ]);

  const fetcher = useFetcher<typeof action>();
  useEffect(() => {
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error.message);
    }
  }, [fetcher.data]);

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
              Delete Jobs
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
          Edit Job
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
        <MenuItem
          destructive
          disabled={!permissions.can("delete", "production")}
          onClick={() => onDelete(row)}
        >
          <MenuIcon icon={<LuTrash />} />
          Delete Job
        </MenuItem>
      </>
    ),

    [navigate, openOverlay, params, permissions]
  );

  return (
    <>
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
    </>
  );
});

JobsTable.displayName = "JobsTable";
export default JobsTable;
