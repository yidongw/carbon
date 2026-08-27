// Pure (no server imports) so both the server loader/service and the client
// table can share it — keeps the badge and the `cuttingStatus` filter in sync.

/**
 * The cutting-status values shown as the "Cutting" badge and used as the
 * derived (non-DB) `cuttingStatus` filter values. Stable keys — the UI
 * translates the labels.
 */
export const cuttingStatuses = ["Ready", "Waiting", "Cut"] as const;
export type CuttingStatus = (typeof cuttingStatuses)[number];

/**
 * Derive a master work order's cutting status from its cutting progress + plan
 * quantity. Returns null when there's nothing to show (no plan / no progress).
 *   Cut     — nothing left to cut (remaining 0)
 *   Ready   — pieces released by the pre-cut process are cuttable now
 *   Waiting — remaining to cut, but nothing released yet (blocked upstream)
 */
export function deriveCuttingStatus(
  progress: { remaining: number; availableToCut: number } | undefined,
  plan: number
): CuttingStatus | null {
  if (!progress || plan <= 0) return null;
  if (progress.remaining <= 0) return "Cut";
  if (progress.availableToCut > 0) return "Ready";
  return "Waiting";
}
