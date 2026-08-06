import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuList, LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

type ItemAttributeRow = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  companyId: string | null;
};

type ItemAttributesTableProps = {
  data: ItemAttributeRow[];
  count: number;
};

const ItemAttributesTable = memo(
  ({ data, count }: ItemAttributesTableProps) => {
    const { t } = useLingui();
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();

    const columns = useMemo<ColumnDef<ItemAttributeRow>[]>(
      () => [
        {
          accessorKey: "code",
          header: t`Code`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.itemAttributeValues(row.original.id)}>
              <span className="font-mono">{row.original.code}</span>
            </Hyperlink>
          )
        },
        {
          accessorKey: "name",
          header: t`Name`
        },
        {
          accessorKey: "sortOrder",
          header: t`Sort`
        }
      ],
      [t]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeRow) => {
        return (
          <>
            <MenuItem
              onClick={() => navigate(path.to.itemAttributeValues(row.id))}
            >
              <MenuIcon icon={<LuList />} />
              <Trans>Values</Trans>
            </MenuItem>
            {row.companyId !== null ? (
              <>
                <MenuItem
                  disabled={!permissions.can("update", "parts")}
                  onClick={() => navigate(path.to.itemAttribute(row.id))}
                >
                  <MenuIcon icon={<LuPencil />} />
                  <Trans>Edit</Trans>
                </MenuItem>
                <MenuItem
                  disabled={!permissions.can("delete", "parts")}
                  destructive
                  onClick={() => navigate(path.to.deleteItemAttribute(row.id))}
                >
                  <MenuIcon icon={<LuTrash />} />
                  <Trans>Delete</Trans>
                </MenuItem>
              </>
            ) : null}
          </>
        );
      },
      [navigate, permissions]
    );

    return (
      <Table<ItemAttributeRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <New label={t`Attribute`} to={`new?${params.toString()}`} />
          ) : undefined
        }
        renderContextMenu={renderContextMenu}
        title={t`Attributes`}
        table="itemAttribute"
        withSavedView
        withSearch
      />
    );
  }
);

ItemAttributesTable.displayName = "ItemAttributesTable";
export default ItemAttributesTable;
