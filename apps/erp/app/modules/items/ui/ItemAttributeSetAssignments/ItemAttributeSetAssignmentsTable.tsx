import { MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

type ItemAttributeSetAssignmentRow = {
  id: string;
  itemType: string;
  attributeSetId: string;
  companyId: string | null;
  itemAttributeSet?: { id: string; code: string; name: string } | null;
};

type ItemAttributeSetAssignmentsTableProps = {
  data: ItemAttributeSetAssignmentRow[];
  count: number;
};

const ItemAttributeSetAssignmentsTable = memo(
  ({ data, count }: ItemAttributeSetAssignmentsTableProps) => {
    const { t } = useLingui();
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();

    const columns = useMemo<ColumnDef<ItemAttributeSetAssignmentRow>[]>(
      () => [
        {
          accessorKey: "itemType",
          header: t`Item Type`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.itemAttributeSetAssignment(row.original.id)}>
              {row.original.itemType}
            </Hyperlink>
          )
        },
        {
          id: "attributeSet",
          header: t`Attribute Set`,
          cell: ({ row }) => {
            const set = row.original.itemAttributeSet;
            return set ? (
              <span>
                <span className="font-mono">{set.code}</span>
                <span className="text-muted-foreground"> — {set.name}</span>
              </span>
            ) : (
              <span className="font-mono text-muted-foreground">
                {row.original.attributeSetId}
              </span>
            );
          }
        }
      ],
      [t]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeSetAssignmentRow) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() =>
                navigate(path.to.itemAttributeSetAssignment(row.id))
              }
            >
              <MenuIcon icon={<LuPencil />} />
              <Trans>Edit</Trans>
            </MenuItem>
            <MenuItem
              disabled={!permissions.can("delete", "parts")}
              destructive
              onClick={() =>
                navigate(path.to.deleteItemAttributeSetAssignment(row.id))
              }
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
      <Table<ItemAttributeSetAssignmentRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <New label={t`Set Assignment`} to={`new?${params.toString()}`} />
          ) : undefined
        }
        renderContextMenu={renderContextMenu}
        title={t`Set Assignments`}
        table="itemAttributeSetAssignment"
        withSavedView
        withSearch
      />
    );
  }
);

ItemAttributeSetAssignmentsTable.displayName =
  "ItemAttributeSetAssignmentsTable";
export default ItemAttributeSetAssignmentsTable;
