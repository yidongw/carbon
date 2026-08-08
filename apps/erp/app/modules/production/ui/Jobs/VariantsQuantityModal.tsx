import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import { Button, HStack, Loading, Modal, ModalContent } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { LuPlus } from "react-icons/lu";
import { useFetcher } from "react-router";
import { Enumerable } from "~/components/Enumerable";
import { useShape } from "~/components/Form/Shape";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  buildConfigTableEditorState,
  type ConfigReferenceSource,
  type ConfigTableReferenceContext,
  configTableToComboRows
} from "~/modules/production/configParamsTableColumns";
import {
  buildConfigTableActionResponse,
  type ConfigTableOverlaySuccess,
  isConfigTableOverlaySuccess
} from "~/modules/production/configTableOverlay";
import { localizeColorNameMap } from "~/modules/shared/styleConfigDisplay";
import type { ItemConfigTableOverlayLoaderData } from "~/routes/api+/items.$itemId.config-table";
import { path } from "~/utils/path";
import {
  buildColumns,
  buildComboColumns,
  type Column,
  computeTotal,
  EditableConfigGrid,
  getCellKey,
  getInitialRows,
  hasValue,
  makeDefaultRow,
  mergeRows,
  normalizeRow,
  type Row,
  validateCell,
  variantsQuantityModalBodyClassName,
  variantsQuantityModalContentClassName,
  variantsQuantityModalShellClassName
} from "./configTableShared";

type PlanCell = {
  valuesKey: string;
  attributeLabel: string;
  cap: number;
};

function comboDisplayLabel(
  row: Row,
  optionLabels?: Record<string, string>
): string {
  const stored = String(row.label ?? "").trim();
  if (stored) return stored;
  const valuesKey = String(row.valuesKey ?? "").trim();
  if (!valuesKey) return "—";
  return valuesKey
    .split("|")
    .map((part) => optionLabels?.[part] ?? part)
    .join(" · ");
}

/** Flat editor columns: every list param as a descriptor + one Quantities cell. */
function buildFlatColumns(
  parameters: ConfigurationParameter[],
  quantityLabel: string
): Column[] {
  const combo = buildComboColumns(parameters, quantityLabel);
  if (combo) return combo.columns;

  const cols: Column[] = parameters
    .filter((p) => p.dataType === "list")
    .map((p) => ({
      key: p.key,
      label: p.label,
      type: "list" as const,
      options: p.listOptions ?? [],
      // Fixed by the add button — not editable in the row.
      readOnly: true
    }));
  cols.push({ key: "Quantities", label: quantityLabel, type: "quantity" });
  return cols;
}

/** Combo rows: pass-through valuesKey rows. */
function comboRowsFromInitial(
  rows: Row[],
  optionLabels?: Record<string, string>
): Row[] {
  const alreadyCombo = rows.some(
    (r) => String(r.valuesKey ?? "").trim().length > 0
  );
  if (alreadyCombo) {
    const flat: Row[] = [];
    for (const mr of rows) {
      const valuesKey = String(mr.valuesKey ?? "").trim();
      const qty = Number(mr.Quantities) || 0;
      if (!valuesKey || qty <= 0) continue;
      const row: Row = { valuesKey, Quantities: qty };
      const label = String(mr.label ?? "").trim();
      if (label) row.label = label;
      flat.push(row);
    }
    return flat;
  }

  return configTableToComboRows({ configTable: rows }, optionLabels) as Row[];
}

/** Merge flat combo rows into the stored config table shape (valuesKey rows). */
function flatRowsToMergedConfig(flatRows: Row[]): {
  configTable: Row[];
} {
  return {
    configTable: flatRows
      .map((fr) => {
        const valuesKey = String(fr.valuesKey ?? "").trim();
        if (!valuesKey) return null;
        const row: Row = { valuesKey, Quantities: Number(fr.Quantities) || 0 };
        const label = String(fr.label ?? "").trim();
        if (label) row.label = label;
        return row;
      })
      .filter((r): r is Row => r != null)
  };
}

