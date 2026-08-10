import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import { Trans, useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import {
  LuCircleCheckBig,
  LuCircleDashed,
  LuClipboardList,
  LuHash,
  LuPackageOpen,
  LuUser
} from "react-icons/lu";
import { EmployeeAvatarGroup, Table } from "~/components";
import { OperationStatusIcon } from "~/components/Icons";
import type { MasterProcess } from "~/modules/production";
import { usePeople } from "~/stores";
import {
  useJobOperationStatusLabel,
  useStyleProcessLabel
} from "../../productionLabels";
import type { JobOperation } from "../../types";

type MasterProcessesTableProps = {
  data: MasterProcess[];
  // Hide the table's header row (title + toolbar) — e.g. inside a modal.
  withHeader?: boolean;
};

const MasterProcessesTable = memo(
  ({ data, withHeader = true }: MasterProcessesTableProps) => {
    const { t, i18n } = useLingui();
    const getOperationStatusLabel = useJobOperationStatusLabel();
    const styleProcessLabel = useStyleProcessLabel();
    const [people] = usePeople();
    const dateFormatter = useDateFormatter({
      dateStyle: "medium",
      timeStyle: "short"
    });

    const peopleById = useMemo(
      () => new Map(people.map((p) => [p.id, p.name])),
      [people]
    );
    const formatDate = (value: string | null) =>
      value ? dateFormatter.format(new Date(value)) : "—";

    // Each bundle row shows this operation's status (Todo / In Progress / Done),
    // mirroring the operations tab — not the bundle work order's lifecycle status.
    const renderOperationStatus = (value: string | null) => {
      if (!value) return "—";
      const status = value as JobOperation["status"];
      return (
        <span className="inline-flex items-center gap-1.5">
          <OperationStatusIcon status={status} />
          {getOperationStatusLabel(status)}
        </span>
      );
    };

    const columns = useMemo<ColumnDef<MasterProcess>[]>(() => {
      return [
        {
          accessorKey: "description",
          header: t`Process`,
          cell: ({ row }) =>
            styleProcessLabel(row.original.description, row.original.isCutting),
          meta: { icon: <LuClipboardList /> }
        },
        {
          id: "assignee",
          header: t`Assignee`,
          cell: ({ row }) => {
            // Bundle-sourced processes (assembly etc.) show a stacked group of the
            // distinct bundle assignees; a master-owned process (cutting) shows its
            // single operation assignee.
            const employeeIds =
              row.original.bundleCount > 0
                ? Array.from(
                    new Set(
                      row.original.bundles
                        .map((b) => b.assignee)
                        .filter((id): id is string => Boolean(id))
                    )
                  )
                : row.original.assignee
                  ? [row.original.assignee]
                  : [];
            if (employeeIds.length === 0) return "—";
            return <EmployeeAvatarGroup employeeIds={employeeIds} />;
          },
          meta: { icon: <LuUser /> }
        },
        {
          accessorKey: "bundleCount",
          header: t`Bundles`,
          cell: ({ row }) => row.original.bundleCount,
          meta: { icon: <LuPackageOpen /> }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => row.original.quantity,
          meta: { icon: <LuHash /> }
        },
        {
          accessorKey: "reportedQuantity",
          header: t`Reported`,
          cell: ({ row }) => row.original.reportedQuantity,
          meta: { icon: <LuCircleCheckBig /> }
        },
        {
          id: "remaining",
          header: t`Remaining`,
          cell: ({ row }) =>
            Math.max(0, row.original.quantity - row.original.reportedQuantity),
          meta: { icon: <LuCircleDashed /> }
        }
      ];
    }, [t, styleProcessLabel]);

    const renderExpandedRow = (process: MasterProcess) => (
      <div className="w-full py-1">
        {/* Desktop: full table */}
        <div className="hidden md:block overflow-x-auto pl-10 pr-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground text-left border-b border-border">
                <th className="py-2 pr-4 font-medium">
                  <Trans>Bundle</Trans>
                </th>
                <th className="py-2 pr-4 font-medium">
                  <Trans>Attributes</Trans>
                </th>
                <th className="py-2 pr-4 font-medium">
                  <Trans>Assignee</Trans>
                </th>
                <th className="py-2 pr-4 font-medium">
                  <Trans>Assigned At</Trans>
                </th>
                <th className="py-2 pr-4 font-medium text-right">
                  <Trans>Reported</Trans>
                </th>
                <th className="py-2 pr-4 font-medium text-right">
                  <Trans>Remaining</Trans>
                </th>
                <th className="py-2 pr-4 font-medium">
                  <Trans>Status</Trans>
                </th>
              </tr>
            </thead>
            <tbody>
              {process.bundles.map((bundle) => (
                <tr
                  key={bundle.bundleWorkOrderId}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-2 pr-4 font-medium">
                    {bundle.jobReadableId}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {localizeVariantAttributeLabel(
                      bundle.attributeLabel,
                      i18n.locale
                    ) || "—"}
                  </td>
                  <td className="py-2 pr-4">
                    {bundle.assignee
                      ? (peopleById.get(bundle.assignee) ?? bundle.assignee)
                      : "—"}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {formatDate(bundle.assignedAt)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {bundle.reportedQuantity} / {bundle.quantity}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {bundle.remainingQuantity}
                  </td>
                  <td className="py-2 pr-4">
                    {renderOperationStatus(bundle.operationStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one stacked card per bundle */}
        <div className="md:hidden flex flex-col gap-2 p-3">
          {process.bundles.map((bundle) => (
            <div
              key={bundle.bundleWorkOrderId}
              className="rounded-md border border-border bg-card p-3 text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">
                  {bundle.jobReadableId}
                </span>
                {renderOperationStatus(bundle.operationStatus)}
              </div>
              <div className="text-xs text-muted-foreground">
                {localizeVariantAttributeLabel(
                  bundle.attributeLabel,
                  i18n.locale
                ) || "—"}
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">
                    <Trans>Assignee</Trans>
                  </dt>
                  <dd>
                    {bundle.assignee
                      ? (peopleById.get(bundle.assignee) ?? bundle.assignee)
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    <Trans>Assigned At</Trans>
                  </dt>
                  <dd>{formatDate(bundle.assignedAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    <Trans>Reported</Trans>
                  </dt>
                  <dd>
                    {bundle.reportedQuantity} / {bundle.quantity}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    <Trans>Remaining</Trans>
                  </dt>
                  <dd>{bundle.remainingQuantity}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <Table<MasterProcess>
        compact
        data={data}
        columns={columns}
        count={data.length}
        renderExpandedRow={renderExpandedRow}
        getRowCanExpand={(process) => process.bundleCount > 0}
        title={t`Processes`}
        withHeader={withHeader}
      />
    );
  }
);

MasterProcessesTable.displayName = "MasterProcessesTable";
export default MasterProcessesTable;
