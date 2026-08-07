import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import { Badge, Button, cn, HStack, IconButton } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import type {
  CuttingSplitCell,
  ExistingBundle,
  MasterSplitRow
} from "~/modules/production";
import {
  configParamsModalBodyClassName,
  configParamsModalShellClassName
} from "../Jobs/configTableShared";

export type SplitBatchOverlayProps = {
  cells: CuttingSplitCell[];
  existingBundles: ExistingBundle[];
  splitRows: MasterSplitRow[];
  masterDisplayId?: string | null;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

type Row = {
  id: string | null;
  splitRowId: string | null;
  jobReadableId: string | null;
  valuesKey: string;
  attributeLabel: string;
  quantity: number;
  reportedQuantity: number;
};

const cellKey = (valuesKey: string | null | undefined) =>
  (valuesKey ?? "").trim();
const num = (v: unknown) => Number(v) || 0;

/**
 * Split a Master Work Order's cut into Bundle Work Orders. Each row is a bundle
 * (existing bundles are editable; their reported quantity is shown and caps how
 * far down they can go). Add a bundle from the remaining attribute-combo
 * buttons. Confirm creates the new bundles and updates the edited ones.
 */
export default function SplitBatchOverlay({
  cells,
  existingBundles,
  splitRows,
  masterDisplayId,
  onDismiss,
  fetcher,
  action
}: SplitBatchOverlayProps) {
  const { t, i18n } = useLingui();

  const cutByCell = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cells) m.set(cellKey(c.valuesKey), c.cut);
    return m;
  }, [cells]);
  const totalCut = useMemo(() => cells.reduce((s, c) => s + c.cut, 0), [cells]);

  const [rows, setRows] = useState<Row[]>(() => {
    const existingRows: Row[] = existingBundles.map((b) => ({
      id: b.id,
      splitRowId: null,
      jobReadableId: b.jobReadableId,
      valuesKey: b.valuesKey ?? "",
      attributeLabel: b.attributeLabel ?? b.valuesKey ?? "—",
      quantity: b.quantity,
      reportedQuantity: b.reportedQuantity
    }));

    if (splitRows.length > 0) {
      const prefillRows: Row[] = splitRows.map((sr) => ({
        id: null,
        splitRowId: sr.id,
        jobReadableId: null,
        valuesKey: sr.valuesKey,
        attributeLabel: sr.attributeLabel,
        quantity: sr.quantity,
        reportedQuantity: 0
      }));
      return [...existingRows, ...prefillRows];
    }

    const bundled = new Map<string, number>();
    for (const b of existingBundles) {
      const k = cellKey(b.valuesKey);
      bundled.set(k, (bundled.get(k) ?? 0) + b.quantity);
    }
    const prefillRows: Row[] = cells
      .map((c) => ({
        id: null,
        splitRowId: null,
        jobReadableId: null,
        valuesKey: c.valuesKey,
        attributeLabel: c.attributeLabel,
        quantity: Math.max(0, c.cut - (bundled.get(cellKey(c.valuesKey)) ?? 0)),
        reportedQuantity: 0
      }))
      .filter((r) => r.quantity > 0);
    return [...existingRows, ...prefillRows];
  });

  const enteredByCell = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const k = cellKey(r.valuesKey);
      m.set(k, (m.get(k) ?? 0) + num(r.quantity));
    }
    return m;
  }, [rows]);

  const remainingFor = (c: CuttingSplitCell) =>
    c.cut - (enteredByCell.get(cellKey(c.valuesKey)) ?? 0);
  const addableCells = cells.filter((c) => remainingFor(c) > 0);

  const total = rows.reduce((s, r) => s + num(r.quantity), 0);
  const remaining = totalCut - total;

  const cellOver = (valuesKey: string) =>
    (enteredByCell.get(cellKey(valuesKey)) ?? 0) >
    (cutByCell.get(cellKey(valuesKey)) ?? 0);
  const rowBelowReported = (r: Row) =>
    !!r.id && num(r.quantity) < r.reportedQuantity;

  const hasOver = useMemo(() => {
    for (const [k, entered] of enteredByCell) {
      if (entered > (cutByCell.get(k) ?? 0)) return true;
    }
    return false;
  }, [enteredByCell, cutByCell]);
  const hasBelowReported = rows.some(rowBelowReported);
  const isSubmitting = fetcher.state !== "idle";
  const canConfirm =
    rows.length > 0 && !hasOver && !hasBelowReported && !isSubmitting;

  const updateQuantity = (i: number, value: number) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, quantity: value } : r))
    );
  const deleteRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  const addRow = (c: CuttingSplitCell) =>
    setRows((prev) => [
      ...prev,
      {
        id: null,
        splitRowId: null,
        jobReadableId: null,
        valuesKey: c.valuesKey,
        attributeLabel: c.attributeLabel,
        quantity: remainingFor(c),
        reportedQuantity: 0
      }
    ]);

  const handleConfirm = () => {
    if (!action || !canConfirm) return;
    const bundles = rows.map((r) => ({
      id: r.id ?? undefined,
      splitRowId: r.splitRowId ?? undefined,
      valuesKey: r.valuesKey,
      quantity: num(r.quantity)
    }));
    const formData = new FormData();
    formData.append("bundles", JSON.stringify(bundles));
    fetcher.submit(formData, { method: "post", action });
  };

  const inputClass =
    "h-8 w-24 rounded-md border bg-transparent px-2 text-sm tabular-nums focus:outline-none focus:ring-1";

  return (
    <div className={configParamsModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <Trans>Split Batch</Trans>
        </h3>
        {masterDisplayId ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {masterDisplayId}
          </p>
        ) : null}
      </div>

      <div className={configParamsModalBodyClassName}>
        {rows.length === 0 && addableCells.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            <Trans>Nothing left to split for this work order.</Trans>
          </p>
        ) : (
          <>
            {rows.length > 0 ? (
              <table className="w-full border-separate border-spacing-x-3 border-spacing-y-1 text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-1 py-1 text-left font-medium">
                      <Trans>Bundle</Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <Trans>Attributes</Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <Trans>Quantity</Trans>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const over = cellOver(r.valuesKey);
                    const below = rowBelowReported(r);
                    return (
                      <tr key={r.id ?? `new-${i}`}>
                        <td className="px-1 tabular-nums text-muted-foreground">
                          {r.jobReadableId ?? (
                            <span className="italic">
                              <Trans>New</Trans>
                            </span>
                          )}
                        </td>
                        <td className="px-1 font-medium">
                          {localizeVariantAttributeLabel(
                            r.attributeLabel,
                            i18n.locale
                          ) || "—"}
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            value={num(r.quantity)}
                            onFocus={(e) => e.currentTarget.select()}
                            onChange={(e) =>
                              updateQuantity(i, Number(e.target.value) || 0)
                            }
                            className={cn(
                              inputClass,
                              over || below
                                ? "border-red-500 focus:ring-red-500 bg-red-50/40 dark:bg-red-950/30"
                                : "border-sky-300 dark:border-sky-700 focus:ring-ring"
                            )}
                          />
                        </td>
                        <td>
                          {r.id ? null : (
                            <IconButton
                              type="button"
                              icon={<LuTrash2 />}
                              aria-label={t`Delete row`}
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRow(i)}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : null}

            {addableCells.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {addableCells.map((c) => (
                  <Button
                    key={cellKey(c.valuesKey)}
                    type="button"
                    size="sm"
                    variant="secondary"
                    leftIcon={<LuPlus />}
                    onClick={() => addRow(c)}
                  >
                    {localizeVariantAttributeLabel(
                      c.attributeLabel,
                      i18n.locale
                    )}{" "}
                    · {remainingFor(c)}
                  </Button>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border px-6 py-4">
        <HStack className="justify-between">
          <div className="text-sm text-muted-foreground">
            <Trans>Total</Trans> {total}
            {remaining !== 0 ? (
              <Badge
                variant="secondary"
                className="ml-2 font-normal tabular-nums"
              >
                {remaining > 0 ? (
                  <Trans>{remaining} left</Trans>
                ) : (
                  <Trans>{Math.abs(remaining)} over</Trans>
                )}
              </Badge>
            ) : null}
          </div>
          <HStack>
            <Button variant="secondary" onClick={onDismiss}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              isDisabled={!canConfirm}
              isLoading={isSubmitting}
              onClick={handleConfirm}
            >
              <Trans>Confirm</Trans>
            </Button>
          </HStack>
        </HStack>
      </div>
    </div>
  );
}
