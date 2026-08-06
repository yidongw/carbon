import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

type ItemAttributeSetRow = {
  id: string;
  code: string;
  name: string;
  companyId: string | null;
  itemAttributeSetAttribute?: Array<{ attributeId: string }> | null;
};

type ItemAttributeSetsTableProps = {
  data: ItemAttributeSetRow[];
  count: number;
};

const ItemAttributeSetsTable = memo(
  ({ data, count }: ItemAttributeSetsTableProps) => {
    const { t } = useLingui();
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();

    const columns = useMemo<ColumnDef<ItemAttributeSetRow>[]>(
      () => [
        {
          accessorKey: "code",
          header: t`Code`,
          cell: ({ row }) =>
            row.original.companyId === null ? (
              <span className="font-mono">{row.original.code}</span>
            ) : (
              <Hyperlink to={path.to.itemAttributeSet(row.original.id)}>
                <span className="font-mono">{row.original.code}</span>
              </Hyperlink>
            )
        },
        {
          accessorKey: "name",
          header: t`Name`
        },
        {
          id: "attributes",
          header: t`Attributes`,
          cell: ({ row }) => row.original.itemAttributeSetAttribute?.length ?? 0
        }
      ],
      [t]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeSetRow) => {
        if (row.companyId === null) return null;
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() => navigate(path.to.itemAttributeSet(row.id))}
            >
              <MenuIcon icon={<LuPencil />} />
              <Trans>Edit</Trans>
            </MenuItem>
            <MenuItem
              disabled={!permissions.can("delete", "parts")}
              destructive
              onClick={() => navigate(path.to.deleteItemAttributeSet(row.id))}
            >
              <MenuIcon icon={<LuTrash />} />
              <Trans>Delete</Trans>
            </MenuItem>
          </>
        );
      },
      [navigate, permissions]
    );

    return (
      <Table<ItemAttributeSetRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <New label={t`Attribute Set`} to={`new?${params.toString()}`} />
          ) : undefined
        }
        renderContextMenu={renderContextMenu}
        title={t`Attribute Sets`}
        table="itemAttributeSet"
        withSavedView
        withSearch
      />
    );
  }
);

ItemAttributeSetsTable.displayName = "ItemAttributeSetsTable";
export default ItemAttributeSetsTable;
