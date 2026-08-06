import { Badge, MenuIcon, MenuItem } from "@carbon/react";
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
  itemAttributeSetAttribute?: Array<{
    attributeId: string;
    sortOrder?: number;
    itemAttribute?: { id: string; code: string; name: string } | null;
  }> | null;
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
          cell: ({ row }) => (
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
          cell: ({ row }) => {
            const attrs = [
              ...(row.original.itemAttributeSetAttribute ?? [])
            ].sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100));
            if (attrs.length === 0) {
              return <span className="text-muted-foreground">—</span>;
            }
            return (
              <div className="flex flex-wrap items-center gap-1">
                {attrs.map((a) => (
                  <Badge key={a.attributeId} variant="secondary">
                    {a.itemAttribute?.name ??
                      a.itemAttribute?.code ??
                      a.attributeId}
                  </Badge>
                ))}
              </div>
            );
          }
        }
      ],
      [t]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeSetRow) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() => navigate(path.to.itemAttributeSet(row.id))}
            >
              <MenuIcon icon={<LuPencil />} />
              <Trans>Edit</Trans>
            </MenuItem>
            {row.companyId !== null ? (
              <MenuItem
                disabled={!permissions.can("delete", "parts")}
                destructive
                onClick={() => navigate(path.to.deleteItemAttributeSet(row.id))}
              >
                <MenuIcon icon={<LuTrash />} />
                <Trans>Delete</Trans>
              </MenuItem>
            ) : null}
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
