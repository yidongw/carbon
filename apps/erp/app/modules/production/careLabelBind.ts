/**
 * Pure helpers for bulk UHF PDA chip → system RFID code binding.
 * A successful bind requires the unique EPC count to equal the target piece count.
 */

export type CareLabelBindValidation =
  | { ok: true; externalCodes: string[] }
  | {
      ok: false;
      reason: "empty" | "tooFew" | "tooMany" | "noSystemCodes";
      uniqueCount: number;
      expectedCount: number;
    };

/** Normalize PDA keyboard-wedge input into unique trimmed EPC strings (order kept). */
export function normalizeScannedExternalCodes(raw: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const code = item.trim();
    if (!code) continue;
    if (seen.has(code)) continue;
    seen.add(code);
    out.push(code);
  }
  return out;
}

/**
 * Validate a bulk chip read against how many unbound system rows we need to fill.
 * `rawExternalCodes` may include duplicates from the PDA re-reading the same tag.
 */
export function validateCareLabelBulkBind(args: {
  rawExternalCodes: string[];
  expectedCount: number;
}): CareLabelBindValidation {
  if (args.expectedCount <= 0) {
    return {
      ok: false,
      reason: "noSystemCodes",
      uniqueCount: 0,
      expectedCount: args.expectedCount
    };
  }

  const unique = normalizeScannedExternalCodes(args.rawExternalCodes);

  if (unique.length === 0) {
    return {
      ok: false,
      reason: "empty",
      uniqueCount: 0,
      expectedCount: args.expectedCount
    };
  }

  if (unique.length < args.expectedCount) {
    return {
      ok: false,
      reason: "tooFew",
      uniqueCount: unique.length,
      expectedCount: args.expectedCount
    };
  }

  if (unique.length > args.expectedCount) {
    return {
      ok: false,
      reason: "tooMany",
      uniqueCount: unique.length,
      expectedCount: args.expectedCount
    };
  }

  return { ok: true, externalCodes: unique };
}
