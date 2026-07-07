import { Badge, MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuCircleCheck,
  LuPalette,
  LuPencil,
  LuTag,
  LuTrash
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";
import type { StyleColor } from "../../types";

type StyleColorsTableProps = {
  data: StyleColor[];
  count: number;
};

const StyleColorsTable = memo(({ data, count }: StyleColorsTableProps) => {
  const { t } = useLingui();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    const defaultColumns: ColumnDef<(typeof rows)[number]>[] = [
      {
        accessorKey: "colorCode",
        header: t`Color Code`,
        cell: ({ row }) =>
          row.original.companyId === null ? (
            <span className="font-mono">{row.original.colorCode}</span>
          ) : (
            <Hyperlink
              to={`${path.to.styleColor(row.original.id!)}?${params.toString()}`}
            >
              <span className="font-mono">{row.original.colorCode}</span>
            </Hyperlink>
          ),
        meta: {
          icon: <LuTag />
        }
      },
      {
        accessorKey: "colorName",
        header: t`Color Name`,
        cell: ({ row }) => row.original.colorName,
        meta: {
          icon: <LuPalette />
        }
      },
      {
        accessorKey: "companyId",
        header: t`Standard`,
        cell: ({ row }) =>
          row.original.companyId === null ? (
            <Badge variant="outline">
              <Trans>Standard</Trans>
            </Badge>
          ) : (
            <Badge variant="blue">
              <Trans>Custom</Trans>
            </Badge>
          ),
        meta: {
          icon: <LuCircleCheck />
        }
      }
    ];
    return [...defaultColumns];
  }, [params, t]);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            disabled={
              !permissions.can("update", "parts") || row.companyId === null
            }
            onClick={() => {
              navigate(
                `${path.to.styleColor(row.id!)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Style Color</Trans>
          </MenuItem>
          <MenuItem
            disabled={
              !permissions.can("delete", "parts") || row.companyId === null
            }
            destructive
            onClick={() => {
              navigate(
                `${path.to.deleteStyleColor(row.id!)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Style Color</Trans>
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof rows)[number]>
      data={data}
      columns={columns}
      count={count}
      primaryAction={
        permissions.can("create", "parts") && (
          <New
            label={t`Style Color`}
            to={`${path.to.newStyleColor}?${params.toString()}`}
          />
        )
      }
      renderContextMenu={renderContextMenu}
      title={t`Style Colors`}
    />
  );
});

StyleColorsTable.displayName = "StyleColorsTable";
export default StyleColorsTable;
