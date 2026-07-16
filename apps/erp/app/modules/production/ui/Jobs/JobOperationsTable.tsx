import { useCarbon } from "@carbon/auth";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  HStack,
  IconButton
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { memo, useCallback, useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuCircleCheckBig,
  LuClipboardList,
  LuHash,
  LuPlay,
  LuArrowUpRight,
  LuRefreshCcwDot,
  LuRotateCcw,
  LuTriangleAlert,
  LuClock,
  LuUser,
  LuWrench
} from "react-icons/lu";
import {
  useFetcher,
  useFetchers,
  useNavigate,
  useParams,
  useSubmit
} from "react-router";
import { Assignee, Hyperlink, Table } from "~/components";
import { EditableNumber } from "~/components/Editable";
import { OperationStatusIcon } from "~/components/Icons";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { usePeople } from "~/stores";
import {
  useJobOperationStatusLabel,
  useStyleProcessLabel
} from "~/modules/production/ui/Jobs/jobLabels";
import { useOperationTypeLabel } from "~/modules/production/ui/Jobs/productionQuantityLabels";
import { isStyleCuttingOperation } from "~/modules/items/styleMethod.service";
import { operationTypes } from "~/modules/shared";
import { path } from "~/utils/path";
import { jobOperationStatus } from "../../production.models";
import type { Job, JobOperation } from "../../types";

type JobOperationsTableProps = {
  data: JobOperation[];
  count: number;
  // Overrides so the table can be reused outside the job route (e.g. a Master
  // Work Order's backing job). When omitted, falls back to the job route params
  // + route data, preserving existing job-page behavior.
  jobId?: string;
  isPaused?: boolean;
  title?: string;
  // Suppress cell deep-links into the job pages (when embedded in another shell).
  disableNavigation?: boolean;
  // Override the table's primary action (defaults to Recalculate).
  primaryAction?: ReactNode;
  // Hide the MES "Open" column.
  hideMes?: boolean;
  // Show per-operation Assignee + Assigned At columns.
  showAssignee?: boolean;
  // Suppress the inline-editing "Edit" toggle (read-only quantities).
  disableInlineEditing?: boolean;
  // Base path to the Process Completions tab. When set, the completed/scrapped/
  // reworked cells get a trigger that opens it filtered to that type + operation.
  quantitiesPath?: string;
  // Hide the table's header row (title + toolbar) — e.g. inside a modal.
  withHeader?: boolean;
};

