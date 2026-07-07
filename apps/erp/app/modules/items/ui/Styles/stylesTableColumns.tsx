import { Badge, HStack, VStack } from "@carbon/react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  LuAlignJustify,
  LuBookMarked,
  LuCalendar,
  LuCheck,
  LuGroup,
  LuLayoutTemplate,
  LuLoaderCircle,
  LuPalette,
  LuTag,
  LuUser
} from "react-icons/lu";
import { RxCodesandboxLogo } from "react-icons/rx";
import { TbTargetArrow } from "react-icons/tb";
import {
  EmployeeAvatar,
  Hyperlink,
  ItemThumbnail,
  MethodIcon,
  TrackingTypeIcon
} from "~/components";
import { ReplenishmentSystemIcon } from "~/components/Icons";
import { editableCell, TagsCell } from "~/components/InlineEditor";
import type { ItemPostingGroupListItem, Style } from "~/modules/items";
import { methodType } from "~/modules/shared";
import { path } from "~/utils/path";
import {
  itemReplenishmentSystems,
  itemTrackingTypes
} from "../../items.models";
import { defaultStylesTableSharedColumnKeys } from "./stylesTableConfig";

export const STYLE_ITEM_UPDATE = {
  action: path.to.bulkUpdateItems,
  idKey: "items" as const
};

type TemplateOption = {
  value: string;
  label: string;
  helper: string;
};

export type BuildStylesTableColumnsArgs = {
  t: (strings: TemplateStringsArray, ...values: unknown[]) => string;
  people: { id: string; name: string }[];
  tags: { name: string }[];
  itemPostingGroups: ItemPostingGroupListItem[];
  templateOptions: TemplateOption[];
  formatDate: (value: string) => string;
  translateReplenishment: (value: string) => string;
  translateMethodType: (value: string) => string;
  translateTrackingType: (value: string) => string;
};

