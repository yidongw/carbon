import { HStack, IconButton } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { useDateFormatter } from "~/hooks";
import { path } from "~/utils/path";

type JobOperationPickup = {
  id: string;
  jobOperationId: string;
  employeeId?: string | null;
  quantity: number;
  notes?: string | null;
  createdAt: string;
  jobId?: string | null;
  jobIdFormatted?: string | null;
  operationDescription?: string | null;
  employeeName?: string | null;
};

type PickupsTableProps = {
  data: JobOperationPickup[];
  count: number;
};

export function PickupsTable({ data, count }: PickupsTableProps) {
  const navigate = useNavigate();
  const { formatDateTime } = useDateFormatter();

  const columns: ColumnDef<JobOperationPickup>[] = [
    {
      accessorKey: "jobIdFormatted",
      header: () => <Trans>Job</Trans>,
      cell: ({ row }) => {
        const jobId = row.original.jobId;
        const jobIdFormatted = row.original.jobIdFormatted;
        if (!jobId || !jobIdFormatted) return null;
        return <Hyperlink to={path.to.job(jobId)}>{jobIdFormatted}</Hyperlink>;
      }
    },
    {
      accessorKey: "operationDescription",
      header: () => <Trans>Operation</Trans>,
      cell: ({ row }) => row.original.operationDescription ?? "-"
    },
    {
      accessorKey: "employeeName",
      header: () => <Trans>Employee</Trans>,
      cell: ({ row }) => row.original.employeeName ?? "-"
    },
    {
      accessorKey: "quantity",
      header: () => <Trans>Quantity</Trans>,
      cell: ({ row }) => row.original.quantity
    },
    {
      accessorKey: "notes",
      header: () => <Trans>Notes</Trans>,
      cell: ({ row }) => row.original.notes ?? "-"
    },
    {
      accessorKey: "createdAt",
      header: () => <Trans>Created At</Trans>,
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? formatDateTime(date) : "-";
      }
    }
  ];

  return (
    <>
      <Table
        count={count}
        columns={columns}
        data={data}
        primaryAction={
          <HStack>
            <New
              label={<Trans>New Pickup</Trans>}
              to={path.to.newPickup}
              icon={<IconButton icon={<LuPlus />} label="New" />}
            />
          </HStack>
        }
      />
    </>
  );
}
