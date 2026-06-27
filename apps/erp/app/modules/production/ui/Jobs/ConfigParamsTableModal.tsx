import {
  Button,
  HStack,
  Loading,
  Modal,
  ModalContent
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useFetcher } from "react-router";
import { Enumerable } from "~/components/Enumerable";
import { useShape } from "~/components/Form/Shape";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type { ConfigurationParameter } from "~/modules/items/types";
import {
  buildConfigTableEditorState,
  type ConfigReferenceSource,
  type ConfigTableReferenceContext
} from "~/modules/production/configParamsTableColumns";
import {
  buildConfigTableActionResponse,
  type ConfigTableOverlaySuccess,
  isConfigTableOverlaySuccess
} from "~/modules/production/configTableOverlay";
import type { ItemConfigTableOverlayLoaderData } from "~/routes/api+/items.$itemId.config-table";
import { path } from "~/utils/path";
import {
  buildColumns,
  configParamsModalBodyClassName,
  configParamsModalContentClassName,
  configParamsModalShellClassName,
  computeTotal,
  EditableConfigGrid,
  getCellKey,
  getInitialRows,
  hasValue,
  makeDefaultRow,
  mergeRows,
  normalizeRow,
  type Row,
  validateCell
} from "./configTableShared";

export type ConfigParamsTableModalProps = {
  parameters: ConfigurationParameter[];
  initialRows?: Row[];
  referenceByRowIndex?: Array<Record<string, number>>;
  jobDisplayId?: string | null;
} & Omit<OverlayFormInjectedProps, "fetcher" | "action" | "confirmMode"> & {
    // Optional so the same content can render as a plain local modal (client
    // confirm) without the overlay's submit fetcher.
    fetcher?: OverlayFormInjectedProps["fetcher"];
    action?: string;
    // Overlays inject "server" | "none"; the standalone local-modal path adds
    // "client" (confirm via callback), which is intentionally not an overlay mode.
    confirmMode: OverlayFormInjectedProps["confirmMode"] | "client";
  };