export type VariantsQuantityModalProps = {
  parameters: ConfigurationParameter[];
  initialRows?: Row[];
  referenceByRowIndex?: Array<Record<string, number>>;
  // Flat "one row per variant combo" editor (multiple rows per cell) that also emits
  // raw `splitRows` — used by production-quantity reporting.
  splitMode?: boolean;
  jobDisplayId?: string | null;
  /** Display label per list-option value (e.g. color code -> color name). */
  optionLabels?: Record<string, string>;
  /**
   * Editing an existing report (not filing a new one). The plan "Remaining"
   * indicator is meaningless here — the report's own quantity already counts
   * against the plan — so the footer shows the change (delta) from the report's
   * original total instead, and the plan cap doesn't block confirming.
   */
  isEditingReport?: boolean;
  /** Hard cap on the grid total (e.g. selected transfer source on-hand). */
  maxTotal?: number;
  /**
   * When false, still show click-to-fill reference hints but do not block
   * Confirm when a cell exceeds its hint (fungible Style: hints are 0).
   * Defaults to true.
   */
  enforceReferenceCaps?: boolean;
} & Omit<OverlayFormInjectedProps, "fetcher" | "action" | "confirmMode"> & {
    // Optional so the same content can render as a plain local modal (client
    // confirm) without the overlay's submit fetcher.
    fetcher?: OverlayFormInjectedProps["fetcher"];
    action?: string;
    // Overlays inject "server" | "none"; the standalone local-modal path adds
    // "client" (confirm via callback), which is intentionally not an overlay mode.
    confirmMode: OverlayFormInjectedProps["confirmMode"] | "client";
  };

