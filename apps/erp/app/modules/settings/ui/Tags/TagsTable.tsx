import { Button, MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuCirclePlus, LuTrash } from "react-icons/lu";
import { useNavigate, useRevalidator } from "react-router";
import { Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { tagTableLabels, type Tag } from "~/modules/shared";
import { path } from "~/utils/path";

type TagsTableProps = {
  data: Tag[];
  count: number;
};

const TagsTable = memo(({ data, count }: TagsTableProps) => {
  const navigate = useNavigate();
  const { t } = useLingui();
  const permissions = usePermissions();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();

  const openNewTag = useCallback(() => {
    openOverlay(overlay.to.newTag(), {
      onCreated: () => revalidator.revalidate()
    });
  }, [openOverlay, revalidator]);

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: t`Name`,
        cell: ({ row }) => <Enumerable value={row.original.name} />
      },
      {
        accessorKey: "table",
        header: t`Applies to`,
        cell: ({ row }) =>
          tagTableLabels[row.original.table] ?? row.original.table
      }
    ];
  }, [t]);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <MenuItem
          destructive
          disabled={!permissions.can("update", "settings")}
          onClick={() => {
            navigate(path.to.deleteTag(row.table, row.name));
          }}
        >
          <MenuIcon icon={<LuTrash />} />
          Delete Tag
        </MenuItem>
      );
    },
    [navigate, permissions]
  );

  return (
    <Table<(typeof rows)[number]>
      data={data}
      columns={columns}
      count={count}
      primaryAction={
        permissions.is("employee") && (
          <Button
            type="button"
            variant="primary"
            leftIcon={<LuCirclePlus />}
            onClick={openNewTag}
          >
            <Trans>Add Tag</Trans>
          </Button>
        )
      }
      renderContextMenu={renderContextMenu}
      title={t`Tags`}
    />
  );
});

TagsTable.displayName = "TagsTable";
export default TagsTable;