export function buildDefaultStylesTableColumns({
  t,
  people,
  tags,
  itemPostingGroups,
  templateOptions,
  formatDate,
  translateReplenishment,
  translateMethodType,
  translateTrackingType
}: BuildStylesTableColumnsArgs): ColumnDef<Style>[] {
  const itemPostingGroupOptions = itemPostingGroups.map((group) => ({
    value: group.id,
    label: group.name
  }));

  const columns: ColumnDef<Style>[] = [
    {
      accessorKey: "id",
      header: t`Style ID`,
      cell: ({ row }) => (
        <HStack className="py-1 w-full min-w-0 max-w-[200px]" spacing={2}>
          <ItemThumbnail
            size="md"
            thumbnailPath={row.original.thumbnailPath}
            type="Style"
          />
          <Hyperlink to={path.to.style(row.original.id!)} className="min-w-0">
            <VStack spacing={0} className="min-w-0">
              <span className="w-full truncate">
                {row.original.readableIdWithRevision}
              </span>
              <div className="w-full truncate text-muted-foreground text-xs">
                {row.original.name}
              </div>
            </VStack>
          </Hyperlink>
        </HStack>
      ),
      meta: {
        icon: <LuBookMarked />
      }
    },
    {
      accessorKey: "templateName",
      header: t`Template`,
      cell: editableCell<Style>({
        kind: "picker",
        field: "templateId",
        update: STYLE_ITEM_UPDATE,
        value: (r) => r.templateId,
        clearable: true,
        options: templateOptions,
        fallbackLabel: (r) => r.templateName
      }),
      meta: {
        icon: <LuLayoutTemplate />
      }
    },
    {
      accessorKey: "description",
      header: t`Description`,
      cell: (item) => (
        <div className="max-w-[320px] truncate">{item.getValue<string>()}</div>
      ),
      meta: {
        icon: <LuAlignJustify />
      }
    },
    {
      accessorKey: "replenishmentSystem",
      header: t`Replenishment`,
      cell: editableCell<Style>({
        kind: "enum",
        field: "replenishmentSystem",
        update: STYLE_ITEM_UPDATE,
        value: (r) => r.replenishmentSystem,
        options: itemReplenishmentSystems.map((v) => ({
          value: v,
          label: (
            <span className="flex items-center gap-2">
              <ReplenishmentSystemIcon type={v} />
              {translateReplenishment(v)}
            </span>
          )
        })),
        renderInline: (v) => (
          <Badge variant="secondary">
            <ReplenishmentSystemIcon type={v} className="mr-2" />
            <span>{translateReplenishment(v)}</span>
          </Badge>
        )
      }),
      meta: {
        filter: {
          type: "static",
          options: itemReplenishmentSystems.map((type) => ({
            value: type,
            label: (
              <Badge variant="secondary">
                <ReplenishmentSystemIcon type={type} className="mr-2" />
                <span>{translateReplenishment(type)}</span>
              </Badge>
            )
          }))
        },
        icon: <LuLoaderCircle />
      }
    },
    {
      accessorKey: "defaultMethodType",
      header: t`Default Method`,
      cell: editableCell<Style>({
        kind: "enum",
        field: "defaultMethodType",
        update: STYLE_ITEM_UPDATE,
        value: (r) => r.defaultMethodType,
        options: (row) =>
          methodType
            .filter((type) => {
              const replenishment = row.replenishmentSystem;
              if (replenishment === "Buy") return type !== "Make to Order";
              if (replenishment === "Make") return type !== "Purchase to Order";
              return true;
            })
            .map((type) => ({
              value: type,
              label: (
                <span className="flex items-center gap-2">
                  <MethodIcon type={type} />
                  {translateMethodType(type)}
                </span>
              )
            })),
        renderInline: (v) => (
          <Badge variant="secondary">
            <MethodIcon type={v} className="mr-2" />
            <span>{translateMethodType(v)}</span>
          </Badge>
        )
      }),
      meta: {
        filter: {
          type: "static",
          options: methodType.map((value) => ({
            value,
            label: (
              <Badge variant="secondary">
                <MethodIcon type={value} className="mr-2" />
                <span>{translateMethodType(value)}</span>
              </Badge>
            )
          }))
        },
        icon: <RxCodesandboxLogo />
      }
    },
    {
      accessorKey: "itemTrackingType",
      header: t`Tracking`,
      cell: editableCell<Style>({
        kind: "enum",
        field: "itemTrackingType",
        update: STYLE_ITEM_UPDATE,
        value: (r) => r.itemTrackingType,
        options: itemTrackingTypes.map((v) => ({
          value: v,
          label: (
            <span className="flex items-center gap-2">
              <TrackingTypeIcon type={v} />
              {translateTrackingType(v)}
            </span>
          )
        })),
        renderInline: (v) => (
          <Badge variant="secondary">
            <TrackingTypeIcon type={v} className="mr-2" />
            <span>{translateTrackingType(v)}</span>
          </Badge>
        )
      }),
      meta: {
        filter: {
          type: "static",
          options: itemTrackingTypes.map((type) => ({
            value: type,
            label: (
              <Badge variant="secondary">
                <TrackingTypeIcon type={type} className="mr-2" />
                <span>{translateTrackingType(type)}</span>
              </Badge>
            )
          }))
        },
        icon: <TbTargetArrow />
      }
    },
    {
      accessorKey: "itemPostingGroupId",
      header: t`Item Group`,
      cell: editableCell<Style>({
        kind: "enum",
        field: "itemPostingGroupId",
        update: STYLE_ITEM_UPDATE,
        value: (r) => r.itemPostingGroupId,
        clearable: true,
        options: itemPostingGroupOptions
      }),
      meta: {
        filter: {
          type: "static",
          options: itemPostingGroupOptions.map((group) => ({
            value: group.value,
            label: <Badge variant="secondary">{group.label}</Badge>
          }))
        },
        icon: <LuGroup />
      }
    },
    {
      accessorKey: "colorCode",
      header: t`Color`,
      cell: ({ row }) => (
        <HStack>
          {row.original.colorCode && (
            <span className="font-mono text-sm">{row.original.colorCode}</span>
          )}
          {row.original.colorName && (
            <span className="text-muted-foreground">
              {row.original.colorName}
            </span>
          )}
        </HStack>
      ),
      meta: {
        icon: <LuPalette />
      }
    },
    {
      accessorKey: "tags",
      header: t`Tags`,
      cell: ({ row }) => (
        <TagsCell row={row.original} table="style" availableTags={tags} />
      ),
      meta: {
        filter: {
          type: "static",
          options: tags.map((tag) => ({
            value: tag.name,
            label: <Badge variant="secondary">{tag.name}</Badge>
          })),
          isArray: true
        },
        icon: <LuTag />
      }
    },
    {
      accessorKey: "active",
      header: t`Active`,
      cell: editableCell<Style>({
        kind: "boolean",
        field: "active",
        update: STYLE_ITEM_UPDATE,
        value: (r) => r.active
      }),
      meta: {
        filter: {
          type: "static",
          options: [
            { value: "true", label: t`Active` },
            { value: "false", label: t`Inactive` }
          ]
        },
        pluralHeader: t`Active Statuses`,
        icon: <LuCheck />
      }
    },
    {
      id: "createdBy",
      header: t`Created By`,
      cell: ({ row }) => <EmployeeAvatar employeeId={row.original.createdBy} />,
      meta: {
        filter: {
          type: "static",
          options: people.map((employee) => ({
            value: employee.id,
            label: employee.name
          }))
        },
        icon: <LuUser />
      }
    },
    {
      accessorKey: "createdAt",
      header: t`Created At`,
      cell: (item) => formatDate(item.getValue<string>()),
      meta: {
        icon: <LuCalendar />
      }
    },
    {
      id: "updatedBy",
      header: t`Updated By`,
      cell: ({ row }) => <EmployeeAvatar employeeId={row.original.updatedBy} />,
      meta: {
        filter: {
          type: "static",
          options: people.map((employee) => ({
            value: employee.id,
            label: employee.name
          }))
        },
        icon: <LuUser />
      }
    },
    {
      accessorKey: "updatedAt",
      header: t`Updated At`,
      cell: (item) => formatDate(item.getValue<string>()),
      meta: {
        icon: <LuCalendar />
      }
    }
  ];

  if (columns.length < defaultStylesTableSharedColumnKeys.length) {
    throw new Error("Styles table columns are incomplete");
  }

  return columns;
}
