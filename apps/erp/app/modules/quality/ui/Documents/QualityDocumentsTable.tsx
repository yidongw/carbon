import {
  Badge,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  MenuIcon,
  MenuItem,
  toast,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import {
  LuBookMarked,
  LuCalendar,
  LuEllipsisVertical,
  LuFolderUp,
  LuGitPullRequest,
  LuPencil,
  LuTag,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { useFetcher, useNavigate } from "react-router";
import { Assignee, Hyperlink, New, Table } from "~/components";
import { editableCell, TagsCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { qualityDocumentStatus } from "../../quality.models";
import type { QualityDocuments } from "../../types";
import QualityDocumentStatus from "./QualityDocumentStatus";

// Quality document inline edits go through the shared bulk-update action.
const QUALITY_DOCUMENT_UPDATE = {
  action: path.to.bulkUpdateQualityDocument,
  idKey: "ids" as const
};

type QualityDocumentsTableProps = {
  data: QualityDocuments[];
  count: number;
  tags: Array<{ name: string }>;
};

const QualityDocumentsTable = memo(
  ({ data, count, tags }: QualityDocumentsTableProps) => {
    const navigate = useNavigate();
    const { t } = useLingui();
    const permissions = usePermissions();
    const seedFetcher = useFetcher<{ success: boolean; message: string }>();

    useEffect(() => {
      if (seedFetcher.data?.success === true) {
        toast.success(seedFetcher.data.message);
      }
      if (seedFetcher.data?.success === false) {
        toast.error(seedFetcher.data.message);
      }
    }, [seedFetcher.data]);

    const deleteDisclosure = useDisclosure();
    const [selectedQualityDocument, setSelectedQualityDocument] =
      useState<QualityDocuments | null>(null);

    const columns = useMemo<ColumnDef<QualityDocuments>[]>(() => {
      const defaultColumns: ColumnDef<QualityDocuments>[] = [
        {
          accessorKey: "name",
          header: t`Name`,
          cell: ({ row }) => (
            <div className="flex flex-col gap-0">
              <Hyperlink to={path.to.qualityDocument(row.original.id!)}>
                {row.original.name}
              </Hyperlink>
              <span className="text-sm text-muted-foreground">
                Version {row.original.version}
              </span>
            </div>
          ),
          meta: {
            icon: <LuBookMarked />
          }
        },

        {
          accessorKey: "status",
          header: t`Status`,
          cell: editableCell<QualityDocuments>({
            kind: "enum",
            field: "status",
            update: QUALITY_DOCUMENT_UPDATE,
            value: (r) => r.status,
            options: qualityDocumentStatus.map((v) => ({
              value: v,
              label: <QualityDocumentStatus status={v} />
            })),
            renderInline: (v) => (
              <QualityDocumentStatus
                status={v as (typeof qualityDocumentStatus)[number]}
              />
            )
          }),
          meta: {
            icon: <LuCalendar />
          }
        },
        {
          accessorKey: "assignee",
          header: t`Assignee`,
          cell: ({ row }) => (
            <Assignee
              id={row.original.id ?? ""}
              table="qualityDocument"
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
            <TagsCell
              tagKey={row.original.id}
              tags={row.original.tags}
              table="qualityDocument"
              availableTags={tags}
            />
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
        },
        {
          id: "versions",
          header: t`Versions`,
          cell: ({ row }) => {
            const versions = row.original?.versions as Array<{
              id: string;
              version: number;
              status: "Draft" | "Active" | "Archived";
            }>;

            return (
              <HoverCard>
                <HoverCardTrigger>
                  <Badge variant="secondary" className="cursor-pointer">
                    {versions?.length ?? 0} Version
                    {versions?.length === 1 ? "" : "s"}
                    <LuEllipsisVertical className="w-3 h-3 ml-2" />
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-col w-full gap-4 text-sm">
                    {(versions ?? [])
                      .sort((a, b) => a.version - b.version)
                      .map((version) => (
                        <div
                          key={version.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <Hyperlink
                            to={path.to.qualityDocument(version.id)}
                            className="flex items-center justify-start gap-1"
                          >
                            Version {version.version}
                          </Hyperlink>
                          <div className="flex items-center justify-end">
                            <QualityDocumentStatus status={version.status} />
                          </div>
                        </div>
                      ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          },
          meta: {
            icon: <LuGitPullRequest />
          }
        }
      ];
      return [...defaultColumns];
    }, [tags, t]);

    const renderContextMenu = useCallback(
      (row: QualityDocuments) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "quality")}
              onClick={() => {
                navigate(`${path.to.qualityDocument(row.id!)}`);
              }}
            >
              <MenuIcon icon={<LuPencil />} />
              Edit Document
            </MenuItem>
            <MenuItem
              destructive
              disabled={!permissions.can("delete", "quality")}
              onClick={() => {
                flushSync(() => {
                  setSelectedQualityDocument(row);
                });
                deleteDisclosure.onOpen();
              }}
            >
              <MenuIcon icon={<LuTrash />} />
              Delete Document
            </MenuItem>
          </>
        );
      },
      [navigate, permissions, deleteDisclosure]
    );

    return (
      <>
        <Table<QualityDocuments>
          data={data}
          columns={columns}
          count={count}
          primaryAction={
            permissions.can("create", "quality") && (
              <div className="flex items-center gap-2">
                {data.length === 0 && (
                  <seedFetcher.Form
                    method="post"
                    action={path.to.api.seedQualityDocuments}
                  >
                    <Button
                      leftIcon={<LuFolderUp />}
                      isLoading={seedFetcher.state !== "idle"}
                      isDisabled={seedFetcher.state !== "idle"}
                      variant="primary"
                      type="submit"
                    >
                      <Trans>Load Templates</Trans>
                    </Button>
                  </seedFetcher.Form>
                )}
                <New
                  label={t`Document`}
                  variant={data.length === 0 ? "secondary" : "primary"}
                  to={path.to.newQualityDocument}
                />
              </div>
            )
          }
          renderContextMenu={renderContextMenu}
          title={t`Quality Documents`}
          table="qualityDocument"
          withSavedView
        />
        {deleteDisclosure.isOpen && selectedQualityDocument && (
          <ConfirmDelete
            action={path.to.deleteQualityDocument(selectedQualityDocument.id!)}
            isOpen
            onCancel={() => {
              setSelectedQualityDocument(null);
              deleteDisclosure.onClose();
            }}
            onSubmit={() => {
              setSelectedQualityDocument(null);
              deleteDisclosure.onClose();
            }}
            name={selectedQualityDocument.name ?? "quality document"}
            text={t`Are you sure you want to delete this quality document?`}
          />
        )}
      </>
    );
  }
);

QualityDocumentsTable.displayName = "QualityDocumentsTable";
export default QualityDocumentsTable;
