/**
 * Pure helpers for Style-scoped UHF piece inventory count (扫码盘点).
 * Unique EPC/code → +1 piece → variant SKU tally; foreign pieces stay out of commit.
 */

import { normalizeScannedExternalCodes } from "./careLabelBind";

export type ScanCountPieceInput = {
  scannedCode: string;
  variantItemId: string;
  parentItemId: string | null;
  attributeLabel?: string | null;
};

export type ScanCountTallyRow = {
  variantItemId: string;
  counted: number;
  attributeLabel: string | null;
};

export type ScanCountTallyResult = {
  /** Unique in-scope codes that contributed to the tally. */
  inScopeCodes: string[];
  /** Resolved pieces whose Style parent is not the page item. */
  foreignCodes: string[];
  /** Codes that never resolved to a garmentRfidCode / bundle. */
  unknownCodes: string[];
  rows: ScanCountTallyRow[];
  countedByVariantId: Record<string, number>;
};

/**
 * Build a per-SKU piece tally for one Style parent. Each unique scanned code
 * counts as one piece when it belongs to that Style family.
 */
export function tallyStyleScanCount(args: {
  rawCodes: string[];
  /** Already-resolved pieces keyed by the scanned string (system or EPC). */
  resolvedByCode: Record<string, ScanCountPieceInput | undefined>;
  styleParentItemId: string;
  unknownCodes?: string[];
}): ScanCountTallyResult {
  const unique = normalizeScannedExternalCodes(args.rawCodes);
  const unknownSet = new Set(args.unknownCodes ?? []);
  const inScopeCodes: string[] = [];
  const foreignCodes: string[] = [];
  const unknownCodes: string[] = [];
  const countMap = new Map<
    string,
    { counted: number; attributeLabel: string | null }
  >();

  for (const code of unique) {
    if (unknownSet.has(code)) {
      unknownCodes.push(code);
      continue;
    }
    const piece = args.resolvedByCode[code];
    if (!piece) {
      unknownCodes.push(code);
      continue;
    }
    if (piece.parentItemId !== args.styleParentItemId) {
      foreignCodes.push(code);
      continue;
    }
    inScopeCodes.push(code);
    const prev = countMap.get(piece.variantItemId);
    if (prev) {
      prev.counted += 1;
    } else {
      countMap.set(piece.variantItemId, {
        counted: 1,
        attributeLabel: piece.attributeLabel ?? null
      });
    }
  }

  const rows: ScanCountTallyRow[] = [...countMap.entries()].map(
    ([variantItemId, v]) => ({
      variantItemId,
      counted: v.counted,
      attributeLabel: v.attributeLabel
    })
  );
  rows.sort((a, b) => a.variantItemId.localeCompare(b.variantItemId));

  const countedByVariantId: Record<string, number> = {};
  for (const row of rows) {
    countedByVariantId[row.variantItemId] = row.counted;
  }

  return {
    inScopeCodes,
    foreignCodes,
    unknownCodes,
    rows,
    countedByVariantId
  };
}

/**
 * Commit targets for a whole-bin Style count: every family SKU that was scanned
 * or already has on-hand in the bin. Unscanned → quantity 0.
 */
export function buildStyleScanCountCommitLines(args: {
  styleVariantItemIds: string[];
  countedByVariantId: Record<string, number>;
  onHandByVariantId: Record<string, number>;
}): { variantItemId: string; counted: number; onHand: number }[] {
  const ids = new Set<string>([
    ...args.styleVariantItemIds,
    ...Object.keys(args.countedByVariantId),
    ...Object.keys(args.onHandByVariantId)
  ]);
  const lines: { variantItemId: string; counted: number; onHand: number }[] =
    [];
  for (const variantItemId of ids) {
    if (
      args.styleVariantItemIds.length > 0 &&
      !args.styleVariantItemIds.includes(variantItemId)
    ) {
      continue;
    }
    const counted = args.countedByVariantId[variantItemId] ?? 0;
    const onHand = args.onHandByVariantId[variantItemId] ?? 0;
    if (counted === 0 && onHand === 0) continue;
    lines.push({ variantItemId, counted, onHand });
  }
  lines.sort((a, b) => a.variantItemId.localeCompare(b.variantItemId));
  return lines;
}

/**
 * Stock-transfer Style pick: count unique scans that match one line SKU.
 * Confirm is allowed only when matchingCount === plannedQuantity.
 */
export function tallyLineGarmentPickScans(args: {
  rawCodes: string[];
  resolvedByCode: Record<string, { variantItemId: string } | undefined>;
  unknownCodes?: string[];
  lineItemId: string;
  plannedQuantity: number;
}): {
  matchingCodes: string[];
  wrongSkuCodes: string[];
  unknownCodes: string[];
  matchingCount: number;
  canConfirm: boolean;
} {
  const unique = normalizeScannedExternalCodes(args.rawCodes);
  const unknownSet = new Set(args.unknownCodes ?? []);
  const matchingCodes: string[] = [];
  const wrongSkuCodes: string[] = [];
  const unknownCodes: string[] = [];

  for (const code of unique) {
    if (unknownSet.has(code)) {
      unknownCodes.push(code);
      continue;
    }
    const piece = args.resolvedByCode[code];
    if (!piece) {
      unknownCodes.push(code);
      continue;
    }
    if (piece.variantItemId !== args.lineItemId) {
      wrongSkuCodes.push(code);
      continue;
    }
    matchingCodes.push(code);
  }

  const matchingCount = matchingCodes.length;
  return {
    matchingCodes,
    wrongSkuCodes,
    unknownCodes,
    matchingCount,
    canConfirm:
      args.plannedQuantity > 0 && matchingCount === args.plannedQuantity
  };
}
