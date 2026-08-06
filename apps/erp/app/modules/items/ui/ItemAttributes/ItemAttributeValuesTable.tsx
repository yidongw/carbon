import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

type ItemAttributeValueRow = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  companyId: string | null;
};

type ItemAttributeValuesTableProps = {
  attributeId: string;
  attributeName: string;
  data: ItemAttributeValueRow[];
  count: number;
};

const ItemAttributeValuesTable = memo(
  ({
    attributeId,
    attributeName,
    data,
    count
  }: ItemAttributeValuesTableProps) => {
    const { t } = useLingui();
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();

    const columns = useMemo<ColumnDef<ItemAttributeValueRow>[]>(
      () => [
        {
          accessorKey: "code",
          header: t`Code`,
          cell: ({ row }) =>
            row.original.companyId === null ? (
              <span className="font-mono">{row.original.code}</span>
            ) : (
              <Hyperlink
                to={path.to.itemAttributeValue(attributeId, row.original.id)}
              >
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
      [attributeId, t]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeValueRow) => {
        if (row.companyId === null) return null;
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() =>
                navigate(path.to.itemAttributeValue(attributeId, row.id))
              }
            >
              <MenuIcon icon={<LuPencil />} />
              <Trans>Edit</Trans>
            </MenuItem>
            <MenuItem
              disabled={!permissions.can("delete", "parts")}
              destructive
              onClick={() =>
                navigate(path.to.deleteItemAttributeValue(attributeId, row.id))
              }
            >
              <MenuIcon icon={<LuTrash />} />
              <Trans>Delete</Trans>
            </MenuItem>
          </>
        );
      },
      [attributeId, navigate, permissions]
    );

    return (
      <Table<ItemAttributeValueRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <New
              label={t`Value`}
              to={`${path.to.newItemAttributeValue(attributeId)}?${params.toString()}`}
            />
          ) : undefined
        }
        renderContextMenu={renderContextMenu}
        title={`${attributeName} — ${t`Values`}`}
        table="itemAttributeValue"
        withSavedView
        withSearch
      />
    );
  }
);

ItemAttributeValuesTable.displayName = "ItemAttributeValuesTable";
export default ItemAttributeValuesTable;