function VariantsQuantityModal({
  parameters,
  initialRows,
  referenceByRowIndex,
  splitMode,
  jobDisplayId,
  optionLabels: rawOptionLabels,
  isEditingReport,
  maxTotal,
  enforceReferenceCaps = true,
  onDismiss,
  action: formAction,
  fetcher,
  confirmMode,
  onConfirmSuccess
}: VariantsQuantityModalProps) {
  const { t, i18n } = useLingui();
  // Loader attributeValueNames are English base; translate to the locale so combo
  // labels + headers render 黑色 · S rather than "Black · S" or "BK · S".
  const optionLabels =
    localizeColorNameMap(rawOptionLabels, i18n.locale) ?? rawOptionLabels;
  // `"none"` is a read-only view: cells are disabled and the only button closes.
  const readOnly = confirmMode === "none";
  const flat = Boolean(splitMode);
  const materialShapeOptions = useShape();
  const materialOptions = materialShapeOptions.map((shape) => ({
    label: <Enumerable value={shape.label} />,
    value: shape.value
  }));
  const { primaryParam, columns } = buildColumns(
    parameters,
    t`Quantities`,
    t`Attributes`
  );
  // In flat mode the grid uses one row per combo/color-size (multiple allowed)
  // with a single Quantities column; the stored config is still merged on submit.
  const flatColumns = buildFlatColumns(parameters, t`Quantities`);
  const gridColumns = flat ? flatColumns : columns;

  const [rows, setRows] = useState<Row[]>(() => {
    if (flat) {
      const seed =
        initialRows && initialRows.length > 0
          ? comboRowsFromInitial(initialRows, optionLabels)
          : [];
      if (seed.length > 0) {
        return seed.map((row) => {
          const normalized = normalizeRow(row, flatColumns);
          const label = String(row.label ?? "").trim();
          if (label) normalized.label = label;
          return normalized;
        });
      }
      // Combo grid: wait for add buttons (no blank seed row).
      return [];
    }
    if (initialRows && initialRows.length > 0) {
      const seedRows = !initialRows.some(
        (r) => String(r.valuesKey ?? "").trim().length > 0
      )
        ? (configTableToComboRows(
            { configTable: initialRows },
            optionLabels
          ) as Row[])
        : initialRows;
      return seedRows.map((row) => {
        const normalized = normalizeRow(row, columns);
        const label = String(row.label ?? "").trim();
        if (label) normalized.label = label;
        return normalized;
      });
    }
    return getInitialRows(parameters, primaryParam, columns);
  });
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [validationError, setValidationError] = useState("");

  const hasReferences = !flat && (referenceByRowIndex?.length ?? 0) > 0;
  const total = computeTotal(rows);

  // When editing an existing report, measure the change against the report's
  // original total (its saved config = `initialRows`) rather than the plan.
  const baselineTotal = useMemo(() => {
    if (!isEditingReport) return 0;
    let sum = 0;
    for (const row of initialRows ?? []) {
      sum += Number((row as Row).Quantities) || 0;
    }
    return sum;
  }, [isEditingReport, initialRows]);
  const delta = total - baselineTotal;

  const deleteRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  // Non-flat combo editor: instead of a generic "Add Row", offer one button per
  // attribute combo not yet in the table (translated). Deleting a row frees its
  // combo so its button reappears.
  const usedCombos = useMemo(
    () =>
      new Set(
        rows.map((r) => String(r.valuesKey ?? "").trim()).filter(Boolean)
      ),
    [rows]
  );
  const missingCombos = !flat
    ? (primaryParam?.listOptions ?? []).filter((c) => !usedCombos.has(c))
    : [];
  const addComboRow = (combo: string) =>
    setRows((prev) => [
      ...prev,
      {
        ...makeDefaultRow(gridColumns),
        valuesKey: combo,
        label: combo.replace(/\|/g, " · "),
        Quantities: 0
      }
    ]);

  const updateCell = (
    rowIndex: number,
    colKey: string,
    value: string | number
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [colKey]: value } : row))
    );
    setInvalidCells((prev) => {
      const next = new Set(prev);
      next.delete(getCellKey(rowIndex, colKey));
      return next;
    });
    setValidationError("");
  };

  // Flat (report) mode: per-combo / per-cell plan caps from the config-param
  // reference, so we can offer a button per plannable cell and warn if a
  // cell's entered quantity exceeds its plan.
  //
  // Cell identity is the attribute combo's valuesKey.
  const cellKeyOf = (cell: { valuesKey?: string }) =>
    String(cell.valuesKey ?? "").trim();

  const planCells: PlanCell[] = [];
  if (flat) {
    (initialRows ?? []).forEach((row, i) => {
      const refs = referenceByRowIndex?.[i] ?? {};
      const cap = Number(refs.Quantities) || 0;
      if (cap <= 0) return;
      const valuesKey = String(row.valuesKey ?? "").trim();
      if (!valuesKey) return;
      planCells.push({
        valuesKey,
        attributeLabel: comboDisplayLabel(row, optionLabels),
        cap
      });
    });
  }
  const enteredByCell = new Map<string, number>();
  for (const r of rows) {
    const k = String(r.valuesKey ?? "").trim();
    enteredByCell.set(
      k,
      (enteredByCell.get(k) ?? 0) + (Number(r.Quantities) || 0)
    );
  }
  const capByCell = new Map(planCells.map((c) => [cellKeyOf(c), c.cap]));
  const remainingForCell = (c: PlanCell) =>
    c.cap - (enteredByCell.get(cellKeyOf(c)) ?? 0);
  const addableCells = planCells.filter((c) => remainingForCell(c) > 0);
  const totalPlan = planCells.reduce((s, c) => s + c.cap, 0);
  const planRemaining = totalPlan - total;
  let overPlan = false;
  for (const [k, entered] of enteredByCell) {
    const cap = capByCell.get(k);
    if (cap !== undefined && entered > cap) overPlan = true;
  }
  // Over the plan either per-cell (a combo exceeds its own cap) or in total
  // (the grand total exceeds the plan — e.g. reporting more once every cell's
  // remaining is already 0, so there are no positive per-cell caps to trip).
  // Editing a report shouldn't be gated on the plan "remaining" — the report's
  // own quantity already counts against it, so the calc is always "over".
  const exceedsPlan = !isEditingReport && (overPlan || planRemaining < 0);
  // Mark the quantity cell red for every row whose aggregate exceeds its plan.
  // Matrix mode with inventory/plan hints: any quantity cell above its
  // reference cap blocks confirm (production splitMode uses flat exceedsPlan).
  let exceedsReference = false;
  const overCellKeys = new Set<string>();
  if (flat) {
    // Mark the quantity cell red for every row whose combo aggregate exceeds
    // its plan (same as Split Batch).
    rows.forEach((r, i) => {
      const k = String(r.valuesKey ?? "").trim();
      const cap = capByCell.get(k);
      if (cap !== undefined && (enteredByCell.get(k) ?? 0) > cap) {
        overCellKeys.add(getCellKey(i, "Quantities"));
      }
    });
  } else if (hasReferences && enforceReferenceCaps) {
    rows.forEach((row, rowIndex) => {
      const refs = referenceByRowIndex?.[rowIndex] ?? {};
      for (const col of columns) {
        if (col.type !== "quantity") continue;
        const entered = Number(row[col.key]) || 0;
        const cap = refs[col.key];
        if (cap !== undefined && entered > cap) {
          exceedsReference = true;
          overCellKeys.add(getCellKey(rowIndex, col.key));
        }
      }
    });
  }
  const exceedsMax =
    (flat ? exceedsPlan : exceedsReference) ||
    (maxTotal != null && total > maxTotal);
  const gridInvalidCells =
    overCellKeys.size > 0
      ? new Set([...invalidCells, ...overCellKeys])
      : invalidCells;
  const addCellRow = (c: PlanCell) =>
    setRows((prev) => [
      ...prev,
      normalizeRow(
        {
          valuesKey: c.valuesKey,
          label: c.attributeLabel,
          Quantities: Math.max(0, remainingForCell(c))
        },
        gridColumns
      )
    ]);

  const handleSubmit = () => {
    // Can't confirm while any combo cell exceeds its reference cap
    // (production plan remaining, or inventory on-hand for transfers).
    if (exceedsMax) return;
    const normalizedRows = rows.map((row) => normalizeRow(row, gridColumns));
    const populatedRows = normalizedRows
      .map((row, rowIndex) => ({ row, rowIndex }))
      .filter(({ row }) => hasValue(row, gridColumns));
    const nextInvalidCells = new Set<string>();

    for (const { row, rowIndex } of populatedRows) {
      for (const column of gridColumns) {
        if (!validateCell(row, column, materialOptions, false)) {
          nextInvalidCells.add(getCellKey(rowIndex, column.key));
        }
      }
    }

    if (nextInvalidCells.size > 0) {
      setInvalidCells(nextInvalidCells);
      setValidationError(
        t`Some cells have invalid values. Fix the highlighted cells before saving.`
      );
      return;
    }

    setInvalidCells(new Set());
    setValidationError("");
    const rowsToSave = populatedRows.map(({ row }) => row);

    let configuration: Record<string, unknown>;
    if (flat) {
      // Store the merged config (unchanged downstream) + the raw rows so a master
      // WO cutting report can prefill one bundle per row in Split Batch.
      const merged = flatRowsToMergedConfig(rowsToSave);
      configuration = {
        ...merged,
        splitRows: rowsToSave.map((r) => ({
          valuesKey: String(r.valuesKey ?? "").trim(),
          attributeLabel: comboDisplayLabel(r, optionLabels),
          quantity: Number(r.Quantities) || 0
        }))
      };
    } else {
      configuration = {
        configTable: mergeRows(rowsToSave, columns)
      };
    }

    if (confirmMode === "client") {
      onConfirmSuccess(buildConfigTableActionResponse(configuration));
      return;
    }

    if (!formAction || !fetcher) return;

    const formData = new FormData();
    formData.append("configuration", JSON.stringify(configuration));
    fetcher.submit(formData, { method: "post", action: formAction });
  };

  const tableSection = (
    <>
      <EditableConfigGrid
        columns={gridColumns}
        rows={rows}
        invalidCells={gridInvalidCells}
        referenceByRowIndex={flat ? undefined : referenceByRowIndex}
        hasReferences={hasReferences}
        allowNegative={false}
        mode="delta"
        baselineFor={() => 0}
        materialOptions={materialOptions}
        updateCell={updateCell}
        deleteRow={deleteRow}
        optionLabels={optionLabels}
        readOnly={readOnly}
      />
      {validationError && (
        <div className="text-sm text-destructive">{validationError}</div>
      )}
      <HStack className="mt-4 items-start justify-between">
        {readOnly ? (
          <span />
        ) : flat ? (
          // Flat mode never offers a generic "add row" — you can only add a row
          // for a specific plannable combo (and nothing once every cell's
          // remaining is used up).
          <div className="flex flex-wrap gap-2">
            {addableCells.map((c) => (
              <Button
                key={cellKeyOf(c)}
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<LuPlus />}
                onClick={() => addCellRow(c)}
              >
                {c.attributeLabel} ·{" "}
                <span className="tabular-nums">{remainingForCell(c)}</span>
              </Button>
            ))}
          </div>
        ) : (
          // Non-flat combo editor: one add button per missing combo (translated).
          <div className="flex flex-wrap gap-2">
            {missingCombos.map((combo) => (
              <Button
                key={combo}
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<LuPlus />}
                onClick={() => addComboRow(combo)}
              >
                {localizeVariantAttributeLabel(
                  combo.replace(/\|/g, " · "),
                  i18n.locale
                )}
              </Button>
            ))}
          </div>
        )}
        <span className="shrink-0 text-sm text-muted-foreground">
          <Trans>Total</Trans>:{" "}
          <strong className="text-foreground">{total}</strong>
        </span>
      </HStack>
    </>
  );

  const footer = readOnly ? (
    <HStack className="justify-end">
      <Button type="button" variant="primary" onClick={onDismiss}>
        <Trans>Close</Trans>
      </Button>
    </HStack>
  ) : (
    <HStack className="justify-between">
      {flat && isEditingReport ? (
        <HStack spacing={3} className="text-sm text-muted-foreground">
          <span>
            <Trans>Delta</Trans>:{" "}
            <strong
              className={
                delta < 0
                  ? "tabular-nums text-red-500"
                  : "tabular-nums text-foreground"
              }
            >
              {delta > 0 ? `+${delta}` : delta}
            </strong>
          </span>
        </HStack>
      ) : flat ? (
        <HStack spacing={3} className="text-sm text-muted-foreground">
          <span>
            <Trans>Remaining</Trans>:{" "}
            <strong
              className={
                planRemaining < 0
                  ? "tabular-nums text-red-500"
                  : "tabular-nums text-foreground"
              }
            >
              {planRemaining}
            </strong>
          </span>
          {exceedsPlan ? (
            <span className="text-amber-600 dark:text-amber-500">
              <Trans>Exceeds plan</Trans>
            </span>
          ) : null}
        </HStack>
      ) : maxTotal != null && total > maxTotal ? (
        <span className="text-sm text-amber-600 dark:text-amber-500">
          <Trans>Exceeds available</Trans>
          {` (${maxTotal})`}
        </span>
      ) : maxTotal != null ? (
        <span className="text-sm text-muted-foreground">
          <Trans>Available</Trans>
          {`: `}
          <strong className="tabular-nums text-foreground">{maxTotal}</strong>
        </span>
      ) : hasReferences ? (
        exceedsReference ? (
          <span className="text-sm text-amber-600 dark:text-amber-500">
            <Trans>Exceeds available</Trans>
          </span>
        ) : (
          <span />
        )
      ) : (
        <span />
      )}
      <HStack className="gap-2">
        <Button type="button" variant="ghost" onClick={onDismiss}>
          <Trans>Cancel</Trans>
        </Button>
        <Button
          type="button"
          variant="primary"
          isLoading={fetcher ? fetcher.state !== "idle" : false}
          isDisabled={
            (fetcher ? fetcher.state !== "idle" : false) || exceedsMax
          }
          onClick={handleSubmit}
        >
          <Trans>Confirm</Trans>
        </Button>
      </HStack>
    </HStack>
  );

  return (
    <div className={variantsQuantityModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Variants Quantity</Trans>
        </h3>
        {jobDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>
        ) : null}
      </div>
      <div className={variantsQuantityModalBodyClassName}>{tableSection}</div>
      <div className="shrink-0 border-t border-border px-6 py-4">{footer}</div>
    </div>
  );
}

