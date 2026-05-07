import { MenuIcon, MenuItem } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router";
import { New, Table } from "~/components";
import { Enumerable } from "~/components/Enumerable";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

type TemplateRow = {
  id: string;
  name: string;
  description: string | null;
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
          <Enumerable
            value={row.original.name}
            onClick={() =>
              navigate(
                `${path.to.templateDetails(row.original.id)}?${params.toString()}`
              )
            }
            className="cursor-pointer"
          />
        )
      },
      {
        accessorKey: "description",
        header: t`Description`,
        cell: (item) => item.getValue()
      }
    ];
  }, [navigate, params, t]);

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
