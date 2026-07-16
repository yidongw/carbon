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
  colorAxis: string[];
  sizeAxis: string[];
  cells: CuttingSplitCell[];
  existingBundles: ExistingBundle[];
  splitRows: MasterSplitRow[];
  masterDisplayId?: string | null;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

type Row = {
  id: string | null;
  splitRowId: string | null;
  jobReadableId: string | null;
  colorCode: string | null;
  colorName: string | null;
  sizeCode: string | null;
  quantity: number;
  reportedQuantity: number;
};

const cellKey = (color: string | null, size: string | null) =>
  `${color ?? ""}|${size ?? ""}`;
const num = (v: unknown) => Number(v) || 0;

/**
 * Split a Master Work Order's cut into Bundle Work Orders. Each row is a bundle
 * (existing bundles are editable; their reported quantity is shown and caps how
 * far down they can go). Add a bundle from the per-color/size buttons — one per
 * color/size that still has un-bundled cut remaining; none show when nothing is
 * left. Confirm creates the new bundles and updates the edited ones.
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
  const { t } = useLingui();

  const cutByCell = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cells) m.set(cellKey(c.colorCode, c.sizeCode), c.cut);
    return m;
  }, [cells]);
  const totalCut = useMemo(() => cells.reduce((s, c) => s + c.cut, 0), [cells]);

  const [rows, setRows] = useState<Row[]>(() => {
    const existingRows: Row[] = existingBundles.map((b) => ({
      id: b.id,
      splitRowId: null,
      jobReadableId: b.jobReadableId,
      colorCode: b.colorCode,
      colorName: b.colorName,
      sizeCode: b.sizeCode,
      quantity: b.quantity,
      reportedQuantity: b.reportedQuantity
    }));

    // Prefer the captured cut rows: one bundle per pending split row (carries its
    // id so saving materializes it).
    if (splitRows.length > 0) {
      const prefillRows: Row[] = splitRows.map((sr) => ({
        id: null,
        splitRowId: sr.id,
        jobReadableId: null,
        colorCode: sr.colorCode,
        colorName: sr.colorName,
        sizeCode: sr.sizeCode,
        quantity: sr.quantity,
        reportedQuantity: 0
      }));
      return [...existingRows, ...prefillRows];
    }

    // Fallback (cuts with no captured rows): prefill the un-bundled cut per cell.
    const bundled = new Map<string, number>();
    for (const b of existingBundles) {
      const k = cellKey(b.colorCode, b.sizeCode);
      bundled.set(k, (bundled.get(k) ?? 0) + b.quantity);
    }
    const prefillRows: Row[] = cells
      .map((c) => ({
        c,
        remaining: c.cut - (bundled.get(cellKey(c.colorCode, c.sizeCode)) ?? 0)
      }))
      .filter((x) => x.remaining > 0)
      .map(({ c, remaining }) => ({
        id: null,
        splitRowId: null,
        jobReadableId: null,
        colorCode: c.colorCode,
        colorName: c.colorName,
        sizeCode: c.sizeCode,
        quantity: remaining,
        reportedQuantity: 0
      }));
    return [...existingRows, ...prefillRows];
  });

  const enteredByCell = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const k = cellKey(r.colorCode, r.sizeCode);
      m.set(k, (m.get(k) ?? 0) + num(r.quantity));
    }
    return m;
  }, [rows]);

  const remainingFor = (c: CuttingSplitCell) =>
    c.cut - (enteredByCell.get(cellKey(c.colorCode, c.sizeCode)) ?? 0);
  const addableCells = cells.filter((c) => remainingFor(c) > 0);

  const total = rows.reduce((s, r) => s + num(r.quantity), 0);
  const remaining = totalCut - total;

  const cellOver = (color: string | null, size: string | null) =>
    (enteredByCell.get(cellKey(color, size)) ?? 0) > (cutByCell.get(cellKey(color, size)) ?? 0);
  const rowBelowReported = (r: Row) => !!r.id && num(r.quantity) < r.reportedQuantity;

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
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, quantity: value } : r)));
  const deleteRow = (i: number) =>
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  const addRow = (c: CuttingSplitCell) =>
    setRows((prev) => [
      ...prev,
      {
        id: null,
        splitRowId: null,
        jobReadableId: null,
        colorCode: c.colorCode,
        colorName: c.colorName,
        sizeCode: c.sizeCode,
        quantity: remainingFor(c),
        reportedQuantity: 0
      }
    ]);

  const handleConfirm = () => {
    if (!action || !canConfirm) return;
    const bundles = rows.map((r) => ({
      id: r.id ?? undefined,
      splitRowId: r.splitRowId ?? undefined,
      colorCode: r.colorCode,
      sizeCode: r.sizeCode,
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
          <p className="mt-1 text-sm text-muted-foreground">{masterDisplayId}</p>
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
                      <Trans>Size</Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <Trans>Color</Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <Trans>Quantity</Trans>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const over = cellOver(r.colorCode, r.sizeCode);
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
                        <td className="px-1 font-medium">{r.sizeCode ?? "—"}</td>
                        <td className="px-1 font-medium">
                          {r.colorName ?? r.colorCode ?? "—"}
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
                    key={cellKey(c.colorCode, c.sizeCode)}
                    type="button"
                    variant="secondary"
                    size="sm"
                    leftIcon={<LuPlus />}
                    onClick={() => addRow(c)}
                  >
                    {c.sizeCode ?? "—"} · {c.colorName ?? c.colorCode ?? "—"} ·{" "}
                    <span className="tabular-nums">{remainingFor(c)}</span>
                  </Button>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border px-6 py-4">
        <HStack className="justify-between">
          <HStack spacing={2}>
            <span className="text-sm text-muted-foreground">
              <Trans>Remaining</Trans>:{" "}
              <strong
                className={cn(
                  "tabular-nums",
                  remaining < 0 ? "text-red-500" : "text-foreground"
                )}
              >
                {remaining}
              </strong>
            </span>
            {hasOver ? (
              <Badge variant="red">
                <Trans>Exceeds cut</Trans>
              </Badge>
            ) : null}
            {hasBelowReported ? (
              <Badge variant="red">
                <Trans>Below reported</Trans>
              </Badge>
            ) : null}
          </HStack>
          <HStack className="gap-2">
            <Button type="button" variant="ghost" onClick={onDismiss}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              variant="primary"
              isDisabled={!canConfirm}
              isLoading={isSubmitting}
              onClick={handleConfirm}
            >
              <Trans>Save</Trans>
            </Button>
          </HStack>
        </HStack>
      </div>
    </div>
  );
}
