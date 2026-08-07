import { Button, MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuCirclePlus, LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate, useRevalidator } from "react-router";
import { Hyperlink, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { translateItemAttributeCatalogName } from "../../itemAttributeDisplayName";

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
    const { t, i18n } = useLingui();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNewAssignment = useCallback(() => {
      openOverlay(overlay.to.newItemAttributeSetAssignment(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const openEditAssignment = useCallback(
      (id: string) => {
        openOverlay(overlay.to.editItemAttributeSetAssignment({ id }), {
          onCreated: () => revalidator.revalidate()
        });
      },
      [openOverlay, revalidator]
    );

    const columns = useMemo<ColumnDef<ItemAttributeSetAssignmentRow>[]>(
      () => [
        {
          accessorKey: "itemType",
          header: t`Item Type`,
          cell: ({ row }) => (
            <Hyperlink
              className="cursor-pointer"
              onClick={() => openEditAssignment(row.original.id)}
            >
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
                <span className="text-muted-foreground">
                  {" "}
                  — {translateItemAttributeCatalogName(set.name, i18n)}
                </span>
              </span>
            ) : (
              <span className="font-mono text-muted-foreground">
                {row.original.attributeSetId}
              </span>
            );
          }
        }
      ],
      [openEditAssignment, t, i18n]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeSetAssignmentRow) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() => openEditAssignment(row.id)}
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
      [navigate, openEditAssignment, permissions]
    );

    return (
      <Table<ItemAttributeSetAssignmentRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <Button
              type="button"
              variant="primary"
              leftIcon={<LuCirclePlus />}
              onClick={openNewAssignment}
            >
              <Trans>New Set Assignment</Trans>
            </Button>
          ) : undefined
        }
        renderContextMenu={renderContextMenu}
        title={t`Item Attribute Sets`}
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
