import {
  HStack,
  MenuIcon,
  MenuItem,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";

import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  LuBookMarked,
  LuCalendar,
  LuCheck,
  LuPalette,
  LuPencil,
  LuTag,
  LuTrash,
  LuUser
} from "react-icons/lu";
import { useFetcher, useNavigate } from "react-router";
import {
  EmployeeAvatar,
  Hyperlink,
  ItemThumbnail,
  New,
  Table
} from "~/components";
import { TagsCell } from "~/components/InlineEditor";
import { ConfirmDelete } from "~/components/Modals";
import { useDateFormatter, usePermissions } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";
import type { Style } from "../../types";

type StylesTableProps = {
  data: Style[];
  count: number;
};

const StylesTable = memo(({ data, count }: StylesTableProps) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const permissions = usePermissions();
  const { formatDate } = useDateFormatter();

  const deleteItemModal = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<Style | null>(null);

  const [people] = usePeople();
  const customColumns = useCustomColumns<Style>("style");

  const columns = useMemo<ColumnDef<Style>[]>(() => {
    const defaultColumns: ColumnDef<Style>[] = [
      {
        accessorKey: "id",
        header: t`Style ID`,
        cell: ({ row }) => (
          <HStack className="py-1 min-w-[200px] truncate">
            <ItemThumbnail
              thumbnailPath={row.original.thumbnailPath}
              type="Style"
            />
            <Hyperlink to={path.to.style(row.original.id!)}>
              <VStack spacing={0}>
                {row.original.readableIdWithRevision}
                <div className="w-full truncate text-muted-foreground text-xs">
                  {row.original.name}
                </div>
              </VStack>
            </Hyperlink>
          </HStack>
        ),
        meta: {
          icon: <LuBookMarked />
        }
      },
      {
        accessorKey: "colorCode",
        header: t`Color`,
        cell: ({ row }) => (
          <HStack>
            {row.original.colorCode && (
              <span className="font-mono text-sm">{row.original.colorCode}</span>
            )}
            {row.original.colorName && (
              <span className="text-muted-foreground">
                {row.original.colorName}
              </span>
            )}
          </HStack>
        ),
        meta: {
          icon: <LuPalette />
        }
      },
      {
        accessorKey: "tags",
        header: t`Tags`,
        cell: ({ row }) => (
          <TagsCell row={row.original} table="style" availableTags={[]} />
        ),
        meta: {
          icon: <LuTag />
        }
      },
      {
        accessorKey: "active",
        header: t`Active`,
        cell: ({ row }) => (row.original.active ? t`Yes` : t`No`),
        meta: {
          filter: {
            type: "static",
            options: [
              { value: "true", label: t`Active` },
              { value: "false", label: t`Inactive` }
            ]
          },
          pluralHeader: t`Active Statuses`,
          icon: <LuCheck />
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
  }, [people, customColumns, t, formatDate]);

  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data?.error) {
      toast.error(fetcher.data.error.message);
    }
  }, [fetcher.data]);

  const renderContextMenu = useMemo(() => {
    return (row: Style) => (
      <>
        <MenuItem onClick={() => navigate(path.to.style(row.id!))}>
          <MenuIcon icon={<LuPencil />} />
          <Trans>Edit Style</Trans>
        </MenuItem>
        <MenuItem
          disabled={!permissions.can("delete", "parts")}
          destructive
          onClick={() => {
            setSelectedItem(row);
            deleteItemModal.onOpen();
          }}
        >
          <MenuIcon icon={<LuTrash />} />
          <Trans>Delete Style</Trans>
        </MenuItem>
      </>
    );
  }, [deleteItemModal, navigate, permissions]);

  return (
    <>
      <Table<Style>
        count={count}
        columns={columns}
        data={data}
        defaultColumnPinning={{
          left: ["id"]
        }}
        defaultColumnVisibility={{
          active: false,
          createdBy: false,
          createdAt: false,
          updatedBy: false,
          updatedAt: false
        }}
        primaryAction={
          permissions.can("create", "parts") && (
            <New label={t`Style`} to={path.to.newStyle} />
          )
        }
        renderContextMenu={renderContextMenu}
        title={t`Styles`}
        table="style"
        withSavedView
        withSelectableRows
      />
      {selectedItem && selectedItem.id && (
        <ConfirmDelete
          action={path.to.deleteItem(selectedItem.id!)}
          isOpen={deleteItemModal.isOpen}
          name={selectedItem.readableIdWithRevision!}
          text={t`Are you sure you want to delete ${selectedItem.readableIdWithRevision!}? This cannot be undone.`}
          onCancel={() => {
            deleteItemModal.onClose();
            setSelectedItem(null);
          }}
          onSubmit={() => {
            deleteItemModal.onClose();
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
});

StylesTable.displayName = "StylesTable";

export default StylesTable;
