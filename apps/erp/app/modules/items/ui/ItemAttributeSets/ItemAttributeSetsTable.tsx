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
    const { t, i18n } = useLingui();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNewSet = useCallback(() => {
      openOverlay(overlay.to.newItemAttributeSet(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const openEditSet = useCallback(
      (id: string) => {
        openOverlay(overlay.to.editItemAttributeSet({ id }), {
          onCreated: () => revalidator.revalidate()
        });
      },
      [openOverlay, revalidator]
    );

    const columns = useMemo<ColumnDef<ItemAttributeSetRow>[]>(
      () => [
        {
          accessorKey: "code",
          header: t`Code`,
          cell: ({ row }) => (
            <Hyperlink
              className="cursor-pointer"
              onClick={() => openEditSet(row.original.id)}
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
                    {a.itemAttribute?.name
                      ? translateItemAttributeCatalogName(
                          a.itemAttribute.name,
                          i18n
                        )
                      : (a.itemAttribute?.code ?? a.attributeId)}
                  </Badge>
                ))}
              </div>
            );
          }
        }
      ],
      [openEditSet, t, i18n]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeSetRow) => {
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() => openEditSet(row.id)}
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
      [navigate, openEditSet, permissions]
    );

    return (
      <Table<ItemAttributeSetRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <Button
              type="button"
              variant="primary"
              leftIcon={<LuCirclePlus />}
              onClick={openNewSet}
            >
              <Trans>New Attribute Set</Trans>
            </Button>
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
