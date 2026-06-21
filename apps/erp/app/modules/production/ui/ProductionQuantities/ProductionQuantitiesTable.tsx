import { HStack, IconButton } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router";
import { Hyperlink, New, Table } from "~/components";
import { useDateFormatter } from "~/hooks";
import { path } from "~/utils/path";

type ProductionQuantityReport = {
  id: string;
  jobOperationId: string;
  employeeId?: string | null;
  originalQuantity: number;
  notes?: string | null;
  createdAt: string;
  jobOperation?: {
    jobId?: string | null;
    description?: string | null;
    job?: {
      jobId?: string | null;
    } | null;
  } | null;
  employee?: {
    fullName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

type ProductionQuantitiesTableProps = {
  data: ProductionQuantityReport[];
  count: number;
};

export function ProductionQuantitiesTable({
  data,
  count
}: ProductionQuantitiesTableProps) {
  const navigate = useNavigate();
  const dateFormatter = useDateFormatter();

  const columns: ColumnDef<ProductionQuantityReport>[] = [
    {
      accessorKey: "jobOperation.job.jobId",
      header: () => <Trans>Job</Trans>,
      cell: ({ row }) => {
        const jobId = row.original.jobOperation?.jobId;
        const jobIdFormatted = row.original.jobOperation?.job?.jobId;
        if (!jobId || !jobIdFormatted) return null;
        return <Hyperlink to={path.to.job(jobId)}>{jobIdFormatted}</Hyperlink>;
      }
    },
    {
      accessorKey: "jobOperation.description",
      header: () => <Trans>Operation</Trans>,
      cell: ({ row }) => row.original.jobOperation?.description ?? "-"
    },
    {
      accessorKey: "employee.fullName",
      header: () => <Trans>Employee</Trans>,
      cell: ({ row }) =>
        row.original.employee?.fullName ??
        [row.original.employee?.firstName, row.original.employee?.lastName]
          .filter(Boolean)
          .join(" ") ||
        "-"
    },
    {
      accessorKey: "originalQuantity",
      header: () => <Trans>Quantity</Trans>,
      cell: ({ row }) => row.original.originalQuantity
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
        return date ? dateFormatter.format(new Date(date)) : "-";
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
              label={<Trans>New Production Quantity</Trans>}
              to={path.to.newProductionQuantity}
              icon={<IconButton icon={<LuPlus />} label="New" />}
            />
          </HStack>
        }
      />
    </>
  );
}
