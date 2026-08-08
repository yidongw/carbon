import { localizeStyleColorName } from "@carbon/database/style-reference";
import { Badge, Button, MenuIcon, MenuItem } from "@carbon/react";
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

type ItemAttributeRow = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  companyId: string | null;
  itemAttributeValue?: Array<{
    id: string;
    code: string;
    name: string;
    sortOrder?: number;
    companyId?: string | null;
  }> | null;
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

    const openEditAttribute = useCallback(
      (id: string) => {
        openOverlay(overlay.to.editItemAttribute({ id }), {
          onCreated: () => revalidator.revalidate()
        });
      },
      [openOverlay, revalidator]
    );

    const columns = useMemo<ColumnDef<ItemAttributeRow>[]>(
      () => [
        {
          accessorKey: "code",
          header: t`Code`,
          cell: ({ row }) => (
            <Hyperlink
              className="cursor-pointer"
              onClick={() => openEditAttribute(row.original.id)}
            >
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
          id: "values",
          header: t`Values`,
          cell: ({ row }) => {
            const values = [...(row.original.itemAttributeValue ?? [])].sort(
              (a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100)
            );
            if (values.length === 0) {
              return <span className="text-muted-foreground">—</span>;
            }
            return (
              <div className="flex flex-wrap items-center gap-1">
                {values.map((v) => (
                  <Badge key={v.id} variant="secondary">
                    {localizeStyleColorName(v.code, i18n.locale) ?? v.name}
                  </Badge>
                ))}
              </div>
            );
          }
        }
      ],
      [openEditAttribute, t, i18n]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeRow) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() => openEditAttribute(row.id)}
            >
              <MenuIcon icon={<LuPencil />} />
              <Trans>Edit</Trans>
            </MenuItem>
            {row.companyId !== null ? (
              <MenuItem
                disabled={!permissions.can("delete", "parts")}
                destructive
                onClick={() => navigate(path.to.deleteItemAttribute(row.id))}
              >
                <MenuIcon icon={<LuTrash />} />
                <Trans>Delete</Trans>
              </MenuItem>
            ) : null}
          </>
        );
      },
      [navigate, openEditAttribute, permissions]
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
