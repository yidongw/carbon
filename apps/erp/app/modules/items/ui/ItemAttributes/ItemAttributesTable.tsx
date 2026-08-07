import { Button, MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuCirclePlus, LuList, LuPencil, LuTrash } from "react-icons/lu";
import { useNavigate, useRevalidator } from "react-router";
import { Hyperlink, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { translateItemAttributeCatalogName } from "../../itemAttributeDisplayName";

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
    const { t, i18n } = useLingui();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNewAttribute = useCallback(() => {
      openOverlay(overlay.to.newItemAttribute(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

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
          header: t`Name`,
          cell: ({ row }) =>
            translateItemAttributeCatalogName(row.original.name, i18n)
        },
        {
          accessorKey: "sortOrder",
          header: t`Sort`
        }
      ],
      [t, i18n]
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
                  onClick={() =>
                    openOverlay(overlay.to.editItemAttribute({ id: row.id }), {
                      onCreated: () => revalidator.revalidate()
                    })
                  }
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
      [navigate, openOverlay, permissions, revalidator]
    );

    return (
      <Table<ItemAttributeRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <Button
              type="button"
              variant="primary"
              leftIcon={<LuCirclePlus />}
              onClick={openNewAttribute}
            >
              <Trans>New Attribute</Trans>
            </Button>
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
