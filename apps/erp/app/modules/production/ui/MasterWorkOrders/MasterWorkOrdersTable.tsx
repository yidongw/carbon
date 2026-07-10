import { Button } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import {
  LuCalendar,
  LuCirclePlay,
  LuCirclePlus,
  LuHash,
  LuShirt
} from "react-icons/lu";
import { useRevalidator } from "react-router";
import { Hyperlink, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { useDateFormatter, usePermissions } from "~/hooks";
import type { MasterWorkOrder } from "~/modules/production";
import { path } from "~/utils/path";
import { jobStatus } from "../../production.models";
import JobStatus from "../Jobs/JobStatus";

type MasterWorkOrdersTableProps = {
  data: MasterWorkOrder[];
  count: number;
};

const MasterWorkOrdersTable = memo(
  ({ data, count }: MasterWorkOrdersTableProps) => {
    const { t } = useLingui();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();
    const { formatDate } = useDateFormatter();

    const openNew = useCallback(() => {
      openOverlay(overlay.to.newMasterWorkOrder(), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator]);

    const rows = useMemo(() => data, [data]);

    const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
      return [
        {
          accessorKey: "readableIdWithRevision",
          header: t`Style`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.masterWorkOrder(row.original.id!)}>
              {row.original.readableIdWithRevision ?? row.original.itemName}
            </Hyperlink>
          ),
          meta: { icon: <LuShirt /> }
        },
        {
          accessorKey: "itemName",
          header: t`Name`,
          cell: ({ row }) => row.original.itemName,
          meta: { icon: <LuShirt /> }
        },
        {
          accessorKey: "jobReadableId",
          header: t`Job`,
          cell: ({ row }) => row.original.jobReadableId,
          meta: { icon: <LuCirclePlay /> }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => row.original.quantity,
          meta: { icon: <LuHash /> }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: ({ row }) => (
            <JobStatus
              status={row.original.status as (typeof jobStatus)[number]}
            />
          ),
          meta: {
            icon: <LuCirclePlay />,
            filter: {
              type: "static",
              options: jobStatus.map((status) => ({
                label: <JobStatus status={status} />,
                value: status
              }))
            }
          }
        },
        {
          accessorKey: "dueDate",
          header: t`Due Date`,
          cell: ({ row }) =>
            row.original.dueDate ? formatDate(row.original.dueDate) : "—",
          meta: { icon: <LuCalendar /> }
        }
      ];
    }, [t, formatDate]);

    return (
      <Table<(typeof rows)[number]>
        data={data}
        columns={columns}
        count={count}
        defaultColumnPinning={{ left: ["readableIdWithRevision"] }}
        getRowHref={(row) =>
          row.id ? path.to.masterWorkOrder(row.id) : undefined
        }
        primaryAction={
          permissions.can("create", "production") && (
            <Button
              type="button"
              variant="primary"
              leftIcon={<LuCirclePlus />}
              onClick={openNew}
            >
              <Trans>New Master Work Order</Trans>
            </Button>
          )
        }
        title={t`Master Work Orders`}
        table="masterWorkOrder"
        withSavedView
        withSelectableRows
      />
    );
  }
);

MasterWorkOrdersTable.displayName = "MasterWorkOrdersTable";
export default MasterWorkOrdersTable;
