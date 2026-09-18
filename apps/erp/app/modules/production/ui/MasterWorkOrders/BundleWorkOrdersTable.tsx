import {
  localizeStyleColorName,
  localizeStyleColorNameByName
} from "@carbon/database/style-reference";
import { Button, HStack, IconButton, Spinner, toast } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { useDateFormatter } from "@react-aria/i18n";
import type { ColumnDef } from "@tanstack/react-table";
import type { KeyboardEvent, MouseEvent } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LuBookMarked,
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
  LuSlidersHorizontal,
  LuSplit,
  LuUser
} from "react-icons/lu";
import { useFetcher, useRevalidator } from "react-router";
import { Assignee, Hyperlink, Table } from "~/components";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions } from "~/hooks";
import { translateItemAttributeCatalogName } from "~/modules/items/itemAttributeDisplayName";
import type { BundleWorkOrder } from "~/modules/production";
import type { BundleQuantityUpdateResult } from "~/routes/api+/production.bundle-work-orders.$bundleWorkOrderId.quantity";
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

function quantityErrorMessage(
  result: Extract<BundleQuantityUpdateResult, { ok: false }>,
  i18n: { _: (descriptor: ReturnType<typeof msg>) => string }
) {
  switch (result.reason) {
    case "cap":
      return i18n._(
        msg`An attribute combo can't exceed the cut quantity (max ${result.max ?? 0})`
      );
    case "reported":
      return i18n._(
        msg`A bundle can't be set below its reported quantity (${result.reported ?? 0})`
      );
    case "not_found":
      return i18n._(msg`Bundle not found`);
    default:
      return i18n._(msg`Failed to update quantity`);
  }
}