function extractConfigTable(configuration: unknown): Row[] | undefined {
  if (
    !configuration ||
    typeof configuration !== "object" ||
    Array.isArray(configuration)
  ) {
    return undefined;
  }
  const table = (configuration as Record<string, unknown>).configTable;
  return Array.isArray(table) ? (table as Row[]) : undefined;
}

/**
 * Compute editor rows + click-to-fill hints (client-side) from the raw inputs:
 * the fetched `parameters`, the in-memory draft `configuration`, and (when there
 * are reference hints) a fully-built `referenceContext`. Shared by the local
 * modal and the table-cell overlay render.
 */
export function buildConfigEditorRows({
  parameters,
  configuration,
  referenceContext,
  prefillFromReference = false
}: {
  parameters: ConfigurationParameter[];
  configuration?: unknown;
  referenceContext?: ConfigTableReferenceContext;
  prefillFromReference?: boolean;
}): {
  initialRows?: Row[];
  referenceByRowIndex?: Array<Record<string, number>>;
} {
  const configTable = extractConfigTable(configuration);
  if (!referenceContext) return { initialRows: configTable };
  const editor = buildConfigTableEditorState({
    parameters,
    defaultQuantityLabel: "Quantities",
    currentConfiguration:
      configTable !== undefined ? { configTable } : undefined,
    referenceContext,
    prefillFromReference
  });
  if (editor.rows.length > 0) {
    return {
      initialRows: editor.rows,
      referenceByRowIndex: editor.referenceByRowIndex
    };
  }

  // Empty tagged inventory / fungible Style: no original rows, but we still want
  // click-to-fill hints of 0 on the default parameter rows.
  const { primaryParam, columns } = buildColumns(parameters, "Quantities");
  const seed =
    configTable && configTable.length > 0
      ? configTable.map((row) => normalizeRow(row, columns))
      : getInitialRows(parameters, primaryParam, columns);
  const zeroRefs = seed.map(() => {
    const refs: Record<string, number> = {};
    for (const col of columns) {
      if (col.type === "quantity") refs[col.key] = 0;
    }
    return refs;
  });
  return { initialRows: seed, referenceByRowIndex: zeroRefs };
}

