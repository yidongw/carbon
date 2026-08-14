import {
  localizeStyleColorName,
  localizeStyleColorNameByName
} from "@carbon/database/style-reference";
import {
  Badge,
  Button,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  HStack,
  MenuIcon,
  MenuItem,
  toast,
  useDisclosure,
  useMount
} from "@carbon/react";

import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  LuCirclePlus,
  LuGroup,
  LuPalette,
  LuPencil,
  LuTrash
} from "react-icons/lu";
import { Link, useFetcher, useNavigate, useRevalidator } from "react-router";
import { MethodIcon, Table, TrackingTypeIcon } from "~/components";
import { ReplenishmentSystemIcon } from "~/components/Icons";
import { ConfirmDelete } from "~/components/Modals";
import { overlay, useOverlay } from "~/components/Overlay";
import { useDateFormatter, usePermissions } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { ItemPostingGroupListItem } from "~/modules/items";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import type { getTemplatesList } from "~/modules/items/template.service";
import { methodType } from "~/modules/shared";
import type { action } from "~/routes/x+/items+/update";
import { usePeople } from "~/stores";
import { path } from "~/utils/path";
import {
  itemReplenishmentSystems,
  itemTrackingTypes
} from "../../items.models";
import type { Style } from "../../types";
import NewStyleOverlayContent from "./NewStyleOverlayContent";
import { warmNewStyleOverlay } from "./newStyleOverlayBridge";
import { buildDefaultStylesTableColumns } from "./stylesTableColumns";
import {
  styleAttributes,
  useStyleAttributeColumnMeta
} from "./useStyleAttributeColumnMeta";

// Keep StyleForm in the styles-page graph and register it for the overlay
// lazy() factory so Add Style does not wait on a cold chunk download.
warmNewStyleOverlay({ default: NewStyleOverlayContent });

type StylesTableProps = {
  data: Style[];
  tags: { name: string }[];
  count: number;
  itemPostingGroups: ItemPostingGroupListItem[];
};