function BundleQuantityCell({
  bundleWorkOrderId,
  quantity,
  canEdit
}: {
  bundleWorkOrderId: string;
  quantity: number | null | undefined;
  canEdit: boolean;
}) {
  const { t, i18n } = useLingui();
  const revalidator = useRevalidator();
  const fetcher = useFetcher<BundleQuantityUpdateResult>();
  const serverQty = Number(quantity) || 0;
  const [localQty, setLocalQty] = useState(serverQty);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(serverQty);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const baselineQty = useRef(serverQty);
  const pendingQty = useRef<number | null>(null);
  const handledDataRef = useRef<typeof fetcher.data>(undefined);
  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    // Don't clobber an in-flight optimistic value with stale props.
    if (isSubmitting || pendingQty.current !== null) return;
    setLocalQty(serverQty);
    setDraft(serverQty);
    baselineQty.current = serverQty;
  }, [serverQty, isSubmitting]);

  useEffect(() => {
    if (fetcher.state !== "idle") return;

    // Network / non-JSON failure: no structured payload, but we still have a
    // pending optimistic edit to undo.
    if (!fetcher.data) {
      if (pendingQty.current === null) return;
      pendingQty.current = null;
      const message = i18n._(msg`Failed to update quantity`);
      setLocalQty(baselineQty.current);
      setDraft(baselineQty.current);
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    // Handle each response once — fetcher.data stays until the next submit.
    if (handledDataRef.current === fetcher.data) return;
    handledDataRef.current = fetcher.data;

    if (fetcher.data.ok) {
      setErrorMessage(null);
      if (pendingQty.current !== null) {
        baselineQty.current = pendingQty.current;
      }
      pendingQty.current = null;
      revalidator.revalidate();
      return;
    }

    const message = quantityErrorMessage(fetcher.data, i18n);
    pendingQty.current = null;
    setLocalQty(baselineQty.current);
    setDraft(baselineQty.current);
    setErrorMessage(message);
    toast.error(message);
  }, [fetcher.state, fetcher.data, i18n, revalidator]);

  const commit = useCallback(
    (next: number) => {
      if (!Number.isFinite(next) || next === localQty) {
        setDraft(localQty);
        setEditing(false);
        return;
      }
      setErrorMessage(null);
      baselineQty.current = localQty;
      pendingQty.current = next;
      setLocalQty(next);
      setEditing(false);
      const formData = new FormData();
      formData.append("quantity", String(next));
      fetcher.submit(formData, {
        method: "post",
        action: path.to.api.bundleWorkOrderQuantity(bundleWorkOrderId)
      });
    },
    [bundleWorkOrderId, localQty, fetcher]
  );

  const startEditing = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (isSubmitting) return;
      setErrorMessage(null);
      setDraft(localQty);
      setEditing(true);
    },
    [localQty, isSubmitting]
  );

  if (!canEdit || !bundleWorkOrderId) {
    return <span className="tabular-nums">{localQty}</span>;
  }

  if (editing) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <input
          type="number"
          min={0}
          className="h-8 w-20 rounded-md border bg-transparent px-2 text-sm tabular-nums focus:outline-none focus:ring-1"
          value={draft}
          disabled={isSubmitting}
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => setDraft(Number(e.target.value) || 0)}
          onBlur={() => commit(draft)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // Blur commits once — avoid Enter + blur double-submit.
              e.currentTarget.blur();
            } else if (e.key === "Escape") {
              e.preventDefault();
              setDraft(localQty);
              setEditing(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <HStack spacing={1}>
        <span
          className={
            errorMessage ? "tabular-nums text-destructive" : "tabular-nums"
          }
        >
          {localQty}
        </span>
        {isSubmitting ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <IconButton
            type="button"
            icon={<LuSlidersHorizontal size="1em" strokeWidth={2.5} />}
            aria-label={t`Edit quantity`}
            size="sm"
            variant="secondary"
            onClick={startEditing}
          />
        )}
      </HStack>
      {errorMessage ? (
        <span className="text-[11px] leading-tight text-destructive max-w-[12rem]">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}

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
    const canUpdateQuantity = permissions.can("update", "production");

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
      const cols: ColumnDef<(typeof rows)[number]>[] = [
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
        // Standalone list: show Master WO. Hidden when already scoped inside a
        // master WO shell/overlay (masterWorkOrderId prop is set).
        ...(!masterWorkOrderId
          ? ([
              {
                accessorKey: "masterWorkOrderId",
                header: t`Master Work Order`,
                cell: ({
                  row
                }: {
                  row: { original: (typeof rows)[number] };
                }) => {
                  const masterId = row.original.masterWorkOrderId;
                  const label =
                    row.original.masterJobReadableId?.trim() || masterId;
                  if (!masterId || !label) return "—";
                  return (
                    <Hyperlink
                      to={path.to.masterWorkOrder(masterId)}
                      className="font-mono text-sm font-medium"
                      onClick={(e: MouseEvent) => e.stopPropagation()}
                    >
                      {label}
                    </Hyperlink>
                  );
                },
                meta: {
                  icon: <LuBookMarked />,
                  pluralHeader: t`Master Work Orders`
                }
              }
            ] as ColumnDef<(typeof rows)[number]>[])
          : []),
        {
          accessorKey: "quantity",
          header: t`Quantity`,
          cell: ({ row }) =>
            row.original.id ? (
              <BundleQuantityCell
                bundleWorkOrderId={row.original.id}
                quantity={row.original.quantity}
                canEdit={canUpdateQuantity}
              />
            ) : (
              <span className="tabular-nums">{row.original.quantity ?? 0}</span>
            ),
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
          // Parent Style readable id (e.g. "1177"), not the variant SKU
          // ("1177-PP-3XL"). The SKU lives on readableIdWithRevision; Color/Size
          // are in the dynamic attribute columns below.
          accessorKey: "styleReadableId",
          header: t`Style`,
          cell: ({ row }) =>
            row.original.styleReadableId ??
            row.original.readableIdWithRevision ??
            row.original.itemName,
          meta: {
            filter: {
              type: "static",
              options: styles.map((style) => ({
                // styleReadableId is item.readableId; for revision "0" that
                // equals readableIdWithRevision (see revisions.sql).
                value: style.readableIdWithRevision,
                label: style.readableIdWithRevision
              }))
            },
            icon: <LuShirt />
          }
        }
      ];

      const attrCodes = new Set<string>();
      for (const row of rows) {
        const vals = (row as { attributeValues?: Record<string, string> })
          .attributeValues;
        if (vals && typeof vals === "object") {
          for (const code of Object.keys(vals)) {
            if (code) attrCodes.add(code);
          }
        }
      }
      const sortedCodes = Array.from(attrCodes).sort((a, b) => {
        const rank = (c: string) => (c === "Color" ? 0 : c === "Size" ? 1 : 2);
        const d = rank(a) - rank(b);
        return d !== 0 ? d : a.localeCompare(b);
      });

      for (const code of sortedCodes) {
        const valueOptions = Array.from(
          new Set(
            rows
              .map((row) => {
                const vals = (
                  row as { attributeValues?: Record<string, string> }
                ).attributeValues;
                return vals?.[code];
              })
              .filter((v): v is string => Boolean(v))
          )
        )
          .sort((a, b) => a.localeCompare(b))
          .map((value) => ({
            value,
            label:
              localizeStyleColorName(value, i18n.locale) ||
              localizeStyleColorNameByName(value, i18n.locale) ||
              value
          }));

        cols.push({
          id: `attr-${code}`,
          header: translateItemAttributeCatalogName(code, i18n),
          cell: ({ row }) => {
            const vals = (
              row.original as { attributeValues?: Record<string, string> }
            ).attributeValues;
            const value = vals?.[code];
            return value ? (
              <span>
                {localizeStyleColorName(value, i18n.locale) ||
                  localizeStyleColorNameByName(value, i18n.locale) ||
                  value}
              </span>
            ) : (
              <span className="text-muted-foreground">—</span>
            );
          },
          meta: {
            icon: code === "Size" ? <LuRuler /> : <LuPalette />,
            // Filter key is `attr-<code>` (e.g. attr-Color); the list service
            // maps those onto attributeValues->>code JSONB predicates.
            filter: valueOptions.length
              ? {
                  type: "static" as const,
                  options: valueOptions,
                  isArray: true
                }
              : undefined
          }
        });
      }

      return cols;
    }, [
      t,
      i18n,
      people,
      styles,
      dateFormatter,
      openProcesses,
      rows,
      masterWorkOrderId,
      canUpdateQuantity
    ]);

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