const JobOperationsTable = memo(
  ({
    data,
    count,
    jobId: jobIdProp,
    isPaused: isPausedProp,
    title,
    disableNavigation,
    primaryAction,
    hideMes,
    showAssignee,
    disableInlineEditing,
    quantitiesPath,
    withHeader = true
  }: JobOperationsTableProps) => {
    const params = useParams();
    const navigate = useNavigate();
    const jobId = jobIdProp ?? params.jobId;
    const { t } = useLingui();
    const [people] = usePeople();
    const dateFormatter = useDateFormatter({
      dateStyle: "medium",
      timeStyle: "short"
    });
    const operationTypeLabel = useOperationTypeLabel();
    const getJobOperationStatusLabel = useJobOperationStatusLabel();
    const styleProcessLabel = useStyleProcessLabel();
    if (!jobId) throw new Error("Job ID is required");

    const routeData = useRouteData<{ job: Job }>(path.to.job(jobId));
    const isPaused = isPausedProp ?? routeData?.job?.status === "Paused";

  const fetcher = useFetcher<{}>();
  const submit = useSubmit();
  const permissions = usePermissions();

  // Renders a quantity value with a trigger that jumps to the Process
  // Completions tab, pre-filtered to the given type + this operation.
  const renderQuantityCell = useCallback(
    (value: number, type: string, operationId: string) => {
      if (!quantitiesPath) return value;
      return (
        <HStack spacing={1}>
          <span className="tabular-nums">{value}</span>
          <IconButton
            type="button"
            size="sm"
            variant="ghost"
            aria-label={t`View process completions`}
            icon={<LuArrowUpRight />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `${quantitiesPath}?filter=type:eq:${type}&filter=jobOperationId:eq:${operationId}`
              );
            }}
          />
        </HStack>
      );
    },
    [navigate, quantitiesPath, t]
  );

  const onOperationStatusChange = useCallback(
    (id: string, status: JobOperation["status"]) => {
      submit(
        {
          id,
          status
        },
        {
          method: "post",
          action: path.to.jobOperationStatus,
          navigate: false,
          fetcherKey: `jobOperation:${id}`
        }
      );
    },
    [submit]
  );

  const columns = useMemo<ColumnDef<JobOperation>[]>(() => {
    const cols: ColumnDef<JobOperation>[] = [
      {
        accessorKey: "description",
        header: t`Description`,
        cell: ({ row }) => (
          <HStack className="py-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label={t`Change status`}
                  icon={
                    <OperationStatusIcon
                      status={isPaused ? "Paused" : row.original.status}
                    />
                  }
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={row.original.status}
                  onValueChange={(status) =>
                    onOperationStatusChange(
                      row.original.id,
                      status as JobOperation["status"]
                    )
                  }
                >
                  {jobOperationStatus.map((status) => (
                    <DropdownMenuRadioItem key={status} value={status}>
                      <DropdownMenuIcon
                        icon={<OperationStatusIcon status={status} />}
                      />
                      <span>{getJobOperationStatusLabel(status)}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {disableNavigation ? (
              <span className="max-w-[260px] truncate">
                {styleProcessLabel(
                  row.original.description,
                  isStyleCuttingOperation({
                    tags: row.original.tags,
                    customFields: row.original.customFields
                  })
                )}
              </span>
            ) : (
              <Hyperlink
                to={`${path.to.jobProductionEvents(
                  jobId
                )}?filter=jobOperationId:eq:${row.original.id}`}
                className="max-w-[260px] truncate"
              >
                {styleProcessLabel(
                  row.original.description,
                  isStyleCuttingOperation({
                    tags: row.original.tags,
                    customFields: row.original.customFields
                  })
                )}
              </Hyperlink>
            )}
          </HStack>
        ),
        meta: {
          icon: <LuClipboardList />
        }
      },
      {
        id: "mes",
        header: t`MES`,
        cell: ({ row }) => (
          <Button size="sm" variant="secondary" leftIcon={<LuPlay />} asChild>
            <a href={path.to.external.mesJobOperation(row.original.id)}>
              {t`Open`}
            </a>
          </Button>
        ),
        meta: {
          icon: <LuPlay />
        }
      },
      {
        id: "item",
        header: t`Item`,
        cell: ({ row }) => {
          return row.original.jobMakeMethod?.item?.readableIdWithRevision;
        },
        meta: {
          icon: <AiOutlinePartition />
        }
      },
      {
        accessorKey: "operationType",
        header: t`Operation Type`,
        cell: (item) => operationTypeLabel(item.getValue<string>() ?? ""),
        meta: {
          filter: {
            type: "static",
            options: operationTypes.map((value) => ({
              value,
              label: operationTypeLabel(value)
            }))
          },
          icon: <LuWrench />
        }
      },

      {
        accessorKey: "targetQuantity",
        header: t`Quantity`,
        cell: (item) =>
          item.getValue<number>() ?? item.row.original.operationQuantity ?? 0,
        meta: {
          icon: <LuHash />
        }
      },
      {
        accessorKey: "quantityComplete",
        header: t`Qty. Complete`,
        cell: ({ row }) =>
          renderQuantityCell(
            row.original.quantityComplete ?? 0,
            "Production",
            row.original.id
          ),
        meta: {
          icon: <LuCircleCheckBig />
        }
      },
      {
        accessorKey: "quantityReworked",
        header: t`Qty. Reworked`,
        cell: ({ row }) =>
          renderQuantityCell(
            row.original.quantityReworked ?? 0,
            "Rework",
            row.original.id
          ),
        meta: {
          icon: <LuRotateCcw />
        }
      },
      {
        accessorKey: "quantityScrapped",
        header: t`Qty. Scrapped`,
        cell: ({ row }) =>
          renderQuantityCell(
            row.original.quantityScrapped ?? 0,
            "Scrap",
            row.original.id
          ),
        meta: {
          icon: <LuTriangleAlert />
        }
      }
    ];

    const withoutMes = hideMes ? cols.filter((c) => c.id !== "mes") : cols;
    if (!showAssignee) return withoutMes;

    return [
      ...withoutMes,
      {
        id: "assignee",
        header: t`Assignee`,
        cell: ({ row }) => (
          <Assignee
            id={row.original.id ?? ""}
            table="jobOperation"
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
          }
        }
      },
      {
        accessorKey: "assignedAt",
        header: t`Assigned At`,
        cell: ({ row }) =>
          row.original.assignedAt
            ? dateFormatter.format(new Date(row.original.assignedAt))
            : "—",
        meta: {
          icon: <LuClock />
        }
      }
    ];
  }, [
    dateFormatter,
    disableNavigation,
    getJobOperationStatusLabel,
    hideMes,
    isPaused,
    jobId,
    onOperationStatusChange,
    operationTypeLabel,
    people,
    renderQuantityCell,
    showAssignee,
    styleProcessLabel,
    t
  ]);

  const { carbon } = useCarbon();
  const { id: userId } = useUser();
  const onCellEdit = useCallback(
    async (id: string, value: unknown, row: JobOperation) => {
      if (!carbon) throw new Error("Carbon client not found");
      return await carbon
        .from("jobOperation")
        .update({
          [id]: value,
          updatedBy: userId
        })
        .eq("id", row.id!);
    },
    [carbon, userId]
  );

  const editableComponents = useMemo(() => {
    return {
      operationQuantity: EditableNumber(onCellEdit),
      quantityScrapped: EditableNumber(onCellEdit),
      quantityComplete: EditableNumber(onCellEdit),
      quantityReworked: EditableNumber(onCellEdit)
    };
  }, [onCellEdit]);

  const pendingItems = usePendingItems();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const optimisticData = useMemo<typeof data>(() => {
    if (pendingItems.length === 0) return data;
    return data.map((item) => {
      const pendingItem = pendingItems.find(
        (pendingItem) => pendingItem.id === item.id
      );
      if (pendingItem) {
        return {
          ...item,
          status: pendingItem.status
        };
      }
      return item;
    });
  }, [pendingItems.length]);

  return (
    <Table<JobOperation>
      compact
      count={count}
      columns={columns}
      data={optimisticData}
      primaryAction={
        primaryAction ??
        (data.length > 0 && permissions.can("update", "production") ? (
          <fetcher.Form action={path.to.jobRecalculate(jobId)} method="post">
            <Button
              leftIcon={<LuRefreshCcwDot />}
              isLoading={fetcher.state !== "idle"}
              isDisabled={fetcher.state !== "idle"}
              type="submit"
              variant="secondary"
            >
              Recalculate
            </Button>
          </fetcher.Form>
        ) : undefined)
      }
      editableComponents={editableComponents}
      title={title ?? t`Operations`}
      withHeader={withHeader}
      withInlineEditing={
        !disableInlineEditing && permissions.can("update", "production")
      }
    />
  );
  }
);

JobOperationsTable.displayName = "JobOperationsTable";

export default JobOperationsTable;

const usePendingItems = () => {
  type PendingItem = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is PendingItem => {
      return fetcher.formAction === path.to.jobOperationStatus;
    })
    .reduce<{ id: string; status: JobOperation["status"] }[]>(
      (acc, fetcher) => {
        const id = fetcher.formData.get("id") as string;
        const status = fetcher.formData.get("status") as JobOperation["status"];

        if (id && status) {
          const newItem: { id: string; status: JobOperation["status"] } = {
            id,
            status
          };

          return [...acc, newItem];
        }
        return acc;
      },
      []
    );
};
