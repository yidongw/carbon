import { describe, expect, it } from "vitest";
import {
  computeVariantTableRemaining,
  computeVariantTableTotal,
  minVariantTables
} from "./variantTable";

type Row = { variantItemId: string; Quantities: number };
const table = (rows: Row[]) => ({ variantTable: rows });
const qty = (variantItemId: string, Quantities: number) => ({
  variantItemId,
  Quantities
});

describe("minVariantTables", () => {
  it("returns an empty table for no inputs", () => {
    expect(minVariantTables([])).toEqual({ variantTable: [] });
  });

  it("is the identity for a single table", () => {
    const t = table([qty("A", 5), qty("B", 2)]);
    expect(minVariantTables([t]).variantTable).toEqual([
      qty("A", 5),
      qty("B", 2)
    ]);
  });

  it("takes the per-variant minimum across tables", () => {
    const result = minVariantTables([
      table([qty("A", 5), qty("B", 3)]),
      table([qty("A", 2), qty("B", 9)])
    ]);
    expect(result.variantTable).toEqual([qty("A", 2), qty("B", 3)]);
  });

  it("treats a variant absent from any table as 0 (must be released everywhere)", () => {
    // A released by both; B only by the first — B is not available yet.
    const result = minVariantTables([
      table([qty("A", 5), qty("B", 4)]),
      table([qty("A", 5)])
    ]);
    expect(result.variantTable).toEqual([qty("A", 5), qty("B", 0)]);
  });

  it("sums duplicate descriptors within a table before comparing", () => {
    const result = minVariantTables([
      table([qty("A", 2), qty("A", 3)]), // = 5
      table([qty("A", 4)])
    ]);
    expect(result.variantTable).toEqual([qty("A", 4)]);
  });
});

// Reproduces the exact per-variant computation getMasterCuttingProgress runs:
//   capped_v   = min(plan_v, min over upstream ops of released_v)
//   available  = sum_v max(0, capped_v - cut_v)
function availableToCut(
  plan: { variantTable: Row[] },
  upstreamReleasedByOp: { variantTable: Row[] }[],
  cuttingReported: { variantTable: Row[] }[]
): number {
  const capped = minVariantTables([plan, ...upstreamReleasedByOp]);
  return computeVariantTableTotal(
    computeVariantTableRemaining(capped, cuttingReported)
  );
}

describe("per-variant cutting availability", () => {
  const plan = table([qty("A", 5), qty("B", 5)]);

  it("no pre-cut process → whole remaining plan is available", () => {
    // No upstream ops, nothing cut yet.
    expect(availableToCut(plan, [], [])).toBe(10);
    // Net of what is already cut.
    expect(availableToCut(plan, [], [table([qty("A", 2)])])).toBe(8);
  });

  it("gates per variant: an unreleased variant is not available even if others are", () => {
    // Upstream released all of A but none of B → only A's 5 are cuttable.
    const upstream = table([qty("A", 5)]);
    expect(availableToCut(plan, [upstream], [])).toBe(5);
  });

  it("subtracts what is already cut per variant", () => {
    const upstream = table([qty("A", 5), qty("B", 5)]);
    // Cut 3 of A already → 2 of A + 5 of B remain available.
    expect(availableToCut(plan, [upstream], [table([qty("A", 3)])])).toBe(7);
  });

  it("nothing released yet → nothing available (Waiting), though plan remains", () => {
    const upstream = table([]);
    expect(availableToCut(plan, [upstream], [])).toBe(0);
  });

  it("caps availability at the plan when upstream over-releases", () => {
    const upstream = table([qty("A", 99), qty("B", 99)]);
    expect(availableToCut(plan, [upstream], [])).toBe(10);
  });

  it("multiple upstream ops gate by the least-reported per variant", () => {
    // Op1 released A:5 B:2, Op2 released A:3 B:5 → min A:3 B:2 = 5 available.
    const op1 = table([qty("A", 5), qty("B", 2)]);
    const op2 = table([qty("A", 3), qty("B", 5)]);
    expect(availableToCut(plan, [op1, op2], [])).toBe(5);
  });
});