function ConfigParamsTableModal({
  parameters,
  initialRows,
  referenceByRowIndex,
  jobDisplayId,
  onDismiss,
  action: formAction,
  fetcher,
  confirmMode,
  onConfirmSuccess
}: ConfigParamsTableModalProps) {
  const { t } = useLingui();
  // `"none"` is a read-only view: cells are disabled and the only button closes.
  const readOnly = confirmMode === "none";
  const materialShapeOptions = useShape();
  const materialOptions = materialShapeOptions.map((shape) => ({
    label: <Enumerable value={shape.label} />,
    value: shape.value
  }));
  const { primaryParam, primaryKeys, columns } = buildColumns(
    parameters,
    t`Quantities`
  );

  const [rows, setRows] = useState<Row[]>(() => {
    if (initialRows && initialRows.length > 0) {
      return initialRows.map((row) => normalizeRow(row, columns));
    }
    return getInitialRows(parameters, primaryParam, columns);
  });
  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [validationError, setValidationError] = useState("");

  const hasReferences = (referenceByRowIndex?.length ?? 0) > 0;
  const total = computeTotal(rows, primaryKeys);

  const addRow = () => setRows((prev) => [...prev, makeDefaultRow(columns)]);

  const deleteRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

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

  const handleSubmit = () => {
    const normalizedRows = rows.map((row) => normalizeRow(row, columns));
    const populatedRows = normalizedRows
      .map((row, rowIndex) => ({ row, rowIndex }))
      .filter(({ row }) => hasValue(row, columns));
    const nextInvalidCells = new Set<string>();

    for (const { row, rowIndex } of populatedRows) {
      for (const column of columns) {
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
    const mergedRows = mergeRows(rowsToSave, columns);

    const configuration = {
      configTable: mergedRows,
      configTablePrimaryKeys: primaryKeys
    };

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
        columns={columns}
        rows={rows}
        invalidCells={invalidCells}
        referenceByRowIndex={referenceByRowIndex}
        hasReferences={hasReferences}
        allowNegative={false}
        mode="delta"
        baselineFor={() => 0}
        materialOptions={materialOptions}
        updateCell={updateCell}
        deleteRow={deleteRow}
        readOnly={readOnly}
      />
      {validationError && (
        <div className="text-sm text-destructive">{validationError}</div>
      )}
      <HStack className="mt-4 justify-between">
        {!readOnly ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addRow}
            leftIcon={<LuPlus />}
          >
            <Trans>Add Row</Trans>
          </Button>
        ) : (
          <span />
        )}
        <span className="text-sm text-muted-foreground">
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
    <HStack className="justify-end gap-2">
      <Button type="button" variant="ghost" onClick={onDismiss}>
        <Trans>Cancel</Trans>
      </Button>
      <Button
        type="button"
        variant="primary"
        isLoading={fetcher ? fetcher.state !== "idle" : false}
        isDisabled={fetcher ? fetcher.state !== "idle" : false}
        onClick={handleSubmit}
      >
        <Trans>Confirm</Trans>
      </Button>
    </HStack>
  );

  return (
      <div className={configParamsModalShellClassName}>
        <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
          <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
            <Trans>Configuration Parameters</Trans>
          </h3>
          {jobDisplayId ? (
            <p className="mt-1 text-sm text-muted-foreground">{jobDisplayId}</p>
          ) : null}
        </div>
        <div className={configParamsModalBodyClassName}>
          {tableSection}
        </div>
        <div className="shrink-0 border-t border-border px-6 py-4">
          {footer}
        </div>
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
  referenceContext
}: {
  parameters: ConfigurationParameter[];
  configuration?: unknown;
  referenceContext?: ConfigTableReferenceContext;
}): { initialRows?: Row[]; referenceByRowIndex?: Array<Record<string, number>> } {
  const configTable = extractConfigTable(configuration);
  if (!referenceContext) return { initialRows: configTable };
  const editor = buildConfigTableEditorState({
    parameters,
    defaultQuantityLabel: "Quantities",
    currentConfiguration:
      configTable !== undefined ? { configTable } : undefined,
    referenceContext
  });
  return {
    initialRows: editor.rows,
    referenceByRowIndex: editor.referenceByRowIndex
  };
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
export function ConfigParamsTableLocalModal({
  open,
  onClose,
  onConfirm,
  itemId,
  jobId,
  jobOperationId,
  reportKind,
  configuration,
  buildReferenceContext,
  jobDisplayId
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
  jobDisplayId?: string | null;
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
        referenceContext
      })
    : {};

  return (
    <Modal
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <ModalContent className={configParamsModalContentClassName}>
        {data?.parameters?.length ? (
          <ConfigParamsTableModal
            parameters={data.parameters}
            initialRows={initialRows}
            referenceByRowIndex={referenceByRowIndex}
            jobDisplayId={jobDisplayId ?? data.itemReadableId}
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
  primaryKeys: string[],
  fallback?: unknown
): unknown {
  return rows && primaryKeys.length > 0
    ? { configTable: rows, configTablePrimaryKeys: primaryKeys }
    : fallback;
}

type ConfigTableModalRequest = {
  itemId: string;
  configuration?: unknown;
  jobId?: string;
  jobOperationId?: string;
  reportKind?: "pickup" | "productionQuantity";
  buildReferenceContext?: (
    source: ConfigReferenceSource | null
  ) => ConfigTableReferenceContext | undefined;
  jobDisplayId?: string | null;
  /** Receives the validated edited config when the user confirms. */
  onConfirm: (result: ConfigTableOverlaySuccess) => void;
};

/**
 * Manage a single local config-table editor. Call `open(request)` to show it;
 * render `node`. Handles open state, the success check, and closing — so callers
 * just describe what to fetch/pass and what to do on confirm.
 */
export function useConfigTableModal(): {
  open: (request: ConfigTableModalRequest) => void;
  node: ReactNode;
} {
  const [request, setRequest] = useState<ConfigTableModalRequest | null>(null);
  const open = useCallback(
    (next: ConfigTableModalRequest) => setRequest(next),
    []
  );
  const close = useCallback(() => setRequest(null), []);

  const node = request ? (
    <ConfigParamsTableLocalModal
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
      jobDisplayId={request.jobDisplayId}
    />
  ) : null;

  return { open, node };
}

export { ConfigParamsTableModal };
export default ConfigParamsTableModal;
