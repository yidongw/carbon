import { MenuIcon, MenuItem } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

type TemplateRow = {
  id: string;
  name: string;
  description: string | null;
  configurationParameterCount?: number;
  bomCount?: number;
  bopCount?: number;
};

type TemplatesTableProps = {
  data: TemplateRow[];
  count: number;
};

const TemplatesTable = memo(({ data, count }: TemplatesTableProps) => {
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const { t } = useLingui();
  const permissions = usePermissions();

  const rows = useMemo(() => data, [data]);

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: t`Name`,
        cell: ({ row }) => (
          <Hyperlink
            to={`${path.to.templateDetails(row.original.id)}?${params.toString()}`}
          >
            <span className="truncate">{row.original.name}</span>
          </Hyperlink>
        )
      },
      {
        accessorKey: "configurationParameterCount",
        header: t`Config Params`,
        cell: ({ row }) => row.original.configurationParameterCount ?? 0
      },
      {
        accessorKey: "bomCount",
        header: t`BOM`,
        cell: ({ row }) => row.original.bomCount ?? 0
      },
      {
        accessorKey: "bopCount",
        header: t`BOP`,
        cell: ({ row }) => row.original.bopCount ?? 0
      },
      {
        accessorKey: "description",
        header: t`Description`,
        cell: (item) => item.getValue()
      }
    ];
  }, [params, t]);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            disabled={!permissions.can("view", "parts")}
            onClick={() => {
              navigate(
                `${path.to.templateDetails(row.id)}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<LuPencil />} />
            {t`Open Template`}
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions, t]
  );

  return (
    <Table<(typeof rows)[number]>
      data={data}
      columns={columns}
      count={count}
      primaryAction={
        permissions.can("create", "parts") && (
          <New
            label={t`Template`}
            to={`${path.to.templates}/new?${params.toString()}`}
          />
        )
      }
      renderContextMenu={renderContextMenu}
      title={t`Templates`}
    />
  );
});

TemplatesTable.displayName = "TemplatesTable";
export default TemplatesTable;
