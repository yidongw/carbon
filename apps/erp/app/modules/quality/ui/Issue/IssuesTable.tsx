import { Badge, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  LuBlocks,
  LuBookMarked,
  LuCalendar,
  LuChartNoAxesColumnIncreasing,
  LuCircleGauge,
  LuDna,
  LuMap,
  LuOctagonX,
  LuPencil,
  LuShieldCheck,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { Assignee, EmployeeAvatar, Hyperlink, New, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { useLocations } from "~/components/Form/Location";
import { editableCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import { useDateFormatter, usePermissions } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import { useItems } from "~/stores/items";
import { usePeople } from "~/stores/people";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";
import {
  nonConformancePriority,
  nonConformanceSource,
  nonConformanceStatus
} from "../../quality.models";
import type { Issue } from "../../types";
import { getPriorityIcon, getSourceIcon } from "./IssueIcons";
import IssueStatus from "./IssueStatus";

// Issue inline edits go through the shared issue bulk-update action.
const ISSUE_UPDATE = {
  action: path.to.bulkUpdateIssue,
  idKey: "ids" as const
};

type IssuesTableProps = {
  data: Issue[];
  types: ListItem[];
  count: number;
};

const IssuesTable = memo(({ data, types, count }: IssuesTableProps) => {
  const navigate = useNavigate();
  const { t } = useLingui();
  const { formatDate } = useDateFormatter();
  const permissions = usePermissions();
  const deleteDisclosure = useDisclosure();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const customColumns = useCustomColumns<Issue>("nonConformance");
  const locations = useLocations();
  const [people] = usePeople();
  const [items] = useItems();

  const columns = useMemo<ColumnDef<Issue>[]>(() => {
    const defaultColumns: ColumnDef<Issue>[] = [
      {
        accessorKey: "nonConformanceId",
        header: t`Name`,
        cell: ({ row }) => (
          <Hyperlink to={path.to.issue(row.original.id!)}>
            <div className="flex flex-col gap-0">
              <span className="text-sm font-medium">
                {row.original.nonConformanceId}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.name}
              </span>
            </div>
          </Hyperlink>
        ),
        meta: {
          icon: <LuBookMarked />
        }
      },

      {
        accessorKey: "status",
        header: t`Status`,
        cell: ({ row }) => <IssueStatus status={row.original.status} />,
        meta: {
          icon: <LuCircleGauge />,
          filter: {
            type: "static",
            options: nonConformanceStatus.map((status) => ({
              label: status,
              value: status
            }))
          }
        }
      },
      {
        accessorKey: "nonConformanceTypeId",
        header: t`Type`,
        cell: ({ row }) => (
          <Enumerable
            value={
              types.find(
                (type) => type.id === row.original.nonConformanceTypeId
              )?.name ?? null
            }
          />
        ),
        meta: {
          icon: <LuOctagonX />,
          filter: {
            type: "static",
            options: types.map((type) => ({
              label: type.name,
              value: type.id
            }))
          }
        }
      },

      {
        accessorKey: "priority",
        header: t`Priority`,
        cell: editableCell<Issue>({
          kind: "enum",
          field: "priority",
          update: ISSUE_UPDATE,
          value: (r) => r.priority,
          options: nonConformancePriority.map((priority) => ({
            value: priority,
            label: (
              <span className="flex gap-2 items-center">
                {getPriorityIcon(priority, false)}
                {priority}
              </span>
            )
          })),
          renderInline: (v) => (
            <span className="flex gap-2 items-center">
              {getPriorityIcon(
                (v as (typeof nonConformancePriority)[number]) ?? "Low",
                false
              )}
              {v}
            </span>
          )
        }),
        meta: {
          icon: <LuChartNoAxesColumnIncreasing />,
          filter: {
            type: "static",
            options: nonConformancePriority.map((priority) => ({
              label: priority,
              value: priority
            }))
          }
        }
      },
      {
        accessorKey: "source",
        header: t`Source`,
        cell: editableCell<Issue>({
          kind: "enum",
          field: "source",
          update: ISSUE_UPDATE,
          value: (r) => r.source,
          options: nonConformanceSource.map((source) => ({
            value: source,
            label: (
              <span className="flex gap-2 items-center">
                {getSourceIcon(source, false)}
                {source}
              </span>
            )
          })),
          renderInline: (v) => (
            <span className="flex gap-2 items-center">
              {getSourceIcon(
                (v as (typeof nonConformanceSource)[number]) ?? "Internal",
                false
              )}
              {v}
            </span>
          )
        }),
        meta: {
          icon: <LuDna />,
          filter: {
            type: "static",
            options: nonConformanceSource.map((source) => ({
              label: source,
              value: source
            }))
          }
        }
      },
      {
        accessorKey: "containmentStatus",
        header: t`Containment`,
        cell: ({ row }) => {
          const status = row.original.containmentStatus ?? "Uncontained";
          return (
            <Badge variant={status === "Contained" ? "green" : "orange"}>
              {status}
            </Badge>
          );
        },
        meta: {
          icon: <LuShieldCheck />,
          filter: {
            type: "static",
            options: [
              { label: "Contained", value: "Contained" },
              { label: "Uncontained", value: "Uncontained" }
            ]
          }
        }
      },
      {
        accessorKey: "locationId",
        header: t`Location`,
        cell: ({ row }) => (
          <Enumerable
            value={
              locations.find(
                (location) => location.value === row.original.locationId
              )?.label ?? null
            }
          />
        ),
        meta: {
          icon: <LuMap />,
          filter: {
            type: "static",
            options: locations.map((location) => ({
              label: location.label,
              value: location.value
            }))
          }
        }
      },
      {
        accessorKey: "assignee",
        header: t`Assignee`,
        cell: ({ row }) => (
          <Assignee
            id={row.original.id ?? ""}
            table="nonConformance"
            value={row.original.assignee ?? ""}
            variant="button"
            size="sm"
          />
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
        id: "items",
        header: t`Items`,
        cell: ({ row }) => (
          <span className="flex gap-2 items-center flex-wrap py-2">
            {((row.original.items ?? []) as Array<string>).map((i) => {
              const item = items.find((x) => x.id === i);
              if (!item) return null;
              return (
                <Badge variant="outline" key={item?.id}>
                  {item?.readableIdWithRevision}
                </Badge>
              );
            })}
          </span>
        ),
        meta: {
          icon: <LuBlocks />,
          filter: {
            type: "static",
            options: items.map((item) => ({
              value: item.id,
              label: (
                <Badge variant="outline">{item.readableIdWithRevision}</Badge>
              )
            })),
            isArray: true
          }
        }
      },
      {
        accessorKey: "openDate",
        header: t`Open Date`,
        cell: editableCell<Issue>({
          kind: "date",
          field: "openDate",
          update: ISSUE_UPDATE,
          value: (r) => r.openDate,
          renderInline: (v) => formatDate(v)
        }),
        meta: {
          icon: <LuCalendar />
        }
      },
      {
        accessorKey: "closeDate",
        header: t`Closed Date`,
        cell: editableCell<Issue>({
          kind: "date",
          field: "closeDate",
          update: ISSUE_UPDATE,
          value: (r) => r.closeDate,
          renderInline: (v) => formatDate(v)
        }),
        meta: {
          icon: <LuCalendar />
        }
      },
      {
        accessorKey: "createdBy",
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
      }
    ];
    return [...defaultColumns, ...customColumns];
  }, [customColumns, items, locations, people, types, t, formatDate]);

  const renderContextMenu = useCallback(
    (row: Issue) => {
      return (
        <>
          <MenuItem
            disabled={!permissions.can("update", "quality")}
            onClick={() => {
              navigate(`${path.to.issue(row.id!)}`);
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            Edit Issue
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "quality")}
            onClick={() => {
              flushSync(() => {
                setSelectedIssue(row);
              });
              deleteDisclosure.onOpen();
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            Delete Issue
          </MenuItem>
        </>
      );
    },
    [navigate, permissions, deleteDisclosure]
  );

  return (
    <>
      <Table<Issue>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "quality") && (
            <New label={t`Issue`} to={path.to.newIssue} />
          )
        }
        renderContextMenu={renderContextMenu}
        title={t`Issues`}
        table="nonConformance"
        withSavedView
      />
      {deleteDisclosure.isOpen && selectedIssue && (
        <ConfirmDelete
          action={path.to.deleteIssue(selectedIssue.id!)}
          isOpen
          onCancel={() => {
            setSelectedIssue(null);
            deleteDisclosure.onClose();
          }}
          onSubmit={() => {
            setSelectedIssue(null);
            deleteDisclosure.onClose();
          }}
          name={selectedIssue.name ?? "issue"}
          text={t`Are you sure you want to delete this issue?`}
        />
      )}
    </>
  );
});

IssuesTable.displayName = "IssuesTable";
export default IssuesTable;