/** Endpoint URL carrying only the fetch keys (ids) — never the draft config. */
function configSourceUrl(
  itemId: string,
  keys: {
    jobId?: string;
    jobOperationId?: string;
    reportKind?: "pickup" | "productionQuantity";
  }
): string {
  const base = path.to.api.itemConfigTable(itemId);
  const params = new URLSearchParams();
  if (keys.jobId) params.set("jobId", keys.jobId);
  if (keys.jobOperationId) params.set("jobOperationId", keys.jobOperationId);
  if (keys.reportKind) params.set("reportKind", keys.reportKind);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Local (non-overlay) config-table editor. A parent form owns the open state and
 * gets the edited config via `onConfirm`.
 *
 * Clean fetch/pass split: only fetch keys (`itemId` + `jobId`/`jobOperationId`/
 * `reportKind`) go to the loader, which returns `parameters` + the DB-resolved
 * `referenceSource`. The in-memory draft `configuration` is a prop, and the
 * parent supplies `buildReferenceContext(source)` (it owns the in-memory
 * reference inputs). Editor rows + hints are computed here, client-side.
 */
export function VariantsQuantityLocalModal({
  open,
  onClose,
  onConfirm,
  itemId,
  jobId,
  jobOperationId,
  reportKind,
  configuration,
  buildReferenceContext,
  prefillFromReference = false,
  splitMode = false,
  jobDisplayId,
  isEditingReport,
  maxTotal,
  enforceReferenceCaps = true
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: unknown) => void;
  itemId: string;
  jobId?: string;
  jobOperationId?: string;
  reportKind?: "pickup" | "productionQuantity";
  configuration?: unknown;
  buildReferenceContext?: (
    source: ConfigReferenceSource | null
  ) => ConfigTableReferenceContext | undefined;
  prefillFromReference?: boolean;
  splitMode?: boolean;
  jobDisplayId?: string | null;
  isEditingReport?: boolean;
  maxTotal?: number;
  enforceReferenceCaps?: boolean;
}) {
  const fetcher = useFetcher<ItemConfigTableOverlayLoaderData | null>();
  const load = useRef(fetcher.load);
  load.current = fetcher.load;

  useEffect(() => {
    if (!open || !itemId) return;
    void load.current(
      configSourceUrl(itemId, { jobId, jobOperationId, reportKind })
    );
  }, [open, itemId, jobId, jobOperationId, reportKind]);

  if (!open) return null;

  const data = fetcher.data;
  const isLoading = data === undefined && fetcher.state !== "idle";
  const referenceContext = data
    ? buildReferenceContext?.(data.referenceSource)
    : undefined;
  const { initialRows, referenceByRowIndex } = data?.parameters?.length
    ? buildConfigEditorRows({
        parameters: data.parameters,
        configuration,
        referenceContext,
        prefillFromReference
      })
    : {};

  return (
    <Modal
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <ModalContent className={variantsQuantityModalContentClassName}>
        {data?.parameters?.length ? (
          <VariantsQuantityModal
            parameters={data.parameters}
            initialRows={initialRows}
            referenceByRowIndex={referenceByRowIndex}
            optionLabels={data.attributeValueNames}
            splitMode={splitMode}
            jobDisplayId={jobDisplayId ?? data.itemReadableId}
            isEditingReport={isEditingReport}
            maxTotal={maxTotal}
            enforceReferenceCaps={enforceReferenceCaps}
            confirmMode="client"
            onConfirmSuccess={onConfirm}
            onDismiss={onClose}
          />
        ) : (
          <div className="flex min-h-[200px] items-center justify-center p-6">
            <Loading isLoading={isLoading} />
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

/**
 * Build the editor's `configuration` input from the current table rows, falling
 * back to a saved/initial configuration when nothing has been edited yet.
 */
export function toConfigTableValue(
  rows: Row[] | null | undefined,
  fallback?: unknown
): unknown {
  return rows ? { configTable: rows } : fallback;
}

type VariantsQuantityModalRequest = {
  itemId: string;
  configuration?: unknown;
  jobId?: string;
  jobOperationId?: string;
  reportKind?: "pickup" | "productionQuantity";
  buildReferenceContext?: (
    source: ConfigReferenceSource | null
  ) => ConfigTableReferenceContext | undefined;
  /** Seed empty quantity cells with their remaining reference on first open. */
  prefillFromReference?: boolean;
  /** Flat one-row-per-combo editor that also emits raw `splitRows`. */
  splitMode?: boolean;
  jobDisplayId?: string | null;
  /** Editing an existing report — footer shows the delta, not plan remaining. */
  isEditingReport?: boolean;
  /** Hard cap on the grid total (e.g. selected transfer source on-hand). */
  maxTotal?: number;
  /**
   * When false, show reference hints but do not block Confirm on cell exceed.
   * Defaults to true.
   */
  enforceReferenceCaps?: boolean;
  /** Receives the validated edited config when the user confirms. */
  onConfirm: (result: ConfigTableOverlaySuccess) => void;
};

/**
 * Manage a single local config-table editor. Call `open(request)` to show it;
 * render `node`. Handles open state, the success check, and closing — so callers
 * just describe what to fetch/pass and what to do on confirm.
 */
export function useVariantsQuantityModal(): {
  open: (request: VariantsQuantityModalRequest) => void;
  node: ReactNode;
} {
  const [request, setRequest] = useState<VariantsQuantityModalRequest | null>(
    null
  );
  const open = useCallback(
    (next: VariantsQuantityModalRequest) => setRequest(next),
    []
  );
  const close = useCallback(() => setRequest(null), []);

  const node = request ? (
    <VariantsQuantityLocalModal
      open
      onClose={close}
      onConfirm={(data) => {
        if (isConfigTableOverlaySuccess(data)) request.onConfirm(data);
        close();
      }}
      itemId={request.itemId}
      jobId={request.jobId}
      jobOperationId={request.jobOperationId}
      reportKind={request.reportKind}
      configuration={request.configuration}
      buildReferenceContext={request.buildReferenceContext}
      prefillFromReference={request.prefillFromReference}
      splitMode={request.splitMode}
      jobDisplayId={request.jobDisplayId}
      isEditingReport={request.isEditingReport}
      maxTotal={request.maxTotal}
      enforceReferenceCaps={request.enforceReferenceCaps}
    />
  ) : null;

  return { open, node };
}

export { VariantsQuantityModal };
export default VariantsQuantityModal;
