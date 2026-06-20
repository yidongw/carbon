import { Badge, Button, HStack, MenuIcon, MenuItem, Switch } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuFlaskConical,
  LuPencil,
  LuShieldCheck,
  LuTrash,
  LuUsers
} from "react-icons/lu";
import { useNavigate, useSubmit } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import { path } from "~/utils/path";

export type JobRule = {
  id: string | null;
  name: string | null;
  description: string | null;
  targetGroupId: string | null;
  targetGroupName: string | null;
  priority: number | null;
  active: boolean | null;
  conditions: unknown;
};

type JobRulesTableProps = {
  data: JobRule[];
  count: number;
};

const JobRulesTable = memo(({ data, count }: JobRulesTableProps) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const submit = useSubmit();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<JobRule>[]>(
    () => [
      {
        accessorKey: "priority",
        header: t`Priority`,
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground text-sm">
            #{row.original.priority ?? 0}
          </span>
        ),
        size: 80
      },
      {
        accessorKey: "name",
        header: t`Rule Name`,
        cell: ({ row }) => (
          <div>
            {row.original.id ? (
              <Hyperlink to={path.to.jobRule(row.original.id)}>
                <div className="font-medium text-sm">{row.original.name}</div>
              </Hyperlink>
            ) : (
              <div className="font-medium text-sm">{row.original.name}</div>
            )}
            {row.original.description && (
              <div className="text-xs text-muted-foreground truncate max-w-64">
                {row.original.description}
              </div>
            )}
          </div>
        ),
        meta: { icon: <LuShieldCheck /> }
      },
      {
        accessorKey: "targetGroupName",
        header: t`Assigned Group`,
        cell: ({ row }) => (
          <HStack spacing={1}>
            <LuUsers className="size-3.5 text-muted-foreground" />
            <span className="text-sm">{row.original.targetGroupName ?? "—"}</span>
          </HStack>
        ),
        meta: { icon: <LuUsers /> }
      },
      {
        id: "conditionCount",
        header: t`Conditions`,
        cell: ({ row }) => {
          const conds = Array.isArray(row.original.conditions)
            ? row.original.conditions
            : [];
          return (
            <Badge variant="outline">
              {conds.length} {conds.length === 1 ? t`condition` : t`conditions`}
            </Badge>
          );
        }
      },
      {
        accessorKey: "active",
        header: t`Active`,
        cell: ({ row }) => (
          <Switch
            checked={row.original.active ?? false}
            onCheckedChange={(checked) => {
              if (!row.original.id || !permissions.can("update", "production")) return;
              const formData = new FormData();
              formData.append("id", row.original.id);
              formData.append("active", checked ? "on" : "off");
              formData.append("_action", "toggle");
              submit(formData, {
                method: "post",
                action: path.to.jobRule(row.original.id)
              });
            }}
            disabled={!permissions.can("update", "production")}
          />
        )
      }
    ],
    [t, permissions, submit]
  );

  const renderContextMenu = useCallback(
    (row: JobRule) => {
      if (!row.id) return null;
      return (
        <>
          <MenuItem
            disabled={!permissions.can("update", "production")}
            onClick={() =>
              navigate(`${path.to.jobRule(row.id!)}?${params.toString()}`)
            }
          >
            <MenuIcon icon={<LuPencil />} />
            <Trans>Edit Rule</Trans>
          </MenuItem>
          <MenuItem
            destructive
            disabled={!permissions.can("delete", "production")}
            onClick={() =>
              navigate(
                `${path.to.deleteJobRule(row.id!)}?${params.toString()}`
              )
            }
          >
            <MenuIcon icon={<LuTrash />} />
            <Trans>Delete Rule</Trans>
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<JobRule>
      data={data}
      count={count}
      columns={columns}
      getRowHref={(row) => (row.id ? path.to.jobRule(row.id) : undefined)}
      primaryAction={
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<LuFlaskConical />}
            onClick={() =>
              navigate(`${path.to.jobRulesSimulate}?${params.toString()}`)
            }
          >
            <Trans>Simulate</Trans>
          </Button>
          {permissions.can("create", "production") && (
            <New label={t`Rule`} to={`new?${params.toString()}`} />
          )}
        </HStack>
      }
      renderContextMenu={renderContextMenu}
      withSearch
      withPagination
      title={t`Assignment Rules`}
    />
  );
});

JobRulesTable.displayName = "JobRulesTable";
export default JobRulesTable;
