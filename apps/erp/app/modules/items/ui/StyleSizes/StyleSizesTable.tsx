import { Badge, MenuIcon, MenuItem } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuCircleCheck,
  LuPencil,
  LuRuler,
  LuTag,
  LuTrash
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";
import type { StyleSize } from "../../types";

type StyleSizesTableProps = {
  data: StyleSize[];
  count: number;
};

const StyleSizesTable = memo(({ data, count }: StyleSizesTableProps) => {
  const { t } = useLingui();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    const defaultColumns: ColumnDef<(typeof rows)[number]>[] = [
      {
        accessorKey: "sizeCode",
        header: t`Size Code`,
        cell: ({ row }) =>
          row.original.companyId === null ? (
            <span className="font-mono">{row.original.sizeCode}</span>
          ) : (
            <Hyperlink
              to={`${path.to.styleSize(row.original.id!)}?${params.toString()}`}
            >
              <span className="font-mono">{row.original.sizeCode}</span>
            </Hyperlink>
          ),
        meta: {
          icon: <LuTag />
        }
      },
      {
        accessorKey: "sizeName",
        header: t`Size Name`,
        cell: ({ row }) => row.original.sizeName,
        meta: {
          icon: <LuRuler />
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
              navigate(`${path.to.styleSize(row.id!)}?${params.toString()}`);
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Style Size</Trans>
          </MenuItem>
          <MenuItem
            disabled={
              !permissions.can("delete", "parts") || row.companyId === null
            }
            destructive
            onClick={() => {
              navigate(
                `${path.to.deleteStyleSize(row.id!)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Style Size</Trans>
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
            label={t`Style Size`}
            to={`${path.to.newStyleSize}?${params.toString()}`}
          />
        )
      }
      renderContextMenu={renderContextMenu}
      title={t`Style Sizes`}
    />
  );
});

StyleSizesTable.displayName = "StyleSizesTable";
export default StyleSizesTable;
