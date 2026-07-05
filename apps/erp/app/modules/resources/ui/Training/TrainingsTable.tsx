import { Badge, MenuIcon, MenuItem, useDisclosure } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  LuBookOpen,
  LuClock,
  LuPencil,
  LuRepeat,
  LuShapes,
  LuStar,
  LuTag,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { Assignee, Hyperlink, New, Table } from "~/components";
import { editableCell, TagsCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import type { TrainingListItem } from "~/modules/resources";
import {
  trainingFrequency,
  trainingStatus,
  trainingType
} from "~/modules/resources/resources.models";
import { path } from "~/utils/path";
import TrainingStatus from "./TrainingStatus";

// Training inline edits go through the shared training bulk-update action.
const TRAINING_UPDATE = {
  action: path.to.bulkUpdateTraining,
  idKey: "ids" as const
};

type TrainingsTableProps = {
  data: TrainingListItem[];
  count: number;
  tags: Array<{ name: string }>;
};

const TrainingsTable = memo(({ data, count, tags }: TrainingsTableProps) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const deleteDisclosure = useDisclosure();
  const [selectedTraining, setSelectedTraining] =
    useState<TrainingListItem | null>(null);

  const columns = useMemo<ColumnDef<TrainingListItem>[]>(() => {
    const defaultColumns: ColumnDef<TrainingListItem>[] = [
      {
        accessorKey: "name",
        header: t`Name`,
        cell: ({ row }) => (
          <Hyperlink to={path.to.training(row.original.id!)}>
            {row.original.name}
          </Hyperlink>
        ),
        meta: {
          icon: <LuBookOpen />
        }
      },
      {
        accessorKey: "status",
        header: t`Status`,
        cell: editableCell<TrainingListItem>({
          kind: "enum",
          field: "status",
          update: TRAINING_UPDATE,
          value: (r) => r.status,
          options: trainingStatus.map((v) => ({
            value: v,
            label: <TrainingStatus status={v} />
          })),
          renderInline: (v) => (
            <TrainingStatus status={v as (typeof trainingStatus)[number]} />
          )
        }),
        meta: {
          filter: {
            type: "static",
            options: [
              { value: "Draft", label: <TrainingStatus status="Draft" /> },
              { value: "Active", label: <TrainingStatus status="Active" /> },
              {
                value: "Archived",
                label: <TrainingStatus status="Archived" />
              }
            ]
          },
          icon: <LuStar />
        }
      },
      {
        accessorKey: "type",
        header: t`Type`,
        cell: editableCell<TrainingListItem>({
          kind: "enum",
          field: "type",
          update: TRAINING_UPDATE,
          value: (r) => r.type,
          options: trainingType.map((v) => ({
            value: v,
            label: (
              <Badge variant={v === "Mandatory" ? "default" : "secondary"}>
                {v}
              </Badge>
            )
          })),
          renderInline: (v) => (
            <Badge variant={v === "Mandatory" ? "default" : "secondary"}>
              {v}
            </Badge>
          )
        }),
        meta: {
          filter: {
            type: "static",
            options: [
              { value: "Mandatory", label: "Mandatory" },
              { value: "Optional", label: "Optional" }
            ]
          },
          icon: <LuShapes />
        }
      },
      {
        accessorKey: "frequency",
        header: t`Frequency`,
        cell: editableCell<TrainingListItem>({
          kind: "enum",
          field: "frequency",
          update: TRAINING_UPDATE,
          value: (r) => r.frequency,
          options: trainingFrequency.map((v) => ({
            value: v,
            label: <Badge variant="secondary">{v}</Badge>
          })),
          renderInline: (v) => <Badge variant="secondary">{v}</Badge>
        }),
        meta: {
          icon: <LuRepeat />,
          filter: {
            type: "static",
            options: [
              { value: "Once", label: "Once" },
              { value: "Quarterly", label: "Quarterly" },
              { value: "Annual", label: "Annual" }
            ]
          }
        }
      },
      {
        accessorKey: "estimatedDuration",
        header: t`Duration`,
        cell: editableCell<TrainingListItem>({
          kind: "text",
          field: "estimatedDuration",
          update: TRAINING_UPDATE,
          value: (r) =>
            r.estimatedDuration != null ? String(r.estimatedDuration) : ""
        }),
        meta: {
          icon: <LuClock />
        }
      },
      {
        id: "assignee",
        header: t`Assignee`,
        cell: ({ row }) => (
          <Assignee
            id={row.original.id ?? ""}
            table="training"
            value={row.original.assignee ?? ""}
            variant="button"
            size="sm"
          />
        ),
        meta: {
          icon: <LuUser />
        }
      },
      {
        accessorKey: "tags",
        header: t`Tags`,
        cell: ({ row }) => (
          <TagsCell row={row.original} table="training" availableTags={tags} />
        ),
        meta: {
          filter: {
            type: "static",
            options: tags.map((tag) => ({
              value: tag.name,
              label: <Badge variant="secondary">{tag.name}</Badge>
            })),
            isArray: true
          },
          icon: <LuTag />
        }
      }
    ];
    return [...defaultColumns];
  }, [tags, t]);

  const renderContextMenu = useCallback(
    (row: TrainingListItem) => {
      return (
        <>
          <MenuItem
            disabled={!permissions.can("update", "resources")}
            onClick={() => {
              navigate(`${path.to.training(row.id!)}`);
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Training</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              flushSync(() => {
                setSelectedTraining(row);
              });
              deleteDisclosure.onOpen();
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Training</Trans>
          </MenuItem>
        </>
      );
    },
    [navigate, permissions, deleteDisclosure]
  );

  return (
    <>
      <Table<TrainingListItem>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "resources") && (
            <New label={t`Training`} to={path.to.newTraining} />
          )
        }
        renderContextMenu={renderContextMenu}
        title={t`Training`}
        table="training"
        withSavedView
      />
      {deleteDisclosure.isOpen && selectedTraining && (
        <ConfirmDelete
          action={path.to.deleteTraining(selectedTraining.id!)}
          isOpen
          onCancel={() => {
            setSelectedTraining(null);
            deleteDisclosure.onClose();
          }}
          onSubmit={() => {
            setSelectedTraining(null);
            deleteDisclosure.onClose();
          }}
          name={selectedTraining.name ?? "training"}
          text="Are you sure you want to delete this training?"
        />
      )}
    </>
  );
});

TrainingsTable.displayName = "TrainingsTable";
export default TrainingsTable;
