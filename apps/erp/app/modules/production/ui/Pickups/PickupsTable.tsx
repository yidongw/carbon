import { Button } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { AiOutlinePartition } from "react-icons/ai";
import {
  LuBriefcase,
  LuCalendar,
  LuHash,
  LuPlus,
  LuSettings2,
  LuUser
} from "react-icons/lu";
import { useRevalidator } from "react-router";
import { Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { getProcessName } from "~/modules/production/productionQuantityDisplay.utils";
import { EditableCreatedAtCell } from "~/modules/production/ui/EditableCreatedAtCell";
import { ProductionQuantityReportReporter } from "~/modules/production/ui/Jobs/ProductionQuantityReportReporter";
import {
  ProductionQuantityTableItemCell,
  ProductionQuantityTableJobCell,
  ProductionQuantityTableQuantityCell,
  type ProductionQuantityTableRowLike
} from "~/modules/production/ui/ProductionQuantityTableCells";
import { usePickupCreatedAtSave } from "~/modules/production/ui/useEditableCreatedAt";
import { CreatedAtFilter } from "./CreatedAtFilter";

type JobOperationPickup = ProductionQuantityTableRowLike & {
  id: string;
  jobOperationId: string;
  employeeId: string;
  createdBy?: string | null;
  quantity: number;
  notes?: string | null;
  createdAt: string;
};

type FilterOption = { id: string; label: string };
type EmployeeOption = {
  id: string;
  name: string | null;
  avatarUrl?: string | null;
};

type PickupsTableProps = {
  data: JobOperationPickup[];
  count: number;
  configurableItemIds?: string[];
  employees?: EmployeeOption[];
  jobs?: FilterOption[];
  items?: FilterOption[];
  processes?: FilterOption[];
};

export function PickupsTable({
  data,
  count,
  configurableItemIds = [],
  employees = [],
  jobs = [],
  items = [],
  processes = []
}: PickupsTableProps) {
  const { t } = useLingui();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const openNewPickup = useCallback(() => {
    openOverlay(overlay.to.newProductionPickup(), {
      onCreated: () => revalidator.revalidate()
    });
  }, [openOverlay, revalidator]);
  const { saveCreatedAt, canEdit } = usePickupCreatedAtSave();
  const configurableItemIdSet = useMemo(
    () => new Set(configurableItemIds),
    [configurableItemIds]
  );

  const columns = useMemo<ColumnDef<JobOperationPickup>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: t`Employee`,
        cell: ({ row }) => (
          <ProductionQuantityReportReporter
            employeeId={row.original.employeeId}
            createdBy={row.original.createdBy}
          />
        ),
        meta: {
          icon: <LuUser />,
          pluralHeader: t`Employees`,
          filter: employees.length
            ? {
                type: "static" as const,
                options: employees.map((e) => ({
                  value: e.id,
                  label: e.name?.trim() || e.id
                })),
                isArray: false
              }
            : undefined
        }
      },
      {
        accessorKey: "jobId",
        header: t`Job`,
        cell: ({ row }) => (
          <ProductionQuantityTableJobCell row={row.original} />
        ),
        meta: {
          icon: <LuBriefcase />,
          pluralHeader: t`Jobs`,
          filter: jobs.length
            ? {
                type: "static" as const,
                options: jobs.map((j) => ({ value: j.id, label: j.label })),
                isArray: false
              }
            : undefined
        }
      },
      {
        accessorKey: "itemId",
        header: t`Item`,
        cell: ({ row }) => (
          <ProductionQuantityTableItemCell row={row.original} />
        ),
        meta: {
          icon: <AiOutlinePartition />,
          pluralHeader: t`Items`,
          filter: items.length
            ? {
                type: "static" as const,
                options: items.map((i) => ({ value: i.id, label: i.label })),
                isArray: false
              }
            : undefined
        }
      },
      {
        accessorKey: "processId",
        header: t`Operation`,
        cell: ({ row }) => (
          <div className="text-sm">{getProcessName(row.original) ?? "—"}</div>
        ),
        meta: {
          icon: <LuSettings2 />,
          pluralHeader: t`Operations`,
          filter: processes.length
            ? {
                type: "static" as const,
                options: processes.map((p) => ({
                  value: p.id,
                  label: p.label
                })),
                isArray: false
              }
            : undefined
        }
      },
      {
        accessorKey: "quantity",
        header: t`Qty`,
        cell: ({ row }) => (
          <ProductionQuantityTableQuantityCell
            row={row.original}
            configurableItemIds={configurableItemIdSet}
            reportKind="pickup"
          />
        ),
        meta: {
          icon: <LuHash />,
          renderTotal: true
        }
      },
      {
        accessorKey: "notes",
        header: t`Notes`,
        cell: ({ row }) => row.original.notes ?? "—"
      },
      {
        accessorKey: "createdAt",
        header: t`Recorded`,
        cell: ({ row }) => (
          <EditableCreatedAtCell
            createdAt={row.original.createdAt}
            row={row.original}
            onSave={saveCreatedAt}
            canEdit={canEdit}
          />
        ),
        meta: {
          icon: <LuCalendar />,
          filter: {
            type: "custom" as const,
            render: (ctx) => <CreatedAtFilter {...ctx} />,
            getLabel: (value) => {
              const [start, end] = value.split("~");
              if (start && end) return `${start} – ${end}`;
              if (start) return `≥ ${start}`;
              if (end) return `≤ ${end}`;
              return value;
            }
          }
        }
      }
    ],
    [
      canEdit,
      configurableItemIdSet,
      employees,
      jobs,
      items,
      processes,
      saveCreatedAt,
      t
    ]
  );

  return (
    <Table
      count={count}
      columns={columns}
      data={data}
      table="jobOperationPickup"
      withSearch
      withPagination
      title={t`Process Pickups`}
      primaryAction={
        <Button
          type="button"
          variant="primary"
          leftIcon={<LuPlus />}
          onClick={openNewPickup}
        >
          <Trans>Process Pickup</Trans>
        </Button>
      }
    />
  );
}