const StylesTable = memo(
  ({ data, tags, count, itemPostingGroups }: StylesTableProps) => {
    const { t, i18n } = useLingui();
    const navigate = useNavigate();
    const permissions = usePermissions();
    const { formatDate } = useDateFormatter();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();

    const openNewStyle = useCallback(() => {
      openOverlay(overlay.to.newStyle(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const deleteItemModal = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<Style | null>(null);

    const [people] = usePeople();
    const customColumns = useCustomColumns<Style>("style");
    const translateReplenishment = useCallback(
      (v: string) =>
        v === "Buy" ? t`Buy` : v === "Make" ? t`Make` : t`Buy and Make`,
      [t]
    );
    const translateMethodType = useCallback(
      (v: string) =>
        v === "Purchase to Order"
          ? t`Purchase to Order`
          : v === "Pull from Inventory"
            ? t`Pull from Inventory`
            : t`Make to Order`,
      [t]
    );
    const translateTrackingType = useCallback(
      (v: string) =>
        v === "Inventory"
          ? t`Inventory`
          : v === "Non-Inventory"
            ? t`Non-Inventory`
            : v === "Serial"
              ? t`Serial`
              : t`Batch`,
      [t]
    );

    const templateFetcher =
      useFetcher<Awaited<ReturnType<typeof getTemplatesList>>>();
    useMount(() => {
      templateFetcher.load(path.to.api.templates);
    });
    const templateOptions = useMemo(
      () =>
        (templateFetcher.data?.data ?? []).map((template) => ({
          value: template.id,
          label: template.name,
          helper: template.description ?? ""
        })),
      [templateFetcher.data?.data]
    );

    const attrColumnMeta = useStyleAttributeColumnMeta(data);

    const columns = useMemo<ColumnDef<Style>[]>(() => {
      const defaultColumns = buildDefaultStylesTableColumns({
        people,
        tags,
        itemPostingGroups,
        templateOptions,
        formatDate,
        translateReplenishment,
        translateMethodType,
        translateTrackingType,
        i18n
      });

      const attrColumns: ColumnDef<Style>[] = attrColumnMeta.map((meta) => {
        const code = meta.code;
        return {
          id: `attr-${code}`,
          header: translateItemAttributeCatalogName(meta.name || code, i18n),
          cell: ({ row }) => {
            const attr = styleAttributes(row.original).find(
              (a) => a.code === code
            );
            const values = attr?.values ?? [];
            if (values.length === 0) {
              return <span className="text-muted-foreground">—</span>;
            }
            return (
              <HStack spacing={1} className="flex-wrap">
                {values.map((v) => (
                  <Badge
                    key={v.id}
                    variant="outline"
                    title={`${meta.name}: ${v.code}`}
                  >
                    {localizeStyleColorName(v.code, i18n.locale) ||
                      localizeStyleColorNameByName(v.name, i18n.locale) ||
                      v.name ||
                      v.code}
                  </Badge>
                ))}
              </HStack>
            );
          },
          meta: { icon: <LuPalette /> }
        };
      });

      // Replace the legacy single Attributes column with per-attribute columns.
      const withoutAttributes = defaultColumns.filter(
        (c) => c.id !== "attributes"
      );
      const insertAt = Math.min(2, withoutAttributes.length);
      const merged = [
        ...withoutAttributes.slice(0, insertAt),
        ...attrColumns,
        ...withoutAttributes.slice(insertAt)
      ];

      return [...merged, ...customColumns];
    }, [
      people,
      tags,
      itemPostingGroups,
      templateOptions,
      formatDate,
      translateReplenishment,
      translateMethodType,
      translateTrackingType,
      i18n,
      customColumns,
      attrColumnMeta
    ]);

    const fetcher = useFetcher<typeof action>();
    useEffect(() => {
      if (fetcher.data?.error) {
        toast.error(fetcher.data.error.message);
      }
    }, [fetcher.data]);

    const onBulkUpdate = useCallback(
      (
        selectedRows: typeof data,
        field:
          | "replenishmentSystem"
          | "defaultMethodType"
          | "itemTrackingType"
          | "itemPostingGroupId",
        value: string
      ) => {
        const formData = new FormData();
        selectedRows.forEach((row) => {
          if (row.id) formData.append("items", row.id);
        });
        formData.append("field", field);
        formData.append("value", value);
        fetcher.submit(formData, {
          method: "post",
          action: path.to.bulkUpdateItems
        });
      },
      [fetcher]
    );

    const renderActions = useCallback(
      (selectedRows: typeof data) => (
        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuLabel>
            <Trans>Update</Trans>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Trans>Item Group</Trans>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {itemPostingGroups.map((group) => (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() =>
                        onBulkUpdate(
                          selectedRows,
                          "itemPostingGroupId",
                          group.id
                        )
                      }
                    >
                      <span>{group.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Trans>Replenishment</Trans>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {itemReplenishmentSystems.map((system) => (
                    <DropdownMenuItem
                      key={system}
                      onClick={() =>
                        onBulkUpdate(
                          selectedRows,
                          "replenishmentSystem",
                          system
                        )
                      }
                    >
                      <DropdownMenuIcon
                        icon={<ReplenishmentSystemIcon type={system} />}
                      />
                      <span>{translateReplenishment(system)}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Trans>Default Method Type</Trans>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {methodType.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() =>
                        onBulkUpdate(selectedRows, "defaultMethodType", type)
                      }
                    >
                      <DropdownMenuIcon icon={<MethodIcon type={type} />} />
                      <span>{translateMethodType(type)}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Trans>Tracking Type</Trans>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {itemTrackingTypes.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() =>
                        onBulkUpdate(selectedRows, "itemTrackingType", type)
                      }
                    >
                      <DropdownMenuIcon
                        icon={<TrackingTypeIcon type={type} />}
                      />
                      <span>{translateTrackingType(type)}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      ),
      [
        itemPostingGroups,
        onBulkUpdate,
        translateMethodType,
        translateReplenishment,
        translateTrackingType
      ]
    );

    const renderContextMenu = useMemo(() => {
      return (row: Style) => (
        <>
          <MenuItem onClick={() => navigate(path.to.style(row.id!))}>
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Style</Trans>
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "parts")}
            destructive
            onClick={() => {
              setSelectedItem(row);
              deleteItemModal.onOpen();
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Style</Trans>
          </MenuItem>
        </>
      );
    }, [deleteItemModal, navigate, permissions]);

    return (
      <>
        <Table<Style>
          count={count}
          columns={columns}
          data={data}
          defaultColumnPinning={{
            left: ["id"]
          }}
          defaultColumnVisibility={{
            description: false,
            active: false,
            createdBy: false,
            createdAt: false,
            updatedBy: false,
            updatedAt: false
          }}
          primaryAction={
            permissions.can("create", "parts") && (
              <div className="flex items-center gap-2">
                <Button variant="secondary" leftIcon={<LuGroup />} asChild>
                  <Link to={path.to.itemPostingGroups}>
                    <Trans>Item Groups</Trans>
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  leftIcon={<LuCirclePlus />}
                  onClick={openNewStyle}
                >
                  <Trans>Add Style</Trans>
                </Button>
              </div>
            )
          }
          renderActions={renderActions}
          renderContextMenu={renderContextMenu}
          getRowHref={(row) => (row.id ? path.to.style(row.id) : undefined)}
          title={t`Styles`}
          table="style"
          withSavedView
          withSelectableRows
        />
        {selectedItem && selectedItem.id && (
          <ConfirmDelete
            action={path.to.deleteItem(selectedItem.id!)}
            isOpen={deleteItemModal.isOpen}
            name={selectedItem.readableIdWithRevision!}
            text={t`Are you sure you want to delete ${selectedItem.readableIdWithRevision!}? This cannot be undone.`}
            onCancel={() => {
              deleteItemModal.onClose();
              setSelectedItem(null);
            }}
            onSubmit={() => {
              deleteItemModal.onClose();
              setSelectedItem(null);
            }}
          />
        )}
      </>
    );
  }
);

StylesTable.displayName = "StylesTable";

export default StylesTable;
