import { localizeStyleColorName } from "@carbon/database/style-reference";
import { Button, HStack, IconButton } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import {
  LuCirclePlay,
  LuClipboardList,
  LuClock,
  LuHash,
  LuPackageOpen,
  LuPalette,
  LuPrinter,
  LuRuler,
  LuScissors,
  LuShirt,
  LuSplit,
  LuUser
} from "react-icons/lu";
import { useRevalidator } from "react-router";
import { Assignee, Hyperlink, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import type { BundleWorkOrder } from "~/modules/production";
import { usePeople, useStyles } from "~/stores";
import { path } from "~/utils/path";
import { jobStatus } from "../../production.models";
import type { Job } from "../../types";
import JobStatus from "../Jobs/JobStatus";
import JobStatusMenu from "../Jobs/JobStatusMenu";
import PrintBundleTicketsModal from "./PrintBundleTicketsModal";

type BundleWorkOrdersTableProps = {
  data: BundleWorkOrder[];
  count: number;
  // When rendered inside a Master WO shell, enable Report Cutting + Split Batch.
  masterJobId?: string;
  masterWorkOrderId?: string;
  cuttingOperationId?: string | null;
  // Hide the table's header row (title + toolbar) — e.g. inside a modal.
  withHeader?: boolean;
};

const BundleWorkOrdersTable = memo(
  ({
    data,
    count,
    masterJobId,
    masterWorkOrderId,
    cuttingOperationId,
    withHeader = true
  }: BundleWorkOrdersTableProps) => {
    const { t, i18n } = useLingui();
    const permissions = usePermissions();
    const { openOverlay } = useOverlay();
    const revalidator = useRevalidator();
    const [people] = usePeople();
    const styles = useStyles();
    const dateFormatter = useDateFormatter({
      dateStyle: "medium",
      timeStyle: "short"
    });

    const rows = useMemo(() => data, [data]);

    // Selection is lifted so the persistent Print button can print the selected
    // rows, or — when nothing is selected — everything shown on the page.
    const [selectedRows, setSelectedRows] = useState<BundleWorkOrder[]>([]);
    const [printCandidates, setPrintCandidates] = useState<
      BundleWorkOrder[] | null
    >(null);

    const openPrint = useCallback(() => {
      setPrintCandidates(selectedRows.length > 0 ? selectedRows : data);
    }, [selectedRows, data]);

    const openReportCutting = useCallback(() => {
      if (!masterJobId || !cuttingOperationId) return;
      openOverlay(
        overlay.to.newProductionQuantity({
          jobId: masterJobId,
          jobOperationId: cuttingOperationId,
          lockOperation: true
        }),
        {
          onCreated: () => {
            revalidator.revalidate();
            // After reporting cutting, open Split Batch to organize the bundles.
            if (masterWorkOrderId) {
              openOverlay(
                overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId }),
                { onCreated: () => revalidator.revalidate() }
              );
            }
          }
        }
      );
    }, [
      openOverlay,
      revalidator,
      masterJobId,
      cuttingOperationId,
      masterWorkOrderId
    ]);

    const openProcesses = useCallback(
      (e: MouseEvent, bundleWorkOrderId: string) => {
        e.stopPropagation();
        openOverlay(overlay.to.bundleWorkOrderProcesses({ bundleWorkOrderId }));
      },
      [openOverlay]
    );

    const openSplitBatch = useCallback(() => {
      if (!masterWorkOrderId) return;
      openOverlay(overlay.to.masterWorkOrderSplitBatch({ masterWorkOrderId }), {
        onCreated: () => revalidator.revalidate()
      });
    }, [openOverlay, revalidator, masterWorkOrderId]);

    const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
      return [
        {
          accessorKey: "jobReadableId",
          header: t`Bundle`,
          cell: ({ row }) => (
            <Hyperlink to={path.to.bundleWorkOrder(row.original.id!)}>
              {row.original.jobReadableId}
            </Hyperlink>
          ),
          meta: { icon: <LuPackageOpen /> }
        },
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) => row.original.quantity,
          meta: { icon: <LuHash /> }
        },
        {
          id: "processes",
          header: t`Processes`,
          cell: ({ row }) => {
            const processCount = row.original.processCount ?? 0;
            return (
              <HStack spacing={1}>
                <span className="tabular-nums">{processCount}</span>
                {row.original.id ? (
                  <IconButton
                    type="button"
                    icon={<LuClipboardList size="1em" strokeWidth={2.5} />}
                    aria-label={t`View processes`}
                    size="sm"
                    variant="secondary"
                    isDisabled={processCount === 0}
                    onClick={(e) => openProcesses(e, row.original.id!)}
                  />
                ) : null}
              </HStack>
            );
          },
          meta: { icon: <LuClipboardList /> }
        },
        {
          id: "assignee",
          header: t`Assignee`,
          cell: ({ row }) => (
            <Assignee
              id={row.original.jobId ?? ""}
              table="job"
              value={row.original.assignee ?? ""}
              variant="button"
              size="sm"
            />
          ),
          meta: {
            filter: {
              type: "static",
              options: people.map((employee) => ({
                value: employee.id,
                label: employee.name
              }))
            },
            icon: <LuUser />,
            isEmpty: (row) => !row.assignee
          }
        },
        {
          accessorKey: "assignedAt",
          header: t`Assigned At`,
          cell: ({ row }) =>
            row.original.assignedAt
              ? dateFormatter.format(new Date(row.original.assignedAt))
              : "—",
          meta: { icon: <LuClock /> }
        },
        {
          accessorKey: "status",
          header: t`Status`,
          cell: ({ row }) => (
            <JobStatusMenu
              job={
                {
                  ...row.original,
                  id: row.original.jobId,
                  jobId: row.original.jobReadableId
                } as unknown as Job
              }
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
          accessorKey: "readableIdWithRevision",
          header: t`Style`,
          cell: ({ row }) =>
            row.original.readableIdWithRevision ?? row.original.itemName,
          meta: {
            filter: {
              type: "static",
              options: styles.map((style) => ({
                value: style.readableIdWithRevision,
                label: style.readableIdWithRevision
              }))
            },
            icon: <LuShirt />
          }
        },
        {
          accessorKey: "colorCode",
          header: t`Color`,
          cell: ({ row }) =>
            localizeStyleColorName(row.original.colorCode, i18n.locale) ||
            row.original.colorName ||
            row.original.colorCode ||
            "—",
          meta: { icon: <LuPalette /> }
        },
        {
          accessorKey: "sizeCode",
          header: t`Size`,
          cell: ({ row }) => row.original.sizeCode ?? "—",
          meta: { icon: <LuRuler /> }
        }
      ];
    }, [t, i18n, people, styles, dateFormatter, openProcesses]);

    return (
      <>
        <Table<(typeof rows)[number]>
          data={data}
          columns={columns}
          count={count}
          defaultColumnPinning={{ left: ["jobReadableId"] }}
          getRowHref={(row) =>
            row.id ? path.to.bundleWorkOrder(row.id) : undefined
          }
          onSelectedRowsChange={setSelectedRows}
          primaryAction={
            <HStack spacing={2}>
              <Button
                leftIcon={<LuPrinter />}
                variant="secondary"
                onClick={openPrint}
                isDisabled={data.length === 0}
              >
                {selectedRows.length > 0
                  ? t`Print ${selectedRows.length} Tickets`
                  : t`Print Tickets`}
              </Button>
              {cuttingOperationId && permissions.can("update", "production") ? (
                <>
                  <Button
                    leftIcon={<LuScissors />}
                    variant="secondary"
                    onClick={openReportCutting}
                  >
                    {t`Report Cutting`}
                  </Button>
                  {masterWorkOrderId ? (
                    <Button
                      leftIcon={<LuSplit />}
                      variant="secondary"
                      onClick={openSplitBatch}
                    >
                      {t`Split Batch`}
                    </Button>
                  ) : null}
                </>
              ) : null}
            </HStack>
          }
          title={t`Bundle Work Orders`}
          table="bundleWorkOrder"
          withHeader={withHeader}
          withSavedView
          withSelectableRows
        />
        {printCandidates ? (
          <PrintBundleTicketsModal
            bundles={printCandidates}
            onClose={() => setPrintCandidates(null)}
          />
        ) : null}
      </>
    );
  }
);

BundleWorkOrdersTable.displayName = "BundleWorkOrdersTable";
export default BundleWorkOrdersTable;
