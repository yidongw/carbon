import { localizeStyleColorName } from "@carbon/database/style-reference";
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
    const { t, i18n } = useLingui();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNewValue = useCallback(() => {
      openOverlay(overlay.to.newItemAttributeValue({ attributeId }), {
        onCreated: () => revalidator.revalidate()
      });
    }, [attributeId, openOverlay, revalidator]);

    const openEditValue = useCallback(
      (id: string) => {
        openOverlay(overlay.to.editItemAttributeValue({ attributeId, id }), {
          onCreated: () => revalidator.revalidate()
        });
      },
      [attributeId, openOverlay, revalidator]
    );

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
                className="cursor-pointer"
                onClick={() => openEditValue(row.original.id)}
              >
                <span className="font-mono">{row.original.code}</span>
              </Hyperlink>
            )
        },
        {
          accessorKey: "name",
          header: t`Name`,
          cell: ({ row }) =>
            localizeStyleColorName(row.original.code, i18n.locale) ??
            row.original.name
        },
        {
          accessorKey: "sortOrder",
          header: t`Sort`
        }
      ],
      [openEditValue, t, i18n]
    );

    const renderContextMenu = useCallback(
      (row: ItemAttributeValueRow) => {
        if (row.companyId === null) return null;
        return (
          <>
            <MenuItem
              disabled={!permissions.can("update", "parts")}
              onClick={() => openEditValue(row.id)}
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
      [attributeId, navigate, openEditValue, permissions]
    );

    return (
      <Table<ItemAttributeValueRow>
        data={data}
        columns={columns}
        count={count}
        primaryAction={
          permissions.can("create", "parts") ? (
            <Button
              type="button"
              variant="primary"
              leftIcon={<LuCirclePlus />}
              onClick={openNewValue}
            >
              <Trans>New Value</Trans>
            </Button>
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
